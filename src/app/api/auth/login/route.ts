import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyPassword } from '@/lib/auth/password';
import { verifyToken, decryptSecret } from '@/lib/auth/totp';
import { createSession, setSessionCookie } from '@/lib/session';
import { query } from '@/lib/db';
import { checkRateLimit, getClientIdentifier, RateLimits } from '@/lib/middleware/rate-limit';
import { logActivity } from '@/lib/logger';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    totpCode: z.string().optional(),
    backupCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`login:${clientId}`, RateLimits.LOGIN);

    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: 'Too many login attempts. Please try again later.' },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { email, password, totpCode, backupCode } = validation.data;

        // Get admin from database
        const admins = await query<any[]>(
            'SELECT * FROM admins WHERE email = ?',
            [email]
        );

        if (admins.length === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const admin = admins[0];

        // Verify password
        const passwordValid = await verifyPassword(password, admin.password_hash);

        if (!passwordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if 2FA is enabled
        if (admin.is_2fa_enabled) {
            // Require TOTP code or backup code
            if (!totpCode && !backupCode) {
                return NextResponse.json(
                    { error: '2FA code required', requires2FA: true },
                    { status: 403 }
                );
            }

            let twoFAValid = false;

            // Try TOTP code first
            // Try TOTP code first
            if (totpCode) {
                try {
                    // 1. Try new encrypted system
                    if (admin.totp_secret_encrypted) {
                        twoFAValid = verifyToken(admin.totp_secret_encrypted, totpCode);
                    }

                    // 2. Fallback to old plain system if not valid yet and plain secret exists
                    if (!twoFAValid && admin.totp_secret) {
                        const speakeasy = (await import('speakeasy')).default;
                        twoFAValid = speakeasy.totp.verify({
                            secret: admin.totp_secret,
                            encoding: 'base32',
                            token: totpCode,
                            window: 1
                        });
                        if (twoFAValid) {
                            console.warn('Using plain TOTP secret - migration needed for admin:', admin.id);
                        }
                    }
                } catch (error) {
                    console.error('TOTP verification error:', error);
                }
            }

            // Try backup code if TOTP failed
            if (!twoFAValid && backupCode) {
                const backupCodes = await query<any[]>(
                    'SELECT * FROM backup_codes WHERE admin_id = ? AND code = ? AND used_at IS NULL',
                    [admin.id, backupCode]
                );

                if (backupCodes.length > 0) {
                    // Mark backup code as used
                    await query(
                        'UPDATE backup_codes SET used_at = NOW() WHERE id = ?',
                        [backupCodes[0].id]
                    );
                    twoFAValid = true;
                }
            }

            if (!twoFAValid) {
                return NextResponse.json(
                    { error: 'Invalid 2FA code' },
                    { status: 401 }
                );
            }
        }

        // Create session (1 hour lifetime)
        const sessionId = await createSession(admin.id, request);

        // Set HttpOnly session cookie
        const sessionCookie = setSessionCookie(sessionId);

        const response = NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                email: admin.email,
                is2FAEnabled: admin.is_2fa_enabled,
            },
        });

        // Set session cookie
        response.headers.append('Set-Cookie', sessionCookie);

        await logActivity(request, admin.id, 'LOGIN', { email: admin.email });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

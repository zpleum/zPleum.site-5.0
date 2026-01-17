import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { generateSecret, generateQRCode } from '@/lib/auth/totp';
import { verifyPassword } from '@/lib/auth/password';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;

    try {
        // Parse request body (optional - may be empty for initial QR code request)
        let body: any = {};
        try {
            const text = await request.text();
            if (text) {
                body = JSON.parse(text);
            }
        } catch (parseError) {
            // No body or invalid JSON - use defaults
            body = {};
        }

        const { password, revealSecret } = body;

        // Generate new TOTP secret (returns { secret, encryptedSecret })
        const { secret, encryptedSecret } = generateSecret();

        // Generate QR code (always provided)
        const qrCode = await generateQRCode(admin.email, secret);

        const response: any = {
            qrCode,
            tempEncryptedSecret: encryptedSecret,
        };

        // If user wants to reveal secret for manual entry, verify password first
        if (revealSecret === true) {
            if (!password) {
                return NextResponse.json(
                    { error: 'Password required to reveal secret' },
                    { status: 400 }
                );
            }

            // Get admin's password hash
            const admins = await query<any[]>(
                'SELECT password_hash FROM admins WHERE id = ?',
                [admin.id]
            );

            if (admins.length === 0) {
                return NextResponse.json(
                    { error: 'Admin not found' },
                    { status: 404 }
                );
            }

            // Verify password
            const passwordValid = await verifyPassword(password, admins[0].password_hash);

            if (!passwordValid) {
                return NextResponse.json(
                    { error: 'Invalid password' },
                    { status: 401 }
                );
            }

            // Password verified - include secret in response
            response.secret = secret;
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('2FA setup error:', error);
        return NextResponse.json(
            { error: 'Failed to generate 2FA setup' },
            { status: 500 }
        );
    }
}

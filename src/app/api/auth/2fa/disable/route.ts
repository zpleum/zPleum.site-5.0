import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { verifyPassword } from '@/lib/auth/password';
import { query } from '@/lib/db';

const disableSchema = z.object({
    password: z.string(),
});

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;

    try {
        const body = await request.json();
        const validation = disableSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { password } = validation.data;

        // Verify password
        // Get admin's password hash separately as it's not in the auth middleware object
        interface PasswordResult {
            password_hash: string;
        }

        const admins = await query<PasswordResult[]>(
            'SELECT password_hash FROM admins WHERE id = ?',
            [admin.id]
        );

        if (admins.length === 0) {
            return NextResponse.json(
                { error: 'Admin not found' },
                { status: 404 }
            );
        }

        const passwordValid = await verifyPassword(password, admins[0].password_hash);

        if (!passwordValid) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // Disable 2FA
        await query(
            `UPDATE admins 
       SET is_2fa_enabled = FALSE, totp_secret_encrypted = NULL
       WHERE id = ?`,
            [admin.id]
        );

        // Delete all backup codes
        await query(
            'DELETE FROM admin_backup_codes WHERE admin_id = ?',
            [admin.id]
        );

        return NextResponse.json({
            success: true,
            message: '2FA disabled successfully',
        });
    } catch (error) {
        console.error('2FA disable error:', error);
        return NextResponse.json(
            { error: 'Failed to disable 2FA' },
            { status: 500 }
        );
    }
}

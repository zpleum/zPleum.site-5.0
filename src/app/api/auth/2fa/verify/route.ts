import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { verifyToken, generateBackupCodes } from '@/lib/auth/totp';
import { hashPassword } from '@/lib/auth/password';
import { query } from '@/lib/db';

const verifySchema = z.object({
    totpCode: z.string().length(6),
    encryptedSecret: z.string(),
});

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;

    try {
        const body = await request.json();
        const validation = verifySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { totpCode, encryptedSecret } = validation.data;

        // Verify the TOTP code
        const isValid = verifyToken(encryptedSecret, totpCode);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid TOTP code' },
                { status: 400 }
            );
        }

        // Generate backup codes
        const backupCodes = generateBackupCodes(10);
        const backupCodeHashes = await Promise.all(
            backupCodes.map(code => hashPassword(code))
        );

        // Enable 2FA and save encrypted secret
        await query(
            `UPDATE admins 
       SET is_2fa_enabled = TRUE, totp_secret_encrypted = ?
       WHERE id = ?`,
            [encryptedSecret, admin.id]
        );

        // Save backup codes
        for (const hash of backupCodeHashes) {
            await query(
                `INSERT INTO admin_backup_codes (id, admin_id, code_hash)
         VALUES (?, ?, ?)`,
                [uuidv4(), admin.id, hash]
            );
        }

        return NextResponse.json({
            success: true,
            message: '2FA enabled successfully',
            backupCodes, // Return plaintext codes ONCE for user to save
        });
    } catch (error) {
        console.error('2FA verification error:', error);
        return NextResponse.json(
            { error: 'Failed to enable 2FA' },
            { status: 500 }
        );
    }
}

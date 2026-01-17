import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        // Get session from HttpOnly cookie
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Get admin data (without sensitive info)
        const admins = await query<any[]>(
            'SELECT id, email, is_2fa_enabled FROM admins WHERE id = ?',
            [session.admin_id]
        );

        if (admins.length === 0) {
            return NextResponse.json(
                { error: 'Admin not found' },
                { status: 404 }
            );
        }

        const admin = admins[0];

        return NextResponse.json({
            admin: {
                id: admin.id,
                email: admin.email,
                is2FAEnabled: admin.is_2fa_enabled,
            },
        });
    } catch (error) {
        console.error('Get current admin error:', error);
        return NextResponse.json(
            { error: 'Failed to get admin data' },
            { status: 500 }
        );
    }
}

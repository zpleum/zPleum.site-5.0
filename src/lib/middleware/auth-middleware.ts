import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';

interface Admin {
    id: number;
    email: string;
    is_2fa_enabled: boolean;
}

/**
 * Require authentication via HttpOnly session cookie
 * Replaces JWT-based authentication
 */
export async function requireAuth(request: NextRequest): Promise<
    | NextResponse
    | { admin: Admin }
> {
    try {
        // Get session from HttpOnly cookie
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - No valid session' },
                { status: 401 }
            );
        }

        // Get admin data
        const admins = await query<Admin[]>(
            'SELECT id, email, is_2fa_enabled FROM admins WHERE id = ?',
            [session.admin_id]
        );

        if (admins.length === 0) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin not found' },
                { status: 401 }
            );
        }

        const admin = admins[0];

        // Return admin data (without sensitive info)
        return { admin };
    } catch (error) {
        console.error('Auth middleware error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

/**
 * Optional authentication - doesn't fail if not authenticated
 */
export async function optionalAuth(request: NextRequest): Promise<Admin | null> {
    try {
        const session = await getSession(request);

        if (!session) {
            return null;
        }

        const admins = await query<Admin[]>(
            'SELECT id, email, role, is_2fa_enabled FROM admins WHERE id = ?',
            [session.admin_id]
        );

        return admins.length > 0 ? admins[0] : null;
    } catch (error) {
        console.error('Optional auth error:', error);
        return null;
    }
}

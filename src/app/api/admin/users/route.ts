import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';

interface Admin {
    id: string;
    email: string;
    is_2fa_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const admins = await query<Admin[]>(
            `SELECT id, email, is_2fa_enabled, created_at, updated_at 
       FROM admins 
       ORDER BY created_at DESC`
        );

        return NextResponse.json({ admins });
    } catch {
        console.error('Get admins error');
        return NextResponse.json(
            { error: 'Failed to fetch admins' },
            { status: 500 }
        );
    }
}

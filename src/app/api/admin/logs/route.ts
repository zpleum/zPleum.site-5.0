import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const { searchParams } = new URL(request.url);
        let limit = parseInt(searchParams.get('limit') || '50');
        let offset = parseInt(searchParams.get('offset') || '0');

        // Validation to prevent potential SQL or Logic errors
        if (isNaN(limit) || limit < 1) limit = 50;
        if (isNaN(offset) || offset < 0) offset = 0;
        if (limit > 500) limit = 500; // Cap limit for performance

        // We join with admins to show the email of the person who did the action
        const logs = await query(`
            SELECT al.*, a.email as admin_email
            FROM activity_logs al
            LEFT JOIN admins a ON al.admin_id = a.id
            ORDER BY al.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const totalResult = await query('SELECT COUNT(*) as count FROM activity_logs');
        const total = (totalResult as any)[0].count;

        return NextResponse.json({
            logs,
            pagination: {
                total,
                limit,
                offset
            }
        });
    } catch (error) {
        console.error('Fetch logs error:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}

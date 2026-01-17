import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const { ids } = await request.json();

        if (!Array.isArray(ids)) {
            return NextResponse.json({ error: 'IDs must be an array' }, { status: 400 });
        }

        // Performance-minded bulk update
        // Note: For large datasets we'd use a single CASE statement, 
        // but for a handful of categories, individual updates are safer and simpler.
        const promises = ids.map((id, index) =>
            query('UPDATE categories SET sort_order = ? WHERE id = ?', [index, id])
        );

        await Promise.all(promises);

        await logActivity(request, authResult.admin.id, 'UPDATE_ADMIN', { action: 'REORDER_CATEGORIES', count: ids.length });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reorder error:', error);
        return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 });
    }
}

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

        const promises = ids.map((id, index) =>
            query('UPDATE certificate_categories SET sort_order = ? WHERE id = ?', [index, id])
        );

        await Promise.all(promises);

        await logActivity(request, authResult.admin.id.toString(), 'REORDER_CERTIFICATE_CATEGORIES', { count: ids.length });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reorder certificate categories error:', error);
        return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 });
    }
}

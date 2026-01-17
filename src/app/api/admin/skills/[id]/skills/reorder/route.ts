import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { id: categoryId } = await params;

    try {
        const body = await request.json();
        const { ids } = body;

        if (!Array.isArray(ids)) {
            return NextResponse.json(
                { error: 'Invalid request: ids must be an array' },
                { status: 400 }
            );
        }

        // Update display_order for each skill
        for (let i = 0; i < ids.length; i++) {
            await query(
                `UPDATE skills SET display_order = ? WHERE id = ? AND category_id = ?`,
                [i, ids[i], categoryId]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reordering skills:', error);
        return NextResponse.json(
            { error: 'Failed to reorder skills' },
            { status: 500 }
        );
    }
}

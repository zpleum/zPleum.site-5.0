import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    try {
        const body = await request.json();
        const { ids } = body;

        if (!Array.isArray(ids)) {
            return NextResponse.json(
                { error: 'Invalid request: ids must be an array' },
                { status: 400 }
            );
        }

        for (let i = 0; i < ids.length; i++) {
            await query(
                `UPDATE journey_milestones SET display_order = ? WHERE id = ?`,
                [i, ids[i]]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reordering journey milestones:', error);
        return NextResponse.json(
            { error: 'Failed to reorder journey milestones' },
            { status: 500 }
        );
    }
}

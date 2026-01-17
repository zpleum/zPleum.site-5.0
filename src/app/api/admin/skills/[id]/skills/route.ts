import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;
    const { id: categoryId } = await params;

    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Skill name is required' },
                { status: 400 }
            );
        }

        const id = uuidv4();

        interface MaxOrderResult {
            max_order: number | null;
        }

        // Get max display_order for this category
        const maxOrder = await query<MaxOrderResult[]>(
            `SELECT MAX(display_order) as max_order FROM skills WHERE category_id = ?`,
            [categoryId]
        );
        const displayOrder = (maxOrder[0]?.max_order ?? -1) + 1;

        await query(
            `INSERT INTO skills (id, category_id, name, display_order) VALUES (?, ?, ?, ?)`,
            [id, categoryId, name, displayOrder]
        );

        await logActivity(request, String(admin.id), 'CREATE_SKILL', { id, categoryId, name });

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Error creating skill:', error);
        return NextResponse.json(
            { error: 'Failed to create skill' },
            { status: 500 }
        );
    }
}

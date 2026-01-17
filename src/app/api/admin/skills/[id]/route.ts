import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query, queryOne } from '@/lib/db';
import { logActivity } from '@/lib/logger';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { id } = await params;

    try {
        const category = await queryOne<any>(
            `SELECT * FROM skill_categories WHERE id = ?`,
            [id]
        );

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        const skills = await query<any[]>(
            `SELECT * FROM skills WHERE category_id = ? ORDER BY display_order ASC`,
            [id]
        );

        return NextResponse.json({ category: { ...category, skills } });
    } catch (error) {
        console.error('Error fetching skill category:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skill category' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;
    const { id } = await params;

    try {
        const body = await request.json();
        const { title, icon, color } = body;

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (title !== undefined) {
            updateFields.push('title = ?');
            updateValues.push(title);
        }
        if (icon !== undefined) {
            updateFields.push('icon = ?');
            updateValues.push(icon);
        }
        if (color !== undefined) {
            updateFields.push('color = ?');
            updateValues.push(color);
        }

        if (updateFields.length === 0) {
            return NextResponse.json(
                { error: 'No updates provided' },
                { status: 400 }
            );
        }

        updateValues.push(id);

        await query(
            `UPDATE skill_categories SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        await logActivity(request, admin.id, 'UPDATE_SKILL_CATEGORY', { id, title });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating skill category:', error);
        return NextResponse.json(
            { error: 'Failed to update skill category' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;
    const { id } = await params;

    try {
        await query('DELETE FROM skill_categories WHERE id = ?', [id]);

        await logActivity(request, admin.id, 'DELETE_SKILL_CATEGORY', { id });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting skill category:', error);
        return NextResponse.json(
            { error: 'Failed to delete skill category' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query, queryOne } from '@/lib/db';
import { logActivity } from '@/lib/logger';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(50),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    try {
        const body = await request.json();
        const validation = categorySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        // Get old name first for cascading update
        const oldCategory = await queryOne('SELECT name FROM categories WHERE id = ?', [id]);

        await query(
            'UPDATE categories SET name = ? WHERE id = ?',
            [validation.data.name, id]
        );

        // Cascade to projects table
        if (oldCategory) {
            await query(
                'UPDATE projects SET category = ? WHERE category = ?',
                [validation.data.name, oldCategory.name]
            );
        }

        await logActivity(request, (authResult as { admin: any }).admin.id, 'UPDATE_CATEGORY', {
            id,
            oldName: (oldCategory as any)?.name,
            newName: validation.data.name
        });

        return NextResponse.json({ success: true, message: 'Category updated and projects synced' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Category name already exists' }, { status: 409 });
        }
        console.error('Update category error:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    try {
        const oldCategory = await queryOne('SELECT name FROM categories WHERE id = ?', [id]);

        await query('DELETE FROM categories WHERE id = ?', [id]);

        if (oldCategory) {
            await query(
                "UPDATE projects SET category = 'Other' WHERE category = ?",
                [oldCategory.name]
            );
        }

        await logActivity(request, (authResult as { admin: any }).admin.id, 'DELETE_CATEGORY', {
            id,
            name: (oldCategory as any)?.name
        });

        return NextResponse.json({ success: true, message: 'Category deleted and projects reassigned' });
    } catch (error) {
        console.error('Delete category error:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

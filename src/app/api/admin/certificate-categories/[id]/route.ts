import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';
import { z } from 'zod';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(50),
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const { id } = await context.params;
        const body = await request.json();
        const validation = categorySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        await query(
            'UPDATE certificate_categories SET name = ? WHERE id = ?',
            [validation.data.name, id]
        );

        await logActivity(request, authResult.admin.id.toString(), 'UPDATE_CERTIFICATE_CATEGORY', { id, name: validation.data.name });

        return NextResponse.json({ success: true, message: 'Category updated' });
    } catch (error) {
        console.error('Update certificate category error:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    try {
        const { id } = await context.params;

        await query('DELETE FROM certificate_categories WHERE id = ?', [id]);

        await logActivity(request, authResult.admin.id.toString(), 'DELETE_CERTIFICATE_CATEGORY', { id });

        return NextResponse.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        console.error('Delete certificate category error:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

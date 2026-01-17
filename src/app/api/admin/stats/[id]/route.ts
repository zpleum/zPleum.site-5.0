import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';

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
        const { label, value, icon, color } = body;

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (label !== undefined) {
            updateFields.push('label = ?');
            updateValues.push(label);
        }
        if (value !== undefined) {
            updateFields.push('value = ?');
            updateValues.push(value);
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
            `UPDATE stats SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        await logActivity(request, admin.id, 'UPDATE_STAT', { id, label });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating stat:', error);
        return NextResponse.json(
            { error: 'Failed to update stat' },
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
        await query('DELETE FROM stats WHERE id = ?', [id]);

        await logActivity(request, admin.id, 'DELETE_STAT', { id });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting stat:', error);
        return NextResponse.json(
            { error: 'Failed to delete stat' },
            { status: 500 }
        );
    }
}

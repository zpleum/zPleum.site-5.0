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
        const { year, title, description, align } = body;

        const updateFields: string[] = [];
        const updateValues: unknown[] = [];

        if (year !== undefined) {
            updateFields.push('year = ?');
            updateValues.push(year);
        }
        if (title !== undefined) {
            updateFields.push('title = ?');
            updateValues.push(title);
        }
        if (description !== undefined) {
            updateFields.push('description = ?');
            updateValues.push(description);
        }
        if (align !== undefined) {
            updateFields.push('align = ?');
            updateValues.push(align);
        }

        if (updateFields.length === 0) {
            return NextResponse.json(
                { error: 'No updates provided' },
                { status: 400 }
            );
        }

        updateValues.push(id);

        await query(
            `UPDATE journey_milestones SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        await logActivity(request, admin.id.toString(), 'UPDATE_JOURNEY_MILESTONE', { id, title });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating journey milestone:', error);
        return NextResponse.json(
            { error: 'Failed to update journey milestone' },
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
        await query('DELETE FROM journey_milestones WHERE id = ?', [id]);

        await logActivity(request, admin.id.toString(), 'DELETE_JOURNEY_MILESTONE', { id });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting journey milestone:', error);
        return NextResponse.json(
            { error: 'Failed to delete journey milestone' },
            { status: 500 }
        );
    }
}

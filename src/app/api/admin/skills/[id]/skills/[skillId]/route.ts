import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';
import { logActivity } from '@/lib/logger';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; skillId: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;
    const { skillId } = await params;

    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Skill name is required' },
                { status: 400 }
            );
        }

        await query(
            `UPDATE skills SET name = ? WHERE id = ?`,
            [name, skillId]
        );

        await logActivity(request, admin.id, 'UPDATE_SKILL', { id: skillId, name });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating skill:', error);
        return NextResponse.json(
            { error: 'Failed to update skill' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; skillId: string }> }
) {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { admin } = authResult;
    const { skillId } = await params;

    try {
        await query('DELETE FROM skills WHERE id = ?', [skillId]);

        await logActivity(request, admin.id, 'DELETE_SKILL', { id: skillId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting skill:', error);
        return NextResponse.json(
            { error: 'Failed to delete skill' },
            { status: 500 }
        );
    }
}

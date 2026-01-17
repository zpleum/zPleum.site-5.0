import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth-middleware';
import { query } from '@/lib/db';

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
        // Prevent self-deletion
        if (admin.id === id) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            );
        }

        // Delete admin (cascade will delete sessions and backup codes)
        const result = await query(
            'DELETE FROM admins WHERE id = ?',
            [id]
        );

        return NextResponse.json({
            success: true,
            message: 'Admin deleted successfully',
        });
    } catch (error) {
        console.error('Delete admin error:', error);
        return NextResponse.json(
            { error: 'Failed to delete admin' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession, deleteSession, clearSessionCookie } from '@/lib/session';
import { logActivity } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        // Get current session
        const session = await getSession(request);

        if (session) {
            // Log logout activity
            await logActivity(request, session.admin_id, 'LOGOUT', {});

            // Delete session from database
            await deleteSession(session.id);
        }

        // Clear session cookie
        const response = NextResponse.json({ success: true });
        response.headers.append('Set-Cookie', clearSessionCookie());

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}

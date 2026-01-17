import { NextRequest, NextResponse } from 'next/server';
import { getSession, createSession, setSessionCookie, deleteSession } from '@/lib/session';

/**
 * Refresh/rotate session
 * Extends session lifetime and generates new session ID
 */
export async function POST(request: NextRequest) {
    try {
        // Get current session
        const currentSession = await getSession(request);

        if (!currentSession) {
            return NextResponse.json(
                { error: 'No active session' },
                { status: 401 }
            );
        }

        // Delete old session
        await deleteSession(currentSession.id);

        // Create new session with same admin
        const newSessionId = await createSession(currentSession.admin_id, request);

        // Set new session cookie
        const sessionCookie = setSessionCookie(newSessionId);

        const response = NextResponse.json({
            success: true,
            message: 'Session refreshed'
        });

        response.headers.append('Set-Cookie', sessionCookie);

        return response;
    } catch (error) {
        console.error('Session refresh error:', error);
        return NextResponse.json(
            { error: 'Failed to refresh session' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { serialize } from 'cookie';

interface Session {
    id: string;
    admin_id: number;
    expires_at: Date;
}

/**
 * Get session from HttpOnly cookie
 */
export async function getSession(request: NextRequest): Promise<Session | null> {
    try {
        const sessionId = request.cookies.get('session_id')?.value;

        if (!sessionId) {
            return null;
        }

        const sessions = await query<Session[]>(
            'SELECT * FROM sessions WHERE id = ? AND expires_at > NOW()',
            [sessionId]
        );

        if (sessions.length === 0) {
            return null;
        }

        // Update last activity
        await query(
            'UPDATE sessions SET last_activity = NOW() WHERE id = ?',
            [sessionId]
        );

        return sessions[0];
    } catch (error) {
        console.error('Get session error:', error);
        return null;
    }
}

/**
 * Create a new session
 */
export async function createSession(
    adminId: number,
    request: NextRequest
): Promise<string> {
    const crypto = require('crypto');
    const sessionId = crypto.randomBytes(32).toString('hex');

    // Session lifetime: 1 hour
    const sessionLifetime = parseInt(process.env.SESSION_LIFETIME || '3600');
    const expiresAt = new Date(Date.now() + sessionLifetime * 1000);

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await query(
        `INSERT INTO sessions (id, admin_id, expires_at, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?)`,
        [sessionId, adminId, expiresAt, ipAddress, userAgent]
    );

    return sessionId;
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(sessionId: string): Promise<void> {
    await query('DELETE FROM sessions WHERE id = ?', [sessionId]);
}

/**
 * Delete all sessions for an admin
 */
export async function deleteAllAdminSessions(adminId: number): Promise<void> {
    await query('DELETE FROM sessions WHERE admin_id = ?', [adminId]);
}

/**
 * Set session cookie
 */
export function setSessionCookie(sessionId: string): string {
    const sessionLifetime = parseInt(process.env.SESSION_LIFETIME || '3600');

    return serialize('session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: sessionLifetime,
        path: '/',
    });
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(): string {
    return serialize('session_id', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
}

/**
 * Clean up expired sessions (run periodically)
 */
export async function cleanupExpiredSessions(): Promise<void> {
    await query('DELETE FROM sessions WHERE expires_at < NOW()');
}

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { query, queryOne, AdminSession } from '../db';
import { getRefreshTokenExpiry } from './jwt';

/**
 * Hash a token for storage
 */
function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Create a new session
 */
export async function createSession(
    adminId: string,
    accessToken: string,
    refreshToken: string
): Promise<string> {
    const sessionId = uuidv4();
    const tokenHash = hashToken(accessToken);
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + getRefreshTokenExpiry() * 1000);

    await query(
        `INSERT INTO admin_sessions (id, admin_id, token_hash, refresh_token_hash, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
        [sessionId, adminId, tokenHash, refreshTokenHash, expiresAt]
    );

    return sessionId;
}

/**
 * Get session by token hash
 */
export async function getSessionByToken(
    token: string
): Promise<AdminSession | null> {
    const tokenHash = hashToken(token);

    return await queryOne<AdminSession>(
        `SELECT * FROM admin_sessions 
     WHERE token_hash = ? AND expires_at > NOW()`,
        [tokenHash]
    );
}

/**
 * Get session by refresh token hash
 */
export async function getSessionByRefreshToken(
    refreshToken: string
): Promise<AdminSession | null> {
    const refreshTokenHash = hashToken(refreshToken);

    return await queryOne<AdminSession>(
        `SELECT * FROM admin_sessions 
     WHERE refresh_token_hash = ? AND expires_at > NOW()`,
        [refreshTokenHash]
    );
}

/**
 * Update session with new tokens (for token rotation)
 */
export async function updateSession(
    sessionId: string,
    newAccessToken: string,
    newRefreshToken: string
): Promise<void> {
    const tokenHash = hashToken(newAccessToken);
    const refreshTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + getRefreshTokenExpiry() * 1000);

    await query(
        `UPDATE admin_sessions 
     SET token_hash = ?, refresh_token_hash = ?, expires_at = ?
     WHERE id = ?`,
        [tokenHash, refreshTokenHash, expiresAt, sessionId]
    );
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(sessionId: string): Promise<void> {
    await query(`DELETE FROM admin_sessions WHERE id = ?`, [sessionId]);
}

/**
 * Delete all sessions for an admin
 */
export async function deleteAllAdminSessions(adminId: string): Promise<void> {
    await query(`DELETE FROM admin_sessions WHERE admin_id = ?`, [adminId]);
}

/**
 * Clean up expired sessions
 */
export async function cleanExpiredSessions(): Promise<void> {
    await query(`DELETE FROM admin_sessions WHERE expires_at <= NOW()`);
}

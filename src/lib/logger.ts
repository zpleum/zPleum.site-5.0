import { v4 as uuidv4 } from 'uuid';
import { query } from './db';
import { NextRequest } from 'next/server';

export type ActivityAction =
    | 'LOGIN'
    | 'LOGOUT'
    | 'CREATE_PROJECT'
    | 'UPDATE_PROJECT'
    | 'DELETE_PROJECT'
    | 'CREATE_CATEGORY'
    | 'UPDATE_CATEGORY'
    | 'DELETE_CATEGORY'
    | 'CREATE_SKILL_CATEGORY'
    | 'UPDATE_SKILL_CATEGORY'
    | 'DELETE_SKILL_CATEGORY'
    | 'CREATE_SKILL'
    | 'UPDATE_SKILL'
    | 'DELETE_SKILL'
    | 'CREATE_STAT'
    | 'UPDATE_STAT'
    | 'DELETE_STAT'
    | 'CREATE_JOURNEY_MILESTONE'
    | 'UPDATE_JOURNEY_MILESTONE'
    | 'DELETE_JOURNEY_MILESTONE'
    | 'UPDATE_PROFILE'
    | 'UPDATE_CONTACT_INFO'
    | 'UPDATE_ADMIN'
    | 'REVOKE_ADMIN'
    | 'TOGGLE_2FA'
    | 'CREATE_CERTIFICATE'
    | 'UPDATE_CERTIFICATE'
    | 'DELETE_CERTIFICATE'
    | 'CREATE_CERTIFICATE_CATEGORY'
    | 'UPDATE_CERTIFICATE_CATEGORY'
    | 'DELETE_CERTIFICATE_CATEGORY'
    | 'REORDER_CERTIFICATE_CATEGORIES'
    | 'SYSTEM_ERROR';

/**
 * Record an administrative action
 */
export async function logActivity(
    request: NextRequest | null,
    adminId: string | null,
    action: ActivityAction,
    details?: unknown
) {
    try {
        const id = uuidv4();
        const ip = request ? (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0') : 'system';

        await query(
            'INSERT INTO activity_logs (id, admin_id, action, details, ip_address) VALUES (?, ?, ?, ?, ?)',
            [id, adminId, action, JSON.stringify(details || {}), ip]
        );
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
}

/**
 * Record a system error
 */
export async function logSystemError(error: any, context?: string) { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
        const id = uuidv4();
        await query(
            'INSERT INTO activity_logs (id, admin_id, action, details, ip_address) VALUES (?, ?, ?, ?, ?)',
            [
                id,
                null,
                'SYSTEM_ERROR',
                JSON.stringify({
                    message: error.message || String(error),
                    stack: error.stack,
                    context
                }),
                'internal'
            ]
        );
    } catch (err) {
        console.error('Failed to log system error:', err);
    }
}

/**
 * Record public web traffic
 */
export async function logTraffic(request: NextRequest, overridePath?: string) {
    try {
        const id = uuidv4();
        const path = overridePath || new URL(request.url).pathname;

        // Skip tracking static assets and background processes
        if (!overridePath && (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.'))) {
            return;
        }

        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        // Basic hashing of IP for privacy (GDPR compliant)
        const ipHash = Buffer.from(ip).toString('base64').substring(0, 16);

        const userAgent = request.headers.get('user-agent') || 'unknown';
        const referer = request.headers.get('referer') || '';

        await query(
            'INSERT INTO traffic_logs (id, path, ip_hash, referer, user_agent) VALUES (?, ?, ?, ?, ?)',
            [id, path, ipHash, referer, userAgent]
        );
    } catch (error) {
        console.error('Failed to log traffic:', error);
    }
}

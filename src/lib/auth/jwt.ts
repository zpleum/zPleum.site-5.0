import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-secret-change-this';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this';

const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export interface TokenPayload {
    adminId: string;
    email: string;
}

/**
 * Generate an access token (short-lived)
 */
export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
}

/**
 * Generate a refresh token (long-lived)
 */
export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
}

/**
 * Verify and decode an access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Verify and decode a refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Get token expiry time in seconds
 */
export function getAccessTokenExpiry(): number {
    return 15 * 60; // 15 minutes in seconds
}

export function getRefreshTokenExpiry(): number {
    return 7 * 24 * 60 * 60; // 7 days in seconds
}

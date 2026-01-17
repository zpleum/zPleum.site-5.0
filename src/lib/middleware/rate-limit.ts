/**
 * Simple in-memory rate limiter
 * For production, consider using Redis
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

/**
 * Rate limit checker
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || entry.resetTime < now) {
        // Create new entry
        const resetTime = now + config.windowMs;
        rateLimitStore.set(identifier, { count: 1, resetTime });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime,
        };
    }

    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime,
        };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime,
    };
}

/**
 * Get client identifier (IP address or fallback)
 */
export function getClientIdentifier(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip;
}

/**
 * Predefined rate limit configurations
 */
export const RateLimits = {
    // Login: 5 attempts per 15 minutes
    LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 },

    // 2FA: 10 attempts per 15 minutes
    TWO_FA: { maxRequests: 10, windowMs: 15 * 60 * 1000 },

    // Registration: 3 attempts per hour
    REGISTER: { maxRequests: 3, windowMs: 60 * 60 * 1000 },

    // General API: 100 requests per minute
    API: { maxRequests: 100, windowMs: 60 * 1000 },
};

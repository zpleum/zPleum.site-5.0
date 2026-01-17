import { serialize, parse, SerializeOptions } from 'cookie';
import { getAccessTokenExpiry, getRefreshTokenExpiry } from './jwt';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const cookieOptions: SerializeOptions = {
    httpOnly: true,
    secure: IS_PRODUCTION, // Only send over HTTPS in production
    sameSite: 'lax',
    path: '/',
};

/**
 * Set authentication cookies
 */
export function setAuthCookies(
    accessToken: string,
    refreshToken: string
): string[] {
    const accessTokenCookie = serialize('admin_access_token', accessToken, {
        ...cookieOptions,
        maxAge: getAccessTokenExpiry(),
    });

    const refreshTokenCookie = serialize('admin_refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: getRefreshTokenExpiry(),
    });

    return [accessTokenCookie, refreshTokenCookie];
}

/**
 * Parse cookies from request headers
 */
export function getAuthCookies(cookieHeader: string | null): {
    accessToken: string | null;
    refreshToken: string | null;
} {
    if (!cookieHeader) {
        return { accessToken: null, refreshToken: null };
    }

    const cookies = parse(cookieHeader);

    return {
        accessToken: cookies.admin_access_token || null,
        refreshToken: cookies.admin_refresh_token || null,
    };
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(): string[] {
    const clearAccessToken = serialize('admin_access_token', '', {
        ...cookieOptions,
        maxAge: 0,
    });

    const clearRefreshToken = serialize('admin_refresh_token', '', {
        ...cookieOptions,
        maxAge: 0,
    });

    return [clearAccessToken, clearRefreshToken];
}

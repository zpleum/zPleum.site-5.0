/**
 * Handle authentication errors and redirect to login
 * Use this in admin pages when API calls fail due to auth issues
 */
export function handleAuthError(response: Response, router: any) {
    if (response.status === 401 || response.status === 403) {
        // Clear any stored auth data
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
            sessionStorage.clear();
        }

        // Redirect to login
        router.push('/admin/login');
        return true;
    }
    return false;
}

/**
 * Check if error is authentication related
 */
export function isAuthError(error: any): boolean {
    return error?.status === 401 ||
        error?.status === 403 ||
        error?.message?.includes('Unauthorized') ||
        error?.message?.includes('Authentication');
}

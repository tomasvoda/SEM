/**
 * Mobile detection utility
 * Returns true if the current device is mobile
 */
export const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Check screen width
    const isMobileScreen = window.innerWidth < 768;

    // Check user agent
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
    );

    return isMobileScreen || isMobileUA;
};

/**
 * Check if current route is a mobile route
 */
export const isMobileRoute = (pathname: string): boolean => {
    return pathname.startsWith('/mobile');
};

/**
 * Get mobile redirect path based on device detection
 */
export const getMobileRedirectPath = (): string => {
    return isMobileDevice() ? '/mobile/home' : '/admin/dashboard';
};

/**
 * Mobile-only className helper
 * Returns the className only if on mobile, empty string otherwise
 */
export const mobileOnly = (className: string): string => {
    return isMobileDevice() ? className : '';
};

/**
 * Desktop-only className helper
 * Returns the className only if on desktop, empty string otherwise
 */
export const desktopOnly = (className: string): string => {
    return !isMobileDevice() ? className : '';
};

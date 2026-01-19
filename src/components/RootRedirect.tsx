import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isMobileDevice } from '../lib/mobileUtils';

/**
 * Root redirect component that routes users based on device type
 * Mobile devices → /mobile/home
 * Desktop devices → /admin/dashboard
 */
export function RootRedirect() {
    const isMobile = isMobileDevice();

    // Log for debugging
    useEffect(() => {
        console.log('Device detection:', {
            isMobile,
            width: window.innerWidth,
            userAgent: navigator.userAgent
        });
    }, [isMobile]);

    // Redirect based on device type
    if (isMobile) {
        return <Navigate to="/mobile/home" replace />;
    }

    return <Navigate to="/admin/dashboard" replace />;
}

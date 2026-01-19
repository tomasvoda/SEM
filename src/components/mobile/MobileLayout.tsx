import { Outlet, useLocation } from 'react-router-dom';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { useMobileStore } from '../../store/mobileStore';
import { useEffect } from 'react';

export function MobileLayout() {
    const location = useLocation();
    const { isBottomNavVisible, setBottomNavVisible } = useMobileStore();

    // Hide bottom nav on certain full-screen routes
    useEffect(() => {
        const hideNavRoutes = ['/mobile/thank-you'];
        const shouldHideNav = hideNavRoutes.some(route => location.pathname.includes(route));
        setBottomNavVisible(!shouldHideNav);
    }, [location.pathname, setBottomNavVisible]);

    return (
        <div className="min-h-screen flex flex-col bg-[var(--app-bg)] md:hidden">
            {/* Mobile-only layout - hidden on desktop */}
            <MobileHeader />

            <main className="flex-1 overflow-y-auto pb-safe">
                {/* Add bottom padding when nav is visible */}
                <div className={isBottomNavVisible ? 'pb-20' : ''}>
                    <Outlet />
                </div>
            </main>

            {isBottomNavVisible && <MobileBottomNav />}
        </div>
    );
}

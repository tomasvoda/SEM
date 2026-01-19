import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { useMobileStore } from '../../store/mobileStore';
import { useEffect } from 'react';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { useSwipeable } from 'react-swipeable';
import { cn } from '../../lib/utils';

const NAV_ORDER = [
    '/mobile/home',
    '/mobile/teams',
    '/mobile/program',
    '/mobile/venues',
    '/mobile/volunteers'
];

export function MobileLayout() {
    useScrollToTop();
    const location = useLocation();
    const navigate = useNavigate();
    const { isBottomNavVisible, setBottomNavVisible } = useMobileStore();

    // Hide bottom nav on certain full-screen routes
    useEffect(() => {
        const hideNavRoutes = ['/mobile/thank-you'];
        const shouldHideNav = hideNavRoutes.some(route => location.pathname.includes(route));
        setBottomNavVisible(!shouldHideNav);
    }, [location.pathname, setBottomNavVisible]);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            const currentIndex = NAV_ORDER.indexOf(location.pathname);
            if (currentIndex !== -1 && currentIndex < NAV_ORDER.length - 1) {
                navigate(NAV_ORDER[currentIndex + 1]);
            }
        },
        onSwipedRight: () => {
            const currentIndex = NAV_ORDER.indexOf(location.pathname);
            if (currentIndex !== -1 && currentIndex > 0) {
                navigate(NAV_ORDER[currentIndex - 1]);
            }
        },
        trackMouse: true
    });

    return (
        <div {...handlers} className="min-h-screen flex flex-col bg-[var(--app-bg)] md:hidden">
            {/* Mobile-only layout - hidden on desktop */}
            <MobileHeader />

            <main className="flex-1 overflow-y-auto pb-safe">
                {/* Add bottom padding when nav is visible */}
                <div
                    key={location.pathname}
                    className={cn(
                        "page-transition",
                        isBottomNavVisible ? 'pb-24' : ''
                    )}
                >
                    <Outlet />
                </div>
            </main>

            {isBottomNavVisible && <MobileBottomNav />}
        </div>
    );
}

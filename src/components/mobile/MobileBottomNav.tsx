import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, MapPin, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const navigationItems = [
    { id: 'home', path: '/mobile/home', icon: Home, labelKey: 'navigation.home' },
    { id: 'volunteers', path: '/mobile/volunteers', icon: Heart, labelKey: 'navigation.volunteers' },
    { id: 'teams', path: '/mobile/teams', icon: Users, labelKey: 'navigation.teams' },
    { id: 'program', path: '/mobile/program', icon: Calendar, labelKey: 'navigation.program' },
    { id: 'venues', path: '/mobile/venues', icon: MapPin, labelKey: 'navigation.venues' }
];

export function MobileBottomNav() {
    const { t } = useTranslation('common');

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
            {/* Glassmorphism bottom bar - Unified class */}
            <div className="mobile-bottom-nav-bar px-1 py-5">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                state={item.id === 'home' ? { triggerMascot: true } : undefined}
                                className={({ isActive }) =>
                                    cn(
                                        "flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "nav-active-highlight"
                                            : "text-[var(--text-muted)]"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            className={cn(
                                                "w-5 h-5 mb-1 transition-transform duration-200",
                                                isActive && "scale-110"
                                            )}
                                        />
                                        <span className="mobile-nav-label whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                                            {t(item.labelKey)}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

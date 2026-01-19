import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, MapPin, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const navigationItems = [
    { id: 'home', path: '/mobile/home', icon: Home, labelKey: 'navigation.home' },
    { id: 'teams', path: '/mobile/teams', icon: Users, labelKey: 'navigation.teams.title' },
    { id: 'program', path: '/mobile/program', icon: Calendar, labelKey: 'navigation.program' },
    { id: 'venues', path: '/mobile/venues', icon: MapPin, labelKey: 'navigation.venues' },
    { id: 'volunteers', path: '/mobile/volunteers', icon: Heart, labelKey: 'navigation.volunteers' }
];

export function MobileBottomNav() {
    const { t } = useTranslation('common');

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
            {/* Glassmorphism bottom bar */}
            <div className="glass border-t border-white/5 backdrop-blur-xl bg-[var(--glass-surface)] px-1 py-5">
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
                                            ? "text-brand-500"
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
                                        <span className="text-[8px] font-black uppercase tracking-tight leading-none whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
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

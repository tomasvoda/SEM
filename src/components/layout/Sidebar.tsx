import { LayoutDashboard, Users, Shield, Trophy, Users2, Coins, Bell, Car, Hotel, MapPin, ClipboardCheck, Handshake, ChevronLeft, ChevronRight, ListTodo, ClipboardList } from 'lucide-react';
import { NavigationItem } from './NavigationItem';
import { CollapsibleNavigationItem } from './CollapsibleNavigationItem';
import { LogoEM } from '../ui/LogoEM';
import { cn } from '../../lib/utils';

interface SidebarProps {
    isCollapsed?: boolean;
    toggle?: () => void;
}

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Teams', href: '/teams', icon: Users2 },
    { name: 'Matches', href: '/matches', icon: Trophy },
    { name: 'Delegations', href: '/admin/delegations', icon: Users },
    { name: 'Partners', href: '/partners', icon: Handshake },
];

const accommodationNavigation = [
    { name: 'Overview', href: '/admin/accommodation/overview', icon: LayoutDashboard },
    { name: 'Allocations', href: '/admin/accommodation/allocations', icon: Shield },
    { name: 'Occupancy', href: '/admin/accommodation/report', icon: Hotel },
];

const adminLogisticsNav = [
    { name: 'Pricing', href: '/admin/hotels/pricing', icon: Coins },
    { name: 'Hotels', href: '/admin/hotels', icon: Shield, exact: true },
    { name: 'Venues', href: '/admin/venues', icon: MapPin },
];

const adminCompetitionNav = [
    { name: 'Draw', href: '/admin/matches/draw', icon: Trophy },
    { name: 'Rosters', href: '/admin/rosters', icon: Users },
    { name: 'Results', href: '/admin/results', icon: ClipboardCheck },
];
const adminStaffNav = [
    { name: 'Tasks', href: '/admin/tasks', icon: ListTodo },
    { name: 'Volunteers', href: '/admin/volunteers', icon: ClipboardList },
];

export function Sidebar({ isCollapsed = false, toggle }: SidebarProps) {

    return (
        <div className={cn("hidden md:flex md:flex-col md:fixed md:inset-y-0 z-50 transition-all duration-300", isCollapsed ? "md:w-20" : "md:w-48")}>
            {/* Ultra-Liquid Glass: No hard lines, deep diffuse shadow, high blur */}
            <div className="flex-1 flex flex-col min-h-0 backdrop-blur-2xl border-r border-white/[0.03] shadow-[30px_0_60px_-15px_rgba(0,0,0,0.3)] bg-gradient-to-r from-transparent via-white/[0.01] to-white/[0.03]">

                {/* Logo Area - Premium Presentation */}
                <div className={cn(
                    "flex items-center h-16 flex-shrink-0 border-b border-white/[0.02] relative",
                    isCollapsed ? "justify-center px-2" : "px-4"
                )}>
                    {/* Logo with dedicated zone */}
                    <div className="flex items-center justify-center">
                        <LogoEM />
                    </div>

                    {/* Subtle vertical divider (enterprise style) - only when not collapsed */}
                    {!isCollapsed && (
                        <div
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
                            aria-hidden="true"
                        />
                    )}
                </div>

                {/* Navigation */}
                <div className={cn("flex-1 flex flex-col overflow-y-auto py-4 space-y-2 custom-scrollbar", isCollapsed ? "px-2" : "px-4")}>

                    {/* Main Menu Label + Toggle */}
                    <div className={cn("flex items-center mb-2 min-h-[20px]", isCollapsed ? "justify-center" : "justify-between px-2")}>
                        {!isCollapsed && (
                            <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider animate-in fade-in">
                                Main Menu
                            </p>
                        )}
                        <button
                            onClick={toggle}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                        >
                            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                        </button>
                    </div>

                    {navigation.map((item) => (
                        <NavigationItem key={item.name} {...item} isCollapsed={isCollapsed} />
                    ))}

                    <CollapsibleNavigationItem
                        name="Accommodation"
                        icon={Hotel}
                        isCollapsed={isCollapsed}
                        items={accommodationNavigation}
                    >
                        {accommodationNavigation.map((item) => (
                            <NavigationItem key={item.name} {...item} isCollapsed={isCollapsed} />
                        ))}
                    </CollapsibleNavigationItem>

                    <NavigationItem name="Logistics" href="/logistics" icon={Car} isCollapsed={isCollapsed} />


                    {!isCollapsed && <p className="px-2 text-xs font-semibold text-[var(--color-text-muted)] capitalize tracking-wider mt-6 mb-2 animate-in fade-in">Admin</p>}
                    {isCollapsed && <div className="my-2 border-t border-white/5 mx-2" />}

                    {adminLogisticsNav.map((item) => (
                        <NavigationItem key={item.name} {...item} isCollapsed={isCollapsed} />
                    ))}

                    {adminCompetitionNav.map((item) => (
                        <NavigationItem key={item.name} {...item} isCollapsed={isCollapsed} />
                    ))}

                    {adminStaffNav.map((item) => (
                        <NavigationItem key={item.name} {...item} isCollapsed={isCollapsed} />
                    ))}

                    {!isCollapsed && <p className="px-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mt-6 mb-2 animate-in fade-in">System</p>}
                    {isCollapsed && <div className="my-2 border-t border-white/5 mx-2" />}

                    <NavigationItem name="Notifications" href="/notifications" icon={Bell} isCollapsed={isCollapsed} />
                </div>

            </div>
        </div>
    );
}

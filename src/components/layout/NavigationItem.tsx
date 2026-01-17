import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavigationItemProps {
    name: string;
    href: string;
    icon: React.ElementType;
    exact?: boolean;
    disabled?: boolean;
    isCollapsed?: boolean;
}

export function NavigationItem({ name, href, icon: Icon, exact, disabled, isCollapsed }: NavigationItemProps) {
    const location = useLocation();
    const isActive = !disabled && (exact ? location.pathname === href : location.pathname.startsWith(href));

    if (disabled) {
        return (
            <div
                className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative text-white/20 cursor-not-allowed select-none',
                    isCollapsed ? 'justify-center px-2' : ''
                )}
            >
                <Icon
                    className={cn("flex-shrink-0 h-5 w-5 text-white/20", isCollapsed ? "mr-0" : "mr-3")}
                    aria-hidden="true"
                />
                {!isCollapsed && <span className="relative z-10">{name}</span>}
            </div>
        );
    }

    return (
        <Link
            to={href}
            className={cn(
                'group flex items-center text-xs font-medium rounded-lg transition-all duration-200 relative',
                isCollapsed ? 'justify-center px-2 py-2' : 'px-4 py-2',
                isActive
                    ? 'text-[var(--text-primary)] bg-white/[0.02]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.01]'
            )}
        >
            {/* Precision Active Indicator */}
            {isActive && (
                <div className={cn("absolute bg-brand-500 rounded-r-full opacity-80", isCollapsed ? "left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full" : "left-0 top-1/2 -translate-y-1/2 w-0.5 h-3")} />
            )}

            <Icon
                className={cn(
                    'flex-shrink-0 h-4 w-4 transition-colors duration-200',
                    isCollapsed ? 'mr-0' : 'mr-3',
                    isActive
                        ? 'text-brand-500'
                        : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] opacity-70 group-hover:opacity-100'
                )}
                aria-hidden="true"
            />

            {!isCollapsed && <span className="relative z-10 whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>}

            {/* Tooltip for Collapsed Mode */}
            {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 border border-white/10 text-white text-[10px] font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    {name}
                </div>
            )}
        </Link>
    );
}

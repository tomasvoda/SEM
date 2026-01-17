import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SubItem {
    name: string;
    href: string;
}

interface CollapsibleNavigationItemProps {
    name: string;
    icon: React.ElementType;
    isCollapsed?: boolean;
    items: SubItem[];
    children: React.ReactNode;
}

export function CollapsibleNavigationItem({ name, icon: Icon, isCollapsed, items, children }: CollapsibleNavigationItemProps) {
    const location = useLocation();
    const isAnyChildActive = items.some(item => location.pathname.startsWith(item.href));
    const [isOpen, setIsOpen] = useState(isAnyChildActive);

    // Auto-expand if a child becomes active
    useEffect(() => {
        if (isAnyChildActive) {
            setIsOpen(true);
        }
    }, [isAnyChildActive, location.pathname]);

    if (isCollapsed) {
        return (
            <div className="flex flex-col items-center py-2">
                <div
                    className={cn(
                        "p-2 rounded-lg transition-colors cursor-pointer relative group",
                        isAnyChildActive ? "text-brand-500 bg-white/[0.02]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Icon className="w-4 h-4" />
                    {/* Active Dot for collapsed state */}
                    {isAnyChildActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-brand-500 rounded-full" />
                    )}

                    {/* Tooltip */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 border border-white/10 text-white text-[10px] font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                        {name}
                    </div>
                </div>
                {isOpen && (
                    <div className="flex flex-col items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {children}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'group flex items-center justify-between px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 relative',
                    isAnyChildActive
                        ? 'text-[var(--text-primary)] bg-white/[0.02]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.01]'
                )}
            >
                <div className="flex items-center">
                    <Icon
                        className={cn(
                            'flex-shrink-0 h-4 w-4 mr-3 transition-colors duration-200',
                            isAnyChildActive ? 'text-brand-500' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] opacity-70 group-hover:opacity-100'
                        )}
                    />
                    <span className="relative z-10 whitespace-nowrap overflow-hidden text-ellipsis font-bold tracking-tight">{name}</span>
                </div>

                <ChevronDown
                    className={cn(
                        "w-3 h-3 transition-transform duration-300 opacity-40 group-hover:opacity-100",
                        isOpen ? "rotate-0" : "-rotate-90"
                    )}
                />

                {/* Accuracy Active Indicator */}
                {isAnyChildActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3 bg-brand-500 rounded-r-full opacity-80" />
                )}
            </button>

            {isOpen && (
                <div className="mt-1 ml-4 border-l border-white/[0.03] flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

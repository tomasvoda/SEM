import { LayoutDashboard, Users, Hotel, Car, Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navigation = [
    { name: 'Dash', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Del', href: '/delegation', icon: Users },
    { name: 'Acc', href: '/accommodation', icon: Hotel },
    { name: 'Tra', href: '/transport', icon: Car },
    { name: 'Food', href: '/meals', icon: Utensils },
];

export function BottomNav() {
    const location = useLocation();

    return (
        // Floating Island: More bottom margin, centered, max-width
        <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
            <div className="glass-panel rounded-3xl px-6 py-4 flex justify-between items-center ring-1 ring-white/10 backdrop-blur-2xl">
                {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center transition-all duration-300 relative group',
                                isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-2xl transition-all duration-500",
                                isActive
                                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-1 ring-brand-500/30"
                                    : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                            )}>
                                <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

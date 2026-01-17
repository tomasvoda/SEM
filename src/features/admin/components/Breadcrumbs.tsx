import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav className={cn("flex items-center gap-2 overflow-x-auto whitespace-nowrap py-2 no-scrollbar", className)}>
            <Link
                to="/admin"
                className="p-1 rounded-md hover:bg-[var(--glass-highlight)] text-[var(--text-muted)] hover:text-brand-500 transition-colors"
                title="Admin Dashboard"
            >
                <Home className="w-3.5 h-3.5" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]/40 flex-shrink-0" />
                    {item.path ? (
                        <Link
                            to={item.path}
                            className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-brand-500 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}

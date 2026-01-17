import { cn } from "../../lib/utils";
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8", className)}>
            <div className="space-y-1">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">
                    <Link
                        to="/"
                        className="p-1 rounded-md hover:bg-[var(--glass-highlight)] text-[var(--text-muted)] hover:text-brand-500 transition-colors"
                        title="Home"
                    >
                        <Home className="w-3.5 h-3.5" />
                    </Link>

                    {breadcrumbs && breadcrumbs.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 opacity-40 flex-shrink-0" />
                            {item.href ? (
                                <Link to={item.href} className="hover:text-brand-500 transition-colors opacity-70 hover:opacity-100">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-brand-500 opacity-100">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Title */}
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight relative z-10 drop-shadow-sm">
                    {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-[0.2em] max-w-2xl opacity-80">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Actions */}
            {actions && (
                <div className="flex items-center gap-3 pt-1">
                    {actions}
                </div>
            )}
        </div>
    );
}

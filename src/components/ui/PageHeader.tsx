import { cn } from "../../lib/utils";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight relative z-10 drop-shadow-sm">
                    {title}
                </h1>
                {subtitle && <p className="text-[var(--text-secondary)] mt-1 text-sm font-medium tracking-wide">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
}

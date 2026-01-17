import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: LucideIcon;
    label?: string; // Accessibility label
    variant?: "ghost" | "glass" | "primary";
}

export function IconButton({ icon: Icon, className, variant = "ghost", label, ...props }: IconButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                "p-2 rounded-lg transition-all duration-200 flex items-center justify-center",
                variant === "ghost" && "text-slate-400 hover:text-white hover:bg-white/5",
                variant === "glass" && "glass text-slate-200 hover:text-brand-300 hover:border-brand-500/30",
                variant === "primary" && "bg-brand-600 text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500",
                className
            )}
            aria-label={label}
            {...props}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
}

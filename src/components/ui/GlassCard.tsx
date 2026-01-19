import { cn } from "../../lib/utils";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    onClick?: () => void;
    noPadding?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, onClick, noPadding = false }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                // Base Glass: More fluid shape (3xl), Refined padding, Edge Softening
                "glass border-0 ring-1 ring-white/[0.05] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] rounded-3xl relative group transition-all duration-500 overflow-hidden",
                !noPadding && "p-6",
                hoverEffect && "glass-hover cursor-pointer",
                className
            )}
        >
            {/* 
         Asymmetric Refraction Layer 
         Simulates light hitting the top-left corner and fading out.
         Uses the CSS variable defined in index.css
      */}
            <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700 z-0"
                style={{
                    background: 'var(--glass-refraction)',
                    maskImage: 'linear-gradient(135deg, black 40%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(135deg, black 40%, transparent 100%)'
                }}
            />

            {/* Content z-index ensures text is above refraction */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
}

import { Construction } from 'lucide-react';

export function UnderConstructionPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-fade-in">
            <div className="p-4 rounded-full bg-[var(--glass-surface)]/20 border border-white/5 shadow-2xl backdrop-blur-xl mb-6 ring-1 ring-white/10">
                <Construction className="w-12 h-12 text-[var(--color-brand-400)] opacity-80" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-3 tracking-tight">
                Under Construction
            </h1>

            <p className="text-[var(--text-muted)] max-w-md text-sm md:text-base leading-relaxed">
                This section is currently in preparation. <br className="hidden md:block" />
                We are working hard to bring you this feature soon.
            </p>
        </div>
    );
}

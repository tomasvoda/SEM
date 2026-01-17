import { Globe, Shield, ChevronRight, Users, Utensils } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { GlassCard } from '../../../components/ui/GlassCard';

export interface DelegationCardProps {
    countryName: string;
    countryCode: string;
    federation: string;
    persons: number;
    singles: number;
    doubles: number;
    catering: string;
    status: 'draft' | 'submitted' | 'approved';
    onClick?: () => void;
}

const statusStyles = {
    draft: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    submitted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
};

export function DelegationCard({
    countryName,
    countryCode,
    federation,
    persons,
    singles,
    doubles,
    catering,
    status,
    onClick
}: DelegationCardProps) {
    return (
        <GlassCard
            onClick={onClick}
            hoverEffect={true}
            className="p-1 overflow-hidden"
        >
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 p-4 md:p-6">
                {/* Country & Federation */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight truncate">
                                    {countryName}
                                </h3>
                                <span className="px-2 py-0.5 rounded-md bg-[var(--glass-border)] text-[var(--text-muted)] text-[10px] font-black tracking-widest uppercase">
                                    {countryCode}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                <Shield className="w-3.5 h-3.5 text-brand-500" />
                                <p className="text-xs font-bold uppercase tracking-wider truncate opacity-70">
                                    {federation}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-center md:border-l border-[var(--glass-border)] md:pl-8">

                    {/* Headcount */}
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] opacity-60">Delegation</p>
                        <div className="flex items-center gap-2 bg-brand-500/5 px-2 py-1 rounded-lg border border-brand-500/10 w-fit">
                            <Users className="w-4 h-4 text-brand-500" />
                            <span className="text-lg font-black text-[var(--text-primary)] leading-none">{persons}</span>
                            <span className="text-[10px] font-bold text-[var(--text-muted)] mt-1 uppercase">Pax</span>
                        </div>
                    </div>

                    {/* Accommodation */}
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] opacity-60">Rooms</p>
                        <div className="flex gap-3">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tight">Singles</span>
                                <span className="text-sm font-black text-[var(--text-primary)]">{singles}</span>
                            </div>
                            <div className="w-px h-6 bg-[var(--glass-border)] mt-2" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tight">Doubles</span>
                                <span className="text-sm font-black text-[var(--text-primary)]">{doubles}</span>
                            </div>
                        </div>
                    </div>

                    {/* Catering & Status */}
                    <div className="flex flex-col gap-3 min-w-[140px]">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--glass-surface)] border border-[var(--glass-border)] shadow-sm">
                            <Utensils className="w-3.5 h-3.5 text-brand-500" />
                            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{catering}</span>
                        </div>

                        <div className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border flex items-center justify-center gap-2",
                            statusStyles[status]
                        )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", {
                                'bg-amber-500': status === 'draft',
                                'bg-blue-500': status === 'submitted',
                                'bg-emerald-500': status === 'approved'
                            })} />
                            {status}
                        </div>
                    </div>
                </div>

                {/* Action Indicator */}
                <div className="hidden md:flex items-center justify-center pl-4 group-hover:translate-x-1 transition-transform duration-300">
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-brand-500" />
                </div>
            </div>
        </GlassCard>
    );
}

import { ChevronRight, Users, Plane, Bus, Car, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { GlassCard } from '../../../components/ui/GlassCard';
import { getFlagUrl } from '../../../lib/countryUtils';

export interface DelegationListCardProps {
    countryName: string;
    countryCode: string;
    arrivalDate: string;
    arrivalTime?: string;
    arrivalPersons?: number;
    arrivalTransportReq?: boolean;
    departureDate: string;
    departureTime?: string;
    departurePersons?: number;
    departureTransportReq?: boolean;
    transportType?: 'plane' | 'bus' | 'car';
    persons: number;
    singles: number;
    doubles: number;
    cateringType: 'lunch_package' | 'hot_lunch' | 'none';
    trainingCount: number;
    status: 'draft' | 'submitted' | 'approved';
    onViewDetails?: () => void;
}

export function DelegationListCard({
    countryName,
    countryCode,
    arrivalDate,
    arrivalTime = '12:00',
    arrivalPersons = 0,
    arrivalTransportReq = false,
    departureDate,
    departureTime = '10:00',
    departurePersons = 0,
    departureTransportReq = false,
    transportType = 'plane',
    persons,
    singles,
    doubles,
    cateringType,
    trainingCount,
    status,
    onViewDetails
}: DelegationListCardProps) {

    const statusConfig = {
        draft: { label: 'Draft', classes: 'text-amber-500 bg-amber-500/5 border-amber-500/10' },
        submitted: { label: 'Submitted', classes: 'text-brand-500 bg-brand-500/5 border-brand-500/10' },
        approved: { label: 'Approved', classes: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' }
    };

    const TransportIcon = transportType === 'bus' ? Bus : transportType === 'car' ? Car : Plane;

    return (
        <div className="relative group">
            {/* Main Outer Container - Glassy Substrate */}
            <GlassCard className="p-1.5 overflow-hidden border-[var(--glass-border)] bg-[var(--glass-surface)]/10 hover:bg-[var(--glass-surface)]/20 hover:border-brand-500/50 transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

                    {/* ① IDENTITY MODULE */}
                    <div className="bg-[var(--glass-surface)]/40 rounded-xl p-5 border border-white/5 shadow-sm flex flex-col items-center text-center justify-center min-h-[160px]">
                        <div className="w-20 h-14 rounded-lg overflow-hidden border border-white/10 mb-3 shadow-md bg-white/5">
                            <img
                                src={getFlagUrl(countryCode)}
                                alt={countryName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight leading-tight">
                            {countryName}
                        </h3>
                        <span className="text-[10px] font-bold text-brand-500 mt-1 uppercase tracking-[0.2em]">{countryCode}</span>
                    </div>

                    {/* ② CAPACITY MODULE */}
                    <div className="bg-[var(--glass-surface)]/40 rounded-xl p-5 border border-white/5 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-brand-500/10">
                                <Users className="w-5 h-5 text-brand-500" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-brand-500 uppercase tracking-widest leading-none mb-1">Total</div>
                                <div className="text-2xl font-black text-[var(--text-primary)] leading-none">{persons} Pax</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Singles</span>
                                <span className="text-sm font-black text-[var(--text-primary)]">{singles}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Doubles</span>
                                <span className="text-sm font-black text-[var(--text-primary)]">{doubles}</span>
                            </div>
                        </div>
                    </div>

                    {/* ③ LOGISTICS MODULE */}
                    <div className="bg-[var(--glass-surface)]/40 rounded-xl p-5 border border-white/5 shadow-sm flex flex-col justify-center">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 mt-0.5">
                                    <TransportIcon className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Arrival</div>
                                        {arrivalPersons > 0 && <span className="text-[9px] font-bold text-[var(--text-muted)]">{arrivalPersons} Pax</span>}
                                    </div>
                                    <div className="text-sm font-black text-[var(--text-primary)]">{arrivalDate}</div>
                                    <div className="text-[11px] font-bold text-[var(--text-muted)] opacity-60 flex items-center gap-1.5 mt-0.5">
                                        <Clock className="w-3 h-3" /> {arrivalTime}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 pt-4 border-t border-white/5">
                                <div className="p-2 rounded-lg bg-brand-500/10 mt-0.5">
                                    <TransportIcon className="w-4 h-4 text-brand-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[10px] font-black text-brand-500 uppercase tracking-widest leading-none mb-1">Departure</div>
                                        {departurePersons > 0 && <span className="text-[9px] font-bold text-[var(--text-muted)]">{departurePersons} Pax</span>}
                                    </div>
                                    <div className="text-sm font-black text-[var(--text-primary)]">{departureDate}</div>
                                    <div className="text-[11px] font-bold text-[var(--text-muted)] opacity-60 flex items-center gap-1.5 mt-0.5">
                                        <Clock className="w-3 h-3" /> {departureTime}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ④ SERVICES MODULE */}
                    <div className="bg-[var(--glass-surface)]/40 rounded-xl p-5 border border-white/5 shadow-sm flex flex-col justify-center relative overflow-hidden">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest opacity-60">Catering</p>
                                    <p className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest">
                                        {cateringType === 'lunch_package' ? 'Lunch Pkg' : cateringType === 'hot_lunch' ? 'Hot Lunch' : 'Std HB'}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest opacity-60">Training</p>
                                    <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">{trainingCount} Sess.</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Transport</span>
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-2 h-2 rounded-full", (arrivalTransportReq || departureTransportReq) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/10")} />
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest", (arrivalTransportReq || departureTransportReq) ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] opacity-40")}>
                                            {(arrivalTransportReq || departureTransportReq) ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className={cn(
                                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                        statusConfig[status].classes
                                    )}>
                                        {statusConfig[status].label}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest">View Details</span>
                                        <ChevronRight className="w-3 h-3 text-brand-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}

import { useMemo } from 'react';
import { useAdminStore } from '../../../../store/adminStore';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { MapPin, Users, Building2, TrendingUp } from 'lucide-react';

interface CityViewProps {
    dateFrom: string;
    dateTo: string;
    city?: string;
}

export function CityView({ dateFrom, dateTo, city }: CityViewProps) {
    const { getCityReports } = useAdminStore();

    const reports = useMemo(() => {
        return getCityReports({ dateFrom, dateTo, city });
    }, [getCityReports, dateFrom, dateTo, city]);

    if (reports.length === 0) {
        return (
            <GlassCard className="p-20 text-center border-dashed border-2">
                <MapPin className="w-20 h-20 text-[var(--text-muted)] mx-auto mb-6 opacity-10" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">No Data for this Period</h3>
                <p className="text-[var(--text-muted)] max-w-md mx-auto font-medium">
                    Try adjusting your filters or ensure that hotel offers are confirmed and allocations are made.
                </p>
            </GlassCard>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
                <GlassCard key={report.city} className="p-8 text-left">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 mb-2">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase leading-none">{report.city}</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">Region Overview</p>
                        </div>

                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-500">Total Room Nights</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-[var(--text-primary)]">{report.total_rooms}</span>
                                    <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-500">Reserved Room Nights</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-[var(--text-primary)] text-emerald-500">{report.used_rooms}</span>
                                    <TrendingUp className="w-4 h-4 text-emerald-500/50" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-500">Total Persons Capacity</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-[var(--text-primary)]">{report.used_capacity}</span>
                                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">of {report.total_capacity}</span>
                                    <Users className="w-4 h-4 text-[var(--text-muted)]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-500">Occupancy %</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-black text-[var(--text-primary)]">{report.occupancy_percentage.toFixed(1)}%</span>
                                    <div className="flex-1 h-3 bg-[var(--app-bg)]/50 rounded-full border border-[var(--glass-border)] overflow-hidden">
                                        <div
                                            className="h-full bg-brand-500 transition-all duration-500 shadow-[0_0_10px_rgba(var(--brand-500-rgb),0.5)]"
                                            style={{ width: `${report.occupancy_percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}

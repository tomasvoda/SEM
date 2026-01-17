import { useMemo } from 'react';
import { useAdminStore } from '../../../../store/adminStore';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { format, parseISO } from 'date-fns';
import { Users, Hotel as HotelIcon, Calendar, Info } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface DailyDetailViewProps {
    date: string;
    hotelId: string;
}

export function DailyDetailView({ date, hotelId }: DailyDetailViewProps) {
    const { getDelegationStayReports } = useAdminStore();

    const reports = useMemo(() => {
        if (!date || !hotelId) return [];
        return getDelegationStayReports({
            dateFrom: date,
            dateTo: date,
            hotelId
        });
    }, [getDelegationStayReports, date, hotelId]);

    const totals = useMemo(() => {
        return reports.reduce((acc, r) => ({
            rooms: acc.rooms + r.rooms_reserved,
            persons: acc.persons + r.persons
        }), { rooms: 0, persons: 0 });
    }, [reports]);

    if (!hotelId || !date) {
        return (
            <GlassCard className="p-20 text-center border-dashed border-2">
                <Info className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-6 opacity-20" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">Select Hotel & Date</h3>
                <p className="text-[var(--text-muted)] max-w-sm mx-auto font-medium">Please use the filters above to select a specific hotel and date for the breakdown.</p>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="p-4 flex items-center gap-4 border-l-4 border-l-brand-500">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Persons</p>
                        <p className="text-xl font-black text-[var(--text-primary)]">{totals.persons}</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <HotelIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Rooms</p>
                        <p className="text-xl font-black text-[var(--text-primary)]">{totals.rooms}</p>
                    </div>
                </GlassCard>
                <GlassCard className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Selected Date</p>
                        <p className="text-xl font-black text-[var(--text-primary)]">{format(parseISO(date), 'dd MMM yyyy')}</p>
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--glass-surface)]/50 border-b border-[var(--glass-border)]">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Delegation</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Capacity</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center">Rooms</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center">Persons</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-[var(--text-muted)] italic font-medium">
                                    No allocations found for this hotel on the selected date.
                                </td>
                            </tr>
                        ) : (
                            reports.map((report: any, idx: number) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-black text-[var(--text-primary)] uppercase tracking-tight">{report.delegation_name}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-0.5 rounded bg-[var(--app-bg)]/50 border border-[var(--glass-border)] text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                            {report.room_capacity} BEDS
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-black">{report.rooms_reserved}</td>
                                    <td className="p-4 text-center font-black">{report.persons}</td>
                                    <td className="p-4 text-right">
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                                            report.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                        )}>
                                            {report.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}

import { useMemo } from 'react';
import { useAdminStore } from '../../../../store/adminStore';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { format, parseISO } from 'date-fns';
import { Users, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface DelegationViewProps {
    dateFrom: string;
    dateTo: string;
    delegationId?: string;
    hotelId?: string;
}

export function DelegationView({ dateFrom, dateTo, delegationId, hotelId }: DelegationViewProps) {
    const { getDelegationStayReports } = useAdminStore();

    const reports = useMemo(() => {
        return getDelegationStayReports({ dateFrom, dateTo, delegationId, hotelId });
    }, [getDelegationStayReports, dateFrom, dateTo, delegationId, hotelId]);

    if (reports.length === 0) {
        return (
            <GlassCard className="p-20 text-center border-dashed border-2">
                <Users className="w-20 h-20 text-[var(--text-muted)] mx-auto mb-6 opacity-10" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">No Delegation Assignments</h3>
                <p className="text-[var(--text-muted)] max-w-md mx-auto font-medium">Verify that allocations are created and dates match your range.</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--glass-surface)]/50 border-b border-[var(--glass-border)]">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Delegation</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Date</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Hotel</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Capacity</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center">Rooms</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center">Persons</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {reports.map((report, idx) => (
                            <tr key={`${report.delegation_id}-${report.date}-${idx}`} className="hover:bg-white/5 transition-colors text-sm">
                                <td className="p-4 font-bold text-[var(--text-primary)] uppercase tracking-tight">{report.delegation_name}</td>
                                <td className="p-4 text-[var(--text-secondary)]">{format(parseISO(report.date), 'EEE, dd MMM')}</td>
                                <td className="p-4 text-[var(--text-muted)] font-bold">{report.hotel_name}</td>
                                <td className="p-4">
                                    <span className="text-[10px] font-black uppercase text-[var(--text-secondary)]">
                                        {report.room_capacity} BEDS
                                    </span>
                                </td>
                                <td className="p-4 text-center font-black text-brand-500">{report.rooms_reserved}</td>
                                <td className="p-4 text-center font-black">{report.persons}</td>
                                <td className="p-4 text-right">
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                                        report.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                            report.status === 'cancelled' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    )}>
                                        {report.status === 'confirmed' ? <CheckCircle2 className="w-3 h-3" /> :
                                            report.status === 'cancelled' ? <XCircle className="w-3 h-3" /> :
                                                <Clock className="w-3 h-3" />}
                                        {report.status}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}

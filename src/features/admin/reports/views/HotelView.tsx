import { useMemo } from 'react';
import { useAdminStore } from '../../../../store/adminStore';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { cn } from '../../../../lib/utils';
import { format, parseISO } from 'date-fns';
import { Hotel as HotelIcon } from 'lucide-react';

interface HotelViewProps {
    dateFrom: string;
    dateTo: string;
    city?: string;
    hotelId?: string;
    roomCapacity?: number;
}

export function HotelView({ dateFrom, dateTo, city, hotelId, roomCapacity }: HotelViewProps) {
    const { getHotelOccupancyReports } = useAdminStore();

    const reports = useMemo(() => {
        return getHotelOccupancyReports({ dateFrom, dateTo, city, hotelId, roomCapacity });
    }, [getHotelOccupancyReports, dateFrom, dateTo, city, hotelId, roomCapacity]);

    if (reports.length === 0) {
        return (
            <GlassCard className="p-20 text-center border-dashed border-2">
                <HotelIcon className="w-20 h-20 text-[var(--text-muted)] mx-auto mb-6 opacity-10" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">No Detailed Data</h3>
                <p className="text-[var(--text-muted)] max-w-md mx-auto font-medium">Try broader filters to see hotel occupancy breakdown.</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--glass-surface)]/50 border-b border-[var(--glass-border)]">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Hotel</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Date</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Capacity</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center">Total</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center">Reserved</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center">Available</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Occupancy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {reports.map((report: any, idx: number) => (
                            <tr key={`${report.hotel_id}-${report.date}-${report.room_capacity}-${idx}`} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-[var(--text-primary)]">{report.hotel_name}</td>
                                <td className="p-4 text-[var(--text-secondary)] font-medium">{format(parseISO(report.date), 'EEE, dd MMM yyyy')}</td>
                                <td className="p-4">
                                    <span className="px-2 py-0.5 rounded bg-[var(--app-bg)]/50 border border-[var(--glass-border)] text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                        {report.room_capacity} BEDS
                                    </span>
                                </td>
                                <td className="p-4 text-center font-black">{report.total_rooms}</td>
                                <td className="p-4 text-center text-emerald-500 font-black">{report.reserved_rooms}</td>
                                <td className="p-4 text-center font-black text-[var(--text-muted)]">{report.available_rooms}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <span className={cn(
                                            "text-xs font-black",
                                            report.occupancy_percentage > 95 ? "text-red-500" :
                                                report.occupancy_percentage > 80 ? "text-amber-500" :
                                                    "text-emerald-500"
                                        )}>
                                            {report.occupancy_percentage.toFixed(0)}%
                                        </span>
                                        <div className="w-16 h-1.5 bg-[var(--app-bg)]/50 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-500",
                                                    report.occupancy_percentage > 95 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                                        report.occupancy_percentage > 80 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                                                            "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                                )}
                                                style={{ width: `${report.occupancy_percentage}%` }}
                                            />
                                        </div>
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

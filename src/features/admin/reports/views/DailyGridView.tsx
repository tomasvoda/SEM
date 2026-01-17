import { useMemo } from 'react';
import { useAdminStore } from '../../../../store/adminStore';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { cn } from '../../../../lib/utils';
import { AlertCircle } from 'lucide-react';

interface DailyGridViewProps {
    dateFrom: string;
    dateTo: string;
    city?: string;
    mode?: 'hotel' | 'city';
}

export function DailyGridView({ dateFrom, dateTo, city, mode = 'hotel' }: DailyGridViewProps) {
    const { getDailyGridReports, getCityOccupancyGrid } = useAdminStore();

    const gridData = useMemo(() => {
        if (mode === 'city') {
            return getCityOccupancyGrid({ dateFrom, dateTo }).map(c => ({
                id: c.city,
                name: c.city,
                sub: '',
                days: c.days
            }));
        }
        return getDailyGridReports({ dateFrom, dateTo, city }).map(h => ({
            id: h.hotel_id,
            name: h.hotel_name,
            sub: h.city,
            days: h.days
        }));
    }, [mode, getDailyGridReports, getCityOccupancyGrid, dateFrom, dateTo, city]);

    const dates = useMemo(() => {
        try {
            return eachDayOfInterval({
                start: parseISO(dateFrom),
                end: parseISO(dateTo)
            });
        } catch (e) {
            return [];
        }
    }, [dateFrom, dateTo]);

    if (gridData.length === 0 || dates.length === 0) {
        return (
            <GlassCard className="p-20 text-center border-dashed border-2">
                <AlertCircle className="w-20 h-20 text-[var(--text-muted)] mx-auto mb-6 opacity-10" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">Grid Data Unavailable</h3>
                <p className="text-[var(--text-muted)] max-w-md mx-auto font-medium">Please select a valid date range to see the occupancy grid.</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[var(--glass-surface)]/50 border-b border-[var(--glass-border)]">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-left sticky left-0 bg-[var(--glass-surface)] z-10 min-w-[200px]">
                                {mode === 'city' ? 'City' : 'Hotel'}
                            </th>
                            {dates.map((date) => (
                                <th key={date.toISOString()} className="p-3 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center min-w-[60px] border-l border-[var(--glass-border)]">
                                    <div className="flex flex-col items-center">
                                        <span>{format(date, 'EEE')}</span>
                                        <span className="text-[var(--text-primary)]">{format(date, 'dd')}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {gridData.map((row) => (
                            <tr key={row.id} className="border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                                <td className="p-4 text-xs font-black text-[var(--text-primary)] uppercase tracking-tight sticky left-0 bg-[var(--app-bg)]/80 backdrop-blur-md z-10">
                                    {row.name}
                                    {row.sub && <div className="text-[9px] text-[var(--text-muted)] lowercase font-bold">{row.sub}</div>}
                                </td>
                                {row.days.map((day) => (
                                    <td
                                        key={day.date}
                                        className={cn(
                                            "p-1 border-l border-[var(--glass-border)] text-center transition-all group relative",
                                            day.status === 'unavailable' ? "bg-white/5" :
                                                day.status === 'critical' ? "bg-red-500/20 hover:bg-red-500/30" :
                                                    day.status === 'medium' ? "bg-amber-500/20 hover:bg-amber-500/30" :
                                                        "bg-emerald-500/5 hover:bg-emerald-500/15"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-10 flex items-center justify-center text-[10px] font-black rounded-lg transition-transform group-hover:scale-110",
                                            day.status === 'unavailable' ? "text-[var(--text-muted)] opacity-30" :
                                                day.status === 'critical' ? "text-red-500" :
                                                    day.status === 'medium' ? "text-amber-500" :
                                                        "text-emerald-500/60"
                                        )}>
                                            {day.status === 'unavailable' ? '' : `${day.occupancy_percentage.toFixed(0)}%`}
                                        </div>

                                        {/* Tooltip on hover */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap font-bold">
                                            {day.date}: {day.occupancy_percentage.toFixed(1)}% occupied
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="p-4 flex gap-6 items-center bg-[var(--glass-surface)]/20 border-t border-[var(--glass-border)]">
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Occupancy Legend:</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">Healthy (&lt;80%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" />
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">Waitlist (80-95%)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">Critical (&gt;95%)</span>
                </div>
            </div>
        </GlassCard>
    );
}

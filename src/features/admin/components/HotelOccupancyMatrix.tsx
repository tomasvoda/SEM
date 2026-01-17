import { useAdminStore } from '../../../store/adminStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { cn } from '../../../lib/utils';
import { format, parseISO } from 'date-fns';

interface HotelOccupancyMatrixProps {
    hotelId: string;
}

export function HotelOccupancyMatrix({ hotelId }: HotelOccupancyMatrixProps) {
    const { dailyCapacities, dailyCapacityAllocations } = useAdminStore();

    // 1. Get all capacities for this hotel
    const hotelCapacities = dailyCapacities.filter(c => c.hotel_id === hotelId);

    // 2. Extract unique dates and sort them
    const dates = Array.from(new Set(hotelCapacities.map(c => c.date))).sort();

    // 3. Room types we care about (capacity: 1, 2, 3)
    const roomTypes = [
        { capacity: 1, label: 'Single' },
        { capacity: 2, label: 'Double' },
        { capacity: 3, label: 'Triple' }
    ];

    if (dates.length === 0) {
        return (
            <GlassCard className="p-12 text-center">
                <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">
                    No occupancy data available for this hotel.
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-2 italic">
                    Occupancy is generated from confirmed hotel offers.
                </p>
            </GlassCard>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">Occupancy Matrix</h3>
                    <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-black">Room-type breakdown per day</p>
                </div>
            </div>

            <GlassCard className="overflow-hidden border-[var(--glass-border)]">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[var(--glass-surface)]/50">
                                <th className="p-4 text-left border-b border-r border-[var(--glass-border)] min-w-[140px]">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Room Type \ Date</span>
                                </th>
                                {dates.map(date => (
                                    <th key={date} className="p-4 text-center border-b border-[var(--glass-border)] min-w-[100px]">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black text-[var(--text-primary)]">{format(parseISO(date), 'dd MMM')}</span>
                                            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase">{format(parseISO(date), 'EEE')}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {roomTypes.map(type => {
                                // Check if this room type exists at all for this hotel
                                const hasType = hotelCapacities.some(c => c.room_capacity === type.capacity);
                                if (!hasType) return null;

                                return (
                                    <tr key={type.capacity} className="hover:bg-[var(--glass-surface)]/30 transition-colors">
                                        <td className="p-4 border-r border-b border-[var(--glass-border)] bg-[var(--glass-surface)]/20">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">{type.label}</span>
                                                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{type.capacity} Bed{type.capacity > 1 ? 's' : ''}</span>
                                            </div>
                                        </td>
                                        {dates.map(date => {
                                            const capacity = hotelCapacities.find(c => c.date === date && c.room_capacity === type.capacity);

                                            if (!capacity) {
                                                return <td key={date} className="p-4 border-b border-[var(--glass-border)] text-center text-[var(--text-muted)] opacity-20">—</td>;
                                            }

                                            const reserved = dailyCapacityAllocations
                                                .filter(ca => ca.hotel_daily_capacity_id === capacity.id)
                                                .reduce((sum, ca) => sum + ca.rooms_reserved, 0);

                                            const occupancyPct = capacity.rooms_total > 0 ? (reserved / capacity.rooms_total) * 100 : 0;

                                            return (
                                                <td key={date} className="p-4 border-b border-[var(--glass-border)] text-center">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <span className={cn(
                                                                "text-sm font-black",
                                                                occupancyPct >= 100 ? "text-red-500" :
                                                                    occupancyPct >= 80 ? "text-amber-500" :
                                                                        reserved > 0 ? "text-emerald-500" : "text-[var(--text-primary)]"
                                                            )}>
                                                                {reserved}
                                                            </span>
                                                            <span className="text-[var(--text-muted)] text-[10px]">/</span>
                                                            <span className="text-sm font-bold text-[var(--text-secondary)]">
                                                                {capacity.rooms_total}
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-1 bg-[var(--glass-border)] rounded-full overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full transition-all duration-500",
                                                                    occupancyPct >= 100 ? "bg-red-500" :
                                                                        occupancyPct >= 80 ? "bg-amber-500" : "bg-emerald-500"
                                                                )}
                                                                style={{ width: `${Math.min(100, occupancyPct)}%` }}
                                                            />
                                                        </div>
                                                        {occupancyPct > 0 && (
                                                            <span className={cn(
                                                                "text-[8px] font-black uppercase tracking-widest",
                                                                occupancyPct >= 100 ? "text-red-500/70" :
                                                                    occupancyPct >= 80 ? "text-amber-500/70" : "text-emerald-500/70"
                                                            )}>
                                                                {Math.round(occupancyPct)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <div className="flex gap-6 mt-4 px-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Limited (80%+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Full (100%)</span>
                </div>
            </div>
        </div>
    );
}

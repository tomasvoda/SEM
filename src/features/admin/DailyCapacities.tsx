import { useAdminStore } from '../../store/adminStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { format, parseISO } from 'date-fns';
import { Calendar, Building2, Users } from 'lucide-react';
import { Breadcrumbs } from './components/Breadcrumbs';

export function DailyCapacities() {
    const { dailyCapacities, hotels } = useAdminStore();

    // Group capacities by date, then hotel
    const groupedByDate: Record<string, any> = {};

    dailyCapacities.forEach(cap => {
        if (!groupedByDate[cap.date]) {
            groupedByDate[cap.date] = {};
        }
        if (!groupedByDate[cap.date][cap.hotel_id]) {
            groupedByDate[cap.date][cap.hotel_id] = [];
        }
        groupedByDate[cap.date][cap.hotel_id].push(cap);
    });

    const sortedDates = Object.keys(groupedByDate).sort();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 text-left">
                <Breadcrumbs
                    items={[
                        { label: 'Daily Capacities' }
                    ]}
                />
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Daily Capacities</h1>
                <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">Confirmed inventory by night</p>
            </div>

            {sortedDates.length === 0 ? (
                <GlassCard className="p-20 text-center">
                    <Calendar className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-6 opacity-10" />
                    <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">No confirmed capacities generated yet.</p>
                    <p className="text-[var(--text-muted)] text-[10px] mt-2 italic">Confirm an offer to see daily availability here.</p>
                </GlassCard>
            ) : (
                <div className="space-y-8">
                    {sortedDates.map(date => (
                        <div key={date} className="space-y-4">
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                                        {format(parseISO(date), 'EEEE, MMMM do')}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-500/60">Inventory for this night</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(groupedByDate[date]).map(([hotelId, capacities]: [string, any]) => {
                                    const hotel = hotels.find(h => h.id === hotelId);
                                    const totalRooms = capacities.reduce((acc: number, c: any) => acc + c.rooms_total, 0);
                                    const totalCap = capacities.reduce((acc: number, c: any) => acc + c.capacity_total, 0);

                                    return (
                                        <GlassCard key={hotelId} className="p-6 text-left hover:border-brand-500/30 transition-all border border-[var(--glass-border)]">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                                        <Building2 className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-[var(--text-primary)] leading-tight">{hotel?.name}</h4>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{hotel?.city}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className="p-3 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)]">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Total Rooms</p>
                                                    <p className="text-lg font-black text-[var(--text-primary)]">{totalRooms}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)]">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Total Cap</p>
                                                    <p className="text-lg font-black text-brand-500">{totalCap}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-500/60 mb-2">Breakdown by Room Type</p>
                                                {capacities.map((c: any) => (
                                                    <div key={c.id} className="flex justify-between items-center text-[10px] border-b border-[var(--glass-border)] pb-2 last:border-0">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-3 h-3 text-[var(--text-muted)]" />
                                                            <span className="font-bold text-[var(--text-secondary)] uppercase tracking-tight">{c.room_type}</span>
                                                        </div>
                                                        <span className="font-black text-[var(--text-primary)]">
                                                            {c.rooms_total} rooms • {c.capacity_total} cap
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassCard>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

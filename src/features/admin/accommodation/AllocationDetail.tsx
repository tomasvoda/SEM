import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminStore } from '../../../store/adminStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { cn } from '../../../lib/utils';
import {
    ChevronLeft, Plus, Calendar,
    Hotel as HotelIcon, Users, CheckCircle2,
    XCircle, AlertTriangle, Save, ArrowRight,
    Building2
} from 'lucide-react';
import { format, parseISO, eachDayOfInterval, addDays } from 'date-fns';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AllocationFormModal } from './components/AllocationFormModal';

export function AllocationDetail() {
    const { id } = useParams();
    const {
        allocations, hotels, delegations, allocationRooms, dailyCapacities,
        updateAllocation, confirmAllocation, cancelAllocation, revertAllocationToDraft
    } = useAdminStore();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const allocation = allocations.find(a => a.id === id);
    const hotel = hotels.find(h => h.id === allocation?.hotel_id);
    const delegation = delegations.find(d => d.id === allocation?.delegation_id);
    const rooms = allocationRooms.filter(r => r.allocation_id === id);

    const [localNote, setLocalNote] = useState(allocation?.note || '');

    if (!allocation || !hotel || !delegation) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Allocation not found</h2>
                <Link to="/admin/accommodation/allocations" className="text-brand-500 hover:underline mt-4 inline-block font-bold uppercase tracking-widest text-xs">Back to allocations</Link>
            </div>
        );
    }

    const isConfirmed = allocation.status === 'confirmed';
    const isCancelled = allocation.status === 'cancelled';
    const isLocked = isConfirmed || isCancelled;

    // --- Availability Calculation ---
    const dateRange = useMemo(() => {
        try {
            const start = parseISO(allocation.date_from);
            const end = addDays(parseISO(allocation.date_to), -1);
            return eachDayOfInterval({ start, end });
        } catch (e) {
            return [];
        }
    }, [allocation.date_from, allocation.date_to]);

    const availabilityData = useMemo(() => {
        return dateRange.map(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            // Group by capacity found in hotel offers or current allocation
            const capacities = Array.from(new Set([
                ...dailyCapacities.filter(c => c.hotel_id === hotel.id && c.date === dateStr).map(c => c.room_capacity),
                ...rooms.map(r => r.room_capacity)
            ]));

            const roomStats = capacities.map(capacity => {
                // Total from Offers
                const total = dailyCapacities
                    .filter(c => c.hotel_id === hotel.id && c.date === dateStr && c.room_capacity === capacity)
                    .reduce((sum, c) => sum + c.rooms_total, 0);

                // Already reserved by OTHERS
                const reservedByOthers = allocations
                    .filter(a => a.id !== id && a.status === 'confirmed' && a.hotel_id === hotel.id)
                    .filter(a => {
                        const aStart = new Date(a.date_from);
                        const aEnd = new Date(a.date_to);
                        const target = new Date(dateStr);
                        return target >= aStart && target < aEnd;
                    })
                    .reduce((sum: number, a) => {
                        const aRooms = allocationRooms.filter(r => r.allocation_id === a.id && r.room_capacity === capacity);
                        return sum + aRooms.reduce((s: number, r) => s + r.rooms_count, 0);
                    }, 0);

                // Requested in THIS allocation
                const requested = rooms.find(r => r.room_capacity === capacity)?.rooms_count || 0;

                const availableValue = total - reservedByOthers;
                const remainingAfterThis = availableValue - requested;

                return {
                    capacity,
                    total,
                    reservedByOthers,
                    availableValue,
                    remainingAfterThis,
                    requested,
                    isOverbooked: requested > availableValue
                };
            });

            return {
                date: dateStr,
                roomStats
            };
        });
    }, [dateRange, hotel.id, dailyCapacities, allocations, allocationRooms, id]);

    const hasOverbooking = availabilityData.some(day => day.roomStats.some(rs => rs.isOverbooked));

    const handleConfirm = async () => {
        if (hasOverbooking) {
            alert('Cannot confirm: items are overbooked on some dates.');
            return;
        }
        const result = await confirmAllocation(id!);
        if (!result.success) {
            alert(result.error);
        }
    };

    const handleSaveNote = () => {
        updateAllocation(id!, { note: localNote });
        alert('Note saved');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Breadcrumbs
                    items={[
                        { label: 'Accommodation', path: '/admin/accommodation/allocations' },
                        { label: 'Allocations', path: '/admin/accommodation/allocations' },
                        { label: delegation.team_name }
                    ]}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-left">
                        <Link
                            to="/admin/accommodation/allocations"
                            className="p-2 rounded-xl bg-[var(--glass-surface)]/50 border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-brand-500 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Allocation Detail</h1>
                            <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">
                                {delegation.team_name} @ {hotel.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {!isLocked && (
                            <button
                                onClick={handleConfirm}
                                disabled={hasOverbooking || rooms.length === 0}
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Confirm Allocation
                            </button>
                        )}
                        {isConfirmed && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => revertAllocationToDraft(id!)}
                                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                                >
                                    <AlertTriangle className="w-5 h-5" />
                                    Modify (Back to Draft)
                                </button>
                                <button
                                    onClick={() => cancelAllocation(id!)}
                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-red-500/20"
                                >
                                    <XCircle className="w-5 h-5" />
                                    Cancel Allocation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* General Info */}
                <div className="lg:col-span-1 space-y-6">
                    <GlassCard className="p-6 text-left space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-500">General Information</h3>
                            <div className="flex items-center gap-2">
                                {!isLocked && (
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="p-2 rounded-lg bg-[var(--app-bg)]/50 border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-brand-500 transition-all"
                                        title="Edit general details"
                                    >
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </button>
                                )}
                                <div className={cn(
                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                                    isConfirmed ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                        isCancelled ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                            "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                )}>
                                    {allocation.status}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Delegation</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-primary)]">{delegation.team_name}</p>
                                        <p className="text-[9px] font-black uppercase text-[var(--text-muted)]">{delegation.federation}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Hotel</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                        <HotelIcon className="w-4 h-4" />
                                    </div>
                                    <p className="font-bold text-[var(--text-primary)]">{hotel.name}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Date Range</p>
                                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-bold">
                                        {format(parseISO(allocation.date_from), 'dd MMM yyyy')} – {format(parseISO(allocation.date_to), 'dd MMM yyyy')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Notes</label>
                                <textarea
                                    value={localNote}
                                    onChange={(e) => setLocalNote(e.target.value)}
                                    placeholder="Internal notes..."
                                    className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-brand-500/50 transition-all font-bold text-sm min-h-[100px] resize-none"
                                />
                                <button
                                    onClick={handleSaveNote}
                                    className="w-full py-2 bg-[var(--app-bg)] hover:bg-brand-500 hover:text-white border border-[var(--glass-border)] rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-3 h-3" />
                                    Save Note
                                </button>
                            </div>
                        </div>
                    </GlassCard>

                    {hasOverbooking && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4 text-left animate-pulse">
                            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                            <div>
                                <p className="font-black text-red-500 uppercase tracking-tight text-sm">Overbooking Detected</p>
                                <p className="text-red-500/70 text-[10px] font-bold uppercase tracking-widest mt-1">Requested rooms exceed available capacity on some dates. Confirmation disabled.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rooms Configuration */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6 text-left">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-500 text-left">Room Configuration</h3>
                            {!isLocked && (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500 text-brand-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-brand-500/20"
                                >
                                    <Plus className="w-3 h-3" />
                                    Modify Rooms
                                </button>
                            )}
                        </div>

                        {rooms.length === 0 ? (
                            <div className="py-12 text-center border-2 border-dashed border-[var(--glass-border)] rounded-2xl">
                                <Building2 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-10" />
                                <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px]">No rooms configured yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-y-2">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-left">Capacity</th>
                                            <th className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center w-32">Rooms</th>
                                            <th className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center w-32 text-right pr-4">Persons</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map((room) => (
                                            <tr key={room.id} className="group">
                                                <td className="px-4 py-3 bg-[var(--app-bg)]/50 border-y border-l border-[var(--glass-border)] rounded-l-xl">
                                                    <span className="font-bold text-[var(--text-primary)]">{room.room_capacity} BEDS</span>
                                                </td>
                                                <td className="px-4 py-3 bg-[var(--app-bg)]/50 border-y border-[var(--glass-border)] text-center">
                                                    <p className="font-black text-[var(--text-primary)]">{room.rooms_count}</p>
                                                </td>
                                                <td className="px-4 py-3 bg-[var(--app-bg)]/50 border-y border-r border-[var(--glass-border)] rounded-r-xl text-right pr-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Users className="w-3.5 h-3.5 text-brand-500" />
                                                        <span className="font-black text-[var(--text-secondary)]">
                                                            {(room.rooms_count || 0) * (room.room_capacity || 0)}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </GlassCard>

                    {/* Availability Preview */}
                    <GlassCard className="p-6 text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-500">Availability Preview</h3>
                            <div className="flex items-center gap-4 ml-auto">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">Available</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">Full / Overbooked</span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-[10px]">
                                <thead>
                                    <tr>
                                        <th className="sticky left-0 bg-[var(--app-bg)] z-10 px-4 py-3 font-black uppercase tracking-widest text-[var(--text-muted)] text-left border-b border-[var(--glass-border)]">Date</th>
                                        {availabilityData[0]?.roomStats.map(rs => (
                                            <th key={rs.capacity} className="px-4 py-3 font-black uppercase tracking-widest text-[var(--text-muted)] text-center border-b border-[var(--glass-border)] min-w-[100px]">
                                                {rs.capacity} BEDS
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {availabilityData.map(day => (
                                        <tr key={day.date} className="hover:bg-white/5 transition-colors">
                                            <td className="sticky left-0 bg-[var(--app-bg)]/90 backdrop-blur-sm z-10 px-4 py-3 font-bold text-[var(--text-primary)] border-b border-[var(--glass-border)]">
                                                {format(parseISO(day.date), 'EEE, dd MMM')}
                                            </td>
                                            {day.roomStats.map(rs => (
                                                <td key={rs.capacity} className={cn(
                                                    "px-2 py-3 border-b border-[var(--glass-border)] text-center transition-all",
                                                    rs.isOverbooked ? "bg-red-500/10" : ""
                                                )}>
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex justify-center items-center gap-1">
                                                            {rs.requested > 0 && <span className="font-black text-brand-500">{rs.requested}</span>}
                                                            {rs.requested > 0 && <ArrowRight className="w-2 h-2 text-[var(--text-muted)]" />}
                                                            <span className={cn(
                                                                "font-black p-1 rounded-md min-w-[24px]",
                                                                rs.remainingAfterThis < 0 ? "bg-red-500 text-white" :
                                                                    rs.remainingAfterThis === 0 ? "bg-amber-500/20 text-amber-500" :
                                                                        "bg-emerald-500/10 text-emerald-500"
                                                            )}>
                                                                {rs.remainingAfterThis}
                                                            </span>
                                                        </div>
                                                        <span className="text-[7px] text-[var(--text-muted)] font-bold uppercase">of {rs.availableValue} free</span>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </div>

            <AllocationFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                allocationId={id}
            />
        </div>
    );
}

import { useState, useEffect, useMemo } from 'react';
import { useAdminStore } from '../../../../store/adminStore';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { Select } from '../../../../components/ui/Select';
import { X, Calendar, Users, Hotel, Info } from 'lucide-react';
import { EVENT_START_DATE, EVENT_END_DATE } from '../../../../types/admin';

interface AllocationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    allocationId?: string;
}

export function AllocationFormModal({ isOpen, onClose, allocationId }: AllocationFormModalProps) {
    const {
        delegations,
        hotels,
        allocations,
        allocationRooms,
        dailyCapacities,
        addAllocation,
        updateAllocation
    } = useAdminStore();

    const [formData, setFormData] = useState({
        delegation_id: '',
        hotel_id: '',
        date_from: '',
        date_to: '',
        note: ''
    });

    const [rooms, setRooms] = useState<Array<{ room_capacity: number; rooms_count: number }>>([]);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!allocationId;

    // Derived: Current selection's availability (DERIVED AT RUNTIME)
    const availabilityMap = useMemo(() => {
        if (!formData.hotel_id || !formData.date_from || !formData.date_to) return {};

        const start = new Date(formData.date_from);
        const end = new Date(formData.date_to);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (nights <= 0) return {};

        const map: Record<number, number> = {};

        // Find all capacities for this hotel
        const hotelCaps = dailyCapacities.filter(c => c.hotel_id === formData.hotel_id);
        const uniqueCapacities = Array.from(new Set(hotelCaps.map(c => c.room_capacity)));

        uniqueCapacities.forEach(capSize => {
            let minAvailable = Infinity;

            for (let d = 0; d < nights; d++) {
                const current = new Date(start);
                current.setDate(start.getDate() + d);
                const dateStr = current.toISOString().split('T')[0];

                const dayCap = hotelCaps.find(c => c.date === dateStr && c.room_capacity === capSize);
                if (!dayCap) {
                    minAvailable = 0;
                    break;
                }

                // Sum all confirmed allocations for this day/capacity
                const reserved = allocations
                    .filter(a => a.id !== allocationId && a.status === 'confirmed' && a.hotel_id === formData.hotel_id)
                    .filter(a => {
                        const aStart = new Date(a.date_from);
                        const aEnd = new Date(a.date_to);
                        const target = new Date(dateStr);
                        return target >= aStart && target < aEnd;
                    })
                    .reduce((sum: number, a) => {
                        const aRooms = allocationRooms.filter(r => r.allocation_id === a.id && r.room_capacity === capSize);
                        return sum + aRooms.reduce((s: number, r) => s + r.rooms_count, 0);
                    }, 0);

                const available = dayCap.rooms_total - reserved;
                if (available < minAvailable) minAvailable = available;
            }

            if (minAvailable === Infinity) minAvailable = 0;
            map[capSize] = Math.max(0, minAvailable);
        });

        return map;
    }, [formData.hotel_id, formData.date_from, formData.date_to, dailyCapacities, allocations, allocationRooms, allocationId]);

    // date picker boundaries
    const dateBoundaries = useMemo(() => {
        const delegation = delegations.find(d => d.id === formData.delegation_id);
        const hotelOffers = hotels.find(h => h.id === formData.hotel_id) ?
            dailyCapacities.filter(c => c.hotel_id === formData.hotel_id) : [];

        if (!delegation) return { min: EVENT_START_DATE, max: EVENT_END_DATE };

        let min = delegation.arrival_date;
        let max = delegation.departure_date;

        if (hotelOffers.length > 0) {
            const offerDates = hotelOffers.map(c => c.date).sort();
            const offerMin = offerDates[0];
            const offerMaxStr = offerDates[offerDates.length - 1];

            // For checkout date, we need to allow 1 day AFTER the last offered night.
            // e.g. If offer is nights 15..20, checkout can be 21.
            const maxDate = new Date(offerMaxStr);
            maxDate.setDate(maxDate.getDate() + 1);
            const offerMaxCheckout = maxDate.toISOString().split('T')[0];

            if (offerMin > min) min = offerMin;
            if (offerMaxCheckout < max) max = offerMaxCheckout;
        }

        return { min, max };
    }, [formData.delegation_id, formData.hotel_id, delegations, hotels, dailyCapacities]);

    const totalRooms = rooms.reduce((sum, r) => sum + r.rooms_count, 0);
    const totalBeds = rooms.reduce((sum, r) => sum + (r.rooms_count * r.room_capacity), 0);

    // Initial Load & Reset
    useEffect(() => {
        if (isOpen) {
            if (allocationId) {
                const alloc = allocations.find(a => a.id === allocationId);
                if (alloc) {
                    setFormData({
                        delegation_id: alloc.delegation_id,
                        hotel_id: alloc.hotel_id,
                        date_from: alloc.date_from,
                        date_to: alloc.date_to,
                        note: alloc.note || ''
                    });
                    const existingRooms = allocationRooms.filter(r => r.allocation_id === allocationId);
                    setRooms(existingRooms.map(r => ({ room_capacity: r.room_capacity, rooms_count: r.rooms_count })));
                }
            } else {
                setFormData({ delegation_id: '', hotel_id: '', date_from: '', date_to: '', note: '' });
                setRooms([]);
                setSubmitError(null);
            }
        }
    }, [isOpen, allocationId, allocations, allocationRooms]);

    // Prefill from Delegation logic
    useEffect(() => {
        if (!isEditing && formData.delegation_id) {
            const delegation = delegations.find(d => d.id === formData.delegation_id);
            if (delegation) {
                // Default: use delegation overall dates
                let newDateFrom = delegation.arrival_date;
                let newDateTo = delegation.departure_date;
                let newHotelId = '';

                // Try to find specific accommodation request preference (use the FIRST block)
                if (Array.isArray(delegation.accommodation_request) && delegation.accommodation_request.length > 0) {
                    const firstBlock = delegation.accommodation_request[0] as any;

                    if (firstBlock.hotel) {
                        const matchedHotel = hotels.find(h => h.name === firstBlock.hotel);
                        if (matchedHotel) newHotelId = matchedHotel.id;
                    }

                    if (firstBlock.checkIn) newDateFrom = firstBlock.checkIn;
                    if (firstBlock.checkOut) newDateTo = firstBlock.checkOut;
                }

                // CLAMP DATES TO HOTEL AVAILABILITY IF HOTEL SELECTED (or pre-selected)
                const targetHotelId = newHotelId || formData.hotel_id;
                if (targetHotelId) {
                    const hotelOffers = dailyCapacities.filter(c => c.hotel_id === targetHotelId);
                    if (hotelOffers.length > 0) {
                        const offerDates = hotelOffers.map(c => c.date).sort();
                        const offerMin = offerDates[0];
                        const offerMax = offerDates[offerDates.length - 1];

                        // Clamp Start
                        if (newDateFrom < offerMin) newDateFrom = offerMin;
                        // Clamp End
                        if (newDateTo > offerMax) newDateTo = offerMax;
                    }
                }

                setFormData(prev => ({
                    ...prev,
                    date_from: newDateFrom,
                    // Ensure date_to is at least 1 day after date_from
                    date_to: newDateTo > newDateFrom ? newDateTo : newDateFrom,
                    hotel_id: newHotelId || prev.hotel_id
                }));
            }
        }
    }, [formData.delegation_id, delegations, hotels, isEditing]);

    // Room Allocation Logic: Preference vs Auto-Substitute
    useEffect(() => {
        if (!isEditing && formData.hotel_id && formData.delegation_id && Object.keys(availabilityMap).length > 0) {
            const delegation = delegations.find(d => d.id === formData.delegation_id);
            const selectedHotel = hotels.find(h => h.id === formData.hotel_id);

            if (delegation && selectedHotel) {

                // 1. CHECK FOR SPECIFIC MATCHING REQUEST
                let matchingRequest: any = null;
                if (Array.isArray(delegation.accommodation_request)) {
                    matchingRequest = delegation.accommodation_request.find((r: any) => r.hotel === selectedHotel.name);
                }

                if (matchingRequest && Array.isArray(matchingRequest.rooms)) {
                    // Use the specific requested breakdown
                    setRooms(matchingRequest.rooms.map((r: any) => ({
                        room_capacity: r.capacity || r.room_capacity,
                        rooms_count: r.count || r.rooms_count
                    })));

                } else {
                    // 2. FALLBACK: AUTO-SUBSTITUTION ALGORITHM
                    const availableSingles = availabilityMap[1] || 0;
                    const availableDoubles = availabilityMap[2] || 0;

                    const newAllocation: Record<number, number> = {};

                    // a. Alloc Singles (Max available)
                    let allocatedSingles = Math.min(delegation.required_singles, availableSingles);
                    newAllocation[1] = allocatedSingles;

                    // b. Substitute remaining Singles with Doubles
                    let remainingSingles = delegation.required_singles - allocatedSingles;

                    // RULE: 1 Person -> 1 Double Room (1:1 Substitution for Single Use)
                    let doublesForSingles = remainingSingles;
                    // Actually, if we put a single person in a double room, it consumes 1 Double Room.
                    // If we put 2 "remaining singles" people, they might share?
                    // The standard substitution logic is usually: Give them a double room for single use.
                    // So 1 remaining single -> consumes 1 double room.
                    // BUT here, let's assume worst case: 1 person needs 1 bed.
                    // If we use doubles for singles, maybe we put 2 people in 1 double?
                    // Let's stick to the previous simple logic: 1 remaining single -> 0.5 double? 
                    // No, let's just stick to "Try to fill doubles".

                    // Wait, previous logic was `Math.ceil(remainingSingles / 2)`. This implies 2 people sharing a substituted room.
                    // If the delegation requested SINGLES, they typically want privacy. 
                    // But if singles are out, maybe they share? Or maybe they get 1 double for single use.
                    // Given the "Bed" constraint, let's assume Single Use in Double Room = 1 Double Room.
                    // So `doublesForSingles = remainingSingles`.
                    // BUT, I will stick to what was there (`ceil(remaining / 2)`) assuming they might pair up if forced.

                    // 3. Alloc Doubles
                    let totalDoublesNeeded = delegation.required_doubles + doublesForSingles;
                    let allocatedDoubles = Math.min(totalDoublesNeeded, availableDoubles);
                    newAllocation[2] = allocatedDoubles;

                    setRooms(Object.entries(newAllocation).map(([cap, count]) => ({
                        room_capacity: parseInt(cap),
                        rooms_count: count
                    })));
                }
            }
        }
    }, [formData.hotel_id, formData.delegation_id, availabilityMap, delegations, hotels, isEditing]);

    const handleRoomChange = (index: number, value: number) => {
        setRooms(prev => prev.map((r, i) => {
            if (i === index) {
                const max = availabilityMap[r.room_capacity] ?? 0;
                return { ...r, rooms_count: Math.max(0, Math.min(value, max)) };
            }
            return r;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!formData.delegation_id || !formData.hotel_id || !formData.date_from || !formData.date_to) {
            setSubmitError("Please fill in all required fields.");
            return;
        }

        if (new Date(formData.date_to) <= new Date(formData.date_from)) {
            setSubmitError("Check-out date must be after Check-in date (Minimum 1 night).");
            return;
        }

        const validRooms = rooms.filter(r => r.rooms_count > 0);
        if (validRooms.length === 0) {
            setSubmitError("Please specify at least one room with count > 0.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = isEditing && allocationId
                ? await updateAllocation(allocationId, { ...formData, rooms: validRooms })
                : await addAllocation({ ...formData, rooms: validRooms });

            if (result.success) {
                onClose();
            } else {
                setSubmitError(result.error || "Failed to save allocation.");
            }
        } catch (err: any) {
            setSubmitError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <GlassCard className="w-full max-w-2xl p-8 relative overflow-y-auto max-h-[95vh] border-brand-500/20">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/10 transition-colors text-[var(--text-muted)]"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                        <Hotel className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                            {isEditing ? 'Update Allocation' : 'Create Allocation'}
                        </h2>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
                            Header-only allocation with room breakdown
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                <Users className="w-3 h-3" /> Delegation
                            </label>
                            <Select
                                value={formData.delegation_id}
                                onChange={(val) => setFormData({ ...formData, delegation_id: val })}
                                options={delegations.map((d: any) => ({
                                    value: d.id,
                                    label: `${d.team_name} (${d.required_persons} pers: ${d.required_singles} S, ${d.required_doubles}D)`
                                }))}
                                placeholder="Select delegation..."
                                disabled={isEditing}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                <Hotel className="w-3 h-3" /> Target Hotel
                            </label>
                            <Select
                                value={formData.hotel_id}
                                onChange={(val: string) => setFormData({ ...formData, hotel_id: val })}
                                options={hotels.map((h: any) => ({ value: h.id, label: h.name }))}
                                placeholder="Select hotel..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Arrival Date
                            </label>
                            <input
                                type="date"
                                value={formData.date_from}
                                min={dateBoundaries.min}
                                max={dateBoundaries.max}
                                onChange={(e) => setFormData({ ...formData, date_from: e.target.value })}
                                className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-brand-500/50 transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Departure Date
                            </label>
                            <input
                                type="date"
                                value={formData.date_to}
                                min={formData.date_from || dateBoundaries.min}
                                max={dateBoundaries.max}
                                onChange={(e) => setFormData({ ...formData, date_to: e.target.value })}
                                className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-brand-500/50 transition-all font-bold"
                            />
                        </div>
                    </div>

                    {/* Room Breakdown */}
                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Room Breakdown (Beds Based)</label>
                            <div className="flex gap-4">
                                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                    Total: {totalRooms} R / {totalBeds} B
                                </div>
                            </div>
                        </div>

                        {formData.hotel_id && rooms.length === 0 && (
                            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center">
                                <Info className="w-8 h-8 text-rose-500/50 mx-auto mb-2" />
                                <p className="text-xs font-bold text-[var(--text-muted)]">No rooms available in this hotel for selected dates.</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {rooms.map((room, idx) => (
                                <div key={idx} className="flex flex-col bg-white/5 p-4 rounded-2xl border border-white/10 group hover:border-brand-500/30 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">
                                                {room.room_capacity} BED ROOM
                                            </span>
                                            <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase">
                                                Available: {availabilityMap[room.room_capacity] ?? 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min="0"
                                            max={availabilityMap[room.room_capacity] ?? 0}
                                            value={room.rooms_count}
                                            onChange={(e) => handleRoomChange(idx, parseInt(e.target.value) || 0)}
                                            className="grow bg-[var(--app-bg)]/50 border border-white/10 rounded-xl px-3 py-2 text-xl font-black text-[var(--text-primary)] focus:outline-none focus:border-brand-500/50 transition-all"
                                        />
                                        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase h-full flex flex-col justify-center">
                                            Rooms
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Internal Note</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            placeholder="Add internal notes about this allocation..."
                            className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-brand-500/50 transition-all font-bold min-h-[80px] resize-none text-sm"
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                        {submitError && (
                            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                                {submitError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-4 rounded-xl border border-[var(--glass-border)] text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.delegation_id || !formData.hotel_id}
                                className="flex-[2] px-6 py-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Processing...' : (isEditing ? 'Update Allocation' : 'Create Allocation')}
                            </button>
                        </div>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}

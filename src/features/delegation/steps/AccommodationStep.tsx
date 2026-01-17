import { Trash2, Hotel, Calendar, Info, Plus, CheckSquare } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Select } from '../../../components/ui/Select';
import { useDelegationStore } from '../../../store/delegationStore';
import type { AccommodationBlock } from '../../../store/delegationStore';
import { cn } from '../../../lib/utils';
import { parseISO, differenceInDays, isValid } from 'date-fns';
import { EVENT_START_DATE, EVENT_END_DATE } from '../../../types/admin';

import { HOTEL_TO_CITY_MAPPING } from '../../../store/delegationStore';

const HOTEL_OPTIONS = Object.keys(HOTEL_TO_CITY_MAPPING).map(h => ({ value: h, label: h }));

export function AccommodationStep() {
    const { accommodation, setAccommodation, getEstimatedCosts, basics, pricing } = useDelegationStore();
    const costs = getEstimatedCosts();

    const handleAddBlock = () => {
        const newBlock: AccommodationBlock = {
            id: crypto.randomUUID(),
            hotel: '',
            checkIn: basics.dates.arrival || '',
            checkOut: basics.dates.departure || '',
            rooms: [{ capacity: 2, count: 0 }],
        };
        setAccommodation([...accommodation, newBlock]);
    };

    const updateBlock = (id: string, field: string, value: any) => {
        const newAccom = accommodation.map((block) => {
            if (block.id !== id) return block;
            return { ...block, [field]: value };
        });
        setAccommodation(newAccom);
    };

    const updateRoomCount = (blockId: string, capacity: number, count: number) => {
        const block = accommodation.find(b => b.id === blockId);
        if (!block) return;

        // Ensure we preserve other existing rooms and update/add the target one
        const existingRoom = block.rooms.find(r => r.capacity === capacity);
        let newRooms;

        if (existingRoom) {
            newRooms = block.rooms.map(r => r.capacity === capacity ? { ...r, count } : r);
        } else {
            newRooms = [...block.rooms, { capacity, count }];
        }

        updateBlock(blockId, 'rooms', newRooms);
    };


    const removeBlock = (id: string) => {
        setAccommodation(accommodation.filter((b) => b.id !== id));
    };

    const getBlockEstimate = (block: AccommodationBlock) => {
        if (!block.checkIn || !block.checkOut) return 0;
        const d1 = parseISO(block.checkIn);
        const d2 = parseISO(block.checkOut);
        if (!isValid(d1) || !isValid(d2)) return 0;
        const nights = Math.max(0, differenceInDays(d2, d1));

        const prices = pricing.accommodation[block.hotel as keyof typeof pricing.accommodation] || pricing.accommodation.default;

        let cost = 0;
        block.rooms.forEach(room => {
            const pricePerPerson = prices[room.capacity] || prices[1] || 0;
            cost += (room.count * room.capacity * pricePerPerson * nights);
        });
        return cost;
    };

    const isSubmitted = useDelegationStore(state => state.status === 'submitted');

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <fieldset disabled={isSubmitted} className="space-y-8 h-full w-full border-none p-0 m-0">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Accommodation Request</h2>
                    <p className="text-[var(--text-secondary)] font-medium">Define your team's room requirements.</p>
                </div>

                <div className="space-y-8">
                    {accommodation.map((block, index) => (
                        <GlassCard key={block.id} className="p-8 relative group overflow-hidden border-brand-500/10">
                            {!isSubmitted && (
                                <button
                                    onClick={() => removeBlock(block.id)}
                                    className="absolute top-6 right-6 p-2 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-black border border-brand-500/20">
                                    {index + 1}
                                </div>
                                <h3 className="font-black text-xl text-[var(--text-primary)] uppercase tracking-tight">
                                    {block.hotel || 'New Block'}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1 flex items-center gap-2">
                                        <Hotel className="w-3 h-3" /> Preferred Hotel
                                    </label>
                                    <Select
                                        value={block.hotel}
                                        onChange={(val) => updateBlock(block.id, 'hotel', val)}
                                        options={HOTEL_OPTIONS}
                                        placeholder="Select Competition Accommodation"
                                        disabled={isSubmitted}
                                    />
                                    {block.hotel && (
                                        <div className="text-[10px] uppercase font-bold text-brand-400 mt-2 flex items-center gap-1.5 ">
                                            Target City: {HOTEL_TO_CITY_MAPPING[block.hotel]}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> Check In
                                    </label>
                                    <input
                                        type="date"
                                        value={block.checkIn}
                                        min={EVENT_START_DATE}
                                        max={EVENT_END_DATE}
                                        onChange={(e) => updateBlock(block.id, 'checkIn', e.target.value)}
                                        className="w-full p-4 bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-2xl outline-none focus:border-brand-500/50 font-black transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> Check Out
                                    </label>
                                    <input
                                        type="date"
                                        value={block.checkOut}
                                        min={EVENT_START_DATE}
                                        max={EVENT_END_DATE}
                                        onChange={(e) => updateBlock(block.id, 'checkOut', e.target.value)}
                                        className="w-full p-4 bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-2xl outline-none focus:border-brand-500/50 font-black transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Room Breakdown by Capacity</label>
                                <div className="space-y-3">
                                    {(() => {
                                        const hotelPrices = pricing.accommodation[block.hotel as keyof typeof pricing.accommodation] || pricing.accommodation.default;
                                        // Capabilities defined in pricing config for this hotel
                                        const capabilities = [1, 2, 3, 4].filter(cap => hotelPrices[cap] !== undefined);

                                        const getLabel = (cap: number) => {
                                            if (cap === 1) return 'Single Room';
                                            if (cap === 2) return 'Double Room';
                                            if (cap === 3) return 'Triple Room';
                                            if (cap === 4) return 'Quadruple Room';
                                            return `${cap}-Bed Room`;
                                        };

                                        return capabilities.map(cap => {
                                            const roomData = block.rooms.find(r => r.capacity === cap);
                                            const count = roomData ? roomData.count : 0;

                                            return (
                                                <div key={cap} className="grid grid-cols-12 gap-4 items-center bg-black/20 p-4 rounded-2xl border border-white/5 group/row">
                                                    <div className="col-span-8 space-y-1">
                                                        <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-muted)] opacity-50">Room Type</label>
                                                        <div className="font-black text-[var(--text-primary)] text-lg">{getLabel(cap)}</div>
                                                    </div>
                                                    <div className="col-span-4 space-y-1">
                                                        <label className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-muted)] opacity-50">Count</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={count || ''}
                                                            onChange={(e) => updateRoomCount(block.id, cap, parseInt(e.target.value) || 0)}
                                                            className="w-full bg-transparent border-none text-emerald-400 font-black text-xl p-0 focus:outline-none placeholder:text-emerald-900 text-right"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>

                            <div className="flex justify-between items-end mt-10 pt-6 border-t border-[var(--glass-border)] border-dashed">
                                {(() => {
                                    const blockCapacity = block.rooms.reduce((s, r) => s + (r.capacity * r.count), 0);
                                    const totalPersons = basics.headCount.total;
                                    const isMatch = blockCapacity === totalPersons;

                                    return (
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Capacity Check</div>
                                            <div className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border shadow-lg transition-all",
                                                blockCapacity > 0
                                                    ? (isMatch ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5" : "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5")
                                                    : "bg-[var(--glass-border)]/5 text-[var(--text-muted)] border-transparent"
                                            )}>
                                                {blockCapacity > 0 && (isMatch ? <CheckSquare className="w-4 h-4" /> : <Info className="w-4 h-4" />)}
                                                {blockCapacity} / {totalPersons} Persons {isMatch ? 'OK' : 'Mismatch'}
                                            </div>
                                        </div>
                                    );
                                })()}
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Block Est. Price</div>
                                    <div className="text-3xl font-black text-brand-500 drop-shadow-sm">{getBlockEstimate(block).toLocaleString()} €</div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    {!isSubmitted && (
                        <button
                            onClick={handleAddBlock}
                            className="w-full py-8 border-2 border-dashed border-[var(--glass-border)] rounded-[2rem] flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] hover:border-brand-500/50 hover:text-brand-500 transition-all group bg-white/2 hover:bg-brand-500/5"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-[10px] mt-2">Add Another Stay Block</span>
                        </button>
                    )}

                    <div className="flex justify-end pt-8 border-t border-[var(--glass-border)]">
                        <div className="text-right bg-brand-500/5 p-6 rounded-[2rem] border border-brand-500/10">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-1">Total Stay Estimate</div>
                            <div className="text-5xl font-black text-brand-600 tracking-tighter">{costs.accommodation.toLocaleString()} €</div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    );
}

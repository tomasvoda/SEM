import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { delegationService } from '../services/delegationService';
import { hotelService } from '../services/hotelService';
import { capacityService } from '../services/capacityService';
import { allocationService } from '../services/allocationService';
import type {
    Hotel, HotelOffer, HotelOfferRoom, HotelOfferService, HotelDailyCapacity,
    AccommodationAllocation, AccommodationAllocationRoom, HotelDailyCapacityAllocation,
    Delegation, CityReport, HotelOccupancyReport, DelegationStayReport, HotelDailyGrid,
    DailyGridDay, CityOccupancyGrid
} from '../types/admin';

interface AdminState {
    hotels: Hotel[];
    offers: HotelOffer[];
    offerRooms: HotelOfferRoom[];
    offerServices: HotelOfferService[];
    dailyCapacities: HotelDailyCapacity[];
    delegations: Delegation[];
    allocations: AccommodationAllocation[];
    allocationRooms: AccommodationAllocationRoom[];
    dailyCapacityAllocations: HotelDailyCapacityAllocation[];

    isLoading: boolean;
    error: string | null;

    // Actions
    loadInitialData: () => Promise<void>;
    updateDelegation: (id: string, data: Partial<Delegation>) => Promise<void>;
    addHotel: (hotel: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateHotel: (id: string, hotel: Partial<Hotel>) => Promise<void>;
    deleteHotel: (id: string) => Promise<{ success: boolean; error?: string }>;

    addOffer: (offer: Omit<HotelOffer, 'id' | 'created_at' | 'updated_at' | 'nights'>) => Promise<string>;
    updateOffer: (id: string, offer: Partial<HotelOffer>) => Promise<void>;
    deleteOffer: (id: string) => Promise<boolean>;

    addOfferRoom: (room: Omit<HotelOfferRoom, 'id'>) => Promise<void>;
    updateOfferRoom: (id: string, room: Partial<HotelOfferRoom>) => Promise<void>;
    deleteOfferRoom: (id: string) => Promise<void>;

    addOfferService: (service: Omit<HotelOfferService, 'id'>) => void;
    updateOfferService: (id: string, service: Partial<HotelOfferService>) => void;
    deleteOfferService: (id: string) => void;

    // Accommodation Allocations
    addAllocation: (allocation: Omit<AccommodationAllocation, 'id' | 'status' | 'created_at' | 'updated_at'> & { rooms: Omit<AccommodationAllocationRoom, 'id' | 'allocation_id'>[] }) => Promise<{ success: boolean; id?: string; error?: string }>;
    updateAllocation: (id: string, allocation: Partial<AccommodationAllocation> & { rooms?: Omit<AccommodationAllocationRoom, 'id' | 'allocation_id'>[] }) => Promise<{ success: boolean; error?: string }>;
    deleteAllocation: (id: string) => Promise<boolean>;

    addAllocationRoom: (room: Omit<AccommodationAllocationRoom, 'id'>) => Promise<void>;
    updateAllocationRoom: (id: string, room: Partial<AccommodationAllocationRoom>) => void;
    deleteAllocationRoom: (id: string) => void;

    confirmAllocation: (id: string) => Promise<{ success: boolean; error?: string }>;
    cancelAllocation: (id: string) => Promise<void>;
    revertAllocationToDraft: (id: string) => void;
    resetAllocations: () => void;

    // Reporting Selectors
    getCityReports: (filters: { dateFrom: string; dateTo: string; city?: string }) => CityReport[];
    getHotelOccupancyReports: (filters: { dateFrom: string; dateTo: string; city?: string; hotelId?: string; roomCapacity?: number }) => HotelOccupancyReport[];
    getDelegationStayReports: (filters: { dateFrom: string; dateTo: string; delegationId?: string; hotelId?: string }) => DelegationStayReport[];
    getDailyGridReports: (filters: { dateFrom: string; dateTo: string; city?: string }) => HotelDailyGrid[];
    getCityOccupancyGrid: (filters: { dateFrom: string; dateTo: string }) => CityOccupancyGrid[];
}

const calculateNights = (from: string, to: string) => {
    if (!from || !to) return 0;
    const d1 = new Date(from);
    const d2 = new Date(to);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
    const diff = d2.getTime() - d1.getTime();
    const nights = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    // Safety cap: Never generate more than 90 days in one go to prevent freezing
    return Math.min(nights, 90);
};

export const useAdminStore = create<AdminState>()(
    persist(
        (set, get) => ({
            hotels: [],
            offers: [],
            offerRooms: [],
            offerServices: [],
            dailyCapacities: [],
            delegations: [],
            allocations: [],
            allocationRooms: [],
            dailyCapacityAllocations: [],
            isLoading: false,
            error: null,

            loadInitialData: async () => {
                set({ isLoading: true, error: null });
                try {
                    // 1. Fetch Core Data ( Critical )
                    const [hotels, delegations, capacities, allocations, rooms] = await Promise.all([
                        hotelService.getHotels(),
                        delegationService.getDelegations(),
                        capacityService.getDailyCapacities(),
                        allocationService.getAllocations(),
                        allocationService.getAllocationRooms()
                    ]);

                    console.log('Admin Core Data Loaded:', {
                        hotels: (hotels || []).length,
                        delegations: (delegations || []).length,
                        capacities: (capacities || []).length,
                        allocations: (allocations || []).length,
                        rooms: (rooms || []).length
                    });

                    // 2. Try Fetch Offers ( Optional / May fail if table missing )
                    let offers: any[] = [];
                    let offerRooms: any[] = [];
                    try {
                        const [fetchedOffers, fetchedOfferRooms] = await Promise.all([
                            hotelService.getOffers(),
                            hotelService.getOfferRooms()
                        ]);
                        offers = fetchedOffers || [];
                        offerRooms = fetchedOfferRooms || [];
                    } catch (offerErr) {
                        console.warn('Could not fetch offers (tables might be missing):', offerErr);
                        // Continue without offers
                    }

                    // 3. Generate Capacities from Confirmed Offers
                    const offerCapacities: HotelDailyCapacity[] = [];
                    (offers || []).filter((o: any) => o.status === 'confirmed').forEach((offer: any) => {
                        const offerRoomsList = (offerRooms || []).filter((r: any) => r.hotel_offer_id === offer.id);
                        const nights = calculateNights(offer.date_from, offer.date_to);
                        const startDate = new Date(offer.date_from);

                        for (let n = 0; n < nights; n++) {
                            const currentDate = new Date(startDate);
                            currentDate.setDate(startDate.getDate() + n);
                            const dateStr = currentDate.toISOString().split('T')[0];

                            offerRoomsList.forEach((room: any) => {
                                offerCapacities.push({
                                    id: `gen_${offer.id}_${dateStr}_${room.room_capacity}`,
                                    hotel_id: offer.hotel_id,
                                    hotel_offer_id: offer.id,
                                    date: dateStr,
                                    room_capacity: room.room_capacity,
                                    rooms_total: room.rooms_count,
                                    capacity_total: room.rooms_count * room.room_capacity,
                                    source: 'offer',
                                    created_at: offer.updated_at
                                });
                            });
                        }
                    });

                    // Combine DB capacities with Offer capacities
                    const allCapacities = [...capacities, ...offerCapacities];

                    // 4. Pre-index capacities for O(1) lookup: Map<"hotelId_date_capacity", HotelDailyCapacity>
                    const capacityLookup = new Map<string, HotelDailyCapacity>();
                    allCapacities.forEach(cap => {
                        const key = `${cap.hotel_id}_${cap.date}_${cap.room_capacity}`;
                        capacityLookup.set(key, cap);
                    });

                    // 5. Derive daily capacity allocations for reports
                    const derivedDailyAllocations: HotelDailyCapacityAllocation[] = [];
                    const confirmedAllocations = (allocations || []).filter((a: any) => a.status === 'confirmed');

                    confirmedAllocations.forEach((alloc: any) => {
                        const allocRooms = (rooms || []).filter(r => r.allocation_id === alloc.id);
                        if (allocRooms.length === 0) return;

                        const nightsCount = calculateNights(alloc.date_from, alloc.date_to);
                        const start = new Date(alloc.date_from);

                        for (let n = 0; n < nightsCount; n++) {
                            const current = new Date(start);
                            current.setDate(start.getDate() + n);
                            const dateStr = current.toISOString().split('T')[0];

                            allocRooms.forEach(room => {
                                const key = `${alloc.hotel_id}_${dateStr}_${room.room_capacity}`;
                                const cap = capacityLookup.get(key);

                                if (cap) {
                                    derivedDailyAllocations.push({
                                        id: `derived_${alloc.id}_${dateStr}_${room.room_capacity}_${room.id}`,
                                        hotel_daily_capacity_id: cap.id,
                                        allocation_id: alloc.id,
                                        delegation_id: alloc.delegation_id,
                                        rooms_reserved: room.rooms_count,
                                        created_at: alloc.created_at
                                    });
                                }
                            });
                        }
                    });

                    set({
                        hotels,
                        offers: offers as any, // Store offers too
                        offerRooms: offerRooms as any,
                        delegations,
                        dailyCapacities: allCapacities,
                        allocations: allocations as any,
                        allocationRooms: rooms,
                        dailyCapacityAllocations: derivedDailyAllocations,
                        isLoading: false
                    });
                } catch (err: any) {
                    console.error('Store Load Error:', err);
                    set({ error: err.message, isLoading: false });
                }
            },

            updateDelegation: async (id, data) => {
                try {
                    const updated = await delegationService.updateDelegation(id, data);
                    set((state) => ({
                        delegations: state.delegations.map((d) => d.id === id ? updated : d)
                    }));
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            addHotel: async (hotel) => {
                try {
                    const newHotel = await hotelService.createHotel(hotel);
                    set((state) => ({
                        hotels: [...state.hotels, newHotel]
                    }));
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            updateHotel: async (id, hotel) => {
                try {
                    const updated = await hotelService.updateHotel(id, hotel);
                    set((state) => ({
                        hotels: state.hotels.map((h) => h.id === id ? updated : h)
                    }));
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            deleteHotel: async (id) => {
                try {
                    await hotelService.deleteHotel(id);
                    set((state) => ({
                        hotels: state.hotels.filter((h) => h.id !== id)
                    }));
                    return { success: true };
                } catch (err: any) {
                    return { success: false, error: err.message };
                }
            },

            addOffer: async (offer) => {
                try {
                    const newOffer = await hotelService.createOffer(offer);
                    set((state) => ({
                        offers: [...state.offers, newOffer]
                    }));
                    return newOffer.id;
                } catch (err: any) {
                    console.error('Add Offer Error:', err);
                    set({ error: err.message });
                    return '';
                }
            },

            updateOffer: async (id, offerUpdate) => {
                try {
                    const updated = await hotelService.updateOffer(id, offerUpdate);

                    // Update state
                    set((state) => ({
                        offers: state.offers.map((o) => o.id === id ? updated : o)
                    }));

                    // Trigger capacity generation if status is confirmed
                    const state = get();
                    const transitionToConfirmed = updated.status === 'confirmed';

                    if (transitionToConfirmed) {
                        let newCapacities = state.dailyCapacities;
                        const rooms = state.offerRooms.filter(r => r.hotel_offer_id === id);

                        // 1. Remove old capacities for this offer
                        newCapacities = newCapacities.filter(c => c.hotel_offer_id !== id);

                        // 2. Generate new ones
                        const generated: HotelDailyCapacity[] = [];
                        const startDate = new Date(updated.date_from);

                        // Use validated nights from DB/updated object
                        const nights = calculateNights(updated.date_from, updated.date_to);

                        for (let n = 0; n < nights; n++) {
                            const currentDate = new Date(startDate);
                            currentDate.setDate(startDate.getDate() + n);
                            const dateStr = currentDate.toISOString().split('T')[0];

                            rooms.forEach(room => {
                                generated.push({
                                    id: 'cap_' + Math.random().toString(36).substr(2, 9),
                                    hotel_id: updated.hotel_id,
                                    hotel_offer_id: id,
                                    date: dateStr,
                                    room_capacity: room.room_capacity,
                                    rooms_total: room.rooms_count,
                                    capacity_total: room.rooms_count * room.room_capacity,
                                    source: 'offer',
                                    created_at: new Date().toISOString()
                                });
                            });
                        }

                        set({ dailyCapacities: [...newCapacities, ...generated] });
                    }
                } catch (err: any) {
                    console.error('Update Offer Error:', err);
                    set({ error: err.message });
                }
            },

            deleteOffer: async (id) => {
                const offer = get().offers.find(o => o.id === id);
                if (offer && offer.status === 'confirmed') {
                    // Optional: Allow deleting confirmed but warn? For now keep logic.
                    // Actually, let's allow backend to decide or keep UI logic.
                    // Store logic said: "if confirmed return false".
                    // Let's stick to that for safety.
                    return false;
                }

                try {
                    await hotelService.deleteOffer(id);
                    set((state) => ({
                        offers: state.offers.filter((o) => o.id !== id),
                        offerRooms: state.offerRooms.filter((r) => r.hotel_offer_id !== id),
                        offerServices: state.offerServices.filter((s) => s.hotel_offer_id !== id)
                    }));
                    return true;
                } catch (err: any) {
                    console.error('Delete Offer Error:', err);
                    set({ error: err.message });
                    return false;
                }
            },

            addOfferRoom: async (room) => {
                try {
                    const newRoom = await hotelService.createOfferRoom(room);
                    set((state) => ({
                        offerRooms: [...state.offerRooms, newRoom]
                    }));
                } catch (err: any) {
                    console.error('Add Offer Room Error:', err);
                    set({ error: err.message });
                }
            },

            updateOfferRoom: async (id, roomUpdate) => {
                try {
                    const updated = await hotelService.updateOfferRoom(id, roomUpdate);

                    set((state) => {
                        const newOfferRooms = state.offerRooms.map((r) => r.id === id ? updated : r);
                        return { offerRooms: newOfferRooms };
                    });

                    // Check if we need to regenerate capacities
                    const state = get();
                    const room = state.offerRooms.find(r => r.id === id);
                    if (!room) return;

                    const offer = state.offers.find(o => o.id === room.hotel_offer_id);
                    if (offer && offer.status === 'confirmed') {
                        const currentRooms = get().offerRooms.map((r: any) => r.id === id ? updated : r);

                        // 1. Remove old
                        const filteredCapacities = state.dailyCapacities.filter(c => c.hotel_offer_id !== offer.id);

                        // 2. Generate new
                        const generated: HotelDailyCapacity[] = [];
                        const startDate = new Date(offer.date_from);

                        for (let n = 0; n < offer.nights; n++) {
                            const currentDate = new Date(startDate);
                            currentDate.setDate(startDate.getDate() + n);
                            const dateStr = currentDate.toISOString().split('T')[0];

                            currentRooms.filter(r => r.hotel_offer_id === offer.id).forEach(r => {
                                generated.push({
                                    id: 'cap_' + Math.random().toString(36).substr(2, 9),
                                    hotel_id: offer.hotel_id,
                                    hotel_offer_id: offer.id,
                                    date: dateStr,
                                    room_capacity: r.room_capacity,
                                    rooms_total: r.rooms_count,
                                    capacity_total: r.rooms_count * r.room_capacity,
                                    source: 'offer',
                                    created_at: new Date().toISOString()
                                });
                            });
                        }
                        set({ dailyCapacities: [...filteredCapacities, ...generated] });
                    }

                } catch (err: any) {
                    console.error('Update Offer Room Error:', err);
                    set({ error: err.message });
                }
            },

            deleteOfferRoom: async (id) => {
                const room = get().offerRooms.find(r => r.id === id);
                if (!room) return;

                try {
                    await hotelService.deleteOfferRoom(id);

                    set((state) => ({
                        offerRooms: state.offerRooms.filter((r) => r.id !== id)
                    }));

                    // Logic to regenerate capacities if confirmed
                    const state = get();
                    const offer = state.offers.find(o => o.id === room.hotel_offer_id);

                    if (offer && offer.status === 'confirmed') {
                        let newCapacities = state.dailyCapacities;
                        newCapacities = newCapacities.filter(c => c.hotel_offer_id !== offer.id);

                        const rooms = state.offerRooms.filter(r => r.hotel_offer_id === offer.id); // room is already gone from state? yes set called above.

                        const generated: HotelDailyCapacity[] = [];
                        const startDate = new Date(offer.date_from);

                        for (let n = 0; n < offer.nights; n++) {
                            const currentDate = new Date(startDate);
                            currentDate.setDate(startDate.getDate() + n);
                            const dateStr = currentDate.toISOString().split('T')[0];

                            rooms.forEach(r => {
                                generated.push({
                                    id: 'cap_' + Math.random().toString(36).substr(2, 9),
                                    hotel_id: offer.hotel_id,
                                    hotel_offer_id: offer.id,
                                    date: dateStr,
                                    room_capacity: r.room_capacity,
                                    rooms_total: r.rooms_count,
                                    capacity_total: r.rooms_count * r.room_capacity,
                                    source: 'offer',
                                    created_at: new Date().toISOString()
                                });
                            });
                        }
                        set({ dailyCapacities: [...newCapacities, ...generated] });
                    }

                } catch (err: any) {
                    console.error('Delete Offer Room Error:', err);
                    set({ error: err.message });
                }
            },

            addOfferService: async (service) => {
                try {
                    const newService = await hotelService.createOfferService(service);
                    set((state) => ({
                        offerServices: [...state.offerServices, newService]
                    }));
                } catch (err: any) {
                    console.error('Add Offer Service Error:', err);
                    set({ error: err.message });
                }
            },

            updateOfferService: async (id, serviceUpdate) => {
                try {
                    const updated = await hotelService.updateOfferService(id, serviceUpdate);
                    set((state) => ({
                        offerServices: state.offerServices.map((s) => s.id === id ? updated : s)
                    }));
                } catch (err: any) {
                    console.error('Update Offer Service Error:', err);
                    set({ error: err.message });
                }
            },

            deleteOfferService: async (id) => {
                try {
                    await hotelService.deleteOfferService(id);
                    set((state) => ({
                        offerServices: state.offerServices.filter((s) => s.id !== id)
                    }));
                } catch (err: any) {
                    console.error('Delete Offer Service Error:', err);
                    set({ error: err.message });
                }
            },

            addAllocation: async (payload) => {
                const { rooms, ...allocation } = payload;
                try {
                    // 1. Create Header (Sanitized)
                    const newAlloc = await allocationService.createAllocation({
                        delegation_id: allocation.delegation_id,
                        hotel_id: allocation.hotel_id,
                        date_from: allocation.date_from,
                        date_to: allocation.date_to,
                        note: allocation.note
                    } as any);

                    // 2. Create Rooms
                    if (rooms && rooms.length > 0) {
                        await Promise.all(rooms.map(room =>
                            allocationService.addAllocationRoom({
                                ...room,
                                allocation_id: newAlloc.id
                            } as any)
                        ));
                    }

                    // Reload initial data to ensure all joins/relations are fresh
                    await get().loadInitialData();

                    return { success: true, id: newAlloc.id };
                } catch (err: any) {
                    console.error('Add Allocation Error:', err);
                    set({ error: err.message });
                    return { success: false, error: err.message };
                }
            },

            updateAllocation: async (id, payload) => {
                const { rooms, ...update } = payload;
                try {
                    // 1. Update Header (Sanitized)
                    const headerUpdate: any = {};
                    if (update.delegation_id !== undefined) headerUpdate.delegation_id = update.delegation_id;
                    if (update.hotel_id !== undefined) headerUpdate.hotel_id = update.hotel_id;
                    if (update.date_from !== undefined) headerUpdate.date_from = update.date_from;
                    if (update.date_to !== undefined) headerUpdate.date_to = update.date_to;
                    if (update.status !== undefined) headerUpdate.status = update.status;
                    if (update.note !== undefined) headerUpdate.note = update.note;

                    await allocationService.updateAllocation(id, headerUpdate);

                    // 2. Clear and Replace Rooms if provided
                    if (rooms) {
                        await allocationService.deleteAllocationRooms(id);
                        if (rooms.length > 0) {
                            await Promise.all(rooms.map(room =>
                                allocationService.addAllocationRoom({
                                    ...room,
                                    allocation_id: id
                                } as any)
                            ));
                        }
                    }

                    await get().loadInitialData();
                    return { success: true };
                } catch (err: any) {
                    console.error('Update Allocation Error:', err);
                    set({ error: err.message });
                    return { success: false, error: err.message };
                }
            },

            deleteAllocation: async (id) => {
                try {
                    await allocationService.updateAllocation(id, { status: 'cancelled' });
                    set((state) => ({
                        allocations: state.allocations.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)
                    }));
                    return true;
                } catch (err: any) {
                    set({ error: err.message });
                    return false;
                }
            },

            addAllocationRoom: async (room) => {
                try {
                    const newRoom = await allocationService.addAllocationRoom(room);
                    set((state) => ({
                        allocationRooms: [...state.allocationRooms, newRoom as any]
                    }));
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            updateAllocationRoom: (id, update) => set((state) => ({
                allocationRooms: state.allocationRooms.map(r => r.id === id ? { ...r, ...update } : r)
            })),

            deleteAllocationRoom: (id) => set((state) => ({
                allocationRooms: state.allocationRooms.filter(r => r.id !== id)
            })),

            revertAllocationToDraft: (id: string) => set((state) => ({
                allocations: state.allocations.map(a =>
                    a.id === id ? { ...a, status: 'draft', updated_at: new Date().toISOString() } : a
                ),
                dailyCapacityAllocations: state.dailyCapacityAllocations.filter(ca => ca.allocation_id !== id)
            })),

            resetAllocations: () => set({
                allocations: [],
                allocationRooms: [],
                dailyCapacityAllocations: []
            }),

            confirmAllocation: async (id) => {
                const state = get();
                const allocation = state.allocations.find(a => a.id === id);
                if (!allocation) return { success: false, error: 'Allocation not found.' };

                const rooms = state.allocationRooms.filter(r => r.allocation_id === id);
                if (rooms.length === 0) return { success: false, error: 'Add at least one room before confirming.' };

                try {
                    const confirmed = await allocationService.confirmAllocation(id);

                    // Re-calculate derived daily allocations
                    const nights = calculateNights(allocation.date_from, allocation.date_to);
                    const startDate = new Date(allocation.date_from);
                    const newDailyAllocations: HotelDailyCapacityAllocation[] = [];

                    for (let n = 0; n < nights; n++) {
                        const currentDate = new Date(startDate);
                        currentDate.setDate(startDate.getDate() + n);
                        const dateStr = currentDate.toISOString().split('T')[0];

                        rooms.forEach(room => {
                            const cap = state.dailyCapacities.find(c =>
                                c.hotel_id === allocation.hotel_id &&
                                c.date === dateStr &&
                                c.room_capacity === room.room_capacity
                            );
                            if (cap) {
                                newDailyAllocations.push({
                                    id: `derived_${id}_${dateStr}_${room.room_capacity}_${room.id}`,
                                    hotel_daily_capacity_id: cap.id,
                                    allocation_id: id,
                                    delegation_id: allocation.delegation_id,
                                    rooms_reserved: room.rooms_count,
                                    created_at: new Date().toISOString()
                                });
                            }
                        });
                    }

                    set((state) => ({
                        allocations: state.allocations.map(a => a.id === id ? confirmed as any : a),
                        dailyCapacityAllocations: [...state.dailyCapacityAllocations, ...newDailyAllocations]
                    }));
                    return { success: true };
                } catch (err: any) {
                    return { success: false, error: err.message };
                }
            },

            cancelAllocation: async (id) => {
                try {
                    const cancelled = await allocationService.cancelAllocation(id);
                    set((state) => ({
                        allocations: state.allocations.map(a => a.id === id ? cancelled as any : a),
                        dailyCapacityAllocations: state.dailyCapacityAllocations.filter(ca => ca.allocation_id !== id)
                    }));
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            // --- Reporting Selectors Implementation ---

            getCityReports: (filters) => {
                const { dailyCapacities, dailyCapacityAllocations, hotels } = get();
                const filteredCapacities = dailyCapacities.filter(c =>
                    c.date >= filters.dateFrom && c.date <= filters.dateTo
                );

                const cityData: Record<string, CityReport> = {};

                filteredCapacities.forEach(cap => {
                    const hotel = hotels.find(h => h.id === cap.hotel_id);
                    if (!hotel) return;
                    if (filters.city && hotel.city !== filters.city) return;

                    const city = hotel.city;
                    if (!cityData[city]) {
                        cityData[city] = {
                            city, total_rooms: 0, used_rooms: 0, available_rooms: 0,
                            total_capacity: 0, used_capacity: 0, occupancy_percentage: 0
                        };
                    }

                    const reserved = dailyCapacityAllocations
                        .filter(ca => ca.hotel_daily_capacity_id === cap.id)
                        .reduce((sum, ca) => sum + ca.rooms_reserved, 0);

                    cityData[city].total_rooms += cap.rooms_total;
                    cityData[city].used_rooms += reserved;
                    cityData[city].available_rooms += (cap.rooms_total - reserved);
                    cityData[city].total_capacity += cap.capacity_total;
                    cityData[city].used_capacity += (reserved * cap.room_capacity);
                });

                return Object.values(cityData).map(report => ({
                    ...report,
                    occupancy_percentage: report.total_rooms > 0
                        ? (report.used_rooms / report.total_rooms) * 100
                        : 0
                }));
            },

            getHotelOccupancyReports: (filters) => {
                const { dailyCapacities, dailyCapacityAllocations, hotels } = get();
                return dailyCapacities
                    .filter(cap => {
                        const hotel = hotels.find(h => h.id === cap.hotel_id);
                        return hotel &&
                            cap.date >= filters.dateFrom &&
                            cap.date <= filters.dateTo &&
                            (!filters.city || hotel.city === filters.city) &&
                            (!filters.hotelId || cap.hotel_id === filters.hotelId) &&
                            (!filters.roomCapacity || cap.room_capacity === filters.roomCapacity);
                    })
                    .map(cap => {
                        const hotel = hotels.find(h => h.id === cap.hotel_id)!;
                        const reserved = dailyCapacityAllocations
                            .filter(ca => ca.hotel_daily_capacity_id === cap.id)
                            .reduce((sum, ca) => sum + ca.rooms_reserved, 0);

                        return {
                            hotel_id: hotel.id,
                            hotel_name: hotel.name,
                            date: cap.date,
                            room_capacity: cap.room_capacity,
                            total_rooms: cap.rooms_total,
                            reserved_rooms: reserved,
                            available_rooms: cap.rooms_total - reserved,
                            occupancy_percentage: cap.rooms_total > 0 ? (reserved / cap.rooms_total) * 100 : 0
                        };
                    });
            },

            getDelegationStayReports: (filters) => {
                const { dailyCapacities, dailyCapacityAllocations, hotels, delegations, allocations } = get();
                return dailyCapacityAllocations
                    .filter(ca => {
                        const cap = dailyCapacities.find(c => c.id === ca.hotel_daily_capacity_id);
                        return cap &&
                            cap.date >= filters.dateFrom &&
                            cap.date <= filters.dateTo &&
                            (!filters.delegationId || ca.delegation_id === filters.delegationId) &&
                            (!filters.hotelId || cap.hotel_id === filters.hotelId);
                    })
                    .map(ca => {
                        const cap = dailyCapacities.find(c => c.id === ca.hotel_daily_capacity_id)!;
                        const hotel = hotels.find(h => h.id === cap.hotel_id)!;
                        const delegation = delegations.find(d => d.id === ca.delegation_id)!;
                        const allocation = allocations.find(a => a.id === ca.allocation_id)!;

                        return {
                            delegation_id: delegation.id,
                            delegation_name: delegation.team_name,
                            hotel_name: hotel.name,
                            date: cap.date,
                            room_capacity: cap.room_capacity,
                            rooms_reserved: ca.rooms_reserved,
                            persons: ca.rooms_reserved * cap.room_capacity,
                            status: allocation.status
                        };
                    });
            },

            getDailyGridReports: (filters) => {
                const { dailyCapacities, dailyCapacityAllocations, hotels } = get();
                const relevantHotels = hotels.filter(h => !filters.city || h.city === filters.city);

                // Get unique dates in range
                const dates: string[] = [];
                let curr = new Date(filters.dateFrom);
                const end = new Date(filters.dateTo);
                while (curr <= end) {
                    dates.push(curr.toISOString().split('T')[0]);
                    curr.setDate(curr.getDate() + 1);
                }

                return relevantHotels.map(hotel => {
                    const days: DailyGridDay[] = dates.map(date => {
                        const hotelDayCaps = dailyCapacities.filter(c => c.hotel_id === hotel.id && c.date === date);

                        if (hotelDayCaps.length === 0) {
                            return { date, occupancy_percentage: 0, status: 'unavailable' };
                        }

                        let totalCap = 0;
                        let usedCap = 0;

                        hotelDayCaps.forEach(cap => {
                            const reserved = dailyCapacityAllocations
                                .filter(ca => ca.hotel_daily_capacity_id === cap.id)
                                .reduce((sum, ca) => sum + ca.rooms_reserved, 0);

                            totalCap += cap.rooms_total;
                            usedCap += reserved;
                        });

                        const pct = totalCap > 0 ? (usedCap / totalCap) * 100 : 0;
                        let status: DailyGridDay['status'] = 'low';
                        if (pct > 95) status = 'critical';
                        else if (pct > 80) status = 'medium';

                        return { date, occupancy_percentage: pct, status };
                    });

                    return {
                        hotel_id: hotel.id,
                        hotel_name: hotel.name,
                        city: hotel.city,
                        days
                    };
                });
            },

            getCityOccupancyGrid: (filters) => {
                const { dailyCapacities, dailyCapacityAllocations, hotels } = get();
                const cities = Array.from(new Set(hotels.map(h => h.city)));

                const dates: string[] = [];
                let curr = new Date(filters.dateFrom);
                const end = new Date(filters.dateTo);
                while (curr <= end) {
                    dates.push(curr.toISOString().split('T')[0]);
                    curr.setDate(curr.getDate() + 1);
                }

                return cities.map(city => {
                    const hotelIdsInCity = hotels.filter(h => h.city === city).map(h => h.id);
                    const days: DailyGridDay[] = dates.map(date => {
                        const cityDayCaps = dailyCapacities.filter(c => hotelIdsInCity.includes(c.hotel_id) && c.date === date);

                        if (cityDayCaps.length === 0) {
                            return { date, occupancy_percentage: 0, status: 'unavailable' };
                        }

                        let totalCap = 0;
                        let usedCap = 0;

                        cityDayCaps.forEach(cap => {
                            const reserved = dailyCapacityAllocations
                                .filter(ca => ca.hotel_daily_capacity_id === cap.id)
                                .reduce((sum, ca) => sum + ca.rooms_reserved, 0);

                            totalCap += cap.rooms_total;
                            usedCap += reserved;
                        });

                        const pct = totalCap > 0 ? (usedCap / totalCap) * 100 : 0;
                        let status: DailyGridDay['status'] = 'low';
                        if (pct > 95) status = 'critical';
                        else if (pct > 80) status = 'medium';

                        return { date, occupancy_percentage: pct, status };
                    });

                    return { city, days };
                });
            }
        }),
        {
            name: 'sem-admin-storage-v2',
            partialize: (state) => ({
                hotels: state.hotels,
                offers: state.offers,
                offerRooms: state.offerRooms,
                offerServices: state.offerServices,
                delegations: state.delegations,
                allocations: state.allocations,
                allocationRooms: state.allocationRooms,
                // dailyCapacities and dailyCapacityAllocations are derived on load 
                // and should not be persisted to avoid huge storage writes and freezes.
            }),
        }
    )
);

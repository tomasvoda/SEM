import { supabase } from '../lib/supabaseClient';
import type { AccommodationAllocation, AccommodationAllocationRoom } from '../types/admin';

export const allocationService = {
    async getAllocations() {
        const { data, error } = await supabase
            .from('accommodation_allocations')
            .select(`
                id, delegation_id, hotel_id, date_from, date_to, status, note, created_at, updated_at,
                delegation:delegations(id, federation, country_code, team_name, arrival_date, departure_date, status),
                hotel:hotels(id, name, city)
            `)
            .order('date_from', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getAllocationDetail(id: string) {
        const [allocationResult, roomsResult] = await Promise.all([
            supabase
                .from('accommodation_allocations')
                .select(`
                    id, delegation_id, hotel_id, date_from, date_to, status, note, created_at, updated_at,
                    delegation:delegations(id, federation, country_code, team_name, arrival_date, departure_date, status),
                    hotel:hotels(id, name, city)
                `)
                .eq('id', id)
                .single(),
            supabase
                .from('accommodation_allocation_rooms')
                .select('id, allocation_id, room_capacity, rooms_count')
                .eq('allocation_id', id)
        ]);

        if (allocationResult.error) throw allocationResult.error;
        if (roomsResult.error) throw roomsResult.error;

        return {
            allocation: allocationResult.data,
            rooms: roomsResult.data
        };
    },

    async getAllocationRooms() {
        const { data, error } = await supabase
            .from('accommodation_allocation_rooms')
            .select('id, allocation_id, room_capacity, rooms_count');
        if (error) throw error;
        return data as AccommodationAllocationRoom[];
    },

    async createAllocation(allocation: Omit<AccommodationAllocation, 'id' | 'status' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('accommodation_allocations')
            .insert([{
                delegation_id: allocation.delegation_id,
                hotel_id: allocation.hotel_id,
                date_from: allocation.date_from,
                date_to: allocation.date_to,
                note: allocation.note || '',
                status: 'draft'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateAllocation(id: string, update: Partial<AccommodationAllocation>) {
        const payload: any = {};
        if (update.delegation_id !== undefined) payload.delegation_id = update.delegation_id;
        if (update.hotel_id !== undefined) payload.hotel_id = update.hotel_id;
        if (update.date_from !== undefined) payload.date_from = update.date_from;
        if (update.date_to !== undefined) payload.date_to = update.date_to;
        if (update.status !== undefined) payload.status = update.status;
        if (update.note !== undefined) payload.note = update.note;

        const { data, error } = await supabase
            .from('accommodation_allocations')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async confirmAllocation(id: string) {
        const { data, error } = await supabase
            .from('accommodation_allocations')
            .update({ status: 'confirmed' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async cancelAllocation(id: string) {
        const { data, error } = await supabase
            .from('accommodation_allocations')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async addAllocationRoom(room: Omit<AccommodationAllocationRoom, 'id'>) {
        const { data, error } = await supabase
            .from('accommodation_allocation_rooms')
            .insert([{
                allocation_id: room.allocation_id,
                room_capacity: room.room_capacity,
                rooms_count: room.rooms_count
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },


    async deleteAllocationRooms(allocationId: string) {
        const { error } = await supabase
            .from('accommodation_allocation_rooms')
            .delete()
            .eq('allocation_id', allocationId);

        if (error) throw error;
    }
};

import { supabase } from '../lib/supabaseClient';
import type { HotelDailyCapacity } from '../types/admin';

export const capacityService = {
    async getDailyCapacities(hotelId?: string, dateFrom?: string, dateTo?: string) {
        let query = supabase
            .from('hotel_daily_capacities')
            .select('*')
            .order('date')
            .order('room_capacity');

        if (hotelId) query = query.eq('hotel_id', hotelId);
        if (dateFrom) query = query.gte('date', dateFrom);
        if (dateTo) query = query.lte('date', dateTo);

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(c => ({
            ...c,
            capacity_total: c.rooms_total * c.room_capacity,
            source: 'db' as const
        })) as HotelDailyCapacity[];
    }
};

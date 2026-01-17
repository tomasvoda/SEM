import { supabase } from '../lib/supabaseClient';
import type { Hotel, HotelOffer, HotelOfferRoom, HotelOfferService } from '../types/admin';

export const hotelService = {
    async getHotels() {
        const { data, error } = await supabase
            .from('hotels')
            .select('*')
            .order('city')
            .order('name');

        if (error) throw error;
        return data as Hotel[];
    },

    async createHotel(hotel: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>) {
        const { data, error } = await supabase
            .from('hotels')
            .insert([hotel])
            .select()
            .single();

        if (error) throw error;
        return data as Hotel;
    },

    async updateHotel(id: string, hotel: Partial<Hotel>) {
        const { data, error } = await supabase
            .from('hotels')
            .update(hotel)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Hotel;
    },

    async deleteHotel(id: string) {
        // User requested soft delete: set active = false
        const { error } = await supabase
            .from('hotels')
            .update({ active: false })
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async getOffers() {
        const { data, error } = await supabase
            .from('hotel_offers')
            .select('*')
            .order('date_from', { ascending: false });

        if (error) throw error;
        return data as HotelOffer[];
    },

    async createOffer(offer: Partial<HotelOffer>) {
        const { data, error } = await supabase
            .from('hotel_offers')
            .insert([offer])
            .select()
            .single();

        if (error) throw error;
        return data as HotelOffer;
    },

    async updateOffer(id: string, update: Partial<HotelOffer>) {
        const { data, error } = await supabase
            .from('hotel_offers')
            .update(update)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as HotelOffer;
    },

    async deleteOffer(id: string) {
        const { error } = await supabase
            .from('hotel_offers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async getOfferRooms() {
        const { data, error } = await supabase
            .from('hotel_offer_rooms')
            .select('*');

        if (error) throw error;
        return data as HotelOfferRoom[];
    },

    async createOfferRoom(room: Partial<HotelOfferRoom>) {
        const { data, error } = await supabase
            .from('hotel_offer_rooms')
            .insert([room])
            .select()
            .single();

        if (error) throw error;
        return data as HotelOfferRoom;
    },

    async updateOfferRoom(id: string, update: Partial<HotelOfferRoom>) {
        const { data, error } = await supabase
            .from('hotel_offer_rooms')
            .update(update)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as HotelOfferRoom;
    },

    async deleteOfferRoom(id: string) {
        const { error } = await supabase
            .from('hotel_offer_rooms')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async createOfferService(service: Partial<HotelOfferService>) {
        const { data, error } = await supabase
            .from('hotel_offer_services')
            .insert([service])
            .select()
            .single();

        if (error) throw error;
        return data as HotelOfferService;
    },

    async updateOfferService(id: string, update: Partial<HotelOfferService>) {
        const { data, error } = await supabase
            .from('hotel_offer_services')
            .update(update)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as HotelOfferService;
    },

    async deleteOfferService(id: string) {
        const { error } = await supabase
            .from('hotel_offer_services')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

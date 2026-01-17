import { supabase } from '../lib/supabaseClient';
import type { Delegation } from '../types/admin';

export const delegationService = {
    async getDelegations() {
        const { data, error } = await supabase
            .from('delegations')
            .select('*')
            .order('team_name');

        if (error) throw error;

        return (data || []) as Delegation[];
    },

    async createDelegation(data: Omit<Delegation, 'id' | 'status' | 'created_at'> & { accommodation_request?: any }) {
        const { data: inserted, error } = await supabase
            .from('delegations')
            .insert([{
                ...data,
                accommodation_request: data.accommodation_request || [],
                status: 'submitted'
            }])
            .select('*')
            .single();

        if (error) throw error;
        return inserted as Delegation;
    },

    async updateDelegation(id: string, data: Partial<Delegation>) {
        const { data: updated, error } = await supabase
            .from('delegations')
            .update(data)
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;
        return updated as Delegation;
    },

};

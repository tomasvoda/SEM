import { create } from 'zustand';

import { supabase } from '../lib/supabaseClient';

export type VolunteerStatus = 'new' | 'approved' | 'rejected' | 'backup';
export type AvailabilityStatus = 'full' | 'morning' | 'afternoon' | 'none';
export type VolunteerRole = 'driver' | 'results' | 'court' | 'hospitality' | 'general' | 'media';

export interface Volunteer {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    birth_date: string;
    home_club: string;
    languages: string[];
    preferred_roles: VolunteerRole[];
    preferred_locations: string[];
    availability_by_day: Record<string, AvailabilityStatus>;
    registration_status: VolunteerStatus;
    internal_note: string;
    source: 'public' | 'internal';
    created_at: string;
}

// Backward compatibility for camelCase frontend access (mapped during fetch)
export interface VolunteerInternal extends Volunteer {
    firstName: string;
    lastName: string;
    birthDate: string;
    homeClub: string;
    preferredRoles: VolunteerRole[];
    preferredLocations: string[];
    availabilityByDay: Record<string, AvailabilityStatus>;
    registrationStatus: VolunteerStatus;
    internalNote: string;
    createdAt: string;
}


interface VolunteerState {
    volunteers: VolunteerInternal[];
    isLoading: boolean;
    error: string | null;
    fetchVolunteers: () => Promise<void>;
    addVolunteer: (volunteer: Omit<Volunteer, 'id' | 'created_at' | 'registration_status' | 'internal_note'>) => Promise<void>;
    updateVolunteer: (id: string, updates: Partial<Volunteer>) => Promise<void>;
    updateStatus: (id: string, status: VolunteerStatus) => Promise<void>;
    updateInternalNote: (id: string, note: string) => Promise<void>;
    deleteVolunteer: (id: string) => Promise<void>;
}

const mapVolunteer = (v: any): VolunteerInternal => ({
    ...v,
    firstName: v.first_name,
    lastName: v.last_name,
    birthDate: v.birth_date,
    homeClub: v.home_club,
    preferredRoles: v.preferred_roles,
    preferredLocations: v.preferred_locations,
    availabilityByDay: v.availability_by_day,
    registrationStatus: v.registration_status,
    internalNote: v.internal_note,
    createdAt: v.created_at
});

// Event dates: 2026-10-14 to 2026-10-25
export const EVENT_DATES = [
    '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18',
    '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23',
    '2026-10-24', '2026-10-25'
];

export const useVolunteerStore = create<VolunteerState>((set) => ({
    volunteers: [],
    isLoading: false,
    error: null,

    fetchVolunteers: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('volunteers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ volunteers: (data || []).map(mapVolunteer), error: null });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addVolunteer: async (vData) => {
        try {
            // Sanitize payload: Ensure empty strings for dates are null
            const payload = {
                ...vData,
                birth_date: vData.birth_date === '' ? null : vData.birth_date
            };

            const { data, error } = await supabase
                .from('volunteers')
                .insert([payload])
                .select()
                .single();

            if (error) throw error;

            // Trigger Email Confirmation Function
            try {
                const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-volunteer-confirmation`;
                console.log('Triggering email function:', functionUrl);

                const emailResponse = await fetch(functionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({ record: data })
                });

                if (!emailResponse.ok) {
                    const errText = await emailResponse.text();
                    console.error('Email function failed:', errText);
                } else {
                    console.log('Email function triggered successfully');
                }
            } catch (emailErr) {
                console.error('Failed to call email function:', emailErr);
                // We do not throw here to avoid rolling back the successful registration in UI
            }

            set((state) => ({
                volunteers: [mapVolunteer(data), ...state.volunteers]
            }));
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        }
    },

    updateVolunteer: async (id, updates) => {
        try {
            const { error } = await supabase
                .from('volunteers')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                volunteers: state.volunteers.map((v) =>
                    v.id === id ? {
                        ...v, ...updates, ...{
                            firstName: (updates as any).first_name || v.firstName,
                            lastName: (updates as any).last_name || v.lastName,
                            // ... add other mappings if needed for general update
                        }
                    } : v
                )
            }));
        } catch (err: any) {
            set({ error: err.message });
        }
    },

    updateStatus: async (id, status) => {
        try {
            const { error } = await supabase
                .from('volunteers')
                .update({ registration_status: status })
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                volunteers: state.volunteers.map((v) =>
                    v.id === id ? { ...v, registrationStatus: status, registration_status: status } : v
                )
            }));
        } catch (err: any) {
            set({ error: err.message });
        }
    },

    updateInternalNote: async (id, note) => {
        try {
            const { error } = await supabase
                .from('volunteers')
                .update({ internal_note: note })
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                volunteers: state.volunteers.map((v) =>
                    v.id === id ? { ...v, internalNote: note, internal_note: note } : v
                )
            }));
        } catch (err: any) {
            set({ error: err.message });
        }
    },

    deleteVolunteer: async (id) => {
        try {
            const { error } = await supabase
                .from('volunteers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            set((state) => ({
                volunteers: state.volunteers.filter((v) => v.id !== id)
            }));
        } catch (err: any) {
            set({ error: err.message });
        }
    },
}));

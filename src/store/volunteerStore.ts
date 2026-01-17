import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VolunteerStatus = 'new' | 'approved' | 'rejected' | 'backup';
export type AvailabilityStatus = 'full' | 'morning' | 'afternoon' | 'none';

export interface Volunteer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    city: string;
    languages: string[];
    preferredLocations: string[];
    availabilityByDay: Record<string, AvailabilityStatus>;
    registrationStatus: VolunteerStatus;
    internalNote: string;
    source: 'public' | 'internal';
    createdAt: string;
}

interface VolunteerState {
    volunteers: Volunteer[];
    addVolunteer: (volunteer: Omit<Volunteer, 'id' | 'createdAt' | 'registrationStatus' | 'internalNote'>) => void;
    updateStatus: (id: string, status: VolunteerStatus, adminId?: string) => void;
    updateInternalNote: (id: string, note: string) => void;
    deleteVolunteer: (id: string) => void;
}

// Event dates: 2026-07-01 to 2026-07-10
export const EVENT_DATES = [
    '2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', '2026-07-05',
    '2026-07-06', '2026-07-07', '2026-07-08', '2026-07-09', '2026-07-10'
];

const initialVolunteers: Volunteer[] = [
    {
        id: '1',
        firstName: 'Jan',
        lastName: 'Novák',
        email: 'jan.novak@example.cz',
        phone: '+420 777 123 456',
        birthDate: '1995-05-15',
        city: 'Prague',
        languages: ['CZ', 'EN'],
        preferredLocations: ['Prague', 'Zlín'],
        availabilityByDay: {
            '2026-07-01': 'full',
            '2026-07-02': 'full',
            '2026-07-03': 'morning',
            '2026-07-04': 'none',
        },
        registrationStatus: 'approved',
        internalNote: 'Experience from previous Korfball events.',
        source: 'internal',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        firstName: 'Marie',
        lastName: 'Svobodová',
        email: 'marie.s@volny.cz',
        phone: '+420 602 987 654',
        birthDate: '2004-10-20',
        city: 'Brno',
        languages: ['CZ', 'EN', 'DE'],
        preferredLocations: ['Brno', 'Otrokovice'],
        availabilityByDay: {
            '2026-07-01': 'afternoon',
            '2026-07-02': 'afternoon',
            '2026-07-03': 'afternoon',
        },
        registrationStatus: 'new',
        internalNote: '',
        source: 'public',
        createdAt: new Date().toISOString()
    }
];

export const useVolunteerStore = create<VolunteerState>()(
    persist(
        (set) => ({
            volunteers: initialVolunteers,

            addVolunteer: (vData) => set((state) => ({
                volunteers: [
                    ...state.volunteers,
                    {
                        ...vData,
                        id: Math.random().toString(36).substr(2, 9),
                        registrationStatus: 'new',
                        internalNote: '',
                        createdAt: new Date().toISOString()
                    }
                ]
            })),

            updateStatus: (id, status) => set((state) => ({
                volunteers: state.volunteers.map((v) =>
                    v.id === id ? { ...v, registrationStatus: status } : v
                )
            })),

            updateInternalNote: (id, note) => set((state) => ({
                volunteers: state.volunteers.map((v) =>
                    v.id === id ? { ...v, internalNote: note } : v
                )
            })),

            deleteVolunteer: (id) => set((state) => ({
                volunteers: state.volunteers.filter((v) => v.id !== id)
            })),
        }),
        {
            name: 'volunteer-storage',
        }
    )
);

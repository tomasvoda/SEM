import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MobileStore {
    // Mobile-specific state
    isBottomNavVisible: boolean;
    setBottomNavVisible: (visible: boolean) => void;

    // Volunteer application data (temporary storage before backend)
    volunteerApplication: VolunteerApplication | null;
    setVolunteerApplication: (data: VolunteerApplication | null) => void;
}

export interface VolunteerApplication {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    languages: string[];
    preferredRoles: string[];
    availability: string;
    notes?: string;
    submittedAt?: string;
}

export const useMobileStore = create<MobileStore>()(
    persist(
        (set) => ({
            isBottomNavVisible: true,
            setBottomNavVisible: (visible) => set({ isBottomNavVisible: visible }),

            volunteerApplication: null,
            setVolunteerApplication: (data) => set({ volunteerApplication: data })
        }),
        {
            name: 'mobile-storage',
            partialize: (state) => ({
                volunteerApplication: state.volunteerApplication
            })
        }
    )
);

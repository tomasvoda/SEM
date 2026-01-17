import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    role: 'admin' | 'manager' | 'staff' | 'volunteer';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, role: User['role']) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (email, role) => set({
        user: { id: 'mock-id', email, role },
        isAuthenticated: true
    }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));

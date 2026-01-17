export type UserRole = 'admin' | 'manager' | 'staff' | 'volunteer' | 'user';

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    full_name?: string;
    created_at: string;
}

export interface NavigationItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

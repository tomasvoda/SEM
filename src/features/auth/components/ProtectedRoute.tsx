import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import type { UserRole } from '../../../types';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        // Redirect to login if not authenticated
        // For now, we might not have a login page, so we could redirect to landing or a mock login
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized or home if role doesn't match
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

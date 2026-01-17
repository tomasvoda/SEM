import { Outlet } from 'react-router-dom';

export function AccommodationLayout() {
    return (
        <div className="space-y-6">
            <Outlet />
        </div>
    );
}

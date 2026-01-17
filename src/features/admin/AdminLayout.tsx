import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { Loader2 } from 'lucide-react';

export function AdminLayout() {
    const { loadInitialData, isLoading, error } = useAdminStore();

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                <p className="text-sm text-[var(--app-text-dim)] font-medium">Loading Admin Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-center m-8">
                <p className="text-red-400 font-bold mb-2">Connection Error</p>
                <p className="text-sm text-red-400/70">{error}</p>
                <button
                    onClick={() => loadInitialData()}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Outlet />
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function LandingPage() {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleAdminLogin = () => {
        login('admin@example.com', 'admin');
        navigate('/admin');
    };

    const handleManagerLogin = () => {
        login('manager@example.com', 'manager');
        navigate('/manager');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900">SEM Platform</h1>
                    <p className="mt-2 text-slate-600">Event & Tournament Management</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleAdminLogin}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                        Login as Admin
                    </button>
                    <button
                        onClick={handleManagerLogin}
                        className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                        Login as Team Manager
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ManagerDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Team Manager Dashboard</h1>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
                <h2 className="text-xl font-medium text-slate-900">Welcome, Manager!</h2>
                <p className="text-slate-500 mt-2">Manage your team roster and event registrations here.</p>
                <button className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors">
                    Add Team Member
                </button>
            </div>
        </div>
    );
}

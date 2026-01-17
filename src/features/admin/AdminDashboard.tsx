export function AdminDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-lg font-medium text-slate-900">Total Users</h2>
                    <p className="text-3xl font-bold text-brand-600 mt-2">124</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-lg font-medium text-slate-900">Active Events</h2>
                    <p className="text-3xl font-bold text-brand-600 mt-2">3</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h2 className="text-lg font-medium text-slate-900">Pending Approvals</h2>
                    <p className="text-3xl font-bold text-amber-500 mt-2">12</p>
                </div>
            </div>
        </div>
    );
}

import { ReportsLayout } from '../reports/ReportsLayout';

export function AccommodationReportPage() {
    return (
        <div className="space-y-6">
            <div className="text-left">
                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Occupancy Reports</h1>
                <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">Detailed occupancy and assignment analytics</p>
            </div>
            <ReportsLayout />
        </div>
    );
}

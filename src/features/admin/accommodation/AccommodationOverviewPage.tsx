import { DailyGridViewWrapper } from '../reports/DailyGridViewWrapper';

export function AccommodationOverviewPage() {
    return (
        <div className="space-y-8">
            <div className="text-left">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight leading-none">Accommodation Overview</h1>
                </div>
                <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">City-level occupancy heatmap</p>
            </div>


            <DailyGridViewWrapper />
        </div>
    );
}

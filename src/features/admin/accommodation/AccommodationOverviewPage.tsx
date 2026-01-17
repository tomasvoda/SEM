import { DailyGridViewWrapper } from '../reports/DailyGridViewWrapper';
import { PageHeader } from '../../../components/ui/PageHeader';

export function AccommodationOverviewPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <PageHeader
                title="Accommodation Overview"
                subtitle="City-level occupancy heatmap"
                breadcrumbs={[
                    { label: 'Event', href: '/admin/dashboard' },
                    { label: 'Overview' }
                ]}
            />

            <DailyGridViewWrapper />
        </div>
    );
}

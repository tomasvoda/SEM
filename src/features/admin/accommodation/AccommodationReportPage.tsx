import { ReportsLayout } from '../reports/ReportsLayout';
import { PageHeader } from '../../../components/ui/PageHeader';

export function AccommodationReportPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <PageHeader
                title="Occupancy Reports"
                subtitle="Detailed occupancy and assignment analytics"
                breadcrumbs={[
                    { label: 'Event', href: '/admin/dashboard' },
                    { label: 'Occupancy' }
                ]}
            />
            <ReportsLayout />
        </div>
    );
}

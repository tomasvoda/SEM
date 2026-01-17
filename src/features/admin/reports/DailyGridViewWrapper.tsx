import { CityAccordion } from './views/CityAccordion';
import { Breadcrumbs } from '../../admin/components/Breadcrumbs';

export function DailyGridViewWrapper() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Breadcrumbs
                    items={[
                        { label: 'Accommodation', path: '/admin/accommodation/overview' },
                        { label: 'Overview' }
                    ]}
                />
            </div>

            <CityAccordion />
        </div>
    );
}

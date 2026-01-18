import { useState } from 'react';
import { Breadcrumbs } from '../../admin/components/Breadcrumbs';
import { CommonFilters } from './components/CommonFilters';
import { CityView } from './views/CityView';
import { HotelView } from './views/HotelView';
import { DelegationView } from './views/DelegationView';
import { DailyGridView } from './views/DailyGridView';
import { DailyDetailView } from './views/DailyDetailView';
import { cn } from '../../../lib/utils';
import { EVENT_START_DATE, EVENT_END_DATE } from '../../../types/admin';

type TabType = 'overview' | 'hotels' | 'delegations' | 'heatmap' | 'daily';

export function ReportsLayout() {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    // Global Filter State
    const [dateFrom, setDateFrom] = useState(EVENT_START_DATE);
    const [dateTo, setDateTo] = useState(EVENT_END_DATE);
    const [city, setCity] = useState('');
    const [hotelId, setHotelId] = useState('');

    const tabs = [
        { id: 'overview', label: 'Cities' },
        { id: 'hotels', label: 'Hotels' },
        { id: 'delegations', label: 'Delegations' },
        { id: 'heatmap', label: 'Hotel Heatmap' },
        { id: 'daily', label: 'Daily Detail' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Breadcrumbs
                    items={[
                        { label: 'Reports', path: '/admin/reports/accommodation' },
                        { label: 'Accommodation Occupancy' }
                    ]}
                />

            </div>

            {/* Filters */}
            <CommonFilters
                dateFrom={dateFrom} dateTo={dateTo} city={city} hotelId={hotelId}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
                onCityChange={setCity}
                onHotelChange={setHotelId}
            />

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-[var(--glass-surface)]/30 backdrop-blur-md rounded-2xl border border-[var(--glass-border)] w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeTab === tab.id
                                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Views */}
            <div className="transition-all duration-300">
                {activeTab === 'overview' && <CityView dateFrom={dateFrom} dateTo={dateTo} city={city} />}
                {activeTab === 'hotels' && <HotelView dateFrom={dateFrom} dateTo={dateTo} city={city} hotelId={hotelId} />}
                {activeTab === 'delegations' && <DelegationView dateFrom={dateFrom} dateTo={dateTo} hotelId={hotelId} />}
                {activeTab === 'heatmap' && <DailyGridView dateFrom={dateFrom} dateTo={dateTo} city={city} mode="hotel" />}
                {activeTab === 'daily' && <DailyDetailView date={dateFrom} hotelId={hotelId} />}
            </div>
        </div>
    );
}

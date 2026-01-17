import { useMemo } from 'react';
import { useAdminStore } from '../../../../store/adminStore';
import { Select } from '../../../../components/ui/Select';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { EVENT_START_DATE, EVENT_END_DATE } from '../../../../types/admin';
import { Calendar, Building2, MapPin } from 'lucide-react';

interface CommonFiltersProps {
    dateFrom: string;
    dateTo: string;
    city: string;
    hotelId: string;
    onDateFromChange: (val: string) => void;
    onDateToChange: (val: string) => void;
    onCityChange: (val: string) => void;
    onHotelChange: (val: string) => void;
}

export function CommonFilters({
    dateFrom, dateTo, city, hotelId,
    onDateFromChange, onDateToChange, onCityChange, onHotelChange
}: CommonFiltersProps) {
    const { hotels } = useAdminStore();

    const cities = useMemo(() => {
        const uniqueCities = Array.from(new Set(hotels.map((h: any) => h.city)));
        return uniqueCities.map((c: any) => ({ value: c, label: c }));
    }, [hotels]);

    const filteredHotels = useMemo(() => {
        return hotels
            .filter((h: any) => !city || h.city === city)
            .map((h: any) => ({ value: h.id, label: h.name }));
    }, [hotels, city]);

    return (
        <GlassCard className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Date From
                    </label>
                    <input
                        type="date"
                        value={dateFrom}
                        min={EVENT_START_DATE}
                        max={EVENT_END_DATE}
                        onChange={(e) => onDateFromChange(e.target.value)}
                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-brand-500/50 transition-all font-bold text-sm"
                    />
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Date To
                    </label>
                    <input
                        type="date"
                        value={dateTo}
                        min={EVENT_START_DATE}
                        max={EVENT_END_DATE}
                        onChange={(e) => onDateToChange(e.target.value)}
                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-brand-500/50 transition-all font-bold text-sm"
                    />
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> City
                    </label>
                    <Select
                        value={city}
                        onChange={onCityChange}
                        options={[{ value: '', label: 'All Cities' }, ...cities]}
                        placeholder="All Cities"
                    />
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1 flex items-center gap-2">
                        <Building2 className="w-3 h-3" /> Hotel
                    </label>
                    <Select
                        value={hotelId}
                        onChange={onHotelChange}
                        options={[{ value: '', label: 'All Hotels' }, ...filteredHotels]}
                        placeholder="All Hotels"
                    />
                </div>
            </div>
        </GlassCard>
    );
}

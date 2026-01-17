import { useState, useMemo } from 'react';
import { useAdminStore } from '../../../../store/adminStore';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { ChevronDown, ChevronUp, MapPin, Building2, TrendingUp, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { EVENT_START_DATE, EVENT_END_DATE } from '../../../../types/admin';
import { format, parseISO } from 'date-fns';

export function CityAccordion() {
    const { getCityReports, getHotelOccupancyReports } = useAdminStore();
    const [expandedCities, setExpandedCities] = useState<string[]>([]);

    // Use default event dates
    const dateFrom = EVENT_START_DATE;
    const dateTo = EVENT_END_DATE;

    const cityReports = useMemo(() => {
        return getCityReports({ dateFrom, dateTo });
    }, [getCityReports, dateFrom, dateTo]);

    const toggleCity = (city: string) => {
        setExpandedCities(prev =>
            prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
        );
    };

    const toggleAll = () => {
        if (expandedCities.length === cityReports.length) {
            setExpandedCities([]);
        } else {
            setExpandedCities(cityReports.map(c => c.city));
        }
    };

    return (
        <div className="space-y-4">
            {/* Controls */}
            {cityReports.length > 0 && (
                <div className="flex justify-end mb-2">
                    <button
                        onClick={toggleAll}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-2 rounded-lg hover:bg-[var(--glass-surface)] border border-transparent hover:border-[var(--glass-border)]"
                    >
                        {expandedCities.length === cityReports.length ? (
                            <>
                                <Minimize2 className="w-3 h-3" /> Collapse All
                            </>
                        ) : (
                            <>
                                <Maximize2 className="w-3 h-3" /> Expand All
                            </>
                        )}
                    </button>
                </div>
            )}

            {cityReports.length === 0 ? (
                <GlassCard className="p-12 text-center border-dashed border-2">
                    <MapPin className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-10" />
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 uppercase tracking-tight">No Data Available</h3>
                    <p className="text-[var(--text-muted)] text-sm">Ensure hotel offers and allocations are created.</p>
                </GlassCard>
            ) : (
                cityReports.map((cityReport) => {
                    const isExpanded = expandedCities.includes(cityReport.city);
                    const hotelReports = isExpanded
                        ? getHotelOccupancyReports({ dateFrom, dateTo, city: cityReport.city })
                        : [];

                    const hotelSummaries = useMemo(() => {
                        const map = new Map<string, {
                            id: string;
                            name: string;
                            totalRooms: number;
                            reservedRooms: number;
                        }>();

                        hotelReports.forEach(h => {
                            if (!map.has(h.hotel_id)) {
                                map.set(h.hotel_id, {
                                    id: h.hotel_id,
                                    name: h.hotel_name,
                                    totalRooms: 0,
                                    reservedRooms: 0,
                                });
                            }
                            const curr = map.get(h.hotel_id)!;
                            curr.totalRooms += h.total_rooms;
                            curr.reservedRooms += h.reserved_rooms;
                        });

                        return Array.from(map.values()).map(h => ({
                            ...h,
                            occupancy: h.totalRooms > 0 ? (h.reservedRooms / h.totalRooms) * 100 : 0
                        }));
                    }, [hotelReports]);

                    return (
                        <div key={cityReport.city} className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-surface)]/30 overflow-hidden transition-all duration-300">
                            {/* City Header - Clickable */}
                            <div
                                onClick={() => toggleCity(cityReport.city)}
                                className={cn(
                                    "p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors",
                                    isExpanded ? "bg-white/5" : ""
                                )}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">{cityReport.city}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                                                <Building2 className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold">{cityReport.total_rooms} Room Nights</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-emerald-500">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold">{cityReport.occupancy_percentage.toFixed(1)}% Occupancy</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-muted)]">
                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </div>

                            {/* Expanded Content - Hotel List */}
                            {isExpanded && (
                                <div className="p-4 bg-[var(--app-bg)]/30 border-t border-[var(--glass-border)]">
                                    <div className="grid grid-cols-1 gap-4">
                                        {hotelSummaries.length === 0 ? (
                                            <p className="text-center text-[var(--text-muted)] text-sm py-4">No hotels found in this city.</p>
                                        ) : (
                                            hotelSummaries.map(hotel => {
                                                const dailyStats = hotelReports
                                                    .filter(h => h.hotel_id === hotel.id)
                                                    .sort((a, b) => a.date.localeCompare(b.date));

                                                return (
                                                    <div key={hotel.id} className="p-4 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)] space-y-4">
                                                        {/* Hotel Summary Header */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <Building2 className="w-5 h-5 text-[var(--text-muted)]" />
                                                                <div>
                                                                    <h4 className="font-bold text-[var(--text-primary)]">{hotel.name}</h4>
                                                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                                                                        {hotel.reservedRooms} / {hotel.totalRooms} Room Nights
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={cn(
                                                                    "text-lg font-black",
                                                                    hotel.occupancy > 95 ? "text-red-500" :
                                                                        hotel.occupancy > 80 ? "text-amber-500" : "text-emerald-500"
                                                                )}>
                                                                    {hotel.occupancy.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Daily Occupancy Matrix Table */}
                                                        <div className="overflow-x-auto rounded-xl border border-[var(--glass-border)] bg-[var(--glass-surface)]/20">
                                                            <table className="w-full border-collapse">
                                                                <thead>
                                                                    <tr className="bg-[var(--glass-surface)]/50">
                                                                        <th className="p-3 text-left border-b border-r border-[var(--glass-border)] min-w-[120px]">
                                                                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-500">Room Type</span>
                                                                        </th>
                                                                        {Array.from(new Set(dailyStats.map(s => s.date))).sort().map(date => (
                                                                            <th key={date} className="p-3 text-center border-b border-[var(--glass-border)] min-w-[80px]">
                                                                                <div className="flex flex-col items-center">
                                                                                    <span className="text-[10px] font-black text-[var(--text-primary)]">{format(parseISO(date), 'dd MMM')}</span>
                                                                                    <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase">{format(parseISO(date), 'EEE')}</span>
                                                                                </div>
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {[1, 2, 3].map(capacity => {
                                                                        const typeReports = dailyStats.filter(s => s.room_capacity === capacity);
                                                                        if (typeReports.length === 0) return null;

                                                                        const label = capacity === 1 ? 'Single' : capacity === 2 ? 'Double' : 'Triple';

                                                                        return (
                                                                            <tr key={capacity} className="hover:bg-[var(--glass-surface)]/30 transition-colors">
                                                                                <td className="p-3 border-r border-b border-[var(--glass-border)] bg-[var(--glass-surface)]/10">
                                                                                    <div className="flex flex-col">
                                                                                        <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight">{label}</span>
                                                                                        <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{capacity} Bed{capacity > 1 ? 's' : ''}</span>
                                                                                    </div>
                                                                                </td>
                                                                                {Array.from(new Set(dailyStats.map(s => s.date))).sort().map(date => {
                                                                                    const dayReport = typeReports.find(s => s.date === date);
                                                                                    if (!dayReport) return <td key={date} className="p-3 border-b border-[var(--glass-border)] text-center text-[var(--text-muted)] opacity-20">—</td>;

                                                                                    const pct = dayReport.occupancy_percentage;

                                                                                    return (
                                                                                        <td key={date} className="p-3 border-b border-[var(--glass-border)] text-center">
                                                                                            <div className="flex flex-col gap-1">
                                                                                                <div className="flex items-center justify-center gap-1">
                                                                                                    <span className={cn(
                                                                                                        "text-[10px] font-black",
                                                                                                        pct >= 100 ? "text-red-500" :
                                                                                                            pct >= 80 ? "text-amber-500" :
                                                                                                                dayReport.reserved_rooms > 0 ? "text-emerald-500" : "text-[var(--text-primary)]"
                                                                                                    )}>
                                                                                                        {dayReport.reserved_rooms}
                                                                                                    </span>
                                                                                                    <span className="text-[var(--text-muted)] text-[8px]">/</span>
                                                                                                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                                                                                                        {dayReport.total_rooms}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="w-full h-1 bg-[var(--glass-border)] rounded-full overflow-hidden">
                                                                                                    <div
                                                                                                        className={cn(
                                                                                                            "h-full transition-all duration-500",
                                                                                                            pct >= 100 ? "bg-red-500" :
                                                                                                                pct >= 80 ? "bg-amber-500" : "bg-emerald-500"
                                                                                                        )}
                                                                                                        style={{ width: `${Math.min(100, pct)}%` }}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    );
                                                                                })}
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}

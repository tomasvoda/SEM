import { Plane, Bus, Car, Info, MapPin, Clock, Calendar, CheckSquare } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Select } from '../../../components/ui/Select';
import { useDelegationStore } from '../../../store/delegationStore';
import { cn } from '../../../lib/utils';
import { useEffect } from 'react';

const AIRPORTS = [
    { code: 'PRG', label: 'Prague (PRG)' },
    { code: 'BRQ', label: 'Brno (BRQ)' },
    { code: 'VIE', label: 'Vienna (VIE)' },
];

export function TransportStep() {
    const { transport, basics, updateTransport, getEstimatedCosts } = useDelegationStore();
    const costs = getEstimatedCosts();

    // Default: Sync Dates from Basics if empty
    useEffect(() => {
        if (!transport.arrival.date && basics.dates.arrival) {
            updateTransport('arrival', { date: basics.dates.arrival });
        }
        if (!transport.departure.date && basics.dates.departure) {
            updateTransport('departure', { date: basics.dates.departure });
        }
    }, [basics.dates, transport.arrival.date, transport.departure.date]);

    // Default: Departure Airport match Arrival Airport (Only if not manually changed)
    useEffect(() => {
        if (transport.arrival.type === 'plane' && transport.arrival.location && !transport.departure.location && transport.departure.type === 'plane') {
            updateTransport('departure', { location: transport.arrival.location });
        }
    }, [transport.arrival.location, transport.arrival.type, transport.departure.type, transport.departure.location]);

    // Default: Departure Transfer match Arrival Transfer
    useEffect(() => {
        // If Arrival Transfer is set to TRUE, automatically set Departure Transfer to TRUE (if departure is plane)
        if (transport.arrival.type === 'plane' && transport.arrival.airportTransfer && transport.departure.type === 'plane') {
            updateTransport('departure', { airportTransfer: true });
        }
    }, [transport.arrival.airportTransfer, transport.arrival.type, transport.departure.type]);

    // Pre-fill persons logic for plane transfer
    useEffect(() => {
        if (transport.arrival.persons === 0 && basics.headCount.total > 0 && transport.arrival.type === 'plane') {
            updateTransport('arrival', { persons: basics.headCount.total });
        }
        if (transport.departure.persons === 0 && basics.headCount.total > 0 && transport.departure.type === 'plane') {
            updateTransport('departure', { persons: basics.headCount.total });
        }
    }, [basics.headCount.total, transport.arrival.type, transport.departure.type]);

    const TransportTypeSelector = ({ value, onChange }: { value: string | null, onChange: (t: any) => void }) => (
        <div className="grid grid-cols-3 gap-4">
            {['plane', 'bus', 'car'].map((type) => (
                <button
                    key={type}
                    onClick={() => onChange(type)}
                    className={cn(
                        "flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group",
                        value === type
                            ? "border-brand-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-brand-500/5 text-brand-400"
                            : "border-[var(--glass-border)] text-[var(--text-muted)] hover:border-brand-500/50 hover:text-[var(--text-secondary)]"
                    )}
                >
                    {type === 'plane' && <Plane className="w-8 h-8 transition-transform group-hover:scale-110 duration-300" />}
                    {type === 'bus' && <Bus className="w-8 h-8 transition-transform group-hover:scale-110 duration-300" />}
                    {type === 'car' && <Car className="w-8 h-8 transition-transform group-hover:scale-110 duration-300" />}
                    <span className="font-medium capitalize">{type === 'car' ? 'Cars' : type}</span>
                </button>
            ))}
        </div>
    );

    const handleArrivalChange = (field: string, value: any) => {
        updateTransport('arrival', { [field]: value });

        // Auto-sync Departure Type if Plane selected
        if (field === 'type' && value === 'plane') {
            updateTransport('departure', { type: 'plane' });
        }
    };

    const handleDepartureChange = (field: string, value: any) => {
        updateTransport('departure', { [field]: value });

        // Auto-sync Arrival Type if Plane selected
        if (field === 'type' && value === 'plane') {
            updateTransport('arrival', { type: 'plane' });
        }
    };

    const isSubmitted = status === 'submitted';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <fieldset disabled={isSubmitted} className="space-y-8 border-none p-0 m-0">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">Transport Logistics</h2>
                    <p className="text-[var(--text-secondary)]">How will your team travel to the event?</p>
                </div>

                <div className="space-y-6">
                    {/* ARRIVAL */}
                    <GlassCard className="p-6">
                        {/* Visual Removed: Absolute line replaced with border-l-4 to prevent overlap */}
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-sm font-bold">A</div>
                            Arrival Details
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">Transport Type</label>
                                <TransportTypeSelector
                                    value={transport.arrival.type}
                                    onChange={(val) => handleArrivalChange('type', val)}
                                />
                            </div>

                            {transport.arrival.type && (
                                <div className="space-y-6 animate-in slide-in-from-top-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Date & Time - Always Visible */}
                                        <div>
                                            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Arrival Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 w-5 h-5 text-[var(--text-muted)]" />
                                                <input
                                                    type="date"
                                                    value={transport.arrival.date}
                                                    onChange={(e) => handleArrivalChange('date', e.target.value)}
                                                    className="w-full pl-10 p-3 h-[46px] bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Estimated Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-3 w-5 h-5 text-[var(--text-muted)]" />
                                                <input
                                                    type="time"
                                                    value={transport.arrival.time}
                                                    onChange={(e) => handleArrivalChange('time', e.target.value)}
                                                    className="w-full pl-10 p-3 h-[46px] bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Type Specific Fields */}
                                        {transport.arrival.type === 'plane' && (
                                            <>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Arrival Airport</label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-[var(--text-muted)]" />
                                                        <div className="pl-8">
                                                            <Select
                                                                value={transport.arrival.location}
                                                                onChange={(val) => handleArrivalChange('location', val)}
                                                                options={AIRPORTS.map(a => ({ value: a.code, label: a.label }))}
                                                                placeholder="Select Airport..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Flight Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. OK123"
                                                        value={transport.arrival.flightNumber || ''}
                                                        onChange={(e) => handleArrivalChange('flightNumber', e.target.value)}
                                                        className="w-full p-3 h-[46px] bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold transition-all"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Airport Transfer (Plane Only) - Compact Mode */}
                                    {transport.arrival.type === 'plane' && (
                                        <div className={cn(
                                            "flex flex-col gap-4 p-4 rounded-xl border transition-all duration-300",
                                            transport.arrival.airportTransfer ? "bg-brand-500/5 border-brand-500/30" : "bg-[var(--glass-surface)] border-[var(--glass-border)]"
                                        )}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "p-2 rounded-lg transition-colors",
                                                        transport.arrival.airportTransfer ? "bg-brand-500/20 text-brand-500" : "bg-[var(--glass-border)] text-[var(--text-muted)]"
                                                    )}>
                                                        <Bus className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[var(--text-primary)]">Request Airport Transfer</div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Arrival Shuttle</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleArrivalChange('airportTransfer', !transport.arrival.airportTransfer)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                                        transport.arrival.airportTransfer
                                                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                                                            : "bg-[var(--glass-border)] text-[var(--text-muted)] hover:bg-brand-500/10 hover:text-brand-500"
                                                    )}
                                                >
                                                    {transport.arrival.airportTransfer ? 'Selected' : 'Select'}
                                                </button>
                                            </div>

                                            {transport.arrival.airportTransfer && (
                                                <div className="flex items-center justify-between gap-4 pt-4 border-t border-brand-500/20 animate-in fade-in slide-in-from-top-2">
                                                    <div className="text-xs font-medium text-[var(--text-secondary)]">Transfer headcount must match delegation size:</div>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={transport.arrival.persons}
                                                            onChange={(e) => handleArrivalChange('persons', parseInt(e.target.value) || 0)}
                                                            className="w-20 p-2 h-[38px] bg-[var(--app-bg)]/50 border border-brand-500/30 rounded-lg outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold transition-all text-center text-sm"
                                                        />
                                                        {(() => {
                                                            const isMatch = transport.arrival.persons === basics.headCount.total;
                                                            return (
                                                                <div className={cn(
                                                                    "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                                                                    isMatch ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                                )}>
                                                                    {isMatch ? 'Match' : 'Mismatch'}
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Info for Bus/Car - Simplified info */}
                                    {transport.arrival.type !== 'plane' && (
                                        <div className="text-sm text-[var(--text-muted)] italic bg-[var(--app-bg)]/30 p-3 rounded-lg flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            Please arrive directly at the hotel or accreditation center.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* DEPARTURE */}
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-600 flex items-center justify-center text-sm font-bold">D</div>
                            Departure Details
                        </h3>

                        <div className="space-y-6">
                            {/* Read-only Transport Type for Departure */}
                            <div className="flex items-center gap-4 p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl">
                                <div className="p-2 rounded-lg bg-brand-500/20 text-brand-500">
                                    {transport.departure.type === 'plane' && <Plane className="w-5 h-5" />}
                                    {transport.departure.type === 'bus' && <Bus className="w-5 h-5" />}
                                    {transport.departure.type === 'car' && <Car className="w-5 h-5" />}
                                    {!transport.departure.type && <Info className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500/70">Departure Transport</div>
                                    <div className="text-sm font-bold text-[var(--text-primary)] capitalize">
                                        {transport.departure.type || 'Same as arrival'}
                                    </div>
                                </div>
                                <div className="text-[10px] font-black uppercase text-brand-500/50 flex flex-col items-end">
                                    <div className="flex items-center gap-1">
                                        <CheckSquare className="w-3 h-3 text-emerald-500" />
                                        Synced
                                    </div>
                                    <span className="text-[8px] opacity-70 italic">Manual override allowed</span>
                                </div>
                            </div>

                            {transport.departure.type && (
                                <div className="space-y-6 animate-in slide-in-from-top-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Date & Time - Editable */}
                                        <div>
                                            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Departure Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 w-5 h-5 text-[var(--text-muted)]" />
                                                <input
                                                    type="date"
                                                    value={transport.departure.date}
                                                    onChange={(e) => handleDepartureChange('date', e.target.value)}
                                                    className="w-full pl-10 p-3 bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all h-[46px]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Estimated Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-3 w-5 h-5 text-[var(--text-muted)]" />
                                                <input
                                                    type="time"
                                                    value={transport.departure.time}
                                                    onChange={(e) => handleDepartureChange('time', e.target.value)}
                                                    className="w-full pl-10 p-3 bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all h-[46px]"
                                                />
                                            </div>
                                        </div>

                                        {/* Locked Specific Fields - Predefined Options */}
                                        {transport.departure.type === 'plane' && (
                                            <>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Departure Airport</label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-[var(--text-muted)] border-0" />
                                                        <div className="pl-8">
                                                            <Select
                                                                value={transport.departure.location}
                                                                onChange={(val) => handleDepartureChange('location', val)}
                                                                options={AIRPORTS.map(a => ({ value: a.code, label: a.label }))}
                                                                placeholder="Select Departure Airport..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">Flight Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. OK124"
                                                        value={transport.departure.flightNumber || ''}
                                                        onChange={(e) => handleDepartureChange('flightNumber', e.target.value)}
                                                        className="w-full p-3 h-[46px] bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold transition-all"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Airport Transfer - Departure Status */}
                                    {transport.departure.type === 'plane' && transport.departure.airportTransfer && (
                                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600">
                                                    <Bus className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70">Airport Transfer</div>
                                                    <div className="text-sm font-bold text-[var(--text-primary)]">Departure Shuttle Requested</div>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border",
                                                transport.departure.persons === basics.headCount.total
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            )}>
                                                {transport.departure.persons} Pers. / {transport.departure.persons === basics.headCount.total ? 'Match' : 'Mismatch'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Transport Total */}
                    <div className="flex justify-end pt-4 border-t border-[var(--glass-border)]">
                        <div className="text-right">
                            <div className="text-sm text-[var(--text-muted)]">Transport Estimate</div>
                            <div className="text-2xl font-bold text-brand-600">{costs.transport.toLocaleString()} €</div>
                        </div>
                    </div>

                </div>
            </fieldset>
        </div>
    );
}

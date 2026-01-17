import { useState } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { PageHeader } from '../../../components/ui/PageHeader';
import { IconButton } from '../../../components/ui/IconButton';
import { MapPin, Plus, Save, Trash2, Calendar, PlaySquare } from 'lucide-react';
import { useMatchStore, type Venue } from '../../../store/matchStore';
import { cn } from '../../../lib/utils';

export default function VenueAdminPage() {
    const { venues, updateVenue, addVenue, deleteVenue } = useMatchStore();
    const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = (venue: Venue) => {
        if (isAdding) {
            addVenue(venue);
            setIsAdding(false);
        } else {
            updateVenue(venue);
        }
        setEditingVenue(null);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Venue Administration"
                subtitle="Manage tournament locations, schedules, and training availability"
                actions={
                    <IconButton
                        icon={Plus}
                        variant="primary"
                        label="Add Venue"
                        onClick={() => {
                            const newVenue: Venue = {
                                id: Math.random().toString(36).substr(2, 9),
                                name: '',
                                address: '',
                                availableFrom: '',
                                availableTo: '',
                                dailySchedule: []
                            };
                            setEditingVenue(newVenue);
                            setIsAdding(true);
                        }}
                    />
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {venues.map((venue) => (
                        <GlassCard
                            key={venue.id}
                            className={cn(
                                "p-6 transition-all border",
                                editingVenue?.id === venue.id ? "border-brand-500 shadow-lg shadow-brand-500/10" : "border-white/5"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                                        <MapPin className="w-6 h-6 text-brand-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">{venue.name}</h3>
                                        <p className="text-xs text-[var(--text-muted)] font-medium mt-1">{venue.address}</p>

                                        <div className="flex flex-wrap gap-4 mt-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                                                <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">
                                                    {venue.availableFrom} — {venue.availableTo}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <PlaySquare className="w-3.5 h-3.5 text-brand-500" />
                                                <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">
                                                    {venue.dailySchedule?.length || 0} Days defined
                                                </span>
                                            </div>
                                        </div>

                                        {/* Simplified daily view */}
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                            {venue.dailySchedule?.slice(0, 5).map(day => (
                                                <div key={day.date} className="p-2 bg-white/5 border border-white/10 rounded-lg">
                                                    <div className="text-[8px] font-black text-brand-500 uppercase">{day.date.split('-').slice(1).reverse().join('.')}</div>
                                                    <div className="text-[8px] font-bold text-[var(--text-primary)] mt-0.5">O: {day.openingHours.split(' ')[0]}</div>
                                                    <div className="text-[8px] font-bold text-brand-500/60">T: {day.trainingHours.split(' ')[0]}</div>
                                                </div>
                                            ))}
                                            {(venue.dailySchedule?.length || 0) > 5 && (
                                                <div className="p-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                                                    <span className="text-[8px] font-black text-[var(--text-muted)] uppercase">+{venue.dailySchedule.length - 5} More</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingVenue(venue);
                                            setIsAdding(false);
                                        }}
                                        className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteVenue(venue.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    {editingVenue ? (
                        <GlassCard className="p-6 sticky top-6">
                            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-6">
                                {isAdding ? 'Add Venue' : 'Edit Venue'}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1.5 block">Venue Name</label>
                                    <input
                                        type="text"
                                        value={editingVenue.name}
                                        onChange={(e) => setEditingVenue({ ...editingVenue, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                                        placeholder="e.g. O2 Arena"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1.5 block">Address</label>
                                    <input
                                        type="text"
                                        value={editingVenue.address}
                                        onChange={(e) => setEditingVenue({ ...editingVenue, address: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                                        placeholder="Full address"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1.5 block">Availability Period</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="date"
                                            value={editingVenue.availableFrom}
                                            onChange={(e) => setEditingVenue({ ...editingVenue, availableFrom: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                                        />
                                        <input
                                            type="date"
                                            value={editingVenue.availableTo}
                                            onChange={(e) => setEditingVenue({ ...editingVenue, availableTo: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3 block">Daily Schedule</label>
                                    <div className="space-y-3">
                                        {/* Auto-generate helper */}
                                        <button
                                            onClick={() => {
                                                if (!editingVenue.availableFrom || !editingVenue.availableTo) {
                                                    alert('Set availability period first');
                                                    return;
                                                }
                                                const start = new Date(editingVenue.availableFrom);
                                                const end = new Date(editingVenue.availableTo);
                                                const schedule: any[] = [];
                                                for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                                                    const dateStr = d.toISOString().split('T')[0];
                                                    const existing = editingVenue.dailySchedule?.find(s => s.date === dateStr);
                                                    schedule.push(existing || {
                                                        date: dateStr,
                                                        openingHours: '08:00 - 20:00',
                                                        trainingHours: '08:00 - 10:00',
                                                        note: ''
                                                    });
                                                }
                                                setEditingVenue({ ...editingVenue, dailySchedule: schedule });
                                            }}
                                            className="w-full py-2 bg-white/5 border border-dashed border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-brand-500 hover:bg-brand-500/5 transition-colors"
                                        >
                                            Generate Days from Period
                                        </button>

                                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                            {editingVenue.dailySchedule?.map((day, idx) => (
                                                <div key={day.date} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-brand-500 uppercase">{day.date}</span>
                                                        <button
                                                            onClick={() => {
                                                                const newSchedule = [...editingVenue.dailySchedule];
                                                                newSchedule.splice(idx, 1);
                                                                setEditingVenue({ ...editingVenue, dailySchedule: newSchedule });
                                                            }}
                                                            className="text-red-500/40 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={day.openingHours}
                                                            onChange={(e) => {
                                                                const newSchedule = [...editingVenue.dailySchedule];
                                                                newSchedule[idx] = { ...day, openingHours: e.target.value };
                                                                setEditingVenue({ ...editingVenue, dailySchedule: newSchedule });
                                                            }}
                                                            className="bg-black/20 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-brand-500/30"
                                                            placeholder="Open: 08-20"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={day.trainingHours}
                                                            onChange={(e) => {
                                                                const newSchedule = [...editingVenue.dailySchedule];
                                                                newSchedule[idx] = { ...day, trainingHours: e.target.value };
                                                                setEditingVenue({ ...editingVenue, dailySchedule: newSchedule });
                                                            }}
                                                            className="bg-black/20 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-white outline-none focus:border-brand-500/30"
                                                            placeholder="Train: 08-10"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={day.note || ''}
                                                        onChange={(e) => {
                                                            const newSchedule = [...editingVenue.dailySchedule];
                                                            newSchedule[idx] = { ...day, note: e.target.value };
                                                            setEditingVenue({ ...editingVenue, dailySchedule: newSchedule });
                                                        }}
                                                        className="w-full bg-black/20 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-[var(--text-muted)] outline-none focus:border-brand-500/30"
                                                        placeholder="Add note..."
                                                    />
                                                </div>
                                            ))}
                                            {(!editingVenue.dailySchedule || editingVenue.dailySchedule.length === 0) && (
                                                <div className="text-center py-6 border border-dashed border-white/5 rounded-xl">
                                                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">No daily schedule defined</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => {
                                            setEditingVenue(null);
                                            setIsAdding(false);
                                        }}
                                        className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSave(editingVenue)}
                                        className="flex-[2] bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" /> Save Venue
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ) : (
                        <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center text-center">
                            <MapPin className="w-12 h-12 text-white/5 mb-4" />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Select a venue to edit or add a new one</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

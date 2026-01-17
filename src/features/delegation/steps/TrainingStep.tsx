import { Plus, Trash2, Dumbbell, Calendar, Info } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Select } from '../../../components/ui/Select';
import { useDelegationStore } from '../../../store/delegationStore';
import type { TrainingSession } from '../../../store/delegationStore';

export function TrainingStep() {
    const { training, updateTraining, getEstimatedCosts } = useDelegationStore();
    const costs = getEstimatedCosts();

    const handleAddSession = () => {
        const newSession: TrainingSession = {
            id: crypto.randomUUID(),
            date: '2026-10-14', // Default to first paid day
            slots: 1
        };
        updateTraining({ sessions: [...training.sessions, newSession] });
    };

    const updateSession = (id: string, field: keyof TrainingSession, value: any) => {
        const newSessions = training.sessions.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        );
        updateTraining({ sessions: newSessions });
    };

    const removeSession = (id: string) => {
        updateTraining({ sessions: training.sessions.filter(s => s.id !== id) });
    };

    const isSubmitted = useDelegationStore(state => state.status === 'submitted');

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <fieldset disabled={isSubmitted} className="space-y-8 h-full w-full border-none p-0 m-0">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">Training Sessions</h2>
                    <p className="text-[var(--text-secondary)]">Book paid training slots for pre-tournament days.</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <strong>Paid Training Policy:</strong><br />
                            Paid sessions are only available on <strong>October 14th and 15th</strong>.
                            Training on other days is free of charge and scheduled separately.
                        </div>
                    </div>

                    {training.sessions.map((session, index) => (
                        <GlassCard key={session.id} className="p-6 relative group overflow-hidden animate-in slide-in-from-bottom-4">
                            {!isSubmitted && (
                                <button
                                    onClick={() => removeSession(session.id)}
                                    className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            <h3 className="font-bold text-lg text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                <Dumbbell className="w-5 h-5 text-violet-600" />
                                Session {index + 1}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-muted)]" />
                                        <Select
                                            value={session.date}
                                            onChange={(val) => updateSession(session.id, 'date', val)}
                                            options={[
                                                { value: '2026-10-14', label: 'October 14, 2026' },
                                                { value: '2026-10-15', label: 'October 15, 2026' }
                                            ]}
                                            placeholder="Select Date"
                                            className="pl-8 w-full"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Number of Slots</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={session.slots}
                                        onChange={(e) => updateSession(session.id, 'slots', parseInt(e.target.value) || 1)}
                                        className="w-full p-3 h-[46px] bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold transition-all"
                                    />
                                    <p className="text-xs text-[var(--text-muted)] mt-1 flex gap-4">
                                        <span>⏱ 1 slot = 45 minutes</span>
                                        <span>🏟 Half Hall</span>
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    {!isSubmitted && (
                        <button
                            onClick={handleAddSession}
                            className="w-full py-4 border-2 border-dashed border-[var(--glass-border)] rounded-xl flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:border-brand-500 hover:text-brand-600 transition-all group"
                        >
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Add Training Session</span>
                        </button>
                    )}

                    <div className="flex justify-end pt-4 border-t border-[var(--glass-border)]">
                        <div className="text-right">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">Training Estimate</div>
                            <div className="text-2xl font-black text-brand-600">{costs.training.toLocaleString()} €</div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    );
}

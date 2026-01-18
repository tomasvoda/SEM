import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { useDelegationStore } from '../../store/delegationStore';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, Save } from 'lucide-react';

export function EventPricingPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <PageHeader
                    title="Pricing & Packages"
                    subtitle="Manage event pricing, hotel rates, and meal packages"
                    breadcrumbs={[
                        { label: 'Admin', href: '/admin/dashboard' },
                        { label: 'Pricing' }
                    ]}
                />
            </div>

            <div className="w-full">
                <PricingSettings />
            </div>
        </div>
    );
}

function PricingSettings() {
    const { pricing, updatePricing } = useDelegationStore();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate save - the state is already updated via updatePricing
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <GlassCard className="p-8">
                <div className="space-y-10">
                    {/* 1. ACCOMMODATION DEFAULT */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">Hotels (Default Rates)</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Single Room', key: 'single' },
                                { label: 'Double Room', key: 'double' },
                                { label: 'Triple Room', key: 'triple' }
                            ].map((room) => (
                                <div key={room.key} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{room.label}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-black text-xs">€</span>
                                        <input
                                            type="number"
                                            value={(pricing.accommodation.default as any)[room.key] || 0}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                updatePricing({
                                                    accommodation: {
                                                        default: {
                                                            ...pricing.accommodation.default,
                                                            [room.key]: val
                                                        } as any
                                                    }
                                                })
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. CATERING */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">Catering Packages (Per Person/Day)</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Full Board', key: 'full_board' },
                                { label: 'Half Board', key: 'half_board' },
                                { label: 'Lunch Package', key: 'lunchPackage' },
                                { label: 'Hot Lunch', key: 'hotLunch' }
                            ].map((cat) => (
                                <div key={cat.key} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{cat.label}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-black text-xs">€</span>
                                        <input
                                            type="number"
                                            value={pricing.catering[cat.key as keyof typeof pricing.catering] || 0}
                                            onChange={(e) => updatePricing({ catering: { [cat.key]: Number(e.target.value) } as any })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. TRANSPORT */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Logistics (Per Individual Transfer)</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Prague (PRG)', key: 'PRG' },
                                { label: 'Vienna (VIE)', key: 'VIE' },
                                { label: 'Brno (BRQ)', key: 'BRQ' },
                                { label: 'Default / Other', key: 'default' }
                            ].map((airport) => (
                                <div key={airport.key} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{airport.label}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-black text-xs">€</span>
                                        <input
                                            type="number"
                                            value={airport.key === 'default' ? pricing.transport.default : (pricing.transport[airport.key] || 0)}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                if (airport.key === 'default') {
                                                    updatePricing({ transport: { default: val } });
                                                } else {
                                                    updatePricing({ transport: { [airport.key]: val } as any });
                                                }
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. ACCREDITATION */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-purple-500">Accreditation</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Fee per Person / Tournament (€)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-black text-xs">€</span>
                                    <input
                                        type="number"
                                        value={pricing.accreditation || 0}
                                        onChange={(e) => updatePricing({ accreditation: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. TRAINING */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-500">Training Sessions</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Price per Slot (€)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-black text-xs">€</span>
                                    <input
                                        type="number"
                                        value={pricing.training.slot}
                                        onChange={(e) => updatePricing({ training: { slot: Number(e.target.value) } })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest max-w-md">
                        Note: Packaging changes apply to all new and draft delegations. Confirmed delegations retain their original pricing snapshots.
                    </p>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg",
                            showSuccess ? "bg-emerald-500 text-white" : "bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20"
                        )}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : showSuccess ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Saved Successfully
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Packages
                            </>
                        )}
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}

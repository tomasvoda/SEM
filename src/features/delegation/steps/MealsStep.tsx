import { Utensils, Wheat, Check } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { useDelegationStore } from '../../../store/delegationStore';
import { cn } from '../../../lib/utils';

export function MealsStep() {
    const { meals, updateMeals, getEstimatedCosts } = useDelegationStore();
    const costs = getEstimatedCosts();

    const handleDietaryChange = (key: string, value: string | number) => {
        updateMeals({
            dietary: { ...meals.dietary, [key]: value }
        });
    };

    const handleAddon = (key: 'lunchPackage' | 'hotLunch', value: boolean) => {
        const newAddons = { ...meals.addons, [key]: value };

        // Mutually exclusive logic
        if (key === 'lunchPackage' && value) {
            newAddons.hotLunch = false;
        }
        if (key === 'hotLunch' && value) {
            newAddons.lunchPackage = false;
        }

        updateMeals({ addons: newAddons });
    };

    const isSubmitted = status === 'submitted';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <fieldset disabled={isSubmitted} className="space-y-8 border-none p-0 m-0">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">Catering Plan</h2>
                    <p className="text-[var(--text-secondary)]">Select meal plan for the entire delegation.</p>
                </div>

                <div className="space-y-12">
                    {/* Plan Selection */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600">
                                <Utensils className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Catering Plan</h3>
                                <p className="text-sm text-[var(--text-muted)]">Official Half-Board catering is mandatory.</p>
                            </div>
                        </div>

                        <GlassCard className="p-6 border-brand-500 bg-brand-500/5 relative overflow-hidden">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Selected Plan</span>
                                    <h4 className="text-2xl font-black text-[var(--text-primary)] mt-1">Half Board</h4>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">Breakfast + Dinner service at the hotel/venue.</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 text-right">
                                    <div className="bg-brand-500 text-white p-2 rounded-full shadow-lg">
                                        <Check className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-500/50">Standard Menu Included</span>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Lunch Options */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                                <Utensils className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Additional Lunch Services</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { id: 'lunchPackage', title: 'Lunch Package', desc: 'High-performance portable lunch designed for match days. Includes main course, fruit, and hydration.', icon: <Utensils className="w-10 h-10" /> },
                                { id: 'hotLunch', title: 'Hot Lunch', desc: 'Full hot meal service served at the designated catering area or designated hotel restaurant.', icon: <Utensils className="w-10 h-10" /> }
                            ].map((option) => {
                                const isSelected = meals.addons?.[option.id as keyof typeof meals.addons];
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleAddon(option.id as any, !isSelected)}
                                        className={cn(
                                            "text-left p-8 rounded-[32px] border-2 transition-all duration-500 relative overflow-hidden group min-h-[260px] flex flex-col justify-between",
                                            isSelected
                                                ? "border-brand-500 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] bg-brand-500/[0.03]"
                                                : "border-[var(--glass-border)] bg-[var(--glass-surface)] hover:border-brand-500/40"
                                        )}
                                    >
                                        <div className="relative z-10 flex justify-between items-start">
                                            <div className={cn(
                                                "p-5 rounded-2xl transition-all duration-500",
                                                isSelected ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30" : "bg-brand-500/10 text-brand-500"
                                            )}>
                                                {option.icon}
                                            </div>
                                            {isSelected && (
                                                <div className="bg-brand-500 text-white p-2 rounded-full shadow-lg animate-in zoom-in-50 duration-500">
                                                    <Check className="w-4 h-4 font-black" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative z-10 mt-6">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 mb-1">Service Level 02</div>
                                            <h4 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-tight">{option.title}</h4>
                                            <p className="text-[var(--text-secondary)] leading-relaxed text-sm mt-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                                {option.desc}
                                            </p>
                                        </div>

                                        {isSelected && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dietary Requirements */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Wheat className="w-5 h-5 text-brand-600" />
                            <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-tight">Dietary Requirements</h3>
                        </div>
                        <GlassCard className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'vegetarian', label: 'Vegetarian', sub: 'No meat' },
                                    { id: 'vegan', label: 'Vegan', sub: 'Plant based' },
                                    { id: 'glutenFree', label: 'Gluten Free', sub: 'Celiac safe' }
                                ].map((diet) => (
                                    <div key={diet.id} className="space-y-2">
                                        <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">
                                            <span>{diet.label}</span>
                                            <span className="text-[9px] font-black uppercase text-brand-500/50">{diet.sub}</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={meals.dietary[diet.id as keyof typeof meals.dietary] || ''}
                                            onChange={(e) => handleDietaryChange(diet.id, parseInt(e.target.value) || 0)}
                                            className="w-full p-3 h-[46px] bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-center font-bold"
                                            placeholder="0"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Other Allergies / Specific Requirements</label>
                                <textarea
                                    value={meals.dietary.other}
                                    onChange={(e) => handleDietaryChange('other', e.target.value)}
                                    placeholder="Please list any other allergies or specific dietary needs..."
                                    className="w-full p-4 bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 min-h-[100px] text-sm"
                                />
                            </div>
                        </GlassCard>

                        <div className="flex justify-end pt-4 border-t border-[var(--glass-border)]">
                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">Meals Estimate</div>
                                <div className="text-2xl font-black text-brand-600">{costs.meals.toLocaleString()} €</div>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    );
}

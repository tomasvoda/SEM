import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { ChevronRight, ChevronLeft, CheckCircle2, Save } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { useDelegationStore } from '../../store/delegationStore';
import { useState } from 'react';
import { getFlagUrl } from '../../lib/countryUtils';

const STEPS = [
    { path: 'basics', label: 'Basics' },
    { path: 'accommodation', label: 'Accommodation' },
    { path: 'transport', label: 'Transport' },
    { path: 'training', label: 'Training' },
    { path: 'meals', label: 'Meals' },
    { path: 'billing', label: 'Billing' },
    { path: 'confirmation', label: 'Review' },
];

export function DelegationLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { basics, agreedToTerms, submitReservation, status, getEstimatedCosts, isStepValid, isLoading, error } = useDelegationStore();
    const [showCostDetails, setShowCostDetails] = useState(false);

    // Determine current step index
    const currentPath = location.pathname.split('/').pop() || 'basics';
    const currentIndex = STEPS.findIndex((s) => s.path === currentPath);
    const isLastStep = currentIndex === STEPS.length - 1;
    const isSubmitted = status === 'submitted';

    const costs = getEstimatedCosts();
    const isValid = isStepValid(currentPath);


    // Handlers
    const handleNext = () => {
        // Blocking Validation
        if (!isValid) return;

        if (isLastStep) {
            if (!agreedToTerms) {
                alert('Please agree to the Terms & Conditions.');
                return;
            }
            submitReservation();
        } else {
            navigate(STEPS[currentIndex + 1].path);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            navigate(STEPS[currentIndex - 1].path);
        }
    };

    const handleSaveDraft = () => {
        // Logic for save draft (persisted automatically)
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] pb-40"> {/* Increased padding for larger footer */}

            {/* Top Bar Branding */}
            <div className="mb-8 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">
                        European Championship 2026
                    </h1>
                    <p className="text-[var(--text-secondary)] font-medium">Official Delegation Reservation</p>
                </div>

                {basics.teamName && (
                    <div className="flex items-center gap-3 py-2 px-4 rounded-xl glass border border-brand-500/20 w-fit">
                        <img
                            src={getFlagUrl(basics.country_code)}
                            alt={basics.country_code}
                            className="w-8 h-5 object-cover rounded shadow-sm border border-white/10"
                        />
                        <span className="text-lg font-black text-white uppercase tracking-tight">{basics.teamName}</span>
                    </div>
                )}

                <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-[0.2em] flex items-center gap-3">
                    <span>Prostějov</span>
                    <span className="opacity-30">·</span>
                    <span>Otrokovice</span>
                    <span className="opacity-30">·</span>
                    <span>Zlín</span>
                </div>
            </div>

            {/* Progress Header */}
            <div className={cn(
                "mb-8 transition-all duration-700",
                currentPath === 'confirmation' ? "opacity-40 grayscale hover:opacity-100 hover:grayscale-0 scale-95 origin-top" : "opacity-100"
            )}>
                <GlassCard className="p-4 md:p-6 overflow-x-auto">
                    <div className="flex items-center min-w-max">
                        {STEPS.map((step, idx) => {
                            const isActive = idx === currentIndex;
                            const isPast = idx < currentIndex;

                            return (
                                <button
                                    key={step.path}
                                    onClick={() => (isSubmitted || isPast) && navigate(step.path)}
                                    disabled={!isSubmitted && !isPast}
                                    className="flex items-center group bg-transparent border-none p-0 cursor-pointer disabled:cursor-default"
                                >
                                    <div className={cn(
                                        "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300",
                                        isActive ? "bg-brand-600 text-white ring-4 ring-brand-500/20" :
                                            isPast || isSubmitted ? "bg-brand-500/20 text-brand-600 group-hover:bg-brand-500/30" :
                                                "bg-[var(--glass-border)] text-[var(--text-muted)]"
                                    )}>
                                        {(isPast && !isSubmitted) ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                    </div>

                                    <span className={cn(
                                        "ml-3 text-sm font-medium mr-4 transition-colors",
                                        isActive ? "text-[var(--text-primary)]" :
                                            isPast || isSubmitted ? "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" :
                                                "text-[var(--text-muted)]"
                                    )}>
                                        {step.label}
                                    </span>

                                    {idx < STEPS.length - 1 && (
                                        <div className="w-12 h-px bg-[var(--glass-border)] mr-4" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Outlet />
            </div>

            {/* Sticky Bottom Actions - Hide if submitted */}
            {!isSubmitted && (
                <div className="fixed bottom-0 left-0 right-0 z-50">


                    {/* Decision Panel (Cost Summary) */}
                    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-0 pointer-events-none flex flex-col items-end">
                        {/* Expanded Details */}
                        {showCostDetails && (
                            <GlassCard className="pointer-events-auto p-6 mb-4 w-full md:w-96 animate-in slide-in-from-bottom-4 bg-[var(--glass-surface)]/95 backdrop-blur-xl border-brand-500/20 shadow-2xl">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4 border-b border-[var(--glass-border)] pb-2 flex justify-between items-center">
                                    <span>Cost Breakdown</span>
                                    <button onClick={() => setShowCostDetails(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">Close</button>
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--text-secondary)]">Accommodation</span>
                                        <span className="font-medium">{costs.accommodation.toLocaleString()} €</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--text-secondary)]">Catering</span>
                                        <span className="font-medium">{costs.meals.toLocaleString()} €</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--text-secondary)]">Transport</span>
                                        <span className="font-medium">{costs.transport.toLocaleString()} €</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--text-secondary)]">Accreditation</span>
                                        <span className="font-medium">{costs.accreditation.toLocaleString()} €</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--text-secondary)]">Training</span>
                                        <span className="font-medium">{costs.training.toLocaleString()} €</span>
                                    </div>
                                    <div className="pt-3 border-t border-[var(--glass-border)] mt-3 flex justify-between items-center text-brand-600 font-bold text-lg">
                                        <span>Total Estimate</span>
                                        <span>{costs.total.toLocaleString()} €</span>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] mt-2 italic text-center">
                                        * Final invoice will be generated based on actual usage.
                                    </p>
                                </div>
                            </GlassCard>
                        )}

                        {/* Collapsed Bar */}
                        <div className="pointer-events-auto mb-[-1px] rounded-t-xl overflow-hidden bg-[var(--glass-surface)] backdrop-blur-md border md:border-b-0 border-[var(--glass-border)] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex items-center">
                            <div className="px-6 py-3 flex items-center gap-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Estimated Total</span>
                                    <span className="text-xl font-bold text-brand-600 leading-none">{costs.total.toLocaleString()} €</span>
                                </div>
                                <div className="h-8 w-px bg-[var(--glass-border)]" />
                                <button
                                    onClick={() => setShowCostDetails(!showCostDetails)}
                                    className={cn(
                                        "text-sm font-medium transition-colors flex items-center gap-2",
                                        showCostDetails ? "text-brand-600" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    )}
                                >
                                    {showCostDetails ? 'Hide Breakdown' : 'View Breakdown'}
                                    <div className={cn("w-2 h-2 border-r-2 border-t-2 border-current transform transition-transform", showCostDetails ? "rotate-135" : "-rotate-45 mb-1")} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Action Bar - SOLID HIGH CONTRAST */}
                    <div className="bg-[var(--app-bg)] border-t-2 border-brand-500 p-4 md:p-6 shadow-2xl pointer-events-auto">
                        {error && (
                            <div className="max-w-7xl mx-auto mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                                <div className="w-1 h-1 rounded-full bg-red-500" />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            {/* Left: Back / Save Draft */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleBack}
                                    disabled={currentIndex === 0}
                                    className={cn(
                                        "px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all",
                                        currentIndex === 0 ? "opacity-0 pointer-events-none" : "text-[var(--text-secondary)] hover:bg-[var(--glass-border)]"
                                    )}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </button>

                                <button
                                    onClick={handleSaveDraft}
                                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[var(--glass-border)]"
                                >
                                    <Save className="w-4 h-4" />
                                    <span className="hidden sm:inline">Save Draft</span>
                                </button>
                            </div>

                            {/* Right: Continue */}
                            <button
                                onClick={handleNext}
                                disabled={!isValid || (isLastStep && !agreedToTerms) || isLoading}
                                className={cn(
                                    "px-8 py-3 rounded-xl flex items-center gap-3 text-sm font-bold shadow-lg transition-all duration-300 min-w-[200px] justify-center",
                                    // Logic: High Contrast Solid Colors
                                    (!isValid || (isLastStep && !agreedToTerms) || isLoading)
                                        ? "bg-[var(--glass-border)] text-[var(--text-muted)] cursor-not-allowed opacity-70"
                                        : isLastStep
                                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                                            : "bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/20 hover:scale-[1.02] active:scale-95"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isLastStep ? 'Submit Reservation' : 'Save & Continue'}</span>
                                        {isLastStep ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

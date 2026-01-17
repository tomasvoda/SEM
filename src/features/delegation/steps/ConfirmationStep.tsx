import { Calculator, MapPin, Users, Plane, Hotel, Utensils, Trophy, CheckCircle2, Plus, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { useDelegationStore, HOTEL_TO_CITY_MAPPING } from '../../../store/delegationStore';
import { parseISO, format, differenceInDays, isValid } from 'date-fns';
import { cn } from '../../../lib/utils';
import { Link, useLocation } from 'react-router-dom';

export function ConfirmationStep() {
    const location = useLocation();
    const { basics, accommodation, transport, meals, training, agreedToTerms, setAgreedToTerms, getEstimatedCosts, status } = useDelegationStore();

    const formatDate = (d: string) => {
        if (!d) return 'Not set';
        const date = parseISO(d);
        if (!isValid(date)) return 'Invalid date';
        return format(date, 'PPP');
    };
    const costs = getEstimatedCosts();
    const isSubmitted = status === 'submitted';

    const calculateNights = (checkIn: string, checkOut: string) => {
        if (!checkIn || !checkOut) return 0;
        const d1 = parseISO(checkIn);
        const d2 = parseISO(checkOut);
        if (isValid(d1) && isValid(d2)) {
            return Math.max(0, differenceInDays(d2, d1));
        }
        return 0;
    };


    const SectionHeader = ({ icon: Icon, title, subTitle }: { icon: any, title: string, subTitle: string }) => (
        <div className="flex flex-col gap-1 mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-500/5 border border-brand-500/10 print:hidden">
                    <Icon className="w-5 h-5 text-brand-500" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight print:text-black print:text-2xl">{title}</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)] ml-11 print:text-gray-600 print:ml-0">{subTitle}</p>
        </div>
    );

    const DataRow = ({ label, value, emphasized = false, className = "" }: { label: string, value: React.ReactNode, emphasized?: boolean, className?: string }) => (
        <div className={cn("grid grid-cols-2 py-4 border-b border-[var(--glass-border)] last:border-0 items-center min-h-[64px]", className)}>
            <span className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
            <div className={cn("text-right font-medium", emphasized ? "text-lg font-black text-brand-500" : "text-[var(--text-primary)]")}>
                {value}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-16 pb-24 print:pb-0 print:space-y-10">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: A4 portrait; margin: 20mm; }
                    body { background: white !important; color: black !important; -webkit-print-color-adjust: exact !important; }
                    .GlassCard { 
                        background: white !important; 
                        border: 1px solid #e2e8f0 !important; 
                        box-shadow: none !important; 
                        backdrop-filter: none !important;
                        border-radius: 8px !important;
                        color: black !important;
                        padding: 1.5rem !important;
                        margin-bottom: 1.5rem !important;
                    }
                    .print-hidden, .print\\:hidden, button, .no-print { display: none !important; }
                    h1, h2, h3, h4, p, span, div, td, th { color: black !important; }
                    .text-brand-500, .text-brand-600 { color: #2563eb !important; }
                    .bg-brand-500, .bg-brand-500\\/10 { border-color: #2563eb !important; }
                    header, nav, aside, footer, .md\\:pl-64, .fixed { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; width: 100% !important; position: static !important; }
                    .DataRow { border-bottom: 1px solid #e2e8f0 !important; }
                }
            `}} />

            <header className="relative border-b-2 border-brand-500/30 pb-12 print:pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 print:hidden">
                        <Trophy className="w-8 h-8 text-brand-500" />
                        <div className="h-4 w-px bg-[var(--glass-border)]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-500/80">Official Confirmation</span>
                    </div>

                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight uppercase leading-none print:text-black">
                            European Korfball <span className="text-brand-500">Championship 2026</span>
                        </h1>
                        <p className="text-xs font-bold text-[var(--text-muted)] mt-3 uppercase tracking-[0.3em] flex items-center gap-2 print:text-gray-600">
                            Prostějov <span className="text-lg text-[var(--text-muted)]">•</span> Otrokovice <span className="text-lg text-[var(--text-muted)]">•</span> Zlín
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-500" />
                            <span className="text-lg font-bold text-[var(--text-secondary)] print:text-black">
                                {basics.federation}
                            </span>
                        </div>
                        <div className="text-[var(--text-muted)] opacity-30">/</div>
                        <span className="text-lg font-medium text-[var(--text-muted)] print:text-gray-700">{basics.teamName}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-6 min-w-[280px] w-full md:w-auto">
                    <div className="text-right space-y-1 print:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Reservation ID</p>
                        <p className="text-lg font-mono font-bold text-[var(--text-primary)] print:text-black">SEM-{new Date().getFullYear()}-{basics.country_code.toUpperCase()}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3 w-full">
                        <div className={cn(
                            "px-6 py-2 rounded-full border-2 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 w-fit",
                            isSubmitted
                                ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-500"
                                : "border-amber-500/50 bg-amber-500/5 text-amber-500"
                        )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", isSubmitted ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                            {isSubmitted ? 'Confirmed Reservation' : 'Draft Review Mode'}
                        </div>

                        {isSubmitted && (
                            <div className="flex gap-4 no-print">
                                <button
                                    onClick={() => {
                                        useDelegationStore.getState().reset();
                                        window.location.reload();
                                    }}
                                    className="mt-2 flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-600 transition-all"
                                >
                                    <Plus className="w-4 h-4" /> Register New Team
                                </button>
                                {location.pathname.includes('/admin/') && (
                                    <Link
                                        to="/admin/delegations"
                                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-[var(--glass-surface)] text-[var(--text-primary)] border border-[var(--glass-border)] rounded-lg text-xs font-bold hover:bg-[var(--glass-border)] transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back to Admin
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="space-y-16 print:space-y-8">
                {/* I. Mission & Team */}
                <section>
                    <SectionHeader icon={Users} title="I. Mission & Team" subTitle="Team identification and delegation size" />
                    <GlassCard className="p-8">
                        <div className="space-y-2">
                            <DataRow label="Federation / Country" value={`${basics.federation} (${basics.country_code})`} emphasized />
                            <DataRow label="Team Name" value={basics.teamName || 'N/A'} />
                            <DataRow label="Headcount Breakdown" value={
                                <div className="flex gap-4 justify-end items-center">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] uppercase font-black text-[var(--text-muted)]">Players</span>
                                        <span className="font-black text-lg">{basics.headCount.players} / 14</span>
                                    </div>
                                    <div className="w-px h-8 bg-[var(--glass-border)]" />
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] uppercase font-black text-[var(--text-muted)]">Staff</span>
                                        <span className="font-black text-lg">{basics.headCount.staff} / 5</span>
                                    </div>
                                    <div className="w-px h-8 bg-brand-500/30" />
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] uppercase font-black text-brand-500">Total</span>
                                        <span className="font-black text-xl text-brand-500">{basics.headCount.total} / 19</span>
                                    </div>
                                </div>
                            } />
                            <DataRow label="Accreditation" value={
                                <div className="flex items-center gap-2 justify-end">
                                    <span className="text-xs font-bold text-[var(--text-muted)] italic">({basics.headCount.total} pers × 65 €)</span>
                                    <span className="font-black text-brand-600">{costs.accreditation.toLocaleString()} €</span>
                                </div>
                            } />
                            <DataRow label="Primary Contact" value={basics.contactPerson} />
                        </div>
                    </GlassCard>
                </section>

                {/* II. Logistics */}
                <section>
                    <SectionHeader icon={Plane} title="II. Logistical Planning" subTitle="Arrival, departure and airport transfers" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassCard className="p-8 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                                    <Plane className="w-5 h-5 rotate-0" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Logistics Phase 01</span>
                                    <h4 className="font-bold text-[var(--text-primary)]">Arrival Protocol</h4>
                                </div>
                            </div>
                            <div className="space-y-0.5 flex-1">
                                <DataRow label="Transport Type" value={transport.arrival.type || 'N/A'} className="min-h-[56px]" />
                                <DataRow label="Arrival Schedule" value={
                                    <div className="text-right">
                                        <div className="text-sm font-bold">{formatDate(basics.dates.arrival)}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-0.5">{transport.arrival.time || '--:--'} Arrival</div>
                                    </div>
                                } className="min-h-[56px]" />
                                <DataRow label="Airport / Terminal" value={transport.arrival.location || 'N/A'} className="min-h-[56px]" />
                                <DataRow label="Flight Number" value={transport.arrival.flightNumber || '---'} emphasized className="border-0 min-h-[56px]" />
                            </div>
                            <div className="mt-6 pt-6 border-t border-[var(--glass-border)] flex items-center justify-between">
                                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Airport Transfer</div>
                                <div className="px-2 py-1 bg-[var(--glass-border)]/5 text-[var(--text-muted)] rounded text-[10px] font-black border border-[var(--glass-border)]">
                                    {transport.arrival.airportTransfer ? `Requested (${transport.arrival.persons} pers)` : 'Not Requested'}
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                                    <Plane className="w-5 h-5 rotate-180" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Logistics Phase 02</span>
                                    <h4 className="font-bold text-[var(--text-primary)]">Departure Protocol</h4>
                                </div>
                            </div>
                            <div className="space-y-0.5 flex-1">
                                <DataRow label="Transport Type" value={transport.departure.type || 'N/A'} className="min-h-[56px]" />
                                <DataRow label="Departure Schedule" value={
                                    <div className="text-right">
                                        <div className="text-sm font-bold">{formatDate(basics.dates.departure)}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-0.5">{transport.departure.time || '--:--'} Departure</div>
                                    </div>
                                } className="min-h-[56px]" />
                                <DataRow label="Airport / Terminal" value={transport.departure.location || 'N/A'} className="min-h-[56px]" />
                                <DataRow label="Flight Number" value={transport.departure.flightNumber || '---'} emphasized className="border-0 min-h-[56px]" />
                            </div>
                            <div className="mt-6 pt-6 border-t border-[var(--glass-border)] flex items-center justify-between">
                                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Airport Transfer</div>
                                <div className="px-2 py-1 bg-[var(--glass-border)]/5 text-[var(--text-muted)] rounded text-[10px] font-black border border-[var(--glass-border)]">
                                    {transport.departure.airportTransfer ? `Requested (${transport.departure.persons} pers)` : 'Not Requested'}
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </section>

                {/* III. Accommodation */}
                <section>
                    <SectionHeader icon={Hotel} title="III. Accommodation & Stay" subTitle="Hotel arrangements and beds breakdown" />
                    {accommodation.length === 0 ? (
                        <div className="bg-[var(--glass-surface)] border border-dashed border-[var(--glass-border)] rounded-2xl p-8 text-center text-[var(--text-muted)]">
                            No accommodation recorded.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {accommodation.map((block) => {
                                const nights = calculateNights(block.checkIn, block.checkOut);
                                return (
                                    <GlassCard key={block.id} className="p-8">
                                        <div className="flex flex-col md:flex-row justify-between gap-8">
                                            <div className="space-y-4 flex-1">
                                                <div>
                                                    <h4 className="text-2xl font-black text-[var(--text-primary)] leading-tight">{block.hotel || 'Unnamed Hotel'}</h4>
                                                    <p className="text-sm text-[var(--text-muted)] flex items-center gap-2 mt-1">
                                                        <MapPin className="w-4 h-4" /> {HOTEL_TO_CITY_MAPPING[block.hotel] || 'Unknown City'}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[var(--glass-border)]">
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.1em]">Check-In</span>
                                                        <p className="font-medium text-[var(--text-primary)]">{formatDate(block.checkIn)}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.1em]">Check-Out</span>
                                                        <p className="font-medium text-[var(--text-primary)]">{formatDate(block.checkOut)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:w-64 space-y-4">
                                                <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex flex-col items-center">
                                                    <span className="text-4xl font-black text-brand-500">{nights}</span>
                                                    <span className="text-[10px] uppercase font-bold text-brand-500/70 tracking-widest mt-1">{nights === 1 ? 'Night' : 'Nights'} Total</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Array.isArray(block.rooms) ? block.rooms.map((room, idx) => (
                                                        <div key={idx} className="text-center p-2 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)]">
                                                            <div className="text-sm font-bold">{room.count}</div>
                                                            <div className="text-[8px] uppercase text-[var(--text-muted)] font-black">{room.capacity} BEDS</div>
                                                        </div>
                                                    )) : (
                                                        <div className="col-span-2 text-[8px] text-[var(--text-muted)] italic">Invalid data format</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* IV. Catering & Nutrition */}
                <section>
                    <SectionHeader icon={Utensils} title="IV. Catering & Nutrition" subTitle="Meal plans and special dietary requirements" />
                    <GlassCard className="p-8">
                        <div className="space-y-2">
                            <DataRow label="Selected Meal Plan" value={
                                <div className="flex flex-col items-end">
                                    <span className="text-xl font-black text-brand-500 whitespace-nowrap">Half Board</span>
                                    <div className="flex gap-2">
                                        {meals.addons.lunchPackage && <span className="text-[9px] font-black uppercase text-brand-600 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded italic">Lunch Package</span>}
                                        {meals.addons.hotLunch && <span className="text-[9px] font-black uppercase text-brand-600 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded italic">Hot Lunch</span>}
                                    </div>
                                </div>
                            } />

                            <DataRow label="Dietary Requirements" value={
                                <div className="flex flex-col items-end gap-1.5">
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        {meals.dietary.vegetarian > 0 && <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-500/20 italic">{meals.dietary.vegetarian} Vegetarian</span>}
                                        {meals.dietary.vegan > 0 && <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-500/20 italic">{meals.dietary.vegan} Vegan</span>}
                                        {meals.dietary.glutenFree > 0 && <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-500/20 italic">{meals.dietary.glutenFree} Gluten-Free</span>}
                                    </div>
                                </div>
                            } />

                            {meals.dietary.other && (
                                <div className="pt-4 mt-2">
                                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest block mb-2 text-right">Additional Notes</span>
                                    <p className="text-sm font-medium italic text-[var(--text-secondary)] text-right bg-brand-500/5 p-4 rounded-xl border border-brand-500/10">
                                        "{meals.dietary.other}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </section>

                {/* V. Training Schedule */}
                <section>
                    <SectionHeader icon={Trophy} title="V. Training Schedule" subTitle="Reserved slots for official practice Sessions" />
                    <GlassCard className="p-0 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-brand-500/5">
                                    <th className="px-8 py-5 text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Training Session Date</th>
                                    <th className="px-8 py-5 text-xs font-black text-[var(--text-muted)] uppercase tracking-widest text-center">Reserved Slots</th>
                                    <th className="px-8 py-5 text-xs font-black text-[var(--text-muted)] uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--glass-border)]">
                                {training.sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-10 text-center text-[var(--text-muted)] italic">No sessions reserved.</td>
                                    </tr>
                                ) : (
                                    training.sessions.map((s) => (
                                        <tr key={s.id} className="hover:bg-brand-500/5 transition-colors">
                                            <td className="px-8 py-4 font-bold text-[var(--text-primary)]">{s.date}</td>
                                            <td className="px-8 py-4 text-center font-black text-brand-500 text-lg">{s.slots}</td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-brand-500 font-black text-[10px] uppercase tracking-widest">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                                    Requested
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </GlassCard>
                </section>
            </div>

            <section>
                <div className="flex flex-col gap-1 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 print:hidden">
                            <Calculator className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight print:text-black">VI. Estimated Costs</h3>
                    </div>
                </div>

                <GlassCard className="p-0 overflow-hidden border-2 border-brand-500/20 shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 print:hidden">
                        <Calculator className="w-32 h-32 text-brand-500" />
                    </div>

                    <div className="p-10 space-y-8 relative z-10">
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 pb-4 border-b-2 border-brand-500/30">
                                <span className="text-xs font-black uppercase tracking-widest text-brand-500">Resource category</span>
                                <span className="text-xs font-black uppercase tracking-widest text-brand-500 text-right">Estimated Amount</span>
                            </div>
                            <DataRow label="Accommodation & Lodging" value={`${costs.accommodation.toLocaleString()} €`} />
                            <DataRow label="Catering & Nutrition" value={`${costs.meals.toLocaleString()} €`} />
                            <DataRow label="Transport & Logistics" value={`${costs.transport.toLocaleString()} €`} />
                            <DataRow label="Accreditation Fee" value={`${costs.accreditation.toLocaleString()} €`} />
                            <DataRow label="Training Facilities" value={`${costs.training.toLocaleString()} €`} className="border-0 pb-0" />
                        </div>

                        <div className="bg-brand-500/5 -mx-10 px-10 py-10 flex flex-col md:flex-row justify-between items-center border-y border-brand-500/10 gap-6">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">Total Delegation Estimate</span>
                                <div className="text-6xl font-black text-[var(--text-primary)] tracking-tighter tabular-nums mt-1 print:text-black">
                                    {costs.total.toLocaleString()} <span className="text-brand-500 text-4xl">€</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </section>

            <section className="pt-8 mb-12">
                <GlassCard className={cn(
                    "p-8 transition-all duration-500 border-l-4 overflow-hidden relative group",
                    agreedToTerms ? "border-emerald-500 bg-emerald-500/5" : "border-amber-500 bg-amber-500/5"
                )}>
                    <div className="grid grid-cols-1 md:grid-cols-[65%_35%] gap-8 items-start relative z-10">
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <h4 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Consent & Validation</h4>
                                <p className="text-[var(--text-secondary)] leading-relaxed text-sm max-w-[500px]">
                                    I certify that this submission represents the final and binding delegation plan
                                    for the European Championship 2026.
                                </p>
                            </div>

                            {!isSubmitted && (
                                <label className="flex items-center gap-3 cursor-pointer w-fit group/check">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-amber-500/30 checked:border-emerald-500 checked:bg-emerald-500 transition-all duration-300"
                                        />
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "font-bold uppercase tracking-widest text-[10px] transition-colors",
                                        agreedToTerms ? "text-emerald-500" : "text-amber-500 group-hover/check:text-amber-400"
                                    )}>
                                        I accept the terms & conditions
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Signed Electronically by</span>
                                <div className="flex items-center gap-3">
                                    <div className="text-xl font-black italic text-brand-500 font-serif print:text-black leading-none">
                                        {isSubmitted ? basics.contactPerson : '---'}
                                    </div>
                                    {isSubmitted && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                                            <CheckCircle2 className="w-2.5 h-2.5" />
                                            Verified
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Validation Timestamp</span>
                                <div className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">
                                    {isSubmitted ? format(new Date(), 'PPP') : 'Awaiting Confirmation'}
                                </div>
                                {isSubmitted && (
                                    <div className="text-[10px] font-black text-[var(--text-muted)] opacity-60">
                                        {format(new Date(), 'p')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </section>
        </div>
    );
}

import { GlassCard } from '../../../components/ui/GlassCard';
import { Select } from '../../../components/ui/Select';
import { useDelegationStore } from '../../../store/delegationStore';
import { User, Users, Mail, Phone, Calendar, Flag, Trophy } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { useRef } from 'react';
import { EVENT_START_DATE, EVENT_END_DATE } from '../../../types/admin';
import { cn } from '../../../lib/utils';

import { IKF_MEMBERS } from '../../../lib/ikfMembers';

export function BasicsStep() {
    const { basics, updateBasics, updateBilling } = useDelegationStore(); // Assuming updateBilling is available or will be exposed
    const arrivalInputRef = useRef<HTMLInputElement>(null);
    const departureInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: string, value: any) => {
        if (field === 'country_code') {
            const member = IKF_MEMBERS[value];
            if (member) {
                // Auto-fill logic
                updateBasics({
                    country_code: value,
                    federation: member.federationName,
                    teamName: member.countryName
                });

                // Auto-fill Billing Company Name (same as Federation)
                // We need to verify if updateBilling is exposed in the store hook
                // If not, we might need to modify the store or dispatch differently
                // For now, assuming updateBilling is available based on BillingStep usage
                // BUT wait, BillingStep explicitly gets it from useDelegationStore.
                // BasicsStep didn't have it destructured, but I added it above.
                if (updateBilling) {
                    updateBilling({
                        companyName: member.federationName
                    });
                }
            } else {
                updateBasics({ [field]: value });
            }
        } else {
            updateBasics({ [field]: value });
        }
    };

    const handleHeadCount = (type: 'players' | 'staff', val: string) => {
        const num = parseInt(val) || 0;
        const newHeadCount = { ...basics.headCount, [type]: num };
        newHeadCount.total = newHeadCount.players + newHeadCount.staff;
        updateBasics({ headCount: newHeadCount });
    };

    const handleDates = (type: 'arrival' | 'departure', val: string) => {
        updateBasics({ dates: { ...basics.dates, [type]: val } });
    };

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        const d = parseISO(dateStr);
        return isValid(d) ? format(d, 'dd/MM/yyyy') : '';
    };

    const isSubmitted = useDelegationStore(state => state.status === 'submitted');

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <fieldset disabled={isSubmitted} className="space-y-6 h-full w-full border-none p-0 m-0">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">Delegation Basics</h2>
                    <p className="text-[var(--text-secondary)]">Please provide the core information about your team.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Team Info */}
                    <GlassCard className="p-6 space-y-6 h-full flex flex-col">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Flag className="w-5 h-5 text-brand-600" />
                            Team Information
                        </h3>

                        <div className="space-y-6 flex-1">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Federation <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={basics.federation}
                                    onChange={(e) => handleChange('federation', e.target.value)}
                                    placeholder="e.g. Czech Handball Federation"
                                    className="w-full p-3 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Country Code <span className="text-rose-500">*</span></label>
                                <Select
                                    value={basics.country_code}
                                    onChange={(val) => handleChange('country_code', val)}
                                    options={Object.values(IKF_MEMBERS).sort((a, b) => a.countryName.localeCompare(b.countryName)).map(member => ({
                                        value: member.code,
                                        label: `${member.code} (${member.countryName})`
                                    }))}
                                    placeholder="Select Code"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Team Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={basics.teamName}
                                    onChange={(e) => handleChange('teamName', e.target.value)}
                                    placeholder="e.g. National Team A"
                                    className="w-full p-3 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Contact Info */}
                    <GlassCard className="p-6 space-y-6 h-full flex flex-col">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-brand-600" />
                            Primary Contact
                        </h3>

                        <div className="space-y-6 flex-1">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Contact Person Name <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        value={basics.contactPerson}
                                        onChange={(e) => handleChange('contactPerson', e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full p-3 pl-10 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">Email <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                                        <input
                                            type="email"
                                            value={basics.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            placeholder="contact@email.com"
                                            className="w-full p-3 pl-10 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">Phone <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                                        <input
                                            type="tel"
                                            value={basics.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            placeholder="+420 123 456 789"
                                            className="w-full p-3 pl-10 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Headcount */}
                <GlassCard className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand-600" />
                            Delegation Size
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] bg-[var(--glass-border)]/30 px-2 py-0.5 rounded">Max 19 Persons</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Players <span className="text-rose-500">*</span></label>
                                <span className="text-[10px] font-bold text-[var(--text-muted)]">Max 14</span>
                            </div>
                            <input
                                type="number"
                                min="1"
                                max="14"
                                value={basics.headCount.players || ''}
                                onChange={(e) => handleHeadCount('players', e.target.value)}
                                className="w-full p-3 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-center font-bold"
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Staff <span className="text-rose-500">*</span></label>
                                <span className="text-[10px] font-bold text-[var(--text-muted)]">Max 5</span>
                            </div>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={basics.headCount.staff || ''}
                                onChange={(e) => handleHeadCount('staff', e.target.value)}
                                className="w-full p-3 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-center font-bold"
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Total Persons</label>
                            <div className={cn(
                                "w-full p-3 border rounded-xl font-bold text-center flex items-center justify-center transition-all",
                                basics.headCount.total >= 19
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                                    : "bg-brand-500/10 border-brand-500/20 text-brand-600"
                            )}>
                                {basics.headCount.total} / 19
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                                <Trophy className="w-4 h-4 text-brand-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-brand-500 tracking-widest leading-none">Accreditation Fee</p>
                                <p className="text-xs font-bold text-[var(--text-muted)] mt-1">65 € / Person</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest leading-none">Subtotal</p>
                            <p className="text-xl font-black text-[var(--text-primary)] mt-1 tabular-nums">
                                {(basics.headCount.total * 65).toLocaleString()} <span className="text-brand-500">€</span>
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Dates */}
                <GlassCard className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-brand-600" />
                        Overall Dates
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">Select authorized arrival and departure dates.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Arrival Date <span className="text-rose-500">*</span></label>
                            <div className="relative cursor-pointer" onClick={() => !isSubmitted && arrivalInputRef.current?.showPicker()}>
                                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                                {/* Formatted Display */}
                                <div className="w-full p-3 pl-10 bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all min-h-[46px] flex items-center">
                                    {basics.dates.arrival ? formatDateDisplay(basics.dates.arrival) : <span className="text-[var(--text-muted)]">dd/mm/yyyy</span>}
                                </div>
                                {/* Hidden Native Input */}
                                {!isSubmitted && (
                                    <input
                                        type="date"
                                        ref={arrivalInputRef}
                                        min={EVENT_START_DATE}
                                        max={EVENT_END_DATE}
                                        value={basics.dates.arrival}
                                        onChange={(e) => handleDates('arrival', e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                )}
                            </div>
                            <p className="text-xs text-[var(--text-muted)]">Authorized range: Oct 14 - Oct 25</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Departure Date <span className="text-rose-500">*</span></label>
                            <div className="relative cursor-pointer" onClick={() => !isSubmitted && departureInputRef.current?.showPicker()}>
                                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                                {/* Formatted Display */}
                                <div className="w-full p-3 pl-10 bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all min-h-[46px] flex items-center">
                                    {basics.dates.departure ? formatDateDisplay(basics.dates.departure) : <span className="text-[var(--text-muted)]">dd/mm/yyyy</span>}
                                </div>
                                {/* Hidden Native Input */}
                                {!isSubmitted && (
                                    <input
                                        type="date"
                                        ref={departureInputRef}
                                        min={EVENT_START_DATE}
                                        max={EVENT_END_DATE}
                                        value={basics.dates.departure}
                                        onChange={(e) => handleDates('departure', e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                )}
                            </div>
                            <p className="text-xs text-[var(--text-muted)]">Authorized range: Oct 14 - Oct 25</p>
                        </div>
                    </div>
                </GlassCard>
            </fieldset>
        </div>
    );
}

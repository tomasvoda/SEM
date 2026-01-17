import { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import {
    User, Mail, Phone, Calendar,
    MapPin, Check,
    ChevronRight, ChevronLeft, Heart,
    Send
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useVolunteerStore, EVENT_DATES } from '../../store/volunteerStore';
import type { AvailabilityStatus } from '../../store/volunteerStore';
import { format, parseISO } from 'date-fns';

type FormStep = 'personal' | 'availability' | 'confirmation';

export function VolunteerRegistrationPage() {
    const { addVolunteer } = useVolunteerStore();
    const [step, setStep] = useState<FormStep>('personal');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        city: '',
        languages: [] as string[],
        preferredLocations: [] as string[],
        availabilityByDay: {} as Record<string, AvailabilityStatus>,
        gdpr: false
    });

    const locations = ['Prague', 'Zlín', 'Brno', 'Otrokovice', 'Prostějov'];

    const toggleLocation = (loc: string) => {
        setFormData(prev => ({
            ...prev,
            preferredLocations: prev.preferredLocations.includes(loc)
                ? prev.preferredLocations.filter(l => l !== loc)
                : [...prev.preferredLocations, loc]
        }));
    };

    const toggleLanguage = (lang: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.includes(lang)
                ? prev.languages.filter(l => l !== lang)
                : [...prev.languages, lang]
        }));
    };

    const setDayAvailability = (date: string, status: AvailabilityStatus) => {
        setFormData(prev => ({
            ...prev,
            availabilityByDay: {
                ...prev.availabilityByDay,
                [date]: status
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addVolunteer({
            ...formData,
            source: 'public'
        });
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]">
                <GlassCard className="max-w-md w-full p-12 text-center space-y-6 border-white/10 shadow-2xl animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                        <Check className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Registration Sent!</h2>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        Thank you for your interest in volunteering for EURO 2026. We've received your application and sent a confirmation email to <span className="text-white font-bold">{formData.email}</span>.
                    </p>
                    <div className="pt-4">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full py-4 bg-brand-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)]">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] mb-4">
                        <Heart className="w-3 h-3" /> Join the team
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Volunteer Registration</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-xl mx-auto">Be part of the European Korfball Championship 2026. Join our team and help us create an unforgettable event.</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
                    <StepIndicator active={step === 'personal'} completed={step !== 'personal'} num={1} />
                    <div className="h-px flex-1 bg-white/10" />
                    <StepIndicator active={step === 'availability'} completed={isSubmitted} num={2} />
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 'personal' && (
                        <GlassCard className="p-8 md:p-12 border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-8">Personal Details</h3>
                                    <InputItem icon={User} label="First Name" type="text" value={formData.firstName} onChange={(v: string) => setFormData(p => ({ ...p, firstName: v }))} required />
                                    <InputItem icon={User} label="Last Name" type="text" value={formData.lastName} onChange={(v: string) => setFormData(p => ({ ...p, lastName: v }))} required />
                                    <InputItem icon={Mail} label="Email Address" type="email" value={formData.email} onChange={(v: string) => setFormData(p => ({ ...p, email: v }))} required />
                                    <InputItem icon={Phone} label="Phone Number" type="tel" value={formData.phone} onChange={(v: string) => setFormData(p => ({ ...p, phone: v }))} required />
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-8">Location & Extras</h3>
                                    <InputItem icon={Calendar} label="Date of Birth" type="date" value={formData.birthDate} onChange={(v: string) => setFormData(p => ({ ...p, birthDate: v }))} required />
                                    <InputItem icon={MapPin} label="Your City" type="text" value={formData.city} onChange={(v: string) => setFormData(p => ({ ...p, city: v }))} required />

                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> Preferred Locations
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {locations.map(loc => (
                                                <button
                                                    key={loc}
                                                    type="button"
                                                    onClick={() => toggleLocation(loc)}
                                                    className={cn(
                                                        "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                        formData.preferredLocations.includes(loc)
                                                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                                                            : "bg-white/5 text-white/40 border border-white/10 hover:border-white/20"
                                                    )}
                                                >
                                                    {loc}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setStep('availability')}
                                    className="flex items-center gap-2 px-8 py-4 bg-brand-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all"
                                >
                                    Availability <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </GlassCard>
                    )}

                    {step === 'availability' && (
                        <GlassCard className="p-8 md:p-12 border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-8">
                                <div className="text-center md:text-left">
                                    <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-2">When are you available?</h3>
                                    <p className="text-xs text-[var(--text-muted)]">Select your availability for each tournament day. This helps us plan shifts.</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {EVENT_DATES.map(date => (
                                        <div key={date} className="space-y-2">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center">{format(parseISO(date), 'EEE, dd.MM')}</p>
                                            <div className="flex flex-col gap-1">
                                                <AvailabilityBtn active={formData.availabilityByDay[date] === 'full'} onClick={() => setDayAvailability(date, 'full')} label="Full" />
                                                <AvailabilityBtn active={formData.availabilityByDay[date] === 'morning'} onClick={() => setDayAvailability(date, 'morning')} label="AM" />
                                                <AvailabilityBtn active={formData.availabilityByDay[date] === 'afternoon'} onClick={() => setDayAvailability(date, 'afternoon')} label="PM" />
                                                <AvailabilityBtn active={!formData.availabilityByDay[date] || formData.availabilityByDay[date] === 'none'} onClick={() => setDayAvailability(date, 'none')} label="None" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-6">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className={cn(
                                            "w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-all",
                                            formData.gdpr ? "bg-brand-500 border-brand-500" : "bg-white/5 border-white/10 group-hover:border-white/20"
                                        )} onClick={() => setFormData(p => ({ ...p, gdpr: !p.gdpr }))}>
                                            {formData.gdpr && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-xs text-[var(--text-muted)] leading-relaxed">
                                            I agree to the <span className="text-white underline">processing of personal data</span> for the purpose of volunteer selection and coordination for EURO 2026.
                                        </span>
                                    </label>

                                    <div className="flex items-center justify-between gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep('personal')}
                                            className="flex items-center gap-2 px-6 py-4 bg-white/5 text-white/60 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!formData.gdpr}
                                            className={cn(
                                                "flex items-center gap-2 px-12 py-4 bg-brand-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 transition-all",
                                                !formData.gdpr ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.05] active:scale-95"
                                            )}
                                        >
                                            Submit Registration <Send className="w-4 h-4 ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    )}
                </form>
            </div>
        </div>
    );
}

function StepIndicator({ active, completed, num }: { active: boolean, completed: boolean, num: number }) {
    return (
        <div className={cn(
            "w-10 h-10 rounded-2xl border flex items-center justify-center transition-all",
            active ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20" :
                completed ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-500" :
                    "bg-white/5 border-white/10 text-white/20"
        )}>
            {completed ? <Check className="w-5 h-5" /> : <span className="text-xs font-black">{num}</span>}
        </div>
    );
}

function InputItem({ icon: Icon, label, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-3 h-3" /> {label}
            </label>
            <input
                {...props}
                onChange={e => props.onChange(e.target.value)}
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-brand-500/50 focus:bg-white/5 transition-all"
            />
        </div>
    );
}

function AvailabilityBtn({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                active
                    ? "bg-brand-500/20 border-brand-500/40 text-brand-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "bg-white/5 border-white/5 text-white/20 hover:border-white/20 hover:text-white/40"
            )}
        >
            {label}
        </button>
    );
}

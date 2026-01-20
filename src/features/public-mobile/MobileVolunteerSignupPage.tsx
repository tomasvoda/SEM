import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    User, Mail, Phone, Calendar,
    MapPin, Check,
    ChevronRight, ChevronLeft, Heart,
    Send, Building, Briefcase
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useVolunteerStore, EVENT_DATES } from '../../store/volunteerStore';
import type { AvailabilityStatus, VolunteerRole } from '../../store/volunteerStore';
import { format, parseISO } from 'date-fns';
import { cs } from 'date-fns/locale';

type FormStep = 'personal' | 'availability';

const ROLES: { value: VolunteerRole; labelKey: string }[] = [
    { value: 'driver', labelKey: 'fields.roles.options.transport' },
    { value: 'results', labelKey: 'fields.roles.options.registration' },
    { value: 'court', labelKey: 'fields.roles.options.venue' },
    { value: 'hospitality', labelKey: 'fields.roles.options.hospitality' },
    { value: 'media', labelKey: 'fields.roles.options.media' },
    { value: 'general', labelKey: 'fields.roles.options.medical' }, // Mapping general to medical/other if needed, or add new key
];

const TOURNAMENT_LOCATIONS = ['Prostějov', 'Otrokovice', 'Zlín'];

export function MobileVolunteerSignupPage() {
    const { t, i18n } = useTranslation('volunteers');
    const navigate = useNavigate();
    const { addVolunteer } = useVolunteerStore();
    const [step, setStep] = useState<FormStep>('personal');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        homeClub: '',
        languages: ['CZ'] as string[],
        preferredRoles: [] as VolunteerRole[],
        preferredLocations: [] as string[],
        availabilityByDay: EVENT_DATES.reduce((acc, date) => {
            acc[date] = 'full';
            return acc;
        }, {} as Record<string, AvailabilityStatus>),
        gdpr: false
    });

    const toggleLocation = (loc: string) => {
        setFormData(prev => ({
            ...prev,
            preferredLocations: prev.preferredLocations.includes(loc)
                ? prev.preferredLocations.filter(l => l !== loc)
                : [...prev.preferredLocations, loc]
        }));
    };

    const toggleRole = (role: VolunteerRole) => {
        setFormData(prev => ({
            ...prev,
            preferredRoles: prev.preferredRoles.includes(role)
                ? prev.preferredRoles.filter(r => r !== role)
                : [...prev.preferredRoles, role]
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addVolunteer({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                birth_date: formData.birthDate,
                home_club: formData.homeClub,
                languages: formData.languages,
                preferred_roles: formData.preferredRoles,
                preferred_locations: formData.preferredLocations,
                availability_by_day: formData.availabilityByDay,
                source: 'public'
            });
            navigate('/mobile/thank-you');
        } catch (error) {
            console.error('Registration failed:', error);
            alert(t('form.error') || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen px-4 py-8 pb-12 text-[var(--text-primary)]">
            {/* Header */}
            <div className="text-center space-y-3 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-black text-brand-400 uppercase tracking-widest">
                    <Heart className="w-3 h-3 animate-pulse" /> {t('subtitle')}
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight">
                    {t('title')}
                </h1>
            </div>

            {/* Benefits / Intro Section */}
            {showInfo && (
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="glass-panel rounded-3xl p-6 border-brand-500/20 bg-brand-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />

                        <h2 className="text-xl font-black uppercase tracking-tight mb-3">
                            {t('intro.title')}
                        </h2>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                            {t('intro.description')}
                        </p>

                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-brand-500 uppercase tracking-widest">
                                {t('benefits.title')}
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {(t('benefits.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-primary)]">
                                        <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                            <Check className="w-3 h-3 text-emerald-400" />
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInfo(false)}
                            className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            {t('intro.continue')}
                        </button>
                    </div>
                </div>
            )}

            {!showInfo && (
                <>
                    {/* Progress */}
                    <div className="flex items-center justify-center gap-4 max-w-[200px] mx-auto mb-10">
                        <StepIndicator active={step === 'personal'} completed={step !== 'personal'} num={1} />
                        <div className="h-px flex-1 bg-white/10" />
                        <StepIndicator active={step === 'availability'} completed={false} num={2} />
                    </div>
                </>
            )}

            {!showInfo && (
                <form onSubmit={handleSubmit}>
                    {step === 'personal' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3 h-3" /> {t('steps.personal')}
                                </h3>
                                <div className="space-y-3">
                                    <InputGroup label={t('fields.firstName.label')} icon={User}>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                                            required
                                            className="form-input"
                                            placeholder={t('fields.firstName.placeholder')}
                                        />
                                    </InputGroup>
                                    <InputGroup label={t('fields.lastName.label')} icon={User}>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                                            required
                                            className="form-input"
                                            placeholder={t('fields.lastName.placeholder')}
                                        />
                                    </InputGroup>
                                    <InputGroup label={t('fields.email.label')} icon={Mail}>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                            required
                                            className="form-input"
                                            placeholder={t('fields.email.placeholder')}
                                        />
                                    </InputGroup>
                                    <InputGroup label={t('fields.phone.label')} icon={Phone}>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                            required
                                            className="form-input"
                                            placeholder={t('fields.phone.placeholder')}
                                        />
                                    </InputGroup>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-widest flex items-center gap-2">
                                    <Building className="w-3 h-3" /> {t('fields.homeClub.label')}
                                </h3>
                                <input
                                    type="text"
                                    value={formData.homeClub}
                                    onChange={e => setFormData(p => ({ ...p, homeClub: e.target.value }))}
                                    required
                                    className="form-input"
                                    placeholder={t('fields.homeClub.placeholder')}
                                />
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> {t('fields.birthDate.label')}
                                </h3>
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={e => setFormData(p => ({ ...p, birthDate: e.target.value }))}
                                    required
                                    className="form-input"
                                />
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-widest flex items-center gap-2">
                                    <Briefcase className="w-3 h-3" /> {t('fields.roles.label')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {ROLES.map(role => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => toggleRole(role.value)}
                                            className={cn(
                                                "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all",
                                                formData.preferredRoles.includes(role.value)
                                                    ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                                                    : "bg-white/5 border-white/10 text-white/40"
                                            )}
                                        >
                                            {t(role.labelKey)}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> {t('fields.locations.label')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {TOURNAMENT_LOCATIONS.map(loc => (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => toggleLocation(loc)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all",
                                                formData.preferredLocations.includes(loc)
                                                    ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                                                    : "bg-white/5 border-white/10 text-white/40"
                                            )}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <button
                                type="button"
                                onClick={() => setStep('availability')}
                                className="w-full flex items-center justify-center gap-3 py-4 bg-brand-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 active:scale-95 transition-all mt-8"
                            >
                                {t('actions.next')} <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {step === 'availability' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <section className="space-y-6">
                                <h3 className="text-[10px] font-black text-brand-400 uppercase tracking-widest text-center">
                                    {t('fields.availability.label')}
                                </h3>
                                <div className="space-y-4">
                                    {EVENT_DATES.map(date => (
                                        <div key={date} className="glass-panel p-4 rounded-2xl space-y-3">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                                    {format(parseISO(date), 'EEEE', {
                                                        locale: i18n.language === 'cs' ? cs : undefined
                                                    })}
                                                </span>
                                                <span className="text-[10px] font-bold text-brand-500 uppercase">
                                                    {format(parseISO(date), 'dd.MM.yyyy')}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <AvailabilityToggle
                                                    active={formData.availabilityByDay[date] === 'full'}
                                                    onClick={() => setDayAvailability(date, 'full')}
                                                    label={t('fields.availability.status.full')}
                                                />
                                                <AvailabilityToggle
                                                    active={formData.availabilityByDay[date] === 'morning'}
                                                    onClick={() => setDayAvailability(date, 'morning')}
                                                    label={t('fields.availability.status.morning')}
                                                />
                                                <AvailabilityToggle
                                                    active={formData.availabilityByDay[date] === 'afternoon'}
                                                    onClick={() => setDayAvailability(date, 'afternoon')}
                                                    label={t('fields.availability.status.afternoon')}
                                                />
                                                <AvailabilityToggle
                                                    active={formData.availabilityByDay[date] === 'none'}
                                                    onClick={() => setDayAvailability(date, 'none')}
                                                    label={t('fields.availability.status.none')}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="pt-4 space-y-6">
                                <label className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl active:bg-white/10 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={formData.gdpr}
                                        onChange={() => setFormData(p => ({ ...p, gdpr: !p.gdpr }))}
                                    />
                                    <div
                                        className={cn(
                                            "w-5 h-5 rounded-lg border flex-shrink-0 flex items-center justify-center transition-all mt-0.5",
                                            formData.gdpr ? "bg-brand-500 border-brand-500" : "bg-white/5 border-white/10"
                                        )}
                                    >
                                        {formData.gdpr && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed uppercase tracking-tight">
                                        {t('fields.gdpr.label')}
                                    </span>
                                </label>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep('personal')}
                                        className="flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 active:bg-white/10 transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!formData.gdpr || isSubmitting}
                                        className={cn(
                                            "flex-1 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3",
                                            formData.gdpr && !isSubmitting ? "bg-brand-500 shadow-brand-500/20" : "bg-white/5 text-white/20"
                                        )}
                                    >
                                        {isSubmitting ? t('actions.submitting') : (
                                            <>
                                                {t('actions.submit')} <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}

function StepIndicator({ active, completed, num }: { active: boolean, completed: boolean, num: number }) {
    return (
        <div className={cn(
            "w-8 h-8 rounded-xl border flex items-center justify-center transition-all",
            active ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20" :
                completed ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-500" :
                    "bg-white/5 border-white/10 text-white/20"
        )}>
            {completed ? <Check className="w-4 h-4" /> : <span className="text-xs font-black">{num}</span>}
        </div>
    );
}

function InputGroup({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2 pl-1">
                <Icon className="w-3 h-3" /> {label}
            </label>
            {children}
        </div>
    );
}

function AvailabilityToggle({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "py-2 rounded-xl border text-[9px] font-black uppercase tracking-tight transition-all",
                active
                    ? "bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20"
                    : "bg-white/5 border-white/10 text-white/40 active:bg-white/10"
            )}
        >
            {label}
        </button>
    );
}

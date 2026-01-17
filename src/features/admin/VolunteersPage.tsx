import { useState, useMemo, useRef, useEffect } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import {
    Search, Filter, User, MapPin,
    Calendar, Pencil, Trash2,
    ChevronDown, Check,
    CheckCircle2, Clock, AlertCircle, XCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useVolunteerStore, EVENT_DATES } from '../../store/volunteerStore';
import type { Volunteer, VolunteerStatus, AvailabilityStatus } from '../../store/volunteerStore';
import { format, parseISO, differenceInYears } from 'date-fns';

export function VolunteersPage() {
    const { volunteers, updateStatus, deleteVolunteer } = useVolunteerStore();
    const [search, setSearch] = useState('');
    const [statusFilters, setStatusFilters] = useState<VolunteerStatus[]>([]);
    const [locationFilters, setLocationFilters] = useState<string[]>([]);
    const [onlyAdults, setOnlyAdults] = useState(false);

    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const locations = useMemo(() =>
        Array.from(new Set(volunteers.flatMap(v => v.preferredLocations))),
        [volunteers]);

    const filteredVolunteers = useMemo(() => {
        return volunteers.filter(v => {
            const fullName = `${v.firstName} ${v.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(search.toLowerCase()) ||
                v.email.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilters.length === 0 || statusFilters.includes(v.registrationStatus);
            const matchesLoc = locationFilters.length === 0 || v.preferredLocations.some(loc => locationFilters.includes(loc));
            const matchesAge = !onlyAdults || differenceInYears(new Date(), parseISO(v.birthDate)) >= 18;

            return matchesSearch && matchesStatus && matchesLoc && matchesAge;
        });
    }, [volunteers, search, statusFilters, locationFilters, onlyAdults]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Volunteers"
                subtitle="Management and registration of event staff"
                breadcrumbs={[
                    { label: 'Event', href: '/admin/dashboard' },
                    { label: 'Volunteers' }
                ]}
            />

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                </div>
                <MultiSelect
                    label="Status"
                    icon={Filter}
                    options={[
                        { label: 'New', value: 'new' },
                        { label: 'Approved', value: 'approved' },
                        { label: 'Rejected', value: 'rejected' },
                        { label: 'Backup', value: 'backup' }
                    ]}
                    selected={statusFilters}
                    onChange={(vals) => setStatusFilters(vals as VolunteerStatus[])}
                />
                <MultiSelect
                    label="Location"
                    icon={MapPin}
                    options={locations.map(l => ({ label: l, value: l }))}
                    selected={locationFilters}
                    onChange={setLocationFilters}
                />
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group" onClick={() => setOnlyAdults(!onlyAdults)}>
                    <div className={cn(
                        "w-4 h-4 rounded border transition-colors flex items-center justify-center",
                        onlyAdults ? "bg-brand-500 border-brand-500" : "border-white/20 group-hover:border-white/40"
                    )}>
                        {onlyAdults && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">18+ Only</span>
                </div>
            </div>

            <GlassCard className="overflow-hidden border-white/10 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Volunteer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Locations</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredVolunteers.map((v) => (
                                <tr key={v.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-black text-[var(--text-primary)] group-hover:text-brand-300 transition-colors">
                                                {v.firstName} {v.lastName}
                                            </span>
                                            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">
                                                {differenceInYears(new Date(), parseISO(v.birthDate))} years old
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-bold text-[var(--text-secondary)]">{v.email}</span>
                                            <span className="text-[9px] text-[var(--text-muted)]">{v.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                                            {v.preferredLocations.map(loc => (
                                                <span key={loc} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-tight text-[var(--text-muted)]">
                                                    {loc}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <VolunteerStatusDropdown
                                            status={v.registrationStatus}
                                            onChange={(status) => updateStatus(v.id, status)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => { setSelectedVolunteer(v); setIsDetailOpen(true); }}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => deleteVolunteer(v.id)}
                                                className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {isDetailOpen && selectedVolunteer && (
                <VolunteerDetailModal
                    volunteer={selectedVolunteer}
                    onClose={() => { setIsDetailOpen(false); setSelectedVolunteer(null); }}
                />
            )}
        </div>
    );
}

function MultiSelect({ label, icon: Icon, options, selected, onChange }: {
    label: string,
    icon: any,
    options: { label: string, value: string }[],
    selected: string[],
    onChange: (vals: string[]) => void
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-xs transition-all",
                    isOpen ? "border-brand-500/50 bg-white/10" : "border-white/10 hover:border-white/20",
                    selected.length > 0 ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                )}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <span className="truncate">
                        {selected.length === 0 ? `All ${label}s` : `${label}: ${selected.length} selected`}
                    </span>
                </div>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 opacity-40", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <GlassCard className="absolute top-full left-0 right-0 mt-2 z-50 p-2 border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => onChange([])}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors",
                                selected.length === 0 ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            All {label}s
                        </button>
                        <div className="h-px bg-white/5 my-1" />
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => toggleOption(opt.value)}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors text-left",
                                    selected.includes(opt.value) ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <span className="truncate mr-2">{opt.label}</span>
                                {selected.includes(opt.value) && <Check className="w-3 h-3 text-brand-500 flex-shrink-0" />}
                            </button>
                        ))}
                    </div>
                </GlassCard>
            )}
        </div>
    );
}

function VolunteerStatusDropdown({ status, onChange }: { status: VolunteerStatus, onChange: (s: VolunteerStatus) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const statuses: { value: VolunteerStatus; label: string; icon: any; color: string }[] = [
        { value: 'new', label: 'New', icon: AlertCircle, color: 'text-blue-400' },
        { value: 'approved', label: 'Approved', icon: CheckCircle2, color: 'text-emerald-400' },
        { value: 'backup', label: 'Backup', icon: Clock, color: 'text-amber-400' },
        { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-400' },
    ];

    const currentStatus = statuses.find(s => s.value === status) || statuses[0];

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap hover:scale-105 active:scale-95",
                    status === 'new' && "text-blue-400 bg-blue-400/10 border-blue-400/20",
                    status === 'approved' && "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
                    status === 'backup' && "text-amber-400 bg-amber-400/10 border-amber-400/20",
                    status === 'rejected' && "text-red-400 bg-red-400/10 border-red-400/20"
                )}
            >
                <currentStatus.icon className="w-2.5 h-2.5" />
                {currentStatus.label}
            </button>

            {isOpen && (
                <GlassCard className="absolute top-full left-0 mt-2 z-50 w-40 p-2 border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex flex-col gap-1">
                        {statuses.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => { onChange(s.value); setIsOpen(false); }}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors",
                                    status === s.value ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <s.icon className={cn("w-3 h-3", s.color)} />
                                    {s.label}
                                </div>
                                {status === s.value && <Check className="w-3 h-3 text-brand-500" />}
                            </button>
                        ))}
                    </div>
                </GlassCard>
            )}
        </div>
    );
}

function VolunteerDetailModal({ volunteer, onClose }: { volunteer: Volunteer, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
            <GlassCard className="w-full max-w-4xl relative z-10 border-white/10 shadow-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                            <User className="w-6 h-6 text-brand-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{volunteer.firstName} {volunteer.lastName}</h3>
                            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Volunteer Profile Detail</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
                        <Check className="w-6 h-6 rotate-45" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-4">Personal Information</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <InfoItem label="Birth Date" value={format(parseISO(volunteer.birthDate), 'dd.MM.yyyy')} sub={`${differenceInYears(new Date(), parseISO(volunteer.birthDate))} years`} />
                                <InfoItem label="City" value={volunteer.city} />
                                <InfoItem label="Email" value={volunteer.email} className="col-span-2" />
                                <InfoItem label="Phone" value={volunteer.phone} />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-4">Preferences</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Preferred Locations</label>
                                    <div className="flex flex-wrap gap-2">
                                        {volunteer.preferredLocations.map(loc => (
                                            <span key={loc} className="px-3 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-[10px] font-bold text-brand-400">
                                                {loc}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-8 pt-8 lg:pt-0">
                        <div>
                            <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-4">Availability Grid</h4>
                            <div className="grid grid-cols-5 gap-2">
                                {EVENT_DATES.map(date => {
                                    const status = volunteer.availabilityByDay[date] || 'none' as AvailabilityStatus;
                                    return (
                                        <div key={date} className="flex flex-col gap-1 items-center">
                                            <span className="text-[8px] font-black text-slate-500 uppercase">{format(parseISO(date), 'dd/MM')}</span>
                                            <div className={cn(
                                                "w-full h-8 rounded-lg border flex flex-col items-center justify-center transition-all",
                                                status === 'full' && "bg-brand-500/20 border-brand-500/40 text-brand-400",
                                                status === 'morning' && "bg-amber-400/20 border-amber-400/40 text-amber-400",
                                                status === 'afternoon' && "bg-blue-400/20 border-blue-400/40 text-blue-400",
                                                status === 'none' && "bg-white/5 border-white/10 text-white/20"
                                            )}>
                                                <span className="text-[8px] font-black uppercase">
                                                    {status === 'none' ? '—' : status.slice(0, 3)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-4">
                            <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Internal Note</h4>
                            <textarea
                                defaultValue={volunteer.internalNote}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-white focus:outline-none focus:border-brand-500/50 min-h-[80px]"
                                placeholder="Add notes..."
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={onClose} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">Close</button>
                                <button className="px-6 py-2 bg-brand-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}

function InfoItem({ label, value, sub, className }: { label: string, value: string, sub?: string, className?: string }) {
    return (
        <div className={cn("space-y-0.5", className)}>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <p className="text-[11px] font-black text-white">{value}</p>
            {sub && <p className="text-[9px] text-[var(--text-muted)]">{sub}</p>}
        </div>
    );
}

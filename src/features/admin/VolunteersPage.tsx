import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import {
    Search, Filter, User, MapPin,
    Pencil, Trash2,
    ChevronDown, Check, Plus,
    CheckCircle2, Clock, AlertCircle, XCircle,
    Briefcase, Building
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useVolunteerStore, EVENT_DATES } from '../../store/volunteerStore';
import type { Volunteer, VolunteerStatus, VolunteerInternal, VolunteerRole, AvailabilityStatus } from '../../store/volunteerStore';
import { format, parseISO, differenceInYears } from 'date-fns';

const ROLES: { value: VolunteerRole; label: string }[] = [
    { value: 'driver', label: 'Driver' },
    { value: 'results', label: 'Results' },
    { value: 'court', label: 'Court' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'media', label: 'Media' },
    { value: 'general', label: 'General' },
];

const TOURNAMENT_LOCATIONS = ['Prostějov', 'Otrokovice', 'Zlín'];

export function VolunteersPage() {
    const { volunteers, fetchVolunteers, addVolunteer, updateVolunteer, updateStatus, deleteVolunteer } = useVolunteerStore();

    useEffect(() => {
        fetchVolunteers();
    }, [fetchVolunteers]);
    const [search, setSearch] = useState('');
    const [statusFilters, setStatusFilters] = useState<VolunteerStatus[]>([]);
    const [locationFilters, setLocationFilters] = useState<string[]>([]);
    const [roleFilters, setRoleFilters] = useState<VolunteerRole[]>([]);
    const [onlyAdults, setOnlyAdults] = useState(false);

    const [modalVolunteer, setModalVolunteer] = useState<Volunteer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('view');

    const filteredVolunteers = useMemo(() => {
        return volunteers.filter(v => {
            const fullName = `${v.firstName} ${v.lastName}`.toLowerCase();
            const club = (v.homeClub || '').toLowerCase();
            const matchesSearch = fullName.includes(search.toLowerCase()) ||
                v.email.toLowerCase().includes(search.toLowerCase()) ||
                club.includes(search.toLowerCase());

            const matchesStatus = statusFilters.length === 0 || statusFilters.includes(v.registrationStatus);
            const matchesLoc = locationFilters.length === 0 || (v.preferredLocations || []).some(loc => locationFilters.includes(loc));
            const matchesRole = roleFilters.length === 0 || (v.preferredRoles || []).some(role => roleFilters.includes(role));
            const matchesAge = !onlyAdults || differenceInYears(new Date(), parseISO(v.birthDate)) >= 18;

            return matchesSearch && matchesStatus && matchesLoc && matchesAge && matchesRole;
        });
    }, [volunteers, search, statusFilters, locationFilters, roleFilters, onlyAdults]);

    const handleAdd = () => {
        setModalVolunteer(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleEdit = (v: Volunteer) => {
        setModalVolunteer(v);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleView = (v: Volunteer) => {
        setModalVolunteer(v);
        setModalMode('view');
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Volunteers"
                subtitle="Management and registration of event staff"
                breadcrumbs={[
                    { label: 'Event', href: '/admin/dashboard' },
                    { label: 'Volunteers' }
                ]}
                actions={
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Volunteer
                    </button>
                }
            />

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search by name, email or club..."
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
                    options={TOURNAMENT_LOCATIONS.map(l => ({ label: l, value: l }))}
                    selected={locationFilters}
                    onChange={setLocationFilters}
                />
                <MultiSelect
                    label="Role"
                    icon={Briefcase}
                    options={ROLES}
                    selected={roleFilters}
                    onChange={(vals) => setRoleFilters(vals as VolunteerRole[])}
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
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Home Club</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Roles & Loc</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredVolunteers.map((v) => (
                                <tr key={v.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span
                                                className="text-xs font-black text-[var(--text-primary)] group-hover:text-brand-300 transition-colors cursor-pointer"
                                                onClick={() => handleView(v)}
                                            >
                                                {v.firstName} {v.lastName}
                                            </span>
                                            <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">
                                                {v.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Building className="w-3 h-3 text-[var(--text-muted)]" />
                                            <span className="text-[10px] font-bold text-[var(--text-secondary)]">{v.homeClub || '—'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex flex-wrap gap-1">
                                                {(v.preferredRoles || []).map(role => (
                                                    <span key={role} className="px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-[8px] font-black uppercase tracking-tight text-brand-400">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {(v.preferredLocations || []).map(loc => (
                                                    <span key={loc} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-tight text-[var(--text-muted)]">
                                                        {loc}
                                                    </span>
                                                ))}
                                            </div>
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
                                                onClick={() => handleEdit(v)}
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

            {isModalOpen && (
                <VolunteerModal
                    volunteer={modalVolunteer}
                    mode={modalMode}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(data) => {
                        if (modalMode === 'add') {
                            addVolunteer(data as any);
                        } else if (modalVolunteer) {
                            updateVolunteer(modalVolunteer.id, data);
                        }
                        setIsModalOpen(false);
                    }}
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
    const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});

    useEffect(() => {
        const updatePosition = () => {
            if (isOpen && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const dropdownHeight = 200; // Expected max height
                const spaceBelow = window.innerHeight - rect.bottom;
                const openUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

                setDropdownStyles({
                    position: 'fixed',
                    top: openUp ? 'auto' : `${rect.bottom + 8}px`,
                    bottom: openUp ? `${window.innerHeight - rect.top + 8}px` : 'auto',
                    left: `${rect.left}px`,
                    width: '160px',
                    zIndex: 9999,
                });
            }
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            // Check if click is inside basic container or inside the portal content
            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                !target.closest('.status-dropdown-portal')
            ) {
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

            {isOpen && createPortal(
                <div style={dropdownStyles} className="status-dropdown-portal">
                    <GlassCard className="w-40 p-2 border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
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
                </div>,
                document.body
            )}
        </div>
    );
}

function VolunteerModal({ volunteer, mode, onClose, onSave }: {
    volunteer: Volunteer | null,
    mode: 'add' | 'edit' | 'view',
    onClose: () => void,
    onSave: (data: Partial<Volunteer>) => void
}) {
    const isViewOnly = mode === 'view';
    const [formData, setFormData] = useState<Partial<VolunteerInternal>>(volunteer || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        homeClub: '',
        languages: ['CZ'],
        preferredRoles: [],
        preferredLocations: [],
        availabilityByDay: {},
        source: 'internal'
    });



    const toggleAvailability = (date: string, status: AvailabilityStatus) => {
        if (isViewOnly) return;
        setFormData({
            ...formData,
            availabilityByDay: {
                ...(formData.availabilityByDay || {}),
                [date]: status
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
            <GlassCard className="w-full max-w-5xl relative z-10 border-white/10 shadow-2xl p-8 max-h-full overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                            {mode === 'add' ? <Plus className="w-6 h-6 text-brand-500" /> : <User className="w-6 h-6 text-brand-500" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                {mode === 'add' ? 'Add New Volunteer' : `${formData.firstName} ${formData.lastName}`}
                            </h3>
                            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">
                                {mode === 'add' ? 'Internal Registration' : mode === 'edit' ? 'Edit Volunteer Profile' : 'Volunteer Details'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Basic Info & Preferences */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">General Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <FormItem label="First Name">
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        disabled={isViewOnly}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50"
                                    />
                                </FormItem>
                                <FormItem label="Last Name">
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        disabled={isViewOnly}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50"
                                    />
                                </FormItem>
                                <FormItem label="Email" className="col-span-2">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled={isViewOnly}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50"
                                    />
                                </FormItem>
                                <FormItem label="Phone">
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        disabled={isViewOnly}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50"
                                    />
                                </FormItem>
                                <FormItem label="Birth Date">
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        disabled={isViewOnly}
                                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50"
                                    />
                                </FormItem>
                                <FormItem label="Home Club" className="col-span-2">
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            value={formData.homeClub}
                                            disabled={isViewOnly}
                                            placeholder="e.g. Korfbal Club Brno"
                                            onChange={e => setFormData({ ...formData, homeClub: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50"
                                        />
                                    </div>
                                </FormItem>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Roles & Locations</h4>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Preferred Roles</label>
                                <div className="flex flex-wrap gap-2">
                                    {ROLES.map(role => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => {
                                                const preferredRoles = formData.preferredRoles || [];
                                                setFormData(prev => ({
                                                    ...prev,
                                                    preferredRoles: preferredRoles.includes(role.value)
                                                        ? preferredRoles.filter((r: VolunteerRole) => r !== role.value)
                                                        : [...preferredRoles, role.value]
                                                }));
                                            }}
                                            disabled={isViewOnly}
                                            className={cn(
                                                "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                (formData.preferredRoles || []).includes(role.value)
                                                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                                                    : "bg-white/5 text-white/40 border border-white/10 hover:border-white/20"
                                            )}
                                        >
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tournament Locations</label>
                                <div className="flex flex-wrap gap-2">
                                    {TOURNAMENT_LOCATIONS.map((loc: string) => (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => {
                                                const preferredLocations = formData.preferredLocations || [];
                                                setFormData(prev => ({
                                                    ...prev,
                                                    preferredLocations: preferredLocations.includes(loc)
                                                        ? preferredLocations.filter((l: string) => l !== loc)
                                                        : [...preferredLocations, loc]
                                                }));
                                            }}
                                            disabled={isViewOnly}
                                            className={cn(
                                                "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                (formData.preferredLocations || []).includes(loc)
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

                    {/* Right: Availability & Notes */}
                    <div className="space-y-8 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-12 pt-8 lg:pt-0">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Availability Grid</h4>
                            <div className="grid grid-cols-5 gap-2">
                                {EVENT_DATES.map(date => {
                                    const status = formData.availabilityByDay?.[date] || 'none';
                                    return (
                                        <div key={date} className="space-y-1.5">
                                            <p className="text-[8px] font-black text-slate-500 uppercase text-center">{format(parseISO(date), 'dd/MM')}</p>
                                            <button
                                                onClick={() => {
                                                    const cycle: AvailabilityStatus[] = ['none', 'full', 'morning', 'afternoon'];
                                                    const next = cycle[(cycle.indexOf(status) + 1) % cycle.length];
                                                    toggleAvailability(date, next);
                                                }}
                                                disabled={isViewOnly}
                                                className={cn(
                                                    "w-full h-10 rounded-lg border flex flex-col items-center justify-center transition-all",
                                                    status === 'full' && "bg-brand-500/20 border-brand-500/40 text-brand-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
                                                    status === 'morning' && "bg-amber-400/20 border-amber-400/40 text-amber-400",
                                                    status === 'afternoon' && "bg-blue-400/20 border-blue-400/40 text-blue-400",
                                                    status === 'none' && "bg-white/5 border-white/10 text-white/20"
                                                )}
                                            >
                                                <span className="text-[8px] font-black uppercase">
                                                    {status === 'none' ? '—' : status.slice(0, 3)}
                                                </span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                                <AvailabilityLegend color="bg-brand-500" label="Full" />
                                <AvailabilityLegend color="bg-amber-400" label="AM" />
                                <AvailabilityLegend color="bg-blue-400" label="PM" />
                                <AvailabilityLegend color="bg-white/10" label="None" />
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">Internal Administration</h4>
                            <FormItem label="Internal Note">
                                <textarea
                                    value={formData.internalNote}
                                    disabled={isViewOnly}
                                    onChange={e => setFormData({ ...formData, internalNote: e.target.value })}
                                    placeholder="Organizational notes, past experience, specific requirements..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50 min-h-[120px]"
                                />
                            </FormItem>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                            >
                                {isViewOnly ? 'Close' : 'Cancel'}
                            </button>
                            {!isViewOnly && (
                                <button
                                    onClick={() => {
                                        const { firstName, lastName, birthDate, homeClub, preferredRoles, preferredLocations, availabilityByDay, internalNote, ...rest } = formData;
                                        onSave({
                                            ...rest,
                                            first_name: firstName,
                                            last_name: lastName,
                                            birth_date: birthDate,
                                            home_club: homeClub,
                                            preferred_roles: preferredRoles,
                                            preferred_locations: preferredLocations,
                                            availability_by_day: availabilityByDay,
                                            internal_note: internalNote
                                        } as any);
                                    }}
                                    className="px-10 py-3 bg-brand-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}

function FormItem({ label, children, className }: { label: string, children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
            {children}
        </div>
    );
}

function AvailabilityLegend({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", color)} />
            <span className="text-[8px] font-black text-slate-500 uppercase whitespace-nowrap">{label}</span>
        </div>
    );
}

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminStore } from '../../../store/adminStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { ArrowLeft, Calendar, Edit2, Save, X, Plane, Bus, Car, Utensils, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Delegation } from '../../../types/admin';

export function DelegationDetail() {
    const { id } = useParams<{ id: string }>();
    const { delegations, updateDelegation } = useAdminStore();
    const delegation = delegations.find(d => d.id === id);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Delegation>>({});
    const [isSaving, setIsSaving] = useState(false);

    if (!delegation) {
        return <div className="p-8 text-center text-red-500">Delegation not found</div>;
    }

    const startEditing = () => {
        setFormData({
            team_name: delegation.team_name,
            country_code: delegation.country_code,
            federation: delegation.federation,
            required_persons: delegation.required_persons,
            required_singles: delegation.required_singles,
            required_doubles: delegation.required_doubles,
            arrival_date: delegation.arrival_date,
            departure_date: delegation.departure_date,
            contact_name: delegation.contact_name,
            contact_email: delegation.contact_email,
            contact_phone: delegation.contact_phone,
            status: delegation.status
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({});
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (id) {
                await updateDelegation(id, formData);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field: keyof Delegation, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Parse Logistics
    const req = delegation.accommodation_request || {};
    const transport = req.transport || {};
    const meals = req.meals || {};

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link to="/admin/delegations" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Delegations</span>
                </Link>

                <div className="flex justify-between items-end">
                    <div className="text-left">
                        <div className="flex items-center gap-3 mb-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.team_name}
                                    onChange={(e) => handleChange('team_name', e.target.value)}
                                    className="text-3xl font-black bg-transparent border-b border-brand-500/50 outline-none w-full max-w-md"
                                />
                            ) : (
                                <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">{delegation.team_name}</h1>
                            )}
                            <span className="px-2 py-0.5 rounded bg-[var(--glass-border)] text-xs font-bold text-[var(--text-muted)]">{delegation.country_code}</span>
                        </div>
                        <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">Delegation Details & Logistics</p>
                    </div>
                    <div>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 rounded-lg bg-[var(--glass-surface)] border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-lg bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:bg-brand-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
                                >
                                    <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={startEditing}
                                className="px-4 py-2 rounded-lg bg-[var(--glass-surface)] border border-[var(--glass-border)] text-[var(--text-primary)] hover:border-brand-500/50 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" /> Edit Details
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Basic Info & Requirements */}
                <div className="space-y-6">
                    <GlassCard className="p-8 space-y-6">
                        <h3 className="text-sm font-black text-brand-500 uppercase tracking-widest border-b border-[var(--glass-border)] pb-2 flex justify-between items-center">
                            Information
                            {isEditing && (
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    className="text-xs bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="submitted">Submitted</option>
                                </select>
                            )}
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Federation */}
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Federation</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.federation}
                                        onChange={(e) => handleChange('federation', e.target.value)}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                    />
                                ) : (
                                    <p className="font-medium text-[var(--text-primary)]">{delegation.federation}</p>
                                )}
                            </div>

                            {/* Persons */}
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Total Persons</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.required_persons}
                                        onChange={(e) => handleChange('required_persons', parseInt(e.target.value) || 0)}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                    />
                                ) : (
                                    <p className="font-medium text-[var(--text-primary)]">{delegation.required_persons}</p>
                                )}
                            </div>

                            {/* Country Code */}
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Country Code</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.country_code}
                                        onChange={(e) => handleChange('country_code', e.target.value)}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                    />
                                ) : (
                                    <p className="font-medium text-[var(--text-primary)]">{delegation.country_code}</p>
                                )}
                            </div>
                        </div>

                        {/* Room Breakdown */}
                        <div className="p-4 bg-[var(--app-bg)]/30 rounded-xl border border-[var(--glass-border)] space-y-4">
                            <h4 className="text-xs font-bold text-[var(--text-primary)]">Room Requirements</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Singles</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={formData.required_singles}
                                            onChange={(e) => handleChange('required_singles', parseInt(e.target.value) || 0)}
                                            className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                        />
                                    ) : (
                                        <p className="font-medium text-[var(--text-primary)]">{delegation.required_singles}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Doubles</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={formData.required_doubles}
                                            onChange={(e) => handleChange('required_doubles', parseInt(e.target.value) || 0)}
                                            className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                        />
                                    ) : (
                                        <p className="font-medium text-[var(--text-primary)]">{delegation.required_doubles}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8 space-y-6">
                        <h3 className="text-sm font-black text-brand-500 uppercase tracking-widest border-b border-[var(--glass-border)] pb-2">Schedule & Contact</h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Arrival</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={formData.arrival_date}
                                        onChange={(e) => handleChange('arrival_date', e.target.value)}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                    />
                                ) : (
                                    <p className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                                        {format(parseISO(delegation.arrival_date), 'dd MMM yyyy')}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Departure</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={formData.departure_date}
                                        onChange={(e) => handleChange('departure_date', e.target.value)}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                    />
                                ) : (
                                    <p className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                                        {format(parseISO(delegation.departure_date), 'dd MMM yyyy')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[var(--glass-border)]/50 space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Contact Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.contact_name}
                                        onChange={(e) => handleChange('contact_name', e.target.value)}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                    />
                                ) : (
                                    <p className="font-medium text-[var(--text-primary)]">{delegation.contact_name}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={formData.contact_email}
                                            onChange={(e) => handleChange('contact_email', e.target.value)}
                                            className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                        />
                                    ) : (
                                        <p className="font-medium text-[var(--text-primary)] truncate" title={delegation.contact_email}>{delegation.contact_email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 block">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={formData.contact_phone}
                                            onChange={(e) => handleChange('contact_phone', e.target.value)}
                                            className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded px-2 py-1 text-sm font-bold"
                                        />
                                    ) : (
                                        <p className="font-medium text-[var(--text-primary)]">{delegation.contact_phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* 2. Logistics Review (Read-Only) */}
                <div className="space-y-6">
                    {/* Transport */}
                    <GlassCard className="p-8 space-y-6">
                        <h3 className="text-sm font-black text-brand-500 uppercase tracking-widest border-b border-[var(--glass-border)] pb-2">Transport Request</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Arrival */}
                            <div className="p-4 rounded-xl bg-[var(--app-bg)]/30 border border-[var(--glass-border)]">
                                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Arrival</div>
                                <div className="flex items-center gap-3 mb-2">
                                    {transport.arrival?.type === 'plane' && <Plane className="w-5 h-5 text-brand-500" />}
                                    {transport.arrival?.type === 'bus' && <Bus className="w-5 h-5 text-brand-500" />}
                                    {transport.arrival?.type === 'car' && <Car className="w-5 h-5 text-brand-500" />}
                                    <span className="font-bold text-[var(--text-primary)] capitalize">{transport.arrival?.type || 'Not specified'}</span>
                                </div>
                                {transport.arrival?.type === 'plane' && (
                                    <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                                        <div className="flex justify-between">
                                            <span>Flight:</span>
                                            <span className="font-bold text-[var(--text-primary)]">{transport.arrival.flightNumber || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Airport:</span>
                                            <span className="font-bold text-[var(--text-primary)]">{transport.arrival.location || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--glass-border)]">
                                            <span>Transfer:</span>
                                            {transport.arrival.airportTransfer ? (
                                                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold uppercase">Requested ({transport.arrival.persons}p)</span>
                                            ) : (
                                                <span className="text-[var(--text-muted)]">No</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Departure */}
                            <div className="p-4 rounded-xl bg-[var(--app-bg)]/30 border border-[var(--glass-border)]">
                                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Departure</div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-bold text-[var(--text-primary)] capitalize">{transport.departure?.type || 'Same as arrival'}</span>
                                </div>
                                {transport.departure?.type === 'plane' && (
                                    <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                                        <div className="flex justify-between">
                                            <span>Flight:</span>
                                            <span className="font-bold text-[var(--text-primary)]">{transport.departure.flightNumber || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--glass-border)]">
                                            <span>Transfer:</span>
                                            {transport.departure.airportTransfer ? (
                                                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-bold uppercase">Requested ({transport.departure.persons}p)</span>
                                            ) : (
                                                <span className="text-[var(--text-muted)]">No</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </GlassCard>

                    {/* Meals */}
                    <GlassCard className="p-8 space-y-6">
                        <h3 className="text-sm font-black text-brand-500 uppercase tracking-widest border-b border-[var(--glass-border)] pb-2">Catering</h3>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
                            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600">
                                <Utensils className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-brand-500/70">Selected Plan</div>
                                <div className="font-bold text-[var(--text-primary)]">
                                    {meals.addons?.hotLunch ? 'Hot Lunch Service' : (meals.addons?.lunchPackage ? 'Lunch Packages' : 'Standard Half Board')}
                                </div>
                            </div>
                            <Check className="w-5 h-5 text-emerald-500 ml-auto" />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-3 rounded-lg bg-[var(--app-bg)]/30 border border-[var(--glass-border)] text-center">
                                <div className="text-xl font-black text-[var(--text-primary)]">{meals.dietary?.vegetarian || 0}</div>
                                <div className="text-[9px] font-bold uppercase text-[var(--text-muted)]">Vegetarian</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--app-bg)]/30 border border-[var(--glass-border)] text-center">
                                <div className="text-xl font-black text-[var(--text-primary)]">{meals.dietary?.vegan || 0}</div>
                                <div className="text-[9px] font-bold uppercase text-[var(--text-muted)]">Vegan</div>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--app-bg)]/30 border border-[var(--glass-border)] text-center">
                                <div className="text-xl font-black text-[var(--text-primary)]">{meals.dietary?.glutenFree || 0}</div>
                                <div className="text-[9px] font-bold uppercase text-[var(--text-muted)]">Gluten Free</div>
                            </div>
                        </div>

                        {meals.dietary?.other && (
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                                <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Other Requirements</div>
                                <p className="text-sm text-[var(--text-primary)] italic">"{meals.dietary.other}"</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

import { useState, type ChangeEvent } from 'react';
import {
    Mail, Edit2, Save, X, Plane, CreditCard, Hotel
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { GlassCard } from '../../../components/ui/GlassCard';
import { getFlagUrl } from '../../../lib/countryUtils';

export interface DelegationDetailProps {
    initialData: {
        countryName: string;
        countryCode: string;
        federation: string;
        contactPerson: string;
        contactEmail: string;
        contactPhone: string;
        arrivalDate: string;
        departureDate: string;
        persons: number;
        singles: number;
        doubles: number;
        catering: string;
        billingName: string;
        billingAddress: string;
        status: 'draft' | 'submitted' | 'approved';
    };
    onSave?: (data: any) => void;
}

export function DelegationDetailCard({ initialData, onSave }: DelegationDetailProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave?.(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
    };

    const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500 border border-brand-500/20">
                <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">{title}</h3>
        </div>
    );

    const LabelledInput = ({ label, name, type = "text", value }: { label: string; name: string; type?: string; value: string | number }) => (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest opacity-60 ml-1">{label}</label>
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
            ) : (
                <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-transparent text-sm font-bold text-[var(--text-primary)] overflow-hidden text-ellipsis whitespace-nowrap">
                    {value || 'Not set'}
                </div>
            )}
        </div>
    );

    return (
        <GlassCard className="max-w-5xl mx-auto border-[var(--glass-border)] shadow-2xl relative">
            {/* Header Panel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-[var(--glass-border)] pb-8 overflow-hidden">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-12 rounded-xl border border-white/10 overflow-hidden shadow-xl bg-white/5 shrink-0">
                        <img
                            src={getFlagUrl(formData.countryCode)}
                            alt={formData.countryName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight truncate">
                                {formData.countryName}
                            </h1>
                            <span className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-xs font-black tracking-[0.2em] uppercase border border-brand-500/20">
                                {formData.countryCode}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-brand-500/80 uppercase tracking-widest mt-1 opacity-70">
                            {formData.federation}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-500/20"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Details
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--glass-surface)] hover:bg-[var(--glass-border)] text-[var(--text-primary)] rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-[var(--glass-border)]"
                            >
                                <X className="w-4 h-4" /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {/* Contact info */}
                <section>
                    <SectionHeader icon={Mail} title="Contact Information" />
                    <div className="grid grid-cols-1 gap-6">
                        <LabelledInput label="Contact Person" name="contactPerson" value={formData.contactPerson} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <LabelledInput label="Email Address" name="contactEmail" type="email" value={formData.contactEmail} />
                            <LabelledInput label="Phone Number" name="contactPhone" type="tel" value={formData.contactPhone} />
                        </div>
                    </div>
                </section>

                {/* Accommodation */}
                <section>
                    <SectionHeader icon={Hotel} title="Delegation Size & Rooms" />
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <LabelledInput label="Total Persons" name="persons" type="number" value={formData.persons} />
                            <LabelledInput label="Singles" name="singles" type="number" value={formData.singles} />
                            <LabelledInput label="Doubles" name="doubles" type="number" value={formData.doubles} />
                        </div>
                        {isEditing ? (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest opacity-60 ml-1">Catering Plan</label>
                                <select
                                    name="catering"
                                    value={formData.catering}
                                    onChange={handleInputChange}
                                    className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none"
                                >
                                    <option value="half_board">Half Board</option>
                                    <option value="full_board">Full Board</option>
                                </select>
                            </div>
                        ) : (
                            <LabelledInput label="Catering Plan" name="catering" value={formData.catering} />
                        )}
                    </div>
                </section>

                {/* Logistics */}
                <section>
                    <SectionHeader icon={Plane} title="Travel Logistics" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <LabelledInput label="Arrival Date" name="arrivalDate" type="date" value={formData.arrivalDate} />
                        <LabelledInput label="Departure Date" name="departureDate" type="date" value={formData.departureDate} />
                    </div>
                </section>

                {/* Billing */}
                <section>
                    <SectionHeader icon={CreditCard} title="Billing Information" />
                    <div className="grid grid-cols-1 gap-6">
                        <LabelledInput label="Company Name" name="billingName" value={formData.billingName} />
                        <LabelledInput label="Address" name="billingAddress" value={formData.billingAddress} />
                    </div>
                </section>
            </div>

            {/* Footer Status */}
            <div className="mt-16 pt-8 border-t border-[var(--glass-border)] flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Current Status</p>
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-2",
                        formData.status === 'draft' && 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                        formData.status === 'submitted' && 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                        formData.status === 'approved' && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", {
                            'bg-amber-500': formData.status === 'draft',
                            'bg-blue-500': formData.status === 'submitted',
                            'bg-emerald-500': formData.status === 'approved'
                        })} />
                        {formData.status}
                    </div>
                </div>

                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </GlassCard>
    );
}

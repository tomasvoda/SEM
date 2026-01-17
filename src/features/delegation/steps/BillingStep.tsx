import { GlassCard } from '../../../components/ui/GlassCard';
import { useDelegationStore } from '../../../store/delegationStore';
import { Building2, MapPin, Mail, Globe, FileText } from 'lucide-react';

export function BillingStep() {
    const { billing, updateBilling, status, basics } = useDelegationStore();
    const isSubmitted = status === 'submitted';

    // Ensure billing country is synced with basics
    if (basics.country_code && billing.country !== basics.country_code) {
        updateBilling({ country: basics.country_code });
    }

    const handleChange = (field: string, value: string) => {
        updateBilling({ [field]: value });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <fieldset disabled={isSubmitted} className="space-y-6 border-none p-0 m-0">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Billing Details</h2>
                    <p className="text-[var(--text-secondary)]">Please provide invoice details for your organization. This will be used for the final invoice.</p>
                </div>

                <GlassCard className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-brand-600" />
                        Legal Entity
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Organization / Company Name *</label>
                            <input
                                type="text"
                                value={billing.companyName}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                placeholder="Official Legal Name"
                                className="w-full p-3 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">VAT Number (Optional)</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        value={billing.vatNumber || ''}
                                        onChange={(e) => handleChange('vatNumber', e.target.value)}
                                        placeholder="e.g. CZ12345678"
                                        className="w-full p-3 pl-10 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Billing Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                                    <input
                                        type="email"
                                        value={billing.billingEmail}
                                        onChange={(e) => handleChange('billingEmail', e.target.value)}
                                        placeholder="invoice@example.com"
                                        className="w-full p-3 pl-10 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-brand-600" />
                        Billing Address
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Street Address *</label>
                            <input
                                type="text"
                                value={billing.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                placeholder="Street and Number"
                                className="w-full p-3 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">City *</label>
                                <input
                                    type="text"
                                    value={billing.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    className="w-full p-3 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Postal Code *</label>
                                <input
                                    type="text"
                                    value={billing.postalCode}
                                    onChange={(e) => handleChange('postalCode', e.target.value)}
                                    className="w-full p-3 h-[46px] bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Country *</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3.5 w-5 h-5 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        value={billing.country}
                                        readOnly
                                        className="w-full p-3 pl-10 h-[46px] bg-brand-500/5 border border-brand-500/20 rounded-xl outline-none font-bold text-brand-600 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[9px] font-black uppercase text-brand-500/50">Synced with Team Country</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </fieldset>
        </div>
    );
}

import { Plus, Search, FileText, Calendar, Building2, ChevronRight } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAdminStore } from '../../store/adminStore';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { format, parseISO } from 'date-fns';

export function OffersList() {
    const { offers, hotels } = useAdminStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOffers = offers.filter(o => {
        const hotel = hotels.find(h => h.id === o.hotel_id);
        return o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotel?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case 'rejected': return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Hotel Offers</h1>
                    <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">Admin / Offer Management</p>
                </div>
                {/* Create new offer is usually done from Hotel Detail in this flow */}
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-[var(--glass-border)] bg-[var(--glass-surface)]/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search offers or hotels..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-lg outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--glass-surface)]/30">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Offer Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Hotel</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Period</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--glass-border)]">
                            {filteredOffers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)] italic">
                                        No offers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOffers.map((offer) => {
                                    const hotel = hotels.find(h => h.id === offer.hotel_id);
                                    return (
                                        <tr key={offer.id} className="hover:bg-brand-500/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[var(--text-primary)]">{offer.name}</p>
                                                        <p className="text-[10px] font-black uppercase text-brand-500/60 mt-0.5">{offer.nights} nights</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
                                                    <span className="text-sm font-medium text-[var(--text-secondary)]">{hotel?.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-primary)]">
                                                    <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                                    {format(parseISO(offer.date_from), 'dd.MM.')} – {format(parseISO(offer.date_to), 'dd.MM.yyyy')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={cn(
                                                    "w-fit px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border",
                                                    getStatusStyles(offer.status)
                                                )}>
                                                    {offer.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/admin/hotel-offers/${offer.id}`}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500/5 text-brand-500 hover:bg-brand-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all"
                                                >
                                                    Detail
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}

import { useParams, Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
    Building2, Mail, Phone, MapPin, ChevronLeft,
    Plus, FileText, Calendar, Edit2, Trash2, Eye
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { OfferFormModal } from './components/OfferFormModal';
import { Breadcrumbs } from './components/Breadcrumbs';
import { HotelOccupancyMatrix } from './components/HotelOccupancyMatrix';
import type { HotelOffer } from '../../types/admin';

export function HotelDetail() {
    const { id } = useParams();
    const { hotels, offers, deleteOffer, offerRooms } = useAdminStore();
    const [activeTab, setActiveTab] = useState<'info' | 'offers' | 'occupancy'>('info');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<HotelOffer | undefined>(undefined);

    const hotel = hotels.find(h => h.id === id);
    const hotelOffers = offers.filter(o => o.hotel_id === id);

    if (!hotel) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Hotel not found</h2>
                <Link to="/admin/hotels" className="text-brand-500 hover:underline mt-4 inline-block">Back to hotels</Link>
            </div>
        );
    }

    const handleAddOffer = () => {
        setEditingOffer(undefined);
        setIsModalOpen(true);
    };

    const handleEditOffer = (offer: HotelOffer) => {
        setEditingOffer(offer);
        setIsModalOpen(true);
    };

    const handleDeleteOffer = (offerId: string) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            const success = deleteOffer(offerId);
            if (!success) {
                alert('Cannot delete a confirmed offer.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Breadcrumbs
                    items={[
                        { label: 'Hotels', path: '/admin/hotels' },
                        { label: hotel.name }
                    ]}
                />

                <div className="flex items-center gap-4 text-left">
                    <Link
                        to="/admin/hotels"
                        className="p-2 rounded-xl bg-[var(--glass-surface)]/50 border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-brand-500 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">{hotel.name}</h1>
                        <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">Admin / Hotel Detail</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 p-1 bg-[var(--glass-surface)]/50 border border-[var(--glass-border)] rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('info')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        activeTab === 'info'
                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                >
                    Basic Information
                </button>
                <button
                    onClick={() => setActiveTab('offers')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        activeTab === 'offers'
                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                >
                    Offers ({hotelOffers.length})
                </button>
                <button
                    onClick={() => setActiveTab('occupancy')}
                    className={cn(
                        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                        activeTab === 'occupancy'
                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                >
                    Occupancy
                </button>
            </div>

            {activeTab === 'info' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <GlassCard className="p-8 space-y-8">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-500 mb-6">Contact Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-muted)]">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Address</p>
                                        <p className="font-bold text-[var(--text-primary)]">{hotel.address}, {hotel.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-muted)]">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Email</p>
                                        <p className="font-bold text-[var(--text-primary)]">{hotel.contact_email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)] flex items-center justify-center text-[var(--text-muted)]">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Phone</p>
                                        <p className="font-bold text-[var(--text-primary)]">{hotel.contact_phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-500 mb-6">System Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)] text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Status</p>
                                    <div className={cn(
                                        "w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
                                        hotel.active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                                    )}>
                                        {hotel.active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--app-bg)]/50 border border-[var(--glass-border)] text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">ID</p>
                                    <p className="font-mono text-xs font-bold text-[var(--text-secondary)]">{hotel.id}</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8 flex items-center justify-center border-dashed border-2">
                        <div className="text-center">
                            <Building2 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-20" />
                            <p className="text-[var(--text-muted)] text-sm italic">Additional technical parameters<br />will be added in Phase 2</p>
                        </div>
                    </GlassCard>
                </div>
            ) : activeTab === 'occupancy' ? (
                <HotelOccupancyMatrix hotelId={hotel.id} />
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">Active Offers</h3>
                        <button
                            onClick={handleAddOffer}
                            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Add Hotel Offer
                        </button>
                    </div>

                    {hotelOffers.length === 0 ? (
                        <GlassCard className="p-12 text-center pb-20">
                            <FileText className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-6 opacity-10" />
                            <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs mb-8">No offers registered for this hotel yet.</p>
                            <button
                                onClick={handleAddOffer}
                                className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-500/20"
                            >
                                Add First Offer
                            </button>
                        </GlassCard>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            {hotelOffers.map(offer => {
                                const totalCapacity = offerRooms
                                    .filter(r => r.hotel_offer_id === offer.id)
                                    .reduce((acc, r) => acc + (r.rooms_count * r.room_capacity), 0);

                                return (
                                    <GlassCard key={offer.id} className="p-6 hover:border-brand-500/50 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[var(--text-primary)]">{offer.name}</h4>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-500/60">
                                                        {offer.nights} nights • {totalCapacity} cap
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                                                offer.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    offer.status === 'rejected' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            )}>
                                                {offer.status}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-6 px-1">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                {format(parseISO(offer.date_from), 'dd MMM')} – {format(parseISO(offer.date_to), 'dd MMM yyyy')}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/hotel-offers/${offer.id}`}
                                                className="flex-1 py-2 bg-[var(--app-bg)]/50 hover:bg-brand-500 hover:text-white border border-[var(--glass-border)] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:border-brand-500/30"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleEditOffer(offer)}
                                                className="p-2 bg-[var(--app-bg)]/50 hover:bg-brand-500/10 border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-brand-500 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOffer(offer.id)}
                                                className="p-2 bg-[var(--app-bg)]/50 hover:bg-red-500/10 border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-red-500 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <OfferFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                hotelId={hotel.id}
                offer={editingOffer}
            />
        </div>
    );
}

import { Plus, Edit2, Eye, Hotel as HotelIcon, Search, Trash2 } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAdminStore } from '../../store/adminStore';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { HotelFormModal } from './components/HotelFormModal';

export function HotelsList() {
    const { hotels, offers, offerRooms, deleteHotel } = useAdminStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHotelId, setSelectedHotelId] = useState<string | undefined>(undefined);

    const filteredHotels = hotels.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setSelectedHotelId(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (id: string) => {
        setSelectedHotelId(id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        const hotel = hotels.find(h => h.id === id);
        if (!hotel) return;

        if (window.confirm(`Are you sure you want to delete ${hotel.name}? This action is irreversible.`)) {
            const result = deleteHotel(id);
            if (!result.success) {
                alert(result.error);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Diagnostic Banner - Temporary for Debugging */}
            <GlassCard className="p-4 border-l-4 border-l-brand-500 bg-brand-500/5">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-brand-500">Database Diagnostic</h3>
                        <div className="flex gap-4 text-xs font-mono text-[var(--text-muted)]">
                            <span>Hotels Loaded: <strong className="text-[var(--text-primary)]">{hotels.length}</strong></span>
                            <span>Offers Loaded: <strong className="text-[var(--text-primary)]">{offers.length}</strong></span>
                            <span>Delegations Loaded: <strong className="text-[var(--text-primary)]">{useAdminStore.getState().delegations.length}</strong></span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            const store = useAdminStore.getState();
                            alert(`Loading: ${store.isLoading}\nError: ${store.error}\nHotels: ${store.hotels.length}`);
                            store.loadInitialData();
                        }}
                        className="px-3 py-1.5 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-600 transition-all"
                    >
                        Force Reload
                    </button>
                </div>
            </GlassCard>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Hotels</h1>
                    <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">Admin / Hotel Management</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Add New Hotel
                </button>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-[var(--glass-border)] bg-[var(--glass-surface)]/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search hotels by name or city..."
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
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Hotel Name</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">City</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Confirmed Capacity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--glass-border)]">
                            {filteredHotels.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[var(--text-muted)] italic">
                                        No hotels found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredHotels.map((hotel) => (
                                    <tr key={hotel.id} className="hover:bg-brand-500/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                                                    <HotelIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[var(--text-primary)]">{hotel.name}</p>
                                                    <p className="text-xs text-[var(--text-muted)]">{hotel.address}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-[var(--text-secondary)]">{hotel.city}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const hotelOffers = offers.filter(o => o.hotel_id === hotel.id);
                                                const confirmedOffers = hotelOffers.filter(o => o.status === 'confirmed');
                                                const draftOffers = hotelOffers.filter(o => o.status === 'draft');

                                                if (confirmedOffers.length > 0) {
                                                    const totalCapacity = confirmedOffers.reduce((acc, offer) => {
                                                        const offerCapacity = offerRooms
                                                            .filter(r => r.hotel_offer_id === offer.id)
                                                            .reduce((sum, r) => sum + (r.rooms_count * r.room_capacity), 0);
                                                        return acc + offerCapacity;
                                                    }, 0);

                                                    return (
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-brand-500">{totalCapacity} pax</span>
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                                                {confirmedOffers.length} Confirmed Offer{confirmedOffers.length > 1 ? 's' : ''}
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                if (draftOffers.length > 0) {
                                                    const draftCapacity = draftOffers.reduce((acc, offer) => {
                                                        const offerCapacity = offerRooms
                                                            .filter(r => r.hotel_offer_id === offer.id)
                                                            .reduce((sum, r) => sum + (r.rooms_count * r.room_capacity), 0);
                                                        return acc + offerCapacity;
                                                    }, 0);

                                                    return (
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-amber-500">{draftCapacity} pax</span>
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-500/70">
                                                                Draft
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                return <span className="text-[10px] text-[var(--text-muted)] italic">No offers</span>;
                                            })()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "w-fit px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border",
                                                hotel.active
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                                            )}>
                                                {hotel.active ? 'Active' : 'Inactive'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/hotels/${hotel.id}`}
                                                    className="p-2 rounded-lg hover:bg-brand-500/10 text-[var(--text-muted)] hover:text-brand-500 transition-all"
                                                    title="View Detail"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(hotel.id)}
                                                    className="p-2 rounded-lg hover:bg-brand-500/10 text-[var(--text-muted)] hover:text-brand-500 transition-all"
                                                    title="Edit Hotel"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(hotel.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-all"
                                                    title="Delete Hotel"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <HotelFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                hotelId={selectedHotelId}
            />
        </div>
    );
}

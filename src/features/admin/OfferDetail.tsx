import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Select } from '../../components/ui/Select';
import { Breadcrumbs } from './components/Breadcrumbs';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
    ChevronLeft, Save, Trash2, Plus,
    Info, Users, DollarSign,
    CheckCircle2, AlertCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
    type OfferStatus,
    type ServiceType,
    type ServiceUnit
} from '../../types/admin';

export function OfferDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        offers, hotels, offerRooms, offerServices,
        updateOffer, deleteOffer,
        addOfferRoom, updateOfferRoom, deleteOfferRoom,
        addOfferService, updateOfferService, deleteOfferService,
        error
    } = useAdminStore();

    const offer = offers.find(o => o.id === id);
    const hotel = hotels.find(h => h.id === offer?.hotel_id);
    const rooms = offerRooms.filter(r => r.hotel_offer_id === id);
    const services = offerServices.filter(s => s.hotel_offer_id === id);

    const [isSaving, setIsSaving] = useState(false);

    if (!offer || !hotel) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Offer not found</h2>
                <Link to="/admin/hotel-offers" className="text-brand-500 hover:underline mt-4 inline-block">Back to offers</Link>
            </div>
        );
    }

    const isConfirmed = offer.status === 'confirmed';

    // Calculations
    const totalCapacity = rooms.reduce((acc, r) => acc + ((Number(r.rooms_count) || 0) * (Number(r.room_capacity) || 0)), 0) || 0;
    const totalRooms = rooms.reduce((acc, r) => acc + (Number(r.rooms_count) || 0), 0) || 0;

    const accommodationCostPerNight = rooms.reduce((acc, r) => {
        if (r.is_gratuit) return acc;
        return acc + ((Number(r.rooms_count) || 0) * (Number(r.price_per_room_per_night) || 0));
    }, 0) || 0;

    const servicesCostPerNight = services.reduce((acc, s) => {
        let cost = 0;
        const price = Number(s.price) || 0;
        if (s.unit === 'person_per_night') cost = price * totalCapacity;
        else if (s.unit === 'room_per_night') cost = price * totalRooms;
        else cost = price;
        return acc + cost;
    }, 0) || 0;

    const totalCost = (accommodationCostPerNight + servicesCostPerNight) * (Number(offer.nights) || 0);

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === 'confirmed') {
            if (window.confirm("Confirming the offer will lock dates and room quantities. Are you sure?")) {
                updateOffer(offer.id, { status: 'confirmed' });
            }
        } else {
            updateOffer(offer.id, { status: newStatus as OfferStatus });
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            // alert('Offer updated successfully.');
        }, 500);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            const success = deleteOffer(offer.id);
            if (success) {
                navigate(`/admin/hotels/${hotel.id}#offers`); // Back to hotel context
            } else {
                alert('Cannot delete a confirmed offer.');
            }
        }
    };

    const roomTypeOptions = []; // Legacy
    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'rejected', label: 'Rejected' }
    ];
    const serviceTypeOptions = [
        { value: 'city_tax', label: 'City Tax' },
        { value: 'dinner', label: 'Dinner' },
        { value: 'lunch', label: 'Lunch' },
        { value: 'parking_car', label: 'Parking (Car)' },
        { value: 'parking_bus', label: 'Parking (Bus)' },
        { value: 'meeting_room', label: 'Meeting Room' },
        { value: 'custom', label: 'Custom' }
    ];
    const unitOptions = [
        { value: 'person_per_night', label: 'P / night' },
        { value: 'room_per_night', label: 'R / night' },
        { value: 'vehicle_per_day', label: 'V / day' },
        { value: 'flat', label: 'Flat' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Breadcrumbs
                    items={[
                        { label: 'Hotels', path: '/admin/hotels' },
                        { label: hotel.name, path: `/admin/hotels/${hotel.id}` },
                        { label: 'Offers', path: `/admin/hotels/${hotel.id}` },
                        { label: offer.name }
                    ]}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to={`/admin/hotels/${hotel.id}`}
                            className="p-2 rounded-xl bg-[var(--glass-surface)]/50 border border-[var(--glass-border)] text-[var(--text-muted)] hover:text-brand-500 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">{offer.name}</h1>
                            <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">
                                {hotel.name} • {offer.nights} nights
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDelete}
                            disabled={isConfirmed}
                            className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-30"
                            title={isConfirmed ? "Cannot delete confirmed offer" : "Delete Offer"}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {
                error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )
            }

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                <div className="lg:col-span-2 space-y-6">
                    {/* General Information */}
                    <GlassCard className="p-8">
                        <div className="flex items-center gap-2 mb-6 text-brand-500">
                            <Info className="w-5 h-5" />
                            <h3 className="text-sm font-black uppercase tracking-[0.2em]">General Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Offer Name</label>
                                    <input
                                        type="text"
                                        value={offer.name}
                                        onChange={(e) => updateOffer(offer.id, { name: e.target.value })}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Internal Note</label>
                                    <textarea
                                        value={offer.note}
                                        onChange={(e) => updateOffer(offer.id, { note: e.target.value })}
                                        placeholder="Add internal notes..."
                                        rows={2}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Date From</label>
                                        <input
                                            type="date"
                                            disabled={isConfirmed}
                                            value={offer.date_from}
                                            onChange={(e) => updateOffer(offer.id, { date_from: e.target.value })}
                                            className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3 text-sm font-bold outline-none focus:border-brand-500 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Date To</label>
                                        <input
                                            type="date"
                                            disabled={isConfirmed}
                                            value={offer.date_to}
                                            onChange={(e) => updateOffer(offer.id, { date_to: e.target.value })}
                                            className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3 text-sm font-bold outline-none focus:border-brand-500 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Status</label>
                                    <Select
                                        value={offer.status}
                                        options={statusOptions}
                                        onChange={handleStatusChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Rooms Configuration */}
                    <GlassCard className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-[var(--glass-border)] flex justify-between items-center">
                            <div className="flex items-center gap-2 text-brand-500">
                                <Users className="w-5 h-5" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Rooms Configuration</h3>
                            </div>
                            <button
                                onClick={() => addOfferRoom({
                                    hotel_offer_id: offer.id,
                                    room_capacity: 2,
                                    rooms_count: 1,
                                    price_per_room_per_night: 0,
                                    is_gratuit: false,
                                    note: ''
                                })}
                                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-brand-500 hover:text-brand-400 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Room Row
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--glass-surface)]/30 border-b border-[var(--glass-border)]">
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Capacity (Beds)</th>
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Count</th>
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Price / N</th>
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">FOC</th>
                                        <th className="px-6 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--glass-border)]">
                                    {rooms.map(room => (
                                        <tr key={room.id} className="hover:bg-brand-500/5 transition-colors group">
                                            <td className="px-6 py-3 min-w-[120px]">
                                                <input
                                                    type="number"
                                                    disabled={isConfirmed}
                                                    value={room.room_capacity}
                                                    onChange={(e) => updateOfferRoom(room.id, { room_capacity: parseInt(e.target.value) || 0 })}
                                                    className="w-full bg-transparent font-bold text-sm outline-none focus:text-brand-500 disabled:opacity-50"
                                                />
                                            </td>
                                            <td className="px-6 py-3">
                                                <input
                                                    type="number"
                                                    disabled={isConfirmed}
                                                    value={room.rooms_count}
                                                    onChange={(e) => updateOfferRoom(room.id, { rooms_count: parseInt(e.target.value) || 0 })}
                                                    className="w-16 bg-transparent font-bold text-sm outline-none focus:text-brand-500 disabled:opacity-50"
                                                />
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="relative">
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">€</span>
                                                    <input
                                                        type="number"
                                                        disabled={room.is_gratuit}
                                                        value={room.price_per_room_per_night}
                                                        onChange={(e) => updateOfferRoom(room.id, { price_per_room_per_night: parseFloat(e.target.value) || 0 })}
                                                        className="w-24 pl-4 bg-transparent font-bold text-sm outline-none focus:text-brand-500 disabled:opacity-30"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        onClick={() => updateOfferRoom(room.id, { is_gratuit: !room.is_gratuit })}
                                                        className={cn(
                                                            "w-8 h-4 rounded-full relative transition-all cursor-pointer",
                                                            room.is_gratuit ? "bg-emerald-500" : "bg-[var(--glass-border)]"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all",
                                                            room.is_gratuit ? "left-4.5" : "left-0.5"
                                                        )} />
                                                    </div>
                                                    <span className="text-[8px] font-black uppercase text-[var(--text-muted)]">FOC</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                {!isConfirmed && (
                                                    <button
                                                        onClick={() => deleteOfferRoom(room.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>

                    {/* Services Table */}
                    <GlassCard className="p-0 overflow-hidden">
                        <div className="p-6 border-b border-[var(--glass-border)] flex justify-between items-center">
                            <div className="flex items-center gap-2 text-brand-500">
                                <Plus className="w-5 h-5" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Services</h3>
                            </div>
                            <button
                                onClick={() => addOfferService({
                                    hotel_offer_id: offer.id,
                                    service_type: 'city_tax',
                                    price: 0,
                                    unit: 'person_per_night',
                                    mandatory: true,
                                    note: ''
                                })}
                                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-brand-500 hover:text-brand-400 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Service row
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--glass-surface)]/30 border-b border-[var(--glass-border)]">
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Type</th>
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Price</th>
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Unit</th>
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Mand.</th>
                                        <th className="px-6 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--glass-border)]">
                                    {services.map(service => (
                                        <tr key={service.id} className="hover:bg-brand-500/5 transition-colors group">
                                            <td className="px-6 py-3 min-w-[180px]">
                                                <Select
                                                    value={service.service_type}
                                                    options={serviceTypeOptions}
                                                    onChange={(val) => updateOfferService(service.id, { service_type: val as ServiceType })}
                                                    className="h-10 text-xs"
                                                />
                                            </td>
                                            <td className="px-6 py-3">
                                                <input
                                                    type="number"
                                                    value={service.price}
                                                    onChange={(e) => updateOfferService(service.id, { price: parseFloat(e.target.value) || 0 })}
                                                    className="w-20 bg-transparent font-bold text-sm outline-none focus:text-brand-500"
                                                />
                                            </td>
                                            <td className="px-6 py-3 min-w-[140px]">
                                                <Select
                                                    value={service.unit}
                                                    options={unitOptions}
                                                    onChange={(val) => updateOfferService(service.id, { unit: val as ServiceUnit })}
                                                    className="h-10 text-xs"
                                                />
                                            </td>
                                            <td className="px-6 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={service.mandatory}
                                                    onChange={(e) => updateOfferService(service.id, { mandatory: e.target.checked })}
                                                    className="w-4 h-4 rounded border-[var(--glass-border)] border-2 checked:bg-brand-500"
                                                />
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <button
                                                    onClick={() => deleteOfferService(service.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                <div className="space-y-6">
                    {/* Summary Dashboard */}
                    <GlassCard className="p-8 border-l-4 border-l-brand-500 overflow-hidden relative">
                        <DollarSign className="absolute -bottom-4 -right-4 w-32 h-32 text-brand-500 opacity-5 -rotate-12" />

                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-500 mb-8">Offer Summary</h3>

                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-end pb-4 border-b border-[var(--glass-border)]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Nights</span>
                                <span className="text-lg font-black text-[var(--text-primary)]">{offer.nights} <span className="text-xs font-bold text-[var(--text-muted)]">nights</span></span>
                            </div>
                            <div className="flex justify-between items-end pb-4 border-b border-[var(--glass-border)]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Rooms</span>
                                <span className="text-lg font-black text-[var(--text-primary)]">{totalRooms} <span className="text-xs font-bold text-[var(--text-muted)]">units</span></span>
                            </div>
                            <div className="flex justify-between items-end pb-4 border-b border-[var(--glass-border)]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Capacity</span>
                                <span className="text-lg font-black text-[var(--text-primary)]">{totalCapacity} <span className="text-xs font-bold text-[var(--text-muted)]">persons</span></span>
                            </div>

                            <div className="pt-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Estimated Total Price</p>
                                <div className="text-4xl font-black text-brand-500 tracking-tighter">
                                    {totalCost.toLocaleString()} <span className="text-xl">€</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mt-1 opacity-60">Calculated value</p>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Actions & Help */}
                    <GlassCard className="p-8">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-500 mb-6">Status Info</h3>
                        {isConfirmed ? (
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-4">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Confirmed</p>
                                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                                        Dates and room counts are locked. You can still adjust notes and status.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
                                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Draft state</p>
                                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                                        All fields are editable. Use status to confirm availability.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-[var(--glass-border)] space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Quick help</p>
                            <p className="text-[9px] text-[var(--text-muted)] border-l-2 border-brand-500/30 pl-3">
                                <strong>Suite capacity</strong> is editable. For other room types, it is fixed based on standard occupancy.
                            </p>
                            <p className="text-[9px] text-[var(--text-muted)] border-l-2 border-brand-500/30 pl-3">
                                <strong>Services</strong> can be calculated per person (based on room capacity) or per room.
                            </p>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div >
    );
}

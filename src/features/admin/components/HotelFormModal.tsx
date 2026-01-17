import { useState, useEffect } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { useAdminStore } from '../../../store/adminStore';
import { X, Save, Building2 } from 'lucide-react';

interface HotelFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelId?: string;
}

export function HotelFormModal({ isOpen, onClose, hotelId }: HotelFormModalProps) {
    const { hotels, addHotel, updateHotel } = useAdminStore();
    const editingHotel = hotels.find(h => h.id === hotelId);

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        address: '',
        contact_email: '',
        contact_phone: '',
        active: true
    });

    useEffect(() => {
        if (editingHotel) {
            setFormData({
                name: editingHotel.name,
                city: editingHotel.city,
                address: editingHotel.address,
                contact_email: editingHotel.contact_email,
                contact_phone: editingHotel.contact_phone,
                active: editingHotel.active
            });
        } else {
            setFormData({
                name: '',
                city: '',
                address: '',
                contact_email: '',
                contact_phone: '',
                active: true
            });
        }
    }, [editingHotel, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingHotel) {
            updateHotel(editingHotel.id, formData);
        } else {
            addHotel(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[var(--app-bg)]/60 backdrop-blur-sm" onClick={onClose} />

            <GlassCard className="w-full max-w-lg p-0 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-[var(--glass-border)] flex justify-between items-center text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                                {editingHotel ? 'Edit Hotel' : 'Create New Hotel'}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                {editingHotel ? 'Modify existing property' : 'Add new property to system'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--glass-border)] rounded-lg transition-all text-[var(--text-muted)]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 text-left">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Hotel Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                                placeholder="e.g. Grand Hotel Royal"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">City</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                                    placeholder="e.g. Prague"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Status</label>
                                <div className="flex gap-2 p-1 bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl h-[46px]">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, active: true })}
                                        className={`flex-1 rounded-lg text-[10px] font-black uppercase transition-all ${formData.active ? 'bg-emerald-500 text-white shadow-lg' : 'text-[var(--text-muted)]'}`}
                                    >
                                        Active
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, active: false })}
                                        className={`flex-1 rounded-lg text-[10px] font-black uppercase transition-all ${!formData.active ? 'bg-red-500 text-white shadow-lg' : 'text-[var(--text-muted)]'}`}
                                    >
                                        Inactive
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Address</label>
                            <input
                                required
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                                placeholder="Street name and number"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Contact Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                                    className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                                    placeholder="info@hotel.com"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.contact_phone}
                                    onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                                    className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3 text-sm font-bold outline-none focus:border-brand-500 transition-all"
                                    placeholder="+420 ..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 border border-[var(--glass-border)] text-[var(--text-secondary)] rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[var(--glass-border)] transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 px-6 bg-brand-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {editingHotel ? 'Save Changes' : 'Create Hotel'}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}

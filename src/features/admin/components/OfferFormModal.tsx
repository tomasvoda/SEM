import { X, Calendar } from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { useAdminStore } from '../../../store/adminStore';
import { useState, useEffect } from 'react';
import type { HotelOffer, OfferStatus } from '../../../types/admin';
import { Select } from '../../../components/ui/Select';

interface OfferFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelId: string;
    offer?: HotelOffer;
}

export function OfferFormModal({ isOpen, onClose, hotelId, offer }: OfferFormModalProps) {
    const { addOffer, updateOffer } = useAdminStore();

    const [name, setName] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [status, setStatus] = useState<OfferStatus>('draft');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (offer) {
            setName(offer.name);
            setDateFrom(offer.date_from);
            setDateTo(offer.date_to);
            setStatus(offer.status);
            setNote(offer.note);
        } else {
            setName('');
            setDateFrom('');
            setDateTo('');
            setStatus('draft');
            setNote('');
        }
    }, [offer, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (new Date(dateTo) <= new Date(dateFrom)) {
            alert('Date To must be after Date From');
            return;
        }

        const offerData = {
            hotel_id: hotelId,
            name,
            date_from: dateFrom,
            date_to: dateTo,
            status,
            note
        };

        if (offer) {
            updateOffer(offer.id, offerData);
        } else {
            addOffer(offerData);
        }
        onClose();
    };

    const isConfirmed = offer?.status === 'confirmed';
    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'rejected', label: 'Rejected' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-xl p-8 relative shadow-2xl overflow-hidden">
                {/* Decoration */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                            {offer ? 'Edit Hotel Offer' : 'New Hotel Offer'}
                        </h2>
                        <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest mt-1">
                            Offer lifecycle management
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--glass-border)]/50 rounded-xl transition-all text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Offer Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Summer Convention 2026"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3.5 text-sm font-bold outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Date From</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                                    <input
                                        required
                                        disabled={isConfirmed}
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl py-3.5 pl-10 pr-3.5 text-sm font-bold outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Date To</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                                    <input
                                        required
                                        disabled={isConfirmed}
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl py-3.5 pl-10 pr-3.5 text-sm font-bold outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all disabled:opacity-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Status</label>
                            <Select
                                value={status}
                                options={statusOptions}
                                onChange={(val) => setStatus(val as OfferStatus)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Project Notes (Optional)</label>
                            <textarea
                                placeholder="Terms, conditions or additional context..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                className="w-full bg-[var(--app-bg)]/50 border border-[var(--glass-border)] rounded-xl p-3.5 text-sm font-bold outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-[var(--glass-border)] hover:bg-[var(--glass-border)]/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-500/20 active:scale-[0.98]"
                        >
                            {offer ? 'Update Offer' : 'Create Offer'}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}

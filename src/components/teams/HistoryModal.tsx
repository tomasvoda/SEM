import { X } from 'lucide-react';
import { TeamHistoryDetail } from './TeamHistoryDetail';
import { getFlagUrl } from '../../lib/countryUtils';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    countryCode: string | null;
    countryName: string | null;
    isMobile?: boolean;
}

export function HistoryModal({ isOpen, onClose, countryCode, countryName, isMobile = false }: HistoryModalProps) {
    const { t } = useTranslation('common');
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !countryCode || !countryName) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center sm:p-6",
            isMobile ? "p-0" : "p-4"
        )}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={cn(
                "relative w-full max-w-2xl max-h-[90vh] glass-panel rounded-3xl border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in duration-300",
                isMobile
                    ? "mt-auto rounded-b-none sm:rounded-3xl sm:mt-0 slide-in-from-bottom sm:zoom-in-95"
                    : "zoom-in-95 fade-in"
            )}>
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-9 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                            <img
                                src={getFlagUrl(countryCode)}
                                alt={countryName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight leading-none mb-1">
                                {countryName}
                            </h2>
                            <p className="text-[10px] font-bold text-brand-500 uppercase tracking-[0.2em] leading-none">
                                {t('navigation.teams.history_title')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <TeamHistoryDetail countryCode={countryCode} countryName={countryName} />
                </div>
            </div>
        </div>
    );
}

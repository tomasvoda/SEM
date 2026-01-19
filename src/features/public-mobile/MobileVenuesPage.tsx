import { MapPin, Info, Navigation, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../../components/ui/GlassCard';

const VENUE_IDS = ['prostejov', 'otrokovice', 'zlin'] as const;

const VENUE_ADDRESSES: Record<string, string> = {
    'prostejov': 'Sportovní 1, 796 01 Prostějov',
    'otrokovice': 'Sportovní 1184, 765 02 Otrokovice',
    'zlin': 'U Stadionu 1557, 760 01 Zlín'
};

export function MobileVenuesPage() {
    const { t } = useTranslation('venues');

    const handleNavigate = (address: string) => {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen px-4 py-6 pb-24">
            <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-2">
                {t('title')}
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-8">
                {t('subtitle')}
            </p>

            <div className="space-y-6">
                {VENUE_IDS.map((id) => (
                    <GlassCard key={id} className="overflow-hidden border-white/10">
                        {/* City Summary */}
                        <div className="p-5 bg-gradient-to-b from-brand-500/[0.07] to-transparent">
                            <h2 className="text-xl font-black text-brand-500 uppercase tracking-tight mb-3">
                                {t(`cities.${id}.name`)}
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex gap-3">
                                <Info className="w-4 h-4 text-brand-500 flex-shrink-0" />
                                {t(`cities.${id}.summary`)}
                            </p>
                        </div>

                        {/* Venue Detail */}
                        <div className="p-5 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <MapPin className="w-5 h-5 text-brand-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-0.5">{t('labels.hall')}</p>
                                    <p className="text-base font-black text-[var(--text-primary)] uppercase leading-tight">{t(`cities.${id}.venue`)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <Globe className="w-5 h-5 text-brand-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-0.5">{t('labels.address')}</p>
                                    <p className="text-xs font-bold text-[var(--text-secondary)]">{VENUE_ADDRESSES[id]}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 flex flex-col justify-center">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] leading-none mb-1">{t('labels.capacity')}</p>
                                    <p className="text-xs font-black text-brand-500 leading-none">{t(`cities.${id}.capacity`)}</p>
                                </div>
                                <button
                                    onClick={() => handleNavigate(`${t(`cities.${id}.venue`)}, ${VENUE_ADDRESSES[id]}`)}
                                    className="flex items-center justify-center gap-2 bg-brand-500 text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
                                >
                                    <Navigation className="w-3.5 h-3.5" /> {t('labels.navigate')}
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}

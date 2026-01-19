import { MapPin, Info, Navigation, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
            <h1 className="mobile-page-title">
                {t('title')}
            </h1>
            <p className="mobile-page-subtitle">
                {t('subtitle')}
            </p>

            <div className="space-y-6">
                {VENUE_IDS.map((id) => (
                    <div key={id} className="glass-panel overflow-hidden">
                        {/* City Summary */}
                        <div className="p-5 bg-gradient-to-b from-brand-500/[0.07] to-transparent">
                            <h2 className="mobile-page-title text-brand-500 text-[20px] mb-2">
                                {t(`cities.${id}.name`)}
                            </h2>
                            <p className="mobile-body-secondary flex gap-3">
                                <Info className="w-4 h-4 text-brand-500 flex-shrink-0" />
                                {t(`cities.${id}.summary`)}
                            </p>
                        </div>

                        {/* Venue Detail */}
                        <div className="p-5 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center p-0">
                                    <MapPin className="w-5 h-5 text-brand-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="mobile-metadata-label mb-0.5">{t('labels.hall')}</p>
                                    <p className="mobile-card-title">{t(`cities.${id}.venue`)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center p-0">
                                    <Globe className="w-5 h-5 text-brand-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="mobile-metadata-label mb-0.5">{t('labels.address')}</p>
                                    <p className="mobile-body-secondary leading-tight">{VENUE_ADDRESSES[id]}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="px-4 py-3 glass flex flex-col justify-center">
                                    <p className="mobile-metadata-label leading-none mb-1">{t('labels.capacity')}</p>
                                    <p className="mobile-card-title text-brand-500 leading-none">{t(`cities.${id}.capacity`)}</p>
                                </div>
                                <button
                                    onClick={() => handleNavigate(`${t(`cities.${id}.venue`)}, ${VENUE_ADDRESSES[id]}`)}
                                    className="flex items-center justify-center gap-2 bg-brand-500 text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg shadow-brand-500/20 active:scale-95 transition-all p-0"
                                >
                                    <Navigation className="w-3.5 h-3.5" /> {t('labels.navigate')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

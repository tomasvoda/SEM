import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, Check } from 'lucide-react';

export function MobileVolunteersPage() {
    const { t } = useTranslation('signup');

    return (
        <div className="min-h-screen px-4 py-8 pb-24">
            <div className="text-center space-y-3 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-black text-brand-400 uppercase tracking-widest">
                    <Heart className="w-3 h-3 animate-pulse" /> {t('subtitle')}
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight">
                    {t('title')}
                </h1>
            </div>

            <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="glass-panel rounded-3xl p-6 border-brand-500/20 bg-brand-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />

                    <h2 className="text-xl font-black uppercase tracking-tight mb-3">
                        {t('intro.title')}
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                        {t('intro.description')}
                    </p>

                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-brand-500 uppercase tracking-widest">
                            {t('benefits.title')}
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {(t('benefits.items', { returnObjects: true }) as string[]).map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-primary)]">
                                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                        <Check className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link
                        to="/mobile/volunteer-signup"
                        className="mt-8 flex items-center justify-center w-full py-4 bg-brand-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
                    >
                        {t('actions.submit')}
                    </Link>

                    <p className="text-[9px] text-center text-[var(--text-muted)] mt-5 uppercase font-black tracking-widest">
                        {t('subtitle')}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function MobileContactPage() {
    const { t } = useTranslation('contact');
    return (
        <div className="min-h-screen px-4 py-8">
            <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
                {t('title')}
            </h1>
            <div className="glass-panel rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-black text-brand-500 mb-2">{t('organizer.title')}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{t('organizer.name')}</p>
                <p className="text-sm text-brand-500 mt-3">{t('organizer.email')}</p>
                <p className="text-sm text-brand-500">{t('organizer.phone')}</p>
            </div>
            <div className="space-y-3">
                {['general', 'volunteers', 'media', 'teams'].map(section => (
                    <div key={section} className="glass-panel rounded-xl p-4">
                        <h3 className="text-sm font-black uppercase mb-1">{t(`sections.${section}.title`)}</h3>
                        <p className="text-sm text-brand-500">{t(`sections.${section}.email`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

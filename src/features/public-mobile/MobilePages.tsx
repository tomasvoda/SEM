import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, Check } from 'lucide-react';

export function MobileVolunteersPage() {
    const { t } = useTranslation('signup');

    return (
        <div className="min-h-screen px-4 py-12 pb-24">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="glass-panel rounded-3xl p-8 border-brand-500/20 bg-brand-500/5 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500/5 rounded-full -ml-24 -mb-24 blur-3xl" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-6">
                            <Heart className="w-8 h-8 text-brand-500 animate-pulse" />
                        </div>

                        <h1 className="text-3xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
                            STAŇ SE SRDCEM<br />
                            <span className="text-brand-500">ŠAMPIONÁTU</span>
                        </h1>

                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-8 max-w-xs mx-auto">
                            {t('intro.description')}
                        </p>

                        <div className="space-y-4 mb-10 text-left max-w-[280px] mx-auto">
                            <h3 className="text-[10px] font-black text-brand-500 uppercase tracking-widest text-center">
                                {t('benefits.title')}
                            </h3>
                            <div className="space-y-3">
                                {(t('benefits.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-xs font-bold text-[var(--text-primary)]">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 flex-shrink-0">
                                            <Check className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <span className="leading-tight">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link
                            to="/mobile/volunteer-signup"
                            className="flex items-center justify-center w-full py-5 bg-brand-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)] hover:shadow-brand-500/50 active:scale-[0.98] transition-all"
                        >
                            POKRAČOVAT K REGISTRACI
                        </Link>

                        <p className="text-[10px] text-[var(--text-muted)] mt-6 uppercase font-black tracking-widest opacity-60">
                            PŘIHLÁŠKY KONČÍ 31. ČERVENCE 2026
                        </p>
                    </div>
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

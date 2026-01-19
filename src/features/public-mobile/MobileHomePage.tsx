import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Trophy, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { publicContent } from '../../content/public';
import { differenceInDays } from 'date-fns';
import { useState } from 'react';

export function MobileHomePage() {
    const { t } = useTranslation('home');
    const [mascotLoaded, setMascotLoaded] = useState(false);
    const daysUntil = differenceInDays(new Date(publicContent.event.dates.start), new Date());

    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <section className="relative px-4 pt-8 pb-12 overflow-hidden">
                {/* Mascot Korfy */}
                <div className={`absolute -right-4 top-10 w-64 h-64 pointer-events-none z-0 transition-all duration-1000 ease-out ${mascotLoaded ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
                    }`}>
                    <img
                        src="/korfy_mascot.png"
                        alt="Korfy Mascot"
                        onLoad={() => setMascotLoaded(true)}
                        className="w-full h-full object-contain"
                        style={{ filter: 'drop-shadow(-10px 15px 30px rgba(0,0,0,0.3))' }}
                    />
                </div>

                <div className="text-left relative z-10 max-w-[70%]">
                    <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none mb-2">
                        {t('hero.title')}
                    </h1>
                    <p className="text-lg font-bold text-brand-500 uppercase tracking-wide mb-4">
                        {t('hero.subtitle')}
                    </p>
                    <p className="text-sm font-medium text-[var(--text-muted)]">
                        {t('hero.date')}
                    </p>
                    <p className="text-xs font-medium text-[var(--text-muted)] mt-1">
                        {t('hero.cities')}
                    </p>
                </div>

                {/* Countdown */}
                {daysUntil > 0 && (
                    <div className="mt-8 glass-panel rounded-2xl p-6 text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">
                            {t('countdown.title')}
                        </p>
                        <div className="text-5xl font-black text-brand-500 tracking-tighter">
                            {daysUntil}
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mt-2">
                            {t('countdown.days')}
                        </p>
                    </div>
                )}

                {/* Primary CTA */}
                <Link
                    to={publicContent.routes.volunteerSignup}
                    className="mt-8 block glass-panel rounded-2xl p-6 hover:bg-brand-500/5 border-2 border-brand-500/20 hover:border-brand-500/40 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-brand-500" />
                            </div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">
                                    {t('cta.volunteer')}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    {t('cta.join')}
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-brand-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </section>

            {/* Highlights */}
            <section className="px-4 pb-8">
                <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">
                    {t('highlights.title')}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/mobile/teams" className="glass-panel rounded-xl p-4 active:scale-95 transition-transform">
                        <p className="text-2xl font-black text-brand-500">16</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mt-1">
                            {t('highlights.teams')}
                        </p>
                    </Link>
                    <Link to="/mobile/venues" className="glass-panel rounded-xl p-4 active:scale-95 transition-transform">
                        <p className="text-2xl font-black text-brand-500">3</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mt-1">
                            {t('highlights.cities')}
                        </p>
                    </Link>
                    <Link to="/mobile/venues" className="glass-panel rounded-xl p-4 active:scale-95 transition-transform">
                        <MapPin className="w-5 h-5 text-brand-500 mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] text-[var(--text-primary)]">
                            {t('highlights.venues')}
                        </p>
                    </Link>
                    <Link to="/mobile/program" className="col-span-2 glass-panel rounded-xl p-5 active:scale-95 transition-transform text-left border-brand-500/20 bg-brand-500/5 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Calendar className="w-5 h-5 text-brand-500" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-500">
                                    {t('highlights.program')}
                                </p>
                            </div>
                            <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                {t('hero.date')}
                            </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-brand-500" />
                    </Link>
                </div>
            </section>

            {/* Latest News */}
            <section className="px-4 pb-8">
                <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">
                    {t('highlights.news', { defaultValue: 'Latest News' })}
                </h2>
                <div className="block glass-panel rounded-2xl p-4 border-brand-500/10">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-brand-500/10 border border-brand-500/20 flex-shrink-0 flex items-center justify-center">
                            <Trophy className="w-7 h-7 text-brand-500" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest mb-1">{t('news.ikf_draw.tag')} • {new Date().toLocaleDateString()}</p>
                            <h3 className="text-sm font-black text-[var(--text-primary)] leading-snug uppercase">
                                {t('news.ikf_draw.title')}
                            </h3>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 leading-relaxed">
                                {t('news.ikf_draw.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

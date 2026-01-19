import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Trophy, Users, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { publicContent } from '../../content/public';
import { differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

export function MobileHomePage() {
    const { t, i18n } = useTranslation('home');
    const location = useLocation();
    const daysUntil = differenceInDays(new Date(publicContent.event.dates.start), new Date());
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (location.state?.triggerMascot) {
            setShouldAnimate(true);
            setAnimationKey(prev => prev + 1);
            // Clear the trigger after consumption
            window.history.replaceState({}, '');
        }
    }, [location]);

    return (
        <div className="min-h-screen pb-32 page-transition relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[60%] h-[30%] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Hero Section - Modern Integrated Look */}
            <section className="relative px-5 pt-10 pb-2">
                <div className="flex flex-col gap-6">
                    <div className="relative z-10 ml-0 flex flex-col gap-6">
                        <div className="relative">
                            <div>
                                <h1 className="text-[38px] font-black text-[var(--text-primary)] uppercase tracking-tight leading-[1.1] mb-5">
                                    {t('hero.titleLine1').split(' ').map((word: string, i: number) => (
                                        <span key={i}>{word}<br /></span>
                                    ))}
                                    <span className="text-brand-500">
                                        {t('hero.titleLine2').split(' ').map((word: string, i: number) => (
                                            <span key={i}>{word}<br /></span>
                                        ))}
                                    </span>
                                </h1>
                                <div className="flex flex-col gap-1 max-w-[65%]">
                                    <p className="mobile-metadata-label opacity-80">
                                        {t('hero.date')}
                                    </p>
                                    <p className="mobile-metadata-label opacity-80">
                                        {t('hero.cities')}
                                    </p>
                                </div>
                            </div>

                            {/* Mascot - Premium Positioning - Integrated in Title block */}
                            <AnimatedKorfy key={animationKey} shouldAnimate={shouldAnimate} />
                        </div>

                        {/* Countdown - Modern Minimal */}
                        {daysUntil > 0 && (
                            <div
                                className="relative z-10 glass-panel py-10 px-6 flex flex-col items-center text-center justify-center overflow-hidden group -mt-24"
                                style={{ transform: 'translateY(-40%)' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="mb-4 w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                                    <Trophy className="w-6 h-6 text-brand-500" />
                                </div>
                                <p className="mobile-metadata-label mb-2">
                                    {t('countdown.title')}
                                </p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-5xl font-black text-brand-500 tracking-tighter">{daysUntil}</span>
                                    <span className="text-[12px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{t('countdown.days')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div style={{ transform: 'translateY(-3%)' }}>

                {/* Volunteer Section - Integrated for CZ */}
                {
                    i18n.language === 'cs' && (
                        <section className="px-5 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="mobile-section-header">
                                    DOBROVOLNÍCI
                                </h2>
                                <div className="h-px bg-[var(--text-muted)] opacity-20 flex-1 ml-4" />
                            </div>

                            <div className="glass-panel p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />

                                <p className="mobile-body-secondary pr-12 mb-6">
                                    Pomoz s organizací turnaje<br />
                                    a staň se jeho srdcem i ty
                                </p>

                                <Link
                                    to={publicContent.routes.volunteerSignup}
                                    className="relative flex items-center justify-between w-full p-5 bg-brand-500 text-white rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-brand-500/20"
                                >
                                    <span className="text-sm font-black uppercase tracking-tight">
                                        REGISTROVAT SE
                                    </span>
                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md">
                                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </div>
                        </section>
                    )
                }

                {/* Stats & Highlights Grid */}
                <section className="px-5 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="mobile-section-header">
                            ZAJÍMAVOSTI
                        </h2>
                        <div className="h-px bg-[var(--text-muted)] opacity-20 flex-1 ml-4" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <HighlightCard
                            to="/mobile/teams"
                            value="16"
                            label={t('highlights.teams')}
                            icon={Users}
                        />
                        <HighlightCard
                            to="/mobile/venues"
                            value="3"
                            label={t('highlights.cities')}
                            icon={MapPin}
                        />

                        <Link
                            to="/mobile/program"
                            className="col-span-2 glass-panel p-6 active:scale-[0.98] transition-all flex flex-col items-center text-center group relative overflow-hidden"
                        >
                            <ArrowRight className="absolute top-5 right-5 w-5 h-5 text-brand-500 group-hover:translate-x-1 transition-transform" />
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-10 h-10 flex items-center justify-center transition-colors">
                                    <Calendar className="w-5 h-5 text-brand-500" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-brand-500 tracking-tighter leading-none mb-1">PROGRAM</p>
                                    <p className="mobile-metadata-label leading-none">
                                        1.7. - 11.7.2026
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* News Section - Modern List */}
                <section className="px-5 py-8 pb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="mobile-section-header">
                            {t('highlights.news')}
                        </h2>
                        <div className="h-px bg-[var(--text-muted)] opacity-20 flex-1 ml-4" />
                    </div>

                    <div className="glass-panel p-5 relative overflow-hidden group">
                        <div className="flex gap-5 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex-shrink-0 flex items-center justify-center">
                                <Trophy className="w-8 h-8 text-brand-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="mobile-metadata-label bg-brand-500/10 px-2 py-0.5 rounded-md text-brand-500">IKF NEWS</span>
                                    <span className="mobile-metadata-label opacity-60">2026</span>
                                </div>
                                <h3 className="text-sm font-black text-[var(--text-primary)] leading-tight uppercase">
                                    {t('news.ikf_draw.title')}
                                </h3>
                                <p className="mobile-body-secondary leading-relaxed font-medium">
                                    {t('news.ikf_draw.description')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function HighlightCard({ to, value, label, icon: Icon }: any) {
    return (
        <Link
            to={to}
            className="glass-panel p-6 active:scale-[0.98] transition-all group flex flex-col items-center text-center"
        >
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                    <p className="text-3xl font-black text-brand-500 tracking-tighter leading-none mb-1">{value}</p>
                    <p className="mobile-metadata-label leading-none">{label}</p>
                </div>
            </div>
        </Link>
    );
}

/**
 * Isolated component for Korfy mascot with controlled animation.
 * The animation triggers only when shouldAnimate is true (navigated via menu).
 */
function AnimatedKorfy({ shouldAnimate }: { shouldAnimate: boolean }) {
    return (
        <div className="absolute right-0 top-full w-[200px] h-[200px] z-20 pointer-events-none mascot-visual-wrapper overflow-visible">
            <img
                src="/korfy_mascot.png"
                alt="Korfy"
                className={cn(
                    "w-full h-full object-contain relative z-20",
                    shouldAnimate
                        ? "animate-korfy-slide"
                        : "opacity-100"
                )}
                style={{ transform: 'translate(95%, -81%)' }}
            />
        </div>
    );
}

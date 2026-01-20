import { useTranslation } from 'react-i18next';
import { useMatchStore } from '../../store/matchStore';
import { getFlagUrl } from '../../lib/countryUtils';
import { Clock, MapPin, Trophy, Calendar } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { cn } from '../../lib/utils';

export function MobileProgramPage() {
    const { schedule, getResolvedTeamCode } = useMatchStore();

    const { t } = useTranslation(['program', 'common']);

    return (
        <div className="min-h-screen px-4 py-6 pb-24">
            <h1 className="mobile-page-title">
                {t('title')}
            </h1>
            <p className="mobile-page-subtitle">
                {t('subtitle')}
            </p>

            <div className="space-y-10">
                {schedule.map((day) => (
                    <div key={day.date} className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-500/10 text-white border border-brand-500/10 mobile-metadata-label rounded-lg">
                            <Calendar className="w-3 h-3 text-brand-500" />
                            <span>{day.date}</span>
                        </div>

                        <div className="space-y-3">
                            {day.matches.map((match, idx) => {
                                const t1 = getResolvedTeamCode(match.team1 || '');
                                const t2 = getResolvedTeamCode(match.team2 || '');
                                const isEvenGroup = Math.floor(idx / 4) % 2 === 0;

                                if (match.type === 'ceremony' || match.type === 'free-day') {
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "glass p-4 relative overflow-hidden group border-l-4 border-brand-500",
                                                !isEvenGroup && "opacity-90"
                                            )}
                                        >
                                            <div className="absolute top-0 right-0 px-2 py-1 bg-brand-500/20 rounded-bl-lg">
                                                <span className="mobile-metadata-label text-[9px] text-brand-500 uppercase">{t('match.event')}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="px-2 py-1 bg-white/10 rounded-lg mobile-metadata-label text-white">
                                                    {match.time}
                                                </div>
                                                <span className="mobile-card-title text-[16px] text-center">
                                                    {match.label}
                                                </span>
                                                <div className="flex items-center justify-center gap-1.5 mobile-metadata-label opacity-70">
                                                    <MapPin className="w-3.5 h-3.5 text-brand-500/70" /> {match.venue}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <GlassCard
                                        key={idx}
                                        className={cn(
                                            "p-4 relative",
                                            !isEvenGroup && "opacity-[0.97]"
                                        )}
                                    >
                                        {/* Match Badge - Top Left */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="px-2 py-1 bg-white/5 rounded-md border border-white/5 flex items-center">
                                                    <span className="mobile-metadata-label text-brand-500">#{match.nr}</span>
                                                </div>
                                                {match.group && (
                                                    <div className="px-2 py-1 bg-white/5 rounded-md border border-white/5 flex items-center">
                                                        <span className="mobile-metadata-label opacity-60 uppercase">{t('match.group')} {match.group}</span>
                                                    </div>
                                                )}
                                                {!match.group && (
                                                    <span className="mobile-metadata-label opacity-70 ml-1">{match.label}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-500/10 rounded-md border border-brand-500/10">
                                                <Clock className="w-3 h-3 text-brand-500" />
                                                <span className="mobile-metadata-label text-white">{match.time}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <div className="flex-1 flex flex-col items-center">
                                                <div className="w-12 h-[30px] rounded border border-white/10 overflow-hidden mb-1.5 shadow-sm">
                                                    {t1 === (match.team1 || '') ? (
                                                        <Trophy className="w-full h-full p-1 text-white/20" />
                                                    ) : (
                                                        <img src={getFlagUrl(t1)} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <span className="mobile-card-title">{t1}</span>
                                            </div>

                                            <div className="flex flex-col items-center justify-center">
                                                {match.score1 !== undefined ? (
                                                    <div className="flex items-center gap-1 px-3 py-1.5 bg-brand-500/20 rounded-xl border border-brand-500/20">
                                                        <span className="mobile-card-title text-[16px] text-white">{match.score1}</span>
                                                        <span className="text-[14px] font-black text-brand-500/50">:</span>
                                                        <span className="mobile-card-title text-[16px] text-white">{match.score2}</span>
                                                    </div>
                                                ) : (
                                                    <span className="mobile-card-title text-[13px] opacity-20">{t('match.vs')}</span>
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col items-center">
                                                <div className="w-12 h-[30px] rounded border border-white/10 overflow-hidden mb-1.5 shadow-sm">
                                                    {t2 === (match.team2 || '') ? (
                                                        <Trophy className="w-full h-full p-1 text-white/20" />
                                                    ) : (
                                                        <img src={getFlagUrl(t2)} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <span className="mobile-card-title">{t2}</span>
                                            </div>
                                        </div>

                                        {/* Venue Indicator - Subtle Center */}
                                        <div className="flex items-center justify-center gap-1.5 pt-1 mt-1 opacity-60">
                                            <MapPin className="w-3 h-3 text-brand-500/70" />
                                            <span className="mobile-metadata-label leading-none">
                                                {match.venue}
                                            </span>
                                        </div>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { useTranslation } from 'react-i18next';
import { useMatchStore } from '../../store/matchStore';
import { getFlagUrl } from '../../lib/countryUtils';
import { Clock, MapPin, Trophy } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

export function MobileProgramPage() {
    const { schedule, getResolvedTeamCode } = useMatchStore();

    const { t } = useTranslation('program');

    return (
        <div className="min-h-screen px-4 py-6 pb-24">
            <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-2">
                {t('title')}
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-8">
                {t('subtitle')}
            </p>

            <div className="space-y-10">
                {schedule.map((day) => (
                    <div key={day.date} className="space-y-4">
                        <div className="inline-block px-3 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {day.date}
                        </div>

                        <div className="space-y-3">
                            {day.matches.map((match, idx) => {
                                const t1 = getResolvedTeamCode(match.team1 || '');
                                const t2 = getResolvedTeamCode(match.team2 || '');

                                if (match.type === 'ceremony' || match.type === 'free-day') {
                                    return (
                                        <div key={idx} className="glass-panel rounded-xl p-3 border-brand-500/20 bg-brand-500/5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-black text-white">
                                                        {match.time}
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-tight text-[var(--text-primary)]">
                                                        {match.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[8px] font-bold text-[var(--text-muted)] uppercase">
                                                    <MapPin className="w-2.5 h-2.5 text-brand-500" /> {match.venue}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <GlassCard key={idx} className="p-4 border-white/5">
                                        <div className="flex items-center justify-between mb-3 text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <span className="text-brand-500">#{match.nr}</span>
                                                <span>{match.label}</span>
                                                {match.group && (
                                                    <span className="bg-white/5 px-1 rounded text-white/40">G {match.group}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" /> {match.time}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 flex flex-col items-center">
                                                <div className="w-10 h-6 rounded border border-white/10 overflow-hidden mb-1">
                                                    {t1 === (match.team1 || '') ? (
                                                        <Trophy className="w-full h-full p-1 text-white/20" />
                                                    ) : (
                                                        <img src={getFlagUrl(t1)} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-[var(--text-primary)]">{t1}</span>
                                            </div>

                                            <div className="flex flex-col items-center justify-center">
                                                {match.score1 !== undefined ? (
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-brand-500/20 rounded-lg">
                                                        <span className="text-xs font-black text-white">{match.score1}</span>
                                                        <span className="text-[10px] text-brand-500">:</span>
                                                        <span className="text-xs font-black text-white">{match.score2}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] font-black text-white/20">VS</span>
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col items-center">
                                                <div className="w-10 h-6 rounded border border-white/10 overflow-hidden mb-1">
                                                    {t2 === (match.team2 || '') ? (
                                                        <Trophy className="w-full h-full p-1 text-white/20" />
                                                    ) : (
                                                        <img src={getFlagUrl(t2)} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-[var(--text-primary)]">{t2}</span>
                                            </div>
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

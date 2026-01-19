import { CHAMPIONSHIP_HISTORY } from '../../data/championshipHistory';
import { Trophy, MapPin, Calendar, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TeamHistoryDetailProps {
    countryCode: string;
    countryName: string;
}

export function TeamHistoryDetail({ countryCode }: TeamHistoryDetailProps) {
    const { t } = useTranslation('common');

    const getTrophyColor = (result: string) => {
        if (result.includes('1.')) return 'text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]'; // Gold
        if (result.includes('2.')) return 'text-[#E2E2E2] drop-shadow-[0_0_8px_rgba(226,226,226,0.3)]'; // Silver
        if (result.includes('3.')) return 'text-[#CD7F32] drop-shadow-[0_0_8px_rgba(205,127,50,0.3)]'; // Bronze
        return 'text-brand-500/40';
    };

    // Process history: sort descending and clean result strings
    const history = [...(CHAMPIONSHIP_HISTORY[countryCode] || [])]
        .sort((a, b) => {
            const yearA = parseInt(a.date.match(/\d{4}$/)?.[0] || '0');
            const yearB = parseInt(b.date.match(/\d{4}$/)?.[0] || '0');
            return yearB - yearA;
        })
        .map(entry => ({
            ...entry,
            // Remove text in parentheses (e.g., "(vicemistr Evropy)")
            result: entry.result.replace(/\s*\(.*?\)/g, '').trim()
        }));

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40">
                <Info className="w-12 h-12 mb-4" />
                <p className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">
                    {t('navigation.teams.no_history')}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3 pb-4 px-1">
            {history.map((entry, index) => (
                <div
                    key={index}
                    className="glass-panel p-4 rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
                            <Trophy className={`w-5 h-5 ${getTrophyColor(entry.result)}`} />
                        </div>
                        <div className="min-w-0 flex-1 py-1">
                            <h4 className="text-[13px] font-black text-[var(--text-primary)] uppercase leading-tight mb-2 pr-10 sm:pr-0">
                                {entry.tournament}
                            </h4>
                            <div className="flex flex-col gap-1.5 mt-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <Calendar className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />
                                    <span className="text-[10px] font-bold text-[var(--text-muted)] truncate uppercase tracking-wider">
                                        {entry.date}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <MapPin className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />
                                    <span className="text-[10px] font-bold text-[var(--text-muted)] truncate uppercase tracking-wider">
                                        {entry.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Result Tag - Better Mobile Visibility */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end pt-3 sm:pt-0 border-t border-white/5 sm:border-0 flex-shrink-0">
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-500/60 leading-none sm:mb-1.5 whitespace-nowrap">
                            {t('navigation.teams.result')}
                        </span>
                        <span className="text-base font-black text-brand-500 leading-none tracking-tight whitespace-nowrap">
                            {entry.result}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

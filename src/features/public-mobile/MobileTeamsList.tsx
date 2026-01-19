import { useState } from 'react';
import { getFlagUrl } from '../../lib/countryUtils';
import { Search } from 'lucide-react';
import { IKF_MEMBERS } from '../../lib/ikfMembers';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function MobileTeamsList() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const allTeams = Object.values(IKF_MEMBERS).sort((a, b) => {
        // Purely by rank (ascending)
        if (a.rank && b.rank) return (a.rank as number) - (b.rank as number);
        if (a.rank) return -1;
        if (b.rank) return 1;
        return a.countryName.localeCompare(b.countryName);
    });

    const filteredTeams = allTeams.filter(team =>
        team.countryName.toLowerCase().includes(search.toLowerCase()) ||
        team.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen px-4 py-6 pb-24">
            <h1 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-2">
                {t('navigation.teams.title')}
            </h1>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-6">
                {t('navigation.teams.subtitle')}
            </p>

            <div className="sticky top-0 z-30 pt-4 pb-4 -mx-4 px-4 bg-[var(--app-bg)]/95 backdrop-blur-xl border-b border-white/5">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder={t('navigation.teams.search')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] focus:border-brand-500/50 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {filteredTeams.map((team) => {
                    return (
                        <div
                            key={team.code}
                            onClick={() => navigate(`/mobile/teams/${team.code}/history`)}
                            className="glass-panel rounded-2xl p-4 active:scale-[0.98] transition-all relative overflow-hidden group cursor-pointer border-white/5 bg-white/[0.04]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-[72px] h-[48px] rounded-lg border border-white/10 flex items-center justify-center overflow-hidden transition-all shadow-lg bg-white/5">
                                    <img
                                        src={getFlagUrl(team.code)}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="mb-1">
                                        <h3 className="text-sm font-black uppercase truncate text-white">
                                            {team.countryName}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/10">
                                            <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest leading-none">
                                                {team.code}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ranking in bottom right */}
                            {team.rank && (
                                <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                                    <span className="text-[10px] text-brand-500 font-black leading-none">
                                        #{team.rank}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

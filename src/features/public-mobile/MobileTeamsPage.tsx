import { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { getFlagUrl } from '../../lib/countryUtils';
import { Search, Check } from 'lucide-react';
import { IKF_MEMBERS } from '../../lib/ikfMembers';
import { useTranslation } from 'react-i18next';

export function MobileTeamsPage() {
    const { t } = useTranslation('common');
    const { delegations } = useAdminStore();
    const [search, setSearch] = useState('');

    const registeredCodes = new Set(
        delegations
            .filter(d => (d.status as any) === 'submitted' || (d.status as any) === 'approved')
            .map(d => d.country_code)
    );

    const allTeams = Object.values(IKF_MEMBERS).sort((a, b) => {
        // Strict rank-based sorting
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

            <div className="sticky top-0 z-30 pt-4 pb-4 -mx-4 px-4 bg-[var(--app-bg)]/80 backdrop-blur-md">
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
                    const isRegistered = registeredCodes.has(team.code);
                    return (
                        <div
                            key={team.code}
                            className="glass-panel rounded-2xl p-4 active:scale-[0.98] transition-all relative overflow-hidden group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-[53px] h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={getFlagUrl(team.code)}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-black text-[var(--text-primary)] uppercase truncate">
                                            {team.countryName}
                                        </h3>
                                        {isRegistered && (
                                            <div className="bg-emerald-500/20 text-emerald-400 p-0.5 rounded-full flex-shrink-0">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">
                                            {team.code}
                                        </span>
                                        {team.rank && (
                                            <span className="text-[10px] text-[var(--text-muted)] font-black">
                                                {t('navigation.teams.rank')} #{team.rank}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}

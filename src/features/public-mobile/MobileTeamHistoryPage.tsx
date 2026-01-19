import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { TeamHistoryDetail } from '../../components/teams/TeamHistoryDetail';
import { IKF_MEMBERS } from '../../lib/ikfMembers';
import { getFlagUrl } from '../../lib/countryUtils';

console.log('MobileTeamHistoryPage loading...');

export function MobileTeamHistoryPage() {
    const { code } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    const team = code ? IKF_MEMBERS[code] : null;

    if (!team) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <p className="text-[var(--text-muted)] uppercase font-black tracking-widest text-xs">
                    Team not found
                </p>
                <button
                    onClick={() => navigate('/mobile/teams')}
                    className="mt-4 text-brand-500 font-black text-xs uppercase tracking-widest"
                >
                    Back to teams
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 page-transition">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-50 bg-[var(--app-bg)]/95 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4 px-4 h-20">
                    <button
                        onClick={() => navigate('/mobile/teams')}
                        className="p-2 -ml-2 rounded-xl active:bg-white/5 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-[var(--text-primary)]" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-6 rounded border border-white/10 overflow-hidden shadow-sm">
                            <img src={getFlagUrl(team.code)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight truncate leading-none mb-1">
                                {team.countryName}
                            </h1>
                            <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] leading-none">
                                {t('navigation.teams.history_title')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6">
                <TeamHistoryDetail countryCode={team.code} countryName={team.countryName} />
            </div>
        </div>
    );
}

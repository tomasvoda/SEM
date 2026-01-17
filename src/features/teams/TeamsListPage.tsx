import { useAdminStore } from '../../store/adminStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { getFlagUrl } from '../../lib/countryUtils';
import { CheckCircle2, Search } from 'lucide-react';
import { IKF_MEMBERS } from '../../lib/ikfMembers';
import { useState } from 'react';
import { cn } from '../../lib/utils'; // Assuming cn utility exists

export function TeamsListPage() {
    const { delegations } = useAdminStore();
    const [search, setSearch] = useState('');

    // Filter teams that have status 'submitted' or 'approved'
    const registeredCodes = new Set(
        delegations
            .filter(d => (d.status as any) === 'submitted' || (d.status as any) === 'approved')
            .map(d => d.country_code)
    );

    const allTeams = Object.values(IKF_MEMBERS).sort((a, b) => {
        // Registered first
        const aReg = registeredCodes.has(a.code);
        const bReg = registeredCodes.has(b.code);
        if (aReg && !bReg) return -1;
        if (!aReg && bReg) return 1;
        // Then alphabetical
        return a.countryName.localeCompare(b.countryName);
    });

    const filteredTeams = allTeams.filter(team =>
        team.countryName.toLowerCase().includes(search.toLowerCase()) ||
        team.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Teams"
                subtitle="All IKF member countries and registration status"
                actions={
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search country..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                        />
                    </div>
                }
            />

            {/* Ranking Disclaimer */}
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs">
                <Search className="w-4 h-4 flex-shrink-0" />
                <p>
                    Rankings based on the <a href="https://korfball.sport/ranking/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300 font-bold">last valid IKF World Ranking</a> from November 2025.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeams.map((team) => {
                    const isRegistered = registeredCodes.has(team.code);

                    return (
                        <GlassCard
                            key={team.code}
                            hoverEffect
                            className={cn(
                                "p-6 flex flex-col items-center text-center justify-center min-h-[180px] transition-all relative overflow-hidden group/card",
                                isRegistered
                                    ? "border-[var(--glass-border)] bg-[var(--glass-surface)]/10"
                                    : "border-white/5 bg-white/[0.02] opacity-60 hover:opacity-100"
                            )}
                        >
                            <div className="relative mt-4">
                                <div className={cn(
                                    "w-20 h-14 rounded-lg overflow-hidden border mb-4 shadow-md bg-white/5 mx-auto transition-all group-hover/card:scale-105 duration-300",
                                    isRegistered ? "border-brand-500/50 shadow-brand-500/20" : "border-white/10 grayscale-[0.8]"
                                )}>
                                    <img
                                        src={getFlagUrl(team.code)}
                                        alt={team.countryName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isRegistered && (
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg z-10">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h3 className={cn(
                                    "text-lg font-black uppercase tracking-tight leading-tight",
                                    isRegistered ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                                )}>
                                    {team.countryName}
                                </h3>

                                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                                    <span className={cn(
                                        isRegistered ? "text-brand-500" : "text-[var(--text-muted)] opacity-50"
                                    )}>
                                        {team.code}
                                    </span>
                                    <span className="w-0.5 h-0.5 rounded-full bg-[var(--text-muted)] opacity-50" />
                                    <span className="text-[var(--text-muted)] opacity-80">
                                        Rank #{team.rank}
                                    </span>
                                </div>
                            </div>

                            {!isRegistered && (
                                <span className="mt-4 text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] border border-white/10 px-2 py-1 rounded-md bg-white/5">
                                    Not Registered
                                </span>
                            )}
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
}

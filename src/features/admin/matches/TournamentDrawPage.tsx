import { GlassCard } from '../../../components/ui/GlassCard';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useMatchStore } from '../../../store/matchStore';
import { Trophy, Users, CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

import { getFlagUrl } from '../../../lib/countryUtils';

import { IKF_MEMBERS } from '../../../lib/ikfMembers';

export default function TournamentDrawPage() {
    const { groups, teamAssignments, setTeamAssignment } = useMatchStore();
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Get all IKF member teams (regardless of registration status)
    const availableTeams = Object.values(IKF_MEMBERS).map(member => ({
        id: member.code,
        federation: member.federationName,
        team_name: member.countryName,
        country_code: member.code
    })).sort((a, b) => a.team_name.localeCompare(b.team_name));

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');



    // Better implementation of assignedCodes
    const assignedCodes = useMemo(() => {
        return Object.entries(teamAssignments)
            .filter(([label, assignment]) => assignment.code !== label) // If code is same as label (e.g. 'A1'), it's unassigned
            .map(([_, assignment]) => assignment.code);
    }, [teamAssignments]);

    // ... inside the component return ...



    const handleAssign = (label: string, federation: string, countryCode: string) => {
        if (federation) {
            setTeamAssignment(label, federation, countryCode);
        } else {
            // Clearing assignment
            setTeamAssignment(label, label, label);
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setActiveDropdown(null);
        setSearchTerm('');
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-end">
                <PageHeader
                    title="Tournament Draw"
                    subtitle="Organize teams into groups and match brackets"
                    breadcrumbs={[
                        { label: 'Admin', href: '/admin/dashboard' },
                        { label: 'Draw' }
                    ]}
                />

                {saveSuccess && (
                    <div className="mb-8 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-4">
                        <CheckCircle2 className="w-4 h-4" />
                        Assignments Saved
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {groups.map((group) => (
                    <GlassCard
                        key={group.name}
                        className={cn(
                            "p-6 space-y-6",
                            group.teams.includes(activeDropdown || '') ? "relative z-[50]" : "relative z-0"
                        )}
                    >
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                                <Trophy className="w-5 h-5 text-brand-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">{group.name}</h3>
                                <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-widest">{group.venue}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {group.teams.map((label) => (
                                <div key={label} className="grid grid-cols-3 items-center gap-4 group/row">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-brand-500 group-hover/row:border-brand-500/30 transition-colors">
                                            {label}
                                        </div>
                                        <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest leading-none">Position {label}</span>
                                    </div>

                                    <div className="col-span-2 relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === label ? null : label)}
                                            className={cn(
                                                "w-full flex items-center justify-between bg-white/5 border rounded-xl px-4 h-12 text-sm font-bold transition-all hover:bg-white/10",
                                                activeDropdown === label ? "border-brand-500 bg-brand-500/5" : "border-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                {teamAssignments[label] && teamAssignments[label].name !== label ? (
                                                    <>
                                                        <div className="w-6 h-4 rounded overflow-hidden border border-white/10 flex-shrink-0">
                                                            <img src={getFlagUrl(teamAssignments[label].code)} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="text-white truncate uppercase font-black tracking-tight">{teamAssignments[label].code}</span>
                                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest truncate max-w-[80px]">
                                                            {teamAssignments[label].name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-[var(--text-muted)] italic">Unassigned (Position {label})</span>
                                                )}
                                            </div>
                                            <ChevronDown className={cn("w-4 h-4 text-[var(--text-muted)] transition-transform", activeDropdown === label ? "rotate-180" : "")} />
                                        </button>

                                        {activeDropdown === label && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => {
                                                        setActiveDropdown(null);
                                                        setSearchTerm('');
                                                    }}
                                                />
                                                <div className="absolute top-14 left-0 right-0 z-[100] bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    {/* Search */}
                                                    <div className="p-2 border-b border-white/5">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                placeholder="Search teams..."
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            {searchTerm && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSearchTerm('');
                                                                    }}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-colors"
                                                                >
                                                                    <X className="w-3 h-3 text-[var(--text-muted)]" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar">
                                                        {/* Option to clear */}
                                                        {teamAssignments[label] && teamAssignments[label].name !== label && (
                                                            <button
                                                                onClick={() => handleAssign(label, '', '')}
                                                                className="w-full flex items-center px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors border-b border-white/5"
                                                            >
                                                                Clear Assignment
                                                            </button>
                                                        )}

                                                        {availableTeams
                                                            .filter(team => {
                                                                const isCurrentlyAssigned = teamAssignments[label]?.code === team.country_code;
                                                                const isAssignedElsewhere = assignedCodes.includes(team.country_code);

                                                                const matchesSearch =
                                                                    team.federation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                    team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                    team.country_code.toLowerCase().includes(searchTerm.toLowerCase());

                                                                return (!isAssignedElsewhere || isCurrentlyAssigned) && matchesSearch;
                                                            })
                                                            .map((team) => (
                                                                <button
                                                                    key={team.id}
                                                                    onClick={() => handleAssign(label, team.federation, team.country_code)}
                                                                    className={cn(
                                                                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5",
                                                                        teamAssignments[label]?.name === team.federation ? "bg-brand-500/10" : ""
                                                                    )}
                                                                >
                                                                    <div className="w-8 h-5 rounded overflow-hidden border border-white/10 flex-shrink-0">
                                                                        <img src={getFlagUrl(team.country_code)} alt="" className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="flex flex-col min-w-0">
                                                                        <span className="text-[11px] font-black text-white uppercase tracking-tight truncate">{team.country_code}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[9px] font-bold text-brand-500/80 uppercase tracking-widest truncate max-w-[120px]">{team.federation}</span>
                                                                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-tight truncate opacity-60">— {team.team_name}</span>
                                                                        </div>
                                                                    </div>
                                                                    {teamAssignments[label]?.name === team.federation && (
                                                                        <div className="ml-auto">
                                                                            <div className="w-2 h-2 rounded-full bg-brand-500" />
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            ))}

                                                        {availableTeams.filter(team => {
                                                            const isCurrentlyAssigned = teamAssignments[label]?.name === team.federation;
                                                            const isAssignedElsewhere = assignedCodes.includes(team.country_code);
                                                            return (!isAssignedElsewhere || isCurrentlyAssigned) && (
                                                                team.federation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                team.country_code.toLowerCase().includes(searchTerm.toLowerCase())
                                                            );
                                                        }).length === 0 && (
                                                                <div className="px-4 py-6 text-center">
                                                                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">No unassigned teams found</p>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                ))}
            </div>

            <GlassCard className="p-8 bg-brand-500/5 border-brand-500/20">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                        <Users className="w-8 h-8 text-brand-500" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">Team Management</h4>
                        <p className="text-[var(--text-secondary)] mt-1 max-w-xl">
                            All assignments are automatically synced to the public Tournament Schedule.
                            If a team position is left unassigned, the original label (e.g., A1) will be displayed.
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}

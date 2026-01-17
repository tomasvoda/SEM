import { useState, useMemo } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Trophy, Clock, MapPin, Star, Coffee, Search, Filter, LayoutGrid, List, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getFlagUrl } from '../../lib/countryUtils';
import { useMatchStore } from '../../store/matchStore';
import type { Match } from '../../store/matchStore';
import { parseISO, isAfter } from 'date-fns';

export function MatchesPage() {
    // Destructure teamAssignments to trigger re-renders when assignments updated in Admin
    const { schedule, groups, getResolvedTeamName, getResolvedTeamCode, toggleFavorite, isFavorite } = useMatchStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGroup, setFilterGroup] = useState('All');
    const [filterVenue, setFilterVenue] = useState('All');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Past' | 'Upcoming'>('All');
    const [showFilters, setShowFilters] = useState(false);
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    const venues = useMemo(() => {
        const set = new Set<string>();
        schedule.forEach(day => day.matches.forEach(m => m.venue && set.add(m.venue)));
        return ['All', ...Array.from(set)];
    }, [schedule]);

    const filteredSchedule = useMemo(() => {
        return schedule.map(day => {
            const matches = day.matches.filter(m => {
                const team1 = getResolvedTeamName(m.team1 || '');
                const team2 = getResolvedTeamName(m.team2 || '');

                const matchesSearch = searchQuery === '' ||
                    team1.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    team2.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.label?.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesGroup = filterGroup === 'All' || m.group === filterGroup;
                const matchesVenue = filterVenue === 'All' || m.venue === filterVenue;

                // Status filtering
                const matchDate = parseISO(day.date);
                const [hours, minutes] = (m.time || '00:00').split(':');
                matchDate.setHours(parseInt(hours), parseInt(minutes));
                const now = new Date();

                let matchesStatus = true;
                if (filterStatus === 'Past') matchesStatus = isAfter(now, matchDate);
                else if (filterStatus === 'Upcoming') matchesStatus = isAfter(matchDate, now);

                const matchesFavorite = !onlyFavorites || (isFavorite(team1) || isFavorite(team2));

                return matchesSearch && matchesGroup && matchesVenue && matchesStatus && matchesFavorite;
            });

            return { ...day, matches };
        }).filter(day => day.matches.length > 0);
    }, [schedule, searchQuery, filterGroup, filterVenue, onlyFavorites, getResolvedTeamName, isFavorite]);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <PageHeader
                    title="Tournament Schedule"
                    subtitle="Official 2026 European Championship Match Schedule"
                    className="mb-0"
                />

                <div className="flex items-center gap-3">
                    {/* Search Field */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-brand-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-brand-500/50 w-40 md:w-64 transition-all focus:shadow-lg focus:shadow-brand-500/5"
                        />
                    </div>

                    {/* Favorites Toggle */}
                    <button
                        onClick={() => setOnlyFavorites(!onlyFavorites)}
                        className={cn(
                            "p-2 rounded-xl border transition-all flex items-center gap-2",
                            onlyFavorites
                                ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                                : "bg-white/5 border-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        )}
                    >
                        <Star className={cn("w-4 h-4", onlyFavorites && "fill-white")} />
                    </button>

                    {/* Filter Toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "p-2 rounded-xl border transition-all flex items-center gap-2",
                                showFilters || filterGroup !== 'All' || filterVenue !== 'All'
                                    ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                                    : "bg-white/5 border-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <Filter className="w-4 h-4" />
                            {(filterGroup !== 'All' || filterVenue !== 'All') && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 mt-3 w-64 glass border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Select Group</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['All', 'A', 'B', 'C', 'D'].map(g => (
                                                <button
                                                    key={g}
                                                    onClick={() => setFilterGroup(g)}
                                                    className={cn(
                                                        "px-2 py-1.5 rounded-lg text-xs font-black uppercase transition-all",
                                                        filterGroup === g ? "bg-brand-500 text-white" : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
                                                    )}
                                                >
                                                    {g === 'All' ? 'All' : `Group ${g}`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Select Venue</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {venues.map(v => (
                                                <button
                                                    key={v}
                                                    onClick={() => setFilterVenue(v)}
                                                    className={cn(
                                                        "px-3 py-2 rounded-xl text-[10px] font-black uppercase text-left transition-all",
                                                        filterVenue === v ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
                                                    )}
                                                >
                                                    {v === 'All' ? 'All Venues' : v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Match Status</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['All', 'Past', 'Upcoming'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => setFilterStatus(s as any)}
                                                    className={cn(
                                                        "px-2 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                                                        filterStatus === s ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10"
                                                    )}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setFilterGroup('All');
                                            setFilterVenue('All');
                                            setFilterStatus('All');
                                            setSearchQuery('');
                                            setOnlyFavorites(false);
                                        }}
                                        className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-brand-500 transition-colors"
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'grid' ? "bg-brand-500 text-white shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'list' ? "bg-brand-500 text-white shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Groups Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {groups.map((group) => (
                    <GlassCard
                        key={group.name}
                        className="p-4 border-brand-500/10 hover:border-brand-500/30 transition-all cursor-pointer group/card"
                        onClick={() => setSelectedGroup(group.name)}
                    >
                        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                            <h3 className="text-sm font-black text-brand-500 uppercase tracking-widest">{group.name}</h3>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-[var(--text-muted)] uppercase">
                                <MapPin className="w-3 h-3" /> {group.venue}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {group.teams.map((label) => {
                                const resolvedName = getResolvedTeamName(label);
                                const resolvedCode = getResolvedTeamCode(label);
                                const isFav = isFavorite(resolvedName);
                                return (
                                    <div
                                        key={label}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(resolvedName);
                                        }}
                                        className={cn(
                                            "relative rounded-lg px-2 py-1.5 text-center text-[10px] font-black transition-all flex items-center justify-center gap-2",
                                            isFav
                                                ? "bg-amber-500/20 text-amber-500 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30"
                                                : "bg-white/5 text-[var(--text-primary)] hover:bg-brand-500/20"
                                        )}
                                    >
                                        <div className="w-5 h-3.5 rounded-sm overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center bg-white/5">
                                            {resolvedCode === label ? (
                                                <Trophy className="w-2.5 h-2.5 text-brand-500/40" />
                                            ) : (
                                                <img src={getFlagUrl(resolvedCode)} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <span className="truncate flex-1">{resolvedCode}</span>
                                        <Star className={cn("w-2.5 h-2.5 flex-shrink-0 transition-all", isFav ? "fill-amber-500 text-amber-500" : "text-[var(--text-muted)] group-hover/card:text-[var(--text-primary)]/40")} />
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="space-y-12">
                {filteredSchedule.map((day) => (
                    <div key={day.date} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 rounded-xl glass border border-brand-500/20 shadow-lg shadow-brand-500/5">
                                <h2 className="text-xl font-black text-brand-500">{day.date}</h2>
                            </div>
                            {day.note && (
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] animate-pulse">
                                    {day.note}
                                </span>
                            )}
                            <div className="h-px flex-1 bg-gradient-to-r from-brand-500/20 to-transparent" />
                        </div>

                        {(() => {
                            const matchesByVenue = day.matches.reduce((acc, m) => {
                                const v = m.venue || 'Unknown Venue';
                                if (!acc[v]) acc[v] = [];
                                acc[v].push(m);
                                return acc;
                            }, {} as Record<string, typeof day.matches>);

                            return Object.entries(matchesByVenue).map(([venue, venueMatches], vIdx) => {
                                // Reorder so ceremonies are at the end, allowing matches to fill rows before them
                                const sortedVenueMatches = [...venueMatches].sort((a, b) => {
                                    if (a.type === 'ceremony' && b.type !== 'ceremony') return 1;
                                    if (a.type !== 'ceremony' && b.type === 'ceremony') return -1;
                                    return 0;
                                });

                                return (
                                    <div key={venue} className={cn("space-y-4", vIdx > 0 ? "pt-4" : "")}>
                                        {/* Venue Separator */}
                                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                            <MapPin className="w-3.5 h-3.5 text-brand-500" />
                                            <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em]">{venue}</span>
                                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
                                        </div>

                                        {viewMode === 'grid' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {sortedVenueMatches.map((match, idx) => (
                                                    <div key={match.nr || idx} className={cn((match.type === 'free-day' || match.type === 'ceremony') ? "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4" : "")}>
                                                        <MatchCard match={match} resolveCode={getResolvedTeamCode} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {sortedVenueMatches.map((match, idx) => (
                                                    <MatchListItem key={match.nr || idx} match={match} resolveCode={getResolvedTeamCode} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                ))}

                {filteredSchedule.length === 0 && (
                    <div className="text-center py-20">
                        <Search className="w-12 h-12 text-[var(--text-muted)]/20 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-widest">No Matches Found</h3>
                        <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mt-2">Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* Group Detail Modal */}
            {selectedGroup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedGroup(null)} />
                    <div className="relative w-full max-w-3xl glass border border-white/10 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                                        <Trophy className="w-6 h-6 text-brand-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">{selectedGroup} Standings</h2>
                                        <p className="text-xs text-[var(--text-muted)] font-black uppercase tracking-widest">Group Phase Rankings</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedGroup(null)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                    <X className="w-6 h-6 text-[var(--text-muted)]" />
                                </button>
                            </div>

                            <div className="overflow-x-auto -mx-8 px-8">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] px-3 w-12">POS</th>
                                            <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] px-3">TEAM</th>
                                            <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] px-3">P</th>
                                            <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] px-3">GF</th>
                                            <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] px-3">GA</th>
                                            <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] px-3">PTS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[1, 2, 3, 4].map((pos) => {
                                            const groupKey = selectedGroup.split(' ')[1];
                                            const teamLabel = `${groupKey}${pos}`; // Corrected: A1 instead of 1A
                                            const teamName = getResolvedTeamName(teamLabel);
                                            const teamCode = getResolvedTeamCode(teamLabel);
                                            return (
                                                <tr key={pos} className="group/row hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-3 font-black text-brand-500 text-sm">#{pos}</td>
                                                    <td className="py-4 px-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-5 rounded overflow-hidden border border-white/10 flex-shrink-0 shadow-sm flex items-center justify-center bg-white/5">
                                                                {teamCode !== teamLabel ? (
                                                                    <img src={getFlagUrl(teamCode)} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Trophy className="w-4 h-4 text-brand-500/40" />
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-black text-[var(--text-primary)] text-sm uppercase tracking-tight">{teamCode}</span>
                                                                {teamCode !== teamName && (
                                                                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest truncate max-w-[120px]">{teamName}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-3 text-center font-bold text-[var(--text-primary)] text-sm">0</td>
                                                    <td className="py-4 px-3 text-center font-bold text-[var(--text-primary)] text-sm">0</td>
                                                    <td className="py-4 px-3 text-center font-bold text-[var(--text-primary)] text-sm">0</td>
                                                    <td className="py-4 px-3 text-right">
                                                        <span className="inline-block px-3 py-1 bg-brand-500/10 text-brand-500 rounded-lg font-black text-sm">0</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function MatchCard({ match, resolveCode }: { match: Match, resolveCode: (l: string) => string }) {
    if (match.type === 'free-day') {
        return (
            <GlassCard className="p-4 border-dashed border-white/10 opacity-60 h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 justify-center py-4">
                    <Coffee className="w-6 h-6 text-brand-500" />
                    <div className="text-center">
                        <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">{match.label}</h4>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Tournament Break</p>
                    </div>
                </div>
            </GlassCard>
        );
    }

    if (match.type === 'ceremony') {
        return (
            <div className="relative group overflow-hidden rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 shadow-lg shadow-brand-500/5 h-full flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-3">
                    <Star className="w-10 h-10 text-brand-500/10 fill-brand-500/10 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col items-center text-center py-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest group-hover:bg-brand-500 group-hover:border-brand-500 group-hover:text-white transition-all mb-2">
                        <Clock className="w-2.5 h-2.5" /> {match.time}
                    </div>
                    <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight mb-1">{match.label}</h4>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        <MapPin className="w-2 h-2 text-brand-500" /> {match.venue}
                    </div>
                </div>
            </div>
        );
    }

    const t1Code = resolveCode(match.team1 || '');
    const t2Code = resolveCode(match.team2 || '');

    return (
        <GlassCard className="p-4 hover:border-brand-500/40 transition-all duration-300 group h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-brand-500 group-hover:border-brand-500/30 transition-colors">
                        #{match.nr}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] leading-tight">{match.label}</span>
                        {match.group && (
                            <span className="text-[8px] font-black text-brand-500 uppercase tracking-widest leading-tight">Group {match.group}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest group-hover:bg-brand-500 group-hover:border-brand-500 group-hover:text-white transition-all">
                    <Clock className="w-2.5 h-2.5" /> {match.time}
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 py-1 flex-1">
                <div className="flex-1 flex flex-col items-center min-w-0">
                    <div className="w-10 h-7 rounded overflow-hidden border border-white/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-sm bg-white/5">
                        {t1Code === (match.team1 || '') ? (
                            <Trophy className="w-5 h-5 text-brand-500/40" />
                        ) : (
                            <img src={getFlagUrl(t1Code)} alt="" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight truncate w-full text-center">{t1Code}</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 min-w-[60px]">
                    {match.score1 !== undefined && match.score2 !== undefined ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-lg">
                            <span className="text-sm font-black text-[var(--text-primary)]">{match.score1}</span>
                            <span className="text-[10px] font-black text-brand-500">:</span>
                            <span className="text-sm font-black text-[var(--text-primary)]">{match.score2}</span>
                        </div>
                    ) : (
                        <>
                            <div className="w-4 h-px bg-[var(--text-primary)]/50 opacity-20" />
                            <span className="text-[8px] font-black text-[var(--text-primary)] opacity-20">VS</span>
                            <div className="w-4 h-px bg-[var(--text-primary)]/50 opacity-20" />
                        </>
                    )}
                </div>

                <div className="flex-1 flex flex-col items-center min-w-0">
                    <div className="w-10 h-7 rounded overflow-hidden border border-white/10 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-sm bg-white/5">
                        {t2Code === (match.team2 || '') ? (
                            <Trophy className="w-5 h-5 text-brand-500/40" />
                        ) : (
                            <img src={getFlagUrl(t2Code)} alt="" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight truncate w-full text-center">{t2Code}</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                <MapPin className="w-2.5 h-2.5 text-brand-500" /> {match.venue || 'TBA'}
            </div>
        </GlassCard>
    );
}

function MatchListItem({ match, resolveCode }: { match: Match, resolveCode: (l: string) => string }) {
    if (match.type === 'free-day') {
        return (
            <div className="flex items-center justify-center py-3 bg-white/5 border border-dashed border-white/10 rounded-xl opacity-60">
                <Coffee className="w-3.5 h-3.5 text-brand-500 mr-2" />
                <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest">{match.label} — Tournament Break</span>
            </div>
        );
    }

    if (match.type === 'ceremony') {
        return (
            <div className="flex items-center justify-between px-6 py-3 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-500 border border-brand-500/50 rounded text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-brand-500/20">
                        <Clock className="w-2.5 h-2.5" /> {match.time}
                    </div>
                    <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-2">
                        <Star className="w-3 h-3 fill-brand-500 text-brand-500" /> {match.label}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                    <MapPin className="w-2.5 h-2.5 text-brand-500" /> {match.venue}
                </div>
            </div>
        );
    }

    const t1Code = resolveCode(match.team1 || '');
    const t2Code = resolveCode(match.team2 || '');

    return (
        <div className="group flex items-center justify-between px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-brand-500/40 transition-all">
            <div className="flex items-center gap-8 flex-1">
                <div className="flex items-center gap-4 w-32">
                    <span className="text-[9px] font-black text-brand-500">#{match.nr}</span>
                    <div className="flex items-center gap-1.5 text-xs font-black text-[var(--text-primary)] bg-white/5 px-2 py-1 rounded-lg group-hover:bg-brand-500 group-hover:text-white transition-colors">
                        <Clock className="w-2.5 h-2.5 text-[var(--text-muted)] group-hover:text-white" /> {match.time}
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                        <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight truncate">{t1Code}</span>
                        <div className="w-8 h-5 rounded overflow-hidden border border-white/10 flex items-center justify-center flex-shrink-0 shadow-sm bg-white/5">
                            {t1Code === (match.team1 || '') ? (
                                <Trophy className="w-3.5 h-3.5 text-brand-500/40" />
                            ) : (
                                <img src={getFlagUrl(t1Code)} alt="" className="w-full h-full object-cover" />
                            )}
                        </div>
                    </div>
                    <span className="text-[9px] font-black text-[var(--text-muted)]">VS</span>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-5 rounded overflow-hidden border border-white/10 flex items-center justify-center flex-shrink-0 shadow-sm bg-white/5">
                            {t2Code === (match.team2 || '') ? (
                                <Trophy className="w-3.5 h-3.5 text-brand-500/40" />
                            ) : (
                                <img src={getFlagUrl(t2Code)} alt="" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <span className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight truncate">{t2Code}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 ml-8 pl-8 border-l border-white/5 text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                <div className="w-20 text-center">
                    {match.group ? (
                        <span className="text-brand-500">Group {match.group}</span>
                    ) : (
                        <span>{match.label}</span>
                    )}
                </div>
                <div className="flex items-center gap-2 w-24">
                    <MapPin className="w-2.5 h-2.5 text-brand-500" /> {match.venue}
                </div>
                <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-brand-500 transform group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
}

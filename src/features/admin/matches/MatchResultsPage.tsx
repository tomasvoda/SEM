import { useState, useMemo, useEffect } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
    Plus,
    Save,
    Search,
    Trophy,
    User,
    X,
    Play
} from 'lucide-react';
import { useMatchStore, type Match } from '../../../store/matchStore';
import { cn } from '../../../lib/utils';
import { getFlagUrl } from '../../../lib/countryUtils';

export default function MatchResultsPage() {
    const { schedule, updateMatchResult, getResolvedTeamName, getResolvedTeamCode } = useMatchStore();
    const [selectedMatchNr, setSelectedMatchNr] = useState<string | number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const allMatches = useMemo(() => {
        return schedule.flatMap(day => day.matches.filter(m => m.type === 'match'));
    }, [schedule]);

    const filteredMatches = useMemo(() => {
        if (!searchQuery) return allMatches;
        const q = searchQuery.toLowerCase();
        return allMatches.filter(m =>
            m.nr?.toString().includes(q) ||
            m.team1?.toLowerCase().includes(q) ||
            m.team2?.toLowerCase().includes(q) ||
            getResolvedTeamName(m.team1 || '').toLowerCase().includes(q) ||
            getResolvedTeamName(m.team2 || '').toLowerCase().includes(q)
        );
    }, [allMatches, searchQuery, getResolvedTeamName]);

    const selectedMatch = useMemo(() =>
        allMatches.find(m => m.nr === selectedMatchNr),
        [allMatches, selectedMatchNr]
    );

    const [score1, setScore1] = useState<number>(0);
    const [score2, setScore2] = useState<number>(0);
    const [scorers, setScorers] = useState<Match['scorers']>([]);

    useEffect(() => {
        if (selectedMatch) {
            setScore1(selectedMatch.score1 || 0);
            setScore2(selectedMatch.score2 || 0);
            setScorers(selectedMatch.scorers || []);
        }
    }, [selectedMatch]);

    const handleSave = () => {
        if (selectedMatchNr !== null) {
            updateMatchResult(selectedMatchNr, score1, score2, scorers);
            setSelectedMatchNr(null);
        }
    };

    const addScorer = (teamLabel: string) => {
        setScorers([...(scorers || []), { team: teamLabel, player: '', minute: 0 }]);
    };

    const removeScorer = (index: number) => {
        setScorers(scorers?.filter((_, i) => i !== index));
    };

    const updateScorer = (index: number, field: string, value: any) => {
        const newScorers = [...(scorers || [])];
        newScorers[index] = { ...newScorers[index], [field]: value };
        setScorers(newScorers);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Match Results"
                subtitle="Enter scores and validate official match reports"
                breadcrumbs={[
                    { label: 'Admin', href: '/admin/dashboard' },
                    { label: 'Results' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <GlassCard className="p-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by team or #nr..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                            />
                        </div>
                        <div className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {filteredMatches.map((m) => {
                                const t1 = getResolvedTeamCode(m.team1 || '');
                                const t2 = getResolvedTeamCode(m.team2 || '');
                                return (
                                    <button
                                        key={m.nr}
                                        onClick={() => setSelectedMatchNr(m.nr ?? null)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-xl transition-all border group",
                                            selectedMatchNr === m.nr
                                                ? "bg-brand-500 border-brand-400 text-white shadow-lg shadow-brand-500/20"
                                                : "border-transparent hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">#{m.nr}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{m.time}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2">
                                                <img src={getFlagUrl(t1)} alt={t1} className="w-5 h-3.5 rounded-sm object-cover opacity-80" />
                                                <span className="text-xs font-black uppercase tracking-tight text-[var(--text-primary)]">{t1}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[var(--text-primary)]">
                                                <span className="text-xs font-black">{m.score1 ?? '-'}</span>
                                                <span className="opacity-40">:</span>
                                                <span className="text-xs font-black">{m.score2 ?? '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black uppercase tracking-tight text-[var(--text-primary)]">{t2}</span>
                                                <img src={getFlagUrl(t2)} alt={t2} className="w-5 h-3.5 rounded-sm object-cover opacity-80" />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>

                <div className="lg:col-span-2">
                    {selectedMatch ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Score Editor */}
                            <GlassCard className="p-8">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex flex-col items-center gap-4 flex-1">
                                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 shadow-lg mb-2">
                                            <img src={getFlagUrl(getResolvedTeamCode(selectedMatch.team1 || ''))} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight text-center">
                                            {getResolvedTeamName(selectedMatch.team1 || '')}
                                        </h3>
                                        <input
                                            type="number"
                                            value={score1}
                                            onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
                                            className="w-24 h-24 bg-white/5 border-2 border-white/10 rounded-3xl text-center text-4xl font-black text-[var(--text-primary)] outline-none focus:border-brand-500 shadow-inner"
                                        />
                                    </div>

                                    <div className="flex flex-col items-center gap-2 px-8">
                                        <div className="text-2xl font-black text-slate-700">:</div>
                                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-brand-500 uppercase tracking-widest">
                                            Full Time
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-4 flex-1">
                                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 shadow-lg mb-2">
                                            <img src={getFlagUrl(getResolvedTeamCode(selectedMatch.team2 || ''))} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <h3 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight text-center">
                                            {getResolvedTeamName(selectedMatch.team2 || '')}
                                        </h3>
                                        <input
                                            type="number"
                                            value={score2}
                                            onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                                            className="w-24 h-24 bg-white/5 border-2 border-white/10 rounded-3xl text-center text-4xl font-black text-[var(--text-primary)] outline-none focus:border-brand-500 shadow-inner"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={handleSave}
                                        className="bg-brand-500 hover:bg-brand-600 text-white px-12 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 flex items-center gap-3 active:scale-95 transition-all"
                                    >
                                        <Save className="w-5 h-5" /> Save Result
                                    </button>
                                </div>
                            </GlassCard>

                            {/* Scorer Editor */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[selectedMatch.team1, selectedMatch.team2].map((teamLabel, idx) => (
                                    <GlassCard key={idx} className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-2">
                                                <Trophy className="w-3 h-3 text-brand-500" /> Scorers: {getResolvedTeamCode(teamLabel || '')}
                                            </h4>
                                            <button
                                                onClick={() => addScorer(teamLabel || '')}
                                                className="p-1.5 hover:bg-brand-500/10 rounded-lg text-brand-500 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {scorers?.filter(s => s.team === teamLabel).map((scorer, sIdx) => {
                                                const globalIdx = scorers.indexOf(scorer);
                                                return (
                                                    <div key={sIdx} className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                                                        <input
                                                            type="text"
                                                            placeholder="Player name"
                                                            value={scorer.player}
                                                            onChange={(e) => updateScorer(globalIdx, 'player', e.target.value)}
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-brand-500/30"
                                                        />
                                                        <div className="relative w-16">
                                                            <input
                                                                type="number"
                                                                placeholder="Min"
                                                                value={scorer.minute}
                                                                onChange={(e) => updateScorer(globalIdx, 'minute', parseInt(e.target.value) || 0)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-6 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-brand-500/30 text-center"
                                                            />
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-500">'</span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeScorer(globalIdx)}
                                                            className="p-2 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            {scorers?.filter(s => s.team === teamLabel).length === 0 && (
                                                <div className="text-center py-8 opacity-20">
                                                    <User className="w-8 h-8 mx-auto mb-2" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">No scorers added</p>
                                                </div>
                                            )}
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                            <Play className="w-16 h-16 text-white/5 mb-6" />
                            <h3 className="text-lg font-black text-white/20 uppercase tracking-[0.2em] mb-2">Select a match to record results</h3>
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest max-w-xs">Use the list on the left to find the match you want to update</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

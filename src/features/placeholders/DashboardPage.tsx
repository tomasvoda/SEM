import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { IconButton } from '../../components/ui/IconButton';
import { RefreshCw, Download, Trophy, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useMatchStore } from '../../store/matchStore';
import { useTaskStore } from '../../store/taskStore';
import { isToday, parseISO, isAfter, format } from 'date-fns';
import { getFlagUrl } from '../../lib/countryUtils';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '../../lib/utils';

export function DashboardPage() {
    const { delegations } = useAdminStore();
    const { schedule, getResolvedTeamCode } = useMatchStore();

    const stats = useMemo(() => {
        const nonDraftDelegations = delegations.filter(d => d.status !== 'draft');
        const totalParticipants = nonDraftDelegations.reduce((sum, d) => sum + (d.required_persons || 0), 0);

        const arrivalsToday = nonDraftDelegations.filter(d => {
            const date = d.transport_arrival_date || d.arrival_date;
            return date && isToday(parseISO(date));
        });

        const upcomingArrivals = nonDraftDelegations
            .filter(d => {
                const date = d.transport_arrival_date || d.arrival_date;
                return date && isAfter(parseISO(date), new Date());
            })
            .sort((a, b) => {
                const dateA = a.transport_arrival_date || a.arrival_date || '';
                const dateB = b.transport_arrival_date || b.arrival_date || '';
                return dateA.localeCompare(dateB);
            });

        const nextArrival = upcomingArrivals[0];

        return {
            totalDelegations: nonDraftDelegations.length,
            totalParticipants,
            arrivalsToday: arrivalsToday.length,
            nextArrival
        };
    }, [delegations]);


    // Find the nearest match day with matches
    const nextMatchDay = useMemo(() => {
        return schedule.find(day => day.matches.some(m => m.type === 'match'));
    }, [schedule]);

    const prostejovMatches = useMemo(() => {
        if (!nextMatchDay) return [];
        return nextMatchDay.matches.filter(m => m.venue === 'Prostějov' && m.type === 'match');
    }, [nextMatchDay]);

    const otrokoviceMatches = useMemo(() => {
        if (!nextMatchDay) return [];
        return nextMatchDay.matches.filter(m => m.venue === 'Otrokovice' && m.type === 'match');
    }, [nextMatchDay]);

    const { tasks } = useTaskStore();

    const upcomingTasks = useMemo(() => {
        return tasks
            .filter(t => t.status !== 'completed')
            .sort((a, b) => a.deadline.localeCompare(b.deadline))
            .slice(0, 5);
    }, [tasks]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Admin Dashboard"
                subtitle="Tournament overview and quick actions"
                breadcrumbs={[
                    { label: 'Event', href: '/admin/dashboard' },
                    { label: 'Dashboard' }
                ]}
                actions={
                    <>
                        <IconButton icon={RefreshCw} variant="glass" label="Refresh" />
                        <IconButton icon={Download} variant="primary" label="Export" />
                    </>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard hoverEffect>
                    <h3 className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-wider">Total Delegations</h3>
                    <p className="text-4xl font-black text-[var(--text-primary)] mt-2 text-glow">{stats.totalDelegations}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold uppercase tracking-widest">Active registrations</p>
                </GlassCard>

                <GlassCard hoverEffect>
                    <h3 className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-wider">Registered Participants</h3>
                    <p className="text-4xl font-black text-brand-300 mt-2 text-glow">{stats.totalParticipants}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold uppercase tracking-widest">Across all teams</p>
                </GlassCard>

                <GlassCard hoverEffect>
                    <h3 className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-wider">Arrivals Today</h3>
                    <p className="text-4xl font-black text-emerald-400 mt-2 text-glow">{stats.arrivalsToday}</p>
                    {stats.nextArrival ? (
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            Next Arrival • {stats.nextArrival.transport_arrival_time || 'N/A'} • {stats.nextArrival.team_name}
                        </p>
                    ) : (
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold uppercase tracking-widest">No more arrivals today</p>
                    )}
                </GlassCard>
            </div>


            {/* Next Matches Day Schedule */}
            {nextMatchDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VenueMatchCard
                        venue="Prostějov"
                        date={nextMatchDay.date}
                        matches={prostejovMatches}
                        resolveCode={getResolvedTeamCode}
                        isFirstCard={true}
                    />
                    <VenueMatchCard
                        venue="Otrokovice"
                        date={nextMatchDay.date}
                        matches={otrokoviceMatches}
                        resolveCode={getResolvedTeamCode}
                    />
                </div>
            )}

            {/* Upcoming Tasks Widget */}
            <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-brand-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">Upcoming Deadlines</h3>
                            <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">Next 5 deliverables</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {upcomingTasks.map((task) => {
                        const isOverdue = isAfter(new Date(), parseISO(task.deadline));
                        return (
                            <div key={task.id} className="group flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="flex flex-col items-center w-20 border-r border-white/10 pr-4 flex-shrink-0">
                                        <span className={cn(
                                            "text-[10px] font-black tracking-tighter",
                                            isOverdue ? "text-red-400" : "text-[var(--text-primary)]"
                                        )}>
                                            {format(parseISO(task.deadline), 'dd MMM')}
                                        </span>
                                        <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                            {format(parseISO(task.deadline), 'yyyy')}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-[var(--text-primary)] truncate group-hover:text-brand-300 transition-colors">
                                            {task.title}
                                        </p>
                                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                            Resp: {task.responsibility}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end flex-shrink-0">
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-2 py-1 rounded-md border text-[8px] font-black uppercase tracking-widest",
                                        task.status === 'pending' ? "text-amber-400 border-amber-400/20 bg-amber-400/5" :
                                            task.status === 'overdue' || isOverdue ? "text-red-400 border-red-400/20 bg-red-400/5" :
                                                "text-blue-400 border-blue-400/20 bg-blue-400/5"
                                    )}>
                                        {task.status === 'pending' ? <Clock className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                                        {task.status === 'pending' ? 'In Progress' : isOverdue ? 'Overdue' : 'Planned'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {upcomingTasks.length === 0 && (
                        <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">No upcoming tasks</p>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}

function MatchCountdown({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

    useEffect(() => {
        const update = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                setTimeLeft(null);
                return;
            }

            setTimeLeft({
                d: Math.floor(distance / (1000 * 60 * 60 * 24)),
                h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((distance % (1000 * 60)) / 1000)
            });
        };

        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return null;

    return (
        <div className="flex gap-1.5">
            {[
                { label: 'D', value: timeLeft.d },
                { label: 'H', value: timeLeft.h },
                { label: 'M', value: timeLeft.m },
                { label: 'S', value: timeLeft.s },
            ].map(t => (
                <div key={t.label} className="flex flex-col items-center min-w-[28px] bg-brand-500/10 border border-brand-500/30 rounded-lg py-1 px-1 backdrop-blur-md">
                    <span className="text-[12px] font-black text-brand-500 leading-none">{t.value}</span>
                    <span className="text-[6px] font-black text-[var(--text-muted)] uppercase tracking-widest">{t.label}</span>
                </div>
            ))}
        </div>
    );
}

function VenueMatchCard({ venue, date, matches, resolveCode, isFirstCard }: { venue: string, date: string, matches: any[], resolveCode: (l: string) => string, isFirstCard?: boolean }) {
    const firstMatchDateTime = useMemo(() => {
        if (!isFirstCard || matches.length === 0) return null;
        const firstMatch = matches[0];
        const matchDate = parseISO(date);
        const [h, m] = (firstMatch.time || '00:00').split(':');
        matchDate.setHours(parseInt(h), parseInt(m));
        return matchDate;
    }, [isFirstCard, matches, date]);

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">{venue}</h3>
                        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">{date}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    {firstMatchDateTime && isAfter(firstMatchDateTime, new Date()) ? (
                        <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[8px] font-black text-brand-500 uppercase tracking-[0.2em]">Tournament Kickoff</span>
                            <MatchCountdown targetDate={firstMatchDateTime} />
                        </div>
                    ) : (
                        <>
                            <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Next Matches</span>
                            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{matches.length} Scheduled</span>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {matches.map((match, idx) => (
                    <div key={idx} className="group flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center w-12 border-r border-white/10 pr-4">
                                <Clock className="w-3 h-3 text-brand-500 mb-0.5" />
                                <span className="text-[10px] font-black text-[var(--text-primary)]">{match.time}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end w-24">
                                    <div className="w-6 h-4 rounded overflow-hidden border border-white/10 mb-0.5 flex items-center justify-center bg-white/5">
                                        {resolveCode(match.team1) === match.team1 ? (
                                            <Trophy className="w-3 h-3 text-brand-500/40" />
                                        ) : (
                                            <img src={getFlagUrl(resolveCode(match.team1))} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight truncate">
                                        {resolveCode(match.team1)}
                                    </span>
                                </div>
                                <span className="text-[8px] font-black text-[var(--text-muted)] italic">VS</span>
                                <div className="flex flex-col items-start w-24">
                                    <div className="w-6 h-4 rounded overflow-hidden border border-white/10 mb-0.5 flex items-center justify-center bg-white/5">
                                        {resolveCode(match.team2) === match.team2 ? (
                                            <Trophy className="w-3 h-3 text-brand-500/40" />
                                        ) : (
                                            <img src={getFlagUrl(resolveCode(match.team2))} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight truncate">
                                        {resolveCode(match.team2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-brand-500 uppercase tracking-widest">Nr. {match.nr}</span>
                            <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{match.label}</span>
                        </div>
                    </div>
                ))}

                {matches.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">No matches scheduled at this venue</p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}

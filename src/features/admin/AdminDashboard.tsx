import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVolunteerStore } from '../../store/volunteerStore';
import { useAdminStore } from '../../store/adminStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Users, Clock, Trophy, Shield, Bell, ArrowRight, MapPin, Activity, X, ListTodo, ClipboardList, Hotel, CheckCircle2, AlertCircle } from 'lucide-react';
import { differenceInDays, parseISO, isAfter, subDays, addDays } from 'date-fns';
import { getFlagUrl } from '../../lib/countryUtils';
import { cn } from '../../lib/utils';

export function AdminDashboard() {
    const navigate = useNavigate();
    const volunteers = useVolunteerStore(state => state.volunteers);
    const fetchVolunteers = useVolunteerStore(state => state.fetchVolunteers);
    const volunteersLoading = useVolunteerStore(state => state.isLoading);

    const delegations = useAdminStore(state => state.delegations);
    const loadInitialData = useAdminStore(state => state.loadInitialData);
    const adminLoading = useAdminStore(state => state.isLoading);
    const adminError = useAdminStore(state => state.error);
    const volunteerError = useVolunteerStore(state => state.error);

    const [showMapModal, setShowMapModal] = useState(false);

    useEffect(() => {
        console.log('AdminDashboard Mounted. Fetching data...');
        fetchVolunteers();
    }, [fetchVolunteers]);

    useEffect(() => {
        console.log('Store States:', {
            delegations: delegations.length,
            volunteers: volunteers.length,
            adminLoading,
            volunteersLoading
        });
    }, [delegations, volunteers, adminLoading, volunteersLoading]);

    // Constants
    const TOURNAMENT_START = '2026-10-16';
    const LOCATIONS = ['Prostějov', 'Otrokovice', 'Zlín'];

    // Dynamic Calculations
    const totalTeams = delegations.length;
    const totalParticipants = useMemo(() =>
        delegations.reduce((sum, del) => sum + (del.required_persons || 0), 0)
        , [delegations]);

    const daysRemaining = useMemo(() =>
        differenceInDays(parseISO(TOURNAMENT_START), new Date())
        , []);

    const volunteersGrowth = useMemo(() => {
        const yesterday = subDays(new Date(), 1);
        return volunteers.filter(v => isAfter(parseISO(v.createdAt), yesterday)).length;
    }, [volunteers]);

    const teamCountries = useMemo(() => {
        const codes = delegations.map(d => d.country_code).filter(Boolean);
        return Array.from(new Set(codes));
    }, [delegations]);

    const isLoading = volunteersLoading || adminLoading;
    const error = adminError || volunteerError;

    // Debug logging for flags
    console.log('Flag Debug:', { delegations: delegations.length, teamCountries: teamCountries.length, codes: teamCountries });

    // TODO: Connect to real data source
    const mockDeadlines = [
        { id: 1, title: 'Team Registration Close', date: '2026-06-30', status: 'OK' },
        { id: 2, title: 'Accommodation Payment', date: '2026-07-15', status: 'Warning' },
        { id: 3, title: 'Final Roster Submission', date: addDays(new Date(), 2).toISOString(), status: 'Critical' },
    ];

    const taskStats = {
        total: 124,
        overdue: 8,
        pending: 45
    };

    const volunteerTarget = 150;
    const volunteerShortage = Math.max(0, volunteerTarget - volunteers.length);

    const competitionReadiness = {
        expectedTeams: 16,
        groupsDefined: true,
        drawCompleted: false
    };

    const accommodationStats = {
        assignedPercent: 88,
        pendingAllocations: 4,
        risk: true
    };

    return (
        <div className="max-w-[1440px] mx-auto space-y-8 pb-12">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
                        Command Center
                    </h1>
                    <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em] mt-2">
                        EKC2026 • Live Project Control
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
                </div>
            </header>
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-4 h-4" />
                    <span>System Error: {error}</span>
                    <button
                        onClick={() => { loadInitialData(); fetchVolunteers(); }}
                        className="ml-auto px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* 12-Column Responsive Grid */}
            <div className="grid grid-cols-12 gap-6">

                {/* --- ROW 1: Overview & Primary KPIs --- */}

                {/* Event Overview / Welcome */}
                <GlassCard
                    className="col-span-12 lg:col-span-4 p-0 overflow-hidden flex flex-col h-full group cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/matches/draw')}
                >
                    <div className="p-6 flex-1 flex flex-col justify-between relative overflow-hidden">
                        {/* Korfby Mascot - Subdued by default, vivid on hover, vertically centered */}
                        <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 transition-all duration-700 opacity-20 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:translate-x-[-10px] pointer-events-none">
                            <img src="/korfby.jpg" alt="" className="w-40 h-40 rounded-full object-cover" />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Event Overview</h3>
                            <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight leading-tight">
                                European Korfball <br /> Championship 2026
                            </h2>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">
                                Starts: {new Date(TOURNAMENT_START).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                                <Trophy className="w-5 h-5 text-brand-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Days Remaining</p>
                                <p className="text-lg font-black text-brand-500 uppercase tracking-tight">{daysRemaining} Days</p>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* Active Events / Locations - MANUAL IMPLEMENTATION */}
                <div
                    className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col justify-between h-full group cursor-pointer overflow-hidden relative rounded-3xl transition-all duration-500 hover:scale-[1.002] hover:shadow-2xl border border-white/5"
                    style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)'
                    }}
                    onClick={() => setShowMapModal(true)}
                >
                    {/* Background Image - Absolute to the CARD */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/map-bg.png"
                            alt="Map Background"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 scale-105 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
                    </div>

                    {/* Content - Relative to sit on top */}
                    <div className="relative z-10 p-6 flex-1 flex flex-col justify-between h-full w-full">
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-white/70 mb-1">Active Locations</h3>
                                <MapPin className="w-4 h-4 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-5xl font-black text-white tracking-tighter mt-2 inline-flex items-baseline gap-1">
                                {LOCATIONS.length} <span className="text-xs text-white/70 font-bold tracking-normal uppercase">Cities</span>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/70 pt-4 border-t border-white/10">
                            <span>{LOCATIONS.join(' • ')}</span>
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">View Map</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registered Teams (Was Pending Approvals) */}
                <GlassCard
                    className="col-span-12 md:col-span-6 lg:col-span-4 p-6 border-l-2 border-l-brand-500/30 flex flex-col justify-between h-full group cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/delegations')}
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Registered Teams</h3>
                            <Shield className="w-4 h-4 text-brand-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-5xl font-black text-brand-500 tracking-tighter mt-2">
                            {adminLoading ? '...' : totalTeams}
                        </div>

                        {/* Force showing flags if data exists, regardless of loading state to fix infinite loader bug */}
                        {(teamCountries.length > 0 || !adminLoading) && (
                            <div className="mt-4">
                                {teamCountries.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {teamCountries.map((code: string) => (
                                            <img
                                                key={code}
                                                src={getFlagUrl(code, 64)}
                                                alt={code}
                                                className="w-6 h-4 rounded-sm object-cover border border-white/10 shadow-sm transition-transform hover:scale-110"
                                                title={code}
                                            />
                                        ))}
                                    </div>
                                ) : totalTeams > 0 ? (
                                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10">
                                        <AlertCircle className="w-3 h-3 text-[var(--text-muted)]" />
                                        <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Team flags pending</p>
                                    </div>
                                ) : (
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest italic opacity-40">No delegations registered</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mt-auto flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-brand-500/60 pt-4 border-t border-white/5">
                        <span>Active Delegations</span>
                        <Activity className="w-3 h-3" />
                    </div>
                </GlassCard>


                {/* --- ROW 2: System Stats --- */}

                {/* Registered Participants (Was Total Users) */}
                <GlassCard
                    className="col-span-12 md:col-span-4 lg:col-span-4 p-6 h-full cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/delegations')}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Participants</h3>
                            <div className="text-4xl font-black text-[var(--text-primary)] tracking-tighter mt-1">
                                {isLoading ? '...' : totalParticipants}
                            </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[var(--text-muted)]">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Inclusive of players & staff
                    </p>
                </GlassCard>

                {/* Volunteers KPI */}
                <GlassCard
                    className="col-span-12 md:col-span-4 lg:col-span-4 p-6 h-full cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/volunteers')}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Volunteers</h3>
                            <div className="text-4xl font-black text-brand-500 tracking-tighter mt-1">
                                {isLoading ? '...' : volunteers.length}
                            </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-500">
                            <Users className="w-5 h-5 text-glow" />
                        </div>
                    </div>
                    <p className={`mt-4 text-[10px] font-black uppercase tracking-widest ${volunteersGrowth > 0 ? 'text-emerald-500/60' : 'text-[var(--text-muted)]'}`}>
                        {volunteersGrowth > 0 ? `+${volunteersGrowth} Since yesterday` : 'Steady growth'}
                    </p>
                </GlassCard>

                {/* Alerts / Tasks */}
                <GlassCard
                    className="col-span-12 md:col-span-4 lg:col-span-4 p-6 h-full cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/tasks')}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Status Alerts</h3>
                            <div className="text-4xl font-black text-[var(--text-primary)] tracking-tighter mt-1">
                                {taskStats.overdue}
                            </div>
                        </div>
                        <div className={cn("p-3 rounded-2xl border transition-colors", taskStats.overdue > 0 ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-white/5 border-white/10 text-emerald-500")}>
                            <Bell className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        {taskStats.overdue > 0 ? `${taskStats.overdue} Tasks require immediate action` : 'All systems operational'}
                    </p>
                </GlassCard>


                {/* --- ROW 3: Operational Control --- */}

                {/* Key Deadlines */}
                <GlassCard
                    className="col-span-12 lg:col-span-6 p-0 overflow-hidden cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/tasks')}
                >
                    <div className="p-6 border-b border-white/[0.03] bg-white/[0.01] flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)] flex items-center gap-2">
                            <Clock className="w-4 h-4 text-brand-500" />
                            Key Deadlines
                        </h3>
                    </div>
                    <div className="divide-y divide-white/[0.03]">
                        {mockDeadlines.map(deadline => {
                            const days = differenceInDays(parseISO(deadline.date), new Date());
                            return (
                                <div key={deadline.id} className="p-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            deadline.status === 'Critical' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                                deadline.status === 'Warning' ? "bg-amber-500" : "bg-emerald-500"
                                        )} />
                                        <p className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">{deadline.title}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            "text-xs font-black uppercase tracking-tight",
                                            days <= 2 ? "text-red-500" : "text-[var(--text-primary)]"
                                        )}>
                                            {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} Days`}
                                        </p>
                                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
                                            {new Date(deadline.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>

                {/* Open Tasks Summary */}
                <GlassCard
                    className="col-span-12 md:col-span-6 lg:col-span-3 p-6 flex flex-col justify-between cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/tasks')}
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Open Tasks</h3>
                            <ListTodo className="w-4 h-4 text-brand-500 opacity-50" />
                        </div>
                        <div className="text-5xl font-black text-[var(--text-primary)] tracking-tighter mt-2">
                            {taskStats.total}
                        </div>
                    </div>
                    <div className="mt-8 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-red-500">Overdue</span>
                            <span className="text-red-500">{taskStats.overdue}</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500"
                                style={{ width: `${(taskStats.overdue / taskStats.total) * 100}%` }}
                            />
                        </div>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                            {taskStats.pending} pending review
                        </p>
                    </div>
                </GlassCard>

                {/* Volunteer Readiness */}
                <GlassCard
                    className="col-span-12 md:col-span-6 lg:col-span-3 p-6 flex flex-col justify-between cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/volunteers')}
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Staff Readiness</h3>
                            <ClipboardList className="w-4 h-4 text-brand-500 opacity-50" />
                        </div>
                        <div className="text-5xl font-black text-brand-500 tracking-tighter mt-2">
                            {Math.round((volunteers.length / volunteerTarget) * 100)}%
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                            <span>{volunteers.length} / {volunteerTarget}</span>
                            {volunteerShortage > 0 && <span className="text-amber-500">-{volunteerShortage}</span>}
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-brand-500 shadow-[0_0_10px_var(--color-brand-500)]"
                                style={{ width: `${(volunteers.length / volunteerTarget) * 100}%` }}
                            />
                        </div>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">
                            Recruitment phase active
                        </p>
                    </div>
                </GlassCard>

                {/* --- ROW 4: Status & Logistics --- */}

                {/* Competition Status */}
                <GlassCard
                    className="col-span-12 md:col-span-6 lg:col-span-4 p-6 cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/matches/draw')}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Competition Readiness</h3>
                        <Trophy className="w-4 h-4 text-brand-500 opacity-50" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Teams Registered</span>
                            <span className="text-xs font-black text-[var(--text-primary)] uppercase">{totalTeams} / {competitionReadiness.expectedTeams}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Groups Defined</span>
                            {competitionReadiness.groupsDefined ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Draw Completed</span>
                            {competitionReadiness.drawCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter bg-amber-500/10 px-2 py-0.5 rounded">Pending</span>
                            )}
                        </div>
                    </div>
                </GlassCard>

                {/* Accommodation Status */}
                <GlassCard
                    className="col-span-12 md:col-span-6 lg:col-span-4 p-6 cursor-pointer"
                    hoverEffect
                    onClick={() => navigate('/admin/accommodation/overview')}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Accommodation</h3>
                        <Hotel className="w-4 h-4 text-brand-500 opacity-50" />
                    </div>
                    <div>
                        <div className="flex items-end justify-between mb-2">
                            <div className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">
                                {accommodationStats.assignedPercent}%
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                    {accommodationStats.pendingAllocations} Pending
                                </p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${accommodationStats.assignedPercent}%` }}
                            />
                        </div>
                        {accommodationStats.risk && (
                            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                <AlertCircle className="w-3 h-3 text-red-500" />
                                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Unallocated delegations detected</span>
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* --- ROW 5: Latest Activity Timeline --- */}

                <GlassCard className="col-span-12 lg:col-span-4 p-0 overflow-hidden" hoverEffect>
                    <div className="p-6 border-b border-white/[0.03] bg-white/[0.01] flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)] flex items-center gap-2">
                            <Clock className="w-4 h-4 text-brand-500" />
                            Latest activity
                        </h3>
                        <button
                            className="text-[10px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-400 transition-colors"
                            onClick={() => navigate('/admin/volunteers')}
                        >
                            View All
                        </button>
                    </div>

                    <div className="divide-y divide-white/[0.03]">
                        {volunteers.length === 0 ? (
                            <div className="p-12 text-center text-[var(--text-muted)] text-xs font-medium uppercase tracking-widest italic opacity-50">
                                No activity recorded.
                            </div>
                        ) : (
                            volunteers.slice(0, 5).map(vol => (
                                <div
                                    key={vol.id}
                                    className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group cursor-pointer"
                                    onClick={() => navigate('/admin/volunteers')}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-xs font-black text-brand-500 border border-white/5 group-hover:border-brand-500/30 transition-colors">
                                            {vol.firstName[0]}{vol.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[var(--text-primary)] group-hover:text-brand-500 transition-colors">
                                                {vol.firstName} {vol.lastName}
                                            </p>
                                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
                                                New volunteer registration submitted
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-[var(--text-primary)] uppercase">
                                            {new Date(vol.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter mt-1 opacity-60">
                                            {new Date(vol.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>

            </div>

            {/* Map Modal */}
            {showMapModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowMapModal(false)}
                    />

                    {/* Map Modal Content - Custom container to ensure 100% height */}
                    <div className="w-full max-w-5xl h-[80vh] flex flex-col relative z-20 overflow-hidden glass rounded-2xl shadow-2xl bg-[#0b0f13] border border-white/10">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] z-30 relative">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                                    <MapPin className="w-4 h-4 text-brand-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">Tournament Locations Map</h3>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{LOCATIONS.join(' • ')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setShowMapModal(false);
                                        navigate('/admin/venues');
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 text-[10px] font-black uppercase tracking-widest transition-all border border-brand-500/20"
                                >
                                    Manage Venues
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                                <div className="w-px h-4 bg-white/10 mx-1" />
                                <button
                                    onClick={() => setShowMapModal(false)}
                                    className="p-2 mr-[-8px] rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 relative overflow-hidden h-full w-full">
                            <iframe
                                title="Tournament Locations"
                                src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m12!1m3!1d166708.5705353086!2d17.4819777!3d49.2608405!3m2!1i1024!2i768!4f13.1!2m1!1zUHJvc3TEm2pvdiwgT3Ryb2tvdmljZSwgWmxpbiE1eTA!5e0!3m2!1scs!2scz!4v1705600000000!5m2!1scs!2scz"
                                className="absolute inset-0 w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                            />

                            {/* Legend Overlay */}
                            <div className="absolute bottom-6 left-6 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10 space-y-3 pointer-events-none z-10">
                                {LOCATIONS.map(city => (
                                    <div key={city} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_var(--color-brand-500)]" />
                                        <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{city}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

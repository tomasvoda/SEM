import { useState, useMemo } from 'react';
import { useAdminStore } from '../../../store/adminStore';
import { GlassCard } from '../../../components/ui/GlassCard';
import { cn } from '../../../lib/utils';
import { Plus, Calendar, Users, Trash2, AlertCircle, Hotel, Info, CheckCircle2, XCircle } from 'lucide-react';
import { format, parseISO, isValid as isValidDate } from 'date-fns';
import { Link } from 'react-router-dom';
import { getFlagUrl } from '../../../lib/countryUtils';
import { AllocationFormModal } from './components/AllocationFormModal';
import { PageHeader } from '../../../components/ui/PageHeader';

export function AllocationsList() {
    const { allocations, hotels, delegations, allocationRooms, deleteAllocation } = useAdminStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle2 className="w-3 h-3" />;
            case 'cancelled': return <XCircle className="w-3 h-3" />;
            default: return <Info className="w-3 h-3" />;
        }
    };

    const missingCoverage = useMemo(() => {
        const activeDelegations = delegations.filter(d => (d.status as any) === 'submitted' || (d.status as any) === 'approved');

        return activeDelegations.map(d => {
            const teamAllocations = allocations.filter(a => a.delegation_id === d.id && a.status === 'confirmed');

            const allocatedBeds = teamAllocations.reduce((sum, alloc) => {
                const rooms = allocationRooms.filter(r => r.allocation_id === alloc.id);
                return sum + rooms.reduce((rSum, room) => rSum + (room.rooms_count * room.room_capacity), 0);
            }, 0);
            const missingPax = Math.max(0, (d.required_persons || 0) - allocatedBeds);

            const start = parseISO(d.arrival_date);
            const end = parseISO(d.departure_date);

            let missingNights = 0;
            let totalNights = 0;
            if (isValidDate(start) && isValidDate(end)) {
                totalNights = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                const coveredNights = new Set<string>();
                teamAllocations.forEach(a => {
                    const aStart = parseISO(a.date_from);
                    const aEnd = parseISO(a.date_to);
                    if (isValidDate(aStart) && isValidDate(aEnd)) {
                        for (let dt = new Date(aStart); dt < aEnd; dt.setDate(dt.getDate() + 1)) {
                            if (dt >= start && dt < end) {
                                coveredNights.add(dt.toISOString().split('T')[0]);
                            }
                        }
                    }
                });
                missingNights = totalNights - coveredNights.size;
            }

            return {
                ...d,
                missingPax,
                missingNights,
                totalNights,
                hasMissing: missingPax > 0 || missingNights > 0
            };
        }).filter(item => item.hasMissing);
    }, [delegations, allocations, allocationRooms]);

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Allocations"
                subtitle="Manage hotel capacity for delegations"
                breadcrumbs={[
                    { label: 'Event', href: '/admin/dashboard' },
                    { label: 'Allocations' }
                ]}
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Create Allocation
                    </button>
                }
            />

            {/* Missing Allocation Section */}
            {missingCoverage.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <h2 className="text-sm font-black text-amber-500 uppercase tracking-widest">Missing Allocation Coverage</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {missingCoverage.map((item) => (
                            <Link
                                key={item.id}
                                to="/admin/accommodation/allocations"
                                className="block group"
                            >
                                <GlassCard className="p-4 border-amber-500/20 bg-amber-500/5 group-hover:bg-amber-500/10 transition-all flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-8 rounded overflow-hidden border border-white/10 flex-shrink-0 shadow-sm mx-auto">
                                        <img src={getFlagUrl(item.country_code)} alt={item.team_name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight truncate">{item.team_name}</h3>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-amber-500/60" />
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                                    {format(parseISO(item.arrival_date), 'dd.MM')} – {format(parseISO(item.departure_date), 'dd.MM')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {item.missingPax > 0 && (
                                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] font-black text-amber-600 border border-amber-500/20">
                                                        {item.missingPax} PAX MISSING
                                                    </span>
                                                )}
                                                {item.missingNights > 0 && (
                                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] font-black text-amber-600 border border-amber-500/20">
                                                        {item.missingNights}/{item.totalNights} NIGHTS
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {allocations.length === 0 ? (
                <GlassCard className="p-20 text-center border-dashed border-2">
                    <Hotel className="w-20 h-20 text-[var(--text-muted)] mx-auto mb-6 opacity-10" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">No Allocations Found</h3>
                    <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8 font-medium">
                        Start by creating your first allocation to link a delegation with a hotel and reserve rooms.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-brand-500/20"
                    >
                        Add First Allocation
                    </button>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {allocations.filter(a => a.status !== 'cancelled').map((allocation) => {
                        const hotel = hotels.find(h => h.id === allocation.hotel_id);
                        const delegation = delegations.find(d => d.id === allocation.delegation_id);
                        const rooms = allocationRooms.filter(r => r.allocation_id === allocation.id);
                        const totalRooms = rooms.reduce((acc, r) => acc + r.rooms_count, 0);

                        return (
                            <Link
                                key={allocation.id}
                                to={`/admin/accommodation/allocations/${allocation.id}`}
                                className="block group relative"
                            >
                                <GlassCard className="p-4 hover:border-brand-500/50 transition-all flex items-center gap-6 text-left relative overflow-hidden">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-center">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-500/80">Delegation</p>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                                <span className="font-bold text-[var(--text-primary)] text-sm">{delegation?.team_name || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-500/80">Hotel</p>
                                            <div className="flex items-center gap-2">
                                                <Hotel className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                                <span className="font-bold text-[var(--text-primary)] text-sm">{hotel?.name || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-500/80">Period</p>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                                    <span className="font-bold text-[var(--text-primary)] text-sm">
                                                        {format(parseISO(allocation.date_from), 'dd MMM')} – {format(parseISO(allocation.date_to), 'dd MMM')}
                                                    </span>
                                                    <span className="ml-2 px-1.5 py-0.5 rounded bg-[var(--app-bg)] border border-[var(--glass-border)] text-[9px] font-black uppercase text-[var(--text-secondary)]">
                                                        {totalRooms} rooms
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit",
                                                getStatusStyle(allocation.status)
                                            )}>
                                                {getStatusIcon(allocation.status)}
                                                {allocation.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pl-4 border-l border-[var(--glass-border)]/50 h-8 flex items-center">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (confirm('Are you sure you want to delete this allocation?')) {
                                                    deleteAllocation(allocation.id);
                                                }
                                            }}
                                            className="w-8 h-8 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500/70 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                                            title="Delete Allocation"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </GlassCard>
                            </Link>
                        );
                    })}
                </div>
            )}

            <AllocationFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

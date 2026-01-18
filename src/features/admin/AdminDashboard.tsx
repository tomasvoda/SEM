import { useEffect } from 'react';
import { useVolunteerStore } from '../../store/volunteerStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { Users, Clock } from 'lucide-react';

export function AdminDashboard() {
    const { volunteers, fetchVolunteers, isLoading } = useVolunteerStore();

    useEffect(() => {
        fetchVolunteers();
    }, [fetchVolunteers]);

    const totalVolunteers = volunteers.length;
    const latestVolunteers = volunteers.slice(0, 5); // Show last 5

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Admin Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Korfby Mascot Card */}
                <GlassCard className="lg:col-span-1 p-8 flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 group-hover:from-brand-500/10 transition-all duration-500" />

                    <div className="relative z-10">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 p-2 shadow-2xl shadow-brand-500/20 group-hover:scale-105 transition-transform duration-500">
                            <img
                                src="/korfby.jpg"
                                alt="Korfby Mascot"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <h2 className="text-xl font-black text-[var(--text-primary)] mb-2">Welcome back!</h2>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                            Korfby is ready to help you manage the European Korfball Championship 2026.
                        </p>
                    </div>
                </GlassCard>

                {/* 2. Volunteer Stats Card */}
                <GlassCard className="lg:col-span-2 p-0 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-[var(--glass-border)] flex justify-between items-center bg-[var(--glass-surface)]/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">Volunteers</h3>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Real-time overview</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-[var(--text-primary)] tracking-tight block leading-none">
                                {isLoading ? '...' : totalVolunteers}
                            </span>
                            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Total Registered</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[300px] p-4 space-y-2 custom-scrollbar">
                        <h4 className="px-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 opacity-60">Latest Registrations</h4>

                        {latestVolunteers.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-muted)] text-xs font-medium italic">
                                No volunteers registered yet.
                            </div>
                        ) : (
                            latestVolunteers.map(vol => (
                                <div key={vol.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--glass-surface)]/30 border border-white/5 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-[10px] font-black text-white">
                                            {vol.firstName[0]}{vol.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[var(--text-primary)]">{vol.firstName} {vol.lastName}</p>
                                            <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(vol.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${vol.registrationStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                        vol.registrationStatus === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        }`}>
                                        {vol.registrationStatus}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>

                {/* 3. Placeholder Stat Card (Legacy - kept for grid balance if needed, or remove) */}
                {/* For now, just these two major blocks requested by user */}
            </div>
        </div>
    );
}

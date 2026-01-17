import { useState, useMemo } from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { PageHeader } from '../../../components/ui/PageHeader';
import {
    Users,
    Plus,
    Save,
    Trash2,
    Mail,
    User,
    Camera,
    Search
} from 'lucide-react';
import { useMatchStore, type Participant } from '../../../store/matchStore';
import { cn } from '../../../lib/utils';
import { getFlagUrl } from '../../../lib/countryUtils';

export default function TeamRostersPage() {
    const {
        teamAssignments,
        participants,
        addParticipant,
        updateParticipant,
        deleteParticipant,
        getResolvedTeamName,
        getResolvedTeamCode
    } = useMatchStore();

    const [selectedTeamLabel, setSelectedTeamLabel] = useState<string | null>(null);
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const allTeamLabels = Object.keys(teamAssignments);

    const filteredTeams = useMemo(() => {
        if (!searchQuery) return allTeamLabels;
        const q = searchQuery.toLowerCase();
        return allTeamLabels.filter(label =>
            label.toLowerCase().includes(q) ||
            getResolvedTeamName(label).toLowerCase().includes(q) ||
            getResolvedTeamCode(label).toLowerCase().includes(q)
        );
    }, [allTeamLabels, searchQuery, getResolvedTeamName, getResolvedTeamCode]);

    const teamParticipants = useMemo(() => {
        if (!selectedTeamLabel) return [];
        return participants.filter(p => p.teamLabel === selectedTeamLabel);
    }, [participants, selectedTeamLabel]);

    const handleSave = (participant: Participant) => {
        if (isAdding) {
            addParticipant(participant);
            setIsAdding(false);
        } else {
            updateParticipant(participant);
        }
        setEditingParticipant(null);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Team Rosters"
                subtitle="Review and validate participating player lists"
                breadcrumbs={[
                    { label: 'Admin', href: '/admin/dashboard' },
                    { label: 'Rosters' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Team Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <GlassCard className="p-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search teams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                            />
                        </div>
                        <div className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {filteredTeams.map((label) => {
                                const name = getResolvedTeamName(label);
                                const code = getResolvedTeamCode(label);
                                const count = participants.filter(p => p.teamLabel === label).length;
                                return (
                                    <button
                                        key={label}
                                        onClick={() => setSelectedTeamLabel(label)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-xl transition-all border group flex items-center justify-between",
                                            selectedTeamLabel === label
                                                ? "bg-brand-500 border-brand-400 text-white shadow-lg shadow-brand-500/20"
                                                : "border-transparent hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-5 rounded overflow-hidden border border-white/10 flex-shrink-0">
                                                <img src={getFlagUrl(code)} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{code}</div>
                                                <div className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider truncate max-w-[100px]">{name}</div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black opacity-40">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>

                {/* Roster & Form Area */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedTeamLabel ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Roster List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">
                                        Roster: {getResolvedTeamCode(selectedTeamLabel)}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            const newP: Participant = {
                                                id: Math.random().toString(36).substr(2, 9),
                                                teamLabel: selectedTeamLabel,
                                                firstName: '',
                                                lastName: '',
                                                email: '',
                                                role: 'player'
                                            };
                                            setEditingParticipant(newP);
                                            setIsAdding(true);
                                        }}
                                        className="p-2 hover:bg-brand-500/10 rounded-xl text-brand-500 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Add Member</span>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {teamParticipants.map((p) => (
                                        <GlassCard
                                            key={p.id}
                                            className={cn(
                                                "p-4 transition-all border",
                                                editingParticipant?.id === p.id ? "border-brand-500 bg-brand-500/5" : "border-white/5"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                                        {p.photoUrl ? (
                                                            <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-5 h-5 text-white/20" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-[var(--text-primary)] uppercase tracking-tight">
                                                            {p.firstName} {p.lastName}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[8px] font-black text-brand-500 uppercase tracking-[0.2em]">
                                                                {p.role}
                                                            </span>
                                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                                            <span className="text-[10px] text-[var(--text-muted)]">{p.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setEditingParticipant(p);
                                                            setIsAdding(false);
                                                        }}
                                                        className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteParticipant(p.id)}
                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    ))}
                                    {teamParticipants.length === 0 && (
                                        <div className="py-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center text-center">
                                            <Users className="w-12 h-12 text-white/5 mb-4" />
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No members registered for this team yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Participant Form */}
                            <div>
                                {editingParticipant ? (
                                    <GlassCard className="p-6 sticky top-6">
                                        <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest mb-8 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(var(--brand-500-rgb),0.5)]" />
                                            {isAdding ? 'New Team Member' : 'Edit Member Details'}
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="flex justify-center mb-8">
                                                <div className="relative group">
                                                    <div className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group-hover:border-brand-500/50 transition-colors">
                                                        {editingParticipant.photoUrl ? (
                                                            <img src={editingParticipant.photoUrl} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <>
                                                                <Camera className="w-6 h-6 text-white/10 group-hover:text-brand-500/50 transition-colors" />
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-white/5 mt-2">Upload Photo</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Photo URL"
                                                        value={editingParticipant.photoUrl || ''}
                                                        onChange={(e) => setEditingParticipant({ ...editingParticipant, photoUrl: e.target.value })}
                                                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 bg-[var(--background-card)] border border-white/10 rounded-lg px-2 py-1 text-[8px] text-white outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1.5 block">First Name</label>
                                                    <input
                                                        type="text"
                                                        value={editingParticipant.firstName}
                                                        onChange={(e) => setEditingParticipant({ ...editingParticipant, firstName: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                                                        placeholder="e.g. John"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1.5 block">Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={editingParticipant.lastName}
                                                        onChange={(e) => setEditingParticipant({ ...editingParticipant, lastName: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                                                        placeholder="e.g. Doe"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1.5 block">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                                                    <input
                                                        type="email"
                                                        value={editingParticipant.email}
                                                        onChange={(e) => setEditingParticipant({ ...editingParticipant, email: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-brand-500/50"
                                                        placeholder="john.doe@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1.5 block">Role</label>
                                                <div className="flex gap-2">
                                                    {['player', 'coach', 'staff'].map((role) => (
                                                        <button
                                                            key={role}
                                                            onClick={() => setEditingParticipant({ ...editingParticipant, role: role as any })}
                                                            className={cn(
                                                                "flex-1 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                                                editingParticipant.role === role
                                                                    ? "bg-brand-500/10 border-brand-500 text-brand-500"
                                                                    : "bg-white/5 border-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                                            )}
                                                        >
                                                            {role}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 pt-6">
                                                <button
                                                    onClick={() => {
                                                        setEditingParticipant(null);
                                                        setIsAdding(false);
                                                    }}
                                                    className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSave(editingParticipant)}
                                                    className="flex-[2] bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                                                >
                                                    <Save className="w-4 h-4" /> Save Details
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ) : (
                                    <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center text-center justify-center h-full min-h-[400px]">
                                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                                            <User className="w-8 h-8 text-white/10" />
                                        </div>
                                        <h3 className="text-sm font-black text-white/20 uppercase tracking-[0.2em] mb-2">Member Details</h3>
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest max-w-[200px]">
                                            Select a team member to edit their info or add a new one to the roster
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-12 min-h-[600px]">
                            <Users className="w-20 h-20 text-white/5 mb-8" />
                            <h3 className="text-xl font-black text-white/20 uppercase tracking-[0.2em] mb-4">Select a team to manage rosters</h3>
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest max-w-sm">
                                Choose a team from the list on the left to start collecting participant data for online registrations
                            </p>
                            <div className="flex gap-4 mt-12 opacity-20">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10" />
                                        <div className="w-8 h-2 bg-white/10 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

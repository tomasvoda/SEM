import { useState, useMemo, useRef, useEffect } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { PageHeader } from '../../components/ui/PageHeader';
import {
    Calendar, User, CheckCircle2,
    Clock, AlertCircle, Search, Filter,
    Plus, Pencil, Trash2, ChevronDown, Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTaskStore } from '../../store/taskStore';
import type { Task, TaskStatus } from '../../store/taskStore';
import { format, isAfter, parseISO } from 'date-fns';

export function TasksPage() {
    const { tasks, deleteTask, addTask, updateTask } = useTaskStore();
    const [search, setSearch] = useState('');
    const [statusFilters, setStatusFilters] = useState<TaskStatus[]>([]);
    const [respFilters, setRespFilters] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const responsibilities = useMemo(() =>
        Array.from(new Set(tasks.map(t => t.responsibility))),
        [tasks]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.responsibility.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilters.length === 0 || statusFilters.includes(t.status);
            const matchesResp = respFilters.length === 0 || respFilters.includes(t.responsibility);
            return matchesSearch && matchesStatus && matchesResp;
        }).sort((a, b) => a.nr - b.nr);
    }, [tasks, search, statusFilters, respFilters]);

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'updatedAt'>) => {
        if (editingTask) {
            updateTask(editingTask.id, taskData);
        } else {
            addTask(taskData);
        }
        setIsModalOpen(false);
        setEditingTask(null);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Event Tasks"
                subtitle="Deliverables and actions from IKF Agreement"
                breadcrumbs={[
                    { label: 'Event', href: '/admin/dashboard' },
                    { label: 'Tasks' }
                ]}
                actions={
                    <button
                        onClick={() => {
                            setEditingTask(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:scale-105 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </button>
                }
            />

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search tasks or responsibility..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                </div>
                <MultiSelect
                    label="Status"
                    icon={Filter}
                    options={[
                        { label: 'Completed', value: 'completed' },
                        { label: 'In Progress', value: 'pending' },
                        { label: 'Planned', value: 'planned' },
                        { label: 'Overdue', value: 'overdue' }
                    ]}
                    selected={statusFilters}
                    onChange={(vals) => setStatusFilters(vals as TaskStatus[])}
                />
                <MultiSelect
                    label="Responsibility"
                    icon={User}
                    options={responsibilities.map(r => ({ label: r, value: r }))}
                    selected={respFilters}
                    onChange={setRespFilters}
                />
            </div>

            <GlassCard className="overflow-hidden border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest w-16">No.</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Deliverable / Action</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Responsibility</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest w-40">Deadline</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest w-32">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest w-20 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredTasks.map((item) => {
                                const isOverdue = item.status !== 'completed' && isAfter(new Date(), parseISO(item.deadline));

                                return (
                                    <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                                                {item.nr.toString().padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs font-black text-[var(--text-primary)] leading-relaxed max-w-xl group-hover:text-brand-300 transition-colors [text-shadow:0_0_20px_rgba(0,0,0,0.1)]">
                                                    {item.title}
                                                </p>
                                                {isOverdue && (
                                                    <div className="flex items-center gap-1 text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                                                        <AlertCircle className="w-2.5 h-2.5" />
                                                        Deadline missed
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-500/30 transition-colors">
                                                    <User className="w-2.5 h-2.5 text-brand-500" />
                                                </div>
                                                <span className="text-[10px] font-bold text-[var(--text-muted)] dark:text-slate-400 group-hover:text-[var(--text-primary)] transition-colors">
                                                    {item.responsibility}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "flex items-center gap-2 text-[10px] uppercase tracking-tighter font-black transition-colors",
                                                isOverdue ? "text-red-400" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                                            )}>
                                                <Calendar className="w-3 h-3 opacity-40" />
                                                <span>{format(parseISO(item.deadline), 'dd.MM.yyyy')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusDropdown
                                                status={item.status}
                                                onChange={(newStatus) => updateTask(item.id, { status: newStatus })}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingTask(item);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteTask(item.id)}
                                                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {isModalOpen && (
                <TaskEditModal
                    task={editingTask}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTask}
                    nextNr={tasks.length + 1}
                />
            )}
        </div>
    );
}

function TaskEditModal({ task, onClose, onSave, nextNr }: {
    task: Task | null;
    onClose: () => void;
    onSave: (data: Omit<Task, 'id' | 'updatedAt'>) => void;
    nextNr: number;
}) {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        responsibility: task?.responsibility || '',
        deadline: task?.deadline || format(new Date(), 'yyyy-MM-dd'),
        status: task?.status || 'planned' as TaskStatus,
        nr: task?.nr || nextNr
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
            <GlassCard className="w-full max-w-lg relative z-10 border-white/10 shadow-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{task ? 'Edit Task' : 'New Task'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
                        <Plus className="w-4 h-4 rotate-45" />
                    </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => {
                    e.preventDefault();
                    onSave(formData);
                }}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                        <textarea
                            required
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50 min-h-[100px]"
                            placeholder="Describe the deliverable..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Responsibility</label>
                            <input
                                required
                                value={formData.responsibility}
                                onChange={(e) => setFormData(prev => ({ ...prev, responsibility: e.target.value }))}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50"
                                placeholder="e.g. IKF, LOC..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                            <input
                                type="date"
                                required
                                value={formData.deadline}
                                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500/50 appearance-none"
                        >
                            <option value="planned">Planned</option>
                            <option value="pending">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-white/5 text-white/60 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-2 px-8 py-3 bg-brand-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all">
                            {task ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
}

function StatusDropdown({ status, onChange }: { status: TaskStatus, onChange: (s: TaskStatus) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const statuses: { value: TaskStatus; label: string; icon: any; color: string }[] = [
        { value: 'planned', label: 'Planned', icon: AlertCircle, color: 'text-blue-400' },
        { value: 'pending', label: 'In Progress', icon: Clock, color: 'text-amber-400' },
        { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' },
        { value: 'overdue', label: 'Overdue', icon: AlertCircle, color: 'text-red-400' },
    ];

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="hover:scale-105 active:scale-95 transition-transform outline-none"
            >
                <StatusBadge status={status} />
            </button>

            {isOpen && (
                <GlassCard className="absolute top-full left-0 mt-2 z-50 w-48 p-2 border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex flex-col gap-1">
                        {statuses.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => {
                                    onChange(s.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors",
                                    status === s.value ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <s.icon className={cn("w-3 h-3", s.color)} />
                                    {s.label}
                                </div>
                                {status === s.value && <Check className="w-3 h-3 text-brand-500" />}
                            </button>
                        ))}
                    </div>
                </GlassCard>
            )}
        </div>
    );
}

function MultiSelect({ label, icon: Icon, options, selected, onChange }: {
    label: string,
    icon: any,
    options: { label: string, value: string }[],
    selected: string[],
    onChange: (vals: string[]) => void
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-xs transition-all",
                    isOpen ? "border-brand-500/50 bg-white/10" : "border-white/10 hover:border-white/20",
                    selected.length > 0 ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                )}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <span className="truncate">
                        {selected.length === 0 ? `All ${label}s` : `${label}: ${selected.length} selected`}
                    </span>
                </div>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 opacity-40", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <GlassCard className="absolute top-full left-0 right-0 mt-2 z-50 p-2 border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => onChange([])}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors",
                                selected.length === 0 ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            All {label}s
                        </button>
                        <div className="h-px bg-white/5 my-1" />
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => toggleOption(opt.value)}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors text-left",
                                    selected.includes(opt.value) ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <span className="truncate mr-2">{opt.label}</span>
                                {selected.includes(opt.value) && <Check className="w-3 h-3 text-brand-500 flex-shrink-0" />}
                            </button>
                        ))}
                    </div>
                </GlassCard>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: TaskStatus }) {
    const configs = {
        completed: { icon: CheckCircle2, text: 'Completed', class: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]' },
        pending: { icon: Clock, text: 'In Progress', class: 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]' },
        planned: { icon: AlertCircle, text: 'Planned', class: 'text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.1)]' },
        overdue: { icon: AlertCircle, text: 'Overdue', class: 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_15px_rgba(248,113,113,0.1)] font-bold' },
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
            config.class
        )}>
            <Icon className="w-2.5 h-2.5" />
            {config.text}
        </div>
    );
}

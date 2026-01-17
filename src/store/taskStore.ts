import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'completed' | 'pending' | 'planned' | 'overdue';

export interface Task {
    id: string;
    nr: number;
    title: string;
    responsibility: string;
    deadline: string;
    status: TaskStatus;
    updatedAt: string;
}

interface TaskState {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'updatedAt'>) => void;
    updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'nr'>>) => void;
    deleteTask: (id: string) => void;
    toggleStatus: (id: string) => void;
}

const initialTasks: Task[] = [
    { id: '1', nr: 1, title: "Contract signature - Agreement enters into force", responsibility: "IKF & Organiser", deadline: "2026-01-12", status: "completed", updatedAt: new Date().toISOString() },
    { id: '2', nr: 2, title: "Submission of official Event Logo for approval", responsibility: "Organiser", deadline: "2026-01-30", status: "pending", updatedAt: new Date().toISOString() },
    { id: '3', nr: 3, title: "Submission of team participation package offers (pricing proposal)", responsibility: "Organiser", deadline: "2026-01-30", status: "pending", updatedAt: new Date().toISOString() },
    { id: '4', nr: 4, title: "Confirmation of Local Organising Committee (LOC) structure and members", responsibility: "Organiser", deadline: "2026-01-10", status: "completed", updatedAt: new Date().toISOString() },
    { id: '5', nr: 5, title: "Submission of operational documents: Operational Plan, Venue Plan, Medical & Anti-Doping Plan, Marketing/Media Plan, Risk & Contingency Plan, Transport Schedule, Sponsoring Plan", responsibility: "Organiser", deadline: "2026-02-10", status: "pending", updatedAt: new Date().toISOString() },
    { id: '6', nr: 6, title: "Confirmation of participating teams", responsibility: "IKF", deadline: "2026-04-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '7', nr: 7, title: "First IKF supervision visit / venue inspection", responsibility: "Joint (IKF & Organiser)", deadline: "2026-04-01", status: "planned", updatedAt: new Date().toISOString() },
    { id: '8', nr: 8, title: "Submission of complete Medical Plan for approval", responsibility: "Organiser", deadline: "2026-05-11", status: "planned", updatedAt: new Date().toISOString() },
    { id: '9', nr: 9, title: "Confirmation of cooperation with NADO and Anti-Doping Education Programme", responsibility: "Organiser", deadline: "2026-07-10", status: "planned", updatedAt: new Date().toISOString() },
    { id: '10', nr: 10, title: "Confirmation of spectator ticket allocation for foreign supporters", responsibility: "IKF & Organiser", deadline: "2026-03-04", status: "planned", updatedAt: new Date().toISOString() },
    { id: '11', nr: 11, title: "Final approval of competition venues", responsibility: "IKF", deadline: "2026-08-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '12', nr: 12, title: "Final Playing Schedule approved and published", responsibility: "IKF", deadline: "2026-08-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '13', nr: 13, title: "Preliminary list of IKF Officials (Referees & Jury)", responsibility: "IKF", deadline: "2026-08-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '14', nr: 14, title: "Branding Plan submitted for approval", responsibility: "Organiser", deadline: "2026-09-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '15', nr: 15, title: "Proof of Insurance submitted (Public Liability & Event Cancellation)", responsibility: "Organiser", deadline: "2026-09-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '16', nr: 16, title: "Full Logistics Plan (Accommodation, Meals, Transport) submitted for review", responsibility: "Organiser", deadline: "2026-09-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '17', nr: 17, title: "Final list of IKF Officials & Room Allocations confirmed", responsibility: "IKF & Organiser", deadline: "2026-09-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '18', nr: 18, title: "Internet test and livestream technical verification completed", responsibility: "Organiser", deadline: "2026-09-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '19', nr: 19, title: "Submission of video equipment list and technical setup plan", responsibility: "Organiser", deadline: "2026-09-08", status: "planned", updatedAt: new Date().toISOString() },
    { id: '20', nr: 20, title: "Final IKF supervision visit / pre-event inspection", responsibility: "Joint (IKF & Organiser)", deadline: "2026-09-15", status: "planned", updatedAt: new Date().toISOString() },
    { id: '21', nr: 21, title: "Confirmation of trained volunteers and staff", responsibility: "Organiser", deadline: "2026-09-22", status: "planned", updatedAt: new Date().toISOString() },
];

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: initialTasks,

            addTask: (taskData) => set((state) => ({
                tasks: [
                    ...state.tasks,
                    {
                        ...taskData,
                        id: Math.random().toString(36).substr(2, 9),
                        updatedAt: new Date().toISOString()
                    }
                ]
            })),

            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
                )
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id)
            })),

            toggleStatus: (id) => set((state) => {
                const statusCycle: TaskStatus[] = ['planned', 'pending', 'completed', 'overdue'];
                return {
                    tasks: state.tasks.map((t) => {
                        if (t.id === id) {
                            const currentIndex = statusCycle.indexOf(t.status);
                            const nextIndex = (currentIndex + 1) % statusCycle.length;
                            return { ...t, status: statusCycle[nextIndex], updatedAt: new Date().toISOString() };
                        }
                        return t;
                    })
                };
            }),
        }),
        {
            name: 'task-storage',
        }
    )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Match {
    nr?: string | number;
    time: string;
    team1?: string;
    team2?: string;
    venue?: string;
    type: 'match' | 'ceremony' | 'free-day';
    label?: string;
    group?: string;
    score1?: number;
    score2?: number;
    scorers?: {
        team: string; // label (e.g. 'A1')
        player: string;
        minute: number;
    }[];
}

export interface DailyAvailability {
    date: string;
    openingHours: string;
    trainingHours: string;
    note?: string;
}

export interface Venue {
    id: string;
    name: string;
    address: string;
    availableFrom: string;
    availableTo: string;
    dailySchedule: DailyAvailability[];
}

export interface Participant {
    id: string;
    teamLabel: string; // e.g. 'A1'
    firstName: string;
    lastName: string;
    email: string;
    photoUrl?: string;
    role: 'player' | 'coach' | 'staff';
}

export interface DaySchedule {
    date: string;
    note?: string;
    matches: Match[];
}

export interface GroupConfig {
    name: string;
    venue: string;
    teams: string[]; // These are labels like A1, A2
}

interface TeamAssignment {
    name: string;
    code: string;
}

interface MatchState {
    teamAssignments: Record<string, TeamAssignment>; // label -> {name, code}
    favoriteTeams: string[];
    schedule: DaySchedule[];
    groups: GroupConfig[];
    venues: Venue[];
    participants: Participant[];

    // Actions
    setTeamAssignment: (label: string, name: string, code: string) => void;
    toggleFavorite: (teamName: string) => void;
    isFavorite: (teamName: string) => boolean;
    getResolvedTeamName: (label: string) => string;
    getResolvedTeamCode: (label: string) => string;
    updateMatchResult: (matchNr: string | number, score1: number, score2: number, scorers?: Match['scorers']) => void;
    updateVenue: (venue: Venue) => void;
    addVenue: (venue: Venue) => void;
    deleteVenue: (venueId: string) => void;

    // Participant Actions
    updateParticipant: (participant: Participant) => void;
    addParticipant: (participant: Participant) => void;
    deleteParticipant: (participantId: string) => void;
    getParticipantsForTeam: (teamLabel: string) => Participant[];
}

const INITIAL_GROUPS: GroupConfig[] = [
    { name: 'Group A', venue: 'Prostějov', teams: ['A1', 'A2', 'A3', 'A4'] },
    { name: 'Group B', venue: 'Otrokovice', teams: ['B1', 'B2', 'B3', 'B4'] },
    { name: 'Group C', venue: 'Prostějov', teams: ['C1', 'C2', 'C3', 'C4'] },
    { name: 'Group D', venue: 'Otrokovice', teams: ['D1', 'D2', 'D3', 'D4'] },
];

const INITIAL_SCHEDULE: DaySchedule[] = [
    {
        date: '16. 10 2026',
        matches: [
            { nr: 1, time: '14:00', team1: 'A2', team2: 'A4', venue: 'Prostějov', label: 'Groups', group: 'A', type: 'match' },
            { nr: 2, time: '15:45', team1: 'A1', team2: 'A3', venue: 'Prostějov', label: 'Groups', group: 'A', type: 'match' },
            { nr: 3, time: '17:30', team1: 'D2', team2: 'D4', venue: 'Prostějov', label: 'Groups', group: 'D', type: 'match' },
            { time: '19:00', label: 'Opening Ceremony', type: 'ceremony', venue: 'Prostějov' },
            { nr: 4, time: '19:40', team1: 'D1', team2: 'D3', venue: 'Prostějov', label: 'Groups', group: 'D', type: 'match' },
            { nr: 5, time: '14:00', team1: 'B2', team2: 'B4', venue: 'Otrokovice', label: 'Groups', group: 'B', type: 'match' },
            { nr: 6, time: '15:45', team1: 'B1', team2: 'B3', venue: 'Otrokovice', label: 'Groups', group: 'B', type: 'match' },
            { nr: 7, time: '17:30', team1: 'C2', team2: 'C4', venue: 'Otrokovice', label: 'Groups', group: 'C', type: 'match' },
            { time: '19:00', label: 'Opening Ceremony', type: 'ceremony', venue: 'Otrokovice' },
            { nr: 8, time: '19:40', team1: 'C1', team2: 'C3', venue: 'Otrokovice', label: 'Groups', group: 'C', type: 'match' },
        ]
    },
    {
        date: '17. 10 2026',
        matches: [
            { nr: 9, time: '14:00', team1: 'A3', team2: 'A4', venue: 'Prostějov', label: 'Groups', group: 'A', type: 'match' },
            { nr: 10, time: '15:45', team1: 'A1', team2: 'A2', venue: 'Prostějov', label: 'Groups', group: 'A', type: 'match' },
            { nr: 11, time: '17:30', team1: 'D3', team2: 'D4', venue: 'Prostějov', label: 'Groups', group: 'D', type: 'match' },
            { nr: 12, time: '19:15', team1: 'D1', team2: 'D2', venue: 'Prostějov', label: 'Groups', group: 'D', type: 'match' },
            { nr: 13, time: '14:00', team1: 'B3', team2: 'B4', venue: 'Otrokovice', label: 'Groups', group: 'B', type: 'match' },
            { nr: 14, time: '15:45', team1: 'B1', team2: 'B2', venue: 'Otrokovice', label: 'Groups', group: 'B', type: 'match' },
            { nr: 15, time: '17:30', team1: 'C3', team2: 'C4', venue: 'Otrokovice', label: 'Groups', group: 'C', type: 'match' },
            { nr: 16, time: '19:15', team1: 'C1', team2: 'C2', venue: 'Otrokovice', label: 'Groups', group: 'C', type: 'match' },
        ]
    },
    {
        date: '18. 10 2026',
        matches: [
            { nr: 17, time: '14:00', team1: 'A2', team2: 'A3', venue: 'Prostějov', label: 'Groups', group: 'A', type: 'match' },
            { nr: 18, time: '15:45', team1: 'A4', team2: 'A1', venue: 'Prostějov', label: 'Groups', group: 'A', type: 'match' },
            { nr: 19, time: '17:30', team1: 'D2', team2: 'D3', venue: 'Prostějov', label: 'Groups', group: 'D', type: 'match' },
            { nr: 20, time: '19:15', team1: 'D4', team2: 'D1', venue: 'Prostějov', label: 'Groups', group: 'D', type: 'match' },
            { nr: 21, time: '14:00', team1: 'B2', team2: 'B3', venue: 'Otrokovice', label: 'Groups', group: 'B', type: 'match' },
            { nr: 22, time: '15:45', team1: 'B4', team2: 'B1', venue: 'Otrokovice', label: 'Groups', group: 'B', type: 'match' },
            { nr: 23, time: '17:30', team1: 'C2', team2: 'C3', venue: 'Otrokovice', label: 'Groups', group: 'C', type: 'match' },
            { nr: 24, time: '19:15', team1: 'C4', team2: 'C1', venue: 'Otrokovice', label: 'Groups', group: 'C', type: 'match' },
        ]
    },
    {
        date: '19. 10 2026',
        note: 'Rest Day',
        matches: [
            { time: 'All Day', label: 'Free Day', type: 'free-day' },
        ]
    },
    {
        date: '20. 10 2026',
        matches: [
            { nr: 25, time: '14:00', team1: '3A', team2: '4D', venue: 'Prostějov', label: 'Semifinals', type: 'match' },
            { nr: 26, time: '15:45', team1: '3D', team2: '4A', venue: 'Prostějov', label: 'Semifinals', type: 'match' },
            { nr: 27, time: '17:30', team1: '1A', team2: '2D', venue: 'Prostějov', label: 'Semifinals', type: 'match' },
            { nr: 28, time: '19:15', team1: '1D', team2: '2A', venue: 'Prostějov', label: 'Semifinals', type: 'match' },
            { nr: 29, time: '14:00', team1: '3B', team2: '4C', venue: 'Otrokovice', label: 'Semifinals', type: 'match' },
            { nr: 30, time: '15:45', team1: '3C', team2: '4B', venue: 'Otrokovice', label: 'Semifinals', type: 'match' },
            { nr: 31, time: '17:30', team1: '1B', team2: '2C', venue: 'Otrokovice', label: 'Semifinals', type: 'match' },
            { nr: 32, time: '19:15', team1: '1C', team2: '2B', venue: 'Otrokovice', label: 'Semifinals', type: 'match' },
        ]
    },
    {
        date: '21. 10 2026',
        matches: [
            { nr: 33, time: '14:00', team1: '3A', team2: '3D', venue: 'Prostějov', label: 'Placement', type: 'match' },
            { nr: 34, time: '15:45', team1: '4A', team2: '4D', venue: 'Prostějov', label: 'Placement', type: 'match' },
            { nr: 35, time: '17:30', team1: '1A', team2: '1D', venue: 'Prostějov', label: 'Placement', type: 'match' },
            { nr: 36, time: '19:15', team1: '2A', team2: '2D', venue: 'Prostějov', label: 'Placement', type: 'match' },
            { nr: 37, time: '14:00', team1: '3B', team2: '3C', venue: 'Otrokovice', label: 'Placement', type: 'match' },
            { nr: 38, time: '15:45', team1: '4B', team2: '4C', venue: 'Otrokovice', label: 'Placement', type: 'match' },
            { nr: 39, time: '17:30', team1: '1B', team2: '1C', venue: 'Otrokovice', label: 'Placement', type: 'match' },
            { nr: 40, time: '19:15', team1: '2B', team2: '2C', venue: 'Otrokovice', label: 'Placement', type: 'match' },
        ]
    },
    {
        date: '22. 10 2026',
        matches: [
            { nr: 41, time: '9:30', team1: 'Nr. 3G', team2: 'Nr. 4H', venue: 'Zlín', label: 'Finals Phase', type: 'match' },
            { nr: 42, time: '11:05', team1: 'Nr. 3H', team2: 'Nr. 4G', venue: 'Zlín', label: 'Finals Phase', type: 'match' },
            { nr: 43, time: '12:40', team1: 'Nr. 3E', team2: 'Nr. 4F', venue: 'Zlín', label: 'Finals Phase', type: 'match' },
            { nr: 44, time: '14:15', team1: 'Nr. 3F', team2: 'Nr. 4E', venue: 'Zlín', label: 'Finals Phase', type: 'match' },
            { nr: 45, time: '15:50', team1: 'Nr. 1G', team2: 'Nr. 2H', venue: 'Zlín', label: 'Finals Phase', type: 'match' },
            { nr: 46, time: '17:25', team1: 'Nr. 1H', team2: 'Nr. 2G', venue: 'Zlín', label: 'Finals Phase', type: 'match' },
            { nr: 47, time: '19:00', team1: 'Nr. 1E', team2: 'Nr. 2F', venue: 'Zlín', label: 'Finals Phase', type: 'match' },
            { nr: 48, time: '20:35', team1: 'Nr. 1F', team2: 'Nr. 2E', venue: 'Zlín', label: 'Finals Phase', type: 'match' },
        ]
    },
    {
        date: '23. 10 2026',
        matches: [
            { nr: 49, time: '14:00', team1: 'Loser 41', team2: 'Loser 42', venue: 'Zlín', label: '15th/16th', type: 'match' },
            { nr: 50, time: '15:45', team1: 'Winner 41', team2: 'Winner 42', venue: 'Zlín', label: '13th/14th', type: 'match' },
            { nr: 51, time: '17:30', team1: 'Loser 43', team2: 'Loser 44', venue: 'Zlín', label: '11th/12th', type: 'match' },
            { nr: 52, time: '19:15', team1: 'Winner 43', team2: 'Winner 44', venue: 'Zlín', label: '9th/10th', type: 'match' },
        ]
    },
    {
        date: '24. 10 2026',
        matches: [
            { nr: 53, time: '10:00', team1: 'Loser 45', team2: 'Loser 46', venue: 'Zlín', label: '7th/8th', type: 'match' },
            { nr: 54, time: '11:45', team1: 'Winner 45', team2: 'Winner 46', venue: 'Zlín', label: '5th/6th', type: 'match' },
            { nr: 55, time: '13:30', team1: 'Loser 47', team2: 'Loser 48', venue: 'Zlín', label: '3rd/4th', type: 'match' },
            { nr: 56, time: '15:15', team1: 'Winner 47', team2: 'Winner 48', venue: 'Zlín', label: '1st/2nd', type: 'match' },
            { time: '16:45', label: 'Medal and Closing Ceremony', type: 'ceremony', venue: 'Zlín' },
        ]
    }
];

export const useMatchStore = create<MatchState>()(
    persist(
        (set, get) => ({
            teamAssignments: {},
            favoriteTeams: [],
            schedule: INITIAL_SCHEDULE,
            groups: INITIAL_GROUPS,
            venues: [
                {
                    id: '1',
                    name: 'Prostějov',
                    address: 'U Stadionu 1, 796 01 Prostějov',
                    availableFrom: '2026-10-15',
                    availableTo: '2026-10-21',
                    dailySchedule: [
                        { date: '2026-10-15', openingHours: '08:00 - 22:00', trainingHours: '08:00 - 10:00', note: 'Arrival day' },
                        { date: '2026-10-16', openingHours: '08:00 - 22:00', trainingHours: '08:00 - 10:00' },
                        { date: '2026-10-17', openingHours: '08:00 - 22:00', trainingHours: '08:00 - 10:00' },
                        { date: '2026-10-18', openingHours: '08:00 - 22:00', trainingHours: '08:00 - 10:00' },
                        { date: '2026-10-19', openingHours: '08:00 - 22:00', trainingHours: '08:00 - 10:00', note: 'Rest Day' },
                        { date: '2026-10-20', openingHours: '08:00 - 22:00', trainingHours: '08:00 - 10:00' },
                        { date: '2026-10-21', openingHours: '08:00 - 22:00', trainingHours: '08:00 - 10:00' },
                    ]
                },
                {
                    id: '2',
                    name: 'Otrokovice',
                    address: 'Mánesova 1021, 765 02 Otrokovice',
                    availableFrom: '2026-10-15',
                    availableTo: '2026-10-21',
                    dailySchedule: [
                        { date: '2026-10-15', openingHours: '08:00 - 21:00', trainingHours: '08:00 - 12:00' },
                        { date: '2026-10-16', openingHours: '08:00 - 21:00', trainingHours: '08:00 - 12:00' },
                        { date: '2026-10-17', openingHours: '08:00 - 21:00', trainingHours: '08:00 - 12:00' },
                        { date: '2026-10-18', openingHours: '08:00 - 21:00', trainingHours: '08:00 - 12:00' },
                        { date: '2026-10-19', openingHours: '08:00 - 21:00', trainingHours: '08:00 - 12:00', note: 'Rest Day' },
                        { date: '2026-10-20', openingHours: '08:00 - 21:00', trainingHours: '08:00 - 12:00' },
                        { date: '2026-10-21', openingHours: '08:00 - 21:00', trainingHours: '08:00 - 12:00' },
                    ]
                },
                {
                    id: '3',
                    name: 'Zlín',
                    address: 'Stadion mládeže, Hradská, 760 01 Zlín',
                    availableFrom: '2026-10-22',
                    availableTo: '2026-10-24',
                    dailySchedule: [
                        { date: '2026-10-22', openingHours: '07:00 - 23:00', trainingHours: '07:00 - 09:00' },
                        { date: '2026-10-23', openingHours: '07:00 - 23:00', trainingHours: '07:00 - 09:00' },
                        { date: '2026-10-24', openingHours: '07:00 - 23:00', trainingHours: '07:00 - 09:00', note: 'Finals Day' },
                    ]
                }
            ],
            participants: [],

            setTeamAssignment: (label, name, code) => set((state) => ({
                teamAssignments: { ...state.teamAssignments, [label]: { name, code } }
            })),

            toggleFavorite: (teamName) => set((state) => {
                const isFav = state.favoriteTeams.includes(teamName);
                if (isFav) {
                    return { favoriteTeams: state.favoriteTeams.filter(t => t !== teamName) };
                } else {
                    return { favoriteTeams: [...state.favoriteTeams, teamName] };
                }
            }),

            isFavorite: (teamName) => {
                return get().favoriteTeams.includes(teamName);
            },

            getResolvedTeamName: (label) => {
                if (!label) return 'TBA';
                const assignment = get().teamAssignments[label];
                return assignment ? assignment.name : label;
            },

            getResolvedTeamCode: (label) => {
                if (!label) return 'TBA';
                const assignment = get().teamAssignments[label];
                return assignment ? assignment.code : label;
            },

            updateMatchResult: (matchNr, score1, score2, scorers) => set((state) => ({
                schedule: state.schedule.map(day => ({
                    ...day,
                    matches: day.matches.map(match =>
                        match.nr === matchNr
                            ? { ...match, score1, score2, scorers: scorers || [] }
                            : match
                    )
                }))
            })),

            updateVenue: (venue) => set((state) => ({
                venues: state.venues.map(v => v.id === venue.id ? venue : v)
            })),

            addVenue: (venue) => set((state) => ({
                venues: [...state.venues, venue]
            })),

            deleteVenue: (venueId) => set((state) => ({
                venues: state.venues.filter(v => v.id !== venueId)
            })),

            updateParticipant: (participant) => set((state) => ({
                participants: state.participants.map(p => p.id === participant.id ? participant : p)
            })),

            addParticipant: (participant) => set((state) => ({
                participants: [...state.participants, participant]
            })),

            deleteParticipant: (participantId) => set((state) => ({
                participants: state.participants.filter(p => p.id !== participantId)
            })),

            getParticipantsForTeam: (teamLabel) => {
                return get().participants.filter(p => p.teamLabel === teamLabel);
            }
        }),
        {
            name: 'match-storage'
        }
    )
);

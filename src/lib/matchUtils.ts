import type { Match } from '../store/matchStore';

export interface Standing {
    teamLabel: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
}

/**
 * Calculates standings for a group of teams based on a set of matches.
 * Points: Win = 2, Draw = 1, Loss = 0.
 * Sorting: Points > Goal Difference > Goals For.
 */
export function calculateStandings(matches: Match[], groupTeams: string[]): Standing[] {
    const standingsMap: Record<string, Standing> = {};

    // Initialize standings for all teams in the group
    groupTeams.forEach(label => {
        standingsMap[label] = {
            teamLabel: label,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0
        };
    });

    // Process matches
    matches.filter(m => m.type === 'match' && m.score1 !== undefined && m.score2 !== undefined).forEach(match => {
        const { team1, team2, score1, score2 } = match;

        if (!team1 || !team2 || score1 === undefined || score2 === undefined) return;

        // Only count if both teams are in this group's requested list
        if (standingsMap[team1] && standingsMap[team2]) {
            const s1 = standingsMap[team1];
            const s2 = standingsMap[team2];

            s1.played++;
            s2.played++;
            s1.goalsFor += score1;
            s1.goalsAgainst += score2;
            s2.goalsFor += score2;
            s2.goalsAgainst += score1;

            if (score1 > score2) {
                s1.won++;
                s1.points += 2;
                s2.lost++;
            } else if (score1 < score2) {
                s2.won++;
                s2.points += 2;
                s1.lost++;
            } else {
                s1.drawn++;
                s1.points += 1;
                s2.drawn++;
                s2.points += 1;
            }
        }
    });

    // Convert to array and sort
    return Object.values(standingsMap).sort((a, b) => {
        // 1. Points
        if (b.points !== a.points) return b.points - a.points;

        // 2. Goal Difference
        const diffA = a.goalsFor - a.goalsAgainst;
        const diffB = b.goalsFor - b.goalsAgainst;
        if (diffB !== diffA) return diffB - diffA;

        // 3. Goals For
        return b.goalsFor - a.goalsFor;
    });
}

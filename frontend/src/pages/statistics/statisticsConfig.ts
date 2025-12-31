export interface StatisticEntry {
    id: string;
    title: string;
    description: string;
    route: string;
}

export const STATISTICS: StatisticEntry[] = [
    {
        id: "leaderboard",
        title: "Leaderboard",
        description: "Winrate Leaderboard",
        route: "/statistics/leaderboard"
    },
    {
        id: "player-winrate",
        title: "Player winrate",
        description: "Winrate per Player",
        route: "/statistics/player-winrate"
    },
    {
        id: "player-vs-player",
        title: "Player vs. Player",
        description: "Compare two Players",
        route: "/statistics/player-vs-player"
    },
    {
        id: "streaks",
        title: "Streaks",
        description: "Winning and losing streaks",
        route: "/statistics/streaks"
    },
    {
        id: "commander-winrate",
        title: "Commander-Winrate",
        description: "Winrate by Commander",
        route: "/statistics/commander-winrate"
    },
    {
        id: "commander-amounts",
        title: "Commander Amounts",
        description: "How often does a Commander get played?",
        route: "/statistics/commander-amounts"
    },

];
import type { QuizModeId } from "./quiz";

export interface ModeStats {
  bestScore: number;
  gamesPlayed: number;
  currentStreak: number;
  bestStreak: number;
}

export interface StatsState {
  totalGames: number;
  modes: Record<QuizModeId, ModeStats>;
}

export const DEFAULT_MODE_STATS: ModeStats = {
  bestScore: 0,
  gamesPlayed: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export const DEFAULT_STATS: StatsState = {
  totalGames: 0,
  modes: {
    "flag-to-team": { ...DEFAULT_MODE_STATS },
    "team-to-flag": { ...DEFAULT_MODE_STATS },
    "flag-to-city": { ...DEFAULT_MODE_STATS },
    "founded-year": { ...DEFAULT_MODE_STATS },
  },
};

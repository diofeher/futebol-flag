import type { QuizModeId } from "./quiz";
import type { DifficultyId } from "./difficulty";

export interface ModeStats {
  bestScore: number;
  gamesPlayed: number;
  currentStreak: number;
  bestStreak: number;
}

export interface StatsState {
  schemaVersion: 2;
  totalGames: number;
  modes: Record<DifficultyId, Record<QuizModeId, ModeStats>>;
}

export const DEFAULT_MODE_STATS: ModeStats = {
  bestScore: 0,
  gamesPlayed: 0,
  currentStreak: 0,
  bestStreak: 0,
};

function createDefaultModes(): Record<QuizModeId, ModeStats> {
  return {
    "flag-to-team": { ...DEFAULT_MODE_STATS },
    "team-to-flag": { ...DEFAULT_MODE_STATS },
    "flag-to-city": { ...DEFAULT_MODE_STATS },
    "founded-year": { ...DEFAULT_MODE_STATS },
  };
}

export const DEFAULT_STATS: StatsState = {
  schemaVersion: 2,
  totalGames: 0,
  modes: {
    easy: createDefaultModes(),
    medium: createDefaultModes(),
    hard: createDefaultModes(),
  },
};

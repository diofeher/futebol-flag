import { useState, useCallback } from "react";
import type { QuizModeId } from "../types/quiz";
import type { DifficultyId } from "../types/difficulty";
import type { StatsState, ModeStats } from "../types/stats";
import { DEFAULT_STATS, DEFAULT_MODE_STATS } from "../types/stats";
import { getItem, setItem } from "../lib/storage";

const STATS_KEY = "stats";

/** V1 shape (pre-difficulty): flat Record<QuizModeId, ModeStats> */
interface StatsV1 {
  totalGames: number;
  modes: Record<string, ModeStats>;
}

function isV1(raw: unknown): raw is StatsV1 {
  if (!raw || typeof raw !== "object") return false;
  const obj = raw as Record<string, unknown>;
  return !("schemaVersion" in obj) && typeof obj.modes === "object";
}

function migrateV1(v1: StatsV1): StatsState {
  const migrated: StatsState = {
    ...DEFAULT_STATS,
    schemaVersion: 2,
    totalGames: v1.totalGames ?? 0,
    modes: {
      easy: { ...DEFAULT_STATS.modes.easy },
      medium: {
        "flag-to-team": {
          ...DEFAULT_MODE_STATS,
          ...(v1.modes["flag-to-team"] ?? {}),
        },
        "team-to-flag": {
          ...DEFAULT_MODE_STATS,
          ...(v1.modes["team-to-flag"] ?? {}),
        },
        "flag-to-city": {
          ...DEFAULT_MODE_STATS,
          ...(v1.modes["flag-to-city"] ?? {}),
        },
        "founded-year": {
          ...DEFAULT_MODE_STATS,
          ...(v1.modes["founded-year"] ?? {}),
        },
      },
      hard: { ...DEFAULT_STATS.modes.hard },
    },
  };
  return migrated;
}

function loadStats(): StatsState {
  const raw = getItem<unknown>(STATS_KEY, DEFAULT_STATS);

  // Migrate v1 → v2
  if (isV1(raw)) {
    const migrated = migrateV1(raw as StatsV1);
    persistStats(migrated);
    return migrated;
  }

  // V2 — merge with defaults for forward-compat
  const v2 = raw as Partial<StatsState>;
  const result: StatsState = {
    schemaVersion: 2,
    totalGames: v2.totalGames ?? 0,
    modes: {
      easy: { ...DEFAULT_STATS.modes.easy, ...(v2.modes?.easy ?? {}) },
      medium: { ...DEFAULT_STATS.modes.medium, ...(v2.modes?.medium ?? {}) },
      hard: { ...DEFAULT_STATS.modes.hard, ...(v2.modes?.hard ?? {}) },
    },
  };
  return result;
}

function persistStats(stats: StatsState): void {
  setItem(STATS_KEY, stats);
}

export function useStats() {
  const [stats, setStats] = useState<StatsState>(loadStats);

  const recordResult = useCallback(
    (
      modeId: QuizModeId,
      difficultyId: DifficultyId,
      score: number,
      total: number
    ) => {
      setStats((prev) => {
        const modeStats = prev.modes[difficultyId][modeId];
        const percentage = total > 0 ? (score / total) * 100 : 0;
        const passed = percentage >= 70;

        const newStreak = passed ? modeStats.currentStreak + 1 : 0;
        const newBestStreak = Math.max(modeStats.bestStreak, newStreak);
        const newBestScore = Math.max(modeStats.bestScore, score);

        const updated: StatsState = {
          ...prev,
          totalGames: prev.totalGames + 1,
          modes: {
            ...prev.modes,
            [difficultyId]: {
              ...prev.modes[difficultyId],
              [modeId]: {
                bestScore: newBestScore,
                gamesPlayed: modeStats.gamesPlayed + 1,
                currentStreak: newStreak,
                bestStreak: newBestStreak,
              },
            },
          },
        };

        persistStats(updated);
        return updated;
      });
    },
    []
  );

  const resetStats = useCallback(() => {
    const fresh: StatsState = {
      ...DEFAULT_STATS,
      modes: {
        easy: { ...DEFAULT_STATS.modes.easy },
        medium: { ...DEFAULT_STATS.modes.medium },
        hard: { ...DEFAULT_STATS.modes.hard },
      },
    };
    persistStats(fresh);
    setStats(fresh);
  }, []);

  return { stats, recordResult, resetStats };
}

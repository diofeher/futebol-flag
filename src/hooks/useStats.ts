import { useState, useCallback } from "react";
import type { QuizModeId } from "../types/quiz";
import type { StatsState } from "../types/stats";
import { DEFAULT_STATS } from "../types/stats";
import { getItem, setItem } from "../lib/storage";

const STATS_KEY = "stats";

function loadStats(): StatsState {
  const raw = getItem<Partial<StatsState>>(STATS_KEY, DEFAULT_STATS);
  return {
    totalGames: raw.totalGames ?? 0,
    modes: {
      ...DEFAULT_STATS.modes,
      ...(raw.modes ?? {}),
    },
  };
}

function persistStats(stats: StatsState): void {
  setItem(STATS_KEY, stats);
}

export function useStats() {
  const [stats, setStats] = useState<StatsState>(loadStats);

  const recordResult = useCallback(
    (modeId: QuizModeId, score: number, total: number) => {
      setStats((prev) => {
        const modeStats = prev.modes[modeId];
        const percentage = total > 0 ? (score / total) * 100 : 0;
        const passed = percentage >= 70;

        const newStreak = passed ? modeStats.currentStreak + 1 : 0;
        const newBestStreak = Math.max(modeStats.bestStreak, newStreak);
        const newBestScore = Math.max(modeStats.bestScore, score);

        const updated: StatsState = {
          totalGames: prev.totalGames + 1,
          modes: {
            ...prev.modes,
            [modeId]: {
              bestScore: newBestScore,
              gamesPlayed: modeStats.gamesPlayed + 1,
              currentStreak: newStreak,
              bestStreak: newBestStreak,
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
    const fresh = { ...DEFAULT_STATS };
    persistStats(fresh);
    setStats(fresh);
  }, []);

  return { stats, recordResult, resetStats };
}

import { createContext, useContext } from "react";
import type { StatsState } from "../types/stats";
import type { QuizModeId } from "../types/quiz";
import type { DifficultyId } from "../types/difficulty";
import { useStats } from "../hooks/useStats";

interface StatsContextValue {
  stats: StatsState;
  recordResult: (
    modeId: QuizModeId,
    difficultyId: DifficultyId,
    score: number,
    total: number
  ) => void;
  resetStats: () => void;
}

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const value = useStats();
  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
}

export function useStatsContext(): StatsContextValue {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStatsContext must be used within StatsProvider");
  return ctx;
}

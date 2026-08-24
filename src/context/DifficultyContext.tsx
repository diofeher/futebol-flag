import { createContext, useContext } from "react";
import type { DifficultyId } from "../types/difficulty";
import { useDifficulty } from "../hooks/useDifficulty";

interface DifficultyContextValue {
  difficulty: DifficultyId;
  setDifficulty: (d: DifficultyId) => void;
}

const DifficultyContext = createContext<DifficultyContextValue | null>(null);

export function DifficultyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useDifficulty();
  return (
    <DifficultyContext.Provider value={value}>
      {children}
    </DifficultyContext.Provider>
  );
}

export function useDifficultyContext(): DifficultyContextValue {
  const ctx = useContext(DifficultyContext);
  if (!ctx)
    throw new Error(
      "useDifficultyContext must be used within DifficultyProvider"
    );
  return ctx;
}

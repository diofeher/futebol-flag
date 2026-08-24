import type { DifficultyId, DifficultyDefinition } from "../types/difficulty";

export const DIFFICULTY_LEVELS: DifficultyDefinition[] = [
  {
    id: "easy",
    label: "Easy",
    emoji: "🟢",
    description: "World-famous clubs & top leagues",
  },
  {
    id: "medium",
    label: "Medium",
    emoji: "🟡",
    description: "Solid domestic leagues",
  },
  {
    id: "hard",
    label: "Hard",
    emoji: "🔴",
    description: "Obscure leagues & regional cups",
  },
];

export const DEFAULT_DIFFICULTY: DifficultyId = "medium";

export function getDifficulty(id: DifficultyId): DifficultyDefinition {
  const diff = DIFFICULTY_LEVELS.find((d) => d.id === id);
  if (!diff) throw new Error(`Unknown difficulty: ${id}`);
  return diff;
}

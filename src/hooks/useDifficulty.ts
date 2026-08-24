import { useState, useCallback } from "react";
import type { DifficultyId } from "../types/difficulty";
import { DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY } from "../data/difficulties";
import { getItem, setItem } from "../lib/storage";

const DIFFICULTY_KEY = "difficulty";

function loadDifficulty(): DifficultyId {
  const raw = getItem<DifficultyId>(DIFFICULTY_KEY, DEFAULT_DIFFICULTY);
  return DIFFICULTY_LEVELS.some((d) => d.id === raw) ? raw : DEFAULT_DIFFICULTY;
}

export function useDifficulty() {
  const [difficulty, setDifficultyState] =
    useState<DifficultyId>(loadDifficulty);

  const setDifficulty = useCallback((id: DifficultyId) => {
    setItem(DIFFICULTY_KEY, id);
    setDifficultyState(id);
  }, []);

  return { difficulty, setDifficulty };
}

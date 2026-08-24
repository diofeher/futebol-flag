import type { DifficultyId } from "./difficulty";

export interface League {
  id: string;
  name: string;
  country: string;
  continent: string;
  tier: DifficultyId;
}

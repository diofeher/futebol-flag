import type { QuizModeDefinition, QuizModeId } from "../types/quiz";
import { flagToTeamMode } from "./modes/flagToTeam";
import { teamToFlagMode } from "./modes/teamToFlag";
import { flagToCityMode } from "./modes/flagToCity";
import { foundedYearMode } from "./modes/foundedYear";

export const QUIZ_MODES: QuizModeDefinition[] = [
  flagToTeamMode,
  teamToFlagMode,
  flagToCityMode,
  foundedYearMode,
];

export function getQuizMode(id: QuizModeId): QuizModeDefinition {
  const mode = QUIZ_MODES.find((m) => m.id === id);
  if (!mode) throw new Error(`Unknown quiz mode: ${id}`);
  return mode;
}

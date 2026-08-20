import type { Team } from "../types/team";
import type { QuizModeId, QuizQuestion } from "../types/quiz";
import { getQuizMode } from "./registry";

export const QUESTIONS_PER_ROUND = 10;

export function generateRound(
  modeId: QuizModeId,
  teams: Team[],
  count: number = QUESTIONS_PER_ROUND
): QuizQuestion[] {
  const mode = getQuizMode(modeId);
  const usedTeamIds = new Set<string>();
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < count; i++) {
    try {
      questions.push(mode.generateQuestion(teams, usedTeamIds));
    } catch {
      // Ran out of unused teams — return what we have
      break;
    }
  }

  return questions;
}

import { useReducer, useCallback } from "react";
import type { QuizModeId } from "../types/quiz";
import type { DifficultyId } from "../types/difficulty";
import type { Team } from "../types/team";
import { quizReducer, initialQuizState } from "../quiz/quizReducer";
import { generateRound } from "../quiz/generateRound";

export function useQuiz(teams: Team[], difficultyId: DifficultyId) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);

  const start = useCallback(
    (modeId: QuizModeId) => {
      const questions = generateRound(modeId, teams);
      dispatch({ type: "SELECT_MODE", modeId, difficultyId, questions });
    },
    [teams, difficultyId]
  );

  const answer = useCallback((optionId: string) => {
    dispatch({ type: "ANSWER", optionId });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: "NEXT" });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: "RESTART" });
  }, []);

  const backToModes = useCallback(() => {
    dispatch({ type: "BACK_TO_MODES" });
  }, []);

  const currentQuestion =
    state.status === "in-progress"
      ? state.questions[state.currentIndex]
      : null;

  return {
    ...state,
    currentQuestion,
    totalQuestions: state.questions.length,
    start,
    answer,
    next,
    restart,
    backToModes,
  };
}

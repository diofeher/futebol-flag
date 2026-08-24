import { useEffect, useRef, useMemo } from "react";
import { TEAMS } from "../../data/teams";
import { useQuiz } from "../../hooks/useQuiz";
import { useStatsContext } from "../../context/StatsContext";
import { useDifficultyContext } from "../../context/DifficultyContext";
import { filterTeamsByDifficulty } from "../../quiz/teamFilters";
import { ModeSelector } from "./components/ModeSelector";
import { ProgressBar } from "./components/ProgressBar";
import { QuestionCard } from "./components/QuestionCard";
import { ResultsSummary } from "./components/ResultsSummary";
import styles from "./QuizPage.module.css";

export function QuizPage() {
  const { difficulty } = useDifficultyContext();
  const teams = useMemo(
    () => filterTeamsByDifficulty(TEAMS, difficulty),
    [difficulty]
  );
  const quiz = useQuiz(teams, difficulty);
  const { recordResult } = useStatsContext();
  const hasRecorded = useRef(false);

  // Record result exactly once when quiz finishes
  useEffect(() => {
    if (
      quiz.status === "finished" &&
      quiz.modeId &&
      quiz.difficultyId &&
      !hasRecorded.current
    ) {
      hasRecorded.current = true;
      recordResult(
        quiz.modeId,
        quiz.difficultyId,
        quiz.score,
        quiz.totalQuestions
      );
    }
    if (quiz.status !== "finished") {
      hasRecorded.current = false;
    }
  }, [
    quiz.status,
    quiz.modeId,
    quiz.difficultyId,
    quiz.score,
    quiz.totalQuestions,
    recordResult,
  ]);

  return (
    <div className={styles.page}>
      {quiz.status === "mode-select" && (
        <ModeSelector onSelect={quiz.start} />
      )}

      {quiz.status === "in-progress" && quiz.currentQuestion && (
        <div className={styles.quizArea}>
          <ProgressBar
            current={quiz.currentIndex}
            total={quiz.totalQuestions}
            score={quiz.score}
            onQuit={quiz.backToModes}
          />
          <QuestionCard
            question={quiz.currentQuestion}
            selectedOptionId={quiz.selectedOptionId}
            isAnswered={quiz.isAnswered}
            onAnswer={quiz.answer}
            onNext={quiz.next}
          />
        </div>
      )}

      {quiz.status === "finished" && quiz.modeId && quiz.difficultyId && (
        <ResultsSummary
          modeId={quiz.modeId}
          difficultyId={quiz.difficultyId}
          score={quiz.score}
          total={quiz.totalQuestions}
          onPlayAgain={() => {
            quiz.start(quiz.modeId!);
          }}
          onChangeModes={quiz.backToModes}
        />
      )}
    </div>
  );
}

import type { QuizQuestion } from "../../../types/quiz";
import { Badge } from "../../../components/ui/Badge";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  question: QuizQuestion;
  selectedOptionId: string | null;
  isAnswered: boolean;
  onAnswer: (optionId: string) => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  selectedOptionId,
  isAnswered,
  onAnswer,
  onNext,
}: QuestionCardProps) {
  const hasImagePrompt = !!question.promptImageUrl;
  const hasImageOptions = question.options.some((o) => o.imageUrl);

  return (
    <div className={styles.card}>
      <h3 className={styles.prompt}>{question.prompt}</h3>

      {hasImagePrompt && (
        <div className={styles.promptImage}>
          <Badge src={question.promptImageUrl!} alt="Team badge" size="xl" blurred={!isAnswered && question.modeId === "flag-to-team"} />
        </div>
      )}

      <div
        className={`${styles.options} ${hasImageOptions ? styles.imageOptions : ""}`}
      >
        {question.options.map((option) => {
          let optionClass = styles.option;
          if (isAnswered) {
            if (option.id === question.correctOptionId) {
              optionClass += ` ${styles.correct}`;
            } else if (option.id === selectedOptionId) {
              optionClass += ` ${styles.wrong}`;
            } else {
              optionClass += ` ${styles.dimmed}`;
            }
          }

          return (
            <button
              key={option.id}
              className={optionClass}
              onClick={() => !isAnswered && onAnswer(option.id)}
              disabled={isAnswered}
            >
              {option.imageUrl && (
                <Badge src={option.imageUrl} alt="Team badge" size="lg" blurred={!isAnswered && question.modeId === "team-to-flag"} />
              )}
              {!option.imageUrl && (
                <span className={styles.optionLabel}>{option.label}</span>
              )}
              {isAnswered && option.imageUrl && (
                <span className={styles.revealedLabel}>{option.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={styles.feedback}>
          <p className={styles.feedbackText}>
            {selectedOptionId === question.correctOptionId ? (
              <span className={styles.correctText}>
                ✅ Correct!
                {question.correctDetail && (
                  <> — <strong>{question.correctDetail}</strong></>
                )}
              </span>
            ) : (
              <span className={styles.wrongText}>
                ❌ Wrong! The answer was{" "}
                <strong>
                  {
                    question.options.find(
                      (o) => o.id === question.correctOptionId
                    )?.label
                  }
                </strong>
                {question.correctDetail && (
                  <> ({question.correctDetail})</>
                )}
              </span>
            )}
          </p>
          <button className={styles.nextButton} onClick={onNext}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
  onQuit: () => void;
}

export function ProgressBar({ current, total, score, onQuit }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span className={styles.question}>
          Question {current + 1}/{total}
        </span>
        <button className={styles.quitButton} onClick={onQuit} title="Quit quiz">
          ✕
        </button>
        <span className={styles.score}>
          Score: {score}/{current}
        </span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

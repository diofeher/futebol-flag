import { useStatsContext } from "../../context/StatsContext";
import type { AppRoute } from "../../routes/useRoute";
import styles from "./Header.module.css";

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export function Header({ currentRoute, onNavigate }: HeaderProps) {
  const { stats } = useStatsContext();

  // Find the best active streak across all modes
  const bestCurrentStreak = Math.max(
    ...Object.values(stats.modes).map((m) => m.currentStreak),
    0
  );

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>⚽</span>
        <h1 className={styles.title}>Futebol Flag</h1>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navButton} ${currentRoute === "/" ? styles.active : ""}`}
          aria-current={currentRoute === "/" ? "page" : undefined}
          onClick={() => onNavigate("/")}
        >
          🏆 Quiz
        </button>
        <button
          className={`${styles.navButton} ${currentRoute === "/library" ? styles.active : ""}`}
          aria-current={currentRoute === "/library" ? "page" : undefined}
          onClick={() => onNavigate("/library")}
        >
          📚 Library
        </button>
      </nav>

      <div className={styles.stats}>
        {bestCurrentStreak > 0 && (
          <span className={styles.streak} title="Current best streak">
            🔥 {bestCurrentStreak}
          </span>
        )}
        {stats.totalGames > 0 && (
          <span className={styles.games} title="Total games played">
            🎮 {stats.totalGames}
          </span>
        )}
      </div>
    </header>
  );
}

import { getLeagueName } from "../../../data/leagues";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  search: string;
  leagueId: string;
  country: string;
  leagues: string[];
  countries: string[];
  onSearchChange: (value: string) => void;
  onLeagueChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onReset: () => void;
  resultCount: number;
}

export function FilterBar({
  search,
  leagueId,
  country,
  leagues,
  countries,
  onSearchChange,
  onLeagueChange,
  onCountryChange,
  onReset,
  resultCount,
}: FilterBarProps) {
  const hasFilters = search || leagueId !== "all" || country !== "all";

  return (
    <div className={styles.bar}>
      <div className={styles.filters}>
        <input
          type="text"
          className={styles.search}
          placeholder="Search teams, cities..."
          aria-label="Search teams"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
          className={styles.select}
          aria-label="Filter by country"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
        >
          <option value="all">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          aria-label="Filter by league"
          value={leagueId}
          onChange={(e) => onLeagueChange(e.target.value)}
        >
          <option value="all">All Leagues</option>
          {leagues.map((id) => (
            <option key={id} value={id}>
              {getLeagueName(id)}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button className={styles.resetButton} onClick={onReset}>
            ✕ Clear
          </button>
        )}
      </div>

      <span className={styles.count}>
        {resultCount} team{resultCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

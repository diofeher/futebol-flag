import { TEAMS } from "../../data/teams";
import { useTeamFilter } from "../../hooks/useTeamFilter";
import { FilterBar } from "./components/FilterBar";
import { TeamCard } from "./components/TeamCard";
import styles from "./LibraryPage.module.css";

export function LibraryPage() {
  const {
    filters,
    setSearch,
    setLeagueId,
    setCountry,
    resetFilters,
    filteredTeams,
    leagues,
    countries,
  } = useTeamFilter(TEAMS);

  return (
    <div className={styles.page}>
      <FilterBar
        search={filters.search}
        leagueId={filters.leagueId}
        country={filters.country}
        leagues={leagues}
        countries={countries}
        onSearchChange={setSearch}
        onLeagueChange={setLeagueId}
        onCountryChange={setCountry}
        onReset={resetFilters}
        resultCount={filteredTeams.length}
      />

      <div className={styles.grid}>
        {filteredTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className={styles.empty}>
          <p>No teams match your filters.</p>
          <button className={styles.resetButton} onClick={resetFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

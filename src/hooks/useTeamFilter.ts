import { useState, useMemo, useCallback } from "react";
import type { Team } from "../types/team";

export interface TeamFilters {
  search: string;
  leagueId: string;
  country: string;
}

export function useTeamFilter(teams: Team[]) {
  const [search, setSearch] = useState("");
  const [leagueId, setLeagueId] = useState("all");
  const [country, setCountry] = useState("all");

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      if (leagueId !== "all" && team.leagueId !== leagueId) return false;
      if (country !== "all" && team.country !== country) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          team.name.toLowerCase().includes(q) ||
          team.city.toLowerCase().includes(q) ||
          team.state.toLowerCase().includes(q) ||
          team.shortName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [teams, search, leagueId, country]);

  const leagues = useMemo(
    () => Array.from(new Set(teams.map((t) => t.leagueId))).sort(),
    [teams]
  );

  const countries = useMemo(
    () => Array.from(new Set(teams.map((t) => t.country))).sort(),
    [teams]
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setLeagueId("all");
    setCountry("all");
  }, []);

  return {
    filters: { search, leagueId, country },
    setSearch,
    setLeagueId,
    setCountry,
    resetFilters,
    filteredTeams,
    leagues,
    countries,
  };
}

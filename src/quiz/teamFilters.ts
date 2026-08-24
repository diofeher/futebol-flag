import type { Team } from "../types/team";
import type { DifficultyId } from "../types/difficulty";
import { LEAGUES } from "../data/leagues";

export type TeamFilter = (team: Team) => boolean;

const LEAGUE_TIER_BY_ID = new Map(LEAGUES.map((l) => [l.id, l.tier]));

export function byDifficulty(difficulty: DifficultyId): TeamFilter {
  return (team) => LEAGUE_TIER_BY_ID.get(team.leagueId) === difficulty;
}

export function applyFilters(teams: Team[], filters: TeamFilter[]): Team[] {
  return teams.filter((t) => filters.every((f) => f(t)));
}

const MIN_POOL_SIZE = 4;

export function filterTeamsByDifficulty(
  teams: Team[],
  difficulty: DifficultyId
): Team[] {
  const filtered = applyFilters(teams, [byDifficulty(difficulty)]);
  return filtered.length >= MIN_POOL_SIZE ? filtered : teams;
}

export function countTeamsByDifficulty(
  teams: Team[]
): Record<DifficultyId, number> {
  return {
    easy: applyFilters(teams, [byDifficulty("easy")]).length,
    medium: applyFilters(teams, [byDifficulty("medium")]).length,
    hard: applyFilters(teams, [byDifficulty("hard")]).length,
  };
}

import type { Team } from "../types/team";
import type { QuizOption } from "../types/quiz";
import { sampleSize, shuffle, generateId } from "../lib/arrayUtils";

/**
 * Build a set of quiz options: one correct + N distractors.
 * Prefers distractors from same league for difficulty, falls back to global pool.
 */
export function buildOptions(
  correctTeam: Team,
  allTeams: Team[],
  labelFn: (team: Team) => string,
  imageFn?: (team: Team) => string,
  distractorCount: number = 3
): QuizOption[] {
  const sameLeague = allTeams.filter(
    (t) => t.leagueId === correctTeam.leagueId && t.id !== correctTeam.id
  );

  let distractors: Team[];
  if (sameLeague.length >= distractorCount) {
    distractors = sampleSize(sameLeague, distractorCount);
  } else {
    const others = allTeams.filter((t) => t.id !== correctTeam.id);
    distractors = sampleSize(others, distractorCount);
  }

  const correct: QuizOption = {
    id: correctTeam.id,
    label: labelFn(correctTeam),
    imageUrl: imageFn?.(correctTeam),
  };

  const wrong: QuizOption[] = distractors.map((t) => ({
    id: t.id,
    label: labelFn(t),
    imageUrl: imageFn?.(t),
  }));

  return shuffle([correct, ...wrong]);
}

/**
 * Pick a team from the pool that hasn't been used yet.
 */
export function pickUnusedTeam(
  teams: Team[],
  usedIds: Set<string>
): Team | null {
  const available = teams.filter((t) => !usedIds.has(t.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export { generateId };

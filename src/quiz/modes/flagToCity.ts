import type { Team } from "../../types/team";
import type { QuizModeDefinition, QuizQuestion } from "../../types/quiz";
import { buildOptions, pickUnusedTeam, generateId } from "../questionFactory";

function formatLocation(team: Team): string {
  return `${team.city}, ${team.state}`;
}

export const flagToCityMode: QuizModeDefinition = {
  id: "flag-to-city",
  label: "Flag → City",
  emoji: "🏙️",
  description: "Identify the city/state from the badge",

  generateQuestion(teams: Team[], usedTeamIds: Set<string>): QuizQuestion {
    const team = pickUnusedTeam(teams, usedTeamIds);
    if (!team) throw new Error("No unused teams available");
    usedTeamIds.add(team.id);

    // Exclude teams sharing the correct team's location, then dedupe remaining
    const correctLocation = formatLocation(team);
    const distractorPool = teams.filter((t) => {
      if (t.id === team.id) return true;
      if (formatLocation(t) === correctLocation) return false;
      // Keep only first occurrence of each location to avoid duplicate labels
      return teams.findIndex(
        (x) => x.id !== team.id && formatLocation(x) === formatLocation(t)
      ) === teams.indexOf(t);
    });

    const options = buildOptions(team, distractorPool, formatLocation);

    return {
      id: generateId(),
      modeId: "flag-to-city",
      prompt: "Which city is this team from?",
      promptImageUrl: team.badgeUrl,
      options,
      correctOptionId: team.id,
    };
  },
};

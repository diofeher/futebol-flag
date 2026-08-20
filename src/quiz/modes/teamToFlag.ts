import type { Team } from "../../types/team";
import type { QuizModeDefinition, QuizQuestion } from "../../types/quiz";
import { buildOptions, pickUnusedTeam, generateId } from "../questionFactory";

export const teamToFlagMode: QuizModeDefinition = {
  id: "team-to-flag",
  label: "Team → Flag",
  emoji: "⚽",
  description: "Pick the correct badge for the team",

  generateQuestion(teams: Team[], usedTeamIds: Set<string>): QuizQuestion {
    const team = pickUnusedTeam(teams, usedTeamIds);
    if (!team) throw new Error("No unused teams available");
    usedTeamIds.add(team.id);

    const options = buildOptions(
      team,
      teams,
      (t) => t.name,
      (t) => t.badgeUrl
    );

    return {
      id: generateId(),
      modeId: "team-to-flag",
      prompt: `Which badge belongs to ${team.name}? (${team.country})`,
      options,
      correctOptionId: team.id,
    };
  },
};

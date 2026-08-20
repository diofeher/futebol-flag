import type { Team } from "../../types/team";
import type { QuizModeDefinition, QuizQuestion } from "../../types/quiz";
import { buildOptions, pickUnusedTeam, generateId } from "../questionFactory";

export const flagToTeamMode: QuizModeDefinition = {
  id: "flag-to-team",
  label: "Flag → Team",
  emoji: "🏳️",
  description: "Identify the team from its badge",

  generateQuestion(teams: Team[], usedTeamIds: Set<string>): QuizQuestion {
    const team = pickUnusedTeam(teams, usedTeamIds);
    if (!team) throw new Error("No unused teams available");
    usedTeamIds.add(team.id);

    const options = buildOptions(team, teams, (t) => t.name);

    return {
      id: generateId(),
      modeId: "flag-to-team",
      prompt: "Which team does this badge belong to?",
      promptImageUrl: team.badgeUrl,
      options,
      correctOptionId: team.id,
      correctDetail: team.country,
    };
  },
};

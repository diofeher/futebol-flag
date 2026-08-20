import type { Team } from "../../types/team";
import type { QuizModeDefinition, QuizQuestion } from "../../types/quiz";
import { pickUnusedTeam, generateId } from "../questionFactory";

export const foundedYearMode: QuizModeDefinition = {
  id: "founded-year",
  label: "Year Founded",
  emoji: "📅",
  description: "Which club was founded first?",

  generateQuestion(teams: Team[], usedTeamIds: Set<string>): QuizQuestion {
    // Only use teams with known founding year
    const teamsWithYear = teams.filter(t => t.foundedYear > 0);
    const teamA = pickUnusedTeam(teamsWithYear, usedTeamIds);
    if (!teamA) throw new Error("No unused teams available");
    usedTeamIds.add(teamA.id);

    // Pick a second team with a different founding year
    const candidates = teamsWithYear.filter(
      (t) => !usedTeamIds.has(t.id) && t.foundedYear !== teamA.foundedYear
    );

    let teamB: Team;
    if (candidates.length > 0) {
      teamB = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      // Fallback: pick any unused team
      const fallback = pickUnusedTeam(teamsWithYear, usedTeamIds);
      if (!fallback) throw new Error("No second team available");
      teamB = fallback;
    }
    usedTeamIds.add(teamB.id);

    const older = teamA.foundedYear <= teamB.foundedYear ? teamA : teamB;

    return {
      id: generateId(),
      modeId: "founded-year",
      prompt: "Which club was founded first?",
      options: [
        {
          id: teamA.id,
          label: `${teamA.name} (${teamA.foundedYear})`,
          imageUrl: teamA.badgeUrl,
        },
        {
          id: teamB.id,
          label: `${teamB.name} (${teamB.foundedYear})`,
          imageUrl: teamB.badgeUrl,
        },
      ],
      correctOptionId: older.id,
    };
  },
};

export type QuizModeId =
  | "flag-to-team"
  | "team-to-flag"
  | "flag-to-city"
  | "founded-year";

export interface QuizOption {
  id: string;
  label: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  id: string;
  modeId: QuizModeId;
  prompt: string;
  promptImageUrl?: string;
  options: QuizOption[];
  correctOptionId: string;
  /** Extra detail shown after answering (e.g. team name for flag→city) */
  correctDetail?: string;
}

export interface QuizModeDefinition {
  id: QuizModeId;
  label: string;
  emoji: string;
  description: string;
  generateQuestion: (
    teams: import("./team").Team[],
    usedTeamIds: Set<string>
  ) => QuizQuestion;
}

export type QuizStatus = "idle" | "mode-select" | "in-progress" | "finished";

export interface QuizState {
  status: QuizStatus;
  modeId: QuizModeId | null;
  questions: QuizQuestion[];
  currentIndex: number;
  selectedOptionId: string | null;
  isAnswered: boolean;
  score: number;
}

export type QuizAction =
  | { type: "SELECT_MODE"; modeId: QuizModeId; questions: QuizQuestion[] }
  | { type: "ANSWER"; optionId: string }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "BACK_TO_MODES" };

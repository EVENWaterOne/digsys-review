export type QuestionMode = "single" | "multiple";
export type QuestionContentType = "text" | "code" | "image";
export type StudyMode = "practice" | "exam";

export interface Option {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  mode: QuestionMode;
  contentType: QuestionContentType;
  prompt: string;
  code?: string;
  image?: {
    src: string;
    alt: string;
  };
  options: Option[];
  correctOptionIds: string[];
  explanation: string;
}

export interface AttemptRecord {
  questionId: string;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
  mode: StudyMode;
  answeredAt: string;
}

export interface ProgressState {
  currentIndex: number;
  selectedByQuestionId: Record<string, string[]>;
  updatedAt: string;
}

export interface ExamResult {
  id: string;
  total: number;
  correct: number;
  score: number;
  finishedAt: string;
  answers: AttemptRecord[];
}

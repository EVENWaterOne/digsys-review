import type { AttemptRecord, ExamResult, ProgressState, Question, StudyMode } from "../types";

const STORAGE_KEY = "digsys-review-state-v1";

interface PersistedState {
  attempts: AttemptRecord[];
  wrongQuestionIds: string[];
  practiceProgress: ProgressState | null;
  examProgress: ProgressState | null;
  examResults: ExamResult[];
}

const defaultState: PersistedState = {
  attempts: [],
  wrongQuestionIds: [],
  practiceProgress: null,
  examProgress: null,
  examResults: [],
};

export function selectionsMatch(selected: string[], correct: string[]): boolean {
  if (selected.length !== correct.length) {
    return false;
  }
  const selectedSet = new Set(selected);
  return correct.every((optionId) => selectedSet.has(optionId));
}

export function getState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }
    return { ...defaultState, ...JSON.parse(raw) } as PersistedState;
  } catch {
    return defaultState;
  }
}

function saveState(nextState: PersistedState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

export function recordAttempt(question: Question, selectedOptionIds: string[], mode: StudyMode): AttemptRecord {
  const state = getState();
  const attempt: AttemptRecord = {
    questionId: question.id,
    selectedOptionIds,
    correctOptionIds: question.correctOptionIds,
    isCorrect: selectionsMatch(selectedOptionIds, question.correctOptionIds),
    mode,
    answeredAt: new Date().toISOString(),
  };

  const wrongQuestionIds = new Set(state.wrongQuestionIds);
  if (attempt.isCorrect) {
    wrongQuestionIds.delete(question.id);
  } else {
    wrongQuestionIds.add(question.id);
  }

  saveState({
    ...state,
    attempts: [...state.attempts, attempt],
    wrongQuestionIds: Array.from(wrongQuestionIds),
  });

  return attempt;
}

export function savePracticeProgress(progress: ProgressState): void {
  saveState({ ...getState(), practiceProgress: progress });
}

export function loadPracticeProgress(): ProgressState | null {
  return getState().practiceProgress;
}

export function clearPracticeProgress(): void {
  saveState({ ...getState(), practiceProgress: null });
}

export function saveExamProgress(progress: ProgressState): void {
  saveState({ ...getState(), examProgress: progress });
}

export function loadExamProgress(): ProgressState | null {
  return getState().examProgress;
}

export function clearExamProgress(): void {
  saveState({ ...getState(), examProgress: null });
}

export function saveExamResult(result: ExamResult): void {
  const state = getState();
  const wrongQuestionIds = new Set(state.wrongQuestionIds);
  result.answers.forEach((answer) => {
    if (answer.isCorrect) {
      wrongQuestionIds.delete(answer.questionId);
    } else {
      wrongQuestionIds.add(answer.questionId);
    }
  });

  saveState({
    ...state,
    attempts: [...state.attempts, ...result.answers],
    wrongQuestionIds: Array.from(wrongQuestionIds),
    examProgress: null,
    examResults: [result, ...state.examResults].slice(0, 10),
  });
}

export function clearAllStudyData(): void {
  saveState(defaultState);
}

import rawQuestions from "../data/questions.json";
import type { Question } from "../types";

export const questions = rawQuestions as Question[];

export function getQuestionById(questionId: string): Question | undefined {
  return questions.find((question) => question.id === questionId);
}

export function getWrongQuestions(questionIds: string[]): Question[] {
  const wrongIdSet = new Set(questionIds);
  return questions.filter((question) => wrongIdSet.has(question.id));
}

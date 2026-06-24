import rawQuestions from "../data/questions.json";
import type { PracticeSourceFilter, Question } from "../types";

export const questions = rawQuestions as Question[];
export const ALL_TAGS = "all";
export const DEFAULT_PRACTICE_ROUND_SIZE = 20;

export function getQuestionById(questionId: string): Question | undefined {
  return questions.find((question) => question.id === questionId);
}

export function getWrongQuestions(questionIds: string[]): Question[] {
  const wrongIdSet = new Set(questionIds);
  return questions.filter((question) => wrongIdSet.has(question.id));
}

export function getAllTags(): string[] {
  return Array.from(new Set(questions.flatMap((question) => question.tags ?? []))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getTagsForSource(sourceFilter: PracticeSourceFilter): string[] {
  const sourceQuestions =
    sourceFilter === "mixed" ? questions : questions.filter((question) => question.sourceType === sourceFilter);
  return Array.from(new Set(sourceQuestions.flatMap((question) => question.tags ?? []))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getQuestionsByTag(tag: string): Question[] {
  if (tag === ALL_TAGS) {
    return questions;
  }
  return questions.filter((question) => question.tags?.includes(tag));
}

export function getQuestionsForPractice(tag: string, sourceFilter: PracticeSourceFilter): Question[] {
  return getQuestionsByTag(tag).filter((question) => {
    if (sourceFilter === "mixed") {
      return true;
    }
    return question.sourceType === sourceFilter;
  });
}

export function getQuestionSourceCounts() {
  return {
    pastExam: questions.filter((question) => question.sourceType === "past-exam").length,
    selfTest: questions.filter((question) => question.sourceType === "self-test").length,
  };
}

export function buildBalancedQuestionOrder(pool: Question[], roundSize = pool.length): string[] {
  const groups = new Map<string, Question[]>();
  pool.forEach((question) => {
    const key = question.topic || "Uncategorized";
    groups.set(key, [...(groups.get(key) ?? []), question]);
  });

  const shuffledGroups = shuffle(Array.from(groups.values()).map((group) => shuffle(group)));
  const order: string[] = [];
  let hasRemaining = true;

  while (hasRemaining) {
    hasRemaining = false;
    shuffledGroups.forEach((group) => {
      const nextQuestion = group.shift();
      if (nextQuestion) {
        order.push(nextQuestion.id);
        hasRemaining = true;
      }
    });
  }

  return order.slice(0, Math.max(0, Math.min(roundSize, order.length)));
}

export function isUsableQuestionOrder(order: string[] | undefined, pool: Question[], roundSize: number): order is string[] {
  const expectedLength = Math.max(0, Math.min(roundSize, pool.length));
  if (!order?.length || order.length !== expectedLength) {
    return false;
  }
  const poolIds = new Set(pool.map((question) => question.id));
  return order.every((questionId) => poolIds.has(questionId)) && new Set(order).size === poolIds.size;
}

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

import rawQuestions from "../data/questions.json";
import type { Question } from "../types";

export const questions = rawQuestions as Question[];
export const ALL_TAGS = "all";

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

export function getQuestionsByTag(tag: string): Question[] {
  if (tag === ALL_TAGS) {
    return questions;
  }
  return questions.filter((question) => question.tags?.includes(tag));
}

export function buildBalancedQuestionOrder(pool: Question[]): string[] {
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

  return order;
}

export function isUsableQuestionOrder(order: string[] | undefined, pool: Question[]): order is string[] {
  if (!order?.length || order.length !== pool.length) {
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

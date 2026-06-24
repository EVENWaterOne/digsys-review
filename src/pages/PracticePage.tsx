import { useEffect, useMemo, useState } from "react";
import { QuestionCard } from "../components/QuestionCard";
import {
  ALL_TAGS,
  DEFAULT_PRACTICE_ROUND_SIZE,
  buildBalancedQuestionOrder,
  getQuestionSourceCounts,
  getQuestionById,
  getQuestionsForPractice,
  getTagsForSource,
  isUsableQuestionOrder,
} from "../lib/questions";
import { loadPracticeProgress, recordAttempt, savePracticeProgress } from "../lib/storage";
import type { PracticeSourceFilter, Question } from "../types";
import type { RouteKey } from "../routing";

interface PracticePageProps {
  onNavigate: (route: RouteKey) => void;
}

export function PracticePage({ onNavigate }: PracticePageProps) {
  const storedProgress = loadPracticeProgress();
  const initialTag = getSafeInitialTag(storedProgress?.activeTag);
  const initialSourceFilter = getSafeInitialSourceFilter(storedProgress?.sourceFilter);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [sourceFilter, setSourceFilter] = useState<PracticeSourceFilter>(initialSourceFilter);
  const initialPool = useMemo(() => getQuestionsForPractice(initialTag, initialSourceFilter), [initialTag, initialSourceFilter]);
  const [roundSize, setRoundSize] = useState(() => getSafeRoundSize(storedProgress?.roundSize, initialPool.length));
  const [questionOrder, setQuestionOrder] = useState(() =>
    buildInitialOrder(storedProgress?.questionOrder, initialPool, roundSize),
  );
  const [currentIndex, setCurrentIndex] = useState(() => getInitialIndex(storedProgress, questionOrder));
  const [selectedByQuestionId, setSelectedByQuestionId] = useState<Record<string, string[]>>(
    storedProgress?.selectedByQuestionId ?? {},
  );
  const [completedQuestionIds, setCompletedQuestionIds] = useState<Set<string>>(
    () => new Set(storedProgress?.completedQuestionIds ?? []),
  );
  const [skipWarning, setSkipWarning] = useState("");

  const availableTags = useMemo(() => getTagsForSource(sourceFilter), [sourceFilter]);
  const sourceCounts = useMemo(() => getQuestionSourceCounts(), []);
  const pool = useMemo(() => getQuestionsForPractice(activeTag, sourceFilter), [activeTag, sourceFilter]);
  const orderedQuestions = useMemo(() => getOrderedQuestions(questionOrder, pool, roundSize), [questionOrder, pool, roundSize]);
  const safeIndex = Math.min(currentIndex, Math.max(orderedQuestions.length - 1, 0));
  const question = orderedQuestions[safeIndex];
  const selectedOptionIds = selectedByQuestionId[question.id] ?? [];
  const isSubmitted = completedQuestionIds.has(question.id);
  const completedInPool = orderedQuestions.filter((item) => completedQuestionIds.has(item.id)).length;
  const roundIsComplete = orderedQuestions.length > 0 && completedInPool === orderedQuestions.length;

  useEffect(() => {
    savePracticeProgress({
      currentIndex: safeIndex,
      currentQuestionId: question.id,
      questionOrder,
      completedQuestionIds: Array.from(completedQuestionIds),
      activeTag,
      sourceFilter,
      roundSize,
      selectedByQuestionId,
      updatedAt: new Date().toISOString(),
    });
  }, [activeTag, completedQuestionIds, question.id, questionOrder, roundSize, safeIndex, selectedByQuestionId, sourceFilter]);

  function toggleOption(optionId: string) {
    if (isSubmitted) {
      return;
    }
    setSelectedByQuestionId((prev) => {
      const current = prev[question.id] ?? [];
      const next =
        question.mode === "single"
          ? [optionId]
          : current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId];
      return { ...prev, [question.id]: next };
    });
  }

  function submitAnswer() {
    if (selectedOptionIds.length === 0 || isSubmitted) {
      return;
    }
    recordAttempt(question, selectedOptionIds, "practice");
    setCompletedQuestionIds((prev) => new Set(prev).add(question.id));
    setSkipWarning("");
  }

  function goTo(nextIndex: number) {
    if (!confirmLeaveCurrentQuestion()) {
      return;
    }
    setCurrentIndex(Math.max(0, Math.min(orderedQuestions.length - 1, nextIndex)));
    setSkipWarning("");
  }

  function nextQuestion() {
    if (roundIsComplete && safeIndex === orderedQuestions.length - 1) {
      startNewRound();
      return;
    }
    goTo(safeIndex + 1);
  }

  function startNewRound() {
    const nextOrder = buildBalancedQuestionOrder(pool, roundSize);
    setQuestionOrder(nextOrder);
    setCurrentIndex(0);
    setCompletedQuestionIds(new Set());
    setSkipWarning("");
  }

  function changeTag(nextTag: string) {
    if (nextTag === activeTag) {
      return;
    }
    if (!confirmLeaveCurrentQuestion()) {
      return;
    }
    resetRound(nextTag, sourceFilter, roundSize);
  }

  function changeSourceFilter(nextSourceFilter: PracticeSourceFilter) {
    if (nextSourceFilter === sourceFilter) {
      return;
    }
    if (!confirmLeaveCurrentQuestion()) {
      return;
    }
    const nextTag = getQuestionsForPractice(activeTag, nextSourceFilter).length > 0 ? activeTag : ALL_TAGS;
    resetRound(nextTag, nextSourceFilter, roundSize);
  }

  function changeRoundSize(nextRoundSize: number) {
    if (!confirmLeaveCurrentQuestion()) {
      return;
    }
    resetRound(activeTag, sourceFilter, nextRoundSize);
  }

  function startAllPastExamRound() {
    if (!confirmLeaveCurrentQuestion()) {
      return;
    }
    resetRound(ALL_TAGS, "past-exam", sourceCounts.pastExam);
  }

  function resetRound(nextTag: string, nextSourceFilter: PracticeSourceFilter, requestedRoundSize: number) {
    const nextPool = getQuestionsForPractice(nextTag, nextSourceFilter);
    const nextRoundSize = getSafeRoundSize(requestedRoundSize, nextPool.length);
    setActiveTag(nextTag);
    setSourceFilter(nextSourceFilter);
    setRoundSize(nextRoundSize);
    setQuestionOrder(buildBalancedQuestionOrder(nextPool, nextRoundSize));
    setCurrentIndex(0);
    setCompletedQuestionIds(new Set());
    setSkipWarning("");
  }

  function confirmLeaveCurrentQuestion(): boolean {
    if (isSubmitted || selectedOptionIds.length === 0) {
      return true;
    }

    const message = "这题已经选择了答案但还没有提交。现在跳过会保留选择，但不会记录对错，也不会显示解析。确定跳过吗？";
    const confirmed = window.confirm(message);
    setSkipWarning(confirmed ? "" : "请先提交本题，或再次确认后再跳过。");
    return confirmed;
  }

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">练习模式</p>
          <h1>均衡随机抽题，提交后立即看解析</h1>
        </div>
        <span className="progress-pill">
          本轮 {completedInPool} / {orderedQuestions.length}
        </span>
      </div>

      <div className="practice-controls">
        <label>
          标签筛选
          <select value={activeTag} onChange={(event) => changeTag(event.target.value)}>
            <option value={ALL_TAGS}>全部标签</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
        <label>
          题目来源
          <select value={sourceFilter} onChange={(event) => changeSourceFilter(event.target.value as PracticeSourceFilter)}>
            <option value="past-exam">只做历年题</option>
            <option value="mixed">历年题 + 自出题</option>
            <option value="self-test">只做自出题</option>
          </select>
        </label>
        <label>
          本轮题数
          <input
            max={Math.max(pool.length, 1)}
            min={1}
            onChange={(event) => changeRoundSize(Number(event.target.value))}
            type="number"
            value={roundSize}
          />
        </label>
        <button className="secondary-button" onClick={startAllPastExamRound} type="button">
          全历年题一轮
        </button>
        <button className="secondary-button" onClick={startNewRound} type="button">
          重新随机一轮
        </button>
        <button className="secondary-button" onClick={() => onNavigate("home")} type="button">
          保存并退出
        </button>
      </div>

      {skipWarning ? <p className="inline-alert">{skipWarning}</p> : null}

      <QuestionCard
        question={question}
        selectedOptionIds={selectedOptionIds}
        revealAnswer={isSubmitted}
        onToggleOption={toggleOption}
      />

      <div className="toolbar">
        <button className="secondary-button" disabled={safeIndex === 0} onClick={() => goTo(safeIndex - 1)} type="button">
          上一题
        </button>
        <button className="primary-button" disabled={selectedOptionIds.length === 0 || isSubmitted} onClick={submitAnswer} type="button">
          提交
        </button>
        <button className="secondary-button" onClick={nextQuestion} type="button">
          {roundIsComplete && safeIndex === orderedQuestions.length - 1 ? "新一轮随机" : "下一题"}
        </button>
      </div>
    </section>
  );
}

function buildInitialOrder(savedOrder: string[] | undefined, pool: Question[], roundSize: number): string[] {
  if (isUsableQuestionOrder(savedOrder, pool, roundSize)) {
    return savedOrder;
  }
  return buildBalancedQuestionOrder(pool, roundSize);
}

function getSafeInitialTag(savedTag: string | undefined): string {
  if (!savedTag || savedTag === ALL_TAGS) {
    return ALL_TAGS;
  }
  return getQuestionsForPractice(savedTag, "mixed").length > 0 ? savedTag : ALL_TAGS;
}

function getSafeInitialSourceFilter(savedSourceFilter: PracticeSourceFilter | undefined): PracticeSourceFilter {
  return savedSourceFilter && ["past-exam", "mixed", "self-test"].includes(savedSourceFilter) ? savedSourceFilter : "past-exam";
}

function getSafeRoundSize(requestedRoundSize: number | undefined, poolSize: number): number {
  if (poolSize <= 0) {
    return 0;
  }
  const fallback = Math.min(DEFAULT_PRACTICE_ROUND_SIZE, poolSize);
  const requested = Number.isFinite(requestedRoundSize) ? Math.floor(Number(requestedRoundSize)) : fallback;
  return Math.max(1, Math.min(requested, poolSize));
}

function getInitialIndex(
  progress: ReturnType<typeof loadPracticeProgress>,
  questionOrder: string[],
): number {
  if (!progress) {
    return 0;
  }
  if (progress.currentQuestionId) {
    const savedQuestionIndex = questionOrder.indexOf(progress.currentQuestionId);
    if (savedQuestionIndex >= 0) {
      return savedQuestionIndex;
    }
  }
  return Math.max(0, Math.min(questionOrder.length - 1, progress.currentIndex ?? 0));
}

function getOrderedQuestions(questionOrder: string[], pool: Question[], roundSize: number): Question[] {
  const poolIds = new Set(pool.map((question) => question.id));
  const ordered = questionOrder
    .map((questionId) => getQuestionById(questionId))
    .filter((question): question is Question => question !== undefined && poolIds.has(question.id));

  if (ordered.length === questionOrder.length && ordered.length > 0) {
    return ordered;
  }

  const fallbackIds = new Set(buildBalancedQuestionOrder(pool, roundSize));
  return pool.filter((question) => fallbackIds.has(question.id));
}

import { useEffect, useState } from "react";
import { QuestionCard } from "../components/QuestionCard";
import { questions } from "../lib/questions";
import { loadPracticeProgress, recordAttempt, savePracticeProgress } from "../lib/storage";

export function PracticePage() {
  const storedProgress = loadPracticeProgress();
  const [currentIndex, setCurrentIndex] = useState(storedProgress?.currentIndex ?? 0);
  const [selectedByQuestionId, setSelectedByQuestionId] = useState<Record<string, string[]>>(
    storedProgress?.selectedByQuestionId ?? {},
  );
  const [submittedQuestionIds, setSubmittedQuestionIds] = useState<Set<string>>(new Set());

  const question = questions[currentIndex];
  const selectedOptionIds = selectedByQuestionId[question.id] ?? [];
  const isSubmitted = submittedQuestionIds.has(question.id);

  useEffect(() => {
    savePracticeProgress({
      currentIndex,
      selectedByQuestionId,
      updatedAt: new Date().toISOString(),
    });
  }, [currentIndex, selectedByQuestionId]);

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
    if (selectedOptionIds.length === 0) {
      return;
    }
    recordAttempt(question, selectedOptionIds, "practice");
    setSubmittedQuestionIds((prev) => new Set(prev).add(question.id));
  }

  function goTo(nextIndex: number) {
    setCurrentIndex(Math.max(0, Math.min(questions.length - 1, nextIndex)));
  }

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">练习模式</p>
          <h1>提交后立即查看答案和解析</h1>
        </div>
        <span className="progress-pill">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <QuestionCard
        question={question}
        selectedOptionIds={selectedOptionIds}
        revealAnswer={isSubmitted}
        onToggleOption={toggleOption}
      />

      <div className="toolbar">
        <button className="secondary-button" disabled={currentIndex === 0} onClick={() => goTo(currentIndex - 1)} type="button">
          上一题
        </button>
        <button className="primary-button" disabled={selectedOptionIds.length === 0 || isSubmitted} onClick={submitAnswer} type="button">
          提交
        </button>
        <button
          className="secondary-button"
          disabled={currentIndex === questions.length - 1}
          onClick={() => goTo(currentIndex + 1)}
          type="button"
        >
          下一题
        </button>
      </div>
    </section>
  );
}

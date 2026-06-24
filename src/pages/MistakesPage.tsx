import { useState } from "react";
import { QuestionCard } from "../components/QuestionCard";
import { getWrongQuestions } from "../lib/questions";
import { getState, recordAttempt } from "../lib/storage";

export function MistakesPage() {
  const wrongQuestions = getWrongQuestions(getState().wrongQuestionIds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedByQuestionId, setSelectedByQuestionId] = useState<Record<string, string[]>>({});
  const [submittedQuestionIds, setSubmittedQuestionIds] = useState<Set<string>>(new Set());

  if (wrongQuestions.length === 0) {
    return (
      <section className="empty-state">
        <p className="eyebrow">错题页面</p>
        <h1>暂时没有错题</h1>
        <p>练习或考试答错后，题目会自动出现在这里。</p>
      </section>
    );
  }

  const question = wrongQuestions[Math.min(currentIndex, wrongQuestions.length - 1)];
  const selectedOptionIds = selectedByQuestionId[question.id] ?? [];
  const isSubmitted = submittedQuestionIds.has(question.id);

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

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">错题页面</p>
          <h1>集中处理最近答错的题</h1>
        </div>
        <span className="progress-pill">
          {currentIndex + 1} / {wrongQuestions.length}
        </span>
      </div>

      <QuestionCard
        question={question}
        selectedOptionIds={selectedOptionIds}
        revealAnswer={isSubmitted}
        onToggleOption={toggleOption}
      />

      <div className="toolbar">
        <button className="secondary-button" disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)} type="button">
          上一题
        </button>
        <button className="primary-button" disabled={selectedOptionIds.length === 0 || isSubmitted} onClick={submitAnswer} type="button">
          提交
        </button>
        <button
          className="secondary-button"
          disabled={currentIndex === wrongQuestions.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}
          type="button"
        >
          下一题
        </button>
      </div>
    </section>
  );
}

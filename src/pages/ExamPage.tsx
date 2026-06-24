import { useEffect, useState } from "react";
import { QuestionCard } from "../components/QuestionCard";
import { questions } from "../lib/questions";
import { clearExamProgress, loadExamProgress, saveExamProgress, saveExamResult, selectionsMatch } from "../lib/storage";
import type { AttemptRecord, ExamResult } from "../types";
import type { RouteKey } from "../routing";

interface ExamPageProps {
  onNavigate: (route: RouteKey) => void;
}

export function ExamPage({ onNavigate }: ExamPageProps) {
  const storedProgress = loadExamProgress();
  const [currentIndex, setCurrentIndex] = useState(storedProgress?.currentIndex ?? 0);
  const [selectedByQuestionId, setSelectedByQuestionId] = useState<Record<string, string[]>>(
    storedProgress?.selectedByQuestionId ?? {},
  );

  const question = questions[currentIndex];
  const selectedOptionIds = selectedByQuestionId[question.id] ?? [];
  const answeredCount = questions.filter((item) => (selectedByQuestionId[item.id] ?? []).length > 0).length;

  useEffect(() => {
    saveExamProgress({
      currentIndex,
      selectedByQuestionId,
      updatedAt: new Date().toISOString(),
    });
  }, [currentIndex, selectedByQuestionId]);

  function toggleOption(optionId: string) {
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

  function finishExam() {
    const answers: AttemptRecord[] = questions.map((item) => {
      const selected = selectedByQuestionId[item.id] ?? [];
      return {
        questionId: item.id,
        selectedOptionIds: selected,
        correctOptionIds: item.correctOptionIds,
        isCorrect: selectionsMatch(selected, item.correctOptionIds),
        mode: "exam",
        answeredAt: new Date().toISOString(),
      };
    });
    const correct = answers.filter((answer) => answer.isCorrect).length;
    const result: ExamResult = {
      id: crypto.randomUUID(),
      total: questions.length,
      correct,
      score: Math.round((correct / questions.length) * 100),
      finishedAt: new Date().toISOString(),
      answers,
    };

    saveExamResult(result);
    clearExamProgress();
    onNavigate("results");
  }

  function resetExam() {
    setCurrentIndex(0);
    setSelectedByQuestionId({});
    clearExamProgress();
  }

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">模拟考试</p>
          <h1>全部完成后统一判分</h1>
        </div>
        <span className="progress-pill">
          已答 {answeredCount} / {questions.length}
        </span>
      </div>

      <QuestionCard question={question} selectedOptionIds={selectedOptionIds} onToggleOption={toggleOption} />

      <div className="toolbar">
        <button className="secondary-button" disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)} type="button">
          上一题
        </button>
        <button
          className="secondary-button"
          disabled={currentIndex === questions.length - 1}
          onClick={() => setCurrentIndex(currentIndex + 1)}
          type="button"
        >
          下一题
        </button>
        <button className="secondary-button" onClick={resetExam} type="button">
          重新开始
        </button>
        <button className="primary-button" disabled={answeredCount === 0} onClick={finishExam} type="button">
          交卷
        </button>
      </div>
    </section>
  );
}

import { useMemo, useState } from "react";
import { MathText } from "../components/MathText";
import { QuestionCard } from "../components/QuestionCard";
import { studyModules } from "../data/studyModules";
import { questions } from "../lib/questions";
import { recordAttempt } from "../lib/storage";
import type { Question } from "../types";

export function StudyPage() {
  const [activeModuleId, setActiveModuleId] = useState(studyModules[0].id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedByQuestionId, setSelectedByQuestionId] = useState<Record<string, string[]>>({});
  const [submittedQuestionIds, setSubmittedQuestionIds] = useState<Set<string>>(new Set());

  const activeModule = studyModules.find((module) => module.id === activeModuleId) ?? studyModules[0];
  const moduleQuestions = useMemo(() => getModuleQuestions(activeModule.questionTags), [activeModule]);
  const question = moduleQuestions[Math.min(currentQuestionIndex, Math.max(moduleQuestions.length - 1, 0))];
  const selectedOptionIds = question ? selectedByQuestionId[question.id] ?? [] : [];
  const isSubmitted = question ? submittedQuestionIds.has(question.id) : false;

  function switchModule(moduleId: string) {
    setActiveModuleId(moduleId);
    setCurrentQuestionIndex(0);
  }

  function toggleOption(optionId: string) {
    if (!question || isSubmitted) {
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
    if (!question || selectedOptionIds.length === 0 || isSubmitted) {
      return;
    }
    recordAttempt(question, selectedOptionIds, "practice");
    setSubmittedQuestionIds((prev) => new Set(prev).add(question.id));
  }

  function goToQuestion(nextIndex: number) {
    setCurrentQuestionIndex(Math.max(0, Math.min(moduleQuestions.length - 1, nextIndex)));
  }

  return (
    <section className="study-layout">
      <aside className="study-sidebar" aria-label="学习知识点">
        <p className="eyebrow">Study Mode</p>
        <h1>Learn by knowledge point</h1>
        <div className="study-module-list">
          {studyModules.map((module) => (
            <button
              className={module.id === activeModule.id ? "study-module-active" : ""}
              key={module.id}
              onClick={() => switchModule(module.id)}
              type="button"
            >
              <span>{module.priority}</span>
              <strong>{module.title}</strong>
              <small>{module.lectureRefs.join(" / ")}</small>
            </button>
          ))}
        </div>
      </aside>

      <div className="study-content">
        <article className="study-card">
          <div className="study-heading">
            <div>
              <p className="eyebrow">English concept brief</p>
              <h2>{activeModule.title}</h2>
            </div>
            <span className="progress-pill">Priority {activeModule.priority}</span>
          </div>

          <div className="reference-row">
            {activeModule.lectureRefs.map((ref) => (
              <span key={ref}>{ref}</span>
            ))}
            {activeModule.focusRefs.map((ref) => (
              <span key={ref}>{ref}</span>
            ))}
          </div>

          <p className="study-summary">
            <MathText text={activeModule.summary} inline />
          </p>

          <section className="study-section">
            <h3>Key ideas</h3>
            <ul>
              {activeModule.keyPoints.map((point) => (
                <li key={point}>
                  <MathText text={point} inline />
                </li>
              ))}
            </ul>
          </section>

          <section className="study-section">
            <h3>Worked example</h3>
            <p>
              <MathText text={activeModule.workedExample} inline />
            </p>
          </section>

          <section className="study-section">
            <h3>Common traps</h3>
            <ul>
              {activeModule.commonTraps.map((trap) => (
                <li key={trap}>{trap}</li>
              ))}
            </ul>
          </section>
        </article>

        <section className="page-stack">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Practice after learning</p>
              <h1>Questions for this knowledge point</h1>
            </div>
            <span className="progress-pill">
              {moduleQuestions.length === 0 ? 0 : currentQuestionIndex + 1} / {moduleQuestions.length}
            </span>
          </div>

          {question ? (
            <>
              <QuestionCard
                question={question}
                selectedOptionIds={selectedOptionIds}
                revealAnswer={isSubmitted}
                onToggleOption={toggleOption}
              />

              <div className="toolbar">
                <button
                  className="secondary-button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  type="button"
                >
                  上一题
                </button>
                <button
                  className="primary-button"
                  disabled={selectedOptionIds.length === 0 || isSubmitted}
                  onClick={submitAnswer}
                  type="button"
                >
                  提交
                </button>
                <button
                  className="secondary-button"
                  disabled={currentQuestionIndex >= moduleQuestions.length - 1}
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  type="button"
                >
                  下一题
                </button>
              </div>
            </>
          ) : (
            <section className="empty-state compact">
              <h2>No questions matched this module yet</h2>
              <p>题库补充后，这个知识点会自动显示相关练习题。</p>
            </section>
          )}
        </section>
      </div>
    </section>
  );
}

function getModuleQuestions(tags: string[]): Question[] {
  const tagSet = new Set(tags);
  return questions.filter((question) => question.tags.some((tag) => tagSet.has(tag)));
}

import type { Question } from "../types";
import { MathText } from "./MathText";

interface QuestionCardProps {
  question: Question;
  selectedOptionIds: string[];
  revealAnswer?: boolean;
  onToggleOption: (optionId: string) => void;
}

export function QuestionCard({ question, selectedOptionIds, revealAnswer = false, onToggleOption }: QuestionCardProps) {
  const selectedSet = new Set(selectedOptionIds);
  const correctSet = new Set(question.correctOptionIds);

  return (
    <article className="question-card">
      <div className="question-meta">
        <span>{question.topic}</span>
        <span>{question.mode === "single" ? "单选" : "多选"}</span>
        <span>{difficultyLabel[question.difficulty]}</span>
      </div>

      <h2>
        <MathText text={question.prompt} inline />
      </h2>

      {question.code ? <pre className="code-block"><code>{question.code}</code></pre> : null}

      {question.image ? (
        <figure className="question-image">
          <img src={question.image.src} alt={question.image.alt} />
        </figure>
      ) : null}

      <div className="option-list">
        {question.options.map((option) => {
          const isSelected = selectedSet.has(option.id);
          const isCorrect = correctSet.has(option.id);
          const statusClass = revealAnswer
            ? isCorrect
              ? "option-correct"
              : isSelected
                ? "option-wrong"
                : ""
            : "";

          return (
            <button
              className={`option-button ${isSelected ? "option-selected" : ""} ${statusClass}`}
              key={option.id}
              onClick={() => onToggleOption(option.id)}
              type="button"
            >
              <span className="option-key">{option.id}</span>
              <span>
                <MathText text={option.label} inline />
              </span>
            </button>
          );
        })}
      </div>

      {revealAnswer ? (
        <div className="answer-panel">
          <strong>答案：{question.correctOptionIds.join(", ")}</strong>
          <p>
            <MathText text={question.explanation} inline />
          </p>
        </div>
      ) : null}
    </article>
  );
}

const difficultyLabel: Record<Question["difficulty"], string> = {
  easy: "基础",
  medium: "中等",
  hard: "进阶",
};

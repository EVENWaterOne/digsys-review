import { useState } from "react";
import { getQuestionById } from "../lib/questions";
import { clearAllStudyData, getState } from "../lib/storage";

export function ResultsPage() {
  const [stateVersion, setStateVersion] = useState(0);
  const state = getState();
  const latestResult = state.examResults[0];
  const correctAttempts = state.attempts.filter((attempt) => attempt.isCorrect).length;
  const accuracy = state.attempts.length === 0 ? 0 : Math.round((correctAttempts / state.attempts.length) * 100);

  function clearData() {
    clearAllStudyData();
    setStateVersion((value) => value + 1);
  }

  return (
    <section className="page-stack" data-state-version={stateVersion}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">结果统计</p>
          <h1>本地记录概览</h1>
        </div>
        <button className="secondary-button" onClick={clearData} type="button">
          清空记录
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span>总答题次数</span>
          <strong>{state.attempts.length}</strong>
        </div>
        <div className="stat-card">
          <span>累计正确率</span>
          <strong>{accuracy}%</strong>
        </div>
        <div className="stat-card">
          <span>当前错题</span>
          <strong>{state.wrongQuestionIds.length}</strong>
        </div>
      </div>

      {latestResult ? (
        <article className="result-card">
          <div>
            <p className="eyebrow">最近一次模拟考试</p>
            <h2>{latestResult.score} 分</h2>
            <p>
              {latestResult.correct} / {latestResult.total} 题正确，
              {new Date(latestResult.finishedAt).toLocaleString()}
            </p>
          </div>
          <div className="result-list">
            {latestResult.answers.map((answer) => {
              const question = getQuestionById(answer.questionId);
              return (
                <div className="result-row" key={answer.questionId}>
                  <span>{answer.isCorrect ? "正确" : "错误"}</span>
                  <p>{question?.prompt ?? answer.questionId}</p>
                  <small>你的答案：{answer.selectedOptionIds.join(", ") || "未答"}</small>
                </div>
              );
            })}
          </div>
        </article>
      ) : (
        <section className="empty-state compact">
          <h2>还没有模拟考试结果</h2>
          <p>完成一次模拟考试后，这里会显示分数和逐题结果。</p>
        </section>
      )}
    </section>
  );
}

import { questions } from "../lib/questions";
import { getState } from "../lib/storage";
import type { RouteKey } from "../routing";

interface HomePageProps {
  onNavigate: (route: RouteKey) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const state = getState();

  return (
    <section className="page-stack">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">DigSys 多项选择题复习</p>
          <h1>用一个安静的界面，把选择题刷扎实。</h1>
          <p>
            当前第一版支持练习即时解析、模拟考试统一判分、错题回看、统计记录和本地进度保存。
          </p>
        </div>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => onNavigate("practice")} type="button">
            开始练习
          </button>
          <button className="secondary-button" onClick={() => onNavigate("exam")} type="button">
            模拟考试
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span>题目数量</span>
          <strong>{questions.length}</strong>
        </div>
        <div className="stat-card">
          <span>错题数量</span>
          <strong>{state.wrongQuestionIds.length}</strong>
        </div>
        <div className="stat-card">
          <span>答题记录</span>
          <strong>{state.attempts.length}</strong>
        </div>
      </div>
    </section>
  );
}

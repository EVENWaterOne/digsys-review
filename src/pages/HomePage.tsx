import { ALL_TAGS, getAllTags, getQuestionSourceCounts, questions } from "../lib/questions";
import { getState } from "../lib/storage";
import type { RouteKey } from "../routing";

interface HomePageProps {
  onNavigate: (route: RouteKey) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const state = getState();
  const tags = getAllTags();
  const sourceCounts = getQuestionSourceCounts();
  const practiceProgress = state.practiceProgress;
  const completedPracticeCount = practiceProgress?.completedQuestionIds?.length ?? 0;
  const practiceTotal = practiceProgress?.questionOrder?.length ?? questions.length;
  const practiceTag = practiceProgress?.activeTag === ALL_TAGS || !practiceProgress?.activeTag ? "全部标签" : practiceProgress.activeTag;
  const practiceSource = sourceLabel[practiceProgress?.sourceFilter ?? "past-exam"];

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
            {practiceProgress ? "继续练习" : "开始练习"}
          </button>
          <button className="secondary-button" onClick={() => onNavigate("exam")} type="button">
            模拟考试
          </button>
        </div>
      </div>

      {practiceProgress ? (
        <article className="resume-strip">
          <div>
            <span>已保存练习进度</span>
            <strong>
              {practiceSource} · {practiceTag} · 本轮 {completedPracticeCount} / {practiceTotal}
            </strong>
          </div>
          <button className="secondary-button" onClick={() => onNavigate("practice")} type="button">
            继续
          </button>
        </article>
      ) : null}

      <div className="stat-grid">
        <div className="stat-card">
          <span>题目总数</span>
          <strong>{questions.length}</strong>
        </div>
        <div className="stat-card">
          <span>历年题</span>
          <strong>{sourceCounts.pastExam}</strong>
        </div>
        <div className="stat-card">
          <span>自出题</span>
          <strong>{sourceCounts.selfTest}</strong>
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

      <section className="tag-cloud" aria-label="题库标签">
        {tags.slice(0, 18).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </section>
    </section>
  );
}

const sourceLabel = {
  "past-exam": "只做历年题",
  mixed: "历年题 + 自出题",
  "self-test": "只做自出题",
};

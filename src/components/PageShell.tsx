import type { ReactNode } from "react";
import type { RouteKey } from "../routing";

interface PageShellProps {
  route: RouteKey;
  onNavigate: (route: RouteKey) => void;
  children: ReactNode;
}

const navItems: Array<{ route: RouteKey; label: string }> = [
  { route: "home", label: "首页" },
  { route: "study", label: "学习" },
  { route: "practice", label: "练习" },
  { route: "exam", label: "模拟考试" },
  { route: "mistakes", label: "错题" },
  { route: "results", label: "统计" },
];

export function PageShell({ route, onNavigate, children }: PageShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => onNavigate("home")} type="button">
          <span className="brand-mark">DS</span>
          <span>
            <strong>DigSys Review</strong>
            <small>多项选择题复习</small>
          </span>
        </button>

        <nav aria-label="主导航">
          {navItems.map((item) => (
            <button
              className={route === item.route ? "nav-active" : ""}
              key={item.route}
              onClick={() => onNavigate(item.route)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}

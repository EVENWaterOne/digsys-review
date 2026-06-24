# Work Log

## 2026-06-24

- 确认项目目录：`D:\users\Documents\My Files\Use For Study\2026 Spring\DigSys\Review\WebReview`。
- 确认运行环境：Node `v24.14.0`，npm `11.9.0`。
- 创建 React + TypeScript + Vite 第一版项目结构。
- 将网页设计相关 CSS 放入 `src/design/base.css`。
- 将模拟题放入独立 JSON：`src/data/questions.json`。
- 加入文字题、代码题、图片题样例。
- 加入 localStorage 保存答题记录、错题、练习进度、考试进度和考试结果。
- 编写运行说明：`README.md`。
- 执行 `npm install` 安装依赖，生成 `package-lock.json`。
- 执行 `npm run build`；沙箱内首次因 `esbuild spawn EPERM` 失败，提权重跑后构建通过。
- 启动 Vite 开发服务：`http://127.0.0.1:5173/`。
- 使用 `Invoke-WebRequest http://127.0.0.1:5173/` 验证首页返回 HTTP 200。
- 整理 `package.json` 依赖分类后重新执行 `npm run build`，构建继续通过。
- 在 `WebReview` 目录初始化 Git 仓库，分支为 `master`。
- 清理一次残留的 0 字节 `.git/index.lock` 后完成初始提交。

## 2026-06-24 Code Block Display Fix

- 根据截图确认 Verilog 代码块中的 `~` 符号显示偏上。
- 原因：代码块继承页面中文 UI 字体，没有指定等宽代码字体。
- 修复：为 `.code-block` 增加 Cascadia Code / Consolas 等宽字体栈，并加入更稳定的行高和窄屏换行规则。
- 重新执行 `npm run build`，构建通过。

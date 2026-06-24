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

## 2026-06-24 KaTeX Formula Support

- 安装 `katex`，并在入口导入 KaTeX 样式。
- 新增 `src/components/MathText.tsx`，支持 `$...$` 行内公式和 `$$...$$` 块级公式。
- 将题干、选项、解析接入公式渲染。
- 将超出课程范围的 Verilog 样题替换为布尔表达式题：`$F = A\overline{B} + \overline{A}B$`。
- 保留代码题能力，新增更贴近课程后半段的 MIPS 指令片段题。
- 更新 README，说明 JSON 中 LaTeX 反斜杠需要写成双反斜杠。
- 重新执行 `npm run build`，构建通过。

## 2026-06-24 Past Exam Question Integration

- 检查 `PastExam/WebReview` 导入包：68 道选择题，2 张 past-exam 图片资源，无 schema 问题。
- 保留主项目 6 道模拟题，并追加 68 道 past-exam 选择题，合并后 `src/data/questions.json` 共 74 题。
- 复制图片资源到 `public/question-assets/past-exam/`。
- 修复 `MathText`，使 `\$` 这类字面量美元符号显示为 `$`，且不会触发 KaTeX 公式解析。
- 独立校验结果：74 题，导入题 68 题，字段/答案/图片路径问题数为 0。
- 重新执行 `npm run build`，构建通过；Vite 提示主 chunk 超过 500 kB，但不影响运行。

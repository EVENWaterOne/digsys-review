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

## 2026-06-24 Cloudflare Pages Deployment Preparation

- 检查部署目标结构：`WebReview` 是前端项目根目录，`src/data/questions.json` 是网页实际使用的题库，`PastExam` 目录继续作为原始往年试题和原始题库资料目录保留。
- 检查 `package.json`、`vite.config.ts`、路由和题库加载方式：项目为 React + TypeScript + Vite 纯前端应用，构建命令为 `npm run build`，输出目录为 `dist`。
- 确认 `vite.config.ts` 没有 GitHub Pages 专用仓库子路径 `base`，适合 Cloudflare Pages 根路径部署。
- 确认当前页面路由为 hash 路由，使用 `window.location.hash` 和 `hashchange`，没有使用后端路由、数据库或 Cloudflare Workers。
- 新增 `public/_redirects`，内容为 `/* /index.html 200`，用于 Cloudflare Pages 的前端路由 fallback。
- 更新 `.gitignore`，确保忽略 `node_modules`、`dist`、`.env`、`.env.local`、本地 dev server 日志和 TypeScript build info。
- 检查题库完整性：`src/data/questions.json` 修改前后均为 74 题；每题均保留 `options`、`correctOptionIds` 和 `explanation`；没有删除、缩写、概括、重新措辞或重新生成题目内容。
- 执行 `npm install`，依赖安装检查通过。
- 多次执行 `npm run build`，最终本地生产构建成功；Vite 仍提示主 chunk 超过 500 kB，但不影响部署。
- 创建本地提交 `1de2329 Prepare WebReview for Cloudflare Pages`，包含 `.gitignore` 和 `public/_redirects` 两个部署准备文件。
- 添加 GitHub 远程仓库 `https://github.com/EVENWaterOne/digsys-review.git`，将本地分支从 `master` 改名为 `main`，并推送到 `origin/main`，未使用 force push。
- 推送后检查：`main` 已跟踪 `origin/main`；没有发现 `node_modules`、`dist`、`.env`、`.env.local` 或常见密钥文件被 Git 跟踪。
- Cloudflare Pages 部署参数：GitHub 仓库 `EVENWaterOne/digsys-review`，Production branch `main`，Root directory `WebReview`，Framework preset `Vite`，Build command `npm run build`，Build output directory `dist`，不需要环境变量。
- 用户已在 Cloudflare Pages 完成部署。

## 2026-06-24 Practice Progress, Random Review, Tags, and Self-Test Bank

- 读取 `dev-server.log` / `dev-server.err.log`：Vite 服务曾正常启动，错误日志为空。
- 确认当前 Git 仓库位于 `WebReview` 子目录，外层 `Review` 不是 Git 仓库。
- 确认 `src/data/questions.json` 是应用实际读取的题库；原题库共 74 题，其中前 6 道 `ds-*` 为早期手写测试题，后 68 道来自 past exam 转换包。
- 按用户“删除测试题”的要求，移除所有旧 `ds-*` 早期测试题；保留 68 道 past-exam 选择题。
- 为题目 schema 增加 `tags`、`sourceType` 和可选 `note`：`past-exam` 用于历年题，`self-test` 用于根据复习重点生成的自出题。
- 为全部 past-exam 题补充标签，覆盖来源、topic、代码追踪、cycle counting、pipeline、Game Boy、MIPS、FSM、K-map 等分类。
- 根据 `PastExam/DigSys_Exam_Focus_Complete.md` 新增 9 道明确标注的 self-test 题，覆盖 GBz80 flags、cycle counting、FSM state bits、K-map、MIPS branch addressing、pipeline load-use hazard、Game Boy memory map、setup timing 和 two's-complement overflow。
- 每道 self-test 题均包含 `self-test` 标签、`note` 来源说明和详细英文解析。
- 将练习模式改为按 topic 分组的均衡随机队列：同一轮题目不重复，刷完当前筛选范围后再生成新一轮随机顺序；不同 topic 会轮流穿插，避免连续集中刷单一知识点。
- 练习进度现在保存 `currentQuestionId`、`questionOrder`、`completedQuestionIds`、`activeTag` 和用户选择，支持中途“保存并退出”后从首页继续。
- 练习模式在用户已选择但未提交时点击上一题、下一题或切换标签，会弹出确认提示并显示页面内提醒，避免无意跳过未判分题目。
- 首页新增已保存练习进度提示和题库标签云；题卡新增来源标记与标签展示。
- 独立题库校验通过：77 题、9 道 self-test、无重复 ID、答案均存在于选项中、图片路径存在、self-test 均有英文解析与来源 note。
- 执行 `npm run build`：沙箱内普通运行仍因 `esbuild spawn EPERM` 失败；按既有记录提权重跑后构建通过。Vite 仍提示主 chunk 超过 500 kB，但不影响部署。

## 2026-06-24 Practice Round Source Separation and Larger Self-Test Set

- 根据用户反馈继续调整练习模式：网页中不再默认把所有题目放进同一轮，而是引入独立的练习轮次设置。
- 新增 `PracticeSourceFilter`：练习模式可选 `只做历年题`、`历年题 + 自出题`、`只做自出题`。
- 新增每轮题目数量设置，默认最多 20 题；用户可输入本轮数量，也可点击 `全历年题一轮` 生成 68 道 past-exam-only 轮次。
- 题目队列现在只从当前来源、标签和题量范围内生成；队列仍按 topic 分组均衡穿插，同一轮不重复。
- 保存练习进度时新增 `sourceFilter` 和 `roundSize`，因此保存退出后能恢复同一轮来源、标签、题量和当前题。
- 标签下拉会根据当前题目来源范围动态变化，避免选择到没有题目的来源/标签组合。
- 首页统计拆分为题目总数、历年题数量和自出题数量；保存进度提示也显示当前来源模式。
- 继续根据 `DigSys_Exam_Focus_Complete.md` 新增 12 道不超纲 self-test 题，覆盖 GBz80 wrap-around、CP flags、instruction encoding、CALL/RET stack、VBlank/VRAM、Moore/Mealy、hold constraint、memory capacity、ALU control bits、single-cycle MIPS、multi-cycle MIPS 和 ideal pipeline cycles。
- 当前题库变为 89 题：68 道 past-exam 题 + 21 道 self-test 题。
- 独立题库校验通过：89 题、21 道 self-test、无重复 ID、答案均存在于选项中、图片路径存在、self-test 均有英文解析与来源 note。
- 执行 `npm run build`：提权构建通过；Vite 仍提示主 chunk 超过 500 kB，但不影响 Cloudflare Pages 部署。

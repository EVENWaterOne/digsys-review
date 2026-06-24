# DigSys Review

一个用于 DigSys 多项选择题复习的 React + TypeScript + Vite 前端第一版。

## 功能

- 首页、练习页面、模拟考试页面、错题页面、结果统计页面
- 支持单选题和多选题
- 题目从 `src/data/questions.json` 读取
- 练习模式提交后立即显示答案和解析
- 考试模式最后统一判分
- 使用 localStorage 保存答题记录、错题、练习进度和考试进度
- 支持文字题、代码题和图片题
- 响应式布局，适配电脑、平板和手机

## 运行

```powershell
npm install
npm run dev
```

然后打开终端显示的本地地址，通常是：

```text
http://127.0.0.1:5173/
```

## 构建检查

```powershell
npm run build
```

## 项目结构

```text
WebReview/
  public/question-assets/      # 图片题资源
  src/components/              # 复用组件
  src/data/questions.json      # 独立题库 JSON
  src/design/                  # 网页视觉设计相关文件
  src/lib/                     # 题库读取与 localStorage 逻辑
  src/pages/                   # 首页、练习、考试、错题、统计页面
  src/App.tsx
  src/main.tsx
```

## 扩展题库

在 `src/data/questions.json` 中追加题目即可。题目结构示例：

```json
{
  "id": "unique-id",
  "topic": "Boolean Algebra",
  "difficulty": "easy",
  "mode": "single",
  "contentType": "text",
  "prompt": "题干",
  "options": [
    { "id": "A", "label": "选项 A" },
    { "id": "B", "label": "选项 B" }
  ],
  "correctOptionIds": ["A"],
  "explanation": "解析"
}
```

图片题可把图片放在 `public/question-assets/`，然后在 JSON 中使用 `/question-assets/文件名`。

# Contributing to ConvertLab

Thanks for wanting to contribute! This doc covers everything you need to add a tool, fix a bug, or improve the project.

---

## Getting Started

```bash
git clone https://github.com/Amatias13/ConvertLab
cd ConvertLab
npm install
npm run dev
```

---

## Adding a New Tool

Every tool lives in `src/features/`. Follow these steps exactly:

### 1. Create the component

```
src/features/YourTool.jsx
```

Use an existing tool as a reference (e.g. `UrlTool.jsx` for input/output, `UuidTool.jsx` for generators). Wrap everything in `<div className="tool-wrap">` and use the shared UI primitives from `src/components/UI.jsx` (`ToolHeader`, `Panels`, `CodeArea`, `Btn`, etc.).

### 2. Register it in `src/data/tools.js`

```js
{
  id: "yourtool",          // unique slug, lowercase, no spaces
  name: "Your Tool",
  desc: "One-line description",
  category: "data",        // ai | data | preview | text | generators | converters | media
  icon: "🔧",
  keywords: ["keyword1", "keyword2"],
}
```

### 3. Export from `src/features/index.js`

```js
export { default as YourTool } from "./YourTool";
```

### 4. Add to the tool map in `src/App.jsx`

```js
import { ..., YourTool } from "./features";
const TOOL_MAP = { ..., yourtool: YourTool };
```

### 5. Write tests

Add `src/__tests__/features/YourTool.test.js` with at minimum:
- Renders without crashing
- Core transform logic (pure functions extracted to helpers if possible)

---

## Project Structure

```
src/
├── __tests__/          # Vitest unit tests (mirrors src/ structure)
├── components/         # Shared UI primitives
├── constants/          # app.js, theme.js, tools.js — static data only
├── context/            # React contexts (App, Theme, Profile, Notifications)
├── data/               # Runtime data (tools list, about content)
├── features/           # One file per tool
├── helpers/            # Pure utility functions (color, diff, profile, util)
├── hooks/              # Custom React hooks
├── modules/            # Composite page sections (Header, Sidebar, modals)
└── services/           # External API wrappers (pollinations, feedback)
```

---

## Code Conventions

- **Pure helpers go in `src/helpers/`** — no React imports, no side effects, fully testable.
- **No `console.log` in production code.** The ESLint config will warn on these.
- **No inline styles for colours** — use CSS variables (`var(--accent)`, `var(--bg2)`, etc.).
- **No `dangerouslySetInnerHTML` without sanitization** — see `EmailTool.jsx` for the pattern.
- **Escape key must close modals** — handled globally in `useKeyboardShortcuts`.
- Component files use `.jsx`, pure JS files use `.js`.
- Prefer `useCallback` for functions passed as props or used in `useEffect` deps.

---

## Running Tests

```bash
npm test           # run once
npm run test:watch # watch mode
npm run coverage   # coverage report
```

Tests live in `src/__tests__/` and mirror the `src/` folder structure.

---

## Pull Request Checklist

- [ ] `npm run lint` passes with no new warnings
- [ ] `npm test` passes
- [ ] New tool follows the registration steps above
- [ ] No hardcoded colour values (use CSS vars)
- [ ] No `console.log` left in
- [ ] README tool table updated if adding a new tool

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/Amatias13/ConvertLab/issues) with:
- Steps to reproduce
- Expected vs actual behaviour
- Browser + OS

For security issues, see [SECURITY.md](./SECURITY.md).

---
paths:
  - "src/**/*.{ts,tsx,css}"
  - "index.html"
  - "vite.config.*"
  - "tailwind.config.*"
---

# React + Vite + Tailwind rules

- Function components and hooks only. Keep state local; lift it only when two components need it.
- No backend API. Network calls exist only in course import (GitHub API / raw files); keep them in
  `src/features/course-import/`, encode params, handle rate-limit (403/429) errors with a clear message.
- UI never calls an execution engine or IndexedDB directly: go through `src/execution/manager` and
  `src/storage/repositories` (PRD 18.3).
- Tailwind utility classes; shared values (colors, spacing) in the Tailwind config or one theme file.
  No new UI or state library without a PRD decision.
- Every data view has loading, empty and error states.
- Accessibility: real buttons and labels, alt text, focus visible, color contrast.
- Before reporting done: `npm run build` passes and lint is clean for the files you touched
  (`npx eslint <files>` if the repo-wide lint has old failures).

# Development

Requires Node 22. Run from the repo root.

```
npm ci            # install
npm run dev       # Vite dev server
npm test          # vitest run
npm run lint      # eslint
npm run typecheck # tsc --noEmit
npm run build     # tsc -b && vite build
npm run preview   # serve the build
```

Work is planned task by task in `.taskmaster/`; see AGENTS.md for the loop. Architecture: ARCHITECTURE.md. Decisions: DECISIONS.md.

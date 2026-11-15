# Decisions

## Task 1: scaffold (2026-11-15)
- Tailwind v4 via `@tailwindcss/vite` (compatible with Vite 8; v3 not needed).
- Pinned (exact): react/react-dom 18.3.1 (AGENTS.md says React 18; npm latest is 19), vite 8.3.8,
  @vitejs/plugin-react 6.3.0, typescript 5.9.3 (latest 7.x is the native port, not supported by typescript-eslint),
  tailwindcss + @tailwindcss/vite 4.3.5, vitest 5.1.0, jsdom 26.1.0 (31.x crashes on Node 22.12: undici needs newer Node),
  @testing-library/react 16.3.3, jest-dom 7.0.1, eslint 9.39.5 (flat config; 10.x skipped for plugin compatibility),
  typescript-eslint 8.72.2, eslint-plugin-react-hooks 7.1.1, @types/node 22.

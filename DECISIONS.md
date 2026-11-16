# Decisions

## Task 1: scaffold (2026-11-15)
- Tailwind v4 via `@tailwindcss/vite` (compatible with Vite 8; v3 not needed).
- Pinned (exact): react/react-dom 18.3.1 (AGENTS.md says React 18; npm latest is 19), vite 8.3.8,
  @vitejs/plugin-react 6.3.0, typescript 5.9.3 (latest 7.x is the native port, not supported by typescript-eslint),
  tailwindcss + @tailwindcss/vite 4.3.5, vitest 5.1.0, jsdom 26.1.0 (31.x crashes on Node 22.12: undici needs newer Node),
  @testing-library/react 16.3.3, jest-dom 7.0.1, eslint 9.39.5 (flat config; 10.x skipped for plugin compatibility),
  typescript-eslint 8.72.2, eslint-plugin-react-hooks 7.1.1, @types/node 22.

## Task 2: architecture seeds (2026-11-15)
Proposals, status "proposed" until the implementing task lands. Format: decision, why.
- **CodeMirror 6** editor: owner-fixed (PRD 25.6); changing it needs owner approval.
- **sql.js in a Web Worker:** keeps the UI responsive and lets us terminate runaway queries.
- **Pyodide in a Web Worker:** same; also isolates the ~10 MB runtime and allows terminate on timeout.
- **JavaScript in a sandboxed iframe** (no same-origin, no Node): untrusted user code stays off the app origin.
- **IndexedDB via `idb`:** browser-only persistence, no backend; thin typed wrapper.
- **zod** for manifest validation: one schema gives runtime checks and TS types.
- **react-router** for routing; **react-resizable-panels** for the three-panel layout.
- **react-markdown without raw HTML** (no rehype-raw): imported Markdown is untrusted.
- **fflate** for ZIP extraction: small, browser-friendly, with path validation on our side.

## Task 32: Python adapter (2026-11-15)
- **Pyodide from the npm `pyodide` package, served same-origin:** `scripts/copy-pyodide.mjs` (predev/prebuild) copies
  the runtime into `public/pyodide/` (gitignored); the worker loads it with `indexURL = BASE_URL + "pyodide/"`.
  `optimizeDeps.exclude: ['pyodide']` in vite.config: Vite's dep pre-bundling breaks Pyodide's own asset loading.
- **CSP impact (phase 9):** Pyodide compiles WebAssembly at runtime, so the CSP must allow `script-src 'self'
  'wasm-unsafe-eval'` and `worker-src 'self'` (module worker). No CDN origin is needed.
- Load is raced against a 60 s timeout ("Python engine failed to load"); stdout uses a raw `write` handler plus an
  explicit flush after each run so output without a trailing newline is kept.

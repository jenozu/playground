# Architecture (proposal)

Status: proposal. Nothing below is implemented unless the code says so. Source: PRD 18.2/18.3.

## Layers
Dependencies point downward only; no cycles.

1. **UI components** (`src/components/`): layout, dashboard, courses, lessons, editor, terminal, progress. Presentational, no storage or execution calls.
2. **Features** (`src/features/`): course-management, course-import, lesson-viewer, exercise-evaluation, learning-progress, practice-playground. Wire hooks to the services below.
3. **Execution** (`src/execution/`): `interfaces/` (shared `ExecutionAdapter` contract), `manager/` (picks adapter, enforces timeout, terminates workers), `adapters/` sql, python, javascript (typescript later).
4. **Course system** (`src/course-system/`): `parser/` (manifest + Markdown to domain objects), `validator/` (zod), `registry/` (installed courses), `schema/`.
5. **Storage** (`src/storage/`): `indexeddb/` (idb schema, migrations), `repositories/` (progress, notes, saved code, course registry).
6. Shared: `src/types/`, `src/hooks/`, `src/utils/`, `src/styles/`, `src/app/` (routing, providers).

Rules (PRD 18.3): UI separate from logic; execution separate from editor; course content separate from source; parsing separate from rendering; evaluation separate from execution; persistence separate from UI.

## Data flow: Run vs Submit
- **Run:** editor code -> execution manager -> adapter (worker or sandboxed iframe) -> output panel. Never changes progress.
- **Submit:** editor code -> execution manager (run) -> exercise-evaluation compares result/tests -> on pass, learning-progress repository marks the lesson complete (storage). Failing tests never complete a lesson. Reading lessons are completed manually.

## One loader for all courses
Bundled sample courses (`public/courses/`) and imported courses (GitHub or ZIP) both yield a `course.json` plus Markdown files. Both go through the same path: fetch/extract -> validator (zod, path checks) -> parser -> registry (IndexedDB). No course is hardcoded in React code. IDs in the manifest are the stable progress keys, so removing or updating a course never deletes progress.

## Dependency analysis
Versions are pinned at install time by the task that adds each package (see DECISIONS.md). Sizes are approximate and unverified. Installed today: react, react-dom, vite, tailwindcss, vitest, testing-library (task 1).

| Package | Version | Size (approx) | Why |
|---|---|---|---|
| react, react-dom | 18.3.1 (installed) | ~140 KB min | UI |
| tailwindcss | 4.3.5 (installed) | build-time | styling |
| react-router-dom | pin at install | ~30 KB | routes for dashboard/course/lesson |
| react-resizable-panels | pin at install | ~15 KB | three-panel lesson layout |
| codemirror 6 (`@codemirror/*`) | pin at install | ~150-300 KB | editor (owner-fixed choice) |
| react-markdown (+ remark-gfm) | pin at install | ~50 KB | lesson rendering, no raw HTML |
| zod | pin at install | ~60 KB | manifest validation |
| idb | pin at install | ~2 KB | IndexedDB wrapper |
| fflate | pin at install | ~8 KB | ZIP extraction for import |
| sql.js | pin at install | ~1 MB WASM | SQL execution, lazy loaded |
| pyodide | pin at install | ~10 MB | Python execution, lazy loaded |
| vitest, @testing-library/*, playwright | pin at install | dev only | unit and e2e tests |

## Risks
- **Pyodide size and load time:** ~10 MB first load. Mitigate: lazy load only for Python lessons, show progress, rely on HTTP cache; consider self-hosting.
- **Worker termination:** infinite loops must be killable. Mitigate: run in Web Worker, manager enforces timeout and calls `terminate()`, then recreates the worker (Pyodide reload cost).
- **CSP with WASM:** sql.js/Pyodide need `wasm-unsafe-eval` (and possibly a worker-src/blob rule). Mitigate: test CSP early in phase 4/5; document the exact header.
- **GitHub API rate limits:** unauthenticated 60 requests/hour. Mitigate: fetch the repo ZIP (one request) rather than per-file calls; cache; show a clear error.
- **IndexedDB quota and eviction:** browser may evict or refuse writes. Mitigate: request persistent storage, keep progress small, offer export of progress.

## Python limitations
Python runs in Pyodide (CPython compiled to WASM) in a Web Worker. Known limits (PRD 10.4):
- **No native-dependency packages:** only pure-Python wheels and packages Pyodide ships; anything needing OS-level C extensions or system libraries will not install.
- **No blocking `input()`:** there is no stdin; lessons must not rely on interactive input.
- **No network or persistent filesystem:** sockets and raw HTTP are unavailable; the virtual filesystem lives in memory and is lost on reload or worker restart.
- **Large first load:** ~10 MB of Pyodide downloads on the first Python lesson (then HTTP-cached); a runaway program is killed by terminating the worker, which costs a reload.

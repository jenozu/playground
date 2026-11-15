# Personal Coding Academy task checklist

Generated from `.taskmaster/tasks/tasks.json` (the source of truth). Never edit by hand; regenerate with
`python .taskmaster/render_tasks_md.py`.

**Progress: 7/62 tasks done.**

## Phase 0 - Foundation

- [x] **1. Scaffold Vite + React + TypeScript + Tailwind app at repo root**  
  A running empty app with lint, typecheck, unit test and build scripts.  
  _Test:_ npm run lint && npm run typecheck && npx vitest run && npm run build all exit 0
- [x] **2. Write architecture proposal and project docs skeleton** _(after 1)_  
  PRD phase-0 deliverables: architecture, dependency analysis, risks, docs files.  
  _Test:_ ls ARCHITECTURE.md DECISIONS.md DEVELOPMENT.md README.md CHANGELOG.md SECURITY.md COURSE-FORMAT.md; grep -c '^## ' ARCHITECTURE.md >= 5
- [x] **3. Create source folder layout and shared domain types** _(after 1)_  
  src/ folders and the TypeScript interfaces every later phase builds on.  
  _Test:_ npm run typecheck exits 0 and `ls src/types/course.ts src/types/execution.ts`
- [x] **4. Set up Playwright with a smoke e2e test** _(after 1)_  
  Browser tests run against the Vite dev server.  
  _Test:_ npx playwright test exits 0
- [ ] **5. Create the GitHub repository and add it as origin** **[HUMAN]**  
  Phases deliver as PRs, which needs a GitHub remote.  
  _Test:_ git remote get-url origin prints a github.com URL
- [ ] **6. Add the Codecademy reference screenshot to the repo** **[HUMAN]**  
  The layout reference the PRD refers to (22.5) must be in the repo for visual checks.  
  _Test:_ ls docs/design/reference.png
- [x] **7. Phase 0 gate: lint, types, tests and build pass** _(after 1, 2, 3, 4)_  
  Free script check that phase 0 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 7

## Phase 1 - App shell

- [x] **8. Storage layer: IndexedDB database and repository interfaces** _(after 3)_  
  One place that owns persistence, so UI never touches IndexedDB (PRD 13.5, 18.3).  
  _Test:_ npx vitest run src/storage passes (fake-indexeddb)
- [x] **9. App shell, routing and main navigation** _(after 1)_  
  Six top-level pages reachable from a nav: Dashboard, My Courses, Practice, Projects, Progress, Settings.  
  _Test:_ e2e/nav.spec.ts: each nav link opens its page at 1440px and at 390px; npx playwright test e2e/nav.spec.ts passes
- [ ] **10. Settings page with persisted preferences and dark/light theme** _(after 8, 9)_  
  Theme, editor font size/font and default practice language persist across reloads (PRD 19.3-19.4).  
  _Test:_ Vitest for usePreferences; e2e: switch to dark, reload, still dark
- [ ] **11. Dashboard and My Courses page layouts with empty states** _(after 9)_  
  Pages render their sections with empty states before real data exists (PRD 5.2, 5.3).  
  _Test:_ Vitest render tests for CourseCard and empty states; e2e dashboard + My Courses render without console errors
- [ ] **12. Phase 1 gate: lint, types, tests and build pass** _(after 8, 9, 10, 11)_  
  Free script check that phase 1 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 12

## Phase 2 - Three-panel lesson UI

- [ ] **13. Lesson page: header and three resizable panels** _(after 10)_  
  The Codecademy-style layout: lesson 33% · editor 34% · output 33%, draggable, persisted (PRD 4.1-4.3, 4.6).  
  _Test:_ e2e/lesson-layout.spec.ts: three panels visible at 1440px with widths ~33/34/33 (±3%); dragging a handle changes widths; reload keeps them; restore resets
- [ ] **14. Independent panel scrolling and lesson controls bar** _(after 13)_  
  Each panel scrolls on its own; Prev/Next/Run/Submit/Reset/Save/Clear controls exist (PRD 4.4, 4.7).  
  _Test:_ e2e: scrolling the lesson panel leaves editor and output scrollTop unchanged; Run shows simulated output; Clear empties it
- [ ] **15. CodeMirror 6 editor component** _(after 13)_  
  Centre-panel editor with highlighting, line numbers, autoindent, autocomplete, undo/redo and file tabs (PRD 9.1-9.3).  
  _Test:_ Vitest: editor mounts and onChange fires; e2e: type in editor, undo restores previous text
- [ ] **16. Output/terminal panel component** _(after 13, 3)_  
  Shows stdout, tables, errors with raw details, status, time and pass/fail (PRD 11).  
  _Test:_ Vitest render tests for each entry type incl. a 1000-row table
- [ ] **17. Tablet and mobile layouts for the lesson page** _(after 14, 15, 16)_  
  Lesson panel collapses on tablet; tabs for Lesson/Code/Output on phones (PRD 4.5).  
  _Test:_ e2e at 390x844 and 820x1180: tabs switch views, editor text survives a tab switch, no horizontal scroll
- [ ] **18. Phase 2 gate: lint, types, tests and build pass** _(after 13, 14, 15, 16, 17)_  
  Free script check that phase 2 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 18

## Phase 3 - Course system

- [ ] **19. Course manifest schema (zod) and COURSE-FORMAT.md** _(after 3)_  
  The formal course.json + lesson file format, validated and documented (PRD 6.3, 7.1-7.5).  
  _Test:_ npx vitest run src/course-system/schema: valid PRD example passes, each required-field omission fails with a path in the message
- [ ] **20. Manifest parser and validator over a virtual file map** _(after 19)_  
  One loader for bundled, GitHub and ZIP courses that reports useful errors (PRD 14.4, 20.3).  
  _Test:_ npx vitest run src/course-system: one test per error code (missing manifest, invalid JSON, unsupported version, missing lesson file, missing exercise file, escaping path, unsupported language)
- [ ] **21. Course registry backed by storage, with bundled sample loading** _(after 20, 8)_  
  Validated courses register into IndexedDB and appear automatically; removal keeps progress (PRD 6.4, 5.3).  
  _Test:_ Vitest with fake-indexeddb: register, list, remove leaves progress records; e2e: sample courses appear in My Courses on first load
- [ ] **22. Safe Markdown lesson renderer** _(after 20)_  
  Lesson Markdown with code, tables, images, links and callouts, safe for untrusted content (PRD 7.3, 8.1, 17.5).  
  _Test:_ Vitest: renders table/image/code; `<script>`, `<img onerror>`, `javascript:` links and raw HTML render as inert text or are removed
- [ ] **23. Sample SQL and Python courses as static course files** _(after 19)_  
  Two small real courses that load through the manifest system (PRD 27 Courses).  
  _Test:_ Vitest test loads both folders from disk through the validator with zero errors
- [ ] **24. Course pages and lesson navigation from the registry** _(after 21, 22, 23, 17, 11)_  
  My Courses, course details and the lesson page run on real course data (PRD 5.3, 8.3, 6.4).  
  _Test:_ e2e: open sql-fundamentals → lesson 1 shows its Markdown and starter SQL; Next crosses into module 2; filter by language hides the other course
- [ ] **25. Phase 3 gate: lint, types, tests and build pass** _(after 19, 20, 21, 22, 23, 24)_  
  Free script check that phase 3 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 25

## Phase 4 - SQL playground

- [ ] **26. Execution manager with lazy-loaded engine registry** _(after 3, 24)_  
  UI runs code through one manager that picks and lazy-loads the language adapter (PRD 10.1-10.2, 20.1).  
  _Test:_ Vitest with a fake adapter: lazy load called once, timeout produces an error result, stop() calls the adapter
- [ ] **27. SQL adapter: sql.js in a Web Worker** _(after 26)_  
  SQL runs off the main thread with tables, errors, datasets and reset (PRD 10.3).  
  _Test:_ Vitest (worker logic tested as plain functions with sql.js in node): CREATE/INSERT/SELECT/JOIN/aggregate return rows; bad table gives sqlite error; reset clears user tables
- [ ] **28. Exercise evaluation and Submit flow (SQL first)** _(after 27)_  
  Submit runs the tests and shows pass/fail with expected vs actual; Run never completes a lesson (PRD 12.2-12.3).  
  _Test:_ Vitest: correct SQL passes, wrong row count and wrong order (when ordered) fail with expected/actual
- [ ] **29. Reset starter code, progressive hints and solution view** _(after 28)_  
  Exercise helpers that never reveal the solution by accident (PRD 9.4, 12.4-12.5).  
  _Test:_ Vitest/e2e: hint 2 hidden until hint 1 revealed; reset restores starter; viewing solution leaves editor text unchanged
- [ ] **30. SQL lesson end-to-end test** _(after 29)_  
  The full SQL loop works in a real browser.  
  _Test:_ npx playwright test e2e/sql-lesson.spec.ts passes
- [ ] **31. Phase 4 gate: lint, types, tests and build pass** _(after 26, 27, 28, 29, 30)_  
  Free script check that phase 4 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 31

## Phase 5 - Python playground

- [ ] **32. Python adapter: Pyodide in a Web Worker, lazy-loaded** _(after 26)_  
  Python runs in the browser with stdout, tracebacks, repeated runs and reset (PRD 10.4, 20.1).  
  _Test:_ Vitest for message/traceback helpers; e2e: print('hi') shows hi; undefined name shows NameError line; second run works
- [ ] **33. Stop and timeout for runaway code** _(after 32, 27)_  
  Infinite loops can be stopped and the UI stays responsive (PRD 10.4, 11.5, 20.2).  
  _Test:_ e2e: `while True: pass` → Stop → output says stopped, UI clicks still respond within 1s, next run works; timeout test with a short profile
- [ ] **34. Python exercise evaluation** _(after 32, 28)_  
  Submit runs Python tests and reports each assert (PRD 12.2).  
  _Test:_ Vitest/e2e: add(a,b) example from PRD 12.2 passes 3 tests; a wrong implementation shows which assert failed
- [ ] **35. Python sample course e2e and Pyodide limitations doc** _(after 34, 33)_  
  The Python course works end to end; limits are documented (PRD 10.4).  
  _Test:_ npx playwright test e2e/python-lesson.spec.ts passes; grep -q 'Python limitations' ARCHITECTURE.md
- [ ] **36. Phase 5 gate: lint, types, tests and build pass** _(after 32, 33, 34, 35)_  
  Free script check that phase 5 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 36

## Phase 6 - Learning progress

- [ ] **37. Progress tracking: completion, attempts, last position** _(after 8, 28)_  
  Lesson completion, exercise attempts and last accessed lesson persist by stable IDs (PRD 8.4, 13.1).  
  _Test:_ Vitest: completion % math, module complete when all lessons done; e2e: submit passing → reload → lesson shows completed
- [ ] **38. Autosave and restore working code** _(after 37)_  
  User code survives leaving the lesson and reloading; starter stays resettable (PRD 9.5, 13.2).  
  _Test:_ e2e: edit code, reload, code restored; Reset brings back starter
- [ ] **39. Continue Learning and live dashboard** _(after 38)_  
  Dashboard resumes the last lesson and shows real progress (PRD 5.2, 13.3).  
  _Test:_ e2e: complete lesson 1 → dashboard shows it recently completed and recommends lesson 2; Continue opens the last lesson
- [ ] **40. Progress page** _(after 37)_  
  Practical overview: active/completed courses, modules, lessons, success rate, recent languages (PRD 5.4).  
  _Test:_ Vitest render with seeded progress shows correct counts
- [ ] **41. Lesson notes and bookmarks** _(after 37)_  
  Per-lesson notes autosave; lessons and courses can be bookmarked (PRD 13.4, 3.4).  
  _Test:_ e2e: write a note, reload, note still there; bookmark appears on dashboard
- [ ] **42. Export and import learning data** _(after 41, 38)_  
  Progress, notes, code and bookmarks can be backed up and restored as JSON (PRD 13.6, 21.4).  
  _Test:_ Vitest: export → import round-trip equals original; malformed file rejected with a message
- [ ] **43. Phase 6 gate: lint, types, tests and build pass** _(after 37, 38, 39, 40, 41, 42)_  
  Free script check that phase 6 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 43

## Phase 7 - Course import

- [ ] **44. GitHub public repository import** _(after 21)_  
  A public repo URL becomes a validated course (PRD 14.2).  
  _Test:_ Vitest with mocked fetch: valid repo → course; 404, rate limit, oversize, disallowed extension each give a clear error
- [ ] **45. ZIP course upload with safe extraction** _(after 21)_  
  A ZIP course package imports safely (PRD 14.3, 17.5).  
  _Test:_ Vitest with generated fixtures: valid zip → course; traversal, absolute path, zip bomb, too many files, bad extension each rejected
- [ ] **46. Import page with validation report and preview** _(after 44, 45)_  
  User pastes a URL or drops a ZIP, sees errors or a preview, then registers (PRD 14.1-14.4).  
  _Test:_ e2e: import a fixture zip from e2e/fixtures → course appears in My Courses; invalid zip shows its errors
- [ ] **47. Course refresh and updates that keep progress** _(after 46, 37)_  
  Re-importing a course shows what changed and preserves progress and user code (PRD 14.5).  
  _Test:_ Vitest: diff function cases; e2e: import v1, complete lesson, import v2 with an added lesson → summary lists it and completion kept
- [ ] **48. Publish a public coding-courses repo for a real import test** **[HUMAN]** _(after 23)_  
  A real GitHub course repo to prove the primary success metric (PRD 25.2, 29).  
  _Test:_ Importing the pasted URL in the app registers the course (manual check)
- [ ] **49. Phase 7 gate: lint, types, tests and build pass** _(after 44, 45, 46, 47)_  
  Free script check that phase 7 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 49

## Phase 8 - JavaScript + practice

- [ ] **50. JavaScript adapter in a sandboxed iframe** _(after 26, 28)_  
  JS runs isolated from the app with console capture, errors, timeout and tests (PRD 10.5, 17.2).  
  _Test:_ Vitest for message protocol; e2e: console.log output shown, thrown error shown, infinite loop stopped, `parent.document` access throws
- [ ] **51. Practice Playground page** _(after 50, 33)_  
  Blank editor for SQL, Python or JS with run and reset, outside any course (PRD 15).  
  _Test:_ e2e: SQL create table + select works then reset clears it; python and js run in practice
- [ ] **52. Saved practice sessions** _(after 51)_  
  Practice work autosaves and earlier sessions can be reopened (PRD 15.2).  
  _Test:_ e2e: write python in practice, reload, session listed and reopens with the code
- [ ] **53. Phase 8 gate: lint, types, tests and build pass** _(after 50, 51, 52)_  
  Free script check that phase 8 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 53

## Phase 9 - Stabilize + ship

- [ ] **54. Decide hosting: Vercel or Hostinger VPS** **[HUMAN]**  
  Pick the deploy target so the ship tasks can proceed (PRD 21.1).  
  _Test:_ Decision recorded in .taskmaster/docs/prd.md decision log
- [ ] **55. Content Security Policy, security headers and security review** _(after 54, 52, 47, 42)_  
  Ship with CSP and a completed security review (PRD 17.2, 22.3).  
  _Test:_ e2e passes with CSP enabled in `vite preview` (headers via preview config); SECURITY.md lists each PRD 17 control and its test
- [ ] **56. Performance review: lazy loading and bundle size** _(after 55)_  
  Initial load stays small; engines load only when needed (PRD 20.1).  
  _Test:_ node scripts/check-bundle.mjs exits 0 after npm run build
- [ ] **57. User acceptance e2e for Python and SQL (PRD 22.4)** _(after 55)_  
  The PRD acceptance scenario runs automatically for both languages.  
  _Test:_ npx playwright test e2e/uat.spec.ts passes
- [ ] **58. Complete documentation incl. deploy, backup and recovery** _(after 56, 57)_  
  Docs match what was built (PRD 26, 21.2, 21.4).  
  _Test:_ grep -q 'Backup' DEVELOPMENT.md README.md; every doc in PRD 26 exists; a link check over relative links in *.md finds none broken
- [ ] **59. Production deploy configuration for the chosen host** _(after 54, 55)_  
  The built app can be deployed reproducibly with SPA routing and headers (PRD 21).  
  _Test:_ npm run build && npx vite preview serves deep links (e2e against preview: /courses/... reload works)
- [ ] **60. First production deploy** **[HUMAN]** _(after 59)_  
  The app is live at its URL.  
  _Test:_ Live URL returns 200 and the app loads (manual check)
- [ ] **61. Production smoke test** _(after 60)_  
  The live site works: loads, runs SQL and Python, imports a ZIP.  
  _Test:_ PLAYWRIGHT_BASE_URL=<url> npx playwright test e2e/smoke.spec.ts passes
- [ ] **62. Phase 9 gate: lint, types, tests and build pass** _(after 55, 56, 57, 58, 59, 61)_  
  Free script check that phase 9 leaves the repo green.  
  _Test:_ python .taskmaster/run_checks.py run --only 62

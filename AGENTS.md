# Instructions for AI coding assistants (Claude Code, Cursor, Codex, Copilot...)

Personal Coding Academy: a personal, browser-only Codecademy-style learning platform: three-panel lessons, in-browser SQL/Python/JS execution, importable JSON+Markdown courses (GitHub/ZIP), local progress.

This repo is built task by task from a written plan. Follow this loop exactly; it exists to stop the project
drifting away from the plan.

## Where the plan lives
- `.taskmaster/docs/prd.md`: goal, non-goals, success criteria, stack, decision log. Read Goal and Non-goals every session.
- `.taskmaster/tasks/tasks.json`: phases, tasks, subtasks, status, dependencies, test strategy, work log. Source of truth.
- `.taskmaster/docs/parking-lot.md`: ideas that are NOT in the plan.
- `.taskmaster/docs/manual-checks.md`: checks waiting for a human or an agent with a running app.
- `.taskmaster/docs/human-checklist.md`: steps only the human can do (queued, not blocking). Tick them when done.
- `TASKS.md`: generated from tasks.json. Never edit by hand.

Helper (Python stdlib only), from the repo root:
```
python .taskmaster/tasks.py status | phase [n] | next [--phase n] | show <id>
python .taskmaster/tasks.py set-status <id> in-progress|done|deferred|cancelled
python .taskmaster/tasks.py log <id> "plan: ..."     # timestamped note on a task
python .taskmaster/tasks.py add --help               # add a task or subtask
python .taskmaster/tasks.py validate                 # after any manual edit of tasks.json
python .taskmaster/render_tasks_md.py                # refresh TASKS.md
```

## Work loop (one task at a time)
1. `tasks.py next`, then `tasks.py show <id>`. Complexity 7+ without subtasks: split it into 3-5 subtasks first.
2. Read the code the task touches. Log your plan: `tasks.py log <id> "plan: files X, Y; approach ..."`.
3. `tasks.py set-status <id> in-progress`, build it, log what worked and what failed.
4. Run the task's testStrategy for real. Not done until it passes.
5. Drift check, `set-status <id> done`, `render_tasks_md.py`, commit with the id: `task 7.2: <title>`, push the branch.

## Drift rules
- Only work on the task `next` returned. New ideas → dated line in `parking-lot.md`.
- Changing what's being built → PRD decision log first, then tasks, then code.
- Never reword a `done` task; add a corrective subtask. Cancel tasks, never delete them.

## Project
- Stack: TypeScript + React 18 + Vite + Tailwind at repo root (src/), CodeMirror 6, react-markdown, sql.js, Pyodide (Web Worker), IndexedDB (idb), Vitest + Testing Library, Playwright for e2e
- Install: `npm ci`
- Test: `npx vitest run`
- Lint: `npm run lint`
- Build: `npm run build`
- Dev servers: defined in `.claude/dev-servers.json`; run with `python .claude/scripts/devserver.py start all`.

## Facts that are easy to get wrong
- No backend. All code execution happens in the browser (Web Worker or sandboxed iframe), never on a server.
- Courses are never hardcoded in React code: everything comes from a course.json manifest + Markdown files (PRD 3.1, 7).
- Course/module/lesson IDs are stable keys for progress; never derive them from titles or array positions.
- Removing or updating a course must not delete progress, notes or saved code.
- Imported Markdown is untrusted: no raw HTML (no rehype-raw), sanitize, never execute imported scripts.
- Pyodide (~10 MB) and sql.js WASM load lazily, only when a lesson or playground needs them.
- Run never marks a lesson complete; only Submit with passing tests (or manual completion for reading lessons) does.
- MVP excludes: accounts, sync, AI tutor, Node.js execution, projects (PRD 23.2, 16). Park ideas, don't build them.
- Major architecture changes (editor, manifest format, server execution, new DB, paid service, hosting) need owner approval (PRD 25.6).

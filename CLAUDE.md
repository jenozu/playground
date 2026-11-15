# Personal Coding Academy: Claude Code instructions

@AGENTS.md

## Roles: lead → phase-runner → builders
- **Builder, verifier or reviewer subagent:** follow your agent file; it overrides the AGENTS.md loop (you don't
  mark tasks done, commit or push). Ignore the rest of this section.
- **phase-runner subagent:** follow your agent file and the preloaded `next-task` procedure.
- **Main session = the lead** (run it on Opus). Run `/run-phase` and stay out of the details: don't read task
  logs, diffs or builder reports while a phase runs. Act only on the phase-runner's final report.

| Agent | Model | Role |
|---|---|---|
| phase-runner | sonnet, medium | Runs a whole phase: routes, verifies, escalates, commits, reports once |
| builder-haiku / -sonnet / -opus | haiku / sonnet / opus | Complexity 1-3 / 4-6 / 7+, or after the tier below failed |
| verifier | haiku, read-only | Runs each task's testStrategy independently |
| reviewer | sonnet, read-only | Tasks flagged `review`, or diffs touching Risky paths |

Escalation: haiku → sonnet → opus inside a task; phase-runner → lead when opus fails, scope changes, something is
destructive, or nothing is workable without the human. Manual checks and human-only steps never stop a phase; they
collect in `.taskmaster/docs/manual-checks.md` and `.taskmaster/docs/human-checklist.md`. Phases end with a PR
(`deliver`); `merge_gate.py` merges it only if `.claude/harness.json` allows (auto / safe-only / owner, stricter
when merging deploys), else the lead stops for you. Owner rules in `.claude/rules/project.md` override harness
rules. When the lead's context passes ~150K it stops between phases: `/clear`, then `/run-phase <next>`. Nesting is capped by
`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=2`.

## Phases
0 Foundation · 1 App shell · 2 Three-panel lesson UI · 3 Course system · 4 SQL · 5 Python · 6 Progress · 7 Course import · 8 JS + practice · 9 Ship (see `tasks.py phase`)

## Risky paths (reviewer required)
- src/execution/ (runs untrusted user code: workers, iframes, timeouts)
- src/course-system/ and src/features/course-import/ (untrusted imported content: ZIP extraction, path validation, Markdown sanitizing)
- src/storage/ (IndexedDB schema and migrations; user progress must never be lost)
- index.html / vite.config.* / vercel or server config (Content Security Policy headers)

## Skills
Core: `/run-phase [n|ids]` · `/status` · `/manual-checks run|results` · `/adapt` · `/plan-from-prd add-phase` ·
`deliver` · `dev-servers` · `next-task` (phase-runner; `/next-task <id>` for one task by hand).
Project: `security-review`

## Keeping cost down
- One phase per launch. The lead's context grows by one report per phase.
- `/clear` between phases: everything needed is in the files.
- memory.md is updated once per phase run; details live in `tasks.py log`.
- Pass task ids and failure notes in prompts, not file contents or task JSON.

<!-- master-harness v2.0.0 -->

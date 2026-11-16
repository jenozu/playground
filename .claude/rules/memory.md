# Personal Coding Academy memory (short-term project state)

<!-- Rules files without a `paths:` header load at the start of every Claude Code session, so nothing needs to
     import this. HTML comments like this one are stripped before loading and cost no context. -->

**Why this file exists:** so a new session knows where things stand without re-reading the PRD, task logs or
old chats. Open `.taskmaster/` only for the task you're working on.

**Who edits it:** the phase-runner, **once at the end of each run**, in its own commit. The lead also edits it
after resolving an escalation or when the human gives a fact worth keeping. Everyone else only reads it.
Never update it per task.

**Size rules (the point of the file):**
- Max ~80 lines. Each section has a cap; when it's full, delete the least useful line before adding one.
- Replace, don't append: "Now" is overwritten every time; outdated lines are deleted, not struck through.
- Only add to "Learned" what would save a future session 5+ minutes or prevent a repeat failure.
- Details belong in `tasks.py log <id>`; this file holds one-line pointers ("see 7.3 log").

---

## Now (overwrite each time, max 6 lines)
- Phase 4 complete (26-31, 63) on branch `phase-4`; PR delivered at phase end. Next: `/run-phase 5` (Python).
- Human: Task 15 install item and tasks 5, 6 may still be open (see human-checklist).
- In progress: none.
- Manual checks waiting: eyes-on for 27, 28, 29, 63 (manual-checks.md).

## Facts (stable, max 15 lines)
- Dev machine: Windows 11 + Git Bash, Node 22, Python 3.12 (harness scripts only).
- Single personal user, no auth. Storage is IndexedDB in the browser.
- Hosting: undecided (Vercel or owner's Hostinger VPS); decided in phase 9.
- GitHub remote: origin = jenozu/playground (public).

## Decisions since the PRD (max 8 lines, newest first; full text in the PRD decision log)
- 2026-11-15: Approved @codemirror/theme-one-dark for live editor dark mode (task 63, phase 4).
- 2026-11-15: Built with master-harness v2.0.0: lead (Opus) → phase-runner (Sonnet) → builders
  haiku → sonnet → opus. Manual checks batched per phase.

## Learned / gotchas (max 15 lines, newest first)
- Builders may write tests importing uninstalled libs (user-event); vitest then silently shows unchanged count. Check count rises.
- Phase-2 e2e used a python stub; real engines changed output. Check e2e when adding engines.
- jsdom pinned 26.1.0 (31.x crashes on Node 22.12); React 18.3.1, TS 5.9, ESLint 9 per DECISIONS.md.

## Model routing record (update counts at each close-out)
| Tier | Done first try | Escalated up | Notes |
|---|---|---|---|
| haiku | 3 | 0 | |
| sonnet | 8 | 1 | task 15 escalated |
| opus | 1 | 0 | task 15 |
<!-- If one tier escalates on 3 tasks in a row, the phase-runner escalates to the lead, who may raise that tier's
     starting complexity in .claude/skills/next-task/SKILL.md. If haiku passes everything, give it complexity 4 too. -->

## Open questions for the human (max 5; delete once answered)
- Hosting: Vercel or the Hostinger VPS? (phase 9 task)
- Separate coding-courses repo on GitHub: create it now, or keep samples in public/courses/ until phase 7?

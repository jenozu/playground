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
- Phase 1 blocked at task 8: `idb` and `fake-indexeddb` not installed; npm install was permission-denied.
- Human: run `npm i idb && npm i -D fake-indexeddb` (commit package files), then `/run-phase 1`.
- Phase 0 PR still unmerged (no GitHub remote).
- In progress: none.
- Manual checks waiting: none.

## Facts (stable, max 15 lines)
- Dev machine: Windows 11 + Git Bash, Node 22, Python 3.12 (harness scripts only).
- Single personal user, no auth. Storage is IndexedDB in the browser.
- Hosting: undecided (Vercel or owner's Hostinger VPS); decided in phase 9.
- No GitHub remote yet at bootstrap.

## Decisions since the PRD (max 8 lines, newest first; full text in the PRD decision log)
- 2026-11-15: Built with master-harness v2.0.0: lead (Opus) → phase-runner (Sonnet) → builders
  haiku → sonnet → opus. Manual checks batched per phase.

## Learned / gotchas (max 15 lines, newest first)
- jsdom pinned 26.1.0 (31.x crashes on Node 22.12); React 18.3.1, TS 5.9, ESLint 9 per DECISIONS.md.
- Git/gh: no remote until task 5; `deliver` is skipped until then.

## Model routing record (update counts at each close-out)
| Tier | Done first try | Escalated up | Notes |
|---|---|---|---|
| haiku | 1 | 0 | |
| sonnet | 3 | 0 | |
| opus | 0 | 0 | |
<!-- If one tier escalates on 3 tasks in a row, the phase-runner escalates to the lead, who may raise that tier's
     starting complexity in .claude/skills/next-task/SKILL.md. If haiku passes everything, give it complexity 4 too. -->

## Open questions for the human (max 5; delete once answered)
- Hosting: Vercel or the Hostinger VPS? (phase 9 task)
- Codecademy reference screenshot: add it to docs/design/ so the layout can be compared (PRD 22.5).
- Separate coding-courses repo on GitHub: create it now, or keep samples in public/courses/ until phase 7?

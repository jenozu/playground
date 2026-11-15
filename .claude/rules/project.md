# Project rules (owned by this project)

<!-- Seeded once by master-harness and never replaced by an upgrade. Rules here override `rules.md` and the
     harness skills and agents wherever they conflict. Put owner rules here: things agents must always or never
     do in this project (e.g. "take a database restore point before any migration"). Keep it short.
     Merge behaviour (auto / safe-only / owner, and whether merging deploys) lives in `.claude/harness.json`,
     not here: the merge gate script enforces that file. -->

- Never switch the editor (CodeMirror 6), change the course manifest format, move execution to a server, add a
  mandatory database, add a paid service or change hosting without the owner's approval: escalate (PRD 25.6).
- Never mark a feature done in docs (README, ARCHITECTURE.md, etc.) before it is implemented and tested (PRD 26).
- Never auto-execute anything from an imported course (scripts, commands, HTML) (PRD 14.2, 17.5).

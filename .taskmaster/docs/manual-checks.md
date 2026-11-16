# Manual checks

The phase-runner adds checks here instead of stopping mid-phase. Each item: `### Task <id> - <title> (<date>)`
with numbered steps and the expected result.

- **Agent-checkable:** provable with a running dev server and curl, a script or a query.
  Run them with `/manual-checks run`.
- **Eyes-on:** need a human looking at a screen, a phone, a real device or server. Do them, then tell the lead
  what passed and failed (`/manual-checks results ...`).

## Agent-checkable

## Eyes-on

### Task 10 - Settings theme (2026-11-15)
1. Open /settings, choose Dark, reload: stays dark, no light flash.
2. Click Restore defaults: theme returns to System.

### Task 15 - CodeMirror editor (2026-11-15)
1. Open /courses/c1/lessons/l1. Expected: highlighting, line numbers, autocomplete while typing.
2. Toggle light/dark (reload after toggle; editor reads theme at render). Expected: readable in both.
3. Change font size in Settings. Expected: editor follows.

### Task 22 - Safe Markdown lesson renderer (2026-11-15)
1. Open a lesson with a ```sql / ```python fenced block in the running app. Expected: keywords, strings, comments show in colour on the dark code background.

### Task 27 - SQL adapter in a Web Worker (2026-11-15)
1. Run `npm run dev`, open a SQL lesson, run `SELECT 1 AS x;`. Expected: result table shows x=1; sql.js WASM loads only on first run (Network tab).
2. Run an infinite-ish query (recursive CTE with huge limit). Expected: times out and the UI stays responsive; the next run works.
3. Run invalid SQL. Expected: readable error, no crash.

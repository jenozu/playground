---
name: security-review
description: Focused security pass over the code-execution sandbox, course import and storage before shipping. Produces findings as fix tasks. Use when the human asks for a security review, before the first deploy (phase 9), or after changes to src/execution, course import or Markdown rendering.
disable-model-invocation: true
---

# Security review

Dispatch the **reviewer** agent per area below (one area per dispatch, to keep each context small). For each,
it reads the relevant code and reports findings with file:line, a concrete exploit or failure, and the fix.

1. **Secrets:** `git grep -n -I -E "(api[_-]?key|secret|password|token)\s*[:=]" -- ':!*.lock'`; committed `.env`
   files (`git ls-files | grep -i env`); secrets in logs or error messages.
2. **Execution sandbox (PRD 17.1-17.2):** user JS/TS runs in a sandboxed iframe (`sandbox="allow-scripts"`, no
   `allow-same-origin`) or worker, never via `eval`/`new Function` on the main thread; Python/SQL run in Web
   Workers; every run has a timeout and the worker/iframe is terminated on Stop or timeout; no app objects,
   IndexedDB or storage reachable from the sandbox; postMessage handlers check `event.source`.
3. **Imported content (PRD 17.5):** ZIP path traversal (`../`, absolute paths, backslashes), archive size and file
   count limits, file-type allowlist, manifest references can't escape the course root, Markdown rendered without
   raw HTML and with safe URLs (no `javascript:`), images/links from imported courses can't run script.
4. **Web:** Content Security Policy (allows `wasm-unsafe-eval` for Pyodide/sql.js, nothing broader than needed),
   HTTPS only, no GitHub token or secret in the bundle (`grep` the `dist/` output).
5. **Data:** IndexedDB upgrades keep existing progress; export/import of progress can't inject script.
6. **Dependencies:** `npm audit --omit=dev` / `pip-audit` if available; note high/critical only.

Each finding → `python .taskmaster/tasks.py add --title "Security: <issue>" --review --complexity <n>
--details "<file:line, exploit, fix>" --test "<how to prove it's fixed>"`. Report counts by severity in 5 lines.

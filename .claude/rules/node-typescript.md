---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Node + TypeScript rules

- `strict` TypeScript. No `any` in new code; use `unknown` and narrow. No `// @ts-ignore` without a comment why.
- Validate external input (course manifests, test JSON, imported files, IndexedDB reads of old versions) at the
  boundary with zod, then trust the types inside.
- Use the package manager the repo already uses (lockfile tells you: npm, pnpm, yarn, bun). Never mix them.
- Async: always await or return promises; no floating promises. Handle errors where you can act on them.
- Config from `import.meta.env.VITE_*`, read in one module. Nothing secret ever goes in a VITE_ variable.
- Tests with Vitest (`npx vitest run`). Run `tsc --noEmit` and the tests before reporting done.

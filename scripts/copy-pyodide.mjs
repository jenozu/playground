// Serves Pyodide same-origin (CSP-friendly): copies the core runtime files into public/pyodide (gitignored).
import { cpSync, mkdirSync } from "node:fs";
mkdirSync("public/pyodide", { recursive: true });
for (const f of ["pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"])
  cpSync(`node_modules/pyodide/${f}`, `public/pyodide/${f}`);

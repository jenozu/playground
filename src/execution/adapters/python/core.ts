import type { ExecutionResult } from "../../../types/execution";

export type PyMsg = { type: "init" | "exec" | "reset"; code?: string };

type Writer = { write(buf: Uint8Array): number };

/** Minimal slice of the Pyodide API we use (keeps core testable without loading Pyodide). */
export interface PyLike {
  globals: { get(name: string): unknown };
  setStdout(o: Writer): void;
  setStderr(o: Writer): void;
  runPython(code: string): unknown;
  runPythonAsync(code: string, o: { globals: unknown }): Promise<unknown>;
}

/** Final 'NameError: ...' line of a Python traceback. */
export function lastErrorLine(traceback: string): string {
  const lines = traceback.trim().split("\n");
  return lines[lines.length - 1] ?? traceback;
}

/** Drops Pyodide's internal frames (File "/lib/python...", "<exec>" wrappers) so only user code shows. */
export function cleanTraceback(tb: string): string {
  const lines = tb.trim().split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*File "(\/lib\/python|\/home\/pyodide|<frozen)/.test(lines[i]) && !/^\s*File "<exec>"/.test(lines[i])) {
      while (lines[i + 1]?.startsWith("    ")) i++; // skip the source line(s) of that frame
      continue;
    }
    out.push(lines[i]);
  }
  return out.join("\n");
}

/** Collects raw bytes written to a stream as text (keeps partial lines like print('a', end='')). */
function sink() {
  const dec = new TextDecoder();
  let text = "";
  return {
    writer: { write: (b: Uint8Array) => ((text += dec.decode(b, { stream: true })), b.length) },
    take: () => {
      const t = (text + dec.decode()).replace(/\n$/, "");
      text = "";
      return t;
    },
  };
}

/** Each run gets a fresh globals dict, so reset is implicit. */
export function createPyHandler(py: PyLike) {
  const out = sink();
  const err = sink();
  py.setStdout(out.writer);
  py.setStderr(err.writer);
  return async (code: string): Promise<ExecutionResult> => {
    out.take();
    err.take();
    const t0 = performance.now();
    const globals = (py.globals.get("dict") as () => { destroy?: () => void })();
    let error: string | undefined;
    try {
      await py.runPythonAsync(code, { globals });
    } catch (e) {
      error = cleanTraceback(e instanceof Error ? e.message : String(e));
    } finally {
      globals.destroy?.();
    }
    // Python buffers partial lines; flush so output without a trailing newline isn't lost.
    py.runPython("import sys\nsys.stdout.flush()\nsys.stderr.flush()");
    const output = out.take();
    const stderr = err.take();
    const errors = stderr ? [stderr] : [];
    if (error === undefined) return { success: true, output, errors, executionTime: performance.now() - t0 };
    // Traceback frames first, then the extracted error line last (shown once, Python's usual order).
    const last = lastErrorLine(error);
    const frames = error.slice(0, error.length - last.length).trimEnd();
    return { success: false, output, errors: [...errors, ...(frames ? [frames] : []), last] };
  };
}

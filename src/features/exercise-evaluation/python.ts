import type { ExecutionResult, TestResult } from "../../types/execution";
import type { TestFile } from "../../course-system/schema";

export type PythonTest = Extract<TestFile, { language: "python" }>["tests"][number];
export interface PythonRunner {
  exec(code: string): Promise<ExecutionResult>;
}

const trim = (s: string) => s.replace(/\s+$/, "");

/** User code runs alone first (stdout checks, user errors); each assert then runs appended to it in a fresh namespace. */
export async function evaluatePython(tests: PythonTest[], code: string, runner: PythonRunner): Promise<TestResult[]> {
  const base = await runner.exec(code);
  if (!base.success) {
    const error = base.errors.join("\n");
    return tests.map((t) => ({ name: t.name, passed: false, error }));
  }
  const out: TestResult[] = [];
  for (const t of tests) {
    let error: string | undefined;
    if (t.assert !== undefined) {
      const r = await runner.exec(`${code}\n${t.assert}`);
      if (!r.success) error = r.errors.at(-1) || "Assertion failed";
    }
    const stdoutOk = t.expectedStdout === undefined || trim(t.expectedStdout) === trim(base.output);
    out.push({
      name: t.name,
      passed: error === undefined && stdoutOk,
      ...(t.expectedStdout !== undefined && { expected: trim(t.expectedStdout), actual: trim(base.output) }),
      ...(error !== undefined && { error }),
    });
  }
  return out;
}

import { evaluatePython } from "./python";
import type { ExecutionResult } from "../../types/execution";

// Fake runner: "bad" code throws; asserts fail when the code lacks the right add.
const exec = async (c: string): Promise<ExecutionResult> => {
  if (c.startsWith("bad")) return { success: false, output: "", errors: ['File "<exec>"', "NameError: x"] };
  if (c.includes("a - b") && c.includes("assert")) return { success: false, output: "", errors: ["AssertionError"] };
  return { success: true, output: "hi  \n", errors: [] };
};
const tests = [{ name: "t1", assert: "assert add(2, 3) == 5" }, { name: "t2", expectedStdout: "hi\n" }, { name: "t3", expectedStdout: "no" }];

describe("evaluatePython", () => {
  it("passes correct code and compares trimmed stdout", async () => {
    const r = await evaluatePython(tests, "def add(a, b): return a + b", { exec });
    expect(r.map((x) => x.passed)).toEqual([true, true, false]);
    expect(r[2]).toMatchObject({ expected: "no", actual: "hi" });
  });
  it("names the failing assert", async () => {
    const r = await evaluatePython(tests, "def add(a, b): return a - b", { exec });
    expect(r[0]).toMatchObject({ passed: false, error: "AssertionError" });
  });
  it("fails all tests with the traceback on user errors", async () => {
    const r = await evaluatePython(tests, "bad", { exec });
    expect(r.every((x) => !x.passed && x.error?.includes("NameError"))).toBe(true);
  });
});

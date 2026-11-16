// @vitest-environment node
import { describe, expect, it } from "vitest";
import { cleanTraceback, createPyHandler, lastErrorLine, type PyLike } from "./core";

const TB = `Traceback (most recent call last):
  File "/lib/python312.zip/_pyodide/_base.py", line 573, in eval_code_async
    await CodeRunner(
  File "<exec>", line 1, in <module>
NameError: name 'x' is not defined`;

describe("python core", () => {
  it("extracts the final error line", () => {
    expect(lastErrorLine(TB)).toBe("NameError: name 'x' is not defined");
  });
  it("drops internal frames, keeps user frame", () => {
    const c = cleanTraceback(TB);
    expect(c).not.toContain("_base.py");
    expect(c).toContain('File "<exec>"');
  });
  it("collects stdout and maps errors", async () => {
    const enc = new TextEncoder();
    let so: (b: Uint8Array) => number = () => 0;
    let pending = ""; // simulates Python's buffer: partial lines only reach stdout on flush
    const py: PyLike = {
      globals: { get: () => () => ({}) },
      setStdout: (o) => (so = o.write),
      setStderr: () => {},
      runPython: () => {
        so(enc.encode(pending));
        pending = "";
      },
      runPythonAsync: async (code) => {
        if (code === "bad") throw new Error(TB);
        if (code === "partial") pending = "a";
        else so(enc.encode("hi\n"));
      },
    };
    const run = createPyHandler(py);
    expect(await run("ok")).toMatchObject({ success: true, output: "hi" });
    const r = await run("bad");
    expect(r.success).toBe(false);
    expect(r.errors.at(-1)).toBe("NameError: name 'x' is not defined");
    expect(r.errors[0]).toContain('File "<exec>"');
    expect(r.errors.join("\n").split("NameError").length).toBe(2); // error line shown once
    expect((await run("ok")).output).toBe("hi"); // output reset between runs
    expect((await run("partial")).output).toBe("a"); // no trailing newline, not lost
  });
});

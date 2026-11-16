// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createPythonEngine } from ".";

/** Fake Worker: `reply` decides the answer to each message; undefined = never answers (stuck load). */
const fake = (reply: (m: { id: number }) => object | undefined) => () => {
  const w = new EventTarget() as EventTarget & { postMessage(m: { id: number }): void; terminate(): void };
  w.postMessage = (m) => {
    const data = reply(m);
    if (data) queueMicrotask(() => w.dispatchEvent(new MessageEvent("message", { data: { id: m.id, ...data } })));
  };
  w.terminate = () => {};
  return w as unknown as Worker;
};

describe("python engine glue", () => {
  it("initialize times out with a clear error when Pyodide never loads", async () => {
    const e = createPythonEngine(fake(() => undefined), 20);
    await expect(e.initialize()).rejects.toThrow("Python engine failed to load");
  });
  it("reports a load failure from the worker as an error", async () => {
    const e = createPythonEngine(fake(() => ({ error: "Python engine failed to load: 404" })), 1000);
    await expect(e.initialize()).rejects.toThrow("Python engine failed to load: 404");
  });
  it("initializes and executes when the worker answers", async () => {
    const e = createPythonEngine(fake(() => ({ result: { success: true, output: "hi", errors: [] } })), 1000);
    await e.initialize();
    expect((await e.execute("print('hi')")).output).toBe("hi");
  });
});

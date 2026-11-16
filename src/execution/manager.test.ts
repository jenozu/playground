import { describe, expect, it, vi, beforeEach } from "vitest";
import { loaders, run, stop } from "./manager";
import type { ExecutionEngine } from "../types/execution";

const ok = { success: true, output: "hi", errors: [] };
const fake = (execute: ExecutionEngine["execute"]) => ({
  initialize: vi.fn(async () => {}),
  execute: vi.fn(execute),
  stop: vi.fn(async () => {}),
  reset: vi.fn(async () => {}),
  dispose: vi.fn(async () => {}),
});

describe("execution manager", () => {
  beforeEach(() => {
    for (const k of Object.keys(loaders)) delete loaders[k];
  });

  it("loads the adapter once and reports status", async () => {
    const eng = fake(async () => ok);
    const load = vi.fn(async () => eng);
    loaders.t1 = load;
    const st: string[] = [];
    await run("t1", "a", { onStatus: (s) => st.push(s) });
    await run("t1", "b");
    expect(load).toHaveBeenCalledTimes(1);
    expect(eng.initialize).toHaveBeenCalledTimes(1);
    expect(st).toEqual(["loading", "running", "done"]);
  });

  it("times out with an error result and stops the engine", async () => {
    const eng = fake(() => new Promise(() => {}));
    loaders.t2 = async () => eng;
    const r = await run("t2", "x", { timeoutMs: 20 });
    expect(r.success).toBe(false);
    expect(r.errors[0]).toMatch(/Timed out/);
    expect(eng.stop).toHaveBeenCalled();
  });

  it("stop() calls the adapter", async () => {
    const eng = fake(() => new Promise(() => {}));
    loaders.t3 = async () => eng;
    void run("t3", "x", { timeoutMs: 1000 });
    await vi.waitFor(() => expect(eng.execute).toHaveBeenCalled());
    await stop();
    expect(eng.stop).toHaveBeenCalled();
  });

  it("unknown language gives a clear error", async () => {
    const r = await run("cobol", "x");
    expect(r.errors[0]).toMatch(/No execution engine for language "cobol"/);
  });
});

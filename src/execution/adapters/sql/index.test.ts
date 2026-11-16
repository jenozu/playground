// @vitest-environment node
import { describe, expect, it, beforeAll } from "vitest";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { createHandler, type SqlMsg } from "./core";
import { createSqlEngine } from ".";

let SQL: SqlJsStatic;
beforeAll(async () => { SQL = await initSqlJs(); });

/** Fake Worker running the real handler in-process; `hang` drops replies to simulate a stuck query. */
class FakeWorker extends EventTarget {
  static all: FakeWorker[] = [];
  handle = createHandler(SQL);
  hang = false;
  terminated = false;
  constructor() { super(); FakeWorker.all.push(this); }
  postMessage({ id, ...msg }: SqlMsg & { id: number }) {
    if (this.hang) return;
    queueMicrotask(() => {
      if (this.terminated) return;
      let data;
      try { data = { id, result: this.handle(msg) }; } catch (e) { data = { id, error: (e as Error).message }; }
      this.dispatchEvent(new MessageEvent("message", { data }));
    });
  }
  terminate() { this.terminated = true; }
}
const engine = () => createSqlEngine(() => new FakeWorker() as unknown as Worker);
const last = () => FakeWorker.all[FakeWorker.all.length - 1];

describe("sql engine glue", () => {
  it("stop rejects a pending execute and respawns", async () => {
    const e = engine();
    await e.initialize();
    last().hang = true;
    const p = e.execute("SELECT 1");
    await e.stop();
    await expect(p).rejects.toThrow("Execution stopped");
    expect((await e.execute("SELECT 2 x")).table?.rows).toEqual([[2]]);
  });

  it("worker error event rejects pending calls instead of hanging", async () => {
    const e = engine();
    const p = e.initialize();
    last().hang = true;
    last().dispatchEvent(Object.assign(new Event("error"), { message: "wasm failed" }));
    await expect(p).rejects.toThrow("wasm failed");
  });

  it("dispose rejects pending calls", async () => {
    const e = engine();
    await e.initialize();
    last().hang = true;
    const p = e.execute("SELECT 1");
    await e.dispose();
    await expect(p).rejects.toThrow("Execution stopped");
  });

  it("drops the previous dataset when the next lesson has none", async () => {
    const e = engine();
    await e.initialize();
    const ds = "CREATE TABLE employees(id INT); INSERT INTO employees VALUES (1);";
    expect((await e.execute("SELECT * FROM employees", { dataset: ds })).success).toBe(true);
    const r = await e.execute("SELECT * FROM employees");
    expect(r.errors[0]).toBe("no such table: employees");
  });

  it("reset before initialize does not throw", async () => {
    await expect(engine().reset()).resolves.toBeUndefined();
  });
});

describe("worker handler", () => {
  it("failed dataset leaves no closed db behind", () => {
    const h = createHandler(SQL);
    h({ type: "init" });
    expect(() => h({ type: "init", dataset: "NOT SQL" })).toThrow();
    // later execs report the dataset's own sqlite error, never "Database closed"
    expect(() => h({ type: "exec", code: "SELECT 1 a" })).toThrow(/syntax error/);
    h({ type: "init" });
    expect(h({ type: "exec", code: "SELECT 1 a" })?.table?.rows).toEqual([[1]]);
  });
});

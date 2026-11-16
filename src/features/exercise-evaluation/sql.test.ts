// @vitest-environment node
import { describe, expect, it, beforeAll } from "vitest";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { createDb, execSql } from "../../execution/adapters/sql/core";
import { emitIfPassed, evaluateSql } from "./sql";

let SQL: SqlJsStatic;
beforeAll(async () => { SQL = await initSqlJs(); });
const ds = "CREATE TABLE t(id INT); INSERT INTO t VALUES (1),(2),(3);";
const runner = () => {
  let db = createDb(SQL, ds);
  return {
    reset: async () => { db.close(); db = createDb(SQL, ds); },
    exec: async (c: string) => execSql(db, c),
  };
};

describe("evaluateSql", () => {
  it("correct SQL passes (order-insensitive)", async () => {
    const r = await evaluateSql([{ name: "all", expectedRows: [[3], [1], [2]] }], "SELECT id FROM t", runner());
    expect(r[0].passed).toBe(true);
  });
  it("wrong row count fails with expected/actual", async () => {
    const [r] = await evaluateSql([{ name: "n", expectedRows: [[1], [2], [3]] }], "SELECT id FROM t WHERE id<3", runner());
    expect(r.passed).toBe(false);
    expect(r.expected).toBe("[[1],[2],[3]]");
    expect(r.actual).toBe("[[1],[2]]");
  });
  it("wrong order fails only when orderMatters", async () => {
    const q = "SELECT id FROM t ORDER BY id DESC";
    const rows = [[1], [2], [3]];
    expect((await evaluateSql([{ name: "o", expectedRows: rows, orderMatters: true }], q, runner()))[0].passed).toBe(false);
    expect((await evaluateSql([{ name: "o", expectedRows: rows }], q, runner()))[0].passed).toBe(true);
  });
  it("checkQuery, column names, SQL errors", async () => {
    const t = { name: "c", checkQuery: "SELECT COUNT(*) n FROM t", expectedRows: [[2]], expectedColumns: ["n"] };
    expect((await evaluateSql([t], "DELETE FROM t WHERE id=3", runner()))[0].passed).toBe(true);
    expect((await evaluateSql([{ ...t, expectedColumns: ["x"] }], "DELETE FROM t WHERE id=3", runner()))[0].passed).toBe(false);
    expect((await evaluateSql([t], "SELEC", runner()))[0].error).toMatch(/syntax/);
  });
  it("emits exercise-passed only when all pass", () => {
    const et = new EventTarget();
    let n = 0;
    et.addEventListener("exercise-passed", () => n++);
    emitIfPassed([{ name: "a", passed: false }], et);
    emitIfPassed([{ name: "a", passed: true }], et);
    expect(n).toBe(1);
  });
});

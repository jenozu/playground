// @vitest-environment node
import { describe, expect, it, beforeAll } from "vitest";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { createDb, execSql } from "./core";

let SQL: SqlJsStatic;
beforeAll(async () => { SQL = await initSqlJs(); });

describe("sql core", () => {
  it("create/insert/select/join/aggregate", () => {
    const db = createDb(SQL);
    const r = execSql(db, `CREATE TABLE a(id INT, n TEXT); CREATE TABLE b(id INT, v INT);
      INSERT INTO a VALUES (1,'x'),(2,'y'); INSERT INTO b VALUES (1,5),(1,7),(2,1);
      SELECT a.n, SUM(b.v) s FROM a JOIN b ON a.id=b.id GROUP BY a.n ORDER BY a.n;`);
    expect(r.success).toBe(true);
    expect(r.table).toEqual({ columns: ["n", "s"], rows: [["x", 12], ["y", 1]] });
  });
  it("one table per result set", () => {
    const r = execSql(createDb(SQL), "SELECT 1 a; SELECT 2 b;");
    expect(r.tables).toHaveLength(2);
  });
  it("zero-row SELECT keeps its column headers", () => {
    const db = createDb(SQL, "CREATE TABLE t(id INT, n TEXT);");
    const r = execSql(db, "SELECT * FROM t");
    expect(r.table).toEqual({ columns: ["id", "n"], rows: [] });
    expect(r.output).toBe("0 row(s)");
  });
  it("keeps sqlite error", () => {
    const r = execSql(createDb(SQL), "SELECT * FROM employees");
    expect(r.success).toBe(false);
    expect(r.errors[0]).toBe("no such table: employees");
  });
  it("dataset applied and reset clears user tables", () => {
    const ds = "CREATE TABLE employees(id INT); INSERT INTO employees VALUES (1);";
    let db = createDb(SQL, ds);
    execSql(db, "CREATE TABLE tmp(x INT)");
    db.close();
    db = createDb(SQL, ds);
    expect(execSql(db, "SELECT * FROM employees").table?.rows).toEqual([[1]]);
    expect(execSql(db, "SELECT * FROM tmp").success).toBe(false);
  });
});

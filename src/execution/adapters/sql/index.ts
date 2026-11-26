import type { ExecutionEngine } from "../../../types/execution";
import { createSqlEngineWith } from "./engine";

const spawnWorker = () => new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

/** Main-thread side: talks to the sql.js worker. stop() kills and respawns it (dataset reapplied). */
export function createSqlEngine(makeWorker: () => Worker = spawnWorker): ExecutionEngine {
  return createSqlEngineWith(makeWorker);
}

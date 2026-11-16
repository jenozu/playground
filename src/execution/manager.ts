import type { ExecutionEngine, ExecutionResult } from "../types/execution";

export type Status = "loading" | "running" | "done";
export type Loader = () => Promise<ExecutionEngine>;

// Adapters register here as separate chunks (dynamic import); added by the SQL/Python/JS tasks.
export const loaders: Record<string, Loader> = {
  sql: () => import("./adapters/sql").then((m) => m.createSqlEngine()),
  python: () => import("./adapters/python").then((m) => m.createPythonEngine()),
};

export const timeouts: Record<string, number> = { sql: 5000, python: 10000, javascript: 5000 };

const engines = new Map<string, Promise<ExecutionEngine>>();
let active: ExecutionEngine | undefined;

export function getEngine(language: string): Promise<ExecutionEngine> {
  const load = Object.hasOwn(loaders, language) ? loaders[language] : undefined;
  if (!load) return Promise.reject(new Error(`No execution engine for language "${language}".`));
  let p = engines.get(language);
  if (!p) {
    p = load().then(async (e) => {
      await e.initialize();
      return e;
    });
    p.catch(() => engines.delete(language)); // allow retry after a failed load
    engines.set(language, p);
  }
  return p;
}

const fail = (m: string): ExecutionResult => ({ success: false, output: "", errors: [m] });

export async function run(
  language: string,
  code: string,
  opts: { timeoutMs?: number; onStatus?: (s: Status) => void; options?: object } = {},
): Promise<ExecutionResult> {
  let engine: ExecutionEngine;
  try {
    opts.onStatus?.("loading");
    engine = await getEngine(language);
  } catch (e) {
    opts.onStatus?.("done");
    return fail(e instanceof Error ? e.message : String(e));
  }
  const ms = opts.timeoutMs ?? (Object.hasOwn(timeouts, language) ? timeouts[language] : 5000);
  opts.onStatus?.("running");
  active = engine;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      engine.execute(code, opts.options),
      new Promise<ExecutionResult>((res) => {
        timer = setTimeout(() => {
          res(fail(`Timed out after ${ms / 1000}s.`)); // settle first: stop() rejects execute()
          engine.stop().catch(() => {});
        }, ms);
      }),
    ]);
  } catch (e) {
    return fail(e instanceof Error ? e.message : String(e));
  } finally {
    clearTimeout(timer);
    if (active === engine) active = undefined;
    opts.onStatus?.("done");
  }
}

export async function stop(): Promise<void> {
  await active?.stop();
}

export async function reset(language: string): Promise<void> {
  const p = engines.get(language);
  if (p) await (await p).reset();
}

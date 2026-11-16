import type { ExecutionEngine, ExecutionResult } from "../../../types/execution";

const LOAD_TIMEOUT_MS = 60_000;
const spawnWorker = () => new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

/** Main-thread side: talks to the Pyodide worker. stop() kills and respawns it (Pyodide reloads from cache). */
export function createPythonEngine(makeWorker: () => Worker = spawnWorker, loadTimeoutMs = LOAD_TIMEOUT_MS): ExecutionEngine {
  let worker: Worker | undefined;
  let seq = 0;
  const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();

  const rejectAll = (msg: string) => {
    for (const p of pending.values()) p.reject(new Error(msg));
    pending.clear();
  };
  const kill = (msg = "Execution stopped") => {
    worker?.terminate();
    worker = undefined;
    rejectAll(msg);
  };
  const spawn = () => {
    const w = makeWorker();
    w.addEventListener("message", ({ data }: MessageEvent) => {
      const p = pending.get(data.id);
      if (!p) return;
      pending.delete(data.id);
      if (data.error) p.reject(new Error(data.error));
      else p.resolve(data.result);
    });
    const onError = (e: Event) => {
      e.preventDefault?.();
      if (worker === w) rejectAll((e as ErrorEvent).message || "Python engine failed to load");
    };
    w.addEventListener("error", onError);
    w.addEventListener("messageerror", onError);
    worker = w;
  };
  const call = <T>(msg: object): Promise<T> => {
    if (!worker) spawn();
    const w = worker!;
    return new Promise<T>((resolve, reject) => {
      const id = ++seq;
      pending.set(id, { resolve: resolve as (v: unknown) => void, reject });
      w.postMessage({ id, ...msg });
    });
  };
  const restart = async () => {
    kill();
    // A stuck load (e.g. a wasm fetch that never finishes) must not hang the UI forever.
    const timer = setTimeout(() => kill("Python engine failed to load"), loadTimeoutMs);
    try {
      await call({ type: "init" });
    } finally {
      clearTimeout(timer);
    }
  };

  return {
    initialize: restart,
    execute: (code) => call<ExecutionResult>({ type: "exec", code }),
    stop: restart,
    reset: async () => {}, // every run already starts with fresh globals
    dispose: async () => kill(),
  };
}

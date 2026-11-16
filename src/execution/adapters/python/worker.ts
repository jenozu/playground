import { loadPyodide } from "pyodide";
import { createPyHandler, type PyLike, type PyMsg } from "./core";

// One shared promise: awaiting it resolves in FIFO order, so messages are handled in arrival order.
const ready = loadPyodide({ indexURL: `${import.meta.env.BASE_URL}pyodide/` }).then(
  (py) => createPyHandler(py as unknown as PyLike),
  (e: unknown) => {
    throw new Error(`Python engine failed to load: ${e instanceof Error ? e.message : String(e)}`);
  },
);
ready.catch(() => {}); // reported per message below, not as an unhandled rejection

self.onmessage = async ({ data }: MessageEvent<PyMsg & { id: number }>) => {
  try {
    const run = await ready;
    self.postMessage({ id: data.id, result: data.type === "exec" ? await run(data.code ?? "") : null });
  } catch (e) {
    self.postMessage({ id: data.id, error: e instanceof Error ? e.message : String(e) });
  }
};

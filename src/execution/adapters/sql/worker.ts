import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { createHandler, type SqlMsg } from "./core";

// One shared promise: awaiting it resolves in FIFO order, so messages are handled in arrival order.
const ready = initSqlJs({ locateFile: () => wasmUrl }).then(createHandler);

self.onmessage = async ({ data }: MessageEvent<SqlMsg & { id: number }>) => {
  try {
    const handle = await ready;
    self.postMessage({ id: data.id, result: handle(data) });
  } catch (e) {
    self.postMessage({ id: data.id, error: e instanceof Error ? e.message : String(e) });
  }
};

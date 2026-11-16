import { useState } from "react";

/** Reveals hints one at a time. Remount (key) per lesson to reset. */
export function Hints({ hints }: { hints: string[] }) {
  const [n, setN] = useState(0);
  if (!hints.length) return null;
  return (
    <div className="mt-3" data-testid="hints">
      <ol className="ml-4 list-decimal text-sm">
        {hints.slice(0, n).map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ol>
      {n < hints.length && (
        <button type="button" className="rounded border px-2 py-1 text-sm" onClick={() => setN(n + 1)}>
          {n === 0 ? "Show hint" : "Show next hint"} ({n}/{hints.length})
        </button>
      )}
    </div>
  );
}

/** Solution is only displayed (read-only) after confirm; never touches the user's code. */
export function Solution({ solution, confirm = window.confirm }: { solution: string; confirm?: (m: string) => boolean }) {
  const [open, setOpen] = useState(false);
  if (open)
    return (
      <div className="mt-3" data-testid="solution">
        <p className="text-sm font-semibold">Solution (read-only)</p>
        <pre className="overflow-auto rounded border p-2 text-sm">{solution}</pre>
        <button type="button" className="rounded border px-2 py-1 text-sm" onClick={() => setOpen(false)}>
          Hide solution
        </button>
      </div>
    );
  return (
    <button
      type="button"
      className="mt-3 rounded border px-2 py-1 text-sm"
      onClick={() => confirm("Show the solution? Try a hint first.") && setOpen(true)}
    >
      Show solution
    </button>
  );
}

/** Reset is free when the code is unedited; otherwise the user must confirm losing edits. */
export function shouldReset(code: string, starter: string, confirm: (m: string) => boolean = window.confirm) {
  return code === starter || confirm("Reset to starter code? Your edits will be lost.");
}

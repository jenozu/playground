# Security

Stub. Planned policy, not yet implemented:
- User code runs only in the browser, in a Web Worker or sandboxed iframe, with timeouts. Never on a server.
- Imported courses are untrusted: validate manifest and paths, extract ZIPs safely, render Markdown without raw HTML, never execute imported scripts.
- A strict Content Security Policy will be set at hosting time (must allow WASM for sql.js and Pyodide).

Report issues to the repository owner.

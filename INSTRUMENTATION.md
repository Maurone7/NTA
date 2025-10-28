Developer instrumentation & debug hooks

The renderer contains lightweight dev-only instrumentation and debug helpers useful for E2E tests and local troubleshooting.

Primary hooks (renderer)
- File: `src/renderer/app.js`
  - `__DEBUG__` (boolean) — when set to `true` the module-level `debugLog(...)` will emit logs.
  - `window.__nta_debug_events` / `window.__nta_debug_push(ev)` — a small event queue tests can inspect.
  - `window.__nta_test_setSidebarWidth(px)` — helper used by tests to programmatically set the sidebar width.
  - `window.__nta_trace` — a public start/stop stub for tracing. Call `window.__nta_trace.start()` to enable tracing and `window.__nta_trace.stop()` to stop.

How to enable detailed logs locally
1. Edit `src/renderer/app.js` and set `const __DEBUG__ = true` near the top of the file.
2. Reload the renderer (restart the app or re-run tests that evaluate the renderer bundle).

Notes
- Keep `__DEBUG__` disabled in production builds to avoid noisy logs and runtime overhead.
- Prefer using `window.__nta_debug_push` or `window.__nta_trace` in tests rather than enabling global logging.
- The `debugLog` wrapper is intentionally lightweight: it checks `__DEBUG__` and forwards to `console.log` only when enabled.

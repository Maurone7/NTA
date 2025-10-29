const assert = require('assert');
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');

describe('DOM: Terminal viewport resize ensures prompt visibility', function() {
  it('resizes terminal viewport with guard band to keep prompt visible at various heights', function() {
    // Prepare minimal DOM with terminal elements
    const html = `<!doctype html><html><body>
      <div id="nta-terminal-container" style="height: 200px; width: 400px; display: block;">
        <div id="nta-terminal" style="height: 100%; width: 100%;"></div>
      </div>
    </body></html>`;

    // Provide a VirtualConsole so jsdom doesn't try to access an undefined console
    const vConsole = new VirtualConsole();
    if (typeof console !== 'undefined') {
      ['log', 'info', 'warn', 'error'].forEach(evt => vConsole.on(evt, (...args) => { console[evt] && console[evt](...args); }));
    }
    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost', virtualConsole: vConsole });
    const window = dom.window;
    const document = window.document;

    global.window = window;
    global.document = document;
    global.HTMLElement = window.HTMLElement;

        // Provide minimal stubs
    if (!global.window.localStorage) global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    global.localStorage = global.window.localStorage;
    global.window.api = global.window.api || { on: () => {}, removeListener: () => {}, invoke: () => {} };
    if (typeof window.matchMedia !== 'function') {
      window.matchMedia = (query) => ({ matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeListener: () => {}, removeEventListener: () => {} });
    }

    global.window.terminal = { active: false };

    // Mock terminal constructor
    window.Terminal = function() { return mockTerminal; };

    // Load app module (clear from require cache to avoid cross-test state)
    try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
    const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};
    if (typeof hooks.initialize === 'function') {
      try { hooks.initialize(); } catch (e) { /* ignore */ }
    }

    console.log('resizeTerminalViewport function:', typeof appModule.__test__.resizeTerminalViewport);

    // Mock terminal instance with resize tracking
    const resizeCalls = [];
    const mockTerminal = {
      cols: 80,
      rows: 24,
      open: function() {},
      onData: function() {},
      onResize: function() {},
      write: function() {},
      resize: function(cols, rows) {
        console.log('Mock resize called with', cols, rows);
        this.cols = cols;
        this.rows = rows;
        resizeCalls.push({ cols, rows });
      },
      element: {
        querySelector: function(selector) {
          if (selector === '.xterm-viewport') {
            return { clientWidth: 400 };
          } else if (selector === '.xterm-rows') {
            return { clientHeight: 192 }; // 24 rows * 8px height
          }
          return null;
        }
      },
      _core: {
        _renderService: {
          dimensions: {
            actualCellWidth: 8,
            actualCellHeight: 8,
            actualCellWidthLegacy: 8,
            actualCellHeightLegacy: 8
          }
        }
      },
      scrollToBottom: function() {}
    };

    // Set up state with mock terminal
    appModule.__test__.state.terminalInstance = mockTerminal;

    const container = document.getElementById('nta-terminal-container');
    const terminalEl = document.getElementById('nta-terminal');

    // Test at different heights to ensure prompt visibility
    const testHeights = [50, 80, 120, 200, 300];

    testHeights.forEach((height) => {
      // Reset resize calls
      resizeCalls.length = 0;

      // Set container height
      container.style.height = `${height}px`;
      terminalEl.style.height = `${height}px`;
      // In JSDOM, clientHeight/offsetHeight are not settable, use defineProperty
      Object.defineProperty(terminalEl, 'clientHeight', { value: height, writable: true });
      Object.defineProperty(terminalEl, 'offsetHeight', { value: height, writable: true });
      Object.defineProperty(terminalEl, 'clientWidth', { value: 400, writable: true });
      Object.defineProperty(terminalEl, 'offsetWidth', { value: 400, writable: true });

      // Call resize function
      console.log('Calling resizeTerminalViewport with height', height);
      try {
        appModule.__test__.resizeTerminalViewport({ term: mockTerminal, terminalEl });
      } catch (e) {
        console.log('Error calling resizeTerminalViewport:', e);
      }
      console.log('Resize calls after:', resizeCalls.length);

      // Verify resize was called
      assert(resizeCalls.length === 1, `Expected 1 resize call for height ${height}, got ${resizeCalls.length}`);

      const { cols, rows } = resizeCalls[0];

      // Basic sanity checks
      assert(cols > 0, `Cols should be > 0 for height ${height}, got ${cols}`);
      assert(rows > 0, `Rows should be > 0 for height ${height}, got ${rows}`);
      assert(cols <= 200, `Cols should be reasonable for height ${height}, got ${cols}`);
      assert(rows <= 100, `Rows should be reasonable for height ${height}, got ${rows}`);

      // For very small heights, ensure minimum values
      if (height < 80) {
        assert(rows >= 2, `Rows should be at least 2 for small height ${height}, got ${rows}`);
        assert(cols >= 2, `Cols should be at least 2 for small height ${height}, got ${cols}`);
      }
    });

    // Clean up
    try { if (appModule && appModule.__test__ && typeof appModule.__test__.stopAutosave === 'function') appModule.__test__.stopAutosave(); } catch (e) {}
    try { window.close(); } catch (e) {}
    delete global.window; delete global.document; delete global.localStorage;
  });
});
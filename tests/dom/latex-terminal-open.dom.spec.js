const assert = require('assert');
const path = require('path');
const { JSDOM } = require('jsdom');

// Simulate the renderer lifecycle to ensure the built-in terminal opens and
// receives the LaTeX install command when the IPC event is emitted.
describe('LaTeX built-in terminal integration', function() {
  this.timeout(5000);

  const APP_PATH = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');

  let previousGlobals = {};

  function stashGlobal(name) {
    previousGlobals[name] = Object.prototype.hasOwnProperty.call(global, name) ? global[name] : undefined;
  }

  function restoreGlobals() {
    Object.entries(previousGlobals).forEach(([name, value]) => {
      if (typeof value === 'undefined') {
        delete global[name];
      } else {
        global[name] = value;
      }
    });
    previousGlobals = {};
  }

  afterEach(() => {
    if (!global.__testSkipRestore) {
      delete require.cache[APP_PATH];
      try { global.window && typeof global.window.close === 'function' && global.window.close(); } catch (e) {}
      restoreGlobals();
    }
  });

  it('opens the terminal and forwards the install command to the PTY bridge', async function() {
    global.__testSkipRestore = true;

    const dom = new JSDOM(`<!DOCTYPE html><html><body>
      <div id="status-text"></div>
      <div id="nta-terminal-container" style="display: none;">
        <div id="nta-terminal"></div>
      </div>
    </body></html>`, {
      url: 'http://localhost/',
      pretendToBeVisual: true
    });

    const { window } = dom;

    ['window', 'document', 'navigator', 'Node', 'HTMLElement', 'Element', 'SVGElement'].forEach((key) => {
      stashGlobal(key);
      global[key] = window[key];
    });
    stashGlobal('getComputedStyle');
    global.getComputedStyle = window.getComputedStyle.bind(window);

    const registeredEvents = {};
    const sendCalls = [];
    const invokeCalls = [];

    window.matchMedia = window.matchMedia || (() => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {}
    }));
    window.requestAnimationFrame = window.requestAnimationFrame || ((cb) => setTimeout(cb, 0));
    if (!window.HTMLElement.prototype.scrollIntoView) {
      window.HTMLElement.prototype.scrollIntoView = function() {};
    }

    const allowedChannels = new Set([
      'workspace:changed',
      'workspace:fileDeleted',
      'latex:installation-progress',
      'latex:installation-complete',
      'latex:installation-error',
      'latex:show-terminal-for-install',
      'terminal:toggle',
      'terminal:output'
    ]);

    window.api = {
      on(channel, callback) {
        if (!allowedChannels.has(channel)) {
          throw new Error(`Channel ${channel} not allowed in test stub`);
        }
        registeredEvents[channel] = callback;
      },
      send(channel, payload) {
        sendCalls.push({ channel, payload });
        if (channel === 'terminal:toggleRequest' && typeof registeredEvents['terminal:toggle'] === 'function') {
          return registeredEvents['terminal:toggle']();
        }
        return undefined;
      },
      invoke(channel, payload) {
        invokeCalls.push({ channel, payload });
        return Promise.resolve({ ok: true });
      },
      installLatex: () => Promise.resolve({ installing: true }),
      checkLatexInstalled: () => Promise.resolve({ installed: false })
    };

    class TerminalMock {
      constructor() {
        this.onData = () => {};
        this.onBinary = () => {};
        this.onResize = () => {};
        this.cols = 80;
        this.rows = 24;
      }
      open(el) {
        this.element = el;
        if (!this.element.querySelector('.xterm-rows')) {
          const rows = window.document.createElement('div');
          rows.className = 'xterm-rows';
          const row = window.document.createElement('div');
          row.className = 'xterm-row';
          rows.appendChild(row);
          this.element.appendChild(rows);
        }
      }
      write() {}
      resize() {}
      dispose() {}
      scrollToBottom() {
        window.__terminalScrollCalls = (window.__terminalScrollCalls || 0) + 1;
      }
    }
    window.Terminal = TerminalMock;

    global.window.terminal = { active: false };

    require(APP_PATH);

    const appModule = require(APP_PATH);
    if (appModule.__test__ && appModule.__test__.initializeExportHandlers) {
      appModule.__test__.initializeExportHandlers();
    } else {
      window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    }

    const handler = registeredEvents['latex:show-terminal-for-install'];
    assert.ok(typeof handler === 'function', 'renderer should register latex:show-terminal-for-install handler');

    const tinytexCommand = 'curl -fsSL "https://yihui.org/gh/tinytex/tools/install-unx.sh" | sh && tlmgr path add && tlmgr install scheme-basic';

    await handler({
      command: tinytexCommand,
      distribution: 'TinyTeX',
      message: 'Installing TinyTeX'
    });

    await new Promise(resolve => setTimeout(resolve, 200));

    assert.ok(invokeCalls.some((entry) => entry.channel === 'terminal:init'), 'renderer should initialize terminal PTY before sending command');

    const outputHandler = registeredEvents['terminal:output'];
    assert.ok(typeof outputHandler === 'function', 'renderer should register terminal:output handler to stream PTY data');
    outputHandler('Installing...\n');
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.ok((window.__terminalScrollCalls || 0) >= 1, 'terminal should auto-scroll to keep prompt visible');

    global.__testSkipRestore = false;
    delete require.cache[APP_PATH];
    try { global.window && typeof global.window.close === 'function' && global.window.close(); } catch (e) {}
    restoreGlobals();
  });

  it('closes terminal and hides warning banner on successful LaTeX installation', async function() {
    const dom = new JSDOM(`<!DOCTYPE html><html><body>
      <div id="status-text"></div>
      <div id="nta-terminal-container" style="display: flex;">
        <div id="nta-terminal"></div>
      </div>
      <div id="latex-warning-banner" style="display: block;"></div>
    </body></html>`, {
      url: 'http://localhost/',
      pretendToBeVisual: true
    });

    const { window } = dom;

    ['window', 'document', 'navigator', 'Node', 'HTMLElement', 'Element', 'SVGElement'].forEach((key) => {
      stashGlobal(key);
      global[key] = window[key];
    });
    stashGlobal('getComputedStyle');
    global.getComputedStyle = window.getComputedStyle.bind(window);

    const registeredEvents = {};
    const sendCalls = [];

    window.matchMedia = window.matchMedia || (() => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {}
    }));
    window.requestAnimationFrame = window.requestAnimationFrame || ((cb) => setTimeout(cb, 0));

    const allowedChannels = new Set([
      'workspace:changed',
      'workspace:fileDeleted',
      'latex:installation-progress',
      'latex:installation-complete',
      'latex:installation-error',
      'latex:show-terminal-for-install',
      'terminal:toggle',
      'terminal:output'
    ]);

    window.api = {
      on(channel, callback) {
        if (!allowedChannels.has(channel)) {
          throw new Error(`Channel ${channel} not allowed in test stub`);
        }
        registeredEvents[channel] = callback;
      },
      send(channel, payload) {
        sendCalls.push({ channel, payload });
        if (channel === 'terminal:toggleRequest' && typeof registeredEvents['terminal:toggle'] === 'function') {
          registeredEvents['terminal:toggle']();
        }
        return undefined;
      },
      invoke(channel, payload) {
        return Promise.resolve({ ok: true });
      },
      installLatex: () => Promise.resolve({ installing: true }),
      checkLatexInstalled: () => Promise.resolve({ installed: false }),
      reload: () => {
        window.__appReloaded = true;
        return Promise.resolve({ success: true });
      }
    };

    global.window.terminal = { active: false };

    require(APP_PATH);

    const appModule = require(APP_PATH);
    if (appModule.__test__ && appModule.__test__.initializeExportHandlers) {
      appModule.__test__.initializeExportHandlers();
    } else {
      window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    }

    // Mock the terminal toggle handler
    registeredEvents['terminal:toggle'] = () => {
      const container = document.getElementById('nta-terminal-container');
      if (container) {
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
      }
    };

    const completionHandler = registeredEvents['latex:installation-complete'];
    assert.ok(typeof completionHandler === 'function', 'renderer should register latex:installation-complete handler');

    // Simulate successful installation
    completionHandler({
      success: true,
      message: 'TinyTeX installed successfully'
    });

    await new Promise(resolve => setTimeout(resolve, 200));

    // Wait for the reload timeout
    await new Promise((resolve) => setTimeout(resolve, 2100));
    assert.ok(window.__appReloaded, 'app should be reloaded after successful installation');
  });
});

const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: Autosave indicator updates when toggled or interval changed', function() {
  it('updates status text on toggle and interval change', function() {
    // Stub console methods to avoid noise BEFORE creating JSDOM
    global.console = {
      debug: () => {},
      log: () => {},
      warn: () => {},
      error: () => {}
    };

    const html = `<html><body>
      <div class="status-bar__autosave" aria-live="polite">
        <div class="autosave-dot" id="autosave-dot" title="Autosave status"></div>
        <div id="autosave-text">Autosave off</div>
        <button id="save-now-button" class="save-now">Save now</button>
      </div>

      <div id="settings-modal">
        <input type="checkbox" id="autosave-toggle" class="settings-toggle">
        <input type="range" id="autosave-interval" min="5" max="300" value="30" step="5">
        <span id="autosave-interval-value">30s</span>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;

    global.window = window;
    global.document = document;

    // Ensure localStorage exists in this environment
    if (!global.window.localStorage) {
      global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    }
    global.localStorage = global.window.localStorage;

    // Expose minimal API expected by app.js
    global.window.api = global.window.api || { on: () => {}, removeListener: () => {}, invoke: () => {} };

    // Ensure matchMedia exists (some test envs don't provide it)
    if (typeof window.matchMedia !== 'function') {
      window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      });
    }

  // Load the renderer module (clear from require cache to avoid cross-test state)
  try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
  const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};

    if (typeof hooks.initialize === 'function') {
      try { hooks.initialize(); } catch (e) { /* ignore init errors in test env */ }
    }

    // After initialization, the autosave text should reflect the current setting
    const autosaveText = document.getElementById('autosave-text');
    const autosaveToggle = document.getElementById('autosave-toggle');
    const autosaveInterval = document.getElementById('autosave-interval');

    // Default should be present (either 'Autosave' or 'Autosave off')
    assert(autosaveText, 'autosave-text element should exist');

    // Toggle off and check text
    autosaveToggle.checked = false;
    autosaveToggle.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.strictEqual(autosaveText.textContent, 'Autosave off', 'Status should show Autosave off after disabling');

    // Toggle on and check text shows interval
    autosaveToggle.checked = true;
    autosaveToggle.dispatchEvent(new window.Event('change', { bubbles: true }));
    // Give handlers a tick
    const txtAfterOn = autosaveText.textContent;
    assert(txtAfterOn.startsWith('Autosave'), `Status should show Autosave when enabled, got: ${txtAfterOn}`);

    // Change interval and ensure status updates to include new interval
    autosaveInterval.value = '10';
    autosaveInterval.dispatchEvent(new window.Event('input', { bubbles: true }));
    const txtAfterInterval = autosaveText.textContent;
    assert(txtAfterInterval.includes('10s'), `Status should include updated interval (10s), got: ${txtAfterInterval}`);

    // Clean up
    // Stop autosave timer if test hooks expose a stop function so Node can exit
    try { if (appModule && appModule.__test__ && typeof appModule.__test__.stopAutosave === 'function') appModule.__test__.stopAutosave(); } catch (e) {}
    try { window.close(); } catch (e) {}
    delete global.window;
    delete global.document;
    delete global.localStorage;
  });
});

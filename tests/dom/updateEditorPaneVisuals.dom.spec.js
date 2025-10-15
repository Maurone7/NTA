const assert = require('assert');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('DOM: updateEditorPaneVisuals', function() {
  it('marks the active editor pane with .active', function() {
    // Silence console during JSDOM creation
    global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

    const html = `<html><body>
      <section class="editor-pane editor-pane--left" data-pane-id="left"></section>
      <section class="editor-pane editor-pane--right" data-pane-id="right"></section>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const win = dom.window;
    global.window = win;
    global.document = win.document;

    // Minimal stubs expected by src/renderer/app.js
    global.window.api = { on: () => {}, removeListener: () => {} };
    if (!global.window.localStorage) global.window.localStorage = { getItem: () => null, setItem: () => {} };
    global.localStorage = global.window.localStorage;
    // Stub matchMedia which app.js expects
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = (query) => ({ matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
    }

  // Load the renderer module and its test hooks. Clear require cache so the module
  // rebinds to the current JSDOM document (tests run in same Node process).
  const modulePath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
  try { delete require.cache[require.resolve(modulePath)]; } catch (e) {}
  const appModule = require(modulePath);
    const testHooks = appModule.__test__ || {};

    assert(typeof testHooks.updateEditorPaneVisuals === 'function', 'updateEditorPaneVisuals must be exported for tests');
    assert(testHooks.state, 'state must be exported for tests');

    // Initialize if available
    if (typeof testHooks.initialize === 'function') {
      try { testHooks.initialize(); } catch (e) { /* ignore */ }
    }

    try {
      testHooks.state.activeEditorPane = 'left';
      testHooks.updateEditorPaneVisuals();
      const left = document.querySelector('[data-pane-id="left"]');
      assert(left.classList.contains('active'), 'left pane should be active');

      testHooks.state.activeEditorPane = 'right';
      testHooks.updateEditorPaneVisuals();
      const right = document.querySelector('[data-pane-id="right"]');
      assert(right.classList.contains('active'), 'right pane should be active');
      assert(!left.classList.contains('active'), 'left should no longer be active');
    } finally {
      try { win.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
    }
  });

  it('creates identical dividers between multiple editor panes', function() {
    // Silence console during JSDOM creation
    global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

    const html = `<html><body>
      <div class="workspace__content" style="width: 800px; display: flex;">
        <section class="editor-pane editor-pane--left" data-pane-id="left" style="width: 200px;"></section>
        <section class="editor-pane editor-pane--right" data-pane-id="right" style="width: 300px;"></section>
        <section class="editor-pane editor-pane--dynamic" data-pane-id="pane-1" style="width: 300px;"></section>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const win = dom.window;
    global.window = win;
    global.document = win.document;

    global.window.api = { on: () => {}, removeListener: () => {} };
    if (!global.window.localStorage) global.window.localStorage = { getItem: () => null, setItem: () => {} };
    global.localStorage = global.window.localStorage;
    // Stub matchMedia which app.js expects
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = (query) => ({ matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
    }

  const modulePath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
  try { delete require.cache[require.resolve(modulePath)]; } catch (e) {}
  const appModule = require(modulePath);
  const testHooks = appModule.__test__ || {};
    assert(typeof testHooks.updateEditorPaneVisuals === 'function', 'updateEditorPaneVisuals must be exported for tests');

    if (typeof testHooks.initialize === 'function') {
      try { testHooks.initialize(); } catch (e) { /* ignore */ }
    }

    try {
      // Provide simulated editor instances to the state so the visual updater can compute dividers
      testHooks.state.editorInstances = { left: {}, right: {}, 'pane-1': {} };
      testHooks.updateEditorPaneVisuals();
      const dividers = document.querySelectorAll('.editors__divider');
      assert(dividers.length >= 2, `expected at least two dividers, got ${dividers.length}`);
    } finally {
      try { win.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
    }
  });
});

const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: updateEditorPaneVisuals', function() {
  it('applies .active to dynamic panes based on state.activeEditorPane', function() {
    // Create a minimal DOM
    const dom = new JSDOM(`<html><body>
      <section class="editor-pane editor-pane--left" data-pane-id="left"><textarea id="note-editor"></textarea></section>
      <section class="editor-pane editor-pane--right" data-pane-id="right"><textarea id="note-editor-right"></textarea></section>
      <section class="editor-pane editor-pane--dynamic" data-pane-id="pane-1"><textarea id="note-editor-pane-1"></textarea></section>
      <!-- Minimal update-notification UI used by app.js during init -->
      <div id="update-notification" hidden>
        <div class="update-notification__message"></div>
        <div class="update-notification__progress" hidden><div class="update-notification__progress-fill"></div><div class="update-notification__progress-text"></div></div>
        <button id="update-download-button"></button>
        <button id="update-install-button"></button>
        <button id="update-dismiss-button"></button>
      </div>
    </body></html>`, { runScripts: 'outside-only' });
    // Set a URL so JSDOM uses a non-opaque origin and provides window.localStorage
    // (avoids SecurityError: localStorage is not available for opaque origins)
    const domWithUrl = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' });
    // Use the window from the domWithUrl which has localStorage available
    const actualWindow = domWithUrl.window;

    // Provide global document/window for module
  global.window = actualWindow;
  global.document = actualWindow.document;
    // Minimal stub for window.api to satisfy app.js runtime checks when loaded
    // Tests only need a no-op implementation so requiring the module doesn't crash.
    global.window.api = {
      on: () => {},
      removeListener: () => {},
      writeDebugLog: () => {},
      exportPreviewPdf: async () => ({}),
      exportPreviewHtml: async () => ({}),
      exportPreviewDocx: async () => ({}),
      exportPreviewEpub: async () => ({})
    };

    // Stub matchMedia used by some runtime checks in app.js
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      });
    }

    // Stub localStorage used by app.js
    if (!global.window.localStorage) {
      global.window.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      };
    }
    // also expose on global in case code references localStorage without window
    global.localStorage = global.window.localStorage;

    // Require the renderer app module and access exported test hooks
    const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const testHooks = appModule.__test__ || {};
    assert(testHooks.updateEditorPaneVisuals, 'updateEditorPaneVisuals should be exported for tests');
    assert(testHooks.state, 'state should be exported for tests');

    // If the module exports initialize, call it explicitly to wire event handlers.
    if (testHooks.initialize && typeof testHooks.initialize === 'function') {
      try { testHooks.initialize(); } catch (e) { /* ignore init errors in test env */ }
    }

    try {
      // Ensure initial state
      testHooks.state.activeEditorPane = 'pane-1';

      // Call the visual updater
      testHooks.updateEditorPaneVisuals();

      const dynamic = document.querySelector('.editor-pane--dynamic');
      assert(dynamic.classList.contains('active'), 'Dynamic pane should have .active when matched');

      // Switch active to right
      testHooks.state.activeEditorPane = 'right';
      testHooks.updateEditorPaneVisuals();
      const right = document.querySelector('.editor-pane--right');
      const left = document.querySelector('.editor-pane--left');
      assert(right.classList.contains('active'), 'Right pane should have .active when active');
      assert(!dynamic.classList.contains('active'), 'Dynamic pane should not have .active when not active');
    } finally {
      // Close the JSDOM window to stop any pending async callbacks, then cleanup globals
      try { actualWindow.close(); } catch (e) {}
      delete global.window;
      delete global.document;
      delete global.localStorage;
    }
  });
});

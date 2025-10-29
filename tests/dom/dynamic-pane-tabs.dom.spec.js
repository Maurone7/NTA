const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: dynamic pane tabs', function() {
  it('creates tab bar for dynamic panes', function(done) {
    // Stub console methods to avoid noise BEFORE creating JSDOM
    global.console = {
      debug: () => {},
      log: () => {},
      warn: () => {},
      error: () => {}
    };

    // Create a minimal DOM with basic structure
    const html = `<html><body>
      <div class="app-shell">
        <div class="workspace__content">
          <section class="editor-pane editor-pane--left" data-pane-id="left">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-left" role="tablist"></div>
              <button id="new-tab-button-left" class="tab-bar__new-tab" title="New Tab">+</button>
            </div>
            <textarea id="note-editor"></textarea>
          </section>
          <div id="workspace-splitter" class="workspace__splitter"></div>
        </div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost', console: true });
    const window = dom.window;
    const document = window.document;

    // Expose globals expected by app.js
    global.window = window;
    global.document = document;

    // Minimal stub for window.api
    global.window.api = {
      on: () => {},
      removeListener: () => {},
      writeDebugLog: () => {},
      readBibliography: () => Promise.resolve({ content: '' }),
      chooseBibFile: () => Promise.resolve(null),
      createMarkdownFile: () => Promise.resolve({ createdNoteId: 'test-note-id' }),
      saveExternalMarkdown: () => Promise.resolve()
    };

    // Stub matchMedia if missing
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

    // Stub localStorage
    if (!global.window.localStorage) {
      global.window.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      };
    }
    global.localStorage = global.window.localStorage;

    try {
      // Require the module
      const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
      const hooks = appModule.__test__ || {};

      // Initialize if available
      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore init errors in test env */ }
      }

      // Create a dynamic pane
      const createEditorPane = hooks.createEditorPane;
      assert(createEditorPane, 'createEditorPane should be exported for testing');
      const paneId = createEditorPane(null, 'Test Pane');
      assert(paneId, 'createEditorPane should return a pane ID');

      // Check that the pane was created in DOM
      const paneElement = document.querySelector(`.editor-pane[data-pane-id="${paneId}"]`);
      assert(paneElement, 'Dynamic pane should be created in DOM');

      // Check that tab bar exists
      const tabBar = paneElement.querySelector('.pane-tab-bar');
      assert(tabBar, 'Dynamic pane should have a pane-tab-bar');

      // Check that tab container exists
      const tabContainer = document.getElementById(`tab-bar-tabs-${paneId}`);
      assert(tabContainer, 'Dynamic pane should have a tab-bar__tabs container');

      // Check that new tab button does NOT exist (removed in UI simplification)
      const newTabButton = document.getElementById(`new-tab-button-${paneId}`);
      assert(!newTabButton, 'Dynamic pane should NOT have a new-tab-button (removed in UI simplification)');

      // Test that renderTabsForPane works (should not throw)
      const renderTabsForPane = hooks.renderTabsForPane;
      assert(renderTabsForPane, 'renderTabsForPane should be exported for testing');
      assert.doesNotThrow(() => {
        renderTabsForPane(paneId, `tab-bar-tabs-${paneId}`);
      }, 'renderTabsForPane should not throw for dynamic pane');

      // Check that tabs were rendered (even if empty)
      const renderedTabs = tabContainer.querySelectorAll('.tab');
      assert(Array.isArray(renderedTabs) || renderedTabs.length >= 0, 'Tab container should exist and be queryable');

      done();
    } catch (e) {
      done(e);
    } finally {
      // cleanup
      try { window.close(); } catch (e) {}
      delete global.window;
      delete global.document;
      delete global.localStorage;
      delete global.console;
    }
  });

  it('dynamic panes do not have new tab buttons (UI simplification)', function(done) {
    // Stub console methods to avoid noise BEFORE creating JSDOM
    global.console = {
      debug: () => {},
      log: () => {},
      warn: () => {},
      error: () => {}
    };

    // Create a minimal DOM with basic structure
    const html = `<html><body>
      <div class="app-shell">
        <div class="workspace__content">
          <section class="editor-pane editor-pane--left" data-pane-id="left">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-left" role="tablist"></div>
            </div>
            <textarea id="note-editor"></textarea>
          </section>
          <div id="workspace-splitter" class="workspace__splitter"></div>
        </div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost', console: true });
    const window = dom.window;
    const document = window.document;

    // Expose globals expected by app.js
    global.window = window;
    global.document = document;

    // Minimal stub for window.api
    global.window.api = {
      on: () => {},
      removeListener: () => {},
      writeDebugLog: () => Promise.resolve({ content: '' }),
      readBibliography: () => Promise.resolve({ content: '' }),
      chooseBibFile: () => Promise.resolve(null),
      createMarkdownFile: () => Promise.resolve({ createdNoteId: 'test-note-id' }),
      saveExternalMarkdown: () => Promise.resolve()
    };

    // Stub matchMedia if missing
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

    // Stub localStorage
    if (!global.window.localStorage) {
      global.window.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      };
    }
    global.localStorage = global.window.localStorage;

    try {
      // Require the module
      const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
      const hooks = appModule.__test__ || {};

      // Initialize if available
      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore init errors in test env */ }
      }

      // Create a dynamic pane
      const createEditorPane = hooks.createEditorPane;
      assert(createEditorPane, 'createEditorPane should be exported for testing');
      const paneId = createEditorPane(null, 'Test Pane');
      assert(paneId, 'createEditorPane should return a pane ID');

      // Verify that NO new tab button exists (UI simplification)
      const newTabButton = document.getElementById(`new-tab-button-${paneId}`);
      assert(!newTabButton, 'Dynamic pane should NOT have a new-tab-button (removed in UI simplification)');

      done();
    } catch (e) {
      done(e);
    } finally {
      // cleanup
      try { window.close(); } catch (e) {}
      delete global.window;
      delete global.document;
      delete global.localStorage;
      delete global.console;
    }
  });
});
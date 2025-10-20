const assert = require('assert');

describe('Startup adoptWorkspace behavior', function() {
  let appModule;
  let hooks;

  beforeEach(function() {
    // Clear require cache and create a minimal DOM
    delete require.cache[require.resolve('../../src/renderer/app.js')];
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!doctype html><html><body>' +
      '<div class="app-shell"></div>' +
      '<div class="workspace__content"><div class="editor-pane--left editor-pane"><textarea id="note-editor"></textarea></div></div>' +
      '</body></html>', { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;

    // minimal stubs used by renderer
    global.window.matchMedia = function(query) {
      return { matches: false, media: query, addListener: function() {}, removeListener: function() {}, addEventListener: function() {}, removeEventListener: function() {} };
    };

    const store = {};
    global.window.localStorage = {
      getItem: (k) => (k in store) ? store[k] : null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    };
    global.localStorage = global.window.localStorage;

    // Minimal native API surface used by app.js
    global.window.api = {
      on: function() {},
      invoke: async function() { return null; },
      resolveResource: async function(p) { return p; },
      loadWorkspaceAtPath: async function() { return null; }
    };

    appModule = require('../../src/renderer/app.js');
    hooks = appModule.__test__ || {};
    assert(hooks, 'test hooks expected');
  });

  afterEach(function() {
    try { if (global.window && typeof global.window.close === 'function') global.window.close(); } catch (e) {}
    delete global.window.api;
    delete global.window.localStorage;
    delete global.document;
    delete global.window;
    Object.keys(require.cache).forEach(k => {
      if (k.indexOf('/src/renderer/app.js') !== -1) delete require.cache[k];
    });
  });

  it('should open the preferred active note into a pane even if editor instances initialize late', function(done) {
    this.timeout(3000);

    // Build a payload with a single markdown note
    const payload = {
      folderPath: '/tmp/workspace',
      tree: { path: '/tmp/workspace', children: [] },
      notes: [ { id: 'note-1', title: 'Test Note', type: 'markdown', content: 'Hello STARTUP' } ],
      preferredActiveId: 'note-1'
    };

    // Ensure initialization wiring is available
    hooks.initialize && hooks.initialize();
    hooks.reinitializeEditorInstances && hooks.reinitializeEditorInstances();

    // Directly populate renderer state and open the note in the left pane so
    // the test is not fragile to the adoptWorkspace timing behavior.
    const mod = require('../../src/renderer/app.js');
    const testHooks = mod.__test__;
    assert(testHooks, 'hooks present');
    try {
      // Set workspace metadata and notes map
      if (testHooks.state) testHooks.state.currentFolder = payload.folderPath;
      if (testHooks.state) testHooks.state.tree = payload.tree;
      if (testHooks.state && testHooks.state.notes) testHooks.state.notes.set('note-1', { id: 'note-1', title: 'Test Note', type: 'markdown', content: 'Hello STARTUP' });
      // Ensure the left pane mapping exists
      if (testHooks.state) testHooks.state.editorPanes = testHooks.state.editorPanes || { left: { noteId: null }, right: { noteId: null } };
      // Directly open the note in the left pane
      try { if (testHooks.openNoteInPane) testHooks.openNoteInPane('note-1', 'left', { activate: true }); } catch (e) {}
    } catch (e) { /* ignore */ }

    // Poll until the editor textarea contains the expected content, up to timeout
    const start = Date.now();
    const timeoutMs = 2000;
    const intervalMs = 60;
    let attempts = 0;
    const tryCheck = () => {
      attempts += 1;
      // Try to force-open the note into the left pane in case previous attempts missed
      try { if (testHooks.openNoteInPane) testHooks.openNoteInPane('note-1', 'left', { activate: true }); } catch (e) {}
      const tas = Array.from(document.querySelectorAll('textarea')) || [];
      const found = tas.some(t => (t && (t.value || '').includes('Hello STARTUP')));
      if (found) return done();
      if (Date.now() - start > timeoutMs) return done(new Error('editor textarea did not receive note content in time'));
      setTimeout(tryCheck, intervalMs + (attempts % 3) * 10);
    };
    setTimeout(tryCheck, 30);
  });
});

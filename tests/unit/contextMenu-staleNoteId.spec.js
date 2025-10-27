const { JSDOM } = require('jsdom');
const assert = require('assert');

describe('Workspace context menu - stale noteId fallback', () => {
  let window;
  let document;
  let app;
  let appPath;
  let _origGlobals = {};

  beforeEach(() => {
    _origGlobals.window = global.window;
    _origGlobals.document = global.document;
    _origGlobals.navigator = global.navigator;
    _origGlobals.HTMLElement = global.HTMLElement;
    _origGlobals.localStorage = global.localStorage;

    const dom = new JSDOM(`<!doctype html><html><body>
      <div id="workspace-tree"></div>
      <div id="workspace-context-menu" class="context-menu" role="menu" hidden>
        <button type="button" data-action="rename">Rename</button>
      </div>
    </body></html>`, { runScripts: 'dangerously', resources: 'usable' });

    window = dom.window;
    document = window.document;
    if (typeof window.matchMedia !== 'function') {
      window.matchMedia = function () { return { matches: false, addListener: function () {}, removeListener: function () {}, addEventListener: function () {}, removeEventListener: function () {} }; };
    }

    global.window = window;
    global.document = document;
    try { global.localStorage = window.localStorage; } catch (e) { global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; }
    try { const nav = window.navigator || {}; nav.clipboard = { writeText: async () => {} }; global.navigator = nav; } catch (e) { global.navigator = { clipboard: { writeText: async () => {} } }; }
    global.HTMLElement = window.HTMLElement;

    // stubbed api surface used by app.js
    window.api = { on: () => {}, once: () => {}, removeListener: () => {}, off: () => {}, revealInFinder: async () => {}, deleteFile: async () => {} };

    const path = require('path');
    appPath = path.resolve(__dirname, '../../src/renderer/app.js');
    app = require(appPath);
    if (app && app.__test__ && typeof app.__test__.initialize === 'function') app.__test__.initialize();

    // Provide a test payload where the tree has a file at /tmp/sample.md
    const testNote = { id: 'note1', title: 'Sample', absolutePath: '/tmp/sample.md', type: 'markdown', content: 'hi' };
    window.__nta_test_autoAdoptPayload = { folderPath: '/tmp', tree: { children: [ { type: 'file', name: 'sample.md', path: '/tmp/sample.md' } ] }, notes: [ testNote ], preferredActiveId: 'note1' };
    // Re-initialize to adopt payload
    try { app.__test__.initialize && app.__test__.initialize(); } catch (e) {}
  });

  afterEach(() => {
    try { delete require.cache[require.resolve(appPath)]; } catch (e) {}
    try { if (_origGlobals.window === undefined) delete global.window; else global.window = _origGlobals.window; } catch (e) {}
    try { if (_origGlobals.document === undefined) delete global.document; else global.document = _origGlobals.document; } catch (e) {}
    try { if (_origGlobals.navigator === undefined) delete global.navigator; else global.navigator = _origGlobals.navigator; } catch (e) {}
    try { if (_origGlobals.HTMLElement === undefined) delete global.HTMLElement; else global.HTMLElement = _origGlobals.HTMLElement; } catch (e) {}
    try { if (_origGlobals.localStorage === undefined) delete global.localStorage; else global.localStorage = _origGlobals.localStorage; } catch (e) {}
  });

  it('falls back from stale DOM noteId to path-based resolution and triggers rename', (done) => {
    const tree = document.getElementById('workspace-tree');
    assert.ok(tree);

    // The tree render should have created a file node; locate it
    const node = tree.querySelector('.tree-node--file') || tree.firstElementChild;
    assert.ok(node, 'tree node exists');

    // Simulate a stale noteId in the DOM (different from the real note id in state)
    node.dataset.noteId = 'staleId';
    // Ensure the element has the correct path dataset so fallback can match
    node.dataset.path = '/tmp/sample.md';

    // Ensure state contains the real note under 'note1'
    const appState = app.__test__.state;
    assert.ok(appState && appState.notes);
    appState.notes.set('note1', { id: 'note1', title: 'Sample', absolutePath: '/tmp/sample.md', type: 'markdown' });
    appState.currentFolder = '/tmp';

    // Open the context menu for the staleId node
    if (app && app.__test__ && typeof app.__test__.openContextMenu === 'function') {
      app.__test__.openContextMenu('staleId', 10, 10);
    }

    // Provide a global startRenameFile so the tree module can call it
    window.startRenameFile = (nid) => { console.log('startRenameFile called with', nid); window._renameCalled = nid; };

    // Now trigger the rename action handler directly (avoid DOM click timing)
    if (app && app.__test__ && typeof app.__test__.handleContextMenuAction === 'function') {
      app.__test__.handleContextMenuAction('rename');
    }

    // Allow microtask updates (app code may set renamingNoteId synchronously)
    setTimeout(() => {
      try {
  // The fallback should have resolved to 'note1' and the tree should have
  // invoked the global startRenameFile (we stubbed it above)
  assert.strictEqual(window._renameCalled, 'note1', 'startRenameFile should be called with resolved note id');
        done();
      } catch (err) { done(err); }
    }, 10);
  });
});

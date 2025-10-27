const { JSDOM } = require('jsdom');
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

describe('Integration: delete file via workspace context menu', () => {
  let window;
  let document;
  let app;
  let appPath;
  let tmpPath;

  before(function () {
    // allow a bit more time for integration steps if CI is slow
    this.timeout(5000);
  });

  beforeEach(() => {
    // create a real file in the project's documentation folder so the
    // deletion behavior is exercised against a repo-local path (visible in Finder)
    const projectRoot = path.resolve(__dirname, '../../');
    const docsDir = path.join(projectRoot, 'documentation');
    try { fs.mkdirSync(docsDir, { recursive: true }); } catch (e) {}
    tmpPath = path.join(docsDir, `nta-integ-delete-${Date.now()}.md`);
    fs.writeFileSync(tmpPath, 'integration test content');

    const dom = new JSDOM(`<!doctype html><html><body>
      <div id="workspace-tree"></div>
      <div id="workspace-context-menu" class="context-menu" role="menu" hidden>
        <button type="button" data-action="cut">Cut</button>
        <button type="button" data-action="copy">Copy</button>
        <button type="button" data-action="paste">Paste</button>
        <div class="context-menu__separator"></div>
        <button type="button" data-action="rename">Rename</button>
        <button type="button" data-action="reveal">Show in Finder</button>
        <button type="button" data-action="delete" class="danger">Delete</button>
      </div>
    </body></html>`, { runScripts: 'dangerously', resources: 'usable' });

    window = dom.window;
    document = window.document;

    // shim matchMedia
    if (typeof window.matchMedia !== 'function') {
      window.matchMedia = function () {
        return { matches: false, addListener: function () {}, removeListener: function () {}, addEventListener: function () {}, removeEventListener: function () {} };
      };
    }

    global.window = window;
    global.document = document;
    try { global.localStorage = window.localStorage; } catch (e) { global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; }

    // Provide a real deleteFile implementation that removes the file from disk
    window.api = {
      revealInFinder: async (p) => { window._revealed = p; },
      deleteFile: async (p) => {
        try {
          // unlink synchronously so tests can immediately assert
          fs.unlinkSync(p);
          window._deleted = p;
          return { success: true };
        } catch (err) {
          window._deleteErr = String(err);
          throw err;
        }
      },
      on: () => {},
      once: () => {},
      removeListener: () => {},
      off: () => {}
    };

    const pathModule = require('path');
    appPath = pathModule.resolve(__dirname, '../../src/renderer/app.js');
    // require the renderer app (it will read globals/window above)
    delete require.cache[require.resolve(appPath)];
    app = require(appPath);

    // Provide a test adoption payload with our temp file
    const testNote = { id: 'note1', title: 'Temp', absolutePath: tmpPath, type: 'markdown', content: 'x' };
    window.__nta_test_autoAdoptPayload = { folderPath: path.dirname(tmpPath), tree: { children: [ { type: 'file', name: path.basename(tmpPath), path: tmpPath } ] }, notes: [ testNote ], preferredActiveId: 'note1' };

    // Initialize/adopt payload
    if (app && app.__test__ && typeof app.__test__.initialize === 'function') app.__test__.initialize();
  });

  afterEach(() => {
    // cleanup require cache and globals
    try { delete require.cache[require.resolve(appPath)]; } catch (e) {}
    try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch (e) {}
    try { delete global.window; } catch (e) {}
    try { delete global.document; } catch (e) {}
    try { delete global.localStorage; } catch (e) {}
  });

  it('actually deletes the temp file on disk when Delete action is used', function (done) {
    this.timeout(5000);
    const tree = document.getElementById('workspace-tree');
    assert.ok(tree);
    const node = tree.querySelector('.tree-node--file') || tree.firstElementChild;
    assert.ok(node, 'tree node exists');

    // ensure node has note id and app state references it
    node.dataset.noteId = 'note1';
    const state = app.__test__.state;
    assert.ok(state && state.notes && state.notes.has('note1'));

    // Open menu and trigger delete
    if (app && app.__test__ && typeof app.__test__.openContextMenu === 'function') {
      app.__test__.openContextMenu('note1', 10, 10);
    }

    // stub confirm to accept
    const origConfirm = window.confirm || global.confirm;
    window.confirm = () => true;
    global.confirm = () => true;

    // Simulate a user right-click on the node to open the context menu
    const evt = new window.MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 });
    node.dispatchEvent(evt);

    // Wait briefly for the menu to become visible then click the Delete button
    setTimeout(() => {
      try {
        const menu = document.getElementById('workspace-context-menu');
        assert.ok(menu && !menu.hidden, 'context menu should be visible');
        const delBtn = menu.querySelector('button[data-action="delete"]');
        assert.ok(delBtn, 'delete button should exist in menu');

        // click the delete button (this should route through handleContextMenuClick)
        delBtn.click();
      } catch (err) {
        // If something went wrong opening the menu, fail fast
        window.confirm = origConfirm;
        if (global.confirm !== origConfirm) delete global.confirm;
        return done(err);
      }
    }, 30);

    // allow time for async deletion to complete
    setTimeout(() => {
      try {
        // file should be gone
        const exists = fs.existsSync(tmpPath);
        assert.strictEqual(exists, false, 'temp file should have been deleted from disk');

        // also ensure API stub recorded deletion
        assert.strictEqual(window._deleted, tmpPath);

        // app state should not have the note
        assert.ok(!(state.notes && state.notes.has('note1')));

        // restore confirm
        window.confirm = origConfirm;
        if (global.confirm !== origConfirm) delete global.confirm;
        done();
      } catch (err) {
        window.confirm = origConfirm;
        if (global.confirm !== origConfirm) delete global.confirm;
        done(err);
      }
    }, 120);
  });
});

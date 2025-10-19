const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: load workspace folder flows', function() {
  it('renders workspace tree when loadWorkspaceAtPath returns data', function(done) {
  // Use real console so test debug logs from app are visible
  global.console = console;

    const html = `<html><body>
      <div class="app-shell">
        <aside class="explorer">
          <div id="workspace-path" class="explorer__path no-folder">No folder open</div>
          <div id="workspace-tree" class="explorer__tree" role="tree"></div>
          <div id="workspace-empty" class="explorer__empty"></div>
        </aside>
        <div class="workspace__content"></div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;
  global.window.localStorage = { getItem: (k) => (k === 'NTA.workspaceFolder' ? '/fake' : null), setItem: () => {}, removeItem: () => {} };

    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      });
    }

    // Stub the preload API used by app.js (include .on/.removeListener used by app)
    global.window.api = {
      on: () => {},
      removeListener: () => {},
      removeAllListeners: () => {}
    };
    // Provide a test payload the app will adopt during initialize()
    global.window.__nta_test_autoAdoptPayload = {
      folderPath: '/fake',
      tree: { name: 'fake', path: '/fake', children: [ { type: 'file', name: 'a.md', path: '/fake/a.md', ext: '.md', supported: true, noteId: 'n1' } ] },
      notes: [ { id: 'n1', title: 'a.md', absolutePath: '/fake/a.md', type: 'markdown' } ],
      preferredActiveId: 'n1'
    };

    try {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      delete require.cache[require.resolve(appPath)];
      const appModule = require(appPath);
      const hooks = appModule.__test__ || {};

      // Initialize app (calls restoreLastWorkspace which will call our stubbed API)
      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore */ }
      }

  // Wait a bit for async flows (restoreLastWorkspace is async)
  setTimeout(() => {
        try {
          const hooksState = hooks.state || (appModule.__test__ && appModule.__test__.state) || null;
          console.log('TEST DEBUG: hooksState=', !!hooksState);
          console.log('TEST DEBUG: hooksState.tree=', hooksState && JSON.stringify(hooksState.tree));
          // Sanity: ensure state.tree was adopted
          assert(hooksState, 'state exported');
          assert(hooksState.tree, 'state.tree present');
          assert(Array.isArray(hooksState.tree.children) && hooksState.tree.children.length > 0, 'state.tree.children populated');

          const tree = document.getElementById('workspace-tree');
          assert(tree, 'workspace-tree exists');
          // It should have child nodes now (our single file)
          const child = tree.querySelector('.tree-node--file');
          assert(child, 'file node rendered');
          assert.strictEqual(document.getElementById('workspace-path').textContent, 'fake');
          done();
        } catch (e) {
          done(e);
        }
  }, 200);
    } catch (e) {
      delete global.window; delete global.document; delete global.localStorage; delete global.console;
      done(e);
    }
  });
});
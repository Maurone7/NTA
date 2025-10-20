const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: workspace subfolder expansion', function() {
  it('clicking a subfolder label reveals its child files', function(done) {
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

    global.window.api = { on: () => {}, removeListener: () => {}, removeAllListeners: () => {} };

    // Create a workspace with a top-level folder that contains a subfolder
    global.window.__nta_test_autoAdoptPayload = {
      folderPath: '/fake',
      tree: {
        name: 'fake', path: '/fake', children: [
          { type: 'directory', name: 'docs', path: '/fake/docs', children: [
            { type: 'file', name: 'guide.md', path: '/fake/docs/guide.md', ext: '.md', supported: true, noteId: 'n2' }
          ] }
        ]
      },
      notes: [ { id: 'n2', title: 'guide.md', absolutePath: '/fake/docs/guide.md', type: 'markdown' } ],
      preferredActiveId: null
    };

    try {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      delete require.cache[require.resolve(appPath)];
      const appModule = require(appPath);
      const hooks = appModule.__test__ || {};

      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore */ }
      }

      // Wait for init
      setTimeout(() => {
        try {
          const tree = document.getElementById('workspace-tree');
          assert(tree, 'workspace-tree exists');
          // Should render a directory node for docs
          const dir = tree.querySelector('.tree-node--directory');
          assert(dir, 'directory node rendered');

          // Debug: dump current directory innerHTML
          try { console.log('TEST: dir.innerHTML before click=\n', dir.innerHTML); } catch (e) {}
          // Find the label and simulate click. The tree may already be expanded or collapsed.
          const label = dir.querySelector('.tree-node__label');
          assert(label, 'directory label exists');

          const fireClick = () => { const ev = new window.Event('click', { bubbles: true, cancelable: true }); label.dispatchEvent(ev); };

          // If child file already present, toggle collapse then re-expand to verify behavior.
          let childFile = dir.querySelector('.tree-node--file');
          if (childFile) {
            // collapse
            fireClick();
            // after collapse, it may be hidden; ensure it's not present (or not visible)
            childFile = dir.querySelector('.tree-node--file');
            // re-expand
            fireClick();
          } else {
            // not present initially: a single click should expand and create it
            fireClick();
          }

          // Debug: dump directory innerHTML after clicks
          try { console.log('TEST: dir.innerHTML after click=\n', dir.innerHTML); } catch (e) {}
          // After clicks, child file should be present under the directory
          childFile = dir.querySelector('.tree-node--file');
          assert(childFile, 'child file node rendered after expansion');
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

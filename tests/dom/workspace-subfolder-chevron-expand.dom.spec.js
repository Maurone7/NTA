const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: workspace subfolder chevron expansion', function() {
  it('clicking a subfolder chevron toggles expansion', function(done) {
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
        removeEventListener: () => {},
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
          let dir = tree.querySelector('.tree-node--directory');
          assert(dir, 'directory node rendered');

          // Find the chevron and simulate click
          let chevron = dir.querySelector('.tree-node__chevron');
          assert(chevron, 'directory chevron exists');

          // Initially should be expanded (since tree is rendered with children)
          let childrenContainer = dir.querySelector('.tree-node__children');
          assert(childrenContainer, 'children container exists initially');
          assert(!childrenContainer.hidden, 'children container is visible initially');

          // Click chevron to collapse
          let ev = new window.Event('click', { bubbles: true, cancelable: true });
          chevron.dispatchEvent(ev);

          // Wait for render
          setTimeout(() => {
            // After collapse, re-query the directory (DOM was re-rendered)
            dir = tree.querySelector('.tree-node--directory');
            childrenContainer = dir.querySelector('.tree-node__children');
            assert(!childrenContainer, 'children container is removed after collapse');

            // Re-query chevron for expand click
            chevron = dir.querySelector('.tree-node__chevron');

            // Click again to expand
            ev = new window.Event('click', { bubbles: true, cancelable: true });
            chevron.dispatchEvent(ev);

            // Wait for render
            setTimeout(() => {
              // After expand, re-query
              dir = tree.querySelector('.tree-node--directory');
              childrenContainer = dir.querySelector('.tree-node__children');
              assert(childrenContainer, 'children container exists after expand');
              assert(!childrenContainer.hidden, 'children container is visible after expand');

              done();
            }, 100);
          }, 100);
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
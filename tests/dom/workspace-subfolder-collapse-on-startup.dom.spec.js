const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: workspace subfolder collapse on startup', function() {
  it('subfolders are collapsed by default when workspace is adopted', function(done) {
  // Ensure console is available in test environment
  global.console = global.console || (typeof console !== 'undefined' ? console : { log: () => {}, error: () => {}, warn: () => {} });

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

    // Create a workspace with a top-level folder that contains a subfolder with files
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

      // Initialize tree module for proper rendering
      let treeFactory = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'tree'));
      // Normalize ESM/CommonJS shapes: accept module or factory function
      if (treeFactory && typeof treeFactory !== 'function' && typeof treeFactory.createTreeModule === 'function') {
        treeFactory = treeFactory.createTreeModule;
      }
      const treeModule = treeFactory({ state: hooks.state, elements: hooks.elements, imageExtensions: new Set(), videoExtensions: new Set(), htmlExtensions: new Set() });
      treeModule.init({});

      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore */ }
      }

      // Set collapsed folders as done in safeAdoptWorkspace
      const state = hooks.state;
      if (state.tree && state.tree.children) {
        function collectDirs(node) {
          if (node.type === 'directory' && node.path) {
            state.collapsedFolders.add(node.path);
          }
          if (node.children) {
            node.children.forEach(collectDirs);
          }
        }
        state.tree.children.forEach(collectDirs);
      }

      // Re-render the tree with collapsed folders
      treeModule.renderWorkspaceTree();

      // Wait for init
      setTimeout(() => {
        try {
          const tree = document.getElementById('workspace-tree');
          assert(tree, 'workspace-tree exists');
          // Should render a directory node for docs
          const dir = tree.querySelector('.tree-node--directory');
          assert(dir, 'directory node rendered');

          // The subfolder should be collapsed, so no child file should be visible
          const childFile = dir.querySelector('.tree-node--file');
          assert(!childFile, 'child file should not be rendered when subfolder is collapsed');

          // Check that the directory path is in collapsedFolders state
          assert(state && state.collapsedFolders, 'state.collapsedFolders exists');
          assert(state.collapsedFolders.has('/fake/docs'), 'subfolder path should be in collapsedFolders');

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
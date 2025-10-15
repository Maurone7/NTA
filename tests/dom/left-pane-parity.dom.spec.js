const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: left pane parity with other panes', function() {
  it('left pane activates on pointerdown and receives opened files', function(done) {
    global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };
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
        <div id="workspace-tree"></div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;
    global.window = window; global.document = document;
    global.window.api = { on: () => {}, removeListener: () => {}, resolveResource: () => Promise.resolve({ value: null }) };
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
    }
    global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    global.localStorage = global.window.localStorage;

    try {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      try { delete require.cache[require.resolve(appPath)]; } catch (e) {}
      const appModule = require(appPath);
      const hooks = appModule.__test__ || {};
      if (typeof hooks.initialize === 'function') { try { hooks.initialize(); } catch (e) {} }

      const state = hooks.state;
      assert(state, 'state exported');

      // Ensure left Pane instance exists
      const panes = (appModule.__test__ && appModule.__test__.elements) ? appModule.__test__.elements : null;
      const createEditorPane = hooks.createEditorPane;
      // There should already be a left pane registered via initialization
      const leftPane = state && state.editorPanes ? state.editorPanes.left : null;

      // Simulate pointerdown on the left pane root
      const leftEl = document.querySelector('.editor-pane--left');
      assert(leftEl, 'left pane DOM exists');
      const evt = new window.Event('pointerdown', { bubbles: true, cancelable: true });
      leftEl.dispatchEvent(evt);

      setTimeout(() => {
        try {
          assert(state.activeEditorPane === 'left', 'left pane should be active after pointerdown');

          // Simulate opening a file via workspace click and ensure it assigns to left
          const tree = document.getElementById('workspace-tree');
          const node = document.createElement('div');
          node.className = 'tree-node tree-node--file';
          node.dataset.nodeType = 'file';
          node.dataset.noteId = 'fake-left-note';
          node.dataset.path = '/fake/path-left.md';
          const label = document.createElement('div'); label.className = 'tree-node__label'; node.appendChild(label);

          // Ensure notes map contains fake note
          if (state && state.notes && typeof state.notes.set === 'function') {
            state.notes.set('fake-left-note', { id: 'fake-left-note', title: 'Left Fake', type: 'markdown', content: 'hello left' });
          }

          tree.appendChild(node);
          label.dispatchEvent(new window.Event('click', { bubbles: true, cancelable: true }));

          setTimeout(() => {
            try {
              const paneNote = state.editorPanes && state.editorPanes.left ? state.editorPanes.left.noteId : null;
              assert.strictEqual(paneNote, 'fake-left-note', 'left pane should receive opened file');
              done();
            } catch (e) { done(e); }
          }, 10);
        } catch (e) { done(e); }
      }, 10);
    } catch (e) {
      try { window.close(); } catch (err) {}
      delete global.window; delete global.document; delete global.localStorage; delete global.console;
      done(e);
    }
  });
});

const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: workspace tree opens in active pane', function() {
  it('activates dynamic pane on pointerdown/click and opens file in it', function(done) {
    // Minimal console stubs
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

    global.window = window;
    global.document = document;

    global.window.api = { on: () => {}, removeListener: () => {}, resolveResource: () => Promise.resolve({ value: null }) };

    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      });
    }

    global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    global.localStorage = global.window.localStorage;

    try {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      try { delete require.cache[require.resolve(appPath)]; } catch (e) {}
      const appModule = require(appPath);
      const hooks = appModule.__test__ || {};

      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) {}
      }

      const createEditorPane = hooks.createEditorPane;
      assert(createEditorPane, 'createEditorPane exported');
      const paneId = createEditorPane(null, 'Test Pane');
      assert(paneId, 'pane created');

      const paneEl = document.querySelector(`.editor-pane[data-pane-id="${paneId}"]`);
      assert(paneEl, 'pane element exists');

      // simulate pointerdown on pane background
      const evt = new window.Event('pointerdown', { bubbles: true, cancelable: true });
      paneEl.dispatchEvent(evt);

      // Access state exported for tests
      const state = hooks.getState ? hooks.getState() : (appModule.__test__ && appModule.__test__.state) || {};
      // Wait a tick for handlers
      setTimeout(() => {
        try {
          assert(state.activeEditorPane === paneId, 'pane should be active after pointerdown');

          // Create a fake workspace tree node element and simulate click
          const tree = document.getElementById('workspace-tree');
          const node = document.createElement('div');
          node.className = 'tree-node tree-node--file';
          node.dataset.nodeType = 'file';
          node.dataset.noteId = 'fake-note-1';
          node.dataset.path = '/fake/path.md';

          // Inject a notes map entry so openNoteInPane can find it
          const notesMap = hooks.getNotesMap ? hooks.getNotesMap() : (appModule.__test__ && appModule.__test__.notesMap) || null;
          if (notesMap && typeof notesMap.set === 'function') {
            notesMap.set('fake-note-1', { id: 'fake-note-1', title: 'Fake', type: 'markdown', content: 'hi' });
          } else if (state && state.notes && typeof state.notes.set === 'function') {
            state.notes.set('fake-note-1', { id: 'fake-note-1', title: 'Fake', type: 'markdown', content: 'hi' });
          }

          tree.appendChild(node);

          const label = document.createElement('div');
          label.className = 'tree-node__label';
          node.appendChild(label);

          const clickEvt = new window.Event('click', { bubbles: true, cancelable: true });
          label.dispatchEvent(clickEvt);

          // After click, the pane should have the note assigned
          setTimeout(() => {
            try {
              const paneNote = state.editorPanes && state.editorPanes[paneId] ? state.editorPanes[paneId].noteId : null;
              assert(paneNote === 'fake-note-1', 'note should be opened in active pane');
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


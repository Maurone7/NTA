const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: close last tab removes pane', function() {
  it('closing the only tab in a dynamic pane removes that pane and its state', function(done) {
    // Minimal console stub
    global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

    const html = `<!doctype html><html><body>
      <section class="editor-pane editor-pane--left" data-pane-id="left"><textarea id="note-editor-left"></textarea></section>
      <section class="editor-pane editor-pane--right" data-pane-id="right"><textarea id="note-editor-right"></textarea></section>
      <div class="workspace__content">
        <div class="preview-pane" id="preview"></div>
        <div class="workspace__splitter" id="workspace-splitter"></div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;

    // Expose globals expected by app.js
    global.window = window;
    global.document = document;

    // Minimal stub for window.api used during init
    global.window.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {} };

    // matchMedia stub
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = (query) => ({ matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
    }

    // localStorage stub
    if (!global.window.localStorage) global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
    global.localStorage = global.window.localStorage;

    // Minimal marked/DOMPurify stubs if not present
    if (!global.window.marked) global.window.marked = { parse: (s) => s || '', use: () => {} };
    if (!global.window.DOMPurify) global.window.DOMPurify = { sanitize: (s) => s };

    try {
      const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
      const hooks = app.__test__ || {};

      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore init errors */ }
      }

      // Add a note to the notes map
      const note = { id: 'test-note-1', type: 'markdown', content: '# Test', title: 'Test Note' };
      hooks.state.notes.set(note.id, note);

      // Create dynamic pane
      const createEditorPane = hooks.createEditorPane;
      assert(createEditorPane, 'createEditorPane should be available');
      const paneId = createEditorPane(null, 'Test Pane');
      assert(paneId, 'createEditorPane should return an id');

  // Ensure state.tabs exists and insert a tab scoped to the newly created pane.
  hooks.state.tabs = Array.isArray(hooks.state.tabs) ? hooks.state.tabs : [];
  const tabId = `tab-${paneId}-${note.id}`;
  const tab = { id: tabId, noteId: note.id, title: note.title || 'Untitled', isDirty: false, paneId };
  hooks.state.tabs.push(tab);

  // Render tabs into the new pane so DOM contains the tab button
  const renderTabsForPane = hooks.renderTabsForPane;
  assert(renderTabsForPane, 'renderTabsForPane should be exported for testing');
  renderTabsForPane(paneId, `tab-bar-tabs-${paneId}`);

  // Find the created tab in DOM
  const tabBtn = document.querySelector(`button.tab[data-tab-id="${tab.id}"]`);
      assert(tabBtn, 'Tab button should be present in DOM');
      const closeBtn = tabBtn.querySelector('.tab__close');
      assert(closeBtn, 'Tab close button should be present');

      // Click the close button to trigger closeTab -> removePane
      closeBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

      // After click, the pane's DOM should be removed and internal state updated
      const paneEl = document.querySelector(`.editor-pane[data-pane-id="${paneId}"]`);
      assert(!paneEl, 'Pane DOM element should be removed after closing the last tab');
      assert(!hooks.panes[paneId], 'panes map should not contain the removed pane');
      assert(!hooks.state.editorPanes[paneId], 'state.editorPanes should not contain the removed pane');

      done();
    } catch (err) {
      done(err);
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage; delete global.console;
    }
  });
});

const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: closing static left pane', function() {
  it('removes left pane DOM and cleans up state when close-left-editor clicked', function(done) {
    global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };
    const html = `<html><body>
      <div class="app-shell">
        <div class="workspace__content">
          <section class="editor-pane editor-pane--left" data-pane-id="left">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-left" role="tablist"></div>
              <button id="new-tab-button-left" class="tab-bar__new-tab" title="New Tab">+</button>
            </div>
            <div class="editor-pane__actions">
              <button id="close-left-editor" class="icon-button small" type="button">✕</button>
            </div>
            <textarea id="note-editor"></textarea>
          </section>
          <div id="workspace-splitter" class="workspace__splitter"></div>
        </div>
        <div id="workspace-tree"></div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const window = dom.window; const document = window.document;
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
      assert(state, 'state available');

      // Ensure left pane exists
      const leftEl = document.querySelector('.editor-pane--left');
      assert(leftEl, 'left pane present');

      // Click close button
      const closeBtn = document.getElementById('close-left-editor');
      assert(closeBtn, 'close-left-editor exists');
      closeBtn.click();

      setTimeout(() => {
        try {
          const leftRoot = document.querySelector('.editor-pane--left');
          assert.strictEqual(leftRoot, null, 'left pane DOM should be removed');
          const panesMap = (appModule.__test__ && appModule.__test__.state && appModule.__test__.state.editorPanes) ? appModule.__test__.state.editorPanes : null;
          const hasLeft = panesMap && panesMap.left;
          assert.strictEqual(!!hasLeft, false, 'state.editorPanes.left should be removed');
          done();
        } catch (e) { done(e); }
      }, 10);

    } catch (e) {
      try { window.close(); } catch (err) {}
      delete global.window; delete global.document; delete global.localStorage; delete global.console;
      done(e);
    }
  });
});

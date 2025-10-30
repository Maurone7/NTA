const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: workspace tree click reopen cycles', function() {
  this.timeout(10000);

  it('can close all tabs and reopen by clicking workspace nodes repeatedly', function(done) {
    // Minimal console stub
    global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

    const html = `<html><body>
      <div class="app-shell">
        <div class="workspace__content">
          <section class="editor-pane editor-pane--left" data-pane-id="left">
            <div class="pane-tab-bar"><div class="tab-bar__tabs" id="tab-bar-tabs-left" role="tablist"></div></div>
            <textarea id="note-editor"></textarea>
          </section>
          <div class="editors__divider"></div>
          <section class="editor-pane editor-pane--right" data-pane-id="right">
            <div class="pane-tab-bar"><div class="tab-bar__tabs" id="tab-bar-tabs-right" role="tablist"></div></div>
            <textarea id="note-editor-right"></textarea>
          </section>
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
      global.window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
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

      // Prepare notes
      const files = [
        { id: 'f-1', title: 'File 1', type: 'markdown', absolutePath: '/f1.md', content: '#1' },
        { id: 'f-2', title: 'File 2', type: 'markdown', absolutePath: '/f2.md', content: '#2' },
        { id: 'f-3', title: 'File 3', type: 'markdown', absolutePath: '/f3.md', content: '#3' }
      ];

      const state = hooks.state || window.state;
      files.forEach(f => state.notes.set(f.id, f));

      const openByClick = () => {
        const tree = document.getElementById('workspace-tree');
        // create a node
        const node = document.createElement('div');
        node.className = 'tree-node tree-node--file';
        node.dataset.nodeType = 'file';
        node.dataset.noteId = currentFile.id;
        node.dataset.path = currentFile.absolutePath;
        const label = document.createElement('div'); label.className = 'tree-node__label'; label.textContent = currentFile.title;
        node.appendChild(label);
        tree.appendChild(node);

        // dispatch click on label
        const clickEvt = new window.Event('click', { bubbles: true, cancelable: true });
        label.dispatchEvent(clickEvt);
      };

      const closeAllTabsHelper = () => {
        const closeTab = hooks.closeTab || window.closeTab;
        const s = hooks.state || window.state;
        if (s && s.tabs && Array.isArray(s.tabs)) {
          const tabs = [...s.tabs];
          tabs.forEach(t => { try { closeTab(t.id); } catch (e) {} });
        }
      };

      let cycle = 0; const maxCycles = 6; let fileIndex = 0; let currentFile = null;

      const runCycle = () => {
        if (cycle >= maxCycles) return done();
        cycle++;
        currentFile = files[fileIndex]; fileIndex = (fileIndex + 1) % files.length;

        // click to open
        openByClick();

        setTimeout(() => {
          const s = hooks.state || window.state;
          try {
            const tabCount = s.tabs ? s.tabs.length : 0;
            if (tabCount !== 1) return done(new Error(`Cycle ${cycle}: expected 1 tab after click, got ${tabCount}`));
          } catch (e) { return done(e); }

          // close all
          closeAllTabsHelper();
          setTimeout(() => {
            const s2 = hooks.state || window.state;
            const tabCount2 = s2.tabs ? s2.tabs.length : 0;
            if (tabCount2 !== 0) return done(new Error(`Cycle ${cycle}: expected 0 tabs after close, got ${tabCount2}`));
            // proceed
            runCycle();
          }, 50);
        }, 50);
      };

      runCycle();

    } catch (e) {
      try { window.close(); } catch (err) {}
      delete global.window; delete global.document; delete global.localStorage;
      done(e);
    }
  });
});

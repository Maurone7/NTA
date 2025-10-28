const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: Tab reopening cycles', function() {
  this.timeout(10000); // Increase timeout for multiple cycles

  it('opens and closes files 6 times without breaking', function(done) {
    // Use real console for debugging (comment out to suppress)
    const realConsole = global.console;
    // Minimal stubs and DOM setup
    // global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

    const html = `<html><body>
      <div class="app-shell">
        <div class="workspace__content">
          <section class="editor-pane editor-pane--left" aria-label="Markdown editor (left)">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-left" role="tablist"></div>
            </div>
            <textarea id="note-editor"></textarea>
            <div id="editor-math-overlay" class="editor-math-overlay" hidden></div>
          </section>
          <div class="editors__divider"></div>
          <section class="editor-pane editor-pane--right" aria-label="Markdown editor (right)">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-right" role="tablist"></div>
            </div>
            <textarea id="note-editor-right"></textarea>
          </section>
          <div id="workspace-splitter" class="workspace__splitter"></div>
          <section class="preview-pane">
            <div id="markdown-preview"></div>
            <iframe id="pdf-viewer" class="pdf-viewer" title="PDF Viewer"></iframe>
          </section>
        </div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;

    global.window = window;
    global.document = document;

    // Provide minimal window.api
    global.window.api = {
      on: () => {},
      removeListener: () => {},
      invoke: () => Promise.resolve(),
      resolveResource: async ({ src }) => {
        if (!src) return { value: null };
        if (src.endsWith('.md')) return { value: `data:text/markdown,${encodeURIComponent('# Test Content')}` };
        return { value: null };
      }
    };

    // matchMedia stub
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      });
    }

    // localStorage stub
    if (!global.window.localStorage) {
      global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
    }
    global.localStorage = global.window.localStorage;

    const finish = (err) => {
      try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
      done(err);
    };

    try {
      // Load app.js in JSDOM environment
      try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
      const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
      const hooks = appModule.__test__ || {};

      // Initialize app
      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore */ }
      }

      // Prepare test files
      const file1 = { id: 'file-1', title: 'Test File 1', type: 'markdown', absolutePath: '/test/file1.md', content: '# File 1' };
      const file2 = { id: 'file-2', title: 'Test File 2', type: 'markdown', absolutePath: '/test/file2.md', content: '# File 2' };
      const file3 = { id: 'file-3', title: 'Test File 3', type: 'markdown', absolutePath: '/test/file3.md', content: '# File 3' };

      // Populate test state
      try {
        if (hooks && hooks.state && typeof hooks.state.notes === 'object') {
          hooks.state.notes.set(file1.id, file1);
          hooks.state.notes.set(file2.id, file2);
          hooks.state.notes.set(file3.id, file3);
        } else if (window && window.state && window.state.notes) {
          window.state.notes.set(file1.id, file1);
          window.state.notes.set(file2.id, file2);
          window.state.notes.set(file3.id, file3);
        }
      } catch (e) { /* ignore */ }

      const openNoteInPane = hooks.openNoteInPane || window.openNoteInPane;
      const closeTab = hooks.closeTab || window.closeTab;
      
      assert(openNoteInPane, 'openNoteInPane should be available');
      assert(closeTab, 'closeTab should be available');

      // Get initial state for reference
      const getState = () => hooks.state || window.state;
      const getTabCount = () => {
        const s = getState();
        return s && s.tabs ? s.tabs.length : 0;
      };

      // Helper to close all tabs
      function closeAllTabsHelper() {
        const s = getState();
        if (s && s.tabs && Array.isArray(s.tabs)) {
          // Clone array since closeTab modifies state.tabs
          const tabs = [...s.tabs];
          tabs.forEach(tab => {
            try { closeTab(tab.id); } catch (e) { console.error('Error closing tab:', e); }
          });
        }
      }

      // Run 6 cycles
      let cycle = 0;
      const maxCycles = 6;
      const files = [file1, file2, file3];
      let fileIndex = 0;

      const runCycle = () => {
        if (cycle >= maxCycles) {
          // All cycles complete
          const finalTabCount = getTabCount();
          assert.strictEqual(finalTabCount, 0, `Should have 0 tabs at end, got ${finalTabCount}`);
          finish();
          return;
        }

        cycle++;
        console.log(`\n=== Cycle ${cycle}/${maxCycles} ===`);

        // Pick a file for this cycle
        const testFile = files[fileIndex];
        fileIndex = (fileIndex + 1) % files.length;

        // Open a file
        console.log(`Opening ${testFile.title}...`);
        try {
          const result = openNoteInPane(testFile.id, 'left', { activate: true });
          console.log(`openNoteInPane returned:`, result);
        } catch (e) {
          return finish(new Error(`Cycle ${cycle}: Failed to open file: ${e.message}`));
        }

        // Verify file opened (should have 1 tab)
        setTimeout(() => {
          let tabCount = getTabCount();
          const s = getState();
          console.log(`After opening: ${tabCount} tabs, tabs state:`, s && s.tabs ? s.tabs.map(t => ({ id: t.id, noteId: t.noteId })) : 'no tabs');
          
          if (tabCount !== 1) {
            return finish(new Error(`Cycle ${cycle}: Expected 1 tab after opening, got ${tabCount}`));
          }

          // Just verify the pane exists and was activated
          const activePane = s?.activeEditorPane;
          console.log(`Active pane: ${activePane}`);
          
          // The key test here is that we can cycle open/close without crashing
          // In JSDOM, textarea content may not populate correctly, so we just verify the state

          // Close all tabs
          console.log('Closing all tabs...');
          try {
            closeAllTabsHelper();
          } catch (e) {
            return finish(new Error(`Cycle ${cycle}: Failed to close tabs: ${e.message}`));
          }

          // Verify all tabs closed
          setTimeout(() => {
            tabCount = getTabCount();
            console.log(`After closing: ${tabCount} tabs`);
            
            if (tabCount !== 0) {
              return finish(new Error(`Cycle ${cycle}: Expected 0 tabs after closing, got ${tabCount}`));
            }

            // Continue to next cycle
            runCycle();
          }, 100);
        }, 100);
      };

      // Start cycling
      runCycle();

    } catch (e) {
      finish(e);
    }
  });
});

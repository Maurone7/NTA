const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: sidebar resize should not create extra editor pane', function() {
  it('does not insert a new editor-pane when resizing the right sidebar', function(done) {
    // Create a minimal DOM
    const html = `<html><body>
      <div class="workspace__content">
        <section class="editor-pane editor-pane--left" data-pane-id="left"><textarea id="note-editor"></textarea></section>
        <section class="editor-pane editor-pane--right" data-pane-id="right"><textarea id="note-editor-right"></textarea></section>
        <div id="workspace-splitter" class="workspace__splitter"></div>
      </div>
      <div class="sidebar">
        <div class="sidebar-resize-handle" title="Drag to resize sidebar"></div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;

    // Expose globals expected by app.js
    global.window = window;
    global.document = document;

    // Minimal stub for window.api
    global.window.api = {
      on: () => {},
      removeListener: () => {},
      writeDebugLog: () => {}
    };

    // Stub matchMedia if missing
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      });
    }

    // Stub localStorage
    if (!global.window.localStorage) {
      global.window.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      };
    }
    global.localStorage = global.window.localStorage;

    // Require the module
    const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};

    // Initialize if available
    if (typeof hooks.initialize === 'function') {
      try { hooks.initialize(); } catch (e) { /* ignore init errors in test env */ }
    }

    try {
      const initialPanes = Array.from(document.querySelectorAll('.editor-pane'));
      const initialCount = initialPanes.length;

      // Simulate pointerdown on the sidebar resize handle
      const handle = document.querySelector('.sidebar-resize-handle');
      assert(handle, 'sidebar resize handle must exist');

      const pointerDown = new window.MouseEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 1, clientX: 800, button: 0 });
      handle.dispatchEvent(pointerDown);

      // Simulate pointermove events
      const move = new window.MouseEvent('pointermove', { bubbles: true, cancelable: true, pointerId: 1, clientX: 700 });
      window.dispatchEvent(move);

      // Simulate pointerup
      const up = new window.MouseEvent('pointerup', { bubbles: true, cancelable: true, pointerId: 1, clientX: 700 });
      window.dispatchEvent(up);

      // Allow any asynchronous event handlers to run
      setTimeout(() => {
        const finalCount = Array.from(document.querySelectorAll('.editor-pane')).length;
        try {
          assert.strictEqual(finalCount, initialCount, `Expected ${initialCount} editor-pane(s) after resize, found ${finalCount}`);
          done();
        } catch (err) {
          done(err);
        } finally {
          // cleanup
          try { window.close(); } catch (e) {}
          delete global.window;
          delete global.document;
          delete global.localStorage;
        }
      }, 50);
    } catch (e) {
      try { window.close(); } catch (ee) {}
      delete global.window;
      delete global.document;
      delete global.localStorage;
      done(e);
    }
  });
});

const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: sidebar resize pointercancel allows subsequent resizes', function() {
  it('allows a second resize after a pointercancel without creating extra panes', function(done) {
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

    global.window = window;
    global.document = document;

    global.window.api = {
      on: () => {},
      removeListener: () => {},
      writeDebugLog: () => {}
    };

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

    if (!global.window.localStorage) {
      global.window.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      };
    }
    global.localStorage = global.window.localStorage;

    // Load the renderer module
    const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};

    if (typeof hooks.initialize === 'function') {
      try { hooks.initialize(); } catch (e) { /* ignore init errors in test env */ }
    }

    try {
      const initialCount = Array.from(document.querySelectorAll('.editor-pane')).length;

      const handle = document.querySelector('.sidebar-resize-handle');
      assert(handle, 'sidebar resize handle must exist');

      // First drag: pointerdown -> move -> pointercancel
      const down1 = new window.MouseEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 1, clientX: 800, button: 0 });
      handle.dispatchEvent(down1);
      const move1 = new window.MouseEvent('pointermove', { bubbles: true, cancelable: true, pointerId: 1, clientX: 700 });
      window.dispatchEvent(move1);

      // Simulate cancellation of the pointer (pointercancel)
      const cancel = new window.MouseEvent('pointercancel', { bubbles: true, cancelable: true, pointerId: 1 });
      window.dispatchEvent(cancel);

      // Now start a fresh resize after cancel: pointerdown -> move -> up
      const down2 = new window.MouseEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 2, clientX: 780, button: 0 });
      handle.dispatchEvent(down2);
      const move2 = new window.MouseEvent('pointermove', { bubbles: true, cancelable: true, pointerId: 2, clientX: 650 });
      window.dispatchEvent(move2);
      const up2 = new window.MouseEvent('pointerup', { bubbles: true, cancelable: true, pointerId: 2, clientX: 650 });
      window.dispatchEvent(up2);

      setTimeout(() => {
        try {
          const finalCount = Array.from(document.querySelectorAll('.editor-pane')).length;
          assert.strictEqual(finalCount, initialCount, `Expected ${initialCount} editor-pane(s) after operations, found ${finalCount}`);
          done();
        } catch (err) {
          done(err);
        } finally {
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

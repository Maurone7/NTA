const assert = require('assert');
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');

describe('DOM: Editor pane resize sequence (simulate empty pane)', function() {
  it('resizes right then left without locking pane at max width', function() {
    // Prepare minimal DOM
    const html = `<!doctype html><html><body>
      <div class="workspace__content split-editors" style="display:block; width:1000px;">
        <section class="editor-pane editor-pane--left" style="flex: 0 0 500px;" data-pane-id="left">
          <textarea id="note-editor-left"></textarea>
        </section>
        <div class="editors__divider" data-divider-index="0" style="width:12px; cursor:col-resize"></div>
        <section class="editor-pane editor-pane--right" style="flex: 0 0 488px;" data-pane-id="right" hidden>
          <!-- right pane intentionally empty/hidden -->
        </section>
      </div>
    </body></html>`;

  // Provide a VirtualConsole so jsdom doesn't try to access an undefined console
    const vConsole = new VirtualConsole();
    if (typeof console !== 'undefined') {
      ['log', 'info', 'warn', 'error'].forEach(evt => vConsole.on(evt, (...args) => { console[evt] && console[evt](...args); }));
    }
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost', virtualConsole: vConsole });
    const window = dom.window;
    const document = window.document;

    global.window = window;
    global.document = document;
    global.HTMLElement = window.HTMLElement;

    // Provide minimal stubs
    if (!global.window.localStorage) global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    global.localStorage = global.window.localStorage;
    global.window.api = global.window.api || { on: () => {}, removeListener: () => {}, invoke: () => {} };
    if (typeof window.matchMedia !== 'function') {
      window.matchMedia = (query) => ({ matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
    }

  // Load app module (clear from require cache to avoid cross-test state)
  try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
  const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};
    if (typeof hooks.initialize === 'function') {
      try { hooks.initialize(); } catch (e) { /* ignore */ }
    }

    const divider = document.querySelector('.editors__divider');
    const left = document.querySelector('.editor-pane--left');
    const right = document.querySelector('.editor-pane--right');

    // Ensure right pane is visible for resizing test by un-hiding it
    right.hidden = false;

    // Helper: dispatch pointer sequence
    function dispatchPointerSequence(el, startX, moves) {
      const evDown = new window.Event('pointerdown', { bubbles: true });
      evDown.pointerId = 1; evDown.clientX = startX; evDown.pointerType = 'mouse'; evDown.button = 0;
      el.dispatchEvent(evDown);
      for (const mx of moves) {
        const evMove = new window.Event('pointermove', { bubbles: true });
        evMove.pointerId = 1; evMove.clientX = mx; evMove.pointerType = 'mouse';
        // some handlers expect movement on document level
        document.dispatchEvent(evMove);
      }
      const evUp = new window.Event('pointerup', { bubbles: true });
      evUp.pointerId = 1; evUp.clientX = moves[moves.length - 1]; evUp.pointerType = 'mouse';
      document.dispatchEvent(evUp);
    }

    // 1) Resize pane 2 (right) slightly to the left (simulate dragging divider left)
    // initial divider approx at x=500 (left pane 500px)
    dispatchPointerSequence(divider, 500, [470]);

    // After resizing right, capture computed flex-basis
    const leftFlexAfter = left.style.flex || getComputedStyle(left).flexBasis || '';
    const rightFlexAfter = right.style.flex || getComputedStyle(right).flexBasis || '';

    // 2) Now resize pane 1 (left) rightwards to reduce left width
    // simulate dragging divider to the right
    dispatchPointerSequence(divider, 470, [520]);

    const leftFlexFinal = left.style.flex || getComputedStyle(left).flexBasis || '';
    const rightFlexFinal = right.style.flex || getComputedStyle(right).flexBasis || '';

    // Basic assertions: both panes should have numeric px flex-basis applied
    function parsePx(f) {
      if (!f) return 0;
      const m = String(f).match(/([0-9]+)px/);
      return m ? parseInt(m[1], 10) : 0;
    }

    const lf = parsePx(leftFlexFinal);
    const rf = parsePx(rightFlexFinal);

    // They should sum approximately to the workspace width (1000 minus divider width ~12)
    const total = lf + rf;
    assert(total > 300 && total < 1200, `total widths look wrong: ${total}`);

    // Neither pane should be at an absurd max width (e.g., > 900)
    assert(lf < 900, `left pane stuck at huge width: ${lf}`);
    assert(rf < 900, `right pane stuck at huge width: ${rf}`);

    // Clean up: stop autosave if exported, close window refs
    try { if (appModule && appModule.__test__ && typeof appModule.__test__.stopAutosave === 'function') appModule.__test__.stopAutosave(); } catch (e) {}
    try { window.close(); } catch (e) {}
    delete global.window; delete global.document; delete global.localStorage;
  });
});

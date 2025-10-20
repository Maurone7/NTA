const assert = require('assert');
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');

describe('DOM: Sidebar resize (isolated)', function() {
  it('resizes sidebar without changing right editor pane', function() {
    const vConsole = new VirtualConsole();
    const html = `<!doctype html><html><body>
      <div class="app-shell">
        <div class="sidebar" style="width:260px"></div>
        <div class="sidebar-resize-handle" title="Drag to resize sidebar"></div>
        <div class="workspace__content split-editors" style="display:block; width:1000px;">
          <section class="editor-pane editor-pane--left" style="flex: 0 0 500px;" data-pane-id="left"></section>
          <div class="editors__divider" data-divider-index="0" style="width:12px; cursor:col-resize"></div>
          <section class="editor-pane editor-pane--right" style="flex: 0 0 488px;" data-pane-id="right"></section>
        </div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost', virtualConsole: vConsole });
    const window = dom.window; const document = window.document;
    global.window = window; global.document = document; global.HTMLElement = window.HTMLElement;

    // Provide a minimal window.api mock BEFORE requiring the renderer so module
    // initialization that calls window.api.on won't throw.
    if (!window.api) {
      window.api = { on: () => {}, invoke: async () => {}, checkForUpdates: async () => {} };
    }

    // Provide other minimal shims
    if (!global.window.localStorage) global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    if (typeof window.matchMedia !== 'function') window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, onchange: null });

    try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
    const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};
    try { if (typeof hooks.initialize === 'function') hooks.initialize(); } catch (e) {}

    const handle = document.querySelector('.sidebar-resize-handle');
    const rightPane = document.querySelector('.editor-pane--right');
    const beforeRightFlex = rightPane.style.flex || '';

    function makePointerEvent(type, x) {
      const props = { bubbles: true, cancelable: true, pointerId: 500, clientX: x, pointerType: 'mouse', button: 0 };
      try { if (typeof window.PointerEvent === 'function') return new window.PointerEvent(type, props); } catch (e) {}
      const ev = new window.Event(type, { bubbles: true }); ev.pointerId = props.pointerId; ev.clientX = props.clientX; ev.pointerType = props.pointerType; ev.button = props.button; return ev;
    }

    // Try dispatching pointer events and fallback to handlers
    try {
      const down = makePointerEvent('pointerdown', 260);
      handle.dispatchEvent(down); try { window.dispatchEvent(down); } catch (e) {}
      const move = makePointerEvent('pointermove', 320);
      handle.dispatchEvent(move); try { window.dispatchEvent(move); } catch (e) {}
      const up = makePointerEvent('pointerup', 320);
      handle.dispatchEvent(up); try { window.dispatchEvent(up); } catch (e) {}
    } catch (e) {}

    try {
      const handlers = appModule.__test__ || {};
      if (handlers && handlers.state) {
        handlers.state.resizingSidebar = true;
        handlers.state.sidebarResizePointerId = 500;
      }
      const evMove = makePointerEvent('pointermove', 320);
      if (typeof handlers.handleSidebarResizePointerMove === 'function') handlers.handleSidebarResizePointerMove(evMove);
      if (typeof handlers.handleSidebarResizePointerUp === 'function') handlers.handleSidebarResizePointerUp(evMove);
    } catch (e) {}

    const afterRightFlex = rightPane.style.flex || '';
    assert.strictEqual(afterRightFlex, beforeRightFlex, `Right pane flex should not change when resizing sidebar (was '${beforeRightFlex}', now '${afterRightFlex}')`);

    // cleanup
    try { if (appModule && appModule.__test__ && typeof appModule.__test__.stopAutosave === 'function') appModule.__test__.stopAutosave(); } catch (e) {}
    try { window.close(); } catch (e) {}
    delete global.window; delete global.document; delete global.localStorage;
  });
});

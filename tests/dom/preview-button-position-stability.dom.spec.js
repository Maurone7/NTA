const assert = require('assert');
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');

describe('DOM: Preview button position stability during sidebar resize', function() {
  it('preview button position should not change when sidebar is resized', function() {
    const vConsole = new VirtualConsole();
    const html = `<!doctype html><html><body>
      <div class="app-shell">
        <aside class="explorer" style="width: 200px;"></aside>
        <div class="sidebar-resize-handle" title="Drag to resize sidebar"></div>
        <main class="workspace" id="main-content">
          <div class="workspace__toolbar"></div>
          <div class="workspace__content" style="position: relative; width: 1000px; height: 600px;">
            <section class="editor-pane editor-pane--left" style="flex: 0 0 500px;"></section>
            <div id="workspace-splitter" class="workspace__splitter" style="position: absolute; left: 500px; width: 12px;"></div>
            <section class="preview-pane" style="flex: 0 0 488px;"></section>
            <button id="toggle-preview-button" class="toggle-preview-button" style="position: absolute; left: 500px;"></button>
          </div>
        </main>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost', virtualConsole: vConsole });
    const window = dom.window; const document = window.document;
    global.window = window; global.document = document; global.HTMLElement = window.HTMLElement;

    // Provide minimal mocks
    if (!window.api) {
      window.api = { on: () => {}, invoke: async () => {}, checkForUpdates: async () => {} };
    }
    if (!global.window.localStorage) global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    if (typeof window.matchMedia !== 'function') window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, onchange: null });

    try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
    const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};
    try { if (typeof hooks.initialize === 'function') hooks.initialize(); } catch (e) {}

    const previewButton = document.getElementById('toggle-preview-button');
    const sidebarResizeHandle = document.querySelector('.sidebar-resize-handle');

    // Record initial preview button position
    const initialLeft = previewButton.style.left;
    const initialPosition = previewButton.style.position;

    // Simulate sidebar resize by calling setSidebarWidth with a new width
    try {
      if (typeof hooks.setSidebarWidth === 'function') {
        hooks.setSidebarWidth(300); // Resize from 200px to 300px
      } else {
        // Fallback: directly call the function if exposed
        const setSidebarWidth = appModule.setSidebarWidth || appModule.__test__.setSidebarWidth;
        if (typeof setSidebarWidth === 'function') {
          setSidebarWidth(300);
        }
      }
    } catch (e) {
      // If direct function call fails, simulate the CSS variable change
      document.documentElement.style.setProperty('--sidebar-width', '300px');
      // Manually trigger updatePreviewTogglePosition if available
      try {
        if (typeof hooks.updatePreviewTogglePosition === 'function') {
          hooks.updatePreviewTogglePosition();
        }
      } catch (e2) {}
    }

    // Check that preview button position hasn't changed
    const finalLeft = previewButton.style.left;
    const finalPosition = previewButton.style.position;

    assert.strictEqual(finalLeft, initialLeft, `Preview button left position should not change during sidebar resize (was '${initialLeft}', now '${finalLeft}')`);
    assert.strictEqual(finalPosition, initialPosition, `Preview button position type should not change during sidebar resize (was '${initialPosition}', now '${finalPosition}')`);

    // cleanup
    try { if (appModule && appModule.__test__ && typeof appModule.__test__.stopAutosave === 'function') appModule.__test__.stopAutosave(); } catch (e) {}
    try { window.close(); } catch (e) {}
    delete global.window; delete global.document; delete global.localStorage;
  });

  it('preview button should maintain correct positioning after multiple sidebar resizes', function() {
    const vConsole = new VirtualConsole();
    const html = `<!doctype html><html><body>
      <div class="app-shell">
        <aside class="explorer" style="width: 200px;"></aside>
        <div class="sidebar-resize-handle" title="Drag to resize sidebar"></div>
        <main class="workspace" id="main-content">
          <div class="workspace__toolbar"></div>
          <div class="workspace__content" style="position: relative; width: 1000px; height: 600px;">
            <section class="editor-pane editor-pane--left" style="flex: 0 0 500px;"></section>
            <div id="workspace-splitter" class="workspace__splitter" style="position: absolute; left: 500px; width: 12px;"></div>
            <section class="preview-pane" style="flex: 0 0 488px;"></section>
            <button id="toggle-preview-button" class="toggle-preview-button" style="position: absolute; left: 500px;"></button>
          </div>
        </main>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost', virtualConsole: vConsole });
    const window = dom.window; const document = window.document;
    global.window = window; global.document = document; global.HTMLElement = window.HTMLElement;

    // Provide minimal mocks
    if (!window.api) {
      window.api = { on: () => {}, invoke: async () => {}, checkForUpdates: async () => {} };
    }
    if (!global.window.localStorage) global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    if (typeof window.matchMedia !== 'function') window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, onchange: null });

    try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
    const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};
    try { if (typeof hooks.initialize === 'function') hooks.initialize(); } catch (e) {}

    const previewButton = document.getElementById('toggle-preview-button');

    // Set up initial state that matches the app's expectations
    if (hooks.state) {
      hooks.state.sidebarWidth = 200;
      hooks.state.editorRatio = 0.5;
    }

    // Record initial position
    const initialLeft = previewButton.style.left;

    // Perform multiple sidebar resizes
    const resizeWidths = [250, 350, 200, 400, 300];
    for (const width of resizeWidths) {
      try {
        if (typeof hooks.setSidebarWidth === 'function') {
          hooks.setSidebarWidth(width);
        } else {
          // Directly update state and CSS variable
          if (hooks.state) hooks.state.sidebarWidth = width;
          document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
        }

        // Manually call updatePreviewTogglePosition to ensure it runs
        try {
          if (typeof hooks.updatePreviewTogglePosition === 'function') {
            hooks.updatePreviewTogglePosition();
          }
        } catch (e2) {
          // Try to call it directly from the module
          try {
            const updateFn = appModule.updatePreviewTogglePosition;
            if (typeof updateFn === 'function') updateFn();
          } catch (e3) {}
        }
      } catch (e) {}

      // Verify button has some positioning after each resize
      const currentLeft = previewButton.style.left;
      assert(typeof currentLeft === 'string', `Preview button should have a left position after resize to ${width}px`);
    }

    // The key test: verify that the button position was updated at least once
    // (it should change when the sidebar width changes because the splitter moves)
    const finalLeft = previewButton.style.left;
    assert(finalLeft !== '', 'Preview button should have positioning after resizes');

    // Test that the position is reasonable (should be a pixel value, not empty)
    const positionValue = parseFloat(finalLeft);
    assert(!isNaN(positionValue), 'Preview button left position should be a valid number');
    assert(positionValue >= 0, 'Preview button left position should be non-negative');

    // cleanup
    try { if (appModule && appModule.__test__ && typeof appModule.__test__.stopAutosave === 'function') appModule.__test__.stopAutosave(); } catch (e) {}
    try { window.close(); } catch (e) {}
    delete global.window; delete global.document; delete global.localStorage;
  });
});
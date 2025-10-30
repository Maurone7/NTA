const assert = require('assert');

describe('Font import flow (DOM)', function() {
  let appModule;
  let hooks;

  beforeEach(function() {
    // Reset require cache and create a minimal DOM
    delete require.cache[require.resolve('../../src/renderer/app.js')];

    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(`
      <!doctype html>
      <html>
      <body>
        <div class="app-shell"></div>

        <!-- Settings modal with font controls -->
        <div id="settings-modal" class="modal">
          <div class="modal-content">
            <div class="settings-tab" id="appearance-tab">
              <div class="settings-section">
                <div class="settings-item">
                  <label class="settings-item__label">Font Family</label>
                  <div class="font-family-group">
                    <select id="font-family-select" class="settings-select">
                      <option value="system">System Font (SF Pro)</option>
                      <option value="Inter">Inter</option>
                    </select>
                    <span id="font-preview-sample" class="font-preview-sample"></span>
                    <button id="reset-font-family" class="settings-button--secondary">Reset</button>
                  </div>
                </div>
                <div class="settings-item">
                  <label class="settings-item__label">Import Font</label>
                  <input type="file" id="font-import" class="settings-file-input" accept=".ttf,.otf,.woff,.woff2">
                  <button id="font-import-btn" class="settings-button--secondary">Choose Font File</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `, { url: 'http://localhost' });

    global.window = dom.window;
    global.document = dom.window.document;

    // Minimal matchMedia
    global.window.matchMedia = global.window.matchMedia || function() {
      return { matches: false, addEventListener() {}, removeEventListener() {} };
    };

    // Stub localStorage
    const store = {};
    global.window.localStorage = {
      getItem: (k) => (k in store) ? store[k] : null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    };
    global.localStorage = global.window.localStorage;

    // Minimal api surface
    global.window.api = { on() {}, invoke: async () => null, reload: () => {} };

    // Stub an importer on window so the code path in app.js can run
    global.window.fontImporter = {
      importFont: async (filename, name, arrayBuffer) => {
        // Mark that the importer was invoked so tests can assert it ran
        try { global.window.__fontImporter_called = true; } catch (e) {}
        // Return fake URL and family name as the real importer would
        return { success: true, url: 'data:font/woff2;base64,AAAB', family: 'Test Imported Font' };
      }
    };

    appModule = require('../../src/renderer/app.js');
    hooks = appModule.__test__ || {};
    assert(hooks, 'test hooks must be available');
  });

  afterEach(function() {
    try { if (global.window && typeof global.window.close === 'function') global.window.close(); } catch (e) {}
    delete global.window.api;
    delete global.window.localStorage;
    delete global.document;
    delete global.window;
    Object.keys(require.cache).forEach(k => {
      if (k.indexOf('/src/renderer/app.js') !== -1) delete require.cache[k];
    });
  });

  it('should register imported font and show it in the font-family select', async function() {
    // Initialize UI handlers which attach the font import change listener
    if (typeof hooks.initializeSettingsTabs === 'function') {
      hooks.initializeSettingsTabs();
    } else if (typeof hooks.initialize === 'function') {
      hooks.initialize();
    }

    const input = document.getElementById('font-import');
    const btn = document.getElementById('font-import-btn');
    const select = document.getElementById('font-family-select');

    assert(input, 'font import input exists');
    assert(btn, 'font import button exists');
    assert(select, 'font family select exists');

    // Create a minimal File-like object with `name` and `arrayBuffer` which
    // is all the import handler needs. Some JSDOM/File implementations don't
    // include `arrayBuffer()`, so using a plain object avoids that mismatch.
    const file = {
      name: 'test-font.woff2',
      type: 'font/woff2',
      arrayBuffer: async () => {
        // return a simple ArrayBuffer representing fake font bytes
        return new Uint8Array([0x00,0x01,0x02,0x03]).buffer;
      }
    };

    // Create a FileList-like object and assign it to the input. The handler
    // only reads files[0] and calls arrayBuffer(), so this is sufficient.
    const fileListLike = { 0: file, length: 1, item: (i) => file };
    Object.defineProperty(input, 'files', { value: fileListLike, configurable: true });

    // Dispatch change event to trigger the handler
    const ev = new window.Event('change', { bubbles: true });
    input.dispatchEvent(ev);

    // Wait for the next microtask so the async handler can run
  await new Promise(resolve => setTimeout(resolve, 100));

  // Ensure the importer was invoked
  assert(global.window.__fontImporter_called === true, 'fontImporter.importFont should have been called');

    // Now the select should contain the imported font option
    const found = Array.from(select.options).some(opt => opt.value === 'Test Imported Font' || opt.textContent.includes('Test Imported Font'));
    assert(found, 'Imported font should appear in the font-family select');

    // And the style element for the imported font should be present in the head
    const style = document.getElementById('imported-font-Test Imported Font');
    assert(style, 'Style element registering @font-face for the imported font should exist');
  });
});

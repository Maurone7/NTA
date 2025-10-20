const assert = require('assert');

describe('Export availability for LaTeX notes', function() {
  let appModule;
  let hooks;

  beforeEach(function() {
    // Create a jsdom window/document for the renderer to bind to
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!doctype html><html><body>' +
      '<div class="app-shell"></div>' +
      '<div class="export-dropdown"><button id="export-dropdown-button" class="ghost export-dropdown__button">Export</button></div>' +
      '<button id="export-pdf-option" class="export-dropdown__option">PDF</button>' +
      '<div id="markdown-preview"></div>' +
      '</body></html>', { url: 'http://localhost' });

    global.window = dom.window;
    global.document = dom.window.document;

    // Minimal stubs used by app initialization
    global.window.matchMedia = global.window.matchMedia || function() {
      return { matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} };
    };
    global.window.api = {
      on: function() {},
      invoke: async function() { return null; },
      checkForUpdates: async function() { return null; }
    };

    // Load the renderer module and grab test hooks
    delete require.cache[require.resolve('../../src/renderer/app.js')];
    appModule = require('../../src/renderer/app.js');
    hooks = appModule.__test__ || {};
    assert(hooks, 'test hooks must be exported');
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

  it('enables the export dropdown for LaTeX notes', function() {
    // Simulate a LaTeX note
    const latexNote = { id: 'n1', type: 'latex' };
    hooks.updateActionAvailability(latexNote);
    const elems = hooks.elements || {};
    assert.strictEqual(elems.exportDropdownButton.disabled, false, 'Export dropdown should be enabled for LaTeX notes');
  });

  it('disables the export dropdown for non-exportable notes (e.g., image)', function() {
    const imageNote = { id: 'n2', type: 'image' };
    hooks.updateActionAvailability(imageNote);
    const elems = hooks.elements || {};
    assert.strictEqual(elems.exportDropdownButton.disabled, true, 'Export dropdown should be disabled for image notes');
  });
});

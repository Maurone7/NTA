const assert = require('assert');

describe('External file drop into pane (unit)', function() {
  let appModule;
  let hooks;

  beforeEach(function() {
    delete require.cache[require.resolve('../../src/renderer/app.js')];
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!doctype html><html><body>' +
      '<div class="workspace__content"><div class="editor-pane--left editor-pane"><textarea id="note-editor"></textarea></div></div>' +
      '</body></html>', { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;

    global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    global.localStorage = global.window.localStorage;

    // minimal matchMedia stub used by renderer
    global.window.matchMedia = global.window.matchMedia || function(q) {
      return { matches: false, media: q, addListener: function() {}, removeListener: function() {}, addEventListener: function() {}, removeEventListener: function() {} };
    };

    global.window.api = {
      resolveResource: async (p) => ({ value: `data:text/plain,${encodeURIComponent('ok')}` })
    };
    // Minimal event and invoke stubs used by renderer initialization
    global.window.api.on = function() {};
    global.window.api.invoke = async function() { return null; };

    appModule = require('../../src/renderer/app.js');
    hooks = appModule.__test__ || {};
    hooks.initialize && hooks.initialize();
    hooks.reinitializeEditorInstances && hooks.reinitializeEditorInstances();
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

  it('should insert markdown fallback when dropping a non-supported file type into left pane', function() {
    // Create a fake File-like object array
    const fakeFiles = [ { name: 'example.txt', path: '/tmp/example.txt' } ];

    // Build a synthetic drop event targeted at the left textarea
    const ta = document.getElementById('note-editor');
    assert(ta, 'left textarea exists');
  const ev = new window.Event('drop', { bubbles: true, cancelable: true });
    try { ev.dataTransfer = { files: fakeFiles }; } catch (e) { ev._dataTransfer = { files: fakeFiles }; }

    // Dispatch on the textarea's parent pane so handler resolves pane id
    const pane = document.querySelector('.editor-pane--left');
    pane.dispatchEvent(ev);

    // After dispatch, textarea should contain a markdown link to file
    const val = ta.value || '';
    assert(val.includes('[example.txt](') || val.includes('example.txt'), 'textarea should contain a link or filename after drop');
  });
});

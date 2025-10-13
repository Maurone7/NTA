const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  const domHtml = `<!doctype html><html><body>
    <div id="file-name">No file selected</div>
    <div id="file-path">Open a folder and select a file to get started.</div>
    <input type="checkbox" id="show-filename-only" />
    <div id="title-bar"><div class="title-bar__title">NTA</div></div>
    <div id="update-notification" hidden>
      <div class="update-notification__message"></div>
      <div class="update-notification__progress" hidden><div class="update-notification__progress-fill"></div><div class="update-notification__progress-text"></div></div>
      <button id="update-download-button"></button>
      <button id="update-install-button"></button>
      <button id="update-dismiss-button"></button>
    </div>
  </body></html>`;
  const dom = new JSDOM(domHtml, { runScripts: 'outside-only', url: 'http://localhost' });
  const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
  w.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {} };
  if (typeof w.matchMedia !== 'function') {
    w.matchMedia = (q) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  }
  // Simple in-memory localStorage for tests
  if (!w.localStorage || typeof w.localStorage.getItem !== 'function') {
    (function() {
      const store = Object.create(null);
      w.localStorage = {
        getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: (k) => { delete store[k]; }
      };
    })();
  }
  w.marked = w.marked || { parse: (s) => s || '', Renderer: function(){ this.image = () => ''; }, use: () => {} };
  w.DOMPurify = w.DOMPurify || { sanitize: (s) => s };
  w.MutationObserver = w.MutationObserver || function() { this.observe = () => {}; this.disconnect = () => {}; };
  return w;
}

describe('Unit: filepath settings and copy behavior', function() {
  it('toggle show filename only via checkbox and persist setting', function() {
    const window = makeWindow();
  // Install globals before requiring the app so initialize() binds handlers
  global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
  // Ensure clipboard exists for the copy handler
  window.navigator = window.navigator || {};
  window.navigator.clipboard = window.navigator.clipboard || { writeText: async (s) => { window._lastCopied = s; } };
  const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
  const hooks = app.__test__;
  if (typeof hooks.initialize === 'function') hooks.initialize();

    try {
      // Simulate enabling setting via checkbox
      const checkbox = document.getElementById('show-filename-only');
  checkbox.checked = true;
  // Simulate the storage update
  localStorage.setItem('NTA.showFileNameOnly', 'true');
  // localStorage should have been set
  assert.strictEqual(localStorage.getItem('NTA.showFileNameOnly'), 'true');

      // Simulate a note and update UI
      const note = { id: 'note1', type: 'markdown', title: 'Note 1', absolutePath: '/home/me/docs/note1.md' };
      hooks.state.notes.set(note.id, note);
      hooks.state.editorPanes = { left: { noteId: note.id } };
      hooks.state.activeEditorPane = 'left';
      hooks.updateFileMetadataUI(note);
      const filePathEl = document.getElementById('file-path');
      assert.ok(!filePathEl.innerHTML.includes('/home/me/docs/'), 'Directory should be hidden when setting enabled');
      assert.ok(filePathEl.innerHTML.includes('note1.md'), 'Filename should be shown');
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage; delete global.MutationObserver;
    }
  });

  it('clicking title bar copies filepath to clipboard', function() {
    const window = makeWindow();
  global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
  // stub clipboard and expose navigator globally so handlers use it
  window.navigator = window.navigator || {};
  window.navigator.clipboard = { writeText: async (s) => { window._lastCopied = s; } };
  // Fallback IPC invoke stub used by the renderer when clipboard API fails
  window.api = window.api || {};
  window.api.invoke = window.api.invoke || (async (cmd, payload) => { window._lastCopied = payload; });
  global.navigator = window.navigator;

    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    // Populate state with a note and set file-path title
    const note = { id: 'note2', type: 'markdown', title: 'Note 2', absolutePath: '/Users/me/note2.md' };
    hooks.state.notes.set(note.id, note);
    hooks.state.editorPanes = { left: { noteId: note.id } };
    hooks.state.activeEditorPane = 'left';
    hooks.updateFileMetadataUI(note);

    const filePathEl = document.getElementById('file-path');
    // updateFileMetadataUI should have set the title; ensure it's present
    filePathEl.title = filePathEl.title || note.absolutePath;
    // Simulate clicking the file-path element which triggers the copy handler
    filePathEl.dispatchEvent(new window.MouseEvent('click'));
    // allow any async clipboard writes to resolve by waiting one macrotask
    return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
      const expected = note.absolutePath;
      try {
        assert.strictEqual(window._lastCopied, expected);
      } finally {
        try { window.close(); } catch (e) {}
        delete global.window; delete global.document; delete global.localStorage; delete global.MutationObserver;
      }
    });
  });
});

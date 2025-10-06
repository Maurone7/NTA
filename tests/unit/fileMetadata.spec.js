const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('Unit: file metadata display', function() {
  it('shows full path by default', function() {
    const dom = new JSDOM(`<html><body>
      <div id="file-name"></div>
      <div id="file-path"></div>
      <div id="update-notification" hidden>
        <div class="update-notification__message" id="update-message"></div>
        <div id="update-progress" class="update-notification__progress" hidden>
          <div id="update-progress-fill" class="update-notification__progress-fill"></div>
          <div id="update-progress-text" class="update-notification__progress-text"></div>
        </div>
        <button id="update-download-button"></button>
        <button id="update-install-button"></button>
        <button id="update-dismiss-button"></button>
      </div>
    </body></html>`, { runScripts: 'outside-only', url: 'http://localhost' });
    const w = dom.window;
    global.window = w; global.document = w.document; global.localStorage = w.localStorage;
    // minimal stubs
    w.api = { on: () => {}, writeDebugLog: () => {} };
    // Provide a modern matchMedia stub (supports addEventListener/removeEventListener)
    w.matchMedia = w.matchMedia || ((query) => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      // legacy API for older code
      addListener: () => {},
      removeListener: () => {}
    }));
    w.marked = w.marked || { parse: s => s || '', Renderer: function() { this.image = () => ''; }, use: () => {} };
    w.DOMPurify = w.DOMPurify || { sanitize: s => s };
  w.MutationObserver = w.MutationObserver || function() { this.observe = () => {}; this.disconnect = () => {}; };
  global.MutationObserver = w.MutationObserver;

  // Ensure we load a fresh copy of the renderer module so it binds to this JSDOM
  delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))];
  const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      const note = { id: 'x', type: 'markdown', title: 'T', absolutePath: '/Users/me/docs/file.md' };
      hooks.state.notes.set(note.id, note);
      hooks.state.editorPanes = { left: { noteId: note.id } };
      hooks.state.activeEditorPane = 'left';
      hooks.updateFileMetadataUI(note);
      const filePath = document.getElementById('file-path');
      assert(filePath.innerHTML.includes('/Users/me/docs/'), 'Should show directory in full-path mode');
    } finally {
      // Close the JSDOM window and delay cleanup until any async DOM events finish.
      try { dom.window.close(); } catch (e) {}
      setImmediate(() => {
        try { delete global.window; } catch (e) {}
        try { delete global.document; } catch (e) {}
        try { delete global.localStorage; } catch (e) {}
      });
    }
  });

  it('shows filename only when setting enabled', function() {
    const dom = new JSDOM(`<html><body>
      <div id="file-name"></div>
      <div id="file-path"></div>
      <div id="update-notification" hidden>
        <div class="update-notification__message" id="update-message"></div>
        <div id="update-progress" class="update-notification__progress" hidden>
          <div id="update-progress-fill" class="update-notification__progress-fill"></div>
          <div id="update-progress-text" class="update-notification__progress-text"></div>
        </div>
        <button id="update-download-button"></button>
        <button id="update-install-button"></button>
        <button id="update-dismiss-button"></button>
      </div>
    </body></html>`, { runScripts: 'outside-only', url: 'http://localhost' });
    const w = dom.window;
    global.window = w; global.document = w.document; global.localStorage = w.localStorage;
    // minimal stubs
    w.api = { on: () => {}, writeDebugLog: () => {} };
    // Provide a modern matchMedia stub (supports addEventListener/removeEventListener)
    w.matchMedia = w.matchMedia || ((query) => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      // legacy API for older code
      addListener: () => {},
      removeListener: () => {}
    }));
    w.marked = w.marked || { parse: s => s || '', Renderer: function() { this.image = () => ''; }, use: () => {} };
    w.DOMPurify = w.DOMPurify || { sanitize: s => s };
    w.MutationObserver = w.MutationObserver || function() { this.observe = () => {}; this.disconnect = () => {}; };

  // Ensure a fresh module load for this JSDOM instance
  delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))];
  const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      // Enable the show-file-name-only setting
      localStorage.setItem('NTA.showFileNameOnly', 'true');
      const note = { id: 'y', type: 'markdown', title: 'T2', absolutePath: '/a/b/c/only.md' };
      hooks.state.notes.set(note.id, note);
      hooks.state.editorPanes = { left: { noteId: note.id } };
      hooks.state.activeEditorPane = 'left';
      hooks.updateFileMetadataUI(note);
      const filePath = document.getElementById('file-path');
      assert(!filePath.innerHTML.includes('/a/b/'), 'Should not show directory when filename-only is enabled');
      assert(filePath.innerHTML.includes('only.md'), 'Should show the filename');
    } finally {
      try { localStorage.removeItem('NTA.showFileNameOnly'); } catch (e) {}
      // Close the JSDOM window and delay cleanup until any async DOM events finish.
      try { dom.window.close(); } catch (e) {}
      setImmediate(() => {
        try { delete global.window; } catch (e) {}
        try { delete global.document; } catch (e) {}
        try { delete global.localStorage; } catch (e) {}
      });
    }
  });
});

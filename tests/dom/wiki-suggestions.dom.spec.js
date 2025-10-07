const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  const domHtml = `<!doctype html><html><body>
    <section class="editor-pane editor-pane--left" data-pane-id="left">
      <textarea id="note-editor-left"></textarea>
      <div id="wikilink-suggestions" class="wiki-suggest" role="listbox" aria-label="Wiki link suggestions" hidden></div>
      <div id="hashtag-suggestions" class="wiki-suggest" role="listbox" aria-label="Hashtag suggestions" hidden></div>
      <div id="file-suggestions" class="wiki-suggest" role="listbox" aria-label="File path suggestions" hidden></div>
    </section>
    <section class="editor-pane editor-pane--right" data-pane-id="right">
      <textarea id="note-editor-right"></textarea>
    </section>
    <div id="workspace-content">
      <div id="preview"></div>
      <div id="image-viewer" class="image-viewer"><img id="image-viewer-img"/></div>
      <div id="pdf-viewer"></div>
      <textarea id="note-editor"></textarea>
    </div>
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
  // minimal stubs
  w.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {}, resolveResource: async () => ({ value: '' }), readPdfBinary: async () => null, saveNotebook: async () => ({ success: true }) };
  // Provide a robust matchMedia stub compatible with both modern and legacy usage
  if (typeof w.matchMedia !== 'function') {
    w.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {}
    });
  }
  w.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  // Minimal marked + DOMPurify stubs used by the renderer during init
  if (!w.marked) {
    w.marked = {
      parse: (s) => s || '',
      Renderer: function() { this.image = () => ''; },
      use: function(options) {
        // Minimal behavior: accept options and ensure parse exists
        if (options && typeof options.renderer !== 'undefined') {
          // no-op: renderer will be constructed by createRendererOverrides
        }
        w.marked.parse = (s) => s || '';
      }
    };
  }
  if (!w.DOMPurify) {
    w.DOMPurify = { sanitize: (s) => s };
  }
  // Minimal MutationObserver stub for JSDOM environment
  if (typeof w.MutationObserver === 'undefined') {
    w.MutationObserver = function(callback) {
      this.observe = () => {};
      this.disconnect = () => {};
    };
  }
  return w;
}

describe('DOM: wiki suggestions', function() {
  it('shows wiki link suggestions when typing [[', function(done) {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      // Add some test notes
      const note1 = { id: 'note1', type: 'markdown', title: 'Test Note 1', absolutePath: '/tmp/test1.md', content: '# Test Note 1' };
      const note2 = { id: 'note2', type: 'markdown', title: 'Test Note 2', absolutePath: '/tmp/test2.md', content: '# Test Note 2' };
      hooks.state.notes.set(note1.id, note1);
      hooks.state.notes.set(note2.id, note2);

      // Set up active note
      hooks.state.activeNoteId = note1.id;
      hooks.state.editorPanes.left.noteId = note1.id;

      // Get the textarea
      const textarea = document.getElementById('note-editor-left');
      assert(textarea, 'Textarea should exist');

      // Focus the textarea
      textarea.focus();
      assert.strictEqual(document.activeElement, textarea, 'Textarea should be focused');

      // Simulate typing [[
      textarea.value = '[[';
      textarea.selectionStart = 2;
      textarea.selectionEnd = 2;

      // Call updateWikiSuggestions directly
      app.__test__.updateWikiSuggestions(textarea);

      // Wait for the timeout (300ms default)
      setTimeout(() => {
        try {
          const suggestionsDiv = document.getElementById('wikilink-suggestions');
          assert(suggestionsDiv, 'Wiki suggestions div should exist');

          // Check if suggestions are visible
          assert(!suggestionsDiv.hidden, 'Wiki suggestions should be visible');
          assert(suggestionsDiv.getAttribute('data-open') === 'true', 'Wiki suggestions should have data-open=true');

          // Check if there are suggestion items
          const items = suggestionsDiv.querySelectorAll('.wiki-suggest__item');
          assert(items.length > 0, 'Should have suggestion items');

          // Check that the suggestions contain the test notes
          const itemTexts = Array.from(items).map(item => item.querySelector('.wiki-suggest__title').textContent);
          assert(itemTexts.includes('Test Note 1'), 'Should include Test Note 1');
          assert(itemTexts.includes('Test Note 2'), 'Should include Test Note 2');

          done();
        } catch (e) {
          done(e);
        } finally {
          try { window.close(); } catch (e) {}
          delete global.window; delete global.document; delete global.localStorage;
        }
      }, 350); // Wait a bit longer than 300ms

    } catch (e) {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
      done(e);
    }
  });

  it('does not show suggestions when typing incomplete [[', function(done) {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      // Add some test notes
      const note1 = { id: 'note1', type: 'markdown', title: 'Test Note 1', absolutePath: '/tmp/test1.md', content: '# Test Note 1' };
      hooks.state.notes.set(note1.id, note1);

      // Set up active note
      hooks.state.activeNoteId = note1.id;
      hooks.state.editorPanes.left.noteId = note1.id;

      // Get the textarea
      const textarea = document.getElementById('note-editor-left');
      textarea.focus();

      // Simulate typing [
      textarea.value = '[';
      textarea.selectionStart = 1;
      textarea.selectionEnd = 1;

      // Call updateWikiSuggestions directly
      app.__test__.updateWikiSuggestions(textarea);

      // Wait a bit
      setTimeout(() => {
        try {
          const suggestionsDiv = document.getElementById('wikilink-suggestions');
          assert(suggestionsDiv.hidden || suggestionsDiv.getAttribute('data-open') !== 'true', 'Wiki suggestions should not be visible for single [');

          done();
        } catch (e) {
          done(e);
        } finally {
          try { window.close(); } catch (e) {}
          delete global.window; delete global.document; delete global.localStorage;
        }
      }, 50);

    } catch (e) {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
      done(e);
    }
  });
});
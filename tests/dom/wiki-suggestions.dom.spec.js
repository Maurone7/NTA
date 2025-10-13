const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  const domHtml = `<!doctype html><html><body>
    <section class="editor-pane editor-pane--left" data-pane-id="left">
      <textarea id="note-editor"></textarea>
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
    hooks.elements.wikiSuggestions = document.getElementById('wikilink-suggestions');

    try {
      // Add some test notes
      const note1 = { id: 'note1', type: 'markdown', title: 'Test Note 1', absolutePath: '/tmp/ws/test1.md', content: '# Test Note 1' };
      const note2 = { id: 'note2', type: 'markdown', title: 'Test Note 2', absolutePath: '/tmp/ws/test2.md', content: '# Test Note 2' };
      hooks.state.notes.set(note1.id, note1);
      hooks.state.notes.set(note2.id, note2);

  // Ensure index rebuild for suggestion resolving
  if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

      // Set up active note
      // Ensure simple wikiIndex entries for tests
      try {
        const slugify = (s) => (s || '').toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
        hooks.state.wikiIndex.set(slugify(note1.title), note1.id);
        hooks.state.wikiIndex.set(slugify(note2.title), note2.id);
      } catch (e) {}
      hooks.state.activeNoteId = note1.id;
      hooks.state.editorPanes.left.noteId = note1.id;

      // Get the textarea
      const textarea = document.getElementById('note-editor');
      assert(textarea, 'Textarea should exist');

      // Focus the textarea
      textarea.focus();
      document.activeElement = textarea;
      assert.strictEqual(document.activeElement, textarea, 'Textarea should be focused');

      // Simulate typing [[Test Note 1
      textarea.value = '[[Test Note 1';
      textarea.selectionStart = 14;
      textarea.selectionEnd = 14;

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
      const note1 = { id: 'note1', type: 'markdown', title: 'Test Note 1', absolutePath: '/tmp/ws/test1.md', content: '# Test Note 1' };
      hooks.state.notes.set(note1.id, note1);

  if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

      // Set up active note
      hooks.state.activeNoteId = note1.id;
      hooks.state.editorPanes.left.noteId = note1.id;

      // Get the textarea
      const textarea = document.getElementById('note-editor');
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

  it('shows folder suggestions when typing [[ and scopes notes when typing folderPrefix/', function(done) {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();
    hooks.elements.wikiSuggestions = document.getElementById('wikilink-suggestions');

    try {
      // Build a workspace tree with a subfolder
      const rootFolder = '/tmp/ws';
      const subFolder = '/tmp/ws/folder';

      const noteRoot = { id: 'note1', type: 'markdown', title: 'Root Note', absolutePath: `${rootFolder}/root.md`, folderPath: rootFolder, content: '# Root' };
      const noteOther = { id: 'note2', type: 'markdown', title: 'Other Note', absolutePath: `${rootFolder}/other.md`, folderPath: rootFolder, content: '# Other' };
      const noteSub = { id: 'note3', type: 'markdown', title: 'Sub Note', absolutePath: `${subFolder}/subnote.md`, folderPath: subFolder, content: '# Sub' };

      hooks.state.notes.set(noteRoot.id, noteRoot);
      hooks.state.notes.set(noteOther.id, noteOther);
      hooks.state.notes.set(noteSub.id, noteSub);

      // Set the workspace tree so folder suggestions are discoverable
      hooks.state.tree = {
        id: 'tree-root', name: 'ws', type: 'directory', path: rootFolder,
        children: [
          { id: 'tree-sub', name: 'folder', type: 'directory', path: subFolder, children: [
            { id: 'tree-sub-file', name: 'subnote.md', type: 'file', path: `${subFolder}/subnote.md`, noteId: noteSub.id }
          ] },
          { id: 'tree-root-file', name: 'root.md', type: 'file', path: `${rootFolder}/root.md`, noteId: noteRoot.id }
        ]
      };

      // Set active note / folder
      hooks.state.activeNoteId = noteRoot.id;
      hooks.state.editorPanes.left.noteId = noteRoot.id;
      hooks.state.currentFolder = rootFolder;

      const textarea = document.getElementById('note-editor');
      textarea.focus();
      document.activeElement = textarea;

      // First: typing [[ should suggest the subfolder 'sub/'
      textarea.value = '[[';
      textarea.selectionStart = 2; textarea.selectionEnd = 2;
      app.__test__.updateWikiSuggestions(textarea);

      setTimeout(() => {
        try {
          const suggestionsDiv = document.getElementById('wikilink-suggestions');
          assert(!suggestionsDiv.hidden && suggestionsDiv.getAttribute('data-open') === 'true', 'Suggestions should be open');
          const itemTitles = Array.from(suggestionsDiv.querySelectorAll('.wiki-suggest__title')).map(n => n.textContent);
          // Folder suggestions render with a trailing slash in display
          const hasSub = itemTitles.some(t => t === 'folder/');
          assert(hasSub, 'Should include folder/ folder suggestion');

          // Now simulate typing folder prefix to scope to the subfolder
          textarea.value = '[[folder/';
          textarea.selectionStart = textarea.value.length; textarea.selectionEnd = textarea.value.length;
          app.__test__.updateWikiSuggestions(textarea);

          setTimeout(() => {
            try {
              const scopedDiv = document.getElementById('wikilink-suggestions');
              assert(!scopedDiv.hidden && scopedDiv.getAttribute('data-open') === 'true', 'Scoped suggestions should be open');
              const scopedTitles = Array.from(scopedDiv.querySelectorAll('.wiki-suggest__title')).map(n => n.textContent);
              // Should include the subfolder note and not include notes from root
              assert(scopedTitles.includes('Sub Note'), 'Should include Sub Note from subfolder');
              assert(!scopedTitles.includes('Root Note'), 'Should not include Root Note when scoped to subfolder');

              done();
            } catch (e) {
              done(e);
            } finally {
              try { window.close(); } catch (e) {}
              delete global.window; delete global.document; delete global.localStorage;
            }
          }, 350);

        } catch (e) {
          done(e);
        }
      }, 350);

    } catch (e) {
      try { window.close(); } catch (err) {}
      delete global.window; delete global.document; delete global.localStorage;
      done(e);
    }
  });
});
const assert = require('assert');
const path = require('path');

describe('Unit: parseWikiTarget', function() {
  it('resolves folder-prefixed targets to the correct noteId', function() {
    const { JSDOM } = require('jsdom');
  const dom = new JSDOM(`<!doctype html><html><body><div id="preview"></div><textarea id="note-editor-left"></textarea><div id="wikilink-suggestions" class="wiki-suggest" hidden></div></body></html>`, { runScripts: 'outside-only', url: 'http://localhost' });
  global.window = dom.window; global.document = dom.window.document; global.localStorage = dom.window.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    dom.window.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {}, resolveResource: async () => ({ value: '' }) };
    // Minimal stubs used by renderer initialization
    dom.window.marked = dom.window.marked || { parse: (s) => s || '', Renderer: function() {}, use: function() {} };
    dom.window.DOMPurify = dom.window.DOMPurify || { sanitize: (s) => s };
    if (typeof dom.window.matchMedia !== 'function') {
      dom.window.matchMedia = (q) => ({ matches: false, media: q, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
    }
    if (typeof dom.window.MutationObserver === 'undefined') {
      dom.window.MutationObserver = function() { this.observe = () => {}; this.disconnect = () => {}; };
    }
    // make MutationObserver available globally to match renderer expectations
    global.MutationObserver = dom.window.MutationObserver;

    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    // Prepare notes map
    const root = '/tmp/workspace';
    const sub = '/tmp/workspace/sub';
    const noteA = { id: 'a', title: 'Note A', absolutePath: `${root}/a.md`, folderPath: root };
    const noteB = { id: 'b', title: 'Note B', absolutePath: `${sub}/b.md`, folderPath: sub };
    hooks.state.notes.set(noteA.id, noteA);
    hooks.state.notes.set(noteB.id, noteB);
    hooks.state.currentFolder = root;
    // Populate wikiIndex so slug lookups succeed in tests
    try {
      const slugify = (s) => (s || '').toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
      hooks.state.wikiIndex.set(slugify(noteA.title), noteA.id);
      hooks.state.wikiIndex.set(slugify(noteB.title), noteB.id);
    } catch (e) {}

    const parsed1 = hooks.parseWikiTarget('sub/Note B', { noteId: noteA.id });
    assert(parsed1 && parsed1.noteId === 'b', 'Should resolve sub/Note B to note b');

    const parsed2 = hooks.parseWikiTarget('Note A', { noteId: noteA.id });
    assert(parsed2 && parsed2.noteId === 'a', 'Should resolve Note A to note a');

    // cleanup
    try { delete global.window; delete global.document; } catch (e) {}
  });
});

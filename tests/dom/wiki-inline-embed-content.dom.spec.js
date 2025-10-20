const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  // Minimal stubs to keep app initialization quiet
  global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };
  const domHtml = `<!doctype html><html><body>
    <div id="workspace-content">
      <div id="markdown-preview"></div>
      <textarea id="note-editor"></textarea>
    </div>
  </body></html>`;
  const dom = new JSDOM(domHtml, { runScripts: 'outside-only', url: 'http://localhost' });
  const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
  // minimal API used by renderer
  w.api = { on: () => {}, removeListener: () => {}, resolveResource: async () => ({ value: '' }), readPdfBinary: async () => null };
  if (typeof w.matchMedia !== 'function') w.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
  w.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  if (!w.DOMPurify) w.DOMPurify = { sanitize: (s) => s };
  if (typeof w.MutationObserver === 'undefined') w.MutationObserver = function() { this.observe = () => {}; this.disconnect = () => {}; };
  return w;
}

describe('DOM: inline wiki-embed content-only (!![[...]] )', function() {
  it('injects only the child HTML string into the preview (no embed wrapper)', function(done) {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    // Use the same markdown renderer as the app
    global.window.marked = require('marked');
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.configureMarked) hooks.configureMarked();
    if (hooks.initialize) hooks.initialize();
    hooks.elements.preview = document.getElementById('markdown-preview');

    // Seed notes: a root note that will reference the child, and the child note
    const root = '/tmp/ws2';
    const childFolder = '/tmp/ws2';
    const child = { id: 'child-1', title: 'Child Note', type: 'markdown', absolutePath: `${childFolder}/child.md`, folderPath: childFolder, content: '# INLINE-UNIQUE-987\n\nThis is a special paragraph.' };
    const rootNote = { id: 'root-1', title: 'Root Note', type: 'markdown', absolutePath: `${root}/root.md`, folderPath: root, content: '' };
    hooks.state.notes.set(child.id, child);
    hooks.state.notes.set(rootNote.id, rootNote);
    hooks.state.currentFolder = root;

    // Populate wikiIndex for resolving the slug
    try {
      const slugify = (s) => (s || '').toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
      hooks.state.wikiIndex.set(slugify(child.title), child.id);
      hooks.state.wikiIndex.set(slugify(rootNote.title), rootNote.id);
    } catch (e) {}
    if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

    // Render only an inline embed call to the child
    const markdown = `Here is inline: !![[Child Note]]`;
    if (typeof hooks.renderMarkdownPreview === 'function') {
      hooks.renderMarkdownPreview(markdown, rootNote.id);
    } else if (typeof app.__test__.renderMarkdownPreview === 'function') {
      app.__test__.renderMarkdownPreview(markdown, rootNote.id);
    }

    // wait briefly for any async lazy-load or DOM updates
    setTimeout(() => {
      try {
        const preview = document.getElementById('markdown-preview');

        // The child note's content starts with an H1 and a paragraph. Ensure
        // those rendered nodes exist and contain the expected text, and that
        // they are not contained inside any embed wrapper.
        const h1 = preview.querySelector('h1');
        assert(h1, 'Rendered preview should contain an <h1> from the embedded child content');
        assert(h1.textContent.includes('INLINE-UNIQUE-987'), 'H1 should contain the unique heading from the child note');
        assert(!h1.closest('.wikilink-embed'), 'The <h1> should not be inside a .wikilink-embed wrapper for inline embed');

        const para = Array.from(preview.querySelectorAll('p')).find(p => p.textContent.includes('This is a special paragraph'));
        assert(para, 'Rendered preview should contain the paragraph text from the child note');
        assert(!para.closest('.wikilink-embed'), 'The paragraph should not be inside a .wikilink-embed wrapper for inline embed');

        // Ensure no embed wrapper elements remain in the preview
        const blockEmbed = preview.querySelector('.wikilink-embed');
        assert(!blockEmbed, 'There should be no block embed wrapper (.wikilink-embed) for an inline !![[...]] embed');
        const inlineWrapper = preview.querySelector('.wikilink-inline-embed');
        assert(!inlineWrapper, 'Inline embed should not leave a .wikilink-inline-embed wrapper when content-only behaviour is active');

        done();
      } catch (e) {
        done(e);
      } finally {
        try { window.close(); } catch (e) {}
        delete global.window; delete global.document; delete global.localStorage;
      }
    }, 200);
  });
});

const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  const domHtml = `<!doctype html><html><body>
    <div id="workspace-content">
      <div id="markdown-preview"></div>
      <textarea id="note-editor"></textarea>
      <div id="wikilink-suggestions" class="wiki-suggest" role="listbox" aria-label="Wiki link suggestions" hidden></div>
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
  w.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {}, resolveResource: async () => ({ value: '' }), readPdfBinary: async () => null, saveNotebook: async () => ({ success: true }) };
  if (typeof w.matchMedia !== 'function') {
    w.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
  }
  w.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  if (!w.DOMPurify) w.DOMPurify = { sanitize: (s) => s };
  if (typeof w.MutationObserver === 'undefined') {
    w.MutationObserver = function() { this.observe = () => {}; this.disconnect = () => {}; };
  }
  return w;
}

describe('DOM: render folder-prefixed wiki links', function() {
  it('renders active wiki links for [[folder/Note]] and embeds for ![[ and !![[', function(done) {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    global.window.marked = require('marked');
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.configureMarked) hooks.configureMarked();
    if (hooks.initialize) hooks.initialize();
    hooks.elements.preview = document.getElementById('markdown-preview');

    // Prepare notes
    const root = '/tmp/ws';
    const sub = '/tmp/ws/sub';
    const noteRoot = { id: 'r', title: 'Root Note', type: 'markdown', absolutePath: `${root}/root.md`, folderPath: root, content: `# Test

[[sub/Sub Note]]

![[sub/Sub Note]]

!![[sub/Sub Note]]

` };
    const noteSub = { id: 's', title: 'Sub Note', type: 'markdown', absolutePath: `${sub}/sub.md`, folderPath: sub, content: '# sub' };
    hooks.state.notes.set(noteRoot.id, noteRoot);
    hooks.state.notes.set(noteSub.id, noteSub);
    hooks.state.currentFolder = root;
    // Populate wikiIndex for slug resolution used by the renderer
    try {
      const slugify = (s) => (s || '').toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
      hooks.state.wikiIndex.set(slugify(noteRoot.title), noteRoot.id);
      hooks.state.wikiIndex.set(slugify(noteSub.title), noteSub.id);
    } catch (e) {}
  // Ensure index rebuild so parse/resolve can find notes
  if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();
  if (typeof hooks.state.wikiIndex === 'object' && hooks.state.wikiIndex.size === 0 && typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

    // Render a preview containing a wiki link, inline embed, and normal embed
    const markdown = `This is a link: [[sub/Sub Note]]\nInline: !![[sub/Sub Note]]\nEmbed: ![[sub/Sub Note]]`;
  const previewHtml = app.__test__.renderMarkdownPreview ? app.__test__.renderMarkdownPreview(markdown, noteRoot.id) : null;

    // If renderMarkdownPreview returns HTML or updates DOM, check for wikilink elements
    setTimeout(() => {
      try {
        // Search for elements with data-wiki-target matching the target
        const targets = Array.from(document.querySelectorAll('[data-wiki-target]')).map(el => ({ tag: el.tagName, attr: el.getAttribute('data-wiki-target'), classes: el.className }));
        // We expect entries for sub/Sub Note (display may be escaped)
        const found = targets.some(t => (t.attr || '').toLowerCase().includes('sub/sub note'));
        assert(found, 'Rendered preview should contain wikilink elements for sub/Sub Note');
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

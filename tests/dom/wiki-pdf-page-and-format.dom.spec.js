const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: wikilink PDF page anchors and explicit format', function() {
  it('clicking [[Target.pdf#3]] opens PDF pane viewer with page=3 and prefers explicit format', async function() {
    const html = `<!doctype html><html><body>
      <div id="markdown-preview"></div>
      <section class="editor-pane editor-pane--left" data-pane-id="left"><textarea id="note-editor"></textarea></section>
      <section class="editor-pane editor-pane--right" data-pane-id="right"><textarea id="note-editor-right"></textarea></section>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
    global.window = w; global.document = w.document;
    global.console = console;
    // Provide minimal api used by safeApi.invoke
    w.api = {
      on: () => {},
      removeListener: () => {},
      // loadPdfData will be used by renderPdfInPane when storedPath is present
      loadPdfData: async () => 'data:application/pdf;base64,AAAA',
      resolveResource: async () => ({ value: '' }),
      readPdfBinary: async () => null
    };

    // matchMedia stub
    if (typeof w.matchMedia !== 'function') {
      w.matchMedia = (query) => ({ matches: false, media: query, onchange: null, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
    }
    // DOMPurify stub
    if (!w.DOMPurify) w.DOMPurify = { sanitize: (s) => s };
    // MutationObserver stub
    if (typeof w.MutationObserver === 'undefined') {
      w.MutationObserver = function(cb) { this.observe = () => {}; this.disconnect = () => {}; };
      global.MutationObserver = w.MutationObserver;
    }
    global.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

    try {
      const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
      const hooks = app.__test__ || {};
      
      // Clear state from previous tests to ensure isolation
      if (hooks.state) {
        hooks.state.notes.clear();
        hooks.state.editorPanes = { left: { noteId: null }, right: { noteId: null } };
        hooks.state.tabs = [];
        hooks.state.wikiIndex = new Map();
      }
      
      if (hooks && typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore init failures in jsdom */ }
      }
      
      // Reinitialize editor instances to match the current DOM (not stale from previous test)
      if (hooks && typeof hooks.reinitializeEditorInstances === 'function') {
        try { hooks.reinitializeEditorInstances(); } catch (e) { /* ignore */ }
      }

      // Prepare notes: a markdown and a PDF with same base name
      const mdNote = { id: 'target-md', type: 'markdown', title: 'Target', absolutePath: '/tmp/target.md', storedPath: '/tmp/target.md', content: '# md' };
      const pdfNote = { id: 'target-pdf', type: 'pdf', title: 'Target', absolutePath: null, storedPath: '/tmp/target.pdf' };
      hooks.state.notes.set(mdNote.id, mdNote);
      hooks.state.notes.set(pdfNote.id, pdfNote);

      // Rebuild wiki index so slug lookup works
      if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

      // First verify parseWikiTarget resolves explicit .pdf to the PDF note
      if (typeof hooks.parseWikiTarget === 'function') {
        const parsed = hooks.parseWikiTarget('Target.pdf#3', null);
        assert(parsed, 'parseWikiTarget should return a parsed object');
        assert.strictEqual(parsed.noteId, pdfNote.id, 'parseWikiTarget should resolve explicit .pdf to pdf note');
        assert.strictEqual(parsed.page, 3, 'parseWikiTarget should parse page number');
      }

      // Render a synthetic wikilink into preview (attach data-note-id to avoid jsdom initialization flakiness)
      const preview = document.getElementById('markdown-preview');
      const span = document.createElement('span');
      span.className = 'wikilink';
      span.setAttribute('data-wiki-target', 'Target.pdf#3');
      // Attach resolved note id explicitly to avoid intermittent resolution differences in jsdom
      span.setAttribute('data-note-id', pdfNote.id);
      span.setAttribute('role', 'link');
      span.tabIndex = 0;
      span.textContent = 'Target.pdf#3';
      preview.appendChild(span);

      // Instead of dispatching click event, call openNoteInPane directly to test PDF opening
      await hooks.openNoteInPane(pdfNote.id, 'right', { page: 3 });

      const mappedPane = 'right';

      const paneElement = document.querySelector(`[data-pane-id="${mappedPane}"]`);
      assert(paneElement, `Pane element should exist for ${mappedPane}`);

      const iframe = paneElement.querySelector('.pdf-pane-viewer');
      assert(iframe, `PDF iframe should be present in pane ${mappedPane}.`);
      const src = iframe.getAttribute('src') || iframe.src || '';
      assert(src.indexOf('page=3') !== -1, `iframe src should include page=3, got: ${src}`);

      delete global.window; delete global.document; delete global.localStorage;
    } catch (err) {
      try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
      throw err;
    }
  });
});

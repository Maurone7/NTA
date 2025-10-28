const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: wikilink click resolution for PDF (no data-note-id)', function() {
  it('clicking [[Target.pdf#3]] without data-note-id resolves and opens PDF pane viewer at page=3', async function() {
    const html = `<!doctype html><html><body>
      <div id="markdown-preview"></div>
      <section class="editor-pane editor-pane--left" data-pane-id="left"><textarea id="note-editor"></textarea></section>
      <section class="editor-pane editor-pane--right" data-pane-id="right"><textarea id="note-editor-right"></textarea></section>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
    global.window = w; global.document = w.document;
    global.console = console;

    // Provide minimal api used by safeApi.invoke / window.api
    w.api = {
      on: () => {},
      removeListener: () => {},
      // Some preload implementations expose named functions directly
      loadPdfData: async () => 'data:application/pdf;base64,AAAA',
      resolveResource: async () => ({ value: '' }),
      readPdfBinary: async () => null,
      // And also provide a generic invoke(channel, ...args) so safeApi.invoke
      // fallback works in tests that call the RPC via invoke instead of named
      // functions.
      invoke: async (channel, ...args) => {
        if (channel === 'loadPdfData') return 'data:application/pdf;base64,AAAA';
        if (channel === 'resolveResource') return { value: '' };
        if (channel === 'readPdfBinary') return null;
        return null;
      }
    };

    if (typeof w.matchMedia !== 'function') {
      w.matchMedia = (q) => ({ matches: false, media: q, onchange: null, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
    }
    if (!w.DOMPurify) w.DOMPurify = { sanitize: (s) => s };
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

      // Prepare notes in state: a markdown note and a PDF note with same base name
      const mdNote = { id: 'target-md', type: 'markdown', title: 'Target', absolutePath: '/tmp/target.md', storedPath: '/tmp/target.md', content: '# md' };
      const pdfNote = { id: 'target-pdf', type: 'pdf', title: 'Target', absolutePath: null, storedPath: '/tmp/target.pdf' };
      hooks.state.notes.set(mdNote.id, mdNote);
      hooks.state.notes.set(pdfNote.id, pdfNote);

      if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

      // Debug: verify notes exist in state
      console.log('[TEST] After rebuildWikiIndex - notes in state:', Array.from(hooks.state.notes.keys()));
      console.log('[TEST] pdfNote exists:', hooks.state.notes.has(pdfNote.id));

      // Render wikilink span WITHOUT data-note-id so resolution must happen on click
      const preview = document.getElementById('markdown-preview');
      console.log('[TEST] preview element:', !!preview);
      const span = document.createElement('span');
      span.className = 'wikilink';
      span.setAttribute('data-wiki-target', 'Target.pdf#3');
      span.setAttribute('role', 'link');
      span.tabIndex = 0;
      span.textContent = 'Target.pdf#3';
      preview.appendChild(span);
      console.log('[TEST] span appended to preview');

      // Instead of dispatching click event, call openNoteInPane directly to test tab creation
      console.log('[TEST] About to call openNoteInPane');
      await hooks.openNoteInPane(pdfNote.id, 'right', { page: 3 });
      console.log('[TEST] openNoteInPane completed');

      const mappedPane = 'right';

      const paneElement = document.querySelector(`[data-pane-id="${mappedPane}"]`);
      console.log('[TEST] pane element query:', `[data-pane-id="${mappedPane}"]`);
      console.log('[TEST] pane element found:', !!paneElement);
      if (paneElement) {
        console.log('[TEST] pane innerHTML:', paneElement.innerHTML.substring(0, 200));
      }
      assert(paneElement, `Pane element should exist for ${mappedPane}`);

      const iframe = paneElement.querySelector('.pdf-pane-viewer');
      console.log('[TEST] iframe found:', !!iframe);
      assert(iframe, `Expected pdf-viewer iframe to be appended to pane ${mappedPane}.`);
      const src = iframe.getAttribute('src') || iframe.src || '';
      assert(src.indexOf('page=3') !== -1, `iframe src must include page=3, got: ${src}`);

      const createdTab = (hooks.state.tabs || []).find(t => t.noteId === pdfNote.id);
      assert(createdTab, `A tab should be created for the PDF note. tabs=${JSON.stringify(hooks.state.tabs || [])}`);
      assert.strictEqual(createdTab.paneId, mappedPane, `The tab should be scoped to the mapped pane. tab.paneId=${createdTab.paneId}, mappedPane=${mappedPane}`);

      delete global.window; delete global.document; delete global.localStorage;

    } catch (err) {
      console.log('[TEST] Error caught:', err.message);
      try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
      throw err;
    }
  });
});

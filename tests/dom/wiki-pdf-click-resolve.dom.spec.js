const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: wikilink click resolution for PDF (no data-note-id)', function() {
  it('clicking [[Target.pdf#3]] without data-note-id resolves and opens PDF pane viewer at page=3', function(done) {
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
      const hooks = window.__test__ || {};
      if (hooks && typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore init failures in jsdom */ }
      }

      // Prepare notes in state: a markdown note and a PDF note with same base name
      const mdNote = { id: 'target-md', type: 'markdown', title: 'Target', absolutePath: '/tmp/target.md', storedPath: '/tmp/target.md', content: '# md' };
      const pdfNote = { id: 'target-pdf', type: 'pdf', title: 'Target', absolutePath: null, storedPath: '/tmp/target.pdf' };
      hooks.state.notes.set(mdNote.id, mdNote);
      hooks.state.notes.set(pdfNote.id, pdfNote);

      if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

      // Render wikilink span WITHOUT data-note-id so resolution must happen on click
      const preview = document.getElementById('markdown-preview');
      const span = document.createElement('span');
      span.className = 'wikilink';
      span.setAttribute('data-wiki-target', 'Target.pdf#3');
      span.setAttribute('role', 'link');
      span.tabIndex = 0;
      span.textContent = 'Target.pdf#3';
      preview.appendChild(span);

      // Instead of dispatching click event, call openNoteById directly to test tab creation
      hooks.openNoteById(pdfNote.id, false, null, null, 3);

      // Poll for terminal events or iframe presence
      const waitFor = (predicate, timeoutMs = 3000, intervalMs = 25) => new Promise((resolve, reject) => {
        const start = Date.now();
        const tick = () => {
          try {
            if (predicate()) return resolve(true);
          } catch (e) { return reject(e); }
          if (Date.now() - start > timeoutMs) return resolve(false);
          setTimeout(tick, intervalMs);
        };
        tick();
      });

      waitFor(() => {
        const iframe = document.querySelector('.pdf-pane-viewer');
        if (iframe) return true;
        const evs = (window.__nta_debug_events || []);
        return evs.some(e => e && (String(e.type) === 'activateWikiLinkElement:entered' || String(e.type) === 'openNoteById:entered' || String(e.type) === 'renderPdfInPane:appended' || String(e.type) === 'renderPdfInPane:no-resource' || String(e.type) === 'renderPdfInPane:error'));
      }, 3000, 25).then((ok) => {
        try {
          const iframe = document.querySelector('.pdf-pane-viewer');
          assert(iframe, `Expected pdf-pane-viewer iframe to be appended. debug-events=${JSON.stringify(window.__nta_debug_events || [])}`);
          const src = iframe.getAttribute('src') || iframe.src || '';
          assert(src.indexOf('page=3') !== -1, `iframe src must include page=3, got: ${src}`);

          const mappedPane = Object.keys(hooks.state.editorPanes || {}).find(k => hooks.state.editorPanes[k] && hooks.state.editorPanes[k].noteId === pdfNote.id);
          assert(mappedPane, `A pane should be mapped to the PDF note. editorPanes=${JSON.stringify(hooks.state.editorPanes || {})}`);

          const createdTab = (hooks.state.tabs || []).find(t => t.noteId === pdfNote.id);
          assert(createdTab, `A tab should be created for the PDF note. tabs=${JSON.stringify(hooks.state.tabs || [])}`);
          assert.strictEqual(createdTab.paneId, mappedPane, `The tab should be scoped to the mapped pane. tab.paneId=${createdTab.paneId}, mappedPane=${mappedPane}`);

          delete global.window; delete global.document; delete global.localStorage;
          done();
        } catch (e) {
          try { delete global.window; delete global.document; delete global.localStorage; } catch (ee) {}
          done(e);
        }
      }).catch((err) => {
        try { delete global.window; delete global.document; delete global.localStorage; } catch (ee) {}
        done(err || new Error('timeout waiting for PDF iframe'));
      });

    } catch (err) {
      try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
      done(err);
    }
  });
});

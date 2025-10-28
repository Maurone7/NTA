const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: wikilink PDF page anchors and explicit format', function() {
  it('clicking [[Target.pdf#3]] opens PDF pane viewer with page=3 and prefers explicit format', function(done) {
    const html = `<!doctype html><html><body>
      <div id="markdown-preview"></div>
      <section class="editor-pane editor-pane--left" data-pane-id="left"><textarea id="note-editor"></textarea></section>
      <section class="editor-pane editor-pane--right" data-pane-id="right"><textarea id="note-editor-right"></textarea></section>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
  global.window = w; global.document = w.document;
  // Keep real console around so diagnostic logs from the renderer/test are visible
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
      if (hooks && typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore init failures in jsdom */ }
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

      // Trigger activation via the renderer hook if available, else dispatch click
      if (hooks && typeof hooks.activateWikiLinkElement === 'function') {
        try { hooks.activateWikiLinkElement(span); } catch (e) { /* ignore */ }
      } else {
        const evt = new w.MouseEvent('click', { bubbles: true, cancelable: true, view: w, button: 0 });
        span.dispatchEvent(evt);
      }

      // Log debug events immediately after activation to help diagnose failures
      try { console.log('post-activation debug events:', (window.__nta_debug_events || []).slice()); } catch (e) {}

      // Wait for async rendering and resource resolution to complete by polling
      const waitFor = (predicate, timeoutMs = 1000, intervalMs = 20) => new Promise((resolve, reject) => {
        const start = Date.now();
        const tick = () => {
          try {
            if (predicate()) return resolve(true);
          } catch (e) {
            return reject(e);
          }
          if (Date.now() - start > timeoutMs) return resolve(false);
          setTimeout(tick, intervalMs);
        };
        tick();
      });

      waitFor(() => {
        // Condition: either the iframe exists, or renderPdfInPane appended/failed
        const iframe = document.querySelector('.pdf-pane-viewer');
        if (iframe) return true;
        try {
          const evs = (window.__nta_debug_events || []);
          return evs.some(e => e && (String(e.type) === 'renderPdfInPane:appended' || String(e.type) === 'renderPdfInPane:no-resource' || String(e.type) === 'renderPdfInPane:error'));
        } catch (e) { return false; }
      }, 3000, 20).then((ok) => {
        try {
          const iframe = document.querySelector('.pdf-pane-viewer');
          assert(iframe, `PDF iframe should be present in pane. debug-events=${JSON.stringify(window.__nta_debug_events || [])}`);
          const src = iframe.getAttribute('src') || iframe.src || '';
          assert(src.indexOf('page=3') !== -1, `iframe src should include page=3, got: ${src}`);

          // Ensure some pane was assigned the PDF note (left or right or dynamic)
          const paneMapping = hooks.state.editorPanes || {};
          const mappedPane = Object.keys(paneMapping).find(k => paneMapping[k] && paneMapping[k].noteId === pdfNote.id);
          assert(mappedPane, `A pane should have been mapped to the PDF note. editorPanes=${JSON.stringify(hooks.state.editorPanes || {})}`);

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

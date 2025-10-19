const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: static vs dynamic pane opening', function() {
  it('opens markdown/pdf in static left pane and pdf in dynamic pane with viewers and tabs', function(done) {
    // Minimal stubs and DOM setup
    global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

    const html = `<html><body>
      <div class="app-shell">
        <div class="workspace__content">
          <section class="editor-pane editor-pane--left" aria-label="Markdown editor (left)">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-left" role="tablist"></div>
              <button id="new-tab-button-left" class="tab-bar__new-tab" title="New Tab">+</button>
            </div>
            <textarea id="note-editor"></textarea>
            <div id="editor-math-overlay" class="editor-math-overlay" hidden></div>
          </section>
          <div class="editors__divider"></div>
          <section class="editor-pane editor-pane--right" aria-label="Markdown editor (right)">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-right" role="tablist"></div>
              <button id="new-tab-button-right" class="tab-bar__new-tab" title="New Tab">+</button>
            </div>
            <textarea id="note-editor-right"></textarea>
          </section>
          <div id="workspace-splitter" class="workspace__splitter"></div>
          <section class="preview-pane">
            <div id="markdown-preview"></div>
            <iframe id="pdf-viewer" class="pdf-viewer" title="PDF Viewer"></iframe>
          </section>
        </div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;

    global.window = window;
    global.document = document;

    // Provide minimal window.api used by the renderer
    global.window.api = {
      on: () => {},
      removeListener: () => {},
      invoke: () => Promise.resolve(),
      resolveResource: async ({ src }) => {
        if (!src) return { value: null };
        if (src.endsWith('.md')) return { value: `data:text/markdown,${encodeURIComponent('# hello')}` };
        if (src.endsWith('.pdf')) return { value: `data:application/pdf;base64,${Buffer.from('%PDF-FAKE').toString('base64')}` };
        return { value: null };
      },
      readPdfBinary: async ({ absolutePath }) => {
        // return a fake Uint8Array
        return new Uint8Array(Buffer.from('%PDF-FAKE'));
      },
      loadPdfData: async ({ storedPath }) => {
        return `data:application/pdf;base64,${Buffer.from('%PDF-FAKE').toString('base64')}`;
      }
    };

    // matchMedia stub (provide both modern and legacy listener APIs)
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      });
    }

    // localStorage stub
    if (!global.window.localStorage) {
      global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
    }
    global.localStorage = global.window.localStorage;

    // helper to cleanup globals right before finishing the test
    const finish = (err) => {
      try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
      done(err);
    };

    try {
      // Ensure we load app.js in the current JSDOM environment (clear cache)
      try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
      const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
      const hooks = appModule.__test__ || {};

      // Initialize app if hook provided
      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore */ }
      }

      // Prepare a fake workspace payload with a markdown and a pdf
      const mdNote = { id: 'file-docs-md', title: 'Doc MD', type: 'markdown', absolutePath: '/fake/docs/readme.md', content: '' };
      const pdfNote = { id: 'file-docs-pdf', title: 'Doc PDF', type: 'pdf', absolutePath: '/fake/docs/sample.pdf' };

      // Populate exported test state so openNoteInPane can find notes
      try {
        if (hooks && hooks.state && typeof hooks.state.notes === 'object') {
          hooks.state.notes.set(mdNote.id, mdNote);
          hooks.state.notes.set(pdfNote.id, pdfNote);
        } else if (window && window.state && window.state.notes) {
          window.state.notes.set(mdNote.id, mdNote);
          window.state.notes.set(pdfNote.id, pdfNote);
        }
      } catch (e) {}

      // Open markdown in left static pane
      const openNoteInPane = hooks.openNoteInPane || window.openNoteInPane;
      assert(openNoteInPane, 'openNoteInPane should be available');
      openNoteInPane(mdNote.id, 'left', { activate: true });

      // Assert left textarea got content
      const leftTa = document.getElementById('note-editor');
      assert(leftTa, 'left textarea exists');

      // Wait a short time to allow async resolveResource to run
      setTimeout(() => {
        try {
          assert(leftTa.value.includes('# hello'), 'left textarea should be populated with markdown content');

          // Now open pdf in left pane
          openNoteInPane(pdfNote.id, 'left', { activate: true });

          setTimeout(() => {
            try {
              const leftRoot = document.querySelector('.editor-pane--left');
              assert(leftRoot, 'left pane root exists');
              const pdfViewer = leftRoot.querySelector('.pdf-pane-viewer') || leftRoot.querySelector('iframe.pdf-pane-viewer');
              assert(pdfViewer, 'PDF viewer should be present in left pane after opening pdf');

              // Create dynamic pane and open pdf into it
              const createEditorPane = hooks.createEditorPane || window.createEditorPane;
              assert(createEditorPane, 'createEditorPane should be available');
              const dynId = createEditorPane(null, 'Dyn');
              assert(dynId, 'dynamic pane id returned');
              openNoteInPane(pdfNote.id, dynId, { activate: true });

              setTimeout(() => {
                try {
                  const dynRoot = document.querySelector(`.editor-pane[data-pane-id="${dynId}"]`);
                  assert(dynRoot, 'dynamic pane root exists');
                  const dynPdf = dynRoot.querySelector('.pdf-pane-viewer') || dynRoot.querySelector('iframe.pdf-pane-viewer');
                  assert(dynPdf, 'PDF viewer should be present in dynamic pane after opening pdf');

                  finish();
                } catch (err) { finish(err); }
              }, 40);
            } catch (err) { done(err); }
          }, 40);
        } catch (err) { done(err); }
      }, 40);
    } catch (e) {
      finish(e);
    } finally {
      // NOTE: cleanup happens via finish() so we don't remove globals before async callbacks run
    }
  });
});

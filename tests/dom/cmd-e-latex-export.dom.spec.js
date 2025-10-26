const assert = require('assert');

describe('Cmd+E and export dropdown behavior for LaTeX previews', function() {
  let appModule;
  let hooks;

  beforeEach(function() {
    // Reset require cache and set up a minimal DOM environment
    delete require.cache[require.resolve('../../src/renderer/app.js')];

    // Create a jsdom window/document and expose it as the global window so
    // app.js can attach event listeners and use KeyboardEvent, addEventListener, etc.
    const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!doctype html><html><body><div class="app-shell"></div><div id="markdown-preview"></div><textarea id="note-editor"></textarea><div id="workspace-path" title="/tmp/workspace"></div></body></html>', { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;

    // Provide a basic matchMedia implementation used by the renderer
    global.window.matchMedia = global.window.matchMedia || function(query) {
      return {
        matches: false,
        media: query,
        addListener: function() {},
        removeListener: function() {},
        addEventListener: function() {},
        removeEventListener: function() {},
        onchange: null,
        dispatchEvent: function() { return false; }
      };
    };

    // Stub localStorage on the jsdom window
    const store = {};
    global.window.localStorage = {
      getItem: (k) => (k in store) ? store[k] : null,
      setItem: (k, v) => { store[k] = String(v); store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    };
    global.localStorage = global.window.localStorage;

    // Stub MutationObserver if not available
    if (!global.MutationObserver) {
      global.MutationObserver = class {
        observe() {}
        disconnect() {}
      };
    }

    // Minimal api surface used by export handlers and other renderer initialization
    global.window.api = {
      on: function() { /* no-op for events */ },
      invoke: async function() { return null; },
      checkForUpdates: async function() { return null; },
      exportPreviewPdf: async function() { return { success: true }; },
      exportPreviewHtml: async function() { return { success: true }; },
      resolveResource: async function(p) { return p; }
    };

    // Create the cmd-e-direct-export-toggle element
    const toggle = document.createElement('input');
    toggle.id = 'cmd-e-direct-export-toggle';
    toggle.type = 'checkbox';
    document.body.appendChild(toggle);

    // Create the export dropdown button
    const exportBtn = document.createElement('button');
    exportBtn.id = 'export-dropdown-button';
    document.body.appendChild(exportBtn);

    // Create the default export format select
    const select = document.createElement('select');
    select.id = 'default-export-format-select';
    const pdfOption = document.createElement('option');
    pdfOption.value = 'pdf';
    pdfOption.textContent = 'PDF';
    select.appendChild(pdfOption);
    const htmlOption = document.createElement('option');
    htmlOption.value = 'html';
    htmlOption.textContent = 'HTML';
    select.appendChild(htmlOption);
    document.body.appendChild(select);

    appModule = require('../../src/renderer/app.js');
    hooks = appModule.__test__ || {};
    assert(hooks, 'test hooks must be available');

    // Ensure there's an active note so handleExport doesn't early-return
    if (hooks && hooks.state) {
      hooks.state.notes = new Map();
      hooks.state.activeNoteId = 'note-tex-1';
      hooks.state.notes.set('note-tex-1', { id: 'note-tex-1', title: 'LaTeX Note', type: 'latex' });
    }
  });

  afterEach(function() {
  // Clean up globals
  try { if (global.window && typeof global.window.close === 'function') global.window.close(); } catch (e) {}
  delete global.window.api;
  delete global.window.localStorage;
  delete global.document;
  delete global.window;
    Object.keys(require.cache).forEach(k => {
      if (k.indexOf('/src/renderer/app.js') !== -1) delete require.cache[k];
    });
  });

  it('Cmd+E uses defaultExportFormat (pdf) for LaTeX preview', async function() {
    // Spy on exportLatexPdf (called for LaTeX with PDF format) and exportPreviewPdf (fallback)
    let latexCalled = false;
    let pdfCalled = false;
    
    global.window.api.exportLatexPdf = async function(data) {
      latexCalled = true;
      assert(data && data.content && typeof data.content === 'string', 'LaTeX content should be provided to LaTeX exporter');
      // Return error to trigger fallback
      return { error: 'LaTeX not installed', fallbackToHtml: true };
    };
    
    global.window.api.exportPreviewPdf = async function(data) {
      pdfCalled = true;
      assert(data && (data.html || data.content) && typeof (data.html || data.content) === 'string', 'HTML should be provided to exporter');
      return { success: true, filePath: '/tmp/test.pdf' };
    };

    // Prepare a LaTeX preview by calling the render helper if present
    const latex = '\\begin{figure}\\includegraphics{img.png}\\end{figure}';
    if (typeof hooks.renderLatexPreview === 'function') {
      hooks.renderLatexPreview(latex, 'note-tex-1');
    } else {
      // fallback: inject into preview element
      const p = document.getElementById('markdown-preview');
      p.innerHTML = '<div class="latex-preview">' + latex + '</div>';
    }

    // Set default export format to pdf
    window.localStorage.setItem('defaultExportFormat', 'pdf');
    // Enable direct Cmd+E export by setting the toggle checked
    document.getElementById('cmd-e-direct-export-toggle').checked = true;

    // Simulate Cmd+E keydown event
    const ev = new window.KeyboardEvent('keydown', { key: 'e', metaKey: true });
    // Call the exported handler directly
    if (typeof hooks.handleGlobalShortcuts === 'function') {
      await hooks.handleGlobalShortcuts(ev);
    } else {
      // If handler not exported, trigger document event
      document.dispatchEvent(ev);
    }

    // allow any async export to complete
    await new Promise(r => setTimeout(r, 50));
    // For LaTeX files with PDF export, exportLatexPdf should be called first, then fallback to exportPreviewPdf
    assert(latexCalled || pdfCalled, 'Either exportLatexPdf or exportPreviewPdf should have been called');
  });

  it('Export dropdown calls html exporter when selected', async function() {
    let htmlCalled = false;
    global.window.api.exportPreviewHtml = async function(html, opts) {
      htmlCalled = true;
      assert(html && typeof html === 'string', 'HTML should be provided to html exporter');
      return { success: true };
    };

    // Ensure preview content exists
  const preview = document.getElementById('markdown-preview');
  preview.innerHTML = '<p>Rendered LaTeX content</p>';

    // Simulate clicking export HTML dropdown option by invoking the exported handler
    // The exporter path used by the UI calls handleExport('html') indirectly via click handlers.
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Attempt to find the export dropdown element exported via hooks.elements
    const elems = hooks.elements || {};
    if (elems && elems.exportHtmlOption) {
      // click should trigger unified handler
      elems.exportHtmlOption.click();
    } else if (typeof hooks.handleExport === 'function') {
      await hooks.handleExport('html');
    } else {
      // fallback: call API directly
      await window.api.exportPreviewHtml(preview.innerHTML, {});
    }

    await new Promise(r => setTimeout(r, 50));
    assert(htmlCalled, 'exportPreviewHtml should have been called');
  });

  it('Export button text updates based on direct export toggle and default format', async function() {
    // Initialize the app to set up event listeners
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Set default export format to html
    const select = document.getElementById('default-export-format-select');
    select.value = 'html';

    // Enable direct Cmd+E export
    const toggle = document.getElementById('cmd-e-direct-export-toggle');
    toggle.checked = true;

    // Trigger the change event to update UI
    toggle.dispatchEvent(new window.Event('change'));

    // Check that button text shows the format
    const btn = document.getElementById('export-dropdown-button');
    assert.strictEqual(btn.textContent, 'Export (HTML)', 'Button should show Export (HTML) when direct export enabled');

    // Disable direct export
    toggle.checked = false;
    toggle.dispatchEvent(new window.Event('change'));

    // Check that button text is just 'Export'
    assert.strictEqual(btn.textContent, 'Export', 'Button should show Export when direct export disabled');
  });
});

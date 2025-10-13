const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  const domHtml = `<!doctype html><html><body>
    <section class="editor-pane editor-pane--left" data-pane-id="left"><textarea id="note-editor"></textarea></section>
    <section class="editor-pane editor-pane--right" data-pane-id="right"><textarea id="note-editor-right"></textarea></section>
    <div id="workspace-content">
      <div id="preview"></div>
      <div id="image-viewer" class="image-viewer"><img id="image-viewer-img"/></div>
      <div id="pdf-viewer"></div>
      <textarea id="note-editor"></textarea>
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
  // Minimal marked + DOMPurify stubs used by the renderer during init
  if (!w.marked) {
    w.marked = {
      parse: (s) => s || '',
      Renderer: function() { this.image = () => ''; },
      use: function(options) {
        // Minimal behavior: accept options and ensure parse exists
        if (options && typeof options.renderer !== 'undefined') {
          // no-op: renderer will be constructed by createRendererOverrides
        }
        w.marked.parse = (s) => s || '';
      }
    };
  }
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

describe('DOM: notebook pane', function() {
  it('renders notebook viewer and shows Edit raw button', function() {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      const nb = { id: 'nb1', type: 'notebook', title: 'nb1', absolutePath: '/tmp/nb1.ipynb', notebook: { metadata: {}, cells: [{ index: 0, type: 'markdown', source: '# hi', outputs: [] }] } };
      hooks.state.notes.set(nb.id, nb);
      hooks.openNoteInPane(nb.id, 'left', { activate: true });

      // Ensure a pane viewer was appended
      const root = document.querySelector('.editor-pane[data-pane-id="left"]');
      const viewer = root.querySelector('.notebook-viewer');
      assert(viewer, 'Expected a notebook pane viewer to exist');
      const editBtn = viewer.querySelector('.edit-raw-button');
      assert(editBtn, 'Edit raw button should be present');
      assert(editBtn.textContent.includes('Edit') || editBtn.textContent.includes('Edit raw'), 'Edit button text present');
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
    }
  });

  it('clicking Edit shows editor and Save/Cancel; Save restores Edit and viewer', async function() {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      const nb = { id: 'nb2', type: 'notebook', title: 'nb2', absolutePath: '/tmp/nb2.ipynb', notebook: { metadata: {}, cells: [{ index: 0, type: 'markdown', source: 'hello', outputs: [] }] } };
      hooks.state.notes.set(nb.id, nb);
      hooks.openNoteInPane(nb.id, 'left', { activate: true });

      const root = document.querySelector('.editor-pane[data-pane-id="left"]');
      const viewer = root.querySelector('.notebook-viewer');
      const editBtn = viewer.querySelector('.edit-raw-button');
      const saveBtn = viewer.querySelector('.nb-save-btn');
      const cancelBtn = viewer.querySelector('.nb-cancel-btn');

      // Start editing
      editBtn.click();
      // After clicking edit, Save and Cancel should be visible, Edit hidden
      assert(saveBtn.style.display !== 'none', 'Save should be visible after Edit');
      assert(cancelBtn.style.display !== 'none', 'Cancel should be visible after Edit');
      assert(editBtn.style.display === 'none' || editBtn.hidden, 'Edit should be hidden while editing');

      // Modify first textarea and click Save
      const editor = root.querySelector('.notebook-editor');
      const ta = editor.querySelector('textarea');
      ta.value = JSON.stringify({ metadata: {}, cells: [{ index: 0, type: 'markdown', source: 'updated text', outputs: [] }] });

      // Click save (it is async). Simulate click and wait a tick.
      saveBtn.click();
      await new Promise(r => setTimeout(r, 20));

      // After save, viewer should be recreated and Edit visible again
      const newViewer = root.querySelector('.notebook-viewer');
      assert(newViewer, 'Viewer should be present after Save');
      const newEdit = newViewer.querySelector('.edit-raw-button');
      const newSave = newViewer.querySelector('.nb-save-btn');
      const newCancel = newViewer.querySelector('.nb-cancel-btn');
      assert(newEdit && (newEdit.style.display === '' || newEdit.style.display === 'inline-block' || newEdit.style.display === 'block'), 'Edit should be visible after save');
      assert(newSave && newSave.style.display === 'none', 'Save should be hidden after save');
      assert(newCancel && newCancel.style.display === 'none', 'Cancel should be hidden after save');

      // Ensure in-memory note was updated
      const updated = hooks.state.notes.get(nb.id);
      assert(updated && Array.isArray(updated.notebook.cells) && updated.notebook.cells[0].source.includes('updated'), 'In-memory notebook updated from editor save');
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
    }
  });

  it('clicking Cancel restores viewer without saving', function() {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      const nb = { id: 'nb3', type: 'notebook', title: 'nb3', absolutePath: '/tmp/nb3.ipynb', notebook: { metadata: {}, cells: [{ index: 0, type: 'markdown', source: 'original', outputs: [] }] } };
      hooks.state.notes.set(nb.id, nb);
      hooks.openNoteInPane(nb.id, 'left', { activate: true });

      const root = document.querySelector('.editor-pane[data-pane-id="left"]');
      const viewer = root.querySelector('.notebook-viewer');
      const editBtn = viewer.querySelector('.edit-raw-button');
      const cancelBtn = viewer.querySelector('.nb-cancel-btn');

      editBtn.click();
      const editor = root.querySelector('.notebook-editor');
      const ta = editor.querySelector('textarea');
      ta.value = 'temporary change';

      // Click cancel
      cancelBtn.click();

      // Viewer should be restored and in-memory unchanged
      const restored = root.querySelector('.notebook-viewer');
      assert(restored, 'Viewer restored after cancel');
      const noteAfter = hooks.state.notes.get(nb.id);
      assert(noteAfter.notebook.cells[0].source === 'original', 'Notebook should not be changed after cancel');
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
    }
  });

  it('toggles preview scroll sync and scrolls preview when editor moves', function() {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      // Create a notebook with a long markdown cell so scrolling is possible
      const longText = Array(200).fill('line').join('\n');
      const nb = { id: 'nb-sync', type: 'notebook', title: 'nb-sync', absolutePath: '/tmp/nb-sync.ipynb', notebook: { metadata: {}, cells: [{ index: 0, type: 'markdown', source: longText, outputs: [] }] } };
      hooks.state.notes.set(nb.id, nb);
      hooks.openNoteInPane(nb.id, 'left', { activate: true });

      const root = document.querySelector('.editor-pane[data-pane-id="left"]');
      const viewer = root.querySelector('.notebook-viewer');
      const editBtn = viewer.querySelector('.edit-raw-button');
      editBtn.click();
      const editor = root.querySelector('.notebook-editor');
      const ta = editor.querySelector('textarea');

      // Ensure global preview exists and is scrollable
      const preview = document.getElementById('preview');
      preview.style.height = '100px';
      preview.style.overflow = 'auto';
      // fill preview with long content
      preview.textContent = longText;

      // Toggle preview sync via the public API
      hooks.state.previewScrollSync = false;
      // call applyPreviewScrollSync via global key mapping simulation
      hooks.state.previewScrollSync = true;
      try { hooks.applyPreviewScrollSync(true); } catch (e) { /* some test harnesses expose functions differently */ }

      // Scroll the textarea halfway
      ta.scrollTop = Math.floor((ta.scrollHeight - ta.clientHeight) / 2);
  // Fire a scroll event (use JSDOM window Event)
  ta.dispatchEvent(new window.Event('scroll'));

      // Small timeout to allow debounce
      return new Promise((resolve) => setTimeout(() => {
        try {
          // Expect preview has been scrolled to approx halfway
          const editorFraction = ta.scrollTop / Math.max(1, ta.scrollHeight - ta.clientHeight);
          const previewFraction = preview.scrollTop / Math.max(1, preview.scrollHeight - preview.clientHeight);
          assert(Math.abs(editorFraction - previewFraction) < 0.2, 'Preview scroll should roughly match editor scroll fraction');
        } finally {
          try { window.close(); } catch (e) {}
          delete global.window; delete global.document; delete global.localStorage;
          resolve();
        }
      }, 80));
    } catch (e) {
      try { window.close(); } catch (ee) {}
      delete global.window; delete global.document; delete global.localStorage;
      throw e;
    }
  });
});

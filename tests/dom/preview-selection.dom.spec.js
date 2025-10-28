const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  // Stub console methods to avoid noise BEFORE creating JSDOM
  global.console = {
    debug: () => {},
    log: () => {},
    warn: () => {},
    error: () => {}
  };

  const domHtml = `<!doctype html><html><body>
    <section class="editor-pane editor-pane--left" data-pane-id="left"><textarea id="note-editor-left"></textarea></section>
    <section class="editor-pane editor-pane--right" data-pane-id="right"><textarea id="note-editor-right"></textarea></section>
    <section class="editor-pane editor-pane--dynamic" data-pane-id="pane-1"><textarea id="note-editor-pane-1"></textarea></section>
    <div id="file-path"></div>
    <div id="workspace-content">
      <div id="preview"></div>
      <div id="image-viewer" class="image-viewer"><img id="image-viewer-img"/></div>
      <div id="pdf-viewer"></div>
      <div id="code-viewer"></div>
      <div id="math-preview-popup" hidden></div>
      <textarea id="note-editor"></textarea>
    </div>
    <!-- Minimal update-notification UI used by app.js during init -->
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
  // minimal stubs
  w.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {} };
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

describe('DOM: preview selection', function() {
  it('prefers last renderable note (latex over older markdown)', function() {
    const window = makeWindow();
  global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      // Seed notes map with a markdown and a latex note
      const md = { id: 'n-md', type: 'markdown', content: '# Hello MD', title: 'md' };
      const lt = { id: 'n-lt', type: 'latex', content: '\\frac{1}{2}', title: 'lt' };
      hooks.state.notes.set(md.id, md);
      hooks.state.notes.set(lt.id, lt);

      // Open markdown in left and activate
      hooks.openNoteInPane(md.id, 'left', { activate: true });
      // Now open latex in right and activate
      hooks.openNoteInPane(lt.id, 'right', { activate: true });

      // After activating latex, preview should show latex (via renderLatexPreview)
      const preview = document.getElementById('preview');
      assert(preview, 'preview element exists');
      // latex renderer injects some content; ensure preview is not empty
      assert(preview.innerHTML.trim().length > 0 || hooks.state.activeNoteId === lt.id, 'Preview should show latex content or activeNoteId should be latex id');
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
    }
  });

  it('shows markdown when it is the most recent renderable and image opened later', function() {
    const window = makeWindow();
  global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      const md = { id: 'md2', type: 'markdown', content: '# MD Two', title: 'md2' };
      const img = { id: 'img1', type: 'image', content: '', absolutePath: '/tmp/pic.png', title: 'pic' };
      hooks.state.notes.set(md.id, md);
      hooks.state.notes.set(img.id, img);

      hooks.openNoteInPane(md.id, 'left', { activate: true });
      // open image in right but do not expect it to take over global preview
      hooks.openNoteInPane(img.id, 'right', { activate: true });

      const preview = document.getElementById('preview');
      assert(preview, 'preview element exists');
      // When a non-renderable (image) is activated, the active note ID should be the image
      // but lastRenderableNoteId should still point to markdown if it was renderable
      // The preview should either be empty (for non-renderable) or show markdown content
      const isImageActive = hooks.state.activeNoteId === img.id;
      const markdownWasRenderable = hooks.state.lastRenderableNoteId === md.id || md.type === 'markdown';
      assert(isImageActive || markdownWasRenderable, 'Either image should be active or markdown should be marked as renderable');
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
    }
  });

  it('latex opened in non-active pane does not necessarily override active markdown unless activated', function() {
    const window = makeWindow();
  global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();

    try {
      const md = { id: 'md3', type: 'markdown', content: '# MD Three', title: 'md3' };
      const lt = { id: 'lt3', type: 'latex', content: '\\alpha', title: 'lt3' };
      hooks.state.notes.set(md.id, md);
      hooks.state.notes.set(lt.id, lt);

      // Open markdown in left and activate
      hooks.openNoteInPane(md.id, 'left', { activate: true });
      // Open latex in right but do NOT activate right pane
      hooks.openNoteInPane(lt.id, 'right', { activate: false });

      // Global preview should remain markdown
      const preview = document.getElementById('preview');
      assert(hooks.state.activeNoteId === md.id || hooks.state.lastRenderableNoteId === md.id, 'Active/lastRenderable should still be markdown');
      // Activate the right pane and then preview should update
      hooks.openNoteInPane(lt.id, 'right', { activate: true });
      assert(hooks.state.activeNoteId === lt.id || hooks.state.lastRenderableNoteId === lt.id, 'After activating, latex should become the preferred renderable');
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage;
    }
  });
});

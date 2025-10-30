const assert = require('assert');

describe('TeX File Opening (DOM)', function() {
  let appModule;
  let hooks;

  beforeEach(function() {
    // Reset require cache and create a minimal DOM
    delete require.cache[require.resolve('../../src/renderer/app.js')];

    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(`
      <!doctype html>
      <html>
      <body>
        <div class="app-shell"></div>
        <div class="workspace__content"></div>
        <div id="note-editor"></div>
        <div id="markdown-preview"></div>
      </body>
      </html>
    `, { url: 'http://localhost' });

    global.window = dom.window;
    global.document = dom.window.document;

    // Minimal matchMedia
    global.window.matchMedia = global.window.matchMedia || function() {
      return { matches: false, addEventListener() {}, removeEventListener() {} };
    };

    // Stub localStorage
    const store = {};
    global.window.localStorage = {
      getItem: (k) => (k in store) ? store[k] : null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    };
    global.localStorage = global.window.localStorage;

    // Track calls to loadWorkspaceFolder
    let loadWorkspaceFolderCalled = false;
    global.window.api = {
      on() {},
      invoke: async () => null,
      reload: () => {},
      saveExternalMarkdown: () => {},
      loadWorkspaceFolder: () => { loadWorkspaceFolderCalled = true; },
      getNoteType: (ext) => ext === 'tex' ? 'latex' : 'markdown'
    };

    // Store reference to check later
    global.window.__loadWorkspaceFolderCalled = false;
    global.window.api.loadWorkspaceFolder = () => {
      global.window.__loadWorkspaceFolderCalled = true;
    };

    appModule = require('../../src/renderer/app.js');
    hooks = appModule.__test__ || {};
    assert(hooks, 'test hooks must be available');
  });

  afterEach(function() {
    try { if (global.window && typeof global.window.close === 'function') global.window.close(); } catch (e) {}
    delete global.window.api;
    delete global.window.localStorage;
    delete global.document;
    delete global.window;
    Object.keys(require.cache).forEach(k => {
      if (k.indexOf('/src/renderer/app.js') !== -1) delete require.cache[k];
    });
  });

  it('should open .tex files without triggering workspace reloading', function(done) {
    // Initialize the app
    if (typeof hooks.initialize === 'function') {
      hooks.initialize();
    }

    // Set up mock editor instance
    if (typeof window.editorInstances === 'undefined') {
      window.editorInstances = {};
    }
    window.editorInstances['left'] = { el: document.createElement('textarea') };

    // Mock requestAnimationFrame to execute immediately
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
      setTimeout(callback, 0);
    };

    // Create a mock .tex note
    const mockTexNote = {
      id: 'test-tex-note',
      path: '/test/file.tex',
      content: '\\documentclass{article}\n\\begin{document}\nHello LaTeX\n\\end{document}',
      type: 'latex'
    };

    // Add the note to state
    if (window.state && window.state.notes) {
      window.state.notes.set(mockTexNote.id, mockTexNote);
    }

    // Call openNoteInPane with the note ID
    if (typeof window.openNoteInPane === 'function') {
      window.openNoteInPane(mockTexNote.id);
    }

    // Wait for async operations to complete
    setTimeout(() => {
      try {
        // Restore requestAnimationFrame
        window.requestAnimationFrame = originalRAF;

        // Assert that loadWorkspaceFolder was NOT called
        assert(global.window.__loadWorkspaceFolderCalled === false, 'loadWorkspaceFolder should not have been called when opening a .tex file');

        done();
      } catch (error) {
        // Restore requestAnimationFrame
        window.requestAnimationFrame = originalRAF;
        done(error);
      }
    }, 200);
  });

  it('should open markdown files without triggering workspace reloading', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') {
      hooks.initialize();
    }

    // Create a mock markdown note
    const mockMdNote = {
      path: '/test/file.md',
      content: '# Hello Markdown',
      type: 'markdown'
    };

    // Call openNoteInPane with the markdown note
    if (typeof window.openNoteInPane === 'function') {
      window.openNoteInPane(mockMdNote);
    }

    // Assert that loadWorkspaceFolder was NOT called
    assert(global.window.__loadWorkspaceFolderCalled === false, 'loadWorkspaceFolder should not have been called when opening a markdown file');
  });
});
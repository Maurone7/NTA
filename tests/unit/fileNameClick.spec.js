/* eslint-disable no-undef */
const assert = require('assert');
const { JSDOM } = require('jsdom');

describe('File name click behaviors', function () {
  let window;
  let document;
  let app;

  beforeEach(function () {
    // create a minimal DOM similar to other tests
    const dom = new JSDOM(`
      <div id="file-name" tabindex="0">No file selected</div>
      <div id="file-path">Open a folder and select a file to get started.</div>
      <form id="rename-file-form" hidden></form>
      <input id="rename-file-input" />
    `, { url: 'http://localhost' });
    window = dom.window;
    document = window.document;

    // Provide minimal globals expected by the app module
    window._lastCopied = undefined;
    window.navigator.clipboard = window.navigator.clipboard || { writeText: async (s) => { window._lastCopied = s; } };
    // Ensure full shape for window.api so app event wiring works
    window.api = window.api || {
      on: () => {},
      removeListener: () => {},
      invoke: async (cmd, payload) => { window._lastCopied = payload; return { success: true }; }
    };

    // Expose globals so require() can find them
    // Provide minimal APIs and shims the app expects
    if (typeof window.matchMedia !== 'function') {
      window.matchMedia = (q) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
    }
    // Simple in-memory localStorage
    if (!window.localStorage || typeof window.localStorage.getItem !== 'function') {
      (function() {
        const store = Object.create(null);
        window.localStorage = {
          getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
          setItem: (k, v) => { store[k] = String(v); },
          removeItem: (k) => { delete store[k]; }
        };
      })();
    }

    // Provide expected window.api shape (on/removeListener/invoke)
    window.api = window.api || {
      on: () => {},
      removeListener: () => {},
      invoke: async (cmd, payload) => { window._lastCopied = payload; return { success: true }; }
    };

    window.marked = window.marked || { parse: (s) => s || '', Renderer: function(){ this.image = () => ''; }, use: () => {} };
    window.DOMPurify = window.DOMPurify || { sanitize: (s) => s };
    window.MutationObserver = window.MutationObserver || function() { this.observe = () => {}; this.disconnect = () => {}; };

  global.window = window;
  global.document = document;
  global.navigator = window.navigator;
  global.localStorage = window.localStorage;
  global.MutationObserver = window.MutationObserver;

    // Load the app module and run its initialize hook so event listeners attach
    app = require('../../src/renderer/app');
    const hooks = app.__test__;
    if (hooks && typeof hooks.initialize === 'function') hooks.initialize();
  });

  afterEach(function () {
    // Clean up module cache so subsequent tests load fresh
    delete require.cache[require.resolve('../../src/renderer/app')];
    delete global.window;
    delete global.document;
    delete global.navigator;
  });

  it('single click copies the absolute path (via api fallback)', async function () {
    // Arrange: set an active note with an absolutePath
    const note = { id: 'n1', absolutePath: '/tmp/some/path/note.md', title: 'note' };
    app.__test__?.state?.notes?.set(note.id, note);
    app.__test__?.state && (app.__test__.state.activeNoteId = note.id);

    const fileNameEl = document.getElementById('file-name');
    assert.ok(fileNameEl, 'file-name element exists');

    // Act: simulate click event
    const ev = new window.Event('click', { bubbles: true });
    fileNameEl.dispatchEvent(ev);

    // Wait a bit longer than the CLICK_DELAY used in the implementation
    await new Promise((r) => setTimeout(r, 400));

    // Assert
    assert.strictEqual(window._lastCopied, '/tmp/some/path/note.md');
  });

  it('double click opens rename form', async function () {
    // Arrange: set an active note
    const note = { id: 'n2', type: 'markdown', absolutePath: '/tmp/other/path/other.md', title: 'other' };
    app.__test__?.state?.notes?.set(note.id, note);
    if (app.__test__ && app.__test__.state) {
      app.__test__.state.activeNoteId = note.id;
      app.__test__.state.currentFolder = '/tmp/other/path';
    }

    const fileNameEl = document.getElementById('file-name');
    const renameForm = document.getElementById('rename-file-form');
    assert.ok(fileNameEl, 'file-name element exists');

    // Act: simulate dblclick
    const ev = new window.Event('dblclick', { bubbles: true });
    fileNameEl.dispatchEvent(ev);

    // Allow event handlers to run
    await new Promise((r) => setTimeout(r, 50));

    // Assert: rename form is visible and state.renamingNoteId is set
    assert.strictEqual(renameForm.hidden, false);
    assert.strictEqual(app.__test__.state.renamingNoteId, note.id);
  });
});

const assert = require('assert');

describe('Keybinding System', function() {
  let appModule;
  let hooks;

  beforeEach(function() {
    // Reset require cache and set up a minimal DOM environment
    delete require.cache[require.resolve('../../src/renderer/app.js')];

    // Create a jsdom window/document with keybinding elements
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(`
      <!doctype html>
      <html>
      <body>
        <div class="app-shell"></div>
        <div id="markdown-preview"></div>
        <textarea id="note-editor"></textarea>
        <div id="workspace-path" title="/tmp/workspace"></div>

        <!-- Settings modal structure -->
        <div id="settings-modal" class="modal">
          <div class="modal-content">
            <div class="settings-section">
              <h3>Keybindings</h3>
              <div id="keybindings-list"></div>
              <div class="keybinding-input-group">
                <input type="text" id="keybinding-keys-input" readonly placeholder="Press keys to set shortcut">
                <select id="keybinding-action-select">
                  <option value="">Select action...</option>
                  <option value="export-pdf">Export PDF</option>
                  <option value="export-html">Export HTML</option>
                  <option value="export-docx">Export DOCX</option>
                  <option value="export-epub">Export EPUB</option>
                  <option value="settings">Open Settings</option>
                  <option value="bold">Bold</option>
                  <option value="italic">Italic</option>
                  <option value="code">Code</option>
                  <option value="link">Link</option>
                </select>
                <button id="add-keybinding-btn">Add</button>
              </div>
              <button id="reset-keybindings-btn">Reset Keybindings</button>
            </div>
          </div>
        </div>

        <!-- Export elements -->
        <div class="export-dropdown" data-open="false">
          <button id="export-dropdown-button" aria-expanded="false">Export</button>
          <div id="export-dropdown-menu" class="export-dropdown__menu" role="menu">
            <button id="export-pdf-option" role="menuitem">PDF</button>
            <button id="export-html-option" role="menuitem">HTML</button>
            <button id="export-docx-option" role="menuitem">DOCX</button>
            <button id="export-epub-option" role="menuitem">EPUB</button>
          </div>
        </div>

        <!-- Settings button -->
        <button id="settings-button">Settings</button>
      </body>
      </html>
    `, { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;

    // Provide a basic matchMedia implementation
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

    // Mock getComputedStyle
    global.window.getComputedStyle = global.window.getComputedStyle || function(element) {
      return {
        getPropertyValue: function(prop) {
          return element.style[prop] || '';
        },
        setProperty: function(prop, value) {
          element.style[prop] = value;
        }
      };
    };
    global.getComputedStyle = global.window.getComputedStyle;

    // Stub localStorage
    const store = {};
    global.window.localStorage = {
      getItem: (k) => (k in store) ? store[k] : null,
      setItem: (k, v) => { store[k] = String(v); },
      setItem: (k, v) => { store[k] = String(v); },
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

    // Minimal api surface
    global.window.api = {
      on: function() {},
      invoke: async function() { return null; },
      checkForUpdates: async function() { return null; },
      exportPreviewPdf: async function() { return { success: true }; },
      exportPreviewHtml: async function() { return { success: true }; },
      exportPreviewDocx: async function() { return { success: true }; },
      exportPreviewEpub: async function() { return { success: true }; },
      resolveResource: async function(p) { return p; }
    };

    appModule = require('../../src/renderer/app.js');
    hooks = appModule.__test__ || {};
    assert(hooks, 'test hooks must be available');

    // Refresh elements object to pick up DOM elements created in test
    if (hooks.elements) {
      // Reassign the entire elements object to get fresh DOM references
      Object.assign(hooks.elements, {
        keybindingKeysInput: document.getElementById('keybinding-keys-input') || document.createElement('input'),
        keybindingActionSelect: document.getElementById('keybinding-action-select') || document.createElement('select'),
        addKeybindingBtn: document.getElementById('add-keybinding-btn') || document.createElement('button'),
        resetKeybindingsBtn: document.getElementById('reset-keybindings-btn') || document.createElement('button'),
        keybindingsList: document.getElementById('keybindings-list') || document.createElement('div'),
        exportPdfOption: document.getElementById('export-pdf-option') || document.createElement('button'),
        exportHtmlOption: document.getElementById('export-html-option') || document.createElement('button'),
        exportDocxOption: document.getElementById('export-docx-option') || document.createElement('button'),
        exportEpubOption: document.getElementById('export-epub-option') || document.createElement('button'),
        preview: document.createElement('div'),
        editor: document.createElement('textarea')
      });
    }

    // Set up a default note
    if (hooks && hooks.state) {
      hooks.state.notes = new Map();
      hooks.state.activeNoteId = 'note-markdown-1';
      hooks.state.notes.set('note-markdown-1', {
        id: 'note-markdown-1',
        title: 'Test Note',
        type: 'markdown'
      });
    }
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

  it('should capture and display key sequences in input field', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');
    assert(keyInput, 'Keybinding input should exist');

    // Simulate key combination: Ctrl+Shift+P
    const event = new window.KeyboardEvent('keydown', {
      key: 'P',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true
    });

    // Dispatch the event to the key input (simulating focus on input)
    keyInput.dispatchEvent(event);

    // The input should display the key combination
    assert.equal(keyInput.value, 'Ctrl+Shift+P', 'Input should display Ctrl+Shift+P');
  });

  it('should capture modifier combinations correctly', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');

    // Test Cmd+Alt+L (Mac) / Ctrl+Alt+L (Windows/Linux)
    const event = new window.KeyboardEvent('keydown', {
      key: 'L',
      altKey: true,
      metaKey: true, // Cmd on Mac
      bubbles: true,
      cancelable: true
    });

    keyInput.dispatchEvent(event);
    assert.equal(keyInput.value, 'Cmd+Alt+L', 'Input should display Cmd+Alt+L');
  });

  it('should add custom keybinding when Add button is clicked', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');
    const actionSelect = document.getElementById('keybinding-action-select');
    const addButton = document.getElementById('add-keybinding-btn');
    const keybindingsList = document.getElementById('keybindings-list');

    // Set up a key combination
    const keyEvent = new window.KeyboardEvent('keydown', {
      key: 'B',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(keyEvent);

    // Select an action
    actionSelect.value = 'bold';

    // Click Add button
    addButton.click();

    // Check that keybinding was added to the list
    const listItems = keybindingsList.querySelectorAll('.keybinding-item');
    assert.equal(listItems.length, 1, 'Should have one keybinding in the list');

    const text = listItems[0].textContent;
    assert(text.includes('Ctrl+B'), 'Keybinding should show Ctrl+B');
    assert(text.includes('bold'), 'Keybinding should show bold action');

    // Check that input was cleared
    assert.equal(keyInput.value, '', 'Input should be cleared after adding');
    assert.equal(actionSelect.value, '', 'Action select should be reset');
  });

  it('should execute custom keybinding when pressed', function(done) {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize export handlers
    if (typeof hooks.initializeExportHandlers === 'function') {
      hooks.initializeExportHandlers();
    }

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');
    const actionSelect = document.getElementById('keybinding-action-select');
    const addButton = document.getElementById('add-keybinding-btn');

    // Add a custom keybinding for export-pdf
    const keyEvent = new window.KeyboardEvent('keydown', {
      key: 'X',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(keyEvent);
    actionSelect.value = 'export-pdf';
    addButton.click();

    // Mock the export function to track if it's called
    let exportPdfCalled = false;
    global.window.api.exportPreviewPdf = async function() {
      exportPdfCalled = true;
      return { success: true };
    };

    // Now simulate the same key combination by calling handleKeybinding directly
    const executeEvent = new window.KeyboardEvent('keydown', {
      key: 'X',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true
    });
    if (typeof hooks.handleKeybinding === 'function') {
      hooks.handleKeybinding(executeEvent);
    }

    // Wait for async operations
    setTimeout(() => {
      try {
        assert(exportPdfCalled, 'Custom keybinding should trigger export-pdf action');
        done();
      } catch (e) {
        done(e);
      }
    }, 100);
  });

  it('should execute export-docx keybinding when pressed', function(done) {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize export handlers
    if (typeof hooks.initializeExportHandlers === 'function') {
      hooks.initializeExportHandlers();
    }

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');
    const actionSelect = document.getElementById('keybinding-action-select');
    const addButton = document.getElementById('add-keybinding-btn');

    // Add a custom keybinding for export-docx
    const keyEvent = new window.KeyboardEvent('keydown', {
      key: 'D',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(keyEvent);
    actionSelect.value = 'export-docx';
    addButton.click();

    // Mock the export function to track if it's called
    let exportDocxCalled = false;
    global.window.api.exportPreviewDocx = async function() {
      exportDocxCalled = true;
      return { success: true };
    };

    // Now simulate the same key combination by calling handleKeybinding directly
    const executeEvent = new window.KeyboardEvent('keydown', {
      key: 'D',
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true
    });
    if (typeof hooks.handleKeybinding === 'function') {
      hooks.handleKeybinding(executeEvent);
    }

    // Wait for async operations
    setTimeout(() => {
      try {
        assert(exportDocxCalled, 'Custom keybinding should trigger export-docx action');
        done();
      } catch (e) {
        done(e);
      }
    }, 100);
  });

  it('should remove keybinding when remove button is clicked', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');
    const actionSelect = document.getElementById('keybinding-action-select');
    const addButton = document.getElementById('add-keybinding-btn');
    const keybindingsList = document.getElementById('keybindings-list');

    // Add a keybinding
    const keyEvent = new window.KeyboardEvent('keydown', {
      key: 'Y',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(keyEvent);
    actionSelect.value = 'italic';
    addButton.click();

    // Verify it was added
    let listItems = keybindingsList.querySelectorAll('.keybinding-item');
    assert.equal(listItems.length, 1, 'Should have one keybinding');

    // Click the remove button
    const removeButton = listItems[0].querySelector('button');
    assert(removeButton, 'Remove button should exist');
    removeButton.click();

    // Verify it was removed
    listItems = keybindingsList.querySelectorAll('.keybinding-item');
    assert.equal(listItems.length, 0, 'Keybinding should be removed');
  });

  it('should persist keybindings to localStorage', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');
    const actionSelect = document.getElementById('keybinding-action-select');
    const addButton = document.getElementById('add-keybinding-btn');

    // Add a keybinding
    const keyEvent = new window.KeyboardEvent('keydown', {
      key: 'Z',
      ctrlKey: true,
      altKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(keyEvent);
    actionSelect.value = 'code';
    addButton.click();

    // Check that it was saved to localStorage
    const saved = localStorage.getItem('NTA.keybindings');
    assert(saved, 'Keybindings should be saved to localStorage');

    const parsed = JSON.parse(saved);
    assert(Array.isArray(parsed), 'Saved keybindings should be an array');
    assert.equal(parsed.length, 1, 'Should have one saved keybinding');
    assert.equal(parsed[0].keys, 'Ctrl+Alt+Z', 'Should save correct key combination');
    assert.equal(parsed[0].action, 'code', 'Should save correct action');
  });

  it('should load keybindings from localStorage on initialization', function() {
    // Pre-populate localStorage with a keybinding
    const testKeybinding = [{ keys: 'Ctrl+Shift+T', action: 'settings' }];
    localStorage.setItem('NTA.keybindings', JSON.stringify(testKeybinding));

    // Initialize the app (this should load the keybindings)
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keybindingsList = document.getElementById('keybindings-list');
    const listItems = keybindingsList.querySelectorAll('.keybinding-item');

    assert.equal(listItems.length, 1, 'Should load one keybinding from localStorage');
    const text = listItems[0].textContent;
    assert(text.includes('Ctrl+Shift+T'), 'Should display loaded key combination');
    assert(text.includes('settings'), 'Should display loaded action');
  });

  it('should reset keybindings when reset button is clicked', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');
    const actionSelect = document.getElementById('keybinding-action-select');
    const addButton = document.getElementById('add-keybinding-btn');
    const resetButton = document.getElementById('reset-keybindings-btn');
    const keybindingsList = document.getElementById('keybindings-list');

    // Add a couple of keybindings
    const keyEvent1 = new window.KeyboardEvent('keydown', {
      key: 'A',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(keyEvent1);
    actionSelect.value = 'bold';
    addButton.click();

    const keyEvent2 = new window.KeyboardEvent('keydown', {
      key: 'B',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(keyEvent2);
    actionSelect.value = 'italic';
    addButton.click();

    // Verify they were added
    let listItems = keybindingsList.querySelectorAll('.keybinding-item');
    assert.equal(listItems.length, 2, 'Should have two keybindings');

    // Click reset button
    resetButton.click();

    // Verify they were removed
    listItems = keybindingsList.querySelectorAll('.keybinding-item');
    assert.equal(listItems.length, 0, 'Keybindings should be reset');

    // Verify localStorage was cleared
    const saved = localStorage.getItem('NTA.keybindings');
    assert.equal(saved, null, 'Keybindings should be cleared from localStorage');
  });

  it('should prevent duplicate keybindings', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');
    const actionSelect = document.getElementById('keybinding-action-select');
    const addButton = document.getElementById('add-keybinding-btn');
    const keybindingsList = document.getElementById('keybindings-list');

    // Add first keybinding
    const keyEvent = new window.KeyboardEvent('keydown', {
      key: 'D',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(keyEvent);
    actionSelect.value = 'bold';
    addButton.click();

    // Try to add the same keybinding again
    keyInput.dispatchEvent(keyEvent); // Same key combination
    actionSelect.value = 'italic'; // Different action
    addButton.click();

    // Should still only have one keybinding (the first one)
    const listItems = keybindingsList.querySelectorAll('.keybinding-item');
    assert.equal(listItems.length, 1, 'Should not allow duplicate key combinations');
    const text = listItems[0].textContent;
    assert(text.includes('bold'), 'Should keep the first action (bold)');
  });

  it('should handle single modifier keys correctly', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');

    // Test single Ctrl key
    const ctrlEvent = new window.KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(ctrlEvent);

    // Should not capture single modifier keys
    assert.equal(keyInput.value, '', 'Should not capture single modifier keys');
  });

  it('should handle function keys correctly', function() {
    // Initialize the app
    if (typeof hooks.initialize === 'function') hooks.initialize();

    // Initialize keybinding input
    if (typeof hooks.initializeKeybindingInput === 'function') {
      hooks.initializeKeybindingInput();
    }

    const keyInput = document.getElementById('keybinding-keys-input');

    // Test F1 key with modifiers
    const f1Event = new window.KeyboardEvent('keydown', {
      key: 'F1',
      ctrlKey: true,
      bubbles: true,
      cancelable: true
    });
    keyInput.dispatchEvent(f1Event);

    assert.equal(keyInput.value, 'Ctrl+F1', 'Should capture function keys with modifiers');
  });
});
const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: workspace tree single and double click behavior', function() {
  let window;
  let document;
  let appModule;
  let hooks;

  beforeEach(function() {
    // Minimal console stubs
    global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

    const html = `<html><body>
      <div class="app-shell">
        <div class="workspace__content">
          <section class="editor-pane editor-pane--left" data-pane-id="left">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-left" role="tablist"></div>
              <button id="new-tab-button-left" class="tab-bar__new-tab" title="New Tab">+</button>
            </div>
            <textarea id="note-editor"></textarea>
          </section>
          <div id="workspace-splitter" class="workspace__splitter"></div>
        </div>
        <div id="workspace-tree"></div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost', console: true });
    window = dom.window;
    document = window.document;

    global.window = window;
    global.document = document;

    global.window.api = {
      on: () => {},
      removeListener: () => {},
      resolveResource: () => Promise.resolve({ value: null }),
      invoke: () => Promise.resolve(null)
    };

    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      });
    }

    global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    global.localStorage = global.window.localStorage;

    // Load and initialize the app module
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    try { delete require.cache[require.resolve(appPath)]; } catch (e) {}
    appModule = require(appPath);
    hooks = appModule.__test__ || {};

    if (typeof hooks.initialize === 'function') {
      try { hooks.initialize(); } catch (e) {}
    }
  });

  afterEach(function() {
    try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
    delete global.window;
    delete global.document;
    delete global.localStorage;
    delete global.console;
  });

  function createTestFileNode(tree, noteId, filePath) {
    const node = document.createElement('div');
    node.className = 'tree-node tree-node--file';
    node.dataset.nodeType = 'file';
    node.dataset.noteId = noteId;
    node.dataset.path = filePath;

    const label = document.createElement('div');
    label.className = 'tree-node__label';

    const name = document.createElement('div');
    name.className = 'tree-node__name';
    name.textContent = path.basename(filePath);

    label.appendChild(name);
    node.appendChild(label);
    tree.appendChild(node);

    return node;
  }

  function simulateClick(element, clickType = 'click') {
    const event = new window.Event('click', { bubbles: true, cancelable: true });
    if (clickType === 'double') {
      event.detail = 2;
    } else {
      event.detail = 1;
    }
    element.dispatchEvent(event);
  }

  it('single click opens file in current active pane', function(done) {
    const state = hooks.getState ? hooks.getState() : (appModule.__test__ && appModule.__test__.state) || {};

    // Set up initial active pane
    state.activeEditorPane = 'left';

    // Add a test note to the notes map
    const testNote = { id: 'test-note-1', title: 'Test File', type: 'markdown', content: 'test content' };
    if (state.notes && typeof state.notes.set === 'function') {
      state.notes.set(testNote.id, testNote);
    }

    // Create workspace tree with a file node
    const tree = document.getElementById('workspace-tree');
    const fileNode = createTestFileNode(tree, 'test-note-1', '/test/file.md');

    // Simulate single click on the file
    const label = fileNode.querySelector('.tree-node__label');
    simulateClick(label, 'click');

    // Wait for event processing
    setTimeout(() => {
      try {
        // Verify the file was opened in the active pane
        const activePaneData = state.editorPanes && state.editorPanes[state.activeEditorPane];
        assert(activePaneData, 'Active pane should have data');
        assert.strictEqual(activePaneData.noteId, 'test-note-1', 'File should be opened in active pane');
        done();
      } catch (e) {
        done(e);
      }
    }, 50);
  });

  it('double click opens file in current active pane', function(done) {
    const state = hooks.getState ? hooks.getState() : (appModule.__test__ && appModule.__test__.state) || {};

    // Set up initial active pane
    state.activeEditorPane = 'left';

    // Add a test note to the notes map
    const testNote = { id: 'test-note-2', title: 'Test File 2', type: 'markdown', content: 'test content 2' };
    if (state.notes && typeof state.notes.set === 'function') {
      state.notes.set(testNote.id, testNote);
    }

    // Create workspace tree with a file node
    const tree = document.getElementById('workspace-tree');
    const fileNode = createTestFileNode(tree, 'test-note-2', '/test/file2.md');

    // Simulate double click on the file
    const label = fileNode.querySelector('.tree-node__label');
    simulateClick(label, 'double');

    // Wait for event processing
    setTimeout(() => {
      try {
        // Verify the file was opened in the active pane
        const activePaneData = state.editorPanes && state.editorPanes[state.activeEditorPane];
        assert(activePaneData, 'Active pane should have data');
        assert.strictEqual(activePaneData.noteId, 'test-note-2', 'File should be opened in active pane');
        done();
      } catch (e) {
        done(e);
      }
    }, 50);
  });

  it('clicking file when no active pane exists creates one and opens file', function(done) {
    const state = hooks.getState ? hooks.getState() : (appModule.__test__ && appModule.__test__.state) || {};

    // Clear active pane
    state.activeEditorPane = null;

    // Add a test note to the notes map
    const testNote = { id: 'test-note-3', title: 'Test File 3', type: 'markdown', content: 'test content 3' };
    if (state.notes && typeof state.notes.set === 'function') {
      state.notes.set(testNote.id, testNote);
    }

    // Create workspace tree with a file node
    const tree = document.getElementById('workspace-tree');
    const fileNode = createTestFileNode(tree, 'test-note-3', '/test/file3.md');

    // Simulate click on the file
    const label = fileNode.querySelector('.tree-node__label');
    simulateClick(label, 'click');

    // Wait for event processing
    setTimeout(() => {
      try {
        // Verify an active pane was created and file was opened
        assert(state.activeEditorPane, 'An active pane should be created');
        const activePaneData = state.editorPanes && state.editorPanes[state.activeEditorPane];
        assert(activePaneData, 'Active pane should have data');
        assert.strictEqual(activePaneData.noteId, 'test-note-3', 'File should be opened in the created active pane');
        done();
      } catch (e) {
        done(e);
      }
    }, 50);
  });
});
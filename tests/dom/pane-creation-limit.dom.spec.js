const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: createEditorPane limit', function() {
  let appModule;

  beforeEach(function() {
    // Silence console while creating JSDOM
    global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

    // Build a minimal workspace DOM so renderer can attach panes
    const html = `<html><body>
      <div class="workspace__content" style="width:800px; display:flex;">
        <section class="editor-pane editor-pane--left" data-pane-id="left"></section>
        <section class="editor-pane editor-pane--right" data-pane-id="right"></section>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const win = dom.window;
    global.window = win;
    global.document = win.document;

    // Minimal stubs expected by src/renderer/app.js
    global.window.api = { on: () => {}, invoke: async () => null, removeListener: () => {} };
    if (!global.window.localStorage) global.window.localStorage = { getItem: () => null, setItem: () => {} };
    global.localStorage = global.window.localStorage;
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = (query) => ({ matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
    }

    // Fresh-require so module binds to the JSDOM in test runner
    const modulePath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    try { delete require.cache[require.resolve(modulePath)]; } catch (e) {}
    appModule = require(modulePath);
  });

  afterEach(function() {
    // Cleanup globals left by the renderer module
    try { global.window.close(); } catch (e) {}
    try { delete global.window; } catch (e) {}
    try { delete global.document; } catch (e) {}
    try { delete global.localStorage; } catch (e) {}
    try { delete require.cache[require.resolve('../../src/renderer/app.js')]; } catch (e) {}
  });

  it('allows up to the configured dynamic pane limit and rejects the next', function() {
    const createEditorPane = appModule.__test__.createEditorPane;
    assert.ok(typeof createEditorPane === 'function');

    const ids = [];
    for (let i = 0; i < 6; i++) {
      const id = createEditorPane(null, `test-${i}`);
      ids.push(id);
    }

    // The implementation limits to 5 dynamic panes; so first 5 should be non-null
    const created = ids.filter(x => x !== null);
    assert.strictEqual(created.length, 5, `Expected 5 created panes, got ${created.length}`);

    // The 6th attempt should be null
    assert.strictEqual(ids[5], null, 'Expected 6th createEditorPane to return null when the limit is reached');
  });

  it('handles creating many panes beyond the limit gracefully', function() {
    const createEditorPane = appModule.__test__.createEditorPane;
    assert.ok(typeof createEditorPane === 'function');

    // Try to create 100 panes - should only succeed for the first 5
    const ids = [];
    for (let i = 0; i < 100; i++) {
      const id = createEditorPane(null, `edge-test-${i}`);
      ids.push(id);
    }

    const created = ids.filter(x => x !== null);
    assert.strictEqual(created.length, 5, `Expected only 5 panes created, got ${created.length}`);

    // All remaining should be null
    const nulls = ids.slice(5);
    assert.strictEqual(nulls.length, 95, 'Expected 95 null results');
    assert(nulls.every(x => x === null), 'All results beyond limit should be null');
  });

  it('handles invalid parameters gracefully', function() {
    const createEditorPane = appModule.__test__.createEditorPane;
    assert.ok(typeof createEditorPane === 'function');

    // Test with undefined paneId
    const id1 = createEditorPane(undefined, 'test-undefined');
    assert.ok(id1, 'Should handle undefined paneId');

    // Test with null paneId
    const id2 = createEditorPane(null, 'test-null');
    assert.ok(id2, 'Should handle null paneId');

    // Test with empty string title
    const id3 = createEditorPane(null, '');
    assert.ok(id3, 'Should handle empty title');

    // Test with very long title
    const longTitle = 'a'.repeat(1000);
    const id4 = createEditorPane(null, longTitle);
    assert.ok(id4, 'Should handle very long title');
  });

  it('handles duplicate titles gracefully', function() {
    const createEditorPane = appModule.__test__.createEditorPane;
    assert.ok(typeof createEditorPane === 'function');

    // Create multiple panes with the same title
    const ids = [];
    for (let i = 0; i < 3; i++) {
      const id = createEditorPane(null, 'duplicate-title');
      ids.push(id);
    }

    // Should still create them (implementation should handle duplicates)
    const created = ids.filter(x => x !== null);
    assert.strictEqual(created.length, 3, 'Should create panes even with duplicate titles');
  });

  it('continues to reject after limit is reached even with different parameters', function() {
    const createEditorPane = appModule.__test__.createEditorPane;
    assert.ok(typeof createEditorPane === 'function');

    // First fill up to the limit
    for (let i = 0; i < 5; i++) {
      createEditorPane(null, `fill-${i}`);
    }

    // Now try different variations that should all fail
    const id1 = createEditorPane('right', 'different-pane-id');
    assert.strictEqual(id1, null, 'Should reject even with different paneId');

    const id2 = createEditorPane(null, 'different-title');
    assert.strictEqual(id2, null, 'Should reject even with different title');

    const id3 = createEditorPane('left', '');
    assert.strictEqual(id3, null, 'Should reject even with different paneId and empty title');
  });
});

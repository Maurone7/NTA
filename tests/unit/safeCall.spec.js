const assert = require('assert');
const path = require('path');
const { JSDOM } = require('jsdom');

function makeWindow() {
  const domHtml = `<!doctype html><html><body>
    <div class="app-shell"></div>
    <section class="editor-pane editor-pane--left" data-pane-id="left">
      <textarea id="note-editor-left"></textarea>
    </section>
    <section class="editor-pane editor-pane--right" data-pane-id="right">
      <textarea id="note-editor-right"></textarea>
    </section>
    <div class="workspace__content"></div>
  </body></html>`;
  const dom = new JSDOM(domHtml, { runScripts: 'outside-only', url: 'http://localhost' });
  const w = dom.window;
  // minimal stubs expected by app.js
  w.api = { on: () => {}, invoke: async () => null, removeListener: () => {}, writeDebugLog: () => {} };
  w.matchMedia = (q) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  w.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  w.DOMPurify = { sanitize: (s) => s };
  w.MutationObserver = function() { this.observe = () => {}; this.disconnect = () => {}; };
  w.marked = { parse: (s) => s || '', Renderer: function() { this.image = () => ''; }, use: function() { } };
  return w;
}

describe('safeCall helper', function() {
  it('returns the result of a function when provided', function() {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const sc = app.__test__ && app.__test__.safeCall;
    assert.equal(typeof sc, 'function');

    const res = sc((a, b) => a + b, 2, 3);
    assert.strictEqual(res, 5);
    try { window.close(); } catch (e) {}
    delete global.window; delete global.document; delete global.localStorage; delete global.MutationObserver;
  });

  it('silently returns undefined for non-function inputs', function() {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const sc = app.__test__ && app.__test__.safeCall;
    assert.equal(typeof sc, 'function');

    const res = sc(null, 1, 2);
    assert.strictEqual(res, undefined);
    try { window.close(); } catch (e) {}
    delete global.window; delete global.document; delete global.localStorage; delete global.MutationObserver;
  });

  it('swallows errors thrown by the function and returns undefined', function() {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const sc = app.__test__ && app.__test__.safeCall;
    assert.equal(typeof sc, 'function');

    function bad() { throw new Error('boom'); }
    const res = sc(bad);
    assert.strictEqual(res, undefined);
    try { window.close(); } catch (e) {}
    delete global.window; delete global.document; delete global.localStorage; delete global.MutationObserver;
  });
});

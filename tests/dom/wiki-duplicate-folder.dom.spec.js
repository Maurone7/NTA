const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  // Minimal DOM expected by renderer tests
  const domHtml = `<!doctype html><html><body>
    <div id="workspace-content">
      <div id="markdown-preview"></div>
      <textarea id="note-editor"></textarea>
      <div id="wikilink-suggestions" class="wiki-suggest" role="listbox" aria-label="Wiki link suggestions" hidden></div>
    </div>
  </body></html>`;

  const dom = new JSDOM(domHtml, { runScripts: 'outside-only', url: 'http://localhost' });
  const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
  // Minimal APIs used by the renderer
  w.api = w.api || { on: () => {}, removeListener: () => {}, resolveResource: async () => ({ value: '' }) };
  w.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  if (!w.DOMPurify) w.DOMPurify = { sanitize: (s) => s };
  if (typeof w.MutationObserver === 'undefined') {
    w.MutationObserver = function() { this.observe = () => {}; this.disconnect = () => {}; };
  }
  if (typeof w.matchMedia !== 'function') {
    w.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
  }
  return w;
}

describe('DOM: wiki duplicate folder suggestions', function() {
  this.timeout(5000);

  it('should show only one examples/ folder suggestion when multiple folders share the same name', function(done) {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    // Load the renderer module the same way other DOM tests do
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks && typeof hooks.configureMarked === 'function') hooks.configureMarked();
    if (hooks && typeof hooks.initialize === 'function') hooks.initialize();
    hooks.elements.preview = document.getElementById('markdown-preview');

    // Seed state: currentFolder is documentation
    hooks.state.currentFolder = path.join(process.cwd(), 'documentation');

    const examples1 = path.join(hooks.state.currentFolder, 'examples');
    const examples2 = path.join(process.cwd(), 'src', 'renderer', 'examples');

    // Seed notes inside each examples folder
    hooks.state.notes.set('n1', { id: 'n1', title: 'Example One', absolutePath: path.join(examples1, 'one.md'), type: 'markdown' });
    hooks.state.notes.set('n2', { id: 'n2', title: 'Example Two', absolutePath: path.join(examples2, 'two.md'), type: 'markdown' });

    // Build a minimal tree containing both directories
    hooks.state.tree = {
      type: 'directory',
      path: hooks.state.currentFolder,
      children: [
        { type: 'directory', path: examples1, children: [] },
        { type: 'directory', path: examples2, children: [] }
      ]
    };

  // Ensure index rebuild
  if (hooks && typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

  // Request suggestions for empty query using the test hooks
  const items = (hooks && typeof hooks.collectWikiSuggestionItems === 'function') ? hooks.collectWikiSuggestionItems('') : [];
    const folders = items.filter(i => i.kind === 'folder').map(f => (f.display || f.target || '').toString().replace(/^\/+|\/+$/g, ''));
    const matches = folders.filter(f => f.split('/').pop().toLowerCase() === 'examples');
    try {
      assert.strictEqual(matches.length, 1, `expected one examples/ suggestion, got ${matches.length}: ${JSON.stringify(folders)}`);
      done();
    } catch (err) {
      done(err);
    } finally {
      try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
      try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
    }
  });
});

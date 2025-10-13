const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  const domHtml = `<!doctype html><html><body>
    <textarea id="note-editor"></textarea>
    <div id="markdown-preview"></div>
    <div id="math-preview-popup" hidden><div class="math-preview-popup__content"></div></div>
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
  w.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {} };
  if (typeof w.matchMedia !== 'function') {
    w.matchMedia = (q) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  }
  // Simple in-memory localStorage for tests
  if (!w.localStorage || typeof w.localStorage.getItem !== 'function') {
    (function() {
      const store = Object.create(null);
      w.localStorage = {
        getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: (k) => { delete store[k]; }
      };
    })();
  }
  w.DOMPurify = w.DOMPurify || { sanitize: (s) => s };
  w.MutationObserver = w.MutationObserver || function() { this.observe = () => {}; this.disconnect = () => {}; };
  return w;
}

describe('DOM: wiki inline peek (!![[) behavior', function() {
  it('shows inlined referenced content in preview for !![[ selection', function() {
    const window = makeWindow();
  // Install globals before requiring the app so initialize() sees them
  global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
  // Ensure navigator global exists for any handlers that reference it
  global.navigator = window.navigator = window.navigator || { clipboard: { writeText: async () => {} } };
  // Ensure clipboard and other runtime bits exist for popup positioning
  window.navigator = window.navigator || {};
  window.navigator.clipboard = window.navigator.clipboard || { writeText: async () => {} };
  const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
  global.window.marked = require('marked');
  const hooks = app.__test__;
  if (typeof hooks.initialize === 'function') hooks.initialize();
  if (hooks.configureMarked) hooks.configureMarked();
  hooks.elements.preview = document.getElementById('markdown-preview');

    try {
      // Create a referenced markdown note containing an equation-like fragment
      const ref = { id: 'ref1', type: 'markdown', title: 'Ref', content: '$$E = mc^2$$' };
      hooks.state.notes.set(ref.id, ref);

      // Simulate a suggestion item that points to that note by updating the
      // existing wikiSuggest object rather than replacing it (preserve refs)
      Object.assign(hooks.state.wikiSuggest, {
        open: true,
        items: [ { kind: 'note', noteId: ref.id, target: ref.title, display: ref.title } ],
        selectedIndex: 0,
        start: 0,
        end: 0,
        query: '',
        embed: 'inline',
        suppress: false
      });

  // Simulate active textarea and set selection positions
  const ta = document.getElementById('note-editor');
  ta.value = '!![[';
  ta.selectionStart = ta.selectionEnd = 4;
  ta.focus();
  document.activeElement = ta;
  // Ensure an editor instance is available and active
  hooks.state.editorPanes = { left: { noteId: null } };
  hooks.state.activeEditorPane = 'left';

      // Ensure math preview popup elements exist
      const preview = document.getElementById('markdown-preview');
      const popup = document.getElementById('math-preview-popup');

      // Call applyWikiSuggestion via exported helper
  const applied = hooks.applyWikiSuggestion ? hooks.applyWikiSuggestion(0) : false;
      assert.strictEqual(applied, true, 'applyWikiSuggestion should return true for inline peek');

      // Popup should be visible and preview should include rendered content
      // assert.ok(!popup.hidden && popup.classList.contains('visible'), 'Preview popup should be shown');
      // The referenced note's rendered HTML should appear in the main preview as inline-embedded span
      const previewHtml = preview.innerHTML || '';
      assert.ok(previewHtml.includes('wikilink-inline-embedded') || popup.innerHTML.length > 0, 'Referenced content should be rendered inline or in the popup');
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage; delete global.MutationObserver;
    }
  });
});

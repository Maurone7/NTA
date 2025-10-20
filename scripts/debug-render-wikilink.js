const path = require('path');
const { JSDOM } = require('jsdom');

(async () => {
    let dom;
    try {
      dom = new JSDOM(`<!doctype html><html><body><div id="markdown-preview"></div></body></html>`);
    } catch (e) {
      console.error('Failed to create JSDOM:', e);
      process.exit(1);
    }
    global.window = dom.window;
    global.document = dom.window.document;
    // Minimal globals used by app.js
    try { global.localStorage = dom.window.localStorage; } catch (e) { global.localStorage = { getItem: () => null, setItem: () => {} }; }
    try { global.MutationObserver = dom.window.MutationObserver; } catch (e) { global.MutationObserver = function() {}; }
    try { global.navigator = dom.window.navigator; } catch (e) { global.navigator = {}; }
    // Provide a minimal window.api stub expected by renderer (Electron preload)
    try {
      global.window.api = global.window.api || {};
      if (typeof global.window.api.on !== 'function') global.window.api.on = () => {};
      if (typeof global.window.api.invoke !== 'function') global.window.api.invoke = async () => null;
    } catch (e) {}
    // Stub matchMedia used by the renderer
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = function () {
        return { matches: false, addEventListener: () => {}, removeEventListener: () => {} };
      };
    }

  // Provide marked and DOMPurify
  global.window.marked = require('marked');
  const createDOMPurify = require('dompurify');
  global.window.DOMPurify = createDOMPurify(dom.window);

  // Load app module
  const app = require(path.join(__dirname, '..', 'src', 'renderer', 'app.js'));
  const hooks = app.__test__ || app;
  if (typeof hooks.configureMarked === 'function') hooks.configureMarked();
  if (typeof hooks.initialize === 'function') hooks.initialize();

  hooks.elements = hooks.elements || {};
  hooks.elements.preview = document.getElementById('markdown-preview');

  const markdown = `This is a link: [[Research Notes]]\nInline: !![[Research Notes]]\nEmbed: ![[Research Notes]]`;
  const html = hooks.renderMarkdownPreview ? hooks.renderMarkdownPreview(markdown, null) : null;

  setTimeout(() => {
    try {
      const previewHtml = hooks.elements.preview.innerHTML || '';
      console.log('PREVIEW HTML:\n', previewHtml);
    } catch (e) {
      console.error('ERROR', e);
    } finally {
      process.exit(0);
    }
  }, 200);
})();

const path = require('path');
const { JSDOM } = require('jsdom');
const html = '<!doctype html><html><body><div id="markdown-preview"></div></body></html>';
const d1 = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
const d2 = new JSDOM(d1.serialize(), { runScripts: 'outside-only', url: 'http://localhost' });
global.window = d2.window;
global.document = d2.window.document;
global.localStorage = d2.window.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.console = { debug: () => {}, log: (...a) => process.stdout.write(String(a.join(' ')) + '\n'), warn: () => {}, error: (...a) => process.stderr.write(String(a.join(' ')) + '\n') };
// minimal stubs
global.window.api = { on: () => {}, removeListener: () => {}, invoke: async () => null };
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (q) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
}
if (typeof window.MutationObserver === 'undefined') {
  window.MutationObserver = function() { this.observe = () => {}; this.disconnect = () => {}; };
}

const app = require(path.resolve(__dirname, 'src', 'renderer', 'app.js'));
const hooks = app.__test__;
console.log('hooks?', !!hooks);
if (hooks && hooks.rebuildWikiIndex) {
  if (hooks.initialize) {
    try { hooks.initialize(); } catch (e) { console.error('init err', e && e.message); }
  }
  // Seed notes (mirror scripts/check-wikilink.js)
  hooks.state.notes.set('a', { id: 'a', type: 'markdown', title: 'Folder/Source', absolutePath: '/workspace/folder/source.md', content: 'See [[Target Note]]' });
  hooks.state.notes.set('b', { id: 'b', type: 'markdown', title: 'Target Note', absolutePath: '/workspace/target.md', content: '# target' });
  hooks.state.currentFolder = '/workspace';
  hooks.rebuildWikiIndex();
  console.log('WIKIIDX', Array.from(hooks.state.wikiIndex.entries()));
} else {
  console.log('no hooks.rebuildWikiIndex');
}

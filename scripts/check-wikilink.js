// Lightweight check script: seeds two notes and uses renderer test hooks
// to render a markdown preview and report whether a wikilink resolved.
const path = require('path');
const { JSDOM } = require('jsdom');

(async function main() {
  // Debug: write step logs to a file for environments where stdout may be suppressed
  const fs = require('fs');
  const outPath = '/tmp/check-wikilink.out';
  const writeLog = (msg) => {
    try { fs.appendFileSync(outPath, String(msg) + '\n'); } catch (e) { /* ignore */ }
  };
  writeLog('check-wikilink: starting');
  process.on('uncaughtException', (err) => { writeLog('uncaughtException: ' + String(err) + '\n' + (err && err.stack ? err.stack : '')); process.exit(1); });
  process.on('unhandledRejection', (r) => { writeLog('unhandledRejection: ' + String(r)); process.exit(1); });
  const html = '<!doctype html><html><body><div id="markdown-preview"></div></body></html>';
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
  const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
  global.window = w; global.document = w.document;
  global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };
  w.api = { on: () => {}, removeListener: () => {}, resolveResource: async () => ({ value: '' }), readPdfBinary: async () => null };
  if (typeof w.matchMedia !== 'function') {
    w.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    });
  }
  if (!w.DOMPurify) w.DOMPurify = { sanitize: (s) => s };
  if (typeof w.MutationObserver === 'undefined') { w.MutationObserver = function() { this.observe = () => {}; this.disconnect = () => {}; }; global.MutationObserver = w.MutationObserver; }
  global.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
  // Provide marked to the global window so the renderer registers extensions
  try {
    // eslint-disable-next-line global-require
    w.marked = require('marked');
  } catch (e) {
    // If marked isn't available, leave it undefined; renderer will fall back
  }

  try {
    writeLog('about to require renderer');
    const app = require(path.join(__dirname, '..', 'src', 'renderer', 'app.js'));
    writeLog('required renderer ok');
    const hooks = app.__test__;
    writeLog('hooks present? ' + !!hooks);
    if (!hooks) {
      writeLog('No test hooks exported from renderer.');
      process.exit(2);
    }

    // Call initialize if available so marked extensions and event wiring are set up
    if (typeof hooks.initialize === 'function') {
      try { writeLog('calling hooks.initialize()'); hooks.initialize(); writeLog('hooks.initialize() returned'); } catch (e) { writeLog('hooks.initialize() threw: ' + String(e)); }
    }

    // Create notes: one in a subfolder and one target
    const noteA = { id: 'a', type: 'markdown', title: 'Folder/Source', absolutePath: '/workspace/folder/source.md', content: 'See [[Target Note]]' };
    const noteB = { id: 'b', type: 'markdown', title: 'Target Note', absolutePath: '/workspace/target.md', content: '# target' };
    hooks.state.notes.set(noteA.id, noteA);
    hooks.state.notes.set(noteB.id, noteB);
    hooks.state.currentFolder = '/workspace';

    if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();
    try {
      writeLog('state.notes instanceof Map: ' + ((hooks.state.notes instanceof Map) ? 'true' : String(Object.prototype.toString.call(hooks.state.notes))));
      try { writeLog('state.notes entries: ' + JSON.stringify(Array.from(hooks.state.notes.entries()).map(([k,v])=>[k, {title: v?.title, absolutePath: v?.absolutePath}] ))); } catch (e) { writeLog('state.notes dump failed: ' + String(e)); }
      writeLog('wikiIndex entries: ' + JSON.stringify(Array.from((hooks.state.wikiIndex || new Map()).entries())));
      if (typeof hooks.parseWikiTarget === 'function') {
        try { writeLog('parseWikiTarget("Target Note"): ' + JSON.stringify(hooks.parseWikiTarget('Target Note', null))); } catch (e) { writeLog('parseWikiTarget threw: ' + String(e)); }
      }
    } catch (e) { writeLog('Error dumping wikiIndex: ' + String(e)); }

    // Render preview for noteA
    writeLog('calling renderMarkdownPreview');
    if (typeof hooks.renderMarkdownPreview === 'function') {
      try { hooks.renderMarkdownPreview({ ...noteA, content: noteA.content }); writeLog('renderMarkdownPreview returned'); } catch (e) { writeLog('renderMarkdownPreview threw: ' + String(e)); }
    } else {
      document.getElementById('markdown-preview').textContent = noteA.content;
    }

  // Short wait to allow processing
  await new Promise((r) => setTimeout(r, 150));

    const preview = document.getElementById('markdown-preview');
    const link = preview.querySelector('.wikilink');

    console.log('Preview innerHTML:\n', preview.innerHTML);
    if (link) {
      writeLog('Found .wikilink element. data-note-id=' + (link.dataset.noteId || '(none)'));
      if (link.dataset.noteId) {
        writeLog('Wikilink resolved to noteId: ' + link.dataset.noteId);
        process.exit(0);
      } else {
        writeLog('Wikilink did not include data-note-id.');
        process.exit(3);
      }
    } else {
      writeLog('No .wikilink element rendered.');
      process.exit(4);
    }
  } catch (err) {
    writeLog('Error running check: ' + String(err) + '\n' + (err && err.stack ? err.stack : ''));
    process.exit(1);
  }
})();

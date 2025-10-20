const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  const domHtml = `<!doctype html><html><body>
    <section class="editor-pane editor-pane--left" data-pane-id="left">
      <textarea id="note-editor"></textarea>
      <div id="wikilink-suggestions" class="wiki-suggest" role="listbox" aria-label="Wiki link suggestions" hidden></div>
    </section>
  </body></html>`;
  const dom = new JSDOM(domHtml, { runScripts: 'outside-only', url: 'http://localhost' });
  const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
  w.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {}, resolveResource: async () => ({ value: '' }) };
  try {
    // Some initialization expects marked on the window. Provide it for tests.
    w.marked = require('marked');
  } catch (e) {}
  if (typeof w.matchMedia !== 'function') {
    w.matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} });
  }
  w.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  if (!w.DOMPurify) w.DOMPurify = { sanitize: (s) => s };
  if (typeof w.MutationObserver === 'undefined') {
    w.MutationObserver = function() { this.observe = () => {}; this.disconnect = () => {}; };
  }
  return w;
}

(async function main(){
  const window = makeWindow();
  global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
  const app = require(path.join(__dirname, '..', 'src', 'renderer', 'app.js'));
  const hooks = app.__test__;
  if (hooks.initialize) hooks.initialize();
  hooks.elements.wikiSuggestions = document.getElementById('wikilink-suggestions');

  const note1 = { id: 'note1', type: 'markdown', title: 'Test Note 1', absolutePath: '/tmp/ws/test1.md', content: '# Test Note 1' };
  const note2 = { id: 'note2', type: 'markdown', title: 'Test Note 2', absolutePath: '/tmp/ws/test2.md', content: '# Test Note 2' };
  hooks.state.notes.set(note1.id, note1);
  hooks.state.notes.set(note2.id, note2);
  if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();
  hooks.state.activeNoteId = note1.id;
  hooks.state.editorPanes.left = hooks.state.editorPanes.left || {};
  hooks.state.editorPanes.left.noteId = note1.id;

  const textarea = document.getElementById('note-editor');
  textarea.focus();
  document.activeElement = textarea;

  textarea.value = '[[Test Note 1';
  textarea.selectionStart = textarea.value.length; textarea.selectionEnd = textarea.value.length;

  hooks.updateWikiSuggestions(textarea);

  // Wait 400ms similar to test
  await new Promise(res => setTimeout(res, 400));

  const suggestionsDiv = document.getElementById('wikilink-suggestions');
  console.log('state.wikiSuggest.open=', hooks.state.wikiSuggest.open);
  console.log('state.wikiSuggest.items.length=', hooks.state.wikiSuggest.items.length);
  console.log('suggestionsDiv.hidden=', suggestionsDiv.hidden);
  console.log('suggestionsDiv.getAttribute(data-open)=', suggestionsDiv.getAttribute('data-open'));
  console.log('items in DOM count=', suggestionsDiv.querySelectorAll('.wiki-suggest__item').length);
  console.log('items texts=', Array.from(suggestionsDiv.querySelectorAll('.wiki-suggest__title')).map(n=>n.textContent));

  // Now test folder scoping scenario
  // Reset notes and set workspace tree with subfolder
  hooks.state.notes = new Map();
  const rootFolder = '/tmp/ws';
  const subFolder = '/tmp/ws/folder';
  const noteRoot = { id: 'nroot', type: 'markdown', title: 'Root Note', absolutePath: `${rootFolder}/root.md`, folderPath: rootFolder, content: '# Root' };
  const noteOther = { id: 'nother', type: 'markdown', title: 'Other Note', absolutePath: `${rootFolder}/other.md`, folderPath: rootFolder, content: '# Other' };
  const noteSub = { id: 'nsub', type: 'markdown', title: 'Sub Note', absolutePath: `${subFolder}/subnote.md`, folderPath: subFolder, content: '# Sub' };
  hooks.state.notes.set(noteRoot.id, noteRoot);
  hooks.state.notes.set(noteOther.id, noteOther);
  hooks.state.notes.set(noteSub.id, noteSub);
  hooks.state.tree = {
    id: 'tree-root', name: 'ws', type: 'directory', path: rootFolder,
    children: [
      { id: 'tree-sub', name: 'folder', type: 'directory', path: subFolder, children: [
        { id: 'tree-sub-file', name: 'subnote.md', type: 'file', path: `${subFolder}/subnote.md`, noteId: noteSub.id }
      ] },
      { id: 'tree-root-file', name: 'root.md', type: 'file', path: `${rootFolder}/root.md`, noteId: noteRoot.id }
    ]
  };
  hooks.state.currentFolder = rootFolder;
  if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

  // Type [[ to get folder suggestions
  textarea.value = '[['; textarea.selectionStart = 2; textarea.selectionEnd = 2;
  hooks.updateWikiSuggestions(textarea);
  await new Promise(res => setTimeout(res, 200));
  console.log('After [[ -> items:', Array.from(document.getElementById('wikilink-suggestions').querySelectorAll('.wiki-suggest__title')).map(n=>n.textContent));

  // Type [[folder/ to scope
  textarea.value = '[[folder/'; textarea.selectionStart = textarea.value.length; textarea.selectionEnd = textarea.value.length;
  hooks.updateWikiSuggestions(textarea);
  await new Promise(res => setTimeout(res, 400));
  const scoped = document.getElementById('wikilink-suggestions');
  console.log('Scoped items count=', scoped.querySelectorAll('.wiki-suggest__title').length);
  console.log('Scoped items texts=', Array.from(scoped.querySelectorAll('.wiki-suggest__title')).map(n=>n.textContent));

  try { window.close(); } catch (e) {}
  delete global.window; delete global.document; delete global.localStorage;
})();

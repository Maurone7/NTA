const { JSDOM } = require('jsdom');
const path = require('path');

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

const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
global.window = dom.window; global.document = dom.window.document;
global.window.api = { on: () => {}, removeListener: () => {}, resolveResource: () => Promise.resolve({ value: null }) };
if (typeof global.window.matchMedia !== 'function') {
  global.window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
}
global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.localStorage = global.window.localStorage;
global.console = { debug: () => {}, log: () => {}, warn: () => {}, error: () => {} };

const appPath = path.join(__dirname, '..', 'src', 'renderer', 'app.js');
try { delete require.cache[require.resolve(appPath)]; } catch (e) {}
const appModule = require(appPath);
const hooks = appModule.__test__ || {};
if (typeof hooks.initialize === 'function') { try { hooks.initialize(); } catch (e) { console.error('init failed', e); } }

const state = hooks.state;
console.log('initial activeEditorPane:', state.activeEditorPane);

// simulate pointerdown on the left pane root
const leftEl = document.querySelector('.editor-pane--left');
leftEl.dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true, cancelable: true }));

// create tree node and click
const tree = document.getElementById('workspace-tree');
const node = document.createElement('div');
node.className = 'tree-node tree-node--file';
node.dataset.nodeType = 'file';
node.dataset.noteId = 'fake-left-note';
node.dataset.path = '/fake/path-left.md';
const label = document.createElement('div'); label.className = 'tree-node__label'; node.appendChild(label);

if (state && state.notes && typeof state.notes.set === 'function') {
  state.notes.set('fake-left-note', { id: 'fake-left-note', title: 'Left Fake', type: 'markdown', content: 'hello left' });
}

tree.appendChild(node);
label.dispatchEvent(new dom.window.Event('click', { bubbles: true, cancelable: true }));

setTimeout(() => {
  console.log('after events activeEditorPane =', state.activeEditorPane);
  console.log('editorPanes.left =', state.editorPanes && state.editorPanes.left);
  console.log('debug events =', global.window.__nta_debug_events);
}, 50);

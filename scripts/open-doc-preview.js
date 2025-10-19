const fs = require('fs');
const path = require('path');
const repoRoot = path.resolve(__dirname, '..');
const docDir = path.join(repoRoot, 'documentation');
const examplesDir = path.join(docDir, 'examples');

const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body><div id="markdown-preview"></div></body></html>', { runScripts: 'outside-only', url: 'http://localhost' });
const win = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
global.window = win; global.document = win.document; global.localStorage = win.localStorage || { getItem:() => null, setItem:() => {} };
if (typeof window.matchMedia !== 'function') { window.matchMedia = () => ({ matches:false, addEventListener: ()=>{}, removeEventListener: ()=>{} }); }
if (!window.DOMPurify) window.DOMPurify = { sanitize: s => s };
if (typeof window.MutationObserver === 'undefined') { window.MutationObserver = function(){ this.observe = ()=>{}; this.disconnect = ()=>{} }; }
window.api = { on: () => {}, removeListener: () => {}, invoke: async () => null };

const app = require(path.join(repoRoot, 'src', 'renderer', 'app.js'));
const hooks = app.__test__;

const files = [];
fs.readdirSync(docDir).forEach(f => { const full = path.join(docDir, f); if (fs.statSync(full).isFile()) files.push(full); });
fs.readdirSync(examplesDir).forEach(f => { const full = path.join(examplesDir, f); if (fs.statSync(full).isFile()) files.push(full); });

let counter = 1;
files.forEach(f => {
  const ext = path.extname(f).toLowerCase();
  const title = path.basename(f, ext);
  const id = `doc-${counter++}`;
  hooks.state.notes.set(id, { id, type: ext === '.md' ? 'markdown' : (ext === '.pdf' ? 'pdf' : 'asset'), title, absolutePath: f, content: (ext === '.md') ? fs.readFileSync(f,'utf8') : null });
});

hooks.state.currentFolder = docDir;
if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

const userGuidePath = path.join(docDir, 'User_Guide.md');
const userGuideContent = fs.readFileSync(userGuidePath, 'utf8');

if (typeof hooks.renderMarkdownPreview === 'function') {
  hooks.renderMarkdownPreview({ id: 'doc-user-guide', type: 'markdown', title: 'User Guide', absolutePath: userGuidePath, content: userGuideContent });
}

const preview = document.getElementById('markdown-preview');
console.log('Preview innerHTML:\n', preview.innerHTML);

const links = Array.from(preview.querySelectorAll('.wikilink'));
console.log('Found', links.length, '.wikilink elements');
links.forEach((l, i) => console.log(i+1, l.textContent.trim(), 'data-note-id=', l.dataset.noteId || '(none)'));

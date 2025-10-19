const fs = require('fs');
const path = require('path');
const repoRoot = path.resolve(__dirname, '..');
const docDir = path.join(repoRoot, 'documentation');
const examplesDir = path.join(docDir, 'examples');

function listFiles(dir) {
  try { return fs.readdirSync(dir).map(f => path.join(dir, f)); } catch (e) { return []; }
}

const files = [];
listFiles(docDir).forEach(f => { if (fs.statSync(f).isFile()) files.push(f); });
listFiles(examplesDir).forEach(f => { if (fs.statSync(f).isFile()) files.push(f); });

const md = fs.readFileSync(path.join(docDir, 'User_Guide.md'), 'utf8');
const wikilinks = Array.from(md.matchAll(/!??\[\[(.*?)\]\]/g)).map(m => m[1].trim());

console.log('Found wikilinks in User_Guide.md:', wikilinks);

// Prepare JSDOM environment and require renderer hooks
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
if (!hooks) { console.error('No test hooks exported'); process.exit(2); }

// Seed state.notes with files found in documentation and examples
let counter = 1;
files.forEach(f => {
  const ext = path.extname(f).toLowerCase();
  const title = path.basename(f, ext);
  const id = `doc-${counter++}`;
  hooks.state.notes.set(id, { id, type: ext === '.md' ? 'markdown' : (ext === '.pdf' ? 'pdf' : 'asset'), title, absolutePath: f, content: (ext === '.md') ? fs.readFileSync(f,'utf8') : null });
});

// Set current folder to documentation root so relative paths are computed from there
hooks.state.currentFolder = docDir;
if (typeof hooks.rebuildWikiIndex === 'function') hooks.rebuildWikiIndex();

console.log('wikiIndex size:', hooks.state.wikiIndex.size);

for (const wl of wikilinks) {
  try {
    const res = hooks.parseWikiTarget(wl, null);
    console.log(wl.padEnd(40), '=>', JSON.stringify(res));
  } catch (e) {
    console.log(wl.padEnd(40), '=> error', e && e.message);
  }
}

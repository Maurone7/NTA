const fs = require('fs');
const path = require('path');
const root = path.resolve('src/renderer');
const files = ['app.js','left-sidebar.js','tree.js','editor-ui.js','right-sidebar.js'].map(f=>path.join(root,f)).filter(fs.existsSync);
const re = /^(?:\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(|\s*const\s+([A-Za-z0-9_$]+)\s*=|\s*let\s+([A-Za-z0-9_$]+)\s*=|\s*var\s+([A-Za-z0-9_$]+)\s*=)/gm;
let syms = new Map();
for(const f of files){
  const txt = fs.readFileSync(f,'utf8');
  let m; while((m=re.exec(txt))!==null){
    const name = m[1]||m[2]||m[3]||m[4];
    if(!name) continue;
    syms.set(name, syms.has(name)? syms.get(name).concat([f+':'+(txt.slice(0,m.index).split('\n').length)]) : [f+':'+(txt.slice(0,m.index).split('\n').length)]);
  }
}
// gather all js/mjs files under src/renderer
function walk(dir){
  let out=[];
  for(const fn of fs.readdirSync(dir)){
    const p = path.join(dir,fn);
    if(fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if(/\.m?js$/.test(fn)) out.push(p);
  }
  return out;
}
const all = walk(root);
let rows = [];
for(const [name,locs] of syms.entries()){
  let count=0;
  const reWord = new RegExp('\\b'+name+'\\b','g');
  for(const f of all){
    const t = fs.readFileSync(f,'utf8');
    const m = t.match(reWord);
    if(m) count += m.length;
  }
  rows.push({name,count,def:locs[0]});
}
rows.sort((a,b)=>a.count-b.count||a.name.localeCompare(b.name));
console.log('symbol\tcount\tdefined_at');
rows.slice(0,200).forEach(r=>console.log(`${r.name}\t${r.count}\t${r.def}`));

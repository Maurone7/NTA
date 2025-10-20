(async()=>{
  const { _electron: electron } = require('playwright');
  const app = await electron.launch({ args:['.'], cwd: process.cwd() });
  const w = await app.firstWindow();
  await w.waitForLoadState('domcontentloaded');
  // ensure at least five panes for thoroughness
  await w.evaluate(()=>{ const toggle=document.getElementById('toggle-split-button'); if(toggle && toggle.offsetParent!==null) toggle.click(); });
  // add multiple dynamic panes
  for (let i=0;i<4;i++) await w.evaluate(()=>{ const btn = document.getElementById('toggle-split-button'); if(btn) btn.click(); });
  await w.waitForTimeout(400);
  const results = await w.evaluate(()=>{
    const divs = Array.from(document.querySelectorAll('.editors__divider'));
    const snapshots = divs.map(d=>{
      const left = d.previousElementSibling; const right = d.nextElementSibling;
      const before = [left?.getBoundingClientRect().width||0, right?.getBoundingClientRect().width||0];
      // simulate pointerdown/move/up programmatically
      const r = d.getBoundingClientRect(); const cx = r.x + r.width/2; const cy = r.y + r.height/2;
      const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true });
      d.dispatchEvent(down);
      d.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 30, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
      d.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 30, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
      const after = [left?.getBoundingClientRect().width||0, right?.getBoundingClientRect().width||0];
      return { before, after, hasHandle: !!d.querySelector('.editors__divider__handle'), outerHTML: d.outerHTML };
    });
    return snapshots;
  });
  console.log(JSON.stringify(results,null,2));
  await app.close();
})();

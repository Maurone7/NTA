(async()=>{
  const { _electron: electron } = require('playwright');
  const app = await electron.launch({ args:['.'], cwd: process.cwd() });
  const w = await app.firstWindow();
  await w.waitForLoadState('domcontentloaded');
  // ensure at least three panes
  await w.evaluate(()=>{ const toggle=document.getElementById('toggle-split-button'); if(toggle && toggle.offsetParent!==null) toggle.click(); });
  await w.evaluate(()=>{ const btn = document.getElementById('toggle-split-button'); if(btn) btn.click(); });
  await w.waitForTimeout(300);
  const report = await w.evaluate(()=>{
    const workspace = document.querySelector('.workspace__content');
    const children = Array.from(workspace.children).map((c,i)=>({index:i, tag:c.tagName, id:c.id||null, class:c.className, dataPaneId:c.getAttribute('data-pane-id')||null}));
    const divs = Array.from(document.querySelectorAll('.editors__divider')).map((d,i)=>({
      index:i,
      outerHTML:d.outerHTML,
      hasHandle: !!d.querySelector('.editors__divider__handle'),
      parentClass: d.parentElement ? d.parentElement.className : null,
      prev: d.previousElementSibling ? { tag:d.previousElementSibling.tagName, class:d.previousElementSibling.className, id:d.previousElementSibling.id||null, dataPaneId:d.previousElementSibling.getAttribute('data-pane-id')||null, inlineFlex:d.previousElementSibling.style.flex||null } : null,
      next: d.nextElementSibling ? { tag:d.nextElementSibling.tagName, class:d.nextElementSibling.className, id:d.nextElementSibling.id||null, dataPaneId:d.nextElementSibling.getAttribute('data-pane-id')||null, inlineFlex:d.nextElementSibling.style.flex||null } : null
    }));
    return {children, divs};
  });
  console.log(JSON.stringify(report, null, 2));
  await app.close();
})();

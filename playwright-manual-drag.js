const { _electron: electron } = require('playwright');

(async () => {
  const electronApp = await electron.launch({ args: ['.'], cwd: process.cwd() });
  const window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');

  // Listen to console messages from renderer
  window.on('console', (msg) => {
    console.log('[RENDERER]', msg.type(), msg.text());
  });

  // Query the handle rect
  const box = await window.evaluate(() => {
    const h = document.querySelector('.sidebar-resize-handle');
    if (!h) return null;
    const r = h.getBoundingClientRect();
    return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  });

  if (!box) { console.log('No handle found'); await electronApp.close(); process.exit(1); }

  // Simulate drag by dispatching pointer events
  await window.evaluate(({ cx, cy }) => {
    const h = document.querySelector('.sidebar-resize-handle');
    h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 555, pointerType: 'mouse', button: 0, bubbles: true }));
    setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 60, clientY: cy, pointerId: 555, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 60, clientY: cy, pointerId: 555, pointerType: 'mouse', bubbles: true })); }, 30); }, 10);
  }, box);

  // Wait to collect logs
  await window.waitForTimeout(300);
  await electronApp.close();
})();
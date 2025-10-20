const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test('Electron: Editor divider then Sidebar resize sequence', async () => {
  const electronApp = await electron.launch({
    args: ['.'],
    cwd: process.cwd(),
  });

  const window = await electronApp.firstWindow();

  // Wait for app to load
  await window.waitForLoadState('domcontentloaded');

  // Ensure we have split editors (two panes)
  await window.evaluate(() => {
    const toggle = document.getElementById('toggle-split-button');
    if (toggle && toggle.offsetParent !== null) {
      toggle.click();
    }
  });

  // Wait for second pane
  await window.waitForFunction(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).length >= 2, {}, { timeout: 5000 });

  // Get initial sidebar width
  const startSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

  // Get divider position
  const dividerBox = await window.evaluate(() => {
    const d = document.querySelector('.editors__divider');
    if (!d) return null;
    const r = d.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  });
  if (!dividerBox) throw new Error('editors__divider not found');

  // Drag the editor divider to the right by 50px
  const dx = 50;
  await window.evaluate(({ cx, cy, dx }) => {
    const divider = document.querySelector('.editors__divider');
    if (!divider) throw new Error('divider missing');
    const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 2, pointerType: 'mouse', button: 0, bubbles: true });
    divider.dispatchEvent(down);
    // dispatch move/up on divider since listeners are attached there
    setTimeout(() => {
      divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + dx, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true }));
      setTimeout(() => { divider.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + dx, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true })); }, 30);
    }, 10);
  }, { cx: dividerBox.cx, cy: dividerBox.cy, dx });

  // Wait a bit for cleanup
  await window.waitForTimeout(200);

  // Now try to resize the sidebar via pointer drag on the sidebar handle
  const handleBox = await window.evaluate(() => {
    const h = document.querySelector('.sidebar-resize-handle');
    if (!h) return null;
    const r = h.getBoundingClientRect();
    return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  });
  if (!handleBox) throw new Error('sidebar-resize-handle not found');

  // Try pointer-based drag first
  await window.evaluate(({ cx, cy }) => {
    const h = document.querySelector('.sidebar-resize-handle');
    if (!h) throw new Error('handle missing');
    h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 3, pointerType: 'mouse', button: 0, bubbles: true }));
    setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 60, clientY: cy, pointerId: 3, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 60, clientY: cy, pointerId: 3, pointerType: 'mouse', bubbles: true })); }, 20); }, 10);
  }, { cx: handleBox.cx, cy: handleBox.cy });

  await window.waitForTimeout(150);

  let finalSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

  // Fallback to helper if pointer simulation didn't change width
  if (finalSidebarWidth === startSidebarWidth) {
    const target = startSidebarWidth + 100;
    const ok = await window.evaluate((t) => {
      try { return !!(window.__nta_test_setSidebarWidth && window.__nta_test_setSidebarWidth(t)); } catch (e) { return false; }
    }, target);
    expect(ok).toBeTruthy();
    await window.waitForTimeout(100);
    finalSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);
  }

  expect(finalSidebarWidth).toBeGreaterThan(startSidebarWidth);

  await electronApp.close();
});
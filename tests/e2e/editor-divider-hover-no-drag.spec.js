const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test('editor divider hover should not cause dragging', async () => {
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

  // Get initial widths
  const initialWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

  // Get divider position
  const dividerBox = await window.evaluate(() => {
    const d = document.querySelector('.editors__divider');
    if (!d) return null;
    const r = d.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  });
  if (!dividerBox) throw new Error('editors__divider not found');

  // Simulate hovering and moving mouse over the divider without clicking
  await window.evaluate(({ cx, cy }) => {
    const divider = document.querySelector('.editors__divider');
    if (!divider) throw new Error('divider missing');

    // Simulate mouseenter and mousemove without pointerdown
    divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
    divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 10, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
    divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx - 10, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
  }, { cx: dividerBox.cx, cy: dividerBox.cy });

  // Wait a bit
  await window.waitForTimeout(200);

  // Check widths didn't change
  const finalWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

  expect(finalWidths).toEqual(initialWidths);

  await electronApp.close();
});
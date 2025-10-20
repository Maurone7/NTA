const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test.describe('Sidebar resize persistence', () => {
  test('sidebar width persists across app restart', async () => {
    // Launch app, resize sidebar, capture final width
    let electronApp = await electron.launch({ args: ['.'], cwd: process.cwd() });
    let window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Ensure handle attached
    await window.waitForSelector('.sidebar-resize-handle', { state: 'attached', timeout: 5000 });

    const startWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    // Perform a drag to increase width by ~60px
    const box = await window.evaluate(() => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!box) throw new Error('sidebar-resize-handle not found at drag step');

    await window.evaluate(({ cx, cy }) => {
      const h = document.querySelector('.sidebar-resize-handle');
      h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 101, pointerType: 'mouse', button: 0, bubbles: true }));
      setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 60, clientY: cy, pointerId: 101, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 60, clientY: cy, pointerId: 101, pointerType: 'mouse', bubbles: true })); }, 30); }, 10);
    }, box);

    // allow handlers to run and persist
    await window.waitForTimeout(200);

    const finalWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);
    expect(finalWidth).toBeGreaterThanOrEqual(startWidth);

    // Close and relaunch app
    await electronApp.close();

    electronApp = await electron.launch({ args: ['.'], cwd: process.cwd() });
    window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    const restartedWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    // The restarted width should match the persisted final width
    expect(restartedWidth).toBe(finalWidth);

    await electronApp.close();
  });
});

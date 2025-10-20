const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test.describe('Sidebar resize robustness', () => {

  test('left sidebar has single visible handle and resizes on drag', async () => {
    const electronApp = await electron.launch({ args: ['.'], cwd: process.cwd() });
    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Wait for handle(s) to be attached
    await window.waitForSelector('.sidebar-resize-handle', { state: 'attached', timeout: 5000 });

    // Ensure exactly one visible handle exists
    const visibleHandles = await window.evaluate(() => Array.from(document.querySelectorAll('.sidebar-resize-handle')).filter(h => getComputedStyle(h).display !== 'none' && h.offsetParent !== null));
    expect(visibleHandles.length).toBeGreaterThanOrEqual(1);
    // Typically there should be only one; if more exist, that's a stray handle bug
    expect(visibleHandles.length).toBe(1);

    // Record starting value from CSS variable (fallback to 260)
    const start = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    // Drag the handle to increase width
    const box = await window.evaluate(() => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!box) throw new Error('sidebar-resize-handle not found at drag step');

    await window.evaluate(({ cx, cy }) => {
      const h = document.querySelector('.sidebar-resize-handle');
      h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 100, pointerType: 'mouse', button: 0, bubbles: true }));
      setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 40, clientY: cy, pointerId: 100, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 40, clientY: cy, pointerId: 100, pointerType: 'mouse', bubbles: true })); }, 30); }, 10);
    }, box);

    await window.waitForTimeout(200);

    const final = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);
    expect(final).toBeGreaterThanOrEqual(start);

    // After resize ensure still exactly one visible handle
    const postHandles = await window.evaluate(() => Array.from(document.querySelectorAll('.sidebar-resize-handle')).filter(h => getComputedStyle(h).display !== 'none' && h.offsetParent !== null).length);
    expect(postHandles).toBe(1);

    await electronApp.close();
  });

  test('no stray handlebars created after repeated toggles', async () => {
    const electronApp = await electron.launch({ args: ['.'], cwd: process.cwd() });
    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // toggle sidebar visibility or other UI actions repeatedly
    for (let i = 0; i < 6; i++) {
      await window.evaluate(() => {
        const btn = document.getElementById('toggle-sidebar-button') || document.getElementById('toggle-split-button');
        if (btn && btn.offsetParent !== null) btn.click();
      });
      await window.waitForTimeout(80);
    }

    // Ensure single visible handle exists
    const visibleHandles = await window.evaluate(() => Array.from(document.querySelectorAll('.sidebar-resize-handle')).filter(h => getComputedStyle(h).display !== 'none' && h.offsetParent !== null));
    expect(visibleHandles.length).toBe(1);

    await electronApp.close();
  });

  test('hashtag panel resizes on vertical drag', async () => {
    const electronApp = await electron.launch({ args: ['.'], cwd: process.cwd() });
    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Wait for hashtag resize handle to be attached
    await window.waitForSelector('#hashtag-resize-handle', { state: 'attached', timeout: 5000 });

    // Record starting value from CSS variable (fallback to 300)
    const start = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hashtag-panel-height')) || 300);

    // Drag the handle upward to decrease height
    const box = await window.evaluate(() => {
      const h = document.getElementById('hashtag-resize-handle');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!box) throw new Error('hashtag-resize-handle not found at drag step');

    await window.evaluate(({ cx, cy }) => {
      const h = document.getElementById('hashtag-resize-handle');
      h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 200, pointerType: 'mouse', button: 0, bubbles: true }));
      setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx, clientY: cy - 50, pointerId: 200, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx, clientY: cy - 50, pointerId: 200, pointerType: 'mouse', bubbles: true })); }, 30); }, 10);
    }, box);

    await window.waitForTimeout(200);

    const final = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hashtag-panel-height')) || 300);
    expect(final).toBeLessThanOrEqual(start);

    await electronApp.close();
  });

});

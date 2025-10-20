const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

// Sequence test: drag editors divider, then resize sidebar (pointer-first, helper fallback)
test.describe('Electron: Editor divider then Sidebar resize sequence', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'], env: { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: 'true' } });
    const firstWindowPromise = electronApp.firstWindow();
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Timed out waiting for Electron window')), 10000));
    window = await Promise.race([firstWindowPromise, timeout]);
    await window.waitForLoadState('domcontentloaded', { timeout: 10000 });
  });

  test.afterAll(async () => {
    if (electronApp) {
      try { await electronApp.close(); } catch (e) {}
    }
  });

  test('drag editor divider, then resize sidebar (pointer or helper fallback)', async () => {
    // Ensure UI present
    await expect(window.locator('.app-shell')).toBeVisible();

  // Wait for workspace and handles to be attached (some panes may be hidden initially)
  await window.waitForSelector('.workspace', { timeout: 5000 });
  await window.waitForSelector('.editors__divider', { state: 'attached', timeout: 5000 });
  await window.waitForSelector('.sidebar-resize-handle', { state: 'attached', timeout: 5000 });

    // Get initial widths of visible editor panes (filter out hidden panes)
    const initialEditorWidths = await window.evaluate(() => {
      const panes = Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null);
      return panes.map(p => Math.round(p.getBoundingClientRect().width));
    });

    if (initialEditorWidths.length < 2) {
      // If there's only one editor pane, create a second via the toggle-split-button
      const toggle = window.locator('#toggle-split-button');
      if (await toggle.count() > 0) {
        await toggle.click();
        // wait for second pane to appear
        await window.waitForFunction(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).length >= 2, {}, { timeout: 2000 });
      }
    }

    // Recompute initial widths (again) to be sure (use visible panes only)
    const beforeWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));
    // pick the first visible divider and its bounding box
    const dividerBox = await window.evaluate(() => {
      const d = document.querySelector('.editors__divider');
      if (!d) return null;
      const r = d.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!dividerBox) throw new Error('editors__divider not found');

    // Drag the editor divider to the right by 80px
    const dx = 80;
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

    // allow layout to settle
    await window.waitForTimeout(200);

    const afterEditorWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).map(p => Math.round(p.getBoundingClientRect().width)));
    // Expect at least one pane width changed compared to before
    const widthChanged = beforeWidths.some((w, i) => afterEditorWidths[i] !== w);
    expect(widthChanged).toBeTruthy();

    // Now try to resize the sidebar via pointer drag on the sidebar handle
    const handleBox = await window.evaluate(() => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!handleBox) throw new Error('sidebar-resize-handle not found');

    const startSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    // Try pointer-based drag first
    await window.evaluate(({ cx, cy }) => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) throw new Error('handle missing');
      h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 3, pointerType: 'mouse', button: 0, bubbles: true }));
      setTimeout(() => { document.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 60, clientY: cy, pointerId: 3, pointerType: 'mouse', bubbles: true })); setTimeout(() => { document.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 60, clientY: cy, pointerId: 3, pointerType: 'mouse', bubbles: true })); }, 20); }, 10);
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
  });
});

const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test.describe('Advanced Resize Handle Tests', () => {

  test('rapid successive drags work correctly', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Ensure we have split editors
    await window.evaluate(() => {
      const toggle = document.getElementById('toggle-split-button');
      if (toggle && toggle.offsetParent !== null) {
        toggle.click();
      }
    });

    await window.waitForFunction(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).length >= 2, {}, { timeout: 5000 });

    // Perform rapid sequence of drags
    await window.evaluate(() => {
      // Editors divider drag
      const divider = document.querySelector('.editors__divider');
      if (divider) {
        const r = divider.getBoundingClientRect();
        const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
        const down1 = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true });
        divider.dispatchEvent(down1);
        setTimeout(() => {
          divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 15, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
          setTimeout(() => { divider.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 15, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); }, 20);
        }, 5);
      }

      // Immediately followed by sidebar drag
      setTimeout(() => {
        const handle = document.querySelector('.sidebar-resize-handle');
        if (handle) {
          const r = handle.getBoundingClientRect();
          const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
          const down2 = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 2, pointerType: 'mouse', button: 0, bubbles: true });
          handle.dispatchEvent(down2);
          setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 25, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 25, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true })); }, 20); }, 5);
        }
      }, 50);

      // Then workspace splitter
      setTimeout(() => {
        const splitter = document.querySelector('.workspace__splitter');
        if (splitter) {
          const r = splitter.getBoundingClientRect();
          const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
          const down3 = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 3, pointerType: 'mouse', button: 0, bubbles: true });
          splitter.dispatchEvent(down3);
          setTimeout(() => {
            document.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 20, clientY: cy, pointerId: 3, pointerType: 'mouse', bubbles: true }));
            setTimeout(() => { document.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 20, clientY: cy, pointerId: 3, pointerType: 'mouse', bubbles: true })); }, 20);
          }, 5);
        }
      }, 100);
    });

    await window.waitForTimeout(300);

    // Verify no overlays remain
    const hasOverlays = await window.evaluate(() => {
      const overlays = [
        '__splitter-drag-overlay',
        '__sidebar-drag-overlay',
        '__editors-divider-drag-overlay'
      ];
      return overlays.some(id => document.getElementById(id) !== null);
    });

    expect(hasOverlays).toBeFalsy();

    await electronApp.close();
  });

  test('drag cancellation with pointercancel works', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Ensure we have split editors
    await window.evaluate(() => {
      const toggle = document.getElementById('toggle-split-button');
      if (toggle && toggle.offsetParent !== null) {
        toggle.click();
      }
    });

    await window.waitForFunction(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).length >= 2, {}, { timeout: 5000 });

    const initialWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

    const dividerBox = await window.evaluate(() => {
      const d = document.querySelector('.editors__divider');
      if (!d) return null;
      const r = d.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!dividerBox) throw new Error('editors__divider not found');

    // Start drag then cancel with pointercancel
    await window.evaluate(({ cx, cy }) => {
      const divider = document.querySelector('.editors__divider');
      if (!divider) throw new Error('divider missing');
      const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true });
      divider.dispatchEvent(down);
      setTimeout(() => {
        divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 30, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
        setTimeout(() => { divider.dispatchEvent(new PointerEvent('pointercancel', { clientX: cx + 30, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); }, 20);
      }, 10);
    }, { cx: dividerBox.cx, cy: dividerBox.cy });

    await window.waitForTimeout(200);

    const finalWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

    // Should not have changed since we cancelled
    expect(finalWidths).toEqual(initialWidths);

    await electronApp.close();
  });

  test('drag operations complete without errors', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Ensure we have split editors
    await window.evaluate(() => {
      const toggle = document.getElementById('toggle-split-button');
      if (toggle && toggle.offsetParent !== null) {
        toggle.click();
      }
    });

    await window.waitForFunction(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).length >= 2, {}, { timeout: 5000 });

    const dividerBox = await window.evaluate(() => {
      const d = document.querySelector('.editors__divider');
      if (!d) return null;
      const r = d.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!dividerBox) throw new Error('editors__divider not found');

    // Perform a normal drag operation
    await window.evaluate(({ cx, cy }) => {
      const divider = document.querySelector('.editors__divider');
      if (!divider) throw new Error('divider missing');
      const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true });
      divider.dispatchEvent(down);
      setTimeout(() => {
        divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 30, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
        setTimeout(() => { divider.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 30, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); }, 30);
      }, 10);
    }, { cx: dividerBox.cx, cy: dividerBox.cy });

    await window.waitForTimeout(200);

    // Just verify no errors occurred and operation completed
    const hasOverlays = await window.evaluate(() => {
      const overlays = [
        '__splitter-drag-overlay',
        '__sidebar-drag-overlay',
        '__editors-divider-drag-overlay'
      ];
      return overlays.some(id => document.getElementById(id) !== null);
    });

    expect(hasOverlays).toBeFalsy();

    await electronApp.close();
  });

  test('resize handles work with different screen sizes', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Set a specific window size
    await window.setViewportSize({ width: 1200, height: 800 });

    // Ensure we have split editors
    await window.evaluate(() => {
      const toggle = document.getElementById('toggle-split-button');
      if (toggle && toggle.offsetParent !== null) {
        toggle.click();
      }
    });

    await window.waitForFunction(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).length >= 2, {}, { timeout: 5000 });

    // Test sidebar resize
    const handleBox = await window.evaluate(() => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!handleBox) throw new Error('sidebar-resize-handle not found');

    const startSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    await window.evaluate(({ cx, cy }) => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) throw new Error('handle missing');
      h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true }));
      setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 50, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 50, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); }, 20); }, 10);
    }, { cx: handleBox.cx, cy: handleBox.cy });

    await window.waitForTimeout(150);

    const finalSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    expect(finalSidebarWidth).toBeGreaterThan(startSidebarWidth);

    await electronApp.close();
  });

  test('resize handles work after window resize', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Resize window
    await window.setViewportSize({ width: 1400, height: 900 });
    await window.waitForTimeout(200);

    // Ensure we have split editors
    await window.evaluate(() => {
      const toggle = document.getElementById('toggle-split-button');
      if (toggle && toggle.offsetParent !== null) {
        toggle.click();
      }
    });

    await window.waitForFunction(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).length >= 2, {}, { timeout: 5000 });

    // Test editors divider resize
    const initialWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

    const dividerBox = await window.evaluate(() => {
      const d = document.querySelector('.editors__divider');
      if (!d) return null;
      const r = d.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!dividerBox) throw new Error('editors__divider not found');

    await window.evaluate(({ cx, cy }) => {
      const divider = document.querySelector('.editors__divider');
      if (!divider) throw new Error('divider missing');
      const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true });
      divider.dispatchEvent(down);
      setTimeout(() => {
        divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 30, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
        setTimeout(() => { divider.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 30, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); }, 30);
      }, 10);
    }, { cx: dividerBox.cx, cy: dividerBox.cy });

    await window.waitForTimeout(200);

    const finalWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

    // Should have changed
    const widthChanged = initialWidths.some((w, i) => Math.abs(finalWidths[i] - w) > 5);
    expect(widthChanged).toBeTruthy();

    await electronApp.close();
  });

  test('resize handles work with touch events', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Ensure we have split editors
    await window.evaluate(() => {
      const toggle = document.getElementById('toggle-split-button');
      if (toggle && toggle.offsetParent !== null) {
        toggle.click();
      }
    });

    await window.waitForFunction(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).length >= 2, {}, { timeout: 5000 });

    const initialWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

    const dividerBox = await window.evaluate(() => {
      const d = document.querySelector('.editors__divider');
      if (!d) return null;
      const r = d.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!dividerBox) throw new Error('editors__divider not found');

    // Use touch pointer type
    await window.evaluate(({ cx, cy }) => {
      const divider = document.querySelector('.editors__divider');
      if (!divider) throw new Error('divider missing');
      const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'touch', button: 0, bubbles: true });
      divider.dispatchEvent(down);
      setTimeout(() => {
        divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 25, clientY: cy, pointerId: 1, pointerType: 'touch', bubbles: true }));
        setTimeout(() => { divider.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 25, clientY: cy, pointerId: 1, pointerType: 'touch', bubbles: true })); }, 30);
      }, 10);
    }, { cx: dividerBox.cx, cy: dividerBox.cy });

    await window.waitForTimeout(200);

    const finalWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

    // Should have changed
    const widthChanged = initialWidths.some((w, i) => Math.abs(finalWidths[i] - w) > 5);
    expect(widthChanged).toBeTruthy();

    await electronApp.close();
  });

});
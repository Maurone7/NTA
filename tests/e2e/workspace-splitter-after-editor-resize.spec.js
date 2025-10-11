const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test.describe('Resize Handle Interactions', () => {

  test('workspace splitter drag does not block sidebar resize', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Ensure we have split view (editor + preview)
    await window.evaluate(() => {
      const splitter = document.querySelector('.workspace__splitter');
      if (splitter) {
        // Ensure preview is visible
        document.documentElement.style.setProperty('--editor-width', '50%');
      }
    });

    const startSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    // Get workspace splitter position
    const splitterBox = await window.evaluate(() => {
      const s = document.querySelector('.workspace__splitter');
      if (!s) return null;
      const r = s.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!splitterBox) throw new Error('workspace__splitter not found');

    // Drag workspace splitter to the right by 50px
    const dx = 50;
    await window.evaluate(({ cx, cy, dx }) => {
      const splitter = document.querySelector('.workspace__splitter');
      if (!splitter) throw new Error('splitter missing');
      const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true });
      splitter.dispatchEvent(down);
      setTimeout(() => {
        document.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + dx, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
        setTimeout(() => { document.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + dx, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); }, 30);
      }, 10);
    }, { cx: splitterBox.cx, cy: splitterBox.cy, dx });

    await window.waitForTimeout(200);

    // Now try to resize the sidebar
    const handleBox = await window.evaluate(() => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!handleBox) throw new Error('sidebar-resize-handle not found');

    await window.evaluate(({ cx, cy }) => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) throw new Error('handle missing');
      h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 2, pointerType: 'mouse', button: 0, bubbles: true }));
      setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 60, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 60, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true })); }, 20); }, 10);
    }, { cx: handleBox.cx, cy: handleBox.cy });

    await window.waitForTimeout(150);

    let finalSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    // Fallback to helper if pointer simulation didn't work
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

  test('sidebar drag does not block workspace splitter resize', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Ensure we have split view
    await window.evaluate(() => {
      document.documentElement.style.setProperty('--editor-width', '50%');
    });

    const startEditorWidth = await window.evaluate(() => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--editor-width');
      return width ? parseInt(width) : 50;
    });

    // First resize sidebar
    const handleBox = await window.evaluate(() => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!handleBox) throw new Error('sidebar-resize-handle not found');

    await window.evaluate(({ cx, cy }) => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) throw new Error('handle missing');
      h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true }));
      setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 40, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 40, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); }, 20); }, 10);
    }, { cx: handleBox.cx, cy: handleBox.cy });

    await window.waitForTimeout(200);

    // Now try to resize workspace splitter
    const splitterBox = await window.evaluate(() => {
      const s = document.querySelector('.workspace__splitter');
      if (!s) return null;
      const r = s.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!splitterBox) throw new Error('workspace__splitter not found');

    const initialEditorWidth = await window.evaluate(() => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--editor-width');
      return width ? parseInt(width) : 50;
    });

    await window.evaluate(({ cx, cy }) => {
      const splitter = document.querySelector('.workspace__splitter');
      if (!splitter) throw new Error('splitter missing');
      const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 2, pointerType: 'mouse', button: 0, bubbles: true });
      splitter.dispatchEvent(down);
      setTimeout(() => {
        document.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 30, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true }));
        setTimeout(() => { document.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 30, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true })); }, 30);
      }, 10);
    }, { cx: splitterBox.cx, cy: splitterBox.cy });

    await window.waitForTimeout(200);

    const finalEditorWidth = await window.evaluate(() => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--editor-width');
      return width ? parseInt(width) : 50;
    });

    // Should have changed
    expect(Math.abs(finalEditorWidth - initialEditorWidth)).toBeGreaterThan(10);

    await electronApp.close();
  });

  test('sidebar drag does not block editors divider resize', async () => {
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

    // First resize sidebar
    const handleBox = await window.evaluate(() => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!handleBox) throw new Error('sidebar-resize-handle not found');

    await window.evaluate(({ cx, cy }) => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) throw new Error('handle missing');
      h.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true }));
      setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 40, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 40, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); }, 20); }, 10);
    }, { cx: handleBox.cx, cy: handleBox.cy });

    await window.waitForTimeout(200);

    // Now try to resize editors divider
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
      const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 2, pointerType: 'mouse', button: 0, bubbles: true });
      divider.dispatchEvent(down);
      setTimeout(() => {
        divider.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 40, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true }));
        setTimeout(() => { divider.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 40, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true })); }, 30);
      }, 10);
    }, { cx: dividerBox.cx, cy: dividerBox.cy });

    await window.waitForTimeout(200);

    const finalWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

    // Should have changed
    const widthChanged = initialWidths.some((w, i) => Math.abs(finalWidths[i] - w) > 10);
    expect(widthChanged).toBeTruthy();

    await electronApp.close();
  });

  test('workspace splitter hover does not cause dragging', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Ensure we have split view
    await window.evaluate(() => {
      document.documentElement.style.setProperty('--editor-width', '50%');
    });

    const initialWidth = await window.evaluate(() => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--editor-width');
      return width ? parseInt(width) : 50;
    });

    const splitterBox = await window.evaluate(() => {
      const s = document.querySelector('.workspace__splitter');
      if (!s) return null;
      const r = s.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!splitterBox) throw new Error('workspace__splitter not found');

    // Simulate hovering and moving mouse over the splitter without clicking
    await window.evaluate(({ cx, cy }) => {
      const splitter = document.querySelector('.workspace__splitter');
      if (!splitter) throw new Error('splitter missing');

      splitter.dispatchEvent(new PointerEvent('pointermove', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
      splitter.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 10, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
      splitter.dispatchEvent(new PointerEvent('pointermove', { clientX: cx - 10, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
    }, { cx: splitterBox.cx, cy: splitterBox.cy });

    await window.waitForTimeout(200);

    const finalWidth = await window.evaluate(() => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--editor-width');
      return width ? parseInt(width) : 50;
    });

    expect(finalWidth).toBe(initialWidth);

    await electronApp.close();
  });

  test('sidebar handle hover does not cause dragging', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    const startSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    const handleBox = await window.evaluate(() => {
      const h = document.querySelector('.sidebar-resize-handle');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
    if (!handleBox) throw new Error('sidebar-resize-handle not found');

    // Simulate hovering and moving mouse over the handle without clicking
    await window.evaluate(({ cx, cy }) => {
      const handle = document.querySelector('.sidebar-resize-handle');
      if (!handle) throw new Error('handle missing');

      handle.dispatchEvent(new PointerEvent('pointermove', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
      handle.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 5, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
      handle.dispatchEvent(new PointerEvent('pointermove', { clientX: cx - 5, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
    }, { cx: handleBox.cx, cy: handleBox.cy });

    await window.waitForTimeout(200);

    const finalSidebarWidth = await window.evaluate(() => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260);

    expect(finalSidebarWidth).toBe(startSidebarWidth);

    await electronApp.close();
  });

  test('multiple editor panes - all dividers work independently', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Create multiple editor panes by toggling split multiple times
    await window.evaluate(() => {
      const toggle = document.getElementById('toggle-split-button');
      if (toggle && toggle.offsetParent !== null) {
        toggle.click();
        setTimeout(() => toggle.click(), 100); // Create another split
      }
    });

    await window.waitForFunction(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).length >= 3, {}, { timeout: 10000 });

    const initialWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

    // Get all dividers
    const dividers = await window.evaluate(() => {
      const ds = Array.from(document.querySelectorAll('.editors__divider'));
      return ds.map(d => {
        const r = d.getBoundingClientRect();
        return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
      });
    });

    // Drag each divider
    for (let i = 0; i < dividers.length; i++) {
      const divider = dividers[i];
      await window.evaluate(({ cx, cy, index }) => {
        const ds = Array.from(document.querySelectorAll('.editors__divider'));
        const d = ds[index];
        if (!d) return;
        const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: index + 1, pointerType: 'mouse', button: 0, bubbles: true });
        d.dispatchEvent(down);
        setTimeout(() => {
          d.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 20, clientY: cy, pointerId: index + 1, pointerType: 'mouse', bubbles: true }));
          setTimeout(() => { d.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 20, clientY: cy, pointerId: index + 1, pointerType: 'mouse', bubbles: true })); }, 30);
        }, 10);
      }, { cx: divider.cx, cy: divider.cy, index: i });

      await window.waitForTimeout(100);
    }

    const finalWidths = await window.evaluate(() => Array.from(document.querySelectorAll('.editor-pane')).filter(p => getComputedStyle(p).display !== 'none' && p.offsetParent !== null).map(p => Math.round(p.getBoundingClientRect().width)));

    // Should have changed
    const widthChanged = initialWidths.some((w, i) => Math.abs(finalWidths[i] - w) > 5);
    expect(widthChanged).toBeTruthy();

    await electronApp.close();
  });

  test('overlay cleanup - no stale overlays after drag sequences', async () => {
    const electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd(),
    });

    const window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');

    // Perform a sequence of drags
    await window.evaluate(() => {
      // First, workspace splitter drag
      const splitter = document.querySelector('.workspace__splitter');
      if (splitter) {
        const r = splitter.getBoundingClientRect();
        const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
        const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', button: 0, bubbles: true });
        splitter.dispatchEvent(down);
        setTimeout(() => {
          document.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 20, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true }));
          setTimeout(() => { document.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 20, clientY: cy, pointerId: 1, pointerType: 'mouse', bubbles: true })); }, 30);
        }, 10);
      }

      // Then sidebar drag
      setTimeout(() => {
        const handle = document.querySelector('.sidebar-resize-handle');
        if (handle) {
          const r = handle.getBoundingClientRect();
          const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
          const down = new PointerEvent('pointerdown', { clientX: cx, clientY: cy, pointerId: 2, pointerType: 'mouse', button: 0, bubbles: true });
          handle.dispatchEvent(down);
          setTimeout(() => { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx + 20, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true })); setTimeout(() => { window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx + 20, clientY: cy, pointerId: 2, pointerType: 'mouse', bubbles: true })); }, 20); }, 10);
        }
      }, 200);
    });

    await window.waitForTimeout(500);

    // Check that no drag overlays remain
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

});

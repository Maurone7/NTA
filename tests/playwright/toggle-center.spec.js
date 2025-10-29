const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Toggle buttons vertical centering', () => {
  test('sidebar toggle button is centered on the visible sidebar handle (terminal closed and open)', async ({ page }) => {
    const file = path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html');
    await page.goto('file://' + file);

    const handle = page.locator('.sidebar-resize-handle');
    const toggle = page.locator('.toggle-sidebar-button');

    await expect(handle).toBeVisible();
    await expect(toggle).toBeVisible();

    // Helper to compute center Y of an element in the page context
    const getCenters = async () => {
      return await page.evaluate(() => {
        const handleEl = document.querySelector('.sidebar-resize-handle');
        const toggleEl = document.querySelector('.toggle-sidebar-button');
        if (!handleEl || !toggleEl) return null;
        const handleRect = handleEl.getBoundingClientRect();
        const toggleRect = toggleEl.getBoundingClientRect();
        return {
          handleCenterY: handleRect.y + handleRect.height / 2,
          toggleCenterY: toggleRect.y + toggleRect.height / 2,
          handleHeight: handleRect.height,
          windowInnerHeight: window.innerHeight
        };
      });
    };

    // First check with terminal closed (default)
    const before = await getCenters();
    if (!before) throw new Error('Elements not found for centering test');

    // They should be roughly aligned (within a few pixels)
    const diff1 = Math.abs(before.handleCenterY - before.toggleCenterY);
    expect(diff1).toBeLessThanOrEqual(6);

    // Now simulate the terminal opening by setting the CSS variable --terminal-height
    // and re-check alignment: the handle will shrink vertically (bottom moves up)
    await page.evaluate(() => {
      // Set terminal height to 240px to simulate an open terminal
      document.documentElement.style.setProperty('--terminal-height', '240px');
      // Also add terminal-visible class used by some hover rules
      document.documentElement.classList.add('terminal-visible');
    });

    // Allow layout to update
    await page.waitForTimeout(80);

    const after = await getCenters();
    if (!after) throw new Error('Elements not found after terminal open');

    // Verify that the toggle is centered on the visible area of the handle
    const diff2 = Math.abs(after.handleCenterY - after.toggleCenterY);
    expect(diff2).toBeLessThanOrEqual(6);

    // Also ensure the handle height decreased when terminal opened
    expect(after.handleHeight).toBeLessThan(before.handleHeight);
  });
});

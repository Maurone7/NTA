const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Sidebar resize', () => {
  test('dragging the sidebar handle updates sidebar width', async ({ page }) => {
    const file = path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html');
    await page.goto('file://' + file);

    const explorer = page.locator('.explorer');
    const handle = page.locator('.sidebar-resize-handle');

    // Wait for elements to be visible
    await expect(explorer).toBeVisible();
    await expect(handle).toBeVisible();

    // Read initial computed sidebar width from CSS variable
    const initialWidth = await page.evaluate(() => {
      return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260;
    });

    // Get handle bounding box to compute a start point
    const box = await handle.boundingBox();
    if (!box) throw new Error('Sidebar handle has no bounding box');

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Move pointer some pixels to the right to increase width
    const delta = 60;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + delta, startY, { steps: 10 });
    await page.mouse.up();

    // Allow JS to settle and read new width
    await page.waitForTimeout(120);

    const finalWidth = await page.evaluate(() => {
      return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260;
    });

    expect(finalWidth).not.toBe(initialWidth);
    expect(finalWidth).toBeGreaterThan(initialWidth);

    // Also assert explorer element width changed in the layout
    const explorerWidth = await explorer.evaluate((el) => el.getBoundingClientRect().width);
    expect(explorerWidth).toBeGreaterThan(0);
    expect(explorerWidth).toBeGreaterThan(initialWidth - 10); // roughly increased
  });
});

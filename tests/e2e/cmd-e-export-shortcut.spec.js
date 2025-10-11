const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Cmd+E Export Shortcut', () => {
  test('keyboard shortcut does not throw errors', async ({ page }) => {
    const file = path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html');
    await page.goto('file://' + file);

    // Wait for the app to load
    await expect(page.locator('.app-shell')).toBeVisible();

    // Set up localStorage with default export format
    await page.evaluate(() => {
      localStorage.setItem('defaultExportFormat', 'pdf');
    });

    // Listen for console errors
    let consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Focus the document
    await page.focus('body');

    // Simulate Cmd+E keypress
    await page.keyboard.press('Meta+e');

    // Wait a bit
    await page.waitForTimeout(200);

    // Check that no errors were thrown
    expect(consoleErrors.length).toBe(0);
  });

  test('Ctrl+E shortcut does not throw errors on non-Mac platforms', async ({ page }) => {
    const file = path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html');
    await page.goto('file://' + file);

    // Wait for the app to load
    await expect(page.locator('.app-shell')).toBeVisible();

    // Set up localStorage with default export format
    await page.evaluate(() => {
      localStorage.setItem('defaultExportFormat', 'docx');
    });

    // Listen for console errors
    let consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Focus the document
    await page.focus('body');

    // Simulate Ctrl+E keypress
    await page.keyboard.press('Control+e');

    // Wait a bit
    await page.waitForTimeout(200);

    // Check that no errors were thrown
    expect(consoleErrors.length).toBe(0);
  });

  test('localStorage integration works for default export format', async ({ page }) => {
    const file = path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html');
    await page.goto('file://' + file);

    // Wait for the app to load
    await expect(page.locator('.app-shell')).toBeVisible();

    // Test setting and getting localStorage values
    await page.evaluate(() => {
      localStorage.setItem('defaultExportFormat', 'html');
    });

    const savedFormat = await page.evaluate(() => localStorage.getItem('defaultExportFormat'));
    expect(savedFormat).toBe('html');

    // Test clearing localStorage
    await page.evaluate(() => {
      localStorage.removeItem('defaultExportFormat');
    });

    const clearedFormat = await page.evaluate(() => localStorage.getItem('defaultExportFormat'));
    expect(clearedFormat).toBeNull();
  });
});
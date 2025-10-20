const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test.describe('Electron: Sidebar resize via in-app helpers', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    // Launch the local Electron app using the installed electron binary
    // Use args: ['.'] to run the project root (package.json main should point to src/main.js)
    try {
      electronApp = await electron.launch({ args: ['.'], env: { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: 'true' } });

      // Wait for the first window with a timeout to avoid hanging tests
      const firstWindowPromise = electronApp.firstWindow();
      const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Timed out waiting for Electron window')), 10000));
      window = await Promise.race([firstWindowPromise, timeout]);
      await window.waitForLoadState('domcontentloaded', { timeout: 10000 });
    } catch (e) {
      console.error('Failed to launch Electron app in test:', e.message || e);
      throw e;
    }
  });

  test.afterAll(async () => {
    if (electronApp) {
      try {
        await electronApp.close();
      } catch (e) {
        // ignore
      }
    }
  });

  test('should let test helper set sidebar width and update layout', async () => {
    // Ensure main UI is visible
    await expect(window.locator('.app-shell')).toBeVisible();

    // Wait a short while for initialization hooks to attach helpers
    await window.waitForTimeout(200);

    const initialWidth = await window.evaluate(() => {
      return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260;
    });

    // Probe for the test helper; wait a moment if it's not immediately present
    let helperExists = await window.evaluate(() => !!window.__nta_test_setSidebarWidth);
    if (!helperExists) {
      await window.waitForTimeout(300);
      helperExists = await window.evaluate(() => !!window.__nta_test_setSidebarWidth);
    }

    expect(helperExists).toBeTruthy();

    // Use the in-app helper to set a larger width
    const target = initialWidth + 100;
    const ok = await window.evaluate((t) => {
      try {
        return !!window.__nta_test_setSidebarWidth(t);
      } catch (e) {
        return false;
      }
    }, target);

    expect(ok).toBeTruthy();

    // Allow layout to settle
    await window.waitForTimeout(80);

    const finalWidth = await window.evaluate(() => {
      return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260;
    });

    expect(finalWidth).toBeGreaterThan(initialWidth);

    // Also assert explorer element resized in layout
    const explorerWidth = await window.evaluate(() => document.querySelector('.explorer')?.getBoundingClientRect().width || 0);
    expect(explorerWidth).toBeGreaterThan(0);
    expect(explorerWidth).toBeGreaterThan(initialWidth - 10);
  });
});

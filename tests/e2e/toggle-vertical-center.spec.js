const { test, expect } = require('@playwright/test');
const { _electron } = require('playwright');
const path = require('path');
const fs = require('fs');

test.setTimeout(120000);

test('Toggle buttons centered vertically on visible handle when terminal opens', async () => {
  let electronApp = null;
  let page = null;
  const screenshotDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  try {
    let electronBinary = null;
    try { electronBinary = require('electron'); } catch (_) {}
    const launchOpts = { args: ['.'], env: { ...process.env, NTA_FORCE_QUIT: '1' } };
    if (electronBinary) launchOpts.executablePath = electronBinary;
    electronApp = await _electron.launch(launchOpts);
    const wins = await electronApp.windows();
    if (!wins || wins.length === 0) throw new Error('no renderer windows');
    page = wins[0];
  } catch (err) {
    test.skip();
    return;
  }

  const utils = require('./test-utils');
  const safeBox = async (sel) => { try { const b = await utils.waitForStableBoundingBox(page, sel); return b || null; } catch (_) { return null; } };

  try {
    await page.waitForSelector('.app-shell', { timeout: 8000 });
    await utils.callUpdateAndWaitForMarker(page);

    // Ensure handle and toggle are present
    await page.waitForSelector('.sidebar-resize-handle', { timeout: 5000 });
    await page.waitForSelector('#toggle-sidebar-button, .toggle-sidebar-button', { timeout: 5000 });

    const toggleSelector = '#toggle-sidebar-button' in await page.evaluate(() => ({ has: !!document.getElementById('toggle-sidebar-button') })) ? '#toggle-sidebar-button' : '.toggle-sidebar-button';

    const handleBoxBefore = await safeBox('.sidebar-resize-handle');
    const toggleBoxBefore = await safeBox(toggleSelector);
    if (!handleBoxBefore || !toggleBoxBefore) {
      await page.screenshot({ path: path.join(screenshotDir, 'toggle-center-before-missing.png') });
      throw new Error('Missing bounding boxes before test');
    }

    const handleCenterBefore = handleBoxBefore.y + handleBoxBefore.height / 2;
    const toggleCenterBefore = toggleBoxBefore.y + toggleBoxBefore.height / 2;
    const diffBefore = Math.abs(handleCenterBefore - toggleCenterBefore);
    // Allow a small tolerance for differences across platforms
    expect(diffBefore).toBeLessThanOrEqual(12);

    // Simulate terminal open
    await page.evaluate(() => {
      document.documentElement.style.setProperty('--terminal-height', '240px');
      document.documentElement.classList.add('terminal-visible');
    });
    await utils.callUpdateAndWaitForMarker(page);
    await page.waitForTimeout(100);

    const handleBoxAfter = await safeBox('.sidebar-resize-handle');
    const toggleBoxAfter = await safeBox(toggleSelector);
    if (!handleBoxAfter || !toggleBoxAfter) {
      await page.screenshot({ path: path.join(screenshotDir, 'toggle-center-after-missing.png') });
      throw new Error('Missing bounding boxes after terminal open');
    }

    const handleCenterAfter = handleBoxAfter.y + handleBoxAfter.height / 2;
    const toggleCenterAfter = toggleBoxAfter.y + toggleBoxAfter.height / 2;
    const diffAfter = Math.abs(handleCenterAfter - toggleCenterAfter);
    expect(diffAfter).toBeLessThanOrEqual(12);

    // And handle height should be smaller after terminal opened
    expect(handleBoxAfter.height).toBeLessThan(handleBoxBefore.height);

  } finally {
    try { if (page && !page.isClosed()) await page.close(); } catch (_) {}
    try { if (electronApp && typeof electronApp.close === 'function') await electronApp.close(); } catch (_) {}
  }
});

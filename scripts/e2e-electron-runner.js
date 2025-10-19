const { _electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const screenshotDir = path.join(__dirname, '../test-results');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  console.log('Launching Electron...');
  let electronApp = null;
  try {
    const electronBinary = (() => { try { return require('electron'); } catch (e) { return null; } })();
    const launchOpts = { args: ['.'], env: { ...process.env } };
    if (electronBinary) launchOpts.executablePath = electronBinary;
    console.log('Launch options:', Object.assign({}, launchOpts, { executablePath: !!launchOpts.executablePath }));
    electronApp = await _electron.launch(launchOpts);
    const wins = await electronApp.windows();
    if (!wins || wins.length === 0) throw new Error('No renderer windows');
    const page = wins[0];

    await page.waitForSelector('.app-shell', { timeout: 5000 });
    await page.waitForTimeout(250);

    const safeBox = async (locator) => {
      try { const b = await locator.boundingBox(); return b || null; } catch (e) { return null; }
    };

    const appShell = page.locator('.app-shell');
    const workspaceContent = page.locator('.workspace__content');
    const previewPane = page.locator('.preview-pane');

    const appBox = await safeBox(appShell);
    const contentBox = await safeBox(workspaceContent);
    const previewBox = await safeBox(previewPane);

    console.log('appBox', appBox && appBox.width, 'previewBox', previewBox && previewBox.width);

    // Make editor larger via app API if available
    try {
      await page.evaluate(() => { if (typeof window.setEditorRatio === 'function') window.setEditorRatio(0.85, false); });
      await page.evaluate(() => { try { if (typeof window.applyEditorRatio === 'function') window.applyEditorRatio(); } catch (e) {} return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))); });
      await page.waitForTimeout(300);
    } catch (e) { console.log('set ratio failed', e && e.message); }

    const appBoxAfter = await safeBox(appShell);
    const contentBoxAfter = await safeBox(workspaceContent);
    const gapAfter = (appBoxAfter.x + appBoxAfter.width) - (contentBoxAfter.x + contentBoxAfter.width);
    console.log('gapAfter (px):', gapAfter);

    // Write screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'electron-runner-after.png') });

    console.log('Finished steps, closing Electron...');
    await electronApp.close();
    process.exit(gapAfter <= 1 ? 0 : 2);
  } catch (err) {
    console.error('Runner failed:', err && err.stack || err);
    if (electronApp && typeof electronApp.close === 'function') {
      try { await electronApp.close(); } catch (e) {}
    }
    process.exit(1);
  }
})();
const { test, expect } = require('@playwright/test');
const { _electron } = require('playwright');
const path = require('path');
const fs = require('fs');

test.setTimeout(120000);

test('Right sidebar toggle: anchored to workspace splitter and pins to right edge when collapsed; unaffected by left sidebar resize', async () => {
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

  const safeBox = async (locator) => { try { return (await locator.boundingBox()) || null; } catch (_) { return null; } };
  const utils = require('./test-utils');

  try {
    await page.waitForSelector('.app-shell', { timeout: 8000 });
    await page.waitForTimeout(120);

    const appShell = page.locator('.app-shell');
    const splitter = page.locator('.workspace__splitter');
    const toggle = page.locator('#toggle-preview-button');

    // Minimal diagnostics only (keep test output small)

  // Wait for elements to be present in the DOM (visible state may vary by layout)
  await page.waitForSelector('.workspace__splitter', { state: 'attached', timeout: 5000 });
  await page.waitForSelector('#toggle-preview-button', { state: 'attached', timeout: 5000 });

  // Ensure preview is expanded for deterministic layout before measuring
  await page.evaluate(() => { try { if (typeof applyPreviewState === 'function') applyPreviewState(false); else document.querySelector('.workspace__content')?.classList.remove('preview-collapsed'); } catch (e) {} });
  // Ask renderer to recalc and wait for marker, then wait for stable boxes
  await utils.callUpdateAndWaitForMarker(page);
  await utils.waitForStableBoundingBox(page, '.workspace__splitter');
  await utils.waitForStableBoundingBox(page, '#toggle-preview-button');

  const centersClose = (a, b, tol = 60) => Math.abs((a.x + a.width/2) - (b.x + b.width/2)) <= tol;

    // 1) When preview is expanded, toggle should be centered on the splitter
    const splitBox = await utils.waitForStableBoundingBox(page, '.workspace__splitter');
    const toggleBox = await utils.waitForStableBoundingBox(page, '#toggle-preview-button');
    if (!splitBox || !toggleBox) throw new Error('missing boxes for splitter/toggle (initial)');
    await page.screenshot({ path: path.join(screenshotDir, 'right-toggle-initial.png') });
    if (!centersClose(splitBox, toggleBox, 60)) {
      fs.writeFileSync(path.join(screenshotDir, 'right-toggle-initial-diag.json'), JSON.stringify({ splitBox, toggleBox }, null, 2));
      throw new Error('right toggle not centered on workspace splitter (initial)');
    }

    // 2) Resize left sidebar (should not move right toggle)
  const helperOk = await page.evaluate(() => !!window.__nta_test_setSidebarWidth);
    if (helperOk) {
      await page.evaluate(() => { window.__nta_test_setSidebarWidth(360); });
    } else {
      await page.evaluate(() => { document.documentElement.style.setProperty('--sidebar-width', '360px'); });
    }
    await utils.callUpdateAndWaitForMarker(page);
    const splitBoxAfterLeft = await utils.waitForStableBoundingBox(page, '.workspace__splitter');
    const toggleBoxAfterLeft = await utils.waitForStableBoundingBox(page, '#toggle-preview-button');
    await page.screenshot({ path: path.join(screenshotDir, 'right-toggle-after-left-resize.png') });
    if (!splitBoxAfterLeft || !toggleBoxAfterLeft) throw new Error('missing boxes after left resize');
    // ensure toggle remains centered on the splitter after left sidebar resize
    if (!centersClose(splitBoxAfterLeft, toggleBoxAfterLeft, 60)) {
      fs.writeFileSync(path.join(screenshotDir, 'right-toggle-after-left-resize-diag.json'), JSON.stringify({ splitBox: splitBoxAfterLeft, toggleBox: toggleBoxAfterLeft }, null, 2));
      throw new Error('right toggle not centered on splitter after left sidebar resize');
    }

  // 3) Collapse the preview via the app API (ensures classes and positioning helper run)
  await page.evaluate(() => { try { if (typeof applyPreviewState === 'function') { applyPreviewState(true); persistPreviewCollapsed(true); } } catch (e) {} });
  await utils.callUpdateAndWaitForMarker(page);
    const toggleBoxAfterCollapse = await utils.waitForStableBoundingBox(page, '#toggle-preview-button');
    const appBoxAfterCollapse = await utils.waitForStableBoundingBox(page, '.app-shell');
    await page.screenshot({ path: path.join(screenshotDir, 'right-toggle-after-collapse.png') });
    if (!toggleBoxAfterCollapse || !appBoxAfterCollapse) throw new Error('missing boxes after collapse');
    const rightGap = (appBoxAfterCollapse.x + appBoxAfterCollapse.width) - (toggleBoxAfterCollapse.x + toggleBoxAfterCollapse.width);
    // expect toggle within ~30px of right edge
    if (rightGap > 30) {
      fs.writeFileSync(path.join(screenshotDir, 'right-toggle-after-collapse-diag.json'), JSON.stringify({ toggleBox, appBoxAfterCollapse, rightGap }, null, 2));
      throw new Error('right toggle not pinned to right edge after collapse');
    }

  // 4) Re-open preview via app API and ensure toggle re-centers on splitter
  await page.evaluate(() => { try { if (typeof applyPreviewState === 'function') { applyPreviewState(false); persistPreviewCollapsed(false); } } catch (e) {} });
  await utils.callUpdateAndWaitForMarker(page);
    const splitBoxAfterReopen = await utils.waitForStableBoundingBox(page, '.workspace__splitter');
    const toggleBoxAfterReopen = await utils.waitForStableBoundingBox(page, '#toggle-preview-button');
    await page.screenshot({ path: path.join(screenshotDir, 'right-toggle-after-reopen.png') });
    if (!splitBoxAfterReopen || !toggleBoxAfterReopen) throw new Error('missing boxes after reopen');
    if (!centersClose(splitBoxAfterReopen, toggleBoxAfterReopen, 60)) {
      fs.writeFileSync(path.join(screenshotDir, 'right-toggle-after-reopen-diag.json'), JSON.stringify({ splitBox: splitBoxAfterReopen, toggleBox: toggleBoxAfterReopen }, null, 2));
      throw new Error('right toggle not re-centered on splitter after reopen');
    }

  } finally {
    try { if (page && !page.isClosed()) await page.close(); } catch (_) {}
    try { if (electronApp && typeof electronApp.close === 'function') await electronApp.close(); } catch (_) {
      try { const proc = (typeof electronApp.process === 'function') ? electronApp.process() : (electronApp._childProcess || null); if (proc && proc.pid) { try { process.kill(proc.pid, 'SIGTERM'); } catch (_) {} } } catch (_) {}
    }
  }
});

const { test, expect } = require('@playwright/test');
// Use Playwright's electron launcher (from the playwright package)
const { _electron } = require('playwright');
const path = require('path');
const fs = require('fs');

// Keep a reasonable timeout for e2e operations
test.setTimeout(120000);

test('Left sidebar toggle: anchored to resize handle and pins to left edge when collapsed; unaffected by right pane resize', async () => {
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
    const sidebarHandle = page.locator('.sidebar-resize-handle');
    const toggle = page.locator('#toggle-sidebar-button');

    // Sanity
    const appBox = await safeBox(appShell);
    expect(appBox).not.toBeNull();

  // Wait for elements to be attached (they may be present but hidden until UI settles)
  await page.waitForSelector('.sidebar-resize-handle', { timeout: 5000, state: 'attached' });
  await page.waitForSelector('#toggle-sidebar-button', { timeout: 5000, state: 'attached' });

  await page.waitForTimeout(100);
    // Ask renderer to recompute layout (helps if handles are initially hidden) and wait for marker
    await utils.callUpdateAndWaitForMarker(page);
    // If the sidebar handle is hidden (app may start collapsed), expand it so we have a consistent starting state
    const handleDisplay = await page.evaluate(() => {
      const el = document.querySelector('.sidebar-resize-handle');
      return el ? window.getComputedStyle(el).display : null;
    });
    if (!handleDisplay || handleDisplay === 'none') {
      // click the toggle to open the sidebar
      await page.click('#toggle-sidebar-button');
      await utils.callUpdateAndWaitForMarker(page);
    }

    // Helper to compare centers (px tolerance)
  const centersClose = (a, b, tol = 14) => Math.abs((a.x + a.width/2) - (b.x + b.width/2)) <= tol;

    // 1) When sidebar is expanded the toggle should sit on the handle
    // Wait until the handle and toggle have stable bounding boxes before measuring
    const handleBox = await utils.waitForStableBoundingBox(page, '.sidebar-resize-handle');
    const toggleBox = await utils.waitForStableBoundingBox(page, '#toggle-sidebar-button');
    if (!handleBox || !toggleBox) {
      // Collect richer diagnostics to help root-cause hidden/zero-sized elements
      const diag = await page.evaluate(() => {
        const sel = ['.sidebar-resize-handle', '#toggle-sidebar-button'];
        return sel.map(s => {
          const el = document.querySelector(s);
          if (!el) return { selector: s, exists: false };
          const style = window.getComputedStyle(el) || {};
          const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
          return {
            selector: s,
            exists: true,
            attached: document.contains(el),
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            rect: r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null,
            offsetWidth: el.offsetWidth,
            offsetHeight: el.offsetHeight,
            className: el.className || null,
          };
        });
      });
      await page.screenshot({ path: path.join(screenshotDir, 'left-toggle-initial-debug.png') });
      fs.writeFileSync(path.join(screenshotDir, 'left-toggle-initial-debug.json'), JSON.stringify({ handleBox, toggleBox, diag }, null, 2));
      throw new Error('missing boxes for handle/toggle (initial) — see left-toggle-initial-debug.json');
    }
    await page.screenshot({ path: path.join(screenshotDir, 'left-toggle-initial.png') });
    if (!centersClose(handleBox, toggleBox, 14)) {
      fs.writeFileSync(path.join(screenshotDir, 'left-toggle-initial-diag.json'), JSON.stringify({ handleBox, toggleBox }, null, 2));
      throw new Error('left toggle not centered on sidebar handle (initial)');
    }

    // 2) Resize left sidebar wider and verify toggle still on handle
    // Use test helper if available
    const helperOk = await page.evaluate(() => !!window.__nta_test_setSidebarWidth);
    if (helperOk) {
      await page.evaluate(() => { window.__nta_test_setSidebarWidth(360); });
    } else {
      // fallback: adjust CSS var (best-effort)
      await page.evaluate(() => { document.documentElement.style.setProperty('--sidebar-width', '360px'); });
    }
    // Trigger a layout recalculation in the renderer and wait for it
    await utils.callUpdateAndWaitForMarker(page);
    const handleBoxAfter = await utils.waitForStableBoundingBox(page, '.sidebar-resize-handle');
    const toggleBoxAfter = await utils.waitForStableBoundingBox(page, '#toggle-sidebar-button');
    await page.screenshot({ path: path.join(screenshotDir, 'left-toggle-after-left-resize.png') });
    if (!handleBoxAfter || !toggleBoxAfter) throw new Error('missing boxes for handle/toggle (after left resize)');
    if (!centersClose(handleBoxAfter, toggleBoxAfter, 14)) {
      fs.writeFileSync(path.join(screenshotDir, 'left-toggle-after-left-resize-diag.json'), JSON.stringify({ handleBox: handleBoxAfter, toggleBox: toggleBoxAfter }, null, 2));
      throw new Error('left toggle not centered on sidebar handle after left resize');
    }

    // 3) Now collapse the left sidebar by clicking the toggle and verify it moves to the left edge
  await toggle.click();
  // Wait until the app reflects the sidebar collapsed state (class on .app-shell).
  // If the click didn't take (overlay or timing), fall back to calling the toggle function directly.
  try {
    await page.waitForFunction(() => {
      const root = document.querySelector('.app-shell');
      return !!(root && root.classList && root.classList.contains('sidebar-collapsed'));
    }, { timeout: 2000 });
  } catch (e) {
    // fallback: call the renderer's toggle if available and wait again
    await page.evaluate(() => { try { if (typeof toggleSidebarCollapsed === 'function') toggleSidebarCollapsed(); else { const btn = document.getElementById('toggle-sidebar-button'); if (btn) btn.click(); } } catch (err) {} });
    await page.waitForFunction(() => {
      const root = document.querySelector('.app-shell');
      return !!(root && root.classList && root.classList.contains('sidebar-collapsed'));
    }, { timeout: 5000 });
  }
  // Allow renderer to finish layout work then wait until bounding box stabilizes
  await page.waitForTimeout(80);
  const toggleBoxAfterCollapse = await utils.waitForStableBoundingBox(page, '#toggle-sidebar-button');
  const appBoxAfterCollapse = await utils.waitForStableBoundingBox(page, '.app-shell');
  await page.screenshot({ path: path.join(screenshotDir, 'left-toggle-after-collapse.png') });
  if (!toggleBoxAfterCollapse || !appBoxAfterCollapse) throw new Error('missing boxes after collapse');
  const leftOffset = toggleBoxAfterCollapse.x - appBoxAfterCollapse.x;
  // Expect pinned within ~30px of left edge (allowing environment differences)
  if (leftOffset > 30) {
      // collect diag
      fs.writeFileSync(path.join(screenshotDir, 'left-toggle-after-collapse-diag.json'), JSON.stringify({ toggleBox, appBoxAfterCollapse, leftOffset }, null, 2));
      throw new Error('left toggle not pinned to left edge after collapse');
    }

    // 4) Re-expand sidebar to original state so we can test right-pane resize independence
  await toggle.click();
  await utils.callUpdateAndWaitForMarker(page);
  const handleBoxReopen = await utils.waitForStableBoundingBox(page, '.sidebar-resize-handle');
  const toggleBoxReopen = await utils.waitForStableBoundingBox(page, '#toggle-sidebar-button');
  if (!handleBoxReopen || !toggleBoxReopen) throw new Error('missing boxes after re-open');

  const toggleCenterBeforeRightResize = (toggleBoxReopen.x + toggleBoxReopen.width/2);

    // 5) Resize right pane (editor ratio) and verify left toggle did not move significantly
    const applied = await page.evaluate(() => { try { if (typeof window.setEditorRatio === 'function') { window.setEditorRatio(0.7, false); return true; } return false; } catch (e) { return false; } });
    if (!applied) {
      // fallback: tweak CSS variable used for editor width
      await page.evaluate(() => { document.documentElement.style.setProperty('--local-editor-ratio', '0.7'); });
    }
  await utils.callUpdateAndWaitForMarker(page);
  const toggleBoxAfterRightResize = await utils.waitForStableBoundingBox(page, '#toggle-sidebar-button');
  if (!toggleBoxAfterRightResize) throw new Error('missing toggle box after right resize');
  const toggleCenterAfterRightResize = (toggleBoxAfterRightResize.x + toggleBoxAfterRightResize.width/2);
    const shift = Math.abs(toggleCenterAfterRightResize - toggleCenterBeforeRightResize);
    await page.screenshot({ path: path.join(screenshotDir, 'left-toggle-after-right-resize.png') });
  if (shift > 12) {
      fs.writeFileSync(path.join(screenshotDir, 'left-toggle-after-right-resize-diag.json'), JSON.stringify({ toggleCenterBeforeRightResize, toggleCenterAfterRightResize, shift }, null, 2));
      throw new Error('left toggle moved due to right pane resize');
    }

  } finally {
    try { if (page && !page.isClosed()) await page.close(); } catch (_) {}
    try { if (electronApp && typeof electronApp.close === 'function') await electronApp.close(); } catch (_) {
      try { const proc = (typeof electronApp.process === 'function') ? electronApp.process() : (electronApp._childProcess || null); if (proc && proc.pid) { try { process.kill(proc.pid, 'SIGTERM'); } catch (_) {} } } catch (_) {}
    }
  }
});

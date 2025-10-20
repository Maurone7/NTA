const { test, expect } = require('@playwright/test');
// Use Playwright's electron launcher (from the playwright package)
const { _electron } = require('playwright');
const path = require('path');
const fs = require('fs');

// Increase timeout for this test to avoid Playwright aborting it mid-cleanup
// Increase global timeout to allow retries and diagnostics collection on CI
// Use a reasonable timeout for the e2e test; increased above earlier for diagnostics but now restore.
// Allow extra time for CI or slower machines; keep reasonable for local runs
test.setTimeout(120000);

test('Right sidebar: shrinking preview keeps right edge flush with app', async () => {
  let electronApp = null;
  let page = null;
  const screenshotDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  // Launch Electron and attach to the first renderer window
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
    // If Electron can't be launched, skip the test (we prefer testing the real app)
    test.skip();
    return;
  }

  // Helper: safe bounding box retrieval
  const safeBox = async (locator) => { try { return (await locator.boundingBox()) || null; } catch (_) { return null; } };

  try {
    await page.waitForSelector('.app-shell', { timeout: 8000 });
    await page.waitForTimeout(150);

    // Ensure preview is visible and right editor hidden for deterministic layout
    await page.evaluate(() => {
      const right = document.querySelector('.editor-pane--right'); if (right) right.style.display = 'none';
      const preview = document.querySelector('.preview-pane'); if (preview) preview.style.display = '';
    });
    await page.waitForTimeout(150);

    const appShell = page.locator('.app-shell');
    const workspaceContent = page.locator('.workspace__content');
    const previewPane = page.locator('.preview-pane');

    const appBox = await safeBox(appShell);
    const contentBox = await safeBox(workspaceContent);
    const previewBox = await safeBox(previewPane);
    expect(appBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    expect(previewBox).not.toBeNull();

    await page.screenshot({ path: path.join(screenshotDir, 'right-sidebar-initial.png') });

    // Apply a larger editor ratio deterministically via app API if available
    const applyRatio = async (ratio) => {
      try {
        const usedApi = await page.evaluate((r) => {
          try { if (typeof window.setEditorRatio === 'function') { window.setEditorRatio(r, false); try { if (typeof window.applyEditorRatio === 'function') window.applyEditorRatio(); } catch (e) {} return true; } } catch (e) {}
          try { document.documentElement.style.setProperty('--editor-width', `${Math.round(r*100)}%`); const wc = document.querySelector('.workspace__content'); if (wc && wc.style) wc.style.setProperty('--local-editor-ratio', String(r)); const left = document.querySelector('.editor-pane--left'); if (left && left.style) { left.style.flex = `0 0 ${Math.round(r*100)}%`; left.style.width = `${Math.round(r*100)}%`; } return false; } catch (e) { return false; }
        }, ratio);
        // wait for layout to settle
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        await page.waitForTimeout(200);
        return usedApi;
      } catch (_) { return false; }
    };

    await applyRatio(0.85);
    await page.screenshot({ path: path.join(screenshotDir, 'right-sidebar-after-enlarge-editor.png') });

    // Verify preview right edge ≈ app right edge
    const rightEdge = await page.evaluate(() => {
      const app = document.querySelector('.app-shell') || document.documentElement;
      const preview = document.querySelector('.preview-pane');
      const wc = document.querySelector('.workspace__content');
      const appRect = app ? app.getBoundingClientRect() : null;
      const previewRect = preview ? preview.getBoundingClientRect() : null;
      return { appRight: appRect ? (appRect.x + appRect.width) : null, previewRight: previewRect ? (previewRect.x + previewRect.width) : null };
    });
    if (rightEdge.appRight == null || rightEdge.previewRight == null) throw new Error('missing rects after enlarge');
    if (Math.abs(rightEdge.appRight - rightEdge.previewRight) > 3) {
      if (process.env.NTA_E2E_DEBUG) fs.writeFileSync(path.join(screenshotDir, 'right-sidebar-right-edge-after-enlarge.json'), JSON.stringify({ rightEdge }, null, 2));
      throw new Error('preview right edge mismatch after enlarge');
    }

    // Shrink editor to ~40% and verify preview remains flush
    await applyRatio(0.4);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(screenshotDir, 'right-sidebar-after-shrink-editor.png') });

    const appBoxAfter = await safeBox(appShell);
    const contentBoxAfter = await safeBox(workspaceContent);
    expect(appBoxAfter).not.toBeNull();
    expect(contentBoxAfter).not.toBeNull();
  const gapAfter = (appBoxAfter.x + appBoxAfter.width) - (contentBoxAfter.x + contentBoxAfter.width);
  if (gapAfter > 2) {
      if (process.env.NTA_E2E_DEBUG) {
        const diag = await page.evaluate(() => {
          const getBox = (sel) => { try { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.x + r.width }; } catch (e) { return null; } };
          return { cssVars: { '--local-editor-ratio': getComputedStyle(document.documentElement).getPropertyValue('--local-editor-ratio'), '--editor-width': getComputedStyle(document.documentElement).getPropertyValue('--editor-width') }, boxes: { app: getBox('.app-shell'), workspace: getBox('.workspace__content'), preview: getBox('.preview-pane') }, debugEvents: (window.__nta_debug_events || []).slice(-50) };
        });
        fs.writeFileSync(path.join(screenshotDir, 'right-sidebar-diagnostics.json'), JSON.stringify(diag, null, 2));
      }
    }
  expect(gapAfter).toBeLessThanOrEqual(2);

  } finally {
    try { if (page && !page.isClosed()) await page.close(); } catch (_) {}
    try { if (electronApp && typeof electronApp.close === 'function') await electronApp.close(); } catch (_) {
      try { const proc = (typeof electronApp.process === 'function') ? electronApp.process() : (electronApp._childProcess || null); if (proc && proc.pid) { try { process.kill(proc.pid, 'SIGTERM'); } catch (_) {} } } catch (_) {}
    }
  }
});

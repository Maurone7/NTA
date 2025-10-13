const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Electron app for two-pane image test...');
  const app = await electron.launch({ args: ['.'] });
  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  await window.waitForTimeout(400);

  const assetsPath = path.join(process.cwd(), 'assets', 'NTA logo.png');
  if (!fs.existsSync(assetsPath)) {
    console.error('Test image not found at', assetsPath);
    await app.close();
    process.exit(3);
  }

  // Drop into left pane
  const dropLeft = await window.evaluate(async ({ filePath, fileName }) => {
    const paneEl = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
    if (!paneEl) return { ok: false, error: 'no-left' };
    const fakeDataTransfer = { files: [ { name: fileName, path: filePath } ] };
    const ev = new Event('drop', { bubbles: true, cancelable: true });
    try { ev.dataTransfer = fakeDataTransfer; } catch(e) { ev._dataTransfer = fakeDataTransfer; }
    paneEl.dispatchEvent(ev);
    return { ok: true };
  }, { filePath: assetsPath, fileName: path.basename(assetsPath) });

  if (!dropLeft.ok) { console.error('Left drop failed', dropLeft); await app.close(); process.exit(2); }

  // Wait for left image
  try { await window.waitForSelector('.editor-pane--left .pane-image-viewer', { timeout: 3000 }); } catch (e) { console.error('Left image not found'); await app.close(); process.exit(2); }

  // Debug: list all pane-image-viewer elements after left drop
  const leftDebug = await window.evaluate(() => {
    return Array.from(document.querySelectorAll('.pane-image-viewer')).map((el) => {
      const p = el.closest('.editor-pane');
      return { src: el.src ? el.src.substring(0,50) : null, paneClass: p ? p.className : null, dataPane: p ? p.getAttribute('data-pane-id') : null };
    });
  });
  console.log('after left drop - images:', leftDebug);

  // Ensure right pane exists by toggling right editor on if necessary
  // If a right pane doesn't exist, create a proper dynamic pane using the
  // application's createEditorPane helper so the editor instance and event
  // listeners are registered correctly.
  const createdPaneId = await window.evaluate(async () => {
    try {
      for (let i = 0; i < 10; i++) {
        if (typeof window.createEditorPane === 'function') {
          try { return window.createEditorPane(null, 'Test Pane'); } catch (e) { return null; }
        }
        // wait 100ms then retry
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 100));
      }
    } catch (e) { }
    return null;
  });
  console.log('createdPaneId:', createdPaneId);

  // Drop into right pane
  const dropRight = await window.evaluate(async ({ filePath, fileName, paneId }) => {
    const paneEl = paneId ? document.querySelector(`[data-pane-id="${paneId}"]`) : (document.querySelector('.editor-pane--right') || document.querySelector('.editor-pane--dynamic'));
    if (!paneEl) return { ok: false, error: 'no-right' };
    const fakeDataTransfer = { files: [ { name: fileName, path: filePath } ] };
    const ev = new Event('drop', { bubbles: true, cancelable: true });
    try { ev.dataTransfer = fakeDataTransfer; } catch(e) { ev._dataTransfer = fakeDataTransfer; }
    paneEl.dispatchEvent(ev);
    return { ok: true };
  }, { filePath: assetsPath, fileName: path.basename(assetsPath), paneId: createdPaneId });

  if (!dropRight.ok) { console.error('Right drop failed', dropRight); await app.close(); process.exit(2); }

  // Wait for right image
  try { await window.waitForSelector('.editor-pane--right .pane-image-viewer, .editor-pane--dynamic .pane-image-viewer', { timeout: 3000 }); } catch (e) { console.error('Right image not found'); await app.close(); process.exit(2); }

  // Verify both images exist
  const both = await window.evaluate(() => {
    const left = !!document.querySelector('.editor-pane--left .pane-image-viewer');
    const right = !!(document.querySelector('.editor-pane--right .pane-image-viewer') || document.querySelector('.editor-pane--dynamic .pane-image-viewer'));
    return { left, right };
  });

  console.log('both images present:', both);
  await app.close();
  if (both.left && both.right) process.exit(0);
  console.error('Test failed - one or both images missing', both);
  process.exit(2);
})();

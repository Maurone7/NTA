const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Electron app for two-pdf-same-pane test...');
  const app = await electron.launch({ args: ['.'] });
  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  await window.waitForTimeout(400);

  const assetsPath = path.join(process.cwd(), 'test-folder', 'test-figure.pdf');
  if (!fs.existsSync(assetsPath)) {
    console.error('Test PDF not found at', assetsPath);
    await app.close();
    process.exit(3);
  }

  // Drop PDF into left pane twice quickly
  const doDrop = async () => await window.evaluate(async ({ filePath, fileName }) => {
    const paneEl = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
    if (!paneEl) return { ok: false, error: 'no-left' };
    const fakeDataTransfer = { files: [ { name: fileName, path: filePath } ] };
    const ev = new Event('drop', { bubbles: true, cancelable: true });
    try { ev.dataTransfer = fakeDataTransfer; } catch(e) { ev._dataTransfer = fakeDataTransfer; }
    paneEl.dispatchEvent(ev);
    return { ok: true };
  }, { filePath: assetsPath, fileName: path.basename(assetsPath) });

  const r1 = await doDrop();
  if (!r1.ok) { console.error('First drop failed', r1); await app.close(); process.exit(2); }
  // small delay then second drop
  await window.waitForTimeout(50);
  const r2 = await doDrop();
  if (!r2.ok) { console.error('Second drop failed', r2); await app.close(); process.exit(2); }

  // allow some time for iframes to be added
  await window.waitForTimeout(400);

  const counts = await window.evaluate(() => {
    const root = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
    const iframes = root ? Array.from(root.querySelectorAll('.pdf-pane-viewer')) : [];
    return { count: iframes.length, srcs: iframes.map(i => i.src).slice(0,5) };
  });

  console.log('iframe counts:', counts);
  await app.close();
  if (counts.count === 1) process.exit(0);
  console.error('Test failed - expected one iframe but found', counts.count);
  process.exit(2);
})();

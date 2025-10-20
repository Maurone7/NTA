const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Electron app for open-image-in-pane test...');
  const app = await electron.launch({ args: ['.'] });

  const window = await app.firstWindow();
  if (!window) {
    console.error('No app window detected');
    await app.close();
    process.exit(3);
  }

  await window.waitForLoadState('domcontentloaded');
  await window.waitForTimeout(400);

  // Determine an image to test with
  const assetsPath = path.join(process.cwd(), 'assets', 'NTA logo.png');
  if (!fs.existsSync(assetsPath)) {
    console.error('Test image not found at', assetsPath);
    await app.close();
    process.exit(4);
  }

  // Create a note object for the image
  const imageNote = {
    id: `test-open-image-${Date.now()}`,
    title: 'Test Open Image',
    type: 'image',
    absolutePath: assetsPath,
    folderPath: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Instead of relying on removed test helpers, perform a synthetic drop into
  // the left pane which exercises the same code path used by users.
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

  // Wait for the image to appear and load
  let hasImg = { found: false };
  try {
    await window.waitForSelector('img.pane-image-viewer', { timeout: 3000 });
    const loaded = await window.evaluate(() => {
      const img = document.querySelector('img.pane-image-viewer');
      if (!img) return { found: false };
      if (img.complete && img.naturalWidth > 0) return { found: true, src: img.src };
      return new Promise((resolve) => {
        const onLoad = () => { cleanup(); resolve({ found: true, src: img.src }); };
        const onError = () => { cleanup(); resolve({ found: false }); };
        function cleanup() { img.removeEventListener('load', onLoad); img.removeEventListener('error', onError); }
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
      });
    });
    hasImg = loaded;
  } catch (e) {
    hasImg = { found: false };
  }

  console.log('open-image-in-pane test image check:', hasImg);

  await app.close();
  if (hasImg?.found) {
    console.log('Open-image-in-pane test passed');
    process.exit(0);
  } else {
    console.error('Open-image-in-pane test failed: image not found or not loaded');
    process.exit(2);
  }
})();
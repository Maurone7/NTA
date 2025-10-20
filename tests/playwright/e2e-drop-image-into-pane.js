const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Electron app via Playwright for drop-image-into-pane test...');
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

  console.log('Dispatching synthetic drop event into left editor pane...');

  // Dispatch a synthetic drop event whose dataTransfer.files contains an array
  // with a path property (Electron handler reads file.path). We dispatch the
  // event on the left editor pane element so the app's registered drop
  // listeners process it like a real external file drop.
  const dropResult = await window.evaluate(async (payload) => {
    try {
      const { filePath, fileName } = payload;
      const paneEl = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
      if (!paneEl) return { ok: false, error: 'no-pane' };

      // Build a minimal fake DataTransfer-like object expected by handlers
      const fakeDataTransfer = { files: [ { name: fileName, path: filePath } ] };

      // Create a Drop event and attach the fake dataTransfer
      const ev = new Event('drop', { bubbles: true, cancelable: true });
      try { ev.dataTransfer = fakeDataTransfer; } catch (e) { /* some envs may not allow assignment, but usually ok */ ev._dataTransfer = fakeDataTransfer; }

      // Dispatch on the pane element
      paneEl.dispatchEvent(ev);

      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }, { filePath: assetsPath, fileName: path.basename(assetsPath) });

  console.log('drop dispatched:', dropResult);

  // Wait up to 4s for either an image viewer to appear and load, or for
  // the left textarea to contain markdown with the filename (fallback).
  let success = false;
  let details = null;

  try {
    // First try to find a pane image
    await window.waitForSelector('img.pane-image-viewer', { timeout: 3000 });
    // Wait until image has loaded (naturalWidth > 0 or load event)
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

    if (loaded?.found) {
      success = true;
      details = { type: 'image', src: loaded.src };
    }
  } catch (e) {
    // timed out looking for image - try textarea markdown fallback
  }

  if (!success) {
    try {
      // Read left textarea value
      const taVal = await window.evaluate(() => {
        const ta = document.querySelector('.editor-pane--left textarea') || document.querySelector('.editor-pane textarea');
        return ta ? ta.value : null;
      });

      if (typeof taVal === 'string' && taVal.includes('![') && taVal.includes('](')) {
        success = true;
        details = { type: 'markdown', value: taVal };
      }
    } catch (e) {
      // ignore
    }
  }

  await app.close();

  if (success) {
    console.log('Drop-image-into-pane test passed', details);
    process.exit(0);
  }

  console.error('Drop-image-into-pane test failed', { dropResult, details });
  process.exit(2);
})();

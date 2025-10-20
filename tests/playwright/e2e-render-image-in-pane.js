const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Electron app via Playwright for image-in-pane test...');
  const app = await electron.launch({ args: ['.'] });

  const window = await app.firstWindow();
  if (!window) {
    console.error('No app window detected');
    await app.close();
    process.exit(3);
  }

  await window.waitForLoadState('domcontentloaded');
  await window.waitForTimeout(400);

  // Wait for the left pane to exist
  await window.waitForSelector('.editor-pane--left', { timeout: 3000 });

  // Determine an image to test with
  const assetsPath = path.join(process.cwd(), 'assets', 'NTA logo.png');
  if (!fs.existsSync(assetsPath)) {
    console.error('Test image not found at', assetsPath);
    await app.close();
    process.exit(4);
  }

  // Prepare a note-like object referencing the asset path
  const note = {
    id: `test-image-${Date.now()}`,
    title: 'Test Image',
    type: 'image',
    absolutePath: assetsPath,
    folderPath: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Dispatch a synthetic drop into the left editor pane so we don't rely on
  // internal test helpers. This mirrors the real user flow for opening an
  // external image into a pane.
  console.log('Dispatching synthetic drop event into left editor pane...');
  // Record the pane bounding rect before the drop so we can assert the
  // pane doesn't resize after the image is opened.
  const preRect = await window.evaluate(() => {
    const pane = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
    if (!pane) return null;
    const r = pane.getBoundingClientRect();
    return { width: Math.round(r.width), height: Math.round(r.height) };
  });
  console.log('pane rect before drop:', preRect);

  const dropResult = await window.evaluate(async (payload) => {
    try {
      const { filePath, fileName } = payload;
      const paneEl = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
      if (!paneEl) return { ok: false, error: 'no-pane' };

      const fakeDataTransfer = { files: [ { name: fileName, path: filePath } ] };
      const ev = new Event('drop', { bubbles: true, cancelable: true });
      try { ev.dataTransfer = fakeDataTransfer; } catch (e) { ev._dataTransfer = fakeDataTransfer; }
      paneEl.dispatchEvent(ev);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }, { filePath: assetsPath, fileName: path.basename(assetsPath) });

  console.log('drop dispatched:', dropResult);

  // Wait up to 4s for the image to appear and load, falling back to markdown
  // fallback detection if the renderer couldn't produce an in-pane viewer.
  let hasImg = { found: false };
  try {
    await window.waitForSelector('img.pane-image-viewer', { timeout: 3000 });
    hasImg = await window.evaluate(() => {
      const img = document.querySelector('img.pane-image-viewer');
      if (!img) return { found: false };
      if (img.complete && img.naturalWidth > 0) return { found: true, complete: img.complete, naturalWidth: img.naturalWidth, src: img.src.substring(0, 80) + '...' };
      return new Promise((resolve) => {
        const onLoad = () => { cleanup(); resolve({ found: true, complete: true, naturalWidth: img.naturalWidth, src: img.src.substring(0, 80) + '...' }); };
        const onError = () => { cleanup(); resolve({ found: false }); };
        function cleanup() { img.removeEventListener('load', onLoad); img.removeEventListener('error', onError); }
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
      });
    });
  } catch (e) {
    // timed out waiting for an in-pane image
  }

  console.log('image-in-pane check:', hasImg);

  // Capture pane rect after the drop/load and compare with pre-drop size.
  const postRect = await window.evaluate(() => {
    const pane = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
    if (!pane) return null;
    const r = pane.getBoundingClientRect();
    return { width: Math.round(r.width), height: Math.round(r.height) };
  });
  console.log('pane rect after drop:', postRect);

  // If we found a loaded in-pane image, we're good. Otherwise try the
  // textarea markdown fallback before failing.
  let markdownFallback = null;
  if (!hasImg?.found) {
    try {
      const taVal = await window.evaluate(() => {
        const ta = document.querySelector('.editor-pane--left textarea') || document.querySelector('.editor-pane textarea');
        return ta ? ta.value : null;
      });
      markdownFallback = taVal;
    } catch (e) {
      markdownFallback = null;
    }
  }

  await app.close();

  // Allow a small tolerance (4px) for rounding/scrollbar differences.
  const TOLERANCE = 4;
  if (preRect && postRect) {
    const diffWidth = Math.abs(postRect.width - preRect.width);
    const diffHeight = Math.abs(postRect.height - preRect.height);
    if (diffWidth > TOLERANCE || diffHeight > TOLERANCE) {
      console.error('Pane size changed after opening image beyond tolerance', { preRect, postRect, diffWidth, diffHeight });
      process.exit(2);
    }
  }

  if (hasImg?.found) {
    process.exit(0);
  }

  if (typeof markdownFallback === 'string' && markdownFallback.includes('![') && markdownFallback.includes('](')) {
    console.log('Detected markdown fallback in textarea');
    process.exit(0);
  }

  console.error('Image-in-pane test failed', { dropResult, hasImg, markdownFallback, preRect, postRect });
  process.exit(2);
})();

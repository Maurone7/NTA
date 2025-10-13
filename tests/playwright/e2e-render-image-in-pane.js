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

  // Ensure there's at least one pane to render into; choose right if available
  const targetPane = await window.evaluate(() => {
    // prefer active editor pane or right or first editor-pane
    const r = (window.__nta_state && window.__nta_state.activeEditorPane) || 'right';
    return r;
  }).catch(() => 'right');

  // Invoke the test helper exposed by the renderer to render image in pane
  const rendered = await window.evaluate(async (payload) => {
    try {
      const { n, paneId } = payload;
      if (!window.__nta_test_helpers || typeof window.__nta_test_helpers.renderImageInPane !== 'function') return { ok: false, error: 'helper-missing' };
      const ok = await window.__nta_test_helpers.renderImageInPane(n, paneId);
      return { ok: Boolean(ok) };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }, { n: note, paneId: targetPane });

  console.log('render call result:', rendered);

  // Wait for the pane image element to appear and load
  let hasImg = { found: false };
  try {
    await window.waitForSelector('img.pane-image-viewer', { timeout: 3000 });

    // Wait until the image reports it has loaded (naturalWidth > 0 or complete)
    const loaded = await window.evaluate(() => {
      const img = document.querySelector('img.pane-image-viewer');
      if (!img) return { found: false };
      if (img.complete && img.naturalWidth > 0) return { found: true, paneId: img.closest('.editor-pane')?.getAttribute('data-pane-id') || (img.closest('.editor-pane')?.classList.contains('editor-pane--right') ? 'right' : (img.closest('.editor-pane')?.classList.contains('editor-pane--left') ? 'left' : null)), src: img.src };
      return new Promise((resolve) => {
        const onLoad = () => { cleanup(); resolve({ found: true, paneId: img.closest('.editor-pane')?.getAttribute('data-pane-id') || (img.closest('.editor-pane')?.classList.contains('editor-pane--right') ? 'right' : (img.closest('.editor-pane')?.classList.contains('editor-pane--left') ? 'left' : null)), src: img.src }); };
        const onError = () => { cleanup(); resolve({ found: false }); };
        function cleanup() { img.removeEventListener('load', onLoad); img.removeEventListener('error', onError); }
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
      });
    });

    hasImg = loaded;
  } catch (e) {
    // timeout or other error => treat as not found
    hasImg = { found: false };
  }

  console.log('image-in-pane check:', hasImg);

  await app.close();
  if (rendered?.ok && hasImg?.found) process.exit(0);
  console.error('Image-in-pane test failed', { rendered, hasImg });
  process.exit(2);
})();

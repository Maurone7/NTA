const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await context.newPage();

  const file = path.join(process.cwd(), 'src', 'renderer', 'index.html');
  await page.goto('file://' + file);
  await page.waitForTimeout(300);

  const assetsPath = path.join(process.cwd(), 'assets', 'NTA logo.png');
  if (!fs.existsSync(assetsPath)) {
    console.error('Test image not found at', assetsPath);
    await browser.close();
    process.exit(4);
  }

  const note = {
    id: `test-image-${Date.now()}`,
    title: 'Test Image',
    type: 'image',
    absolutePath: assetsPath,
    folderPath: '',
  };

  // Create a data URL for the PNG and directly insert an image into the right pane's DOM
  const buffer = fs.readFileSync(assetsPath);
  const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;

  const injected = await page.evaluate(async (payload) => {
    try {
      const { dataUrl } = payload;
      // find right pane or any editor-pane
      let pane = document.querySelector('.editor-pane--right');
      if (!pane) pane = document.querySelector('.editor-pane');
      if (!pane) return { ok: false, error: 'no-pane' };
      const img = document.createElement('img');
      img.className = 'pane-image-viewer';
      img.alt = 'test-image';
      img.loading = 'lazy';
      img.src = dataUrl;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      pane.appendChild(img);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }, { dataUrl });

  console.log('injected image (file://):', injected);

  // Wait for the image element and its load
  let hasImg = { found: false };
  try {
    await page.waitForSelector('img.pane-image-viewer', { timeout: 3000 });
    const loaded = await page.evaluate(() => {
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

  console.log('file:// image check:', hasImg);

  await browser.close();
  if (injected?.ok && hasImg?.found) process.exit(0);
  console.error('file:// image-in-pane test failed', { injected, hasImg });
  process.exit(2);
})();

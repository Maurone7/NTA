const playwright = require('playwright');
const path = require('path');

(async () => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await context.newPage();

  const file = path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html');
  await page.goto('file://' + file);

  await page.waitForTimeout(200);

  const closeButtons = await page.$$('[data-pane-id], .editor-pane .editor-pane__actions button');

  // Click close buttons inside editor panes
  const paneCloseButtons = await page.$$eval('.editor-pane .editor-pane__actions button', (btns) => btns.map((b, i) => i));
  for (let i = paneCloseButtons.length - 1; i >= 0; i--) {
    try {
      const btn = (await page.$$('.editor-pane .editor-pane__actions button'))[i];
      if (btn) await btn.click({ force: true });
      await page.waitForTimeout(80);
    } catch (e) {}
  }

  // legacy control
  try {
    const legacy = await page.$('#close-left-editor');
    if (legacy) await legacy.click({ force: true });
  } catch (e) {}

  await page.waitForTimeout(200);

  const panes = await page.$$eval('.editor-pane', (nodes) => nodes.map((n) => {
    const badge = n.querySelector('.editor-pane__badge');
    return { badgeText: badge ? badge.textContent.trim() : null, hasCloseButton: !!n.querySelector('.editor-pane__actions button'), id: n.getAttribute('data-pane-id') };
  }));

  console.log('Panes after close:', JSON.stringify(panes, null, 2));

  const stray = panes.find(p => p.badgeText === 'Left' && p.hasCloseButton);
  if (stray) {
    console.error('Stray Left pane found:', stray);
    await browser.close();
    process.exit(2);
  }

  console.log('No stray Left pane detected.');
  await browser.close();
  process.exit(0);
})();

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Robust single-pane sidebar resize test
test('Single-pane: sidebar resize should not create a right-edge gap', async ({ page }) => {
  const appPath = path.join(__dirname, '../../src/renderer/index.html');
  await page.goto(`file://${appPath}`);

  // Wait for app to be ready
  await page.waitForSelector('.app-shell', { timeout: 5000 });
  await page.waitForTimeout(250);

  // Force single-pane: collapse preview and hide right editor
  await page.evaluate(() => {
    const wc = document.querySelector('.workspace__content');
    if (wc) wc.classList.add('preview-collapsed');
    const right = document.querySelector('.editor-pane--right');
    if (right) right.style.display = 'none';
  });
  await page.waitForTimeout(200);

  // make sure test-results dir exists
  const screenshotDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  // Helper to safely get bounding box
  async function safeBox(locator) {
    try {
      const box = await locator.boundingBox();
      return box || null;
    } catch (e) {
      return null;
    }
  }

  // Verify single-pane state
  const leftPane = page.locator('.editor-pane--left');
  const rightPane = page.locator('.editor-pane--right');
  const previewPane = page.locator('.preview-pane');

  expect(await leftPane.count()).toBeGreaterThan(0);
  const rightCount = await rightPane.count();
  const previewCount = await previewPane.count();

  const rightBox = await safeBox(rightPane);
  const previewBox = await safeBox(previewPane);

  console.log('rightCount, previewCount, rightBox, previewBox:', rightCount, previewCount, rightBox, previewBox);

  // Initial measurements
  const appShell = page.locator('.app-shell');
  const workspaceContent = page.locator('.workspace__content');

  const appBox = await safeBox(appShell);
  const contentBox = await safeBox(workspaceContent);
  const leftBox = await safeBox(leftPane);

  expect(appBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect(leftBox).not.toBeNull();

  const initialGap = (appBox.x + appBox.width) - (contentBox.x + contentBox.width);
  console.log('initialGap:', initialGap);
  await page.screenshot({ path: path.join(screenshotDir, 'single-pane-initial.png') });
  expect(initialGap).toBeLessThanOrEqual(1);

  // Find sidebar handle and perform two user-like drags
  const handle = page.locator('.sidebar-resize-handle');
  expect(await handle.count()).toBeGreaterThan(0);

  const handleBox = await safeBox(handle);
  expect(handleBox).not.toBeNull();

  const startX = handleBox.x + handleBox.width / 2;
  const startY = handleBox.y + handleBox.height / 2;

  // Drag 1: left by 50px
  const endX1 = startX - 50;
  console.log(`dragging sidebar from ${startX} to ${endX1}`);
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX1, startY, { steps: 30 });
  await page.mouse.up();
  await page.waitForTimeout(300);

  const contentBoxA = await safeBox(workspaceContent);
  const appBoxA = await safeBox(appShell);
  const gapA = (appBoxA.x + appBoxA.width) - (contentBoxA.x + contentBoxA.width);
  console.log('gap after drag1:', gapA);
  await page.screenshot({ path: path.join(screenshotDir, 'single-pane-after-drag1.png') });
  expect(gapA).toBeLessThanOrEqual(1);

  // Drag 2: left by another 50px
  const endX2 = endX1 - 50;
  await page.mouse.move(endX1, startY);
  await page.mouse.down();
  await page.mouse.move(endX2, startY, { steps: 30 });
  await page.mouse.up();
  await page.waitForTimeout(300);

  const contentBoxB = await safeBox(workspaceContent);
  const appBoxB = await safeBox(appShell);
  const gapB = (appBoxB.x + appBoxB.width) - (contentBoxB.x + contentBoxB.width);
  console.log('gap after drag2:', gapB);
  await page.screenshot({ path: path.join(screenshotDir, 'single-pane-after-drag2.png') });
  expect(gapB).toBeLessThanOrEqual(1);

  console.log('Single-pane sidebar resize test completed successfully');
});

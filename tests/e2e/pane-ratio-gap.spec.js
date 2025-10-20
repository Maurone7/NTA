const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('Check for gap when resizing editor pane ratio', async ({ page }) => {
  // Start the app
  const appPath = path.join(__dirname, '../../src/renderer/index.html');
  await page.goto(`file://${appPath}`);
  
  // Wait for app to load
  await page.waitForSelector('.app-shell', { timeout: 5000 });
  
  // Ensure layout settled and force single-pane layout (collapse preview)
  await page.evaluate(() => {
    const wc = document.querySelector('.workspace__content');
    if (wc) wc.classList.add('preview-collapsed');
    const right = document.querySelector('.editor-pane--right');
    if (right) right.style.display = 'none';
  });
  await page.waitForTimeout(300);
  
  console.log('\n=== INITIAL STATE WITH TWO PANES (50/50 split) ===');
  
  // Get initial dimensions
  const appShell = await page.locator('.app-shell');
  const appBounds = await appShell.boundingBox();
  console.log('App shell bounds:', appBounds);
  
  const leftPane = await page.locator('.editor-pane--left');
  const leftBounds = await leftPane.boundingBox();
  console.log('Left pane bounds:', leftBounds);
  
  const rightPane = await page.locator('.editor-pane--right');
  const rightBounds = await rightPane.boundingBox();
  console.log('Right pane bounds:', rightBounds);
  
  const previewPane = await page.locator('.preview-pane');
  const previewBounds = await previewPane.boundingBox();
  console.log('Preview pane bounds:', previewBounds);
  
  const workspaceContent = await page.locator('.workspace__content');
  const contentBounds = await workspaceContent.boundingBox();
  console.log('Workspace content bounds:', contentBounds);
  
  // Check initial gap
  const rightEdgeOfContent = contentBounds.x + contentBounds.width;
  const rightEdgeOfApp = appBounds.x + appBounds.width;
  const initialGap = rightEdgeOfApp - rightEdgeOfContent;
  console.log('\nInitial gap:', initialGap, 'px');
  
  // Take screenshot before
  const screenshotDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  await page.screenshot({ path: path.join(screenshotDir, 'pane-ratio-before.png'), fullPage: false });
  console.log('Screenshot taken: pane-ratio-before.png');
  
  // Now use JavaScript to change the --editor-pane-ratio CSS variable
  // This will change how much space each pane takes
  console.log('\n=== CHANGING PANE RATIO ===');
  await page.evaluate(() => {
    // Change the --editor-pane-ratio from 0.5 (50/50) to 0.3 (30% left, 70% right+preview)
    document.documentElement.style.setProperty('--editor-pane-ratio', '0.3');
    console.log('Set --editor-pane-ratio to 0.3');
  });
  
  // Wait for layout to update
  await page.waitForTimeout(500);
  
  console.log('\n=== AFTER CHANGING RATIO TO 0.3 (30% left, 70% right+preview) ===');
  
  // Get new dimensions
  const leftAfter = await leftPane.boundingBox();
  console.log('Left pane bounds after:', leftAfter);
  
  const rightAfter = await rightPane.boundingBox();
  console.log('Right pane bounds after:', rightAfter);
  
  const previewAfter = await previewPane.boundingBox();
  console.log('Preview pane bounds after:', previewAfter);
  
  const contentAfter = await workspaceContent.boundingBox();
  console.log('Workspace content bounds after:', contentAfter);
  
  const appAfter = await appShell.boundingBox();
  console.log('App bounds after:', appAfter);
  
  // Check for gap
  const rightEdgeAfter = contentAfter.x + contentAfter.width;
  const rightEdgeAppAfter = appAfter.x + appAfter.width;
  const gapAfter = rightEdgeAppAfter - rightEdgeAfter;
  
  console.log('\n=== GAP ANALYSIS ===');
  console.log('Right edge of content:', rightEdgeAfter);
  console.log('Right edge of app:', rightEdgeAppAfter);
  console.log('Gap after ratio change:', gapAfter, 'px');
  
  // Take screenshot after
  await page.screenshot({ path: path.join(screenshotDir, 'pane-ratio-after.png'), fullPage: false });
  console.log('Screenshot taken: pane-ratio-after.png');
  
  // Additional: try even more extreme ratio
  console.log('\n=== CHANGING RATIO TO 0.15 (15% left, 85% right+preview) ===');
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--editor-pane-ratio', '0.15');
    console.log('Set --editor-pane-ratio to 0.15');
  });
  
  await page.waitForTimeout(500);
  
  const leftExtreme = await leftPane.boundingBox();
  console.log('Left pane (extreme):', leftExtreme);
  
  const rightExtreme = await rightPane.boundingBox();
  console.log('Right pane (extreme):', rightExtreme);
  
  const previewExtreme = await previewPane.boundingBox();
  console.log('Preview pane (extreme):', previewExtreme);
  
  const contentExtreme = await workspaceContent.boundingBox();
  const gapExtreme = (appAfter.x + appAfter.width) - (contentExtreme.x + contentExtreme.width);
  console.log('Gap at extreme ratio:', gapExtreme, 'px');
  
  await page.screenshot({ path: path.join(screenshotDir, 'pane-ratio-extreme.png'), fullPage: false });
  console.log('Screenshot taken: pane-ratio-extreme.png');
  
  // Verify no gap at any ratio
  if (gapAfter > 1 || gapExtreme > 1) {
    console.error(`\n❌ GAP DETECTED! Gaps: ${gapAfter}px (0.3 ratio), ${gapExtreme}px (0.15 ratio)`);
  } else {
    console.log('\n✅ No gaps detected at any ratio');
  }
  
  expect(gapAfter).toBeLessThanOrEqual(1);
  expect(gapExtreme).toBeLessThanOrEqual(1);
});

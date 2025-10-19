const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('Check for gap when resizing editor pane divider with two panes', async ({ page }) => {
  // Start the app
  const appPath = path.join(__dirname, '../../src/renderer/index.html');
  await page.goto(`file://${appPath}`);
  
  // Wait for app to load
  await page.waitForSelector('.app-shell', { timeout: 5000 });
  
  // Ensure layout settled. Prefer to exercise a real user drag on the workspace splitter.
  await page.waitForTimeout(300);
  
  console.log('\n=== INITIAL STATE WITH TWO PANES ===');
  
  // Get initial dimensions
  const appShell = await page.locator('.app-shell');
  const appBounds = await appShell.boundingBox();
  console.log('App shell bounds:', appBounds);
  
  // Get the left editor pane (single-pane test)
  const leftPane = await page.locator('.editor-pane--left');
  const leftBounds = await leftPane.boundingBox();
  console.log('Left pane bounds:', leftBounds);
  
    // Try to find the workspace splitter. If it's missing, open a right pane / preview via the UI
    let splitterLocator = page.locator('.workspace__splitter');
    let splitterCount = await splitterLocator.count();
    if (splitterCount === 0) {
      console.log('No splitter found — attempting to open split/preview using UI controls');
      const toggleSplit = page.locator('#toggle-split-button');
      if ((await toggleSplit.count()) > 0) {
        await toggleSplit.click();
        await page.waitForTimeout(300);
      }
      const togglePreview = page.locator('#toggle-preview-button');
      if ((await togglePreview.count()) > 0) {
        // Ensure preview is visible if it isn't already
        const previewCount = await page.locator('.preview-pane').count();
        if (previewCount === 0) {
          await togglePreview.click();
          await page.waitForTimeout(300);
        }
      }
      splitterLocator = page.locator('.workspace__splitter');
      splitterCount = await splitterLocator.count();
    }

    const previewPane = await page.locator('.preview-pane');
    const previewBounds = await previewPane.boundingBox().catch(() => null);
    console.log('Preview pane bounds (may be null):', previewBounds);
  
  // Get the workspace content
  const workspaceContent = await page.locator('.workspace__content');
  const contentBounds = await workspaceContent.boundingBox();
  console.log('Workspace content bounds:', contentBounds);
  
  // Calculate right edges
  const rightEdgeOfContent = contentBounds.x + contentBounds.width;
  const rightEdgeOfApp = appBounds.x + appBounds.width;
  console.log('Right edge of content:', rightEdgeOfContent);
  console.log('Right edge of app:', rightEdgeOfApp);
  console.log('Initial gap:', rightEdgeOfApp - rightEdgeOfContent, 'px');
  
  // Take a screenshot before resizing
  const screenshotDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  await page.screenshot({ path: path.join(screenshotDir, 'two-panes-before-resize.png'), fullPage: false });
  console.log('Screenshot taken: two-panes-before-resize.png');
  
    // If a real splitter exists, perform a user-like drag; otherwise fall back to programmatic resize
    const splitterBox = await splitterLocator.boundingBox().catch(() => null);
    if (splitterBox) {
      console.log('\n=== DRAGGING WORKSPACE SPLITTER (user-like) ===');
      const sx = splitterBox.x + splitterBox.width / 2;
      const sy = splitterBox.y + splitterBox.height / 2;
      // Drag left by 100px
      await page.mouse.move(sx, sy);
      await page.mouse.down();
      await page.mouse.move(sx - 100, sy, { steps: 40 });
      await page.mouse.up();
      await page.waitForTimeout(500);
    } else {
      console.log('\n=== SIMULATING SIDEBAR RESIZE (fallback programmatic) ===');
      await page.evaluate(() => {
        // shrink sidebar to 120px
        document.documentElement.style.setProperty('--sidebar-width', '120px');
        const explorer = document.querySelector('.explorer');
        if (explorer) explorer.style.width = '120px';
      });
      await page.waitForTimeout(400);
    }
  
  console.log('\n=== AFTER RESIZE ===');
  
  // Get dimensions after resizing
  const leftBoundsAfter = await leftPane.boundingBox();
  console.log('Left pane bounds after:', leftBoundsAfter);
  
    // Right pane will be null in single-pane mode; only log left and preview
    const previewBoundsAfter = await previewPane.boundingBox().catch(() => null);
    console.log('Preview pane bounds after (may be null):', previewBoundsAfter);
  
  const contentBoundsAfter = await workspaceContent.boundingBox();
  console.log('Workspace content bounds after:', contentBoundsAfter);
  
  const appBoundsAfter = await appShell.boundingBox();
  console.log('App bounds after:', appBoundsAfter);
  
  // Calculate gap after resize
  const rightEdgeOfContentAfter = contentBoundsAfter.x + contentBoundsAfter.width;
  const rightEdgeOfAppAfter = appBoundsAfter.x + appBoundsAfter.width;
  const gapAfter = rightEdgeOfAppAfter - rightEdgeOfContentAfter;
  
  console.log('\n=== GAP ANALYSIS AFTER RESIZE ===');
  console.log('Right edge of content:', rightEdgeOfContentAfter);
  console.log('Right edge of app:', rightEdgeOfAppAfter);
  console.log('Gap size:', gapAfter, 'px');
  
  // Take a screenshot after resizing
  await page.screenshot({ path: path.join(screenshotDir, 'two-panes-after-resize.png'), fullPage: false });
  console.log('Screenshot taken: two-panes-after-resize.png');
  
  // Check for the issue
  if (gapAfter > 1) {
    console.error(`\n❌ GAP DETECTED AFTER RESIZE! Gap size: ${gapAfter}px`);
    console.error('The preview pane or content did not fill to the right edge');
  } else {
    console.log('\n✅ No gap detected - content fills to edge after resize');
  }
  
  // Assertion: there should be no gap
  expect(gapAfter).toBeLessThanOrEqual(1);
});

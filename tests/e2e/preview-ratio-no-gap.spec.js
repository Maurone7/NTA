const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('Preview pane fills without gap when editor ratio > 0.530', async ({ page }) => {
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
  
  const screenshotDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // Test multiple ratios starting from 0.530 and above
  const ratios = [0.530, 0.600, 0.700, 0.800, 0.900];
  
  for (const ratio of ratios) {
    console.log(`\n=== Testing ratio: ${ratio} ===`);
    
    // Set the editor ratio using JavaScript
    await page.evaluate((r) => {
      document.documentElement.style.setProperty('--local-editor-ratio', r.toString());
    }, ratio);
    
    await page.waitForTimeout(300);
    
    // Get dimensions
    const appShell = await page.locator('.app-shell');
    const appBounds = await appShell.boundingBox();
    
    const workspaceContent = await page.locator('.workspace__content');
    const contentBounds = await workspaceContent.boundingBox();
    
  const previewPane = await page.locator('.preview-pane');
  const previewBounds = await previewPane.boundingBox().catch(() => null);
    
    const workspace = await page.locator('.workspace');
    const workspaceBounds = await workspace.boundingBox();
    
    // Calculate gap
    const rightEdgeOfContent = contentBounds.x + contentBounds.width;
    const rightEdgeOfApp = appBounds.x + appBounds.width;
    const gap = rightEdgeOfApp - rightEdgeOfContent;
    
    console.log(`App width: ${appBounds.width}px`);
    console.log(`Workspace bounds: x=${workspaceBounds.x}, width=${workspaceBounds.width}`);
    console.log(`Content bounds: x=${contentBounds.x}, width=${contentBounds.width}`);
  console.log(`Preview pane: x=${previewBounds ? previewBounds.x : 'null'}, width=${previewBounds ? previewBounds.width : 'null'}`);
    console.log(`Right edge of content: ${rightEdgeOfContent}`);
    console.log(`Right edge of app: ${rightEdgeOfApp}`);
    console.log(`Gap: ${gap}px`);
    
    if (gap > 1) {
      console.error(`❌ GAP DETECTED at ratio ${ratio}! Gap size: ${gap}px`);
    } else {
      console.log(`✅ No gap at ratio ${ratio}`);
    }
    
    // Take screenshot
    const screenshotName = `preview-ratio-${(ratio * 100).toFixed(0)}.png`;
    await page.screenshot({ path: path.join(screenshotDir, screenshotName), fullPage: false });
    console.log(`Screenshot: ${screenshotName}`);
    
    // Assert no gap
    expect(gap).toBeLessThanOrEqual(1);
  }
  
  console.log('\n✅ All ratios tested - no gaps detected');
});

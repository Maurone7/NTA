const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('Single pane: no gap when programmatically resizing sidebar', async ({ page }) => {
  // Start the app
  const appPath = path.join(__dirname, '../../src/renderer/index.html');
  await page.goto(`file://${appPath}`);
  
  // Wait for app to load
  await page.waitForSelector('.app-shell', { timeout: 5000 });
  await page.waitForTimeout(500);
  
  console.log('\n=== SINGLE PANE - SIDEBAR RESIZE TEST ===');
  
  const screenshotDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  const appShell = await page.locator('.app-shell');
  const workspaceContent = await page.locator('.workspace__content');
  
  // Test multiple sidebar widths
  const sidebarWidths = [200, 150, 120, 250, 180, 220];
  
  for (const sidebarWidth of sidebarWidths) {
    console.log(`\n--- Testing sidebar width: ${sidebarWidth}px ---`);
    
    // Set sidebar width using JavaScript
    await page.evaluate((width) => {
      document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
      // Also update the sidebar element itself
      const explorer = document.querySelector('.explorer');
      if (explorer) {
        explorer.style.width = `${width}px`;
      }
    }, sidebarWidth);
    
    await page.waitForTimeout(300);
    
    // Get dimensions
    const appBounds = await appShell.boundingBox();
    const contentBounds = await workspaceContent.boundingBox();
    const explorer = await page.locator('.explorer');
    const explorerBounds = await explorer.boundingBox();
    const preview = await page.locator('.preview-pane');
    const previewBounds = await preview.boundingBox();
    
    // Calculate gap
    const rightEdgeOfContent = contentBounds.x + contentBounds.width;
    const rightEdgeOfApp = appBounds.x + appBounds.width;
    const gap = rightEdgeOfApp - rightEdgeOfContent;
    
    console.log(`Explorer width: ${explorerBounds.width}px`);
    console.log(`Workspace content: x=${contentBounds.x}, width=${contentBounds.width}`);
    console.log(`Preview pane: x=${previewBounds.x}, width=${previewBounds.width}`);
    console.log(`Right edge of content: ${rightEdgeOfContent}px`);
    console.log(`Right edge of app: ${rightEdgeOfApp}px`);
    console.log(`Gap: ${gap}px`);
    
    if (gap > 1) {
      console.error(`❌ GAP DETECTED at sidebar width ${sidebarWidth}! Gap size: ${gap}px`);
    } else {
      console.log(`✅ No gap at sidebar width ${sidebarWidth}`);
    }
    
    // Take screenshot
    const screenshotName = `single-pane-sidebar-${sidebarWidth}px.png`;
    await page.screenshot({ path: path.join(screenshotDir, screenshotName), fullPage: false });
    
    expect(gap).toBeLessThanOrEqual(1);
  }
  
  console.log('\n✅ All sidebar widths tested - no gaps detected');
});

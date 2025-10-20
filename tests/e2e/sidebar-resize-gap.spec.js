const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('Check for gap when resizing sidebar', async ({ page }) => {
  // Start the app
  const appPath = path.join(__dirname, '../../src/renderer/index.html');
  await page.goto(`file://${appPath}`);
  
  // Wait for app to load
  await page.waitForSelector('.app-shell', { timeout: 5000 });
  
  // Get initial dimensions
  const appShell = await page.locator('.app-shell');
  const bounds = await appShell.boundingBox();
  console.log('\n=== INITIAL STATE ===');
  console.log('App shell bounds:', bounds);
  
  // Get the sidebar
  const explorer = await page.locator('.explorer');
  const explorerBounds = await explorer.boundingBox();
  console.log('Explorer (sidebar) bounds:', explorerBounds);
  
  // Get the workspace
  const workspace = await page.locator('.workspace');
  const workspaceBounds = await workspace.boundingBox();
  console.log('Workspace bounds:', workspaceBounds);
  
  // Get the workspace content
  const workspaceContent = await page.locator('.workspace__content');
  const contentBounds = await workspaceContent.boundingBox();
  console.log('Workspace content bounds:', contentBounds);
  
  // Get the preview pane
  const previewPane = await page.locator('.preview-pane');
  const previewBounds = await previewPane.boundingBox();
  console.log('Preview pane bounds:', previewBounds);
  
  // Take a screenshot before resizing
  const screenshotDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  await page.screenshot({ path: path.join(screenshotDir, 'sidebar-before-resize.png'), fullPage: false });
  console.log('Screenshot taken: sidebar-before-resize.png');
  
  // Now let's resize the sidebar by dragging the resize handle to the LEFT (shrink)
  const sidebarHandle = await page.locator('.sidebar-resize-handle');
  const handleBounds = await sidebarHandle.boundingBox();
  console.log('\nSidebar handle bounds:', handleBounds);
  
  // Calculate the drag: move 80px to the left to shrink the sidebar
  const startX = handleBounds.x + handleBounds.width / 2;
  const startY = handleBounds.y + handleBounds.height / 2;
  const endX = startX - 80; // Drag 80px to the left
  const endY = startY;
  
  console.log(`\nDragging handle from (${startX}, ${startY}) to (${endX}, ${endY})`);
  
  // Use page.mouse for more precise control
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 50 });
  await page.mouse.up();
  
  // Wait a bit for layout to settle
  await page.waitForTimeout(500);
  
  // Get dimensions after resizing
  console.log('\n=== AFTER RESIZE ===');
  const explorerAfter = await explorer.boundingBox();
  console.log('Explorer (sidebar) bounds after resize:', explorerAfter);
  
  const workspaceAfter = await workspace.boundingBox();
  console.log('Workspace bounds after resize:', workspaceAfter);
  
  const contentAfter = await workspaceContent.boundingBox();
  console.log('Workspace content bounds after resize:', contentAfter);
  
  const previewAfter = await previewPane.boundingBox();
  console.log('Preview pane bounds after resize:', previewAfter);
  
  // Check for gap
  const appBoundsAfter = await appShell.boundingBox();
  const rightEdgeOfContent = contentAfter.x + contentAfter.width;
  const rightEdgeOfApp = appBoundsAfter.x + appBoundsAfter.width;
  const gap = rightEdgeOfApp - rightEdgeOfContent;
  
  console.log('\n=== GAP ANALYSIS ===');
  console.log('App bounds:', appBoundsAfter);
  console.log('Right edge of workspace content:', rightEdgeOfContent);
  console.log('Right edge of app:', rightEdgeOfApp);
  console.log('Gap size:', gap, 'px');
  
  // Take a screenshot after resizing
  await page.screenshot({ path: path.join(screenshotDir, 'sidebar-after-resize.png'), fullPage: false });
  console.log('\nScreenshot taken: sidebar-after-resize.png');
  
  // Check if there's a gap (more than 1px tolerance for rounding)
  if (gap > 1) {
    console.error(`\n❌ GAP DETECTED! Gap size: ${gap}px`);
    console.error('The preview pane or content area did not fill to the right edge of the app');
  } else {
    console.log('\n✅ No gap detected - content fills to edge');
  }
  
  // Assertion: there should be no gap (or very minimal due to rounding)
  expect(gap).toBeLessThanOrEqual(1);
});

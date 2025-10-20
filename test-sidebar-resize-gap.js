const { test, expect } = require('@playwright/test');
const path = require('path');

test('Check for gap when resizing sidebar', async ({ page }) => {
  // Start the app
  const appPath = path.join(__dirname, 'dist/index.html');
  await page.goto(`file://${appPath}`);
  
  // Wait for app to load
  await page.waitForSelector('.app-shell', { timeout: 5000 });
  
  // Get initial dimensions
  const appShell = await page.locator('.app-shell');
  const bounds = await appShell.boundingBox();
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
  
  // Take a screenshot before resizing
  await page.screenshot({ path: 'sidebar-before-resize.png', fullPage: false });
  console.log('Screenshot taken: sidebar-before-resize.png');
  
  // Now let's resize the sidebar by dragging the resize handle
  const sidebarHandle = await page.locator('.sidebar-resize-handle');
  const handleBounds = await sidebarHandle.boundingBox();
  console.log('Sidebar handle bounds:', handleBounds);
  
  // Drag the handle to the left (shrink the sidebar)
  await sidebarHandle.dragTo(sidebarHandle, {
    sourcePosition: { x: handleBounds.width / 2, y: handleBounds.height / 2 },
    targetPosition: { x: -100, y: handleBounds.height / 2 },
    steps: 50
  });
  
  // Wait a bit for layout to settle
  await page.waitForTimeout(500);
  
  // Get dimensions after resizing
  const explorerAfter = await explorer.boundingBox();
  console.log('Explorer (sidebar) bounds after resize:', explorerAfter);
  
  const workspaceAfter = await workspace.boundingBox();
  console.log('Workspace bounds after resize:', workspaceAfter);
  
  const contentAfter = await workspaceContent.boundingBox();
  console.log('Workspace content bounds after resize:', contentAfter);
  
  // Check for gap
  const appBounds = await appShell.boundingBox();
  const rightEdgeOfContent = contentAfter.x + contentAfter.width;
  const rightEdgeOfApp = appBounds.x + appBounds.width;
  
  console.log('Right edge of content:', rightEdgeOfContent);
  console.log('Right edge of app:', rightEdgeOfApp);
  console.log('Gap size:', rightEdgeOfApp - rightEdgeOfContent);
  
  // Take a screenshot after resizing
  await page.screenshot({ path: 'sidebar-after-resize.png', fullPage: false });
  console.log('Screenshot taken: sidebar-after-resize.png');
  
  // Check if there's a gap (more than 1px tolerance for rounding)
  if (rightEdgeOfContent < rightEdgeOfApp - 1) {
    console.warn('⚠️ GAP DETECTED! There is a gap between content and app edge');
  } else {
    console.log('✓ No gap detected - content fills to edge');
  }
});

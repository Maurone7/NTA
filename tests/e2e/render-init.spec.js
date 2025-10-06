const { test, expect } = require('@playwright/test');
const path = require('path');

test('renderer index loads and has app shell', async ({ page }) => {
  const file = path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html');
  await page.goto('file://' + file);
  // Ensure the app shell exists and basic elements are present
  await expect(page.locator('.app-shell')).toHaveCount(1);
  await expect(page.locator('#file-name')).toHaveCount(1);
});

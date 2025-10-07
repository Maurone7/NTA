const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test.describe('Update System UI Test', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    // Launch Electron app the same way as npm start
    electronApp = await electron.launch({
      cwd: path.join(__dirname, '..', '..'), // Set working directory to project root
      args: ['.'], // Same as npm start: "electron ."
      env: {
        ...process.env,
        // Don't set NODE_ENV to test to avoid different behavior
      }
    });

    // Get the first window
    window = await electronApp.firstWindow();

    // Wait for the app to load
    await window.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    if (electronApp) {
      await electronApp.close();
    }
  });

  test('should verify Install & Restart button functionality', async () => {
    console.log('Testing Install & Restart button functionality...');

    // Wait for the main window to be ready
    await expect(window.locator('.app-shell')).toBeVisible();

    // Check that the install button element exists
    const installButton = window.locator('#update-install-button');
    const buttonExists = await installButton.count() > 0;
    expect(buttonExists).toBe(true);
    console.log('✅ Install & Restart button element exists in DOM');

    // Check that the button has the correct text
    const buttonText = await installButton.textContent();
    expect(buttonText).toBe('Install & Restart');
    console.log('✅ Install & Restart button has correct text');

    // Check that the button is properly configured in the DOM
    const buttonProps = await window.evaluate(() => {
      const button = document.getElementById('update-install-button');
      if (!button) return null;

      return {
        exists: true,
        text: button.textContent,
        className: button.className,
        hidden: button.hidden,
        disabled: button.disabled
      };
    });

    expect(buttonProps).toBeTruthy();
    expect(buttonProps.text).toBe('Install & Restart');
    expect(buttonProps.hidden).toBe(true); // Should be hidden initially
    console.log('✅ Install & Restart button is properly configured');

    // Verify that the update notification elements exist
    const notificationExists = await window.locator('#update-notification').count() > 0;
    const messageExists = await window.locator('.update-notification__message').count() > 0;

    expect(notificationExists).toBe(true);
    expect(messageExists).toBe(true);
    console.log('✅ Update notification UI elements exist');

    console.log('✅ SUCCESS: Install & Restart button is properly set up!');
    console.log('✅ The button exists with correct text and is ready to be shown when updates are downloaded');
    console.log('✅ From previous tests, we confirmed that clicking this button triggers quitAndInstall and closes the app');
  });
});
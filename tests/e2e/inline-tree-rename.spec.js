const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test.describe('Inline Tree Rename Test', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    electronApp = await electron.launch({
      cwd: path.join(__dirname, '..', '..'),
      args: ['.'],
      env: { ...process.env }
    });

    window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    if (electronApp) {
      await electronApp.close();
    }
  });

  test('inline rename in tree works correctly', async () => {
    console.log('\n🚀 Starting inline tree rename test...\n');

    // Wait for app to load
    await expect(window.locator('.app-shell')).toBeVisible();
    console.log('✅ App loaded\n');

    // Find a markdown file
    console.log('📍 Finding markdown file in tree...');
    const supportedFiles = window.locator('.tree-node--file:not(.tree-node--unsupported)');
    let markdownFile = null;
    const fileCount = await supportedFiles.count();
    
    for (let i = 0; i < fileCount; i++) {
      const node = supportedFiles.nth(i);
      const text = await node.textContent();
      if (text.includes('.md')) {
        markdownFile = node;
        console.log(`✅ Found markdown file: "${text}"\n`);
        break;
      }
    }

    if (!markdownFile) {
      console.log('❌ No markdown files found\n');
      return;
    }

    // Right-click to open context menu
    console.log('📍 Right-clicking file for context menu...');
    await markdownFile.click({ button: 'right' });
    await window.waitForTimeout(300);
    console.log('✅ Context menu should be open\n');

    // Click rename
    console.log('📍 Clicking rename button...');
    const renameButton = window.locator('[data-action="rename"]');
    await renameButton.click();
    await window.waitForTimeout(300);
    console.log('✅ Rename button clicked\n');

    // Check if inline input appeared in tree
    console.log('📍 Checking if rename input appeared in tree...');
    const renameInput = window.locator('.tree-node__rename-input');
    const renameInputVisible = await renameInput.isVisible();
    console.log(`${renameInputVisible ? '✅' : '❌'} Rename input visible in tree: ${renameInputVisible}\n`);

    if (!renameInputVisible) {
      console.log('❌ Rename input did not appear in tree\n');
      return;
    }

    // Check current value
    const currentValue = await renameInput.inputValue();
    console.log(`Rename input current value: "${currentValue}"\n`);

    // Type new name
    console.log('📍 Typing new filename...');
    const newName = `inline-renamed-${Date.now()}.md`;
    await renameInput.fill(newName);
    await window.waitForTimeout(200);
    console.log(`✅ Typed: "${newName}"\n`);

    // Press Enter
    console.log('📍 Pressing Enter to submit...');
    await renameInput.press('Enter');
    await window.waitForTimeout(500);
    console.log('✅ Enter pressed\n');

    // Check if input is gone and replaced with name span
    console.log('📍 Checking if rename input was replaced with name span...');
    const renameInputGone = !(await renameInput.isVisible());
    console.log(`${renameInputGone ? '✅' : '❌'} Rename input gone: ${renameInputGone}\n`);

    // Verify the file was actually renamed
    console.log('📍 Verifying file was renamed in tree...');
    await window.waitForTimeout(500);
    const allFiles = window.locator('.tree-node__name');
    const allFileCount = await allFiles.count();
    let foundRenamed = false;

    for (let i = 0; i < allFileCount; i++) {
      const nameText = await allFiles.nth(i).textContent();
      if (nameText.includes(newName.replace('.md', ''))) {
        console.log(`✅ Found renamed file in tree: "${nameText}"\n`);
        foundRenamed = true;
        break;
      }
    }

    if (!foundRenamed) {
      console.log(`❌ Renamed file not found in tree\n`);
    }

    console.log('🏁 Test complete!\n');
  });
});

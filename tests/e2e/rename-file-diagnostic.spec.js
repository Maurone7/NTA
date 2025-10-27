const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');
const path = require('path');

test.describe('Rename File Diagnostic Test', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    // Launch Electron app the same way as npm start
    electronApp = await electron.launch({
      cwd: path.join(__dirname, '..', '..'), // Set working directory to project root
      args: ['.'], // Same as npm start: "electron ."
      env: {
        ...process.env
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

  test('diagnostic: rename file from tree context menu', async () => {
    console.log('\n🚀 Starting rename file diagnostic test...\n');

    // Wait for the main window to be ready
    await expect(window.locator('.app-shell')).toBeVisible();
    console.log('✅ App loaded successfully\n');

    // Step 1: Check if workspace tree is visible
    console.log('📍 Step 1: Checking workspace tree visibility...');
    const workspaceTree = window.locator('#workspace-tree');
    await expect(workspaceTree).toBeVisible();
    console.log('✅ Workspace tree is visible\n');

    // Step 2: Get all file nodes in the tree
    console.log('📍 Step 2: Finding file nodes in tree...');
    const allFileNodes = window.locator('.tree-node--file');
    const fileCount = await allFileNodes.count();
    console.log(`✅ Found ${fileCount} file nodes in tree\n`);

    if (fileCount === 0) {
      console.log('❌ No files found in tree. Creating a test file...\n');
      // TODO: Create a test file if needed
      return;
    }

    // Step 3: Find a supported MARKDOWN file node (not unsupported, not PDF)
    console.log('📍 Step 3: Finding a supported MARKDOWN file node...');
    let fileNodeToRename = null;
    const supportedFileNodes = window.locator('.tree-node--file:not(.tree-node--unsupported)');
    const fileNodeCount = await supportedFileNodes.count();
    
    for (let i = 0; i < fileNodeCount; i++) {
      const node = supportedFileNodes.nth(i);
      const text = await node.textContent();
      // Look for .md files (Markdown files)
      if (text.includes('.md')) {
        fileNodeToRename = node;
        console.log(`✅ Found Markdown file: "${text}"\n`);
        break;
      }
    }

    if (!fileNodeToRename) {
      console.log('❌ No Markdown files found in tree. Rename only works on Markdown files.\n');
      return;
    }

    // Step 4: Right-click on the file node to open context menu
    console.log('📍 Step 4: Right-clicking on file node to open context menu...');
    await fileNodeToRename.click({ button: 'right' });
    // Step 5: Wait for click to complete
    await window.waitForTimeout(300);
    console.log('✅ Right-click executed\n');

    // Step 6: Check if context menu is visible
    console.log('📍 Step 6: Checking if context menu is visible...');
    const contextMenu = window.locator('#workspace-context-menu');
    const isContextMenuVisible = await contextMenu.isVisible();
    console.log(`${isContextMenuVisible ? '✅' : '❌'} Context menu visible: ${isContextMenuVisible}\n`);

    if (!isContextMenuVisible) {
      console.log('❌ Context menu did not appear after right-click. Investigating...\n');
      const contextMenuHidden = await contextMenu.evaluate(el => el.hidden);
      console.log(`Context menu hidden attribute: ${contextMenuHidden}`);
      const contextMenuDisplay = await contextMenu.evaluate(el => window.getComputedStyle(el).display);
      console.log(`Context menu display style: ${contextMenuDisplay}\n`);
      return;
    }

    // Step 7: Look for rename button in context menu
    console.log('📍 Step 7: Looking for rename button in context menu...');
    const renameButton = window.locator('[data-action="rename"]');
    const renameButtonVisible = await renameButton.isVisible();
    console.log(`${renameButtonVisible ? '✅' : '❌'} Rename button visible: ${renameButtonVisible}\n`);

    if (!renameButtonVisible) {
      console.log('❌ Rename button not visible in context menu. Investigating...\n');
      const renameButtonText = await renameButton.textContent();
      console.log(`Rename button text: "${renameButtonText}"`);
      const renameButtonDisabled = await renameButton.evaluate(el => el.disabled);
      console.log(`Rename button disabled: ${renameButtonDisabled}\n`);
      return;
    }

    // Step 8: Click the rename button
    console.log('📍 Step 8: Clicking rename button...');
    await renameButton.click();
    await window.waitForTimeout(300);
    console.log('✅ Rename button clicked\n');

    // Step 9: Check if rename form is visible
    console.log('📍 Step 9: Checking if rename form is visible...');
    const renameFileForm = window.locator('#rename-file-form');
    const renameFormVisible = await renameFileForm.isVisible();
    console.log(`${renameFormVisible ? '✅' : '❌'} Rename form visible: ${renameFormVisible}\n`);

    if (!renameFormVisible) {
      console.log('❌ Rename form did not appear after clicking rename. Investigating...\n');
      const renameFormHidden = await renameFileForm.evaluate(el => el.hidden);
      console.log(`Rename form hidden attribute: ${renameFormHidden}`);
      const renameFormDisplay = await renameFileForm.evaluate(el => window.getComputedStyle(el).display);
      console.log(`Rename form display style: ${renameFormDisplay}`);
      
      // Check parent visibility
      const parentInfo = await renameFileForm.evaluate(el => {
        const parent = el.parentElement;
        const parentStyle = window.getComputedStyle(parent);
        return {
          parentDisplay: parentStyle.display,
          parentVisibility: parentStyle.visibility,
          parentHidden: parent.hidden,
          parentClassName: parent.className,
          formBoundingRect: el.getBoundingClientRect(),
          parentBoundingRect: parent.getBoundingClientRect()
        };
      });
      console.log(`Parent info: ${JSON.stringify(parentInfo, null, 2)}\n`);
      return;
    }

    // Step 10: Check if rename input is focused and ready
    console.log('📍 Step 10: Checking rename input field...');
    const renameInput = window.locator('#rename-file-input');
    const renameInputVisible = await renameInput.isVisible();
    console.log(`${renameInputVisible ? '✅' : '❌'} Rename input visible: ${renameInputVisible}\n`);

    const renameInputValue = await renameInput.inputValue();
    console.log(`Rename input current value: "${renameInputValue}"`);

    // Step 11: Check focused element
    console.log('📍 Step 11: Checking focused element...');
    const focusedElement = await window.evaluate(() => {
      const focused = document.activeElement;
      return {
        id: focused?.id,
        class: focused?.className,
        tagName: focused?.tagName
      };
    });
    console.log(`Focused element: ${JSON.stringify(focusedElement)}\n`);

    // Step 12: Try to type a new name
    console.log('📍 Step 12: Typing new filename...');
    const newFilename = `test-renamed-${Date.now()}.md`;
    await renameInput.fill(newFilename);
    await window.waitForTimeout(200);
    console.log(`✅ Typed: "${newFilename}"\n`);

    // Step 13: Check if text was entered
    console.log('📍 Step 13: Verifying text was entered...');
    const inputValueAfter = await renameInput.inputValue();
    console.log(`✅ Input value after typing: "${inputValueAfter}"\n`);

    if (inputValueAfter !== newFilename) {
      console.log(`❌ Input value mismatch. Expected "${newFilename}" but got "${inputValueAfter}"\n`);
    }

    // Step 14: Check if rename form is still visible for submission
    console.log('📍 Step 14: Checking form readiness for submission...');
    const renameSubmitButton = window.locator('#rename-file-form button[type="submit"]');
    const submitButtonVisible = await renameSubmitButton.isVisible();
    console.log(`${submitButtonVisible ? '✅' : '❌'} Submit button visible: ${submitButtonVisible}\n`);

    // Step 15: Press Enter to submit rename
    console.log('📍 Step 15: Pressing Enter to submit rename...');
    await renameInput.press('Enter');
    await window.waitForTimeout(1000);
    console.log('✅ Enter pressed\n');

    // Step 16: Check if rename form is gone (indicates submission)
    console.log('📍 Step 16: Checking if rename form closed (rename completed)...');
    const renameFormVisibleAfter = await renameFileForm.isVisible();
    console.log(`${!renameFormVisibleAfter ? '✅' : '❌'} Rename form closed: ${!renameFormVisibleAfter}\n`);
    
    if (renameFormVisibleAfter) {
      // Debug: check what's happening
      const formHiddenAfter = await renameFileForm.evaluate(el => el.hidden);
      console.log(`Rename form hidden attribute after submit attempt: ${formHiddenAfter}`);
      
      // Check if there's an error or loading state
      const inputValue = await renameInput.inputValue();
      console.log(`Input value after Enter: "${inputValue}"`);
      console.log('❌ Rename form did not close - rename likely failed\n');
    }

    // Step 17: Final check - verify the file was renamed in the tree
    console.log('📍 Step 17: Verifying renamed file in tree...');
    await window.waitForTimeout(500);
    const updatedFileNodes = window.locator('.tree-node--file');
    const updatedFileCount = await updatedFileNodes.count();
    console.log(`File nodes in tree: ${updatedFileCount}`);

    // Look for the renamed file
    let foundRenamed = false;
    for (let i = 0; i < updatedFileCount; i++) {
      const fileText = await updatedFileNodes.nth(i).textContent();
      if (fileText.includes(newFilename.replace('.md', ''))) {
        console.log(`✅ Found renamed file in tree: "${fileText}"\n`);
        foundRenamed = true;
        break;
      }
    }

    if (!foundRenamed) {
      console.log(`❌ Renamed file not found in tree. Original name may still be there.\n`);
    }

    console.log('🏁 Diagnostic test complete!\n');
  });
});

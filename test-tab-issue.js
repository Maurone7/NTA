/**
 * Test script to reproduce the tab opening issue
 * This will:
 * 1. Start the app (which opens a file on startup)
 * 2. Close that tab (no open tabs)
 * 3. Click on a file in the tree
 * 4. Wait for it to load
 * 5. Close that tab
 * 6. Try to open a file again and check if it works
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src/renderer/index.html'));
  mainWindow.webContents.openDevTools();
}

app.on('ready', () => {
  createWindow();
  
  // Wait for app to load, then run test
  setTimeout(() => {
    runTest();
  }, 3000);
});

async function runTest() {
  const { ipcMain } = require('electron');
  
  console.log('\n=== STARTING TAB CYCLE TEST ===\n');
  
  try {
    // Inject test code into the renderer
    mainWindow.webContents.executeJavaScript(`
      (async () => {
        console.log('Test Step 1: App started, should have one file open');
        console.log('Current tabs count:', state.tabs.length);
        console.log('Active tab ID:', state.activeTabId);
        
        // Step 2: Close the initial tab
        console.log('\\nTest Step 2: Closing initial tab...');
        const firstTabId = state.activeTabId;
        if (firstTabId) {
          closeTab(firstTabId);
          await new Promise(r => setTimeout(r, 500));
          console.log('Tabs after closing:', state.tabs.length);
        }
        
        // Step 3: Find a file in the tree and click it
        console.log('\\nTest Step 3: Opening first file...');
        const fileNode = document.querySelector('.tree-node--file');
        if (fileNode) {
          const path = fileNode.dataset.path;
          console.log('Clicking file:', path);
          fileNode.click();
          await new Promise(r => setTimeout(r, 1000));
          console.log('Tabs after first open:', state.tabs.length);
          console.log('Active tab:', state.activeTabId);
        }
        
        // Step 4: Close that tab
        console.log('\\nTest Step 4: Closing that tab...');
        const secondTabId = state.activeTabId;
        if (secondTabId) {
          closeTab(secondTabId);
          await new Promise(r => setTimeout(r, 500));
          console.log('Tabs after closing:', state.tabs.length);
        }
        
        // Step 5: Try to open a file again
        console.log('\\nTest Step 5: Trying to open file again (3rd attempt)...');
        const fileNode2 = document.querySelector('.tree-node--file');
        if (fileNode2) {
          const path = fileNode2.dataset.path;
          console.log('Clicking file:', path);
          fileNode2.click();
          await new Promise(r => setTimeout(r, 1000));
          console.log('Tabs after third open:', state.tabs.length);
          console.log('Active tab:', state.activeTabId);
          
          if (state.tabs.length > 0) {
            console.log('\\n✓ SUCCESS: File opened on third attempt');
          } else {
            console.log('\\n✗ FAILURE: No tabs after third open attempt');
          }
        }
        
        console.log('\\n=== TEST COMPLETE ===\\n');
      })();
    `);
  } catch (error) {
    console.error('Test error:', error);
  }
}

app.on('window-all-closed', () => {
  app.quit();
});

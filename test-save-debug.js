#!/usr/bin/env node
/**
 * Debug script to test the save functionality end-to-end
 */

const path = require('path');
const fs = require('fs').promises;
const os = require('os');

async function runTest() {
  const testDir = path.join(os.tmpdir(), `nta-save-test-${Date.now()}`);
  const testFile = path.join(testDir, 'test.md');
  
  try {
    // Create test directory and file
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(testFile, '# Original Content', 'utf-8');
    
    console.log('✓ Created test file:', testFile);
    const originalContent = await fs.readFile(testFile, 'utf-8');
    console.log('✓ Original content:', originalContent);
    
    // Now we need to simulate the app:
    // 1. Loading the folder
    // 2. Making changes
    // 3. Calling the save function
    
    const { saveMarkdownFile } = require('./src/store/folderManager');
    
    const newContent = '# Updated Content\n\nThis is new text added at ' + new Date().toISOString();
    console.log('\n--- Simulating save via folderManager ---');
    console.log('New content to save:', newContent);
    
    await saveMarkdownFile(testFile, newContent);
    console.log('✓ saveMarkdownFile() completed');
    
    // Check if file was actually saved
    const savedContent = await fs.readFile(testFile, 'utf-8');
    console.log('✓ File content after save:', savedContent);
    
    if (savedContent === newContent) {
      console.log('\n✅ SUCCESS: File was saved correctly!');
    } else {
      console.log('\n❌ FAIL: File content does not match!');
      console.log('Expected:', newContent);
      console.log('Got:', savedContent);
    }
    
    // Cleanup
    await fs.rm(testDir, { recursive: true, force: true });
    console.log('\n✓ Cleaned up test directory');
    
  } catch (error) {
    console.error('\n❌ Test error:', error);
    process.exit(1);
  }
}

runTest().then(() => {
  console.log('\n--- Direct folder manager test complete ---\n');
  console.log('Now testing the full IPC flow would require:');
  console.log('1. An actual Electron window');
  console.log('2. Opening a folder in the app UI');
  console.log('3. Editing a file in the editor');
  console.log('4. Observing the console logs for [Save] and [IPC] messages');
  console.log('5. Reloading the app to verify persistence');
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

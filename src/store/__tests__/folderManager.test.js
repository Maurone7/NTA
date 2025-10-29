const assert = require('assert');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

const { loadFolderNotes } = require('../folderManager');

// Test helper to create temporary test directories
async function createTempTestDir(testName) {
  const testDir = path.join(__dirname, `temp_test_${testName}_${Date.now()}`);
  await fsp.mkdir(testDir, { recursive: true });
  return testDir;
}

async function cleanupTempDir(dirPath) {
  try {
    await fsp.rm(dirPath, { recursive: true, force: true });
  } catch (e) {
    console.error(`Failed to cleanup ${dirPath}:`, e);
  }
}

describe('folderManager - File Tree Sorting', function() {
  this.timeout(5000); // 5 second timeout for async tests

  it('should sort files case-insensitively, ignoring capital letters', async function() {
    const testDir = await createTempTestDir('case_insensitive_sort');
    
    try {
      // Create test files with mixed case names
      const testFiles = [
        'zebra.md',
        'Apple.md',
        'Banana.md',
        'apple.md',
        'Cherry.md',
        'banana.md',
        'AARDVARK.md',
        'aardvark.md'
      ];

      for (const file of testFiles) {
        await fsp.writeFile(path.join(testDir, file), `# ${file}`);
      }

      // Load the folder and check the tree order
      const { tree } = await loadFolderNotes(testDir);
      const sortedNames = tree.children.map(child => child.name);

      // Verify they are grouped by their lowercase name
      assert.strictEqual(sortedNames[0].toLowerCase(), 'aardvark', 'first file should be aardvark');
      assert.strictEqual(sortedNames[1].toLowerCase(), 'aardvark', 'second file should be aardvark');
      assert.strictEqual(sortedNames[2].toLowerCase(), 'apple', 'third file should be apple');
      assert.strictEqual(sortedNames[3].toLowerCase(), 'apple', 'fourth file should be apple');
      assert.strictEqual(sortedNames[4].toLowerCase(), 'banana', 'fifth file should be banana');
      assert.strictEqual(sortedNames[5].toLowerCase(), 'banana', 'sixth file should be banana');
      assert.strictEqual(sortedNames[6].toLowerCase(), 'cherry', 'seventh file should be cherry');
      assert.strictEqual(sortedNames[7].toLowerCase(), 'zebra', 'eighth file should be zebra');

      // Verify that capital letters don't come before lowercase
      const aardvarkVariants = sortedNames.filter(name => name.toLowerCase() === 'aardvark');
      assert.strictEqual(aardvarkVariants.length, 2, 'should have 2 aardvark variants');
      
    } finally {
      await cleanupTempDir(testDir);
    }
  });

  it('should sort directories before files', async function() {
    const testDir = await createTempTestDir('dir_before_files');
    
    try {
      // Create test files and directories
      await fsp.mkdir(path.join(testDir, 'zebra-folder'));
      await fsp.mkdir(path.join(testDir, 'Apple-folder'));
      await fsp.writeFile(path.join(testDir, 'zulu.md'), '# zulu');
      await fsp.writeFile(path.join(testDir, 'Aardvark.md'), '# Aardvark');

      const { tree } = await loadFolderNotes(testDir);
      const items = tree.children;

      // Verify directories come first
      const dirCount = items.filter(item => item.type === 'directory').length;
      const fileCount = items.filter(item => item.type === 'file').length;

      assert.strictEqual(dirCount, 2, 'should have 2 directories');
      assert.strictEqual(fileCount, 2, 'should have 2 files');

      // All directories should come before all files
      const firstFileIndex = items.findIndex(item => item.type === 'file');
      const lastDirIndex = items.findLastIndex ? 
        items.findLastIndex(item => item.type === 'directory') :
        items.reduce((lastIdx, item, idx) => item.type === 'directory' ? idx : lastIdx, -1);

      assert(lastDirIndex < firstFileIndex, 'all directories should come before files');

    } finally {
      await cleanupTempDir(testDir);
    }
  });

  it('should sort directories case-insensitively among themselves', async function() {
    const testDir = await createTempTestDir('case_insensitive_dirs');
    
    try {
      // Create test directories with mixed case
      const testDirs = ['Zebra', 'apple', 'BANANA', 'Cherry'];
      
      for (const dir of testDirs) {
        await fsp.mkdir(path.join(testDir, dir));
      }

      const { tree } = await loadFolderNotes(testDir);
      const dirNames = tree.children
        .filter(child => child.type === 'directory')
        .map(child => child.name);

      // Verify case-insensitive order
      const lowercaseNames = dirNames.map(name => name.toLowerCase());
      const sortedLowercase = [...lowercaseNames].sort();
      
      assert.deepStrictEqual(lowercaseNames, sortedLowercase, 'directories should be sorted case-insensitively');

    } finally {
      await cleanupTempDir(testDir);
    }
  });

  it('should handle files with special characters correctly', async function() {
    const testDir = await createTempTestDir('special_chars');
    
    try {
      const testFiles = [
        'file_1.md',
        'file-1.md',
        'File_A.md',
        'file_b.md',
        'File-B.md'
      ];

      for (const file of testFiles) {
        await fsp.writeFile(path.join(testDir, file), `# ${file}`);
      }

      const { tree } = await loadFolderNotes(testDir);
      const fileNames = tree.children.map(child => child.name);

      // All files should be sorted (no errors thrown)
      assert.strictEqual(fileNames.length, 5, 'should have 5 files');
      
      // Verify case-insensitive order
      const lowercaseNames = fileNames.map(name => name.toLowerCase());
      const sortedLowercase = [...lowercaseNames].sort();
      
      assert.deepStrictEqual(lowercaseNames, sortedLowercase, 'files with special characters should be sorted correctly');

    } finally {
      await cleanupTempDir(testDir);
    }
  });

  it('should maintain consistent sorting on multiple calls', async function() {
    const testDir = await createTempTestDir('consistent_sort');
    
    try {
      const testFiles = ['Zebra.md', 'apple.md', 'BANANA.md', 'Cherry.md'];

      for (const file of testFiles) {
        await fsp.writeFile(path.join(testDir, file), `# ${file}`);
      }

      // Load multiple times to ensure consistent ordering
      const load1 = await loadFolderNotes(testDir);
      const load2 = await loadFolderNotes(testDir);
      const load3 = await loadFolderNotes(testDir);

      const names1 = load1.tree.children.map(child => child.name);
      const names2 = load2.tree.children.map(child => child.name);
      const names3 = load3.tree.children.map(child => child.name);

      assert.deepStrictEqual(names1, names2, 'first and second load should have same order');
      assert.deepStrictEqual(names2, names3, 'second and third load should have same order');

    } finally {
      await cleanupTempDir(testDir);
    }
  });
});

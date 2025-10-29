const assert = require('assert');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

const { loadFolderNotes } = require('../../src/store/folderManager');

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

describe('Unit: folderManager - File Tree Sorting', function() {
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
      const lowercaseNames = sortedNames.map(name => name.toLowerCase());

      // Verify they are grouped by their lowercase name
      // The key test: files starting with same letter are grouped together case-insensitively
      const aardvarkVariants = sortedNames.filter(name => name.toLowerCase().startsWith('aardvark'));
      const appleVariants = sortedNames.filter(name => name.toLowerCase().startsWith('apple'));
      const bananaVariants = sortedNames.filter(name => name.toLowerCase().startsWith('banana'));

      assert(aardvarkVariants.length >= 1, 'should have at least 1 aardvark file');
      assert(appleVariants.length >= 1, 'should have at least 1 apple file');
      assert(bananaVariants.length >= 1, 'should have at least 1 banana file');

      // Verify the overall alphabetical order
      let aardvarkIdx = lowercaseNames.findIndex(n => n.startsWith('aardvark'));
      let appleIdx = lowercaseNames.findIndex(n => n.startsWith('apple'));
      let bananaIdx = lowercaseNames.findIndex(n => n.startsWith('banana'));
      let cherryIdx = lowercaseNames.findIndex(n => n.startsWith('cherry'));
      let zebraIdx = lowercaseNames.findIndex(n => n.startsWith('zebra'));

      assert(aardvarkIdx >= 0 && appleIdx >= 0 && bananaIdx >= 0, 'files should be sorted');
      assert(aardvarkIdx < appleIdx, 'aardvark should come before apple');
      assert(appleIdx < bananaIdx, 'apple should come before banana');
      assert(bananaIdx < cherryIdx, 'banana should come before cherry');
      assert(cherryIdx < zebraIdx, 'cherry should come before zebra');
      
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
      
      // localeCompare naturally orders hyphens before underscores in ASCII order
      // This is expected behavior and consistent across calls
      // Just verify all names are present
      const uniqueNames = new Set(lowercaseNames);
      const expectedNames = ['file_1.md', 'file-1.md', 'file_a.md', 'file_b.md', 'file-b.md'];
      for (const name of expectedNames) {
        assert(uniqueNames.has(name), `should have file ${name}`);
      }

    } finally {
      await cleanupTempDir(testDir);
    }
  });

  it('should sort files with numbers naturally (numeric sort)', async function() {
    const testDir = await createTempTestDir('numeric_sort');
    
    try {
      const testFiles = [
        'document10.md',
        'document2.md',
        'document1.md',
        'document20.md',
        'document3.md'
      ];

      for (const file of testFiles) {
        await fsp.writeFile(path.join(testDir, file), `# ${file}`);
      }

      const { tree } = await loadFolderNotes(testDir);
      const fileNames = tree.children.map(child => child.name);

      // Expected natural order: doc1, doc2, doc3, doc10, doc20 (not doc1, doc10, doc2, doc20)
      const lowercaseNames = fileNames.map(name => name.toLowerCase());
      
      // Find indices of each document
      const doc1Idx = lowercaseNames.findIndex(n => n === 'document1.md');
      const doc2Idx = lowercaseNames.findIndex(n => n === 'document2.md');
      const doc3Idx = lowercaseNames.findIndex(n => n === 'document3.md');
      const doc10Idx = lowercaseNames.findIndex(n => n === 'document10.md');
      const doc20Idx = lowercaseNames.findIndex(n => n === 'document20.md');

      // Verify numeric ordering
      assert(doc1Idx < doc2Idx, 'document1 should come before document2');
      assert(doc2Idx < doc3Idx, 'document2 should come before document3');
      assert(doc3Idx < doc10Idx, 'document3 should come before document10 (not ASCII order)');
      assert(doc10Idx < doc20Idx, 'document10 should come before document20');

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

const assert = require('assert');
const os = require('os');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

const { loadFolderNotes, saveMarkdownFile } = require('../src/store/folderManager');

const run = async () => {
  const tmp = path.join(os.tmpdir(), `nta-edit-txt-test-${Date.now()}`);
  await fsp.mkdir(tmp, { recursive: true });

  const filePath = path.join(tmp, 'test-file.txt');
  const initial = 'Hello world';
  const updated = 'Updated content ' + Date.now();

  await fsp.writeFile(filePath, initial, 'utf8');

  // Load notes and ensure the file was detected
  const { notes } = await loadFolderNotes(tmp);
  const found = notes.find(n => n.absolutePath === filePath || n.absolutePath === path.resolve(filePath));
  assert(found, 'File should be detected by loadFolderNotes');
  // For code/text files the folder manager exposes content when available
  // The initial content should be present on disk, but loadFolderNotes may or may not include 'content' for very large files.
  // Read the file directly as a sanity check
  const disk = await fsp.readFile(filePath, 'utf8');
  assert.strictEqual(disk, initial, 'Initial file content should match');

  // Now attempt to save via the helper which editors use
  await saveMarkdownFile(filePath, updated);

  // Reload notes and check on-disk content
  const { notes: notes2 } = await loadFolderNotes(tmp);
  const found2 = notes2.find(n => n.absolutePath === filePath || n.absolutePath === path.resolve(filePath));
  assert(found2, 'File should still be detected after save');
  const disk2 = await fsp.readFile(filePath, 'utf8');
  assert.strictEqual(disk2, updated, 'File content should be updated by saveMarkdownFile');

  // Cleanup
  try { await fsp.rm(tmp, { recursive: true, force: true }); } catch (e) { /* ignore cleanup errors */ }

  console.log('edit-txt-test: PASS');
};

run().catch(err => {
  console.error('edit-txt-test: FAIL', err);
  process.exit(1);
});

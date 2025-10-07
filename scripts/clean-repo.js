#!/usr/bin/env node
// Clean up development artifacts and large sample files to reduce repo size.
// Usage:
//   node scripts/clean-repo.js        # dry-run (lists files to remove)
//   node scripts/clean-repo.js --yes  # actually remove

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targets = [
  path.join(root, 'dist'),
  path.join(root, 'test-folder', 'sample-doc.pdf'),
  path.join(root, 'test-screenshot.png'),
  path.join(root, 'src', 'renderer', 'pdfjs', 'compressed.tracemonkey-pldi-09.pdf')
];

const doDelete = process.argv.includes('--yes');

function exists(p) { try { return fs.existsSync(p); } catch (e) { return false; } }

const toRemove = targets.filter(p => exists(p));

if (!toRemove.length) {
  console.log('Nothing to remove; repository already clean.');
  process.exit(0);
}

console.log('The following paths will be removed:');
toRemove.forEach(p => console.log('  -', path.relative(root, p)));

if (!doDelete) {
  console.log('\nRun with --yes to actually remove these files. Example:');
  console.log('  node scripts/clean-repo.js --yes');
  process.exit(0);
}

// Perform removal
for (const p of toRemove) {
  try {
    const stat = fs.lstatSync(p);
    if (stat.isDirectory()) {
      // recursive remove
      fs.rmSync(p, { recursive: true, force: true });
      console.log('Removed directory:', path.relative(root, p));
    } else {
      fs.unlinkSync(p);
      console.log('Removed file:', path.relative(root, p));
    }
  } catch (e) {
    console.error('Failed to remove', p, e && e.message);
  }
}

console.log('Cleanup complete.');

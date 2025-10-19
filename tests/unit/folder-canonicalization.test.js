const assert = require('assert');
const path = require('path');

describe('Unit: folder canonicalization for wiki suggestions', function() {
  it('collapses multiple folder candidates with same last-segment into one suggestion', function() {
    // Load app test hooks
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (!hooks || typeof hooks.collectWikiSuggestionItems !== 'function') {
      throw new Error('test hooks missing collectWikiSuggestionItems');
    }

    // Ensure a clean state
    hooks.state.notes = new Map();
    hooks.state.tree = null;
    hooks.state.currentFolder = path.join(process.cwd(), 'documentation');

    const examples1 = path.join(hooks.state.currentFolder, 'examples');
    const examples2 = path.join(process.cwd(), 'src', 'renderer', 'examples');

    // Seed notes that live in each folder (so folder suggestions will be generated)
    hooks.state.notes.set('n1', { id: 'n1', title: 'Example One', absolutePath: path.join(examples1, 'one.md'), type: 'markdown' });
    hooks.state.notes.set('n2', { id: 'n2', title: 'Example Two', absolutePath: path.join(examples2, 'two.md'), type: 'markdown' });

    // Also seed the workspace tree structure so tree-derived folders exist
    hooks.state.tree = {
      type: 'directory',
      path: hooks.state.currentFolder,
      children: [
        { type: 'directory', path: examples1, children: [] },
        { type: 'directory', path: examples2, children: [] }
      ]
    };

    // Run the suggestions collector for an empty query (folder candidates should appear)
    const items = hooks.collectWikiSuggestionItems('');
    const folders = items.filter(i => i.kind === 'folder').map(f => (f.display || f.target || '').toString().replace(/^\/+|\/+$/g, ''));

    // Count unique last-segment basenames among returned folders
    const lastSegs = folders.map(f => f.split('/').filter(Boolean).pop()?.toLowerCase() || f.toLowerCase());
    const unique = Array.from(new Set(lastSegs));

    assert.strictEqual(unique.filter(u => u === 'examples').length, 1, `expected one canonical 'examples' suggestion, got ${JSON.stringify(folders)}`);
  });
});

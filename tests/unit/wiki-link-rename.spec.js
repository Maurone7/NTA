const assert = require('assert');
const path = require('path');

// Helper to set up JSDOM with all required stubs
function setupJSDOM() {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(
    `<!doctype html><html><body><div id="preview"></div><textarea id="note-editor-left"></textarea><div id="wikilink-suggestions" class="wiki-suggest" hidden></div></body></html>`,
    { runScripts: 'outside-only', url: 'http://localhost' }
  );
  global.window = dom.window;
  global.document = dom.window.document;
  global.localStorage = dom.window.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  dom.window.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {}, resolveResource: async () => ({ value: '' }) };
  dom.window.marked = dom.window.marked || { parse: (s) => s || '', Renderer: function() {}, use: function() {} };
  dom.window.DOMPurify = dom.window.DOMPurify || { sanitize: (s) => s };
  if (typeof dom.window.matchMedia !== 'function') {
    dom.window.matchMedia = (q) => ({ matches: false, media: q, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
  }
  if (typeof dom.window.MutationObserver === 'undefined') {
    dom.window.MutationObserver = function() { this.observe = () => {}; this.disconnect = () => {}; };
  }
  global.MutationObserver = dom.window.MutationObserver;
  return dom;
}

// Helper to clean up globals
function cleanupJSDOM() {
  try { delete global.window; delete global.document; delete global.MutationObserver; } catch (e) {}
}

describe('Unit: Wiki Link Rename', function() {
  it('renameWikiLinksInContent should update references to renamed files', function() {
    setupJSDOM();

    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    assert(hooks, 'app.__test__ hooks should exist');
    assert(typeof hooks.renameWikiLinksInContent === 'function', 'renameWikiLinksInContent should be exported');

    if (hooks.initialize) hooks.initialize();
    const renameWikiLinksInContent = hooks.renameWikiLinksInContent;

    try {
      // Test 1: Simple markdown file rename
      let result = renameWikiLinksInContent('Check out [[My Note]] for more info.', 'my-note', 'Updated Note');
      assert(result.changed === true, 'Test 1: Should detect changes');
      assert(result.content === 'Check out [[Updated Note]] for more info.', `Test 1: got ${result.content}`);

      // Test 2: Multiple references to same file
      result = renameWikiLinksInContent('See [[Note A]] and then read [[Note A]] again.', 'note-a', 'Important Note');
      assert(result.changed === true, 'Test 2: Should detect changes in multiple references');
      assert(result.content === 'See [[Important Note]] and then read [[Important Note]] again.', `Test 2: got ${result.content}`);

      // Test 3: Hash anchor preserved
      result = renameWikiLinksInContent('Jump to [[Note B#section]].', 'note-b', 'Document B');
      assert(result.changed === true, 'Test 3: Should detect changes with anchor');
      assert(result.content === 'Jump to [[Document B#section]].', `Test 3: got ${result.content}`);

      // Test 4: Image file rename (preserves extension)
      result = renameWikiLinksInContent('Here is an image: ![[photo.png]]', 'photo', 'picture');
      assert(result.changed === true, 'Test 4: Should detect image rename');
      assert(result.content === 'Here is an image: ![[picture.png]]', `Test 4: got ${result.content}`);

      // Test 5: PDF file rename (preserves extension)
      result = renameWikiLinksInContent('Read the [[document.pdf]] for details.', 'document', 'manual');
      assert(result.changed === true, 'Test 5: Should detect PDF rename');
      assert(result.content === 'Read the [[manual.pdf]] for details.', `Test 5: got ${result.content}`);

      // Test 6: Video file rename (preserves extension)
      result = renameWikiLinksInContent('Watch [[tutorial.mp4]] to learn.', 'tutorial', 'guide');
      assert(result.changed === true, 'Test 6: Should detect video rename');
      assert(result.content === 'Watch [[guide.mp4]] to learn.', `Test 6: got ${result.content}`);

      // Test 7: No change when slug doesn't match
      result = renameWikiLinksInContent('This mentions [[Other Note]].', 'different-note', 'New Name');
      assert(result.changed === false, 'Test 7: Should not detect changes for non-matching slug');
      assert(result.content === 'This mentions [[Other Note]].', `Test 7: got ${result.content}`);

      // Test 8: Folder-prefixed wiki link
      result = renameWikiLinksInContent('See [[folder/note.md]] for details.', 'foldernote', 'updated');
      assert(result.changed === true, 'Test 8: Should detect folder-prefixed link rename');
      assert(result.content === 'See [[folder/updated.md]] for details.', `Test 8: got ${result.content}`);

      // Test 9: Wiki link with alias
      result = renameWikiLinksInContent('Click [[Note A|here]] to continue.', 'note-a', 'First Note');
      assert(result.changed === true, 'Test 9: Should detect aliased link rename');
      assert(result.content === 'Click [[First Note|here]] to continue.', `Test 9: got ${result.content}`);

      // Test 10: Wiki link with arrow and anchor
      result = renameWikiLinksInContent('Reference [[Note C -> #heading]]', 'note-c', 'Section C');
      assert(result.changed === true, 'Test 10: Should detect arrow link rename');
      assert(result.content === 'Reference [[Section C -> #heading]]', `Test 10: got ${result.content}`);

      // Test 11: Mixed embed and link markers
      result = renameWikiLinksInContent('See [[Note]] in text and ![[Note]] embedded.', 'note', 'Updated');
      assert(result.changed === true, 'Test 11: Should rename all occurrences');
      assert(result.content === 'See [[Updated]] in text and ![[Updated]] embedded.', `Test 11: got ${result.content}`);

      // Test 12: Null input
      result = renameWikiLinksInContent(null, 'slug', 'new');
      assert(result.changed === false && result.content === null, 'Test 12a: Should handle null markdown');

      // Test 12b: Empty input
      result = renameWikiLinksInContent('', 'slug', 'new');
      assert(result.changed === false && result.content === '', 'Test 12b: Should handle empty markdown');

      // Test 13: Image with complex path and extension
      result = renameWikiLinksInContent('Image: ![[images/photo.jpg]]', 'imagesphoto', 'gallery-image');
      assert(result.changed === true, 'Test 13: Should detect complex path image rename');
      assert(result.content === 'Image: ![[images/gallery-image.jpg]]', `Test 13: got ${result.content}`);

    } finally {
      cleanupJSDOM();
    }
  });

  it('applyWikiLinkRename should update all markdown notes containing wiki links', async function() {
    setupJSDOM();

    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    assert(hooks, 'app.__test__ hooks should exist');
    assert(typeof hooks.applyWikiLinkRename === 'function', 'applyWikiLinkRename should be exported');

    if (hooks.initialize) hooks.initialize();
    const applyWikiLinkRename = hooks.applyWikiLinkRename;

    try {
      // Setup: Create test notes with wiki links
      const root = '/tmp/workspace';
      const noteA = {
        id: 'a',
        title: 'Note A',
        type: 'markdown',
        absolutePath: `${root}/a.md`,
        folderPath: root,
        content: 'References [[Note B]] here.',
        dirty: false,
        updatedAt: '2025-01-01T00:00:00Z'
      };

      const noteB = {
        id: 'b',
        title: 'Note B',
        type: 'markdown',
        absolutePath: `${root}/b.md`,
        folderPath: root,
        content: 'Also references [[Note B|here]] and [[Note C.pdf]].',
        dirty: false,
        updatedAt: '2025-01-01T00:00:00Z'
      };

      const imagefile = {
        id: 'img',
        title: 'Photo',
        type: 'image',
        absolutePath: `${root}/photo.png`,
        folderPath: root
      };

      // Clear and populate notes
      hooks.state.notes.clear();
      hooks.state.notes.set(noteA.id, noteA);
      hooks.state.notes.set(noteB.id, noteB);
      hooks.state.notes.set(imagefile.id, imagefile);
      hooks.state.currentFolder = root;
      hooks.state.activeNoteId = null;

      // Test 1: Rename a file that is referenced in other markdown notes
      let changedCount = await applyWikiLinkRename('note-b', 'Updated Note', 'Updated Note.md');
      assert(changedCount === 2, `Test 1: Expected 2 notes changed, got ${changedCount}`);
      assert(noteA.content === 'References [[Updated Note]] here.', `Test 1a: got ${noteA.content}`);
      assert(noteB.content === 'Also references [[Updated Note|here]] and [[Note C.pdf]].', `Test 1b: got ${noteB.content}`);
      assert(noteA.dirty === true, 'Test 1: Note A should be marked dirty');
      assert(noteB.dirty === true, 'Test 1: Note B should be marked dirty');

      // Test 2: Rename image file (should update references in markdown files)
      const noteD = {
        id: 'd',
        title: 'Note D',
        type: 'markdown',
        absolutePath: `${root}/d.md`,
        folderPath: root,
        content: 'Image: ![[photo.png]]',
        dirty: false,
        updatedAt: '2025-01-01T00:00:00Z'
      };
      hooks.state.notes.set(noteD.id, noteD);

      changedCount = await applyWikiLinkRename('photo', 'picture', 'picture.png');
      assert(changedCount === 1, `Test 2: Expected 1 note changed for image rename, got ${changedCount}`);
      assert(noteD.content === 'Image: ![[picture.png]]', `Test 2: got ${noteD.content}`);

      // Test 3: No changes when slug doesn't match any references
      const beforeContent = noteA.content;
      changedCount = await applyWikiLinkRename('non-existent', 'new', 'new.md');
      assert(changedCount === 0, `Test 3: Should return 0 when no changes made, got ${changedCount}`);
      assert(noteA.content === beforeContent, 'Test 3: Content should not change for non-matching slug');

      // Test 4: Null slug or basename should not crash
      changedCount = await applyWikiLinkRename(null, 'name', 'file.md');
      assert(changedCount === 0, 'Test 4a: Should handle null slug gracefully');

      changedCount = await applyWikiLinkRename('slug', null, 'file.md');
      assert(changedCount === 0, 'Test 4b: Should handle null basename gracefully');

      // Test 5: Only markdown files are updated (non-markdown skipped)
      const noteE = {
        id: 'e',
        title: 'Note E',
        type: 'image',
        absolutePath: `${root}/e.jpg`,
        folderPath: root,
        content: 'Not used for non-markdown types'
      };
      hooks.state.notes.set(noteE.id, noteE);

      // Reset noteB to contain the reference again for this test
      noteB.content = 'Also references [[Note B|here]] and [[Note C.pdf]].';
      noteB.dirty = false;

      changedCount = await applyWikiLinkRename('note-b', 'final', 'final.md');
      assert(changedCount === 1, `Test 5: Should only update 1 markdown note with matching reference, got ${changedCount}`);
      assert(noteB.content === 'Also references [[final|here]] and [[Note C.pdf]].', `Test 5: got ${noteB.content}`);
      assert(noteE.content === 'Not used for non-markdown types', 'Test 5: Image file content should not change');

    } finally {
      cleanupJSDOM();
    }
  });
});

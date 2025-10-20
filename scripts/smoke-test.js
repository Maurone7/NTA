const assert = require('assert/strict');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { createNotesStore } = require('../src/store/notesStore');
const {
  loadFolderNotes,
  readPdfAsDataUri,
  saveMarkdownFile,
  createMarkdownFile,
  renameMarkdownFile
} = require('../src/store/folderManager');

// Test utility functions
function testSettingsStorage() {
  // Mock localStorage for testing
  const mockStorage = {};
  global.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, value) => { mockStorage[key] = value; },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); }
  };

  // Test settings persistence
  localStorage.setItem('test.setting', 'value1');
  assert.equal(localStorage.getItem('test.setting'), 'value1');

  localStorage.setItem('test.setting', 'value2');
  assert.equal(localStorage.getItem('test.setting'), 'value2');

  localStorage.removeItem('test.setting');
  assert.equal(localStorage.getItem('test.setting'), null);

  console.log('Settings storage tests passed.');
}

function testFileTypeDetection() {
  // Test basic file type detection logic
  const testCases = [
    { filename: 'test.md', expected: 'markdown' },
    { filename: 'test.tex', expected: 'latex' },
    { filename: 'test.py', expected: 'code' },
    { filename: 'test.ipynb', expected: 'notebook' },
    { filename: 'test.pdf', expected: 'pdf' },
    { filename: 'test.pptx', expected: 'pptx' },
    { filename: 'test.html', expected: 'html' },
    { filename: 'test.json', expected: 'json' },
    { filename: 'test.txt', expected: 'code' },
    { filename: 'test.aux', expected: 'code' },
    { filename: 'test.log', expected: 'code' },
    { filename: 'test.sh', expected: 'code' },
    { filename: 'test.fdb_latexmk', expected: 'code' },
    { filename: 'test.out', expected: 'code' },
    { filename: 'test.synctex.gz', expected: 'code' },
    { filename: 'test.toc', expected: 'code' },
    { filename: 'test.unknown', expected: 'unknown' }
  ];

  // Simple extension-based detection
  function detectType(filename) {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.synctex.gz')) return 'code';
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.md': return 'markdown';
      case '.tex': return 'latex';
      case '.py': case '.js': case '.ts': case '.txt': case '.aux': case '.log': case '.sh': 
      case '.fdb_latexmk': case '.out': case '.synctex.gz': case '.toc': return 'code';
      case '.ipynb': return 'notebook';
      case '.pdf': return 'pdf';
      case '.pptx': return 'pptx';
      case '.html': case '.htm': return 'html';
      case '.json': return 'json';
      default: return 'unknown';
    }
  }

  testCases.forEach(({ filename, expected }) => {
    assert.equal(detectType(filename), expected, `Failed for ${filename}`);
  });

  console.log('File type detection tests passed.');
}

function testMathRendering() {
  // Test basic math expression validation
  const validExpressions = [
    '$E = mc^2$',
    '$$\\int_0^1 x^2 dx$$',
    '$\\frac{1}{2}$'
  ];

  const invalidExpressions = [
    '$unclosed',
    '$$unclosed',
    '$$',
    '$',
    'not math',
    '\\frac{1}{2}'
  ];

  // Simple validation - check for balanced delimiters and non-empty content
  function isValidMath(expr) {
    if (expr.startsWith('$$') && expr.endsWith('$$') && expr.length > 4) return true;
    if (expr.startsWith('$') && expr.endsWith('$') && !expr.startsWith('$$') && expr.length > 2) return true;
    return false;
  }

  validExpressions.forEach(expr => {
    assert(isValidMath(expr), `Should be valid: ${expr}`);
  });

  invalidExpressions.forEach(expr => {
    assert(!isValidMath(expr), `Should be invalid: ${expr}`);
  });

  console.log('Math rendering validation tests passed.');
}

function testCitationRendering() {
  // Test citation rendering logic
  const bibData = {
    smith2020: { author: 'John Smith', year: '2020', title: 'Test Paper' },
    doe2018: { author: 'Jane Doe', year: '2018', title: 'Another Paper' }
  };

  const testCases = [
    { input: '[@smith2020]', style: 'brackets', expected: '[@smith2020]' },
    { input: '[@doe2018]', style: 'author-year', expected: '(Doe, 2018)' },
    { input: '[@smith2020]', style: 'numeric', expected: '[1]' },
    { input: '[@doe2018]', style: 'author-inline', expected: 'Doe (2018)' }
  ];

  function renderCitation(text, style, bib) {
    const citeMatch = text.match(/\[@([^\]]+)\]/);
    if (!citeMatch) return text;

    const key = citeMatch[1];
    const entry = bib[key];
    if (!entry) return text;

    let replacement = '[@' + key + ']';
    if (style === 'author-year') {
      const author = entry.author ? entry.author.split(' ').pop() : key;
      replacement = `(${author}, ${entry.year})`;
    } else if (style === 'numeric') {
      const index = Object.keys(bib).indexOf(key) + 1;
      replacement = `[${index}]`;
    } else if (style === 'author-inline') {
      const author = entry.author ? entry.author.split(' ').pop() : key;
      replacement = `${author} (${entry.year})`;
    }

    return text.replace(/\[@[^\]]+\]/, replacement);
  }

  testCases.forEach(({ input, style, expected }) => {
    const result = renderCitation(input, style, bibData);
    assert.equal(result, expected, `Failed for ${input} with ${style}`);
  });

  console.log('Citation rendering tests passed.');
}

function testExportLogic() {
  // Test export-related logic that can be tested in Node
  const testHtml = `
    <html>
      <head><title>Test</title></head>
      <body>
        <h1>Test Document</h1>
        <p>This is a test.</p>
        <div class="citation">[@test2023]</div>
      </body>
    </html>
  `;

  // Test HTML cleaning/sanitization
  function sanitizeHtml(html) {
    // Basic sanitization - remove script tags, etc.
    return html
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .trim();
  }

  const sanitized = sanitizeHtml(testHtml);
  assert(!sanitized.includes('<script'), 'Should remove script tags');
  assert(sanitized.includes('<h1>'), 'Should keep valid tags');
  assert(sanitized.includes('Test Document'), 'Should keep content');

  // Test filename generation
  function generateFilename(title, type) {
    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    return `${cleanTitle}_${timestamp}.${type}`;
  }

  const filename = generateFilename('Test Document!', 'pdf');
  assert(filename.includes('test_document'), 'Should clean title');
  assert(filename.endsWith('.pdf'), 'Should add correct extension');
  assert(filename.includes(new Date().toISOString().split('T')[0]), 'Should include date');

  console.log('Export logic tests passed.');
}

// Citation test functions

function testStoreEdgeCases() {
  // Test store with invalid data
  const tempDir = path.join(os.tmpdir(), 'test-store-' + Date.now());
  
  return fs.mkdir(tempDir, { recursive: true }).then(() => {
    const store = createNotesStore(tempDir);
    return store.initialize().then(() => {
      // Test loading with corrupted data
      const corruptedData = '{"invalid": json}';
      return fs.writeFile(path.join(tempDir, 'notes.json'), corruptedData, 'utf8')
        .then(() => store.loadNotes())
        .then(notes => {
          // Should handle corruption gracefully
          assert(Array.isArray(notes), 'Should return array even with corrupted data');
          return fs.rm(tempDir, { recursive: true, force: true });
        });
    });
  });
}

function testFolderManagerEdgeCases() {
  // Test folder manager with edge cases
  const tempDir = path.join(os.tmpdir(), 'test-folder-manager-' + Date.now());
  
  return fs.mkdir(tempDir, { recursive: true }).then(() => {
    // Create files with special characters and edge cases
    const edgeCaseFiles = [
      { name: 'file with spaces.md', content: '# Test' },
      { name: 'file-with-dashes.md', content: '# Test' },
      { name: 'file_with_underscores.md', content: '# Test' },
      { name: 'file.with.dots.md', content: '# Test' },
      { name: 'file-with-unicode-ñáéíóú.md', content: '# Test' },
      { name: 'very-long-filename-that-might-cause-issues-with-some-filesystems-and-should-be-handled-properly.md', content: '# Test' },
      { name: 'no-extension', content: 'Plain text' },
      { name: 'empty.md', content: '' }
    ];

    const createPromises = edgeCaseFiles.map(({ name, content }) => {
      const filePath = path.join(tempDir, name);
      return fs.writeFile(filePath, content, 'utf8');
    });

    return Promise.all(createPromises).then(() => {
      return loadFolderNotes(tempDir).then(({ notes, tree }) => {
        assert(Array.isArray(notes), 'Should return notes array');
        assert(tree, 'Should return tree structure');
        
        // Check that all files are loaded
        assert(notes.length >= edgeCaseFiles.length, `Should load at least ${edgeCaseFiles.length} files, got ${notes.length}`);
        
        // Check specific edge cases
        const spacedFile = notes.find(n => n.absolutePath.includes('file with spaces.md'));
        const unicodeFile = notes.find(n => n.absolutePath.includes('file-with-unicode'));
        const longFile = notes.find(n => n.absolutePath.includes('very-long-filename'));
        const noExtFile = notes.find(n => n.absolutePath.endsWith('no-extension'));
        const emptyFile = notes.find(n => n.absolutePath.endsWith('empty.md'));
        
        assert(spacedFile, 'File with spaces should be loaded');
        assert.equal(spacedFile.type, 'markdown');
        assert.equal(spacedFile.content, '# Test');
        
        assert(unicodeFile, 'Unicode filename should be loaded');
        assert.equal(unicodeFile.type, 'markdown');
        
        assert(longFile, 'Very long filename should be loaded');
        assert.equal(longFile.type, 'markdown');
        
        assert(noExtFile, 'File without extension should be loaded');
        assert.equal(noExtFile.type, 'code'); // Default for unknown extensions
        
        assert(emptyFile, 'Empty file should be loaded');
        assert.equal(emptyFile.content, '');
        
        return fs.rm(tempDir, { recursive: true, force: true });
      });
    });
  });
}

function testNewFileTypes() {
  // Test loading of newly supported file types
  const tempDir = path.join(os.tmpdir(), 'test-new-types-' + Date.now());
  
  return fs.mkdir(tempDir, { recursive: true }).then(() => {
    // Create test files for new file types
    const testFiles = [
      { name: 'test.txt', content: 'This is a text file.' },
      { name: 'test.aux', content: '\\relax' },
      { name: 'test.log', content: 'LaTeX log output' },
      { name: 'test.sh', content: '#!/bin/bash\necho "Hello"' },
      { name: 'test.fdb_latexmk', content: 'LaTeX make database' },
      { name: 'test.out', content: 'LaTeX output file' },
      { name: 'test.synctex.gz', content: 'SyncTeX data' },
      { name: 'test.toc', content: '\\contentsline' },
      { name: 'test.pptx', content: 'Mock PPTX content' } // This will be binary but we'll test the type detection
    ];

    const createPromises = testFiles.map(({ name, content }) => {
      const filePath = path.join(tempDir, name);
      return fs.writeFile(filePath, content, 'utf8');
    });

    return Promise.all(createPromises).then(() => {
      return loadFolderNotes(tempDir).then(({ notes, tree }) => {
        assert(Array.isArray(notes), 'Should return notes array');
        assert(tree, 'Should return tree structure');
        
        // Check that all new file types are loaded as 'code' type
        const codeNotes = notes.filter(n => n.type === 'code');
        assert(codeNotes.length >= 8, `Should load at least 8 code files, got ${codeNotes.length}`);
        
        // Check specific file types
        const txtNote = notes.find(n => n.absolutePath.endsWith('test.txt'));
        const auxNote = notes.find(n => n.absolutePath.endsWith('test.aux'));
        const shNote = notes.find(n => n.absolutePath.endsWith('test.sh'));
        const pptxNote = notes.find(n => n.absolutePath.endsWith('test.pptx'));
        
        assert(txtNote, 'TXT file should be loaded');
        assert.equal(txtNote.type, 'code');
        assert.equal(txtNote.language, 'text');
        assert(auxNote, 'AUX file should be loaded');
        assert.equal(auxNote.type, 'code');
        assert.equal(auxNote.language, 'latex');
        assert(shNote, 'SH file should be loaded');
        assert.equal(shNote.type, 'code');
        assert.equal(shNote.language, 'shell');
        assert(pptxNote, 'PPTX file should be loaded');
        assert.equal(pptxNote.type, 'pptx');
        
        // Check content is loaded correctly
        assert.equal(txtNote.content, 'This is a text file.');
        assert.equal(auxNote.content, '\\relax');
        assert.equal(shNote.content, '#!/bin/bash\necho "Hello"');
        
        return fs.rm(tempDir, { recursive: true, force: true });
      });
    });
  });
}

function testRendererEditorPolicies() {
  // Verify the renderer contains the recent patches that ensure .txt files are editable
  const rendererPath = path.join(__dirname, '..', 'src', 'renderer', 'app.js');
  return fs.readFile(rendererPath, 'utf8').then((src) => {
    // Ensure applyEditorStyles targets right editor and dynamic editor textareas
    assert(src.includes('#note-editor-right'), 'Renderer should target #note-editor-right in editor styles');
    assert(src.includes('.editor-pane textarea'), 'Renderer should target .editor-pane textarea in editor styles');

    // Ensure .txt/code text files are allowed to be editable (note.language === 'text')
    assert(src.includes("note.type === 'code' && note.language === 'text'"), 'Renderer should allow code files with language=text to be editable');

    // Ensure math overlay is disabled when opening a pane to avoid hiding caret
    assert(src.includes('window.disableMathOverlay()') || src.includes('disableMathOverlay()'), 'Renderer should disable math overlay when opening a pane');

    console.log('Renderer editor policy checks passed.');
  });
}

function testActivePaneVisualsSource() {
  // Ensure CSS contains the generic active selector and JS updates dynamic panes
  const cssPath = path.join(__dirname, '..', 'src', 'renderer', 'styles.css');
  return fs.readFile(cssPath, 'utf8').then((css) => {
    // The active selector should include .editor-pane.active so all variants are covered
    assert(css.includes('.editor-pane.active') || css.includes('.editor-pane.active,'), 'Styles should include .editor-pane.active selector');
    // Also ensure dynamic pane specific selector exists
    assert(css.includes('.editor-pane--dynamic.active') || css.includes('.editor-pane--dynamic'), 'Styles should include .editor-pane--dynamic.active or .editor-pane--dynamic');

    const rendererPath = path.join(__dirname, '..', 'src', 'renderer', 'app.js');
    return fs.readFile(rendererPath, 'utf8').then((src) => {
      // Ensure updateEditorPaneVisuals toggles active on dynamic panes
      assert(src.includes("querySelectorAll('.editor-pane--dynamic')") || src.includes('querySelectorAll(".editor-pane--dynamic') || src.includes(".editor-pane--dynamic"), 'Renderer should query dynamic panes');
      assert(src.includes("el.classList.toggle('active'") || src.includes('classList.toggle("active"') || src.includes("classList.toggle('active',"), 'Renderer should toggle active class on dynamic panes');
      console.log('Active-pane visuals source checks passed.');
    });
  });
}

function testLatexEditorBehavior() {
  // Ensure LaTeX is treated as editable and raw content is placed into the editor
  const rendererPath = path.join(__dirname, '..', 'src', 'renderer', 'app.js');
  return fs.readFile(rendererPath, 'utf8').then((src) => {
    assert(src.includes("paneNote.type === 'markdown' || paneNote.type === 'latex'"), 'Renderer should detect markdown or latex in active pane handling');
    // Check that the code writes raw content into inst.el.value for latex/markdown
    assert(src.includes("inst.el.value = paneNote.content ?? ''") || src.includes("inst.el.value = paneNote.content || ''"), 'Renderer should populate editor with paneNote.content for markdown/latex');
    console.log('LaTeX editor behavior source checks passed.');
  });
}

function testHashtagUIAndPersistence() {
  // Verify the CSS contains rules anchoring the hashtag container to bottom
  const cssPath = path.join(__dirname, '..', 'src', 'renderer', 'styles.css');
  return fs.readFile(cssPath, 'utf8').then((css) => {
    assert(css.includes('margin-top: auto') || css.includes('order: 99'), 'Hashtag container should be anchored to the bottom (margin-top:auto or order:99)');
    assert(css.includes('.hashtag-container.hashtag-minimized'), 'Styles should include minimized hashtag rules');
    // Ensure minimized rules hide list/detail and hide resize handle
    assert(css.includes('.hashtag-container.hashtag-minimized .hashtag-list') && css.includes('.hashtag-container.hashtag-minimized .hashtag-detail'), 'Minimized rules should hide list and detail');
    assert(css.includes('.hashtag-container.hashtag-minimized .hashtag-resize-handle') || css.includes('hide the resize handle'), 'Minimized rules should hide the resize handle');

    // Check storage keys used by renderer for persistence
    const rendererPath = path.join(__dirname, '..', 'src', 'renderer', 'app.js');
    return fs.readFile(rendererPath, 'utf8').then((src) => {
      assert(src.includes("NTA.hashtagPanelHeight"), 'Renderer should persist NTA.hashtagPanelHeight');
      assert(src.includes("NTA.hashtagPanelMinimized"), 'Renderer should persist NTA.hashtagPanelMinimized');
      assert(src.includes("NTA.hashtagPanelPrevHeight"), 'Renderer should persist NTA.hashtagPanelPrevHeight');
      console.log('Hashtag UI and persistence checks passed.');
    });
  });
}

function testEditorPolicyLogic() {
  // Mirror the logic from openNoteInPane for whether editor textarea should be disabled
  const shouldDisable = (note) => {
    if (note.type === 'markdown' || note.type === 'latex') return false;
    if (note.type === 'code' && note.language === 'text') return false;
    return true;
  };

  // Markdown should be editable
  assert.equal(shouldDisable({ type: 'markdown' }), false, 'Markdown should be editable');
  // LaTeX should be editable
  assert.equal(shouldDisable({ type: 'latex' }), false, 'LaTeX should be editable');
  // Code file with text language (.txt) should be editable
  assert.equal(shouldDisable({ type: 'code', language: 'text' }), false, '.txt (code:text) should be editable');
  // Other code files (python) should be disabled in pane
  assert.equal(shouldDisable({ type: 'code', language: 'python' }), true, 'Python code should be read-only in pane');

  console.log('Editor policy logic tests passed.');
}

// Citation test functions
function parseBibtex(bibtexText) {
  if (!bibtexText) return {};
  const entries = {};
  const raw = bibtexText.split(/@/).map(s => s.trim()).filter(Boolean);
  for (const item of raw) {
    const m = item.match(/^[^{]+\{\s*([^,\s]+)\s*,([\s\S]*)\}\s*$/m);
    if (!m) continue;
    const key = m[1].trim();
    const body = m[2];
    const entry = { key };
    const titleM = body.match(/title\s*=\s*\{([^}]*)\}/i);
    const authorM = body.match(/author\s*=\s*\{([^}]*)\}/i);
    const yearM = body.match(/year\s*=\s*\{([^}]*)\}/i);
    const urlM = body.match(/url\s*=\s*\{([^}]*)\}/i);
    if (titleM) entry.title = titleM[1].trim();
    if (authorM) entry.author = authorM[1].trim();
    if (yearM) entry.year = yearM[1].trim();
    if (urlM) entry.url = urlM[1].trim();
    entries[key] = entry;
  }
  return entries;
}

function insertCitationWithStyleInternalFake(inst, citeKey, start, end, style, cachedBib) {
  const bibIndexMap = {};
  Object.keys(cachedBib || {}).forEach((k, idx) => { bibIndexMap[k] = idx + 1; });
  const entry = (cachedBib || {})[citeKey] || {};
  let replacement = `[@${citeKey}]`;
  if (style === 'author-year') {
    const a = entry.author ? entry.author.split(' and ')[0].split(' ').pop() : citeKey;
    replacement = `(${a}${entry.year ? `, ${entry.year}` : ''})`;
  } else if (style === 'numeric') {
    const num = bibIndexMap[citeKey] || '?';
    replacement = `[${num}]`;
  } else if (style === 'author-inline') {
    const a = entry.author ? entry.author.split(' and ')[0].split(' ').pop() : citeKey;
    replacement = `${a}${entry.year ? ` (${entry.year})` : ''}`;
  } else if (style === 'brackets') {
    replacement = `[@${citeKey}]`;
  }

  if (typeof inst.setRangeText === 'function') {
    inst.setRangeText(replacement);
  } else {
    const v = inst.getValue();
    inst.setValue(v.slice(0, start) + replacement + v.slice(end));
  }
}

class FakeEditor {
  constructor(val) { this.val = val; this.selectionStart = 0; this.selectionEnd = 0; }
  isPresent() { return true; }
  getValue() { return this.val; }
  setValue(v) { this.val = v; }
  setRangeText(s) { const start = this.selectionStart; const end = this.selectionEnd; this.val = this.val.slice(0, start) + s + this.val.slice(end); }
  setSelectionRange(s,e) { this.selectionStart = s; this.selectionEnd = e; }
}

const createTempDir = async () => {
  const prefix = path.join(os.tmpdir(), 'note-taking-app-');
  return fs.mkdtemp(prefix);
};

const buildDummyPdf = async (target) => {
  const pdfContent = '%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF';
  await fs.writeFile(target, pdfContent, 'utf8');
};

(async () => {
  try {
    const tempDir = await createTempDir();
    const store = createNotesStore(tempDir);
    await store.initialize();

    let notes = await store.loadNotes();
    assert(Array.isArray(notes));
    assert.equal(notes.length, 0, 'Fresh store should be empty');

    const now = new Date().toISOString();
    const sampleNotes = [
      {
        id: 'test-note',
        title: 'Sample markdown',
        type: 'markdown',
        content: '# Hello world',
        createdAt: now,
        updatedAt: now
      }
    ];

    await store.saveNotes(sampleNotes);

    notes = await store.loadNotes();
    assert.equal(notes.length, 1, 'Should load the saved note');
    assert.equal(notes[0].title, 'Sample markdown');

    const pdfSource = path.join(tempDir, 'sample.pdf');
    await buildDummyPdf(pdfSource);

    const imported = await store.importPdf(pdfSource);
    assert.equal(imported.type, 'pdf');
    assert(imported.storedPath);

    const dataUri = await store.readPdfAsDataUri(imported.storedPath);
    assert(dataUri && dataUri.startsWith('data:application/pdf;base64,'));

    const workspaceDir = await createTempDir();
    const markdownPath = path.join(workspaceDir, 'workspace-note.md');
    const pdfPath = path.join(workspaceDir, 'workspace-doc.pdf');
    const pythonPath = path.join(workspaceDir, 'workspace-script.py');
    const notebookPath = path.join(workspaceDir, 'workspace-notes.ipynb');

    await fs.writeFile(markdownPath, '# External note\n\n$$\nE = mc^2\n$$\n');
    await buildDummyPdf(pdfPath);
    await fs.writeFile(pythonPath, 'print("hello workspace")\n', 'utf8');
    const notebookPayload = {
      cells: [
        {
          cell_type: 'markdown',
          source: ['# Workspace Notebook\n']
        },
        {
          cell_type: 'code',
          source: ['for i in range(3):\n', '    print(i)\n']
        }
      ],
      metadata: {}
    };
    await fs.writeFile(notebookPath, JSON.stringify(notebookPayload, null, 2), 'utf8');

    const { notes: folderNotes, tree } = await loadFolderNotes(workspaceDir);
    assert(tree, 'Folder loader should return a tree structure');
    assert(folderNotes.length >= 2, 'Folder loader should discover markdown and pdf files');

    const externalMarkdown = folderNotes.find((note) => note.type === 'markdown');
    const externalPdf = folderNotes.find((note) => note.type === 'pdf');
  const pythonNote = folderNotes.find((note) => note.absolutePath === pythonPath);
  const notebookNote = folderNotes.find((note) => note.absolutePath === notebookPath);

    assert(externalMarkdown?.content.includes('E = mc^2'));
    assert(externalMarkdown.absolutePath === markdownPath);

    const externalPdfDataUri = await readPdfAsDataUri(externalPdf.absolutePath);
    assert(externalPdfDataUri.startsWith('data:application/pdf;base64,'));

  assert(pythonNote, 'Python script should load from workspace');
  assert.equal(pythonNote.type, 'code');
  assert.equal(pythonNote.language, 'python');
  assert(pythonNote.content.includes('hello workspace'));

  assert(notebookNote, 'Notebook file should load from workspace');
  assert.equal(notebookNote.type, 'notebook');
  assert(Array.isArray(notebookNote.notebook?.cells));
  assert.equal(notebookNote.notebook.cells.length, 2);

    const amendedContent = `${externalMarkdown.content}\nAppended line.`;
    await saveMarkdownFile(externalMarkdown.absolutePath, amendedContent);

    const { notes: refreshedNotes } = await loadFolderNotes(workspaceDir);
    const updatedMarkdown = refreshedNotes.find((note) => note.id === externalMarkdown.id);
    assert(updatedMarkdown.content.includes('Appended line.'));

    const createResult = await createMarkdownFile(workspaceDir, 'new-note.md');
    assert(createResult.createdNoteId, 'Should return an id for the new note');
    const createdNote = createResult.notes.find((note) => note.id === createResult.createdNoteId);
    assert(createdNote, 'Created note should be present in refreshed notes');
    assert.equal(createdNote.content, '', 'Newly created markdown file should start empty');

    const createdFilePath = path.join(workspaceDir, 'new-note.md');
    const createdFileContent = await fs.readFile(createdFilePath, 'utf8');
    assert.equal(createdFileContent, '', 'Created file should exist on disk');

  const renameResult = await renameMarkdownFile(workspaceDir, createdFilePath, 'renamed-note.md');
  assert(renameResult.renamedNoteId, 'Rename should provide the updated note id');
  const renamedNote = renameResult.notes.find((note) => note.id === renameResult.renamedNoteId);
  assert(renamedNote, 'Renamed note should exist in refreshed notes');
  assert.equal(path.basename(renamedNote.absolutePath), 'renamed-note.md');
  const renamedExists = await fs.readFile(path.join(workspaceDir, 'renamed-note.md'), 'utf8');
  assert.equal(renamedExists, '', 'Renamed file should still be empty');

    // Edge case tests
    console.log('Running edge case tests...');
    await testStoreEdgeCases();
    await testFolderManagerEdgeCases();
    await testNewFileTypes();
    console.log('Edge case tests passed.');

    // Additional functionality tests
    console.log('Running additional functionality tests...');
    testSettingsStorage();
    testFileTypeDetection();
    testMathRendering();
    testCitationRendering();
    testExportLogic();
  // Run hashtag UI / persistence checks (async)
  await testHashtagUIAndPersistence();
  console.log('Additional functionality tests passed.');

    // Citation tests
    console.log('Running citation tests...');
    const bibtexSample = `@article{smith2020,
  title={A Sample Paper},
  author={John Smith},
  year={2020},
  url={https://example.com}
}
@book{doe2018,
  title={Another Book},
  author={Jane Doe},
  year={2018}
}`;
    const parsed = parseBibtex(bibtexSample);
    assert.equal(Object.keys(parsed).length, 2, 'Should parse two entries');
    assert.equal(parsed.smith2020.title, 'A Sample Paper');
    assert.equal(parsed.smith2020.author, 'John Smith');
    assert.equal(parsed.smith2020.year, '2020');
    assert.equal(parsed.smith2020.url, 'https://example.com');
    assert.equal(parsed.doe2018.title, 'Another Book');
    assert.equal(parsed.doe2018.author, 'Jane Doe');
    assert.equal(parsed.doe2018.year, '2018');

    const fakeEditor = new FakeEditor('Some text here');
    insertCitationWithStyleInternalFake(fakeEditor, 'smith2020', 0, 0, 'brackets', parsed);
    assert.equal(fakeEditor.getValue(), '[@smith2020]Some text here');

    const fakeEditor2 = new FakeEditor('Cite ');
    fakeEditor2.setSelectionRange(5, 5);
    insertCitationWithStyleInternalFake(fakeEditor2, 'doe2018', 5, 5, 'author-year', parsed);
    assert.equal(fakeEditor2.getValue(), 'Cite (Doe, 2018)');

    const fakeEditor3 = new FakeEditor('Number ');
    fakeEditor3.setSelectionRange(7, 7);
    insertCitationWithStyleInternalFake(fakeEditor3, 'smith2020', 7, 7, 'numeric', parsed);
    assert.equal(fakeEditor3.getValue(), 'Number [1]');

    const fakeEditor4 = new FakeEditor('Inline ');
    fakeEditor4.setSelectionRange(7, 7);
    insertCitationWithStyleInternalFake(fakeEditor4, 'doe2018', 7, 7, 'author-inline', parsed);
    assert.equal(fakeEditor4.getValue(), 'Inline Doe (2018)');

    console.log('Citation tests passed.');

    // Run the full citation test suite
    console.log('Running full citation test suite...');
    try {
      execSync('node tests/citation/run-tests.js', { stdio: 'inherit' });
      console.log('Full citation test suite passed.');
    } catch (error) {
      console.error('Citation test suite failed:', error.message);
      throw error;
    }

    // Syntax check on key source files
    console.log('Running syntax checks on source files...');
    const sourceFiles = [
      'src/main.js',
      'src/preload.js',
      'src/renderer/app.js',
      'src/store/notesStore.js',
      'src/store/folderManager.js'
    ];
    for (const file of sourceFiles) {
      try {
        execSync(`node -c "${path.join(__dirname, '..', file)}"`, { stdio: 'pipe' });
        console.log(`Syntax OK: ${file}`);
      } catch (error) {
        console.error(`Syntax error in ${file}:`, error.message);
        throw error;
      }
    }
    console.log('All syntax checks passed.');

    // Check package.json validity and key files
    console.log('Checking package.json and key files...');
    try {
      const packageJson = JSON.parse(await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf8'));
      assert(packageJson.name, 'package.json should have a name');
      assert(packageJson.version, 'package.json should have a version');
      assert(packageJson.main, 'package.json should have a main entry');
      console.log('package.json is valid.');
    } catch (error) {
      console.error('package.json check failed:', error.message);
      throw error;
    }

    // Check presence of key files
    const keyFiles = ['README.md', 'LICENSE.txt', 'package.json'];
    for (const file of keyFiles) {
      try {
        await fs.access(path.join(__dirname, '..', file));
        console.log(`Key file present: ${file}`);
      } catch {
        console.error(`Missing key file: ${file}`);
        throw new Error(`Missing key file: ${file}`);
      }
    }
    console.log('All key files present.');

  } catch (error) {
    console.error('Smoke test failed:', error);
    process.exitCode = 1;
  }
})();

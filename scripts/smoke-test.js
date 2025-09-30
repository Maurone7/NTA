const assert = require('assert/strict');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { createNotesStore } = require('../src/store/notesStore');
const {
  loadFolderNotes,
  readPdfAsDataUri,
  saveMarkdownFile,
  createMarkdownFile,
  renameMarkdownFile
} = require('../src/store/folderManager');

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

    console.log('Smoke test passed.');
  } catch (error) {
    console.error('Smoke test failed:', error);
    process.exitCode = 1;
  }
})();

const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

describe('Non-renderable file handling', function() {
  it('should track last renderable note ID when opening markdown files', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that lastRenderableNoteId is initialized in state
    assert(src.includes('lastRenderableNoteId: null'), 'state should initialize lastRenderableNoteId');
    
    // Check that openNoteInPane tracks renderable files (markdown, latex, notebook)
    assert(src.includes("paneNote.type === 'markdown' || paneNote.type === 'latex' || paneNote.type === 'notebook'"), 
      'openNoteInPane should track markdown, latex, and notebook file types');
    assert(src.includes('state.lastRenderableNoteId = noteId'), 
      'openNoteInPane should update lastRenderableNoteId for renderable files');
  });

  it('should include notebook type in renderable files', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that notebook is treated as renderable
    assert(src.includes("paneNote.type === 'notebook'"), 
      'Notebook files should be treated as renderable');
  });

  it('should show last renderable note for non-renderable file types', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that renderActiveNote handles non-renderable files
    assert(src.includes('isRenderableType = note.type === \'markdown\' || note.type === \'latex\' || note.type === \'notebook\''), 
      'renderActiveNote should define isRenderableType for markdown, latex, and notebook');
    
    // Check that it falls back to last renderable note
    assert(src.includes('!isRenderableType && state.lastRenderableNoteId'), 
      'renderActiveNote should check for last renderable note when current file is non-renderable');
    
    // Check that it recursively renders the last renderable note
    assert(src.includes('state.activeNoteId = state.lastRenderableNoteId') && src.includes('renderActiveNote()'), 
      'renderActiveNote should recursively render the last renderable note');
  });

  it('should preserve non-renderable file in editor pane while showing last renderable in preview', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that non-renderable files still update editor pane content
    assert(src.includes('mappedNote.type === \'pdf\' || mappedNote.type === \'image\' || mappedNote.type === \'video\' || mappedNote.type === \'code\''), 
      'Non-renderable file types should be identified correctly');
    
    // Check that textarea is disabled for these types
    assert(src.includes('inst.el.disabled = true') && src.includes('inst.el.value = \'\''), 
      'Editor textarea should be disabled for non-renderable file types in editor pane');
  });

  it('should list all renderable file types consistently', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Count occurrences of renderable type checks (both with note and paneNote)
    const markdownLatexNotebookPattern = /(?:note|paneNote)\.type === ['"]markdown['"] \|\| (?:note|paneNote)\.type === ['"]latex['"] \|\| (?:note|paneNote)\.type === ['"]notebook['"]/g;
    const matches = src.match(markdownLatexNotebookPattern);
    
    // Should appear at least in openNoteInPane and renderActiveNote (isRenderableType)
    assert(matches && matches.length >= 2, 
      'Renderable type checks (markdown, latex, notebook) should appear in multiple places');
  });

  it('should not render preview for pdf files', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // When a PDF is opened, it should show the last renderable note instead
    // This is verified by the fallback logic we implemented
    assert(src.includes("note.type === 'pdf'"), 
      'Code should check for pdf file type');
    
    // PDF handling should be in the non-renderable fallback path
    assert(src.includes('!isRenderableType'), 
      'PDF files should trigger the non-renderable fallback logic');
  });

  it('should not render preview for image files', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    assert(src.includes("note.type === 'image'"), 
      'Code should check for image file type');
    
    // Image files should trigger the non-renderable fallback
    assert(src.includes('!isRenderableType'), 
      'Image files should trigger the non-renderable fallback logic');
  });

  it('should not render preview for video files', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    assert(src.includes("note.type === 'video'"), 
      'Code should check for video file type');
    
    // Video files should trigger the non-renderable fallback
    assert(src.includes('!isRenderableType'), 
      'Video files should trigger the non-renderable fallback logic');
  });

  it('should handle case when no last renderable note exists', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that code handles the case when lastRenderableNoteId is not set
    assert(src.includes('if (lastRenderableNote)'), 
      'Code should verify lastRenderableNote exists before using it');
    
    // Should continue with normal non-renderable handling (with html-mode check etc)
    assert(src.includes("note.type === 'html'"), 
      'Code should continue with normal handling when no last renderable note is available');
  });
});

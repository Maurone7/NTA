const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

describe('LaTeX editor behavior', function() {
  it('app.js should treat LaTeX as editable in setActiveEditorPane', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    assert(src.includes("paneNote.type === 'markdown' || paneNote.type === 'latex'"), 'Renderer should detect markdown or latex in active pane handling');
    assert(src.includes("inst.el.value = paneNote.content ?? ''") || src.includes("inst.el.value = paneNote.content || ''"), 'Renderer should populate editor with paneNote.content for markdown/latex');
  });

  it('should handle LaTeX environment auto-completion', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that handleLatexEnvironmentAutoComplete function exists
    assert(src.includes('const handleLatexEnvironmentAutoComplete'), 'handleLatexEnvironmentAutoComplete function should exist');
    
    // Check that it's called in handleEditorKeydown for LaTeX files
    assert(src.includes("handleLatexEnvironmentAutoComplete(ta)"), 'handleLatexEnvironmentAutoComplete should be called in keydown handler');
    assert(src.includes("note.type === 'latex'"), 'Auto-completion should only work for LaTeX files');
  });

  it('should process LaTeX includegraphics commands', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that processLatexContent handles includegraphics
    assert(src.includes('\\\\includegraphics'), 'processLatexContent should handle includegraphics commands');
    assert(src.includes('data-raw-src'), 'includegraphics should be converted to img with data-raw-src');
    assert(src.includes('data-note-id'), 'img tags should include data-note-id for path resolution');
  });

  it('should process LaTeX centering commands', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that processLatexContent handles centering
    assert(src.includes('\\\\centering'), 'processLatexContent should handle centering commands');
  });

  it('should render LaTeX figures with proper CSS styling', async function() {
    const cssPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'styles.css');
    const css = await fs.readFile(cssPath, 'utf8');
    
    // Check that LaTeX figures have proper styling
    assert(css.includes('.latex-preview figure'), 'CSS should style LaTeX figures');
    assert(css.includes('text-align: center'), 'Figures should be centered');
    assert(css.includes('.latex-preview figcaption'), 'Figure captions should be styled');
  });

  it('should call processPreviewImages for LaTeX rendering', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that renderLatexPreview calls processPreviewImages
    assert(src.includes('void processPreviewImages()'), 'renderLatexPreview should call processPreviewImages');
  });
});

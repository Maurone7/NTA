const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

describe('Editor status messages and export functionality', function() {
  it('should display file title in status bar when opening files', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');

    // Check that openNoteInPane uses note.title in status messages
    assert(src.includes('setStatus(`${note.title || \'Untitled\'} opened in editor.`, true)'),
           'Status message should show file title when opening file in editor pane');

    assert(src.includes('setStatus(`${note.title || \'Untitled\'} assigned to editor.`, true)'),
           'Status message should show file title when assigning file to editor pane');
  });

  it('should handle export with proper image processing', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');

    // Check that handleExport waits for image processing
    assert(src.includes('await processPreviewImages()'),
           'handleExport should wait for processPreviewImages before exporting');

    assert(src.includes('await processPreviewHtmlIframes()'),
           'handleExport should wait for processPreviewHtmlIframes before exporting');

    // Check that the HTML is retrieved after image processing
    const exportFunctionMatch = src.match(/async function handleExport\([^)]*\) \{([\s\S]*?)\}/);
    assert(exportFunctionMatch, 'handleExport function should exist');

    const exportFunctionBody = exportFunctionMatch[1];
    assert(exportFunctionBody.includes('await processPreviewImages()'),
           'processPreviewImages should be called before getting HTML in handleExport');
    assert(exportFunctionBody.includes('const html = elements.preview ? elements.preview.innerHTML : \'\';'),
           'HTML should be retrieved after image processing');
  });

  it('should properly resolve LaTeX includegraphics in export', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');

    // Check that processLatexContent converts includegraphics to img tags with data-raw-src
    assert(src.includes('\\\\includegraphics'),
           'processLatexContent should handle includegraphics commands');

    assert(src.includes('data-raw-src="${filename}"'),
           'includegraphics should be converted to img with data-raw-src attribute');

    // Check that processPreviewImages resolves data-raw-src attributes
    assert(src.includes('img.getAttribute(\'data-raw-src\')'),
           'processPreviewImages should process data-raw-src attributes');
  });
});
const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

describe('Export default save dialog path', function() {
  it('renderer should pass notePath when invoking export APIs', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');

    assert(src.includes('notePath: note.absolutePath'),
           'renderer should pass notePath: note.absolutePath when calling export APIs');
  });

  it('main should compute defaultPath from notePath when folderPath is not provided', async function() {
    const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
    const src = await fs.readFile(mainPath, 'utf8');

    // The main handler should compute a dirname from data.notePath and use
    // that to construct a defaultPath for the save dialog.
    const hasDirname = src.includes('path.dirname(String(data.notePath))') || src.includes('path.dirname(data.notePath)');
    const hasDefaultPdf = src.includes('defaultPath: defaultPdfPath') || src.includes('defaultPdfPath =');

    assert(hasDirname, 'main should compute dirname of data.notePath');
    assert(hasDefaultPdf, 'main should pass computed defaultPath to dialog.showSaveDialog');
  });
});

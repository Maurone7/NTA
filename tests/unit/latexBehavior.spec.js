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
});

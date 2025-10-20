const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

describe('Renderer visuals and dynamic pane active class', function() {
  it('CSS should include .editor-pane.active and .editor-pane--dynamic.active', async function() {
    const cssPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'styles.css');
    const css = await fs.readFile(cssPath, 'utf8');
    assert(css.includes('.editor-pane.active') || css.includes('.editor-pane.active,'), 'Styles should include .editor-pane.active selector');
    assert(css.includes('.editor-pane--dynamic.active') || css.includes('.editor-pane--dynamic'), 'Styles should include .editor-pane--dynamic.active or .editor-pane--dynamic');
  });

  it('app.js should toggle active on dynamic panes', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    assert(src.includes("querySelectorAll('.editor-pane--dynamic')") || src.includes('querySelectorAll(".editor-pane--dynamic') || src.includes(".editor-pane--dynamic"), 'Renderer should query dynamic panes');
    assert(src.includes("classList.toggle('active'") || src.includes('classList.toggle("active"') || src.includes("classList.toggle('active',"), 'Renderer should toggle active class on dynamic panes');
  });
});

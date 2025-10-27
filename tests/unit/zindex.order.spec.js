const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('CSS z-index ordering', function () {
  const cssPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'styles.css');
  let css = '';

  before(function () {
    css = fs.readFileSync(cssPath, 'utf8');
  });

  function findZIndex(selector) {
    // Match the selector block and capture z-index value inside it.
    // This is a pragmatic parser suitable for tests (not a full CSS parser).
    const re = new RegExp(selector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s*\\{[^}]*?z-index:\\s*([0-9]+)\\s*;", 'm');
    const m = css.match(re);
    if (!m) return null;
    return Number(m[1]);
  }

  it('terminal z-index should be higher than splitters/dividers/sidebar handles', function () {
    const terminalZ = findZIndex('.nta-terminal-container');
    const splitterZ = findZIndex('.workspace__splitter');
    const dividerZ = findZIndex('.editors__divider');
    const sidebarZ = findZIndex('.sidebar-resize-handle');

    assert.ok(terminalZ !== null, 'could not find .nta-terminal-container z-index in styles.css');
    assert.ok(splitterZ !== null, 'could not find .workspace__splitter z-index in styles.css');
    assert.ok(dividerZ !== null, 'could not find .editors__divider z-index in styles.css');
    // sidebar handle may not declare z-index; treat missing as -Infinity so terminal will be higher
    const sidebarVal = sidebarZ === null ? Number.NEGATIVE_INFINITY : sidebarZ;

    const maxOther = Math.max(splitterZ, dividerZ, sidebarVal);
    assert.ok(
      terminalZ > maxOther,
      `terminal z-index (${terminalZ}) must be greater than other handles/dividers (max: ${maxOther})`
    );
  });
});

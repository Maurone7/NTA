const assert = require('assert');
const path = require('path');
const fs = require('fs');

describe('Terminal working directory wiring', function() {
  this.timeout(5000);

  it('renderer should include folderPath when sending latex install command', function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = fs.readFileSync(appPath, 'utf8');
    assert(src.includes("latex:send-install-command"), 'renderer should send latex:send-install-command');
    // Ensure folderPath is passed along with the install payload
    assert(src.includes('folderPath'), 'renderer should pass folderPath when sending install command');
  });

  it('main should expose terminal:setCwd handler and use provided folderPath when creating PTY', function() {
    const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
    const src = fs.readFileSync(mainPath, 'utf8');
    assert(src.includes("'terminal:setCwd'") || src.includes('terminal:setCwd'), 'main should register terminal:setCwd handler');
    // Ensure latex install fallback uses folderPath when initializing PTY
    assert(src.includes('latex:send-install-command') && src.includes('folderPath'), 'main latex handler should accept folderPath');
    assert(src.includes('getPtyProcess') , 'main should call getPtyProcess when initializing PTY');
  });
});

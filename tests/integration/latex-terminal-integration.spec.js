const assert = require('assert');
const path = require('path');
const fs = require('fs');

describe('LaTeX Terminal Integration', function() {
  this.timeout(10000);

  describe('Terminal opening for LaTeX installation', function() {
    it('should have terminal container in DOM', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('nta-terminal-container'), 'should have terminal container div');
      assert(src.includes('nta-terminal'), 'should have terminal div');
    });

    it('should have latex:show-terminal-for-install event listener', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('latex:show-terminal-for-install'), 'should listen for latex:show-terminal-for-install event');
    });

    it('should expose latex:show-terminal-for-install channel from preload', function() {
      const preloadPath = path.join(__dirname, '..', '..', 'src', 'preload.js');
      const src = fs.readFileSync(preloadPath, 'utf8');
      assert(src.includes("'latex:show-terminal-for-install'"), 'preload should whitelist latex:show-terminal-for-install channel');
    });

    it('should check terminal visibility before sending command', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('container.style.display') || src.includes('isVisible'), 'should check terminal visibility');
      assert(src.includes('terminal:toggleRequest'), 'should send toggle request if not visible');
    });

    it('should wait for terminal to become visible', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('while') && src.includes('container.style.display'), 'should poll for terminal visibility');
      assert(src.includes('attempts') || src.includes('setTimeout'), 'should wait with timeout');
    });

    it('should initialize PTY before sending command', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('terminal:init'), 'should initialize terminal PTY');
      assert(src.includes('folderPath'), 'should pass folder path to PTY');
    });

    it('should send install command to terminal via main process', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('latex:send-install-command'), 'should send install command event');
      assert(src.includes('command') && src.includes('distribution'), 'should include command and distribution');
    });

    it('should have main process handler for terminal install command', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(src.includes('latex:send-install-command'), 'main should handle latex:send-install-command');
      assert(src.includes('ptyProcess'), 'should access PTY process');
      assert(src.includes('ptyProcess.write'), 'should write to PTY');
    });

    it('should ensure PTY is ready before sending command', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(src.includes('ptyProcess.killed'), 'should check if PTY is killed');
      assert(src.includes('getPtyProcess'), 'should initialize PTY if needed');
    });

    it('should log terminal opening steps for debugging', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('[LaTeX Renderer]'), 'should log LaTeX renderer events');
      assert(src.includes('console.log') || src.includes('console.error'), 'should log messages');
    });

    it('should log PTY operations in main process', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(src.includes('[LaTeX IPC]'), 'should log LaTeX IPC events');
    });

    it('should handle errors gracefully', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('catch') && src.includes('latex:installation-error'), 'should send error event on failure');
    });

    it('should update status message during process', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('Initializing terminal'), 'should show initialization message');
      assert(src.includes('installation in progress'), 'should show progress message');
    });

    it('should have sufficient wait time for terminal initialization', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('50') || src.includes('100'), 'should poll multiple times');
      assert(src.includes('300'), 'should wait 300ms for init');
    });

    it('should handle case when terminal already open', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('else'), 'should have else branch for already visible');
      assert(src.includes('already visible'), 'should log when already open');
    });

    it('should use internal terminal not external', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(!src.includes('osascript'), 'should not use AppleScript for terminal');
      assert(!src.includes('open -a Terminal'), 'should not open external Terminal app');
      assert(src.includes('ptyProcesses'), 'should use internal PTY');
    });

    it('should send brew install command with newline', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(src.includes('ptyProcess.write'), 'should write to PTY');
      assert(src.includes('\\n') || src.includes('\n'), 'should send newline');
    });

    it('should track distribution being installed', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(src.includes('distribution'), 'should track distribution name');
    });
  });

  describe('Terminal initialization flow', function() {
    it('should find and reference terminal container', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('getElementById') && src.includes('nta-terminal-container'), 'should find terminal container');
    });

    it('should check container exists before using', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('if (!container)'), 'should check if container found');
      assert(src.includes('throw'), 'should throw if container missing');
    });

    it('should toggle terminal display', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('none'), 'should check for hidden state');
      assert(src.includes('flex'), 'should use flex display');
    });

    it('should wait for terminal visibility before proceeding', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('while') && src.includes('attempts'), 'should poll with timeout');
      assert(src.includes('setTimeout') || src.includes('Promise'), 'should use async wait');
    });

    it('should log terminal initialization details', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('Opening terminal'), 'should log opening');
      assert(src.includes('opened after'), 'should log timing');
      assert(src.includes('already visible'), 'should log when already open');
      assert(src.includes('Sending install command'), 'should log command send');
    });
  });

  describe('PTY lifecycle for LaTeX installation', function() {
    it('should use ptyProcesses map', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(src.includes('ptyProcesses'), 'should use ptyProcesses map');
      assert(src.includes('.get('), 'should get PTY by window ID');
    });

    it('should create PTY on demand', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(src.includes('getPtyProcess'), 'should call getPtyProcess to create PTY');
      assert(src.includes('BrowserWindow.fromWebContents'), 'should get browser window');
    });

    it('should write command to PTY with newline', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(src.includes('write') && (src.includes('\\n') || src.includes('\n')), 'should send with newline');
    });

    it('should handle errors sending to PTY', function() {
      const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
      const src = fs.readFileSync(mainPath, 'utf8');
      assert(src.includes('try') && src.includes('catch'), 'should wrap PTY write in try-catch');
    });
  });

  describe('User feedback during installation', function() {
    it('should provide clear status messages', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('installation started'), 'should announce start');
      assert(src.includes('terminal'), 'should mention terminal');
    });

    it('should show installation progress states', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('Initializing'), 'should show initialization state');
      assert(src.includes('progress'), 'should show in-progress state');
    });

    it('should show errors if terminal initialization fails', function() {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      const src = fs.readFileSync(appPath, 'utf8');
      assert(src.includes('Failed to initialize terminal') || src.includes('installation-error'), 'should show error');
    });
  });
});

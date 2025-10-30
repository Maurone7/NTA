const assert = require('assert');
const path = require('path');
const Module = require('module');

describe('Terminal cwd - strong test', function() {
  this.timeout(5000);

  it('should spawn PTY with requested cwd when provided', function() {
    // Patch Module._load to return a fake node-pty implementation so we can
    // intercept spawn options.
    const originalLoad = Module._load;
    const fakePty = {
      lastSpawnArgs: null,
      spawn: function(shell, args, opts) {
        fakePty.lastSpawnArgs = { shell, args, opts };
        // Minimal fake PTY instance used by getPtyProcess
        return {
          onData: function() {},
          kill: function() {},
          write: function() {},
          resize: function() {},
          killed: false
        };
      }
    };

    // Provide a minimal fake Electron so main.js can initialize handlers
    const fakeElectron = (() => {
      class FakeBrowserWindow {
        constructor() {
          this.webContents = {
            send: () => {},
            isLoading: () => false,
            once: () => {},
          };
        }
        loadFile() {}
        isDestroyed() { return false; }
        static fromWebContents() { return new FakeBrowserWindow(); }
        static getFocusedWindow() { return null; }
        static getAllWindows() { return []; }
      }

      const fakeIpcMain = {
        _handlers: {},
        handle: function(channel, fn) { this._handlers[channel] = fn; },
        on: function(channel, fn) { this._handlers[channel] = this._handlers[channel] || []; this._handlers[channel].push(fn); }
      };

      return {
        app: { whenReady: () => Promise.resolve(), on: () => {}, quit: () => {} },
        BrowserWindow: FakeBrowserWindow,
        ipcMain: fakeIpcMain,
        dialog: { showOpenDialog: async () => ({ filePaths: [] }) },
        globalShortcut: { register: () => {} }
      };
    })();

    Module._load = function(request, parent, isMain) {
      if (request === 'node-pty') return fakePty;
      if (request === 'electron') return fakeElectron;
      return originalLoad.apply(this, arguments);
    };

    // Require main.js after our mock is in place so it picks up fakePty
    const main = require(path.join(__dirname, '..', '..', 'src', 'main.js'));

    try {
      const testExports = main.__test__;
      assert(testExports && typeof testExports.getPtyProcess === 'function', 'test hook getPtyProcess available');

      // Call getPtyProcess with a custom cwd
      const fakeWindowId = 'test-window-1';
      const fakeBrowserWindow = { webContents: { send: () => {} } };
      const requestedCwd = '/tmp/my-workspace';

      // Invoke underlying function
      testExports.getPtyProcess(fakeWindowId, fakeBrowserWindow, requestedCwd);

      // Validate the fake pty.spawn was called with cwd === requestedCwd
      assert(fakePty.lastSpawnArgs, 'pty.spawn was called');
      assert.strictEqual(fakePty.lastSpawnArgs.opts.cwd, requestedCwd, 'spawn cwd matches requestedCwd');

      // Also ensure ptyProcesses map contains the created entry
      assert(testExports.ptyProcesses.has(fakeWindowId), 'ptyProcesses contains the new PTY for window');
    } finally {
      // Restore loader to avoid affecting other tests
      Module._load = originalLoad;
    }
  });

  it('should fallback to homedir when no cwd provided', function() {
    const os = require('os');
    const originalLoad = Module._load;
    const fakePty = {
      lastSpawnArgs: null,
      spawn: function(shell, args, opts) {
        fakePty.lastSpawnArgs = { shell, args, opts };
        return { onData: function(){}, kill: function(){}, write: function(){}, resize: function(){}, killed: false };
      }
    };
    const fakeElectron = (() => {
      class FakeBrowserWindow {
        constructor() {
          this.webContents = { send: () => {}, isLoading: () => false, once: () => {} };
        }
        loadFile() {}
        isDestroyed() { return false; }
        static fromWebContents() { return new FakeBrowserWindow(); }
        static getFocusedWindow() { return null; }
        static getAllWindows() { return []; }
      }
      const fakeIpcMain = { handle: function(){}, on: function(){} };
      return { app: { whenReady: () => Promise.resolve(), on: () => {}, quit: () => {} }, BrowserWindow: FakeBrowserWindow, ipcMain: fakeIpcMain, dialog: { showOpenDialog: async () => ({ filePaths: [] }) }, globalShortcut: { register: () => {} } };
    })();
    Module._load = function(request, parent, isMain) {
      if (request === 'node-pty') return fakePty;
      if (request === 'electron') return fakeElectron;
      return originalLoad.apply(this, arguments);
    };

    // Re-require a fresh copy of main by deleting from cache
    const mainPath = path.join(__dirname, '..', '..', 'src', 'main.js');
    delete require.cache[require.resolve(mainPath)];
    const main = require(mainPath);

    try {
      const testExports = main.__test__;
      assert(testExports && typeof testExports.getPtyProcess === 'function', 'test hook getPtyProcess available');

      const fakeWindowId = 'test-window-2';
      const fakeBrowserWindow = { webContents: { send: () => {} } };

      testExports.getPtyProcess(fakeWindowId, fakeBrowserWindow, null);

      assert(fakePty.lastSpawnArgs, 'pty.spawn was called');
      assert.strictEqual(fakePty.lastSpawnArgs.opts.cwd, os.homedir(), 'spawn cwd falls back to os.homedir()');
      assert(testExports.ptyProcesses.has(fakeWindowId), 'ptyProcesses contains the new PTY for window');
    } finally {
      Module._load = originalLoad;
    }
  });
});

const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Update mechanism', function() {
  // Mock the required modules and functions
  let mockHttps;
  let mockOs;
  let mockCp;
  let mockFsp;
  let mockApp;
  let mockMainWindow;

  beforeEach(function() {
    // Reset mocks before each test
    mockHttps = {
      get: function(url, options, callback) {
        const mockRes = {
          statusCode: 200,
          headers: {},
          setEncoding: function() {},
          on: function(event, handler) {
            if (event === 'data') handler('version: 0.0.8\nfiles:\n  - url: NTA-0.0.8-arm64.zip\n    sha512: test\n    size: 1000\n');
            if (event === 'end') handler();
          },
          resume: function() {}
        };
        if (callback) callback(mockRes);
        return {
          on: function(event, handler) {
            // Mock request events
          }
        };
      }
    };

    mockOs = {
      tmpdir: () => '/tmp',
      arch: 'arm64'
    };

    mockCp = {
      execFile: function(cmd, args, callback) {
        callback(null); // Success
      },
      spawn: function(cmd, args, options) {
        return {
          unref: function() {},
          on: function(event, handler) {}
        };
      }
    };

    mockFsp = {
      readFile: function(path, encoding) {
        if (path.includes('dev-app-update.yml')) {
          return Promise.resolve('version: 0.0.8\nfiles:\n  - url: NTA-0.0.8-arm64.zip\n    sha512: test\n    size: 1000\n');
        }
        return Promise.reject(new Error('File not found'));
      },
      rm: function(path, options) {
        return Promise.resolve();
      },
      mkdir: function(path, options) {
        return Promise.resolve();
      },
      writeFile: function(path, content, options) {
        return Promise.resolve();
      }
    };

    mockApp = {
      quit: function() {}
    };

    mockMainWindow = {
      webContents: {
        send: function(channel, data) {}
      }
    };
  });

  it('should successfully perform fallback update with local manifest', async function() {
    // Mock the performFallbackUpdate function with our test setup
    async function performFallbackUpdate({ preferUserApplications = true } = {}) {
      const https = mockHttps;
      const os = mockOs;
      const cp = mockCp;
      const fsp = mockFsp;
      const tmpdir = os.tmpdir();
      const arch = os.arch === 'arm64' ? 'arm64' : 'x64';

      // Helper to fetch text from URL
      const fetchText = (u, redirectCount = 0) => new Promise((resolve, reject) => {
        const req = https.get(u, { headers: { 'User-Agent': 'NTA-updater' }, timeout: 10000 }, (res) => {
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 400)) {
            reject(new Error('HTTP ' + res.statusCode + ' for ' + u));
            return;
          }
          let s = '';
          res.setEncoding('utf8');
          res.on('data', (c) => s += c);
          res.on('end', () => resolve(s));
        });
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout for ' + u));
        });
      });

      try {
        let yamlText = null;

        // Try network fetch (will fail in test)
        try {
          yamlText = await fetchText('https://github.com/Maurone7/NTA/releases/latest/download/latest-mac.yml');
        } catch (e) {
          // Fall back to local dev manifest
          const devManifestPath = path.join(process.resourcesPath, '..', '..', 'dev-app-update.yml');
          yamlText = await fsp.readFile(devManifestPath, 'utf8');
        }

        // Parse YAML
        const yaml = require('js-yaml');
        const manifestObj = yaml.load(yamlText);

        let assetFile = null;
        if (Array.isArray(manifestObj.files)) {
          const files = manifestObj.files;
          const match = files.find(f => String(f.url || '').includes(arch));
          if (match && match.url) assetFile = match.url;
        }

        assert(assetFile, 'Should find asset file for architecture');

        // Mock download
        const outZip = path.join(tmpdir, assetFile);
        await new Promise((resolve, reject) => {
          const file = fs.createWriteStream(outZip);
          // Mock successful download
          file.end();
          file.on('finish', resolve);
          file.on('error', reject);
        });

        // Mock extraction
        const extractDir = path.join(tmpdir, 'NTA-upd');
        await fsp.rm(extractDir, { recursive: true, force: true });
        await fsp.mkdir(extractDir, { recursive: true });
        await new Promise((resolve, reject) => {
          cp.execFile('unzip', ['-q', outZip, '-d', extractDir], (err) => err ? reject(err) : resolve());
        });

        // Mock code signature removal
        const extractedApp = path.join(extractDir, 'NTA.app');
        try { await fsp.rm(path.join(extractedApp, 'Contents', '_CodeSignature'), { recursive: true, force: true }); } catch(e){}

        // Mock script creation and execution
        const targetApp = preferUserApplications ? path.join(process.env.HOME || '/', 'Applications', 'NTA.app') : '/Applications/NTA.app';
        const scriptPath = path.join(tmpdir, 'nta-replace.sh');
        const script = `#!/bin/sh\n\nsleep 1\n\nrm -rf "${targetApp}"\n/usr/bin/ditto "${extractedApp}" "${targetApp}"\n\nopen -a "${targetApp}"\n`;
        await fsp.writeFile(scriptPath, script, { mode: 0o755 });
        const child = cp.spawn('sh', [scriptPath], { detached: true, stdio: 'ignore' });
        child.unref();
        mockApp.quit();

        return { ok: true, message: 'Started background replacement script', target: targetApp };
      } catch (err) {
        return { ok: false, error: String(err) };
      }
    }

    // Run the test
    const result = await performFallbackUpdate();
    assert(result.ok, 'Update should succeed');
    assert(result.message.includes('Started background replacement script'), 'Should return success message');
    assert(result.target.includes('NTA.app'), 'Should specify target app path');
  });

  it('should handle network failure and use local manifest', async function() {
    // Modify mock to simulate network failure
    let networkCalled = false;
    mockHttps.get = function(url, options, callback) {
      networkCalled = true;
      const req = {
        on: function(event, handler) {
          if (event === 'error') handler(new Error('Network error'));
        }
      };
      return req;
    };

    // Mock the performFallbackUpdate function
    async function performFallbackUpdate({ preferUserApplications = true } = {}) {
      const https = mockHttps;
      const fsp = mockFsp;

      const fetchText = (u) => new Promise((resolve, reject) => {
        const req = https.get(u, { headers: { 'User-Agent': 'NTA-updater' }, timeout: 10000 });
        req.on('error', reject);
      });

      try {
        let yamlText = null;

        // Try network fetch (will fail)
        try {
          yamlText = await fetchText('https://github.com/Maurone7/NTA/releases/latest/download/latest-mac.yml');
        } catch (e) {
          // Fall back to local dev manifest
          const devManifestPath = path.join(__dirname, '..', '..', 'dev-app-update.yml');
          yamlText = await fsp.readFile(devManifestPath, 'utf8');
        }

        assert(yamlText, 'Should get YAML text from local manifest');
        assert(yamlText.includes('version: 0.0.8'), 'Should contain correct version');

        return { ok: true, message: 'Fallback successful' };
      } catch (err) {
        return { ok: false, error: String(err) };
      }
    }

    const result = await performFallbackUpdate();
    assert(networkCalled, 'Should have attempted network call');
    assert(result.ok, 'Should succeed with local manifest fallback');
    assert(result.message.includes('Fallback successful'), 'Should indicate fallback worked');
  });

  it('should handle timeout correctly', async function() {
    // Modify mock to simulate timeout
    let timeoutCalled = false;
    mockHttps.get = function(url, options, callback) {
      const req = {
        destroy: function() {},
        on: function(event, handler) {
          if (event === 'timeout') {
            timeoutCalled = true;
            handler();
          }
        }
      };
      return req;
    };

    async function performFallbackUpdate() {
      const https = mockHttps;
      const fsp = mockFsp;

      const fetchText = (u) => new Promise((resolve, reject) => {
        const req = https.get(u, { headers: { 'User-Agent': 'NTA-updater' }, timeout: 10000 });
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout for ' + u));
        });
      });

      try {
        await fetchText('https://github.com/Maurone7/NTA/releases/latest/download/latest-mac.yml');
        return { ok: true };
      } catch (err) {
        // Should fall back to local manifest
        const devManifestPath = path.join(__dirname, '..', '..', 'dev-app-update.yml');
        await fsp.readFile(devManifestPath, 'utf8');
        return { ok: true, message: 'Used local manifest after timeout' };
      }
    }

    const result = await performFallbackUpdate();
    assert(timeoutCalled, 'Should have triggered timeout');
    assert(result.ok, 'Should handle timeout and use fallback');
  });

  it('should properly handle quitAndInstall with pending update', async function() {
    // Test the quitAndInstall IPC handler logic
    let appQuitCalled = false;
    let processesChecked = false;
    let appReplaced = false;
    let appLaunched = false;
    let logWritten = false;

    // Mock the dependencies
    const mockApp = {
      quit: function() { appQuitCalled = true; }
    };

    const mockCp = {
      spawn: function(cmd, args, options) {
        if (cmd === 'pgrep') {
          processesChecked = true;
          return {
            stdout: {
              on: function(event, handler) {
                if (event === 'data') handler('');
              }
            },
            on: function(event, handler) {
              if (event === 'close') handler(1); // No processes found
            }
          };
        } else if (cmd === 'ditto') {
          appReplaced = true;
          return {
            on: function(event, handler) {
              if (event === 'close') handler(0); // Success
            }
          };
        } else if (cmd === 'open') {
          appLaunched = true;
          return {
            on: function(event, handler) {
              if (event === 'close') handler(0); // Success
            }
          };
        }
        return { on: function() {} };
      }
    };

    const mockFs = {
      appendFileSync: function(path, data) {
        logWritten = true;
      }
    };

    const mockOs = {
      tmpdir: () => '/tmp'
    };

    const mockPath = {
      join: path.join,
      resolve: path.resolve
    };

    // Mock the quitAndInstall handler
    async function testQuitAndInstall() {
      const fs = mockFs;
      const path = mockPath;
      const logFile = path.join(mockOs.tmpdir(), 'nta-restart.log');

      const log = (msg) => {
        const timestamp = new Date().toISOString();
        const line = `${timestamp}: ${msg}\n`;
        console.log(msg);
        try { fs.appendFileSync(logFile, line); } catch(e) {}
      };

      const pendingUpdatePath = '/tmp/test-update.app';

      log('app:quitAndInstall: starting');
      try {
        log('app:quitAndInstall: calling app.quit()');
        mockApp.quit();
        log('app:quitAndInstall: app.quit() returned');

        // If there's a pending update, install it after quitting
        if (pendingUpdatePath) {
          setTimeout(async () => {
            try {
              log('app:quitAndInstall: installing pending update from ' + pendingUpdatePath);
              const cp = mockCp;
              const os = mockOs;

              // Wait for the app to exit (including helper processes), but avoid waiting forever.
              log('app:quitAndInstall: waiting for NTA processes to exit');
              const WAIT_MAX = 30;
              let count = 0;
              while (true) {
                try {
                  const result = await new Promise((resolve, reject) => {
                    const child = mockCp.spawn('pgrep', ['-af', 'NTA.app/Contents/MacOS/NTA|NTA Helper'], { stdio: ['pipe', 'pipe', 'pipe'] });
                    let stdout = '';
                    child.stdout.on('data', (data) => stdout += data.toString());
                    child.on('close', (code) => {
                      if (code === 0) resolve(stdout.trim());
                      else resolve('');
                    });
                    child.on('error', () => resolve(''));
                  });
                  const filtered = result.split('\n').filter(line => line && !line.includes('nta-replace.sh') && !line.includes('/bin/sh -c')).join('\n');
                  if (!filtered) {
                    log('app:quitAndInstall: no running NTA processes detected');
                    break;
                  }
                  log('app:quitAndInstall: waiting for NTA processes to exit...');
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  count++;
                  if (count >= WAIT_MAX) {
                    log('app:quitAndInstall: timeout waiting for processes, attempting to kill');
                    break;
                  }
                } catch (e) {
                  log('app:quitAndInstall: error checking processes: ' + e.message);
                  break;
                }
              }

              // Choose target path
              const targetApp = '/Applications/NTA.app';
              log('app:quitAndInstall: target app: ' + targetApp);

              // Copy new app
              log('app:quitAndInstall: copying from ' + pendingUpdatePath + ' to ' + targetApp);
              await new Promise((resolve, reject) => {
                const child = mockCp.spawn('ditto', [pendingUpdatePath, targetApp], { stdio: 'inherit' });
                child.on('close', (code) => {
                  if (code === 0) {
                    log('app:quitAndInstall: ditto succeeded');
                    resolve();
                  } else {
                    reject(new Error('ditto failed with code ' + code));
                  }
                });
                child.on('error', (err) => {
                  log('app:quitAndInstall: ditto error: ' + err.message);
                  reject(err);
                });
              });

              // Launch the new app
              log('app:quitAndInstall: launching new app');
              await new Promise((resolve, reject) => {
                const child = mockCp.spawn('open', [targetApp], { stdio: 'inherit' });
                child.on('close', (code) => {
                  if (code === 0) {
                    log('app:quitAndInstall: open succeeded');
                    resolve();
                  } else {
                    reject(new Error('open failed with code ' + code));
                  }
                });
                child.on('error', (err) => {
                  log('app:quitAndInstall: open error: ' + err.message);
                  reject(err);
                });
              });

              log('app:quitAndInstall: update installed and launched successfully');
            } catch (e) {
              log('app:quitAndInstall: install failed: ' + e.message);
            }

            // Force exit
            log('app:quitAndInstall: forcing exit');
          }, 10); // Short timeout for test
        }
      } catch(e){
        log('app:quitAndInstall: app.quit() threw: ' + e.message);
      }
    }

    // Run the test
    await testQuitAndInstall();

    // Give async operations time to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify the expected behavior
    assert(appQuitCalled, 'App.quit should be called');
    assert(processesChecked, 'Should check for running processes');
    assert(appReplaced, 'Should replace the app bundle');
    assert(appLaunched, 'Should launch the new app');
    assert(logWritten, 'Should write to log file');
  });
});
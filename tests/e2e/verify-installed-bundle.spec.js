const { test, expect } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');
const cp = require('child_process');

test.describe('Verify installed bundle runs updated version', () => {
  test('verify Info.plist and that launched process points to installed bundle', async () => {
    const targetApp = path.join(os.homedir(), 'Applications', 'NTA.app');
    const plistPath = path.join(targetApp, 'Contents', 'Info.plist');

    console.log('Checking installed Info.plist at:', plistPath);
    // Ensure Info.plist exists
    if (!fs.existsSync(plistPath)) {
      throw new Error('Installed Info.plist not found at ' + plistPath);
    }

    const plistContent = fs.readFileSync(plistPath, 'utf8');
    const match = plistContent.match(/<key>CFBundleVersion<\/key>\s*<string>([^<]+)<\/string>/);
    const installedVersion = match ? match[1] : null;
    console.log('Installed CFBundleVersion:', installedVersion);

    expect(installedVersion).not.toBeNull();
    // Expect the updated test version
    expect(installedVersion).toBe('0.0.5');

    // Now launch the installed app using `open` and verify a running process references the target bundle
  console.log('Launching installed app via `open -n -a` (new instance)...');
  cp.spawnSync('open', ['-n', '-a', targetApp]);

    // Poll for a running process referencing the target app path
    const start = Date.now();
    const timeout = 20000; // 20s
    let found = false;
    let foundOutput = '';
    while (Date.now() - start < timeout) {
      try {
        // Check for processes where the command includes the app bundle path
        const out = cp.execSync(`ps -axo pid,command | grep '${targetApp}' || true`, { encoding: 'utf8' });
        if (out && out.includes(targetApp)) {
          found = true;
          foundOutput = out.trim();
          break;
        }
      } catch (e) {
        // pgrep may return non-zero when not found
      }
      await new Promise(r => setTimeout(r, 500));
    }

    console.log('pgrep output (matching processes):', foundOutput);
    expect(found).toBe(true);

    // Cleanup: try to quit the launched app
    try {
      cp.spawnSync('osascript', ['-e', `tell application "NTA" to quit`]);
    } catch (e) {}
  });
});

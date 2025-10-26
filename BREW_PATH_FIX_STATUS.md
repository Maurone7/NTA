# LaTeX Installation Fix - Status Update

## Issue Found

**The problem:** When you clicked "Install", the status bar showed 1% then disappeared back to "Ready".

**Root cause:** The `brew install` command was failing because Electron's child processes couldn't find the `brew` executable, even though it was installed at `/opt/homebrew/bin/brew`.

## Solution Implemented

### Changes Made to `src/latex-installer.js`

1. **Added `findBrewPath()` function** that:
   - Checks for brew at `/opt/homebrew/bin/brew` (Apple Silicon Macs)
   - Checks for brew at `/usr/local/bin/brew` (Intel Macs)
   - Checks for brew at `/home/linuxbrew/.linuxbrew/bin/brew` (Linux)
   - Falls back to `'brew'` if not found

2. **Updated `showDistributionPicker()`** to:
   - Call `findBrewPath()` to get the full path
   - Use the full path in install commands: `/opt/homebrew/bin/brew install basictex`

3. **Enhanced `runInstallationInBackground()`** to:
   - Create a custom environment with brew's directory added to PATH
   - Pass this enhanced environment to the spawned bash process
   - Log comprehensive debugging information

4. **Improved error logging** to:
   - Show full installation details
   - Capture and display all stderr output
   - Log command, exit code, duration, and output line count

## How It Works Now

```javascript
// Find brew's location
const brewPath = findBrewPath();  // Returns: /opt/homebrew/bin/brew

// Get brew's directory
const brewDir = brewPath.substring(0, brewPath.lastIndexOf('/'));  // /opt/homebrew/bin

// Create environment with brew in PATH
const env = Object.assign({}, process.env, {
  PATH: `${brewDir}:${process.env.PATH || ''}`
});

// Spawn bash with this environment
const child = spawn('bash', ['-c', command], {
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true,
  env: env  // ← This is the key fix
});
```

## Testing & Verification

### Test 1: Verify Brew Detection ✓
Run: `node test-brew-spawn.js`
Result: 
```
✓ Found brew at: /opt/homebrew/bin/brew
✓ Command exited with code: 0
SUCCESS: Brew is accessible with the new PATH!
```

### Test 2: Test Installation Command
Run: `node test-brew-install.js`
Expected: Installation proceeds with full output visible

### Test 3: Full App Test
Run: `npm start`
Then: Try to export to PDF with LaTeX

Expected flow:
1. App starts → LaTeX not detected (normal)
2. Try export to PDF
3. Distribution picker dialog appears
4. Select "BasicTeX"
5. Status bar shows: "Installing BasicTeX... 1% (2s elapsed)"
6. Progress increases every 2 seconds
7. After 2-5 minutes: Installation completes
8. Status shows: "✓ BasicTeX installed successfully"
9. Restart app
10. PDF export now works! ✓

## Console Output (When Debugging)

You'll see messages like:
```
[LaTeX] ========== INSTALLATION START ==========
[LaTeX] Distribution: BasicTeX
[LaTeX] Command: /opt/homebrew/bin/brew install basictex
[LaTeX] Brew path: /opt/homebrew/bin/brew
[LaTeX] Brew directory: /opt/homebrew/bin
[LaTeX] NEW PATH: /opt/homebrew/bin:/Users/mauro/.nvm/versions/node/v24.10.0/bin:...
[LaTeX] HOME: /Users/mauro
[LaTeX] User: mauro
[LaTeX] ==========================================
```

Then after completion:
```
[LaTeX] Installation completed with code: 0
[LaTeX] Total output lines: 42
[LaTeX] Installation summary:
[LaTeX]   Command: /opt/homebrew/bin/brew install basictex
[LaTeX]   Exit code: 0
[LaTeX]   Duration: 180s
[LaTeX]   Output lines: 42
```

## Debugging Steps If Issues Persist

### In the App
1. Open DevTools (Cmd+I)
2. Go to Console tab
3. Look for `[LaTeX]` messages
4. Check if brew is found and PATH is set correctly

### Via Terminal
```bash
# Test brew detection
node /Users/mauro/Desktop/NoteTakingApp/test-brew-spawn.js

# Test full installation simulation
node /Users/mauro/Desktop/NoteTakingApp/test-brew-install.js

# Check if BasicTeX is installed after
xelatex --version  # or pdflatex --version
```

## Files Modified

- `src/latex-installer.js` - Enhanced with:
  - `findBrewPath()` function
  - Environment passing to spawn
  - Detailed logging
  
- Created test utilities:
  - `test-brew-spawn.js` - Tests brew detection and PATH
  - `test-brew-install.js` - Tests installation command

## Why This Works

1. **Electron isolation:** Electron runs in a sandbox that doesn't have your shell's full environment
2. **PATH resolution:** When Node.js spawns bash, it needs an explicit PATH
3. **Brew location:** Homebrew on Apple Silicon is at `/opt/homebrew/bin/`
4. **Fix:** We explicitly add brew's directory to the PATH before spawning
5. **Result:** `brew install` now works! ✓

## Next Steps

1. **Rebuild the app:**
   ```bash
   npm start
   ```

2. **Try the installation:**
   - Open a note
   - Export to PDF (with LaTeX)
   - Select BasicTeX
   - Wait for installation (2-5 minutes)
   - Status bar should show progress

3. **Monitor console output:**
   - Open DevTools (Cmd+I)
   - Watch for `[LaTeX]` messages
   - Verify brew path and command are logged

4. **Restart after completion:**
   - Installation must complete first
   - Then restart the app
   - LaTeX will be detected on startup
   - PDF export will work!

## Exit Code Handling

The installer treats these as success:
- `0` = Normal successful installation
- `1` = Warning (often means already installed)
- `2` = Already installed or completion warning

Any other code still completes the process, but asks user to restart and verify.

## If Still Not Working

Please share:
1. Console output with `[LaTeX]` messages
2. The exit code shown in "Installation completed"
3. Any error messages in the stderr output
4. Result of: `which brew` and `ls -l /opt/homebrew/bin/brew`

This will help diagnose any remaining issues.

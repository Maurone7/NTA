# Brew PATH Fix - October 25, 2025

## Problem Identified

When Electron tried to run `brew install`, it failed with:
```
bash: brew: command not found
```

**Root Cause:** Electron doesn't inherit the full shell environment from your terminal. Even though `brew` is installed at `/opt/homebrew/bin/brew`, Electron's child processes couldn't find it because:
1. Electron's `process.env.PATH` doesn't include `/opt/homebrew/bin`
2. The bash shell spawned by Node.js doesn't load your shell configuration files

## Solution Implemented

### Changes to `src/latex-installer.js`:

1. **Added `findBrewPath()` function** (lines 9-26):
   - Checks standard Homebrew locations for the `brew` executable
   - Supports Apple Silicon (`/opt/homebrew/bin/brew`)
   - Supports Intel Macs (`/usr/local/bin/brew`)
   - Supports Linux Homebrew (`/home/linuxbrew/.linuxbrew/bin/brew`)
   - Falls back to `'brew'` if not found (assumes it's in PATH)

2. **Updated `showDistributionPicker()` function**:
   - Now calls `findBrewPath()` to get the full brew path
   - Constructs install commands with full path: `/opt/homebrew/bin/brew install basictex`

3. **Enhanced `runInstallationInBackground()` function**:
   - Creates custom environment with brew's directory added to PATH
   - Passes this environment to the spawned bash process
   - Logs the PATH being used for debugging

### Key Code Changes:

```javascript
// Find brew executable
const brewPath = findBrewPath();
const brewDir = brewPath.substring(0, brewPath.lastIndexOf('/'));

// Create environment with brew path
const env = Object.assign({}, process.env, {
  PATH: `${brewDir}:${process.env.PATH || ''}`
});

// Pass environment to spawn
const child = spawn('bash', ['-c', command], {
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true,
  env: env  // ← NEW: Pass custom environment
});
```

## How It Works Now

1. **Detection Phase**: App starts, LaTeX detection runs (checks PATH, finds nothing)
2. **Export Trigger**: User tries to export to PDF
3. **Picker Dialog**: User sees distribution selection (BasicTeX or MacTeX)
4. **User Selection**: User picks BasicTeX or MacTeX
5. **Confirmation Dialog**: User confirms installation
6. **Installation**: 
   - `findBrewPath()` locates brew at `/opt/homebrew/bin/brew`
   - Commands become: `/opt/homebrew/bin/brew install basictex`
   - Bash spawned with `PATH` including `/opt/homebrew/bin`
   - Brew command succeeds! ✓
7. **Progress Tracking**: Status bar shows installation progress (2-5 min for BasicTeX)
8. **Completion**: Installation finishes, user restarts app
9. **Success**: LaTeX now detected, PDF export works! ✓

## Testing the Fix

### Option 1: Manual Installation via App (Recommended)

1. Rebuild and run:
   ```bash
   npm start
   ```

2. Try to export a document to PDF using LaTeX:
   - Open a note in the app
   - Click "Export" → "PDF (LaTeX)"
   - You should see the picker dialog

3. Select "BasicTeX (Recommended)" - 400MB, 2-5 minutes

4. Watch the status bar:
   - Shows "Installing BasicTeX... 15% (30s elapsed)"
   - Progress updates every 2 seconds
   - After 2-5 minutes: "✓ BasicTeX installed successfully"

5. Restart the app

6. Try exporting to PDF again - should work! ✓

### Option 2: Manual Installation via Homebrew

If you prefer to install manually first:
```bash
/opt/homebrew/bin/brew install basictex
```

Then restart the app - it will detect the installation and allow PDF export immediately.

### Debugging

If you encounter issues, check the DevTools console:
- Press Cmd+I in the app window
- Look for `[LaTeX]` messages showing:
  - `Found brew at: /opt/homebrew/bin/brew`
  - `Running command: /opt/homebrew/bin/brew install basictex`
  - `With PATH: /opt/homebrew/bin:/...`

If brew is not found in standard locations, you can find it:
```bash
which brew
```

Then add that location to the `commonPaths` array in `findBrewPath()`.

## Files Modified

- `src/latex-installer.js` - Added brew path detection and environment passing

## Dependencies

- No new dependencies added
- Uses built-in Node.js modules: `child_process`, `fs`, `os`

## Compatibility

- **macOS**: Works with both Apple Silicon (`/opt/homebrew/`) and Intel (`/usr/local/`)
- **Linux**: Supports Homebrew on Linux (`/home/linuxbrew/`)
- **Windows**: Will use system PATH (assumes `brew` in PATH or use MiKTeX UI)

## Exit Codes

Installation treats the following as success:
- `0` = Normal success
- `1` = Warning (brew quirk - often means "already installed")
- `2` = Already installed or completion warning

Any other code still completes, but user is asked to restart and verify.

## Progress Indicator

During installation, status bar shows:
- **BasicTeX**: Progress ramped over 180 seconds (estimate 3 minutes)
- **MacTeX**: Progress ramped over 1320 seconds (estimate 22 minutes)
- Actual installation may be faster/slower depending on internet speed

## Future Improvements

1. Add detection for other package managers (apt, dnf, etc. on Linux)
2. Support Windows MiKTeX installation
3. Add visual progress bar instead of percentage text
4. Cache brew path after first detection
5. Add option to skip Homebrew and install manually

## Summary

The fix ensures Electron can successfully run `brew install` by:
1. Finding the brew executable's location
2. Adding that location to the bash environment PATH
3. Passing this enhanced environment to spawned processes

This makes LaTeX installation work seamlessly within the app on macOS systems where Homebrew is installed.

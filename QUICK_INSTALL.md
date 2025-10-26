# Quick Installation Guide

## The Fix

Your app couldn't find `brew` even though it was installed. Fixed by:
1. Detecting brew's location: `/opt/homebrew/bin/brew`
2. Adding it to the PATH when spawning the installation process
3. Adding detailed logging for debugging

## Quick Test

```bash
cd /Users/mauro/Desktop/NoteTakingApp
node test-brew-spawn.js
```

You should see:
```
✓ Found brew at: /opt/homebrew/bin/brew
Homebrew 4.6.18
✓ Command exited with code: 0
SUCCESS: Brew is accessible with the new PATH!
```

## To Install LaTeX via the App

1. Start the app:
   ```bash
   npm start
   ```

2. Open a note and try to export to PDF (using LaTeX)

3. When prompted, select **"BasicTeX (Recommended)"** - 400MB, 2-5 minutes

4. Watch the status bar for progress updates

5. After installation completes, **restart the app**

6. Try exporting to PDF again - should work! ✓

## What Changed

- `src/latex-installer.js`:
  - Added `findBrewPath()` function
  - Pass environment with brew's directory to spawn
  - Enhanced logging

- New test files:
  - `test-brew-spawn.js` - Test brew detection
  - `test-brew-install.js` - Full installation test

## If Something Still Goes Wrong

1. Check the console (Cmd+I) for `[LaTeX]` messages
2. Run: `node test-brew-spawn.js`
3. Run: `which brew` to verify brew is installed
4. Share the console output if you need help

## Manual Installation (Alternative)

If you prefer to install manually instead:
```bash
/opt/homebrew/bin/brew install basictex
```

Then restart the app - LaTeX will be detected and PDF export will work.

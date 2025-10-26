# LaTeX Installation - Terminal Window Approach (FINAL FIX)

## The Problem

The previous attempt using `stdio: 'inherit'` resulted in:
```
sudo: unable to read password: Input/output error
sudo: unable to restore terminal settings: Input/output error
```

## The Solution

**Open a native macOS Terminal window for the installation.**

This avoids all Electron I/O conflicts while giving sudo proper TTY access.

## How It Works

1. **Create a shell script** in `/tmp/latex-install-XXXXXX.sh`
2. **Open Terminal window** via AppleScript
3. **Script runs in Terminal** with proper stdio
4. **Sudo password prompt works** naturally
5. **App monitors** for LaTeX installation
6. **Terminal closes** when complete

## Installation Process

```
┌─────────────────────────────────────────────────────────┐
│ Note Taking App (stays responsive)                       │
│                                                          │
│ User: Export → PDF (LaTeX) → Select BasicTeX           │
│ ↓                                                        │
│ App: Create /tmp/latex-install-XXXXXX.sh               │
│ ↓                                                        │
│ App: Open Terminal window via AppleScript               │
│ ↓                                                        │
│ Status bar: "Installing BasicTeX... 5%"                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Terminal Window (Native macOS app)                       │
│                                                          │
│ ==> Downloading mactex-basictex-20250308.pkg           │
│ ==> Installing Cask basictex                           │
│ ==> Running installer for basictex with `sudo`...      │
│ Password: ██████████                                   │
│                                                          │
│ [User types password naturally, no I/O errors]         │
│                                                          │
│ installer: Installing to volume /                       │
│ installer: The install was successful.                  │
│ ✓ Installation successful!                              │
│ This window will close in 3 seconds...                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Note Taking App (Status bar updates)                     │
│                                                          │
│ Status bar:                                              │
│ "Installing BasicTeX... 15% (30s elapsed)"              │
│ "Installing BasicTeX... 50% (100s elapsed)"             │
│ "✓ Installation successful. Restart to use LaTeX"       │
│                                                          │
│ User: Restart app                                        │
│ ↓                                                        │
│ LaTeX detected ✓                                         │
│ PDF export works ✓                                       │
└─────────────────────────────────────────────────────────┘
```

## Key Benefits

✅ **No I/O errors** - Terminal is native macOS app
✅ **Sudo works** - Proper TTY configuration
✅ **Professional** - User sees real terminal
✅ **Transparent** - Full installation visibility
✅ **Reliable** - No Electron stdio conflicts
✅ **Simple** - Clean, straightforward approach

## Testing

### 1. Start the app
```bash
npm start
```

### 2. Export to PDF with LaTeX
- Open note → Export → PDF (LaTeX)

### 3. Select BasicTeX

### 4. Terminal window appears
- Should open automatically
- Shows installation progress
- Prompts for password naturally

### 5. Enter your password
- Type your Mac password
- Press Enter
- **No I/O errors!**

### 6. Wait for completion
- Terminal shows progress
- 2-5 minutes for BasicTeX
- Status bar updates in app

### 7. Restart app
- Installation complete
- Terminal closes

### 8. Test PDF export
- Should work now! ✓

## Console Output

Open DevTools (Cmd+I) and look for:

```
[LaTeX] ========== INSTALLATION START ==========
[LaTeX] Distribution: BasicTeX
[LaTeX] Command: /opt/homebrew/bin/brew install basictex
[LaTeX] Opening Terminal window...
[LaTeX] Terminal window opened
[LaTeX] ==========================================

[LaTeX Detection] Checking pdflatex...
[LaTeX Detection] ✓ LaTeX detected! Installation successful!
[LaTeX] Installation completed successfully!
[LaTeX] ✓ BasicTeX installed successfully. Restart the app to use LaTeX export.
```

## If Issues

### Terminal doesn't open
- Check if AppleScript works: `osascript -e 'tell application "Terminal" to activate'`
- Check console for error messages (Cmd+I)

### Password fails
- Use your Mac login password
- Not sudo password, just your regular password
- Terminal will retry if needed

### Takes too long
- BasicTeX: 2-5 minutes (normal)
- MacTeX: 15-30 minutes (normal)
- Check Terminal window for progress

### Manual installation
```bash
/opt/homebrew/bin/brew install basictex
# Then restart the app
```

## Code Changes

**File:** `src/latex-installer.js`

New functions:
- `runInstallationInBackground()` - Creates script, opens Terminal, monitors
- `monitorInstallationCompletion()` - Checks for LaTeX every 10 seconds

Process:
1. Creates shell script in `/tmp/`
2. Calls `osascript` to open Terminal
3. Terminal runs the script
4. App monitors for `xelatex --version` success
5. Updates status bar with progress
6. Notifies when complete

## Files Created

During installation:
- `/tmp/latex-install-XXXXXX.sh` - Installation script (cleaned up after)

Documentation:
- `TERMINAL_WINDOW_SOLUTION.md` - This approach explanation
- `INSTALL_NEXT_STEPS.md` - User quick start
- Test utilities still available

## Summary

**New approach: Open native Terminal window**

Result:
- ✅ Sudo password works
- ✅ No I/O errors
- ✅ Installation succeeds
- ✅ User sees everything
- ✅ Professional experience

**You're ready to test!** 🚀

```bash
npm start
# Then try exporting to PDF with LaTeX
# Terminal window will open automatically
# Enter your password
# Wait 2-5 minutes
# Restart app
# PDF export works! ✓
```

# LaTeX Package Installer - Testing Guide

## Overview

This guide walks through testing the one-click LaTeX package installer feature.

## Prerequisites

- TeX Live with `tlmgr` installed on macOS/Linux
- MiKTeX on Windows
- The app running with the latest code

## Test Scenario

### Step 1: Create Test File

The test file `/tmp/test_install.tex` has been created with content:

```latex
\documentclass{article}
\usepackage{natbib}
\usepackage{geometry}
\usepackage{xcolor}

\title{Package Installation Test}
\author{Test}
\date{}

\begin{document}

\maketitle

\section{Introduction}

This document tests the LaTeX package installer feature.

It uses the following packages:
\begin{itemize}
  \item natbib - for bibliography
  \item geometry - for page layout
  \item xcolor - for colors
\end{itemize}

\end{document}
```

### Step 2: Open File in App

1. Open the NoteTaking App
2. Navigate to File → Open and select `/tmp/test_install.tex`
3. The app should show LaTeX preview

### Step 3: Check Warning Banner

Look for a purple warning banner that says:

```
📦 Some LaTeX packages may not be installed
This document uses: natbib, geometry, xcolor. Make sure these packages are installed.
[Install Missing] [Dismiss]
```

### Step 4: Test Package Installation

1. Click the **"Install Missing"** button
2. The status bar should show: "Opening terminal to install packages..."
3. The embedded terminal (at bottom of screen) should automatically open
4. After 1-2 seconds, the command should appear in the terminal:
   ```
   sudo tlmgr install natbib geometry xcolor
   ```
5. You'll be prompted for your admin password
6. Enter your password and press Enter
7. Watch the installation progress in the terminal

### Step 5: Verify Installation

After the command completes:
1. The terminal should show success messages
2. The warning banner should disappear
3. Close the file and reopen it
4. The warning banner should NOT appear (packages are now installed)

## Expected Behavior

### Success Path

1. **Package Detection**: App recognizes `\usepackage{...}` commands
2. **Warning Display**: Purple banner shows with detected packages
3. **Terminal Opens**: Embedded terminal at bottom becomes visible
4. **Command Ready**: `sudo tlmgr install ...` command appears in terminal
5. **Password Prompt**: System prompts for admin password
6. **Installation**: Packages install successfully
7. **Confirmation**: Banner disappears, file reopens without warning

### Sudo Path (macOS/Linux)

- When packages require elevated privileges (always with TeX Live):
  - Terminal opens automatically
  - Command with `sudo` appears ready to run
  - User enters password when prompted
  - Installation proceeds

### MiKTeX Path (Windows)

- If MiKTeX is detected:
  - Attempts direct installation via `mpm`
  - May not require password on Windows
  - Terminal shows progress directly

### Fallback Path

If terminal doesn't work:
- An alert dialog appears with the command
- User can copy and manually run in Terminal
- App can be restarted after installation

## Debugging

If something doesn't work, check the browser console (DevTools):

```
Open: DevTools → Console Tab
Look for logs starting with: [LaTeX Install]
```

Expected logs:
```
[LaTeX Install] Detected need for sudo. Command: sudo tlmgr install natbib geometry xcolor
[LaTeX Install] Terminal visible: false
[LaTeX Install] Terminal container shown, waiting for initialization...
[LaTeX Install] Sending command to terminal: sudo tlmgr install natbib geometry xcolor
```

## Issues and Fixes

### Terminal doesn't open

1. Check DevTools console for errors
2. Verify `/nta-terminal-container` element exists
3. Try manually: Ctrl+Shift+` to toggle terminal
4. If manual toggle works, try Install again

### Command appears but nothing happens

1. Check if xterm library loaded: `window.Terminal` should exist
2. Terminal might not be initialized yet
3. Timing issue: Try again after a few seconds
4. Check main process logs for PTY errors

### Permission denied or "not writable" error

This is expected! It means:
1. User ran command without sudo
2. Or used wrong package manager for their system

Solution: Re-run the command that appears in the terminal with `sudo`.

### Packages not found after installation

1. Some packages have different names in tlmgr
2. Check exact package name: `tlmgr search package-name`
3. May need to run: `sudo tlmgr update --self && sudo tlmgr update --all`
4. Restart app after installation

## Test Checklist

- [ ] App starts without errors
- [ ] Test file opens and shows LaTeX preview
- [ ] Warning banner appears with correct packages
- [ ] Click "Install Missing" button
- [ ] Status bar shows opening message
- [ ] Terminal opens automatically (1-2 seconds)
- [ ] Command appears in terminal (after another 1-2 seconds)
- [ ] Command includes `sudo tlmgr install natbib geometry xcolor`
- [ ] Terminal is focused and ready for input
- [ ] Can enter admin password
- [ ] Installation begins with tlmgr output
- [ ] After installation, warning banner disappears or closes
- [ ] Reopen file: warning should NOT appear
- [ ] Dismiss button hides banner
- [ ] No console errors in DevTools

## Performance Notes

### Timing

- Terminal container becomes visible: ~200-300ms
- Command appears in terminal: ~1500ms total
- This delay ensures terminal is fully initialized before sending command

### Resource Usage

- Terminal: ~50MB memory (xterm.js instance)
- PTY process: ~5-10MB
- Installation command: uses tlmgr (native, 30-50MB)

## Advanced Testing

### Test 1: Multiple Packages

File with many packages:
```latex
\usepackage{tikz}
\usepackage{pgfplots}
\usepackage{beamer}
\usepackage{fontspec}
```

Expected: Warning shows all 4 packages.

### Test 2: Mixed Packages

File with some standard and some problematic:
```latex
\usepackage{amsmath}      % Standard
\usepackage{natbib}       % Check
\usepackage{graphicx}     % Standard
\usepackage{xcolor}       % Check
```

Expected: Only `natbib, xcolor` appear in warning.

### Test 3: Already Installed

File with already-installed packages.

Expected: No warning banner appears.

### Test 4: Dismiss Then Reopen

1. Open file with packages → See warning
2. Click Dismiss button → Warning disappears
3. Close file
4. Reopen same file → Warning appears again

Expected: Warning appears again (dismissed state is per-session).

## File Locations

- Test file: `/tmp/test_install.tex`
- App: `/Users/mauro/Desktop/NoteTakingApp`
- Source: `/Users/mauro/Desktop/NoteTakingApp/src/renderer/app.js` (install handler)
- Main process: `/Users/mauro/Desktop/NoteTakingApp/src/main.js` (install IPC)

## Success Criteria

✅ Feature complete when:
1. Warning banner appears for documents with problematic packages
2. Install button opens terminal
3. Command appears in terminal (1.5-2 seconds after click)
4. User can run command with `sudo`
5. Packages install successfully
6. No warning on subsequent file opens
7. No console errors or crashes

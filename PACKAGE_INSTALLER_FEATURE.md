# LaTeX Package Installer Feature

## Overview

The NoteTaking App now includes a one-click package installer for missing LaTeX packages. When users open a LaTeX (.tex) file that uses packages like `natbib`, `geometry`, `xcolor`, etc., the app automatically detects which packages might not be installed and displays a helpful warning banner with an "Install Missing" button.

## How It Works

### 1. **Automatic Package Detection**

When a LaTeX file is opened for preview:
- The app extracts all `\usepackage{...}` commands from the document
- It checks these packages against a list of commonly problematic packages that may not be pre-installed:
  - tikz, pgfplots, beamer, xcolor, fontspec
  - unicode-math, listings, minted, siunitx, geometry
  - fancyhdr, hyperref, biblatex, natbib, chemfig
  - circuitikz, asymptote

### 2. **Warning Banner Display**

If missing packages are detected, a purple warning banner appears:
```
📦 Some LaTeX packages may not be installed
This document uses: natbib, geometry, xcolor. Make sure these packages are installed.
[Install Missing] [Dismiss]
```

### 3. **One-Click Installation**

When the user clicks "Install Missing":

#### For TeX Live (tlmgr):
- The app attempts to run `tlmgr install package1 package2 ...`
- If this requires elevated privileges (sudo), the app:
  1. Automatically opens the embedded terminal
  2. Types the command with `sudo` prefix
  3. User needs to enter their password and press Enter

#### For MiKTeX (mpm):
- The app runs `mpm --install=package1 --install=package2 ...`
- If successful, packages are installed directly in the app

### 4. **User Feedback**

After clicking the Install button:
- **Success**: Banner disappears after 2 seconds with success message
- **Needs Sudo**: Terminal automatically opens with the sudo command ready to run
- **Error**: Detailed error message is displayed with fallback alert

## Implementation Details

### Modified Files

1. **src/renderer/index.html**
   - Added "Install Missing" button alongside "Dismiss" button in the warning banner
   - Button container for proper layout with flexbox

2. **src/renderer/styles.css**
   - Added `.latex-packages-warning-banner__buttons` container styling
   - Added `.latex-packages-warning-banner__button--install` styling (green color)
   - Includes hover and active states for visual feedback

3. **src/renderer/app.js**
   - Added `latexPackagesInstallButton` element reference
   - Added click handler for install button
   - Detects missing packages and stores in `state.latexPackagesToShow`
   - **NEW**: Integrated with embedded terminal for automatic command execution
   - Opens terminal when sudo is needed
   - Sends the installation command to the terminal using `safeApi.send('terminal:data', command)`
   - User only needs to enter password when prompted

4. **src/main.js**
   - Added `app:installLatexPackages` IPC handler
   - Detects available LaTeX package manager (tlmgr or mpm)
   - Attempts installation and returns appropriate error messages
   - Special handling for permission errors with sudo instructions

### State Management

- `state.latexPackagesToShow`: Array of missing packages to display in banner
- `state.latexPackagesWarningShown`: Tracks which note's warning has been shown
- `state.missingPackagesByFile`: Reserved for future per-file tracking

## Usage Example

1. **Open a LaTeX file** with packages like:
   ```latex
   \usepackage{natbib}
   \usepackage{geometry}
   \usepackage{xcolor}
   ```

2. **See warning banner** with the detected packages

3. **Click "Install Missing"**:
   - Terminal automatically opens at the bottom
   - After 1-2 seconds, the installation command appears
   - User enters their admin password when prompted
   - Installation proceeds with visual feedback

4. **After installation**:
   - Terminal shows installation progress and completion
   - Close the warning banner (auto-closes after 2 seconds)
   - Restart the app (optional)
   - Open the file again to verify - no warning should appear

## Terminal Integration Details

The feature uses the app's embedded xterm.js terminal:

1. **Terminal State**: Checks if terminal container is visible
2. **Terminal Initialization**: If hidden, shows container with `display: flex`
3. **PTY Connection**: Sends initialization to backend PTY
4. **Command Sending**: Waits 1.5+ seconds for full initialization
5. **Command Format**: Uses `\r\n` line endings for cross-platform compatibility
6. **User Interaction**: User sees prompt and enters password directly in terminal

### Timing

- Terminal becomes visible: ~200ms
- PTY initializes: ~1000ms
- Command sent: ~1500ms total delay
- This ensures reliable delivery even if terminal is slow to initialize

## Package Detection List

The app detects these problematic packages that might need installation:

```javascript
[
  'tikz', 'pgfplots', 'beamer', 'xcolor', 'fontspec',
  'unicode-math', 'listings', 'minted', 'siunitx', 'geometry',
  'fancyhdr', 'hyperref', 'biblatex', 'natbib', 'chemfig',
  'circuitikz', 'asymptote'
]
```

These were chosen because they:
- Are optional (not included in minimal LaTeX installations)
- Are commonly used in academic and technical documents
- Require explicit installation on most systems

## Technical Notes

### Why Sudo for TeX Live?

On macOS and Linux, TeX Live packages are installed to `/usr/local/texlive/`, which requires elevated permissions. The app:
1. Attempts installation without sudo first
2. Detects permission errors in stderr/stdout
3. Shows user the exact sudo command to run

### Why Not Automated Sudo?

Electron apps should not automatically escalate privileges. Instead, the app:
- Shows a transparent dialog with the exact command
- Copies the command to clipboard for easy Terminal paste
- Lets the user review and approve the action

## Future Enhancements

Potential improvements for future versions:
1. **GUI Dialogs**: Use system authentication dialog for sudo (Keychain integration)
2. **Progress Tracking**: Show installation progress in real-time
3. **Auto-Retry**: Automatically re-check for packages after Terminal command
4. **Caching**: Remember which packages user has chosen to ignore
5. **Custom Package Lists**: Let users define additional packages to check

## Testing

To test the package installer feature:

1. Open `documentation/Example.tex` (includes natbib, geometry, xcolor)
2. See the purple warning banner
3. Click "Install Missing"
4. For TeX Live: Follow the Terminal command instructions
5. Restart the app and reopen the file to verify

## User-Facing Error Messages

### Success
```
Successfully installed 3 LaTeX package(s)
```

### Permission Required
```
LaTeX package installation requires administrator privileges.

The command has been copied to your clipboard:

sudo tlmgr install natbib geometry xcolor

Please open Terminal and paste this command, then restart the app.
```

### Manager Not Found
```
No LaTeX package manager found (tlmgr or mpm)
```

### Other Errors
```
Failed to install packages: [detailed error message]
```

## Integration with Existing Features

- **LaTeX Installation Detection**: Works with existing LaTeX detection system
- **Warning Banner**: Reuses existing purple theme and layout
- **Status Bar**: Uses existing `setStatus()` function for feedback
- **State Management**: Integrates with existing app state object
- **IPC Communication**: Uses existing safeApi for main process communication

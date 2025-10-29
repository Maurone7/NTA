# TeX Live Automatic Update Feature

## Overview

The app now automatically opens the terminal and writes the required update commands when it detects a TeX Live version mismatch. No manual copy-pasting needed!

## How It Works

### Before (Old Flow)
1. Click "Install Missing"
2. App detects TeX Live version mismatch
3. Alert appears with instructions
4. User manually copies commands
5. User pastes into Terminal
6. User restarts app
7. Click "Install Missing" again

### After (New Flow - Automatic)
1. Click "Install Missing"
2. App detects TeX Live version mismatch
3. Terminal automatically opens
4. Commands automatically appear in terminal:
   - `sudo tlmgr update --self`
   - `sudo tlmgr update --all`
5. User enters password when prompted
6. Updates run automatically
7. Close terminal
8. Click "Install Missing" again → Installation now succeeds!

## Technical Implementation

### File: src/renderer/app.js

The `needsTlmgrUpdate` handler now:

1. **Opens Terminal Container**
   - Shows the embedded xterm terminal
   - Adds visual classes for styling

2. **Initializes Terminal**
   - Sends `terminal:toggleRequest` to main process
   - Waits for xterm + PTY to initialize (up to 5 seconds)
   - Polls `state.terminalInstance` for readiness

3. **Sends Update Commands**
   - First: `sudo tlmgr update --self`
   - Waits 2 seconds for processing
   - Second: `sudo tlmgr update --all`
   - Both use `\r\n` line endings for cross-platform compatibility

4. **Updates Status Message**
   - Shows "TeX Live is updating. When complete, close this and try installing packages again."
   - User can watch the progress in terminal

5. **Graceful Fallback**
   - If terminal elements not found or initialization fails
   - Shows alert with manual instructions instead

### Command Sequence

```javascript
// Wait for terminal initialization
await waitForTerminalReady();
await new Promise(resolve => setTimeout(resolve, 200));

// Send first update command
safeApi.send('terminal:data', 'sudo tlmgr update --self\r\n');

// Wait for first command to process
await new Promise(resolve => setTimeout(resolve, 2000));

// Send second update command
safeApi.send('terminal:data', 'sudo tlmgr update --all\r\n');
```

## User Experience Improvements

✅ **No Manual Copy-Paste** - Commands written automatically
✅ **Visual Feedback** - User sees terminal with actual output
✅ **Progress Visibility** - Can watch the update process
✅ **Automatic Timing** - 2-second delay between commands for proper sequencing
✅ **Error Handling** - Falls back to alert if terminal unavailable
✅ **Status Updates** - Clear message about what's happening

## Behavior Details

### Terminal Initialization
- Waits up to 5 seconds for xterm + PTY to initialize
- Checks every 100ms for `state.terminalInstance` readiness
- Proceeds anyway if timeout (with console warning)

### Command Timing
- 200ms delay after terminal ready for PTY connection
- 2000ms (2 second) delay between commands for sequential execution
- Gives `tlmgr update --self` time to complete before `update --all`

### Terminal Visibility
- If hidden: Shows container and initializes terminal
- If already visible: Just sends commands
- Uses flexible display for responsive layout

### Status Messages
- Initial: "Opening terminal to update TeX Live..."
- During update: "TeX Live is updating. When complete, close this and try installing packages again."
- Console logging for debugging: `[LaTeX Update]` tagged messages

## Error Handling

### Missing Terminal Elements
- Catches when terminal container/div not found
- Falls back to alert with manual instructions

### Terminal Initialization Timeout
- If PTY not ready after 5 seconds, proceeds anyway
- Logs warning for debugging

### Exception During Send
- Try-catch blocks around all IPC sends
- Falls back to direct send if error occurs

## Testing the Feature

### Prerequisites
- Have TeX Live 2023 or older (version mismatch scenario)
- Have a .tex file with problematic packages (natbib, geometry, xcolor, etc.)
- App should have the terminal embedded

### Test Steps
1. Open /tmp/test_install.tex in app
2. See purple warning banner
3. Click "Install Missing"
4. ✅ Terminal should open automatically
5. ✅ Commands should appear:
   ```
   $ sudo tlmgr update --self
   Password:
   [tlmgr output...]
   $ sudo tlmgr update --all
   [tlmgr output...]
   ```
6. Enter password when prompted
7. Wait for update to complete
8. Close terminal or click elsewhere
9. Click "Install Missing" again
10. ✅ Installation should now proceed to package installation

## Comparison: Package Installation vs Update

### Package Installation Flow (after update)
```
Terminal opens → sudo tlmgr install natbib geometry xcolor → User sees tlmgr output
```

### Update Flow (before package installation)
```
Terminal opens → sudo tlmgr update --self → Wait 2s → sudo tlmgr update --all → Status message
```

Both flows use the same terminal infrastructure but with different command sequences.

## Edge Cases Handled

1. **Terminal already visible** - Just sends commands, doesn't re-initialize
2. **Terminal not ready** - Polls up to 5 seconds, then proceeds anyway
3. **Terminal elements missing** - Falls back to alert
4. **Multiple clicks rapidly** - Each click goes through full flow independently
5. **Commands with special characters** - Uses proper `\r\n` line endings

## Future Improvements

Potential enhancements:
- Add progress bar during update
- Auto-detect when update complete and proceed to package installation
- Add retry button if update fails
- Store update history/log
- Add "Advanced Options" for custom tlmgr commands

## Related Files

- **src/renderer/app.js** - Install button handler and needsTlmgrUpdate logic
- **src/main.js** - Terminal event broadcasting and IPC handlers
- **src/renderer/index.html** - Terminal container HTML elements
- **src/renderer/styles.css** - Terminal styling and responsive layout
- **TEXLIVE_VERSION_MISMATCH_FIX.md** - Original version mismatch detection

## References

- TeX Live Manual: https://www.tug.org/texlive/doc/
- TeX Live Upgrade: https://tug.org/texlive/upgrade.html
- Node PTY Integration: Handles pseudo-terminal for command execution
- xterm.js: Embedded terminal rendering in Electron

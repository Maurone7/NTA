# Terminal Integration - Final Fix

## Problem

The terminal container was showing but xterm wasn't being initialized. When the LaTeX install button was clicked:

1. Terminal container `div` became visible
2. But the actual xterm instance never initialized
3. Commands sent to PTY were lost because PTY wasn't ready

## Root Cause

The issue was in how we were triggering the terminal initialization:

```javascript
// ❌ WRONG - This is a one-way send, doesn't trigger the handler
safeApi.send('terminal:toggle');

// The setupTerminal() function is listening for:
safeApi.on('terminal:toggle', async () => {
  // Initialize xterm and PTY here
});

// But safeApi.send() only sends data, it doesn't trigger listeners
```

The `terminal:toggle` event needs to come from the main process via `webContents.send()`, not from the renderer sending one-way data.

## Solution

### 1. Added IPC Handler in main.js

```javascript
// Handle request to toggle terminal from renderer
ipcMain.on('terminal:toggleRequest', (_event) => {
  const win = BrowserWindow.fromWebContents(_event.sender);
  if (win) {
    win.webContents.send('terminal:toggle');  // Main process sends toggle
  }
});
```

### 2. Updated Renderer to Send Request

```javascript
// ✅ CORRECT - Send a request to main process
safeApi.send('terminal:toggleRequest');

// Main process receives this and sends back:
// win.webContents.send('terminal:toggle')

// Which triggers the setupTerminal listener:
safeApi.on('terminal:toggle', async () => {
  // Now xterm gets initialized!
});
```

## Flow Diagram

```
User clicks "Install Missing"
    ↓
[App.js] Shows terminal container (CSS)
    ↓
[App.js] Sends: safeApi.send('terminal:toggleRequest')
    ↓
[Main.js] Receives 'terminal:toggleRequest'
    ↓
[Main.js] Sends: win.webContents.send('terminal:toggle')
    ↓
[Renderer] safeApi.on('terminal:toggle') triggered
    ↓
[setupTerminal] Creates xterm instance
    ↓
[setupTerminal] Initializes PTY via safeApi.invoke('terminal:init')
    ↓
[setupTerminal] Sets state.terminalInstance
    ↓
[App.js] Detects state.terminalInstance exists
    ↓
[App.js] Sends command: safeApi.send('terminal:data', command + '\r\n')
    ↓
[Main.js] Receives 'terminal:data' on PTY process
    ↓
[PTY] Writes to shell process
    ↓
Terminal shows command and executes it!
```

## Key Changes

### src/main.js
- Added `ipcMain.on('terminal:toggleRequest', ...)` handler
- Properly routes toggle request back through main process

### src/renderer/app.js  
- Changed from `safeApi.send('terminal:toggle')` to `safeApi.send('terminal:toggleRequest')`
- Added proper initialization polling for `state.terminalInstance`
- Both install button and test function now use correct flow

## Testing

### Manual Test
1. Open app
2. Open DevTools Console
3. Run: `testTerminalCommand('echo "test"')`
4. Terminal should open and show prompt
5. After ~5 seconds, command should appear and execute

### LaTeX Test
1. Open `/tmp/test_install.tex`
2. Click "Install Missing" in purple banner
3. Terminal opens with xterm visible
4. After ~5 seconds: `sudo tlmgr install natbib geometry xcolor` appears
5. User enters password
6. Installation proceeds with visible output

## Debug Indicators

### ✅ Success
```
[LaTeX Install] Detected need for sudo. Command: sudo tlmgr install natbib geometry xcolor
[LaTeX Install] Terminal visible: false
[LaTeX Install] Showing terminal container...
[LaTeX Install] Triggering terminal initialization...
[LaTeX Install] Terminal ready! Cols: XX Rows: XX
[LaTeX Install] Sending command to terminal: sudo tlmgr install natbib geometry xcolor
[LaTeX Install] Command sent successfully
```

Terminal shows xterm prompt (`$` or `#`)

### ❌ Failure (Old Code)
```
[LaTeX Install] Terminal not ready after timeout, trying anyway
[LaTeX Install] Command sent successfully
```

Terminal container visible but NO xterm/prompt appears

## Why This Matters

The IPC architecture in Electron requires:
- **One-way sends**: `safeApi.send()` - no expectation of response
- **Requests with response**: `safeApi.invoke()` - waits for handler to respond
- **Event broadcasting**: Only main process can broadcast via `webContents.send()`

We were trying to trigger a listener with a one-way send, which doesn't work. The correct pattern is:
1. Renderer sends request to main process
2. Main process processes and broadcasts event
3. Renderer's listener receives the broadcast

## Performance

- **Terminal initialization**: ~1-2 seconds (first open)
- **Command appearing**: ~5 seconds after click (waits for xterm ready)
- **Command execution**: Immediate after appearing
- **Subsequent opens**: Instant (terminal already initialized)

## Future Optimization

Could optimize by:
1. Pre-initializing terminal on app startup
2. Showing progress indicator while waiting
3. Caching terminal instance across uses
4. Pre-loading xterm.js earlier

For now, the 5-second wait is acceptable UX since it's a one-time operation per session.

# Terminal Testing Guide

## Quick Test Steps

1. **Start the application:**
   ```bash
   npm start
   ```
   Wait for the Electron window to appear.

2. **Open the terminal:**
   - Press `Ctrl+Shift+` ` (Ctrl+Shift+Backtick)
   - The terminal should appear at the bottom of the window
   - Background: White
   - Text: Green for output, Black for prompts
   - Header: "Terminal — bash — 80×24"

3. **Test basic commands:**

   **Test 1: List files**
   ```
   $ ls
   ```
   Should show: Applications, Desktop, Documents, Downloads, etc.

   **Test 2: Print working directory**
   ```
   $ pwd
   ```
   Should show: `/Users/mauro` (or your home directory)

   **Test 3: Echo text**
   ```
   $ echo "Hello Terminal"
   ```
   Should show: `Hello Terminal`

   **Test 4: Test state persistence**
   ```
   $ cd /tmp
   $ pwd
   ```
   Should show: `/tmp` (not home directory)

   **Test 5: Combined command**
   ```
   $ ls -la | head -5
   ```
   Should show: First 5 lines of detailed file listing

4. **Check for output:**
   - Each command should display with a `$` prompt
   - Output should appear in green text below the command
   - A new `$ ` prompt should appear after each command completes

## Debugging

If the terminal doesn't work:

### Check 1: Terminal Container Visibility
Open DevTools (F12) and run:
```javascript
console.log(document.getElementById('nta-terminal-container').style.display);
```
Should show: `flex` (when open) or `none` (when closed)

### Check 2: Browser Console Logs
After typing a command and pressing Enter, look for logs starting with `[Terminal]`:
```
[Terminal] ✓ Command entered: ls
[Terminal] ✓ Output element found: true
[Terminal] ✓ Invoking terminal:execute with: ls
[Terminal] ✓ Got result back from IPC
[Terminal] ✓ Result length: 245
[Terminal] ✓ Added result div to output
```

### Check 3: Main Process Console Logs
Look in the terminal where you ran `npm start` for logs starting with `[Main]`:
```
[Main] 🔧 terminal:execute called
[Main] Command: ls
[Main] Window ID: 1
[Main] ✍️ Writing command to stdin
[Main] 📨 Got data: Applications
[Main] 📤 Resolving with result: Applications
```

### Check 4: Verify IPC Communication
In browser DevTools console, test directly:
```javascript
window.api.invoke('terminal:execute', 'echo test')
  .then(result => console.log('Result:', result))
  .catch(error => console.error('Error:', error))
```

## Expected Behavior After Fixes

✅ Terminal opens and closes with `Ctrl+Shift+` `
✅ Commands execute and show output
✅ Terminal maintains shell state
✅ Multiple commands work in sequence
✅ Output is displayed in green text
✅ Prompts are displayed in black text
✅ Font matches editor settings
✅ Terminal scrolls when output is too long

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Terminal opens but is blank | Check browser DevTools for `[Terminal]` logs |
| Commands don't execute | Check if window ID is being passed correctly |
| Output shows but then disappears | Check CSS display properties and z-index |
| Terminal stays open after closing | Check close button event listener |
| Commands slow to respond | Check for IPC timeout (set to 5 seconds max) |

## Performance Notes

- Shell startup: ~100ms on first use
- Command execution: 50-200ms typical
- IPC round trip: ~10-50ms
- Output display: <10ms
- Overall latency per command: 100-300ms

## Files to Review

- `src/main.js` - Terminal command execution and shell management
- `src/renderer/app.js` - Terminal UI and event handling
- `src/renderer/index.html` - Terminal HTML structure (lines 611-627)
- `src/renderer/styles.css` - Terminal styling (lines 4891-4950+)

## Known Limitations

- No command history (up/down arrows not yet implemented)
- No tab completion
- No Ctrl+C interrupt handling (yet)
- No color support beyond green text
- No image or binary file preview

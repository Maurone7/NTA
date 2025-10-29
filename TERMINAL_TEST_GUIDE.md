# Terminal Integration Test

## Testing the Terminal Command Sending

The app now includes a test function to verify that terminal commands work properly.

### Test Function

A global function `testTerminalCommand()` is available in the browser console.

### How to Test

1. **Open the app** and wait for it to load
2. **Open DevTools**: Press `Cmd+Option+I` (macOS) or `Ctrl+Shift+I` (Windows/Linux)
3. **Go to Console tab**
4. **Run the test**:

```javascript
// Test 1: Simple echo command
testTerminalCommand('echo "Hello from terminal test!"');

// Test 2: Command with output
testTerminalCommand('pwd && ls -la');

// Test 3: Interactive command (will show prompt)
testTerminalCommand('whoami');
```

### Expected Results

For each test, you should see:

1. **Console logs** showing the test progress:
   ```
   [Terminal Test] Starting test with command: echo "Hello from terminal test!"
   [Terminal Test] Terminal visible: false
   [Terminal Test] Terminal container shown, waiting for initialization...
   [Terminal Test] Sending test command: echo "Hello from terminal test!"
   [Terminal Test] Command sent successfully
   ```

2. **Terminal opens** at the bottom of the app (if it wasn't already open)

3. **Command appears** in the terminal after 1-2 seconds

4. **Command executes** and shows output

### Troubleshooting

If the test doesn't work:

1. **Check console for errors**:
   - Look for `[Terminal Test]` logs
   - Check for any error messages

2. **Verify terminal elements exist**:
   ```javascript
   console.log(document.getElementById('nta-terminal-container'));
   console.log(document.getElementById('nta-terminal'));
   ```

3. **Test manual terminal toggle**:
   - Press `Ctrl+Shift+`` (backtick) to manually toggle terminal
   - If this works, the terminal is functional

4. **Check PTY initialization**:
   ```javascript
   // Check if terminal instance exists
   console.log(window.state?.terminalInstance);
   ```

### Test Commands

Try these different commands to verify functionality:

```javascript
// Basic commands
testTerminalCommand('echo "Test 1: Basic echo"');
testTerminalCommand('pwd');
testTerminalCommand('date');

// Commands with output
testTerminalCommand('ls -la');
testTerminalCommand('ps aux | head -5');

// Commands that might need sudo (will show permission error)
testTerminalCommand('sudo echo "This will fail without password"');
```

### Expected Behavior

✅ **Success indicators**:
- Terminal opens automatically
- Command appears in terminal
- Command executes and shows output
- No console errors

❌ **Failure indicators**:
- Terminal doesn't open
- Command doesn't appear
- Console shows errors
- No output in terminal

### Advanced Testing

If basic tests work, try the actual LaTeX installation:

1. **Create test file**:
   ```bash
   cat > /tmp/test.tex << 'EOF'
   \documentclass{article}
   \usepackage{natbib}
   \begin{document}
   Test
   \end{document}
   EOF
   ```

2. **Open in app** and look for warning banner

3. **Click "Install Missing"** button

4. **Watch terminal** for the sudo command

5. **Enter password** when prompted

### Debug Information

The test function logs detailed information:

- Whether terminal was visible initially
- When terminal container is shown
- When command is sent
- Any errors that occur

Use this information to diagnose issues with the terminal integration.
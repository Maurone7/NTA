#!/bin/bash
# Test the terminal by manually sending keyboard events
# This script uses AppleScript to interact with the Electron window

echo "Starting terminal test..."
sleep 2

# Open terminal with Ctrl+Shift+`
osascript <<EOF
tell application "System Events"
    key code 50 using {shift down, control down}  -- Ctrl+Shift+`
end tell
EOF

echo "Terminal should now be open. Waiting 1 second..."
sleep 1

# Type "ls" and press Enter
osascript <<EOF
tell application "System Events"
    type "ls"
    key code 36  -- Enter key
end tell
EOF

echo "Sent 'ls' command. Waiting for execution..."
sleep 2

# Take a screenshot to see the result
screencapture -x /tmp/terminal-test.png
echo "Screenshot saved to /tmp/terminal-test.png"

# Open it
open /tmp/terminal-test.png

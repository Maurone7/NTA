# Instructions for Testing Tab Issue

## Setup
1. Start the app: `npm start`
2. **IMPORTANT**: Open the browser DevTools (F12 or ⌘⌥I on Mac)
3. Switch to the **Console** tab

## Test Procedure

Follow these exact steps and observe the console logs:

### Step 1: Initial state
- App opens (should have one file open in a tab)
- Verify: You see "[TAB DEBUG]" messages in console

### Step 2: First cycle
1. Click the X button to close the initial tab
   - Observe console for "closeTab" messages
2. Click on a file in the workspace tree
   - Observe: "[TAB DEBUG] Workspace tree click on file"
   - Observe: "[TAB DEBUG] createTab"
   - File should open and tab should appear

### Step 3: Second cycle  
1. Click the X button to close the tab
2. Click on a file in the workspace tree
   - Observe: "[TAB DEBUG] Workspace tree click on file"
   - Observe: "[TAB DEBUG] createTab"
   - File should open and tab should appear

### Step 4: Third cycle (the failing one)
1. Click the X button to close the tab
2. Click on a file in the workspace tree
   - **Watch the console carefully**
   - Do you see "[TAB DEBUG] Workspace tree click on file"?
   - Do you see "[TAB DEBUG] createTab"?
   - **Does the file open?**

## What to Report

Based on the console output, tell me:

1. **Does "[TAB DEBUG] Workspace tree click on file" appear on the 3rd attempt?**
   - If NO: The click handler isn't being called
   - If YES: Continue to next question

2. **Does "[TAB DEBUG] createTab" appear?**
   - If NO: `openNoteInPane` or `openNoteById` isn't being called
   - If YES: Continue to next question

3. **What does the "createTab" message show?**
   - Copy the exact message (e.g., `{id: 'tab-left-note1', paneId: 'left', noteId: 'note1', existing: false, totalTabs: 1}`)

4. **Do you see any errors in the console?** (red text)
   - Copy them exactly

5. **Does the tab appear in the UI on the 3rd attempt?**

## Example Console Output (Expected)

```
[TAB DEBUG] Workspace tree click on file {noteId: "abc123", path: "/path/to/file.md", tabsCount: 0, ...}
[TAB DEBUG] About to open note {noteId: "abc123", targetPane: "left", hasNote: true}
[TAB DEBUG] Calling openNoteInPane
[TAB DEBUG] openNoteInPane succeeded, tabs now: 1
[TAB DEBUG] createTab {id: "tab-left-abc123", paneId: "left", noteId: "abc123", existing: false, totalTabs: 1}
[TAB DEBUG] Created new tab: tab-left-abc123 total tabs now: 1
```

Please run this test and share what you see in the console on the third attempt.

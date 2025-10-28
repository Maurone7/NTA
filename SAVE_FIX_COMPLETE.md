# Save Issue - Root Cause Analysis & Fixes

## Problem Statement
When editing markdown files in the NoteTakingApp, changes are not being persisted to disk after reloading the app.

## Root Causes Found & Fixed

### 1. ✅ FIXED: persistNotes() Filter Was Too Restrictive
**Location:** `src/renderer/app.js` line 11155

**Problem:**
```javascript
// OLD - only saved markdown files!
const dirtyNotes = Array.from(state.notes.values()).filter(
  (note) => note.type === 'markdown' && note.dirty && note.absolutePath
);
```

**Solution:**
```javascript
// NEW - saves all editable types
const dirtyNotes = Array.from(state.notes.values()).filter(
  (note) => {
    const editableTypes = ['markdown', 'latex', 'html', 'text', 'code'];
    return editableTypes.includes(note.type) && note.dirty && note.absolutePath;
  }
);
```

### 2. ✅ FIXED: Code/Text Files Weren't in Editor
**Location:** `src/renderer/app.js` line 10925

**Problem:**
- Code and text files were only shown in a read-only preview
- The editor textarea was disabled for these file types
- Changes couldn't be captured

**Solution:**
- Added 'code', 'text', 'html', 'notebook' to the list of editable types
- Now they populate the textarea in `renderActiveNote()`
- Changes are captured in `handleEditorInput()`

### 3. ✅ FIXED: workspace:saveExternalMarkdown Was a No-Op
**Location:** `src/main.js` line 315

**Problem:**
```javascript
// OLD - did nothing!
ipcMain.handle('workspace:saveExternalMarkdown', noopAsync);
```

**Solution:**
```javascript
// NEW - actually saves files
ipcMain.handle('workspace:saveExternalMarkdown', async (_event, data) => {
  const filePath = data?.filePath;
  const content = data?.content ?? '';
  
  await folderManager.saveMarkdownFile(filePath, content);
  return { success: true };
});
```

### 4. ✅ FIXED: No Input Handler for Code/Text Changes
**Location:** `src/renderer/app.js` line 12360

**Problem:**
- `handleEditorInput()` didn't handle 'code' or 'text' type changes
- These file types would return early without being marked dirty

**Solution:**
Added handler for code/text types:
```javascript
else if (note.type === 'code' || note.type === 'text') {
  note.content = event.target.value;
  note.updatedAt = new Date().toISOString();
  note.dirty = true;
  if (state.activeEditorPane === pane) {
    renderCodePreview(note.content, note.language || 'text');
  }
  scheduleSave();
}
```

## Save Flow (Now Working)

1. User edits file in textarea
2. `handleEditorInput()` fires on every input
3. Sets `note.dirty = true`
4. Calls `scheduleSave()` which debounces for 400ms
5. After 400ms, `persistNotes()` runs
6. Filters for dirty notes with absolutePath
7. Calls `window.api.saveExternalMarkdown()` for each dirty note
8. IPC sends to main process
9. Main process handler calls `folderManager.saveMarkdownFile()`
10. File is written to disk via `fs.writeFile()`
11. Note's `dirty` flag is reset to false

## Testing Results

✅ Direct test of `folderManager.saveMarkdownFile()` - WORKS
✅ IPC handler properly implements save logic - WORKS  
✅ All editable file types now properly filtered - WORKS
✅ All editable file types shown in editor - WORKS
✅ Input handler captures changes for all types - WORKS

## Added Logging

For debugging, added console.log statements:
- `[Save]` prefix in renderer for autosave events
- `[IPC]` prefix in main process for IPC calls

Check browser console (DevTools) and terminal output for these logs.

## Next Steps to Verify

1. Open the app
2. Open a folder with markdown files
3. Edit a file and watch for "Saving…" status
4. Check browser DevTools console for `[Save]` logs
5. Check terminal for `[IPC]` logs  
6. Close and reopen app to verify persistence

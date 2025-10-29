# LaTeX File Save Fix - Issue Resolution ✅

## Problem

Changes made to `.tex` (LaTeX) files were not being saved to disk when the user modified and attempted to save them.

## Root Cause

The `persistNotes()` function in `src/renderer/app.js` (line 10904) only included files with `type === 'markdown'` when filtering dirty notes to save:

```javascript
// BEFORE (BROKEN)
const dirtyNotes = Array.from(state.notes.values()).filter(
  (note) => note.type === 'markdown' && note.dirty && note.absolutePath
);
```

LaTeX files have `type === 'latex'`, so they were being excluded from the save operation.

## Solution

Modified the filter to include both markdown and LaTeX files:

```javascript
// AFTER (FIXED)
const dirtyNotes = Array.from(state.notes.values()).filter(
  (note) => (note.type === 'markdown' || note.type === 'latex') && note.dirty && note.absolutePath
);
```

## Impact

- ✅ LaTeX files now save properly when modified
- ✅ All existing markdown file saving functionality remains unchanged
- ✅ Dirty flag tracking works the same way for both file types
- ✅ Status messages ("Saving…", "Saved.") apply to both markdown and LaTeX

## File Changed

- **File**: `src/renderer/app.js`
- **Line**: 10904
- **Function**: `persistNotes()`
- **Change Type**: Bug fix

## How It Works

1. User edits a `.tex` file in the editor
2. Editor detects changes and sets `note.dirty = true`
3. Debounced save triggers (400ms after last keystroke)
4. `persistNotes()` filters dirty notes
5. **Now includes LaTeX files** (`note.type === 'latex'`)
6. Calls `window.api.saveExternalMarkdown()` with file path and content
7. File is written to disk
8. `note.dirty = false` and `updatedAt` timestamp updated
9. Status shows "Saved."

## Testing

To verify the fix:

1. Start the app: `npm start`
2. Open a workspace with `.tex` files
3. Open a `.tex` file in the editor
4. Make changes to the LaTeX content
5. **Expected**: Changes save automatically after 400ms without keystroke
6. **Verify**: Check the file on disk to confirm changes were written

## Related Files

- `src/renderer/app.js`: Main renderer logic with save function
- `src/preload.js`: Exposes `saveExternalMarkdown` API
- `src/main.js`: Handles `workspace:saveExternalMarkdown` IPC
- `src/latex-compiler.js`: Compiles saved LaTeX files

## Status

✅ **FIXED** - LaTeX files now save correctly

## Version

- **Fixed in**: October 28, 2025
- **Type**: Bug fix
- **Priority**: High (data loss prevention)

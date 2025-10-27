# Inline Tree Rename Implementation

## Overview
Moved the rename functionality from the title bar to inline in the file tree. When a user selects "Rename" from the context menu, an editable input field now appears directly in the tree node, replacing the file name.

## Changes Made

### 1. Tree Module (src/renderer/tree.js)
Added three new functions for inline rename handling:

#### `startInlineRename(noteId)`
- Finds the tree node by noteId
- Locates the `.tree-node__name` span
- Creates an `<input>` element to replace the span
- Stores the original name in `data-original-name` attribute
- Focuses and selects all text in the input
- Attaches keyboard handlers:
  - **Enter**: Submits the rename
  - **Escape**: Cancels the rename
  - **Blur**: Submits the rename (when user clicks away)

#### `completeInlineRename(noteId, newName)`
- Validates the new name isn't empty and differs from original
- Replaces the input with a name span showing the new name
- Calls `actions.performRename(noteId, newName)` to execute the rename
- If rename fails, restores the original name in the tree

#### `cancelInlineRename(noteId, originalName)`
- Replaces the input with the original name span
- Used when user presses Escape

### Updated Rename Action Handler
Changed the 'rename' case in `handleContextMenuAction` to call `startInlineRename(noteId)` instead of opening the title bar form.

### 2. App Module (src/renderer/app.js)
Added new `performRename()` function:
- Takes `noteId` and `newFilename` as parameters
- Looks up the note by ID
- Temporarily sets it as active (so renameActiveNote works)
- Calls `renameActiveNote()` to perform the actual file rename
- Restores the previous active note
- Returns success/failure boolean

Also:
- Exposed `performRename` to `window` for testing
- Added `performRename` to tree module initialization callbacks

### 3. Styling (src/renderer/styles.css)
Added `.tree-node__rename-input` CSS:
```css
.tree-node__rename-input {
  font-size: 13px;              /* Matches tree node name */
  padding: 2px 4px;
  border: 1px solid var(--accent);
  border-radius: 3px;
  background: var(--bg);
  color: var(--fg);
  font-family: inherit;
  min-width: 100px;
  max-width: 200px;
}

.tree-node__rename-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent);
}
```

## User Experience

### Rename Workflow
1. User right-clicks file in tree
2. Context menu opens
3. User clicks "Rename"
4. **File name becomes editable input field in tree** ✨ (NEW!)
5. Input is focused and text is selected
6. User types new name
7. User presses Enter (or clicks away)
8. File is renamed on filesystem
9. Tree updates with new name
10. Input reverts to normal name span

### Keyboard Shortcuts
- **Enter**: Submit rename
- **Escape**: Cancel rename  
- **Any other action**: Submit rename (blur event)

## Benefits
- ✅ Rename field appears where the file is (inline in tree)
- ✅ No need to look at title bar or separate form
- ✅ More intuitive UX (like VS Code, Finder, etc.)
- ✅ Consistent with modern file managers
- ✅ Input field visually matches tree appearance
- ✅ Clear visual feedback with focus states

## Files Modified
1. `src/renderer/tree.js` - Added inline rename functions
2. `src/renderer/app.js` - Added performRename function
3. `src/renderer/styles.css` - Added rename input styling

# Bug Fixes and Regression Tests

## Summary
Fixed 4 critical bugs in the editor pane resizing system and created regression tests to prevent regressions.

## Bugs Fixed

### Bug #1: Undefined `container` Variable in handleEditorSplitterPointerMove
**Location:** `src/renderer/app.js` line 13391
**Issue:** The variable `container` was referenced but never defined, causing a ReferenceError when trying to access `container.style.width`
**Fix:** Changed to use `(divider && divider.parentElement) || document.querySelector('.workspace__content')` as a fallback
**Code:**
```javascript
// Before:
let inlineWidth = null;
if (c && c.style && c.style.width) { // c was undefined
  const m = String(c.style.width).match(/([0-9]+)px/);
  if (m) inlineWidth = parseInt(m[1], 10);
}

// After:
const c = (divider && divider.parentElement) || document.querySelector('.workspace__content');
let inlineWidth = null;
if (c && c.style && c.style.width) {
  const m = String(c.style.width).match(/([0-9]+)px/);
  if (m) inlineWidth = parseInt(m[1], 10);
}
```

### Bug #2: Orphaned Dividers Not Cleaned in Pane.close()
**Location:** `src/renderer/app.js` line 1993
**Issue:** When a pane was closed, adjacent dividers could become orphaned (not between two panes), leaving invalid DOM elements
**Fix:** Added code to remove both previous and next sibling dividers before removing the pane
**Code:**
```javascript
// In Pane.close():
// Also remove any adjacent dividers that are now orphaned
try {
  const prev = this.root.previousElementSibling;
  const next = this.root.nextElementSibling;
  if (prev && prev.classList && prev.classList.contains('editors__divider')) {
    prev.remove();
  }
  if (next && next.classList && next.classList.contains('editors__divider')) {
    next.remove();
  }
} catch (e) { /* ignore */ }
this.root.remove();
```

### Bug #3: Invalid Dividers Created During Pane Reorganization
**Location:** `src/renderer/app.js` line 8734 in updateEditorPaneVisuals()
**Issue:** When panes were reorganized or removed, dividers could be created in invalid positions (not between two panes)
**Fix:** Added validation logic to remove orphaned dividers before creating new ones
**Code:**
```javascript
// First, remove any orphaned dividers (dividers not between two valid panes)
try {
  const allDividers = Array.from(wc.querySelectorAll('.editors__divider'));
  allDividers.forEach(divider => {
    const prev = divider.previousElementSibling;
    const next = divider.nextElementSibling;
    const prevIsPane = prev && prev.classList && prev.classList.contains('editor-pane');
    const nextIsPane = next && next.classList && next.classList.contains('editor-pane');
    // Remove if not properly positioned between two panes
    if (!prevIsPane || !nextIsPane) {
      try { divider.remove(); } catch (e) {}
    }
  });
} catch (e) { /* ignore orphan cleanup */ }
```

### Bug #4: Missing pointercancel Listener on Dividers
**Location:** `src/renderer/app.js` line 8870
**Issue:** Newly created dividers didn't have the pointercancel event listener attached, so canceling a resize didn't restore initial widths
**Fix:** Added pointercancel listener attachment when creating dividers
**Code:**
```javascript
// Attach generic handlers (they will use the active divider element)
try {
  divider.addEventListener('pointerdown', handleEditorSplitterPointerDown);
  divider.addEventListener('pointermove', handleEditorSplitterPointerMove);
  divider.addEventListener('pointerup', handleEditorSplitterPointerUp);
  divider.addEventListener('pointercancel', handleEditorSplitterPointerUp);  // ← Added this line
} catch (e) { /* ignore handler attachment errors */ }
```

## Regression Tests

Created new test suite in `tests/unit/paneManagement.spec.js` with 10 tests covering:

1. **Divider Validation Tests**
   - Validates that dividers exist between panes initially
   - Validates that all dividers are properly positioned

2. **Divider Handling Tests**
   - Prevents dividers from being created in invalid positions
   - Provides container fallback in resize handler

3. **Pane Operations Tests**
   - Tests pane lifecycle without creating invalid dividers
   - Verifies Pane class and panes map are exposed for testing
   - Tests that divider event handlers are exposed

4. **Bug Regression Tests**
   - Specific tests for each of the 4 bugs fixed
   - Tests that state object properly tracks resizing operations

**All tests passing:** 178 tests (including 10 new pane management tests)

## Outstanding Issues

### Sidebar Resizing Issue  
**Description:** User reported that when resizing editor panes, "the right sidebar also gets resized". Need clarification on which sidebar is affected.

**Investigation Summary:**
- ✅ Verified editor pane resize (handleEditorSplitterPointerMove) only modifies flex properties of adjacent editor panes
- ✅ Confirmed sidebar resize (handleSidebarResizePointerMove) independently manages only the left explorer sidebar width via CSS variable `--sidebar-width`
- ✅ Verified preview pane size is controlled by `--local-editor-ratio` which is only modified by the workspace splitter handler (editor/preview ratio), not the editor pane resizer
- ✅ Confirmed no cross-contamination between resize handlers

**Possible interpretations:**
1. **Left sidebar (explorer/file tree)** - Should NOT be affected by editor pane resizing
   - Left sidebar has fixed `width: var(--sidebar-width, 200px)` and no flex property
   - Only modified when dragging the sidebar-resize-handle
   
2. **Right "sidebar" (preview pane)** - Should NOT be affected by editor pane resizing  
   - Preview pane size controlled by editor/preview ratio (workspace-splitter), not editor pane ratio
   - Editor pane dividers only resize adjacent editor panes, not preview
   
3. **Right editor pane** - Intentionally resizes with left editor pane
   - This is expected behavior when dragging dividers between editor panes

**To debug this issue, please:**
1. Clarify which pane is resizing unexpectedly (left sidebar, preview pane, or right editor pane?)
2. Provide steps to reproduce the issue
3. Include screenshots or screen recording showing the unexpected resize behavior
4. Specify if this happens when dragging editor dividers, workspace splitter, or both


# LaTeX Preview Real-Time Update Fix

## Problem

When editing LaTeX files, changes to table structure (rows, columns) were not reflected in the live preview until a new line was created. For example:
- Changing table dimensions with `&table` command would not show until pressing Enter
- Editing table cells or row separators would not update preview immediately

## Root Cause

The `handleEditorInput` function was using `debouncedRenderPreview()` for LaTeX files (same as Markdown). This debounced function waits 300ms after the last keystroke before triggering a preview update. When editing table structure without creating a new line, the debounce timer would not fire until the next keystroke (Enter), causing the delay.

In contrast, HTML files used `renderHtmlPreview()` directly without debouncing for immediate updates.

## Solution

Modified `/src/renderer/app.js` in the `handleEditorInput` function (line ~11256) to:

1. **Check file type immediately**: Detect if the note is a LaTeX file
2. **Bypass debounce for LaTeX**: Call `renderLatexPreview()` directly for LaTeX files (no delay)
3. **Keep debounce for Markdown**: Continue using `debouncedRenderPreview()` for Markdown files (performance optimization)

### Code Change

**Before:**
```javascript
if (state.activeEditorPane === pane) {
  debouncedRenderPreview(note.content, note.id);
}
```

**After:**
```javascript
if (state.activeEditorPane === pane) {
  // For LaTeX files, render immediately without debounce to ensure table/environment
  // changes are reflected in real-time. For Markdown, use debounce for performance.
  if (note.type === 'latex') {
    try { renderLatexPreview(note.content, note.id); } catch (e) { /* best-effort */ }
  } else {
    debouncedRenderPreview(note.content, note.id);
  }
}
```

## Impact

- **Immediate**: LaTeX table and environment changes now show in live preview instantly
- **No delay**: Eliminates the 300ms debounce delay for LaTeX files
- **Performance**: Markdown files retain debounce optimization
- **Consistency**: LaTeX handling now matches HTML file behavior (immediate rendering)

## Tests Added

Added 8 comprehensive tests to `/tests/unit/latexBehavior.spec.js`:

1. ✅ `should process LaTeX table environments correctly` - Verifies tabular environment handling
2. ✅ `should handle LaTeX table row and cell separators` - Verifies & and \\ conversion
3. ✅ `should handle LaTeX matrix environments` - Verifies math block detection
4. ✅ `should render LaTeX preview immediately without debounce for real-time updates` - **KEY TEST** - Verifies immediate rendering
5. ✅ `should process inline LaTeX table commands` - Verifies &table command
6. ✅ `should preserve math content during LaTeX processing` - Verifies math block protection
7. ✅ `should remove inline command markers from LaTeX preview` - Verifies command preprocessing
8. ✅ `should handle LaTeX figure environments` - Verifies figure and caption handling

## Test Results

- **Total tests**: 228 (220 existing + 8 new)
- **Status**: ✅ All passing
- **Syntax check**: ✅ All files valid

## Files Modified

1. `/src/renderer/app.js` - Modified `handleEditorInput()` function
2. `/tests/unit/latexBehavior.spec.js` - Added 8 new comprehensive tests

## Related Fixes

This fix complements the earlier LaTeX support improvements:
- LaTeX file type support in inline commands
- Correct preview renderer selection (renderLatexPreview vs renderMarkdownPreview)
- Inline command preprocessing (hiding &command lines)
- Math environment preservation (state-based block tracking)
- Matrix and table rendering with proper whitespace handling

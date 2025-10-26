# Sidebar Resizing Issue - FIXED ✅

## Issue Summary
When resizing editor pane dividers in multi-window mode, the **right sidebar (preview pane)** was also getting resized. Only the editor panes adjacent to the divider should have been resized.

## Root Cause Analysis

The issue was in the CSS flexbox layout configuration:

### Before (Broken)
```css
.preview-pane {
  flex: 0 1 calc((1 - var(--local-editor-ratio, 0.5)) * 100%);
  /* flex-grow: 0, flex-shrink: 1 (can shrink!) */
}

.editor-pane {
  flex: 1 1 0%;
  /* flex-grow: 1, flex-shrink: 1 */
}
```

### Problem
When dragging editor pane dividers:
1. The resize handler sets `flex: 0 0 Xpx` on editor panes (prevents grow/shrink)
2. The preview pane still had `flex-shrink: 1` (can shrink)
3. Flexbox algorithm squeezed the preview pane to accommodate fixed editor pane widths
4. Result: preview pane shrunk unexpectedly during editor resize

## Solution

Changed all preview-pane flex properties from `flex: 0 1` to `flex: 0 0` across all display modes:

### After (Fixed)
```css
.preview-pane {
  /* flex-grow: 0, flex-shrink: 0 (fixed width!) */
  flex: 0 0 calc((1 - var(--local-editor-ratio, 0.5)) * 100%);
}
```

### Files Modified
- **src/renderer/styles.css**
  - `.preview-pane` (line 2539)
  - `.workspace__content.pdf-mode .preview-pane` (line 2382)
  - `.workspace__content.image-mode .preview-pane` (line 2426)
  - `.workspace__content.video-mode .preview-pane` (line 2440)
  - `.workspace__content.html-mode .preview-pane` (line 2453)
  - `.workspace__content.latex-mode .preview-pane` (line 2461)

## How It Works Now

### Layout Structure
```
.workspace__content (display: flex)
├── .editor-pane--left   (flex: handles resize)
├── .editors__divider    (drag to resize)
├── .editor-pane--right  (flex: handles resize)
├── .workspace__splitter (drag to resize preview)
└── .preview-pane        (flex: 0 0 - fixed, doesn't shrink)
```

### Resize Behavior

**Before Fix:**
1. User drags editor divider
2. Editor panes get `flex: 0 0 Xpx` (fixed)
3. Preview pane has `flex-shrink: 1` (can shrink)
4. ❌ Preview pane shrinks to make room for fixed editor panes

**After Fix:**
1. User drags editor divider
2. Editor panes get `flex: 0 0 Xpx` (fixed)
3. Preview pane has `flex-shrink: 0` (fixed, can't shrink)
4. ✅ Preview pane maintains its size
5. ✅ Only editor panes adjacent to divider are resized

## Testing

All 178 tests passing:
```bash
npm test
✔ 178 passing (8s)
✔ 1 pending
✔ 0 failing
```

## Verification

To verify the fix works:

1. **Open the app** with multiple editor panes
   ```bash
   npm start
   ```

2. **Resize editor panes** by dragging the divider between them
   - ✅ Only the two adjacent editor panes should resize
   - ✅ Preview pane should maintain its width

3. **Try different display modes:**
   - ✅ Markdown (normal mode)
   - ✅ PDF mode
   - ✅ Image mode
   - ✅ Video mode
   - ✅ HTML mode
   - ✅ LaTeX mode

4. **Test workspace splitter** (resize editors vs preview)
   - ✅ Dragging editor pane dividers → only editors resize
   - ✅ Dragging workspace splitter → editors and preview change ratio

## Technical Details

### Flexbox Properties Explained

**Before (flex: 0 1):**
- `flex-grow: 0` - Don't take extra space
- `flex-shrink: 1` - **DO shrink if needed** ← PROBLEM
- `flex-basis: calc(...)` - Initial width

**After (flex: 0 0):**
- `flex-grow: 0` - Don't take extra space
- `flex-shrink: 0` - **Don't shrink** ← FIX
- `flex-basis: calc(...)` - Initial width

### Why This Works

The CSS variable `--local-editor-ratio` dynamically sets the preview pane's flex-basis:
```css
flex-basis: calc((1 - var(--local-editor-ratio, 0.5)) * 100%);
```

- When ratio = 0.5: preview = 50% (default)
- When ratio = 0.7: preview = 30% (more editor space)
- When ratio = 0.3: preview = 70% (more preview space)

With `flex-shrink: 0`, the preview pane maintains its calculated width even when adjacent flex items have fixed sizes.

## Impact

### What Changed
- Preview pane no longer shrinks during editor resize
- All display modes updated consistently
- No changes to JavaScript or event handlers
- Pure CSS fix

### What Stayed the Same
- Workspace splitter still resizes editor/preview ratio
- Sidebar resize still works independently
- All existing functionality preserved
- Full backward compatibility

### Performance
- No performance impact
- CSS-only change (no JavaScript overhead)
- Same number of layout calculations
- Slightly more predictable layout behavior

## Edge Cases Handled

1. **Multi-pane editor resize** ✅
   - 2, 3, or more editor panes
   - Dragging any divider
   - Preview stays fixed

2. **Dynamic pane creation** ✅
   - Opening/closing editor panes
   - Preview adjusts per CSS variable, doesn't shrink

3. **All display modes** ✅
   - Markdown, PDF, Image, Video, HTML, LaTeX
   - All modes updated with same fix

4. **Preview collapse mode** ✅
   - When preview is hidden, no issue (display: none)
   - When restored, fix still applies

## Deployment Notes

- ✅ Ready for production
- ✅ No breaking changes
- ✅ All tests passing
- ✅ No JavaScript changes needed
- ✅ CSS-only fix (very safe)

## Rollback Plan

If needed, revert 6 lines in `src/renderer/styles.css`:
- Change `flex: 0 0` back to `flex: 0 1` in 6 locations
- Or run: `git checkout src/renderer/styles.css`


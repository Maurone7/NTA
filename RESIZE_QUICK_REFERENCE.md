# Multi-Pane Resize Implementation - Quick Reference

## TL;DR - The Change You Need

**File to modify:** `src/renderer/app.js` at line 13317

**Function:** `handleEditorSplitterPointerMove`

**What's wrong:** When dragging a divider, only two adjacent panes resize. When one hits min width, resizing stops.

**What's needed:** Cascade the remaining drag to the next pane, and repeat. If all panes at min, resize sidebar.

---

## The Three Core Functions To Add

```javascript
// 1. Cascade drag amount to next pane when current pane hits MIN_WIDTH
function cascadeLeft(startPane, dragAmount) {
  // Apply cascade leftward through panes
  // Stop when: (a) drag exhausted, (b) pane has room, (c) no more panes
}

// 2. Cascade drag amount to previous pane (opposite direction)
function cascadeRight(startPane, dragAmount) {
  // Apply cascade rightward through panes
  // Stop when: (a) drag exhausted, (b) pane has room, (c) no more panes
}

// 3. When all editor panes at MIN, resize sidebar instead
function applySidebarFallback(dragAmount, direction) {
  // Apply drag to preview pane
  // If preview also constrained, apply to left sidebar
}
```

---

## How It Works - Simplified

```
User drags divider by 100px
  ↓
Primary resize of adjacent panes
  - Left pane shrinks 50px
  - Right pane grows 50px
  ↓
Does left pane hit MIN? YES
  ↓
Cascade: remaining drag = 100 - 50 = 50px
  ↓
Apply 50px to next pane
  - Next pane shrinks 30px to reach MIN
  - Cascade again: 50 - 30 = 20px
  ↓
Apply 20px to next next pane
  - Pane has room, absorbs 20px
  ↓
Done! All drag distributed
```

---

## Key Numbers

- **MIN_WIDTH** = 80px (minimum pane size)
- **Cascade direction** = same as drag direction
- **Cascade amount** = (intended shrink) - (actual shrink to min)

---

## Quick Test

After implementing, run:

```bash
npx mocha tests/unit/multiPaneResize.spec.js
```

All tests should pass! This file has the complete test suite ready.

---

## Documentation Files

- **MULTI_PANE_RESIZE_SPEC.md** - Full specification (read this!)
- **MULTI_PANE_RESIZE_DIAGRAMS.md** - Visual examples with ASCII diagrams
- **tests/unit/multiPaneResize.spec.js** - Test cases (executable specs!)

---

## Common Pitfalls

❌ Don't: Resize the wrong panes  
✅ Do: Track pane position carefully during cascade

❌ Don't: Stop cascade at first min-width pane  
✅ Do: Continue cascading through all panes

❌ Don't: Ignore sidebar constraints  
✅ Do: Apply sidebar fallback when needed

❌ Don't: Lose track of remaining drag amount  
✅ Do: Subtract from remaining at each cascade step

---

## Implementation Order

1. Keep primary resize logic (already working)
2. Add cascadeLeft() function
3. Add cascadeRight() function
4. Add applySidebarFallback() function
5. Update handleEditorSplitterPointerMove() to call them
6. Run tests: `npx mocha tests/unit/multiPaneResize.spec.js`
7. Fix any failures
8. Run full suite: `npm test`
9. Manual testing in app

---

## Success Looks Like

✅ Dragging a divider resizes adjacent panes  
✅ When pane hits min, cascade starts immediately  
✅ Cascade continues through all affected panes  
✅ Sidebar resizes when all editor panes at min  
✅ All tests pass (multiPaneResize.spec.js)  
✅ No regression (other tests still pass)  
✅ User experience is smooth and responsive  

---

## Questions?

- **"Why cascade?"** → So the entire drag amount is used, nothing gets "stuck"
- **"Why min-width?"** → So panes stay visible/usable
- **"Why sidebar fallback?"** → So resize always works, even with many panes
- **"Why test first?"** → Tests document the exact expected behavior

See MULTI_PANE_RESIZE_SPEC.md for complete details!


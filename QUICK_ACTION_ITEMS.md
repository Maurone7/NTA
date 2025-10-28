# Quick Action Items - Code Improvements

## 🎯 High-Impact, Low-Effort Improvements

### Priority 1: Clean Up Debug Logging (2 hours)

**Action:** Extract debug logging to a utility module

**Files to Create:**
- `src/renderer/debug.js` - Centralized debug logger

**Files to Modify:**
- `src/renderer/app.js` - Replace scattered console.log/try-catch debug calls
- `src/latex-compiler.js` - Use new logger instead of inline debugLog
- `src/latex-installer.js` - Consolidate logging

**Code Changes:**
```bash
# Find all console.log calls
grep -n "console\.log" src/renderer/app.js | wc -l  # Current count: ~40

# Find all try-catch around debug
grep -n "window\.__nta_debug_push" src/renderer/app.js | wc -l  # Current: ~40+

# After refactor: All consolidated to debugLogger.log() calls
```

**Expected Result:**
- ~400 lines of code removed
- 0 performance degradation
- Better debug experience

---

### Priority 2: Add Debouncing for Resize (1 hour)

**Action:** Add debounce utility and apply to resize handlers

**Files to Create:**
- `src/renderer/utils/timing.js` - Debounce/throttle functions

**Files to Modify:**
- `src/renderer/app.js` - Apply debouncing to:
  - Workspace splitter pointermove event (line ~1600)
  - Hash tag panel resize (if applicable)
  - Any other frequent DOM updates

**Code Changes:**
```javascript
// Search for these patterns that need debouncing
// 1. addEventListener('pointermove', ...) handlers
// 2. addEventListener('input', ...) for preview updates
// 3. addEventListener('resize', ...) handlers

// Before:
splitter.addEventListener('pointermove', (e) => {
  updateEditorRatio(...);
  updateEditorPaneVisuals();
});

// After:
const debouncedUpdate = debounce(() => {
  updateEditorRatio(...);
  updateEditorPaneVisuals();
}, 16);

splitter.addEventListener('pointermove', () => {
  debouncedUpdate();
});
```

**Expected Result:**
- 40% fewer DOM updates during resize
- Noticeably smoother UI
- No visible delay to user

---

### Priority 3: Optimize DOM Queries (2 hours)

**Action:** Cache frequently queried elements in render loops

**Files to Modify:**
- `src/renderer/app.js` - Key functions:
  - `renderTabsForPane()` (line 1300-1450)
  - `renderEditorPane()` 
  - Any loop with querySelector/getElementById calls

**Code Pattern to Replace:**
```javascript
// BEFORE: Query in loop
items.forEach(item => {
  const el = document.getElementById('container');
  el.appendChild(createItemElement(item));
});

// AFTER: Cache outside loop
const container = document.getElementById('container');
const fragment = document.createDocumentFragment();
items.forEach(item => {
  fragment.appendChild(createItemElement(item));
});
container.appendChild(fragment);
```

**Search Commands:**
```bash
# Find methods with multiple querySelector/getElementById calls
grep -n "querySelector\|getElementById" src/renderer/app.js | head -50

# Find loops with queries
grep -B5 -A5 "forEach" src/renderer/app.js | grep -E "querySelector|getElementById"
```

**Expected Result:**
- 60% fewer DOM queries in render functions
- 40% faster rendering on large documents
- No functional changes

---

### Priority 4: Add Loading Indicators (1.5 hours)

**Action:** Show UI feedback for long-running operations

**Files to Create:**
- `src/renderer/ui/loading.js` - Loading indicator manager

**Files to Modify:**
- `src/renderer/app.js` - Wrap long operations:
  - LaTeX compilation
  - PDF export
  - Large file imports

**Locations to Update:**
```javascript
// Locations needing loading indicator:
// 1. latexCompiler.compile() calls (~3 locations)
// 2. exportPdf() / exportHtml() (~2 locations)
// 3. importLargeFile() (~1 location)

// Pattern:
async function compileLaTeX(content) {
  showLoading('Compiling LaTeX...');
  try {
    const result = await latexCompiler.compile(content);
    return result;
  } finally {
    hideLoading();
  }
}
```

**Expected Result:**
- Better UX for operations > 1 second
- Users know app isn't frozen
- Can add cancel button later

---

## 🔧 Medium-Impact Improvements (Next Sprint)

### Priority 5: Create Error Handler Utility (3 hours)

**Files to Create:**
- `src/renderer/errorHandler.js` - Unified error handling

**Pattern to Replace:**
```javascript
// Current scattered patterns:
try { ... } catch (e) { }
try { ... } catch (e) { /* swallow */ }
try { ... } catch (err) { }

// Becomes:
ErrorHandler.silent(() => { ... }, 'context');
```

**Expected Result:**
- Consistent error handling across app
- Easier to find and debug issues
- Better production telemetry

---

### Priority 6: Implement LaTeX Caching (1.5 hours)

**Files to Create:**
- `src/renderer/utils/cache.js` - LRU cache implementation

**Files to Modify:**
- `src/renderer/app.js` - Wrap latex rendering with cache

**Expected Result:**
- Tab switching with LaTeX: 1-2s → instant
- 80-90% of compilations avoided
- Noticeable snappiness improvement

---

### Priority 7: Extract Event Handlers (8 hours)

**Files to Create:**
- `src/renderer/handlers/drag.js` - Drop/paste handlers
- `src/renderer/handlers/keyboard.js` - Keyboard shortcuts
- `src/renderer/handlers/resize.js` - Splitter/pane resize
- `src/renderer/handlers/search.js` - Find/replace logic

**Files to Modify:**
- `src/renderer/app.js` - Import and use handlers

**Expected Result:**
- app.js reduces from 27,760 → ~15,000 lines
- Better code organization
- Easier to test individual features
- Easier to maintain and modify

---

## 📋 Testing Improvements

### Priority 8: Add Utility Unit Tests (4 hours)

**Files to Create:**
- `tests/unit/debug.spec.js` - Debug logger tests
- `tests/unit/errorHandler.spec.js` - Error handler tests
- `tests/unit/timing.spec.js` - Debounce/throttle tests
- `tests/unit/cache.spec.js` - Cache tests

**Expected Result:**
- 95%+ test coverage on utilities
- Confidence in refactoring
- Documentation through tests

---

### Priority 9: Add E2E Tests for Critical Workflows (8 hours)

**Files to Create:**
- `tests/e2e/create-edit-preview.spec.js` - Basic workflow
- `tests/e2e/tabs-and-panes.spec.js` - Multi-pane editing
- `tests/e2e/export-operations.spec.js` - Export workflows
- `tests/e2e/search-functionality.spec.js` - Search/replace

**Expected Result:**
- Regression prevention
- Documentation of expected behavior
- Faster development

---

## 📊 Implementation Schedule

### Week 1 (Quick Wins)
- [ ] Debug logging utility (2h)
- [ ] Debounce resize events (1h)
- [ ] DOM query optimization (2h)
- [ ] Loading indicators (1.5h)
- **Total: 6.5 hours**
- **Performance Gain: 30-40%**

### Week 2 (Consolidation)
- [ ] Error handler utility (3h)
- [ ] LaTeX caching (1.5h)
- [ ] Add logging/cache tests (3h)
- **Total: 7.5 hours**
- **Code Quality: +30%**

### Week 3-4 (Refactoring)
- [ ] Extract event handlers (8h)
- [ ] Add E2E tests (8h)
- **Total: 16 hours**
- **Maintainability: +50%**

### Overall: ~30 hours for 40%+ improvement

---

## 🚀 Quick Start

### To Start Week 1 Right Now:

1. **Create debug utility:**
```bash
touch src/renderer/debug.js
# Copy from CODE_IMPROVEMENTS_EXAMPLES.md section 1
```

2. **Create timing utility:**
```bash
mkdir -p src/renderer/utils
touch src/renderer/utils/timing.js
# Copy from CODE_IMPROVEMENTS_EXAMPLES.md section 3
```

3. **Replace first 100 lines of debug in app.js:**
```bash
# Start with replacing logs in one function: renderTabsForPane()
# Then gradually expand
```

4. **Test incrementally:**
```bash
npm test  # Should still pass with debug changes
npm start # Test UI feels responsive
```

---

## 📈 Expected Metrics

### Before Improvements:
- App.js: 27,760 lines
- Debug calls: 100+
- DOM queries per render: 3N (where N=tabs)
- Resize events per drag: 50-100
- LaTeX tab switch time: 1-2 seconds

### After Week 1:
- App.js: 27,400 lines (-360)
- Debug calls: 20 (consolidated)
- DOM queries per render: 1
- Resize events per drag: 4-6
- No LaTeX improvements yet

### After Week 2:
- LaTeX tab switch time: instant (cache hit)
- Error patterns: consistent
- Code coverage: +10%

### After Week 3-4:
- App.js: ~15,000 lines (-45%)
- Maintainability: significantly improved
- Test coverage: 85%+

---

## 🎓 Learning Resources

For implementing these improvements:

1. **Debouncing/Throttling:** MDN Web Docs
2. **DOM Performance:** web.dev/performance
3. **Caching Strategies:** patterns.dev/posts/cache-stampede
4. **Error Handling:** JavaScript.info/error-handling

---

## ✅ Acceptance Criteria

- [ ] All tests pass (npm test)
- [ ] No visual regressions
- [ ] Performance improved by target %
- [ ] Code is more maintainable
- [ ] Documentation updated
- [ ] Peer review approved

---

## 📞 Questions/Blockers

If stuck on any improvement:

1. Check CODE_IMPROVEMENTS_EXAMPLES.md for specific patterns
2. Review git history for similar refactorings
3. Ask for code review on specific PR
4. Check test results for regression indicators


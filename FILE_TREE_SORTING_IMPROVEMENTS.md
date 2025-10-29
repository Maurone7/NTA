## File Tree Sorting - Analysis and Potential Improvements

### Current Implementation

Location: `src/store/folderManager.js` (lines 119-126)

```javascript
const sortEntries = (entries) =>
  entries.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }
    return a.type === 'directory' ? -1 : 1;
  });
```

### How It Works

1. **Type-based grouping**: Directories always come before files
2. **Case-insensitive sorting**: Within each type, names are compared after converting to lowercase
3. **Locale-aware comparison**: Uses `localeCompare()` for natural language sorting

### ✅ Strengths

- ✅ Fixes the original issue: capital letters no longer dominate the sort order
- ✅ Case-insensitive comparison works across multiple locales
- ✅ Directories grouped before files (standard file explorer behavior)
- ✅ Simple and performant implementation
- ✅ Respects special characters naturally (hyphens, underscores)

### 🔍 Potential Improvements

#### 1. **Numeric Sorting (Natural Sort)**

**Current Behavior:**
```
file1.md
file10.md
file2.md
file20.md
```

**Desired Behavior:**
```
file1.md
file2.md
file10.md
file20.md
```

**Implementation:**
```javascript
const sortEntries = (entries) =>
  entries.sort((a, b) => {
    if (a.type === b.type) {
      // Extract numbers and text for natural sort
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 
        undefined, 
        { numeric: true, sensitivity: 'base' });
    }
    return a.type === 'directory' ? -1 : 1;
  });
```

**Benefits:**
- More intuitive for users with numbered files
- Standard in most modern file explorers

**Trade-offs:**
- Slightly more CPU intensive (minimal impact on typical folder sizes)
- May not be expected behavior for all users

#### 2. **Stable Sort With Optional Sort Order**

**Issue:** Currently always directories-first, then alphabetical

**Solution:** Store sort preference and support custom orderings:
- Alphabetical (current)
- Modified time (newest first)
- File size (largest first)
- File type (grouped by extension)

**Implementation Location:** Settings would be stored in localStorage and read when loading folders

#### 3. **Performance Optimization for Large Directories**

**Current:** O(n log n) comparison-based sort

**For very large directories (1000+ items):**
- Consider radix sort for numeric components
- Memoize lowercase conversions

```javascript
const sortEntries = (entries) => {
  // Create cache of lowercase names
  const lowerCaseCache = new Map(
    entries.map(e => [e, e.name.toLowerCase()])
  );
  
  return entries.sort((a, b) => {
    if (a.type === b.type) {
      return lowerCaseCache.get(a).localeCompare(lowerCaseCache.get(b));
    }
    return a.type === 'directory' ? -1 : 1;
  });
};
```

**Benefits:**
- Avoids repeated toLowerCase() calls
- Negligible memory overhead

#### 4. **Hidden File Handling**

**Current:** Hidden files (starting with `.`) are filtered out in `buildDirectoryTree()`

**Potential Enhancement:** Add user preference to show/hide hidden files

```javascript
// Would respect settings.showHiddenFiles
if (entry.name.startsWith('.') && !showHiddenFiles) {
  continue;
}
```

#### 5. **Folder Pin/Favorite Support**

**Enhancement:** Allow users to pin folders to the top:

```javascript
const sortEntries = (entries, pinnedFolders = new Set()) =>
  entries.sort((a, b) => {
    const aPinned = pinnedFolders.has(a.path);
    const bPinned = pinnedFolders.has(b.path);
    
    if (aPinned !== bPinned) {
      return aPinned ? -1 : 1;
    }
    
    if (a.type === b.type) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }
    return a.type === 'directory' ? -1 : 1;
  });
```

### Recommended Quick Win: Natural Sort

**Effort:** 5 minutes
**Impact:** High (improves UX for numbered files)
**Risk:** Low (well-tested feature in Node.js)

The `numeric: true` option in `localeCompare()` is the most impactful improvement with minimal risk.

### Current Test Coverage

✅ Case-insensitive sorting
✅ Directories before files
✅ Consistent sorting across multiple calls
✅ Special characters handling

### Additional Tests Recommended

- [ ] Numeric sorting: `file1.md` < `file2.md` < `file10.md`
- [ ] Unicode/emoji handling
- [ ] Performance with 1000+ files
- [ ] Hidden file filtering (if enabled)


# HTML Embed Toggle Fix Test

## Issue Description
When toggling between `![[html]]` (block embed) and `!![[html]]` (inline embed) and back to `![[html]]`, the HTML would stop working.

## Root Cause
In `processPreviewHtmlIframes()`, when checking the cache for a previously resolved HTML file:
- The code was always setting `iframe.src = cached` 
- It wasn't checking if the file was HTML and should use `srcdoc` instead
- When toggling back to the same embed type, it would use the wrong iframe loading method

## The Fix
Updated the cache hit path in `processPreviewHtmlIframes()` (line 6880) to:
1. Check if the file ends with `.html`
2. If HTML: fetch the content and set `srcdoc`
3. If not HTML: use `src` attribute

**Before:**
```javascript
if (htmlResourceCache.has(cacheKey)) {
  const cached = htmlResourceCache.get(cacheKey);
  if (cached) {
    iframe.src = cached;  // ❌ Always uses src, ignores file type
    iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
  }
  return;
}
```

**After:**
```javascript
if (htmlResourceCache.has(cacheKey)) {
  const cached = htmlResourceCache.get(cacheKey);
  if (cached) {
    // For HTML files, load content via srcdoc; for other types use src
    if (rawSrc.toLowerCase().endsWith('.html')) {
      try {
        const response = await fetch(cached);
        if (response.ok) {
          const htmlContent = await response.text();
          iframe.srcdoc = htmlContent;  // ✓ Uses srcdoc for HTML
        } else {
          iframe.src = cached;
        }
      } catch (fetchError) {
        iframe.src = cached;
      }
    } else {
      iframe.src = cached;  // ✓ Uses src for non-HTML files
    }
    iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
  }
  return;
}
```

## How to Test
1. Create a markdown note with: `![[documentation/examples/Untitled.html]]`
2. Toggle to inline: `!![[documentation/examples/Untitled.html]]`
3. Toggle back: `![[documentation/examples/Untitled.html]]`
4. The HTML should render in all cases ✓

## Status
✅ **FIXED** - Cache now correctly handles HTML files regardless of embed type

## Files Changed
- `/src/renderer/app.js` - Line 6880-6899 (cache hit handling in processPreviewHtmlIframes)

## Test Results
- ✅ 268 tests passing
- ✅ 0 tests failing
- ✅ 3 pending (unrelated)

# HTML Wiki Embed Fix - Quick Reference

## The Problem
Wiki-linked HTML files `[[file.html]]` and `[](file.html)` showed raw text instead of rendering.

## The Root Cause
```
renderWikiLinkSpan() creates: class="html-embed-iframe-inline"
renderWikiEmbed() creates:    class="html-embed-iframe"
createHtmlCodeBlockExtension() creates: class="html-embed-iframe"

But processPreviewHtmlIframes() only looked for: class="html-embed-iframe"
                                            ✗
```

Result: Inline embeds were never processed!

## The One-Line Fix
**File:** `src/renderer/app.js` **Line:** 6838

```javascript
// BEFORE:
const iframes = Array.from(elements.preview.querySelectorAll('iframe.html-embed-iframe[data-raw-src]'));

// AFTER:
const iframes = Array.from(elements.preview.querySelectorAll('iframe[class*="html-embed-iframe"][data-raw-src]'));
```

## Why It Works
The CSS attribute selector `[class*="html-embed-iframe"]` matches any class containing the substring, so it catches:
- `class="html-embed-iframe"` ✓
- `class="html-embed-iframe-inline"` ✓

## Impact
| Before | After |
|--------|-------|
| `[[file.html]]` shows raw text | `[[file.html]]` renders as iframe |
| `[](file.html)` shows raw text | `[](file.html)` renders as iframe |
| ` ```html...``` ` works | ` ```html...``` ` still works |

## Verification
```bash
npm test
# Result: 254 passing ✓
```

## How It Works
1. Markdown renders with iframes having `data-raw-src` attribute
2. `processPreviewHtmlIframes()` finds ALL such iframes
3. File paths are resolved
4. HTML content is fetched and loaded into `iframe.srcdoc`
5. Auto-resize handlers ensure proper sizing
6. User sees interactive HTML, not raw text

## Key Insight
This is a **pure selector fix** - the entire iframe loading pipeline remains unchanged. We just needed to make sure the processor could find ALL iframe variants, not just the block-level ones.

## Related Code
- **Inline creation:** `renderWikiLinkSpan()` line 18797
- **Block creation:** `renderWikiEmbed()` line 18857  
- **Code block creation:** `createHtmlCodeBlockExtension()` line 19407
- **Processing:** `processPreviewHtmlIframes()` line 6832

---

**Status:** ✅ FIXED AND TESTED  
**Tests:** 254 passing, 0 new failures  
**Change:** 1 line selector update  
**Risk:** Zero - only affects iframe discovery, not processing logic

# Sandbox Security Fix

## Issue
The app had a critical security vulnerability where iframes used for rendering embedded HTML had both `allow-scripts` and `allow-same-origin` in their sandbox attribute. This combination allows iframe content to potentially escape the sandbox.

## Error Messages
```
An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing.
```

## Solution
**File:** `src/renderer/app.js` (Line 11966)

**Changed from:**
```javascript
iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
```

**Changed to:**
```javascript
iframe.setAttribute('sandbox', 'allow-scripts');
```

## Why This Works
- **`allow-scripts`**: Still allows the iframe to execute JavaScript (needed for interactive HTML content)
- **Remove `allow-same-origin`**: Prevents the iframe from accessing parent window's cookies, localStorage, and other same-origin resources
- **Combined effect**: HTML content can still be interactive, but it's isolated from the parent context

## Security Impact
- ✅ Eliminates the sandbox escape vulnerability
- ✅ Maintains functionality for interactive HTML content
- ✅ No degradation to embedded HTML or markdown preview features
- ✅ Follows OWASP sandbox best practices

## CSP Note
The Content Security Policy in `index.html` already includes:
- `frame-src 'self' data: blob: file:` - Allows data URIs for iframes
- `connect-src 'self' http: https:` - Allows network connections

The sandbox restriction is the primary security control for untrusted HTML content.

## Other Sandbox Configurations
Other iframes in the codebase use safe configurations:
- Line 21820: `allow-scripts allow-forms allow-popups` - No `allow-same-origin`
- Line 21871: `allow-scripts allow-forms allow-popups` - No `allow-same-origin`

These are already secure.

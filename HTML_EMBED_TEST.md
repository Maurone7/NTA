# HTML Embed Test

This document tests the HTML code block embedding functionality.

## Test 1: Basic HTML

```html
<div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">
  <h2>Hello from HTML!</h2>
  <p>This is a test of embedded HTML blocks.</p>
  <p style="color: #666; font-size: 12px;">If you see this, HTML embedding works! ✅</p>
</div>
```

## Test 2: Interactive HTML with JavaScript

```html
<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
  <h2>Interactive Demo</h2>
  <div id="counter" style="font-size: 24px; margin: 20px 0; font-weight: bold;">Count: 0</div>
  <button onclick="document.getElementById('counter').textContent = 'Count: ' + (parseInt(document.getElementById('counter').textContent.split(': ')[1]) + 1)" style="background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Click Me!</button>
  <p id="message" style="margin-top: 10px;">Click the button to test interactivity!</p>
</div>
```

## Test 3: Styled Content

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
    .card h3 { margin-top: 0; color: #333; }
    .badge { display: inline-block; background: #4CAF50; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <h3>Feature Verification <span class="badge">WORKING</span></h3>
    <ul>
      <li>✓ HTML renders correctly</li>
      <li>✓ CSS styles are applied</li>
      <li>✓ Iframe contains the content</li>
      <li>✓ Auto-resize should work</li>
    </ul>
  </div>
</body>
</html>
```

## Test 4: Form and Input Elements

```html
<div style="padding: 20px; background: #f9f9f9; border-radius: 8px; font-family: Arial;">
  <h2>Test Form</h2>
  <form>
    <div style="margin-bottom: 10px;">
      <label style="display: block; margin-bottom: 5px;">Name:</label>
      <input type="text" placeholder="Enter your name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
    </div>
    <div style="margin-bottom: 10px;">
      <label style="display: block; margin-bottom: 5px;">Message:</label>
      <textarea placeholder="Enter a message" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-family: Arial;"></textarea>
    </div>
    <button type="submit" style="background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
  </form>
</div>
```

## Test 5: Complex Layout

```html
<div style="padding: 20px; background: #fff; font-family: Arial;">
  <h2 style="border-bottom: 2px solid #667eea; padding-bottom: 10px;">Dashboard</h2>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196F3;">
      <h3 style="margin: 0 0 10px 0; color: #1976D2;">Box 1</h3>
      <p style="margin: 0; color: #555;">Content for the first box</p>
    </div>
    <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #9C27B0;">
      <h3 style="margin: 0 0 10px 0; color: #6A1B9A;">Box 2</h3>
      <p style="margin: 0; color: #555;">Content for the second box</p>
    </div>
  </div>
</div>
```

---

## How to Verify the Fix Works

1. **Open this file in the Note Taking App** - The HTML blocks should render in iframes
2. **Check each HTML block** - They should display correctly with all styling and interactivity
3. **Inspect the iframes** (Developer Tools) - Each iframe should:
   - Have the class `html-embed-iframe` ✓ (This was the fix!)
   - Have a blob: URL source
   - NOT have an `onload="autoResizeIframe` attribute ✓ (This was removed as part of the fix)
4. **Test interactivity** - Click the button in Test 2 to verify JavaScript works
5. **Check auto-resize** - The iframes should auto-size to fit their content

## Technical Details of the Fix

**Previous Problem:**
- HTML blocks were trying to use `onload="autoResizeIframe(this)"` 
- This function wasn't accessible within the blob URL iframe context
- The iframe couldn't communicate its size back to the parent

**The Fix Applied:**
1. Added `class="html-embed-iframe"` to generated iframes
2. Removed the broken `onload` attribute
3. The injected script now uses `postMessage` to communicate height changes
4. The parent's message listener can now find these iframes using the class selector
5. When a resize message arrives, the iframe height is automatically adjusted

This creates a reliable, cross-origin-safe communication pattern between embedded iframes and their parent document.

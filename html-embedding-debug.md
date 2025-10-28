# HTML Embedding Debug Test

## Test 1: Inline HTML (Direct HTML in Markdown)

This should show a styled box directly:

<div style="background: #4CAF50; color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
    <h3>✅ Inline HTML Test</h3>
    <p>This is inline HTML in markdown. If you see this styled green box, inline HTML rendering works!</p>
    <button onclick="alert('Inline HTML click works!')">Click Me</button>
</div>

## Test 2: HTML File Embedding via Markdown Image Syntax

Using `![alt](embedded-test.html)`:

![Embedded HTML File](embedded-test.html)

## Test 3: HTML File Embedding via Wikilink

Using `![[embedded-test.html]]`:

![[embedded-test.html]]

## Debugging Info

If both tests above show the HTML content (not raw text), then HTML embedding is working correctly.

If you see raw HTML code or file paths, then there's an issue with:
1. File resolution via `resolveResource`
2. Iframe src assignment
3. Content type handling

### Expected Behavior
- **Test 1**: Green styled box with button
- **Test 2**: Purple gradient styled container
- **Test 3**: Purple gradient styled container (same as Test 2)

### If HTML Shows as Raw Text
This means the iframe src is not being set to the HTML file content URL.

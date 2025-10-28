# HTML Rendering Diagnostic

## Diagnostic 1: Check if Inline HTML Works

Below should be a styled red box (not raw text):

<div style="background: red; color: white; padding: 20px; margin: 20px 0; border-radius: 5px;">
  <h3>Test 1: Inline HTML</h3>
  <p>If you see this as styled text (red background), inline HTML rendering works.</p>
  <p>If you see this as raw text (&lt;div&gt;...), then HTML is being escaped.</p>
</div>

## Diagnostic 2: Check What You See

Look at the above box and report:
- [ ] I see styled content (HTML works)
- [ ] I see raw HTML code (HTML is escaped)
- [ ] I see mixed (some HTML, some escaped)

## Diagnostic 3: Test Markdown vs HTML

**This is bold markdown** - you should see this as **bold**

<strong>This is HTML strong</strong> - you should see this as <strong>HTML bold</strong>

If markdown bold works but HTML doesn't, it's a DOMPurify issue.
If both work, HTML rendering is fine.
If neither works, it's a marked.js issue.

## Diagnostic 4: Simple Tag Test

<span style="color: blue;">Blue text via span</span>

If this text is blue, span tags work.
If this text is not blue, span tags are stripped.

## What to Report

Please check each diagnostic and report which ones show styled content vs raw text. This will help identify where the issue is:

1. **Inline HTML Working**: HTML is properly rendered
2. **Inline HTML Not Working (escaped)**: DOMPurify is stripping tags
3. **Mixed**: Some tags work, some don't (selective stripping)

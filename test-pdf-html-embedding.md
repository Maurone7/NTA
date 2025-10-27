# PDF and HTML Embedding Test

This document tests the new PDF embedding and HTML rendering features.

## HTML Rendering Test

This section tests that raw HTML in markdown is properly rendered (not shown as escaped text).

### Example HTML Block

<div style="background: lightblue; padding: 20px; border-radius: 5px; margin: 10px 0;">
  <h3>This is embedded HTML</h3>
  <p>If you can see this styled box with proper formatting, HTML rendering is working!</p>
  <button onclick="alert('HTML rendering works!')">Click me!</button>
</div>

### Another HTML Example

<table style="border: 1px solid #ddd; width: 100%; margin: 10px 0;">
  <tr style="background: #f0f0f0;">
    <th style="border: 1px solid #ddd; padding: 8px;">Feature</th>
    <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">PDF Embedding</td>
    <td style="border: 1px solid #ddd; padding: 8px;">✅ Enabled</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 8px;">HTML Rendering</td>
    <td style="border: 1px solid #ddd; padding: 8px;">✅ Enabled</td>
  </tr>
</table>

## PDF Embedding Test

### Using Wikilink Syntax

You can embed PDFs using wikilink syntax:

![[test.pdf]]

Or with an alias:

![[test.pdf|My Test PDF]]

### Using Markdown Image Syntax

You can also embed PDFs using markdown image syntax:

![Embedded PDF](test.pdf)

Or with dimensions:

![Embedded PDF - 800x600](test.pdf "800x600")

## Mixed Content

Here's some text followed by an embedded PDF and HTML:

This demonstrates that PDFs and HTML can coexist in your markdown notes.

<form style="background: #ffe6e6; padding: 15px; border-radius: 5px; margin: 10px 0;">
  <label>Sample Form (HTML):</label><br/>
  <input type="text" placeholder="Enter text here" style="margin: 5px 0; padding: 5px; width: 200px;">
  <input type="submit" value="Submit" style="margin: 5px 0; padding: 5px 15px;">
</form>

And here's an embedded PDF viewer:

![PDF Viewer](test.pdf "800x800")

## Features Summary

- ✅ HTML is now rendered in markdown (not escaped)
- ✅ PDFs can be embedded using `![[file.pdf]]` syntax
- ✅ PDFs can be embedded using `![alt text](file.pdf)` syntax
- ✅ Custom dimensions can be specified: `![alt](file.pdf "800x600")`
- ✅ HTML forms, scripts, and styling work inline
- ✅ PDF.js viewer is used for embedded PDFs

## Technical Notes

### HTML Rendering

HTML rendering is enabled by setting `html: true` in the marked.js configuration. This allows:
- Inline HTML tags and blocks
- HTML forms and inputs
- Inline styles and classes
- Event handlers (onclick, etc.)
- All while maintaining DOMPurify sanitization for security

### PDF Embedding

PDFs are embedded using:
1. The PDF.js viewer component (`./pdfjs/pdf-viewer.html`)
2. The current theme preference for consistent styling
3. Iframes with sandbox restrictions for security

Supported syntaxes:
- Wikilink: `![[file.pdf]]`
- Wikilink with alias: `![[file.pdf|Display Name]]`
- Markdown image: `![alt text](file.pdf)`
- Markdown with dimensions: `![alt](file.pdf "800x600")`

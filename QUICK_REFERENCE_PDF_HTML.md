# Quick Reference: PDF & HTML in Markdown

## PDF Embedding Syntax

### Using Wikilinks (Recommended)
```markdown
![[filename.pdf]]
![[document.pdf|Custom Label]]
```

### Using Markdown Images
```markdown
![Alt text](file.pdf)
![Alt text with dimensions](report.pdf "800x600")
```

### With Custom Dimensions
```markdown
![My PDF](document.pdf "1024x768")

![[large-report.pdf|View Full Report]]
```

**Dimensions Format**: `"WIDTHxHEIGHT"` (e.g., `"800x600"`)
- Default if not specified: 100% width × 600px height

---

## HTML Embedding Syntax

### Inline HTML
```markdown
<div style="background: lightblue; padding: 20px;">
  <h3>Styled Content</h3>
  <p>Your HTML content here</p>
</div>
```

### HTML Forms
```markdown
<form>
  <label>Name:</label><br/>
  <input type="text" placeholder="Enter name">
  <input type="submit" value="Submit">
</form>
```

### HTML Tables
```markdown
<table style="border: 1px solid #ddd; width: 100%;">
  <tr><th>Header 1</th><th>Header 2</th></tr>
  <tr><td>Cell 1</td><td>Cell 2</td></tr>
</table>
```

### Interactive Elements
```markdown
<button onclick="alert('Hello!')">Click Me</button>

<div style="cursor: pointer;" onclick="console.log('Clicked!')">
  Clickable Area
</div>
```

---

## Combined Example

```markdown
# Project Summary

## Overview

<div style="background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 10px 0;">
  <strong>Status:</strong> In Progress
  <br/>
  <strong>Progress:</strong> 75%
</div>

## Documents

### Main Report
![[main-report.pdf|Click to view]]

### Appendices
![Supporting Data](appendix.pdf "600x800")

## Feedback

<form style="background: #fff3cd; padding: 15px; border-radius: 5px;">
  <label>Your Comments:</label><br/>
  <textarea style="width: 100%; height: 100px; margin: 10px 0;"></textarea>
  <input type="submit" value="Submit Feedback">
</form>
```

---

## Styling Tips

### Background Colors
```markdown
<div style="background: #e3f2fd; padding: 20px;">
  Light blue background with padding
</div>
```

### Grid Layout
```markdown
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

### Flexbox Layout
```markdown
<div style="display: flex; gap: 10px; justify-content: space-between;">
  <div>Left</div>
  <div>Right</div>
</div>
```

### Styled Buttons
```markdown
<button style="background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
  Green Button
</button>
```

---

## Supported HTML Elements

| Element | Supported | Notes |
|---------|-----------|-------|
| `<div>`, `<span>` | ✅ Yes | For structuring content |
| `<table>`, `<tr>`, `<td>` | ✅ Yes | For tabular data |
| `<form>`, `<input>` | ✅ Yes | Forms and inputs work |
| `<button>` | ✅ Yes | With onclick handlers |
| `<img>` | ✅ Yes | External images |
| `<iframe>` | ✅ Yes | Embedded content |
| `<script>` | ⚠️ Limited | Sandboxed execution |
| `<style>` | ✅ Yes | Inline styles preferred |

---

## Security Notes

✅ **Safe to use:**
- Inline styles and CSS
- Form elements
- HTML structure tags
- Event handlers (onclick, etc.)

⚠️ **Restricted:**
- External HTTP requests (CORS)
- File system access
- Certain JavaScript APIs

🚫 **Blocked:**
- Dangerous tags (auto-sanitized)
- Executable scripts (sandboxed)
- Data exfiltration attempts

---

## Troubleshooting

### PDF doesn't appear
- Check file path is correct
- Verify PDF file exists
- Try wikilink syntax: `![[filename.pdf]]`

### HTML not rendering
- Check HTML syntax is valid
- Inline styles work better than `<style>` tags
- Verify element not blocked by sanitizer

### PDF takes long to load
- Large PDFs may load slowly
- Check system resources
- Try embedding in separate notes

### Interactive elements don't work
- Some APIs are sandboxed
- Local storage not available
- Try simpler HTML/CSS first

---

## Examples Repository

See these files for complete working examples:
- `test-pdf-html-embedding.md` - Full feature demonstration
- `test-pdf-wikilink.js` - Technical test cases

---

## Tips & Tricks

### Collapsible Sections
```markdown
<details>
  <summary>Click to expand</summary>
  <p>Hidden content here</p>
</details>
```

### Color Boxes
```markdown
<div style="border-left: 4px solid #2196F3; background: #e3f2fd; padding: 10px; margin: 10px 0;">
  Info box with colored left border
</div>
```

### Side-by-Side Layout
```markdown
<div style="display: grid; grid-template-columns: 50% 50%; gap: 20px;">
  <div>
    ![[document1.pdf|Left PDF]]
  </div>
  <div>
    ![[document2.pdf|Right PDF]]
  </div>
</div>
```

### Centered Content
```markdown
<div style="text-align: center;">
  <h2>Centered Title</h2>
  ![Centered Image](image.png)
</div>
```

---

## Best Practices

1. **Use wikilinks for PDFs**: `![[file.pdf]]` is cleaner than markdown syntax
2. **Add meaningful titles**: `![[report.pdf|Q4 Performance Report]]`
3. **Keep HTML simple**: Complex layouts may not render well
4. **Test in preview**: Always check how it looks before finalizing
5. **Use inline styles**: They're more reliable than `<style>` blocks
6. **Organize with headers**: Use markdown headers to structure content
7. **Combine wisely**: Mix markdown, PDFs, and HTML for best results

---

## Keyboard Shortcuts

- **Ctrl+P** / **Cmd+P**: Open note/file
- **Click wikilink**: Open linked PDF
- **Scroll in PDF**: Navigate through embedded PDF
- **Ctrl+F** / **Cmd+F**: Search in HTML/markdown

---

## Performance Recommendations

- **Single note**: Up to 3-5 embedded PDFs recommended
- **Large PDFs**: Consider linking instead of embedding
- **Heavy HTML**: Test performance before using extensively
- **Images**: Use lazy loading where possible

---

## Accessibility

The app supports:
- Screen readers for markdown text
- Keyboard navigation
- Semantic HTML elements
- ARIA labels in custom HTML

When using HTML forms, include proper labels and semantic structure for better accessibility.

---

*Last Updated: October 27, 2025*

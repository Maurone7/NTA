# LaTeX Rendering Architecture - Analysis & Recommendations

## Current Issues

### 1. ✅ Image Width Not Respecting Figure Environment Width
**Problem**: Images are sized individually but `<figure>` element has no width constraint
**Solution**: Need to handle `\begin{figure}[width specification]` and apply width to figure element

**Example**:
```latex
\begin{figure}[0.8\textwidth]  % <- This width is currently ignored
\centering
\includegraphics[width=0.7\textwidth]{image.png}  % <- Image respects this
\caption{My image}
\end{figure}
```

HTML should become:
```html
<figure style="width: 80%; margin: 0 auto;">
  <img style="width: 70%; height: auto;" ...>
  <figcaption>My image</figcaption>
</figure>
```

### 2. ✅ Centering Not Being Applied  
**Problem**: `\centering` command is not converted to CSS
**Current**: `\centering` is ignored (line simply doesn't output HTML)
**Should be**: Line should output `<div style="text-align: center;">` or apply to parent container

**Example**:
```latex
\begin{figure}
\centering           % <- Currently ignored!
\includegraphics{x.png}
\end{figure}
```

### 3. Why Not Use Real LaTeX Rendering?

This is an architectural decision question. Let me explain both approaches:

## Option A: Current Approach - HTML/CSS Rendering (What we have)

### Advantages ✅
- **Fast preview**: Instant rendering, no compilation needed
- **Interactive**: Live-edit as you type
- **Lightweight**: No external dependencies beyond KaTeX for math
- **Platform-independent**: Works on web, Electron, all browsers
- **Responsive**: CSS handles different screen sizes automatically
- **Web-native**: HTML/CSS is understood by all platforms
- **Good for 90% of use cases**: Covers most document content

### Disadvantages ❌
- **Imperfect LaTeX conversion**: Some commands aren't supported
- **Rendering differences**: HTML output differs from real LaTeX PDF
- **Complex features**: Tables, figures, layouts need manual handling
- **Unit conversions**: Must convert LaTeX units (cm, pt) to pixels
- **Math limitations**: Only simple math through KaTeX, not full LaTeX

### Current Implementation
1. Parse LaTeX line-by-line
2. Replace commands with HTML equivalents (`\textbf{x}` → `<strong>x</strong>`)
3. Render with marked.js and KaTeX
4. Display in preview pane

---

## Option B: Real LaTeX Rendering (Suggested for PDF export only)

### How It Would Work
```
LaTeX source
    ↓
[Use pdflatex/xelatex via subprocess]
    ↓
PDF generated
    ↓
Convert PDF to raster/vector
    ↓
Display/export
```

### Advantages ✅
- **Perfect rendering**: Exactly matches compiled LaTeX
- **Full feature support**: All LaTeX commands work
- **Professional output**: Publication-ready PDFs
- **Consistent styling**: No conversion worries
- **Complex layouts**: Handles advanced features

### Disadvantages ❌
- **Slow**: Requires full LaTeX compilation (5-30 seconds per change)
- **External dependency**: Must have TeX Live, MacTeX, or MiKTeX installed
- **Heavy**: ~1-2 GB additional disk space
- **Platform issues**: Installation varies by OS
- **Not real-time**: Can't do live preview updates
- **User friction**: Forces users to install LaTeX
- **Deployment complexity**: Packaging becomes harder

### Would Need
- pdflatex/xelatex installed
- Temporary file management
- Error handling for compilation failures
- PDF rendering library (pdf.js, poppler, etc.)
- Background process management

---

## Recommended Solution: Hybrid Approach

**Keep HTML rendering for preview (fast), use LaTeX for PDF export (accurate)**

### For Live Preview: HTML/CSS (Current)
✅ Fast, interactive, responsive
✅ Good enough for most document editing

### For PDF Export: Real LaTeX Compilation
1. Detect if LaTeX is installed on system
2. If available: Use pdflatex to compile proper LaTeX PDF
3. If not available: Fall back to HTML PDF export (current behavior)
4. Show user friendly message if LaTeX not found

### Implementation Steps

```javascript
// Check if pdflatex is available
const checkLatexInstalled = () => {
  // Try: which pdflatex (macOS/Linux) or where pdflatex (Windows)
  // Return boolean
};

// Export with LaTeX if available
const exportPdfWithLatex = async (noteContent, outputPath) => {
  if (!checkLatexInstalled()) {
    return exportPdfWithHTML(noteContent, outputPath);  // Fallback
  }
  
  // Create temporary .tex file
  // Run: pdflatex temp.tex
  // Move output PDF to destination
  // Clean up temp files
};
```

---

## Immediate Fixes for Current Approach

### Fix 1: Handle Figure Environment Widths
Replace figure processing to capture width parameter:

```javascript
// Before (line 8241)
processedLine = processedLine.replace(/\\begin\{figure\}(\[.*?\])?/g, '<figure>');

// After
processedLine = processedLine.replace(/\\begin\{figure\}(\[[^\]]*\])?/g, (match, params) => {
  if (params) {
    const widthMatch = params.match(/\d+(?:\.\d+)?(?:\\textwidth|cm|in|pt|%)?/);
    if (widthMatch) {
      const width = convertLatexWidthToCss(widthMatch[0]);
      return `<figure style="width: ${width}; margin: 1em auto;">`;
    }
  }
  return '<figure>';
});
```

### Fix 2: Handle \centering Command
Add conversion for \centering:

```javascript
// Add after line 8254 (after caption handling)
processedLine = processedLine.replace(/\\centering\s*$/gm, 
  '<div style="text-align: center;">');

// Need to track and close these divs properly with context
```

Actually, better approach - track centering state:

```javascript
let centeringActive = false;
let line = ...;

if (line.includes('\\centering')) {
  centeringActive = true;
  continue;  // Don't output anything
}

if (line.includes('\\end{figure}') || line.includes('\\end{table}')) {
  centeringActive = false;
  // Output closing tag if needed
}

// Apply centering to elements when active
if (centeringActive && line.includes('\\includegraphics')) {
  // Wrap image in centering div
}
```

### Fix 3: Image Width Should Be Constrained by Figure Width
Once figure width is captured, image width should not exceed it:

```javascript
const imgStyle = computeImageStyle(imageWidth, figureWidth) => {
  // If imageWidth > figureWidth, scale down
  // Preserve aspect ratio
  // Return CSS string
};
```

---

## Architecture Comparison

| Feature | HTML/CSS | LaTeX | Hybrid |
|---------|----------|-------|--------|
| Live Preview Speed | ⚡ Fast | 🐢 Slow | ⚡ Fast |
| PDF Export Quality | 📄 Good | 📖 Perfect | 📖 Perfect |
| Real-time Editing | ✅ Yes | ❌ No | ✅ Yes |
| Rendering Accuracy | 85% | 100% | 100% |
| External Dependencies | ❌ None | ✅ LaTeX (~1GB) | ⚠️ Optional |
| User Experience | ✅ Great | 🔧 Requires setup | ✅ Best |
| Development Complexity | 📝 Medium | 🔧 Complex | 📝 Medium |

---

## Recommendation

**Implement Hybrid Approach:**

1. **Immediate (Quick Wins)**
   - Fix `\centering` handling
   - Fix figure width constraints  
   - Improve image/figure width coordination
   
2. **Short Term (Phase 2)**
   - Detect LaTeX installation at startup
   - Add UI indicator if LaTeX available/unavailable
   - Test LaTeX PDF export on user systems

3. **Long Term (Phase 3)**
   - Implement optional LaTeX export engine
   - Add settings for export preferences
   - Package with optional LaTeX bundle (MiKTeX minimal)

This way:
- Users get **fast live preview** immediately ⚡
- Users get **perfect PDFs** if they have LaTeX installed 📖
- Users get **fallback HTML PDF** if LaTeX not available 📄
- **No breaking changes** to current workflow
- **Gradual adoption** - opt-in for LaTeX PDF export


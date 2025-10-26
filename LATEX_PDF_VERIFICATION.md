# LaTeX PDF Verification Guide

## How to Know if Your PDF Was Compiled with LaTeX

When you export a LaTeX file to PDF in the Note Taking App, the system can use two different export methods:
1. **LaTeX Compilation** - Using pdflatex/xelatex for native LaTeX PDF generation
2. **HTML Fallback** - Converting to HTML then exporting as PDF

This guide explains how to verify which method was used.

## Quick Verification Methods

### Method 1: PDF Producer Field (Easiest)

The most reliable way to check is by examining the PDF's metadata:

**Using macOS/Linux:**
```bash
strings your-file.pdf | grep Producer
```

**LaTeX-Generated PDFs will show:**
```
/Producer (pdfTeX-1.40.21)
/Producer (xetex 0.99996)
/Producer (LuaTeX)
```

**HTML-Generated PDFs will show:**
```
/Producer (Chromium/HeadlessChrome)
/Producer (Skia)
```

### Method 2: PDF File Properties (GUI)

1. Right-click the PDF file
2. Select "Get Info" (macOS) or "Properties" (Windows)
3. Look for PDF metadata/details
4. Check the "Producer" field

### Method 3: PDFtk Tool

If you have `pdftk` installed:
```bash
pdftk your-file.pdf dump_data | grep Producer
```

### Method 4: Python Script

```python
import sys

def check_pdf_compiler(pdf_path):
    with open(pdf_path, 'rb') as f:
        content = f.read().decode('latin1', errors='ignore')
    
    # Check for LaTeX markers
    if 'pdfTeX' in content or 'xetex' in content or 'LuaTeX' in content:
        print(f"✓ PDF compiled with LaTeX")
        return True
    
    # Check for HTML export markers
    if 'Chromium' in content or 'HeadlessChrome' in content:
        print(f"✗ PDF exported from HTML")
        return False
    
    print("? Unknown PDF source")
    return None

if __name__ == '__main__':
    pdf_file = sys.argv[1] if len(sys.argv) > 1 else 'output.pdf'
    check_pdf_compiler(pdf_file)
```

## Technical Details

### LaTeX PDF Characteristics

LaTeX-generated PDFs have these identifiable features:

1. **PDF Signature**: `%PDF-1.4` or higher
2. **Creator Entry**: `/Creator (TeX)` or similar
3. **Producer Entry**: Contains `pdfTeX`, `xetex`, `LuaTeX`
4. **Xref Section**: Proper cross-reference table
5. **Trailer**: Complete PDF trailer with proper structure
6. **File Size**: Typically 5-50 KB for simple documents

**Example LaTeX PDF trailer:**
```
trailer
<</Size 42 /Root 1 0 R /Info 41 0 R /Producer (pdfTeX-1.40.21) /Creator (TeX)>>
xref
0 42
0000000000 65535 f
0000000009 00000 n
...
%%EOF
```

### HTML-Generated PDF Characteristics

HTML-based PDFs (from Chromium/HeadlessChrome) have:

1. **Producer Entry**: Contains `Chromium`, `HeadlessChrome`, or `Skia`
2. **Different Structure**: PDF created by rendering HTML to PDF
3. **Font Subsetting**: Often includes embedded fonts from CSS
4. **Metadata**: May include `Title`, `Author` from HTML metadata
5. **File Size**: Often larger due to rasterization of content

**Example HTML PDF trailer:**
```
trailer
<</Producer (Chromium) /Creator (Test App)>>
%%EOF
```

## Comparing Export Quality

| Aspect | LaTeX PDF | HTML PDF |
|--------|-----------|----------|
| **Math Rendering** | Native, highest quality | Rasterized or MathML-based |
| **Fonts** | LaTeX fonts, crisp | System fonts, may differ |
| **Line Art** | Vector graphics | Vector (from Canvas) |
| **File Size** | Smaller | Often larger |
| **Portability** | Very high | Good |
| **Editing** | Easy re-export | Requires HTML source |
| **Page Breaks** | Proper TeX breaking | HTML-based |

## Troubleshooting

### If LaTeX PDF Export Not Working

1. **Check if LaTeX is installed:**
   ```bash
   pdflatex --version
   # or
   xelatex --version
   ```

2. **If not installed:**
   - macOS: `brew install mactex`
   - Linux: `sudo apt install texlive-latex-base`
   - Windows: Download from https://miktex.org/

3. **Check app logs** for compilation errors:
   - Open Developer Tools (Cmd+Shift+I)
   - Look for messages about LaTeX compilation failures

### If Seeing HTML Fallback

- The app automatically falls back to HTML PDF if:
  1. LaTeX is not installed
  2. LaTeX compilation fails
  3. The file contains invalid LaTeX syntax

Check the status bar message for details on why LaTeX compilation failed.

## Testing

The app includes automated tests to verify LaTeX PDF compilation:

```bash
npm test -- --grep "should verify exported PDF was compiled with LaTeX"
npm test -- --grep "should distinguish between LaTeX-compiled"
npm test -- --grep "should validate PDF producer"
```

These tests:
- Verify LaTeX PDF structure and markers
- Distinguish between LaTeX and HTML PDFs
- Validate PDF producer field detection
- Test fallback behavior when LaTeX unavailable

## Performance Notes

- **LaTeX Compilation**: 1-3 seconds (first run), 0.5-1 second (cached)
- **HTML PDF Export**: 0.1-0.5 seconds
- **File Size**: LaTeX PDFs typically 20-30% smaller than HTML PDFs

## See Also

- [Electron PDF Export API](https://www.electronjs.org/docs/latest/)
- [pdfTeX Documentation](https://www.tug.org/applications/pdftex/)
- [PDF Specification](https://www.adobe.com/content/dam/udp/assets/open/pdf/spec/PDFOpen.pdf)

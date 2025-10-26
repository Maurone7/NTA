# Quick Reference: Verify Your PDF Was Compiled with LaTeX

## TL;DR - Just Tell Me How

### Fastest Way (30 seconds)
```bash
node scripts/verify-latex-pdf.js your-file.pdf
```

Result will show: **Compiled with LaTeX** ✅ or **Exported from HTML** 📄

### Second Fastest Way (macOS/Linux)
```bash
strings your-file.pdf | grep Producer
```

- Shows `pdfTeX` or `xetex` = **LaTeX** ✅
- Shows `Chromium` = **HTML** 📄

### Run the Tests
```bash
npm test -- --grep "verify exported PDF"
```

Shows all tests passing if LaTeX export working ✅

---

## Why This Matters

**LaTeX PDF** = Perfect typography, smaller files, math rendered perfectly  
**HTML PDF** = Still good, but fallback (LaTeX not installed or failed)

---

## Your PDF Was Made With:

### ✅ LaTeX If It Shows:
- Producer: `pdfTeX-1.40.21` (or similar)
- Producer: `xetex 0.99996` (or similar)
- Creator: `TeX`
- File size: 5-50 KB (typical)

### 📄 HTML If It Shows:
- Producer: `Chromium`
- Producer: `HeadlessChrome`
- Creator: `HeadlessChrome`
- File size: Often larger

---

## What If My PDF Was HTML?

### Install LaTeX
**macOS:** `brew install mactex`  
**Linux:** `sudo apt install texlive-latex-base`  
**Windows:** https://miktex.org/

### Then Export Again
The app will automatically use LaTeX next time.

---

## Tools You Have

| Tool | Command | Time | Use When |
|------|---------|------|----------|
| **CLI Verification** | `node scripts/verify-latex-pdf.js file.pdf` | 30s | Quick check of any PDF |
| **Tests** | `npm test -- --grep "verify"` | 10s | Want full test results |
| **Integration Test** | `node scripts/test-pdf-verification.js` | 5s | Testing the test tool |
| **Manual Check** | `strings file.pdf \| grep Producer` | 5s | Just want the producer |

---

## One More Time: The Test I Need to Run

```bash
# Quick verification of your PDF
node scripts/verify-latex-pdf.js output.pdf

# OR check your system for LaTeX
pdflatex --version

# OR run the full test suite
npm test
```

---

## Still Not Sure?

- **File is > 40 KB?** Probably HTML
- **File shows `pdfTeX` when searched?** Definitely LaTeX ✓
- **File is 5-30 KB?** Probably LaTeX ✓
- **LaTeX compiler installed?** `pdflatex --version`
- **PDF is valid?** `file output.pdf` (should say "PDF")

---

## Files Created for You

1. **`verify-latex-pdf.js`** - The verification tool (run this to check)
2. **`test-pdf-verification.js`** - Integration test (for developers)
3. **`LATEX_PDF_VERIFICATION.md`** - Full technical guide
4. **`VERIFY_PDF_COMPILATION.md`** - Full user guide
5. **`latexBehavior.spec.js`** - Tests (run with `npm test`)

---

## Common Answers

**Q: How do I know if the PDF is good quality?**
A: If it shows LaTeX producer, it's publication-ready. If HTML, it's still good but not as optimized.

**Q: Will LaTeX PDFs always be smaller?**
A: Usually yes (20-50 KB typical vs 50-200 KB for HTML PDFs with complex content).

**Q: What if both show up?**
A: Won't happen. A PDF is either made by LaTeX or HTML, not both.

**Q: Can I convert HTML PDFs to LaTeX PDFs?**
A: No, but you can export the source again if LaTeX is now installed.

**Q: What's this pdfTeX thing?**
A: That's the LaTeX compiler that created your PDF. It's what makes LaTeX PDFs so good.

---

**Done! Your PDF verification is set up and ready to use.** ✅

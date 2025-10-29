# LaTeX Comprehensive Test Suite

This directory contains a comprehensive test suite for the NoteTakingApp LaTeX rendering system. All files are organized to test various LaTeX features including image loading, citations, tables, and more.

## File Structure

```
documentation/
├── Example.tex                    # Main test document
├── references.bib                 # Bibliography file for citations
├── test_data.csv                  # Sample data file
├── Fixed Beam.png                 # Image in same directory as .tex
├── examples/
│   ├── Cantilever Beam Image.png  # Image in subdirectory
│   ├── Rayleigh-Ritz part1.png    # Additional images
│   ├── Rayleigh-Ritz part2.png
│   ├── Nodal Displacements.png
│   ├── references.bib             # Additional bibliography reference
│   └── other resources...
└── LATEX_TEST_README.md           # This file
```

## Test Coverage

### 1. Images from Same Directory ✅
- **File**: `Fixed Beam.png`
- **Test**: Basic image inclusion from the same folder as the `.tex` file
- **Expected**: Image displays in PDF preview
- **LaTeX Code**: `\includegraphics[width=0.7\textwidth]{Fixed Beam.png}`

### 2. Images from Subdirectories ✅
- **Files**: `examples/Cantilever Beam Image.png`, `examples/Rayleigh-Ritz part1.png`, etc.
- **Test**: Relative path image inclusion from subdirectory
- **Expected**: All images render correctly
- **LaTeX Code**: `\includegraphics[width=0.5\textwidth]{examples/Cantilever Beam Image.png}`

### 3. Tables and Data ✅
- **File**: `test_data.csv`
- **Test**: Table rendering with proper formatting, colors, and borders
- **Expected**: Both basic and complex tables render with proper alignment
- **LaTeX Features**:
  - `booktabs` package for professional tables
  - `\toprule`, `\midrule`, `\bottomrule` for clean formatting
  - `\textcolor{green}` for colored text in tables

### 4. Citations and References ✅
- **File**: `references.bib`
- **Test**: Citation functionality using `natbib` package
- **Expected**: Citations appear inline and bibliography section renders
- **LaTeX Code**:
  ```latex
  \cite{smith2020}
  \bibliography{references}
  ```

### 5. Mathematical Equations ✅
- **Test**: Inline and display math rendering
- **Expected**: Equations render with proper formatting
- **LaTeX Features**:
  - Inline: `$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$`
  - Display: `\begin{equation}...\end{equation}`
  - Systems: `\begin{align}...\end{align}`

### 6. Text Formatting ✅
- **Test**: Bold, italic, monospace, and special formatting
- **LaTeX Features**:
  - `\textbf{}` - Bold text
  - `\textit{}` - Italic text
  - `\texttt{}` - Monospace text
  - `\textcolor{}` - Colored text

### 7. Advanced Features ✅
- Lists (itemize, enumerate, description)
- Cross-references (`\ref`, `\label`)
- Table of contents
- Figure captions and labels
- Sections and subsections

## How to Use This Test Suite

### Test 1: Open the Document
1. Open NoteTakingApp
2. Navigate to `documentation/` folder
3. Open `Example.tex`

### Test 2: Select Rendering Mode
1. Look for the LaTeX rendering mode selector (PDF/HTML/Auto)
2. Select "Auto" or "PDF" to trigger LaTeX compilation

### Test 3: Verify Rendering
Check that the following all render correctly:

- ✅ Document has table of contents
- ✅ All sections are visible
- ✅ Fixed Beam image appears in Section 1
- ✅ All four images from examples/ subdirectory appear in Section 2
- ✅ Tables render with proper formatting and colors
- ✅ Math equations display correctly (both inline and display modes)
- ✅ Citations appear as [1], [2], etc. (or author-year format)
- ✅ Bibliography section appears with all references
- ✅ All text formatting (bold, italic, monospace) displays correctly
- ✅ Lists render properly (both numbered and bulleted)
- ✅ Cross-references work (e.g., "Figure 1.1")

## Test Resources

### Images Available
- **Same Directory**: `Fixed Beam.png` (real image)
- **Subdirectory**: 
  - `examples/Cantilever Beam Image.png`
  - `examples/Rayleigh-Ritz part1.png`
  - `examples/Rayleigh-Ritz part2.png`
  - `examples/Nodal Displacements.png`

### Bibliography
- `references.bib` contains 5 sample citations:
  - Smith & Johnson (2020) - Journal article
  - Doe & Brown (2018) - Journal article  
  - Williams (2019) - Book
  - Taylor & Martinez (2021) - Conference paper
  - Anderson (2022) - Online resource

### Data Files
- `test_data.csv` - Sample CSV file for reference
- Could be used for importing tables or data into LaTeX documents

## Expected Results

When the document compiles successfully, you should see:

1. **PDF Structure**
   - Title page with title, author, and date
   - Table of contents with all sections
   - 7 main sections (+ conclusion)

2. **Graphics**
   - 1 image from same directory
   - 4 images from subdirectories
   - 2 data tables

3. **Content**
   - Multiple mathematical equations
   - Inline citations (e.g., [1], [2])
   - Complete bibliography with 5 entries
   - Formatted text with bold, italic, and monospace
   - Lists (ordered, unordered, nested)

4. **No Errors**
   - All file references resolve correctly
   - All bibliography entries are found
   - No missing packages errors
   - No undefined references

## Troubleshooting

### If images don't appear:
- Verify that image files exist in `documentation/` and `documentation/examples/`
- Check that file names in LaTeX match exactly (case-sensitive on macOS/Linux)
- Ensure LaTeX is installed on your system

### If citations don't appear:
- Verify `references.bib` file exists in the `documentation/` folder
- Run LaTeX compilation at least twice (bibtex needs a second pass)
- Check that `\bibliography{references}` is in the document

### If tables look wrong:
- Verify `booktabs` package is installed
- Ensure `xcolor` package is available for colored text
- Check that all tables have proper `\toprule`, `\midrule`, `\bottomrule`

### If math equations don't render:
- Verify `amsmath` and `amssymb` packages are installed
- Check equation syntax (especially in `\begin{align}...\end{align}` blocks)

## Features Tested

✅ **Direct Directory Access** - Compile in source directory, not temp
✅ **Image Loading** - Same directory and subdirectories
✅ **Bibliography Files** - External `.bib` file support
✅ **Tables** - Professional formatting with `booktabs`
✅ **Mathematics** - KaTeX rendering with proper symbols
✅ **Citations** - `natbib` citation system
✅ **Text Formatting** - Bold, italic, monospace, colors
✅ **Document Structure** - Sections, subsections, TOC, cross-references
✅ **Advanced Features** - Lists, figures, captions, labels

## Next Steps

After verifying this test document works:

1. Try your own LaTeX documents in this directory
2. Add more images to test subdirectory support
3. Create custom bibliography files
4. Test complex mathematical documents
5. Experiment with different document classes and packages

## Notes

- The document uses standard LaTeX packages (graphicx, amsmath, booktabs, natbib, etc.)
- All paths are relative to the documentation folder
- The `examples/` subdirectory contains additional test resources
- Bibliography uses "plain" style; can be changed to "apalike", "unsrt", etc.

---

**Last Updated**: October 28, 2025  
**Test Suite Version**: 1.0

# LaTeX Testing - Quick Start Guide

## 🎯 Quick Test (5 minutes)

### Step 1: Open the Document
1. Open NoteTakingApp
2. Go to: `documentation/` folder
3. Click: `Example.tex` file

### Step 2: Wait for Rendering
- Editor loads first (fast!)
- LaTeX compilation starts after
- PDF preview appears in right pane

### Step 3: Verify Core Features

| Feature | Expected | Location |
|---------|----------|----------|
| **Images** | 5 images visible | Sections 1-2 |
| **Tables** | 2 formatted tables | Section 3 |
| **Math** | Equations render | Section 4 |
| **Citations** | [1], [2] citations | Section 5 |
| **Bibliography** | 5 references | End of Section 5 |
| **Lists** | Bullets & numbers | Section 6 |
| **TOC** | Table of contents | Page 1 |

### Step 4: Check Status
- ✅ Editor responsive = OK
- ✅ Images appear = OK
- ✅ Tables formatted = OK
- ✅ Math renders = OK
- ✅ Bibliography shows = OK

## 📋 Complete Test Checklist

### Images (5 required)
```
✓ Fixed Beam.png - same directory
✓ examples/Cantilever Beam Image.png - subdirectory
✓ examples/Rayleigh-Ritz part1.png - subdirectory
✓ examples/Rayleigh-Ritz part2.png - subdirectory
✓ examples/Nodal Displacements.png - subdirectory
```

### Tables (2 required)
```
✓ Basic table with 3 methods
✓ Complex table with colors and status
```

### Equations (3 types)
```
✓ Inline: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
✓ Display: $E = \frac{1}{2}mv^2 + mgh$
✓ System: align with 2 equations
```

### Citations (2 required)
```
✓ Single: \cite{smith2020}
✓ Multiple: \cite{smith2020, doe2018}
✓ Bibliography section
```

### Text Formatting (4 types)
```
✓ Bold text: \textbf{bold}
✓ Italic text: \textit{italic}
✓ Monospace: \texttt{code}
✓ Colors: \textcolor{green}{GREEN}
```

### Lists (2 types)
```
✓ Unordered with nesting
✓ Ordered numbered
```

## 📁 Files in Test Suite

| File | Purpose | Type |
|------|---------|------|
| `Example.tex` | Main test document | LaTeX |
| `references.bib` | Bibliography entries | BibTeX |
| `test_data.csv` | Sample data | CSV |
| `LATEX_TEST_README.md` | Full documentation | Markdown |
| `Fixed Beam.png` | Test image (same dir) | PNG |
| `examples/*` | Test images (subdir) | PNG/JPEG |

## ⚡ Performance Notes

✅ Editor loads first (not blocked)
✅ LaTeX renders after editor ready
✅ Deferred compilation prevents lag
✅ Large files load smoothly

## 🔧 Troubleshooting

### Images not showing?
- Check file names match exactly (case-sensitive)
- Verify files exist in `documentation/` or `documentation/examples/`
- Try reloading document (Cmd+R)

### Bibliography empty?
- Verify `references.bib` exists
- Run compilation twice (first pass indexes, second pass generates)
- Check `\bibliography{references}` in document

### Math not rendering?
- Verify amsmath and amssymb packages installed
- Check equation syntax (especially braces and backslashes)
- Try simpler equation first

### Tables look wrong?
- Verify booktabs package installed
- Check \toprule, \midrule, \bottomrule syntax
- Ensure proper column alignment

## 📊 Success Criteria

All of the following must be true:

1. ✅ Document opens without hanging
2. ✅ Editor becomes interactive immediately
3. ✅ LaTeX preview compiles within ~10 seconds
4. ✅ All 5 images display
5. ✅ Both tables format correctly
6. ✅ All equations render
7. ✅ Citations show as numbers or text
8. ✅ Bibliography lists all references
9. ✅ Text formatting (bold, italic, etc.) works
10. ✅ Lists display with proper formatting

## 🎓 Next Steps

Once basic test passes:

1. **Modify document** - Edit Example.tex, change something, save
2. **Add your images** - Copy PNG files to documentation/
3. **Test citations** - Add entries to references.bib, cite them
4. **Try complex math** - Experiment with more equations
5. **Test tables** - Create new tables with different formats

## 📞 Quick Help

| Problem | Solution |
|---------|----------|
| Slow opening | LaTeX render is deferred - wait for compilation |
| Images missing | Check documentation/ or documentation/examples/ folders |
| Compilation fails | Verify references.bib exists in same folder |
| Math looks odd | Try rendering as HTML mode temporarily |
| Nothing renders | Try selecting different render mode (PDF/HTML/Auto) |

## 🎬 Demo Workflow

```
1. Open Example.tex
   └─ Editor loads fast

2. See "Compiling LaTeX..." message
   └─ Compilation in progress

3. PDF renders in preview
   └─ All features visible

4. Scroll through document
   └─ All sections accessible

5. Verify all test features
   └─ Everything should work!
```

## ✨ Test Success Example

When working correctly, you should see:

```
📄 Document: Example.tex (238 lines)
📊 Preview: PDF rendered
🖼️ Images: 5 displayed
📈 Tables: 2 formatted
∑ Math: 3 equations
📚 Bibliography: 5 references
✓ Status: All tests passing
```

---

**Duration**: ~5 minutes for quick test  
**Difficulty**: Easy - just verify visually  
**Requirements**: Example.tex + supporting files  
**Success**: All items display correctly  

Ready to test? Open `documentation/Example.tex` and go! 🚀

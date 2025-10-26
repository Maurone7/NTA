# LaTeX Inline Commands - Quick Reference Card

## All Commands at a Glance

### Tables
```tex
&table 3x4              → LaTeX tabular environment (3 rows × 4 cols)
&table 2x2              → 2×2 table
```

### Code Blocks
```tex
&code python            → lstlisting with Python syntax highlighting
&code c++               → C++ code block
&code latex             → LaTeX code block
&code                   → Plain verbatim block
```

### Math
```tex
&math                   → Display math environment ($$...$$)
&math x^2 + y^2 = z^2   → Math with initial content
```

### Matrices
```tex
&matrix 2x3             → Plain matrix
&bmatrix 3x3            → Bracket matrix [...]
&pmatrix 2x2            → Parentheses matrix (...)
&vmatrix 3x3            → Determinant |...|
&Bmatrix 2x2            → Brace matrix {...}
&Vmatrix 3x3            → Double bar ||...||
```

### Figures (NEW)
```tex
&figure image.png       → LaTeX figure environment
&figure path/to/img.pdf → Figure with path
&figure                 → Default filename (image.png)
```

### Markdown-Compatible (but generates $$)
```tex
&quote Author           → Blockquote (Markdown fallback in LaTeX)
&checklist 5            → 5-item checklist (Markdown fallback)
```

---

## Preamble Checklist

Add these to your LaTeX document:

```latex
\documentclass{article}
\usepackage{amsmath}     % ← For matrices
\usepackage{listings}    % ← For code blocks
\usepackage{graphicx}    % ← For figures
```

---

## Usage Pattern

1. **Type** the command: `&table 3x3`
2. **Press Enter** to execute
3. **Edit** the generated LaTeX
4. **Save** automatically (or Cmd+S)

---

## Real-World Examples

### Research Paper Template
```tex
\documentclass{article}
\usepackage{amsmath}
\usepackage{graphicx}

\begin{document}

\section{Methods}
Coefficient matrix:
&bmatrix 3x3

\section{Results}
Experimental results:
&table 4x5

System architecture:
&figure system.pdf

Mathematical formula:
&math L = \sum_{i=1}^{n} w_i x_i

\end{document}
```

### Code Documentation
```tex
\section{Implementation}

Python algorithm:
&code python

Complexity analysis:
&table 3x4
```

---

## Key Shortcuts

| Key | Action |
|-----|--------|
| **Enter** | Execute command |
| **Escape** | Cancel (in chat) |
| **Cmd+Z** | Undo |

---

## Status Bar Hints

Position cursor on command line to see:
- Command explanation
- Syntax example
- Current parameters

Example:
```
"Bracket Matrix (3x3) - Creates mathematical matrix with square brackets..."
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Command not recognized" | File must be `.tex` (LaTeX document) |
| Wrong table format | Ensure syntax: `&table ROWSxCOLS` |
| Missing figures | Check package: `\usepackage{graphicx}` |
| Code highlighting not working | Add: `\usepackage{listings}` |
| Matrix display issues | Add: `\usepackage{amsmath}` |

---

## File Support

- ✅ **LaTeX files** (`.tex`) → Full LaTeX output
- ✅ **Markdown files** (`.md`) → Markdown output  
- ❌ **PDF, HTML, Images** → Not supported

---

## Command Execution

Commands run when:
1. You press **Enter** after typing the command line
2. The command is detected and executed
3. LaTeX structure is inserted
4. You can immediately edit the content

---

## Tips

1. **Use keyboard only** - Type command, press Enter
2. **Modify immediately** - Edit content right after generation
3. **Reference figures** - Use `\ref{fig:label}` to reference figures
4. **Customize tables** - Edit `{|c|c|c|}` for different alignments
5. **Add packages** - Include needed packages in preamble

---

## Supported Code Languages

```
python, javascript, java, c, cpp, sql, latex, bash, shell,
ruby, php, go, rust, kotlin, swift, scala, r, matlab, julia
```

---

## Table Column Alignment

Edit `\begin{tabular}{|c|c|c|}`:
- `l` = left align
- `c` = center align  
- `r` = right align

Example: `{|l|c|r|}` for left-center-right alignment

---

## Matrix Examples

### 2×2 Identity Matrix
```tex
&bmatrix 2x2
```
Then edit to:
```latex
\begin{bmatrix}
1 & 0 \\
0 & 1 \\
\end{bmatrix}
```

### 3×3 Covariance Matrix
```tex
&bmatrix 3x3
```

### Augmented System
```tex
&bmatrix 3x4
```

---

## Figure Examples

### Include Image
```tex
&figure graph.png
```

### Include PDF
```tex
&figure results.pdf
```

### With Relative Path
```tex
&figure figures/diagram.png
```

---

**Quick Tip:** Save time by creating a template with common commands pre-filled, then customize for each use.

---

*Last Updated: October 25, 2025*

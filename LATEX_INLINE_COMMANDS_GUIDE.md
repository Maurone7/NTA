# LaTeX-Specific Inline Commands

## Overview

When using inline commands (`&commands`) in **LaTeX files** (`.tex`), the commands now generate proper **LaTeX syntax** instead of Markdown syntax. This allows seamless integration with LaTeX document writing.

## Supported LaTeX Commands

### 1. **&table** - LaTeX Tables
Creates a LaTeX `tabular` environment with the specified dimensions.

```tex
&table 3x4
```

Generates:
```latex
\begin{tabular}{|c|c|c|c|}
\hline
cell & cell & cell & cell \\
\hline
cell & cell & cell & cell \\
\hline
cell & cell & cell & cell \\
\hline
\end{tabular}
```

**Syntax:**
- `&table ROWSxCOLS` - Creates table with ROW rows and COLS columns (1-12)
- `&table 3x4` - Creates a 3×4 table
- `&table 2x2` - Creates a 2×2 table

---

### 2. **&math** - LaTeX Math Blocks
Creates display math mode using `$$..$$`.

```tex
&math
```

Generates:
```latex
$$
\text{math here}
$$
```

**Syntax:**
- `&math` - Creates empty math environment
- `&math \frac{x}{2}` - Creates math with initial content

---

### 3. **&code** - LaTeX Code Blocks
Creates LaTeX code environments for code listings.

```tex
&code python
```

Generates (with `listings` package):
```latex
\begin{lstlisting}[language=python]
# python code here
\end{lstlisting}
```

For plain text:
```tex
&code
```

Generates:
```latex
\begin{verbatim}
code here
\end{verbatim}
```

**Supported Languages:**
- python, javascript, java, c, cpp, sql, latex, bash, ruby, php, go, rust, etc.

**Note:** Requires `\usepackage{listings}` in preamble for language-specific highlighting.

---

### 4. **&bmatrix, &pmatrix, &vmatrix, &Bmatrix, &Vmatrix, &matrix** - Matrices
Creates LaTeX mathematical matrices.

```tex
&bmatrix 3x3
```

Generates:
```latex
\begin{bmatrix}
a_{00} & a_{01} & a_{02} \\
a_{10} & a_{11} & a_{12} \\
a_{20} & a_{21} & a_{22} \\
\end{bmatrix}
```

**All Matrix Types:**
- `&matrix` - Plain matrix (no delimiters) `\begin{matrix}`
- `&bmatrix` - Bracket matrix `\begin{bmatrix}` → `[ ]`
- `&pmatrix` - Parentheses matrix `\begin{pmatrix}` → `( )`
- `&vmatrix` - Vertical bars (determinant) `\begin{vmatrix}` → `| |`
- `&Bmatrix` - Braces matrix `\begin{Bmatrix}` → `{ }`
- `&Vmatrix` - Double bars `\begin{Vmatrix}` → `|| ||`

**Syntax:**
- `&matrix 2x3` - Creates 2×3 matrix
- `&bmatrix 4x2` - Creates 4×2 bracket matrix

**Note:** Requires `\usepackage{amsmath}` in preamble.

---

### 5. **&figure** - LaTeX Figures (NEW)
Creates LaTeX figure environments with image inclusion.

```tex
&figure graph.png
```

Generates:
```latex
\begin{figure}[h]
  \centering
  \includegraphics[width=0.8\textwidth]{graph.png}
  \caption{Figure caption here}
  \label{fig:label}
\end{figure}
```

**Syntax:**
- `&figure` - Creates figure with default filename `image.png`
- `&figure diagram.pdf` - Creates figure with specified filename
- `&figure path/to/image.jpg` - Supports paths

**Features:**
- Centered by default
- Scales to 80% of text width
- Auto-generated caption placeholder
- Auto-generated label reference
- Supports any image format (`.png`, `.jpg`, `.pdf`, etc.)

---

## LaTeX Preamble Requirements

To use all features, include these in your LaTeX preamble:

```latex
\documentclass{article}

% For matrices
\usepackage{amsmath}

% For advanced code listings (optional but recommended)
\usepackage{listings}
\usepackage{xcolor}

% For graphics/figures
\usepackage{graphicx}

\begin{document}
% ... your document
\end{document}
```

---

## Complete LaTeX Example

```latex
\documentclass{article}
\usepackage{amsmath}
\usepackage{listings}
\usepackage{graphicx}

\begin{document}

\section{Matrices}

The coefficient matrix:
&bmatrix 3x3

The solution vector:
&matrix 3x1

\section{Code Examples}

Python implementation:
&code python

LaTeX command reference:
&code latex

\section{Mathematical Content}

The quadratic formula:
&math ax^2 + bx + c = 0

\section{Figures}

System diagram:
&figure system-diagram.png

Data plot:
&figure results.pdf

\section{Tables}

Experimental results:
&table 4x5

\end{document}
```

---

## Usage Workflow

### Step 1: Type the Command
Position cursor in your `.tex` file and type:
```
&table 3x3
```

### Step 2: Press Enter
The inline command is detected and executed automatically.

### Step 3: Edit Content
The generated LaTeX structure appears. Edit as needed:
- Replace placeholder text
- Adjust dimensions
- Add content

---

## Comparison: Markdown vs LaTeX Commands

| Command | Markdown Output | LaTeX Output |
|---------|-----------------|--------------|
| `&table 2x2` | Markdown table with `\|` pipes | `\begin{tabular}...\end{tabular}` |
| `&code python` | ` ```python` fenced code | `\begin{lstlisting}[language=python]` |
| `&math` | `$$...$$` (works as-is) | `$$...$$` (identical) |
| `&bmatrix 2x2` | LaTeX matrix | LaTeX matrix (identical) |
| `&figure img.png` | `![caption](img.png)` | `\begin{figure}...\includegraphics...` |

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Execute inline command | **Enter** (after typing command) |
| Cancel (in chat) | **Escape** |
| Undo | **Cmd+Z** (Mac) / **Ctrl+Z** (Windows) |

---

## Status Bar Feedback

When you position the cursor on a command line, the status bar shows:

```
"Bracket Matrix (3x3) - Creates a mathematical matrix with square brackets..."
```

This helps confirm you're using the correct syntax.

---

## Tips & Tricks

### 1. **Quick Matrix Creation**
Use `&matrix` shorthand for frequent matrix insertions:
```tex
&matrix 2x2
```

### 2. **Preset Table Dimensions**
Keep common sizes handy:
- `&table 3x3` - Small data tables
- `&table 4x5` - Typical results tables
- `&table 5x7` - Larger datasets

### 3. **Code Highlighting**
Use language names for automatic syntax highlighting:
```tex
&code python       # Python highlighting
&code c++          # C++ highlighting  
&code latex        # LaTeX highlighting
```

### 4. **Figure References**
Always set meaningful labels:
```tex
\label{fig:my-diagram}
% Later reference as \ref{fig:my-diagram}
```

### 5. **Table Customization**
Edit the generated `\begin{tabular}{|c|c|c|}` to adjust:
- Column alignment: `l` (left), `c` (center), `r` (right)
- Cell borders: add `|` for vertical lines
- Row separators: use `\hline` between rows

---

## Troubleshooting

### Command not executing?
- Make sure file has `.tex` extension
- Check that cursor is on the `&command` line
- Press Enter to execute

### Wrong output format?
- Verify you're in a `.tex` file (not `.md`)
- Check status bar shows LaTeX format
- Commands are case-sensitive (use lowercase)

### Missing LaTeX packages?
Add required packages to preamble:
```latex
\usepackage{amsmath}     % For matrices
\usepackage{listings}    % For code
\usepackage{graphicx}    % For figures
```

### Image not found?
- Use correct relative/absolute path
- Ensure file exists in specified location
- Supported formats: `.png`, `.jpg`, `.pdf`, `.eps`

---

## File Type Behavior

- **LaTeX files (`.tex`)** → Generates LaTeX commands
- **Markdown files (`.md`)** → Generates Markdown syntax
- **Other types** → Inline commands not available

This smart detection ensures commands adapt to your document format.

---

## Examples by Use Case

### Academic Paper
```tex
&table 4x5              # Results table
&figure methodology.png # Methods diagram
&bmatrix 3x3            # Covariance matrix
&math \sigma^2 = \frac{1}{n}  # Statistical formula
```

### Technical Documentation
```tex
&code python            # API examples
&figure architecture.pdf # System diagram
&table 3x4              # API parameters
```

### Research Notes
```tex
&bmatrix 2x2            # Quick calculations
&math E = mc^2          # Key equations
&figure observation.png # Experimental setup
```

---

**Version:** 2.0  
**Date:** October 25, 2025  
**Status:** Complete and Tested

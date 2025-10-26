# Quick Reference: Using Inline Commands in LaTeX Files

## 🎯 Quick Start

Open a `.tex` file and type an inline command, then press **Enter**:

```tex
&table 3x3
&bmatrix 2x2
&math
```

The command will be executed and replaced with the appropriate content.

---

## 📋 All Available Commands

### Tables
```
&table 3x4              → Creates a 3 rows × 4 columns table
&table 2x2 =x           → Creates a 2×2 table filled with 'x'
```

### Code Blocks
```
&code python            → Python code block
&code javascript        → JavaScript code block
&code latex             → LaTeX code block
```

### Math
```
&math                   → LaTeX math block ($$...$$)
```

### Matrices
```
&matrix 2x3             → Plain matrix (no delimiters)
&bmatrix 3x3            → Bracket matrix [...]
&pmatrix 2x2            → Parentheses matrix (...)
&vmatrix 3x3            → Vertical bars |...|
&Bmatrix 2x2            → Curly braces {...}
&Vmatrix 3x3            → Double vertical ||...||
```

### Other
```
&quote Author           → Blockquote with author attribution
&checklist              → Checklist with 3 items (default)
&checklist 5            → Checklist with 5 items
```

---

## 💡 Examples in LaTeX

### Example 1: Creating a Coefficient Matrix
```tex
\documentclass{article}
\usepackage{amsmath}
\begin{document}

\section{System of Equations}
Coefficient matrix:
&bmatrix 3x3

\end{document}
```

After pressing Enter, the `&bmatrix 3x3` line becomes:
```tex
\begin{bmatrix}
a_{00} & a_{01} & a_{02} \\
a_{10} & a_{11} & a_{12} \\
a_{20} & a_{21} & a_{22} \\
\end{bmatrix}
```

### Example 2: Inserting Math
```tex
&math
```

Becomes:
```tex
$$
\text{math here}
$$
```

### Example 3: Creating a Table
```tex
&table 2x3
```

Becomes:
```tex
| Col 1 | Col 2 | Col 3 |
|-------|-------|-------|
|       |       |       |
|       |       |       |
```

---

## 🎨 Visual Feedback

When you position your cursor on a line with an inline command, you'll see a **status bar explanation** at the bottom:

> "Bracket Matrix (3x3) - Creates a mathematical matrix with square brackets. Example: &bmatrix 3x3"

---

## ✅ What Works

✅ Type an inline command in a `.tex` file  
✅ Press Enter to execute  
✅ Use via the inline chat interface  
✅ Command explanations appear in status bar  
✅ All matrix types work seamlessly  
✅ Code blocks with language syntax highlighting  

---

## ❌ What Doesn't Work

❌ Inline commands only work in **Markdown** and **LaTeX** files  
❌ HTML, PDF, and image files don't support inline commands  
❌ Commands must be on their own line  
❌ After the command is executed, you must manually delete the command line if needed

---

## 🔄 Chat Interface Usage

If the app has a chat interface:

1. Open a LaTeX file
2. Open the inline chat
3. Type: `&bmatrix 3x3`
4. The command executes at your current cursor position

---

## 💾 Saving

After using an inline command, your changes are automatically saved when:
- You move away from the file
- The autosave timer triggers
- You manually save (Cmd+S / Ctrl+S)

---

## 📞 Need Help?

- **Command not working?** Make sure you're in a `.tex` file (not `.md`)
- **Status bar not showing?** Move your cursor to the line with the `&command`
- **Command generated wrong format?** Check the explanations in the status bar for correct syntax

---

**Tip:** Inline commands are super powerful for quickly inserting repetitive structures. Combine them with your editor's autocomplete for even faster workflows!

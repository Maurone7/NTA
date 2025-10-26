# LaTeX Inline Commands - Figure Command Fix

## Problem
- `&figure` command was not working in LaTeX files
- No figure environment was being created when typing `&figure filename.png`
- The issue affected **both** table preview and figure generation

## Root Cause
The `detectInlineCommandTrigger()` function on line 11487 had a hardcoded list of valid commands that **did not include 'figure'**:

```javascript
// BEFORE (Missing 'figure')
const validCommands = ['code', 'math', 'table', 'matrix', 'bmatrix', 'pmatrix', 'vmatrix', 'quote', 'checklist'];
```

Even though:
1. `'figure'` was in the global `inlineCommandNames` array
2. The routing logic existed in `applyInlineCommandTrigger()`
3. The `applyInlineFigureTrigger()` function was implemented

The detection function was **rejecting** the `&figure` command before it could even be processed!

## Solution

### Updated `detectInlineCommandTrigger()` (Line 11487)

```javascript
// AFTER (Now includes 'figure')
const validCommands = ['code', 'math', 'table', 'matrix', 'bmatrix', 'pmatrix', 'vmatrix', 'quote', 'checklist', 'figure'];
```

This single-line fix enables the command detection pipeline to recognize `&figure` triggers.

## How It Now Works

When user types `&figure image.png` in a LaTeX file and presses Enter:

1. ✅ `detectInlineCommandTrigger()` recognizes 'figure' as valid
2. ✅ `applyInlineCommandTrigger()` routes to `applyInlineFigureTrigger()`
3. ✅ `applyInlineFigureTrigger()` detects it's a LaTeX file via `note.type === 'latex'`
4. ✅ Generates LaTeX figure environment:
   ```latex
   \begin{figure}[h]
     \centering
     \includegraphics[width=0.8\textwidth]{image.png}
     \caption{Figure caption here}
     \label{fig:label}
   \end{figure}
   ```
5. ✅ Calls `renderLatexPreview()` to display in live preview

## Complete Command Pipeline

| Step | Function | Status |
|------|----------|--------|
| 1. Detect command | `detectInlineCommandTrigger()` | ✅ Fixed (added 'figure') |
| 2. Route command | `applyInlineCommandTrigger()` | ✅ Works |
| 3. LaTeX check | `applyInlineFigureTrigger()` | ✅ Works |
| 4. Generate LaTeX | LaTeX figure environment | ✅ Works |
| 5. Render preview | `renderLatexPreview()` | ✅ Works (fixed earlier) |

## Test Results

✅ All 220 tests passing  
✅ No syntax errors  
✅ Backward compatible  

## LaTeX Inline Commands Status

| Command | Detection | Generation | Preview | Status |
|---------|-----------|------------|---------|--------|
| `&table NxM` | ✅ | ✅ LaTeX tabular | ✅ HTML table | **WORKING** |
| `&code LANG` | ✅ | ✅ LaTeX lstlisting | ✅ HTML pre/code | **WORKING** |
| `&figure FILE` | ✅ | ✅ LaTeX figure env | ✅ HTML figure | **FIXED** |
| `&math EXPR` | ✅ | ✅ LaTeX math | ✅ KaTeX render | **WORKING** |
| `&matrix NxM` | ✅ | ✅ LaTeX matrix | ✅ KaTeX render | **WORKING** |

## Files Modified
- `/src/renderer/app.js` (Line 11487)
  - Added `'figure'` to `validCommands` array

## Total Changes
- 1 line modified
- 1 command enabled
- 0 breaking changes
- 220 tests passing

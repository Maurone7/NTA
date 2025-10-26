# LaTeX Table Rendering and Replacement Fixes

## Issues Fixed

### Issue 1: Table Content Not Shown in Right Cells
**Problem**: When rendering LaTeX tabular environments to HTML, cell content was not properly placed in the correct cells due to naive line-by-line conversion.

**Root Cause**: The old implementation processed tables line-by-line, converting:
- `&` to `</td><td>` 
- `\\` to `</tr><tr>`

This approach didn't properly handle the full table structure and resulted in malformed HTML with missing opening/closing tags.

**Solution**: Implemented proper block-level table processing:
1. Detect entire `\begin{tabular}...\end{tabular}` blocks using regex
2. Extract table content between delimiters
3. Split by row separator (`\\`) to get rows
4. For each row, split by cell separator (`&`) to get cells
5. Generate proper HTML structure: `<table><tr><td>content</td></tr></table>`

### Issue 2: Changing Table Dimensions Creates New Table Instead of Replacing
**Problem**: When editing a LaTeX file and changing the `&table` command dimensions (e.g., `&table 3x4` to `&table 4x5`), a new table was inserted instead of replacing the existing one.

**Root Cause**: The inline table trigger for LaTeX had no logic to detect and remove existing tables, unlike the Markdown version which had `stripExistingTableAfterCommand`.

**Solution**: Created `stripExistingLatexTableAfterCommand` function that:
1. Detects `\begin{tabular}` immediately after the `&table` command
2. Finds the matching `\end{tabular}` closing tag
3. Removes the entire existing table block
4. Inserts the new table in its place
5. Preserves content after the table

## Code Changes

### 1. Enhanced `processLatexContent()` Function

**Location**: `/src/renderer/app.js` (line ~8068)

**Before**: Line-by-line processing with naive string replacements
```javascript
if (processedLine.includes('\\begin{tabular}')) {
  processedLine = processedLine.replace(/\\begin\{tabular\}.../, '<table>');
}
// ... naive cell/row conversion...
```

**After**: Block-level table processing with proper HTML structure
```javascript
const tabularRegex = /\\begin\{tabular\}[^}]*\}([\s\S]*?)\\end\{tabular\}/g;
let processedContent = latexContent.replace(tabularRegex, (match) => {
  const contentMatch = match.match(/\}([\s\S]*?)\\end\{tabular\}/);
  const tableContent = contentMatch[1];
  
  // Split by rows, then by cells
  const rows = tableContent.split(/\s*\\\\\s*/).filter(r => r.trim() && !r.includes('\\hline'));
  const htmlRows = rows.map(row => {
    const cells = row.split(/\s*&\s*/).map(cell => 
      `<td style="padding: 8px; border: 1px solid #ccc; text-align: left;">${cell.trim()}</td>`
    );
    return `<tr>${cells.join('')}</tr>`;
  });
  
  return `<table border="1" style="border-collapse: collapse; border: 1px solid #ccc; width: 100%;">${htmlRows.join('')}</table>`;
});
```

**Result**: 
- ✅ Proper HTML table structure with correct rows and cells
- ✅ Content now appears in the correct cells
- ✅ Tables are properly styled with borders and padding

### 2. New `stripExistingLatexTableAfterCommand()` Function

**Location**: `/src/renderer/app.js` (before `applyInlineTableTrigger`, line ~12555)

**Purpose**: Detects and removes existing LaTeX tables to enable table replacement

```javascript
const stripExistingLatexTableAfterCommand = (input) => {
  // Skip leading newline
  let newlineLength = 0;
  if (input.startsWith('\r\n')) {
    newlineLength = 2;
  } else if (input.startsWith('\n')) {
    newlineLength = 1;
  }

  // Look for \begin{tabular}...\end{tabular}
  const tabularStart = input.indexOf('\\begin{tabular}');
  if (tabularStart === -1 || tabularStart > newlineLength) {
    return {
      remainder: input,
      removedLeadingNewline: newlineLength > 0,
      removed: false,
      existingContent: null
    };
  }

  const tabularEnd = input.indexOf('\\end{tabular}');
  if (tabularEnd === -1) {
    return { /* malformed */ };
  }

  // Extract and return existing table + remainder
  const existingContent = input.slice(newlineLength, tabularEnd + '\\end{tabular}'.length);
  let remainder = input.slice(tabularEnd + '\\end{tabular}'.length);
  
  // Skip trailing newline
  if (remainder.startsWith('\r\n')) {
    remainder = remainder.slice(2);
  } else if (remainder.startsWith('\n')) {
    remainder = remainder.slice(1);
  }

  return {
    remainder: remainder,
    removedLeadingNewline: newlineLength > 0,
    removed: true,
    existingContent: existingContent
  };
};
```

### 3. Modified `applyInlineTableTrigger()` for LaTeX

**Location**: `/src/renderer/app.js` (line ~12620)

**Change**: Use the new function to strip existing tables before inserting new one

```javascript
if (isLatex) {
  // Check if there's an existing LaTeX table to replace
  const { remainder: afterCommand, existingContent } = stripExistingLatexTableAfterCommand(originalAfterCommand);
  
  // ... create new table ...
  
  // Use 'afterCommand' (remainder) instead of 'originalAfterCommand'
  const nextContent = `${beforeCommand}${snippet}${afterCommand}`;
}
```

**Result**:
- ✅ Existing table is properly detected and removed
- ✅ New table replaces the old one instead of creating a duplicate
- ✅ Content after the table is preserved

## Tests Added

Added 1 new test to `/tests/unit/latexBehavior.spec.js`:

**"should replace existing LaTeX tables when updating dimensions"**
- Verifies `stripExistingLatexTableAfterCommand` function exists
- Checks for proper tabular block detection
- Validates end position calculation

## Test Results

- **Before**: 228 tests passing
- **After**: 229 tests passing (1 new test added)
- **Status**: ✅ All tests pass, no failures

## Impact

### User Experience
- ✅ **Correct cell display**: Table content now appears in the correct cells
- ✅ **Table updates**: Changing `&table` dimensions now replaces the table instead of creating duplicates
- ✅ **Proper formatting**: Tables are styled with visible borders and padding

### Code Quality
- ✅ **Proper HTML structure**: Generated HTML is semantically correct
- ✅ **Block-level processing**: Tables are processed as complete units, not line-by-line
- ✅ **Consistency**: LaTeX table behavior matches Markdown (tables are replaceable)

## Files Modified

1. `/src/renderer/app.js`:
   - Rewrote `processLatexContent()` table handling (lines 8068-8254)
   - Added `stripExistingLatexTableAfterCommand()` function (lines 12555-12612)
   - Modified `applyInlineTableTrigger()` to use new function (lines 12625-12655)

2. `/tests/unit/latexBehavior.spec.js`:
   - Updated existing table test
   - Added new table replacement test

## Related Features

This fix complements the earlier LaTeX support improvements:
- Real-time preview updates (no debounce delay)
- Inline command support (`&table`, `&figure`, etc.)
- Math environment preservation
- Figure handling with captions

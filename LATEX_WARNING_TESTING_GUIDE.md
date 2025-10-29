# LaTeX Warning System - Testing Guide

## Quick Test Steps

### Test 1: Warning Banner Appears When LaTeX Not Installed
**Prerequisites**: LaTeX not installed on system (or temporarily uninstall for testing)

1. Start the app
2. Open workspace with `.tex` files (e.g., test-folder/sample-latex.tex)
3. Click on a `.tex` file
4. **Expected**: Yellow/amber warning banner appears at top of preview pane with:
   - ⚠️ Icon
   - "LaTeX is not installed" message
   - "Install LaTeX" button (orange)

### Test 2: Warning Disappears in HTML Mode
1. With warning visible, click the Render Mode dropdown
2. Select "HTML (KaTeX math)"
3. **Expected**: Warning banner disappears, content renders with KaTeX math

### Test 3: Warning Reappears in Auto/PDF Mode
1. With warning hidden in HTML mode, click Render Mode dropdown
2. Select "Auto (PDF if available)" or "PDF (LaTeX compiled)"
3. **Expected**: Warning banner reappears

### Test 4: Warning Hides When Switching to Non-LaTeX File
1. With warning visible, click on a non-LaTeX file (e.g., `.md` file)
2. **Expected**: Warning banner immediately hides

### Test 5: Warning Shows Again on Non-LaTeX → LaTeX Switch
1. With warning hidden from non-LaTeX file, click back on `.tex` file
2. **Expected**: Warning banner reappears

### Test 6: Install Button Functionality
1. With warning visible, click "Install LaTeX" button
2. **Expected**:
   - Button changes to "Opening installer..."
   - Button becomes disabled
   - System installer window/terminal opens (platform-specific)
   - Status message appears at bottom: "LaTeX installation started..."

**macOS Behavior**: 
- If Homebrew not installed: Script shows installation instructions
- If Homebrew installed: Starts `brew install mactex-no-gui` in terminal

**Linux Behavior**:
- Shows appropriate apt/dnf commands in terminal

**Windows Behavior**:
- Opens link to MiKTeX download page

### Test 7: No Warning When LaTeX Installed
1. Ensure LaTeX is installed on system (`pdflatex --version` works in terminal)
2. Start app
3. Open a `.tex` file
4. **Expected**: NO warning banner appears
5. **Expected**: PDF compiles and displays correctly

### Test 8: PDF Mode Prevention
1. With LaTeX not installed, Render Mode set to "PDF (LaTeX compiled)"
2. Open a `.tex` file
3. **Expected**:
   - Warning shows
   - Preview DOES NOT show "Compiling LaTeX..." message
   - Preview stays empty or shows HTML fallback (not infinite loading)

### Test 9: Render Mode Dropdown with Warning
1. With warning visible, verify dropdown selector is also visible
2. **Expected**: Both warning banner and render mode dropdown visible
3. Both should be functional and not overlap

### Test 10: Visual Integration
1. Check banner appearance:
   - **Colors**: Yellow/amber background (#fff3cd), orange button (#ff9800)
   - **Typography**: Clear readable text
   - **Button**: Properly styled with hover effect
   - **Icon**: Clearly visible warning icon
   - **Layout**: Content well-aligned and not crowded

## Troubleshooting

### Warning Always Shows
- Check if LaTeX is truly installed: `pdflatex --version`
- Restart app (state.latexInstalled is cached)
- Check browser console for errors

### Warning Never Shows
- Verify LaTeX is actually NOT installed
- Open DevTools (Cmd+Opt+I) and check console for errors
- Check that checkLatexInstalled IPC handler is working

### Button Doesn't Work
- Check DevTools console for "Failed to trigger LaTeX installation" errors
- Verify safeApi.invoke() is available
- Check that app:installLatex IPC handler exists in main.js

### Banner Styling Broken
- Check if CSS file was properly updated
- Verify element IDs match in HTML (latex-warning-banner, latex-install-button)
- Clear app cache if needed

## Expected Files for Testing

LaTeX test files located at:
- `/Users/mauro/Desktop/NoteTakingApp/test-folder/sample-latex.tex`
- `/Users/mauro/Desktop/NoteTakingApp/test-folder/test-figure.tex`
- `/Users/mauro/Desktop/NoteTakingApp/documentation/examples/example.tex`

## Performance Notes

- First LaTeX check takes ~10-50ms (checks system PATH and common locations)
- Result cached for entire app session
- Subsequent renders don't re-check (instant)
- Warning banner rendering is minimal overhead
- No noticeable impact on app responsiveness

## Debug Info

To check LaTeX status from DevTools console:
```javascript
// Check if LaTeX is installed
window.api.checkLatexInstalled().then(status => console.log('LaTeX Status:', status));

// Check app state
console.log('Cached LaTeX Status:', window.state?.latexInstalled);
console.log('Render Mode:', window.state?.latexRenderMode);
```

## Success Criteria

✅ Warning appears when LaTeX not installed and Auto/PDF mode active
✅ Warning disappears in HTML mode or for non-LaTeX files
✅ Install button triggers installer without blocking app
✅ Visual design integrates well with app theme
✅ No errors in console
✅ No performance degradation
✅ Both dropdown and warning visible together

# Testing Guide for NoteTakingApp

This guide provides comprehensive testing procedures for new features and bug fixes in NoteTakingApp. Follow these checklists to ensure quality and prevent regressions.

## 🧪 Testing Overview

### Test Categories
- **Unit Tests**: Automated tests for individual functions and components
- **Integration Tests**: Tests for component interactions and file operations
- **UI/UX Tests**: Manual testing of user interface and user experience
- **File Type Tests**: Testing support for different file formats
- **Performance Tests**: Testing app responsiveness and resource usage

## 📋 Pre-Release Testing Checklist

### 🔧 Setup & Environment
- [ ] Test on all supported platforms (macOS, Windows, Linux)
- [ ] Test with different screen resolutions and DPI settings
- [ ] Test with system theme changes (light/dark mode)
- [ ] Test with different font sizes and accessibility settings
- [ ] Verify app launches without errors
- [ ] Check for console errors in developer tools

### 📁 File Operations
- [ ] **Markdown Files (.md)**
  - [ ] Create new markdown files
  - [ ] Open existing markdown files
  - [ ] Edit and save changes
  - [ ] Live preview updates correctly
  - [ ] Wiki links (`[[Note Name]]`) work
  - [ ] Hashtags (`#tag`) are indexed
  - [ ] Math expressions render (KaTeX)
  - [ ] Tables and code blocks display properly

- [ ] **Code Files (.py, .js, .html, .css, .txt, .aux, .log, .sh, .fdb_latexmk, .out, .synctex.gz, .toc, etc.)**
  - [ ] File appears in workspace tree
  - [ ] Content displays in editor (read-only)
  - [ ] Syntax highlighting in preview
  - [ ] Language detection is correct
  - [ ] Large files (>5MB) show appropriate warning

- [ ] **HTML Files (.html, .htm)**
  - [ ] File appears in workspace tree
  - [ ] Content displays in editor (read-only)
  - [ ] HTML renders in preview iframe
  - [ ] External resources load (if allowed)
  - [ ] Links and scripts work appropriately

- [ ] **Jupyter Notebooks (.ipynb)**
  - [ ] File appears in workspace tree
  - [ ] Content displays in editor (read-only)
  - [ ] Notebook cells render correctly
  - [ ] Markdown cells show formatted text
  - [ ] Code cells show syntax highlighting
  - [ ] Output cells display results
  - [ ] Math expressions render

- [ ] **PDF Files**
  - [ ] File appears in workspace tree
  - [ ] PDF viewer loads document
  - [ ] Navigation works (page up/down, zoom)
  - [ ] Search functionality works
  - [ ] Large PDFs (>100MB) show warning

- [ ] **PPTX Files**
  - [ ] File appears in workspace tree
  - [ ] File can be opened (shows placeholder message)
  - [ ] Content displays in editor (read-only)

- [ ] **Image Files (.png, .jpg, .gif, .svg, etc.)**
  - [ ] File appears in workspace tree
  - [ ] Image displays in viewer
  - [ ] Zoom and pan work
  - [ ] Large images (>10MB) show warning

- [ ] **Video Files (.mp4, .webm, .avi, etc.)**
  - [ ] File appears in workspace tree
  - [ ] Video player loads
  - [ ] Playback controls work
  - [ ] Large videos (>100MB) show warning

- [ ] **LaTeX Files (.tex)**
  - [ ] File appears in workspace tree
  - [ ] Content displays in editor
  - [ ] LaTeX renders in preview
  - [ ] Math expressions display correctly

- [ ] **Bibliography Files (.bib)**
  - [ ] File appears in workspace tree
  - [ ] Citations can be inserted
  - [ ] BibTeX parsing works

### 🎨 UI Components
- [ ] **Settings Modal**
  - [ ] All tabs load (Appearance, Accessibility, Layout, Export, Advanced)
  - [ ] Theme changes apply immediately
  - [ ] Font changes update live
  - [ ] Color pickers work
  - [ ] Reset buttons function correctly
  - [ ] Settings persist across restarts

- [ ] **Keybindings**
  - [ ] Custom keybindings can be added
  - [ ] Key combinations are captured correctly
  - [ ] Actions trigger on keypress
  - [ ] Keybindings persist
  - [ ] Reset to defaults works

- [ ] **Preview Pane**
  - [ ] Toggle preview on/off works
  - [ ] Preview state persists
  - [ ] Splitter resizing works
  - [ ] Content updates live for markdown

- [ ] **Editor**
  - [ ] Text input works
  - [ ] Undo/redo functions
  - [ ] Search within note works
  - [ ] Spellcheck (if enabled)
  - [ ] Auto-save works

- [ ] **Workspace Tree**
  - [ ] Folder navigation works
  - [ ] File selection works
  - [ ] Expand/collapse folders
  - [ ] Context menu options work

- [ ] **Hashtags**
  - [ ] Hashtag panel shows
  - [ ] Clicking hashtags filters notes
  - [ ] Hashtag indexing works

### 🔍 Search & Navigation
- [ ] **Full-text Search**
  - [ ] Search across all notes
  - [ ] Results highlight correctly
  - [ ] Navigation between results works

- [ ] **Wiki Links**
  - [ ] Link creation works
  - [ ] Link following works
  - [ ] Auto-completion suggests notes

- [ ] **Block References**
  - [ ] Block IDs are generated
  - [ ] References work within notes

### 📤 Export Features
- [ ] **PDF Export**
  - [ ] Export generates PDF
  - [ ] Formatting is preserved
  - [ ] Math renders correctly

- [ ] **HTML Export**
  - [ ] Export generates HTML
  - [ ] Styles are included
  - [ ] Links work

- [ ] **Other Formats** (DOCX, EPUB)
  - [ ] Export completes without errors
  - [ ] Output is valid

### ⚙️ Settings & Persistence
- [ ] **Settings Storage**
  - [ ] All settings save correctly
  - [ ] Settings load on restart
  - [ ] Invalid settings are handled gracefully

- [ ] **Auto-save**
  - [ ] Changes save automatically
  - [ ] Save indicator shows correct status
  - [ ] Manual save works

### 🚨 Error Handling
- [ ] **File Operations**
  - [ ] Missing files show appropriate errors
  - [ ] Permission errors are handled
  - [ ] Corrupt files show warnings

- [ ] **Network Operations**
  - [ ] Offline functionality works
  - [ ] Network errors are handled gracefully

- [ ] **Memory/Performance**
  - [ ] Large files don't crash the app
  - [ ] Memory usage stays reasonable
  - [ ] App remains responsive

## 🧪 Automated Testing

### Running Tests
```bash
# Run all tests
npm test

# Run smoke tests
node scripts/smoke-test.js

# Run specific test suites
npm run test:unit
npm run test:integration
```

### Test Files
- `scripts/smoke-test.js`: Basic functionality tests
- `tests/`: Unit and integration tests
- `test-folder/`: Sample files for manual testing

## 🐛 Bug Reporting

When reporting bugs, include:
- [ ] Steps to reproduce
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Platform and app version
- [ ] Console errors (if any)
- [ ] Sample files that trigger the issue

## 🚀 Feature Testing

For new features, test:
- [ ] Feature works as designed
- [ ] UI is intuitive
- [ ] Performance impact is minimal
- [ ] Backwards compatibility maintained
- [ ] Documentation is updated
- [ ] Tests are added

## 📊 Performance Benchmarks

- [ ] App startup time < 3 seconds
- [ ] File loading < 1 second for typical files
- [ ] Search results < 500ms
- [ ] Memory usage < 200MB for normal usage
- [ ] No memory leaks over extended use

## 🔄 Regression Testing

After any changes, verify:
- [ ] All existing functionality still works
- [ ] No new console errors
- [ ] Performance hasn't degraded
- [ ] UI layout hasn't broken
- [ ] File operations still work correctly
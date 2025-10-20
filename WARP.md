# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Quick Commands

### Development
- `npm start` - Run the app in development mode
- `npm run dev` - Run with auto-reload (electronmon)
- `npm test` - Run all tests (unit, DOM, smoke)
- `npm run test:smoke` - Run smoke tests only
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:update` - Test update mechanism specifically

### Building & Distribution
- `npm run build` - Build for all platforms
- `npm run build:mac` - Build macOS app (both Intel and Apple Silicon)
- `npm run build:win` - Build Windows app (64-bit and 32-bit)
- `npm run build:linux` - Build Linux AppImage
- `npm run clean:artifacts` - Clean build artifacts

### Testing Specific Components
- `npm run test:e2e-pdf` - Test PDF functionality end-to-end
- Run individual test: `CI=true mocha tests/unit/[test-file].spec.js --reporter spec`
- Run DOM tests: `CI=true mocha tests/dom --reporter spec`

## Architecture Overview

### Main Process Architecture (Electron)
**File:** `src/main.js`

This is the main Electron process that handles:
- File system operations and workspace scanning
- IPC handlers for renderer communication
- PDF file handling and data URI conversion
- Window management and app lifecycle
- Environment variable processing for testing (`NTA_AUTO_TRACE`, `NTA_OPEN_WORKSPACE`)

Key functions:
- `scanDirectory()` - Recursively scans workspace folders and categorizes files
- `getNoteType()` - Determines file type (markdown, pdf, notebook, html, etc.)
- IPC handlers for workspace operations, PDF reading, file management

### Renderer Process Architecture
**Main File:** `src/renderer/app.js`

The renderer is organized into several key modules:

#### Core UI Components
- **Left Sidebar (`src/renderer/left-sidebar.js`)** - Workspace tree, hashtag panel
- **Right Sidebar (`src/renderer/right-sidebar.js`)** - Additional panels and tools
- **Editor UI (`src/renderer/editor-ui.js`)** - Editor interface and controls
- **Tree UI (`src/renderer/tree.js`)** - File tree rendering and interaction

#### Data Management
- **Notes Store (`src/store/notesStore.js`)** - JSON-based note storage with PDF import
- **Folder Manager (`src/store/folderManager.js`)** - Workspace folder operations

#### Key Features
- **Wiki-style linking** with `[[Note Name]]` syntax
- **AutoLink (`src/renderer/autolink.js`)** - Converts plain URLs to clickable links
- **Multi-pane editing** - Side-by-side editor panes with resizable dividers
- **Live preview** with markdown rendering, LaTeX math (KaTeX), syntax highlighting
- **File type support** - Markdown, PDF, Jupyter notebooks, HTML, images, videos, code files

### Application Structure

```
src/
├── main.js                 # Electron main process
├── preload.js             # Electron preload script
├── renderer/              # Frontend code
│   ├── index.html         # Main HTML structure
│   ├── styles.css         # Application styles
│   ├── app.js             # Main renderer logic
│   ├── autolink.js        # URL auto-linking
│   ├── editor-ui.js       # Editor interface
│   ├── left-sidebar.js    # Workspace sidebar
│   ├── right-sidebar.js   # Additional panels
│   └── tree.js            # File tree component
└── store/                 # Data management
    ├── notesStore.js      # Note storage and PDF handling
    └── folderManager.js   # Folder operations
```

### Testing Architecture

Tests are organized by type:
- **`tests/unit/`** - Unit tests for individual functions
- **`tests/dom/`** - DOM manipulation and UI tests
- **`tests/smoke/`** - Basic functionality smoke tests
- **`tests/playwright/`** - End-to-end tests with Playwright
- **`tests/citation/`** - Bibliography and citation tests

### File Type Support

The app supports these file types with specific handlers:
- **Markdown (`.md`)** - Full editor with live preview, wiki links, LaTeX math
- **PDF (`.pdf`)** - Integrated PDF.js viewer with text selection
- **Jupyter Notebooks (`.ipynb`)** - Rendered notebook cells with syntax highlighting
- **HTML (`.html`, `.htm`)** - Sandboxed iframe preview
- **Code files** - Syntax-highlighted read-only view (`.py`, `.js`, `.tex`, etc.)
- **Images** - Built-in image viewer with zoom/pan
- **Videos** - HTML5 video player with controls

### Key Development Patterns

1. **IPC Communication** - Main process handles file system, renderer handles UI
2. **Modular UI** - Separate modules for different UI components
3. **Event-driven** - Heavy use of DOM events and IPC for communication
4. **Progressive Enhancement** - Graceful fallbacks when modules fail to load
5. **Test-driven** - Comprehensive test suite with multiple test types

### Environment Variables for Testing
- `NTA_AUTO_TRACE=1` - Auto-exit after trace generation (for CI)
- `NTA_OPEN_WORKSPACE=/path` - Auto-open workspace on startup
- `NTA_OPEN_FILE=/path/file` - Auto-open specific file
- `NTA_FORCE_QUIT=1` - Force quit on window close (for tests)
- `CI=true` - Enables CI mode for tests

### Development Notes

- The app uses a multi-pane architecture with resizable dividers
- File operations are handled in the main process for security
- Settings are stored using a comprehensive modal system with tabs
- Wiki-linking system supports autocomplete and block references
- Math rendering uses KaTeX with live preview
- Auto-save functionality with visual indicators
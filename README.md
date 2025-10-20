# NTA

[![CI](https://github.com/Maurone7/NoteTakingApp/actions/workflows/ci.yml/badge.svg)](https://github.com/Maurone7/NoteTakingApp/actions/workflows/ci.yml)

A beautiful, cross-platform note-taking app built with Electron. Available for **macOS**, **Windows**, and **Linux**.

## 🍎 macOS Unsigned Builds: How to Open

Installation guide

1) GUI (recommended for non-technical users)

   - In Finder, control‑click (or right‑click) the app icon and choose "Open".
   - A dialog will appear saying the app is from an unidentified developer; click "Open" to run it anyway. macOS will remember this choice for that app copy.

2) Terminal (one-line: remove quarantine attribute)

   - This removes the quarantine flag for the downloaded app copy and allows it to run. Only run this if you trust the release source.

```bash
# after you expand the downloaded DMG/ZIP and have NTA.app in the current folder
xattr -r -d com.apple.quarantine ./NTA.app
open ./NTA.app
```

## 🔄 Stay Updated

NTA checks for updates when you first open the app and notifies you when new versions are available. You can also manually check for updates anytime through the settings (gear icon in bottom status bar).

## 📞 Support

- **Issues or suggestions?** [Open an issue](https://github.com/Maurone7/NTA/issues)
- **Questions?** Check our [documentation](https://github.com/Maurone7/NTA/wiki)

## 📄 License

MIT

---

## ✨ Key Features

- **📝 Markdown-first writing** with live preview and LaTeX math support
- **📊 Smart content tools**: Auto-complete matrices, tables, and equations
- **🔗 Wiki-style linking**: Connect notes with `[[Note Name]]` links
- **📄 Integrated PDF viewer** for research and reference materials
- **📓 Code file support** for Python, JavaScript, LaTeX, shell scripts, and more
- **🖼️ Media support** for images, videos, and presentations
- **🏷️ Hashtag organization** with automatic indexing
- **🔍 Full-text search** across all your notes
- **🎨 Comprehensive customization**: Themes, fonts, colors, and layout options
- **🔄 Smart updates** - checks on startup and manual control

## 🎨 Customization & Themes

Click the **gear icon** in the bottom status bar to access comprehensive customization settings:

### 🌈 Appearance
- **Theme Options**:
  - **System** (default): Automatically follows your macOS appearance settings
  - **Light**: Force light theme regardless of system preference
  - **Dark**: Force dark theme regardless of system preference
- **Custom Background Colors**: Choose any background color that suits your style with smart color variations

### ✍️ Typography
- **Font Family**: Choose from popular fonts, including:
  - System Font (SF Pro) - Native macOS appearance
  - Inter, Roboto, Open Sans, Source Sans Pro - Modern sans-serif options
  - JetBrains Mono, Fira Code, Monaco - Monospace fonts for code-focused work
- **Font Size**: Adjustable from 12px to 20px for optimal readability
- **Text Color**: Customize the main text color with automatic soft color variations

### 🎯 Borders & Layout
- **Border Color**: Customize border colors throughout the app
- **Border Thickness**: Adjust from 1px to 4px for visual emphasis preferences

### 💾 Persistent Customization
- **Live Preview**: See all changes instantly as you customize
- **Auto-Save**: All customization choices are automatically saved
- **Reset Options**: Individual reset buttons for each setting to return to defaults
- **Cross-Session**: Your personalization persists when you restart the app

**🎨 Styling Tips**: Try subtle blues (#f0f4ff), warm grays (#f8f7f5), or soft greens (#f7fdf7) for backgrounds. Pair with Inter or Open Sans fonts for a modern look, or use JetBrains Mono for a developer-focused aesthetic.

## 🚀 Quick Start

### Download Ready-to-Use App

**Just want to start taking notes?** Download the app for your platform:

#### 🍎 For macOS:
- **Apple Silicon Macs (M1, M2, M3, M4)**
- **Intel Macs**

#### 🪟 For Windows:
- **64-bit Windows**
- **32-bit Windows**

#### 🐧 For Linux:
- **Linux AppImage**

### Platform-Specific Installation:

#### 🍎 macOS Installation:
1. **Download** the appropriate DMG file for your Mac (Apple Silicon or Intel)
2. **Open** the downloaded DMG file
3. **Drag** NTA to your Applications folder
4. **Launch** from Applications or Spotlight

#### 🪟 Windows Installation:
1. **Download** the EXE installer for your system (64-bit or 32-bit)
2. **Run** the installer and follow the setup wizard
3. **Choose** installation directory (optional)
4. **Launch** from Start Menu or Desktop shortcut

#### 🐧 Linux Installation:
1. **Download** the AppImage file
2. **Make executable**: `chmod +x NTA-[Version #].AppImage`
3. **Run**: `./NTA-[Version #].AppImage`

**That's it! No additional software needed on any platform.** ✨

## 💡 Getting Started

1. **Open a folder** - Click "Open..." to select a folder with your Markdown files
2. **Create your first note** - Click "New File" to start writing
3. **Link notes together** - Use `[[Note Name]]` to connect ideas
4. **Add hashtags** - Use `#project` or `#idea` to categorize thoughts
5. **Import PDFs** - Drag PDF files into your workspace for reference

## 🔗 Advanced Features

### Wiki-Style Linking
```markdown
Check out my [[Research Notes]] and [[Project Ideas]].

Embed content inline: ![[Important Quote]]

Add content inline: !![[Table]]
```

### LaTeX Math Support
```markdown
Inline math: $E = mc^2$

Block equations: 
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```

### Smart Content Tools
- Type `&matrix 3x3` to generate LaTeX matrices. You can also type `&matrix 3x3 =0` for a 3x3 matrix filled with zeros
- Type `&table 4x6` to create Markdown tables.  You can also type `&table 3x3 =0` for a 3x3 table filled with zeros
- Type `&quote Author` for formatted blockquotes
- Type `&code xxxxx` and replace xxxx with a coding language to create a code block in that coding language

## 🔗 Wiki-Style Linking Explained

NTA supports two types of wiki-style links to connect your notes:

### Embed Links: `[[Note Name]]`
Embeds the actual content of another note inline:
```markdown
Check out my [[Research Notes]] for more details.
See also: [[Project Ideas]] and [[Meeting Notes]]
```
- **Existing notes**: Displays the full content of the linked note
- **Missing notes**: Shows a placeholder to create them
- **Auto-complete**: Start typing `[[` to see suggestions

### Transclusion Links: `![[Note Name]]`
Also embeds content (for compatibility):
```markdown
![[Important Quote]]
```
```markdown
Here's my summary: ![[Key Findings]]

Important reminder: ![[Daily Checklist]]
```
- **Live preview**: Shows the actual note content
- **Always current**: Updates automatically when the source note changes
- **Images too**: Use `![[diagram.png]]` to embed images

**Pro tip**: Use `[[Note|Custom Text]]` to change how the link appears while keeping the same target.

### Hidden Embded Links: `![[Note Name]]`
Embeds the actual content of another note inline, but hides the fact that it's from another file

### PDF Viewing

- **Enhanced PDF.js viewer**: Integrated PDF.js provides professional-grade PDF viewing with full text selection capabilities.
- **Text selection**: Select and copy text from PDFs, including both typed text and properly processed scanned documents.
- **Zoom and navigation**: Use zoom controls, page navigation, and fit-to-width options for optimal reading experience.
- **Modern interface**: Clean, responsive PDF viewer with toolbar controls for zoom, page navigation, and viewing options.
- **Seamless integration**: PDFs open within the app workspace alongside your Markdown notes for efficient reference and note-taking.

### File Management

- **Context menus**: Right-click any file in the sidebar for options:
  - **Cut/Copy/Paste**: Move or duplicate files within the workspace
  - **Rename**: Edit filename directly with conflict detection
  - **Reveal in Finder**: Open file location in macOS Finder
  - **Delete**: Move file to Trash with confirmation
- **Drag to resize sidebar**: Adjust workspace width (200px-500px) by dragging the handle between sidebar and main content—your preference is automatically saved.

### General Usage

- **Access app settings**: Click the gear icon in the bottom status bar to customize themes, colors, and check for updates manually
- **Open inline chat**: Press ⌘I to open the inline chat interface (functionality to be added later).
- **Highlight text**: Select text in the editor and press ⌘H to add/remove highlighting (uses `==text==` syntax).
- **Create a new note** with ⌘N or the **New File** button beside **Open…** in the workspace header.
- **Rename a workspace note** by double-clicking the filename above the editor (or pressing Enter/F2 when it’s focused); every `[[Note Name]]` style link is updated automatically.
- **Insert fenced code blocks** with ⌘⇧C (or the Code Block button) while editing Markdown.
- The editor drops a fenced block with a highlighted placeholder—start typing to replace it immediately.
- **Search within the current note** with ⌘F; the compact search bar shows total matches and you can cycle through them with ⌘G/⇧⌘G or the on-screen arrows.
- **Create block labels** by ending a paragraph, equation, or list item with `^your-label`. Link to it with `[[Note Title#^your-label]]` (or `[[#^your-label]]` for the current note) and embed it inline with `![[Note Title#^your-label]]`.
- **Give labels a readable title** by adding quoted text: `^derivation "Energy balance"` shows that title everywhere the block is linked or embedded.
- **Rename link text on the fly** with alias syntax: `[[My Note|Custom title]]` keeps the link target intact while changing the label you see.
- **Trigger the wiki-link autocomplete** by typing `[[`—use the arrow keys to pick a note or labelled block, then press Enter or Tab to insert it.
- **Toggle PDF view** by importing a PDF from the toolbar; it appears as its own entry in the note list with full text selection, zoom controls, and professional navigation features powered by PDF.js.
- **Open an existing folder** with Markdown, PDF, code, and media files via the **Open Folder** button; supported files are editable or viewable inline.
- **Use the workspace explorer** on the left to drill into sub-folders and click files to open them instantly.
- **Create wiki links** by wrapping note titles in double brackets (e.g. `[[Daily Log]]`); existing notes open immediately, missing ones prompt you to create them. Add an exclamation mark (`![[Daily Log]]`) to embed the note inside the current page or use `![[diagram.png]]` to display images inline.
- **Insert code blocks** with the toolbar button or ⌘⇧C — a quick picker lets you choose a language and remembers the last one you used (hold ⌥ while pressing ⌘⇧C to reuse it instantly).
- **Type inline commands** on their own line (`&code python`, `&math`, `&table 3x4`, etc.) and press Enter to expand them into rich snippets with focused placeholders instantly.
    - Pair `&code` with a language (`&code js`) to prefill the block, then edit the command and press Enter again to change the language; the helper line stays in the editor but is hidden in the preview and exported PDFs.
    - Use `&table ROWSxCOLS` (e.g. `&table 3x4`) to drop a Markdown table scaffold, then tweak the command and press Enter again to resize—existing content is preserved when expanding or shrinking.
    - Use matrix commands like `&bmatrix 3x3`, `&pmatrix 2x4`, `&vmatrix 3x3` to generate LaTeX matrices with automatic `$$` wrapping. Change dimensions and existing content is preserved.
    - Use `&quote` or `&quote Author` to create formatted blockquotes with optional author attribution.
- **LaTeX auto-completion**: type `\begin{bmatrix}` (or any LaTeX environment) and it automatically adds the closing `\end{bmatrix}` wrapped in `$$` delimiters.
- **File operations**: right-click any file in the sidebar for a context menu with cut, copy, paste, rename, reveal in Finder, and delete options. Cut files can be pasted elsewhere in the workspace.
- **Resize the sidebar**: drag the thin handle between the sidebar and main content to adjust the workspace width (your preference is automatically saved).
- **Resize the panes** by dragging the vertical divider (or focus it and use the arrow keys for keyboard control).
- **Collect related ideas** by dropping `#hashtags` anywhere in your Markdown; the sidebar’s Hashtags panel groups them so you can focus on every matching note at once (use Clear to reset the filter).
- **Auto-save** You can set the app to autosave every specified amount of time, or turn it off and save it only when you want to

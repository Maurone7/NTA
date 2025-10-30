const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');
const pty = require('node-pty');

// Folder manager provides filesystem helpers used by renderer IPC handlers
const folderManager = require('./store/folderManager');
// LaTeX compiler for PDF export
const { checkLatexInstalled, compileLatexToPdf, getLatexInstallationStatus } = require('./latex-compiler');
// LaTeX installer helper
const { attemptAutoInstall } = require('./latex-installer');

// PTY sessions for terminals - one per window
const ptyProcesses = new Map();
const windowSessions = new Map();  // Map windowId to BrowserWindow

function getPtyProcess(windowId, browserWindow, requestedCwd = null) {
  if (!ptyProcesses.has(windowId)) {
    const spawnCwd = requestedCwd || os.homedir();
    const shell = pty.spawn(process.env.SHELL || '/bin/bash', [], {
      name: 'xterm-256color',
      cols: 120,
      rows: 30,
      cwd: spawnCwd
    });

    ptyProcesses.set(windowId, shell);
    windowSessions.set(windowId, browserWindow);

    // Send PTY output to renderer
    shell.onData((data) => {
      if (browserWindow && !browserWindow.isDestroyed()) {
        browserWindow.webContents.send('terminal:output', data);
      }
    });
  }
  return ptyProcesses.get(windowId);
}

function closePtyProcess(windowId) {
  if (ptyProcesses.has(windowId)) {
    try {
      ptyProcesses.get(windowId).kill();
    } catch (e) {
      // Already closed
    }
    ptyProcesses.delete(windowId);
    windowSessions.delete(windowId);
  }
}

const SUPPORTED_EXTS = new Set([
  'md', 'markdown', 'mdx',
  'pdf',
  'ipynb',
  'html', 'htm',
  'txt', 'text',
  // LaTeX and auxiliaries
  'tex', 'aux', 'log', 'toc', 'cls', 'bib',
  // Common code files
  'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'rb', 'go', 'rs', 'php', 'swift', 'kt', 'kts', 'scala',
  'json', 'yml', 'yaml', 'xml', 'html', 'css', 'scss', 'md'
]);
const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'tif', 'tiff', 'avif', 'ico']);
const VIDEO_EXTS = new Set(['mp4', 'webm', 'ogg', 'ogv', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'm4v']);

function hashPath(absolutePath) {
  return crypto.createHash('sha1').update(absolutePath).digest('hex');
}

function getNoteType(ext) {
  if (ext === 'ipynb') return 'notebook';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'html' || ext === 'htm') return 'html';
  if (ext === 'txt') return 'text';
  if (ext === 'tex') return 'latex';
  if (ext === 'bib') return 'bib';
  if (IMAGE_EXTS.has(ext)) return 'image';
  if (VIDEO_EXTS.has(ext)) return 'video';
  return 'markdown';
}

async function scanDirectory(dirPath, relativePath = '', allNotes, folderPath, includeUnsupported = false) {
  const children = [];
  try {
    const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
    for (const d of dirents) {
      const name = d.name;
      const fullPath = path.join(dirPath, name);
      const relPath = path.join(relativePath, name);

      if (d.isDirectory()) {
        // Recurse into subdirectory
        const subChildren = await scanDirectory(fullPath, relPath, allNotes, folderPath, includeUnsupported);
        if (subChildren.length > 0) {
          children.push({
            type: 'directory',
            name,
            path: fullPath,
            children: subChildren,
            hasChildren: subChildren.length > 0
          });
        }
      } else if (d.isFile()) {
        const ext = String(name).split('.').pop().toLowerCase();
        const stat = await fs.promises.stat(fullPath).catch(() => null);
        let noteType = null;
        let supported = false;
        if (SUPPORTED_EXTS.has(ext)) {
          supported = true;
          noteType = getNoteType(ext);
        } else if (IMAGE_EXTS.has(ext)) {
          supported = true;
          noteType = 'image';
        } else if (VIDEO_EXTS.has(ext)) {
          supported = true;
          noteType = 'video';
        }

        if (supported && noteType) {
          const note = {
            id: `file-${hashPath(fullPath)}`,
            title: name,
            type: noteType,
            absolutePath: fullPath,
            folderPath,
            createdAt: stat ? stat.ctime.toISOString() : new Date().toISOString(),
            updatedAt: stat ? stat.mtime.toISOString() : new Date().toISOString(),
          };
          allNotes.push(note);
          children.push({ type: 'file', name, path: fullPath, ext: ext ? `.${ext}` : '', supported: true, noteId: note.id });
        } else if (includeUnsupported) {
          // Unknown extension: include as unsupported file so the tree shows it
          children.push({ type: 'file', name, path: fullPath, ext: ext ? `.${ext}` : '', supported: false });
        }
      }
    }
  } catch (e) {
    // on error, skip this directory
  }
  return children;
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('src/renderer/index.html');
}

// Helper used by tests: when NTA_AUTO_TRACE=1 the app should auto-exit after
// a trace file is written into .debug/traces or after a short timeout so
// spawned test processes don't hang indefinitely waiting for a human-driven
// UI session to finish.
async function maybeExitAfterAutoTrace() {
  try {
    if (!process.env || process.env.NTA_AUTO_TRACE !== '1') return;
    const traceDir = path.join(process.cwd(), '.debug', 'traces');
    // If traces already exist, exit quickly.
    try { const files = await fs.promises.readdir(traceDir).catch(() => []); if (files && files.length > 0) { console.log('auto-trace: traces present, exiting'); setTimeout(() => { app.quit(); }, 100); return; } } catch (e) {}

    // Otherwise wait for a new file or timeout.
    let done = false;
    const watcher = fs.watch(path.join(process.cwd(), '.debug'), { persistent: false }, (_, fname) => {
      try {
        if (!fname) return;
        if (fname.indexOf('traces') === -1) return;
        // small delay to allow file write to finish
        setTimeout(() => { if (!done) { done = true; try { app.quit(); } catch (e) {} } }, 200);
      } catch (e) {}
    });

    // Fallback timeout in case no trace is produced
    setTimeout(() => { if (!done) { done = true; try { watcher.close(); } catch (e) {} try { app.quit(); } catch (e) {} } }, 6000);
  } catch (e) { /* don't let test harness crash */ }
}

// Update handling removed: updater not present in this build. Kept main process
// free of update-related handlers to avoid presenting update UI.

ipcMain.handle('workspace:chooseFolder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths?.[0] || null;
});

// Minimal implementation to load a workspace at a given path.
// Returns an object similar to what the renderer expects: { folderPath, tree, notes, preferredActiveId }
ipcMain.handle('workspace:loadAtPath', async (_event, data) => {
  try {
    const folderPath = (data && data.folderPath) ? String(data.folderPath) : null;
    if (!folderPath) return null;

    let allNotes = [];

    const children = await scanDirectory(folderPath, '', allNotes, folderPath, true);
    const tree = { name: path.basename(folderPath), path: folderPath, children };

    return {
      folderPath,
      tree,
      notes: allNotes,
      preferredActiveId: allNotes.length ? allNotes[0].id : null,
    };
  } catch (err) {
    return null;
  }
});

// Stub handlers to satisfy renderer calls during initial load. These provide
// minimal, safe return values so the UI can function without the full
// workspace/native integrations implemented in the main process.
ipcMain.handle('notes:load', async () => {
  return [];
});

ipcMain.handle('notes:paths', async () => {
  return [];
});

ipcMain.handle('workspace:resolveResource', async (_event, payload) => {
  // Resolve resource paths with awareness of note/folder context.
  try {
    const src = payload && payload.src ? String(payload.src) : null;
    const notePath = payload && payload.notePath ? String(payload.notePath) : null;
    const folderPath = payload && payload.folderPath ? String(payload.folderPath) : null;
    if (!src) return { value: null };

    // External or already data/file URLs can be returned as-is
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('file://')) {
      return { value: src };
    }

    // Normalize slashes for consistent handling
    const normalizedSrc = src.replace(/\\/g, '/');

    // Determine candidate absolute path in order of preference:
    // 1) If src is absolute (POSIX or Windows drive), use it
    // 2) If folderPath provided, resolve relative to folderPath
    // 3) If notePath provided, resolve relative to dirname(notePath)
    // 4) Fallback to path.resolve(src)
    let candidatePath = null;
    if (normalizedSrc.startsWith('/')) {
      candidatePath = normalizedSrc;
    } else if (/^[A-Za-z]:\//.test(normalizedSrc)) {
      // Windows drive letter style (C:/...)
      candidatePath = normalizedSrc;
    } else if (folderPath) {
      candidatePath = path.join(folderPath, normalizedSrc);
    } else if (notePath) {
      candidatePath = path.join(path.dirname(notePath), normalizedSrc);
    } else {
      candidatePath = path.resolve(normalizedSrc);
    }

    // If the resolved candidate exists, prefer returning either a data: URI
    // for PDFs/text or a file:// URL for other files. If it doesn't exist,
    // fall back to returning a file:// for the best-effort path.resolve result.
    let stat = await fs.promises.stat(candidatePath).catch(() => null);
    if (!stat) {
      // Try a last-resort path.resolve(src) before giving up
      const fallback = path.resolve(normalizedSrc);
      stat = await fs.promises.stat(fallback).catch(() => null);
      if (stat) candidatePath = fallback;
    }

    if (stat && stat.isFile()) {
      const ext = String(candidatePath).split('.').pop().toLowerCase();
      try {
        if (ext === 'pdf') {
          const buf = await fs.promises.readFile(candidatePath).catch(() => null);
          if (buf && Buffer.isBuffer(buf)) {
            const b64 = buf.toString('base64');
            return { value: `data:application/pdf;base64,${b64}`, mimeType: 'application/pdf' };
          }
        }
        if (['md', 'txt', 'html', 'ipynb', 'json'].includes(ext)) {
          const txt = await fs.promises.readFile(candidatePath, { encoding: 'utf8' }).catch(() => null);
          if (typeof txt === 'string') {
            const enc = encodeURIComponent(txt);
            return { value: `data:text/plain;charset=utf-8,${enc}`, mimeType: 'text/plain' };
          }
        }
      } catch (e) {
        // If reading fails, fall back to file:// below
      }

      // Default: return file:// URL
      return { value: `file://${candidatePath}` };
    }

    // If we couldn't find a file, return a best-effort file:// based on
    // path.resolve so the renderer can attempt to fetch it or display an error.
    const resolved = path.resolve(normalizedSrc);
    return { value: `file://${resolved}` };
  } catch (e) {
    return { value: null };
  }
});

// Additional safe stubs
const noopAsync = async () => null;
ipcMain.handle('workspace:readBibliography', noopAsync);
ipcMain.handle('workspace:chooseBibFile', noopAsync);
ipcMain.handle('workspace:saveNotebook', noopAsync);

// Handle saving external markdown files (invoked during autosave)
ipcMain.handle('workspace:saveExternalMarkdown', async (_event, data) => {
  try {
    const filePath = data && data.filePath ? String(data.filePath) : null;
    const content = data && data.content ? String(data.content) : '';
    
    console.log('[IPC] saveExternalMarkdown called:', filePath, 'content length:', content?.length);
    
    if (!filePath) {
      console.error('[IPC] No file path provided');
      return { success: false, error: 'No file path provided' };
    }
    
    await folderManager.saveMarkdownFile(filePath, content);
    console.log('[IPC] File saved successfully:', filePath);
    return { success: true };
  } catch (error) {
    console.error('[IPC] Error saving markdown file:', error);
    return { success: false, error: String(error) };
  }
});
// Implement createMarkdownFile by delegating to store/folderManager
ipcMain.handle('workspace:createMarkdownFile', async (_event, data) => {
  try {
    const folderPath = data && data.folderPath ? String(data.folderPath) : null;
    const fileName = data && data.fileName ? String(data.fileName) : '';
    const initialContent = data && data.initialContent ? String(data.initialContent) : '';
    if (!folderPath) return null;
    const result = await folderManager.createMarkdownFile(folderPath, fileName, initialContent);
    return result;
  } catch (e) {
    console.error('Error creating markdown file:', e);
    return null;
  }
});

// Handle file rename
ipcMain.handle('workspace:renameMarkdownFile', async (_event, data) => {
  try {
    const workspaceFolder = data && data.workspaceFolder ? String(data.workspaceFolder) : null;
    const oldPath = data && data.oldPath ? String(data.oldPath) : null;
    const newFileName = data && data.newFileName ? String(data.newFileName) : null;
    
    if (!workspaceFolder || !oldPath || !newFileName) return null;
    
    const result = await folderManager.renameMarkdownFile(workspaceFolder, oldPath, newFileName);
    return result;
  } catch (e) {
    console.error('Error renaming markdown file:', e);
    return null;
  }
});
// Read a PDF file and return a plain Buffer (serialized over IPC). Returns null on error.
ipcMain.handle('workspace:readPdfBinary', async (_event, data) => {
  try {
    const absolutePath = data && data.absolutePath ? String(data.absolutePath) : null;
    if (!absolutePath) return null;
    const buf = await fs.promises.readFile(absolutePath).catch(() => null);
    if (!buf) return null;
    // Return raw buffer - Electron will serialize this across IPC
    return buf;
  } catch (e) {
    return null;
  }
});

// Load PDF data as a data: URI when provided a storedPath (app-specific storage).
ipcMain.handle('notes:loadPdfData', async (_event, data) => {
  try {
    const storedPath = data && data.storedPath ? String(data.storedPath) : null;
    if (!storedPath) return null;
    const buf = await fs.promises.readFile(storedPath).catch(() => null);
    if (!buf) return null;
    const b64 = buf.toString('base64');
    return `data:application/pdf;base64,${b64}`;
  } catch (e) {
    return null;
  }
});
ipcMain.handle('workspace:revealInFinder', async (_event, p) => {
  // best-effort: try to reveal using shell if available
  try { const { shell } = require('electron'); if (p) shell.showItemInFolder(String(p)); } catch (e) {}
  return null;
});
ipcMain.handle('workspace:deleteFile', async (_event, absolutePath) => {
  try {
    if (!absolutePath) return { success: false, error: 'No path provided' };
    const p = String(absolutePath);
    // Basic safety: ensure target exists and is a file
    const stat = await fs.promises.stat(p).catch(() => null);
    if (!stat || !stat.isFile()) return { success: false, error: 'File not found' };

    await fs.promises.unlink(p);

    // Notify the renderer that a file was deleted so it can update the tree
    try {
      if (_event && _event.sender && typeof _event.sender.send === 'function') {
        _event.sender.send('workspace:fileDeleted', p);
      } else {
        // Best-effort: notify all windows if sender not available
        for (const w of BrowserWindow.getAllWindows()) {
          try { w.webContents.send('workspace:fileDeleted', p); } catch (e) {}
        }
      }
    } catch (e) { /* ignore notification errors */ }

    // Return a simple success result; renderer will update its own state.
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
});
ipcMain.handle('workspace:pasteFile', noopAsync);

// Clipboard helper: provide a simple writeText handler for renderer convenience
ipcMain.handle('clipboard:writeText', async (_event, text) => {
  try {
    const { clipboard } = require('electron');
    if (typeof text === 'string' || Buffer.isBuffer(text)) {
      clipboard.writeText(String(text));
      return { success: true };
    }
    return { success: false };
  } catch (e) {
    console.error('clipboard:writeText handler error', e);
    return { success: false, error: String(e) };
  }
});

// Export preview handlers with save dialog
ipcMain.handle('preview:exportPdf', async (_event, data) => {
  try {
    const html = data && data.html ? String(data.html) : '';
  const title = data && data.title ? String(data.title) : 'export';
  // If the title includes a file extension (e.g. 'note.md'), remove it so
  // the default save filename doesn't become 'note.md.pdf'. Use path parsing
  // to safely strip a single trailing extension.
  const parsed = path.parse(title || '');
  const safeTitle = parsed.name || title || 'export';
    
    if (!html) return null;
    
    // Show save dialog
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    // If renderer provided a folderPath or notePath, use it to seed the save dialog
    const folderPath = data && data.folderPath ? String(data.folderPath) : (data && data.notePath ? path.dirname(String(data.notePath)) : null);
  const defaultPdfPath = folderPath ? path.join(folderPath, `${safeTitle}.pdf`) : `${safeTitle}.pdf`;
    try { console.debug && console.debug('preview:exportPdf defaultPath ->', defaultPdfPath); } catch (e) {}
    const result = await dialog.showSaveDialog(win, {
      defaultPath: defaultPdfPath,
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });
    
    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }
    
    // Build a small wrapper HTML that includes app CSS and KaTeX so the
    // printed result matches the live preview as closely as possible.
    // Read styles from renderer and katex CSS from node_modules if available.
    let appStyles = '';
    let katexStyles = '';
    try {
      const stylesPath = path.join(__dirname, 'renderer', 'styles.css');
      appStyles = await fs.promises.readFile(stylesPath, { encoding: 'utf8' }).catch(() => '');
    } catch (e) { appStyles = ''; }
    try {
      const katexPath = path.join(__dirname, '..', 'node_modules', 'katex', 'dist', 'katex.min.css');
      katexStyles = await fs.promises.readFile(katexPath, { encoding: 'utf8' }).catch(() => '');
    } catch (e) { katexStyles = ''; }

    // Add PDF-specific CSS to constrain images to page width
    const pdfStyles = `
      body { margin: 20px; }
      img { max-width: 100%; height: auto; display: block; }
      figure { margin: 1em 0; }
      figure img { max-width: 100%; height: auto; }
      @page { margin: 20mm; }
    `;

    const themeClass = (data && data.theme && String(data.theme).toLowerCase() === 'dark') ? 'theme-dark' : '';
    const wrapper = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1" />` +
      `<style>${katexStyles}</style><style>${appStyles}</style><style>${pdfStyles}</style></head><body class="${themeClass}">${html}</body></html>`;

    // Create a hidden BrowserWindow to render the HTML then print to PDF
    const bw = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      }
    });

    const base = `file://${path.join(__dirname, 'renderer')}/`;
    await bw.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(wrapper)}`, { baseURLForDataURL: base });

    // Wait until the content finishes loading
    await new Promise((resolve) => {
      bw.webContents.once('did-finish-load', resolve);
      // Fallback in case did-finish-load doesn't fire for some reason
      setTimeout(resolve, 1000);
    });

    // Print to PDF (include backgrounds). Page size left to defaults (A4-ish) but can be configured.
    const pdfOptions = { printBackground: true };
    const pdfBuffer = await bw.webContents.printToPDF(pdfOptions);
    // Write output
    await fs.promises.writeFile(result.filePath, pdfBuffer);
    try { bw.destroy(); } catch (e) { /* ignore */ }

    // Reveal the exported file in the OS file manager (Finder on macOS)
    try {
      const { shell } = require('electron');
      if (result.filePath && shell && typeof shell.showItemInFolder === 'function') shell.showItemInFolder(result.filePath);
    } catch (e) { /* ignore best-effort */ }

    return { filePath: result.filePath, canceled: false };
  } catch (error) {
    console.error('Preview PDF export error:', error);
    return null;
  }
});

ipcMain.handle('preview:exportHtml', async (_event, data) => {
  try {
    const html = data && data.html ? String(data.html) : '';
  const title = data && data.title ? String(data.title) : 'export';
  const parsedHtml = path.parse(title || '');
  const safeHtmlTitle = parsedHtml.name || title || 'export';
    
    if (!html) return null;
    
    // Show save dialog
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    const folderPath = data && data.folderPath ? String(data.folderPath) : (data && data.notePath ? path.dirname(String(data.notePath)) : null);
  const defaultHtmlPath = folderPath ? path.join(folderPath, `${safeHtmlTitle}.html`) : `${safeHtmlTitle}.html`;
    try { console.debug && console.debug('preview:exportHtml defaultPath ->', defaultHtmlPath); } catch (e) {}
    const result = await dialog.showSaveDialog(win, {
      defaultPath: defaultHtmlPath,
      filters: [{ name: 'HTML', extensions: ['html'] }]
    });
    
    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }
    
    // Ensure exported HTML is complete - wrap fragment content if needed
    let exportHtml = html;
    if (!html.toLowerCase().includes('<!doctype') && !html.toLowerCase().includes('<html')) {
      // HTML fragment - wrap in complete document
      exportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
${html}
</body>
</html>`;
    }
    
    // Write HTML to file
    try {
      await fs.promises.writeFile(result.filePath, exportHtml, { encoding: 'utf-8' });
      // Reveal in Finder
      try { const { shell } = require('electron'); if (result.filePath && shell && typeof shell.showItemInFolder === 'function') shell.showItemInFolder(result.filePath); } catch (e) {}
      return { filePath: result.filePath, canceled: false };
    } catch (writeError) {
      console.error('Failed to write HTML file:', writeError);
      return null;
    }
  } catch (error) {
    console.error('Preview HTML export error:', error);
    return null;
    }
});

ipcMain.handle('preview:exportDocx', noopAsync);
ipcMain.handle('preview:exportEpub', noopAsync);

// Export an already-compiled PDF (preferred when preview is showing compiled output)
ipcMain.handle('preview:exportCompiledPdf', async (_event, data) => {
  try {
    const pdfPath = data && data.pdfPath ? String(data.pdfPath) : null;
  const title = data && data.title ? String(data.title) : 'export';
  const parsedCompiled = path.parse(title || '');
  const safeCompiledTitle = parsedCompiled.name || title || 'export';
    if (!pdfPath) return null;

    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    const folderPath = data && data.folderPath ? String(data.folderPath) : (data && data.notePath ? path.dirname(String(data.notePath)) : null);
  const defaultPdfPath = folderPath ? path.join(folderPath, `${safeCompiledTitle}.pdf`) : `${safeCompiledTitle}.pdf`;
    try { console.debug && console.debug('preview:exportCompiledPdf defaultPath ->', defaultPdfPath); } catch (e) {}
    const result = await dialog.showSaveDialog(win, {
      defaultPath: defaultPdfPath,
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

  // Copy compiled PDF to destination
  await fs.promises.copyFile(pdfPath, result.filePath);
  // Reveal in Finder
  try { const { shell } = require('electron'); if (result.filePath && shell && typeof shell.showItemInFolder === 'function') shell.showItemInFolder(result.filePath); } catch (e) {}
  return { filePath: result.filePath, canceled: false };
  } catch (e) {
    console.error('Export compiled PDF failed:', e);
    return null;
  }
});

// Export LaTeX content as PDF using pdflatex compilation
ipcMain.handle('preview:exportLatexPdf', async (_event, data) => {
  try {
    const latexContent = data && data.content ? String(data.content) : '';
    const title = data && data.title ? String(data.title) : 'export';
    const parsed = path.parse(title || '');
    const safeTitle = parsed.name || title || 'export';

    if (!latexContent) {
      return { canceled: true, error: 'No LaTeX content provided' };
    }

    // Check if LaTeX is installed
    const latexStatus = checkLatexInstalled();
    if (!latexStatus.installed) {
      return {
        canceled: true,
        error: 'LaTeX not installed',
        message: getLatexInstallationStatus().message,
        fallbackToHtml: true
      };
    }

    // Show save dialog
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    const folderPath = data && data.folderPath ? String(data.folderPath) : (data && data.notePath ? path.dirname(String(data.notePath)) : null);
    const defaultPdfPath = folderPath ? path.join(folderPath, `${safeTitle}.pdf`) : `${safeTitle}.pdf`;

    const result = await dialog.showSaveDialog(win, {
      defaultPath: defaultPdfPath,
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    // Compile LaTeX to PDF
    const compileResult = await compileLatexToPdf(latexContent, result.filePath, {
      engine: latexStatus.engine,
      maxIterations: 2,
      timeout: 60000,
      verbose: true
    });

    if (!compileResult.success) {
      return {
        canceled: false,
        error: compileResult.error,
        stderr: compileResult.stderr,
        filePath: null,
        fallbackToHtml: true
      };
    }

    // Reveal the exported file in the OS file manager (Finder on macOS)
    try {
      const { shell } = require('electron');
      if (result.filePath && shell && typeof shell.showItemInFolder === 'function') {
        shell.showItemInFolder(result.filePath);
      }
    } catch (e) { /* ignore best-effort */ }

    return { filePath: result.filePath, canceled: false };
  } catch (error) {
    console.error('Export LaTeX PDF failed:', error);
    return {
      canceled: false,
      error: error.message,
      fallbackToHtml: true
    };
  }
});

// Compile a LaTeX .tex file into PDF using latexmk or pdflatex as fallback.
ipcMain.handle('workspace:compileLatex', async (_event, data) => {
  try {
    const absolutePath = data && data.absolutePath ? String(data.absolutePath) : null;
    if (!absolutePath) return { success: false, error: 'No path provided' };
    const exists = await fs.promises.stat(absolutePath).catch(() => null);
    if (!exists || !exists.isFile()) return { success: false, error: 'File not found' };

    const { spawn } = require('child_process');
    const sourceDir = path.dirname(absolutePath);
    const baseName = path.basename(absolutePath);
    const texFilename = baseName;

    // Compile directly in the source directory
    // This allows LaTeX to access images, bibliography files, data files, etc.
    const tryExec = (cmd, args, opts) => new Promise((resolve) => {
      const p = spawn(cmd, args, opts);
      let stdout = '';
      let stderr = '';
      p.stdout && p.stdout.on('data', (d) => { stdout += String(d); });
      p.stderr && p.stderr.on('data', (d) => { stderr += String(d); });
      p.on('error', (err) => resolve({ code: 127, error: String(err), stdout, stderr }));
      p.on('close', (code) => resolve({ code, stdout, stderr }));
    });

    // First try latexmk -pdf -interaction=nonstopmode -halt-on-error <file>
    let res = await tryExec('latexmk', ['-pdf', '-interaction=nonstopmode', '-halt-on-error', texFilename], { cwd: sourceDir });
    if (res.code !== 0) {
      // fallback to running pdflatex twice
      res = await tryExec('pdflatex', ['-interaction=nonstopmode', texFilename], { cwd: sourceDir });
      if (res.code === 0) {
        // run a second pass
        await tryExec('pdflatex', ['-interaction=nonstopmode', texFilename], { cwd: sourceDir });
      }
    }

    // Expected output PDF in source directory with same base name but .pdf ext
    const pdfName = texFilename.replace(/\.tex$/i, '.pdf');
    const pdfPath = path.join(sourceDir, pdfName);
    const pdfExists = await fs.promises.stat(pdfPath).catch(() => null);
    if (pdfExists && pdfExists.isFile()) {
      return { success: true, pdfPath };
    }

    // If compilation failed, return stderr/stdout where available
    return { success: false, error: 'Compilation failed', detail: res && (res.stderr || res.stdout) ? (res.stderr || res.stdout) : null };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

// Install missing LaTeX packages
ipcMain.handle('app:installLatexPackages', async (_event, data) => {
  try {
    const packages = Array.isArray(data?.packages) ? data.packages : [];
    if (packages.length === 0) {
      return { success: false, error: 'No packages specified' };
    }

    const { spawn } = require('child_process');

    // Detect which LaTeX distribution is available
    const detectLatexManager = () => new Promise((resolve) => {
      const checkCmd = (cmd) => new Promise((res) => {
        const p = spawn(cmd, ['--version'], { shell: true });
        p.on('error', () => res(false));
        p.on('close', (code) => res(code === 0));
      });

      // Try TeX Live package manager first (tlmgr)
      checkCmd('tlmgr').then((hasTlmgr) => {
        if (hasTlmgr) {
          resolve('tlmgr');
        } else {
          // Try MiKTeX package manager (mpm or miktex-mpm)
          checkCmd('mpm').then((hasMpm) => {
            if (hasMpm) {
              resolve('mpm');
            } else {
              checkCmd('miktex-mpm').then((hasMiktex) => {
                resolve(hasMiktex ? 'miktex-mpm' : null);
              });
            }
          });
        }
      });
    });

    const manager = await detectLatexManager();
    if (!manager) {
      return { success: false, error: 'No LaTeX package manager found (tlmgr or mpm)' };
    }

    // For TeX Live (tlmgr), we need elevated permissions on most systems
    if (manager === 'tlmgr') {
      // Helper to run tlmgr commands and capture output
      const runTlmgr = (args) => new Promise((resolve) => {
        const p = spawn('tlmgr', args, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';
        p.stdout && p.stdout.on('data', (d) => { stdout += String(d); });
        p.stderr && p.stderr.on('data', (d) => { stderr += String(d); });
        p.on('error', (err) => resolve({ code: 127, error: String(err), stdout, stderr }));
        p.on('close', (code) => resolve({ code, stdout, stderr }));
      });

      // Helper to get TeX Live installation info and platform-specific tlmgr path
      const getTexLiveInfo = () => new Promise((resolve) => {
        const p = spawn('tlmgr', ['--version'], { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';
        p.stdout && p.stdout.on('data', (d) => { stdout += String(d); });
        p.stderr && p.stderr.on('data', (d) => { stderr += String(d); });
        p.on('close', () => {
          const output = (stdout + stderr);
          // Parse version info: "TeX Live (https://tug.org/texlive) version 2023"
          const versionMatch = output.match(/version (\d{4})/);
          const version = versionMatch ? versionMatch[1] : '2023';
          
          // Parse installation path: "tlmgr using installation: /usr/local/texlive/2023"
          const pathMatch = output.match(/installation: (.+)/);
          const texLiveRoot = pathMatch ? pathMatch[1].trim() : `/usr/local/texlive/${version}`;
          
          // Determine platform architecture
          let arch = 'x86_64-linux'; // default
          const platform = process.platform;
          const arch_info = os.arch();
          
          if (platform === 'darwin') {
            // macOS - use universal-darwin for all Macs (Intel and Apple Silicon)
            arch = 'universal-darwin';
          } else if (platform === 'linux') {
            // Linux
            arch = arch_info === 'arm64' ? 'aarch64-linux' : 'x86_64-linux';
          } else if (platform === 'win32') {
            // Windows - doesn't use this path format
            arch = 'windows';
          }
          
          const tlmgrPath = path.join(texLiveRoot, 'bin', arch, 'tlmgr');
          resolve({ version, texLiveRoot, arch, tlmgrPath });
        });
      });

      const texLiveInfo = await getTexLiveInfo();
      const { version: texLiveVersion, texLiveRoot, arch, tlmgrPath } = texLiveInfo;

      // First check for version mismatch (TeX Live older than remote)
      const versionResult = await runTlmgr(['update', '--self']);
      const combinedOutput = (versionResult.stdout + versionResult.stderr).toLowerCase();
      
      if (combinedOutput.includes('cross release updates') || combinedOutput.includes('older than remote')) {
        // Need to download and run update-tlmgr-latest.sh for major version upgrades
        const pathAddCmd = arch === 'windows' ? 'echo PATH add not needed on Windows' : `${tlmgrPath} path add`;
        return {
          success: false,
          needsTlmgrUpdate: true,
          error: `Your TeX Live is older than the remote repository. For cross-release updates, please run these commands:\n\ncd /tmp\ncurl -L https://mirror.ctan.org/systems/texlive/tlnet/update-tlmgr-latest.sh -o update-tlmgr-latest.sh\nchmod +x update-tlmgr-latest.sh\n${pathAddCmd}\n./update-tlmgr-latest.sh\n\nThis will update tlmgr to handle cross-release updates. After it completes, restart the app and try installing packages again.`,
          updateCommands: arch === 'windows' ? [
            'powershell -Command "cd $env:TEMP; (New-Object Net.WebClient).DownloadFile(\'https://mirror.ctan.org/systems/texlive/tlnet/update-tlmgr-latest.exe\', \'update-tlmgr-latest.exe\'); .\\update-tlmgr-latest.exe"'
          ] : [
            'cd /tmp',
            'curl -L https://mirror.ctan.org/systems/texlive/tlnet/update-tlmgr-latest.sh -o update-tlmgr-latest.sh',
            'chmod +x update-tlmgr-latest.sh',
            pathAddCmd,
            './update-tlmgr-latest.sh'
          ]
        };
      }

      // Now try to install packages
      const installPackages = (args) => new Promise((resolve) => {
        const p = spawn('tlmgr', args, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';
        p.stdout && p.stdout.on('data', (d) => { stdout += String(d); });
        p.stderr && p.stderr.on('data', (d) => { stderr += String(d); });
        p.on('error', (err) => resolve({ success: false, error: String(err) }));
        p.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true, installed: packages });
          } else {
            // Check if error is permission-related
            const errorMsg = stderr || stdout || '';
            if (errorMsg.includes('not writable') || errorMsg.includes('permission') || code === 1) {
              resolve({ 
                success: false, 
                error: `Installation requires elevated privileges. Please run the following command in Terminal:\n\nsudo tlmgr install ${packages.join(' ')}\n\nThen restart the app.`,
                needsSudo: true
              });
            } else if (errorMsg.includes('cross release updates') || errorMsg.includes('older than remote')) {
              // Same as above - need to update tlmgr for cross-release updates
              const pathAddCmd = arch === 'windows' ? 'echo PATH add not needed on Windows' : `${tlmgrPath} path add`;
              resolve({
                success: false,
                needsTlmgrUpdate: true,
                error: `Your TeX Live is older than the remote repository. For cross-release updates, please run these commands:\n\ncd /tmp\ncurl -L https://mirror.ctan.org/systems/texlive/tlnet/update-tlmgr-latest.sh -o update-tlmgr-latest.sh\nchmod +x update-tlmgr-latest.sh\n${pathAddCmd}\n./update-tlmgr-latest.sh\n\nThis will update tlmgr to handle cross-release updates. After it completes, restart the app and try again.`,
                updateCommands: arch === 'windows' ? [
                  'powershell -Command "cd $env:TEMP; (New-Object Net.WebClient).DownloadFile(\'https://mirror.ctan.org/systems/texlive/tlnet/update-tlmgr-latest.exe\', \'update-tlmgr-latest.exe\'); .\\update-tlmgr-latest.exe"'
                ] : [
                  'cd /tmp',
                  'curl -L https://mirror.ctan.org/systems/texlive/tlnet/update-tlmgr-latest.sh -o update-tlmgr-latest.sh',
                  'chmod +x update-tlmgr-latest.sh',
                  pathAddCmd,
                  './update-tlmgr-latest.sh'
                ]
              });
            } else {
              resolve({ success: false, error: errorMsg });
            }
          }
        });
      });

      const result = await installPackages(['install', ...packages]);
      return result;
    } else {
      // MiKTeX: mpm --install=package1 --install=package2 ...
      const installPackages = (args) => new Promise((resolve) => {
        const p = spawn(manager, args, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';
        p.stdout && p.stdout.on('data', (d) => { stdout += String(d); });
        p.stderr && p.stderr.on('data', (d) => { stderr += String(d); });
        p.on('error', (err) => resolve({ success: false, error: String(err) }));
        p.on('close', (code) => {
          if (code === 0) {
            resolve({ success: true, installed: packages });
          } else {
            resolve({ success: false, error: stderr || stdout || 'Installation failed' });
          }
        });
      });

      const args = packages.map(p => `--install=${p}`);
      const result = await installPackages(args);
      return result;
    }
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.handle('debug:write', noopAsync);
ipcMain.handle('debug:readReplaceLog', noopAsync);
ipcMain.handle('debug:listWorkspaceDebug', noopAsync);
ipcMain.handle('debug:readWorkspaceDebugFile', noopAsync);
ipcMain.handle('debug:killWorkspaceReplacer', noopAsync);
ipcMain.handle('debug:openWorkspaceReplacedApp', noopAsync);

ipcMain.handle('notes:selectPdf', noopAsync);


app.whenReady().then(() => {
  createWindow();
  
  // Register global keyboard shortcut: Ctrl+Shift+` to toggle embedded terminal
  globalShortcut.register('Ctrl+Shift+`', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.webContents.send('terminal:toggle');
    }
  });
  
  // If tests requested auto-trace behavior, start the watcher/timeout
  try { maybeExitAfterAutoTrace(); } catch (e) {}

  // Developer helper: if NTA_OPEN_WORKSPACE is set to an absolute path, try
  // to load that workspace at startup and notify the renderer so the UI
  // shows folder contents without manual interaction. This is best-effort
  // and will not throw when the path is invalid or APIs are unavailable.
  try {
    const openPath = process.env && process.env.NTA_OPEN_WORKSPACE ? String(process.env.NTA_OPEN_WORKSPACE) : null;
    const openFile = process.env && process.env.NTA_OPEN_FILE ? String(process.env.NTA_OPEN_FILE) : null;
    if (openPath) {
      (async () => {
        try {
              const win = BrowserWindow.getAllWindows()[0];
              if (!win) return;
          // Wait for the window to finish loading before sending IPC
          await new Promise((resolve) => {
            if (win.webContents.isLoading()) {
              win.webContents.once('did-finish-load', resolve);
            } else {
              resolve();
            }
          });
          // Reuse the workspace loading logic: scan directory and build payload
          const folderPath = openPath;
          let preferredActiveId = null;
          const allNotes = [];

          const children = await scanDirectory(folderPath, '', allNotes, folderPath, true);
          // Set preferredActiveId based on NTA_OPEN_FILE if specified
          if (openFile) {
            const resolvedOpenFile = path.resolve(openFile);
            const matchingNote = allNotes.find(note => note.absolutePath === resolvedOpenFile);
            if (matchingNote) {
              preferredActiveId = matchingNote.id;
            }
          }
          const payload = { folderPath, tree: { name: path.basename(folderPath), path: folderPath, children }, notes: allNotes, preferredActiveId };
          try { win.webContents.send('workspace:changed', payload); } catch (e) {}
        } catch (e) { /* ignore auto-open failures */ }
      })();
    }
  } catch (e) {}  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Handle LaTeX installation request from renderer
ipcMain.handle('app:installLatex', async (_event) => {
  try {
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    if (!win) {
      return { success: false, error: 'No window available' };
    }
    
    const result = await attemptAutoInstall(win);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Check if LaTeX is installed
ipcMain.handle('app:checkLatexInstalled', async (_event) => {
  try {
    const status = checkLatexInstalled();
    return status;
  } catch (error) {
    return { installed: false, engine: null, version: null };
  }
});

// Provide application version to renderer when requested. Prefer the
// Electron `app.getVersion()` API when available, otherwise fall back to
// reading package.json. This prevents the renderer showing 'Unknown'
// when the preload requests the version but the main process hadn't
// previously exposed it.
const { getAppVersion } = require('./main/version-helper');
ipcMain.handle('app:getVersion', async () => {
  try {
    return await getAppVersion(app);
  } catch (e) {
    return 'Unknown';
  }
});

ipcMain.handle('app:reload', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.reload();
  }
  return { success: true };
});

// Check if specific LaTeX packages are installed in the system
ipcMain.handle('app:checkInstalledLatexPackages', async (_event, _data) => {
  try {
    const { spawn } = require('child_process');

    // Use tlmgr to get the list of all installed packages
    // tlmgr list --only-installed will show all installed packages
    const checkInstalledPackages = () => new Promise((resolve) => {
      const p = spawn('tlmgr', ['list', '--only-installed'], { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
      let stdout = '';
      let stderr = '';
      p.stdout && p.stdout.on('data', (d) => { stdout += String(d); });
      p.stderr && p.stderr.on('data', (d) => { stderr += String(d); });
      p.on('close', () => {
        // Parse output: each line is like "i package-name: description"
        const packages = [];
        const lines = (stdout + stderr).split('\n');
        for (const line of lines) {
          // Match: "i" followed by spaces, then capture the package name (before the colon)
          const match = line.match(/^i\s+(\S+):/);
          if (match && match[1]) {
            packages.push({
              name: match[1].toLowerCase(),
              isInstalled: true
            });
          }
        }
        console.log(`[tlmgr] Parsed ${packages.length} installed packages`);
        resolve(packages);
      });
    });

    const packages = await checkInstalledPackages();
    return { success: true, packages };
  } catch (e) {
    console.error('[tlmgr] Error checking installed LaTeX packages:', e);
    return { success: false, packages: [], error: String(e) };
  }
});

// Handle terminal command execution with persistent shell
// Terminal PTY IPC handlers
ipcMain.handle('terminal:init', (event, payload) => {
  const windowId = event.sender.id;
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  // Allow renderer to request a specific cwd for the PTY (e.g., the opened workspace)
  const requestedCwd = payload && payload.folderPath ? String(payload.folderPath) : null;
  if (browserWindow) {
    getPtyProcess(windowId, browserWindow, requestedCwd);  // Create PTY for this window with reference to window
  }
  return { success: true };
});

// Allow renderer to request that the PTY be recreated in a new cwd. This is
// used when the workspace/folder changes and we want the embedded terminal to
// open in that folder. This handler will close any existing PTY for the
// window and create a fresh one with the requested cwd.
ipcMain.handle('terminal:setCwd', (event, payload) => {
  const windowId = event.sender.id;
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  const requestedCwd = payload && payload.folderPath ? String(payload.folderPath) : null;
  try {
    // Close existing PTY if present
    closePtyProcess(windowId);
    if (browserWindow) {
      getPtyProcess(windowId, browserWindow, requestedCwd);
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

ipcMain.on('terminal:data', (event, data) => {
  const windowId = event.sender.id;
  const ptyProcess = ptyProcesses.get(windowId);
  if (ptyProcess && !ptyProcess.killed) {
    ptyProcess.write(data);
  }
});

ipcMain.on('terminal:resize', (event, { cols, rows }) => {
  const windowId = event.sender.id;
  const ptyProcess = ptyProcesses.get(windowId);
  if (ptyProcess && !ptyProcess.killed) {
    ptyProcess.resize(cols, rows);
  }
});

ipcMain.handle('terminal:cleanup', (_event, windowId) => {
  closePtyProcess(windowId);
  return { success: true };
});

// Handle request to toggle terminal from renderer
ipcMain.on('terminal:toggleRequest', (_event) => {
  const win = BrowserWindow.fromWebContents(_event.sender);
  if (win) {
    win.webContents.send('terminal:toggle');
  }
});

// Handle LaTeX installation command - send to terminal
ipcMain.on('latex:send-install-command', (event, { command, distribution, folderPath = null }) => {
  const windowId = event.sender.id;
  let ptyProcess = ptyProcesses.get(windowId);
  
  console.log(`[LaTeX IPC] Received install command for ${distribution}: ${command}`);
  console.log(`[LaTeX IPC] PTY available: ${!!ptyProcess}, killed: ${ptyProcess ? ptyProcess.killed : 'N/A'}`);
  
  // If PTY doesn't exist or is killed, try to initialize it
  if (!ptyProcess || ptyProcess.killed) {
    console.log(`[LaTeX IPC] PTY not ready, attempting to initialize...`);
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    if (browserWindow) {
      // Prefer the folderPath provided by renderer (if any) so the install
      // command runs in the workspace directory rather than the user's home.
      const requestedCwd = folderPath ? String(folderPath) : null;
      ptyProcess = getPtyProcess(windowId, browserWindow, requestedCwd);
      console.log(`[LaTeX IPC] PTY initialized: ${!!ptyProcess}`);
    }
  }
  
  if (ptyProcess && !ptyProcess.killed) {
    // Send the brew install command to the terminal
    console.log(`[LaTeX IPC] Sending to PTY: ${command}`);
    try {
      ptyProcess.write(`${command}\n`);
      console.log(`[LaTeX IPC] Command sent successfully`);
    } catch (err) {
      console.error(`[LaTeX IPC] Error writing to PTY: ${err.message}`);
      event.sender.send('latex:installation-error', {
        error: `Failed to send command to terminal: ${err.message}`,
        distribution
      });
    }
  } else {
    console.error(`[LaTeX IPC] PTY not available for window ${windowId}`);
    event.sender.send('latex:installation-error', {
      error: 'Terminal initialization failed. Please try again.',
      distribution
    });
  }
});

app.on('window-all-closed', () => {
  try {
    // Clean up all PTY processes
    for (const [windowId] of ptyProcesses) {
      closePtyProcess(windowId);
    }
    
    // Unregister global shortcuts before quitting
    globalShortcut.unregisterAll();
    
    // In normal operation on macOS we keep the app alive when all windows are closed.
    // During automated tests we sometimes need the main process to exit as soon as
    // windows are closed. When the test runner sets NTA_FORCE_QUIT=1 we force quit
    // even on darwin so tests don't leave a persistent process running.
    const forceQuit = process.env && process.env.NTA_FORCE_QUIT === '1';
    if (process.platform !== 'darwin' || forceQuit) {
      app.quit();
    }
  } catch (e) { try { app.quit(); } catch (err) {} }
});

// Expose some internals for tests without changing runtime behavior.
// This is guarded so it only attaches a test-harness object when the file
// is required as a module in tests. Tests can import main.js and access
// main.__test__ to inspect or drive PTY lifecycle helpers.
try {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.__test__ = {
      getPtyProcess: typeof getPtyProcess === 'function' ? getPtyProcess : null,
      closePtyProcess: typeof closePtyProcess === 'function' ? closePtyProcess : null,
      ptyProcesses
    };
  }
} catch (e) { /* ignore test export errors */ }


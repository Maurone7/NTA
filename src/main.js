const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

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

ipcMain.handle('app:checkForUpdates', async () => {
  console.log('Checking for updates...');
  return { status: 'no-updates' };
});

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
ipcMain.handle('workspace:saveExternalMarkdown', noopAsync);
ipcMain.handle('workspace:saveNotebook', noopAsync);
ipcMain.handle('workspace:createMarkdownFile', noopAsync);
ipcMain.handle('workspace:renameMarkdownFile', noopAsync);
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
ipcMain.handle('workspace:deleteFile', noopAsync);
ipcMain.handle('workspace:pasteFile', noopAsync);

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

    const themeClass = (data && data.theme && String(data.theme).toLowerCase() === 'dark') ? 'theme-dark' : '';
    const wrapper = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1" />` +
      `<style>${katexStyles}</style><style>${appStyles}</style></head><body class="${themeClass}">${html}</body></html>`;

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

// Compile a LaTeX .tex file into PDF using latexmk or pdflatex as fallback.
ipcMain.handle('workspace:compileLatex', async (_event, data) => {
  try {
    const absolutePath = data && data.absolutePath ? String(data.absolutePath) : null;
    if (!absolutePath) return { success: false, error: 'No path provided' };
    const exists = await fs.promises.stat(absolutePath).catch(() => null);
    if (!exists || !exists.isFile()) return { success: false, error: 'File not found' };

    const { spawn } = require('child_process');
    const os = require('os');
    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'nta-tex-'));
    const baseName = path.basename(absolutePath);
    const targetPath = path.join(tmpDir, baseName);

    // Copy source file into temp dir so compilation doesn't touch original folder
    await fs.promises.copyFile(absolutePath, targetPath);

    // Prefer latexmk if available
    const tryExec = (cmd, args, opts) => new Promise((resolve) => {
      const p = spawn(cmd, args, opts);
      let stdout = '';
      let stderr = '';
      p.stdout && p.stdout.on('data', (d) => { stdout += String(d); });
      p.stderr && p.stderr.on('data', (d) => { stderr += String(d); });
      p.on('error', (err) => resolve({ code: 127, error: String(err), stdout, stderr }));
      p.on('close', (code) => resolve({ code, stdout, stderr }));
    });

    const texFilename = path.basename(targetPath);
    // First try latexmk -pdf -interaction=nonstopmode -halt-on-error <file>
    let res = await tryExec('latexmk', ['-pdf', '-interaction=nonstopmode', '-halt-on-error', texFilename], { cwd: tmpDir });
    if (res.code !== 0) {
      // fallback to running pdflatex twice
      res = await tryExec('pdflatex', ['-interaction=nonstopmode', texFilename], { cwd: tmpDir });
      if (res.code === 0) {
        // run a second pass
        await tryExec('pdflatex', ['-interaction=nonstopmode', texFilename], { cwd: tmpDir });
      }
    }

    // Expected output PDF in tmpDir with same base name but .pdf ext
    const pdfName = texFilename.replace(/\.tex$/i, '.pdf');
    const pdfPath = path.join(tmpDir, pdfName);
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

ipcMain.handle('debug:write', noopAsync);
ipcMain.handle('debug:readReplaceLog', noopAsync);
ipcMain.handle('debug:listWorkspaceDebug', noopAsync);
ipcMain.handle('debug:readWorkspaceDebugFile', noopAsync);
ipcMain.handle('debug:killWorkspaceReplacer', noopAsync);
ipcMain.handle('debug:openWorkspaceReplacedApp', noopAsync);

ipcMain.handle('notes:selectPdf', noopAsync);


app.whenReady().then(() => {
  createWindow();
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

app.on('window-all-closed', () => {
  try {
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

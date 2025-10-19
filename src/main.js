const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const SUPPORTED_EXTS = new Set(['md', 'pdf', 'ipynb', 'html', 'htm', 'txt']);
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
  // Return a simple file:// URL for local absolute paths so the renderer can fetch them.
  try {
    const src = payload && payload.src ? String(payload.src) : null;
    if (!src) return { value: null };
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return { value: src };
    }
    // For local files, return a file:// URL
    const resolved = path.isAbsolute(src) ? src : path.resolve(src);
    // If the file is a PDF or a text-like file, attempt to read and return
    // a data: URI so the renderer (and sandboxed iframe) can load it reliably.
    try {
      const ext = String(resolved).split('.').pop().toLowerCase();
      if (ext === 'pdf') {
        const buf = await fs.promises.readFile(resolved).catch(() => null);
        if (buf && Buffer.isBuffer(buf)) {
          const b64 = buf.toString('base64');
          return { value: `data:application/pdf;base64,${b64}`, mimeType: 'application/pdf' };
        }
      }
      if (['md','txt','html'].includes(ext)) {
        const txt = await fs.promises.readFile(resolved, { encoding: 'utf8' }).catch(() => null);
        if (typeof txt === 'string') {
          const enc = encodeURIComponent(txt);
          return { value: `data:text/plain;charset=utf-8,${enc}`, mimeType: 'text/plain' };
        }
      }
    } catch (e) {
      // fall back to file:// on any failure
    }
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

ipcMain.handle('preview:exportPdf', noopAsync);
ipcMain.handle('preview:exportHtml', noopAsync);
ipcMain.handle('preview:exportDocx', noopAsync);
ipcMain.handle('preview:exportEpub', noopAsync);

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

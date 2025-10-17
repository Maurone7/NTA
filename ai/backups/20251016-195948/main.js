const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('src/renderer/index.html');
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

    // Build a flat notes array from top-level files (non-recursive for safety).
    const entries = [];
    try {
      const dirents = await fs.promises.readdir(folderPath, { withFileTypes: true });
      for (const d of dirents) {
        if (!d.isFile()) continue;
        const name = d.name;
        const ext = String(name).split('.').pop().toLowerCase();
        if (!['md', 'pdf', 'ipynb', 'html', 'txt'].includes(ext)) continue;
        const full = path.join(folderPath, name);
        const stat = await fs.promises.stat(full).catch(() => null);
        entries.push({
          id: `file-${Buffer.from(full).toString('base64').slice(0, 12)}`,
          title: name,
          type: ext === 'ipynb' ? 'notebook' : (ext === 'pdf' ? 'pdf' : 'markdown'),
          absolutePath: full,
          folderPath,
          createdAt: stat ? stat.ctime.toISOString() : new Date().toISOString(),
          updatedAt: stat ? stat.mtime.toISOString() : new Date().toISOString(),
        });
      }
    } catch (e) {
      // on error, return minimal structure
    }

    // Build tree children corresponding to discovered files so the renderer
    // can display a workspace file tree. Each child is a node with the
    // properties the renderer expects: { type, name, path, ext, supported, noteId }
    const children = entries.map((e) => {
      const extRaw = (e.absolutePath && e.absolutePath.split('.').pop()) || '';
      const ext = extRaw ? `.${extRaw}` : '';
      return {
        type: 'file',
        name: e.title,
        path: e.absolutePath,
        ext,
        supported: true,
        noteId: e.id
      };
    });

    const tree = { name: path.basename(folderPath), path: folderPath, children };

    return {
      folderPath,
      tree,
      notes: entries,
      preferredActiveId: entries.length ? entries[0].id : null,
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
ipcMain.handle('workspace:readPdfBinary', noopAsync);
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
ipcMain.handle('notes:loadPdfData', noopAsync);


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
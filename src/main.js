// Heavy modules (docx, epub-gen) are required lazily inside handlers to reduce
// startup memory and to avoid bundling them into the base app unless used.
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const https = require('https');
// const { autoUpdater } = require('electron-updater'); // Disabled, using custom fallback only
const { createNotesStore } = require('./store/notesStore');
const { loadFolderNotes, readPdfAsDataUri, readPdfBuffer, createMarkdownFile, renameMarkdownFile, saveMarkdownFile } = require('./store/folderManager');

// Expose performFallbackUpdate in module scope so IPC handlers can call it
let performFallbackUpdate;
let pendingUpdatePath = null;

// Helper function to convert HTML to DOCX children
async function htmlToDocxChildren(html, folderPath) {
  const children = [];
  
  // Simple HTML to DOCX conversion
  // This is a basic implementation - could be enhanced
  const lines = html.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) continue;
    
    // Handle headings
    if (trimmed.startsWith('<h1>')) {
      const text = trimmed.replace(/<\/?h1>/g, '');
      children.push(new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_1
      }));
    } else if (trimmed.startsWith('<h2>')) {
      const text = trimmed.replace(/<\/?h2>/g, '');
      children.push(new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_2
      }));
    } else if (trimmed.startsWith('<h3>')) {
      const text = trimmed.replace(/<\/?h3>/g, '');
      children.push(new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_3
      }));
    } else if (trimmed.startsWith('<p>')) {
      const text = trimmed.replace(/<\/?p>/g, '').replace(/<[^>]*>/g, '');
      children.push(new Paragraph({
        text: text
      }));
    } else if (trimmed.startsWith('<ul>') || trimmed.startsWith('<ol>')) {
      // Skip list containers, handle individual items
      continue;
    } else if (trimmed.startsWith('<li>')) {
      const text = trimmed.replace(/<\/?li>/g, '').replace(/<[^>]*>/g, '');
      children.push(new Paragraph({
        text: `• ${text}`,
        indent: { left: 720 } // 0.5 inch indent
      }));
    } else {
      // Plain text or other content
      const text = trimmed.replace(/<[^>]*>/g, '');
      if (text.trim()) {
        children.push(new Paragraph({
          text: text
        }));
      }
    }
  }
  
  return children;
}

// File system watcher state
let fileWatcher = null;
let currentWatchedPath = null;

// File system watcher functions
const startFileWatcher = (folderPath, mainWindow) => {
  // Stop existing watcher
  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
  }

  if (!folderPath || !fs.existsSync(folderPath)) {
    return;
  }

  try {
    fileWatcher = fs.watch(folderPath, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      
      // Ignore temporary files, swap files, and system files
      if (filename.startsWith('.') || 
          filename.includes('~') || 
          filename.endsWith('.tmp') ||
          filename.endsWith('.swp') ||
          filename.includes('.DS_Store')) {
        return;
      }
      
      // Only watch for actual file changes that affect the workspace structure
      const isMarkdown = filename.endsWith('.md');
      const isLatex = filename.endsWith('.tex');
      const isDirectory = !path.extname(filename);
      const isMediaFile = filename.match(/\.(html?|mp4|webm|ogg|avi|mov|wmv|jpg|jpeg|png|gif|svg|webp)$/i);
      
      // Only trigger updates for files that affect the workspace structure or are new/deleted
      if ((isMarkdown || isLatex || isDirectory || isMediaFile) && (eventType === 'rename')) {
        // Debounce the refresh with a longer delay to avoid interrupting user interactions
        clearTimeout(fileWatcher.refreshTimeout);
        fileWatcher.refreshTimeout = setTimeout(async () => {
          try {
            const { notes, tree } = await loadFolderNotes(folderPath);
            mainWindow.webContents.send('workspace:changed', {
              folderPath,
              notes,
              tree
            });
          } catch (error) {
          }
        }, 2000); // Increased from 300ms to 2000ms
      }
    });
    
    currentWatchedPath = folderPath;
  } catch (error) {
  }
};

const stopFileWatcher = () => {
  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
    currentWatchedPath = null;
  }
};

const imageMimeTypes = {
  '.apng': 'image/apng',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.pjpeg': 'image/jpeg',
  '.pjp': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.webp': 'image/webp'
};

const videoMimeTypes = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.ogv': 'video/ogg',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.wmv': 'video/x-ms-wmv',
  '.flv': 'video/x-flv',
  '.mkv': 'video/x-matroska',
  '.m4v': 'video/x-m4v'
};

const htmlMimeTypes = {
  '.html': 'text/html',
  '.htm': 'text/html'
};

const protocolPattern = /^[a-zA-Z][a-zA-Z\d+-.]*:/;
const protocolRelativePattern = /^\/\//;

let mainWindow;
let notesStore;

// Debug IPC: write a JSON line to a temp logfile so renderer activity can be captured
ipcMain.handle('debug:write', async (_event, payload) => {
  try {
    const line = JSON.stringify({ ts: new Date().toISOString(), payload }) + '\n';
    const tmp = require('os').tmpdir();
    const tmpFile = path.join(tmp, 'nta-debug.log');
    // Append to system temp logfile for users who prefer /tmp
    await fsp.appendFile(tmpFile, line, 'utf8');

    // Also append to a workspace-local debug file so the assistant can read it
    try {
      const workspaceDebugDir = path.join(__dirname, '..', '.debug');
      await fsp.mkdir(workspaceDebugDir, { recursive: true });
      const workspaceFile = path.join(workspaceDebugDir, 'nta-debug.log');
      await fsp.appendFile(workspaceFile, line, 'utf8');
      return { ok: true, file: tmpFile, workspaceFile };
    } catch (innerErr) {
      // If workspace write fails, still return success for tmp file
      return { ok: true, file: tmpFile, workspaceFile: null, error: String(innerErr) };
    }
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// Read the replacement script debug log (written by the detached installer script)
ipcMain.handle('debug:readReplaceLog', async () => {
  try {
    const os = require('os');
    const tmp = os.tmpdir();
    const logPath = path.join(tmp, 'nta-replace.log');
    const content = await fsp.readFile(logPath, 'utf8');
    return { ok: true, file: logPath, content };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// List files in the workspace .debug directory and read individual files
ipcMain.handle('debug:listWorkspaceDebug', async () => {
  try {
    const workspaceDebugDir = path.join(__dirname, '..', '.debug');
    await fsp.mkdir(workspaceDebugDir, { recursive: true });
    const items = await fsp.readdir(workspaceDebugDir);
    return { ok: true, dir: workspaceDebugDir, items };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('debug:readWorkspaceDebugFile', async (_event, filename) => {
  try {
    const workspaceDebugDir = path.join(__dirname, '..', '.debug');
    const safeName = path.basename(filename || '');
    const filePath = path.join(workspaceDebugDir, safeName);
    const content = await fsp.readFile(filePath, 'utf8');
    return { ok: true, file: filePath, content };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// Kill the spawned replacer process (reads pid from workspace .debug/nta-replace.pid)
ipcMain.handle('debug:killWorkspaceReplacer', async () => {
  try {
    const workspaceDebugDir = path.join(__dirname, '..', '.debug');
    const pidPath = path.join(workspaceDebugDir, 'nta-replace.pid');
    const pidText = await fsp.readFile(pidPath, 'utf8').catch(() => null);
    if (!pidText) return { ok: false, error: 'No pid file found' };
    const pid = parseInt(pidText.trim(), 10);
    if (!pid || Number.isNaN(pid)) return { ok: false, error: 'Invalid pid in file' };
    try {
      process.kill(pid, 'SIGTERM');
    } catch (e) {
      // If process already exited or permission denied, try force kill then continue
      try { process.kill(pid, 'SIGKILL'); } catch (ee) {}
    }
    return { ok: true, pid };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// Open the replaced app based on the workspace or /tmp sentinel
ipcMain.handle('debug:openWorkspaceReplacedApp', async () => {
  try {
    const workspaceDebugDir = path.join(__dirname, '..', '.debug');
    const workspaceResult = path.join(workspaceDebugDir, 'nta-replace-result.json');
    const tmpResult = path.join(require('os').tmpdir(), 'nta-replace-result.json');
    let content = null;
    try { content = await fsp.readFile(workspaceResult, 'utf8'); } catch (e) { /* ignore */ }
    if (!content) {
      try { content = await fsp.readFile(tmpResult, 'utf8'); } catch (e) { /* ignore */ }
    }
    if (!content) return { ok: false, error: 'No result sentinel found' };
    let obj = null;
    try { obj = JSON.parse(content); } catch (e) { return { ok: false, error: 'Failed to parse sentinel: ' + String(e) }; }
    const target = obj && obj.target ? obj.target : null;
    if (!target) return { ok: false, error: 'No target path in sentinel' };
    // Use electron.shell.openPath to open the application path
    const res = await shell.openPath(target);
    // shell.openPath returns an empty string on success, or an error string
    return { ok: res === '', target, result: res };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

const toFileUrl = (targetPath) => {
  if (!targetPath) {
    return '';
  }
  const normalized = targetPath.split(path.sep).join('/');
  if (normalized.startsWith('/')) {
    return `file://${normalized}`;
  }
  return `file:///${normalized}`;
};

const sanitizeFileName = (value, fallback = 'Preview') => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim().replace(/[\\/:*?"<>|]+/g, '').slice(0, 120);
  return trimmed || fallback;
};

const getImageMimeType = (targetPath) => {
  const ext = typeof targetPath === 'string' ? path.extname(targetPath).toLowerCase() : '';
  return imageMimeTypes[ext] ?? 'application/octet-stream';
};

const getVideoMimeType = (targetPath) => {
  const ext = typeof targetPath === 'string' ? path.extname(targetPath).toLowerCase() : '';
  return videoMimeTypes[ext] ?? 'application/octet-stream';
};

const isImageFile = (targetPath) => {
  const ext = typeof targetPath === 'string' ? path.extname(targetPath).toLowerCase() : '';
  return imageMimeTypes[ext] !== undefined;
};

const isVideoFile = (targetPath) => {
  const ext = typeof targetPath === 'string' ? path.extname(targetPath).toLowerCase() : '';
  return videoMimeTypes[ext] !== undefined;
};

const getHtmlMimeType = (targetPath) => {
  const ext = typeof targetPath === 'string' ? path.extname(targetPath).toLowerCase() : '';
  return htmlMimeTypes[ext] ?? 'text/html';
};

const isHtmlFile = (targetPath) => {
  const ext = typeof targetPath === 'string' ? path.extname(targetPath).toLowerCase() : '';
  return htmlMimeTypes[ext] !== undefined;
};

const createMainWindow = () => {
  console.log('createMainWindow: Creating main window...');
  const windowOptions = {
    width: 1280,
    height: 800,
    minWidth: 500,
    minHeight: 300,
  title: 'NTA',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: file:; media-src 'self' data: file:; object-src 'none'; base-uri 'self'; form-action 'self';"
    },
    show: false // Don't show until ready-to-show
  };

  // Platform-specific window options
  if (process.platform === 'darwin') {
    // macOS specific - use custom title bar
    windowOptions.titleBarStyle = 'hiddenInset';
    windowOptions.trafficLightPosition = { x: 13, y: 4 }; // Position for 10px title bar
    windowOptions.icon = path.join(__dirname, '..', 'assets', 'NTA logo.png');
  } else if (process.platform === 'win32') {
    // Windows specific
    windowOptions.autoHideMenuBar = true;
    windowOptions.icon = path.join(__dirname, '..', 'assets', 'NTA logo.png');
  } else {
    // Linux specific
    windowOptions.icon = path.join(__dirname, '..', 'assets', 'NTA logo.png');
  }

  mainWindow = new BrowserWindow(windowOptions);

  const startPage = path.join(__dirname, 'renderer', 'index.html');
  mainWindow.loadFile(startPage);
  
  console.log('createMainWindow: Main window created and loading page:', startPage);

  // Diagnostic: check whether preload-exposed API is available in the renderer
  try {
    mainWindow.webContents.once('did-finish-load', () => {
      try {
        mainWindow.webContents.executeJavaScript(`(function(){
          try {
            return {
              hasApi: typeof window.api !== 'undefined',
              hasInvoke: (typeof window.api !== 'undefined') ? (typeof window.api.invoke === 'function') : false
            };
          } catch (e) { return { error: String(e) }; }
        })()`)
        .then((result) => {
          try { console.log('Renderer preload API check:', result); } catch (e) {}
        }).catch((err) => {
          try { console.log('Renderer preload API exec error:', String(err)); } catch (e) {}
        });
      } catch (e) {
        try { console.log('Renderer preload API check scheduling failed:', String(e)); } catch (e) {}
      }
    });
  } catch (e) {}

  // Forward renderer console messages to the main process terminal in development
  try {
    mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
      const levels = ['debug', 'info', 'warn', 'error'];
      const lvl = levels[level] ?? `level-${level}`;
    });
  } catch (err) {
    // Older/newer electron versions may not emit console-message; ignore if unsupported
  }

  // Also listen for the 'console' event if available (newer electron versions)
  try {
    mainWindow.webContents.on('console', (event, level, ...args) => {
      // Level may be 'log', 'warn', 'error', etc.
    });
  } catch (err) {
    // ignore if not supported
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    // Show and focus window to ensure it appears in foreground
    try {
      mainWindow.show();
      mainWindow.focus();
      // On macOS an additional activate call can help bring the app forward
      if (process.platform === 'darwin') {
        app.focus({ steal: true });
      }
    } catch (e) {
      try { mainWindow.show(); } catch (ee) {}
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
};

// Auto-updater configuration - disabled, using custom fallback only
const setupAutoUpdater = () => {
  // Skip electron-updater entirely; use custom fallback updater
  console.log('setupAutoUpdater: Using custom fallback updater only (no electron-updater)');

  // No auto-updater events or periodic checks
};

// Helper function to fetch text from URL, following redirects up to a limit
const fetchText = (u, redirectCount = 0) => new Promise((resolve, reject) => {
  const MAX_REDIRECTS = 5;
  const req = https.get(u, { headers: { 'User-Agent': 'NTA-updater' }, timeout: 10000 }, (res) => {
    // Follow 3xx redirects when Location header is present
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers && res.headers.location) {
      if (redirectCount >= MAX_REDIRECTS) {
        reject(new Error('Too many redirects for ' + u));
        return;
      }
      const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, u).toString();
      // consume and discard current response before following
      res.resume();
      return fetchText(next, redirectCount + 1).then(resolve).catch(reject);
    }
    if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 400)) {
      reject(new Error('HTTP ' + res.statusCode + ' for ' + u));
      return;
    }
    let s = '';
    res.setEncoding('utf8');
    res.on('data', (c) => s += c);
    res.on('end', () => resolve(s));
  });
  req.on('error', reject);
  req.on('timeout', () => {
    req.destroy();
    reject(new Error('Request timeout for ' + u));
  });
});

// then spawns a detached shell script that waits for the app to quit and replaces
// /Applications/NTA.app using `ditto`. This is intended for developer/internal use.

performFallbackUpdate = async function() {
  console.log('performFallbackUpdate: downloads are disabled by configuration');
  try {
    if (mainWindow) mainWindow.webContents.send('fallback-result', { ok: false, error: 'Downloads disabled' });
  } catch (e) {}
  return { ok: false, error: 'Downloads disabled' };
}

  // (dev hook removed - moved into bootstrap so performCustomUpdate is in scope)

  const bootstrap = async () => {
    notesStore = createNotesStore(app.getPath('userData'));
    await notesStore.initialize();

    // Configure auto-updater
    setupAutoUpdater();

    // Dev-only: allow forcing the fallback updater to run on startup for testing
    if (process.env.NTA_RUN_FALLBACK === '1') {
      try {
        console.log('Dev: NTA_RUN_FALLBACK=1 detected — invoking performFallbackUpdate()');
        // run but don't await to avoid blocking boot
  performFallbackUpdate({ preferUserApplications: false }).catch((e) => console.error('Fallback test error:', e));
      } catch (e) {
        console.error('Dev fallback trigger failed:', e);
      }
    }

    ipcMain.handle('notes:load', async () => {
      return notesStore.loadNotes();
    });

    ipcMain.handle('notes:save', async (_event, notes) => {
      await notesStore.saveNotes(notes);
      return true;
    });

    ipcMain.handle('notes:selectPdf', async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Import PDF',
        buttonLabel: 'Import',
        filters: [{ name: 'PDF files', extensions: ['pdf'] }],
        properties: ['openFile']
      });

      if (canceled || !filePaths || !filePaths.length) {
        return null;
      }

      const pdfPath = filePaths[0];
      return notesStore.importPdf(pdfPath);
    });

    ipcMain.handle('notes:loadPdfData', async (_event, payload) => {
      if (!payload) {
        return null;
      }

      const { storedPath, absolutePath } = payload;

      if (absolutePath) {
        return readPdfAsDataUri(absolutePath);
      }

      return notesStore.readPdfAsDataUri(storedPath);
    });

    ipcMain.handle('notes:paths', async () => {
      return notesStore.getPaths();
    });

    // Update handlers - using custom fallback only
    ipcMain.handle('app:checkForUpdates', async () => {
      try { console.log('IPC app:checkForUpdates invoked - using custom fallback'); } catch (e) {}
      // Fetch manifest and check if update available
      const https = require('https');
      const fetchText = (u, redirectCount = 0) => new Promise((resolve, reject) => {
        const MAX_REDIRECTS = 5;
        const req = https.get(u, { headers: { 'User-Agent': 'NTA-updater' }, timeout: 10000 }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            if (redirectCount >= MAX_REDIRECTS) {
              reject(new Error('Too many redirects for ' + u));
              return;
            }
            const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, u).toString();
            res.resume();
            return fetchText(next, redirectCount + 1).then(resolve).catch(reject);
          }
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 400)) {
            reject(new Error('HTTP ' + res.statusCode + ' for ' + u));
            return;
          }
          let s = '';
          res.setEncoding('utf8');
          res.on('data', (c) => s += c);
          res.on('end', () => resolve(s));
        });
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout for ' + u));
        });
    });

    try {
      // Check for test manifest first
      const testManifestPath = process.env.NTA_TEST_MANIFEST_PATH;
      let yamlText = null;
      
      if (testManifestPath) {
        try {
          console.log('IPC app:checkForUpdates: Using test manifest from:', testManifestPath);
          yamlText = require('fs').readFileSync(testManifestPath, 'utf8');
        } catch (e) {
          console.log('IPC app:checkForUpdates: Failed to read test manifest:', e.message);
        }
      }
      
      if (!yamlText) {
        const tryUrls = [
          'https://github.com/Maurone7/NTA/releases/latest/download/latest-mac.yml',
          'https://github.com/Maurone7/NoteTakingApp/releases/latest/download/latest-mac.yml'
        ];
        for (const u of tryUrls) {
          try {
            yamlText = await fetchText(u);
            if (yamlText) break;
          } catch (e) {}
        }
      }
      
      // If network fetch failed, try to use the local dev manifest as fallback
      if (!yamlText) {
        try {
          console.log('IPC app:checkForUpdates: Network fetch failed, trying local dev manifest');
          const devManifestPath = path.join(process.resourcesPath, '..', '..', 'dev-app-update.yml');
          yamlText = await fsp.readFile(devManifestPath, 'utf8');
          console.log('IPC app:checkForUpdates: Using local dev manifest');
        } catch (e) {
          console.log('IPC app:checkForUpdates: Local dev manifest also failed, trying GitHub API');
          // Fall back to GitHub API
          try {
            const https = require('https');
            const options = {
              hostname: 'api.github.com',
              path: `/repos/Maurone7/NTA/releases/latest`,
              method: 'GET',
              headers: { 'User-Agent': 'NTA-updater' },
              timeout: 30000
            };
            const body = await new Promise((resolve, reject) => {
              const req = https.request(options, (res) => {
                let chunks = '';
                res.setEncoding('utf8');
                res.on('data', (c) => chunks += c);
                res.on('end', () => {
                  if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(chunks);
                  } else {
                    reject(new Error(`GitHub API status ${res.statusCode}`));
                  }
                });
              });
              req.on('error', reject);
              req.on('timeout', () => {
                req.destroy();
                reject(new Error('GitHub API request timeout'));
              });
              req.end();
            });
            const json = JSON.parse(body);
            const tag = json.tag_name || json.name || null;
            const releaseVersion = tag ? String(tag).replace(/^v/, '') : null;
            // Create a synthetic manifest
            yamlText = `version: ${releaseVersion}\nfiles:\n  - url: NTA-${releaseVersion}-arm64.zip\n    sha512: placeholder\n    size: 100000000\n`;
            console.log('IPC app:checkForUpdates: Using GitHub API fallback, synthetic manifest for version', releaseVersion);
          } catch (apiErr) {
            console.log('IPC app:checkForUpdates: GitHub API fallback also failed:', apiErr.message);
          }
        }
      }
      
      if (!yamlText) {
        if (mainWindow) mainWindow.webContents.send('update-error', 'Failed to fetch update manifest');
        return { status: 'error', error: 'Failed to fetch manifest' };
      }

      // If debugging is enabled, log the fetched manifest for diagnosis
      try {
        if (process.env.NTA_DEBUG_UPDATE) {
          console.log('IPC app:checkForUpdates: fetched manifest:\n', yamlText);
        }
      } catch (e) {}

      const verMatch = yamlText.match(/^version:\s*(\S+)/m);
      let remoteVersion = verMatch && verMatch[1] ? String(verMatch[1]).trim() : null;
      let currentVersion = String(app.getVersion()).trim();

      // Small semver compare function (handles numeric dot-separated versions)
      const isRemoteNewer = (remote, current) => {
        if (!remote || !current) return false;
        const a = String(remote).replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
        const b = String(current).replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
        const len = Math.max(a.length, b.length);
        for (let i = 0; i < len; i++) {
          const ai = a[i] || 0;
          const bi = b[i] || 0;
          if (ai > bi) return true;
          if (ai < bi) return false;
        }
        return false;
      };

      try { console.log('IPC app:checkForUpdates: currentVersion=', currentVersion, 'remoteVersion=', remoteVersion); } catch(e) {}

      if (remoteVersion && isRemoteNewer(remoteVersion, currentVersion)) {
        // Ensure release URL points to the NTA repository (owner/repo: Maurone7/NTA)
        const releaseUrl = `https://github.com/Maurone7/NTA/releases/tag/v${remoteVersion}`;
        const info = { version: remoteVersion, currentVersion, releaseUrl };
        try { if (mainWindow) mainWindow.webContents.send('update-available', info); } catch (e) {}
        return { status: 'update-available', info };
      } else {
        // Manifest did not indicate a newer version. As a fallback, query GitHub API
        // for the latest release tag and prefer that if it's newer.
        try {
          try { console.log('IPC app:checkForUpdates: manifest not newer - querying GitHub API for tag fallback'); } catch(e) {}
          const https = require('https');
          const options = {
            hostname: 'api.github.com',
            path: `/repos/Maurone7/NTA/releases/latest`,
            method: 'GET',
            headers: { 'User-Agent': 'NTA-updater' },
            timeout: 15000
          };
          const body = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
              let chunks = '';
              res.setEncoding('utf8');
              res.on('data', (c) => chunks += c);
              res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) resolve(chunks);
                else reject(new Error('GitHub API status ' + res.statusCode));
              });
            });
            req.on('error', reject);
            req.on('timeout', () => { req.destroy(); reject(new Error('GitHub API timeout')); });
            req.end();
          });
          const json = JSON.parse(body || '{}');
          const apiTag = json.tag_name || json.name || null;
          const apiVersion = apiTag ? String(apiTag).replace(/^v/, '').trim() : null;
          try { if (process.env.NTA_DEBUG_UPDATE) console.log('IPC app:checkForUpdates: GitHub API returned tag=', apiTag, 'apiVersion=', apiVersion); } catch(e) {}
          if (apiVersion && isRemoteNewer(apiVersion, currentVersion)) {
            const releaseUrl = `https://github.com/Maurone7/NTA/releases/tag/${apiTag}`;
            const info = { version: apiVersion, currentVersion, releaseUrl };
            try { if (mainWindow) mainWindow.webContents.send('update-available', info); } catch (e) {}
            return { status: 'update-available', info };
          }
        } catch (apiErr) {
          try { console.log('IPC app:checkForUpdates: GitHub API fallback failed:', apiErr && apiErr.message); } catch(e) {}
        }
        const info = { currentVersion };
        try { if (mainWindow) mainWindow.webContents.send('update-not-available', info); } catch (e) {}
        return { status: 'update-not-available', info };
      }
    } catch (err) {
      if (mainWindow) mainWindow.webContents.send('update-error', String(err));
      return { status: 'error', error: String(err) };
    }
  });

  ipcMain.handle('app:quitAndInstall', async () => {
    console.log('app:quitAndInstall: handler called');
    // For custom fallback, install update if available, then quit the app
    console.log('app:quitAndInstall: pendingUpdatePath =', pendingUpdatePath);
    const fs = require('fs');
    const path = require('path');
    const logFile = path.join(require('os').tmpdir(), 'nta-restart.log');
    
    const log = (msg) => {
      const timestamp = new Date().toISOString();
      const line = `${timestamp}: ${msg}\n`;
      console.log(msg);
      try { fs.appendFileSync(logFile, line); } catch(e) {}
    };
    
    log('app:quitAndInstall: starting - called from renderer');
    
    // If there's a pending update, install it first, then quit
    if (pendingUpdatePath) {
      try {
        log('app:quitAndInstall: installing pending update from ' + pendingUpdatePath);
        const cp = require('child_process');
        const os = require('os');
        const tmpdir = os.tmpdir();
        
        // Wait for any existing NTA processes to exit first (but we should be the only one running)
        log('app:quitAndInstall: checking for other NTA processes');
        try {
          const result = await new Promise((resolve, reject) => {
            const child = cp.spawn('pgrep', ['-af', 'NTA.app/Contents/MacOS/NTA|NTA Helper'], { stdio: ['pipe', 'pipe', 'pipe'] });
            let stdout = '';
            child.stdout.on('data', (data) => stdout += data.toString());
            child.on('close', (code) => {
              if (code === 0) resolve(stdout.trim());
              else resolve('');
            });
            child.on('error', () => resolve(''));
          });
          const filtered = result.split('\n').filter(line => line && !line.includes('nta-replace.sh') && !line.includes('/bin/sh -c')).join('\n');
          if (filtered) {
            log('app:quitAndInstall: found other NTA processes, waiting...');
            // Wait a moment for processes to exit
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (e) {
          log('app:quitAndInstall: error checking processes: ' + e.message);
        }
        
        // Determine target location
        const targetApp = preferUserApplications ? path.join(process.env.HOME || '/', 'Applications', 'NTA.app') : '/Applications/NTA.app';
        log('app:quitAndInstall: target app: ' + targetApp);
        log('app:quitAndInstall: pendingUpdatePath: ' + pendingUpdatePath);
        
        // Copy the update to the target location
        log('app:quitAndInstall: copying from ' + pendingUpdatePath + ' to ' + targetApp);
        try {
          // Try an unprivileged ditto first
          await new Promise((resolve, reject) => {
            const child = cp.exec(`ditto "${pendingUpdatePath}" "${targetApp}"`, (error, stdout, stderr) => {
              if (error) {
                log('app:quitAndInstall: ditto failed: ' + error.message);
                reject(error);
              } else {
                log('app:quitAndInstall: ditto succeeded');
                resolve();
              }
            });
          });
        } catch (e) {
          log('app:quitAndInstall: initial copy failed: ' + e.message);
          // If the failure looks like a permission problem, try an elevated copy using AppleScript
          const permErr = /permission|EACCES|EPERM|denied/i.test(String(e.message));
          if (permErr) {
            try {
              log('app:quitAndInstall: attempting elevated copy with administrator privileges');
              // Build an AppleScript command that runs ditto with administrator privileges
              const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
              const asCmd = `do shell script "ditto \"${esc(pendingUpdatePath)}\" \"${esc(targetApp)}\"" with administrator privileges`;
              // Run osascript -e '<cmd>'
              cp.execFileSync('osascript', ['-e', asCmd], { stdio: 'inherit' });
              log('app:quitAndInstall: elevated ditto succeeded');
            } catch (asErr) {
              log('app:quitAndInstall: elevated copy failed: ' + (asErr && asErr.message ? asErr.message : String(asErr)));
              throw asErr;
            }
          } else {
            // Not a permissions error - rethrow
            log('app:quitAndInstall: copy failed (non-permission error)');
            throw e;
          }
        }
        
        // Launch the newly installed app
        log('app:quitAndInstall: launching newly installed app');
        await new Promise((resolve, reject) => {
          const child = cp.spawn('open', [targetApp], { stdio: 'inherit' });
          child.on('close', (code) => {
            if (code === 0) {
              log('app:quitAndInstall: new app launched successfully');
              resolve();
            } else {
              log('app:quitAndInstall: failed to launch new app, code: ' + code);
              reject(new Error('Failed to launch new app'));
            }
          });
          child.on('error', (err) => {
            log('app:quitAndInstall: error launching new app: ' + err.message);
            reject(err);
          });
        });
        
        // Clear pending update
        pendingUpdatePath = null;
        log('app:quitAndInstall: update completed - new app installed and launched');
        
        // Quit the current app after successful installation
        log('app:quitAndInstall: quitting current app');
        app.quit();
        
      } catch (e) {
        log('app:quitAndInstall: install failed: ' + e.message);
        // Don't quit if install failed
        return { success: false, error: e.message };
      }
    } else {
      log('app:quitAndInstall: no pending update found');
    }
    
    // Update completed successfully - quit the current app
    log('app:quitAndInstall: update process completed, quitting app');
    app.quit();
  });

  ipcMain.handle('app:openExternal', async (_event, url) => {
    try {
      console.log('ipcMain:app:openExternal called with url:', url);
      const { shell } = require('electron');
      if (!url) throw new Error('No URL provided');
      try {
        await shell.openExternal(url);
        console.log('ipcMain:app:openExternal succeeded for url:', url);
        return { success: true };
      } catch (errShell) {
        console.log('ipcMain:app:openExternal shell.openExternal failed:', String(errShell));
        // Platform fallback: try system opener
        try {
          const child_process = require('child_process');
          const platform = process.platform;
          if (platform === 'darwin') {
            child_process.execFileSync('open', [url]);
          } else if (platform === 'win32') {
            // start requires being run via cmd.exe
            child_process.execFileSync('cmd', ['/c', 'start', '', url]);
          } else {
            // linux/unix
            child_process.execFileSync('xdg-open', [url]);
          }
          console.log('ipcMain:app:openExternal fallback succeeded for url:', url);
          return { success: true, fallback: true };
        } catch (errFallback) {
          console.log('ipcMain:app:openExternal fallback failed:', String(errFallback));
          throw errFallback;
        }
      }
    } catch (e) {
      console.log('ipcMain:app:openExternal failed:', String(e));
      return { success: false, error: String(e) };
    }
  });

  ipcMain.handle('app:downloadUpdate', async () => {
    // Downloads have been disabled - return a standardized response
    try {
      if (mainWindow) mainWindow.webContents.send('update-error', 'Downloads disabled by configuration');
    } catch (e) {}
    return { success: false, error: 'Downloads disabled' };
  });

  // Fallback updater (no Apple Developer ID required)
  // Downloads the latest release's zip for the current arch, extracts it to /tmp,
  // then spawns a detached shell script that waits for the app to quit and replaces
  ipcMain.handle('app:downloadAndReplace', async () => {
    try { if (mainWindow) mainWindow.webContents.send('fallback-result', { ok: false, error: 'Downloads disabled' }); } catch (e) {}
    return { ok: false, error: 'Downloads disabled' };
  });

  // Custom in-app updater: verifies manifest sha512 and streams download progress
  async function performCustomUpdate() {
    console.log('performCustomUpdate: downloads are disabled by configuration');
    try {
      if (mainWindow) mainWindow.webContents.send('custom-update-result', { ok: false, error: 'Downloads disabled' });
    } catch (e) {}
    return { ok: false, error: 'Downloads disabled' };
  }

  ipcMain.handle('app:customCheckAndUpdate', async (_event, opts) => {
    return await performCustomUpdate(opts || {});
  });

  ipcMain.handle('app:getVersion', async () => {
    // Dev/testing override: if NTA_FAKE_VERSION is set, return that instead of the
    // real app version. This lets us emulate a user running an older installed
    // version (for example v0.0.7) while the running development build is newer.
    if (process.env.NTA_FAKE_VERSION) return String(process.env.NTA_FAKE_VERSION);
    return app.getVersion();
  });

  // Dev-only manual update checker: fetch latest release from GitHub and compare versions.
  ipcMain.handle('app:devCheckForUpdates', async () => {
    try {
      const https = require('https');
      const options = {
        hostname: 'api.github.com',
        path: `/repos/Maurone7/NTA/releases/latest`,
        method: 'GET',
        headers: { 'User-Agent': 'NTA-dev-checker' },
        timeout: 30000
      };

      const body = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let chunks = '';
          res.setEncoding('utf8');
          res.on('data', (c) => chunks += c);
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(chunks);
            } else {
              reject(new Error(`GitHub API status ${res.statusCode}`));
            }
          });
        });
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('GitHub API request timeout'));
        });
        req.end();
      });

      const json = JSON.parse(body);
      const tag = json.tag_name || json.name || null;
      const releaseVersion = tag ? String(tag).replace(/^v/, '') : null;
      const current = app.getVersion();

      const isNewer = (releaseVersion && current) ? (() => {
        const sv = releaseVersion.split('.').map(n => parseInt(n,10)||0);
        const cv = String(current).split('.').map(n => parseInt(n,10)||0);
        for (let i=0;i<Math.max(sv.length,cv.length);i++){
          const a = sv[i]||0, b = cv[i]||0;
          if (a>b) return true;
          if (a<b) return false;
        }
        return false;
      })() : false;

      return { status: isNewer ? 'update-available' : 'update-not-available', release: json, releaseVersion, current };
    } catch (err) {
      try { console.error('devCheckForUpdates error:', err); } catch (e) {}
      return { status: 'error', error: String(err) };
    }
  });

  ipcMain.handle('settings:getFileSizeLimits', async () => {
    // Get file size limits from renderer process via IPC
    // For now, return defaults - this will be enhanced to get from renderer settings
    return {
      image: 10 * 1024 * 1024, // 10MB
      video: 100 * 1024 * 1024, // 100MB
      script: 5 * 1024 * 1024   // 5MB
    };
  });

    // Read a bibliography file (simple text read) from disk and return content
    ipcMain.handle('workspace:readBibliography', async (_event, payload) => {
      try {
        if (!payload || !payload.path) return { error: 'No path provided' };
        const bibPath = payload.path;
        const content = await fsp.readFile(bibPath, { encoding: 'utf8' });
        return { content };
      } catch (error) {
        return { error: error?.message ?? 'Failed to read bibliography' };
      }
    });

  ipcMain.handle('workspace:chooseFolder', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Open folder',
      buttonLabel: 'Open',
      properties: ['openDirectory']
    });

    if (canceled || !filePaths || !filePaths.length) {
      return null;
    }

    const folderPath = filePaths[0];
    try {
      const { notes, tree } = await loadFolderNotes(folderPath, null); // Use defaults for chooseFolder
      return { folderPath, notes, tree };
    } catch (error) {
      throw error;
    }
  });

  // Let renderer ask user to pick a .bib file and return its content
  ipcMain.handle('workspace:chooseBibFile', async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Select bibliography (.bib) file',
        buttonLabel: 'Open',
        filters: [{ name: 'BibTeX', extensions: ['bib'] }],
        properties: ['openFile']
      });

      if (canceled || !filePaths || !filePaths.length) return { canceled: true };
      const bibPath = filePaths[0];
      const content = await fsp.readFile(bibPath, { encoding: 'utf8' });
      return { canceled: false, filePath: bibPath, content };
    } catch (error) {
      return { canceled: true, error: error?.message };
    }
  });

  ipcMain.handle('workspace:loadAtPath', async (event, payload) => {
    if (!payload || !payload.folderPath) {
      return null;
    }

    try {
      const { notes, tree } = await loadFolderNotes(payload.folderPath, payload.fileSizeLimits);
      
      // Start file watcher for this workspace
      const mainWindow = BrowserWindow.fromWebContents(event.sender);
      if (mainWindow) {
        startFileWatcher(payload.folderPath, mainWindow);
      }
      
      return { folderPath: payload.folderPath, notes, tree };
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('workspace:saveExternalMarkdown', async (_event, payload) => {
    if (!payload || !payload.filePath) {
      return false;
    }

    await saveMarkdownFile(payload.filePath, payload.content ?? '');
    return true;
  });

  // Save a notebook (.ipynb) file from renderer. Payload: { filePath, notebook }
  ipcMain.handle('workspace:saveNotebook', async (_event, payload) => {
    if (!payload || !payload.filePath || !payload.notebook) {
      throw new Error('Invalid payload for saveNotebook');
    }

    try {
      // Ensure parent directory exists
      await fsp.mkdir(path.dirname(payload.filePath), { recursive: true });
      // Build minimal notebook structure
      const notebookObj = {
        nbformat: 4,
        nbformat_minor: 5,
        metadata: payload.notebook.metadata || {},
        cells: Array.isArray(payload.notebook.cells) ? payload.notebook.cells.map((c) => {
          return {
            cell_type: c.type === 'markdown' ? 'markdown' : 'code',
            metadata: c.metadata || {},
            source: Array.isArray(c.source) ? c.source : String(c.source || '').split('\n').map((l, i, a) => i === a.length - 1 ? l : l + '\n'),
            outputs: c.outputs && Array.isArray(c.outputs) ? c.outputs.map((o) => ({ output_type: 'execute_result', data: { 'text/plain': o }, metadata: {} })) : []
          };
        }) : []
      };

      await fsp.writeFile(payload.filePath, JSON.stringify(notebookObj, null, 2), 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('workspace:createMarkdownFile', async (_event, payload) => {
    if (!payload || !payload.folderPath || !payload.fileName) {
      return null;
    }

    try {
      // Require the folder manager at call time to avoid potential module resolution or
      // initialization ordering issues that can lead to a ReferenceError.
      const folderManager = require('./store/folderManager');
      if (typeof folderManager.createMarkdownFile !== 'function') {
        throw new Error('createMarkdownFile is not available');
      }
      return await folderManager.createMarkdownFile(payload.folderPath, payload.fileName, payload.content || '');
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('workspace:renameMarkdownFile', async (_event, payload) => {
    if (!payload || !payload.workspaceFolder || !payload.oldPath || !payload.newFileName) {
      return null;
    }

    try {
      const folderManager = require('./store/folderManager');
      if (typeof folderManager.renameMarkdownFile !== 'function') {
        throw new Error('renameMarkdownFile is not available');
      }
      return await folderManager.renameMarkdownFile(payload.workspaceFolder, payload.oldPath, payload.newFileName);
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('workspace:readPdfBinary', async (_event, payload) => {
    if (!payload || !payload.absolutePath) {
      return null;
    }

    try {
      // Use the folderManager helper to read a PDF as a Buffer
      const buf = await readPdfBuffer(payload.absolutePath);
      return buf;
    } catch (error) {
      return null;
    }
  });

  ipcMain.handle('workspace:resolveResource', async (_event, payload) => {
    const { src, notePath, folderPath } = payload || {};

    try { console.log('resolveResource called', { src, notePath, folderPath }); } catch (e) {}

    if (!src || typeof src !== 'string') {
      return { value: null };
    }

    const trimmed = src.trim();
    if (!trimmed) {
      return { value: null };
    }

    if (protocolPattern.test(trimmed) || protocolRelativePattern.test(trimmed)) {
      return { value: trimmed };
    }

    let baseDir = null;
    if (notePath && typeof notePath === 'string') {
      baseDir = path.dirname(notePath);
    } else if (folderPath && typeof folderPath === 'string') {
      baseDir = folderPath;
    }

    let absolutePath = trimmed;
    if (!path.isAbsolute(absolutePath)) {
      if (!baseDir) {
        return { value: null };
      }
      absolutePath = path.resolve(baseDir, absolutePath);
    }

    try { console.log('resolveResource: resolved absolutePath', { absolutePath }); } catch (e) {}

    try {
      // Ensure the file exists and is accessible before attempting to read it.
      try {
        const st = await fsp.stat(absolutePath);
        try { console.log('resolveResource: stat succeeded', { absolutePath, isFile: st.isFile() }); } catch (e) {}
        if (!st.isFile()) {
          return { value: null };
        }
      } catch (statErr) {
        try { console.log('resolveResource: stat failed', { absolutePath, error: String(statErr) }); } catch (e) {}
        // File does not exist or is inaccessible
        return { value: null };
      }

      const buffer = await fsp.readFile(absolutePath);
      let mimeType;
      
      if (isImageFile(absolutePath)) {
        mimeType = getImageMimeType(absolutePath);
      } else if (isVideoFile(absolutePath)) {
        mimeType = getVideoMimeType(absolutePath);
      } else if (isHtmlFile(absolutePath)) {
        mimeType = getHtmlMimeType(absolutePath);
      } else if (path.extname(absolutePath).toLowerCase() === '.pdf') {
        // PDFs should be returned with the proper mime type so renderer
        // can treat them as data:application/pdf;base64,... resources.
        mimeType = 'application/pdf';
      } else {
        // For other files, try to determine mime type or default
        mimeType = 'application/octet-stream';
      }
      
      return {
        value: `data:${mimeType};base64,${buffer.toString('base64')}`,
        mimeType
      };
    } catch (error) {
      return { value: null };
    }
  });

  ipcMain.handle('preview:exportPdf', async (_event, payload) => {
    const html = typeof payload?.html === 'string' ? payload.html : '';
    if (!html.trim()) {
      throw new Error('Nothing to export. The preview is empty.');
    }

  const noteTitle = sanitizeFileName(payload?.title ?? 'Preview');

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export preview as PDF',
      defaultPath: `${noteTitle}.pdf`,
      filters: [{ name: 'PDF document', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    const exportWindow = new BrowserWindow({
      show: false,
      width: 900,
      height:  1200,
      webPreferences: {
        sandbox: false,
        offscreen: true,
               backgroundThrottling: false
      }
    });

    const stylesPath = path.join(__dirname, 'renderer', 'styles.css');
    const katexPath = path.join(__dirname, '..', 'node_modules', 'katex', 'dist', 'katex.min.css');
    const rootVariables = `        --bg: #ffffff;
        --bg-elevated: #ffffff;
        --bg-sidebar: #f1f3f5;
        --border: rgba(20, 23, 26, 0.08);
        --border-strong: rgba(20, 23, 26, 0.14);
        --fg: #111111;
        --fg-soft: rgba(17, 17, 17, 0.64);
        --accent: #264de4;
        --accent-weak: rgba(38, 77, 228, 0.12);
        --danger: #d12c2c;`;
    const bodyBackground = '#ffffff';
    const bodyColor = '#111111';

    const baseTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${noteTitle}</title>
    <style>
      :root {
        color-scheme: light;
${rootVariables}
      }
      body {
        margin: 48px 64px;
        padding: 0;
        background: ${bodyBackground};
        color: ${bodyColor};
        font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .preview-export {
        max-width: 720px;
        margin: 0 auto;
      }
      .preview-export .preview-scroll {
        background: #ffffff !important;
        box-shadow: none !important;
        padding: 24px;
        color: ${bodyColor};
      }
      /* Ensure links are visible and printed in color */
      a, a:link, a:visited {
        color: #1a73e8 !important;
        text-decoration: underline !important;
        -webkit-text-size-adjust: 100%;
        -webkit-print-color-adjust: exact !important;
      }
    </style>
  </head>
  <body>
    <main class="preview-export">
      <article class="preview-scroll">${html}</article>
    </main>
  </body>
</html>`;

    try {
      await new Promise((resolve, reject) => {
        exportWindow.webContents.once('did-finish-load', resolve);
        exportWindow.webContents.once('did-fail-load', (_event, code, description) => {
          reject(new Error(description || `Failed to load export document (${code})`));
        });
        exportWindow.loadURL(`data:text/html;base64,${Buffer.from(baseTemplate).toString('base64')}`);
      });

      await exportWindow.webContents.executeJavaScript('document.fonts ? document.fonts.ready : Promise.resolve()');

      const pdfBuffer = await exportWindow.webContents.printToPDF({
        marginsType: 0,
        printBackground: true,
        landscape: false,
        preferCSSPageSize: true
      });

      await fsp.writeFile(filePath, pdfBuffer);

      return { filePath };
    } finally {
      if (!exportWindow.isDestroyed()) {
        exportWindow.destroy();
      }
    }
  });

  ipcMain.handle('preview:exportHtml', async (_event, payload) => {
    const html = typeof payload?.html === 'string' ? payload.html : '';
    if (!html.trim()) {
      throw new Error('Nothing to export. The preview is empty.');
    }

    const noteTitle = sanitizeFileName(payload?.title ?? 'Preview');

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export preview as HTML',
      defaultPath: `${noteTitle}.html`,
      filters: [{ name: 'HTML document', extensions: ['html'] }]
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    try {
      // Read the app's CSS file for styling
      const stylesPath = path.join(__dirname, 'renderer', 'styles.css');
      const katexPath = path.join(__dirname, '..', 'node_modules', 'katex', 'dist', 'katex.min.css');
      
      let appStyles = '';
      let katexStyles = '';
      
      try {
        appStyles = await fsp.readFile(stylesPath, 'utf-8');
        katexStyles = await fsp.readFile(katexPath, 'utf-8');
      } catch (error) {
      }

      // Process HTML to make embedded content self-contained
      let processedHtml = html;
      
      // Convert relative HTML file references to inline content
      const htmlIframeRegex = /<iframe([^>]*src=")([^"]*\.html?)("[^>]*>)/gi;
      let match;
      
      while ((match = htmlIframeRegex.exec(html)) !== null) {
        const fullMatch = match[0];
        const beforeSrc = match[1];
        const srcPath = match[2];
        const afterSrc = match[3];
        
        try {
          // Resolve the HTML file path
          const resolvedPath = path.resolve(payload.folderPath || process.cwd(), srcPath);
          const stats = await fsp.stat(resolvedPath);
          
          if (stats.isFile()) {
            // Read the HTML content
            const htmlContent = await fsp.readFile(resolvedPath, 'utf-8');
            
            // Extract iframe attributes for styling
            const iframeMatch = fullMatch.match(/<iframe([^>]*?)>/);
            const iframeAttrs = iframeMatch ? iframeMatch[1] : '';
            
            // Parse width, height, and other styling attributes
            const widthMatch = iframeAttrs.match(/width=["']([^"']+)["']/);
            const heightMatch = iframeAttrs.match(/height=["']([^"']+)["']/);
            const classMatch = iframeAttrs.match(/class=["']([^"']+)["']/);
            const styleMatch = iframeAttrs.match(/style=["']([^"']+)["']/);
            
            const width = widthMatch ? widthMatch[1] : '100%';
            const height = heightMatch ? heightMatch[1] : '400px';
            const className = classMatch ? classMatch[1] : '';
            const style = styleMatch ? styleMatch[1] : '';
            
            // Create a data URL for the HTML content
            const htmlBlob = Buffer.from(htmlContent, 'utf-8').toString('base64');
            const dataUrl = `data:text/html;base64,${htmlBlob}`;
            
            // Create an iframe with the data URL to maintain JavaScript isolation
            const embeddedIframe = `<iframe src="${dataUrl}" class="embedded-html-iframe ${className}" style="width: ${width}; height: ${height}; border: 1px solid #ddd; border-radius: 4px; ${style}" sandbox="allow-scripts"></iframe>`;
            
            processedHtml = processedHtml.replace(fullMatch, embeddedIframe);
          }
        } catch (error) {
        }
      }
      
      // Convert relative video references to absolute file:// URLs
      const videoRegex = /<video([^>]*src=")([^"]*?)("[^>]*>)/gi;
      while ((match = videoRegex.exec(html)) !== null) {
        const beforeSrc = match[1];
        const srcPath = match[2];
        const afterSrc = match[3];
        
        if (!srcPath.startsWith('http') && !srcPath.startsWith('data:') && !srcPath.startsWith('file://')) {
          try {
            const resolvedPath = path.resolve(payload.folderPath || process.cwd(), srcPath);
            const stats = await fsp.stat(resolvedPath);
            if (stats.isFile()) {
              // Replace with absolute file:// URL
              const absoluteUrl = `file://${resolvedPath}`;
              const newVideo = `<video${beforeSrc}${absoluteUrl}${afterSrc}`;
              processedHtml = processedHtml.replace(match[0], newVideo);
            }
          } catch (error) {
          }
        }
      }
      
      // Create the complete HTML document
      const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${noteTitle}</title>
    <style>
      /* KaTeX Styles */
      ${katexStyles}
      
      /* App Styles */
      ${appStyles}
      
      /* Export-specific styles */
      :root {
        --bg: #ffffff;
        --bg-elevated: #ffffff;
        --bg-sidebar: #f1f3f5;
        --border: rgba(20, 23, 26, 0.08);
        --border-strong: rgba(20, 23, 26, 0.14);
        --fg: #111111;
        --fg-soft: rgba(17, 17, 17, 0.64);
        --accent: #264de4;
        --accent-weak: rgba(38, 77, 228, 0.12);
        --danger: #d12c2c;
        color-scheme: light;
      }
      
      body {
        background: #ffffff;
        color: #111111;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 40px;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .preview-export {
        background: white;
        width: 100%;
      }
      
      /* Ensure videos are responsive in export */
      video {
        max-width: 100%;
        height: auto;
      }
      
      /* Style for embedded HTML iframes */
      .embedded-html-iframe {
        margin: 20px 0;
        background: white;
        display: block;
      }
      
      /* Remove app-specific layout styles that don't apply to export */
      .workspace__content,
      .sidebar-resize-handle,
      .explorer {
        display: none !important;
      }
    </style>
    <script>
      // Handle iframe resize messages from embedded content
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'iframe-resize') {
          // Find the iframe that sent the message and resize it
          const iframes = document.querySelectorAll('.embedded-html-iframe');
          iframes.forEach(iframe => {
            if (iframe.contentWindow === event.source) {
              iframe.style.height = event.data.height + 'px';
            }
          });
        }
      });
    </script>
</head>
<body>
    <main class="preview-export">
        <article class="preview-scroll">
            ${processedHtml}
        </article>
    </main>
</body>
</html>`;

      // Write the HTML file
      await fsp.writeFile(filePath, completeHtml, 'utf-8');

      return { filePath };
    } catch (error) {
      throw new Error(`Failed to export HTML: ${error.message}`);
    }
  });

  ipcMain.handle('preview:exportDocx', async (_event, payload) => {
    const html = typeof payload?.html === 'string' ? payload.html : '';
    if (!html.trim()) {
      throw new Error('Nothing to export. The preview is empty.');
    }

    const noteTitle = sanitizeFileName(payload?.title ?? 'Preview');

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export preview as Word document',
      defaultPath: `${noteTitle}.docx`,
      filters: [{ name: 'Word document', extensions: ['docx'] }]
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    try {
      // Convert HTML to DOCX
      const doc = new Document({
        sections: [{
          properties: {},
          children: await htmlToDocxChildren(html, payload.folderPath)
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      await fsp.writeFile(filePath, buffer);

      return { filePath };
    } catch (error) {
      throw new Error(`Failed to export DOCX: ${error.message}`);
    }
  });

  ipcMain.handle('preview:exportEpub', async (_event, payload) => {
    const html = typeof payload?.html === 'string' ? payload.html : '';
    if (!html.trim()) {
      throw new Error('Nothing to export. The preview is empty.');
    }

    const noteTitle = sanitizeFileName(payload?.title ?? 'Preview');

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export preview as EPUB ebook',
      defaultPath: `${noteTitle}.epub`,
      filters: [{ name: 'EPUB ebook', extensions: ['epub'] }]
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    try {
      // Create EPUB
      const options = {
        title: noteTitle,
        author: 'NoteTakingApp',
        content: [{
          title: noteTitle,
          data: html
        }]
      };

      await new Epub(options, filePath).promise;

      return { filePath };
    } catch (error) {
      throw new Error(`Failed to export EPUB: ${error.message}`);
    }
  });

  ipcMain.handle('workspace:revealInFinder', async (_event, filePath) => {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path');
    }

    try {
      // Check if file exists before trying to reveal it
      await fsp.access(filePath);
      shell.showItemInFolder(filePath);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to reveal file in Finder: ${error.message}`);
    }
  });

  ipcMain.handle('workspace:deleteFile', async (_event, filePath) => {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path');
    }

    try {
      // Check if file exists
      await fsp.access(filePath);
      
      // Move to trash instead of permanently deleting
      await shell.trashItem(filePath);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  });

  ipcMain.handle('workspace:pasteFile', async (_event, payload) => {
    const { sourcePath, targetDirectory, operation } = payload;
    
    if (!sourcePath || !targetDirectory || !operation) {
      throw new Error('Invalid paste parameters');
    }

    if (operation !== 'cut' && operation !== 'copy') {
      throw new Error('Invalid operation. Must be "cut" or "copy"');
    }

    try {
      // Check if source file exists
      await fsp.access(sourcePath);
      
      // Get the filename from the source path
      const fileName = path.basename(sourcePath);
      const targetPath = path.join(targetDirectory, fileName);
      
      // Check if target already exists and generate a unique name if needed
      let finalTargetPath = targetPath;
      let counter = 1;
      
      while (true) {
        try {
          await fsp.access(finalTargetPath);
          // File exists, generate a new name
          const ext = path.extname(fileName);
          const nameWithoutExt = path.basename(fileName, ext);
          finalTargetPath = path.join(targetDirectory, `${nameWithoutExt} ${counter}${ext}`);
          counter++;
        } catch {
          // File doesn't exist, we can use this path
          break;
        }
      }

      if (operation === 'copy') {
        // Copy the file
        await fsp.copyFile(sourcePath, finalTargetPath);
      } else if (operation === 'cut') {
        // Move the file
        await fsp.rename(sourcePath, finalTargetPath);
      }

      return { 
        success: true, 
        targetPath: finalTargetPath,
        operation 
      };
    } catch (error) {
      throw new Error(`Failed to ${operation} file: ${error.message}`);
    }
  });

  // Import font bytes from renderer and save to userData/fonts
  ipcMain.handle('fonts:import', async (_event, payload) => {
    try {
      if (!payload || !payload.buffer || !payload.filename) {
        throw new Error('Invalid font payload');
      }

      const userData = app.getPath('userData');
      const fontsDir = path.join(userData, 'fonts');
      await fsp.mkdir(fontsDir, { recursive: true });

      // Sanitize filename
      const original = path.basename(payload.filename);
      const safeName = original.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
      const destPath = path.join(fontsDir, safeName);

      // Convert buffer (which may be a plain object) into a Buffer
      let buf;
      if (Buffer.isBuffer(payload.buffer)) {
        buf = payload.buffer;
      } else if (payload.buffer && payload.buffer.data) {
        // When transferred via structured clone, Node gets an object with 'data' array
        buf = Buffer.from(payload.buffer.data);
      } else {
        buf = Buffer.from(payload.buffer);
      }

      await fsp.writeFile(destPath, buf);

      // Create a file:// URL for renderer use
      const fileUrl = toFileUrl(destPath);

      // Generate a font-family identifier based on displayName or filename
      const display = (payload.displayName || path.parse(safeName).name).replace(/[^a-zA-Z0-9\- ]/g, '').slice(0, 60) || 'ImportedFont';
      const familyName = `NTA-${display.replace(/\s+/g, '-')}`;

      return { success: true, path: destPath, url: fileUrl, family: familyName };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Traffic light positioning handlers
  ipcMain.handle('window:setTrafficLightPosition', async (_event, position) => {
    const windows = BrowserWindow.getAllWindows();
    const mainWindow = windows[0];
    
    if (!mainWindow || process.platform !== 'darwin') {
      return { success: false, reason: 'macOS only feature' };
    }

    try {
      const options = {};
      
      // Position can be a string ('center'|'top-left'|'custom') or an object {x,y,mode:'absolute'}
      if (position && typeof position === 'object' && position.mode === 'absolute') {
        options.trafficLightPosition = { x: position.x, y: position.y };
      } else {
        switch (position) {
          case 'center':
            options.trafficLightPosition = { x: 20, y: 12 };
            break;
          case 'top-left':
            options.trafficLightPosition = { x: 12, y: 8 };
            break;
          case 'custom':
            // Main process cannot access window.localStorage. Use a sensible default here.
            // The renderer will call 'window:setTrafficLightOffset' separately when the user adjusts the slider.
            options.trafficLightPosition = { x: 12, y: 8 };
            break;
          default:
            options.trafficLightPosition = { x: 20, y: 12 };
        }
      }
      
      // Apply the new position
      mainWindow.setWindowButtonPosition(options.trafficLightPosition);
      
      return { success: true, position, options };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('window:setTrafficLightOffset', async (_event, offset) => {
    const windows = BrowserWindow.getAllWindows();
    const mainWindow = windows[0];
    
    if (!mainWindow || process.platform !== 'darwin') {
      return { success: false, reason: 'macOS only feature' };
    }

    try {
      const position = { x: 12, y: parseInt(offset) };
      mainWindow.setWindowButtonPosition(position);
      
      return { success: true, offset, position };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('window:setTitle', async (event, title) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.setTitle(title);
      return { success: true };
    }
    return { success: false, error: 'Window not found' };
  });
  // If running in dev with the test hook enabled, execute the custom updater once
  try {
    if (process.env.NTA_TEST_CUSTOM_UPDATER === '1') {
      console.log('Dev hook: running performCustomUpdate() (NTA_TEST_CUSTOM_UPDATER=1)');
      performCustomUpdate({ preferUserApplications: false }).then((res) => {
        console.log('performCustomUpdate result:', res);
      }).catch((e) => {
        console.error('performCustomUpdate failed:', e);
      });
    }
  } catch (e) {
    console.error('maybeRunDevCustomUpdater invocation failed:', e);
  }
  // end bootstrap
  // Create the main window when the app is ready
  createMainWindow();
};


app.whenReady().then(bootstrap);

app.on('window-all-closed', () => {
  // Clean up file watcher
  stopFileWatcher();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Clean up file watcher before quitting
  stopFileWatcher();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

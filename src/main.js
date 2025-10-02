const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const { createNotesStore } = require('./store/notesStore');
const {
  loadFolderNotes,
  createMarkdownFile,
  readPdfAsDataUri: readExternalPdfAsDataUri,
  readPdfBuffer: readExternalPdfBuffer,
  saveMarkdownFile,
  renameMarkdownFile
} = require('./store/folderManager');

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
      const isDirectory = !path.extname(filename);
      const isMediaFile = filename.match(/\.(html?|mp4|webm|ogg|avi|mov|wmv|jpg|jpeg|png|gif|svg|webp)$/i);
      
      // Only trigger updates for files that affect the workspace structure or are new/deleted
      if ((isMarkdown || isDirectory || isMediaFile) && (eventType === 'rename')) {
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
            console.error('Failed to refresh workspace after file change:', error);
          }
        }, 2000); // Increased from 300ms to 2000ms
      }
    });
    
    currentWatchedPath = folderPath;
    console.log(`Started watching folder: ${folderPath}`);
  } catch (error) {
    console.error('Failed to start file watcher:', error);
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
  const windowOptions = {
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
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
  } else if (process.platform === 'win32') {
    // Windows specific
    windowOptions.autoHideMenuBar = true;
    windowOptions.icon = path.join(__dirname, '..', 'assets', 'icon.ico');
  } else {
    // Linux specific
    windowOptions.icon = path.join(__dirname, '..', 'assets', 'icon.png');
  }

  mainWindow = new BrowserWindow(windowOptions);

  const startPage = path.join(__dirname, 'renderer', 'index.html');
  mainWindow.loadFile(startPage);

  // Forward renderer console messages to the main process terminal in development
  try {
    mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
      const levels = ['debug', 'info', 'warn', 'error'];
      const lvl = levels[level] ?? `level-${level}`;
      console.log(`[renderer:${lvl}] ${message} (${sourceId}:${line})`);
    });
  } catch (err) {
    // Older/newer electron versions may not emit console-message; ignore if unsupported
  }

  // Also listen for the 'console' event if available (newer electron versions)
  try {
    mainWindow.webContents.on('console', (event, level, ...args) => {
      // Level may be 'log', 'warn', 'error', etc.
      console.log('[renderer:console]', level, ...args);
    });
  } catch (err) {
    // ignore if not supported
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
};

// Auto-updater configuration
const setupAutoUpdater = () => {
  // Configure auto-updater for GitHub releases
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'Maurone7',
    repo: 'NoteTakingApp'
  });

  // Auto-updater events
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version);
    // Notify user about available update
    if (mainWindow) {
      mainWindow.webContents.send('update-available', info);
    }
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.');
  });

  autoUpdater.on('error', (err) => {
    console.log('Error in auto-updater:', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = `Download speed: ${progressObj.bytesPerSecond}`;
    log_message += ` - Downloaded ${progressObj.percent}%`;
    log_message += ` (${progressObj.transferred}/${progressObj.total})`;
    console.log(log_message);
    
    // Send progress to renderer
    if (mainWindow) {
      mainWindow.webContents.send('update-progress', progressObj);
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded');
    // Notify user that update is ready to install
    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded', info);
    }
  });

  // Check for updates on app start (after 3 seconds delay)
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 3000);

  // Check for updates every 4 hours
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 4 * 60 * 60 * 1000);
};

const bootstrap = async () => {
  notesStore = createNotesStore(app.getPath('userData'));
  await notesStore.initialize();

  // Configure auto-updater
  setupAutoUpdater();

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
      return readExternalPdfAsDataUri(absolutePath);
    }

    return notesStore.readPdfAsDataUri(storedPath);
  });

  ipcMain.handle('notes:paths', async () => {
    return notesStore.getPaths();
  });

  // Update handlers
  ipcMain.handle('app:checkForUpdates', async () => {
    try {
      return await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      console.error('Error checking for updates:', error);
      return { error: error.message };
    }
  });

  ipcMain.handle('app:quitAndInstall', async () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.handle('app:getVersion', async () => {
    return app.getVersion();
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
      const { notes, tree } = await loadFolderNotes(folderPath);
      return { folderPath, notes, tree };
    } catch (error) {
      console.error(`Failed to load folder contents for ${folderPath}`, error);
      throw error;
    }
  });

  ipcMain.handle('workspace:loadAtPath', async (event, payload) => {
    if (!payload || !payload.folderPath) {
      return null;
    }

    try {
      const { notes, tree } = await loadFolderNotes(payload.folderPath);
      
      // Start file watcher for this workspace
      const mainWindow = BrowserWindow.fromWebContents(event.sender);
      if (mainWindow) {
        startFileWatcher(payload.folderPath, mainWindow);
      }
      
      return { folderPath: payload.folderPath, notes, tree };
    } catch (error) {
      console.error(`Failed to load workspace at ${payload.folderPath}`, error);
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

  ipcMain.handle('workspace:createMarkdownFile', async (_event, payload) => {
    if (!payload || !payload.folderPath || !payload.fileName) {
      return null;
    }

    try {
      return await createMarkdownFile(payload.folderPath, payload.fileName);
    } catch (error) {
      console.error('Failed to create markdown file', error);
      throw error;
    }
  });

  ipcMain.handle('workspace:renameMarkdownFile', async (_event, payload) => {
    if (!payload || !payload.workspaceFolder || !payload.oldPath || !payload.newFileName) {
      return null;
    }

    try {
      return await renameMarkdownFile(payload.workspaceFolder, payload.oldPath, payload.newFileName);
    } catch (error) {
      console.error('Failed to rename markdown file', error);
      throw error;
    }
  });

  ipcMain.handle('workspace:readPdfBinary', async (_event, payload) => {
    if (!payload || !payload.absolutePath) {
      return null;
    }

    return readExternalPdfBuffer(payload.absolutePath);
  });

  ipcMain.handle('workspace:resolveResource', async (_event, payload) => {
    const { src, notePath, folderPath } = payload || {};

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

    try {
      const buffer = await fsp.readFile(absolutePath);
      let mimeType;
      
      if (isImageFile(absolutePath)) {
        mimeType = getImageMimeType(absolutePath);
      } else if (isVideoFile(absolutePath)) {
        mimeType = getVideoMimeType(absolutePath);
      } else if (isHtmlFile(absolutePath)) {
        mimeType = getHtmlMimeType(absolutePath);
      } else {
        // For other files, try to determine mime type or default
        mimeType = 'application/octet-stream';
      }
      
      return {
        value: `data:${mimeType};base64,${buffer.toString('base64')}`,
        mimeType
      };
    } catch (error) {
      console.warn(`Failed to resolve resource ${absolutePath}`, error);
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
      height: 1200,
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
    <link rel="stylesheet" href="${toFileUrl(stylesPath)}" />
    <link rel="stylesheet" href="${toFileUrl(katexPath)}" />
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
        exportWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(baseTemplate)}`);
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
        console.warn('Failed to read CSS files for export:', error);
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
          console.warn(`Failed to embed HTML file ${srcPath}:`, error);
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
            console.warn(`Failed to resolve video path ${srcPath}:`, error);
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
          console.log('Embedded content resize message received:', event.data);
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
      console.error('fonts:import failed', error);
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
      console.error('Failed to set traffic light position:', error);
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
      console.error('Failed to set traffic light offset:', error);
      return { success: false, error: error.message };
    }
  });

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

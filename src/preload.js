```javascript
const { contextBridge, ipcRenderer } = require('electron');

const api = {
  loadNotes: () => ipcRenderer.invoke('notes:load'),
  saveNotes: (notes) => ipcRenderer.invoke('notes:save', notes),
  selectPdf: () => ipcRenderer.invoke('notes:selectPdf'),
  loadPdfData: (payload) => ipcRenderer.invoke('notes:loadPdfData', payload),
  chooseFolder: () => ipcRenderer.invoke('workspace:chooseFolder'),
  loadWorkspaceAtPath: (data) => ipcRenderer.invoke('workspace:loadAtPath', data),
  saveExternalMarkdown: (data) => ipcRenderer.invoke('workspace:saveExternalMarkdown', data),
  // Save a notebook (.ipynb). Payload: { filePath, notebook }
  saveNotebook: (data) => ipcRenderer.invoke('workspace:saveNotebook', data),
  createMarkdownFile: (data) => ipcRenderer.invoke('workspace:createMarkdownFile', data),
  readBibliography: (data) => ipcRenderer.invoke('workspace:readBibliography', data),
  openFileChooser: () => ipcRenderer.invoke('workspace:chooseBibFile'),
  renameMarkdownFile: (data) => ipcRenderer.invoke('workspace:renameMarkdownFile', data),
  readPdfBinary: (data) => ipcRenderer.invoke('workspace:readPdfBinary', data),
  resolveResource: (data) => ipcRenderer.invoke('workspace:resolveResource', data),
  getPaths: () => ipcRenderer.invoke('notes:paths'),
  exportPreviewPdf: (data) => ipcRenderer.invoke('preview:exportPdf', data),
  exportPreviewHtml: (data) => ipcRenderer.invoke('preview:exportHtml', data),
  exportPreviewDocx: (data) => ipcRenderer.invoke('preview:exportDocx', data),
  exportPreviewEpub: (data) => ipcRenderer.invoke('preview:exportEpub', data),
  revealInFinder: (path) => ipcRenderer.invoke('workspace:revealInFinder', path),
  deleteFile: (path) => ipcRenderer.invoke('workspace:deleteFile', path),
  pasteFile: (data) => ipcRenderer.invoke('workspace:pasteFile', data),
  // Debug helper: append a JSON line to a temp logfile (useful when console forwarding is unavailable)
  writeDebugLog: (payload) => ipcRenderer.invoke('debug:write', payload),
  readReplaceLog: () => ipcRenderer.invoke('debug:readReplaceLog'),
  listWorkspaceDebug: () => ipcRenderer.invoke('debug:listWorkspaceDebug'),
  readWorkspaceDebugFile: (filename) => ipcRenderer.invoke('debug:readWorkspaceDebugFile', filename),
  killWorkspaceReplacer: () => ipcRenderer.invoke('debug:killWorkspaceReplacer'),
  openWorkspaceReplacedApp: () => ipcRenderer.invoke('debug:openWorkspaceReplacedApp'),
  killWorkspaceReplacer: () => ipcRenderer.invoke('debug:killWorkspaceReplacer'),
  openWorkspaceReplacedApp: () => ipcRenderer.invoke('debug:openWorkspaceReplacedApp'),
  
  // Set window title
  setTitle: (title) => ipcRenderer.invoke('window:setTitle', title),
  
  // Traffic light positioning
  setTrafficLightPosition: (position) => ipcRenderer.invoke('window:setTrafficLightPosition', position),
  setTrafficLightOffset: (offset) => ipcRenderer.invoke('window:setTrafficLightOffset', offset),
  
  // Update methods
  checkForUpdates: () => ipcRenderer.invoke('app:checkForUpdates'),
  quitAndInstall: () => ipcRenderer.invoke('app:quitAndInstall'),
  // Note: download/update APIs removed - app no longer performs automatic downloads.
  // Custom in-app updater: verified download + progress events
  customCheckAndUpdate: (opts) => ipcRenderer.invoke('app:customCheckAndUpdate', opts || {}),
  
  // Dev-only check which queries GitHub directly (works in unpacked/dev mode)
  devCheckForUpdates: () => ipcRenderer.invoke('app:devCheckForUpdates'),
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  
  // Generic invoke for backward compatibility with existing renderer code
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  
  // IPC listeners
  onWorkspaceChanged: (callback) => {
    ipcRenderer.on('workspace:changed', (_event, data) => callback(data));
  },
  removeWorkspaceChangedListener: () => {
    ipcRenderer.removeAllListeners('workspace:changed');
  },
  
  // Update event listeners
  on: (channel, callback) => {
    const validChannels = ['update-available', 'update-progress', 'update-downloaded', 'update-not-available', 'update-error', 'workspace:changed', 'custom-update-progress', 'custom-update-started', 'custom-update-result', 'fallback-started', 'fallback-result', 'fallback-available', 'fallback-progress'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, data) => callback(data));
    }
  },
  removeListener: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
};

contextBridge.exposeInMainWorld('api', api);

// Expose a dedicated font importer that accepts a display name, filename and an ArrayBuffer
contextBridge.exposeInMainWorld('fontImporter', {
  importFont: async (displayName, filename, arrayBuffer) => {
    // We transfer the buffer to the main process; ipcRenderer will serialize the ArrayBuffer
    return ipcRenderer.invoke('fonts:import', { displayName, filename, buffer: arrayBuffer });
  }
});

```



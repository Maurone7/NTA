const { contextBridge, ipcRenderer } = require('electron');

const api = {
  loadNotes: () => ipcRenderer.invoke('notes:load'),
  saveNotes: (notes) => ipcRenderer.invoke('notes:save', notes),
  selectPdf: () => ipcRenderer.invoke('notes:selectPdf'),
  loadPdfData: (payload) => ipcRenderer.invoke('notes:loadPdfData', payload),
  chooseFolder: () => ipcRenderer.invoke('workspace:chooseFolder'),
  loadWorkspaceAtPath: (data) => ipcRenderer.invoke('workspace:loadAtPath', data),
  saveExternalMarkdown: (data) => ipcRenderer.invoke('workspace:saveExternalMarkdown', data),
  createMarkdownFile: (data) => ipcRenderer.invoke('workspace:createMarkdownFile', data),
  renameMarkdownFile: (data) => ipcRenderer.invoke('workspace:renameMarkdownFile', data),
  readPdfBinary: (data) => ipcRenderer.invoke('workspace:readPdfBinary', data),
  resolveResource: (data) => ipcRenderer.invoke('workspace:resolveResource', data),
  getPaths: () => ipcRenderer.invoke('notes:paths'),
  exportPreviewPdf: (data) => ipcRenderer.invoke('preview:exportPdf', data),
  exportPreviewHtml: (data) => ipcRenderer.invoke('preview:exportHtml', data),
  revealInFinder: (path) => ipcRenderer.invoke('workspace:revealInFinder', path),
  deleteFile: (path) => ipcRenderer.invoke('workspace:deleteFile', path),
  pasteFile: (data) => ipcRenderer.invoke('workspace:pasteFile', data),
  
  // Traffic light positioning
  setTrafficLightPosition: (position) => ipcRenderer.invoke('window:setTrafficLightPosition', position),
  setTrafficLightOffset: (offset) => ipcRenderer.invoke('window:setTrafficLightOffset', offset),
  
  // Update methods
  checkForUpdates: () => ipcRenderer.invoke('app:checkForUpdates'),
  quitAndInstall: () => ipcRenderer.invoke('app:quitAndInstall'),
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  
  // IPC listeners
  onWorkspaceChanged: (callback) => {
    ipcRenderer.on('workspace:changed', (_event, data) => callback(data));
  },
  removeWorkspaceChangedListener: () => {
    ipcRenderer.removeAllListeners('workspace:changed');
  },
  
  // Update event listeners
  on: (channel, callback) => {
    const validChannels = ['update-available', 'update-progress', 'update-downloaded', 'workspace:changed'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, data) => callback(data));
    }
  },
  removeListener: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
};

contextBridge.exposeInMainWorld('api', api);

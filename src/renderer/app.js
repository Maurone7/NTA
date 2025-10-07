// Helper to safely resolve a single element by id/selector, returning a harmless div when missing
const safeEl = (selector, useQuery = false) => {
  try {
    const found = useQuery ? document.querySelector(selector) : document.getElementById(selector);
    return found || document.createElement('div');
  } catch (e) {
    return document.createElement('div');
  }
};

// Helper to safely resolve a selector (querySelector) but fall back to a div if missing
const safeQuery = (selector) => {
  try { return document.querySelector(selector) || document.createElement('div'); } catch (e) { return document.createElement('div'); }
};

// Safe collection resolver (returns NodeList-like empty array if nothing matches)
const safeAll = (selector) => {
  try { const nodes = document.querySelectorAll(selector); return nodes && nodes.length ? nodes : []; } catch (e) { return []; }
};

// Lazy-load KaTeX (CSS + JS) when math rendering is first needed.
// This avoids shipping KaTeX at initial render time and makes startup lighter.
const ensureKaTeX = () => {
  try {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.katex) return Promise.resolve();
    if (ensureKaTeX._loading) return ensureKaTeX._loading;

    const cssHref = '../../node_modules/katex/dist/katex.min.css';
    const jsSrc = '../../node_modules/katex/dist/katex.min.js';

  ensureKaTeX._loading = new Promise((resolve, reject) => {
      try {
        // Inject stylesheet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
  link.onload = () => {
          // Then inject script
          const script = document.createElement('script');
          script.src = jsSrc;
          script.onload = () => resolve();
          script.onerror = (err) => reject(err);
          document.head.appendChild(script);
        };
  link.onerror = (err) => reject(err);
        document.head.appendChild(link);
      } catch (e) { reject(e); }
    });

    return ensureKaTeX._loading;
  } catch (e) { return Promise.resolve(); }
};

// Synchronous-friendly helper to render LaTeX when KaTeX is available.
// Returns rendered HTML string or null if KaTeX isn't loaded yet.
const renderLatexSync = (content, options = { throwOnError: false, displayMode: false }) => {
  try {
    if (window.katex && typeof window.katex.renderToString === 'function') {
      return window.katex.renderToString(content, options);
    }
  } catch (e) {}
  return null;
};

// Async helper to render LaTeX; ensures KaTeX is loaded first.
const renderLatex = async (content, options = { throwOnError: false, displayMode: false }) => {
  try {
    await ensureKaTeX();
    if (window.katex && typeof window.katex.renderToString === 'function') {
      return window.katex.renderToString(content, options);
    }
  } catch (e) {}
  return null;
};

// Global error handler to capture stack traces during development so we can find
// where uncaught exceptions (like setting innerHTML on null) originate.
if (typeof window !== 'undefined' && !window.__nta_global_error_handler_installed) {
  window.__nta_global_error_handler_installed = true;
  window.addEventListener('error', (evt) => {
    try {
  // Debug prints removed
  } catch (e) { }
  });
  window.addEventListener('unhandledrejection', (evt) => {
    try {
  // Debug prints removed
  } catch (e) { }
  });
}

const elements = {
  appShell: document.querySelector('.app-shell') || document.createElement('div'),
  workspaceTree: safeEl('workspace-tree'),
  workspaceContextMenu: safeEl('workspace-context-menu'),
  workspaceEmpty: safeEl('workspace-empty'),
  workspacePath: safeEl('workspace-path'),
  workspaceContent: document.querySelector('.workspace__content') || document.createElement('div'),
  workspaceSplitter: safeEl('workspace-splitter'),
  sidebarResizeHandle: document.querySelector('.sidebar-resize-handle') || document.createElement('div'),
  hashtagResizeHandle: safeEl('hashtag-resize-handle'),
  hashtagPanel: document.getElementById('hashtag-panel') || document.createElement('div'),
  hashtagList: document.getElementById('hashtag-list') || document.createElement('div'),
  hashtagEmpty: document.getElementById('hashtag-empty') || document.createElement('div'),
  hashtagDetail: document.getElementById('hashtag-detail') || document.createElement('div'),
  clearHashtagFilter: document.getElementById('clear-hashtag-filter') || document.createElement('button'),
  toggleHashtagMinimize: document.getElementById('toggle-hashtag-minimize') || document.createElement('button'),
  explorer: document.querySelector('.explorer') || document.createElement('div'),
  editor: document.getElementById('note-editor') || document.createElement('textarea'),
  editorRight: document.getElementById('note-editor-right') || document.createElement('textarea'),
  preview: document.getElementById('markdown-preview') || document.createElement('div'),
  pdfViewer: document.getElementById('pdf-viewer') || document.createElement('div'),
  codeViewer: document.getElementById('code-viewer') || document.createElement('div'),
  codeViewerCode: document.querySelector('#code-viewer code') || document.createElement('code'),
  imageViewer: document.getElementById('image-viewer') || document.createElement('div'),
  imageViewerImg: document.getElementById('image-viewer-img') || document.createElement('img'),
  imageViewerCaption: document.getElementById('image-viewer-caption') || document.createElement('div'),
  imageViewerError: document.getElementById('image-viewer-error') || document.createElement('div'),
  videoViewer: document.getElementById('video-viewer') || document.createElement('div'),
  videoViewerVideo: document.getElementById('video-viewer-video') || document.createElement('video'),
  videoViewerCaption: document.getElementById('video-viewer-caption') || document.createElement('div'),
  videoViewerError: document.getElementById('video-viewer-error') || document.createElement('div'),
  htmlViewer: document.getElementById('html-viewer') || document.createElement('div'),
  htmlViewerFrame: document.getElementById('html-viewer-frame') || document.createElement('iframe'),
  htmlViewerError: document.getElementById('html-viewer-error') || document.createElement('div'),
  wikiSuggestions: document.getElementById('wikilink-suggestions') || document.createElement('div'),
  hashtagSuggestions: document.getElementById('hashtag-suggestions') || document.createElement('div'),
  fileSuggestions: document.getElementById('file-suggestions') || document.createElement('div'),
  statusText: document.getElementById('status-text') || document.createElement('div'),
  mathPreviewPopup: document.getElementById('math-preview-popup') || document.createElement('div'),
  mathPreviewPopupContent: document.querySelector('#math-preview-popup .math-preview-popup__content') || document.createElement('div'),
  keybindingsList: document.getElementById('keybindings-list') || document.createElement('div'),
  // Citation modal elements
  citationModal: document.getElementById('citation-modal') || document.createElement('div'),
  citationSearchInput: document.getElementById('citation-search-input') || document.createElement('input'),
  citationList: document.getElementById('citation-list') || document.createElement('div'),
  // Buttons that open a folder (there may be one or more places that trigger open-folder)
  openFolderButtons: safeAll('#open-folder-button, .open-folder-button, [data-action="open-folder"]'),
  exportPdfOption: document.getElementById('export-pdf-option') || document.createElement('button'),
  exportHtmlOption: document.getElementById('export-html-option') || document.createElement('button'),
  settingsButton: document.getElementById('settings-button') || document.createElement('button'),
  settingsModal: document.getElementById('settings-modal') || document.createElement('div'),
  settingsClose: document.getElementById('settings-close') || document.createElement('button'),
  // Extra controls and helpers that many handlers expect
  renameFileForm: document.getElementById('rename-file-form') || document.createElement('form'),
  renameFileInput: document.getElementById('rename-file-input') || document.createElement('input'),
  insertCodeBlockButton: document.getElementById('insert-code-block-button') || document.createElement('button'),
  // Settings controls
  themeSelect: document.getElementById('theme-select') || document.createElement('select'),
  bgColorPicker: document.getElementById('bg-color-picker') || document.createElement('input'),
  resetBgColorButton: document.getElementById('reset-bg-color') || document.createElement('button'),
  fontFamilySelect: document.getElementById('font-family-select') || document.createElement('select'),
  fontPreviewSample: document.getElementById('font-preview-sample') || document.createElement('span'),
  resetFontFamilyButton: document.getElementById('reset-font-family') || document.createElement('button'),
  fontSizeSlider: document.getElementById('font-size-slider') || document.createElement('input'),
  fontSizeValue: document.getElementById('font-size-value') || document.createElement('span'),
  resetFontSizeButton: document.getElementById('reset-font-size') || document.createElement('button'),
  // New common settings
  autosaveToggle: document.getElementById('autosave-toggle') || document.createElement('input'),
  autosaveInterval: document.getElementById('autosave-interval') || document.createElement('input'),
  autosaveIntervalValue: document.getElementById('autosave-interval-value') || document.createElement('span'),
  spellcheckToggle: document.getElementById('spellcheck-toggle') || document.createElement('input'),
  softwrapToggle: document.getElementById('softwrap-toggle') || document.createElement('input'),
  defaultExportFormatSelect: document.getElementById('default-export-format-select') || document.createElement('select'),
  textColorPicker: document.getElementById('text-color-picker') || document.createElement('input'),
  resetTextColorButton: document.getElementById('reset-text-color') || document.createElement('button'),
  borderColorPicker: document.getElementById('border-color-picker') || document.createElement('input'),
  resetBorderColorButton: document.getElementById('reset-border-color') || document.createElement('button'),
  borderThicknessSlider: document.getElementById('border-thickness-slider') || document.createElement('input'),
  borderThicknessValue: document.getElementById('border-thickness-value') || document.createElement('span'),
  resetBorderThicknessButton: document.getElementById('reset-border-thickness') || document.createElement('button'),
  checkUpdatesButton: document.getElementById('check-updates-btn') || document.createElement('button'),
  // Debug replacer panel elements (may not exist in production UI)
  replacerStatus: document.getElementById('replacer-status') || document.createElement('div'),
  replacerOpenBtn: document.getElementById('replacer-open-btn') || document.createElement('button'),
  replacerKillBtn: document.getElementById('replacer-kill-btn') || document.createElement('button'),
  // New advanced settings
  autosaveIntervalSlider: document.getElementById('autosave-interval-slider') || document.createElement('input'),
  autosaveIntervalValue: document.getElementById('autosave-interval-value') || document.createElement('span'),
  resetAutosaveIntervalButton: document.getElementById('reset-autosave-interval') || document.createElement('button'),
  wordWrapToggle: document.getElementById('word-wrap-toggle') || document.createElement('input'),
  defaultFileExtensionSelect: document.getElementById('default-file-extension-select') || document.createElement('select'),
  showHiddenFilesToggle: document.getElementById('show-hidden-files-toggle') || document.createElement('input'),
  maxRecentFilesSlider: document.getElementById('max-recent-files-slider') || document.createElement('input'),
  maxRecentFilesValue: document.getElementById('max-recent-files-value') || document.createElement('span'),
  resetMaxRecentFilesButton: document.getElementById('reset-max-recent-files') || document.createElement('button'),
  maxImageSizeSlider: document.getElementById('max-image-size-slider') || document.createElement('input'),
  maxImageSizeValue: document.getElementById('max-image-size-value') || document.createElement('span'),
  resetMaxImageSizeButton: document.getElementById('reset-max-image-size') || document.createElement('button'),
  maxVideoSizeSlider: document.getElementById('max-video-size-slider') || document.createElement('input'),
  maxVideoSizeValue: document.getElementById('max-video-size-value') || document.createElement('span'),
  resetMaxVideoSizeButton: document.getElementById('reset-max-video-size') || document.createElement('button'),
  maxScriptSizeSlider: document.getElementById('max-script-size-slider') || document.createElement('input'),
  maxScriptSizeValue: document.getElementById('max-script-size-value') || document.createElement('span'),
  resetMaxScriptSizeButton: document.getElementById('reset-max-script-size') || document.createElement('button'),
  // Settings export/import
  exportSettingsBtn: document.getElementById('export-settings-btn') || document.createElement('button'),
  importSettingsBtn: document.getElementById('import-settings-btn') || document.createElement('button'),
  importSettingsInput: document.getElementById('import-settings-input') || document.createElement('input'),
  exportPreviewText: document.getElementById('export-preview-text') || document.createElement('textarea'),
  copySettingsBtn: document.getElementById('copy-settings-btn') || document.createElement('button'),
  downloadSettingsBtn: document.getElementById('download-settings-btn') || document.createElement('button'),
  // Export/preview helpers (some views reference these)
  exportPreviewButton: document.getElementById('export-preview-button') || document.createElement('button'),
  exportPreviewHtmlButton: document.getElementById('export-preview-html-button') || document.createElement('button'),
  exportDropdownButton: document.getElementById('export-dropdown-button') || document.createElement('button'),
  exportDropdownMenu: document.getElementById('export-dropdown-menu') || document.createElement('div'),
  exportPngOption: document.getElementById('export-png-option') || document.createElement('button'),
  exportJpgOption: document.getElementById('export-jpg-option') || document.createElement('button'),
  exportJpegOption: document.getElementById('export-jpeg-option') || document.createElement('button'),
  exportTiffOption: document.getElementById('export-tiff-option') || document.createElement('button'),
  // New feature buttons
  generateTocButton: document.getElementById('generate-toc-button') || document.createElement('button'),
  showStatsButton: document.getElementById('show-stats-button') || document.createElement('button'),
  citationStyleSelect: document.getElementById('citation-style-select') || document.createElement('select'),
  showTemplatesButton: document.getElementById('show-templates-button') || document.createElement('button'),
  // New modals
  tocModal: document.getElementById('toc-modal') || document.createElement('div'),
  tocClose: document.getElementById('toc-close') || document.createElement('button'),
  tocContent: document.getElementById('toc-content') || document.createElement('div'),
  tocInsert: document.getElementById('toc-insert') || document.createElement('button'),
  tocCopy: document.getElementById('toc-copy') || document.createElement('button'),
  statsModal: document.getElementById('stats-modal') || document.createElement('div'),
  statsClose: document.getElementById('stats-close') || document.createElement('button'),
  statsContent: document.getElementById('stats-content') || document.createElement('div'),
  // Templates modal
  templatesModal: document.getElementById('templates-modal') || document.createElement('div'),
  templatesClose: document.getElementById('templates-close') || document.createElement('button'),
  templatesContent: document.getElementById('templates-content') || document.createElement('div'),
  // Component settings
  componentSelector: document.getElementById('component-selector') || document.createElement('select'),
  componentUseGlobalBg: document.getElementById('component-use-global-bg') || document.createElement('input'),
  componentBgColorPicker: document.getElementById('component-bg-color-picker') || document.createElement('input'),
  resetComponentBgColorButton: document.getElementById('reset-component-bg-color') || document.createElement('button'),
  componentUseGlobalFont: document.getElementById('component-use-global-font') || document.createElement('input'),
  componentFontFamilySelect: document.getElementById('component-font-family-select') || document.createElement('select'),
  resetComponentFontFamilyButton: document.getElementById('reset-component-font-family') || document.createElement('button'),
  componentUseGlobalSize: document.getElementById('component-use-global-size') || document.createElement('input'),
  componentFontSizeSlider: document.getElementById('component-font-size-slider') || document.createElement('input'),
  resetComponentFontSizeButton: document.getElementById('reset-component-font-size') || document.createElement('button'),
  componentUseGlobalColor: document.getElementById('component-use-global-color') || document.createElement('input'),
  componentTextColorPicker: document.getElementById('component-text-color-picker') || document.createElement('input'),
  resetComponentTextColorButton: document.getElementById('reset-component-text-color') || document.createElement('button'),
  componentUseGlobalStyle: document.getElementById('component-use-global-style') || document.createElement('input'),
  componentFontStyleSelect: document.getElementById('component-font-style-select') || document.createElement('select'),
  componentShowPath: document.getElementById('titlebar-show-path') || document.createElement('input'),
  superAdvancedToggle: document.getElementById('super-advanced-toggle') || document.createElement('button'),
  fontImportInput: document.getElementById('font-import') || document.createElement('input'),
  fontImportBtn: document.getElementById('font-import-btn') || document.createElement('button'),
  appVersion: document.getElementById('app-version') || document.createElement('div'),
  // New UI pieces
  autosaveDot: document.getElementById('autosave-dot') || document.createElement('div'),
  autosaveText: document.getElementById('autosave-text') || document.createElement('div'),
  saveNowButton: document.getElementById('save-now-button') || document.createElement('button'),
  showLineNumbersToggle: document.getElementById('show-line-numbers') || document.createElement('input'),
  editorTabSizeSlider: document.getElementById('editor-tab-size-slider') || document.createElement('input'),
  editorTabSizeValue: document.getElementById('editor-tab-size-value') || document.createElement('span'),
  // Code popover helpers
  codePopover: document.getElementById('code-popover') || document.createElement('div'),
  codePopoverInput: document.getElementById('code-popover-input') || document.createElement('input'),
  codePopoverForm: document.getElementById('code-popover-form') || document.createElement('form'),
  codePopoverCancel: document.getElementById('code-popover-cancel') || document.createElement('button'),
  codePopoverSuggestions: document.getElementById('code-popover-suggestions') || document.createElement('div'),
  // Editor search controls
  editorSearch: document.getElementById('editor-search') || document.createElement('div'),
  editorSearchPrevButton: document.getElementById('editor-search-prev') || document.createElement('button'),
  editorSearchNextButton: document.getElementById('editor-search-next') || document.createElement('button'),
  editorSearchCloseButton: document.getElementById('editor-search-close') || document.createElement('button'),
  editorSearchCount: document.getElementById('editor-search-count') || document.createElement('div'),
  editorSearchHighlightsContent: document.getElementById('editor-search-highlights-content') || document.createElement('div'),
  editorSearchHighlights: document.getElementById('editor-search-highlights') || document.createElement('div'),
  toggleSidebarButton: document.getElementById('toggle-sidebar-button') || document.createElement('button'),
  togglePreviewButton: document.getElementById('toggle-preview-button') || document.createElement('button'),
  editorSearchInput: document.getElementById('editor-search-input') || document.createElement('input'),
  fileName: document.getElementById('file-name') || document.createElement('div'),
  filePath: document.getElementById('file-path') || document.createElement('div'),
  // New advanced settings elements
  previewScrollSyncToggle: document.getElementById('preview-scroll-sync-toggle') || document.createElement('input'),
  editorCursorStyleSelect: document.getElementById('editor-cursor-style-select') || document.createElement('select'),
  searchCaseSensitiveToggle: document.getElementById('search-case-sensitive-toggle') || document.createElement('input'),
  autocompleteDelaySlider: document.getElementById('autocomplete-delay-slider') || document.createElement('input'),
  autocompleteDelayValue: document.getElementById('autocomplete-delay-value') || document.createElement('span'),
  resetAutocompleteDelayButton: document.getElementById('reset-autocomplete-delay') || document.createElement('button'),
  fileTreeSortSelect: document.getElementById('file-tree-sort-select') || document.createElement('select'),
  mathRenderingQualitySelect: document.getElementById('math-rendering-quality-select') || document.createElement('select'),
  // Keybinding elements
  keybindingActionSelect: document.getElementById('keybinding-action-select') || document.createElement('select'),
  keybindingKeysInput: document.getElementById('keybinding-keys-input') || document.createElement('input'),
  addKeybindingBtn: document.getElementById('add-keybinding-btn') || document.createElement('button'),
  resetKeybindingsBtn: document.getElementById('reset-keybindings-btn') || document.createElement('button')
};

// Minimal implementations for new advanced settings handlers.
// These are intentionally lightweight: they persist the setting and
// call existing hooks where available. Keep them near the elements
// declaration so initialization event wiring won't throw.
function handlePreviewScrollSyncChange(event) {
  try {
    const enabled = !!(event && event.target && event.target.checked);
    localStorage.setItem('preview-scroll-sync', enabled);
    // If a sync function exists, call it; otherwise this is a no-op.
    if (typeof syncPreviewScroll === 'function' && enabled) {
  try { syncPreviewScroll(); } catch (e) { }
    }
  } catch (e) {
  // Debug prints removed
  }
}

function handleEditorCursorStyleChange(event) {
  try {
    const val = event && event.target ? event.target.value : 'line';
    localStorage.setItem('editor-cursor-style', val);
    // Apply a simple class to the editor area if present
    const ed = elements.editor;
    if (ed && ed.classList) {
      ed.classList.remove('cursor-block', 'cursor-line', 'cursor-underline');
      if (val === 'block') ed.classList.add('cursor-block');
      else if (val === 'underline') ed.classList.add('cursor-underline');
      else ed.classList.add('cursor-line');
    }
  } catch (e) { }
}

function handleSearchCaseSensitiveChange(event) {
  try {
    const enabled = !!(event && event.target && event.target.checked);
    localStorage.setItem('search-case-sensitive', enabled);
    // Re-run a search update if there is text in the search box
    if (elements.editorSearchInput && elements.editorSearchInput.value) {
      try { handleEditorSearchInput({ target: elements.editorSearchInput }); } catch (e) { /* ignore */ }
    }
  } catch (e) { }
}

function handleAutocompleteDelayChange(event) {
  try {
    const value = (event && event.target && event.target.value) || '300';
    localStorage.setItem('autocomplete-delay', String(value));
    if (elements.autocompleteDelayValue) elements.autocompleteDelayValue.textContent = String(value) + 'ms';
    // store on window for other modules to read
    window.autocompleteDelay = parseInt(value, 10) || 300;
  } catch (e) { }
}

function resetAutocompleteDelay() {
  try {
    localStorage.removeItem('autocomplete-delay');
    const def = '300';
    if (elements.autocompleteDelaySlider) elements.autocompleteDelaySlider.value = def;
    if (elements.autocompleteDelayValue) elements.autocompleteDelayValue.textContent = def + 'ms';
    window.autocompleteDelay = parseInt(def, 10);
  } catch (e) { }
}

// Debug replacer UI wiring: uses preload APIs to read sentinel and control the replacer
async function refreshReplacerStatus() {
  try {
    const statusEl = elements.replacerStatus;
    const items = await window.api.listWorkspaceDebug();
    let text = 'No replacer artifacts found';
    if (items && items.ok && Array.isArray(items.items)) {
      if (items.items.includes('nta-replace-result.json')) {
        const res = await window.api.readWorkspaceDebugFile('nta-replace-result.json');
        if (res && res.ok) {
          try {
            const obj = JSON.parse(res.content || '{}');
            text = `Replacer result: ret=${obj.ret} open=${obj.open} target=${obj.target} ts=${obj.ts}`;
          } catch (e) {
            text = 'Replacer result: (invalid JSON)';
          }
        }
      } else if (items.items.includes('nta-replace.log')) {
        text = 'Replacer log present';
      }
    }
    statusEl.textContent = text;
  } catch (e) {
    try { elements.replacerStatus.textContent = 'Error reading replacer status: ' + String(e); } catch (ee) {}
  }
}

// Hook debug buttons (if present in DOM)
try {
  if (elements.replacerOpenBtn) {
    elements.replacerOpenBtn.addEventListener('click', async () => {
      const res = await window.api.openWorkspaceReplacedApp();
      if (!res || !res.ok) alert('Open app failed: ' + (res && res.error));
    });
  }
  if (elements.replacerKillBtn) {
    elements.replacerKillBtn.addEventListener('click', async () => {
      const res = await window.api.killWorkspaceReplacer();
      if (!res || !res.ok) alert('Kill failed: ' + (res && res.error));
      else alert('Sent kill to pid ' + res.pid);
      // Refresh status after attempting kill
      setTimeout(refreshReplacerStatus, 500);
    });
  }
} catch (e) {}

// Try initial refresh in case replacement artifacts exist
try { setTimeout(refreshReplacerStatus, 500); } catch (e) {}

function handleFileTreeSortChange(event) {
  try {
    const val = event && event.target ? event.target.value : 'name';
    localStorage.setItem('file-tree-sort', val);
    // If renderFileTree exists, re-render with new sort
    if (typeof applyFileTreeSort === 'function') {
  try { applyFileTreeSort(val); } catch (e) { }
    } else if (typeof renderFileTree === 'function') {
  try { renderFileTree(); } catch (e) { }
    }
  } catch (e) { }
}

function handleMathRenderingQualityChange(event) {
  try {
    const val = event && event.target ? event.target.value : 'normal';
    localStorage.setItem('math-rendering-quality', val);
    // If a math re-render helper is available call it
    if (typeof applyMathRenderingQuality === 'function') {
  try { applyMathRenderingQuality(val); } catch (e) { }
    }
  } catch (e) { }
}


// Track the last known mouse position so popups can be positioned relative
// to the pointer when desired (useful when caret-based measurement isn't available)
// NOTE: the event listener is registered after `state` is declared below to
// avoid referencing `state` before initialization.

// Local storage keys used across the renderer
const storageKeys = {
  workspaceFolder: 'NTA.workspaceFolder',
  codeLanguage: 'NTA.codeLanguage',
  sidebarCollapsed: 'NTA.sidebarCollapsed',
  sidebarWidth: 'NTA.sidebarWidth',
  previewCollapsed: 'NTA.previewCollapsed',
  editorPanes: 'NTA.editorPanes',
  editorSplitVisible: 'NTA.editorSplitVisible',
  highContrast: 'NTA.highContrast'
  ,
  // New settings keys
  autosaveEnabled: 'NTA.autosaveEnabled',
  autosaveInterval: 'NTA.autosaveInterval',
  editorSpellcheck: 'NTA.editorSpellcheck',
  editorSoftWrap: 'NTA.editorSoftWrap',
  defaultExportFormat: 'NTA.defaultExportFormat'
  ,
  // New display preference: when true, only show the filename (not full path)
  showFileNameOnly: 'NTA.showFileNameOnly'
};

// ...existing code...

function getKeyCombo(e) {
  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push('Cmd');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  parts.push(e.key.toUpperCase());
  return parts.join('+');
}

function executeKeybindingAction(action, event) {
  switch (action) {
    case 'export-pdf':
      event.preventDefault();
      elements.exportPdfOption?.click();
      break;
    case 'export-html':
      event.preventDefault();
      elements.exportHtmlOption?.click();
      break;
    case 'settings':
      event.preventDefault();
      elements.settingsButton?.click();
      break;
    case 'bold':
      event.preventDefault();
      wrapSelection('**', '**');
      break;
    case 'italic':
      event.preventDefault();
      wrapSelection('*', '*');
      break;
    case 'code':
      event.preventDefault();
      wrapSelection('`', '`');
      break;
    case 'link':
      event.preventDefault();
      wrapSelection('[', '](url)');
      break;
    case 'insert-latex':
      event.preventDefault();
      insertLatexBlockAtCursor();
      break;
    case 'open-citation':
      event.preventDefault();
      openCitationPicker();
      break;
  }
}

function wrapSelection(before, after) {
  const edt = getActiveEditorInstance();
  if (!edt || !edt.isPresent()) return;

  const start = edt.selectionStart;
  const end = edt.selectionEnd;
  const selectedText = edt.getValue().substring(start, end);

  const replacement = before + selectedText + after;
  // apply replacement directly on underlying textarea
  try {
    edt.el.setRangeText(replacement);
  } catch (e) {
    // fallback: set full value
    const v = edt.getValue();
    edt.setValue(v.slice(0, start) + replacement + v.slice(end));
  }

  // Position cursor appropriately
  const newCursorPos = start + before.length + selectedText.length;
  try { edt.setSelectionRange(newCursorPos, newCursorPos); } catch (e) {}
  try { edt.focus({ preventScroll: false }); } catch (e) { edt.focus(); }
}

const readStorage = (key) => {
  try {
    return window.localStorage?.getItem(key) ?? null;
  } catch (error) {
  // Debug prints removed
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    window.localStorage?.setItem(key, value);
  } catch (error) {
  // Debug prints removed
  }
};

// Autosave timer management
let autosaveTimer = null;
function startAutosave(intervalSeconds) {
  stopAutosave();
  if (!intervalSeconds || intervalSeconds <= 0) return;
  autosaveTimer = setInterval(() => {
    // indicate autosave in UI if helper exists
    try { if (typeof updateAutosaveIndicatorGlobal === 'function') updateAutosaveIndicatorGlobal(true); } catch (e) {}
    // call persistNotes if available
  try { if (typeof persistNotes === 'function') persistNotes(); } catch (e) { }
    // turn off indicator after small delay
    try { if (typeof updateAutosaveIndicatorGlobal === 'function') setTimeout(() => updateAutosaveIndicatorGlobal(false), 800); } catch (e) {}
  }, Math.max(1000, intervalSeconds * 1000));
}
function stopAutosave() {
  if (autosaveTimer) { clearInterval(autosaveTimer); autosaveTimer = null; }
}

// Apply editor-level settings to a textarea element (spellcheck, soft wrap)
function applyEditorSettingsToEl(ta) {
  try {
    const spell = readStorage(storageKeys.editorSpellcheck);
    const softwrap = readStorage(storageKeys.editorSoftWrap);
    if (ta && typeof ta.setAttribute === 'function') {
      ta.spellcheck = spell === null ? true : ('' + spell === 'true');
      if (softwrap === null || '' + softwrap === 'true') {
        ta.style.whiteSpace = 'pre-wrap';
        ta.style.wordWrap = 'break-word';
      } else {
        ta.style.whiteSpace = 'pre';
        ta.style.wordWrap = 'normal';
      }
    }
  } catch (e) { /* ignore */ }
}

// Global autosave UI helper used by autosave timer and manual save
function updateAutosaveIndicatorGlobal(active) {
  try {
    if (elements.autosaveDot) {
      if (active) elements.autosaveDot.classList.add('active'); else elements.autosaveDot.classList.remove('active');
    }
    if (elements.autosaveText) {
      const enabled = readStorage(storageKeys.autosaveEnabled) === 'true';
      const interval = readStorage(storageKeys.autosaveInterval) || elements.autosaveInterval.value;
      elements.autosaveText.textContent = enabled ? `Autosave ${interval}s` : 'Autosave off';
    }
  } catch (e) { /* ignore */ }
}

// Initialize new settings controls and apply saved values
function initCommonSettingsControls() {
  try {
    // Autosave
    const asEnabled = readStorage(storageKeys.autosaveEnabled);
    const asInterval = readStorage(storageKeys.autosaveInterval);
    elements.autosaveToggle.checked = asEnabled === null ? false : ('' + asEnabled === 'true');
    elements.autosaveInterval.value = asInterval ? parseInt(asInterval, 10) : parseInt(elements.autosaveInterval.value || 30, 10);
    elements.autosaveIntervalValue.textContent = `${elements.autosaveInterval.value}s`;
    if (elements.autosaveToggle.checked) startAutosave(parseInt(elements.autosaveInterval.value, 10));

    elements.autosaveToggle.addEventListener('change', (e) => {
      writeStorage(storageKeys.autosaveEnabled, e.target.checked);
      if (e.target.checked) startAutosave(parseInt(elements.autosaveInterval.value, 10)); else stopAutosave();
    });
    elements.autosaveInterval.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10) || 30;
      elements.autosaveIntervalValue.textContent = `${v}s`;
      writeStorage(storageKeys.autosaveInterval, v);
      if (elements.autosaveToggle.checked) startAutosave(v);
    });

    // Spellcheck
    const spell = readStorage(storageKeys.editorSpellcheck);
    elements.spellcheckToggle.checked = spell === null ? true : ('' + spell === 'true');
    // Initialize shared config
    Editor.sharedConfig = Editor.sharedConfig || {};
    Editor.sharedConfig.spellcheck = elements.spellcheckToggle.checked;
    elements.spellcheckToggle.addEventListener('change', (e) => {
      writeStorage(storageKeys.editorSpellcheck, e.target.checked);
      Editor.sharedConfig.spellcheck = e.target.checked;
      // apply to existing editors
      Object.values(editorInstances).forEach(inst => { try { if (inst && typeof inst.applySharedSettings === 'function') inst.applySharedSettings(); } catch (err) {} });
      // also apply to raw elements if present
      try { if (elements.editor && elements.editor.tagName) editorInstances.left?.applySharedSettings?.(); } catch (e) {}
      try { if (elements.editorRight && elements.editorRight.tagName) editorInstances.right?.applySharedSettings?.(); } catch (e) {}
    });

    // Soft wrap
    const sw = readStorage(storageKeys.editorSoftWrap);
    elements.softwrapToggle.checked = sw === null ? true : ('' + sw === 'true');
    Editor.sharedConfig.softwrap = elements.softwrapToggle.checked;
    elements.softwrapToggle.addEventListener('change', (e) => {
      writeStorage(storageKeys.editorSoftWrap, e.target.checked);
      Editor.sharedConfig.softwrap = e.target.checked;
      Object.values(editorInstances).forEach(inst => { try { if (inst && typeof inst.applySharedSettings === 'function') inst.applySharedSettings(); } catch (err) {} });
    });

    // Default export format
    const defExp = readStorage(storageKeys.defaultExportFormat);
    if (defExp) elements.defaultExportFormatSelect.value = defExp;
    elements.defaultExportFormatSelect.addEventListener('change', (e) => {
      writeStorage(storageKeys.defaultExportFormat, e.target.value);
    });

  // Apply shared settings to existing editor instances/elements
  Object.values(editorInstances).forEach(inst => { try { if (inst && typeof inst.applySharedSettings === 'function') inst.applySharedSettings(); } catch (e) {} });
  try { if (elements.editor && elements.editor.tagName && editorInstances.left) editorInstances.left.applySharedSettings(); } catch (e) {}
  try { if (elements.editorRight && elements.editorRight.tagName && editorInstances.right) editorInstances.right.applySharedSettings(); } catch (e) {}

    // Autosave UI: update indicator
    function updateAutosaveIndicator(active) {
      try {
        if (elements.autosaveDot) {
          if (active) elements.autosaveDot.classList.add('active'); else elements.autosaveDot.classList.remove('active');
        }
        if (elements.autosaveText) {
          const enabled = readStorage(storageKeys.autosaveEnabled) === 'true';
          const interval = readStorage(storageKeys.autosaveInterval) || elements.autosaveInterval.value;
          elements.autosaveText.textContent = enabled ? `Autosave ${interval}s` : 'Autosave off';
        }
      } catch (e) {}
    }

    // Save Now button behavior
    if (elements.saveNowButton) {
      elements.saveNowButton.addEventListener('click', async (e) => {
        try {
          if (typeof persistNotes === 'function') {
            updateAutosaveIndicator(true);
            await persistNotes();
            // flash indicator
            setTimeout(() => updateAutosaveIndicator(false), 800);
          }
  } catch (err) { }
      });
    }

    // Initialize autosave indicator state
    updateAutosaveIndicator(false);

    // Show line numbers
    const showLines = readStorage('NTA.showLineNumbers');
    elements.showLineNumbersToggle.checked = showLines === 'true';
    function applyLineNumberSetting(enabled) {
      const applyTo = Object.values(editorInstances).filter(Boolean).map(i => i.el).concat([elements.editor, elements.editorRight]);
      applyTo.forEach(el => { try { if (el && el.tagName) { if (enabled) { el.classList.add('editor-show-line-numbers'); } else { el.classList.remove('editor-show-line-numbers'); } } } catch (e) {} });
    }
    applyLineNumberSetting(elements.showLineNumbersToggle.checked);
    elements.showLineNumbersToggle.addEventListener('change', (e) => { writeStorage('NTA.showLineNumbers', e.target.checked); applyLineNumberSetting(e.target.checked); });

    // Editor tab size
    const savedTabSize = readStorage('NTA.editorTabSize');
    elements.editorTabSizeSlider.value = savedTabSize ? savedTabSize : elements.editorTabSizeSlider.value;
    elements.editorTabSizeValue.textContent = `${elements.editorTabSizeSlider.value}`;
    function applyTabSize(size) {
      const applyTo = Object.values(editorInstances).filter(Boolean).map(i => i.el).concat([elements.editor, elements.editorRight]);
      applyTo.forEach(el => { try { if (el && el.tagName) el.style.tabSize = size; } catch (e) {} });
    }
    applyTabSize(elements.editorTabSizeSlider.value);
    elements.editorTabSizeSlider.addEventListener('input', (e) => { const v = parseInt(e.target.value,10)||4; elements.editorTabSizeValue.textContent = `${v}`; writeStorage('NTA.editorTabSize', v); applyTabSize(v); });

    // When dynamic panes are created, ensure they receive the settings
    // Monkey-patch createEditorPane to apply settings after creation
    const origCreateEditorPane = window.createEditorPane || createEditorPane;
    window.createEditorPane = function(...args) {
      const id = origCreateEditorPane(...args);
      try { const inst = editorInstances[id]; if (inst && inst.el) applyEditorSettingsToEl(inst.el); } catch (e) {}
      return id;
    };
  } catch (e) { }
}

const removeStorage = (key) => {
  try {
    window.localStorage?.removeItem(key);
  } catch (error) {
  // Debug prints removed
  }
};

const getPersistedWorkspaceFolder = () => readStorage(storageKeys.workspaceFolder);

const persistLastWorkspaceFolder = (folderPath) => {
  if (folderPath) {
    writeStorage(storageKeys.workspaceFolder, folderPath);
  } else {
    removeStorage(storageKeys.workspaceFolder);
  }
};

const getPersistedCodeLanguage = () => readStorage(storageKeys.codeLanguage);

const persistLastCodeLanguage = (language) => {
  if (language) {
    writeStorage(storageKeys.codeLanguage, language);
  } else {
    removeStorage(storageKeys.codeLanguage);
  }
};

const initialCodeLanguage = getPersistedCodeLanguage() ?? 'python';
const getPersistedSidebarCollapsed = () => readStorage(storageKeys.sidebarCollapsed) === 'true';

const getPersistedSidebarWidth = () => {
  const saved = readStorage(storageKeys.sidebarWidth);
  if (saved) {
    const width = parseInt(saved, 10);
    if (!isNaN(width) && width >= 200 && width <= 500) {
      return width;
    }
  }
  return 260; // default width
};

const persistSidebarCollapsed = (collapsed) => {
  if (collapsed) {
    writeStorage(storageKeys.sidebarCollapsed, 'true');
  } else {
    removeStorage(storageKeys.sidebarCollapsed);
  }
};

const initialSidebarCollapsed = getPersistedSidebarCollapsed();
const initialSidebarWidth = getPersistedSidebarWidth();
const getPersistedPreviewCollapsed = () => readStorage(storageKeys.previewCollapsed) === 'true';

const persistPreviewCollapsed = (collapsed) => {
  if (collapsed) {
    writeStorage(storageKeys.previewCollapsed, 'true');
  } else {
    removeStorage(storageKeys.previewCollapsed);
  }
};

const initialPreviewCollapsed = getPersistedPreviewCollapsed();

const state = {
  notes: new Map(),
  tree: null,
  activeNoteId: null,
  collapsedFolders: new Set(),
  editorRatio: 0.5,
  resizingEditor: false,
  splitterPointerId: null,
  sidebarWidth: initialSidebarWidth,
  resizingSidebar: false,
  sidebarResizePointerId: null,
  hashtagPanelHeight: 300, // Default height for hashtag panel
  resizingHashtagPanel: false,
  hashtagResizePointerId: null,
  initialMouseY: null, // Store initial mouse Y position for resize
  initialHashtagHeight: null, // Store initial hashtag height for resize
  hashtagPrevHeight: null,
  saveTimer: null,
  saving: false,
  currentFolder: null,
  lastCodeLanguage: initialCodeLanguage,
  wikiIndex: new Map(),
  codePopoverOpen: false,
  imagePreviewToken: null,
  videoPreviewToken: null,
  // Tab management
  tabs: [], // Array of {id: string, noteId: string, title: string, isDirty: boolean}
  activeTabId: null,
  htmlPreviewToken: null,
  blockIndex: new Map(),
  blockLabelsByNote: new Map(),
  userTyping: false,
  hashtagIndex: new Map(),
  hashtagsByNote: new Map(),
  pendingBlockFocus: null,
  pendingHashtagFocus: null,
  renamingNoteId: null,
  sidebarCollapsed: initialSidebarCollapsed,
  previewCollapsed: initialPreviewCollapsed,
  previewSourceBlocks: new Map(),
  previewHighlightTimer: null,
  previewHighlightedElement: null,
  activeHashtag: null,
  // Track the last pane-opened note that can be shown in the global preview.
  // This covers markdown, latex, bib, notebook, and code previews.
  lastRenderableNoteId: null,
  wikiSuggest: {
    open: false,
    items: [],
    selectedIndex: 0,
    start: 0,
    end: 0,
    query: '',
    embed: false,
    position: {
      top: 24,
      left: 24
    },
    suppress: false
  },
  tagSuggest: {
    open: false,
    items: [],
    selectedIndex: 0,
    start: 0,
    end: 0,
    query: '',
    position: {
      top: 24,
      left: 24
    },
    suppress: false
  },
  fileSuggest: {
    open: false,
    items: [],
    selectedIndex: 0,
    start: 0,
    end: 0,
    query: '',
    position: {
      top: 24,
      left: 24
    },
    suppress: false
  },
  suppressInlineCommand: false,
  currentCommandExplanation: null,
  lastInputTime: null,
  search: {
    open: false,
    query: '',
    matches: [],
    activeIndex: -1,
    lastCaret: 0
  },
  contextMenu: {
    open: false,
    targetNoteId: null,
    x: 0,
    y: 0
  },
  clipboard: {
    operation: null, // 'cut' or 'copy'
    noteId: null,
    sourcePath: null
  },
  inlineChat: {
    open: false,
    messages: [],
    overlay: null
  }
  ,
  // Preview scroll sync mode: when true, editor motions scroll the global preview
  previewScrollSync: false,
  // Internal: store active sync handlers so they can be removed when panes change
  _previewSyncHandler: null
};

// Now that `state` exists, install mouse tracking to capture the last pointer
// position for popup placement fallbacks.
state.lastMousePosition = state.lastMousePosition || null;
window.addEventListener('mousemove', (e) => {
  try {
    state.lastMousePosition = { x: e.clientX, y: e.clientY };
  } catch (err) { /* ignore */ }
}, { passive: true });

// Active selections used by math overlay and selection helpers.
// Use a window-backed property so hot-reloads or duplicated script evaluations
// don't cause "Identifier has already been declared" SyntaxErrors.
if (typeof window !== 'undefined') {
  window.__nta_activeSelections = window.__nta_activeSelections || [];
  try {
    Object.defineProperty(window, 'activeSelections', {
      configurable: true,
      get() {
        return window.__nta_activeSelections;
      },
      set(v) {
        window.__nta_activeSelections = v;
      }
    });
  } catch (e) {
    // Fallback: assign directly
    window.activeSelections = window.__nta_activeSelections;
  }
} else {
  // Non-browser fallback
  var activeSelections = [];
}

// Minimal tab creation helper (placeholder). Real implementation should render tabs and manage tab lifecycle.
const createTab = (noteId, title) => {
  if (!noteId) return null;
  const id = `tab-${noteId}`;
  const existing = state.tabs.find((t) => t.id === id);
  if (existing) return existing;
  const tab = { id, noteId, title: title || 'Untitled', isDirty: false };
  state.tabs.push(tab);
  return tab;
};

// Minimal renderTabs placeholder. Real implementation should update the tab UI.
const renderTabs = () => {
  if (!Array.isArray(state.tabs)) state.tabs = [];
  if (!state.activeTabId && state.tabs.length) {
    state.activeTabId = state.tabs[0].id;
  }
};

// Convert a wiki link target (e.g. "My Page | alias") into a normalized slug
// This is a lightweight, safe implementation sufficient for index lookups and linking.
function toWikiSlug(value) {
  if (!value || typeof value !== 'string') return '';
  // Remove alias portion after a pipe, and strip file extensions
  const cleaned = value.split('|')[0].trim();
  const withoutExt = cleaned.replace(/\.[^./\\]+$/, '');
  const normalized = withoutExt
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width chars
    .replace(/[^a-z0-9\s\-_.]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/_+/g, '-')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '');
  return normalized;
}

// Minimal tab activation helper to keep state in sync. Real implementation
// should update DOM and focus, but this keeps flows from throwing.
function setActiveTab(tabId) {
  try { console.log('setActiveTab called', { tabId }); } catch (e) {}
  if (!tabId) return;
  state.activeTabId = tabId;
  const existing = state.tabs.find((t) => t.id === tabId);
  if (!existing && state.tabs.length) {
    state.activeTabId = state.tabs[0].id;
  }

  // Ensure the active editor pane corresponds to the tab's note when possible
  const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
  if (activeTab) {
    const noteId = activeTab.noteId;
    const leftMatches = state.editorPanes.left?.noteId === noteId;
    const rightMatches = state.editorPanes.right?.noteId === noteId;
    // If both panes point to the same note, prefer keeping the currently active pane
    if (leftMatches && rightMatches) {
      try { console.log('setActiveTab -> both panes contain note; keeping current active pane', { noteId, activePane: state.activeEditorPane }); } catch (e) {}
    } else if (leftMatches) {
      if (state.activeEditorPane !== 'left') {
        try { console.log('setActiveTab -> switching active pane to left for note', { noteId }); } catch (e) {}
        setActiveEditorPane('left');
      }
    } else if (rightMatches) {
      if (state.activeEditorPane !== 'right') {
        try { console.log('setActiveTab -> switching active pane to right for note', { noteId }); } catch (e) {}
        setActiveEditorPane('right');
      }
    }
  }
}

// Map a DOM element (typically a textarea) to the corresponding Editor instance.
function getEditorInstanceForElement(el) {
  if (!el) return null;
  if (el === elements.editor) return editorInstances.left;
  if (el === elements.editorRight) return editorInstances.right;
  try {
    if (elements.editor && typeof elements.editor.contains === 'function' && elements.editor.contains(el)) return editorInstances.left;
    if (elements.editorRight && typeof elements.editorRight.contains === 'function' && elements.editorRight.contains(el)) return editorInstances.right;
  } catch (e) {
    // ignore
  }
  return getActiveEditorInstance();
}

// Per-pane editor state (initialized after state object is declared)
// Per-pane editor state is initialized dynamically where the UI is built.

// Lightweight Editor wrapper to unify textarea API for left/right panes
class Editor {
  constructor(el) {
    this.el = el || null;
  }

  isPresent() {
    return !!this.el;
  }

  getValue() {
    return this.el ? this.el.value : '';
  }

  setValue(v) {
    if (this.el) this.el.value = v;
  }

  focus(options) {
    try { if (this.el) this.el.focus(options); } catch (e) { if (this.el) this.el.focus(); }
  }

  setSelectionRange(start, end) {
    if (this.el && typeof this.el.setSelectionRange === 'function') {
      try { this.el.setSelectionRange(start, end); } catch (e) {}
    }
  }

  addEventListener(type, handler, opts) {
    if (this.el && this.el.addEventListener) this.el.addEventListener(type, handler, opts);
  }

  removeEventListener(type, handler, opts) {
    if (this.el && this.el.removeEventListener) this.el.removeEventListener(type, handler, opts);
  }

  setRangeText(replacement) {
    if (this.el && typeof this.el.setRangeText === 'function') {
      try { this.el.setRangeText(replacement); } catch (e) { /* ignore */ }
    }
  }

  get selectionStart() { return this.el ? this.el.selectionStart : 0; }
  get selectionEnd() { return this.el ? this.el.selectionEnd : 0; }
}

// Shared editor configuration — instances inherit these settings but remain
// independent (so each pane can open different files while sharing appearance
// and behavior settings). Call `Editor.sharedConfig = { ... }` to override.
Editor.sharedConfig = {
  spellcheck: true,
  softwrap: true,
  fontFamily: null,
  fontSize: null
};

// Apply the shared configuration to this instance's underlying element
Editor.prototype.applySharedSettings = function() {
  try {
    if (!this.el) return;
    const cfg = Editor.sharedConfig || {};
    // Spellcheck
    if (typeof cfg.spellcheck !== 'undefined') this.el.spellcheck = !!cfg.spellcheck;
    // Soft wrap
    if (typeof cfg.softwrap !== 'undefined') {
      if (cfg.softwrap) { this.el.style.whiteSpace = 'pre-wrap'; this.el.style.wordWrap = 'break-word'; }
      else { this.el.style.whiteSpace = 'pre'; this.el.style.wordWrap = 'normal'; }
    }
    // Font family/size (optional)
    if (cfg.fontFamily) try { this.el.style.fontFamily = cfg.fontFamily; } catch (e) {}
    if (cfg.fontSize) try { this.el.style.fontSize = typeof cfg.fontSize === 'number' ? `${cfg.fontSize}px` : cfg.fontSize; } catch (e) {}
  } catch (e) { /* ignore */ }
};

// Editor instances for left/right panes (wire elements immediately)
const editorInstances = { left: new Editor(elements.editor), right: new Editor(elements.editorRight) };

// Ensure existing instances pick up the shared settings immediately
Object.values(editorInstances).forEach(inst => { try { if (inst && typeof inst.applySharedSettings === 'function') inst.applySharedSettings(); } catch (e) {} });

// Return any available editor instance. Prefer the currently active pane,
// otherwise return the first defined editor instance.
function getAnyEditorInstance() {
  if (state && state.activeEditorPane && editorInstances[state.activeEditorPane]) {
    return editorInstances[state.activeEditorPane];
  }
  const vals = Object.values(editorInstances).filter(Boolean);
  return vals.length ? vals[0] : null;
}

// Resolve a pane id to fall back to an existing pane. If preferRight is true
// and the right pane exists, prefer it. Otherwise return the first existing
// pane id (useful when dynamic panes exist).
function resolvePaneFallback(preferRight = true) {
  if (preferRight && editorInstances.right) return 'right';
  const keys = Object.keys(editorInstances).filter(k => !!editorInstances[k]);
  return keys.length ? keys[0] : 'left';
}

// Helper to create a dynamic editor pane (returns paneId)
const createEditorPane = (paneId = null, label = '') => {
  // generate a unique pane id if none provided
  const id = paneId || `pane-${Date.now()}`;
  // create the DOM structure
  const workspace = document.querySelector('.workspace__content');
  if (!workspace) return null;

  const section = document.createElement('section');
  section.className = `editor-pane editor-pane--dynamic`;
  section.setAttribute('data-pane-id', id);
  section.setAttribute('aria-label', `Markdown editor (${label})`);

  const badge = document.createElement('div');
  badge.className = 'editor-pane__badge';
  badge.setAttribute('data-pane', id);
  badge.textContent = label;
  section.appendChild(badge);

  const actions = document.createElement('div');
  actions.className = 'editor-pane__actions';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'icon-button small';
  closeBtn.type = 'button';
  closeBtn.title = 'Close pane';
  closeBtn.setAttribute('aria-label', 'Close pane');
  closeBtn.textContent = '✕';
  actions.appendChild(closeBtn);
  section.appendChild(actions);

  const searchHighlights = document.createElement('div');
  searchHighlights.className = 'editor-search-highlights';
  searchHighlights.hidden = true;
  section.appendChild(searchHighlights);

  const ta = document.createElement('textarea');
  ta.id = `note-editor-${id}`;
  ta.spellcheck = true;
  ta.setAttribute('aria-label', `Markdown editor (${label})`);
  section.appendChild(ta);

  const overlay = document.createElement('div');
  overlay.id = `editor-math-overlay-${id}`;
  overlay.className = 'editor-math-overlay';
  overlay.hidden = true;
  section.appendChild(overlay);

  // Insert before the splitter so editors remain left of preview
  const splitter = document.getElementById('workspace-splitter');
  if (splitter && splitter.parentNode) {
    splitter.parentNode.insertBefore(section, splitter);
  } else {
    workspace.appendChild(section);
  }

  // Create Editor instance and wire basic events
  const inst = new Editor(ta);
  editorInstances[id] = inst;
  // Apply shared settings so dynamic panes inherit appearance/behavior
  try { if (typeof inst.applySharedSettings === 'function') inst.applySharedSettings(); } catch (e) {}

  // Basic wiring similar to left/right
  inst.addEventListener('input', (e) => handleEditorInput(e, { editorEl: inst.el, pane: id }));
  inst.addEventListener('keydown', handleEditorKeydown);
  inst.addEventListener('keyup', handleEditorKeyup);
  inst.addEventListener('click', handleEditorClick);
  inst.addEventListener('focus', () => { setActiveEditorPane(id); updateWikiSuggestions(inst.el); updateHashtagSuggestions(inst.el); });
  inst.addEventListener('blur', handleEditorBlur);
  inst.addEventListener('select', handleEditorSelect);

  // drag/drop for the pane
  section.addEventListener('dragover', handleEditorDragOver, { passive: false });
  section.addEventListener('dragenter', handleEditorDragEnter, { passive: false });
  section.addEventListener('dragleave', handleEditorDragLeave, { passive: false });
  // Use capture so dynamic panes can intercept drops before left-editor bubble handlers
  section.addEventListener('drop', handleEditor2Drop, true);

  // Close button removes the pane
  closeBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    try {
      // remove DOM
      section.remove();
      // remove instance
      delete editorInstances[id];
      // remove from state mappings
      if (state.editorPanes && state.editorPanes[id]) delete state.editorPanes[id];
      try { localStorage.setItem(storageKeys.editorPanes, JSON.stringify(state.editorPanes)); } catch (e) {}
      // If active pane was this, switch to left
      if (state.activeEditorPane === id) setActiveEditorPane('left');
      updateEditorPaneVisuals();
  } catch (e) { }
  });

  // persist placeholder state for the pane
  state.editorPanes = state.editorPanes || {};
  state.editorPanes[id] = state.editorPanes[id] || { noteId: null };
  try { localStorage.setItem(storageKeys.editorPanes, JSON.stringify(state.editorPanes)); } catch (e) {}

  // Activate newly created pane
  setActiveEditorPane(id);
  updateEditorPaneVisuals();

  return id;
};

// Ensure editor pane state structure exists
if (!state.editorPanes) {
  state.editorPanes = { left: { noteId: null }, right: { noteId: null } };
}

// Active pane tracking: prefer any existing pane instead of hard-coding 'left'
state.activeEditorPane = state.activeEditorPane || resolvePaneFallback(true);

function getActiveEditorInstance() {
  return editorInstances[state.activeEditorPane] ?? getAnyEditorInstance();
}

const domPurifyConfig = {
  ADD_TAGS: ['section', 'header', 'article', 'mark', 'script', 'iframe'],
  ADD_ATTR: [
    'role',
    'tabindex',
    'data-note-id',
    'data-wiki-target',
    'data-language',
    'data-embed-depth',
    'data-raw-src',
    'loading',
    'id',
    'data-block-id',
    'data-block-label',
    'data-block-missing',
    'data-source-block-id',
    'data-source-note-id',
    'data-math-source',
    'src',
    'type',
    'sandbox',
    'allow',
    'allowfullscreen'
  ]
};

// Configurable limits / debug flags
const maxWikiEmbedDepth = 3; // Max embed recursion depth for wiki-embeds
// Also expose to window in case some runtime evaluation happens in a different scope
// (hot-reload or extensions) so the marked tokenizer/renderer can read it.
window.maxWikiEmbedDepth = maxWikiEmbedDepth;
window.__nta_debug_iframe = window.__nta_debug_iframe || false;

const renderContextStack = [];

const blockTokenTypesForMapping = new Set([
  'paragraph',
  'heading',
  'list_item',
  'blockquote',
  'code',
  'table',
  'tablecell',
  'mathBlock',
  'htmlCodeBlock'
]);
let activeSourceMapCollector = null;

const startSourceMapCollection = (originalMarkdown, preparedMarkdown, anchorReplacements) => {
  activeSourceMapCollector = {
    original: originalMarkdown ?? '',
    prepared: preparedMarkdown ?? '',
    replacements: Array.isArray(anchorReplacements) ? anchorReplacements : [],
    cursor: 0,
    blocks: []
  };
};

const convertPreparedIndexToOriginal = (collector, index) => {
  if (!collector || !collector.replacements.length) {
    return index;
  }

  let adjustment = 0;
  for (let i = 0; i < collector.replacements.length; i += 1) {
    const replacement = collector.replacements[i];
    if (index >= replacement.preparedEnd) {
      adjustment += replacement.shift;
      continue;
    }
    if (index >= replacement.preparedStart && index < replacement.preparedEnd) {
      return replacement.originalEnd;
    }
    break;
  }

  return index - adjustment;
};

const isFormattingChar = (char) => {
  if (!char) {
    return false;
  }
  return '*_`[](){}<>~'.includes(char);
};

const trimBlockPrefix = (block, text) => {
  let offsetDelta = 0;
  let workingText = typeof text === 'string' ? text : '';

  if (!block || !workingText) {
    return { text: workingText, offsetDelta };
  }

  if (block.type === 'list_item') {
    const listMatch = workingText.match(/^[ \t]*(?:[*+-]|\d+\.)[ \t]+/);
    if (listMatch) {
      offsetDelta += listMatch[0].length;
      workingText = workingText.slice(listMatch[0].length);
    }
  } else if (block.type === 'blockquote') {
    const quoteMatch = workingText.match(/^[ \t]*>+[ \t]*/);
    if (quoteMatch) {
      offsetDelta += quoteMatch[0].length;
      workingText = workingText.slice(quoteMatch[0].length);
    }
  } else if (block.type === 'heading') {
    const headingMatch = workingText.match(/^[ \t]*#{1,6}[ \t]+/);
    if (headingMatch) {
      offsetDelta += headingMatch[0].length;
      workingText = workingText.slice(headingMatch[0].length);
    }
  } else if (block.type === 'code') {
    const fenceMatch = workingText.match(/^([`~]{3,})[^\n]*\n/);
    if (fenceMatch) {
      offsetDelta += fenceMatch[0].length;
      workingText = workingText.slice(fenceMatch[0].length);
      const closingFence = fenceMatch[1];
      const closingPattern = new RegExp(`\n${closingFence}\\s*$`);
      const closingMatch = workingText.match(closingPattern);
      if (closingMatch) {
        workingText = workingText.slice(0, workingText.length - closingMatch[0].length);
      }
    }
  } else if (block.type === 'mathBlock') {
    if (workingText.startsWith('$$')) {
      const closingIndex = workingText.lastIndexOf('$$');
      if (closingIndex > 1) {
        offsetDelta += 2;
        workingText = workingText.slice(2, closingIndex);
      } else {
        workingText = workingText.slice(2);
        offsetDelta += 2;
      }
    }
    workingText = workingText.trim();
  }

  return { text: workingText, offsetDelta };
};

const escapeHtmlAttribute = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeRegExp = (value) =>
  String(value ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getFileExtension = (filePath) => {
  if (typeof filePath !== 'string') return '';
  const lastDot = filePath.lastIndexOf('.');
  const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
  if (lastDot > lastSlash && lastDot !== -1) {
    return filePath.slice(lastDot).toLowerCase();
  }
  return '';
};

let textMeasureCanvas = null;
let textMeasureContext = null;

const ensureTextMeasureContext = () => {
  if (textMeasureContext) {
    return textMeasureContext;
  }
  textMeasureCanvas = document.createElement('canvas');
  textMeasureContext = textMeasureCanvas.getContext('2d');
  return textMeasureContext;
};

const measureTextWidth = (text, style) => {
  const content = typeof text === 'string' ? text : '';
  if (!content) {
    return 0;
  }

  const context = ensureTextMeasureContext();
  if (!context) {
    return 0;
  }

  const font = style.font || `${style.fontWeight || 'normal'} ${style.fontSize || '15px'} ${style.fontFamily || 'sans-serif'}`;
  context.font = font;
  let width = context.measureText(content).width;

  const letterSpacingValue = style.letterSpacing;
  if (typeof letterSpacingValue === 'string' && letterSpacingValue !== 'normal') {
    const spacing = Number.parseFloat(letterSpacingValue);
    if (Number.isFinite(spacing) && spacing !== 0) {
      width += spacing * Math.max(0, content.length - 1);
    }
  }

  return width;
};

const previewBlockCandidateSelector = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, table, td, th, .math-block';

const previewBlockMatchesType = (element, type) => {
  if (!element || !type) {
    return false;
  }

  const tag = element.tagName;
  switch (type) {
    case 'paragraph':
      return tag === 'P';
    case 'heading':
      return /^H[1-6]$/.test(tag);
    case 'list_item':
      return tag === 'LI';
    case 'blockquote':
      return tag === 'BLOCKQUOTE';
    case 'code':
      return tag === 'PRE';
    case 'table':
      return tag === 'TABLE';
    case 'tablecell':
      return tag === 'TD' || tag === 'TH';
    case 'mathBlock':
      return element.classList.contains('math-block');
    default:
      return false;
  }
};

const collectPreviewBlockCandidates = (root) => {
  if (!root) {
    return [];
  }

  const nodes = Array.from(root.querySelectorAll(previewBlockCandidateSelector));
  return nodes.filter((node) => !node.closest('.wikilink-embed'));
};

const applyPreviewSourceBlocks = (noteId, collector, previewRoot) => {
  if (!noteId || !collector || !previewRoot) {
    return new Map();
  }

  const candidates = collectPreviewBlockCandidates(previewRoot);
  let candidateIndex = 0;

  const findNextElement = (type) => {
    while (candidateIndex < candidates.length) {
      const candidate = candidates[candidateIndex];
      candidateIndex += 1;
      if (previewBlockMatchesType(candidate, type)) {
        return candidate;
      }
    }
    return null;
  };

  const blocksById = new Map();

  collector.blocks.forEach((block) => {
    const element = findNextElement(block.type);
    if (!element) {
      return;
    }

    element.dataset.sourceBlockId = block.id;
    element.dataset.sourceNoteId = noteId;

    blocksById.set(block.id, {
      noteId,
      block,
      element
    });
  });

  return blocksById;
};

const clearPreviewHighlight = () => {
  if (state.previewHighlightTimer) {
    clearTimeout(state.previewHighlightTimer);
    state.previewHighlightTimer = null;
  }

  if (state.previewHighlightedElement) {
    state.previewHighlightedElement.classList.remove('block-highlight');
    state.previewHighlightedElement = null;
  }
};

const highlightPreviewElement = (element) => {
  if (!element) {
    clearPreviewHighlight();
    return;
  }

  if (state.previewHighlightedElement && state.previewHighlightedElement !== element) {
    state.previewHighlightedElement.classList.remove('block-highlight');
  }

  element.classList.add('block-highlight');

  if (state.previewHighlightTimer) {
    clearTimeout(state.previewHighlightTimer);
  }

  state.previewHighlightedElement = element;
  state.previewHighlightTimer = window.setTimeout(() => {
    element.classList.remove('block-highlight');
    if (state.previewHighlightedElement === element) {
      state.previewHighlightedElement = null;
    }
    state.previewHighlightTimer = null;
  }, 1800);
};

const getPreviewPlainOffsetFromSelection = (element) => {
  if (!element) {
    return null;
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!element.contains(range.startContainer)) {
    return null;
  }

  const measurement = range.cloneRange();
  try {
    measurement.setStart(element, 0);
    measurement.setEnd(range.startContainer, range.startOffset);
  } catch (error) {
  // Debug prints removed
    return null;
  }

  const text = measurement.toString();
  return text.length;
};

const getPreviewSelectionText = (element) => {
  if (!element) {
    return '';
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return '';
  }

  const range = selection.getRangeAt(0);
  if (!range || range.collapsed) {
    return '';
  }

  if (!element.contains(range.startContainer) || !element.contains(range.endContainer)) {
    return '';
  }

  return selection.toString() ?? '';
};

const computeEditorRangeForPreviewBlock = (block, requestedOffset) => {
  if (!block) {
    return null;
  }

  const mapping = Array.isArray(block.mapping) ? block.mapping : null;
  const plainText = typeof block.plainText === 'string' ? block.plainText : '';

  if (!mapping || !mapping.length) {
    const start = block.start ?? 0;
    const end = block.end ?? start;
    return { start, end };
  }

  let offset = Number.isFinite(requestedOffset) ? Math.floor(requestedOffset) : 0;
  offset = clamp(offset, 0, mapping.length - 1);

  const length = mapping.length;
  const text = plainText;
  const isWhitespace = (char) => /\s/.test(char);
  const isWordChar = (char) => /[0-9A-Za-z_]/.test(char);

  let anchor = offset;
  if (text && isWhitespace(text[anchor])) {
    let forward = anchor;
    while (forward < length && isWhitespace(text[forward])) {
      forward += 1;
    }
    if (forward < length) {
      anchor = forward;
    } else {
      let backward = anchor;
      while (backward >= 0 && isWhitespace(text[backward])) {
        backward -= 1;
      }
      if (backward >= 0) {
        anchor = backward;
      }
    }
  }

  anchor = clamp(anchor, 0, length - 1);

  let startPlain = anchor;
  let endPlain = anchor;

  if (text && isWordChar(text[anchor])) {
    while (startPlain > 0 && isWordChar(text[startPlain - 1])) {
      startPlain -= 1;
    }
    while (endPlain + 1 < length && isWordChar(text[endPlain + 1])) {
      endPlain += 1;
    }
  } else if (text && isWhitespace(text[anchor])) {
    while (startPlain > 0 && isWhitespace(text[startPlain - 1])) {
      startPlain -= 1;
    }
    while (endPlain + 1 < length && isWhitespace(text[endPlain + 1])) {
      endPlain += 1;
    }
  }

  const start = mapping[startPlain];
  let endExclusive;
  if (endPlain + 1 < length) {
    endExclusive = mapping[endPlain + 1];
  } else {
    endExclusive = block.end ?? mapping[endPlain] + 1;
  }

  if (endExclusive <= start) {
    endExclusive = start + 1;
  }

  return { start, end: endExclusive };
};

const findApproximateRangeInMarkdown = (block, previewInfo, options = {}) => {
  if (!block || !previewInfo) {
    return null;
  }

  const markdown = typeof previewInfo.originalMarkdown === 'string' ? previewInfo.originalMarkdown : '';
  const blockStart = Number.isFinite(block.start) ? block.start : 0;
  const blockEnd = Number.isFinite(block.end) ? block.end : blockStart;

  let plainText = typeof block.plainText === 'string' ? block.plainText : '';
  let mapping = Array.isArray(block.mapping) && block.mapping.length ? block.mapping : null;

  if ((!plainText || !mapping) && markdown && blockEnd > blockStart) {
    try {
      const rebuilt = buildBlockPlainTextMapping({ ...block }, markdown);
      if (!plainText && typeof rebuilt.plainText === 'string') {
        plainText = rebuilt.plainText;
      }
      if (!mapping && Array.isArray(rebuilt.mapping) && rebuilt.mapping.length) {
        mapping = rebuilt.mapping;
      }
    } catch (error) {
  // Debug prints removed
    }
  }

  if (!plainText) {
    if (blockEnd > blockStart) {
      return { start: blockStart, end: blockEnd };
    }
    return null;
  }

  const normalize = (value) =>
    (value ?? '')
      .replace(/\u00A0/g, ' ')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .trim();

  const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const plainLength = plainText.length;
  const candidates = [];
  const seenLiteral = new Set();
  const seenRegex = new Set();

  const pushLiteralCandidate = (value, priority = 0) => {
    const normalized = normalize(value);
    if (!normalized) {
      return;
    }
    const truncated = normalized.length > 200 ? normalized.slice(0, 200) : normalized;
    const key = truncated.toLowerCase();
    if (!key || seenLiteral.has(key)) {
      return;
    }
    seenLiteral.add(key);
    candidates.push({
      type: 'literal',
      value: truncated,
      lower: key,
      length: truncated.length,
      priority
    });
  };

  const pushRegexCandidate = (value, priority = 0) => {
    const normalized = normalize(value);
    if (!normalized) {
      return;
    }
    const escaped = escapeForRegex(normalized).replace(/\s+/g, '\\s+');
    if (!escaped || seenRegex.has(escaped)) {
      return;
    }
    seenRegex.add(escaped);
    candidates.push({
      type: 'regex',
      value: escaped,
      priority
    });
  };

  const selectionText = normalize(options.selectionText);
  if (selectionText) {
    pushLiteralCandidate(selectionText, 0);
    pushRegexCandidate(selectionText, 0);

    const collapsed = selectionText.replace(/\s+/g, ' ');
    if (collapsed !== selectionText) {
      pushLiteralCandidate(collapsed, 1);
      pushRegexCandidate(collapsed, 1);
    }
  }

  const plainOffset = Number.isFinite(options.plainOffset)
    ? clamp(Math.floor(options.plainOffset), 0, Math.max(plainLength - 1, 0))
    : null;

  if (plainLength && (plainOffset !== null || !candidates.length)) {
    const windowSize = Math.min(plainLength, plainLength > 80 ? 80 : plainLength);
    if (windowSize > 0) {
      const center = plainOffset ?? Math.floor(plainLength / 2);
      const half = Math.floor(windowSize / 2);
      const start = clamp(center - half, 0, Math.max(plainLength - windowSize, 0));
      const end = clamp(start + windowSize, start + 1, plainLength);
      const snippet = plainText.slice(start, end);
      pushLiteralCandidate(snippet, 2);
      pushRegexCandidate(snippet, 2);
    }
  }

  candidates.sort((a, b) => a.priority - b.priority);

  const tryLiteral = (candidate) => {
    const index = plainText.toLowerCase().indexOf(candidate.lower);
    if (index === -1) {
      return null;
    }
    return { start: index, end: index + candidate.length };
  };

  const tryRegex = (candidate) => {
    try {
      const regex = new RegExp(candidate.value, 'i');
      const match = regex.exec(plainText);
      if (!match) {
        return null;
      }
      return { start: match.index, end: match.index + match[0].length };
    } catch (error) {
  // Debug prints removed
      return null;
    }
  };

  const convertPlainRange = (plainStart, plainEnd) => {
    if (!Number.isFinite(plainStart) || !Number.isFinite(plainEnd) || plainEnd <= plainStart) {
      return null;
    }

    const normalizedStart = clamp(Math.floor(plainStart), 0, Math.max(plainLength - 1, 0));
    const normalizedEnd = clamp(Math.ceil(plainEnd), normalizedStart + 1, plainLength);

    if (mapping && mapping.length) {
      const start = mapping[normalizedStart];
      const lastMapped = mapping[mapping.length - 1];
      let end;
      if (normalizedEnd < mapping.length) {
        end = mapping[normalizedEnd];
      } else {
        end = Number.isFinite(block.end) ? block.end : Number.isFinite(lastMapped) ? lastMapped + 1 : null;
      }

      if (!Number.isFinite(start)) {
        return null;
      }

      if (!Number.isFinite(end) || end <= start) {
        end = start + Math.max(normalizedEnd - normalizedStart, 1);
      }

      return { start, end };
    }

    if (Number.isFinite(blockStart) && Number.isFinite(blockEnd) && blockEnd > blockStart) {
      const blockSpan = blockEnd - blockStart;
      const plainTotal = Math.max(plainLength, 1);
      const scale = blockSpan / plainTotal;
      const approxStart = Math.round(blockStart + normalizedStart * scale);
      const approxEnd = Math.min(
        blockEnd,
        Math.max(approxStart + Math.round((normalizedEnd - normalizedStart) * scale), approxStart + 1)
      );
      return { start: approxStart, end: approxEnd };
    }

    return null;
  };

  for (const candidate of candidates) {
    const result = candidate.type === 'regex' ? tryRegex(candidate) : tryLiteral(candidate);
    if (!result) {
      continue;
    }

    const mapped = convertPlainRange(result.start, result.end);
    if (mapped) {
      return mapped;
    }
  }

  if (blockEnd > blockStart) {
    return { start: blockStart, end: blockEnd };
  }

  return null;
};

const ensureEditorSelectionVisible = (textarea, start) => {
  if (!textarea || !Number.isFinite(start)) {
    return;
  }

  try {
    const coords = getTextareaCaretCoordinates(textarea, Math.max(0, Math.floor(start)));
    const targetTop = textarea.scrollTop + coords.top - textarea.clientHeight / 2 + coords.lineHeight / 2;
    const maxScroll = Math.max(0, textarea.scrollHeight - textarea.clientHeight);
    const nextScroll = clamp(targetTop, 0, maxScroll);
    textarea.scrollTop = nextScroll;
  } catch (error) {
  // Debug prints removed
  }
};

const highlightEditorRange = (start, end) => {
  const edt = getActiveEditorInstance();
  const textarea = edt?.el ?? null;
  if (!textarea) {
    return false;
  }

  const valueLength = typeof textarea.value === 'string' ? textarea.value.length : 0;
  const safeStart = clamp(Number.isFinite(start) ? Math.floor(start) : 0, 0, valueLength);
  const safeEnd = clamp(Number.isFinite(end) ? Math.ceil(end) : safeStart, safeStart, valueLength);

  try {
    const edt = getActiveEditorInstance();
    // prefer editor instance focus helper
    try { edt.focus({ preventScroll: true }); } catch (e) { textarea.focus({ preventScroll: true }); }
  } catch (error) {
    try { getActiveEditorInstance().focus(); } catch (e) { textarea.focus(); }
  }
  try { getActiveEditorInstance().setSelectionRange(safeStart, safeEnd); } catch (e) { textarea.setSelectionRange(safeStart, safeEnd); }
  ensureEditorSelectionVisible(getEditorInstanceForElement(textarea)?.el ?? textarea, safeStart);
  return true;
};

const focusEditorFromPreviewElement = (element, options = {}) => {
  if (!element) {
    return false;
  }

  const noteId = element.dataset.sourceNoteId ?? state.activeNoteId;
  if (!noteId || noteId !== state.activeNoteId) {
    return false;
  }

  const previewInfo = state.previewSourceBlocks.get(noteId) ?? null;
  const blockId = element.dataset.sourceBlockId ?? null;
  const blockEntry = blockId && previewInfo?.blocksById ? previewInfo.blocksById.get(blockId) : null;
  const block = blockEntry?.block ?? null;

  let plainOffset = null;
  let selectionTextRaw = '';
  if (options.useSelection) {
    plainOffset = getPreviewPlainOffsetFromSelection(element);
    selectionTextRaw = getPreviewSelectionText(element) ?? '';
  }

  const selectionText = typeof selectionTextRaw === 'string' ? selectionTextRaw.trim() : '';

  if (!Number.isFinite(plainOffset)) {
    const textLength = typeof block?.plainText === 'string' ? block.plainText.length : 0;
    plainOffset = textLength > 0 ? Math.floor(textLength / 2) : 0;
  }

  const activeEditor = getActiveEditorInstance();
  const editorValue = typeof activeEditor?.el?.value === 'string' ? activeEditor.el.value : '';
  const originalMarkdown = typeof previewInfo?.collector?.original === 'string' ? previewInfo.collector.original : '';

  const attemptHighlight = (candidateRange) => {
    if (!candidateRange || !Number.isFinite(candidateRange.start) || !Number.isFinite(candidateRange.end)) {
      return false;
    }
    highlightPreviewElement(element);
    return highlightEditorRange(candidateRange.start, candidateRange.end);
  };

  const findRangeInEditorByText = (text) => {
    if (!text || !editorValue) {
      return null;
    }

    const normalize = (value) => value.replace(/\u00A0/g, ' ');
    const literal = normalize(text);
    const trimmed = literal.trim();
    if (!trimmed) {
      return null;
    }

    let index = editorValue.indexOf(trimmed);
    if (index !== -1) {
      return { start: index, end: index + trimmed.length };
    }

    index = editorValue.toLowerCase().indexOf(trimmed.toLowerCase());
    if (index !== -1) {
      return { start: index, end: index + trimmed.length };
    }

    const collapsed = trimmed.replace(/\s+/g, ' ');
    if (collapsed !== trimmed) {
      index = editorValue.indexOf(collapsed);
      if (index !== -1) {
        return { start: index, end: index + collapsed.length };
      }

      index = editorValue.toLowerCase().indexOf(collapsed.toLowerCase());
      if (index !== -1) {
        return { start: index, end: index + collapsed.length };
      }
    }

    const parts = trimmed.split(/\s+/).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
    if (!parts.length) {
      return null;
    }

    const pattern = parts.join('\\s+');
    try {
      const regex = new RegExp(pattern, 'i');
      const match = regex.exec(editorValue);
      if (match) {
        return { start: match.index, end: match.index + match[0].length };
      }
    } catch (error) {
  // Debug prints removed
    }

    return null;
  };

  const highlightByTextCandidates = (candidates = []) => {
    if (!Array.isArray(candidates)) {
      return false;
    }

    const seen = new Set();
    for (const candidate of candidates) {
      if (typeof candidate !== 'string') {
        continue;
      }

      const normalized = candidate.trim();
      if (!normalized) {
        continue;
      }

      const key = normalized.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      const range = findRangeInEditorByText(candidate);
      if (attemptHighlight(range)) {
        return true;
      }
    }

    return false;
  };

  if (block && previewInfo?.blocksById) {
    let fallbackRange = null;

    if (selectionText) {
      fallbackRange = findApproximateRangeInMarkdown(block, previewInfo, {
        plainOffset,
        selectionText
      });
      if (attemptHighlight(fallbackRange)) {
        return true;
      }
    }

    const primaryRange = computeEditorRangeForPreviewBlock(block, plainOffset);
    if (attemptHighlight(primaryRange)) {
      return true;
    }

    if (!fallbackRange) {
      fallbackRange = findApproximateRangeInMarkdown(block, previewInfo, {
        plainOffset,
        selectionText
      });
    }

    if (attemptHighlight(fallbackRange)) {
      return true;
    }
  }

  const elementText = element.textContent ?? '';
  const blockPlain = typeof block?.plainText === 'string' ? block.plainText : '';
  const mathSource = element.dataset?.mathSource ?? '';
  const blockStart = Number.isFinite(block?.start) ? block.start : null;
  const blockEnd = Number.isFinite(block?.end) ? block.end : null;
  const blockOriginalSegment =
    blockStart !== null && blockEnd !== null && blockEnd > blockStart && originalMarkdown
      ? originalMarkdown.slice(blockStart, blockEnd)
      : '';
  const plainLength = blockPlain.length;

  const fallbackCandidates = [];
  if (selectionText) {
    fallbackCandidates.push(selectionText);
    if (selectionTextRaw && selectionTextRaw !== selectionText) {
      fallbackCandidates.push(selectionTextRaw);
    }
  }
  if (mathSource) {
    fallbackCandidates.push(mathSource);
  }
  if (elementText) {
    fallbackCandidates.push(elementText.length > 512 ? elementText.slice(0, 512) : elementText);
  }
  if (blockPlain && (!selectionText || blockPlain.length < 2048)) {
    fallbackCandidates.push(blockPlain);
  }
  if (blockOriginalSegment) {
    fallbackCandidates.push(blockOriginalSegment);
  }

  if (plainLength && Number.isFinite(plainOffset)) {
    const windowSize = plainLength <= 200 ? plainLength : 200;
    if (windowSize > 0) {
      const half = Math.floor(windowSize / 2);
      const offsetNormalized = clamp(plainOffset, 0, Math.max(plainLength - 1, 0));
      const start = clamp(offsetNormalized - half, 0, Math.max(plainLength - windowSize, 0));
      const end = clamp(start + windowSize, start + 1, plainLength);
      const snippet = blockPlain.slice(start, end);
      if (snippet) {
        fallbackCandidates.push(snippet);
      }
    }
  }

  return highlightByTextCandidates(fallbackCandidates);
};

const buildBlockPlainTextMapping = (block, originalMarkdown) => {
  const rawSegment = originalMarkdown.slice(block.start, block.end);
  const { text: workingText, offsetDelta } = trimBlockPrefix(block, rawSegment);
  const mapping = [];
  const plainChars = [];
  const baseOffset = block.start + offsetDelta;

  for (let index = 0; index < workingText.length; index += 1) {
    const char = workingText[index];
    const absoluteIndex = baseOffset + index;

    if (char === '\r') {
      continue;
    }

    if (char === '\\' && index + 1 < workingText.length) {
      plainChars.push(workingText[index + 1]);
      mapping.push(absoluteIndex + 1);
      index += 1;
      continue;
    }

    if (isFormattingChar(char)) {
      continue;
    }

    plainChars.push(char);
    mapping.push(absoluteIndex);
  }

  return {
    plainText: plainChars.join(''),
    mapping
  };
};

const finalizeSourceMapCollector = (collector) => {
  if (!collector) {
    return null;
  }

  collector.blocks.forEach((block) => {
    block.start = convertPreparedIndexToOriginal(collector, block.rawStart);
    block.end = convertPreparedIndexToOriginal(collector, block.rawEnd);
    const { plainText, mapping } = buildBlockPlainTextMapping(block, collector.original);
    block.plainText = plainText;
    block.mapping = mapping;
  });

  collector.blocksById = new Map(collector.blocks.map((block) => [block.id, block]));
  return collector;
};

const finishSourceMapCollection = () => {
  const collector = activeSourceMapCollector;
  activeSourceMapCollector = null;
  if (!collector) {
    return null;
  }
  return finalizeSourceMapCollector(collector);
};

const collectSourceMapToken = (token) => {
  if (!activeSourceMapCollector) {
    return;
  }
  if (!token || typeof token.type !== 'string' || !blockTokenTypesForMapping.has(token.type)) {
    return;
  }

  const raw = typeof token.raw === 'string' ? token.raw : '';
  if (!raw) {
    return;
  }

  const prepared = activeSourceMapCollector.prepared;
  let startIndex = prepared.indexOf(raw, activeSourceMapCollector.cursor);
  if (startIndex === -1) {
    const trimmed = raw.trim();
    if (!trimmed) {
      return;
    }
    startIndex = prepared.indexOf(trimmed, activeSourceMapCollector.cursor);
    if (startIndex === -1) {
      return;
    }
  }

  const expectedSlice = prepared.slice(startIndex, startIndex + raw.length);
  const lengthUsed = expectedSlice === raw ? raw.length : raw.trim().length;
  const endIndex = startIndex + lengthUsed;
  activeSourceMapCollector.cursor = Math.max(activeSourceMapCollector.cursor, endIndex);
  activeSourceMapCollector.blocks.push({
    id: `b${activeSourceMapCollector.blocks.length}`,
    type: token.type,
    depth: token.depth ?? null,
    rawStart: startIndex,
    rawEnd: endIndex
  });
};

const withRenderContext = (context, fn) => {
  renderContextStack.push(context);
  try {
    return fn();
  } finally {
    renderContextStack.pop();
  }
};

const getRenderContext = () => renderContextStack[renderContextStack.length - 1] ?? null;

const renderMarkdownToHtml = (markdown, context, options = {}) =>
  withRenderContext(context, () => {
    const collectSourceMap = Boolean(options.collectSourceMap);
    const noteId = options.noteId ?? context?.noteId ?? null;
    const anchorReplacements = collectSourceMap ? [] : null;
    
    // Process highlighting syntax (==text==) before other processing
    let processedMarkdown = (markdown ?? '').replace(/==([^=]+)==/g, '<mark>$1</mark>');
    
    const prepared = injectBlockAnchors(processedMarkdown, anchorReplacements);

    if (collectSourceMap) {
      startSourceMapCollection(markdown ?? '', prepared, anchorReplacements ?? []);
    }

    const raw = window.marked.parse(prepared);
    const sanitized = window.DOMPurify.sanitize(raw, domPurifyConfig);

    let collector = null;
    if (collectSourceMap) {
      collector = finishSourceMapCollection();
      if (collector) {
        collector.noteId = noteId;
      }
    }

    return { html: sanitized, collector };
  });

const getPdfCacheKey = (note) => {
  if (!note) {
    return null;
  }
  return note.absolutePath ?? note.storedPath ?? note.id ?? null;
};

// Cache for PDF resources (object URLs etc.)
const pdfCache = new Map();

// Track the resource currently displayed in the global PDF viewer so we can
// revoke object URLs when they are no longer needed. This prevents leaking
// Blob object URLs and helps keep memory usage low when users open many PDFs.
let currentDisplayedPdfResource = null;

// Clear the global PDF viewer and release any non-cached object URL resource.
const clearGlobalPdfViewer = () => {
  try {
    if (elements.pdfViewer) {
      elements.pdfViewer.classList.remove('visible');
      // Remove src so the iframe does not keep a reference to the blob
      elements.pdfViewer.removeAttribute('src');
      // Remove accessibility focus if set
      try { elements.pdfViewer.blur(); } catch (e) {}
    }

    // If the currently displayed resource was an objectUrl and it is not
    // present in the cache (i.e., we created it for a one-off view), revoke it.
    if (currentDisplayedPdfResource && currentDisplayedPdfResource.type === 'objectUrl') {
      const stillCached = Array.from(pdfCache.values()).some(r => r && r.value === currentDisplayedPdfResource.value);
      if (!stillCached) {
        releasePdfResource(currentDisplayedPdfResource);
      }
    }

    currentDisplayedPdfResource = null;
    // Restore focus to a sensible place (active editor or workspace)
    try {
      const ed = getAnyEditorInstance();
      if (ed && typeof ed.focus === 'function') ed.focus();
      else if (elements.workpace) elements.workpace?.focus?.();
    } catch (e) {}
  } catch (e) {
    // ignore cleanup errors
  }
};

// Caches for resolved preview resources (images, video, html embeds)
const imageResourceCache = new Map();
const videoResourceCache = new Map();
const htmlResourceCache = new Map();


const releasePdfResource = (resource) => {
  if (!resource || resource.type !== 'objectUrl' || !resource.value) {
    return;
  }

  try {
    URL.revokeObjectURL(resource.value);
  } catch (error) {
  // Debug prints removed
  }
};

const ensureUint8Array = (payload) => {
  if (!payload) {
    return null;
  }
  if (payload instanceof Uint8Array) {
    return payload;
  }
  if (payload instanceof ArrayBuffer) {
    return new Uint8Array(payload);
  }
  if (Array.isArray(payload)) {
    return Uint8Array.from(payload);
  }
  if (payload?.type === 'Buffer' && Array.isArray(payload.data)) {
    return Uint8Array.from(payload.data);
  }
  return null;
};

const applyPdfResource = (resource) => {
  if (!elements.pdfViewer || !resource || !resource.value) {
    return false;
  }

  // Get current theme preference
  const currentTheme = resolveCurrentThemePreference();
  
  // Use our custom PDF.js viewer with the PDF file URL and theme
  const viewerUrl = './pdfjs/pdf-viewer.html?file=' + encodeURIComponent(resource.value) + '&theme=' + encodeURIComponent(currentTheme);
  // Clear any previous viewer state first
  clearGlobalPdfViewer();

  elements.pdfViewer.src = viewerUrl;
  elements.pdfViewer.classList.add('visible');

  // Mark the current displayed resource so it can be revoked later if not cached
  currentDisplayedPdfResource = resource;

  // Accessibility: make the iframe focusable and move focus to it so keyboard
  // users can interact with the PDF viewer. The iframe will expose its own
  // controls (toolbar) inside the embedded viewer.
  try {
    elements.pdfViewer.setAttribute('tabindex', '0');
    elements.pdfViewer.setAttribute('role', 'document');
    elements.pdfViewer.setAttribute('aria-label', 'PDF viewer');
    // Move focus after a short delay to allow the iframe to attach
    setTimeout(() => { try { elements.pdfViewer.focus(); } catch (e) {} }, 150);
  } catch (e) {}
  return true;
};

// When the global PDF viewer is active, allow Escape to close it and restore
// focus to the editor. We attach a document-level keydown handler when the
// viewer receives focus and remove it when we clear the viewer.
const onPdfViewerKeydown = (ev) => {
  try {
    if (!ev || ev.key !== 'Escape') return;
    // Close viewer
    clearGlobalPdfViewer();
    // Prevent default so the event doesn't propagate to editors
    ev.preventDefault();
    ev.stopPropagation();
  } catch (e) {}
};

// Attach focus/blur handlers to the iframe so it can register/unregister
// the Escape key listener appropriately.
try {
  if (elements.pdfViewer) {
    elements.pdfViewer.addEventListener('focus', () => {
      document.addEventListener('keydown', onPdfViewerKeydown, { capture: true });
      elements.pdfViewer.setAttribute('aria-hidden', 'false');
    });
    elements.pdfViewer.addEventListener('blur', () => {
      document.removeEventListener('keydown', onPdfViewerKeydown, { capture: true });
      elements.pdfViewer.setAttribute('aria-hidden', 'true');
    });
  }
} catch (e) {}

// Helpers for per-pane PDF rendering. Some users prefer PDFs to open inside
// the editor pane they dropped the file into rather than the central live
// preview. The functions below create a pane-local iframe viewer and hide
// the textarea for that pane while a non-markdown viewer is active.
const getPaneRootElement = (paneId) => {
  if (!paneId) return null;
  if (paneId === 'left') return document.querySelector('.editor-pane--left');
  if (paneId === 'right') return document.querySelector('.editor-pane--right');
  return document.querySelector(`[data-pane-id="${paneId}"]`);
};

const clearPaneViewer = (paneId) => {
  try {
    const root = getPaneRootElement(paneId);
    if (!root) return;
    // Remove any pane-local viewers (pdf, image, video, html) and any
    // generic media elements so a new file can fully replace the pane.
    const selectors = ['.pdf-pane-viewer', '.image-pane-viewer', '.video-pane-viewer', '.html-pane-viewer', '.pane-viewer'];
    selectors.forEach((sel) => {
      try {
        const el = root.querySelector(sel);
        if (el) el.remove();
      } catch (e) { }
    });

    // Also remove any direct media elements that might have been inserted
    // (img/iframe/video) to be safe.
    try {
      const media = Array.from(root.querySelectorAll('img, iframe, video'));
      media.forEach((m) => {
        // Avoid removing the image viewer inside the global workspace (it won't be inside a pane root)
        if (m && m.parentElement && m.parentElement.closest && m.parentElement.closest('.editor-pane') === root) {
          m.remove();
        }
      });
    } catch (e) { }

    // Show the CodeMirror editor
    const cm = root.querySelector('.CodeMirror');
    if (cm) cm.style.display = '';
    const ta = root.querySelector('textarea');
    if (ta) {
      ta.hidden = false;
      ta.disabled = false;
    }
  } catch (e) { /* ignore */ }
};

const renderPdfInPane = async (note, paneId) => {
  if (!note || note.type !== 'pdf' || !paneId) return false;
  const root = getPaneRootElement(paneId);
  if (!root) return false;

  // Remove any global PDF preview to avoid duplicates
  try { elements.pdfViewer?.classList.remove('visible'); elements.pdfViewer?.removeAttribute('src'); } catch (e) {}

  // Clear existing pane viewer and hide CodeMirror editor
  clearPaneViewer(paneId);
  const cm = root.querySelector('.CodeMirror');
  if (cm) cm.style.display = 'none';
  const ta = root.querySelector('textarea');
  if (ta) {
    ta.hidden = true;
    ta.disabled = true;
  }

  // Resolve resource (object URL or data URI)
  try {
    let resource = null;
    if (note.absolutePath) {
      const binary = await window.api.readPdfBinary({ absolutePath: note.absolutePath });
      const uint8 = ensureUint8Array(binary);
      if (uint8 && uint8.byteLength) {
        const blob = new Blob([uint8], { type: 'application/pdf' });
        resource = { type: 'objectUrl', value: URL.createObjectURL(blob) };
      }
    } else if (note.storedPath) {
      const dataUri = await window.api.loadPdfData({ storedPath: note.storedPath });
      if (dataUri) resource = { type: 'dataUri', value: dataUri };
    }

    if (!resource || !resource.value) {
  // Debug prints removed
      const cm = root.querySelector('.CodeMirror');
      if (cm) cm.style.display = '';
      const ta = root.querySelector('textarea');
      if (ta) {
        ta.hidden = false;
        ta.disabled = false;
      }
      return false;
    }

    // Get current theme preference
    const currentTheme = resolveCurrentThemePreference();
    
    const viewerUrl = './pdfjs/pdf-viewer.html?file=' + encodeURIComponent(resource.value) + '&forceToolbar=true&theme=' + encodeURIComponent(currentTheme);
    const iframe = document.createElement('iframe');
    iframe.className = 'pdf-pane-viewer';
    iframe.src = viewerUrl;
    iframe.title = note.title ?? 'PDF Preview';
    // Insert after the textarea so it occupies the editor pane area
    root.appendChild(iframe);
    return true;
  } catch (error) {
  // Debug prints removed
    if (ta) ta.hidden = false;
    return false;
  }
};

// Render an image inside a specific editor pane (pane-local viewer)
const renderImageInPane = async (note, paneId) => {
  if (!note || note.type !== 'image' || !paneId) return false;
  const root = getPaneRootElement(paneId);
  if (!root) return false;

  // Clear existing pane viewers and hide textarea
  clearPaneViewer(paneId);

  // Create pane viewer wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'image-pane-viewer pane-viewer';
  wrapper.setAttribute('data-note-id', note.id);
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'center';
  wrapper.style.alignItems = 'center';
  wrapper.style.padding = '8px';

  const img = document.createElement('img');
  img.alt = note.title ?? 'Image';
  img.style.maxWidth = '100%';
  img.style.maxHeight = '100%';
  img.dataset.noteId = note.id;

  wrapper.appendChild(img);
  root.appendChild(wrapper);

  // Hide the CodeMirror editor so it's not covered by the image
  const cm = root.querySelector('.CodeMirror');
  if (cm) cm.style.display = 'none';
  const ta = root.querySelector('textarea');
  if (ta) {
    ta.hidden = true;
    ta.disabled = true;
  }

  try {
    const payload = {
      src: note.absolutePath ?? note.storedPath ?? '',
      notePath: note.absolutePath ?? null,
      folderPath: note.folderPath ?? state.currentFolder ?? null
    };
    const result = await window.api.resolveResource(payload);
    const value = result?.value ?? null;
    if (value) {
      img.src = value;
      try { console.log('renderImageInPane: image set in pane', { paneId, noteId: note.id }); } catch (e) {}
      return true;
    }
  } catch (e) {
    try { console.error('renderImageInPane failed', e); } catch (e2) {}
  }

  // Fallback: show textarea again
  try { if (ta) { ta.hidden = false; } } catch (e) {}
  if (wrapper && wrapper.parentNode) wrapper.remove();
  return false;
};

const clearPdfCache = () => {
  for (const resource of pdfCache.values()) {
    releasePdfResource(resource);
  }
  pdfCache.clear();
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const stripExtension = (value) => value?.replace(/\.[^./\\]+$/, '') ?? '';

const absoluteUrlPattern = /^[a-zA-Z][a-zA-Z\d+-.]*:/;
const protocolRelativePattern = /^\/\//;
const imageExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.bmp',
  '.tif',
  '.tiff',
  '.svg',
  '.avif',
  '.ico'
]);

const videoExtensions = new Set([
  '.mp4',
  '.webm',
  '.ogg',
  '.ogv',
  '.avi',
  '.mov',
  '.wmv',
  '.flv',
  '.mkv',
  '.m4v'
]);

const htmlExtensions = new Set([
  '.html',
  '.htm'
]);

const blockLabelPattern = /(?:^|\s)\^([a-zA-Z0-9_-]{1,64})(?:\s+(?:"([^"\n]{1,160})"|'([^'\n]{1,160})'))?(?=\s*(?:\n|$))/gm;

const normalizeBlockLabel = (value) => value?.trim().toLowerCase() ?? null;

const escapeHtml = (unsafe) =>
  unsafe
    ?.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;') ?? '';

const extractBlockDefinitions = (markdown) => {
  if (!markdown || typeof markdown !== 'string') {
    return [];
  }

  const definitions = new Map();
  blockLabelPattern.lastIndex = 0;
  let match = null;
  while ((match = blockLabelPattern.exec(markdown)) !== null) {
    const rawLabel = typeof match[1] === 'string' ? match[1].trim() : '';
    const label = normalizeBlockLabel(rawLabel);
    if (!label) {
      continue;
    }
    const title = (match[2] ?? match[3] ?? '').trim();
    definitions.set(label, {
      label,
      rawLabel,
      title: title || null
    });
  }
  return definitions;
};

const injectBlockAnchors = (markdown, replacements = null) => {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  blockLabelPattern.lastIndex = 0;
  let cumulativeShift = 0;
  return markdown.replace(blockLabelPattern, (match, capturedLabel = '', capturedTitleDouble = '', capturedTitleSingle = '', offset = 0) => {
    const caretIndex = match.lastIndexOf('^');
    const leading = caretIndex > 0 ? match.slice(0, caretIndex) : '';
    const originalLabel = typeof capturedLabel === 'string' ? capturedLabel.trim() : '';
    const normalized = normalizeBlockLabel(originalLabel);
    if (!normalized) {
      return leading;
    }
    const title = (capturedTitleDouble || capturedTitleSingle || '').trim();
    const attributes = [
      `data-block-id="${normalized}"`,
      `data-block-label="${escapeHtml(originalLabel)}"`
    ];
    if (title) {
      attributes.push(`data-block-title="${escapeHtml(title)}"`);
    }
    const span = `<span class="block-anchor" ${attributes.join(' ')}></span>`;

    if (Array.isArray(replacements)) {
      const caretStart = offset + leading.length;
      const originalLength = match.length - leading.length;
      const replacementLength = span.length;
      replacements.push({
        originalStart: caretStart,
        originalEnd: caretStart + originalLength,
        preparedStart: caretStart + cumulativeShift,
        preparedEnd: caretStart + cumulativeShift + replacementLength,
        shift: replacementLength - originalLength
      });
      cumulativeShift += replacementLength - originalLength;
    }

    return `${leading}${span}`;
  });
};

  const isLikelyExternalUrl = (value) => {
    if (!value) return false;
    return /^https?:/.test(value) || /^file:/.test(value);
  };

const collapseWhitespace = (value) => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '');

const clampSnippetPart = (value, limit = 80, takeEnd = false) => {
  const collapsed = collapseWhitespace(value);
  if (!collapsed) {
    return '';
  }
  if (!Number.isFinite(limit) || limit <= 0 || collapsed.length <= limit) {
    return collapsed;
  }
  return takeEnd ? collapsed.slice(collapsed.length - limit) : collapsed.slice(0, limit);
};

const buildHashtagSnippetParts = (content, start, end) => {
  const source = typeof content === 'string' ? content : '';
  const safeStart = clamp(Number.isFinite(start) ? start : 0, 0, source.length);
  const safeEnd = clamp(Number.isFinite(end) ? end : safeStart, safeStart, source.length);
  const radius = 70;

  const snippetStart = Math.max(0, safeStart - radius);
  const snippetEnd = Math.min(source.length, safeEnd + radius);

  const rawBefore = source.slice(snippetStart, safeStart);
  const rawMatch = source.slice(safeStart, safeEnd);
  const rawAfter = source.slice(safeEnd, snippetEnd);

  return {
    prefix: snippetStart > 0 && collapseWhitespace(rawBefore).length > 0,
    suffix: snippetEnd < source.length && collapseWhitespace(rawAfter).length > 0,
    before: clampSnippetPart(rawBefore, 80, true),
    match: rawMatch || '',
    after: clampSnippetPart(rawAfter, 80, false)
  };
};

const parseHashtagsFromContent = (content) => {
  const result = new Map();
  if (typeof content !== 'string' || !content.length) {
    return result;
  }

  hashtagPattern.lastIndex = 0;
  let match = null;

  while ((match = hashtagPattern.exec(content)) !== null) {
    const before = match[1] ?? '';
    const rawTag = match[2] ?? '';
    if (!rawTag) {
      continue;
    }

    const tagKey = normalizeHashtagKey(rawTag);
    if (!tagKey) {
      continue;
    }

    const tagStart = match.index + before.length;
    const tagEnd = tagStart + rawTag.length + 1;
    const snippet = buildHashtagSnippetParts(content, tagStart, tagEnd);

    let entry = result.get(tagKey);
    if (!entry) {
      entry = {
        tag: tagKey,
        forms: new Map(),
        occurrences: []
      };
      result.set(tagKey, entry);
    }

    entry.forms.set(rawTag, (entry.forms.get(rawTag) ?? 0) + 1);
    entry.occurrences.push({
      index: tagStart,
      length: tagEnd - tagStart,
      snippet,
      rawText: content.slice(tagStart, tagEnd)
    });
  }

  return result;
};

// Minimal hashtag matching pattern and normalizer (safe defaults)
const hashtagPattern = /(^|\s)(#([A-Za-z0-9_\-]+))/g;

const normalizeHashtagKey = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  // Normalize to lowercase and trim non-alphanumeric edges
  const cleaned = raw.trim().replace(/[^A-Za-z0-9_\-]/g, '');
  return cleaned ? cleaned.toLowerCase() : null;
};

const removeHashtagEntriesForNote = (noteId) => {
  if (!noteId || !state.hashtagsByNote.has(noteId)) {
    return;
  }

  const previous = state.hashtagsByNote.get(noteId);
  previous.forEach((info, tag) => {
    const aggregate = state.hashtagIndex.get(tag);
    if (!aggregate) {
      return;
    }

    aggregate.occurrences = Math.max(0, aggregate.occurrences - info.occurrences.length);
    aggregate.noteIds.delete(noteId);

    if (aggregate.forms && info.forms) {
      info.forms.forEach((count, form) => {
        const existing = aggregate.forms.get(form) ?? 0;
        if (existing <= count) {
          aggregate.forms.delete(form);
        } else {
          aggregate.forms.set(form, existing - count);
        }
      });
    }

    if (!aggregate.noteIds.size) {
      state.hashtagIndex.delete(tag);
    }
  });

  state.hashtagsByNote.delete(noteId);

  if (state.activeHashtag && !state.hashtagIndex.has(state.activeHashtag)) {
    state.activeHashtag = null;
  }
};

const refreshHashtagsForNote = (note, options = {}) => {
  if (!note || !note.id) {
    return;
  }

  const { silent = false } = options;

  removeHashtagEntriesForNote(note.id);

  if (note.type !== 'markdown') {
    if (!silent) {
      renderHashtagPanel();
    }
    return;
  }

  const parsed = parseHashtagsFromContent(note.content ?? '');
  if (!parsed.size) {
    if (!silent) {
      renderHashtagPanel();
    }
    return;
  }

  state.hashtagsByNote.set(note.id, parsed);

  parsed.forEach((info, tag) => {
    let aggregate = state.hashtagIndex.get(tag);
    if (!aggregate) {
      aggregate = {
        tag,
        noteIds: new Set(),
        forms: new Map(),
        occurrences: 0
      };
      state.hashtagIndex.set(tag, aggregate);
    }

    aggregate.noteIds.add(note.id);
    aggregate.occurrences += info.occurrences.length;
    info.forms.forEach((count, form) => {
      aggregate.forms.set(form, (aggregate.forms.get(form) ?? 0) + count);
    });
  });

  if (!silent) {
    renderHashtagPanel();
  }
};

const rebuildHashtagIndex = () => {
  state.hashtagIndex = new Map();
  state.hashtagsByNote = new Map();

  state.notes.forEach((note) => {
    refreshHashtagsForNote(note, { silent: true });
  });

  if (state.activeHashtag && !state.hashtagIndex.has(state.activeHashtag)) {
    state.activeHashtag = null;
  }

  renderHashtagPanel();
};

const formatPlural = (count, singular, plural = null) => {
  const label = count === 1 ? singular : plural ?? `${singular}s`;
  return `${count} ${label}`;
};

const resolvePreferredHashtagForm = (entry) => {
  if (!entry) {
    return '';
  }

  let bestForm = null;
  let bestCount = -1;

  if (entry.forms instanceof Map && entry.forms.size) {
    entry.forms.forEach((count, form) => {
      if (count > bestCount) {
        bestForm = form;
        bestCount = count;
        return;
      }
      if (count === bestCount && bestForm) {
        if (form.toLowerCase().localeCompare(bestForm.toLowerCase(), undefined, { sensitivity: 'accent' }) < 0) {
          bestForm = form;
        }
      }
    });
  }

  return bestForm ?? entry.tag ?? '';
};

const getHashtagDisplayLabel = (entry) => {
  if (!entry) {
    return '#';
  }
  const base = resolvePreferredHashtagForm(entry);
  const normalized = base || entry.tag || '';
  return `#${normalized}`;
};

const syncHashtagDetailSelection = () => {
  const detail = elements.hashtagDetail;
  if (!detail) {
    return;
  }

  const items = detail.querySelectorAll('.hashtag-detail__item[data-note-id]');
  items.forEach((item) => {
    const noteId = item.getAttribute('data-note-id');
    if (noteId && state.activeNoteId && noteId === state.activeNoteId) {
      item.classList.add('hashtag-detail__item--active');
      item.setAttribute('aria-current', 'true');
    } else {
      item.classList.remove('hashtag-detail__item--active');
      item.removeAttribute('aria-current');
    }
  });
};

const renderHashtagDetail = (tag, entry) => {
  const detail = elements.hashtagDetail;
  if (!detail) {
    return;
  }

  detail.replaceChildren();

  if (!entry) {
    detail.hidden = true;
    return;
  }

  const header = document.createElement('div');
  header.className = 'hashtag-detail__header';

  const title = document.createElement('span');
  title.textContent = getHashtagDisplayLabel(entry);
  header.appendChild(title);

  const counts = document.createElement('span');
  counts.className = 'hashtag-detail__meta';
  counts.textContent = `${formatPlural(entry.noteIds.size, 'note')} · ${formatPlural(entry.occurrences, 'hit')}`;
  header.appendChild(counts);

  detail.appendChild(header);

  const container = document.createElement('div');
  container.className = 'hashtag-detail__items';
  detail.appendChild(container);

  const noteItems = Array.from(entry.noteIds)
    .map((noteId) => {
      const note = state.notes.get(noteId);
      const noteHashtags = state.hashtagsByNote.get(noteId);
      const noteEntry = noteHashtags?.get(tag) ?? null;
      if (!note || !noteEntry) {
        return null;
      }
      return { note, info: noteEntry };
    })
    .filter(Boolean);

  noteItems.sort((a, b) => {
    const titleA = a.note.title ?? '';
    const titleB = b.note.title ?? '';
    return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' });
  });

  if (!noteItems.length) {
    const empty = document.createElement('div');
    empty.className = 'hashtag-detail__empty';
    empty.textContent = 'No matching notes found.';
    container.appendChild(empty);
  } else {
    noteItems.forEach(({ note, info }) => {
      const occurrence = info.occurrences[0] ?? null;

      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'hashtag-detail__item';
      item.dataset.noteId = note.id;
      item.dataset.tag = tag;

      if (occurrence) {
        item.dataset.start = occurrence.index;
        item.dataset.end = occurrence.index + occurrence.length;
      }

      if (note.id === state.activeNoteId) {
        item.classList.add('hashtag-detail__item--active');
        item.setAttribute('aria-current', 'true');
      }

      const titleNode = document.createElement('div');
      titleNode.className = 'hashtag-detail__note';
      titleNode.textContent = note.title ?? 'Untitled';
      item.appendChild(titleNode);

      const snippetNode = document.createElement('div');
      snippetNode.className = 'hashtag-detail__snippet';

      if (occurrence?.snippet) {
        const { prefix, suffix, before, match, after } = occurrence.snippet;
        const leadingParts = [];
        if (prefix) {
          leadingParts.push('…');
        }
        if (before) {
          leadingParts.push(before);
        }
        if (leadingParts.length) {
          snippetNode.appendChild(document.createTextNode(`${leadingParts.join(' ')} `));
        }

        const matchSpan = document.createElement('span');
        matchSpan.className = 'hashtag-detail__match';
        matchSpan.textContent = match || occurrence.rawText || getHashtagDisplayLabel(entry);
        snippetNode.appendChild(matchSpan);

        const trailingParts = [];
        if (after) {
          trailingParts.push(after);
        }
        if (suffix) {
          trailingParts.push('…');
        }
        if (trailingParts.length) {
          snippetNode.appendChild(document.createTextNode(` ${trailingParts.join(' ')}`));
        }
      } else {
        snippetNode.textContent = 'No preview available.';
      }

      item.appendChild(snippetNode);

      if (info.occurrences.length > 1) {
        const metaNode = document.createElement('div');
        metaNode.className = 'hashtag-detail__meta';
        metaNode.textContent = formatPlural(info.occurrences.length, 'match');
        item.appendChild(metaNode);
      }

      container.appendChild(item);
    });
  }

  detail.hidden = false;
};

const renderHashtagPanel = () => {
  const list = elements.hashtagList;
  const empty = elements.hashtagEmpty;
  const detail = elements.hashtagDetail;
  const clearButton = elements.clearHashtagFilter;

  if (!list || !empty || !detail) {
    return;
  }

  const entries = Array.from(state.hashtagIndex.entries());

  if (!entries.length) {
    list.replaceChildren();
    list.hidden = true;
    detail.replaceChildren();
    detail.hidden = true;
    empty.hidden = false;
    if (clearButton) {
      clearButton.hidden = true;
      clearButton.disabled = true;
    }
    return;
  }

  empty.hidden = true;
  list.hidden = false;

  entries.sort((a, b) => {
    const aNotes = a[1].noteIds.size;
    const bNotes = b[1].noteIds.size;
    if (aNotes !== bNotes) {
      return bNotes - aNotes;
    }
    const aOccurrences = a[1].occurrences;
    const bOccurrences = b[1].occurrences;
    if (aOccurrences !== bOccurrences) {
      return bOccurrences - aOccurrences;
    }
    const aLabel = getHashtagDisplayLabel(a[1]);
    const bLabel = getHashtagDisplayLabel(b[1]);
    return aLabel.localeCompare(bLabel, undefined, { sensitivity: 'base' });
  });

  const fragment = document.createDocumentFragment();
  entries.forEach(([tag, entry]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hashtag-pill';
    button.dataset.tag = tag;

    const isActive = state.activeHashtag === tag;
    if (isActive) {
      button.classList.add('hashtag-pill--active');
    }
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    button.title = `${formatPlural(entry.noteIds.size, 'note')} · ${formatPlural(entry.occurrences, 'hit')}`;

    const tagLabel = document.createElement('span');
    tagLabel.className = 'hashtag-pill__tag';
    tagLabel.textContent = getHashtagDisplayLabel(entry);
    button.appendChild(tagLabel);

    const count = document.createElement('span');
    count.className = 'hashtag-pill__count';
    count.textContent = String(entry.noteIds.size);
    count.setAttribute('aria-label', formatPlural(entry.noteIds.size, 'note'));
    button.appendChild(count);

    fragment.appendChild(button);
  });

  list.replaceChildren(fragment);

  if (state.activeHashtag && !state.hashtagIndex.has(state.activeHashtag)) {
    state.activeHashtag = null;
  }

  if (state.activeHashtag) {
    const activeEntry = state.hashtagIndex.get(state.activeHashtag) ?? null;
    renderHashtagDetail(state.activeHashtag, activeEntry);
    if (clearButton) {
      clearButton.hidden = false;
      clearButton.disabled = false;
    }
  } else {
    detail.replaceChildren();
    detail.hidden = true;
    if (clearButton) {
      clearButton.hidden = true;
      clearButton.disabled = true;
    }
  }

  syncHashtagDetailSelection();
};

const handleHashtagListClick = (event) => {
  const target = event.target.closest('.hashtag-pill[data-tag]');
  if (!target) {
    return;
  }

  event.preventDefault();

  const tag = target.dataset.tag;
  if (!tag) {
    return;
  }

  state.activeHashtag = state.activeHashtag === tag ? null : tag;
  renderHashtagPanel();
};

const handleHashtagDetailClick = (event) => {
  const target = event.target.closest('.hashtag-detail__item[data-note-id]');
  if (!target) {
    return;
  }

  event.preventDefault();

  const noteId = target.dataset.noteId;
  const start = Number.parseInt(target.dataset.start ?? '', 10);
  const end = Number.parseInt(target.dataset.end ?? '', 10);

  if (!noteId) {
    return;
  }

  const hasValidRange = Number.isFinite(start) && Number.isFinite(end) && end > start;

  if (state.activeNoteId === noteId) {
    state.pendingHashtagFocus = null;
    if (hasValidRange) {
      highlightEditorRange(start, end);
      try {
        getActiveEditorInstance().focus({ preventScroll: true });
      } catch (error) {
        try { getActiveEditorInstance().focus(); } catch (e) {}
      }
    }
    return;
  }

  state.pendingHashtagFocus = hasValidRange ? { noteId, start, end } : null;
  openNoteById(noteId, true);
  syncHashtagDetailSelection();
};

const handleClearHashtagFilter = (event) => {
  event.preventDefault();
  if (!state.activeHashtag) {
    return;
  }
  state.activeHashtag = null;
  state.pendingHashtagFocus = null;
  renderHashtagPanel();
};

const resolveNoteIdBySlug = (target) => {
  const cleaned = target?.split('|')[0]?.replace(/\s*->.*$/, '') ?? target;
  const slug = toWikiSlug(cleaned);
  if (!slug) {
    return null;
  }
  return state.wikiIndex.get(slug) ?? null;
};

const parseWikiTarget = (target, context) => {
  const raw = target ?? '';
  let remaining = raw.trim();
  let blockId = null;

  const blockMatch = remaining.match(/#\^([a-zA-Z0-9_-]{1,64})$/);
  if (blockMatch) {
    blockId = normalizeBlockLabel(blockMatch[1]);
    remaining = remaining.slice(0, remaining.length - blockMatch[0].length).replace(/#$/, '').trim();
  }

  let noteId = null;
  if (!remaining || remaining === '#') {
    noteId = context?.noteId ?? null;
  } else {
    noteId = resolveNoteIdBySlug(remaining);
  }

  let hasBlock = false;
  let blockEntry = null;
  if (noteId && blockId) {
    const key = `${noteId}::${blockId}`;
    if (state.blockIndex.has(key)) {
      hasBlock = true;
      blockEntry = state.blockIndex.get(key);
    } else {
      const note = state.notes.get(noteId);
      if (note && note.type === 'markdown') {
        refreshBlockIndexForNote(note);
        if (state.blockIndex.has(key)) {
          hasBlock = true;
          blockEntry = state.blockIndex.get(key);
        }
      }
    }
  }

  return {
    raw,
    noteId,
    blockId,
    hasBlock,
    blockEntry
  };
};

const getActionableErrorMessage = (action, error) => {
  const errorMessage = error.message.toLowerCase();

  switch (action) {
    case 'save':
      if (errorMessage.includes('permission') || errorMessage.includes('access')) {
        return 'Cannot save file: Permission denied. Check file permissions or try saving with a different name.';
      }
      if (errorMessage.includes('disk') || errorMessage.includes('space')) {
        return 'Cannot save file: Not enough disk space available.';
      }
      if (errorMessage.includes('readonly') || errorMessage.includes('read-only')) {
        return 'Cannot save file: File is read-only. Make it writable or save with a different name.';
      }
      return 'Failed to save file. Try saving with a different name or check file permissions.';

    case 'load':
    case 'open':
      if (errorMessage.includes('not found') || errorMessage.includes('enoent')) {
        return 'File not found. It may have been moved or deleted.';
      }
      if (errorMessage.includes('permission') || errorMessage.includes('access')) {
        return 'Cannot open file: Permission denied. Check file permissions.';
      }
      if (errorMessage.includes('encoding') || errorMessage.includes('invalid')) {
        return 'Cannot open file: File encoding not supported or file is corrupted.';
      }
      return 'Failed to open file. Check if the file exists and you have permission to read it.';

    case 'delete':
      if (errorMessage.includes('permission') || errorMessage.includes('access')) {
        return 'Cannot delete file: Permission denied. Check file permissions.';
      }
      if (errorMessage.includes('in use') || errorMessage.includes('busy')) {
        return 'Cannot delete file: File is currently in use by another application.';
      }
      return 'Failed to delete file. Check if the file exists and you have permission to delete it.';

    case 'rename':
      if (errorMessage.includes('permission') || errorMessage.includes('access')) {
        return 'Cannot rename file: Permission denied. Check file permissions.';
      }
      if (errorMessage.includes('exists') || errorMessage.includes('already')) {
        return 'Cannot rename file: A file with that name already exists.';
      }
      if (errorMessage.includes('invalid') || errorMessage.includes('character')) {
        return 'Cannot rename file: Invalid characters in filename.';
      }
      return 'Failed to rename file. Check permissions and ensure the new name is valid.';

    case 'create':
      if (errorMessage.includes('permission') || errorMessage.includes('access')) {
        return 'Cannot create file: Permission denied. Check folder permissions.';
      }
      if (errorMessage.includes('exists') || errorMessage.includes('already')) {
        return 'Cannot create file: A file with that name already exists.';
      }
      if (errorMessage.includes('invalid') || errorMessage.includes('character')) {
        return 'Cannot create file: Invalid characters in filename.';
      }
      return 'Failed to create file. Check folder permissions and ensure the name is valid.';

    default:
      return `Failed to ${action} file: ${error.message}`;
  }
};

const setStatus = (message, transient = true, isCommandExplanation = false) => {
  if (!elements.statusText) {
    return;
  }

  // Don't overwrite command explanations with other messages
  if (state.currentCommandExplanation && !isCommandExplanation && message !== '') {
    return;
  }

  elements.statusText.textContent = message;
  if (statusTimer) {
    clearTimeout(statusTimer);
  }

  // Command explanations should not auto-clear
  if (transient && !isCommandExplanation) {
    statusTimer = setTimeout(() => {
      // Only clear if there's no active command explanation
      if (!state.currentCommandExplanation) {
        elements.statusText.textContent = 'Ready.';
      }
    }, 2500);
  }
};

// statusTimer used by setStatus; declare here to avoid TDZ/reference errors
let statusTimer = null;

// Minimal rebuild helpers (placeholders) - replace with full implementations later
const rebuildWikiIndex = () => {
  // Build a wiki index that maps normalized slug -> note ID. We map both
  // the note title and the filename (without extension) to increase match
  // coverage for wiki-links like [[My Page]] or [[my_page.md]].
  try {
    state.wikiIndex = new Map();
    state.notes.forEach((note, id) => {
      if (!note) return;

      // Prefer the title, then fallback to filename base
      const title = typeof note.title === 'string' ? note.title.trim() : '';
      const titleSlug = toWikiSlug(title);
  try {
    const size = state.wikiIndex?.size ?? 0;
    const sample = size ? Array.from(state.wikiIndex.keys()).slice(0, 10) : [];
  // Debug prints removed
  } catch (e) {}
      if (titleSlug) {
        // Keep the first note for a given slug (do not overwrite existing mapping)
        if (!state.wikiIndex.has(titleSlug)) state.wikiIndex.set(titleSlug, id);
      }

      // Also map the file base name (without extension)
      const filePath = note.absolutePath ?? note.storedPath ?? note.path ?? '';
      if (filePath && typeof filePath === 'string') {
        const parts = filePath.split(/[\\/]/).filter(Boolean);
        const base = parts.length ? parts[parts.length - 1] : filePath;
        const baseNoExt = stripExtension(base || '');
        const baseSlug = toWikiSlug(baseNoExt);
        if (baseSlug && !state.wikiIndex.has(baseSlug)) state.wikiIndex.set(baseSlug, id);
      }
    });
  } catch (e) {
    state.wikiIndex = new Map();
  }
};

const rebuildBlockIndex = () => {
  // Basic placeholder - parses notes for block references and populates state.blockIndex
  try {
    state.blockIndex = new Map();
    state.notes.forEach((note) => {
      if (!note || note.type !== 'markdown' || !note.content) return;
      // naive: find ^anchor labels like ^abc
      const matches = note.content.matchAll(/\^(\w[\w-]*)/g);
      for (const m of matches) {
        const key = `${note.id}::${m[1]}`;
        state.blockIndex.set(key, { noteId: note.id, blockId: m[1] });
      }
    });
  } catch (e) { state.blockIndex = new Map(); }
};

// Refresh block index entries for a single note. This is used when a note's
// content changes so block anchors like ^abc are (re)indexed without
// rebuilding the entire workspace index.
const refreshBlockIndexForNote = (note) => {
  if (!note || note.type !== 'markdown') return;
  try {
    // Remove any existing entries for this note
    for (const key of Array.from(state.blockIndex.keys())) {
      if (typeof key === 'string' && key.startsWith(`${note.id}::`)) {
        state.blockIndex.delete(key);
      }
    }

    // Re-scan the note content for block anchors like ^label
    const matches = note.content?.matchAll(/\^(\w[\w-]*)/g);
    if (matches) {
      for (const m of matches) {
        try {
          const key = `${note.id}::${m[1]}`;
          state.blockIndex.set(key, { noteId: note.id, blockId: m[1] });
        } catch (e) { /* ignore individual match errors */ }
      }
    }
  } catch (e) {
    // Be conservative on errors: ensure blockIndex remains a Map
    try { state.blockIndex = state.blockIndex || new Map(); } catch (ee) { state.blockIndex = new Map(); }
  }
};

const applyEditorRatio = () => {
  if (!elements.workspaceContent) {
    return;
  }
  elements.workspaceContent.style.setProperty('--local-editor-ratio', state.editorRatio.toString());
};

const applySidebarCollapsed = (collapsed) => {
  state.sidebarCollapsed = collapsed;

  if (elements.appShell) {
    elements.appShell.classList.toggle('sidebar-collapsed', collapsed);
  }

  if (elements.toggleSidebarButton) {
    const label = collapsed ? 'Show sidebar' : 'Hide sidebar';
    elements.toggleSidebarButton.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
    elements.toggleSidebarButton.setAttribute('aria-label', label);
    elements.toggleSidebarButton.setAttribute('title', `${collapsed ? 'Show' : 'Hide'} sidebar (⌘B)`);
    // Update icon based on state
    const icon = elements.toggleSidebarButton.querySelector('.icon');
    if (icon) {
      icon.textContent = collapsed ? '▶' : '◀'; // Show arrow pointing right when collapsed, left when expanded
    }
  }

  if (!collapsed) {
    elements.workspaceTree?.setAttribute('aria-hidden', 'false');
  } else {
    elements.workspaceTree?.setAttribute('aria-hidden', 'true');
  }
};

const toggleSidebarCollapsed = () => {
  const next = !state.sidebarCollapsed;
  applySidebarCollapsed(next);
  persistSidebarCollapsed(next);
  setStatus(next ? 'Sidebar hidden.' : 'Sidebar shown.', true);
};

const applyPreviewState = (collapsed) => {
  state.previewCollapsed = collapsed;

  if (elements.workspaceContent) {
    elements.workspaceContent.classList.toggle('preview-collapsed', collapsed);
  }

  if (elements.togglePreviewButton) {
    let label, title, icon;
    
    if (collapsed) {
      label = 'Show preview';
      title = 'Show preview (⌘⇧B)';
      icon = '◀'; // Left arrow when collapsed
    } else {
      label = 'Hide preview';
      title = 'Hide preview (⌘⇧B)';
      icon = '▶'; // Right arrow when side-by-side
    }
    
    elements.togglePreviewButton.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
    elements.togglePreviewButton.setAttribute('aria-label', label);
    elements.togglePreviewButton.setAttribute('title', title);
    
    const iconElement = elements.togglePreviewButton.querySelector('.icon');
    if (iconElement) {
      iconElement.textContent = icon;
    }
  }

  const previewPane = elements.preview ? elements.preview.closest('.preview-pane') : null;
  if (previewPane) {
    previewPane.setAttribute('aria-hidden', collapsed ? 'true' : 'false');
  }

  if (elements.workspaceSplitter) {
    const shouldHide = collapsed;
    elements.workspaceSplitter.setAttribute('aria-hidden', shouldHide ? 'true' : 'false');
    if (shouldHide) {
      elements.workspaceSplitter.setAttribute('tabindex', '-1');
    } else {
      elements.workspaceSplitter.setAttribute('tabindex', '0');
    }
  }
};

const togglePreviewCollapsed = () => {
  // Toggle between collapsed and side-by-side preview
  const nextCollapsed = !state.previewCollapsed;
  
  applyPreviewState(nextCollapsed);
  persistPreviewCollapsed(nextCollapsed);
  
  const statusMessage = nextCollapsed 
    ? 'Preview hidden.' 
    : 'Side-by-side preview shown.';
  setStatus(statusMessage, true);
};

// dual editor support removed

// Export dropdown functions
const toggleExportDropdown = () => {
  const dropdown = elements.exportDropdownButton?.closest('.export-dropdown');
  if (!dropdown) return;
  
  const isOpen = dropdown.getAttribute('data-open') === 'true';
  
  if (isOpen) {
    closeExportDropdown();
  } else {
    openExportDropdown();
  }
};

const openExportDropdown = () => {
  const dropdown = elements.exportDropdownButton?.closest('.export-dropdown');
  if (!dropdown) return;
  
  dropdown.setAttribute('data-open', 'true');
  elements.exportDropdownButton?.setAttribute('aria-expanded', 'true');
  
  // If user has a preferred export format, move that option to the top
  try {
    const menu = document.getElementById('export-dropdown-menu');
    if (menu) {
      // Save original order first time so we can restore on close
      if (!window.__nta_export_menu_original_order) {
        window.__nta_export_menu_original_order = Array.from(menu.children).map((n) => n.id || '');
      }

      const preferred = readStorage(storageKeys.defaultExportFormat) || elements.defaultExportFormatSelect?.value || '';
      if (preferred) {
        // Map known values to element ids
        const map = {
          pdf: 'export-pdf-option',
          html: 'export-html-option',
          docx: 'export-docx-option',
          epub: 'export-epub-option'
        };
        const prefId = map[preferred.toLowerCase()];
        if (prefId) {
          const prefEl = document.getElementById(prefId);
          if (prefEl && menu.firstElementChild !== prefEl) {
            // Move preferred element to top
            menu.insertBefore(prefEl, menu.firstElementChild);
          }

          // Focus the preferred option for keyboard users
          try { prefEl?.focus(); } catch (e) { /* ignore focus errors */ }
        }
      }
    }
  } catch (e) { /* non-fatal */ }
};

const closeExportDropdown = () => {
  const dropdown = elements.exportDropdownButton?.closest('.export-dropdown');
  if (!dropdown) return;
  
  dropdown.setAttribute('data-open', 'false');
  elements.exportDropdownButton?.setAttribute('aria-expanded', 'false');
  // Restore original menu order if we changed it
  try {
    const menu = document.getElementById('export-dropdown-menu');
    const original = window.__nta_export_menu_original_order;
    if (menu && original && Array.isArray(original)) {
      // Rebuild menu children in original order where possible
      const byId = Array.from(menu.children).reduce((acc, el) => { acc[el.id] = el; return acc; }, {});
      original.forEach((id) => {
        const el = byId[id];
        if (el) menu.appendChild(el);
      });
    }
  } catch (e) { /* ignore */ }
};

const setEditorRatio = (ratio, announce = false) => {
  state.editorRatio = clamp(ratio, minEditorRatio, maxEditorRatio);
  applyEditorRatio();
  if (announce) {
    setStatus(`Editor width ${(state.editorRatio * 100).toFixed(0)}%`, true);
  }
};

const updateEditorRatioFromPointer = (clientX) => {
  if (!elements.workspaceContent) {
    return;
  }

  const bounds = elements.workspaceContent.getBoundingClientRect();
  if (!bounds.width) {
    return;
  }
  const ratio = (clientX - bounds.left) / bounds.width;
  setEditorRatio(ratio, false);
};

const normalizeNote = (note) => {
  const now = new Date().toISOString();
  const allowedTypes = new Set(['markdown', 'pdf', 'code', 'notebook', 'image', 'video', 'html', 'latex']);
  const type = allowedTypes.has(note.type) ? note.type : 'markdown';
  let content = null;

  if (typeof note.content === 'string') {
    content = note.content;
  } else if (type === 'markdown') {
    content = '';
  }

  return {
    id: note.id ?? crypto.randomUUID(),
    title: note.title ?? 'Untitled',
    type,
    absolutePath: note.absolutePath ?? null,
    folderPath: note.folderPath ?? null,
    storedPath: type === 'pdf' ? note.storedPath ?? null : null,
    origin: note.origin ?? 'internal',
    language: note.language ?? null,
    notebook: note.notebook ?? null,
    content,
    createdAt: note.createdAt ?? now,
    updatedAt: note.updatedAt ?? now,
    dirty: Boolean(note.dirty)
  };
};

const syncPdfCache = () => {
  const validKeys = new Set();
  state.notes.forEach((note) => {
    if (note.type === 'pdf') {
      const key = getPdfCacheKey(note);
      if (key) {
        validKeys.add(key);
      }
    }
  });

  for (const [key, resource] of pdfCache.entries()) {
    if (!validKeys.has(key)) {
      releasePdfResource(resource);
      pdfCache.delete(key);
    }
  }
};

const getActiveNote = () => {
  if (!state.activeNoteId) {
    return null;
  }
  return state.notes.get(state.activeNoteId) ?? null;
};

// second editor removed

const rebuildNotesMap = (notesArray) => {
  state.notes = new Map();
  notesArray.forEach((note) => {
    state.notes.set(note.id, note);
  });
  syncPdfCache();
  rebuildWikiIndex();
  rebuildBlockIndex();
  rebuildHashtagIndex();
  imageResourceCache.clear();
  videoResourceCache.clear();
  htmlResourceCache.clear();
  videoResourceCache.clear();
};

const workspaceNodeContainsActive = (node) => {
  if (!node) {
    return false;
  }

  if (node.type === 'file') {
    return node.noteId === state.activeNoteId;
  }

  if (node.type === 'directory' && Array.isArray(node.children)) {
    return node.children.some((child) => workspaceNodeContainsActive(child));
  }

  return false;
};

const createWorkspaceTreeNode = (node, depth = 0) => {
  const element = document.createElement('div');
  element.className = 'tree-node';
  element.dataset.nodeType = node.type;
  element.dataset.path = node.path;
  element.style.setProperty('--depth', depth);
  element.setAttribute('role', 'treeitem');
  element.setAttribute('aria-level', String(depth + 1));

  const label = document.createElement('div');
  label.className = 'tree-node__label';
  element.appendChild(label);

  if (node.type === 'directory') {
    element.classList.add('tree-node--directory');
    const collapsed = state.collapsedFolders.has(node.path);
    const hasChildren = Array.isArray(node.children) && node.children.length;
    element.dataset.hasChildren = hasChildren ? 'true' : 'false';
    if (collapsed) {
      element.classList.add('tree-node--collapsed');
    }
    // Remove the directory highlighting - only highlight the actual active file
    // if (workspaceNodeContainsActive(node)) {
    //   element.classList.add('tree-node--active');
    // }
    if (hasChildren) {
      element.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }

    const chevron = document.createElement('span');
    chevron.className = 'tree-node__chevron';
    chevron.textContent = hasChildren ? (collapsed ? '▸' : '▾') : ' ';
    label.appendChild(chevron);

    const name = document.createElement('span');
    name.className = 'tree-node__name';
    name.textContent = node.name;
    label.appendChild(name);

    if (hasChildren && !collapsed) {
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'tree-node__children';
      childrenContainer.setAttribute('role', 'group');
      node.children.forEach((child) => {
        childrenContainer.appendChild(createWorkspaceTreeNode(child, depth + 1));
      });
      element.appendChild(childrenContainer);
    }
  } else {
    element.classList.add('tree-node--file');
    const icon = document.createElement('span');
    icon.className = 'tree-node__icon';
    if (node.ext === '.md' || node.ext === '.markdown' || node.ext === '.mdx') {
      icon.textContent = '📝';
    } else if (node.ext === '.tex') {
      icon.textContent = 'TeX';
    } else if (node.ext === '.pdf') {
      icon.textContent = '�';
    } else if (node.ext === '.py') {
      icon.textContent = '🐍';
    } else if (node.ext === '.js' || node.ext === '.mjs') {
      icon.textContent = '🟨';
    } else if (node.ext === '.ts') {
      icon.textContent = '🔷';
    } else if (node.ext === '.css') {
      icon.textContent = '🎨';
    } else if (node.ext === '.json') {
      icon.textContent = '📋';
    } else if (node.ext === '.ipynb') {
      icon.textContent = '📓';
    } else if (node.ext === '.pptx') {
      icon.textContent = '📊';
    } else if (imageExtensions.has(node.ext)) {
      icon.textContent = '🖼️';
    } else if (videoExtensions.has(node.ext)) {
      icon.textContent = '🎬';
    } else if (htmlExtensions.has(node.ext)) {
      icon.textContent = '🌐';
    } else {
      icon.textContent = '•';
    }
    label.appendChild(icon);

    const name = document.createElement('span');
    name.className = 'tree-node__name';
    name.textContent = node.name;
    label.appendChild(name);

    if (node.supported && node.noteId) {
      element.dataset.noteId = node.noteId;
      element.draggable = true; // Make file nodes draggable
      if (node.noteId === state.activeNoteId) {
        element.classList.add('tree-node--active');
        element.setAttribute('aria-selected', 'true');
      }
    } else {
      element.classList.add('tree-node--unsupported');
      element.setAttribute('aria-disabled', 'true');
    }
  }

  return element;
};

// Drag and drop handlers for file tree
const handleTreeNodeDragStart = (event) => {
  const nodeElement = event.target.closest('.tree-node');
  if (!nodeElement || nodeElement.dataset.nodeType !== 'file') {
    event.preventDefault();
    return;
  }

  const noteId = nodeElement.dataset.noteId;
  if (!noteId) {
    event.preventDefault();
    return;
  }

  // Store the note ID in drag data
  event.dataTransfer.setData('text/noteId', noteId);
  event.dataTransfer.effectAllowed = 'copy';
  
  // Add visual feedback
  nodeElement.classList.add('tree-node--dragging');
  // When dragging internally, temporarily make per-pane PDF iframes
  // ignore pointer events so the parent document can receive drop events
  try {
    document.querySelectorAll('.pdf-pane-viewer').forEach((f) => { f.style.pointerEvents = 'none'; });
  } catch (e) { /* ignore */ }
};

const handleTreeNodeDragEnd = (event) => {
  const nodeElement = event.target.closest('.tree-node');
  if (nodeElement) {
    nodeElement.classList.remove('tree-node--dragging');
  }
  // Restore pointer events on per-pane PDF iframes
  try {
    document.querySelectorAll('.pdf-pane-viewer').forEach((f) => { f.style.pointerEvents = ''; });
  } catch (e) { /* ignore */ }
};

// Drop handlers for editors
const handleEditorDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

const handleEditorDragEnter = (event) => {
  try { event.preventDefault(); } catch (e) {}
  // Intentionally do not add a highlight when entering a pane. Clear any
  // existing highlights to avoid stale visuals — we don't want the dashed
  // drop target to appear while the pointer is over a pane.
  try {
    const paneRoot = event.target?.closest?.('.editor-pane') || event.currentTarget || event.target;
    if (paneRoot && paneRoot.classList) paneRoot.classList.remove('editor-drop-target');
  } catch (e) { /* ignore */ }
};

const handleEditorDragLeave = (event) => {
  try {
    const paneRoot = event.target?.closest?.('.editor-pane') || event.currentTarget || event.target;
    // Only remove the class if the relatedTarget is outside the paneRoot
    const related = event.relatedTarget || null;
    if (!paneRoot || !paneRoot.contains || (related && !paneRoot.contains(related))) {
      try { document.querySelectorAll('.editor-drop-target').forEach(el => el.classList.remove('editor-drop-target')); } catch (e) {}
    }
  } catch (e) { /* ignore */ }
};

// Handle external file drops into editors
const handleExternalFileDrop = (event, files) => {
  // Determine pane id
  let paneId = null;
  try {
    const paneRoot = (event.target && event.target.closest) ? event.target.closest('[data-pane-id], .editor-pane--dynamic, .editor-pane--right, .editor-pane') : null;
    if (paneRoot) {
      if (paneRoot.getAttribute) {
        const explicit = paneRoot.getAttribute('data-pane-id');
        if (explicit) paneId = explicit;
      }
      if (!paneId) {
        const ta = paneRoot.querySelector && paneRoot.querySelector('textarea');
        if (ta && ta.id) {
          if (ta.id === 'note-editor') paneId = 'left';
          else if (ta.id.startsWith('note-editor-')) paneId = ta.id.replace(/^note-editor-/, '');
        }
      }
      if (!paneId && paneRoot.classList && paneRoot.classList.contains('editor-pane--right')) {
        paneId = 'right';
      }
    }
  } catch (e) { /* ignore */ }

  if (!paneId) {
    paneId = resolvePaneFallback(true);
  }

  // Get the editor instance for this pane
  const editorInstance = editorInstances[paneId];
  if (!editorInstance || !editorInstance.el) return;

  // Process each file
  for (const file of files) {
    const fileName = file.name;
    const filePath = file.path; // Electron provides the full path
    const fileExt = fileName.split('.').pop()?.toLowerCase();

    // Handle different file types
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(fileExt)) {
      // Image - open in image viewer
      try {
        // Create a note-like object for the image
        const imageNote = {
          id: `external-image-${Date.now()}-${Math.random()}`,
          title: fileName,
          type: 'image',
          absolutePath: filePath,
          folderPath: '', // external file
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Open in image viewer for this pane
        renderImageInPane(imageNote, paneId);
      } catch (e) {
  // Debug prints removed
        // Fallback to inserting markdown
        insertMarkdownContent(`![${fileName}](${filePath})\n\n`);
      }
    } else if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(fileExt)) {
      // Video - open in video viewer
      try {
        const videoNote = {
          id: `external-video-${Date.now()}-${Math.random()}`,
          title: fileName,
          type: 'video',
          absolutePath: filePath,
          folderPath: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        renderVideoInPane(videoNote, paneId);
      } catch (e) {
  // Debug prints removed
        // Fallback to inserting HTML
        insertMarkdownContent(`<video controls style="max-width: 100%; height: auto;">
  <source src="${filePath}" type="video/${fileExt === 'mov' ? 'mp4' : fileExt}">
  Your browser does not support the video tag.
</video>\n\n`);
      }
    } else if (fileExt === 'pdf') {
      // PDF - open in PDF viewer
      try {
        const pdfNote = {
          id: `external-pdf-${Date.now()}-${Math.random()}`,
          title: fileName,
          type: 'pdf',
          absolutePath: filePath,
          folderPath: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        renderPdfInPane(pdfNote, paneId);
      } catch (e) {
  // Debug prints removed
        // Fallback to inserting link
        insertMarkdownContent(`[${fileName}](${filePath})\n\n`);
      }
    } else {
      // Other files - insert as markdown content
      let markdownContent = '';
      
      if (['py', 'js', 'ts', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs'].includes(fileExt)) {
        // Script/code file - insert as code block
        markdownContent = `\`\`\`${fileExt}\n// ${fileName}\n\n\`\`\`\n\n`;
      } else {
        // Other files - insert as link
        markdownContent = `[${fileName}](${filePath})\n\n`;
      }
      
      insertMarkdownContent(markdownContent);
    }
  }

  // Helper function to insert markdown content
  function insertMarkdownContent(content) {
    try {
      const textarea = editorInstance.el;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      textarea.value = text.slice(0, start) + content + text.slice(end);
      textarea.selectionStart = textarea.selectionEnd = start + content.length;
      
      // Trigger change event
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } catch (e) {
  // Debug prints removed
    }
  }

  // Mark as handled
  try { event._nta_handled = true; } catch (e) {}
};

const handleEditor1Drop = (event) => {
  // If an earlier capture-phase handler already routed this drop, skip
  try { if (event && event._nta_handled) { return; } } catch (e) {}
  // Prevent other drop handlers from also processing this internal note drop
  try { event.preventDefault(); } catch (e) {}
  try { event.stopPropagation(); } catch (e) {}
  try { if (event.stopImmediatePropagation) event.stopImmediatePropagation(); } catch (e) {}

  // remove any visual drop classes on the nearest pane/editor elements (robust)
  try {
    const paneRoot = event.target?.closest?.('.editor-pane') || event.currentTarget || event.target;
    paneRoot?.classList?.remove('editor-drop-target');
  } catch (e) { /* ignore */ }

  // Check for external files first
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleExternalFileDrop(event, files);
    return;
  }

  const noteId = event.dataTransfer?.getData ? event.dataTransfer.getData('text/noteId') : null;
  if (!noteId || !state.notes.has(noteId)) return;

  // Determine pane id: prefer data-pane-id, textarea id, or right-pane class
  let paneId = null;
  try {
    const paneRoot = (event.target && event.target.closest) ? event.target.closest('[data-pane-id], .editor-pane--dynamic, .editor-pane--right, .editor-pane') : null;
    if (paneRoot) {
      if (paneRoot.getAttribute) {
        const explicit = paneRoot.getAttribute('data-pane-id');
        if (explicit) paneId = explicit;
      }
      if (!paneId) {
        const ta = paneRoot.querySelector && paneRoot.querySelector('textarea');
        if (ta && ta.id) {
          // Dynamic panes use note-editor-<id>, the initial left editor uses id 'note-editor'
          if (ta.id === 'note-editor') paneId = 'left';
          else if (ta.id.startsWith('note-editor-')) paneId = ta.id.replace(/^note-editor-/, '');
        }
      }
      if (!paneId && paneRoot.classList && paneRoot.classList.contains('editor-pane--right')) {
        paneId = 'right';
      }
    }
  } catch (e) { /* ignore */ }

  // Fallback to direct target textarea id
  try {
    if (!paneId && event.target && event.target.id) {
      if (event.target.id === 'note-editor') paneId = 'left';
      else if (event.target.id && event.target.id.startsWith('note-editor-')) paneId = event.target.id.replace(/^note-editor-/, '');
    }
  } catch (e) { /* ignore */ }

  // Final fallback: prefer right if available, otherwise any existing pane
  if (!paneId || !editorInstances[paneId]) {
    paneId = resolvePaneFallback(true);
  }

  // Mark as handled for other handlers
  try { event._nta_handled = true; } catch (e) {}

  // Debug prints removed
  openNoteInPane(noteId, paneId);
};

// second editor drag/drop removed

const renderWorkspaceTree = () => {
  if (!elements.workspaceTree || !elements.workspaceEmpty) {
    return;
  }

  const treeData = state.tree ?? null;
  const rootChildren = Array.isArray(treeData?.children) ? treeData.children : [];

  if (!treeData) {
    elements.workspaceTree.replaceChildren();
    elements.workspaceTree.hidden = true;
    elements.workspaceEmpty.textContent = 'Open a folder to browse Markdown and PDF files.';
    elements.workspaceEmpty.hidden = false;
    return;
  }

  elements.workspaceEmpty.hidden = true;
  elements.workspaceEmpty.textContent = '';

  if (!rootChildren.length) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'tree-empty';
    emptyMessage.textContent = 'No supported files in this folder yet. Use “New File” to create one.';
    elements.workspaceTree.replaceChildren(emptyMessage);
    elements.workspaceTree.hidden = false;
    return;
  }

  const fragment = document.createDocumentFragment();
  rootChildren.forEach((child) => {
    fragment.appendChild(createWorkspaceTreeNode(child, 0));
  });

  elements.workspaceTree.replaceChildren(fragment);
  elements.workspaceTree.hidden = false;
  elements.workspaceEmpty.hidden = true;
};

const processPreviewImages = async () => {
  if (!elements.preview) {
    return;
  }

  const images = Array.from(elements.preview.querySelectorAll('img[data-raw-src]'));
  if (!images.length) {
    return;
  }

  await Promise.all(
    images.map(async (img) => {
      const rawSrc = img.getAttribute('data-raw-src');
      if (!rawSrc) {
        return;
      }

      if (isLikelyExternalUrl(rawSrc) || rawSrc.startsWith('data:')) {
        return;
      }

      const noteId = img.getAttribute('data-note-id') || state.activeNoteId;
      const cacheKey = `${noteId ?? 'unknown'}::${rawSrc}`;
      if (imageResourceCache.has(cacheKey)) {
        const cached = imageResourceCache.get(cacheKey);
        if (cached) {
          img.src = cached;
        }
        return;
      }

      const note = noteId ? state.notes.get(noteId) ?? null : null;
      const payload = {
        src: rawSrc,
        notePath: note?.absolutePath ?? null,
        folderPath: note?.folderPath ?? state.currentFolder ?? null
      };

      try {
        const result = await window.api.resolveResource(payload);
        if (result?.value) {
          imageResourceCache.set(cacheKey, result.value);
          img.src = result.value;
        } else {
          imageResourceCache.set(cacheKey, null);
        }
      } catch (error) {
  // Debug prints removed
        imageResourceCache.set(cacheKey, null);
      }
    })
  );
};

const processPreviewVideos = async () => {
  if (!elements.preview) {
    return;
  }

  const videos = Array.from(elements.preview.querySelectorAll('video[data-raw-src]'));
  // Debug prints removed
  if (!videos.length) {
    return;
  }

  await Promise.all(
    videos.map(async (video) => {
      const rawSrc = video.getAttribute('data-raw-src');
  // Debug prints removed
      if (!rawSrc) {
        return;
      }

      if ((isLikelyExternalUrl(rawSrc) && !rawSrc.startsWith('/')) || rawSrc.startsWith('data:')) {
        return;
      }

      const noteId = video.getAttribute('data-note-id') || state.activeNoteId;
      const cacheKey = `${noteId ?? 'unknown'}::${rawSrc}`;
      if (videoResourceCache.has(cacheKey)) {
        const cached = videoResourceCache.get(cacheKey);
        if (cached) {
          // Debug prints removed
          video.src = cached;
          // Debug prints removed
        }
        return;
      }
      // For absolute paths, directly use file:// without resolver
      if (rawSrc.startsWith('/')) {
        const candidate = `file://${rawSrc}`;
  // Debug prints removed
        videoResourceCache.set(cacheKey, candidate);
        video.src = candidate;
  // Debug prints removed
        video.load();
        return;
      }

      const note = noteId ? state.notes.get(noteId) ?? null : null;

      // For relative paths, try resolver first
        try {
          let candidate = null;
          // absolute POSIX path
          if (rawSrc.startsWith('/')) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc}`;
          }
          // Windows drive letter (C:\...)
          else if (/^[A-Za-z]:\\/.test(rawSrc)) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc.replace(/\\/g, '/')}`;
          } else if (note?.folderPath ?? state.currentFolder) {
            // Try relative to note's folder or current workspace folder
            const baseFolder = note?.folderPath ?? state.currentFolder;
            const joined = `${baseFolder.replace(/\/$/, '')}/${rawSrc}`;
            candidate = `file://${joined}`;
          }

          if (candidate) {
            // Debug prints removed
            videoResourceCache.set(cacheKey, candidate);
            video.src = candidate;
            // Debug prints removed
            return;
          }
        } catch (err) {
          // fall through to resolver attempt below if present
          videoResourceCache.set(cacheKey, null);
          return;
        }

      const payload = {
        src: rawSrc.startsWith('/') ? `file://${rawSrc}` : rawSrc,
        notePath: note?.absolutePath ?? null,
        folderPath: note?.folderPath ?? state.currentFolder ?? null
      };

      try {
        const result = await window.api.resolveResource(payload);
        if (result?.value) {
          // Debug prints removed
          videoResourceCache.set(cacheKey, result.value);
          video.src = result.value;
          // Debug prints removed
          video.load(); // ensure load is triggered
        } else {
          // Debug prints removed
          // Fallback to file:// even if resolver is available but returned nothing
          try {
            let candidate = null;
            if (rawSrc.startsWith('/')) {
              candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc}`;
            } else if (/^[A-Za-z]:\\/.test(rawSrc)) {
              candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc.replace(/\\/g, '/')}`;
            } else if (state.currentFolder) {
              const joined = `${state.currentFolder.replace(/\/$/, '')}/${rawSrc}`;
              candidate = `file://${joined}`;
            }

            if (candidate) {
              videoResourceCache.set(cacheKey, candidate);
              video.src = candidate;
              // Debug prints removed
              video.load();
            } else {
              videoResourceCache.set(cacheKey, null);
            }
          } catch (err) {
            // Debug prints removed
            videoResourceCache.set(cacheKey, null);
          }
        }
      } catch (error) {
  // Debug prints removed
        // Even on error, try file:// fallback
        try {
          let candidate = null;
          if (rawSrc.startsWith('/')) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc}`;
          } else if (/^[A-Za-z]:\\/.test(rawSrc)) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc.replace(/\\/g, '/')}`;
          } else if (state.currentFolder) {
            const joined = `${state.currentFolder.replace(/\/$/, '')}/${rawSrc}`;
            candidate = `file://${joined}`;
          }

          if (candidate) {
            videoResourceCache.set(cacheKey, candidate);
            video.src = candidate;
            // Debug prints removed
            video.load();
          } else {
            videoResourceCache.set(cacheKey, null);
          }
        } catch (err) {
          // Debug prints removed
          videoResourceCache.set(cacheKey, null);
        }
      }
    })
  );
};

const processPreviewHtmlIframes = async () => {
  if (!elements.preview) {
    return;
  }

  const iframes = Array.from(elements.preview.querySelectorAll('iframe.html-embed-iframe[data-raw-src]'));
  if (!iframes.length) {
    return;
  }

  await Promise.all(
    iframes.map(async (iframe) => {
      const rawSrc = iframe.getAttribute('data-raw-src');
      if (!rawSrc) {
        return;
      }

      // Defensive: ignore raw sources that point at the app's own renderer directory
      // (e.g. file:///.../src/renderer/...), because those aren't user content and
      // would produce noisy file-not-found errors. Do NOT broadly skip files named
      // 'Untitled.html' anywhere in the filesystem — users may legitimately open
      // files with that name outside the app source tree.
      try {
        const normalized = String(rawSrc).replace(/\\/g, '/');
        if (normalized.includes('/src/renderer/')) {
          // Debug prints removed
          iframe.setAttribute('data-resolve-status', 'skipped-local');
          return;
        }
      } catch (e) {
        // If anything odd happens normalizing, don't block rendering — continue.
      }

      if (isLikelyExternalUrl(rawSrc) || rawSrc.startsWith('data:')) {
        iframe.src = rawSrc;
        
        // Auto-resize the iframe after src is set
        iframe.onload = () => {
          if (window.autoResizeIframe) {
            window.autoResizeIframe(iframe);
          }
        };
        return;
      }

      const noteId = iframe.getAttribute('data-note-id') || state.activeNoteId;
      const cacheKey = `${noteId ?? 'unknown'}::${rawSrc}`;
      // If we already have a cached resolved URL, use it
      if (htmlResourceCache.has(cacheKey)) {
        const cached = htmlResourceCache.get(cacheKey);
        if (cached) {
          iframe.src = cached;
          iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
        }
        return;
      }

      // If resolver isn't available, try a best-effort file:// fallback for
      // absolute paths or relative to the current workspace folder.
      if (typeof window.api?.resolveResource !== 'function') {
        try {
          let candidate = null;
          if (rawSrc.startsWith('/')) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc}`;
          } else if (/^[A-Za-z]:\\/.test(rawSrc)) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc.replace(/\\/g, '/')}`;
          } else if (state.currentFolder) {
            const joined = `${state.currentFolder.replace(/\/$/, '')}/${rawSrc}`;
            candidate = `file://${joined}`;
          }

          if (candidate) {
            htmlResourceCache.set(cacheKey, candidate);
            iframe.src = candidate;
            iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
            return;
          }
        } catch (err) {
          // fall-through to mark unresolved
        }

  // Debug prints removed
        htmlResourceCache.set(cacheKey, null);
        return;
      }

      const note = noteId ? state.notes.get(noteId) ?? null : null;
      const payload = {
        src: rawSrc,
        notePath: note?.absolutePath ?? null,
        folderPath: note?.folderPath ?? state.currentFolder ?? null
      };

      try {
        const result = await window.api.resolveResource(payload);
  // Debug prints removed
        if (result?.value) {
          htmlResourceCache.set(cacheKey, result.value);
          iframe.src = result.value;
          iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
        } else {
          htmlResourceCache.set(cacheKey, null);
        }
      } catch (error) {
  // Debug prints removed
        htmlResourceCache.set(cacheKey, null);
      }
    })
  );
};

const decorateBlockAnchors = (noteId) => {
  if (!elements.preview) {
    return;
  }

  const anchors = elements.preview.querySelectorAll('[data-block-id]');
  anchors.forEach((anchor) => {
    const label = anchor.getAttribute('data-block-id');
    if (!label) {
      return;
    }
    const normalized = normalizeBlockLabel(label);
    const anchorId = noteId ? `block-${noteId}-${normalized}` : `block-${normalized}`;
    anchor.id = anchorId;
    if (noteId) {
      anchor.dataset.noteId = noteId;
    }
    anchor.dataset.blockId = normalized;
    anchor.classList.add('block-anchor--rendered');
  });
};

const shouldSkipHashtagNode = (textNode) => {
  const parent = textNode?.parentElement;
  if (!parent) {
    return true;
  }

  if (parent.closest('code, pre, samp, kbd, .wikilink-embed__code, .math-inline, .math-block, .katex, .katex-display, .wikilink-embed__header')) {
    return true;
  }

  if (parent.closest('.hashtag-hidden')) {
    return true;
  }

  return false;
};

const decoratePreviewHashtags = (noteId) => {
  if (!elements.preview) {
    return;
  }

  const candidateTags = noteId ? state.hashtagsByNote.get(noteId) : null;
  if (!candidateTags || !candidateTags.size) {
    return;
  }

  const walker = document.createTreeWalker(elements.preview, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node || !node.textContent || node.textContent.indexOf('#') === -1) {
        return NodeFilter.FILTER_SKIP;
      }
      return shouldSkipHashtagNode(node) ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodesToProcess = [];
  let node = walker.nextNode();
  while (node) {
    nodesToProcess.push(node);
    node = walker.nextNode();
  }

  const pattern = /(^|[^0-9A-Za-z_#])#([A-Za-z][\w-]{0,63})\b/g;

  nodesToProcess.forEach((textNode) => {
    const text = textNode.textContent;
    if (!text) {
      return;
    }

    let lastIndex = 0;
    let hasMatch = false;
    const fragment = document.createDocumentFragment();
    let match;
    pattern.lastIndex = 0;

    while ((match = pattern.exec(text)) !== null) {
      const prefixLength = match[1]?.length ?? 0;
      const matchStart = match.index + prefixLength;
      const matchEnd = pattern.lastIndex;

      if (matchStart < lastIndex) {
        continue;
      }

      if (matchStart > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchStart)));
      }

      const span = document.createElement('span');
      span.className = 'hashtag-hidden';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = text.slice(matchStart, matchEnd);
      fragment.appendChild(span);

      lastIndex = matchEnd;
      hasMatch = true;
    }

    if (!hasMatch) {
      return;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  });
};

const findBlockHighlightTarget = (anchor) => {
  if (!anchor) {
    return null;
  }

  const blockSelectors = [
    '.katex-display',
    'p',
    'li',
    'pre',
    'blockquote',
    'table',
    'section',
    'article',
    'div',
    'figure',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
  ];

  let candidate = null;
  for (const selector of blockSelectors) {
    const nearest = anchor.closest(selector);
    if (nearest) {
      candidate = nearest;
      break;
    }
  }

  const resolveMathTarget = (element) => {
    if (!element || typeof element !== 'object') {
      return null;
    }

    if (element.classList?.contains('katex-display')) {
      return element;
    }

    if (typeof element.querySelector === 'function') {
      const nested = element.querySelector('.katex-display');
      if (nested) {
        return nested;
      }
    }

    return null;
  };

  const mathTarget =
    resolveMathTarget(candidate) ??
    resolveMathTarget(anchor.previousElementSibling) ??
    resolveMathTarget(anchor.parentElement?.previousElementSibling) ??
    resolveMathTarget(candidate?.previousElementSibling) ??
    resolveMathTarget(anchor.parentElement) ??
    resolveMathTarget(candidate?.parentElement);

  if (mathTarget) {
    return mathTarget;
  }

  if (candidate) {
    return candidate;
  }

  return anchor;
};

const focusBlockLabel = (noteId, label) => {
  if (!elements.preview || !label) {
    return;
  }

  const normalized = normalizeBlockLabel(label);
  const selector = `[data-block-id="${normalized}"]${noteId ? `[data-note-id="${noteId}"]` : ''}`;
  const anchor = elements.preview.querySelector(selector) ?? null;
  if (!anchor) {
    setStatus(`Block ^${label} not found in this note.`, false);
    return;
  }

  const target = findBlockHighlightTarget(anchor);
  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('block-highlight');
    setTimeout(() => {
      target.classList.remove('block-highlight');
    }, 2000);
  });
};

const getPaneNoteId = (pane = state.activeEditorPane) => {
  const p = state.editorPanes?.[pane];
  return p ? p.noteId : null;
};

// Return the pane id that currently maps to the given noteId, or null
// if the note is not mapped to any pane. Useful to prevent global
// preview handlers from activating when the file is already shown in a pane.
const getPaneForNote = (noteId) => {
  if (!noteId || !state.editorPanes) return null;
  try {
    for (const pid of Object.keys(state.editorPanes)) {
      try {
        if (state.editorPanes[pid] && state.editorPanes[pid].noteId === noteId) return pid;
      } catch (e) { }
    }
  } catch (e) { }
  return null;
};

const setActiveEditorPane = (pane) => {
  try { console.log('setActiveEditorPane called', { pane, prev: state.activeEditorPane }); } catch (e) {}
  // Allow any existing editor instance (left/right or dynamic panes)
  if (!pane || !editorInstances[pane]) return;

  // If the pane is already active, avoid re-running the heavy preview render
  // but still ensure the editor receives focus. This prevents clicks inside
  // the same editor from triggering a full preview re-render on each click
  // (which was wasting CPU and interrupting completion popups).
  if (state.activeEditorPane === pane) {
    try {
      const inst = editorInstances[pane];
      if (inst && inst.el) inst.focus({ preventScroll: true });
      try { console.log('setActiveEditorPane: pane already active, focused editor', { pane }); } catch (e) {}
    } catch (e) {
      try { editorInstances.left?.focus?.({ preventScroll: true }); } catch (e2) {}
    }
    return;
  }

  state.activeEditorPane = pane;
  // focus the corresponding editor element if possible
  try {
    const inst = editorInstances[pane];
    if (inst && inst.el) inst.focus({ preventScroll: true });
  } catch (e) {
    try { editorInstances.left?.focus?.({ preventScroll: true }); } catch (e2) {}
  }

  // Re-render preview for the newly active pane
  const paneNoteId = getPaneNoteId(pane);
  try { console.log('setActiveEditorPane: paneNoteId resolved', { pane, paneNoteId }); } catch (e) {}
  const paneNote = paneNoteId ? state.notes.get(paneNoteId) : null;

  // Update the editor content for the pane's note.
  // Handle known editable/previewable types explicitly to avoid briefly
  // showing placeholder display strings (e.g. "[LATEX FILE: ...]") when
  // switching focus between panes.
  if (paneNote) {
    try {
      const inst = editorInstances[pane];
      if (inst && inst.el) {
        if (paneNote.type === 'code') {
          // Code files: show raw content. Plain-text code (.txt) will be
          // treated as editable elsewhere.
          inst.el.value = paneNote.content ?? '';
        } else if (paneNote.type === 'notebook') {
          // Notebook: render a read-only cell-based view inside the pane
          try {
            // Attempt to render a pane-local notebook viewer. If it fails,
            // fall back to showing the JSON representation in the textarea.
            const rendered = renderNotebookInPane(paneNote, pane);
            if (rendered) {
              // If we rendered pane viewer, clear textarea value to avoid stale content
              try { inst.el.value = ''; } catch (e) {}
            } else {
              inst.el.value = JSON.stringify(paneNote.notebook ?? paneNote.content ?? {}, null, 2);
            }
          } catch (e) {
            try { inst.el.value = JSON.stringify(paneNote.notebook ?? paneNote.content ?? {}, null, 2); } catch (ee) { inst.el.value = String(paneNote.notebook ?? paneNote.content ?? ''); }
          }
        } else if (paneNote.type === 'markdown' || paneNote.type === 'latex') {
          // Markdown and LaTeX are editable and should show their raw content
          // (LaTeX was previously treated as a non-editable type which caused
          // the bracketed placeholder to appear briefly when focusing the pane).
          inst.el.value = paneNote.content ?? '';
        } else {
          // Unknown or truly non-editable file types: show a simple placeholder
          // so the user understands the pane is not an editor for this file.
          const displayValue = `[${String(paneNote.type).toUpperCase()} FILE: ${paneNote.title || paneNote.absolutePath || 'Untitled'}]`;
          inst.el.value = displayValue;
        }
      }
    } catch (e) {}
  }

  // Update file metadata UI (uses storageKeys.showFileNameOnly to decide what to show)
  try { updateFileMetadataUI(paneNote ?? null, { allowActiveFallback: true }); } catch (e) { /* ignore */ }

  // If the pane's note is markdown or latex, switch the live preview to it.
  // For other types (e.g., PDF), do not change the live preview — keep showing the
  // last markdown note the user viewed.
  if (paneNote && (paneNote.type === 'markdown' || paneNote.type === 'latex')) {
    state.activeNoteId = paneNoteId;
    if (paneNote.type === 'markdown') {
      state.lastActiveMarkdownNoteId = paneNoteId;
    }
    // Track that this note can be shown in the global preview
    state.lastRenderableNoteId = paneNoteId;
    renderActiveNote();
  } else {
    // Prefer the last renderable note (markdown/latex/bib/notebook/code) for
    // the global preview. This ensures that if the most recent editor with
    // a renderable file is a LaTeX file, it will be shown instead of an
    // older markdown file.
    const preferredRenderableId = state.lastRenderableNoteId || state.lastActiveMarkdownNoteId || state.activeNoteId;
    const preferredNote = preferredRenderableId ? state.notes.get(preferredRenderableId) : null;
    if (preferredNote && (preferredNote.type === 'markdown' || preferredNote.type === 'latex' || preferredNote.type === 'bib' || preferredNote.type === 'notebook' || preferredNote.type === 'code')) {
      // Render the preferred renderable note. Use the lighter path for
      // markdown to avoid re-evaluating the full active-note selection.
      state.activeNoteId = preferredRenderableId;
      state.lastRenderableNoteId = preferredRenderableId;
      if (preferredNote.type === 'markdown') {
        renderMarkdownPreview(preferredNote.content ?? '', preferredNote.id);
      } else if (preferredNote.type === 'latex') {
        // Render LaTeX directly so the global preview updates even if the
        // note isn't currently mapped to an active pane.
        renderLatexPreview(preferredNote.content ?? '', preferredNote.id);
      } else {
        // Delegate other renderable types (bib/notebook/code) to the
        // canonical renderer which knows how to handle them.
        renderActiveNote();
      }
    } else if (paneNote) {
      // If there's no markdown to show, we may render the pane note globally.
      // But avoid doing so for common non-markdown viewers to keep them pane-local.
      if (paneNote.type === 'markdown' || paneNote.type === 'latex') {
        state.activeNoteId = paneNoteId ?? null;
        renderActiveNote();
      } else {
        // Clear the global preview to avoid duplicate global image/pdf viewers.
        state.activeNoteId = null;
        renderActiveNote();
      }
    } else {
      renderActiveNote();
    }
  }
  // Update pane visuals and file metadata UI
  updateEditorPaneVisuals();
};

// Open a note in a given pane (left or right). Ensures tab exists, activates pane/tab,
// persists per-pane mapping, and updates UI. Reused by drag/drop and other flows.
const openNoteInPane = (noteId, pane = 'left', options = { activate: true }) => {
  // Debug prints removed
  if (!noteId || !state.notes.has(noteId)) return null;
  // Ensure any math overlay is turned off when switching files so it doesn't
  // accidentally hide caret or mask the editor content (helps with .txt files).
  try { if (window.disableMathOverlay) window.disableMathOverlay(); } catch (e) {}
  // If requested pane doesn't exist, default to 'left'
  if (!pane || !editorInstances[pane]) pane = 'left';

  state.editorPanes[pane] = state.editorPanes[pane] || {};
  state.editorPanes[pane].noteId = noteId;

  const note = state.notes.get(noteId);
  try { console.log('openNoteInPane called', { noteId, pane, noteType: note?.type }); } catch (e) {}
  // Debug: write an entry so we can trace pane opens when console is not available
  try { if (window.api && typeof window.api.writeDebugLog === 'function') window.api.writeDebugLog({ event: 'openNoteInPane', noteId, pane, noteType: note?.type, timestamp: Date.now() }); } catch (e) { }
  // Update file metadata UI so user preference (filename-only) is respected
  try { updateFileMetadataUI(note ?? null, { allowActiveFallback: true }); } catch (e) { /* ignore */ }

  // Ensure tab exists
  let existingTab = state.tabs.find(t => t.noteId === noteId);
  if (!existingTab) {
    existingTab = createTab(noteId, note?.title || 'Untitled');
  }

  // Persist pane assignments
  try { localStorage.setItem(storageKeys.editorPanes, JSON.stringify(state.editorPanes)); } catch (e) { /* ignore */ }

  // Defensive immediate population for markdown notes: update the target pane's textarea
  // immediately so opening the same note in multiple panes works reliably.
  try {
    const inst = editorInstances[pane];
    if (inst && inst.el) {
      // If the new note is a markdown file, ensure any pane-local PDF viewer is removed
      // and the textarea is visible/populated. If it's a non-markdown file (PDF, image,
      // video, etc.) we do not populate the textarea and may render a specialized
      // viewer instead.
      if (note.type === 'markdown' || note.type === 'code') {
        // Remove any per-pane PDF viewer that would otherwise block the textarea
        try { clearPaneViewer(pane); } catch (e) {}
        inst.el.hidden = false;
        inst.el.disabled = false;
        inst.el.value = note.content ?? '';
      } else {
        // For non-markdown files, still show useful content in editor but keep it read-only
        try { clearPaneViewer(pane); } catch (e) {}
        // For notebooks, render a pane-local notebook viewer instead of
        // placing the raw JSON into the textarea. If rendering fails,
        // fall back to a JSON representation so the user can still view it.
        if (note.type === 'notebook') {
          try {
            const rendered = renderNotebookInPane(note, pane);
            if (rendered) {
              inst.el.hidden = true;
              inst.el.disabled = true;
            } else {
              inst.el.hidden = false;
              inst.el.disabled = true;
              try { inst.el.value = JSON.stringify(note.notebook ?? note.content ?? {}, null, 2); } catch (e) { inst.el.value = String(note.notebook ?? note.content ?? ''); }
            }
          } catch (e) {
            inst.el.hidden = false;
            inst.el.disabled = true;
            try { inst.el.value = JSON.stringify(note.notebook ?? note.content ?? {}, null, 2); } catch (ee) { inst.el.value = String(note.notebook ?? note.content ?? ''); }
          }
        } else {
          inst.el.hidden = false;
          inst.el.disabled = true;
          // Determine a friendly representation depending on type
          let displayValue = '';
          if (note.type === 'image') {
            displayValue = `Image: ${note.absolutePath ?? note.title ?? ''}`;
          } else if (note.type === 'html') {
            displayValue = note.content ?? '';
          } else if (note.type === 'code') {
            displayValue = note.content ?? '';
          } else {
            displayValue = note.content ?? '';
          }
          inst.el.value = displayValue;
        }
      }
    }
  } catch (e) { /* ignore */ }

  // If caller wants the pane to become active, update active pane/tab and preview
  if (options && options.activate !== false) {
    // Only change the global active preview for markdown/latex notes.
    // For pane-local media (image/pdf/video/html) keep the last active
    // markdown note as the global preview so we avoid duplicate global viewers.
    try {
      if (note.type === 'markdown') {
        state.activeNoteId = noteId;
        state.lastActiveMarkdownNoteId = noteId;
        state.lastRenderableNoteId = noteId;
      } else if (note.type === 'latex') {
        state.activeNoteId = noteId;
        state.lastRenderableNoteId = noteId;
      } else {
        // preserve previously active markdown preview (may be null)
        state.activeNoteId = state.lastActiveMarkdownNoteId || null;
      }
    } catch (e) {}

    // Ensure any existing pane-local viewer is cleared so the new file fully replaces it
    try { clearPaneViewer(pane); } catch (e) {}

    try { console.log('openNoteInPane activating pane/tab', { pane, tabId: existingTab?.id }); } catch (e) {}
    setActiveEditorPane(pane);
    setActiveTab(existingTab.id);
    renderWorkspaceTree();
    // Render file into the pane (PDF/image/video get pane-local viewers)
    if (note.type === 'pdf') {
      void renderPdfInPane(note, pane);
    } else if (note.type === 'image') {
      try { console.log('openNoteInPane: rendering image inside pane', { noteId: note.id, pane }); } catch (e) {}
      void renderImageInPane(note, pane);
    } else if (note.type === 'video') {
      try { console.log('openNoteInPane: rendering video inside pane', { noteId: note.id, pane }); } catch (e) {}
      try { void renderVideoInPane(note, pane); } catch (e) { /* ignore */ }
    } else if (note.type === 'markdown' || note.type === 'latex') {
      // For markdown and latex, update the main preview area.
      renderActiveNote();
    }
    // Ensure pane textarea is visible/populated for non-markdown notes so the
    // newly opened file clearly replaces any pane-local viewer.
    try {
      const inst = editorInstances[pane];
      if (inst && inst.el) {
        // For markdown openings we should ensure any pane viewer is removed.
        // For pane-local viewers (image/pdf/video/html) do NOT clear here —
        // clearing would remove the viewer we just appended above.
        try {
          if (note.type === 'markdown') {
            try { clearPaneViewer(pane); } catch (e) {}
          }
        } catch (e) {}
  // Only hide the textarea for media types that use a pane-local viewer.
  const mediaTypes = new Set(['image', 'pdf', 'video', 'html']);
  inst.el.hidden = mediaTypes.has(note.type);
  // Keep textarea read-only for non-markdown (notebook) but allow editing
  // for markdown, latex, and plain text code files (.txt). Other code
  // files remain read-only in the pane.
  if (note.type === 'markdown' || note.type === 'latex') {
    inst.el.disabled = false;
  } else if (note.type === 'code' && note.language === 'text') {
    // Plain .txt files are treated as editable text
    inst.el.disabled = false;
  } else {
    inst.el.disabled = true;
  }
        if (note.type === 'notebook' || note.type === 'code') {
                if (note.type === 'notebook') {
                  try {
                    const rendered = renderNotebookInPane(note, pane);
                    if (rendered) {
                      inst.el.hidden = true;
                      inst.el.disabled = true;
                    } else {
                      inst.el.hidden = false;
                      inst.el.disabled = true;
                      try { inst.el.value = JSON.stringify(note.notebook ?? note.content ?? {}, null, 2); } catch (e) { inst.el.value = note.content ?? ''; }
                    }
                  } catch (e) {
                    try { inst.el.value = JSON.stringify(note.notebook ?? note.content ?? {}, null, 2); } catch (ee) { inst.el.value = note.content ?? ''; }
                  }
                } else {
                  try { inst.el.value = note.content ?? JSON.stringify(note.notebook ?? {}, null, 2); } catch (e) { inst.el.value = note.content ?? ''; }
                }
          // If this is a plain-text code file (.txt), make sure any inline styles
          // applied by the math overlay are cleared so the caret is visible and
          // the textarea can accept input.
          try {
            if (note.type === 'code' && note.language === 'text') {
              inst.el.style.color = inst.el.__prevColor || '';
              inst.el.style.caretColor = '';
              inst.el.focus({ preventScroll: true });
            }
          } catch (e) { /* ignore */ }
        } else if (note.type === 'image') {
          // leave image pane viewer in place; textarea stays disabled but show path
          inst.el.value = `Image: ${note.absolutePath ?? note.title ?? ''}`;
        } else {
          inst.el.value = note.content ?? '';
        }
      }
    } catch (e) { }

    updateEditorPaneVisuals();
    setStatus(`File opened in ${pane} editor.`, true);
    try { if (window.api && typeof window.api.writeDebugLog === 'function') window.api.writeDebugLog({ event: 'openNoteInPane:activated', noteId, pane, noteType: note?.type, timestamp: Date.now() }); } catch (e) { }
  } else {
    // Non-activating open: update UI lists/badges without changing preview/active pane
    renderWorkspaceTree();
    updateEditorPaneVisuals();
    setStatus(`File assigned to ${pane} editor.`, true);
  }

  return existingTab;
};


const renderMarkdownPreview = (markdown, noteId = state.activeNoteId) => {
  if (!elements.preview) {
    return;
  }

  const renderBasicPreview = (content) => {
    try {
      const rawHtml = window.marked.parse(content ?? '');
      return window.DOMPurify.sanitize(rawHtml, domPurifyConfig);
    } catch (error) {
  // Debug prints removed
      return '';
    }
  };

  const visited = new Set();
  if (noteId) {
    visited.add(noteId);
  }

  let html = '';
  let collector = null;

  try {
    ({ html, collector } = renderMarkdownToHtml(
      markdown,
      {
        noteId,
        depth: 0,
        visited
      },
      {
        collectSourceMap: Boolean(noteId)
      }
    ));
  } catch (error) {
  // Debug prints removed
    try {
      const fallback = renderMarkdownToHtml(
        markdown,
        {
          noteId,
          depth: 0,
          visited
        },
        {
          collectSourceMap: false
        }
      );
      html = fallback?.html ?? '';
      collector = fallback?.collector ?? null;
    } catch (fallbackError) {
  // Debug prints removed
      html = renderBasicPreview(markdown);
      collector = null;
    }
  }

  try {
    // Clean up any existing HTML blob URLs to prevent memory leaks
    if (window.htmlBlobUrls) {
      window.htmlBlobUrls.forEach(url => URL.revokeObjectURL(url));
      window.htmlBlobUrls.clear();
    }
    
    clearPreviewHighlight();
    
    // Update main preview
    if (elements.preview) {
      try {
        elements.preview.innerHTML = html;
      } catch (e) {
  // Debug prints removed
        try { elements.preview.textContent = html; } catch (e2) { /* swallow */ }
      }
    }

    if (collector && noteId) {
      try {
        // Apply to main preview
        if (elements.preview) {
          const blocksById = applyPreviewSourceBlocks(noteId, collector, elements.preview);
          state.previewSourceBlocks.set(noteId, {
            originalMarkdown: markdown,
            blocksById,
            collector
          });
        }
      } catch (blockError) {
  // Debug prints removed
        state.previewSourceBlocks.delete(noteId);
      }
    } else if (noteId) {
      state.previewSourceBlocks.delete(noteId);
    }

    try {
      decorateBlockAnchors(noteId);
    } catch (anchorError) {
  // Debug prints removed
    }

    // Render citations (replace \cite{...} and [@key] with human-friendly text and add bibliography)
    try {
      renderCitationsInPreview(markdown, noteId);
    } catch (e) { /* ignore citation rendering errors */ }

    void processPreviewImages();
    void processPreviewVideos();
    void processPreviewHtmlIframes();
    addImageHoverPreviews();
    decoratePreviewHashtags(noteId);

    if (state.pendingBlockFocus && state.pendingBlockFocus.noteId === noteId) {
      const { blockId } = state.pendingBlockFocus;
      state.pendingBlockFocus = null;
      if (blockId) {
        focusBlockLabel(noteId, blockId);
      }
    }
  } catch (renderError) {
  // Debug prints removed
    if (elements.preview) {
  try { elements.preview.innerHTML = renderBasicPreview(markdown); } catch (e) { try { elements.preview.textContent = renderBasicPreview(markdown); } catch (e2) { /* swallow */ } }
    }
    if (noteId) {
      state.previewSourceBlocks.delete(noteId);
    }
  }
};

const renderBibPreview = (bibContent, noteId = state.activeNoteId) => {
  if (!elements.preview) return;
  try {
    // Simple display: show the bib file as preformatted text with basic highlighting
    const safe = window.DOMPurify ? window.DOMPurify.sanitize(bibContent) : bibContent;
    elements.preview.innerHTML = `<pre class="bib-preview">${safe}</pre>`;
  } catch (e) {
    try { elements.preview.textContent = bibContent; } catch (e2) {}
  }
};

// Render citations in the preview: find markers and replace them with inline text
const renderCitationsInPreview = async (markdown, noteId) => {
  if (!elements.preview) return;
  // Build a lookup of bibliography entries (try cached, else load from workspace)
  try {
    if (!_cachedBibliography) {
      const folderPath = elements.workspacePath && elements.workspacePath.title ? elements.workspacePath.title : null;
      _cachedBibliography = await loadBibliographyForWorkspace(folderPath);
    }
  } catch (e) { /* ignore */ }

  // Helper to render a single key
  const renderKey = (k) => {
    const entry = _cachedBibliography?.[k];
    if (!entry) return `[@${k}]`;
    const author = entry.author ? entry.author.split(' and ')[0].split(',')[0] : k;
    const year = entry.year ? entry.year : '';
    return author && year ? `${author} (${year})` : `[@${k}]`;
  };

  try {
    // Replace \cite{a,b} occurrences
    const previewEl = elements.preview;
    // Replace instances in the preview DOM text nodes
    const walker = document.createTreeWalker(previewEl, NodeFilter.SHOW_TEXT, null);
    const toReplace = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const txt = node.nodeValue;
      if (!txt) continue;
      // handle \cite{key1,key2}
      const citeRegex = /\\cite\{([^}]+)\}/g;
      let m;
      let newText = txt;
      let changed = false;
      while ((m = citeRegex.exec(txt)) !== null) {
        const keys = m[1].split(',').map(s => s.trim()).filter(Boolean);
        const rendered = keys.map(k => renderKey(k)).join('; ');
        newText = newText.replace(m[0], rendered);
        changed = true;
      }
      // also support [@key] inline markers
      const inlineRegex = /\[@([^\]]+)\]/g;
      while ((m = inlineRegex.exec(txt)) !== null) {
        const keys = m[1].split(',').map(s => s.trim()).filter(Boolean);
        const rendered = keys.map(k => renderKey(k)).join('; ');
        newText = newText.replace(m[0], rendered);
        changed = true;
      }
      if (changed) {
        toReplace.push({ node, newText });
      }
    }
    // Apply text replacements
    for (const r of toReplace) {
      try { r.node.nodeValue = r.newText; } catch (e) {}
    }

    // Append a small bibliography section at the end of the preview if we have entries referenced
    const referenced = new Set();
    const allMatches = (markdown.match(/\\cite\{([^}]+)\}/g) || []).concat(markdown.match(/\[@([^\]]+)\]/g) || []);
    for (const m of allMatches) {
      const inner = m.replace(/\\cite\{|\}|\[|\]|@/g, '');
      inner.split(',').map(s => s.trim()).forEach(k => { if (k) referenced.add(k); });
    }
    if (referenced.size && Object.keys(_cachedBibliography || {}).length) {
      const bibEntries = [];
      for (const k of Array.from(referenced)) {
        const e = _cachedBibliography[k];
        if (e) bibEntries.push({ key: k, text: `${e.author ? e.author : ''}${e.year ? ` (${e.year})` : ''} — ${e.title ?? ''}` });
      }
      if (bibEntries.length) {
        // Remove existing bibliography if present
        const existingBib = previewEl.querySelector('.bibliography-list');
        if (existingBib) {
          const prevH4 = existingBib.previousElementSibling;
          if (prevH4 && prevH4.tagName === 'H4' && prevH4.textContent === 'References') {
            const prevHr = prevH4.previousElementSibling;
            if (prevHr && prevHr.tagName === 'HR') {
              prevHr.remove();
            }
            prevH4.remove();
          }
          existingBib.remove();
        }
        const hr = document.createElement('hr');
        const h = document.createElement('h4'); h.textContent = 'References';
        const ul = document.createElement('ul'); ul.className = 'bibliography-list';
        bibEntries.forEach(be => {
          const li = document.createElement('li'); li.className = 'bibliography-item'; li.textContent = `[${be.key}] ${be.text}`; ul.appendChild(li);
        });
        try {
          previewEl.appendChild(hr);
          previewEl.appendChild(h);
          previewEl.appendChild(ul);
        } catch (e) {}
      }
    }
  } catch (e) {
    // swallow
  }
};

// Simple debounce helper for preview rendering to avoid excessive re-renders
const debounce = (fn, delay) => {
  let t = null;
  return function debounced(...args) {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
  try { fn.apply(this, args); } catch (e) { }
      t = null;
    }, delay);
  };
};

// Debounced preview version (used during typing). 300ms is a reasonable default
// Do not trigger preview rendering while suggestion popovers are open since
// that can steal focus/interrupt autocompletion UX.
const debouncedRenderPreview = debounce((markdown, noteId) => {
  try {
    if ((state.wikiSuggest && state.wikiSuggest.open) || (state.tagSuggest && state.tagSuggest.open)) {
      // Skip preview render while suggestion UI is active.
      return;
    }
  } catch (e) { /* ignore and proceed */ }
  renderMarkdownPreview(markdown, noteId);
}, 300);

const getPreviewHtmlForExport = async () => {
  if (!elements.preview) {
    return '';
  }

  const raw = (elements.preview && elements.preview.innerHTML) ? elements.preview.innerHTML : '';
  if (!raw.trim()) {
    return '';
  }

  try {
    const sanitized = window.DOMPurify.sanitize(raw, domPurifyConfig);
    if (!sanitized.trim()) {
      return '';
    }

    const container = document.createElement('div');
  try { if (container) container.innerHTML = sanitized; } catch (e) { if (container) container.innerHTML = ''; }

    // Run citation post-processing on the sanitized container so exported HTML/PDF
    // includes rendered citations and a References section when available.
    try {
      // renderCitationsInPreview works against elements.preview; temporarily use
      // a small shim: create a preview-like element, populate it, call the
      // function, then extract its innerHTML.
      if (typeof renderCitationsInPreview === 'function') {
        const shim = document.createElement('div');
        shim.innerHTML = container.innerHTML;
        const prev = elements.preview;
        try {
          elements.preview = shim;
          // Pass the original markdown if available so bibliography detection works
          const md = elements.exportPreviewText?.value || '';
          // renderCitationsInPreview may be async; await it to ensure processing completes
          const maybe = renderCitationsInPreview(md, state.activeNoteId);
          if (maybe && typeof maybe.then === 'function') {
            await maybe;
          }
        } catch (e) { /* ignore */ }
        // restore and copy processed HTML back into container
        try { container.innerHTML = shim.innerHTML; } catch (e) { /* ignore */ }
        elements.preview = prev;
      }
    } catch (e) { /* ignore */ }
    container.querySelectorAll('.hashtag-hidden').forEach((node) => {
      node.remove();
    });

    return container.innerHTML;
  } catch (error) {
  // Debug prints removed
    return raw.trim();
  }
};

const resolveCurrentThemePreference = () => {
  const normalize = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
  const root = document.documentElement;
  const body = document.body;

  const datasetTheme = normalize(root?.dataset?.theme) || normalize(body?.dataset?.theme);
  if (datasetTheme === 'dark' || datasetTheme === 'light') {
    return datasetTheme;
  }

  const classList = new Set([
    ...(root?.classList ? Array.from(root.classList) : []),
    ...(body?.classList ? Array.from(body.classList) : [])
  ].map((value) => value.toLowerCase()));

  if (classList.has('dark') || classList.has('theme-dark')) {
    return 'dark';
  }
  if (classList.has('light') || classList.has('theme-light')) {
    return 'light';
  }

  if (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
    return 'dark';
  }

  return 'light';
};

const exportActivePreviewAsPdf = async () => {
  const note = getActiveNote();
  if (!note || (note.type !== 'markdown' && note.type !== 'latex')) {
    setStatus('Only Markdown and LaTeX notes can be exported as PDF.', false);
    return false;
  }

  if (typeof window.api?.exportPreviewPdf !== 'function') {
    setStatus('Preview export is unavailable in this build.', false);
    return false;
  }

  const html = await getPreviewHtmlForExport();
  if (!html.trim()) {
    setStatus('Nothing to export — the preview is empty.', false);
    return false;
  }

  const button = elements.exportPreviewButton ?? null;
  const title =
    (typeof note.title === 'string' && note.title.trim()) ||
    extractFileNameFromPath(note.absolutePath ?? note.storedPath ?? '') ||
    'Preview';

  if (button) {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
  }

  setStatus('Preparing PDF export…', false);

  try {
    const result = await window.api.exportPreviewPdf({
      html,
      theme: resolveCurrentThemePreference(),
      title
    });

    if (result?.canceled) {
      setStatus('Export cancelled.', true);
      return false;
    }

    const exportedPath = typeof result?.filePath === 'string' ? result.filePath : '';
    const exportedName = extractFileNameFromPath(exportedPath);

    if (exportedName) {
      setStatus(`Exported preview to ${exportedName}.`, true);
    } else {
      setStatus('Preview exported.', true);
    }

    return true;
  } catch (error) {
  // Debug prints removed
    const message = typeof error?.message === 'string' && error.message.trim().length
      ? error.message.trim()
      : 'see logs';
    setStatus(`Export failed — ${message}.`, false);
    return false;
  } finally {
    if (button) {
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
    updateActionAvailability(note);
  }
};

const exportActivePreviewAsHtml = async () => {
  const note = getActiveNote();
  if (!note || (note.type !== 'markdown' && note.type !== 'latex')) {
    setStatus('Only Markdown and LaTeX notes can be exported as HTML.', false);
    return false;
  }

  if (typeof window.api?.exportPreviewHtml !== 'function') {
    setStatus('HTML export is unavailable in this build.', false);
    return false;
  }

  const html = await getPreviewHtmlForExport();
  if (!html.trim()) {
    setStatus('Nothing to export — the preview is empty.', false);
    return false;
  }

  const button = elements.exportPreviewHtmlButton ?? null;
  const title =
    (typeof note.title === 'string' && note.title.trim()) ||
    extractFileNameFromPath(note.absolutePath ?? note.storedPath ?? '') ||
    'Preview';

  if (button) {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
  }

  setStatus('Preparing HTML export…', false);

  try {
    const result = await window.api.exportPreviewHtml({
      html,
      theme: resolveCurrentThemePreference(),
      title,
      folderPath: state.currentFolder
    });

    if (result?.canceled) {
      setStatus('Export cancelled.', true);
      return false;
    }

    const exportedPath = typeof result?.filePath === 'string' ? result.filePath : '';
    const exportedName = extractFileNameFromPath(exportedPath);

    if (exportedName) {
      setStatus(`Exported preview to ${exportedName}.`, true);
    } else {
      setStatus('Preview exported.', true);
    }

    return true;
  } catch (error) {
  // Debug prints removed
    const message = typeof error?.message === 'string' && error.message.trim().length
      ? error.message.trim()
      : 'see logs';
    setStatus(`Export failed — ${message}.`, false);
    return false;
  } finally {
    if (button) {
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
    updateActionAvailability(note);
  }
};

// Image export functions
const exportActivePreviewAsImage = async (format) => {
  const note = getActiveNote();
  if (!note || (note.type !== 'markdown' && note.type !== 'latex')) {
    setStatus(`Only Markdown and LaTeX notes can be exported as ${format.toUpperCase()}.`, false);
    return false;
  }

  const html = await getPreviewHtmlForExport();
  if (!html.trim()) {
    setStatus('Nothing to export — the preview is empty.', false);
    return false;
  }

  const title =
    (typeof note.title === 'string' && note.title.trim()) ||
    extractFileNameFromPath(note.absolutePath ?? note.storedPath ?? '') ||
    'Preview';

  setStatus(`Preparing ${format.toUpperCase()} export…`, false);

  try {
    let result;
    if (format === 'png') {
      result = await window.api.exportPreviewPng({ html, title, folderPath: state.currentFolder });
    } else if (format === 'jpg' || format === 'jpeg') {
      result = await window.api.exportPreviewJpg({ html, title, folderPath: state.currentFolder });
    } else if (format === 'tiff') {
      result = await window.api.exportPreviewTiff({ html, title, folderPath: state.currentFolder });
    } else {
      throw new Error(`Unsupported image format: ${format}`);
    }

    if (result?.filePath) {
      const exportedName = path.basename(result.filePath);
      setStatus(`Exported preview to ${exportedName}.`, true);
    } else {
      setStatus('Preview exported.', true);
    }

    return true;
  } catch (error) {
  // Debug prints removed
    const message = typeof error?.message === 'string' && error.message.trim().length
      ? error.message.trim()
      : 'see logs';
    setStatus(`Export failed — ${message}.`, false);
    return false;
  }
};

const exportActivePreviewAsPng = () => exportActivePreviewAsImage('png');
const exportActivePreviewAsJpg = () => exportActivePreviewAsImage('jpg');
const exportActivePreviewAsJpeg = () => exportActivePreviewAsImage('jpeg');
const exportActivePreviewAsTiff = () => exportActivePreviewAsImage('tiff');

const renderCodePreview = (code, language) => {
  if (!elements.codeViewer) {
    return;
  }

  const target = elements.codeViewerCode ?? elements.codeViewer;
  target.textContent = code ?? '';

  if (language) {
    elements.codeViewer.dataset.language = language.toUpperCase();
  } else {
    elements.codeViewer.removeAttribute('data-language');
  }

  elements.codeViewer.classList.add('visible');
  elements.codeViewer.scrollTop = 0;
};

const renderLatexPreview = (latexContent, noteId) => {
  // Debug prints removed
  if (!elements.preview) {
  // Debug prints removed
    return;
  }

  try {
    // Basic LaTeX processing: split content and render math expressions
    const processedHtml = processLatexContent(latexContent);
  // Debug prints removed
    elements.preview.innerHTML = processedHtml;
  // Debug prints removed
    
    // Process any math expressions with KaTeX. Ensure KaTeX is loaded lazily
    // before attempting to auto-render. If KaTeX fails to load, skip math rendering.
    if (typeof renderMathInElement === 'function') {
      ensureKaTeX().then(() => {
        try {
          renderMathInElement(elements.preview, {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
              {left: '\\[', right: '\\]', display: true},
              {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false
          });
        } catch (e) { /* ignore render errors */ }
      }).catch(() => { /* ignore katex load errors */ });
    }

    // Render citations in the LaTeX preview
    renderCitationsInPreview(latexContent, noteId);

    // Add basic styling for LaTeX content
    elements.preview.classList.add('latex-preview');
  // Debug prints removed
    
    // Process iframes and images if any
    void processPreviewHtmlIframes();
    addImageHoverPreviews();
    
  } catch (error) {
  // Debug prints removed
    elements.preview.innerHTML = `<pre>${latexContent}</pre>`;
  }
};

// Toggle LaTeX preview visibility for the currently active markdown/latex note
const toggleLatexPreviewForActiveNote = () => {
  const note = getActiveNote();
  if (!note) {
    setStatus('No active note to preview LaTeX for.', true);
    return;
  }

  // If preview currently has latex-preview class, remove it (toggle off)
  if (elements.preview && elements.preview.classList.contains('latex-preview')) {
    elements.preview.classList.remove('latex-preview');
    // Re-render the normal markdown preview for the active note
    if (note.type === 'markdown') {
      renderMarkdownPreview(note.content ?? '', note.id);
    } else {
      renderActiveNote();
    }
    setStatus('LaTeX preview disabled', true);
    return;
  }

  // Otherwise, enable latex preview for the note's content
  if (elements.preview) {
    renderLatexPreview(note.content ?? '', note.id);
    setStatus('LaTeX preview enabled', true);
  }
};

// Insert a LaTeX equation block at the current cursor position in the active editor
const insertLatexBlockAtCursor = (opts = {}) => {
  const inst = getAnyEditorInstance();
  if (!inst || !inst.isPresent()) {
    setStatus('No active editor to insert LaTeX into.', true);
    return;
  }

  const cursorStart = inst.selectionStart || 0;
  const cursorEnd = inst.selectionEnd || cursorStart;
  const placeholder = opts.placeholder || '\\begin{equation}\n\n\\end{equation}\n';

  try {
    // Use setRangeText if available for better selection handling
    if (typeof inst.setRangeText === 'function') {
      inst.setRangeText(placeholder);
    } else if (inst.el && typeof inst.el.setRangeText === 'function') {
      inst.el.setRangeText(placeholder);
    } else {
      // Fallback: manual insertion
      const val = inst.getValue();
      const newVal = val.slice(0, cursorStart) + placeholder + val.slice(cursorEnd);
      inst.setValue(newVal);
    }

    // Move cursor inside the equation block
    const newPos = cursorStart + placeholder.indexOf('\n') + 1;
    try { inst.setSelectionRange(newPos, newPos); } catch (e) { /* ignore */ }
    inst.focus({ preventScroll: true });

    // Trigger a debounced preview render if applicable
    const note = getActiveNote();
    if (note && note.type === 'markdown') {
      debouncedRenderPreview(inst.getValue(), note.id);
    }

    setStatus('Inserted LaTeX block', true);
  } catch (error) {
    setStatus('Failed to insert LaTeX block', 'error');
  }
};

const processLatexContent = (latexContent) => {
  if (!latexContent) return '';

  // If the content contains a document environment, extract only the body
  try {
    const docMatch = latexContent.match(/\\begin\{document\}([\s\S]*)\\end\{document\}/m);
    if (docMatch && docMatch[1]) {
      latexContent = docMatch[1];
    }
  } catch (e) { /* ignore and use full content */ }

  // Remove common preamble commands like \documentclass
  try {
    latexContent = latexContent.replace(/\\documentclass(\[[^\]]*\])?\{[^}]+\}/g, '');
  } catch (e) {}

  // Split content into lines
  const lines = latexContent.split('\n');
  const processedLines = [];
  
  for (const line of lines) {
    let processedLine = line;
    
    // Remove LaTeX comments (lines starting with %)
    if (processedLine.trim().startsWith('%')) {
      continue;
    }
    
    // Remove \usepackage commands
    processedLine = processedLine.replace(/\\usepackage(\[.*?\])?\{[^}]+\}/g, '');
    
    // Remove document structure commands
    processedLine = processedLine.replace(/\\begin\{document\}|\\end\{document\}/g, '');
    processedLine = processedLine.replace(/\\maketitle|\\tableofcontents|\\listoffigures|\\listoftables/g, '');
    
    // Handle basic LaTeX commands
    // Convert \section{Title} and \section*{Title} to <h2>Title</h2>
    processedLine = processedLine.replace(/\\section\*?\{([^}]+)\}/g, '<h2>$1</h2>');
    processedLine = processedLine.replace(/\\subsection\*?\{([^}]+)\}/g, '<h3>$1</h3>');
    processedLine = processedLine.replace(/\\subsubsection\*?\{([^}]+)\}/g, '<h4>$1</h4>');
    
    // Convert formatting commands
    processedLine = processedLine.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
    processedLine = processedLine.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
    processedLine = processedLine.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>');
    processedLine = processedLine.replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>');
    processedLine = processedLine.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
    processedLine = processedLine.replace(/\\textsc\{([^}]+)\}/g, '<span style="font-variant: small-caps;">$1</span>');
    
    // Convert URL command
    processedLine = processedLine.replace(/\\url\{([^}]+)\}/g, '<a href="$1">$1</a>');
    
    // Convert \begin{itemize} ... \end{itemize} to <ul> ... </ul>
    // This is a basic implementation - a full LaTeX parser would be more complex
    if (processedLine.includes('\\begin{itemize}')) {
      processedLine = processedLine.replace(/\\begin\{itemize\}/g, '<ul>');
    }
    if (processedLine.includes('\\end{itemize}')) {
      processedLine = processedLine.replace(/\\end\{itemize\}/g, '</ul>');
    }
    if (processedLine.includes('\\item')) {
      processedLine = processedLine.replace(/\\item/g, '<li>');
    }
    
    // Convert \begin{enumerate} ... \end{enumerate} to <ol> ... </ol>
    if (processedLine.includes('\\begin{enumerate}')) {
      processedLine = processedLine.replace(/\\begin\{enumerate\}/g, '<ol>');
    }
    if (processedLine.includes('\\end{enumerate}')) {
      processedLine = processedLine.replace(/\\end\{enumerate\}/g, '</ol>');
    }
    
    // Convert \begin{verbatim} ... \end{verbatim} to <pre><code> ... </code></pre>
    if (processedLine.includes('\\begin{verbatim}')) {
      processedLine = processedLine.replace(/\\begin\{verbatim\}/g, '<pre><code>');
    }
    if (processedLine.includes('\\end{verbatim}')) {
      processedLine = processedLine.replace(/\\end\{verbatim\}/g, '</code></pre>');
    }
    
    // Handle verbatim blocks with language specification (e.g., \begin{verbatim}[python])
    processedLine = processedLine.replace(/\\begin\{verbatim\}\[([^\]]+)\]/g, '<pre><code class="language-$1">');
    
    // Handle basic quote environments
    if (processedLine.includes('\\begin{quote}')) {
      processedLine = processedLine.replace(/\\begin\{quote\}/g, '<blockquote>');
    }
    if (processedLine.includes('\\end{quote}')) {
      processedLine = processedLine.replace(/\\end\{quote\}/g, '</blockquote>');
    }
    
    // Handle figure and table environments (simplified - just remove the environment markers)
    if (processedLine.includes('\\begin{figure}')) {
      processedLine = processedLine.replace(/\\begin\{figure\}(\[.*?\])?/g, '<figure>');
    }
    if (processedLine.includes('\\end{figure}')) {
      processedLine = processedLine.replace(/\\end\{figure\}/g, '</figure>');
    }
    if (processedLine.includes('\\begin{table}')) {
      processedLine = processedLine.replace(/\\begin\{table\}(\[.*?\])?/g, '<table>');
    }
    if (processedLine.includes('\\end{table}')) {
      processedLine = processedLine.replace(/\\end\{table\}/g, '</table>');
    }
    
    // Handle \caption command
    processedLine = processedLine.replace(/\\caption\{([^}]+)\}/g, '<figcaption>$1</figcaption>');
    
    // Handle \label command (just remove it for now)
    processedLine = processedLine.replace(/\\label\{[^}]+\}/g, '');
    
    // Handle line breaks
    if (processedLine.trim() === '') {
      processedLines.push('<br>');
    } else {
      processedLines.push(processedLine);
    }
  }
  
  return processedLines.join('\n');
};

const renderNotebookPreview = (note) => {
  if (!elements.preview) {
    return;
  }
  const container = createNotebookContainer(note);
  elements.preview.replaceChildren();
  elements.preview.appendChild(container);
  elements.preview.scrollTop = 0;
};

// Build and return a DOM container representing the notebook. This can be
// used either for the global preview or for a pane-local viewer.
const createNotebookContainer = (note) => {
  const notebook = note?.notebook;
  const container = document.createElement('div');
  container.className = 'notebook-preview';

  if (note?.language) {
    container.dataset.language = note.language.toUpperCase();
  }

  const cells = Array.isArray(notebook?.cells) ? notebook.cells : [];

  cells.forEach((cell, idx) => {
    const section = document.createElement('section');
    section.className = `nb-cell nb-cell--${cell.type ?? 'unknown'}`;

    // Per-cell header with index and a small copy button for code cells
    const header = document.createElement('header');
    header.className = 'nb-cell__header';
    header.textContent = cell.type === 'markdown' ? `Markdown` : `In [${(cell.index ?? idx) + 1}]`;

    // Add a copy button for code cells
    if (cell.type !== 'markdown') {
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'nb-cell__copy-btn';
      copyBtn.title = 'Copy code';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', () => {
        try { navigator.clipboard.writeText(cell.source ?? ''); } catch (e) {}
      });
      header.appendChild(copyBtn);
    }

    section.appendChild(header);

    if (cell.type === 'markdown') {
      const html = window.DOMPurify.sanitize(window.marked.parse(cell.source ?? ''));
      const content = document.createElement('div');
      content.className = 'nb-cell__markdown';
      try { content.innerHTML = html; } catch (e) { content.textContent = html; }
      section.appendChild(content);
    } else {
      const pre = document.createElement('pre');
      pre.className = 'nb-cell__code';
      const codeElement = document.createElement('code');
      codeElement.textContent = cell.source ?? '';
      pre.appendChild(codeElement);
      section.appendChild(pre);

      if (Array.isArray(cell.outputs) && cell.outputs.length) {
        const outputsWrapper = document.createElement('div');
        outputsWrapper.className = 'nb-cell__outputs';

        cell.outputs.forEach((text) => {
          const outputPre = document.createElement('pre');
          outputPre.className = 'nb-cell__output';
          outputPre.textContent = text;
          outputsWrapper.appendChild(outputPre);
        });

        section.appendChild(outputsWrapper);
      }
    }

    container.appendChild(section);
  });

  if (!cells.length) {
    const empty = document.createElement('p');
    empty.className = 'nb-empty';
    empty.textContent = 'This notebook has no visible cells.';
    container.appendChild(empty);
  }

  return container;
};

// Create a cell-by-cell editor for a notebook. Each code/markdown cell gets a textarea.
const createNotebookEditor = (note) => {
  const notebook = note?.notebook;
  const editor = document.createElement('div');
  editor.className = 'notebook-editor';

  const cells = Array.isArray(notebook?.cells) ? notebook.cells : [];

  cells.forEach((cell, idx) => {
    const cellWrap = document.createElement('div');
    cellWrap.className = 'nb-editor-cell';
    cellWrap.dataset.cellType = cell.type === 'markdown' ? 'markdown' : 'code';
    cellWrap.dataset.outputs = JSON.stringify(cell.outputs || []);

    const header = document.createElement('header');
    header.className = 'nb-editor-cell__header';
    header.textContent = cell.type === 'markdown' ? `Markdown` : `In [${(cell.index ?? idx) + 1}]`;
    cellWrap.appendChild(header);

    // Create the editable textarea
    const ta = document.createElement('textarea');
    ta.className = 'nb-editor-cell__textarea';
    ta.value = cell.source ?? '';
    // For markdown cells add a live preview toggle
    if (cell.type === 'markdown') {
      const controls = document.createElement('div');
      controls.className = 'nb-editor-cell__controls';

      const previewBtn = document.createElement('button');
      previewBtn.type = 'button';
      previewBtn.className = 'nb-editor-cell__preview-toggle';
      previewBtn.textContent = 'Preview';
      controls.appendChild(previewBtn);

      header.appendChild(controls);

      // Preview element (initially hidden)
      const previewEl = document.createElement('div');
      previewEl.className = 'nb-editor-cell__preview';
      previewEl.style.display = 'none';

      // Render function
      const renderPreview = () => {
        try {
          const html = window.marked ? window.marked.parse(ta.value || '') : (ta.value || '');
          const safe = window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
          previewEl.innerHTML = safe;
        } catch (e) {
          previewEl.textContent = ta.value || '';
        }
      };

      // Toggle preview visibility
      previewBtn.addEventListener('click', () => {
        const isShown = previewEl.style.display !== 'none';
        if (isShown) {
          previewEl.style.display = 'none';
          previewBtn.textContent = 'Preview';
        } else {
          renderPreview();
          previewEl.style.display = '';
          previewBtn.textContent = 'Hide preview';
        }
      });

      // Update preview live as user types (only if visible)
      ta.addEventListener('input', () => {
        if (previewEl.style.display !== 'none') {
          renderPreview();
        }
      });

      cellWrap.appendChild(ta);
      cellWrap.appendChild(previewEl);
    } else {
      cellWrap.appendChild(ta);
    }

    // Show read-only outputs below editor
    if (Array.isArray(cell.outputs) && cell.outputs.length) {
      const outWrap = document.createElement('div');
      outWrap.className = 'nb-editor-cell__outputs';
      cell.outputs.forEach((o) => {
        const pre = document.createElement('pre');
        pre.className = 'nb-editor-cell__output';
        pre.textContent = o;
        outWrap.appendChild(pre);
      });
      cellWrap.appendChild(outWrap);
    }

    editor.appendChild(cellWrap);
  });

  if (!cells.length) {
    const p = document.createElement('p');
    p.className = 'nb-empty';
    p.textContent = 'This notebook has no cells to edit.';
    editor.appendChild(p);
  }

  return editor;
};

// Render a notebook inside a specific editor pane by creating a pane-local
// viewer. This hides the textarea and adds an interactive read-only view.
const renderNotebookInPane = async (note, paneId) => {
  if (!note || note.type !== 'notebook' || !paneId) return false;
  const root = getPaneRootElement(paneId);
  if (!root) return false;

  // Clear any global preview to avoid duplicates
  try { clearGlobalPdfViewer(); } catch (e) {}

  // Clear existing pane viewers and hide editor
  clearPaneViewer(paneId);
  const cm = root.querySelector('.CodeMirror');
  if (cm) cm.style.display = 'none';
  const ta = root.querySelector('textarea');
  if (ta) { ta.hidden = true; ta.disabled = true; }

  const wrapper = document.createElement('div');
  wrapper.className = 'nb-pane-viewer pane-viewer';
  wrapper.setAttribute('data-note-id', note.id);
  let viewerContainer = createNotebookContainer(note);
  wrapper.appendChild(viewerContainer);
  // Add an Edit Raw toggle + Save/Cancel controls so users can edit the notebook JSON
  const controls = document.createElement('div');
  controls.className = 'nb-pane-controls';

  const editToggle = document.createElement('button');
  editToggle.type = 'button';
  editToggle.className = 'nb-edit-toggle';
  editToggle.textContent = 'Edit raw';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'nb-save-btn';
  saveBtn.textContent = 'Save';
  saveBtn.style.display = 'none';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'nb-cancel-btn';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.display = 'none';

  controls.appendChild(editToggle);
  controls.appendChild(saveBtn);
  controls.appendChild(cancelBtn);
  // Insert controls before the current viewer container
  wrapper.insertBefore(controls, viewerContainer);

  // Editor container will be created on demand (cell-by-cell editor)
  let editorContainer = null;

  let editing = false;

  editToggle.addEventListener('click', () => {
    // Open the cell-by-cell editor
    editing = true;
    // Hide the current viewer container while editing
    if (viewerContainer && viewerContainer.style) viewerContainer.style.display = 'none';
    editToggle.style.display = 'none';
    saveBtn.style.display = '';
    cancelBtn.style.display = '';

    // Create editor lazily and swap it in place of the viewer so editing happens inline
    if (!editorContainer) {
      editorContainer = createNotebookEditor(note);
      // Find the current viewer inside wrapper (robust if viewerContainer changed)
      const currentViewer = wrapper.querySelector('.notebook-preview') || viewerContainer;
      if (currentViewer && currentViewer.parentNode === wrapper) {
        wrapper.replaceChild(editorContainer, currentViewer);
      } else {
        wrapper.appendChild(editorContainer);
      }
    }
    editorContainer.style.display = 'block';
    try { const firstTa = editorContainer.querySelector('textarea'); if (firstTa) firstTa.focus(); } catch (e) {}
  });

  cancelBtn.addEventListener('click', () => {
    // Close editor and restore viewer in-place
    editing = false;
    editToggle.style.display = '';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    if (editorContainer) {
      // Recreate a fresh viewer from the current note state (safer than reusing stale node)
      const freshViewer = createNotebookContainer(note);
      try {
        wrapper.replaceChild(freshViewer, editorContainer);
        viewerContainer = freshViewer;
      } catch (e) {
        // Fallback: remove editor and append viewer
        editorContainer.remove();
        wrapper.appendChild(freshViewer);
        viewerContainer = freshViewer;
      }
      editorContainer = null;
    } else {
      // ensure viewer is visible
      const cur = wrapper.querySelector('.notebook-preview');
      if (cur) cur.style.display = '';
    }
  });

  saveBtn.addEventListener('click', async () => {
    // Collect edited cells from the cell editor
    let parsedNotebook = null;
    try {
      if (!editorContainer) throw new Error('Editor not present');
      const editedCells = [];
      const cellNodes = Array.from(editorContainer.querySelectorAll('.nb-editor-cell'));
      for (const cn of cellNodes) {
        const type = cn.dataset.cellType === 'markdown' ? 'markdown' : 'code';
        const ta = cn.querySelector('textarea');
        const source = ta ? ta.value : '';
        // Preserve outputs where possible (read-only)
        const outputs = JSON.parse(cn.dataset.outputs || '[]');
        editedCells.push({ type, source, metadata: {}, outputs });
      }
      parsedNotebook = { metadata: note.notebook.metadata || {}, cells: editedCells };
    } catch (e) {
      setStatus('Failed to collect edited cells: ' + String(e && e.message ? e.message : e), false);
      return;
    }

    const filePath = note.absolutePath;
    try {
      const res = await window.api.saveNotebook({ filePath, notebook: parsedNotebook });
      if (res && res.success) {
        setStatus('Notebook saved.', true);
        // Update in-memory note representation so viewer reflects saved content
        note.notebook = parsedNotebook;
        // Rebuild viewer container and swap into place
        const newViewer = createNotebookContainer(note);
        try {
          if (editorContainer && editorContainer.parentNode === wrapper) {
            wrapper.replaceChild(newViewer, editorContainer);
          } else {
            const cur = wrapper.querySelector('.notebook-preview') || viewerContainer;
            if (cur && cur.parentNode === wrapper) {
              wrapper.replaceChild(newViewer, cur);
            } else {
              wrapper.appendChild(newViewer);
            }
          }
        } catch (e) {
          if (editorContainer && editorContainer.parentNode) editorContainer.remove();
          try { if (viewerContainer && viewerContainer.parentNode) viewerContainer.replaceWith(newViewer); else wrapper.appendChild(newViewer); } catch (e2) { wrapper.appendChild(newViewer); }
        }
        // update current viewer reference
        viewerContainer = newViewer;
        // If this notebook is currently the active or last-renderable note, update the global preview
        try {
          if (typeof renderNotebookPreview === 'function' && elements && elements.preview) {
            const isActiveOrLast = state.activeNoteId === note.id || state.lastRenderableNoteId === note.id;
            // If no active note or this note is the relevant renderable, refresh the right-hand preview
            if (isActiveOrLast || !state.activeNoteId) {
              try {
                renderNotebookPreview(note);
                state.lastRenderableNoteId = note.id;
                state.activeNoteId = note.id;
              } catch (e) {
                // ignore preview errors
              }
            }
          }
        } catch (e) { /* ignore */ }
        // exit editing
        editing = false;
        editorContainer = null;
        // Ensure the new viewer is visible
        try { if (viewerContainer && viewerContainer.style) viewerContainer.style.display = ''; } catch (e) {}
        // Restore control visibility on the newly inserted controls (they are fresh nodes)
        try {
          const freshEdit = wrapper.querySelector('.nb-edit-toggle');
          const freshSave = wrapper.querySelector('.nb-save-btn');
          const freshCancel = wrapper.querySelector('.nb-cancel-btn');
          if (freshEdit) freshEdit.style.display = '';
          if (freshSave) freshSave.style.display = 'none';
          if (freshCancel) freshCancel.style.display = 'none';
        } catch (e) { /* ignore */ }
      } else {
        setStatus('Failed to save: ' + (res && res.error ? res.error : 'unknown'), false);
      }
    } catch (e) {
      setStatus('Save failed: ' + (e && e.message ? e.message : 'unknown'), false);
    }
  });
  root.appendChild(wrapper);
  return true;
};

const renderPdfPreview = async (note) => {
  if (!note || note.type !== 'pdf' || !elements.pdfViewer) {
    return;
  }
  // If this PDF is already open in a pane-local viewer, avoid rendering
  // it again in the global preview to prevent duplicate viewers.
  if (getPaneForNote(note.id)) return;

  const cacheKey = getPdfCacheKey(note);

  // Ensure any previous global viewer is cleared using our centralized cleanup
  clearGlobalPdfViewer();

  if (cacheKey && pdfCache.has(cacheKey)) {
    if (applyPdfResource(pdfCache.get(cacheKey))) {
      setStatus('PDF ready.', true);
      return;
    }
  }

  setStatus('Loading PDF…', false);

  try {
    let resource = null;

    if (note.absolutePath) {
      const binary = await window.api.readPdfBinary({ absolutePath: note.absolutePath });
      const uint8 = ensureUint8Array(binary);
      if (uint8 && uint8.byteLength) {
        const blob = new Blob([uint8], { type: 'application/pdf' });
        resource = {
          type: 'objectUrl',
          value: URL.createObjectURL(blob)
        };
      }
    } else if (note.storedPath) {
      const dataUri = await window.api.loadPdfData({ storedPath: note.storedPath });
      if (dataUri) {
        resource = {
          type: 'dataUri',
          value: dataUri
        };
      }
    }

    if (resource) {
      if (cacheKey) {
        const existing = pdfCache.get(cacheKey);
        if (existing && existing.value !== resource.value) {
          releasePdfResource(existing);
        }
        pdfCache.set(cacheKey, resource);
      }

      if (applyPdfResource(resource)) {
        setStatus('PDF ready.', true);
        return;
      }
    }

    clearGlobalPdfViewer();
    setStatus('Unable to load PDF data.', false);
  } catch (error) {
  // Debug prints removed
    clearGlobalPdfViewer();
    setStatus('Failed to load PDF.', false);
  }
};

const renderImagePreview = async (note) => {
  if (!note || note.type !== 'image' || !elements.imageViewer) {
    return;
  }
  // Skip global image preview if the note is already shown inside an editor pane
  if (getPaneForNote(note.id)) return;

  const caption = note.title ?? note.absolutePath ?? 'Image';
  state.imagePreviewToken = Symbol('imagePreview');
  const requestToken = state.imagePreviewToken;

  // Reset viewer state
  elements.imageViewer?.classList.remove('visible');

  if (elements.imageViewerCaption) {
    elements.imageViewerCaption.textContent = caption;
  }

  if (elements.imageViewerImg) {
    elements.imageViewerImg.alt = caption;
    elements.imageViewerImg.removeAttribute('src');
    elements.imageViewerImg.dataset.rawSrc = '';
    elements.imageViewerImg.dataset.noteId = note.id;
  }

  if (elements.imageViewerError) {
    elements.imageViewerError.hidden = true;
  }

  const rawSrc = note.absolutePath ?? note.storedPath ?? '';
  if (!rawSrc) {
    if (elements.imageViewerError) {
      elements.imageViewerError.textContent = 'This image does not have a readable path.';
      elements.imageViewerError.hidden = false;
    }
    return;
  }

  try {
    const payload = {
      src: rawSrc,
      notePath: note.absolutePath ?? null,
      folderPath: note.folderPath ?? state.currentFolder ?? null
    };
    try { if (window.api && typeof window.api.writeDebugLog === 'function') window.api.writeDebugLog({ event: 'renderImagePreview:resolveResource:payload', payload }); } catch (e) { }
    const result = await window.api.resolveResource(payload);
    try { if (window.api && typeof window.api.writeDebugLog === 'function') window.api.writeDebugLog({ event: 'renderImagePreview:resolveResource:result', noteId: note.id, result: { ok: Boolean(result && result.value), valueType: typeof (result && result.value) } }); } catch (e) { }
    if (state.imagePreviewToken !== requestToken) {
      return;
    }

    const value = result?.value ?? null;
  try { console.log('renderImagePreview: resolved resource', { noteId: note.id, hasValue: Boolean(value), rawSrc }); } catch (e) {}
    if (value && elements.imageViewerImg) {
      try { if (window.api && typeof window.api.writeDebugLog === 'function') window.api.writeDebugLog({ event: 'renderImagePreview:setSrc', noteId: note.id, srcPreview: String(value).slice(0,200) }); } catch (e) { }
      const cacheKey = `${note.id}::${rawSrc}`;
      imageResourceCache.set(cacheKey, value);
      elements.imageViewerImg.src = value;
      elements.imageViewerImg.dataset.rawSrc = rawSrc;
      elements.imageViewerImg.dataset.noteId = note.id;
      if (elements.imageViewerError) {
        elements.imageViewerError.hidden = true;
      }
      elements.imageViewer?.classList.add('visible');
      setStatus('Image ready.', true);
    } else if (elements.imageViewerError) {
      elements.imageViewerError.textContent = 'Unable to load this image.';
      elements.imageViewerError.hidden = false;
      elements.imageViewer?.classList.remove('visible');
      setStatus('Unable to load image preview.', false);
    }
  } catch (error) {
    if (state.imagePreviewToken !== requestToken) {
      return;
    }
  // Debug prints removed
    if (elements.imageViewerError) {
      elements.imageViewerError.textContent = 'Unable to load this image.';
      elements.imageViewerError.hidden = false;
      elements.imageViewer?.classList.remove('visible');
    }
    setStatus('Unable to load image preview.', false);
  }
};

const renderVideoPreview = async (note) => {
  if (!note || note.type !== 'video' || !elements.videoViewer) {
    return;
  }

  const caption = note.title ?? note.absolutePath ?? 'Video';
  state.videoPreviewToken = Symbol('videoPreview');
  const requestToken = state.videoPreviewToken;

  if (elements.videoViewerCaption) {
    elements.videoViewerCaption.textContent = caption;
  }

  if (elements.videoViewerVideo) {
    elements.videoViewerVideo.removeAttribute('src');
    elements.videoViewerVideo.dataset.rawSrc = '';
    elements.videoViewerVideo.dataset.noteId = note.id;
  }

  if (elements.videoViewerError) {
    elements.videoViewerError.hidden = true;
  }

  const rawSrc = note.absolutePath ?? note.storedPath ?? '';
  if (!rawSrc) {
    if (elements.videoViewerError) {
      elements.videoViewerError.textContent = 'This video does not have a readable path.';
      elements.videoViewerError.hidden = false;
    }
    return;
  }

  try {
    const payload = {
      src: rawSrc,
      notePath: note.absolutePath ?? null,
      folderPath: note.folderPath ?? state.currentFolder ?? null
    };
    const result = await window.api.resolveResource(payload);
    if (state.videoPreviewToken !== requestToken) {
      return;
    }

    const value = result?.value ?? null;
    if (value && elements.videoViewerVideo) {
      const cacheKey = `${note.id}::${rawSrc}`;
      videoResourceCache.set(cacheKey, value);
      elements.videoViewerVideo.src = value;
      elements.videoViewerVideo.dataset.rawSrc = rawSrc;
      elements.videoViewerVideo.dataset.noteId = note.id;
      if (elements.videoViewerError) {
        elements.videoViewerError.hidden = true;
      }
      setStatus('Video ready.', true);
    } else if (elements.videoViewerError) {
      elements.videoViewerError.textContent = 'Unable to load this video.';
      elements.videoViewerError.hidden = false;
      setStatus('Unable to load video preview.', false);
    }
  } catch (error) {
    if (state.videoPreviewToken !== requestToken) {
      return;
    }
  // Debug prints removed
    if (elements.videoViewerError) {
      elements.videoViewerError.textContent = 'Unable to load this video.';
      elements.videoViewerError.hidden = false;
    }
    setStatus('Unable to load video preview.', false);
  }
};

const renderHtmlPreview = async (note) => {
  if (!note || note.type !== 'html' || !elements.htmlViewer) {
    return;
  }

  state.htmlPreviewToken = Symbol('htmlPreview');
  const requestToken = state.htmlPreviewToken;

  if (elements.htmlViewerError) {
    elements.htmlViewerError.hidden = true;
  }

  const rawSrc = note.absolutePath ?? note.storedPath ?? '';
  if (!rawSrc) {
    if (elements.htmlViewerError) {
      elements.htmlViewerError.textContent = 'This HTML file does not have a readable path.';
      elements.htmlViewerError.hidden = false;
    }
    return;
  }

  try {
    const payload = {
      src: rawSrc,
      notePath: note.absolutePath ?? null,
      folderPath: note.folderPath ?? state.currentFolder ?? null
    };
    const result = await window.api.resolveResource(payload);
    if (state.htmlPreviewToken !== requestToken) {
      return;
    }

    const value = result?.value ?? null;
    if (value && elements.htmlViewerFrame) {
      elements.htmlViewerFrame.src = value;
      if (elements.htmlViewerError) {
        elements.htmlViewerError.hidden = true;
      }
      setStatus('HTML ready.', true);
    } else if (elements.htmlViewerError) {
      elements.htmlViewerError.textContent = 'Unable to load this HTML file.';
      elements.htmlViewerError.hidden = false;
      setStatus('Unable to load HTML preview.', false);
    }
  } catch (error) {
    if (state.htmlPreviewToken !== requestToken) {
      return;
    }
  // Debug prints removed
    if (elements.htmlViewerError) {
      elements.htmlViewerError.textContent = 'Unable to load this HTML file.';
      elements.htmlViewerError.hidden = false;
    }
    setStatus('Unable to load HTML preview.', false);
  }
};

const extractBlockHtmlForEmbed = (note, blockId, context) => {
  if (!note || note.type !== 'markdown' || !blockId) {
    return null;
  }

  try {
    const visited = new Set(context?.visited ?? []);
    visited.add(note.id);
    const { html } = renderMarkdownToHtml(
      note.content ?? '',
      {
        noteId: note.id,
        depth: context?.depth ?? 0,
        visited
      }
    );
    const template = document.createElement('template');
    template.innerHTML = html;
    const anchor = template.content.querySelector(`[data-block-id="${blockId}"]`);
    if (!anchor) {
      return null;
    }
    const target = findBlockHighlightTarget(anchor);
    if (!target) {
      return null;
    }
    return target.outerHTML;
  } catch (error) {
  // Debug prints removed
    return null;
  }
};

const updateFileMetadataUI = (note, options = {}) => {
  if (!elements.fileName || !elements.filePath) {
    return;
  }

  if (state.renamingNoteId && (!note || state.renamingNoteId !== note.id)) {
    closeRenameFileForm(false);
  }

  const renameEnabled = canRenameNote(note);
  if (elements.fileName) {
    elements.fileName.classList.toggle('workspace__filename--editable', renameEnabled);
    elements.fileName.setAttribute('tabindex', renameEnabled ? '0' : '-1');
    elements.fileName.dataset.renameEnabled = renameEnabled ? 'true' : 'false';
    elements.fileName.title = renameEnabled ? 'Double-click or press Enter to rename this file.' : '';
    if (!state.renamingNoteId) {
      elements.fileName.hidden = false;
      elements.fileName.setAttribute('aria-hidden', 'false');
    }
  }

  // Prefer the active pane's note when showing metadata.
  // If caller passed an explicit note but it doesn't match the active pane's note,
  // prefer the pane's note so the title/path reflect what the preview/editor shows.
  const activePane = state.activeEditorPane || resolvePaneFallback(true);
  const paneNoteId = state.editorPanes?.[activePane]?.noteId;
  const paneNote = paneNoteId ? state.notes.get(paneNoteId) ?? null : null;
  if (!note && paneNote) {
    note = paneNote;
  } else if (note && paneNote && note.id !== paneNote.id) {
    // Caller provided a different note (likely from legacy single-active-note flows).
    // We prefer showing the active pane's note in the title/path UI.
    note = paneNote;
  }

  // If we still don't have a note to show, optionally fall back to the
  // global active note. This fallback is useful for startup/legacy flows
  // where the active note is set but per-pane mappings are not yet populated
  // but is undesirable when the user explicitly activated an empty pane.
  const allowActiveFallback = options.allowActiveFallback !== false;
  if (allowActiveFallback && !note && state.activeNoteId) {
    note = state.notes.get(state.activeNoteId) ?? null;
  }

  if (!note) {
    elements.fileName.textContent = 'No file selected';
    elements.filePath.textContent = 'Open a folder and select a file to get started.';
    elements.filePath.title = '';
    return;
  }

  const descriptor = note.language ? `${note.title} · ${note.language.toUpperCase()}` : note.title;
  elements.fileName.textContent = descriptor;
  const location = note.absolutePath ?? note.folderPath ?? note.storedPath ?? '';
  
  // Format the path with the filename styled differently
  if (location) {
    const pathParts = location.split(/[/\\]/);
    const filename = pathParts.pop();
    const directory = pathParts.join('/');
    
    if (elements.filePath) {
      try {
        const showNameOnly = localStorage.getItem(storageKeys.showFileNameOnly) === 'true';
        if (showNameOnly) {
          elements.filePath.innerHTML = `<span class="filename">${filename}</span>`;
        } else {
          elements.filePath.innerHTML = directory ? 
            `${directory}/<span class="filename">${filename}</span>` : 
            `<span class="filename">${filename}</span>`;
        }
      } catch (e) { }
    }
  } else {
    elements.filePath.textContent = 'Stored inside the application library.';
  }
  elements.filePath.title = location;
};

// Update visual state of editor panes (badges and active class)
const updateEditorPaneVisuals = () => {
  const leftPane = document.querySelector('.editor-pane--left');
  const rightPane = document.querySelector('.editor-pane--right');
  if (leftPane) {
    leftPane.classList.toggle('active', state.activeEditorPane === 'left');
    leftPane.hidden = false; // left pane always visible
  }
  if (rightPane) {
    // Hide right pane if it has no assigned note OR if the user has chosen
    // to collapse the split editor. Respect persisted split-visible flag.
    const hasRight = Boolean(state.editorPanes?.right?.noteId);
    const persisted = localStorage.getItem(storageKeys.editorSplitVisible);
    const splitVisible = persisted === null ? true : persisted === 'true';
  // Debug prints removed
  rightPane.hidden = !(hasRight && splitVisible);
  try { rightPane.style.display = rightPane.hidden ? 'none' : ''; } catch (e) {}
  // Debug prints removed
    rightPane.classList.toggle('active', state.activeEditorPane === 'right');
  }

  // Dynamic panes (created at runtime) also need their active state updated.
  try {
    const dynamicPanes = Array.from(document.querySelectorAll('.editor-pane--dynamic'));
    dynamicPanes.forEach((el) => {
      try {
        const pid = el.getAttribute('data-pane-id') || null;
        el.classList.toggle('active', pid && state.activeEditorPane === pid);
      } catch (e) { /* ignore per-pane errors */ }
    });
  } catch (e) { /* ignore */ }
};

const updateActionAvailability = (note) => {
  if (elements.insertCodeBlockButton) {
    const enabled = Boolean(note && note.type === 'markdown');
    elements.insertCodeBlockButton.disabled = !enabled;
  }

  if (elements.createFileButton) {
    elements.createFileButton.disabled = !state.currentFolder;
  }

  if (elements.exportPreviewButton) {
    const canExport = Boolean(note && (note.type === 'markdown' || note.type === 'latex'));
    elements.exportPreviewButton.disabled = !canExport;
  }

  if (elements.exportPreviewHtmlButton) {
    const canExport = Boolean(note && (note.type === 'markdown' || note.type === 'latex'));
    elements.exportPreviewHtmlButton.disabled = !canExport;
  }

  // Update export dropdown
  if (elements.exportDropdownButton) {
    const canExport = Boolean(note && (note.type === 'markdown' || note.type === 'latex'));
    elements.exportDropdownButton.disabled = !canExport;
    if (!canExport) {
      closeExportDropdown(); // Close dropdown if export becomes unavailable
    }
  }
};

const computeEditorSearchMatches = (text, query) => {
  if (typeof text !== 'string' || typeof query !== 'string') {
    return [];
  }

  if (!query.length) {
    return [];
  }

  const pattern = escapeRegExp(query);

  try {
    const regex = new RegExp(pattern, 'giu');
    const matches = [];
    let result = regex.exec(text);

    while (result) {
      const matchText = result[0] ?? '';
      const start = result.index ?? 0;
      const end = start + matchText.length;

      if (end > start) {
        matches.push({ start, end });
      }

      if (matchText.length === 0) {
        regex.lastIndex += 1;
      }

      result = regex.exec(text);
    }

    return matches;
  } catch (error) {
  // Debug prints removed
    return [];
  }
};

const updateEditorSearchCount = () => {
  if (!elements.editorSearchCount) {
    return;
  }

  const matches = Array.isArray(state.search.matches) ? state.search.matches : [];
  const total = matches.length;
  const current = total > 0 && Number.isInteger(state.search.activeIndex) && state.search.activeIndex >= 0
    ? state.search.activeIndex + 1
    : 0;

  elements.editorSearchCount.textContent = `${current} / ${total}`;
};

const syncEditorSearchHighlightMetrics = () => {
  const edt = getActiveEditorInstance();
  const textarea = edt?.el ?? null;
  const container = elements.editorSearchHighlights;
  const contentEl = elements.editorSearchHighlightsContent;

  if (!textarea || !container || !contentEl) {
    return;
  }

  const style = window.getComputedStyle(textarea);

  const properties = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'lineHeight',
    'letterSpacing',
    'textTransform',
    'textDecoration',
    'textAlign',
    'wordSpacing',
    'textIndent',
    'direction',
    'writingMode'
  ];

  properties.forEach((prop) => {
    container.style[prop] = style[prop];
    contentEl.style[prop] = style[prop];
  });

  const whiteSpace = style.whiteSpace || 'pre-wrap';
  container.style.whiteSpace = whiteSpace;
  contentEl.style.whiteSpace = whiteSpace;

  const wordBreak = style.wordBreak || 'normal';
  container.style.wordBreak = wordBreak;
  contentEl.style.wordBreak = wordBreak;

  const tabSize = style.getPropertyValue('tab-size');
  if (tabSize) {
    container.style.setProperty('tab-size', tabSize);
    contentEl.style.setProperty('tab-size', tabSize);
  }

  const paddingProperties = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
  paddingProperties.forEach((prop) => {
    container.style[prop] = style[prop];
  });

  const radiusProperties = [
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius'
  ];

  radiusProperties.forEach((prop) => {
    container.style[prop] = style[prop];
  });

  const boxSizing = style.boxSizing || 'border-box';
  container.style.boxSizing = boxSizing;
  contentEl.style.boxSizing = boxSizing;

  const offsetTop = Number.isFinite(textarea.offsetTop) ? textarea.offsetTop : 0;
  const offsetLeft = Number.isFinite(textarea.offsetLeft) ? textarea.offsetLeft : 0;
  const clientWidth = Number.isFinite(textarea.clientWidth) ? textarea.clientWidth : textarea.offsetWidth;
  const clientHeight = Number.isFinite(textarea.clientHeight) ? textarea.clientHeight : textarea.offsetHeight;

  container.style.top = `${offsetTop}px`;
  container.style.left = `${offsetLeft}px`;
  container.style.width = `${clientWidth}px`;
  container.style.height = `${clientHeight}px`;
  container.style.right = 'auto';
  container.style.bottom = 'auto';
};

const syncEditorSearchHighlightScroll = () => {
  if (!state.search.open) {
    return;
  }

  const edt = getActiveEditorInstance();
  const textarea = edt?.el ?? null;
  const contentEl = elements.editorSearchHighlightsContent;

  if (!textarea || !contentEl) {
    return;
  }

  const scrollTop = textarea.scrollTop ?? 0;
  const scrollLeft = textarea.scrollLeft ?? 0;
  contentEl.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
};

const handleEditorSearchResize = () => {
  syncEditorSearchHighlightMetrics();
  renderEditorSearchHighlights();
  syncEditorSearchHighlightScroll();
};

const renderEditorSearchHighlights = () => {
  const container = elements.editorSearchHighlights;
  const contentEl = elements.editorSearchHighlightsContent;
  const edt = getActiveEditorInstance();
  const textarea = edt?.el ?? null;

  if (!container || !contentEl || !textarea) {
    return;
  }

  syncEditorSearchHighlightMetrics();

  const text = typeof textarea.value === 'string' ? textarea.value : '';
  const matches = state.search.open && Array.isArray(state.search.matches) ? state.search.matches : [];
  const shouldHide = !state.search.open || !matches.length || !state.search.query;

  if (shouldHide) {
    if (!container.hidden) {
      container.hidden = true;
      container.setAttribute('aria-hidden', 'true');
    }
    contentEl.innerHTML = '';
    return;
  }

  // Update container position to account for textarea scroll
  const scrollTop = textarea.scrollTop ?? 0;
  const scrollLeft = textarea.scrollLeft ?? 0;
  contentEl.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;

  const style = window.getComputedStyle(textarea);
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(style.paddingRight) || 0;
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  const contentWidthTotal = Math.max(0, (textarea.clientWidth || textarea.offsetWidth || 0) - paddingLeft - paddingRight);
  const rawLineHeight = Number.parseFloat(style.lineHeight);
  const fontSize = Number.parseFloat(style.fontSize) || 16;
  const lineHeight = Number.isFinite(rawLineHeight) && rawLineHeight > 0 ? rawLineHeight : fontSize;

  contentEl.innerHTML = '';

  const textLength = text.length;

  matches.forEach((match, matchIndex) => {
    if (!match) {
      return;
    }

    const startBound = clamp(Number.isFinite(match.start) ? match.start : 0, 0, textLength);
    const endBound = clamp(Number.isFinite(match.end) ? match.end : startBound, startBound, textLength);

    if (endBound <= startBound) {
      return;
    }

    const matchText = text.slice(startBound, endBound);
    const segments = matchText.split('\n');
    let segmentStart = startBound;

    segments.forEach((segment, segmentIndex) => {
      const isLastSegment = segmentIndex === segments.length - 1;
      const lineStart = segmentStart;
      const lineEnd = lineStart + segment.length;

      if (segment.length === 0) {
        segmentStart = isLastSegment ? lineEnd : lineEnd + 1;
        return;
      }

      const startCoords = getTextareaCaretCoordinates(textarea, lineStart);
      const endCoords = getTextareaCaretCoordinates(textarea, lineEnd);

      const block = document.createElement('div');
      block.className = 'editor-search-highlight';
      if (matchIndex === state.search.activeIndex) {
        block.classList.add('active');
      }

      const rawLeft = Number.isFinite(startCoords.left) ? startCoords.left : paddingLeft;
      const left = Math.max(0, rawLeft - paddingLeft);
      const remainingWidth = Math.max(0, contentWidthTotal - left);

      let width = Number.isFinite(endCoords.left)
        ? endCoords.left - paddingLeft - left
        : Number.NaN;

      if (!Number.isFinite(width) || width < 1) {
        const measured = measureTextWidth(segment, style);
        width = Number.isFinite(measured) && measured > 0 ? measured : lineHeight * 0.75;
      }

      width = clamp(width, 1, remainingWidth || width || 1);

      const rawTop = Number.isFinite(startCoords.top) ? startCoords.top : paddingTop;
      const top = Math.max(0, rawTop - paddingTop);

      block.style.top = `${top}px`;
      block.style.left = `${left}px`;
      block.style.width = `${width}px`;
      block.style.height = `${lineHeight}px`;

      contentEl.appendChild(block);

      segmentStart = isLastSegment ? lineEnd : lineEnd + 1;
    });
  });

  if (contentEl.childElementCount > 0) {
    container.hidden = false;
    container.setAttribute('aria-hidden', 'false');
  } else if (!container.hidden) {
    container.hidden = true;
    container.setAttribute('aria-hidden', 'true');
  }
};

const highlightEditorSearchMatch = (index, options = {}) => {
  const matches = Array.isArray(state.search.matches) ? state.search.matches : [];
  const edt = getActiveEditorInstance();
  const textarea = edt?.el ?? null;

  if (!textarea || !matches.length) {
    state.search.activeIndex = matches.length ? clamp(Number(index) || 0, 0, matches.length - 1) : -1;
    updateEditorSearchCount();
    renderEditorSearchHighlights();
    return false;
  }

  const candidateIndex = Number.isFinite(index) ? Math.trunc(index) : (state.search.activeIndex ?? 0);
  const safeIndex = clamp(candidateIndex, 0, matches.length - 1);
  const match = matches[safeIndex];

  if (!match) {
    state.search.activeIndex = matches.length ? clamp(safeIndex, 0, matches.length - 1) : -1;
    updateEditorSearchCount();
    renderEditorSearchHighlights();
    return false;
  }

  state.search.activeIndex = safeIndex;
  state.search.lastCaret = match.start;

  const shouldFocusEditor = Boolean(options.focusEditor);

  window.requestAnimationFrame(() => {
    try { const edt = getActiveEditorInstance(); edt.setSelectionRange(match.start, match.end); } catch (error) { try { textarea.setSelectionRange(match.start, match.end); } catch (e) { /* ignore */ } }

    if (shouldFocusEditor && !textarea.disabled) {
      try { getActiveEditorInstance().focus({ preventScroll: true }); } catch (error) { try { textarea.focus({ preventScroll: true }); } catch (e) { textarea.focus(); } }
    }

    ensureEditorSelectionVisible(getEditorInstanceForElement(textarea)?.el ?? textarea, match.start);
    state.search.lastCaret = (getEditorInstanceForElement(textarea)?.el?.selectionStart ?? textarea.selectionStart) ?? match.start;
  });

  updateEditorSearchCount();
  renderEditorSearchHighlights();
  return true;
};

const updateEditorSearchMatches = (options = {}) => {
  if (!state.search.open) {
    renderEditorSearchHighlights();
    return;
  }

  const edt = getActiveEditorInstance();
  const textarea = edt?.el ?? null;
  const query = state.search.query ?? '';
  const content = typeof textarea?.value === 'string' ? textarea.value : '';

  if (Number.isFinite(options.caret)) {
    state.search.lastCaret = options.caret;
  }

  const matches = computeEditorSearchMatches(content, query);
  const previousMatches = Array.isArray(state.search.matches) ? state.search.matches : [];
  const previousActiveIndex = state.search.activeIndex ?? -1;
  const previousActiveStart =
    previousActiveIndex >= 0 && previousActiveIndex < previousMatches.length
      ? previousMatches[previousActiveIndex].start
      : null;

  state.search.matches = matches;

  let nextIndex = -1;

  if (matches.length) {
    const preserveActive = Boolean(options.preserveActive);
    const caret = Number.isFinite(options.caret) ? options.caret : null;

    if (preserveActive && previousActiveStart !== null) {
      const sameIndex = matches.findIndex((match) => match.start === previousActiveStart);
      if (sameIndex !== -1) {
        nextIndex = sameIndex;
      }
    }

    if (nextIndex === -1 && caret !== null) {
      const caretIndex = matches.findIndex((match) => match.start >= caret);
      nextIndex = caretIndex !== -1 ? caretIndex : 0;
    }

    if (nextIndex === -1 && preserveActive && previousActiveIndex >= 0 && previousActiveIndex < matches.length) {
      nextIndex = previousActiveIndex;
    }

    if (nextIndex === -1) {
      nextIndex = 0;
    }
  }

  state.search.activeIndex = nextIndex;
  updateEditorSearchCount();

  const autoselect = options.autoselect ?? true;
  if (autoselect && nextIndex >= 0) {
    highlightEditorSearchMatch(nextIndex, { focusEditor: Boolean(options.focusEditor) });
  }

  renderEditorSearchHighlights();
};

const openEditorSearch = (options = {}) => {
  const note = getActiveNote();
  if (!note || note.type !== 'markdown') {
    setStatus('Search is only available in Markdown notes.', false);
    return;
  }

  if (!elements.editorSearch || !elements.editorSearchInput) {
    return;
  }

  const focusInput = options.focusInput !== false;
  const useSelection = options.useSelection !== false;

  state.search.open = true;

  elements.editorSearch.hidden = false;
  elements.editorSearch.setAttribute('aria-hidden', 'false');

  const edt = getActiveEditorInstance();
  const textarea = edt?.el ?? null;
  const selectionStart = textarea?.selectionStart ?? 0;
  const selectionEnd = textarea?.selectionEnd ?? selectionStart;
  const hasSelection = Boolean(useSelection && textarea && selectionEnd > selectionStart);

  let query = typeof options.presetQuery === 'string' ? options.presetQuery : '';
  if (!query && hasSelection) {
    query = textarea.value.slice(selectionStart, selectionEnd);
  }
  if (!query) {
    query = state.search.query ?? '';
  }

  state.search.query = query;
  state.search.lastCaret = hasSelection ? selectionStart : state.search.lastCaret ?? selectionStart;

  elements.editorSearchInput.value = query;

  updateEditorSearchMatches({
    preserveActive: Boolean(options.preserveMatches),
    caret: hasSelection ? selectionStart : state.search.lastCaret,
    focusEditor: false
  });

  if (focusInput) {
    window.requestAnimationFrame(() => {
      elements.editorSearchInput.focus({ preventScroll: true });
      if (query) {
        elements.editorSearchInput.select();
      }
    });
  }
};

const closeEditorSearch = (restoreFocus = true, options = {}) => {
  const wasOpen = state.search.open;
  state.search.open = false;
  state.search.matches = [];
  state.search.activeIndex = -1;

  if (options.clearQuery) {
    state.search.query = '';
  }

  if (elements.editorSearch) {
    elements.editorSearch.hidden = true;
    elements.editorSearch.setAttribute('aria-hidden', 'true');
  }

  if (elements.editorSearchInput && options.clearQuery) {
    elements.editorSearchInput.value = '';
  }

  updateEditorSearchCount();
  renderEditorSearchHighlights();

  if (restoreFocus && wasOpen) {
    const edt = getActiveEditorInstance();
    const ta = edt?.el;
    if (ta && !ta.disabled) {
      window.requestAnimationFrame(() => {
        try {
          ta.focus({ preventScroll: true });
        } catch (error) {
          ta.focus();
        }
      });
    }
  }
};

const moveEditorSearch = (direction, options = {}) => {
  const normalizedDirection = direction < 0 ? -1 : 1;

  if (!state.search.open) {
    if (!state.search.query) {
      openEditorSearch({ focusInput: true, useSelection: true });
    } else {
      openEditorSearch({ focusInput: false, useSelection: false, preserveMatches: true });
    }
  }

  if (!state.search.open) {
    return;
  }

  const matches = Array.isArray(state.search.matches) ? state.search.matches : [];
  if (!matches.length) {
    updateEditorSearchCount();
    return;
  }

  const total = matches.length;
  const currentIndex = Number.isInteger(state.search.activeIndex) ? state.search.activeIndex : -1;

  let nextIndex = currentIndex + normalizedDirection;
  if (currentIndex === -1) {
    nextIndex = normalizedDirection > 0 ? 0 : total - 1;
  } else if (nextIndex < 0) {
    nextIndex = total - 1;
  } else if (nextIndex >= total) {
    nextIndex = 0;
  }

  highlightEditorSearchMatch(nextIndex, { focusEditor: Boolean(options.focusEditor) });
};

const handleEditorSearchInput = (event) => {
  if (!state.search.open) {
    return;
  }
  const value = typeof event.target.value === 'string' ? event.target.value : '';
  state.search.query = value;
  updateEditorSearchMatches({
    preserveActive: false,
  caret: state.search.lastCaret ?? (getActiveEditorInstance()?.selectionStart ?? 0),
    focusEditor: false
  });
};

const handleEditorSearchKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    moveEditorSearch(event.shiftKey ? -1 : 1, { focusEditor: false });
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeEditorSearch(true);
  }
};

const handleEditorSearchPrev = (event) => {
  event.preventDefault();
  moveEditorSearch(-1, { focusEditor: false });
};

const handleEditorSearchNext = (event) => {
  event.preventDefault();
  moveEditorSearch(1, { focusEditor: false });
};

const handleEditorSearchClose = (event) => {
  event.preventDefault();
  closeEditorSearch(true);
};

const openNoteById = (noteId, silent = false, blockId = null, pane = null) => {
  if (!noteId || !state.notes.has(noteId)) {
    if (!silent) {
      setStatus('Linked note not found.', false);
    }
    return;
  }

  const note = state.notes.get(noteId);
  const title = note.title || 'Untitled';

  // Check if tab already exists
  let existingTab = state.tabs.find(tab => tab.noteId === noteId);
  if (existingTab) {
    setActiveTab(existingTab.id);
    if (blockId) {
      state.pendingBlockFocus = { noteId, blockId };
    }
    return;
  }

  // Create new tab
  const tab = createTab(noteId, title);
  // If a pane is specified and exists, make it the active pane before activating the tab
  if (pane && editorInstances[pane]) {
    setActiveEditorPane(pane);
  }
  setActiveTab(tab.id);

  openNoteInPane(noteId, pane || resolvePaneFallback(true));

  if (blockId) {
    state.pendingBlockFocus = { noteId, blockId };
  }

  renderTabs();

  if (!silent) {
    const message = blockId ? `Opened ${title} at ^${blockId}.` : `Opened ${title}.`;
    setStatus(message, true);
  }
  // Update pane visuals and file metadata
  updateEditorPaneVisuals();
  updateFileMetadataUI(null);
};

const renderActiveNote = () => {
  // Debug: record renderActiveNote invocation and current active/editor pane
  try { if (window.api && typeof window.api.writeDebugLog === 'function') window.api.writeDebugLog({ event: 'renderActiveNote:start', activeNoteId: state.activeNoteId, activeEditorPane: state.activeEditorPane, timestamp: Date.now() }); } catch (e) { }
  // Prefer the global active note if set, but fall back to the note
  // assigned to the currently active editor pane. This avoids a scenario
  // where a manual "render" triggered from a pane clears that pane
  // because `state.activeNoteId` is unset (for example when a PDF was
  // previously active in the global preview).
  let note = getActiveNote();
  if (!note) {
    const paneNoteId = getPaneNoteId(state.activeEditorPane) || null;
    if (paneNoteId) note = state.notes.get(paneNoteId) ?? null;
  }
  // Prefer showing a renderable note (markdown/latex/bib/notebook/code).
  // If the currently resolved note is not renderable, fall back to the
  // last recorded renderable note so the global preview shows the most
  // recent editor that could be rendered.
  const renderableTypes = new Set(['markdown', 'latex', 'bib', 'notebook', 'code']);
  try {
    if (!note || !renderableTypes.has(note.type)) {
      const fallbackId = state.lastRenderableNoteId || state.lastActiveMarkdownNoteId || null;
      if (fallbackId && state.notes.has(fallbackId)) {
        const fb = state.notes.get(fallbackId);
        if (fb && renderableTypes.has(fb.type)) {
          note = fb;
          // reflect selection in activeNoteId so downstream logic knows what's rendered
          state.activeNoteId = fb.id;
        }
      }
    }

    // Only avoid global rendering for non-renderable notes that are already
    // shown inside another pane. Renderable notes should be allowed to be
    // displayed in the global preview even if they're still mapped to a pane.
    const mappedPane = note ? getPaneForNote(note.id) : null;
    if (note && mappedPane && mappedPane !== state.activeEditorPane && !renderableTypes.has(note.type)) {
      // Clear any global viewers to avoid duplicates and return early
      try {
        if (elements.imageViewer) { elements.imageViewer.classList.remove('visible'); elements.imageViewerImg?.removeAttribute('src'); }
      } catch (e) {}
      try { if (elements.pdfViewer) { elements.pdfViewer.classList.remove('visible'); elements.pdfViewer.removeAttribute('src'); } } catch (e) {}
      try { if (elements.codeViewer) { elements.codeViewer.classList.remove('visible'); elements.codeViewer.removeAttribute('data-language'); } } catch (e) {}
      return;
    }
  } catch (e) { /* ignore mapping/fallback errors */ }
  updateFileMetadataUI(note);
  updateActionAvailability(note);
  closeWikiSuggestions();
  closeHashtagSuggestions();
  closeFileSuggestions();

  // Disable math overlay when switching files to prevent display issues
  if (window.disableMathOverlay) {
    window.disableMathOverlay();
  }

  if (!note || note.type !== 'markdown') {
    closeCodePopover(false);
  }

  const resetPreviewState = () => {
    elements.workspaceContent?.classList.remove('pdf-mode', 'code-mode', 'notebook-mode', 'image-mode', 'video-mode', 'html-mode');
  if (elements.preview) { try { elements.preview.innerHTML = ''; } catch (e) { } }
    // Hide math preview popup
    if (elements.mathPreviewPopup) {
      elements.mathPreviewPopup.classList.remove('visible');
      elements.mathPreviewPopup.hidden = true;
    }
    elements.pdfViewer?.classList.remove('visible');
    elements.pdfViewer?.removeAttribute('src');
    elements.codeViewer?.classList.remove('visible');
    elements.codeViewer?.removeAttribute('data-language');
    if (elements.codeViewerCode) {
      elements.codeViewerCode.textContent = '';
    } else if (elements.codeViewer) {
      elements.codeViewer.textContent = '';
    }
    if (elements.imageViewerImg) {
      elements.imageViewerImg.removeAttribute('src');
      elements.imageViewerImg.removeAttribute('data-note-id');
      elements.imageViewerImg.removeAttribute('data-raw-src');
      elements.imageViewerImg.alt = '';
    }
    if (elements.imageViewerCaption) {
      elements.imageViewerCaption.textContent = '';
    }
    if (elements.imageViewerError) {
      elements.imageViewerError.textContent = 'Unable to load this image.';
      elements.imageViewerError.hidden = true;
    }
    state.imagePreviewToken = null;
    
    if (elements.videoViewerVideo) {
      elements.videoViewerVideo.removeAttribute('src');
      elements.videoViewerVideo.removeAttribute('data-note-id');
      elements.videoViewerVideo.removeAttribute('data-raw-src');
    }
    if (elements.videoViewerCaption) {
      elements.videoViewerCaption.textContent = '';
    }
    if (elements.videoViewerError) {
      elements.videoViewerError.textContent = 'Unable to load this video.';
      elements.videoViewerError.hidden = true;
    }
    state.videoPreviewToken = null;
    
    if (elements.htmlViewerFrame) {
      elements.htmlViewerFrame.removeAttribute('src');
    }
    if (elements.htmlViewerError) {
      elements.htmlViewerError.textContent = 'Unable to load this HTML file.';
      elements.htmlViewerError.hidden = true;
    }
    state.htmlPreviewToken = null;
    // Remove any per-pane PDF viewers that are no longer mapped to PDFs.
    // This avoids clearing viewers in other panes when the user opens a
    // different file in a separate pane (e.g., dropping an MD into pane B
    // should not blank a PDF that's intentionally displayed in pane A).
    try {
      for (const pid of Object.keys(state.editorPanes || {})) {
        try {
          const mappedNoteId = state.editorPanes?.[pid]?.noteId;
          const mappedNote = mappedNoteId ? state.notes.get(mappedNoteId) : null;
          // Only clear viewers for panes that no longer have any mapped note.
          // This avoids removing intentionally displayed pane-local viewers
          // (images, PDFs, videos, etc.) when the active preview changes.
          if (!mappedNote) {
            try { clearPaneViewer(pid); } catch (e) {}
          }
        } catch (e) { /* ignore per-pane errors */ }
      }
    } catch (e) { /* ignore */ }
  };

  if (!note) {
    const edt = getActiveEditorInstance();
    const ta = edt?.el ?? null;
    if (ta) { ta.value = ''; ta.disabled = true; }
    resetPreviewState();
    closeEditorSearch(false);
    syncHashtagDetailSelection();
    return;
  }

  resetPreviewState();

  if (note.type === 'markdown' || note.type === 'latex') {
    // Determine which pane this note is opened in (search all panes, default to left)
    let paneForNote = 'left';
    try {
      if (state.editorPanes && typeof state.editorPanes === 'object') {
        for (const key of Object.keys(state.editorPanes)) {
          try {
            if (state.editorPanes[key] && state.editorPanes[key].noteId === note.id) {
              paneForNote = key;
              break;
            }
          } catch (e) { /* ignore per-key errors */ }
        }
      }
    } catch (e) {
      paneForNote = (state.editorPanes && state.editorPanes.left && state.editorPanes.left.noteId === note.id) ? 'left' : 'left';
    }

    // Populate all editor textareas that have this note assigned. This allows
    // the same note to be open in multiple panes (e.g., left + a dynamic pane)
    // and each pane will display the note content independently.
    try {
      const paneKeys = Array.isArray(Object.keys(state.editorPanes)) ? Object.keys(state.editorPanes) : [];
      let anyRenderedPreview = false;
      for (const k of paneKeys) {
        try {
          const paneInfo = state.editorPanes[k];
          if (paneInfo && paneInfo.noteId === note.id) {
            const inst = editorInstances[k];
            if (inst && inst.el) {
              inst.el.disabled = false;
              inst.el.value = note.content ?? '';
            }
            if (state.activeEditorPane === k) {
              // Render preview only for the active pane
              if (note.type === 'latex') {
                renderLatexPreview(note.content ?? '', note.id);
              } else if (note.type === 'bib') {
                renderBibPreview(note.content ?? '', note.id);
              } else {
                renderMarkdownPreview(note.content ?? '', note.id);
              }
              anyRenderedPreview = true;
            }
          }
        } catch (e) { /* per-pane error ignored */ }
      }
      // If none of the panes explicitly mapped to this note is currently active,
      // fall back to rendering preview for the first matching pane (preserve old behavior)
      if (!anyRenderedPreview) {
        const firstMatch = paneKeys.find((pk) => state.editorPanes[pk] && state.editorPanes[pk].noteId === note.id);
        if (firstMatch && state.activeEditorPane !== firstMatch) {
          // Only render preview if active pane matches; otherwise leave preview untouched
          // (this keeps preview consistent with the currently active pane)
        }
      }
    } catch (e) {
      // Fallback: preserve previous single-pane behavior
      const targetInstance = editorInstances[paneForNote] ?? getActiveEditorInstance();
      if (targetInstance && targetInstance.el) { targetInstance.el.disabled = false; targetInstance.el.value = note.content ?? ''; }
      if (state.activeEditorPane === paneForNote) {
        if (note.type === 'latex') {
          renderLatexPreview(note.content ?? '', note.id);
        } else {
          renderMarkdownPreview(note.content ?? '', note.id);
        }
      }
    }

    if (state.search.open) {
      const activeEdt = getActiveEditorInstance();
      const caret = activeEdt?.el?.selectionStart ?? 0;
      state.search.lastCaret = caret;
      updateEditorSearchMatches({ preserveActive: false, caret, focusEditor: false });
    } else {
      updateEditorSearchCount();
    }

  if (state.pendingHashtagFocus && state.pendingHashtagFocus.noteId === note.id) {
      const { start, end } = state.pendingHashtagFocus;
      state.pendingHashtagFocus = null;
      if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
        window.requestAnimationFrame(() => {
          highlightEditorRange(start, end);
        });
      }
    }
  } else {
    // For non-markdown notes we should NOT clear other panes' editor contents.
    // Each pane can hold a different file type. Only the pane that has this
    // note assigned (or the active pane) should be used to render the file.
    // Disable the textarea for panes that are non-markdown or not mapped to this note.
    try {
      for (const [k, inst] of Object.entries(editorInstances)) {
        try {
          const mappedNoteId = state.editorPanes?.[k]?.noteId;
          const mappedNote = mappedNoteId ? state.notes.get(mappedNoteId) : null;
          if (mappedNote && (mappedNote.type === 'markdown' || mappedNote.type === 'latex' || mappedNote.type === 'code')) {
            // For code files, always enable and show the editor
            if (inst && inst.el) {
              inst.el.disabled = false;
              inst.el.hidden = false;
              inst.el.style.display = '';
              // content is set elsewhere when the note is opened; do not overwrite
            }
          } else if (mappedNote && (mappedNote.type !== 'markdown' && mappedNote.type !== 'latex' && mappedNote.type !== 'code')) {
            // non-editable pane types (images/pdf/video/html/pptx): show content in read-only textarea
            if (inst && inst.el) {
              inst.el.disabled = true;
              inst.el.value = mappedNote.content ?? '';
            }
          } else {
            // no mapped note for this pane: keep textarea disabled and empty
            if (inst && inst.el) {
              inst.el.disabled = true;
              inst.el.value = '';
            }
          }
        } catch (e) { /* per-instance ignore */ }
      }
    } catch (e) { /* ignore full loop errors */ }

    if (note.type === 'image' || note.type === 'video' || note.type === 'html' || note.type === 'pdf' || note.type === 'pptx') {
      // These media/file types are displayed in pane-local viewers. To avoid
      // duplicate global viewers and the UI 'taking over', we keep the global
      // preview minimal and instruct users to open the file in an editor pane.
      elements.workspaceContent?.classList.add(note.type === 'image' ? 'image-mode' : note.type === 'video' ? 'video-mode' : note.type === 'html' ? 'html-mode' : note.type === 'pdf' ? 'pdf-mode' : 'pptx-mode');
      const message = note.type === 'pptx'
        ? 'PPTX files are not supported for preview. Open in an editor pane.'
        : 'This file type is previewed inside the editor pane. Open the file in a pane to view it.';
      renderCodePreview(message, null);
    } else if (note.type === 'code') {
      elements.workspaceContent?.classList.add('code-mode');
      renderCodePreview(note.content ?? '', note.language);
    } else if (note.type === 'code') {
      elements.workspaceContent?.classList.add('code-mode');
      renderCodePreview(note.content ?? '', note.language);
    } else if (note.type === 'notebook') {
      elements.workspaceContent?.classList.add('notebook-mode');
      renderNotebookPreview(note);
    } else if (note.type === 'latex') {
      elements.workspaceContent?.classList.add('latex-mode');
      renderLatexPreview(note.content ?? '', note.id);
    } else {
      elements.workspaceContent?.classList.add('code-mode');
      renderCodePreview('Preview not available for this file type.', null);
    }

    if (state.pendingBlockFocus && state.pendingBlockFocus.noteId === note.id) {
      setStatus('Block references are only available in Markdown notes.', false);
      state.pendingBlockFocus = null;
    }
    state.pendingHashtagFocus = null;
    closeEditorSearch(false);
  }

  syncHashtagDetailSelection();
};

const scheduleSave = () => {
  if (state.saveTimer) {
    clearTimeout(state.saveTimer);
  }
  state.saveTimer = setTimeout(async () => {
    await persistNotes();
  }, 400);
};

const persistNotes = async () => {
  if (state.saving) {
    return;
  }

  const dirtyNotes = Array.from(state.notes.values()).filter(
    (note) => note.type === 'markdown' && note.dirty && note.absolutePath
  );

  if (!dirtyNotes.length) {
    return;
  }

  state.saving = true;
  setStatus('Saving…', false);

  try {
    await Promise.all(
      dirtyNotes.map((note) =>
        window.api.saveExternalMarkdown({ filePath: note.absolutePath, content: note.content ?? '' })
      )
    );
    const savedAt = new Date().toISOString();
    dirtyNotes.forEach((note) => {
      note.dirty = false;
      note.updatedAt = savedAt;
    });
    setStatus('Saved.', true);
  } catch (error) {
    setStatus(getActionableErrorMessage('save', error), false);
  } finally {
    state.saving = false;
  }
};

const adoptWorkspace = (payload, preferredActiveId = null) => {
  const normalizedNotes = Array.isArray(payload.notes) ? payload.notes.map(normalizeNote) : [];
  rebuildNotesMap(normalizedNotes);
  state.tree = payload.tree ?? null;

  if (payload.folderPath) {
    const previousFolder = state.currentFolder;
    state.currentFolder = payload.folderPath;
    if (elements.workspacePath) {
      const segments = payload.folderPath.split(/[\\/]/).filter(Boolean);
      const label = segments.length ? segments[segments.length - 1] : payload.folderPath;
      elements.workspacePath.textContent = label;
      elements.workspacePath.title = payload.folderPath;
      elements.workspacePath.classList.remove('no-folder'); // Remove no-folder styling
      elements.workspaceTree?.setAttribute('aria-label', `Workspace files for ${label}`);
    }
    if (previousFolder !== payload.folderPath) {
      state.collapsedFolders.clear();
    }
    persistLastWorkspaceFolder(payload.folderPath);
  } else {
    if (elements.workspacePath) {
      elements.workspacePath.textContent = 'No folder open';
      elements.workspacePath.title = '';
      elements.workspacePath.classList.add('no-folder'); // Apply no-folder styling
    }
    persistLastWorkspaceFolder(null);
  }

  if (preferredActiveId && state.notes.has(preferredActiveId)) {
    state.activeNoteId = preferredActiveId;
    // Create tab for the active note
    const note = state.notes.get(preferredActiveId);
    const title = note.title || 'Untitled';
    const tab = createTab(preferredActiveId, title);
    state.activeTabId = tab.id;
  } else if (state.activeNoteId && state.notes.has(state.activeNoteId)) {
    // keep existing
  } else {
    state.activeNoteId = normalizedNotes[0]?.id ?? null;
    if (state.activeNoteId) {
      const note = state.notes.get(state.activeNoteId);
      const title = note.title || 'Untitled';
      const tab = createTab(state.activeNoteId, title);
      state.activeTabId = tab.id;
    }
  }

  // If no per-pane mappings exist (fresh start / legacy flows), ensure the
  // active note is assigned to the left pane so the UI (badges, dashed
  // outlines, preview mapping) reflects that the left editor contains a file.
  state.editorPanes = state.editorPanes || { left: { noteId: null }, right: { noteId: null } };
  const leftHas = Boolean(state.editorPanes.left?.noteId);
  const rightHas = Boolean(state.editorPanes.right?.noteId);
  if (!leftHas && !rightHas && state.activeNoteId) {
    state.editorPanes.left.noteId = state.activeNoteId;
  }

  renderWorkspaceTree();
  renderTabs();
  renderActiveNote();
};

// Safe wrapper around adoptWorkspace to prevent the renderer from becoming unusable
// if subhelpers (like rebuilding indexes) throw. This logs errors and tries to
// perform the minimal adopt behavior where possible.
function safeAdoptWorkspace(payload, preferredActiveId = null) {
  try {
    adoptWorkspace(payload, preferredActiveId);
  } catch (err) {
    try {
      // Minimal, dependency-free adoption: populate state.notes and some metadata
      state.currentFolder = payload?.folderPath ?? null;
      state.tree = payload?.tree ?? null;
      state.notes = new Map();
      if (Array.isArray(payload?.notes)) {
        payload.notes.forEach((n) => {
          try {
            const nn = normalizeNote(n);
            state.notes.set(nn.id, nn);
          } catch (ee) { /* ignore malformed note */ }
        });
      }
      // Pick a reasonable active note
      state.activeNoteId = payload?.preferredActiveId ?? (state.notes.size ? state.notes.keys().next().value : null);
      if (payload?.folderPath && elements.workspacePath) {
        elements.workspacePath.textContent = String(payload.folderPath).split(/[\\\/]/).filter(Boolean).pop() || String(payload.folderPath);
        elements.workspacePath.title = String(payload.folderPath);
      }
      // Development helper: auto-open the first notebook/html/json note to validate preview rendering
      try {
        if (process && process.env && process.env.NODE_ENV === 'development' && !state.__devAutoOpened) {
          state.__devAutoOpened = true;
          const firstPreviewable = Array.from(state.notes.values()).find(n => ['notebook', 'html', 'code', 'image'].includes(n.type));
          if (firstPreviewable) {
            console.log('DEV: auto-opening first previewable note for debug', { id: firstPreviewable.id, type: firstPreviewable.type, title: firstPreviewable.title });
            // Prefer opening in left pane and activate so preview updates
            try { openNoteInPane(firstPreviewable.id, 'left', { activate: true }); } catch (e) { console.error('DEV: auto-open failed', e); }
          }
        }
      } catch (e) { /* ignore dev helper errors */ }
    } catch (e) {
    }
  }
}

// second editor UI removed

const handleWorkspaceTreeClick = (event) => {
  event.preventDefault();

  const label = event.target.closest('.tree-node__label');
  if (!label) {
    return;
  }

  const nodeElement = label.parentElement;
  if (!nodeElement) {
    return;
  }

  const nodeType = nodeElement.dataset.nodeType;
  const path = nodeElement.dataset.path;

  if (nodeType === 'directory') {
    const hasChildren = nodeElement.dataset.hasChildren === 'true';
    if (!hasChildren || !path) {
      return;
    }

    if (state.collapsedFolders.has(path)) {
      state.collapsedFolders.delete(path);
    } else {
      state.collapsedFolders.add(path);
    }
    renderWorkspaceTree();
    return;
  }

  if (nodeType === 'file') {
    if (nodeElement.classList.contains('tree-node--unsupported')) {
      setStatus('Preview for this file type is not supported yet.', false);
      return;
    }

    const noteId = nodeElement.dataset.noteId;
    console.log('Workspace tree click on file', { noteId, dataset: nodeElement.dataset });

    if (!noteId) {
      console.log('No noteId on clicked node');
      return;
    }

    // If the note exists in state, open it. Prefer openNoteInPane which will
    // populate the editor textarea immediately. Fall back to openNoteById for
    // compatibility.
    const targetPane = state.activeEditorPane || resolvePaneFallback(true);
    if (state.notes.has(noteId)) {
      try {
        openNoteInPane(noteId, targetPane, { activate: true });
        return;
      } catch (e) {
        console.error('openNoteInPane failed, falling back to openNoteById', e);
      }
    }

    // Last-resort: try openNoteById (non-activating)
    try {
      openNoteById(noteId, false);
    } catch (e) {
      console.error('openNoteById failed for clicked workspace node', e);
    }
  }
};

const handleLatexAutoCompletion = (textarea, inputType) => {
  // Only trigger auto-completion on actual text insertion, not deletion
  if (inputType && inputType.startsWith('delete')) {
    return false;
  }
  
  // Prevent auto-completion if the user is typing rapidly (less than 100ms since last input)
  const now = Date.now();
  if (state.lastInputTime && (now - state.lastInputTime) < 100) {
    state.lastInputTime = now;
    return false;
  }
  state.lastInputTime = now;
  
  const value = textarea.value;
  const caret = textarea.selectionStart;
  
  // Look for \begin{environment} pattern that was just typed
  const beforeCaret = value.substring(0, caret);
  const latexBeginMatch = beforeCaret.match(/\\begin\{([^}]+)\}$/);
  
  if (latexBeginMatch) {
    const environment = latexBeginMatch[1];
    const afterCaret = value.substring(caret);
    
    // Check if there's already a corresponding \end{environment} in the text after the cursor
    const endPattern = new RegExp(`\\\\end\\{${environment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}`);
    const hasMatchingEnd = endPattern.test(afterCaret.substring(0, 500)); // Look ahead 500 chars
    
    if (!hasMatchingEnd) {
      // Check if we're already inside $$ delimiters
      const beforeText = value.substring(0, caret);
      const doubleDollarMatches = beforeText.match(/\$\$/g) || [];
      const isInsideMathBlock = doubleDollarMatches.length % 2 === 1; // Odd count means we're inside
      
      let newValue, newCaretPosition;
      
      if (isInsideMathBlock) {
        // Already inside a math block, just add the \end{} tag
        const endTag = `\n\n\\end{${environment}}`;
        newValue = value.substring(0, caret) + endTag + value.substring(caret);
        newCaretPosition = caret + 1; // Position cursor after the first newline
      } else {
        // Not inside a math block, wrap with $$ delimiters
        const beginIndex = beforeCaret.lastIndexOf(`\\begin{${environment}}`);
        const mathBlock = `$$\n\\begin{${environment}}\n\n\\end{${environment}}\n$$`;
        
        newValue = value.substring(0, beginIndex) + mathBlock + value.substring(caret);
        newCaretPosition = beginIndex + `$$\n\\begin{${environment}}\n`.length + 1; // Position cursor between begin and end
      }
      const _edt_begin = getActiveEditorInstance();
      const _ta_begin = _edt_begin?.el ?? textarea;
      if (_ta_begin) {
        // prefer Editor API when available, fallback to direct DOM mutation
        try {
          if (_edt_begin && typeof _edt_begin.setValue === 'function') _edt_begin.setValue(newValue);
          else _ta_begin.value = newValue;
        } catch (e) {
          _ta_begin.value = newValue;
        }
        try { 
          if (_edt_begin && typeof _edt_begin.setSelectionRange === 'function') _edt_begin.setSelectionRange(newCaretPosition, newCaretPosition);
          else _ta_begin.setSelectionRange(newCaretPosition, newCaretPosition);
        } catch (e) {}
      }
      
      return true; // Indicate that auto-completion was performed
    }
  }
  
  return false;
};

const updateMathPreview = async (textarea) => {
  // Accept either a DOM textarea element, an Editor instance, or undefined.
  try {
    // If an Editor instance was passed, use its underlying element
    if (textarea && typeof textarea === 'object' && textarea.el) {
      textarea = textarea.el;
    }
  } catch (e) { /* ignore */ }

  // If no textarea provided, fall back to the active editor element
  if (!textarea || (textarea && textarea.tagName !== 'TEXTAREA')) {
    textarea = getActiveEditorInstance()?.el ?? null;
  }

  if (!elements.mathPreviewPopup || !elements.mathPreviewPopupContent || !textarea) {
    return;
  }

  const value = textarea.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  try {
    const taInfo = { id: textarea.id || '(no id)', tag: textarea.tagName || '(no tag)', len: value.length, start, end, activePane: state.activeEditorPane };
  // Debug prints removed
  } catch (e) { }
  
  let contentToRender = '';
  let mathStartIndex = 0;
  
  // Check if text is selected
  if (start !== end) {
    // Show preview of selected text
    contentToRender = value.substring(start, end);
    mathStartIndex = start;
  } else {
    // No selection - show preview of current line only when cursor is at the end of the line
    const lines = value.split('\n');
    
    // Find which line the cursor is on
    let lineIndex = 0;
    let charCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      // Check if cursor is within the line content or at the newline after it
      if (start >= charCount && start <= charCount + lines[i].length) {
        lineIndex = i;
        break;
      }
      charCount += lines[i].length + 1; // +1 for newline
    }
    
    contentToRender = lines[lineIndex] || '';
    
    // Find the start position of this line
    mathStartIndex = 0;
    for (let i = 0; i < lineIndex; i++) {
      mathStartIndex += lines[i].length + 1;
    }
    
    // Only show preview if cursor is at the end of the line (last character or at newline)
    const currentLine = lines[lineIndex] || '';
    const lineEndPos = mathStartIndex + currentLine.length - 1; // -1 to get last char position
    const lineNewlinePos = mathStartIndex + currentLine.length; // Position of newline character
    
    // Check if the current line contains image patterns that should trigger preview
    const hasImagePattern = /\!\[\[([^\]]+)\]\]/.test(currentLine.trim()) || // Wiki-link: ![[filename]]
                           /!\[.*?\]\(.*?\)/.test(currentLine.trim()) || // Markdown image: ![alt](url)
                           /^(https?:\/\/|file:\/\/)?[^\s]+\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)(\?.*)?$/i.test(currentLine.trim()); // Image URL
    
    // Always show preview for the current line if it has content
  }
  
  // Only show preview if there's content to render
  const trimmedContent = contentToRender.trim();
  try { } catch (e) {}
  if (trimmedContent) {
    const mathContent = trimmedContent;
    try {
      // Check if content contains math expressions
      const inlineMathRegex = /(?<!\$)\$([^\n$]+?)\$(?!\w)/gm;
      const blockMathRegex = /\$\$([\s\S]*?)\$\$\s*/gm;
      const latexInlineMathRegex = /\\\((.*?)\\\)/gs;
      const latexDisplayMathRegex = /\\\[(.*?)\\\]/gs;
      
  const inlineMatches = [...contentToRender.matchAll(inlineMathRegex)];
  const blockMatches = [...contentToRender.matchAll(blockMathRegex)];
  const latexInlineMatches = [...contentToRender.matchAll(latexInlineMathRegex)];
  const latexDisplayMatches = [...contentToRender.matchAll(latexDisplayMathRegex)];
  try { } catch (e) {}
      
      if (inlineMatches.length > 0 || blockMatches.length > 0 || latexInlineMatches.length > 0 || latexDisplayMatches.length > 0) {
        // Content contains math expressions - render them using KaTeX (awaited)
        let renderedContent = contentToRender;

        // Ensure KaTeX is available, but don't fail if it isn't
        try {
          await ensureKaTeX();
        } catch (e) { /* ignore load failure and fall back to raw content */ }

        const renderOne = async (math, opts = { throwOnError: false, displayMode: false }) => {
          try {
            if (window.katex && typeof window.katex.renderToString === 'function') {
              return window.katex.renderToString(math, opts);
            }
          } catch (e) { /* ignore */ }
          return null;
        };

        // Replace display math first
        try {
          const displayMatches = [...contentToRender.matchAll(latexDisplayMathRegex)];
          for (const m of displayMatches) {
            const full = m[0];
            const body = m[1];
            const out = await renderOne(body.trim(), { throwOnError: false, displayMode: true });
            renderedContent = renderedContent.replace(full, out || full);
          }

          // Replace block $$...$$
          const blockMatches2 = [...contentToRender.matchAll(blockMathRegex)];
          for (const m of blockMatches2) {
            const full = m[0];
            const body = m[1];
            const out = await renderOne(body.trim(), { throwOnError: false, displayMode: true });
            renderedContent = renderedContent.replace(full, out || full);
          }

          // Replace LaTeX inline \(...\) and \[...\]
          const latexInline = [...contentToRender.matchAll(latexInlineMathRegex)];
          for (const m of latexInline) {
            const full = m[0];
            const body = m[1];
            const out = await renderOne(body.trim(), { throwOnError: false, displayMode: false });
            renderedContent = renderedContent.replace(full, out || full);
          }

          // Replace simple $...$ inline math
          const inlineDollarMatches = [...contentToRender.matchAll(inlineMathRegex)];
          for (const m of inlineDollarMatches) {
            const full = m[0];
            const body = m[1];
            const out = await renderOne(body.trim(), { throwOnError: false, displayMode: false });
            renderedContent = renderedContent.replace(full, out || full);
          }
        } catch (e) {
          // If anything goes wrong, fall back to raw content
          renderedContent = contentToRender;
        }

        // Write content, position popup and show it
        if (elements.mathPreviewPopupContent) {
          try { elements.mathPreviewPopupContent.innerHTML = renderedContent; } catch (e) { elements.mathPreviewPopupContent.textContent = renderedContent; }
        }
        try { positionMathPreviewPopup(textarea, mathStartIndex); } catch (e) {}
        try { elements.mathPreviewPopup.classList.add('visible'); elements.mathPreviewPopup.hidden = false; } catch (e) {}
      } else if (/^#{1,6}\s/.test(mathContent)) {
        // Markdown header: # Title, ## Title, ### Title, etc.
        const headerMatch = mathContent.match(/^(#{1,6})\s+(.*)$/);
        if (headerMatch) {
          const level = headerMatch[1].length;
          const title = headerMatch[2];
          if (elements.mathPreviewPopupContent) {
            try {
              elements.mathPreviewPopupContent.textContent = '';
              const hEl = document.createElement(`h${level}`);
              try { hEl.textContent = title; } catch (e) { hEl.textContent = String(title); }
              elements.mathPreviewPopupContent.appendChild(hEl);
            } catch (e) {
              try { elements.mathPreviewPopupContent.textContent = title; } catch (e2) { /* swallow */ }
            }
          }
        } else {
          // Fallback to plain text
          if (elements.mathPreviewPopupContent) { try { elements.mathPreviewPopupContent.textContent = mathContent; } catch (e) {  } }
        }
      } else if (/\!\[\[([^\]]+)\]\]/.test(mathContent)) {
        // Wiki-link: ![[filename]]
        const wikiMatch = mathContent.match(/\!\[\[([^\]]+)\]\]/);
        if (wikiMatch) {
          const filename = wikiMatch[1];
          let workspacePath = elements.workspacePath?.title || '';

          // Fallback: try to derive workspacePath from state.currentFolder or first note's path
          if (!workspacePath) {
            if (state.currentFolder) workspacePath = state.currentFolder;
            else {
              // try to infer from any note with absolutePath
              for (const n of state.notes.values()) {
                if (n && n.absolutePath) {
                  const parts = n.absolutePath.split(/[/\\]/);
                  parts.pop();
                  workspacePath = parts.join('/');
                  break;
                }
              }
            }
          }

          // If workspace path contains src/renderer, use the directory before it as workspace
          const rendererIndex = workspacePath.indexOf('/src/renderer');
          if (rendererIndex !== -1) {
            workspacePath = workspacePath.substring(0, rendererIndex);
          } else {
            const backslashIndex = workspacePath.indexOf('\\src\\renderer');
            if (backslashIndex !== -1) {
              workspacePath = workspacePath.substring(0, backslashIndex);
            }
          }
          
          if (workspacePath) {
            // Construct file path
            const filePath = `file://${workspacePath}/${filename}`;
            
            // Determine file type and show appropriate preview
            if (/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/i.test(filename)) {
              if (elements.mathPreviewPopupContent) {
                try {
                  elements.mathPreviewPopupContent.innerHTML = '';
                  const loader = document.createElement('div');
                  loader.style.cssText = 'width:200px;height:150px;background:#f8f9fa;border:1px solid #dee2e6;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:12px;';
                  loader.innerHTML = '<div style="font-size:24px">🖼️</div><div>Loading...</div>';
                  const img = document.createElement('img');
                  // don't set img.src directly to a file:// URL; resolve via preload if available
                  img.alt = filename;
                  img.style.display = 'none';
                  if (typeof window.api?.resolveResource === 'function') {
                    const payload = { src: filePath, folderPath: state.currentFolder ?? null };
                    window.api.resolveResource(payload).then((res) => {
                      if (res?.value) {
                        img.src = res.value;
                      } else {
                        loader.innerHTML = '<div style="font-size:24px">🖼️</div><div>Image not found</div>';
                      }
                    }).catch(() => { loader.innerHTML = '<div style="font-size:24px">🖼️</div><div>Image not found</div>'; });
                  } else {
                    img.src = filePath;
                  }
                  img.alt = filename;
                  img.style.maxWidth = '200px';
                  img.style.maxHeight = '150px';
                  img.style.objectFit = 'contain';
                  img.addEventListener('load', () => { img.style.display = 'block'; loader.style.display = 'none'; });
                  img.addEventListener('error', () => { loader.innerHTML = '<div style="font-size:24px">🖼️</div><div>Image not found</div>'; });
                  elements.mathPreviewPopupContent.appendChild(loader);
                  elements.mathPreviewPopupContent.appendChild(img);
                  // Position and show popup
                  try { positionMathPreviewPopup(textarea, mathStartIndex); } catch (e) {}
                  try { elements.mathPreviewPopup.classList.add('visible'); elements.mathPreviewPopup.hidden = false; } catch (e) {}
                } catch (e) {  }
              }
            } else if (/\.(mp4|webm|ogg|avi|mov|wmv|flv|m4v)$/i.test(filename)) {
              if (elements.mathPreviewPopupContent) {
                try {
                  elements.mathPreviewPopupContent.innerHTML = '';
                  const loader = document.createElement('div');
                  loader.style.cssText = 'width:200px;height:150px;background:#f8f9fa;border:1px solid #dee2e6;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:12px;';
                  loader.innerHTML = '<div style="font-size:24px">🎥</div><div>Loading...</div>';
                  const v = document.createElement('video');
                  v.controls = true;
                  v.style.display = 'none';
                  v.style.maxWidth = '200px';
                  v.style.maxHeight = '150px';
                  const s = document.createElement('source');
                  // resolve via preload instead of assigning file:// directly
                  if (typeof window.api?.resolveResource === 'function') {
                    const payload = { src: filePath, folderPath: state.currentFolder ?? null };
                    window.api.resolveResource(payload).then((res) => {
                      if (res?.value) {
                        s.src = res.value;
                        s.type = 'video/mp4';
                        v.appendChild(s);
                      } else {
                        loader.innerHTML = '<div style="font-size:24px">🎥</div><div>Video not found</div>';
                      }
                    }).catch(() => { loader.innerHTML = '<div style="font-size:24px">🎥</div><div>Video not found</div>'; });
                  } else {
                    s.src = filePath;
                    s.type = 'video/mp4';
                    v.appendChild(s);
                  }
                  v.addEventListener('loadedmetadata', () => { v.style.display = 'block'; loader.style.display = 'none'; });
                  v.addEventListener('error', () => { loader.innerHTML = '<div style="font-size:24px">🎥</div><div>Video not found</div>'; });
                  elements.mathPreviewPopupContent.appendChild(loader);
                  elements.mathPreviewPopupContent.appendChild(v);
                  // Position and show popup
                  try { positionMathPreviewPopup(textarea, mathStartIndex); } catch (e) {}
                  try { elements.mathPreviewPopup.classList.add('visible'); elements.mathPreviewPopup.hidden = false; } catch (e) {}
                } catch (e) {  }
              }
            } else if (/\.(pdf)$/i.test(filename)) {
              try {
                elements.mathPreviewPopupContent.innerHTML = '';
                const box = document.createElement('div');
                box.style.cssText = 'width:200px;height:150px;background:#f0f0f0;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:12px;';
                box.textContent = `📄 PDF: ${filename}`;
                elements.mathPreviewPopupContent.appendChild(box);
              } catch (e) {  }
            } else if (/\.(html|htm)$/i.test(filename)) {
              try {
                elements.mathPreviewPopupContent.innerHTML = '';
                const iframe = document.createElement('iframe');
                // Defer actual resolution/loading to the async resolver to avoid attempting
                // to load file:// URLs that may not exist during preview generation.
                iframe.setAttribute('data-raw-src', `${workspacePath}/${filename}`);
                iframe.className = 'html-embed-iframe';
                iframe.style.cssText = 'width:100%;height:300px;border:none;background:white;';
                iframe.setAttribute('sandbox', 'allow-scripts');
                iframe.setAttribute('loading', 'lazy');
                const wrapper = document.createElement('div');
                wrapper.style.width = '200px';
                wrapper.style.height = '150px';
                wrapper.style.overflow = 'hidden';
                wrapper.appendChild(iframe);
                elements.mathPreviewPopupContent.appendChild(wrapper);
                // Let the async processing pick up and resolve the data-raw-src later
                void processPreviewHtmlIframes();
              } catch (e) {  }
            } else {
              // No extension - try common image extensions first, then common video extensions.
              if (elements.mathPreviewPopupContent) {
                try {
                  elements.mathPreviewPopupContent.innerHTML = '';
                  const loader = document.createElement('div');
                  loader.style.cssText = 'width:200px;height:150px;background:#f8f9fa;border:1px solid #dee2e6;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:12px;';
                  loader.innerHTML = '<div style="font-size:24px">🖼️</div><div>Loading...</div>';

                  // Phase 1: try images
                  const img = document.createElement('img');
                  img.style.display = 'none';
                  img.style.maxWidth = '200px';
                  img.style.maxHeight = '150px';
                  img.style.objectFit = 'contain';
                  img.alt = filename;
                  const imageExts = ['.jpg', '.png', '.gif', '.jpeg', '.webp'];
                  let iIdx = 0;
                  const tryNextImage = () => {
                    if (iIdx >= imageExts.length) {
                      // proceed to video phase
                      tryVideos();
                      return;
                    }
                    const candidate = filePath + imageExts[iIdx];
                    // Debug prints removed
                    img.src = candidate;
                    iIdx += 1;
                  };
                  img.addEventListener('load', () => { img.style.display = 'block'; loader.style.display = 'none'; });
                  img.addEventListener('error', () => { tryNextImage(); });

                  // Phase 2: try videos
                  const videoExts = ['.mp4', '.webm', '.ogg', '.m4v'];
                  let vIdx = 0;
                  const tryVideos = () => {
                    const v = document.createElement('video');
                    v.controls = true;
                    v.style.display = 'none';
                    v.style.maxWidth = '200px';
                    v.style.maxHeight = '150px';
                    v.style.objectFit = 'contain';
                    const s = document.createElement('source');
                    const tryNextVideo = () => {
                      if (vIdx >= videoExts.length) {
                        loader.innerHTML = '<div style="font-size:16px">File not found</div>';
                        return;
                      }
                      const candidate = filePath + videoExts[vIdx];
                      // Debug prints removed
                      // If resolver available, prefer that; otherwise assign file:// candidate
                      if (typeof window.api?.resolveResource === 'function') {
                        const payload = { src: candidate, folderPath: state.currentFolder ?? null };
                        window.api.resolveResource(payload).then((res) => {
                          if (res?.value) {
                            s.src = res.value;
                            s.type = 'video/mp4';
                            if (!v.contains(s)) v.appendChild(s);
                            if (!elements.mathPreviewPopupContent.contains(v)) elements.mathPreviewPopupContent.appendChild(v);
                          } else {
                            vIdx += 1;
                            tryNextVideo();
                          }
                        }).catch(() => { vIdx += 1; tryNextVideo(); });
                      } else {
                        s.src = candidate;
                        s.type = 'video/mp4';
                        if (!v.contains(s)) v.appendChild(s);
                        if (!elements.mathPreviewPopupContent.contains(v)) elements.mathPreviewPopupContent.appendChild(v);
                      }
                    };
                    v.addEventListener('loadedmetadata', () => { v.style.display = 'block'; loader.style.display = 'none'; });
                    v.addEventListener('error', () => { vIdx += 1; tryNextVideo(); });
                    // Start with first video candidate
                    tryNextVideo();
                  };

                  elements.mathPreviewPopupContent.appendChild(loader);
                  elements.mathPreviewPopupContent.appendChild(img);
                  // start images
                  tryNextImage();
                } catch (e) {  }
              }
            }
          } else {
            // No workspace path available - show a simple placeholder safely
            try {
              elements.mathPreviewPopupContent.textContent = '';
              const box = document.createElement('div');
              box.style.cssText = 'width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; align-items: center; justify-content: center; font-size: 12px;';
              box.textContent = `Wiki-link: ${filename}`;
              elements.mathPreviewPopupContent.appendChild(box);
            } catch (e) {
              try { elements.mathPreviewPopupContent.textContent = `Wiki-link: ${filename}`; } catch (e2) { /* swallow */ }
            }
          }
        } else {
          elements.mathPreviewPopupContent.textContent = mathContent;
        }
      } else if (/!\[.*?\]\(.*?\)/.test(mathContent)) {
        // Markdown image: ![alt](url)
        const imageMatch = mathContent.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch) {
          const imageUrl = imageMatch[1];
          try {
            // clear previous content
            elements.mathPreviewPopupContent.textContent = '';
            const loader = document.createElement('div');
            loader.style.cssText = 'width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px;';
            loader.innerHTML = '<div style="font-size: 24px;">🖼️</div><div>Loading...</div>';
            const img = document.createElement('img');
            img.alt = 'Preview';
            img.style.display = 'none';
            img.style.maxWidth = '200px';
            img.style.maxHeight = '150px';
            img.style.objectFit = 'contain';
            img.addEventListener('load', () => { img.style.display = 'block'; loader.style.display = 'none'; });
            img.addEventListener('error', () => { loader.innerHTML = '<div style="font-size:24px">🖼️</div><div>Image not found</div>'; });
            img.src = imageUrl;
            elements.mathPreviewPopupContent.appendChild(loader);
            elements.mathPreviewPopupContent.appendChild(img);
          } catch (e) {
            elements.mathPreviewPopupContent.textContent = imageUrl;
          }
        } else {
          elements.mathPreviewPopupContent.textContent = mathContent;
        }
      } else if (/^(https?:\/\/|file:\/\/)?[^\s]+\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)(\?.*)?$/i.test(mathContent) && !/\s/.test(mathContent)) {
        // Direct image URL or file path (no spaces, looks like a URL/filename)
        try {
          elements.mathPreviewPopupContent.textContent = '';
          const loader = document.createElement('div');
          loader.style.cssText = 'width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px;';
          loader.innerHTML = '<div style="font-size: 24px;">🖼️</div><div>Loading...</div>';
          const img = document.createElement('img');
          img.alt = 'Preview';
          img.style.display = 'none';
          img.style.maxWidth = '200px';
          img.style.maxHeight = '150px';
          img.style.objectFit = 'contain';
          img.addEventListener('load', () => { img.style.display = 'block'; loader.style.display = 'none'; });
          img.addEventListener('error', () => { loader.innerHTML = '<div style="font-size:24px">🖼️</div><div>Image not found</div>'; });
          img.src = mathContent;
          elements.mathPreviewPopupContent.appendChild(loader);
          elements.mathPreviewPopupContent.appendChild(img);
        } catch (e) {
          elements.mathPreviewPopupContent.textContent = mathContent;
        }
      } else if (/^(https?:\/\/|file:\/\/)?[^\s]+\.(mp4|webm|ogg|avi|mov|wmv|flv|m4v)(\?.*)?$/i.test(mathContent) && !/\s/.test(mathContent)) {
        // Video file URL or path (no spaces, looks like a URL/filename)
        try {
          elements.mathPreviewPopupContent.textContent = '';
          const loader = document.createElement('div');
          loader.style.cssText = 'width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px;';
          loader.innerHTML = '<div style="font-size: 24px;">🎥</div><div>Loading...</div>';
          const v = document.createElement('video');
          v.controls = true;
          v.style.display = 'none';
          v.style.maxWidth = '200px';
          v.style.maxHeight = '150px';
          const s = document.createElement('source');
          s.src = mathContent;
          s.type = 'video/mp4';
          v.appendChild(s);
          v.addEventListener('loadedmetadata', () => { v.style.display = 'block'; loader.style.display = 'none'; });
          v.addEventListener('error', () => { loader.innerHTML = '<div style="font-size:24px">🎥</div><div>Video not found</div>'; });
          elements.mathPreviewPopupContent.appendChild(loader);
          elements.mathPreviewPopupContent.appendChild(v);
        } catch (e) {
          elements.mathPreviewPopupContent.textContent = mathContent;
        }
      } else if (/^<.*>.*<\/.*>$/.test(mathContent) || /^<.*\/>$/.test(mathContent)) {
        // HTML content (basic detection)
        // For security, we'll show a sanitized preview
        const sanitizedHtml = mathContent
          .replace(/<script[^>]*>.*?<\/script>/gi, '[SCRIPT REMOVED]')
          .replace(/<style[^>]*>.*?<\/style>/gi, '[STYLE REMOVED]')
          .replace(/javascript:/gi, '')
          .replace(/on\w+="[^"]*"/gi, '');
        try {
          elements.mathPreviewPopupContent.textContent = '';
          const box = document.createElement('div');
          box.style.cssText = 'font-family: monospace; font-size: 12px; background: #f5f5f5; padding: 8px; border-radius: 4px; max-width: 200px; overflow: hidden; white-space: pre-wrap;';
          box.textContent = sanitizedHtml;
          elements.mathPreviewPopupContent.appendChild(box);
        } catch (e) {
          elements.mathPreviewPopupContent.textContent = sanitizedHtml;
        }
      } else {
        // Plain text - display as-is
        elements.mathPreviewPopupContent.textContent = mathContent;
      }
      
      // Position the popup next to the current line/text
      positionMathPreviewPopup(textarea, mathStartIndex);
      
      // Show the popup
      elements.mathPreviewPopup.classList.add('visible');
      elements.mathPreviewPopup.hidden = false;
      
      return;
    } catch (error) {
      // Fallback to plain text on error
      elements.mathPreviewPopupContent.textContent = mathContent;
      
      // Position the popup next to the current line/text
      positionMathPreviewPopup(textarea, mathStartIndex);
      
      // Show the popup
        elements.mathPreviewPopup.classList.add('visible');
        elements.mathPreviewPopup.hidden = false;
      
      return;
    }
  }

  // Hide popup if no valid content found
  elements.mathPreviewPopup.classList.remove('visible');
  elements.mathPreviewPopup.hidden = true;
};

// Note: positionMathPreviewPopup is defined below.

const positionMathPreviewPopup = (textarea, mathStartIndex) => {
  if (!elements.mathPreviewPopup) return;
  
  // Get the text before the math expression to calculate line position
  const textBeforeMath = textarea.value.substring(0, mathStartIndex);
  const lines = textBeforeMath.split('\n');
  const currentLineIndex = lines.length - 1;
  const currentLineText = lines[currentLineIndex] || '';
  
  // Calculate the position of the math start within the current line
  const lastNewlineIndex = textBeforeMath.lastIndexOf('\n');
  const charIndexInLine = (lastNewlineIndex === -1) ? mathStartIndex : (mathStartIndex - (lastNewlineIndex + 1));
  const textBeforeCursor = currentLineText.substring(0, Math.max(0, Math.min(charIndexInLine, currentLineText.length)));
  
  // Create a temporary div to measure text width
  const measureDiv = document.createElement('div');
  const taStyle = window.getComputedStyle(textarea);
  measureDiv.style.position = 'absolute';
  measureDiv.style.visibility = 'hidden';
  measureDiv.style.whiteSpace = 'pre';
  // Copy relevant text styles so measurement matches the textarea rendering
  measureDiv.style.fontSize = taStyle.fontSize;
  measureDiv.style.fontFamily = taStyle.fontFamily;
  measureDiv.style.fontWeight = taStyle.fontWeight;
  measureDiv.style.letterSpacing = taStyle.letterSpacing;
  measureDiv.style.lineHeight = taStyle.lineHeight;
  measureDiv.style.padding = '0';
  measureDiv.style.margin = '0';
  measureDiv.style.boxSizing = 'content-box';
  measureDiv.textContent = textBeforeCursor || '\u200B'; // ensure non-empty for width measurement
  document.body.appendChild(measureDiv);

  const charWidth = measureDiv.getBoundingClientRect().width;
  document.body.removeChild(measureDiv);
  
  // Get textarea position
  const textareaRect = textarea.getBoundingClientRect();
  const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 20;
  
  // Use a mirror element technique to compute the caret coordinates precisely
  const getCaretRect = (ta, index) => {
    try {
      const value = ta.value || '';
      const clamped = Math.max(0, Math.min(index, value.length));
      const before = value.substring(0, clamped);
      const style = window.getComputedStyle(ta);
      const taRect = ta.getBoundingClientRect();

      const mirror = document.createElement('div');
      mirror.style.position = 'absolute';
      mirror.style.visibility = 'hidden';
      mirror.style.whiteSpace = 'pre-wrap';
      mirror.style.pointerEvents = 'none';
      mirror.style.boxSizing = 'border-box';
      // Copy text styles so measurement matches
      mirror.style.fontSize = style.fontSize;
      mirror.style.fontFamily = style.fontFamily;
      mirror.style.fontWeight = style.fontWeight;
      mirror.style.lineHeight = style.lineHeight;
      mirror.style.letterSpacing = style.letterSpacing;
      mirror.style.padding = style.padding;
      mirror.style.width = `${Math.max(10, taRect.width)}px`;

      // Place mirror off-screen at 0,0 to avoid affecting layout
  // Position the mirror over the textarea so measurements are in viewport coordinates
  mirror.style.left = `${taRect.left}px`;
  mirror.style.top = `${taRect.top}px`;

      // Build mirror content
      const textNode = document.createTextNode(before);
      const marker = document.createElement('span');
      marker.textContent = '\u200B';
      mirror.appendChild(textNode);
      mirror.appendChild(marker);
      document.body.appendChild(mirror);
  const r = marker.getBoundingClientRect();
  document.body.removeChild(mirror);
  // r is already in viewport coordinates because mirror was positioned over the textarea
  return { left: r.left, top: r.top, width: r.width, height: r.height };
    } catch (e) {
      return null;
    }
  };

  const caretRect = getCaretRect(textarea, mathStartIndex);
  let popupX, popupY;
  // Primary: prefer the last known mouse position so the popup appears to the
  // right of the pointer (this matches the UX you requested).
  if (state.lastMousePosition) {
    popupX = state.lastMousePosition.x + 12;
    popupY = state.lastMousePosition.y - 12;
  } else if (caretRect) {
    // Secondary: use caret coordinates if mouse isn't available
    popupX = caretRect.left + caretRect.width + 8;
    popupY = caretRect.top - 6;
  } else {
    // Fallback approximate positioning
    const paddingLeft = parseFloat(taStyle.paddingLeft) || 0;
    const paddingTop = parseFloat(taStyle.paddingTop) || 0;
    const scrollLeft = textarea.scrollLeft || 0;
    const scrollTop = textarea.scrollTop || 0;
    popupX = textareaRect.left + paddingLeft + charWidth - scrollLeft + 8;
    popupY = textareaRect.top + paddingTop + (currentLineIndex * lineHeight) - scrollTop + 6;
  }

  // Debug coordinates (development only)
  try { } catch (e) {}
  
  // Ensure popup stays within window bounds
  const popupWidth = 220; // Approximate popup width
  const windowWidth = window.innerWidth;
  if (popupX + popupWidth > windowWidth) {
    popupX = windowWidth - popupWidth - 10; // Position from right edge
  }
  
  elements.mathPreviewPopup.style.left = `${popupX}px`;
  elements.mathPreviewPopup.style.top = `${popupY}px`;
};

const handleEditorInput = (event, opts = {}) => {
  // Set typing flag and clear it after a delay
  state.userTyping = true;
  clearTimeout(state.typingTimer);
  state.typingTimer = setTimeout(() => {
    state.userTyping = false;
  }, 1500);

  // Determine which editor/pane this input applies to
  const pane = opts.pane || (event.target === elements.editorRight ? 'right' : 'left');
  const paneNoteId = state.editorPanes?.[pane]?.noteId || state.activeNoteId;
  const note = paneNoteId ? state.notes.get(paneNoteId) : getActiveNote();

  // Update math preview popup
  updateMathPreview(event.target);
  
  // Check for LaTeX auto-completion before updating note content
  // Pass the inputType to avoid triggering on delete operations
  const latexCompleted = note && note.type === 'markdown' ? handleLatexAutoCompletion(event.target, event.inputType) : false;
  
  // Update note content if it's a markdown note
  if (note && note.type === 'markdown') {
    note.content = event.target.value;
    note.updatedAt = new Date().toISOString();
    note.dirty = true;
    refreshBlockIndexForNote(note);
    refreshHashtagsForNote(note);
    // Only render preview if this pane is the active pane
    if (state.activeEditorPane === pane) {
      // Use debounced render to avoid excessive work on every keystroke.
      // If latex auto-completion altered the content below, we'll trigger an
      // immediate render afterwards.
      debouncedRenderPreview(note.content, note.id);
    }
    scheduleSave();

    if (state.search.open) {
      const activeEd = getActiveEditorInstance();
      const caret = activeEd?.selectionStart ?? state.search.lastCaret ?? 0;
      updateEditorSearchMatches({ preserveActive: true, caret, focusEditor: false });
    }
  }
  
  // Always update suggestions, as they don't depend on the note being saved or markdown
  updateWikiSuggestions(event.target);
  updateHashtagSuggestions(event.target);
  updateFileSuggestions(event.target);
  
  // If LaTeX was auto-completed, trigger another input event to update everything with the new content
  if (latexCompleted) {
    note.content = event.target.value;
    if (state.activeEditorPane === pane) {
      // Latex completion inserted text programmatically; render immediately
      // so visual feedback (and math preview) is up-to-date.
      renderMarkdownPreview(note.content, note.id);
    }
  }
};

const handleEditor2Drop = (event) => {
  // Prevent default and stop other listeners from handling this internal drop
  try { event.preventDefault(); } catch (e) {}
  try { event.stopPropagation(); } catch (e) {}
  try { if (event.stopImmediatePropagation) event.stopImmediatePropagation(); } catch (e) {}

  // Clear any visual drop classes globally to avoid stale highlights
  try {
    Array.from(document.querySelectorAll('.editor-drop-target')).forEach((el) => el.classList.remove('editor-drop-target'));
  } catch (e) { /* ignore */ }

  // Check for external files first
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleExternalFileDrop(event, files);
    return;
  }

  // Determine pane id heuristically: data-pane-id attribute, textarea id, or right-pane class
  let paneId = null;
  try {
    const paneRoot = (event.target && event.target.closest) ? event.target.closest('[data-pane-id], .editor-pane--dynamic, .editor-pane--right, .editor-pane') : null;
    if (paneRoot) {
      // Prefer explicit attribute
      if (paneRoot.getAttribute) {
        const explicit = paneRoot.getAttribute('data-pane-id');
        if (explicit) paneId = explicit;
      }
      // Fallback: check for textarea id pattern inside the pane
      if (!paneId) {
        const ta = paneRoot.querySelector && paneRoot.querySelector('textarea');
        if (ta && ta.id) {
          if (ta.id === 'note-editor') paneId = 'left';
          else if (ta.id.startsWith('note-editor-')) paneId = ta.id.replace(/^note-editor-/, '');
        }
      }
      // Final fallback: if pane is the right-pane, use 'right'
      if (!paneId && paneRoot.classList && paneRoot.classList.contains('editor-pane--right')) {
        paneId = 'right';
      }
    }
  } catch (e) { /* ignore */ }

  // If we still don't have a paneId, try deriving from the direct event target (textarea)
  try {
    if (!paneId && event.target && event.target.id) {
      if (event.target.id === 'note-editor') paneId = 'left';
      else if (event.target.id && event.target.id.startsWith('note-editor-')) paneId = event.target.id.replace(/^note-editor-/, '');
    }
  } catch (e) { /* ignore */ }

  const noteId = event.dataTransfer?.getData ? event.dataTransfer.getData('text/noteId') : null;
  if (!noteId || !state.notes.has(noteId)) return;

  // If paneId is missing or unknown, fallback to 'right' if it exists, otherwise 'left'
  if (!paneId || !editorInstances[paneId]) {
    if (editorInstances.right) paneId = 'right';
    else paneId = 'left';
  }

  openNoteInPane(noteId, paneId);
};

// second editor input handling removed

const inlineCommandPattern = /^\s*&(?<command>[a-z]+)(?:(?::|\s+)(?<argument>.+?))?\s*$/i;
const inlineCommandNames = ['code', 'math', 'table', 'matrix', 'bmatrix', 'pmatrix', 'Bmatrix', 'vmatrix', 'Vmatrix', 'quote'];
const inlineCommandStartRegex = new RegExp(`^\\s*&(?:${inlineCommandNames.join('|')})\\b`, 'mi');
const inlineCommandLineRegex = new RegExp(
  `^(?:[ \\t]*)&(?:${inlineCommandNames.join('|')})\\b[^\\n]*(?:\\r?\\n|$)`,
  'i'
);

const detectInlineCommandTrigger = (value, caret, options = {}) => {
  const includeTrailingNewline = Boolean(options.includeTrailingNewline);
  if (typeof value !== 'string' || !value.length) {
    return null;
  }

  const normalizedCaret =
    typeof caret === 'number' && Number.isFinite(caret)
      ? Math.max(0, Math.min(value.length, caret))
      : value.length;

  const lineStart = value.lastIndexOf('\n', normalizedCaret - 1) + 1;
  const nextNewline = value.indexOf('\n', normalizedCaret);
  const lineEnd = nextNewline === -1 ? value.length : nextNewline;

  if (normalizedCaret < lineStart) {
    return null;
  }

  if (normalizedCaret < lineEnd) {
    const trailing = value.slice(normalizedCaret, lineEnd);
    if (trailing.trim().length > 0) {
      return null;
    }
  }

  const currentLine = value.slice(lineStart, lineEnd);
  inlineCommandPattern.lastIndex = 0;
  const match = inlineCommandPattern.exec(currentLine);
  if (!match) {
    return null;
  }

  const command = match.groups?.command?.toLowerCase() ?? '';
  const originalCommand = match.groups?.command ?? '';
  const validCommands = ['code', 'math', 'table', 'matrix', 'bmatrix', 'pmatrix', 'vmatrix', 'quote'];
  const validCaseSensitiveCommands = ['Bmatrix', 'Vmatrix'];
  
  if (!validCommands.includes(command) && !validCaseSensitiveCommands.includes(originalCommand)) {
    return null;
  }

  const argument = match.groups?.argument ?? '';
  const start = lineStart + match.index;
  let end = start + match[0].length;
  let consumedNewline = false;

  if (includeTrailingNewline && nextNewline !== -1) {
    end = nextNewline + 1;
    consumedNewline = true;
  }

  return {
    start,
    end,
    command,
    argument,
    consumedNewline
  };
};

const resolveCommandContinuation = (input) => {
  if (typeof input !== 'string') {
    return {
      newline: '\n',
      remainder: '',
      hadLeadingNewline: false
    };
  }

  if (input.startsWith('\r\n')) {
    return {
      newline: '\r\n',
      remainder: input.slice(2),
      hadLeadingNewline: true
    };
  }

  if (input.startsWith('\n')) {
    return {
      newline: '\n',
      remainder: input.slice(1),
      hadLeadingNewline: true
    };
  }

  return {
    newline: '\n',
    remainder: input,
    hadLeadingNewline: false
  };
};

const updateCodeBlockAfterCommand = (beforeCommandLength, afterSegment, language) => {
  if (typeof afterSegment !== 'string') {
    return null;
  }

  const { newline, remainder } = resolveCommandContinuation(afterSegment);
  const blankMatch = remainder.match(/^(?:[ \t]*(?:\r?\n))*/);
  const blankSegment = blankMatch ? blankMatch[0] : '';
  const rest = remainder.slice(blankSegment.length);
  const fenceMatch = rest.match(/^([ \t]*)```([^\n]*)\n/);
  if (!fenceMatch) {
    return null;
  }

  const indent = fenceMatch[1] ?? '';
  const newFence = `${indent}\`\`\`${language ? language : ''}\n`;
  const restAfterFence = rest.slice(fenceMatch[0].length);
  const updatedRest = `${blankSegment}${newFence}${restAfterFence}`;
  const updatedAfter = `${newline}${updatedRest}`;
  const caretPosition = beforeCommandLength + newline.length + blankSegment.length + newFence.length;

  return {
    updatedAfter,
    caretPosition
  };
};

const applyInlineCodeTrigger = (textarea, note, trigger) => {
  if (!textarea || !note || !trigger || state.suppressInlineCommand) {
    return false;
  }

  state.suppressInlineCommand = true;

  try {
    const language = (trigger.argument ?? trigger.language ?? '').trim();

    if (language) {
      state.lastCodeLanguage = language;
      persistLastCodeLanguage(language);
    }

    const value = textarea.value ?? '';
    const beforeCommand = value.slice(0, trigger.end);
    const afterCommandOriginal = value.slice(trigger.end);

    const updateResult = updateCodeBlockAfterCommand(beforeCommand.length, afterCommandOriginal, language);
    if (updateResult) {
      const nextContent = `${beforeCommand}${updateResult.updatedAfter}`;
      const changed = nextContent !== value;

      if (changed) {
        const _edt_code = getActiveEditorInstance();
        const _ta_code = _edt_code?.el ?? textarea;
        if (_ta_code) {
          // prefer Editor API
          try {
            if (_edt_code && typeof _edt_code.setValue === 'function') _edt_code.setValue(nextContent);
            else _ta_code.value = nextContent;
          } catch (e) { _ta_code.value = nextContent; }
          try { if (_edt_code) _edt_code.focus({ preventScroll: true }); else _ta_code.focus({ preventScroll: true }); } catch (e) { try { if (_edt_code) _edt_code.focus(); else _ta_code.focus(); } catch (e2) {} }
          const caret = Math.min(updateResult.caretPosition, nextContent.length);
          try { if (_edt_code && typeof _edt_code.setSelectionRange === 'function') _edt_code.setSelectionRange(caret, caret); else _ta_code.setSelectionRange(caret, caret); } catch (e) {}
        }

        note.content = nextContent;
        note.updatedAt = new Date().toISOString();
        note.dirty = true;

        refreshBlockIndexForNote(note);
        refreshHashtagsForNote(note);
        renderMarkdownPreview(note.content, note.id);
        scheduleSave();
        updateWikiSuggestions(_ta_code);
        updateHashtagSuggestions(_ta_code);
      }

      const languageLabel = language.length ? language : 'plain text';
      const message = changed
        ? `Updated code block language to ${languageLabel}.`
        : `Code block language already set to ${languageLabel}.`;
      setStatus(message, true);
      return true;
    }

    const separation = resolveCommandContinuation(afterCommandOriginal);
    const baseAfter = `${separation.newline}${separation.remainder}`;
    const baseContent = `${beforeCommand}${baseAfter}`;

    const _edt_code2 = getActiveEditorInstance();
    const _ta_code2 = _edt_code2?.el ?? textarea;
    if (_ta_code2) {
      try { if (_edt_code2 && typeof _edt_code2.setValue === 'function') _edt_code2.setValue(baseContent); else _ta_code2.value = baseContent; } catch (e) { _ta_code2.value = baseContent; }
      try { if (_edt_code2) _edt_code2.focus({ preventScroll: true }); else _ta_code2.focus({ preventScroll: true }); } catch (e) { try { if (_edt_code2) _edt_code2.focus(); else _ta_code2.focus(); } catch (e2) {} }
      const caret = beforeCommand.length + separation.newline.length;
      try { if (_edt_code2 && typeof _edt_code2.setSelectionRange === 'function') _edt_code2.setSelectionRange(caret, caret); else _ta_code2.setSelectionRange(caret, caret); } catch (e) {}
    }

    note.content = baseContent;
    note.updatedAt = new Date().toISOString();
    note.dirty = true;

    return insertCodeBlockAtCursor(language);
  } finally {
    state.suppressInlineCommand = false;
  }
};

const applyInlineMathTrigger = (textarea, note, trigger) => {
  if (!textarea || !note || !trigger || state.suppressInlineCommand) {
    return false;
  }

  state.suppressInlineCommand = true;

  try {
    const before = textarea.value.slice(0, trigger.start);
    const after = textarea.value.slice(trigger.end);

    const needsLeadingNewline = before.length > 0 && !before.endsWith('\n');
    const needsTrailingNewline = after.length > 0 && !after.startsWith('\n');

    const rawPlaceholder = (trigger.argument ?? '').trim();
    const placeholder = rawPlaceholder.length ? rawPlaceholder : '\\text{math here}';
    const openingLine = '$$';
    const closingLine = '$$';
    const snippetCore = `${openingLine}\n${placeholder}\n${closingLine}\n`;
    const snippet = `${needsLeadingNewline ? '\n' : ''}${snippetCore}${needsTrailingNewline ? '\n' : ''}`;
    const nextContent = `${before}${snippet}${after}`;

    // Prefer the active editor instance's textarea so split view inserts
    // always apply to the active pane. Fall back to the local textarea
    // variable if no active instance is available.
    const _edt_matrix = getActiveEditorInstance();
    const _ta_matrix = _edt_matrix?.el ?? textarea;
    if (_ta_matrix) {
      _ta_matrix.value = nextContent;
      try { _ta_matrix.focus({ preventScroll: true }); } catch (e) { try { _ta_matrix.focus(); } catch (e2) {} }
    }

    const placeholderStart =
      before.length +
      (needsLeadingNewline ? 1 : 0) +
      openingLine.length +
      1;
    const placeholderEnd = placeholderStart + placeholder.length;

    window.requestAnimationFrame(() => {
      try {
        if (_edt_matrix && typeof _edt_matrix.setSelectionRange === 'function') _edt_matrix.setSelectionRange(placeholderStart, placeholderEnd);
        else (_edt_matrix?.el ?? textarea).setSelectionRange(placeholderStart, placeholderEnd);
      } catch (e) {}
    });

    note.content = nextContent;
    note.updatedAt = new Date().toISOString();
    note.dirty = true;

    refreshBlockIndexForNote(note);
    refreshHashtagsForNote(note);
    renderMarkdownPreview(note.content, note.id);
    scheduleSave();
    setStatus('Inserted math block. Replace the placeholder with your LaTeX.', true);
    updateWikiSuggestions(textarea);
    updateHashtagSuggestions(textarea);
  } finally {
    state.suppressInlineCommand = false;
  }

  return true;
};

const maxInlineTableDimension = 12;

const parseInlineMatrixDimensions = (raw) => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed.length) {
    return null;
  }

  const match = trimmed.match(/^([1-9]\d?)\s*[xX]\s*([1-9]\d?)$/);
  if (!match) {
    return null;
  }

  let rows = Number.parseInt(match[1], 10);
  let columns = Number.parseInt(match[2], 10);

  // Limit matrix size to reasonable dimensions
  const maxMatrixDimension = 10;
  const clamped = rows > maxMatrixDimension || columns > maxMatrixDimension;
  rows = Math.min(rows, maxMatrixDimension);
  columns = Math.min(columns, maxMatrixDimension);

  return {
    rows,
    columns,
    clamped
  };
};

const applyInlineMatrixTrigger = (textarea, note, trigger, matrixType) => {
  if (!textarea || !note || !trigger || state.suppressInlineCommand) {
    return false;
  }

  const dimensions = parseInlineMatrixDimensions(trigger.argument ?? '');
  if (!dimensions) {
    setStatus(`Use "&${matrixType} ROWSxCOLS" (e.g. "&${matrixType} 3x4").`, false);
    return false;
  }

  const { rows, columns, clamped } = dimensions;
  if (rows < 1 || columns < 1) {
    setStatus('Matrix dimensions must be at least 1x1.', false);
    return false;
  }

  state.suppressInlineCommand = true;

  try {
    const value = textarea.value ?? '';
    const beforeCommand = value.slice(0, trigger.end);
    const originalAfterCommand = value.slice(trigger.end);
    const { remainder: afterCommand, existingContent } = stripExistingMatrixAfterCommand(originalAfterCommand);

    // Parse existing matrix content if available
    let existingMatrix = null;
    if (existingContent) {
      existingMatrix = parseExistingMatrixContent(existingContent, matrixType);
    }

    // Create matrix content with placeholders, preserving existing content
    const matrixRows = [];
    for (let i = 0; i < rows; i++) {
      const rowCells = [];
      for (let j = 0; j < columns; j++) {
        // Use existing content if available, otherwise use placeholder
        if (existingMatrix && existingMatrix[i] && existingMatrix[i][j]) {
          rowCells.push(existingMatrix[i][j]);
        } else {
          rowCells.push('a_{' + (i + 1) + (j + 1) + '}');
        }
      }
      matrixRows.push(rowCells.join(' & '));
    }

    const matrixContent = matrixRows.join(' \\\\\n  ');
    const matrixBlock = `$$\n\\begin{${matrixType}}\n  ${matrixContent}\n\\end{${matrixType}}\n$$`;

    const needsTrailingNewline = afterCommand.length > 0 && !afterCommand.startsWith('\n');
    const snippetPrefix = '\n';
    const snippetSuffix = needsTrailingNewline ? '\n' : '';
    const snippet = `${snippetPrefix}${matrixBlock}${snippetSuffix}`;
    const nextContent = `${beforeCommand}${snippet}${afterCommand}`;

    textarea.value = nextContent;
    textarea.focus({ preventScroll: true });

    // Position cursor at the first matrix element
    const firstElement = 'a_{11}';
    const selectionAnchorInSnippet = matrixBlock.indexOf(firstElement);
    const selectionStart = beforeCommand.length + snippetPrefix.length + 
                          (selectionAnchorInSnippet >= 0 ? selectionAnchorInSnippet : 0);
    const selectionEnd = selectionStart + firstElement.length;

    window.requestAnimationFrame(() => {
      try {
        if (_edt_matrix && typeof _edt_matrix.setSelectionRange === 'function') _edt_matrix.setSelectionRange(selectionStart, selectionEnd);
        else (_edt_matrix?.el ?? textarea).setSelectionRange(selectionStart, selectionEnd);
      } catch (e) {}
    });

    note.content = nextContent;
    note.updatedAt = new Date().toISOString();
    note.dirty = true;

  refreshBlockIndexForNote(note);
    refreshHashtagsForNote(note);
    renderMarkdownPreview(note.content, note.id);
    scheduleSave();

    if (clamped) {
      setStatus(`Matrix size clamped to ${rows}x${columns}.`, false);
    }

    return true;
  } catch (error) {
    setStatus('Failed to create matrix.', false);
    return false;
  } finally {
    state.suppressInlineCommand = false;
  }
};

const parseExistingMatrixContent = (input, matrixType) => {
  if (typeof input !== 'string' || !input.length) {
    return null;
  }

  // Look for the math block pattern
  const mathBlockMatch = input.match(/\$\$\s*\n([\s\S]*?)\n\s*\$\$/);
  if (!mathBlockMatch) {
    return null;
  }

  const mathContent = mathBlockMatch[1];
  
  // Look for the matrix environment
  const matrixPattern = new RegExp(`\\\\begin\\{${matrixType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\s*\n([\\s\\S]*?)\\n\\s*\\\\end\\{${matrixType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}`);
  const matrixMatch = mathContent.match(matrixPattern);
  
  if (!matrixMatch) {
    return null;
  }

  const matrixBody = matrixMatch[1].trim();
  
  // Parse rows and cells
  const rows = matrixBody.split('\\\\').map(row => row.trim()).filter(row => row.length > 0);
  const parsedMatrix = [];
  
  for (const row of rows) {
    const cells = row.split('&').map(cell => cell.trim());
    parsedMatrix.push(cells);
  }

  return parsedMatrix;
};

const parseInlineTableDimensions = (raw) => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed.length) {
    return null;
  }

  // Check if it contains '=' anywhere for fill mode
  const hasEquals = trimmed.includes('=');
  let fillMode = false;
  let fillValue = 'x';
  let dimensionPart = trimmed;
  
  if (hasEquals) {
    // Find the first '=' and split
    const equalsIndex = trimmed.indexOf('=');
    dimensionPart = trimmed.slice(0, equalsIndex).trim();
    const valuePart = trimmed.slice(equalsIndex + 1).trim();
    fillValue = valuePart || ' '; // default to space if nothing after =
    fillMode = true;
  }

  const match = dimensionPart.match(/^([1-9]\d?)\s*[xX]\s*([1-9]\d?)$/);
  if (!match) {
    return null;
  }

  let rows = Number.parseInt(match[1], 10);
  let columns = Number.parseInt(match[2], 10);

  const clamped = rows > maxInlineTableDimension || columns > maxInlineTableDimension;
  rows = Math.min(rows, maxInlineTableDimension);
  columns = Math.min(columns, maxInlineTableDimension);

  return {
    rows,
    columns,
    clamped,
    fillMode,
    fillValue
  };
};

const stripExistingQuoteAfterCommand = (input) => {
  if (typeof input !== 'string' || !input.length) {
    return {
      remainder: input ?? '',
      removedLeadingNewline: false,
      removed: false
    };
  }

  let newlineLength = 0;
  if (input.startsWith('\r\n')) {
    newlineLength = 2;
  } else if (input.startsWith('\n')) {
    newlineLength = 1;
  }

  let index = newlineLength;
  let lineCount = 0;
  
  // Look for existing quote block (lines starting with >)
  while (index < input.length) {
    const lineEnd = input.indexOf('\n', index);
    const line = lineEnd === -1 ? input.slice(index) : input.slice(index, lineEnd);
    
    // If line doesn't start with >, we've reached the end of the quote
    if (!line.trim().startsWith('>')) {
      break;
    }
    
    lineCount += 1;
    if (lineEnd === -1) {
      index = input.length;
      break;
    }
    index = lineEnd + 1;
  }

  if (lineCount >= 1) {
    // Also consume any trailing newline after the quote block
    if (input.slice(index, index + 2) === '\r\n') {
      index += 2;
    } else if (input[index] === '\n') {
      index += 1;
    }
    
    return {
      remainder: input.slice(index),
      removedLeadingNewline: newlineLength > 0,
      removed: true
    };
  }

  return {
    remainder: input,
    removedLeadingNewline: false,
    removed: false
  };
};

const applyInlineQuoteTrigger = (textarea, note, trigger) => {
  if (!textarea || !note || !trigger || state.suppressInlineCommand) {
    return false;
  }

  const author = trigger.argument ? trigger.argument.trim() : '';
  
  state.suppressInlineCommand = true;

  try {
    const value = textarea.value ?? '';
    const beforeCommand = value.slice(0, trigger.end);
    const originalAfterCommand = value.slice(trigger.end);
    const { remainder: afterCommand } = stripExistingQuoteAfterCommand(originalAfterCommand);

    // Create quote block
    const quotePlaceholder = 'Your quote text here...';
    const quoteLines = [`> ${quotePlaceholder}`];
    
    if (author) {
      quoteLines.push(`> `);
      quoteLines.push(`> — ${author}`);
    } else {
      quoteLines.push(`> `);
      quoteLines.push(`> — Author`);
    }

    const quoteBlock = quoteLines.join('\n');
    const needsTrailingNewline = afterCommand.length > 0 && !afterCommand.startsWith('\n');
    const snippetPrefix = '\n';
    const snippetSuffix = needsTrailingNewline ? '\n' : '';
    const snippet = `${snippetPrefix}${quoteBlock}${snippetSuffix}`;
    const nextContent = `${beforeCommand}${snippet}${afterCommand}`;

    // Prefer the active editor instance's textarea so split view inserts
    // always apply to the active pane.
    const _edt_quote = getActiveEditorInstance();
    const _ta_quote = _edt_quote?.el ?? textarea;
    if (_ta_quote) {
      _ta_quote.value = nextContent;
      try { _ta_quote.focus({ preventScroll: true }); } catch (e) { try { _ta_quote.focus(); } catch (e2) {} }
    }

    // Position cursor at the quote text for immediate editing
    const selectionStart = beforeCommand.length + snippetPrefix.length + 2; // After "> "
    const selectionEnd = selectionStart + quotePlaceholder.length;

    window.requestAnimationFrame(() => {
      try {
        if (_edt_quote && typeof _edt_quote.setSelectionRange === 'function') _edt_quote.setSelectionRange(selectionStart, selectionEnd);
        else (_edt_quote?.el ?? textarea).setSelectionRange(selectionStart, selectionEnd);
      } catch (e) {}
    });

    note.content = nextContent;
    note.updatedAt = new Date().toISOString();
    note.dirty = true;

    refreshBlockIndexForNote(note);
    refreshHashtagsForNote(note);
    renderMarkdownPreview(note.content, note.id);
    scheduleSave();

    return true;
  } catch (error) {
    setStatus('Failed to create quote.', false);
    return false;
  } finally {
    state.suppressInlineCommand = false;
  }
};

const stripExistingMatrixAfterCommand = (input) => {
  if (typeof input !== 'string' || !input.length) {
    return {
      remainder: input ?? '',
      removedLeadingNewline: false,
      removed: false,
      existingContent: null
    };
  }

  let newlineLength = 0;
  if (input.startsWith('\r\n')) {
    newlineLength = 2;
  } else if (input.startsWith('\n')) {
    newlineLength = 1;
  }

  // Look for a math block starting with $$
  let index = newlineLength;
  const afterNewline = input.slice(index);
  
  // Check if we have a math block starting with $$
  if (afterNewline.startsWith('$$\n')) {
    // Find the end of the math block
    const mathBlockStart = index + 3; // Skip past "$$\n"
    const mathBlockEndIndex = input.indexOf('\n$$', mathBlockStart);
    
    if (mathBlockEndIndex !== -1) {
      // Check if this math block contains a matrix environment
      const mathContent = input.slice(mathBlockStart, mathBlockEndIndex);
      const matrixPattern = /\\begin\{(?:matrix|bmatrix|pmatrix|Bmatrix|vmatrix|Vmatrix)\}/;
      
      if (matrixPattern.test(mathContent)) {
        // Found a matrix block, extract the content before removing
        const existingContent = input.slice(index, mathBlockEndIndex + 3); // Include the closing $$
        
        // Skip past the matrix block
        let endIndex = mathBlockEndIndex + 3; // Skip past "\n$$"
        
        // Also skip any trailing newline
        if (input.slice(endIndex, endIndex + 2) === '\r\n') {
          endIndex += 2;
        } else if (input[endIndex] === '\n') {
          endIndex += 1;
        }
        
        return {
          remainder: input.slice(endIndex),
          removedLeadingNewline: newlineLength > 0,
          removed: true,
          existingContent: existingContent
        };
      }
    }
  }

  return {
    remainder: input,
    removedLeadingNewline: false,
    removed: false,
    existingContent: null
  };
};

const parseExistingTableContent = (input) => {
  if (typeof input !== 'string' || !input.length) {
    return null;
  }

  // Split into lines and find table lines (starting with |)
  const lines = input.split('\n');
  const tableLines = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableLines.push(trimmed);
    } else if (tableLines.length > 0) {
      // Stop when we hit a non-table line
      break;
    }
  }

  if (tableLines.length < 2) {
    return null;
  }

  // Parse header and data rows (skip divider row)
  const headerRow = tableLines[0];
  const dataRows = tableLines.slice(2); // Skip header and divider

  const parseRow = (row) => {
    return row.split('|').slice(1, -1).map(cell => cell.trim());
  };

  const headers = parseRow(headerRow);
  const rows = dataRows.map(parseRow);

  return {
    headers,
    rows
  };
};

const stripExistingTableAfterCommand = (input) => {
  if (typeof input !== 'string' || !input.length) {
    return {
      remainder: input ?? '',
      removedLeadingNewline: false,
      removed: false,
      existingContent: null
    };
  }

  let newlineLength = 0;
  if (input.startsWith('\r\n')) {
    newlineLength = 2;
  } else if (input.startsWith('\n')) {
    newlineLength = 1;
  }

  let index = newlineLength;
  let lineCount = 0;
  const tableLines = [];
  
  while (index <= input.length) {
    const lineEnd = input.indexOf('\n', index);
    const line = lineEnd === -1 ? input.slice(index) : input.slice(index, lineEnd);
    if (!line.trim().startsWith('|')) {
      break;
    }
    tableLines.push(line);
    lineCount += 1;
    if (lineEnd === -1) {
      index = input.length;
      break;
    }
    index = lineEnd + 1;
  }

  if (lineCount >= 2) {
    // Extract existing table content
    const existingContent = input.slice(newlineLength, index);
    
    if (input.slice(index, index + 2) === '\r\n') {
      index += 2;
    } else if (input[index] === '\n') {
      index += 1;
    }
    return {
      remainder: input.slice(index),
      removedLeadingNewline: newlineLength > 0,
      removed: true,
      existingContent: existingContent
    };
  }

  return {
    remainder: input,
    removedLeadingNewline: false,
    removed: false,
    existingContent: null
  };
};

const applyInlineTableTrigger = (textarea, note, trigger) => {
  if (!textarea || !note || !trigger || state.suppressInlineCommand) {
    return false;
  }

  const dimensions = parseInlineTableDimensions(trigger.argument ?? '');
  if (!dimensions) {
    setStatus('Use "&table ROWSxCOLS" (e.g. "&table 3x4") or "&table ROWSxCOLS =VALUE" to fill with VALUE.', false);
    return false;
  }

  const { rows, columns, clamped, fillMode, fillValue } = dimensions;
  if (rows < 1 || columns < 1) {
    setStatus('Table dimensions must be at least 1x1.', false);
    return false;
  }

  state.suppressInlineCommand = true;

  try {
    const value = textarea.value ?? '';
    const beforeCommand = value.slice(0, trigger.end);
    const originalAfterCommand = value.slice(trigger.end);
    const { remainder: afterCommand, existingContent } = stripExistingTableAfterCommand(originalAfterCommand);

    // Parse existing table content if available
    let existingTable = null;
    if (existingContent) {
      existingTable = parseExistingTableContent(existingContent);
    }

    const needsLeadingNewline = beforeCommand.length > 0 && !beforeCommand.endsWith('\n');
    const needsTrailingNewline = afterCommand.length > 0 && !afterCommand.startsWith('\n');

    const makeRow = (cells) => `| ${cells.join(' | ')} |`;
    
    // Create headers, preserving existing ones if available
    const headers = Array.from({ length: columns }, (_, index) => {
      if (existingTable && existingTable.headers && existingTable.headers[index]) {
        return existingTable.headers[index];
      }
      return `Header ${index + 1}`;
    });
    
    const divider = Array.from({ length: columns }, () => '---');
    
    // Detect original fill value for existing tables in fill mode
    let originalFillValue = null;
    if (fillMode && existingTable && existingTable.rows) {
      const valueCounts = new Map();
      for (const row of existingTable.rows) {
        if (!row) continue;
        for (const cell of row) {
          if (cell && !/^Row \d+ Col \d+$/.test(cell) && cell.trim() !== '') {
            valueCounts.set(cell, (valueCounts.get(cell) || 0) + 1);
          }
        }
      }
      // Find the most common value (likely the original fill value)
      let maxCount = 0;
      for (const [value, count] of valueCounts) {
        if (count > maxCount) {
          maxCount = count;
          originalFillValue = value;
        }
      }
    }
    
    // Create body rows, preserving existing data
    const bodyRows = Array.from({ length: rows }, (_, rowIndex) =>
      makeRow(
        Array.from({ length: columns }, (_, columnIndex) => {
          let cellValue = `Row ${rowIndex + 1} Col ${columnIndex + 1}`;
          
          if (existingTable && existingTable.rows && existingTable.rows[rowIndex] && existingTable.rows[rowIndex][columnIndex]) {
            const existingValue = existingTable.rows[rowIndex][columnIndex];
            
            if (fillMode) {
              // In fill mode, replace original fill values with new fill value, preserve manually edited content
              if (originalFillValue && existingValue === originalFillValue) {
                cellValue = fillValue; // Replace old fill value with new one
              } else if (!/^Row \d+ Col \d+$/.test(existingValue) && existingValue.trim() !== '' && existingValue !== fillValue) {
                cellValue = existingValue; // Preserve manually edited content
              } else {
                cellValue = fillValue; // Fill default or empty cells
              }
            } else {
              cellValue = existingValue; // Preserve all existing content when not in fill mode
            }
          } else if (fillMode) {
            cellValue = fillValue; // Fill new cells
          }
          
          return cellValue;
        })
      )
    );

    const lines = [makeRow(headers), makeRow(divider), ...bodyRows];
    const snippetCore = `${lines.join('\n')}\n`;
    const snippetPrefix = needsLeadingNewline ? '\n' : '';
    const snippetSuffix = needsTrailingNewline ? '\n' : '';
    const snippet = `${snippetPrefix}${snippetCore}${snippetSuffix}`;
    const nextContent = `${beforeCommand}${snippet}${afterCommand}`;

    // Prefer the active editor instance's textarea so split view inserts
    // always apply to the active pane.
    const _edt_table = getActiveEditorInstance();
    const _ta_table = _edt_table?.el ?? textarea;
    if (_ta_table) {
      _ta_table.value = nextContent;
      try { _ta_table.focus({ preventScroll: true }); } catch (e) { try { _ta_table.focus(); } catch (e2) {} }
    }

    const firstDataCell = rows > 0 ? (fillMode ? fillValue : `Row 1 Col 1`) : headers[0] ?? '';
    const selectionAnchorInSnippet = snippetCore.indexOf(firstDataCell);
    const selectionStart =
      beforeCommand.length +
      snippetPrefix.length +
      (selectionAnchorInSnippet >= 0 ? selectionAnchorInSnippet : 0);
    const selectionEnd = selectionStart + firstDataCell.length;

    window.requestAnimationFrame(() => {
      try {
        if (_edt_table && typeof _edt_table.setSelectionRange === 'function') _edt_table.setSelectionRange(selectionStart, selectionEnd);
        else (_edt_table?.el ?? textarea).setSelectionRange(selectionStart, selectionEnd);
      } catch (e) {}
    });

    note.content = nextContent;
    note.updatedAt = new Date().toISOString();
    note.dirty = true;

    refreshBlockIndexForNote(note);
    refreshHashtagsForNote(note);
    renderMarkdownPreview(note.content, note.id);
    scheduleSave();

    const statusDetails = clamped
      ? `Inserted ${rows}x${columns} table (maximum ${maxInlineTableDimension}x${maxInlineTableDimension}). Adjust the &table command to change the size.`
      : `Inserted ${rows}x${columns} table. Tweak the &table command above to resize.`;
    setStatus(statusDetails, true);
    updateWikiSuggestions(textarea);
    updateHashtagSuggestions(textarea);
  } finally {
    state.suppressInlineCommand = false;
  }

  return true;
};

const applyInlineCommandTrigger = (textarea, note, trigger) => {
  if (!trigger) {
    return false;
  }

  if (trigger.command === 'math') {
    return applyInlineMathTrigger(textarea, note, trigger);
  }

  if (trigger.command === 'code') {
    return applyInlineCodeTrigger(textarea, note, trigger);
  }

  if (trigger.command === 'table') {
    return applyInlineTableTrigger(textarea, note, trigger);
  }

  if (trigger.command === 'matrix') {
    return applyInlineMatrixTrigger(textarea, note, trigger, 'matrix');
  }

  if (trigger.command === 'bmatrix') {
    return applyInlineMatrixTrigger(textarea, note, trigger, 'bmatrix');
  }

  if (trigger.command === 'pmatrix') {
    return applyInlineMatrixTrigger(textarea, note, trigger, 'pmatrix');
  }

  if (trigger.command === 'Bmatrix') {
    return applyInlineMatrixTrigger(textarea, note, trigger, 'Bmatrix');
  }

  if (trigger.command === 'vmatrix') {
    return applyInlineMatrixTrigger(textarea, note, trigger, 'vmatrix');
  }

  if (trigger.command === 'Vmatrix') {
    return applyInlineMatrixTrigger(textarea, note, trigger, 'Vmatrix');
  }

  if (trigger.command === 'quote') {
    return applyInlineQuoteTrigger(textarea, note, trigger);
  }

  return false;
};

const applyInlineCommandTriggerIfNeeded = (textarea, note) => {
  if (!textarea || !note) {
    return false;
  }

  const caret = textarea.selectionStart ?? 0;
  const trigger = detectInlineCommandTrigger(textarea.value, caret, { includeTrailingNewline: true });
  if (!trigger) {
    return false;
  }

  return applyInlineCommandTrigger(textarea, note, trigger);
};

// keyboard handling for editor (simplified)
const handleEditorKeydown = (event) => {
  // Wiki suggestions navigation
  if (state.wikiSuggest.open) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveWikiSuggestionSelection(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveWikiSuggestionSelection(-1);
      return;
    }
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      applyWikiSuggestion(state.wikiSuggest.selectedIndex);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeWikiSuggestions();
      return;
    }
  }

  // Tag suggestions
  if (state.tagSuggest.open) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveHashtagSuggestionSelection(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveHashtagSuggestionSelection(-1);
      return;
    }
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      applyHashtagSuggestion(state.tagSuggest.selectedIndex);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeHashtagSuggestions();
      return;
    }
  }

  // File suggestions
  if (state.fileSuggest.open) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveFileSuggestionSelection(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveFileSuggestionSelection(-1);
      return;
    }
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      applyFileSuggestion(state.fileSuggest.selectedIndex);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeFileSuggestions();
      return;
    }
  }

  if (event.key === 'Escape' && state.search.open) {
    event.preventDefault();
    closeEditorSearch(true);
    return;
  }

  // Inline command Enter handling (only when no suggestions open)
  if (
    event.key === 'Enter' &&
    !event.shiftKey &&
    !event.altKey &&
    !event.metaKey &&
    !event.ctrlKey &&
    !state.wikiSuggest.open &&
    !state.tagSuggest.open &&
    !state.fileSuggest.open
  ) {
    try {
      const edt = getActiveEditorInstance();
      const ta = edt?.el ?? null;
      const note = getActiveNote();
      if (ta && note) {
        const handled = applyInlineCommandTriggerIfNeeded(ta, note);
        if (handled) {
          event.preventDefault();
          return;
        }
      }
    } catch (e) { /* ignore */ }
  }
};

const handleEditorKeyup = (event) => {
  if (event.key === 'Backspace' || event.key === 'Delete') {
    // Resolve the textarea that triggered this event (supports both left/right editors)
    const targetTextarea = event?.target && event.target.tagName === 'TEXTAREA' ? event.target : getActiveEditorInstance().el;
    if (!state.wikiSuggest.open) {
      updateWikiSuggestions(targetTextarea);
    }
    if (!state.tagSuggest.open) {
      updateHashtagSuggestions(targetTextarea);
    }

    // Don't auto-apply inline commands on delete operations to avoid interference
    // const note = getActiveNote();
    // if (note && note.type === 'markdown') {
    //   applyInlineCommandTriggerIfNeeded(event.target, note);
    // }
  }

  // Check for inline command explanations on cursor movement or content changes
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Backspace', 'Delete'].includes(event.key)) {
    checkInlineCommandAtCursor();
    // Update math preview on cursor movement. Use the event target so both
    // left and right editors receive updates when this handler is invoked.
    try {
      const targetTextarea = event?.target && event.target.tagName === 'TEXTAREA' ? event.target : getActiveEditorInstance().el;
      updateMathPreview(targetTextarea);
    } catch (e) {
      try { updateMathPreview(getActiveEditorInstance().el); } catch (e2) {}
    }
  }

  if (state.search.open) {
    const edt = getActiveEditorInstance();
    const textarea = edt?.el ?? null;
    if (textarea) {
      state.search.lastCaret = textarea.selectionStart ?? state.search.lastCaret ?? 0;
    }
  }
  
  // Update stored selection for CMD+E functionality
  const edt2 = getActiveEditorInstance();
  const textarea2 = edt2?.el ?? null;
  if (textarea2) {
    const start = textarea2.selectionStart;
    const end = textarea2.selectionEnd;
    // Note: activeSelections is managed by toggleMathWysiwyg, this is just for reference
  }
};

// Lightweight click handler for the editors to refresh suggestions, ensure the
// clicked editor becomes the active pane, and update cursor-dependent UI.
const handleEditorClick = (event) => {
  // Determine which element was clicked. Prefer currentTarget (listener
  // attachment point) but fall back to event.target.
  const clickedEl = event?.currentTarget || event?.target;

  // Find the nearest pane wrapper to determine pane identity. Dynamic panes
  // include a `data-pane-id` attribute; right/left have known classes.
  let paneId = null;
  try {
    const paneRoot = clickedEl?.closest?.('.editor-pane');
    if (paneRoot) {
      // Prefer explicit dynamic pane id attribute
      if (paneRoot.getAttribute && paneRoot.getAttribute('data-pane-id')) {
        paneId = paneRoot.getAttribute('data-pane-id');
      } else if (paneRoot.classList && paneRoot.classList.contains('editor-pane--right')) {
        paneId = 'right';
      } else {
        paneId = 'left';
      }
    }
  } catch (e) { /* ignore and fallback below */ }

  // Fallback: if clicked element is a known editor textarea, map directly
  if (!paneId) {
    try {
      if (clickedEl === elements.editor || (elements.editor && elements.editor.contains && elements.editor.contains(clickedEl))) paneId = 'left';
      else if (clickedEl === elements.editorRight || (elements.editorRight && elements.editorRight.contains && elements.editorRight.contains(clickedEl))) paneId = 'right';
    } catch (e) { /* ignore */ }
  }

  // Final fallback: use currently active pane or any existing pane
  if (!paneId) paneId = state.activeEditorPane || resolvePaneFallback(true);

  // Activate the resolved pane
  setActiveEditorPane(paneId);

  const targetInstance = editorInstances[paneId] ?? getActiveEditorInstance();
  const targetTextarea = targetInstance?.el ?? null;

  if (targetTextarea) {
    updateWikiSuggestions(targetTextarea);
    updateHashtagSuggestions(targetTextarea);
    updateFileSuggestions(targetTextarea);
    updateMathPreview(targetTextarea);
    // Store selection for other commands
    const start = targetTextarea.selectionStart ?? 0;
    const end = targetTextarea.selectionEnd ?? 0;
  }

  // Ensure file metadata UI reflects the current active pane/note. Use the
  // explicit pane mapping when available so we don't surface unrelated notes.
  const selectedPaneNoteId = state.editorPanes?.[paneId]?.noteId;
  const selectedPaneNote = selectedPaneNoteId ? state.notes.get(selectedPaneNoteId) ?? null : null;
  updateFileMetadataUI(selectedPaneNote, { allowActiveFallback: false });

  // Defensive: some UI flows may still leave the path DOM blank. If we have a
  // concrete note for this pane, ensure the filename/path DOM is explicitly
  // populated here so returning to a pane reliably restores the displayed path.
  if (selectedPaneNote && elements.fileName && elements.filePath) {
    const descriptor = selectedPaneNote.language ? `${selectedPaneNote.title} · ${selectedPaneNote.language.toUpperCase()}` : selectedPaneNote.title;
    elements.fileName.textContent = descriptor;
    const location = selectedPaneNote.absolutePath ?? selectedPaneNote.folderPath ?? selectedPaneNote.storedPath ?? '';
    if (location) {
      const pathParts = location.split(/[/\\]/);
      const filename = pathParts.pop();
      const directory = pathParts.join('/');
      elements.filePath.innerHTML = directory ? `${directory}/<span class="filename">${filename}</span>` : `<span class="filename">${filename}</span>`;
    } else {
      elements.filePath.textContent = 'Stored inside the application library.';
    }
    elements.filePath.title = location;
    elements.fileName.hidden = false;
    elements.fileName.setAttribute('aria-hidden', 'false');
  }
};

// second editor input handling removed

const handleEditorSelect = (event) => {
  // Selection handler should always update the math preview.
  const textarea = event?.target && event.target.tagName === 'TEXTAREA' ? event.target : getActiveEditorInstance().el;
  if (!textarea) return;

  // Update stored caret for search if needed
  try {
    state.search.lastCaret = textarea.selectionStart ?? state.search.lastCaret ?? 0;
  } catch (e) { /* ignore */ }

  // Update stored selection for CMD+E functionality
  try {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    lastSelection = start !== end ? { start, end } : null;
  } catch (e) { /* ignore */ }

  // Always refresh math preview when selection changes
  updateMathPreview(textarea);

  // If search UI is open, also refresh search matches
  if (state.search.open) {
    try {
      const activeEd = getActiveEditorInstance();
      const caret = activeEd?.selectionStart ?? state.search.lastCaret ?? 0;
      updateEditorSearchMatches({ preserveActive: true, caret, focusEditor: false });
    } catch (e) { /* ignore */ }
  }
};

// Minimal blur handler: persist notes and close suggestion UI
const handleEditorBlur = (event) => {
  persistNotes();
  closeWikiSuggestions();
  closeHashtagSuggestions();
  closeFileSuggestions();
};

// Minimal scroll handler used to sync any sticky UI; currently a noop but kept for future logic
const handleEditorScroll = (event) => {
  // Placeholder: could sync preview scroll or position sticky toolbars
};

const handleWikiSuggestionPointerDown = (event) => {
  const target = event.target.closest('.wiki-suggest__item');
  if (!target) {
    return;
  }
  event.preventDefault();
  const index = Number.parseInt(target.dataset.index, 10);
  if (Number.isFinite(index)) {
    state.wikiSuggest.selectedIndex = index;
    renderWikiSuggestions();
    applyWikiSuggestion(index);
  }
};

const handleWikiSuggestionPointerOver = (event) => {
  const target = event.target.closest('.wiki-suggest__item');
  if (!target) {
    return;
  }
  const index = Number.parseInt(target.dataset.index, 10);
  if (Number.isFinite(index) && index !== state.wikiSuggest.selectedIndex) {
    state.wikiSuggest.selectedIndex = index;
    renderWikiSuggestions();
  }
};

const handleHashtagSuggestionPointerDown = (event) => {
  const target = event.target.closest('.wiki-suggest__item');
  if (!target) {
    return;
  }
  event.preventDefault();
  const index = Number.parseInt(target.dataset.index, 10);
  if (Number.isFinite(index)) {
    state.tagSuggest.selectedIndex = index;
    renderHashtagSuggestions();
    applyHashtagSuggestion(index);
  }
};

const handleHashtagSuggestionPointerOver = (event) => {
  const target = event.target.closest('.wiki-suggest__item');
  if (!target) {
    return;
  }
  const index = Number.parseInt(target.dataset.index, 10);
  if (Number.isFinite(index) && index !== state.tagSuggest.selectedIndex) {
    state.tagSuggest.selectedIndex = index;
    renderHashtagSuggestions();
  }
};

const handleSplitterPointerDown = (event) => {
  if (!elements.workspaceSplitter) {
    return;
  }

  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  event.preventDefault();
  state.resizingEditor = true;
  state.splitterPointerId = event.pointerId;
  elements.workspaceSplitter.setPointerCapture(event.pointerId);
  elements.workspaceSplitter.classList.add('workspace__splitter--active');
};

const handleSplitterPointerMove = (event) => {
  if (!state.resizingEditor) {
    return;
  }

  updateEditorRatioFromPointer(event.clientX);
};

const handleSplitterPointerUp = (event) => {
  if (!state.resizingEditor) {
    return;
  }

  state.resizingEditor = false;
  if (elements.workspaceSplitter && state.splitterPointerId !== null) {
    try {
      elements.workspaceSplitter.releasePointerCapture(state.splitterPointerId);
    } catch (error) {
      // ignore
    }
  }
  state.splitterPointerId = null;
  elements.workspaceSplitter?.classList.remove('workspace__splitter--active');
  setEditorRatio(state.editorRatio, true);
};

const handleSplitterKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      setEditorRatio(state.editorRatio - 0.05, true);
      break;
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      setEditorRatio(state.editorRatio + 0.05, true);
      break;
    case 'Home':
      event.preventDefault();
      setEditorRatio(minEditorRatio, true);
      break;
    case 'End':
      event.preventDefault();
      setEditorRatio(maxEditorRatio, true);
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      setEditorRatio(0.5, true);
      break;
    default:
      break;
  }
};

const setSidebarWidth = (width) => {
  const minWidth = 200;
  const maxWidth = 500;
  const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
  
  state.sidebarWidth = clampedWidth;
  document.documentElement.style.setProperty('--sidebar-width', `${clampedWidth}px`);
  
  // Save to storage
  writeStorage(storageKeys.sidebarWidth, String(clampedWidth));
};

const handleSidebarResizePointerDown = (event) => {
  if (!elements.sidebarResizeHandle) {
    return;
  }

  if (event.pointerType === 'mouse' && event.button !== 0) {
    return;
  }

  event.preventDefault();
  state.resizingSidebar = true;
  state.sidebarResizePointerId = event.pointerId;
  elements.sidebarResizeHandle.setPointerCapture(event.pointerId);
  document.body.style.cursor = 'col-resize';
};

const handleSidebarResizePointerMove = (event) => {
  if (!state.resizingSidebar) {
    return;
  }

  setSidebarWidth(event.clientX);
};

const handleSidebarResizePointerUp = (event) => {
  if (!state.resizingSidebar) {
    return;
  }

  state.resizingSidebar = false;
  if (elements.sidebarResizeHandle && state.sidebarResizePointerId !== null) {
    try {
      elements.sidebarResizeHandle.releasePointerCapture(state.sidebarResizePointerId);
    } catch (error) {
      // ignore
    }
  }
  state.sidebarResizePointerId = null;
  document.body.style.cursor = '';
};

// Hashtag panel resize functions
const setHashtagPanelHeight = (height) => {
  const minHeight = 150;
  const maxHeight = 600;
  const clampedHeight = Math.max(minHeight, Math.min(maxHeight, height));
  
  state.hashtagPanelHeight = clampedHeight;
  
  // Set height on the hashtag container instead of explorer
  const hashtagContainer = document.querySelector('.hashtag-container');
  if (hashtagContainer) {
    hashtagContainer.style.height = `${clampedHeight}px`;
  }
};

const handleHashtagPanelResizeStart = (event) => {
  event.preventDefault();
  state.resizingHashtagPanel = true;
  state.hashtagResizePointerId = event.pointerId;
  
  // Store initial mouse position and current height
  const hashtagContainer = document.querySelector('.hashtag-container');
  if (hashtagContainer) {
    state.initialHashtagHeight = hashtagContainer.offsetHeight;
    state.initialMouseY = event.clientY;
  }
  
  elements.hashtagResizeHandle?.setPointerCapture(event.pointerId);
  document.body.style.cursor = 'ns-resize';
};

const handleHashtagPanelResizeMove = (event) => {
  if (!state.resizingHashtagPanel) {
    return;
  }

  try {
    // Compute height based on the container bottom and pointer Y to avoid drift
    const hashtagContainer = document.querySelector('.hashtag-container');
    if (!hashtagContainer) return;
    const rect = hashtagContainer.getBoundingClientRect();
    // bottom is fixed (anchored to bottom of sidebar) so height is bottom - pointerY
    const newHeight = Math.round(rect.bottom - event.clientY);
    setHashtagPanelHeight(newHeight);
  } catch (e) {
    // Fallback: previous delta-based approach
    if (!state.initialMouseY || !state.initialHashtagHeight) return;
    const deltaY = state.initialMouseY - event.clientY;
    const fallbackHeight = state.initialHashtagHeight + deltaY;
    setHashtagPanelHeight(fallbackHeight);
  }
};

const handleHashtagPanelResizeEnd = (event) => {
  if (!state.resizingHashtagPanel) {
    return;
  }
  
  state.resizingHashtagPanel = false;
  if (elements.hashtagResizeHandle && state.hashtagResizePointerId !== null) {
    try {
      elements.hashtagResizeHandle.releasePointerCapture(state.hashtagResizePointerId);
    } catch (error) {
      // ignore
    }
  }
  state.hashtagResizePointerId = null;
  // Clean up the stored resize state
  state.initialMouseY = null;
  state.initialHashtagHeight = null;
  document.body.style.cursor = '';
  try {
    // Persist the chosen height so it can be restored later
    writeStorage('NTA.hashtagPanelHeight', String(state.hashtagPanelHeight));
    // Also clear minimized flag when user resizes manually
    removeStorage('NTA.hashtagPanelMinimized');
  } catch (e) {}
};

const minimizeHashtagPanel = () => {
  try {
    const container = document.querySelector('.hashtag-container');
    if (!container) return;
    // store previous height so restore returns to it
    const current = container.offsetHeight || state.hashtagPanelHeight || 300;
    state.hashtagPrevHeight = current;

    // Animate to minimized height (32px)
    const minimizedHeight = 32;
    // Ensure explicit height to trigger CSS transition
    container.style.height = `${current}px`;
    // Force reflow
    // eslint-disable-next-line no-unused-expressions
    container.offsetHeight;
    container.classList.add('hashtag-minimized');
    container.style.height = `${minimizedHeight}px`;

    writeStorage('NTA.hashtagPanelMinimized', 'true');
    writeStorage('NTA.hashtagPanelPrevHeight', String(state.hashtagPrevHeight));

    // Update toggle button icon/aria
    const toggleBtn = document.getElementById('toggle-hashtag-minimize');
    if (toggleBtn) {
      toggleBtn.textContent = '▴';
      toggleBtn.setAttribute('aria-pressed', 'true');
    }
  } catch (e) {}
};

const restoreHashtagPanel = () => {
  try {
    const container = document.querySelector('.hashtag-container');
    if (!container) return;
    // Animate from current to previous height
    const prev = readStorage('NTA.hashtagPanelPrevHeight');
    const target = prev ? parseInt(prev, 10) : state.hashtagPanelHeight || 300;
    const current = container.offsetHeight || 32;
    container.style.height = `${current}px`;
    // Force reflow
    // eslint-disable-next-line no-unused-expressions
    container.offsetHeight;
    container.classList.remove('hashtag-minimized');
    // Set to target to use the height transition
    container.style.height = `${target}px`;
    // Persist the restored height
    setHashtagPanelHeight(target);
    removeStorage('NTA.hashtagPanelMinimized');

    // Update toggle button icon/aria
    const toggleBtn = document.getElementById('toggle-hashtag-minimize');
    if (toggleBtn) {
      toggleBtn.textContent = '▾';
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
  } catch (e) {}
};

const handleOpenFolder = async () => {
  try {
    // Defensive: ensure the preload/native API is available
    if (!window.api || typeof window.api.chooseFolder !== 'function') {
      setStatus('Cannot open folders: native file-chooser API is unavailable.', false);
      return;
    }

  // Debug prints removed
    const result = await window.api.chooseFolder();
    if (!result) {
      setStatus('Folder selection cancelled.', true);
      return;
    }

      // Use a safe wrapper that catches errors in adoptWorkspace so the UI
      // doesn't become unusable if some helper functions are temporarily missing.
      try {
        safeAdoptWorkspace(result);
      } catch (e) {
        // If safeAdoptWorkspace itself is missing (shouldn't be), fall back to adoptWorkspace
        try { adoptWorkspace(result); } catch (ee) {  }
      }
    if (state.activeNoteId) {
      setStatus('Workspace loaded.', true);
    } else {
      setStatus('Folder opened. Select a file to view it.', true);
    }
  } catch (error) {
    setStatus(getActionableErrorMessage('open', error), false);
  }
};

const extractFileNameFromPath = (fullPath) => {
  if (!fullPath || typeof fullPath !== 'string') {
    return null;
  }
  const segments = fullPath.split(/[\\/]/);
  return segments[segments.length - 1] ?? null;
};

const closeWikiSuggestions = () => {
  if (state.wikiSuggest.timeout) {
    clearTimeout(state.wikiSuggest.timeout);
    state.wikiSuggest.timeout = null;
  }
  state.wikiSuggest.open = false;
  state.wikiSuggest.items = [];
  state.wikiSuggest.selectedIndex = 0;
  state.wikiSuggest.start = 0;
  state.wikiSuggest.end = 0;
  state.wikiSuggest.query = '';
  state.wikiSuggest.embed = false;
  // Ensure position object exists before setting coordinates
  if (!state.wikiSuggest.position || typeof state.wikiSuggest.position !== 'object') {
    state.wikiSuggest.position = { top: 24, left: 24 };
  } else {
    state.wikiSuggest.position.top = 24;
    state.wikiSuggest.position.left = 24;
  }
  state.wikiSuggest.suppress = false;

  const suggestionsElement = elements.wikiSuggestions;
  if (suggestionsElement) {
    suggestionsElement.hidden = true;
    suggestionsElement.innerHTML = '';
    suggestionsElement.removeAttribute('data-open');
    suggestionsElement.removeAttribute('aria-activedescendant');
  }
};

const closeHashtagSuggestions = () => {
  state.tagSuggest.open = false;
  state.tagSuggest.items = [];
  state.tagSuggest.selectedIndex = 0;
  state.tagSuggest.start = 0;
  state.tagSuggest.end = 0;
  state.tagSuggest.query = '';
  state.tagSuggest.position.top = 24;
  state.tagSuggest.position.left = 24;
  state.tagSuggest.suppress = false;

  const suggestionsElement = elements.hashtagSuggestions;
  if (suggestionsElement) {
    suggestionsElement.hidden = true;
    suggestionsElement.innerHTML = '';
    suggestionsElement.removeAttribute('data-open');
    suggestionsElement.removeAttribute('aria-activedescendant');
  }
};

const collectHashtagSuggestionItems = (query) => {
  const normalizedQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';
  const entries = Array.from(state.hashtagIndex.values());
  if (!entries.length) {
    return [];
  }

  const matches = entries
    .filter((entry) => {
      if (!normalizedQuery) {
        return true;
      }
      const preferred = resolvePreferredHashtagForm(entry).toLowerCase();
      return entry.tag.startsWith(normalizedQuery) || preferred.startsWith(normalizedQuery);
    })
    .map((entry) => {
      const preferred = resolvePreferredHashtagForm(entry);
      const display = preferred ? `#${preferred}` : getHashtagDisplayLabel(entry);
      const insert = `#${preferred || entry.tag}`;
      return {
        tag: entry.tag,
        display,
        insert,
        meta: `${formatPlural(entry.noteIds.size, 'note')} · ${formatPlural(entry.occurrences, 'hit')}`,
        sortKey: {
          notes: entry.noteIds.size,
          hits: entry.occurrences,
          label: display.toLowerCase()
        }
      };
    });

  matches.sort((a, b) => {
    if (a.sortKey.notes !== b.sortKey.notes) {
      return b.sortKey.notes - a.sortKey.notes;
    }
    if (a.sortKey.hits !== b.sortKey.hits) {
      return b.sortKey.hits - a.sortKey.hits;
    }
    return a.sortKey.label.localeCompare(b.sortKey.label, undefined, { sensitivity: 'base' });
  });

  return matches.slice(0, 20);
};

const getTextareaCaretCoordinates = (textarea, position) => {
  if (!textarea) {
    return { top: 0, left: 0, lineHeight: 20 };
  }

  // Create a temporary div that exactly mimics the textarea's text rendering
  const div = document.createElement('div');
  const style = window.getComputedStyle(textarea);
  
  // Copy essential text-rendering styles
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.left = '-9999px';
  div.style.top = '-9999px';
  div.style.width = textarea.clientWidth + 'px';
  div.style.height = 'auto';
  div.style.fontFamily = style.fontFamily;
  div.style.fontSize = style.fontSize;
  div.style.fontWeight = style.fontWeight;
  div.style.fontStyle = style.fontStyle;
  div.style.lineHeight = style.lineHeight;
  div.style.letterSpacing = style.letterSpacing;
  div.style.wordSpacing = style.wordSpacing;
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordBreak = 'break-word';
  div.style.padding = '0';
  div.style.margin = '0';
  div.style.border = 'none';
  div.style.boxSizing = 'content-box';

  const textBefore = textarea.value.substring(0, position);
  div.textContent = textBefore;
  
  // Add a span at the cursor position
  const span = document.createElement('span');
  span.textContent = '|'; // Use a visible character to measure
  div.appendChild(span);
  
  document.body.appendChild(div);
  
  // Get the span's position
  const rect = span.getBoundingClientRect();
  const divRect = div.getBoundingClientRect();
  
  const top = rect.top - divRect.top;
  const left = rect.left - divRect.left;
  
  document.body.removeChild(div);
  
  const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
  
  return { top, left, lineHeight };
};

const computeWikiSuggestionPosition = (textarea, caret) => {
  const coords = getTextareaCaretCoordinates(textarea, caret);
  const rect = textarea?.getBoundingClientRect() ?? { top: 0, left: 0 };
  const parentHeight = window.innerHeight;
  const parentWidth = window.innerWidth;
  const estimatedHeight = Math.min(state.wikiSuggest.items.length * 36 + 12, 280);
  const estimatedWidth = Math.min(360, parentWidth - 32);

  let anchorTop = rect.top + coords.top + coords.lineHeight + 6;
  let anchorLeft = rect.left + coords.left;

  if (anchorTop + estimatedHeight > parentHeight - 8) {
    anchorTop = Math.max(8, parentHeight - estimatedHeight - 8);
  }
  if (anchorLeft + estimatedWidth > parentWidth - 8) {
    anchorLeft = Math.max(8, parentWidth - estimatedWidth - 8);
  }
  if (anchorLeft < 8) {
    anchorLeft = 8;
  }
  if (anchorTop < 8) {
    anchorTop = 8;
  }

  if (!state.wikiSuggest.position || typeof state.wikiSuggest.position !== 'object') {
    state.wikiSuggest.position = { top: anchorTop, left: anchorLeft };
  } else {
    state.wikiSuggest.position.top = anchorTop;
    state.wikiSuggest.position.left = anchorLeft;
  }
};

const computeHashtagSuggestionPosition = (textarea, caret) => {
  const coords = getTextareaCaretCoordinates(textarea, caret);
  const rect = textarea?.getBoundingClientRect() ?? { top: 0, left: 0 };
  const parentHeight = window.innerHeight;
  const parentWidth = window.innerWidth;
  const estimatedHeight = Math.min(state.tagSuggest.items.length * 36 + 12, 240);
  const estimatedWidth = Math.min(320, parentWidth - 32);

  let anchorTop = rect.top + coords.top + coords.lineHeight + 6;
  let anchorLeft = rect.left + coords.left;

  if (anchorTop + estimatedHeight > parentHeight - 8) {
    anchorTop = Math.max(8, parentHeight - estimatedHeight - 8);
  }
  if (anchorLeft + estimatedWidth > parentWidth - 8) {
    anchorLeft = Math.max(8, parentWidth - estimatedWidth - 8);
  }
  if (anchorLeft < 8) {
    anchorLeft = 8;
  }
  if (anchorTop < 8) {
    anchorTop = 8;
  }

  state.tagSuggest.position.top = anchorTop;
  state.tagSuggest.position.left = anchorLeft;
};

const renderWikiSuggestions = () => {
  console.log('renderWikiSuggestions called', { open: state.wikiSuggest.open, items: state.wikiSuggest.items?.length });
  const container = elements.wikiSuggestions;
  if (!container) {
    console.log('renderWikiSuggestions: no container');
    return;
  }

  if (!state.wikiSuggest.open || !state.wikiSuggest.items.length) {
    console.log('renderWikiSuggestions: not open or no items, closing');
    closeWikiSuggestions();
    return;
  }
  
  // Debug prints removed
  // Ensure position object exists
  if (!state.wikiSuggest.position || typeof state.wikiSuggest.position !== 'object') {
    state.wikiSuggest.position = { top: 24, left: 24 };
  }
  container.hidden = false;
  container.setAttribute('data-open', 'true');
  console.log('renderWikiSuggestions: showing suggestions at', state.wikiSuggest.position);
  try {
    container.style.top = `${state.wikiSuggest.position.top}px`;
    container.style.left = `${state.wikiSuggest.position.left}px`;
  } catch (e) { /* ignore styling errors in test envs */ }

  const getNotePreview = (noteId) => {
    const note = state.notes.get(noteId);
    if (!note) return '';
    if (note.type === 'markdown') {
      return note.title || 'Markdown note';
    } else {
      return `${note.title || 'Untitled'} (${note.type})`;
    }
  };

  const itemsHtml = state.wikiSuggest.items
    .map((item, index) => {
      const active = index === state.wikiSuggest.selectedIndex;
      const meta = item.meta ? `<div class="wiki-suggest__meta">${escapeHtml(item.meta)}</div>` : '';
      const preview = item.kind === 'note' ? `<div class="wiki-suggest__preview">${getNotePreview(item.noteId)}</div>` : '';
      return `<div class="wiki-suggest__item" id="wiki-suggest-item-${index}" role="option" data-index="${index}" data-active="${
        active ? 'true' : 'false'
      }">
        <div class="wiki-suggest__title">${escapeHtml(item.display)}</div>
        ${meta}
        ${preview}
      </div>`;
    })
    .join('');

  container.innerHTML = itemsHtml;
  container.setAttribute('aria-activedescendant', `wiki-suggest-item-${state.wikiSuggest.selectedIndex}`);

  const activeEl = container.querySelector('[data-active="true"]');
  if (activeEl && typeof activeEl.scrollIntoView === 'function') {
    activeEl.scrollIntoView({ block: 'nearest' });
  }
};

const renderHashtagSuggestions = () => {
  const container = elements.hashtagSuggestions;
  if (!container) {
    return;
  }

  if (!state.tagSuggest.open || !state.tagSuggest.items.length) {
    closeHashtagSuggestions();
    return;
  }

  container.hidden = false;
  container.setAttribute('data-open', 'true');
  container.style.top = `${state.tagSuggest.position.top}px`;
  container.style.left = `${state.tagSuggest.position.left}px`;

  const itemsHtml = state.tagSuggest.items
    .map((item, index) => {
      const active = index === state.tagSuggest.selectedIndex;
      const meta = item.meta ? `<div class="wiki-suggest__meta">${escapeHtml(item.meta)}</div>` : '';
      return `<div class="wiki-suggest__item" id="hashtag-suggest-item-${index}" role="option" data-index="${index}" data-active="${
        active ? 'true' : 'false'
      }">
        <div class="wiki-suggest__title">${escapeHtml(item.display)}</div>
        ${meta}
      </div>`;
    })
    .join('');

  container.innerHTML = itemsHtml;
  container.setAttribute('aria-activedescendant', `hashtag-suggest-item-${state.tagSuggest.selectedIndex}`);

  const activeEl = container.querySelector('[data-active="true"]');
  if (activeEl && typeof activeEl.scrollIntoView === 'function') {
    activeEl.scrollIntoView({ block: 'nearest' });
  }
};

const getHashtagSuggestionTrigger = (value, caret) => {
  if (!value || caret === null || caret === undefined) {
    return null;
  }

  if (caret > value.length) {
    caret = value.length;
  }

  const before = value.slice(0, caret);
  const match = before.match(/(^|[\s([{.,;:!?"'`~+\-*\\/|<>])#([A-Za-z0-9_-]{0,64})$/);
  if (!match) {
    return null;
  }

  const fragment = match[2] ?? '';
  const hashIndex = caret - fragment.length - 1;
  if (hashIndex > 0 && before[hashIndex - 1] === '#') {
    return null;
  }

  return {
    start: hashIndex,
    end: caret,
    query: fragment
  };
};

const openHashtagSuggestions = (trigger, textarea) => {
  const items = collectHashtagSuggestionItems(trigger.query);
  if (!items.length) {
    closeHashtagSuggestions();
    return;
  }

  closeWikiSuggestions();

  state.tagSuggest.open = true;
  state.tagSuggest.items = items;
  state.tagSuggest.selectedIndex = 0;
  state.tagSuggest.start = trigger.start;
  state.tagSuggest.end = trigger.end;
  state.tagSuggest.query = trigger.query;
  state.tagSuggest.suppress = false;

  computeHashtagSuggestionPosition(textarea, trigger.end);
  renderHashtagSuggestions();
};

const updateHashtagSuggestions = (textarea = getActiveEditorInstance().el) => {
  if (!textarea || textarea !== document.activeElement) {
    closeHashtagSuggestions();
    return;
  }

  if (state.tagSuggest.suppress) {
    state.tagSuggest.suppress = false;
    closeHashtagSuggestions();
    return;
  }

  const selectionStart = textarea.selectionStart ?? 0;
  const selectionEnd = textarea.selectionEnd ?? 0;
  if (selectionStart !== selectionEnd) {
    closeHashtagSuggestions();
    return;
  }

  const trigger = getHashtagSuggestionTrigger(textarea.value, selectionStart);
  if (!trigger) {
    closeHashtagSuggestions();
    return;
  }

  if (state.tagSuggest.open && trigger.start === state.tagSuggest.start && trigger.query === state.tagSuggest.query) {
    state.tagSuggest.end = trigger.end;
    computeHashtagSuggestionPosition(textarea, trigger.end);
    renderHashtagSuggestions();
    return;
  }

  openHashtagSuggestions(trigger, textarea);
};

const moveHashtagSuggestionSelection = (delta) => {
  if (!state.tagSuggest.open || !state.tagSuggest.items.length) {
    return;
  }

  const count = state.tagSuggest.items.length;
  const nextIndex = (state.tagSuggest.selectedIndex + delta + count) % count;
  state.tagSuggest.selectedIndex = nextIndex;
  renderHashtagSuggestions();
};

const applyHashtagSuggestion = (index) => {
  if (!state.tagSuggest.open || !state.tagSuggest.items.length) {
    return false;
  }

  const suggestion = state.tagSuggest.items[index] ?? null;
  const _edt_tag = getActiveEditorInstance();
  const _ta_tag = _edt_tag?.el ?? null;
  if (!suggestion || !_ta_tag) {
    return false;
  }

  const start = state.tagSuggest.start;
  const end = state.tagSuggest.end;
  const before = _ta_tag.value.slice(0, start);
  const after = _ta_tag.value.slice(end);
  const replacement = suggestion.insert ?? suggestion.display ?? '';

  const nextValue = `${before}${replacement}${after}`;
  try {
    _edt_tag.setValue(nextValue);
    const caret = before.length + replacement.length;
  try { if (_edt_tag && typeof _edt_tag.setSelectionRange === 'function') _edt_tag.setSelectionRange(caret, caret); else _ta_tag.setSelectionRange(caret, caret); } catch (e) {}
  } catch (e) {
    if (_ta_tag) {
      _ta_tag.value = nextValue;
  try { if (_edt_tag && typeof _edt_tag.setSelectionRange === 'function') _edt_tag.setSelectionRange(before.length + replacement.length, before.length + replacement.length); else _ta_tag.setSelectionRange(before.length + replacement.length, before.length + replacement.length); } catch (err) {}
    }
  }

  state.tagSuggest.suppress = true;
  closeHashtagSuggestions();
  handleEditorInput({ target: _edt_tag.el ?? _ta_tag });
  return true;
};

// File suggestion functions for markdown image/video syntax
const getFileSuggestionTrigger = (value, caret) => {
  if (!value || caret === null || caret === undefined) {
    return null;
  }

  if (caret > value.length) {
    caret = value.length;
  }

  const before = value.slice(0, caret);
  
  // Look for markdown image syntax: ![alt](
  const imageMatch = before.match(/!\[([^\]]*)\]\(([^)]*?)$/);
  if (imageMatch) {
    const [fullMatch, altText, path] = imageMatch;
    const start = caret - path.length;
    return {
      start,
      end: caret,
      query: path,
      type: 'image'
    };
  }

  return null;
};

const updateFileSuggestions = (textarea = getActiveEditorInstance().el) => {
  if (!textarea || textarea !== document.activeElement) {
    closeFileSuggestions();
    return;
  }

  if (state.fileSuggest.suppress) {
    state.fileSuggest.suppress = false;
    closeFileSuggestions();
    return;
  }

  const selectionStart = textarea.selectionStart ?? 0;
  const selectionEnd = textarea.selectionEnd ?? 0;
  if (selectionStart !== selectionEnd) {
    closeFileSuggestions();
    return;
  }

  const trigger = getFileSuggestionTrigger(textarea.value, selectionStart);
  if (!trigger) {
    closeFileSuggestions();
    return;
  }

  if (state.fileSuggest.open && trigger.start === state.fileSuggest.start && trigger.query === state.fileSuggest.query) {
    state.fileSuggest.end = trigger.end;
    computeFileSuggestionPosition(textarea, trigger.end);
    renderFileSuggestions();
    return;
  }

  openFileSuggestions(trigger, textarea);
};

const closeFileSuggestions = () => {
  if (!state.fileSuggest.open) {
    return;
  }

  state.fileSuggest.open = false;
  state.fileSuggest.items = [];
  state.fileSuggest.selectedIndex = 0;
  state.fileSuggest.start = 0;
  state.fileSuggest.end = 0;
  state.fileSuggest.query = '';
  state.fileSuggest.suppress = false;

  const suggestionsElement = elements.fileSuggestions;
  if (suggestionsElement) {
    suggestionsElement.hidden = true;
    suggestionsElement.innerHTML = '';
  }
};

const openFileSuggestions = (trigger, textarea) => {
  const items = collectFileSuggestionItems(trigger.query);
  if (!items.length) {
    closeFileSuggestions();
    return;
  }

  state.fileSuggest.open = true;
  state.fileSuggest.items = items;
  state.fileSuggest.selectedIndex = 0;
  state.fileSuggest.start = trigger.start;
  state.fileSuggest.end = trigger.end;
  state.fileSuggest.query = trigger.query;
  state.fileSuggest.suppress = false;

  computeFileSuggestionPosition(textarea, trigger.end);
  renderFileSuggestions();
};

const collectFileSuggestionItems = (query) => {
  const suggestions = [];
  const normalizedQuery = query.toLowerCase();

  // Collect image, video, and HTML files from notes
  state.notes.forEach((note) => {
    if (!note || (note.type !== 'image' && note.type !== 'video' && note.type !== 'html')) {
      return;
    }

    const fileName = extractFileNameFromPath(note.absolutePath ?? '') ?? '';
    const baseName = fileName.includes('.') ? fileName.split('.').slice(0, -1).join('.') : fileName;
    
    // Score based on how well the query matches
    let score = 0;
    if (fileName.toLowerCase().includes(normalizedQuery)) {
      score = normalizedQuery.length / fileName.length;
    } else if (baseName.toLowerCase().includes(normalizedQuery)) {
      score = normalizedQuery.length / baseName.length * 0.8;
    } else if (normalizedQuery === '') {
      score = 0.1; // Show all files if no query
    } else {
      return; // No match
    }

    suggestions.push({
      kind: 'file',
      noteId: note.id,
      fileName,
      relativePath: fileName,
      display: fileName,
      meta: note.type,
      sortKey: score
    });
  });

  // Sort by score (higher is better) then by name
  suggestions.sort((a, b) => {
    if (a.sortKey !== b.sortKey) {
      return b.sortKey - a.sortKey; // Higher score first
    }
    return a.display.localeCompare(b.display, undefined, { sensitivity: 'base' });
  });

  return suggestions.slice(0, 10); // Limit to 10 suggestions
};

const computeFileSuggestionPosition = (textarea, caret) => {
  if (!textarea || !elements.fileSuggestions) {
    return;
  }

  // Use a more accurate method to get cursor position
  const rect = textarea.getBoundingClientRect();
  const style = window.getComputedStyle(textarea);
  
  // Create a temporary div to measure text position more accurately
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.visibility = 'hidden';
  tempDiv.style.pointerEvents = 'none';
  tempDiv.style.whiteSpace = 'pre-wrap';
  tempDiv.style.wordWrap = 'break-word';
  tempDiv.style.font = style.font;
  tempDiv.style.fontSize = style.fontSize;
  tempDiv.style.fontFamily = style.fontFamily;
  tempDiv.style.lineHeight = style.lineHeight;
  tempDiv.style.padding = style.padding;
  tempDiv.style.border = style.border;
  tempDiv.style.width = style.width;
  tempDiv.style.height = 'auto';
  tempDiv.style.overflow = 'hidden';
  
  // Add text up to cursor position
  const textBeforeCursor = textarea.value.slice(0, caret);
  tempDiv.textContent = textBeforeCursor;
  
  // Add a span to measure the exact cursor position
  const cursorSpan = document.createElement('span');
  cursorSpan.textContent = '|';
  tempDiv.appendChild(cursorSpan);
  
  document.body.appendChild(tempDiv);
  
  const cursorRect = cursorSpan.getBoundingClientRect();
  const tempRect = tempDiv.getBoundingClientRect();
  
  // Calculate position relative to textarea
  const relativeTop = cursorRect.top - tempRect.top;
  const relativeLeft = cursorRect.left - tempRect.left;
  
  document.body.removeChild(tempDiv);
  
  // Position suggestions below the cursor with some offset
  const lineHeight = parseFloat(style.lineHeight) || 20;
  state.fileSuggest.position.top = rect.top + relativeTop + lineHeight + window.scrollY + 4;
  state.fileSuggest.position.left = rect.left + relativeLeft + window.scrollX;
  
  // Ensure suggestions don't go off screen
  const suggestionWidth = 360; // max-width from CSS
  const suggestionHeight = 280; // max-height from CSS
  
  if (state.fileSuggest.position.left + suggestionWidth > window.innerWidth) {
    state.fileSuggest.position.left = window.innerWidth - suggestionWidth - 20;
  }
  
  if (state.fileSuggest.position.top + suggestionHeight > window.innerHeight) {
    // Show above cursor instead
    state.fileSuggest.position.top = rect.top + relativeTop + window.scrollY - suggestionHeight - 4;
  }
};

const renderFileSuggestions = () => {
  if (!elements.fileSuggestions || !state.fileSuggest.open) {
    return;
  }

  const items = state.fileSuggest.items;
  if (!items.length) {
    closeFileSuggestions();
    return;
  }

  elements.fileSuggestions.style.top = `${state.fileSuggest.position.top}px`;
  elements.fileSuggestions.style.left = `${state.fileSuggest.position.left}px`;

  const html = items
    .map((item, index) => {
      const isSelected = index === state.fileSuggest.selectedIndex;
      const icon = item.meta === 'video' ? '🎬' : item.meta === 'html' ? '🌐' : '🖼️';
      return `
        <div class="wiki-suggest__item${isSelected ? ' wiki-suggest__item--selected' : ''}" data-index="${index}">
          <span class="wiki-suggest__icon">${icon}</span>
          <span class="wiki-suggest__text">
            <span class="wiki-suggest__main">${escapeHtml(item.display)}</span>
            ${item.relativePath !== item.display ? `<span class="wiki-suggest__meta">${escapeHtml(item.relativePath)}</span>` : ''}
          </span>
        </div>
      `;
    })
    .join('');

  elements.fileSuggestions.innerHTML = html;
  elements.fileSuggestions.hidden = false;

  // Add click handlers
  elements.fileSuggestions.querySelectorAll('.wiki-suggest__item').forEach((element, index) => {
    element.addEventListener('click', () => {
      applyFileSuggestion(index);
    });
  });
};

const moveFileSuggestionSelection = (delta) => {
  if (!state.fileSuggest.open || !state.fileSuggest.items.length) {
    return;
  }

  const count = state.fileSuggest.items.length;
  const nextIndex = (state.fileSuggest.selectedIndex + delta + count) % count;
  state.fileSuggest.selectedIndex = nextIndex;
  renderFileSuggestions();
};

const applyFileSuggestion = (index) => {
  if (!state.fileSuggest.open || !state.fileSuggest.items.length) {
    return false;
  }

  const suggestion = state.fileSuggest.items[index] ?? null;
  const _edt_file = getActiveEditorInstance();
  const _ta_file = _edt_file?.el ?? null;
  if (!suggestion || !_ta_file) {
    return false;
  }

  const start = state.fileSuggest.start;
  const end = state.fileSuggest.end;
  const before = _ta_file.value.slice(0, start);
  const after = _ta_file.value.slice(end);
  const replacement = suggestion.relativePath;

  const nextValue = `${before}${replacement}${after}`;
  try {
    _edt_file.setValue(nextValue);
    const caret = before.length + replacement.length;
  try { if (_edt_file && typeof _edt_file.setSelectionRange === 'function') _edt_file.setSelectionRange(caret, caret); else _ta_file.setSelectionRange(caret, caret); } catch (e) {}
  } catch (e) {
    if (_ta_file) {
      _ta_file.value = nextValue;
  try { if (_edt_file && typeof _edt_file.setSelectionRange === 'function') _edt_file.setSelectionRange(before.length + replacement.length, before.length + replacement.length); else _ta_file.setSelectionRange(before.length + replacement.length, before.length + replacement.length); } catch (err) {}
    }
  }

  state.fileSuggest.suppress = true;
  closeFileSuggestions();
  handleEditorInput({ target: _edt_file.el ?? _ta_file });
  return true;
};

const computeWikiSuggestionScore = (candidates, variants) => {
  const variantList = Array.isArray(variants) && variants.length ? variants : [''];
  let matched = false;
  let best = Number.POSITIVE_INFINITY;

  candidates.forEach((candidate) => {
    if (!candidate) {
      return;
    }
    const value = candidate.toString().toLowerCase();

    variantList.forEach((variant) => {
      if (variant === null || variant === undefined) {
        return;
      }
      const normalizedVariant = variant.toString().toLowerCase();
      if (!normalizedVariant.length) {
        matched = true;
        best = Math.min(best, 0);
        return;
      }
      const index = value.indexOf(normalizedVariant);
      if (index !== -1) {
        matched = true;
        best = Math.min(best, index);
      }
    });
  });

  return matched ? best : null;
};

const parseWikiSuggestionQuery = (rawQuery) => {
  const raw = typeof rawQuery === 'string' ? rawQuery : '';
  const normalized = raw.trim().toLowerCase();
  const embedless = normalized.startsWith('!') ? normalized.slice(1) : normalized;
  const hashIndex = embedless.indexOf('#');
  const notePart = hashIndex >= 0 ? embedless.slice(0, hashIndex) : embedless;
  const blockPartRaw = hashIndex >= 0 ? embedless.slice(hashIndex + 1) : '';
  const blockPart = blockPartRaw.startsWith('^') ? blockPartRaw.slice(1) : blockPartRaw;

  return {
    raw,
    normalized,
    embedless,
    notePart,
    blockPart,
    isEmpty: embedless.length === 0
  };
};

const buildQueryVariants = (value) => {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!normalized) {
    return [];
  }

  const variants = new Set([normalized]);
  const slug = toWikiSlug(normalized);
  if (slug && slug !== normalized) {
    variants.add(slug);
  }
  const withoutSpaces = normalized.replace(/\s+/g, '');
  if (withoutSpaces && withoutSpaces !== normalized) {
    variants.add(withoutSpaces);
  }
  return Array.from(variants);
};

const collectWikiSuggestionItems = (query) => {
  const parsed = parseWikiSuggestionQuery(query);
  // Debug prints removed
  const suggestions = [];

  const generalVariants = buildQueryVariants(parsed.embedless);
  // Debug prints removed
  if (!generalVariants.length && parsed.isEmpty) {
    generalVariants.push('');
  }

  const noteVariants = buildQueryVariants(parsed.notePart);
  const blockVariants = buildQueryVariants(parsed.blockPart);
  const fallbackNoteVariants = noteVariants.length ? noteVariants : generalVariants.length ? generalVariants : [''];
  const fallbackBlockVariants = blockVariants.length ? blockVariants : generalVariants.length ? generalVariants : [''];

  state.notes.forEach((note) => {
    if (!note) {
      return;
    }

    const title = note.title ?? 'Untitled';
    const fileName = extractFileNameFromPath(note.absolutePath ?? '') ?? '';
    const baseName = stripExtension(fileName);
    const slug = toWikiSlug(title);
    const score = computeWikiSuggestionScore([title, baseName, fileName, slug], fallbackNoteVariants);

    if (!parsed.isEmpty && noteVariants.length && score === null) {
      return;
    }

    suggestions.push({
      kind: 'note',
      noteId: note.id,
      target: title,
      display: title,
      meta: fileName && fileName !== title ? fileName : null,
      sortKey: score ?? 0
    });
  });

  state.blockIndex.forEach((entry) => {
    const note = state.notes.get(entry.noteId);
    if (!note) {
      return;
    }

    const title = note.title ?? 'Untitled';
    const rawLabel = entry.rawLabel ?? entry.label;
    const blockTitle = entry.title ?? null;
    const display = blockTitle ?? `${title} · ^${rawLabel}`;
    const blockCandidates = [blockTitle, rawLabel, rawLabel ? `^${rawLabel}` : null];
    const noteCandidates = [title, `${title} · ^${rawLabel}`];
    const blockScore = computeWikiSuggestionScore(blockCandidates, fallbackBlockVariants);
    const noteScore = computeWikiSuggestionScore(noteCandidates, fallbackNoteVariants);

    if (!parsed.isEmpty && blockVariants.length && blockScore === null) {
      return;
    }
    if (!parsed.isEmpty && !blockVariants.length && noteVariants.length && noteScore === null) {
      return;
    }

    const effectiveScore = (blockScore ?? (noteScore !== null ? noteScore + 0.5 : null) ?? 0) + 0.5;

    const blockMetaParts = [];
    if (blockTitle && title) {
      blockMetaParts.push(title);
    }
    if (rawLabel) {
      blockMetaParts.push(`^${rawLabel}`);
    }

    suggestions.push({
      kind: 'block',
      noteId: note.id,
      blockId: entry.label,
      target: `${title}#^${rawLabel}`,
      display,
      meta: blockMetaParts.join(' · ') || title,
      sortKey: effectiveScore
    });
  });

  // Debug prints removed
  suggestions.sort((a, b) => {
    if (a.sortKey !== b.sortKey) {
      return a.sortKey - b.sortKey;
    }
    if (a.kind !== b.kind) {
      return a.kind === 'note' ? -1 : 1;
    }
    return a.display.localeCompare(b.display, undefined, { sensitivity: 'base' });
  });

  return suggestions.slice(0, 20);
};

const getWikiSuggestionTrigger = (value, caret) => {
  console.log('getWikiSuggestionTrigger called with value:', JSON.stringify(value), 'caret:', caret);
  if (!value || caret === null || caret === undefined) {
    console.log('getWikiSuggestionTrigger: invalid input');
    return null;
  }

  if (caret > value.length) {
    caret = value.length;
  }

  const before = value.slice(0, caret);
  console.log('getWikiSuggestionTrigger: before =', JSON.stringify(before));
  
  const tryTrigger = (prefix, embedType) => {
    const lastOpen = before.lastIndexOf(prefix);
    console.log(`getWikiSuggestionTrigger: trying ${prefix}, lastOpen =`, lastOpen);
    if (lastOpen === -1) return null;

    // Check prefix validity
    if (embedType === 'inline' && lastOpen > 0 && before[lastOpen - 1] === '!') {
      console.log('getWikiSuggestionTrigger: !!![[ detected, invalid');
      return null;
    }
    if (embedType === true && lastOpen > 0 && before[lastOpen - 1] === '!') {
      console.log('getWikiSuggestionTrigger: !![[ detected for ![[, invalid');
      return null;
    }
    if (embedType === false && lastOpen > 0 && (before[lastOpen - 1] === '!' || (lastOpen > 1 && before[lastOpen - 2] === '!' && before[lastOpen - 1] === '!'))) {
      console.log('getWikiSuggestionTrigger: ![[ or !![[ detected for [[, invalid');
      return null;
    }

    const openLength = prefix.length;
    const sinceOpen = before.slice(lastOpen + openLength);
    console.log('getWikiSuggestionTrigger: sinceOpen =', JSON.stringify(sinceOpen));
    if (sinceOpen.includes(']]')) {
      console.log('getWikiSuggestionTrigger: contains ]], invalid');
      return null;
    }
    if (sinceOpen.includes('|')) {
      console.log('getWikiSuggestionTrigger: contains |, invalid');
      return null;
    }
    if (sinceOpen.includes('\n')) {
      console.log('getWikiSuggestionTrigger: contains newline, invalid');
      return null;
    }

    const trigger = {
      start: lastOpen + openLength,
      end: caret,
      query: sinceOpen,
      embed: embedType
    };
    console.log('getWikiSuggestionTrigger: valid trigger', trigger);
    return trigger;
  };

  let trigger = tryTrigger('!![[', 'inline');
  if (!trigger) trigger = tryTrigger('![[', true);
  if (!trigger) trigger = tryTrigger('[[', false);

  if (!trigger) {
    console.log('getWikiSuggestionTrigger: no valid trigger found');
  }
  return trigger;
};

const openWikiSuggestions = (trigger, textarea) => {
  console.log('openWikiSuggestions called', { trigger, textarea: textarea?.id });
  // Defensive: if wiki index appears empty, rebuild it (notes might have been
  // loaded after initial index build or index was cleared). This helps ensure
  // suggestions are available when workspace contents exist.
  try {
    if ((!state.wikiIndex || state.wikiIndex.size === 0) && state.notes && state.notes.size) {
      console.log('openWikiSuggestions: rebuilding wiki index');
      rebuildWikiIndex();
    }
  } catch (e) {}

  const items = collectWikiSuggestionItems(trigger.query);
  console.log('openWikiSuggestions: collected items', items.length, items.map(i => i.display));
  if (!items.length) {
    console.log('openWikiSuggestions: no items, closing');
    closeWikiSuggestions();
    return;
  }

  state.wikiSuggest.open = true;
  state.wikiSuggest.items = items;
  state.wikiSuggest.selectedIndex = 0;
  state.wikiSuggest.start = trigger.start;
  state.wikiSuggest.end = trigger.end;
  state.wikiSuggest.query = trigger.query;
  state.wikiSuggest.embed = trigger.embed;
  state.wikiSuggest.suppress = false;

  computeWikiSuggestionPosition(textarea, trigger.end);
  renderWikiSuggestions();
};

const updateWikiSuggestions = (textarea = getActiveEditorInstance().el, editorType = 'editor1') => {
  console.log('updateWikiSuggestions called', { textarea: textarea?.id, editorType, activeElement: document.activeElement?.id });
  if (!textarea || textarea !== document.activeElement) {
    console.log('updateWikiSuggestions: textarea not active, closing');
    closeWikiSuggestions(editorType);
    return;
  }

  if (state.wikiSuggest.suppress) {
    console.log('updateWikiSuggestions: suppressed');
    state.wikiSuggest.suppress = false;
    closeWikiSuggestions(editorType);
    return;
  }

  const selectionStart = textarea.selectionStart ?? 0;
  const selectionEnd = textarea.selectionEnd ?? 0;
  if (selectionStart !== selectionEnd) {
    console.log('updateWikiSuggestions: selection not collapsed');
    closeWikiSuggestions(editorType);
    return;
  }

  const trigger = getWikiSuggestionTrigger(textarea.value, selectionStart);
  console.log('updateWikiSuggestions: trigger', trigger);
  if (!trigger) {
    if (state.wikiSuggest.timeout) {
      clearTimeout(state.wikiSuggest.timeout);
      state.wikiSuggest.timeout = null;
    }
    closeWikiSuggestions(editorType);
    return;
  }

  try {
  } catch (e) {
  }

  if (state.wikiSuggest.open && trigger.start === state.wikiSuggest.start && trigger.query === state.wikiSuggest.query) {
    console.log('updateWikiSuggestions: updating existing suggestions');
    state.wikiSuggest.end = trigger.end;
    computeWikiSuggestionPosition(textarea, trigger.end, editorType);
    renderWikiSuggestions(editorType);
    return;
  }

  // Clear any pending timeout
  if (state.wikiSuggest.timeout) {
    clearTimeout(state.wikiSuggest.timeout);
  }
  // Delay opening to avoid flickering
  console.log('updateWikiSuggestions: scheduling openWikiSuggestions with delay', window.autocompleteDelay || 300);
  state.wikiSuggest.timeout = setTimeout(() => {
    console.log('updateWikiSuggestions: timeout fired, calling openWikiSuggestions');
    state.wikiSuggest.timeout = null;
    openWikiSuggestions(trigger, textarea);
  }, window.autocompleteDelay || 300);
};

const moveWikiSuggestionSelection = (delta) => {
  if (!state.wikiSuggest.open || !state.wikiSuggest.items.length) {
    return;
  }

  const count = state.wikiSuggest.items.length;
  const nextIndex = (state.wikiSuggest.selectedIndex + delta + count) % count;
  state.wikiSuggest.selectedIndex = nextIndex;
  renderWikiSuggestions();
};

const applyWikiSuggestion = (index) => {
  if (!state.wikiSuggest.open || !state.wikiSuggest.items.length) {
    return false;
  }

  const suggestion = state.wikiSuggest.items[index] ?? null;
  const _edt_wiki = getActiveEditorInstance();
  const _ta_wiki = _edt_wiki?.el ?? null;
  if (!suggestion || !_ta_wiki) {
    return false;
  }

  const start = state.wikiSuggest.start;
  const end = state.wikiSuggest.end;
  // For double-bang trigger (!![[) we show a transient inline "peek" popup
  // near the caret and do NOT modify the textarea contents. For other
  // triggers, preserve existing insertion behavior.
  if (state.wikiSuggest.embed === 'inline') {
    try {
      // Compute the full start index including the opener ("!![[" is 4 chars)
      const openLength = 4;
      const fullStart = Math.max(0, start - openLength);
      const note = suggestion.noteId ? state.notes.get(suggestion.noteId) : null;
      if (note && elements.mathPreviewPopup && elements.mathPreviewPopupContent) {
        // Render the referenced note to sanitized HTML and display in the popup
        const { html } = renderMarkdownToHtml(note.content ?? '', { noteId: note.id }, { collectSourceMap: false });
        try {
          elements.mathPreviewPopupContent.innerHTML = html || '';
        } catch (e) {
          elements.mathPreviewPopupContent.textContent = note.title ?? '';
        }
        // Position the popup at the opener start so it appears near the typed marker
        try {
          positionMathPreviewPopup(_ta_wiki, fullStart);
        } catch (e) {}
        elements.mathPreviewPopup.classList.add('visible');
        elements.mathPreviewPopup.hidden = false;
      }
    } catch (e) {
      // swallow errors and fall back to closing suggestions
    }
    state.wikiSuggest.suppress = true;
    closeWikiSuggestions();
    return true;
  }

  // Default behavior: insert the suggestion target into the textarea
  const before = _ta_wiki.value.slice(0, start);
  const after = _ta_wiki.value.slice(end);
  const replacement = suggestion.target;

  const nextValue = `${before}${replacement}${after}`;

  try {
    _edt_wiki.setValue(nextValue);
    const caret = before.length + replacement.length;
    try { if (_edt_wiki && typeof _edt_wiki.setSelectionRange === 'function') _edt_wiki.setSelectionRange(caret, caret); else _ta_wiki.setSelectionRange(caret, caret); } catch (e) {}
  } catch (e) {
    if (_ta_wiki) {
      _ta_wiki.value = nextValue;
      try { if (_edt_wiki && typeof _edt_wiki.setSelectionRange === 'function') _edt_wiki.setSelectionRange(before.length + replacement.length, before.length + replacement.length); else _ta_wiki.setSelectionRange(before.length + replacement.length, before.length + replacement.length); } catch (err) {}
    }
  }

  state.wikiSuggest.suppress = true;
  closeWikiSuggestions();
  handleEditorInput({ target: _edt_wiki.el ?? _ta_wiki });
  return true;
};

const normalizeNewFileName = (value) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed && !/^\.+$/.test(trimmed) ? trimmed : 'Untitled.md';
};

const createFileInWorkspace = async (rawName = '') => {
  if (!state.currentFolder) {
    setStatus('Open a folder before creating files.', false);
    return false;
  }

  if (typeof window.api?.createMarkdownFile !== 'function') {
    setStatus('File creation is unavailable in this build.', false);
    return false;
  }

  const fileName = normalizeNewFileName(rawName);

  try {
    const result = await window.api.createMarkdownFile({
      folderPath: state.currentFolder,
      fileName
    });

    if (!result) {
      setStatus('Could not create file — check logs.', false);
      return false;
    }

    adoptWorkspace(result, result.createdNoteId ?? null);

    if (result.createdNoteId) {
      openNoteById(result.createdNoteId, true);
      const createdNote = state.notes.get(result.createdNoteId) ?? null;
      const createdTitle = createdNote?.title ?? fileName;
  setStatus(`${createdTitle} created.`, true);
  try { getActiveEditorInstance().focus({ preventScroll: true }); } catch (e) {}
    } else {
      setStatus('File created. Select it from the explorer.', true);
    }

    return true;
  } catch (error) {
    setStatus('Could not create file — check logs.', false);
    return false;
  }
};
const getExtensionFromName = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  const match = value.match(/(\.[^./\\]+)$/);
  return match ? match[1] : '';
};

const renameWikiLinksInContent = (markdown, oldSlug, newBaseName) => {
  if (!markdown || typeof markdown !== 'string') {
    return { content: markdown, changed: false };
  }

  const pattern = /(!)?\[\[([\s\S]+?)\]\]/g;
  let changed = false;

  const replaced = markdown.replace(pattern, (match, embedMarker = '', inner) => {
    const segments = inner.split('|');
    const targetSegment = segments.shift();

    if (!targetSegment) {
      return match;
    }

    const aliasSuffix = segments.length ? `|${segments.join('|')}` : '';
    const trimmedTarget = targetSegment.trim();
    if (!trimmedTarget) {
      return match;
    }

    const arrowMatch = trimmedTarget.match(/\s*->[\s\S]*$/);
    const arrowSuffix = arrowMatch ? arrowMatch[0] : '';
    const targetWithoutArrow = arrowMatch
      ? trimmedTarget.slice(0, trimmedTarget.length - arrowSuffix.length).trimEnd()
      : trimmedTarget;

    const hashIndex = targetWithoutArrow.indexOf('#');
    const basePart = hashIndex >= 0 ? targetWithoutArrow.slice(0, hashIndex) : targetWithoutArrow;
    const trailing = hashIndex >= 0 ? targetWithoutArrow.slice(hashIndex) : '';

    const slug = toWikiSlug(basePart);
    if (!slug || slug !== oldSlug) {
      return match;
    }

    const originalExtension = /\.[^./\\]+$/.test(basePart) ? getExtensionFromName(basePart) : '';
    const replacementBase = originalExtension ? `${newBaseName}${originalExtension}` : newBaseName;
    changed = true;
    return `${embedMarker ?? ''}[[${replacementBase}${trailing}${arrowSuffix}${aliasSuffix}]]`;
  });

  return { content: replaced, changed };
};

const applyWikiLinkRename = async (oldSlug, newBaseName, newFileName) => {
  if (!oldSlug || !newBaseName) {
    return 0;
  }

  const now = new Date().toISOString();
  let changedCount = 0;
  let activeChanged = false;

  state.notes.forEach((note) => {
    if (!note || note.type !== 'markdown') {
      return;
    }

  const { content, changed } = renameWikiLinksInContent(note.content ?? '', oldSlug, newBaseName);
    if (!changed) {
      return;
    }

    note.content = content;
    note.dirty = Boolean(note.absolutePath);
    note.updatedAt = now;
    refreshBlockIndexForNote(note);
    refreshHashtagsForNote(note, { silent: true });

    if (note.id === state.activeNoteId) {
      activeChanged = true;
    }

    changedCount += 1;
  });

  if (activeChanged) {
    const activeNote = getActiveNote();
    if (activeNote) {
      // Update whichever editor currently contains the active note (search all panes)
      let pane = null;
      try {
        if (state.editorPanes && typeof state.editorPanes === 'object') {
          for (const key of Object.keys(state.editorPanes)) {
            if (state.editorPanes[key] && state.editorPanes[key].noteId === activeNote.id) {
              pane = key;
              break;
            }
          }
        }
      } catch (e) { /* ignore */ }
      if (!pane) pane = state.activeEditorPane || resolvePaneFallback(true);
      const instance = editorInstances[pane] ?? getActiveEditorInstance() ?? getAnyEditorInstance();
      if (instance && instance.el) instance.el.value = activeNote.content ?? '';
      renderMarkdownPreview(activeNote.content, activeNote.id);
    }
  }

  if (changedCount) {
    renderHashtagPanel();
  }

  if (changedCount) {
    await persistNotes();
  }

  return changedCount;
};

const canRenameNote = (note) =>
  Boolean(note && note.type === 'markdown' && note.absolutePath && state.currentFolder);

const closeRenameFileForm = (restoreFocus = false) => {
  if (!elements.renameFileForm || !elements.renameFileInput || !elements.fileName) {
    return;
  }

  state.renamingNoteId = null;
  elements.renameFileForm.hidden = true;
  elements.renameFileInput.value = '';
  elements.fileName.hidden = false;
  elements.fileName.setAttribute('aria-hidden', 'false');

  if (restoreFocus) {
    elements.fileName.focus({ preventScroll: true });
  }
};

const openRenameFileForm = () => {
  const note = getActiveNote();
  if (!canRenameNote(note) || !elements.renameFileForm || !elements.renameFileInput || !elements.fileName) {
    return;
  }

  if (state.renamingNoteId === note.id) {
    return;
  }

  state.renamingNoteId = note.id;
  const fileName = extractFileNameFromPath(note.absolutePath) ?? `${note.title}.md`;

  elements.fileName.hidden = true;
  elements.fileName.setAttribute('aria-hidden', 'true');
  elements.renameFileForm.hidden = false;
  elements.renameFileInput.value = fileName;

  window.requestAnimationFrame(() => {
    elements.renameFileInput.select();
    elements.renameFileInput.focus({ preventScroll: true });
  });
};

const renameActiveNote = async (rawName, snapshot = null) => {
  const note = snapshot ?? getActiveNote();
  if (!canRenameNote(note)) {
    setStatus('Only workspace Markdown files can be renamed.', false);
    return false;
  }

  if (typeof window.api?.renameMarkdownFile !== 'function') {
    setStatus('File rename is unavailable in this build.', false);
    return false;
  }

  const newFileName = normalizeNewFileName(rawName);
  const oldFileName = extractFileNameFromPath(note.absolutePath) ?? `${note.title}.md`;

  if (newFileName === oldFileName) {
    setStatus('Name unchanged.', true);
    return true;
  }

  const oldBaseName = stripExtension(oldFileName);
  const oldSlug = toWikiSlug(oldBaseName);

  try {
    const result = await window.api.renameMarkdownFile({
      workspaceFolder: state.currentFolder,
      oldPath: note.absolutePath,
      newFileName
    });

    if (!result) {
      setStatus('Could not rename file — check logs.', false);
      return false;
    }

    const preferredId = result.renamedNoteId ?? null;
    adoptWorkspace(result, preferredId);

    const renamedNote = preferredId ? state.notes.get(preferredId) ?? null : getActiveNote();
    if (!renamedNote) {
      setStatus('File renamed, but the new file could not be selected.', true);
      return true;
    }

    const nextFileName = extractFileNameFromPath(renamedNote.absolutePath) ?? newFileName;
    const newBaseName = stripExtension(nextFileName);
    const changedLinks = await applyWikiLinkRename(oldSlug, newBaseName, nextFileName);

    const linkMessage = changedLinks
      ? ` · Updated ${changedLinks} link${changedLinks === 1 ? '' : 's'}.`
      : '';
    setStatus(`Renamed to ${newBaseName}.${linkMessage}`, true);
    return true;
  } catch (error) {
    const message = typeof error?.message === 'string' && error.message.trim().length
      ? `Could not rename file — ${error.message}`
      : 'Could not rename file — see logs.';
    setStatus(message, false);
    return false;
  }
};

const handleRenameFileFormSubmit = async (event) => {
  event.preventDefault();
  const snapshot = getActiveNote();
  const proposedName = elements.renameFileInput?.value ?? '';
  closeRenameFileForm(false);
  const renamed = await renameActiveNote(proposedName, snapshot);
  if (!renamed) {
    openRenameFileForm();
  }
};

const handleRenameInputKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeRenameFileForm(true);
  }
};

const handleRenameInputBlur = () => {
  if (state.renamingNoteId) {
    closeRenameFileForm(true);
  }
};

const handleFileNameDoubleClick = () => {
  openRenameFileForm();
};

const handleFileNameKeyDown = (event) => {
  if (event.key === 'Enter' || event.key === 'F2') {
    event.preventDefault();
    openRenameFileForm();
  }
};

const handleCreateFileButtonClick = (event) => {
  event.preventDefault();
  closeRenameFileForm(false);
  void createFileInWorkspace('');
};

const insertCodeBlockAtCursor = (languageInput = '') => {
  const note = getActiveNote();
  if (!note || note.type !== 'markdown') {
    setStatus('Code blocks can only be inserted into Markdown files.', false);
    return false;
  }

  if (!elements.editor) {
    return false;
  }

  const language = typeof languageInput === 'string' ? languageInput.trim() : '';

  if (language) {
    state.lastCodeLanguage = language;
    persistLastCodeLanguage(language);
  }

  const textarea = getActiveEditorInstance()?.el ?? null;
  const content = note.content ?? '';
  const start = textarea.selectionStart ?? content.length;
  const end = textarea.selectionEnd ?? start;

  const fence = '```';
  const openingLine = `${fence}${language ? language : ''}`;
  const placeholder = language ? `# ${language} code` : '# code';
  const closingLine = fence;

  const before = content.slice(0, start);
  const after = content.slice(end);

  const needsLeadingNewline = before.length > 0 && !before.endsWith('\n');
  const needsTrailingNewline = after.length > 0 && !after.startsWith('\n');

  const snippetCore = `${openingLine}\n${placeholder}\n${closingLine}\n`;
  const snippet = `${needsLeadingNewline ? '\n' : ''}${snippetCore}${needsTrailingNewline ? '\n' : ''}`;
  const nextContent = `${before}${snippet}${after}`;

  note.content = nextContent;
  note.dirty = true;
  note.updatedAt = new Date().toISOString();

  const _edt_codeblock = getActiveEditorInstance();
  const _ta_codeblock = _edt_codeblock?.el ?? textarea;
  if (_ta_codeblock) {
    _ta_codeblock.value = nextContent;
    try { _ta_codeblock.focus({ preventScroll: true }); } catch (e) { try { _ta_codeblock.focus(); } catch (e2) {} }
  }
  const placeholderStart = start + (needsLeadingNewline ? 1 : 0) + openingLine.length + 1;
  const placeholderEnd = placeholderStart + placeholder.length;
  window.requestAnimationFrame(() => {
    try {
      if (_edt_codeblock && typeof _edt_codeblock.setSelectionRange === 'function') _edt_codeblock.setSelectionRange(placeholderStart, placeholderEnd);
      else (_edt_codeblock?.el ?? textarea).setSelectionRange(placeholderStart, placeholderEnd);
    } catch (e) {}
  });

  refreshBlockIndexForNote(note);
  refreshHashtagsForNote(note);
  renderMarkdownPreview(note.content, note.id);
  scheduleSave();
  setStatus('Inserted code block. Replace the placeholder with your code.', true);
  return true;
};

const highlightSelectedText = () => {
  const note = getActiveNote();
  if (!note || note.type !== 'markdown') {
    setStatus('Text highlighting can only be used in Markdown files.', false);
    return false;
  }

  if (!elements.editor) {
    return false;
  }
  const textarea = getActiveEditorInstance()?.el ?? null;
  const content = note.content ?? '';
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? start;

  // Check if there's selected text
  if (start === end) {
    setStatus('Select text to highlight it.', false);
    return false;
  }

  const selectedText = content.slice(start, end);
  
  // Check if the selection is already highlighted - either by being surrounded by ==
  // or by containing == markers within the selection
  const before = content.slice(0, start);
  const after = content.slice(end);
  
  // Check if selection is surrounded by == markers
  const isSurroundedByMarkers = before.endsWith('==') && after.startsWith('==');
  
  // Check if selection contains == markers (user selected highlighted text including markers)
  const containsStartMarker = selectedText.startsWith('==');
  const containsEndMarker = selectedText.endsWith('==');
  const containsBothMarkers = containsStartMarker && containsEndMarker && selectedText.length > 4;
  
  // Check if selection is inside highlighted text (most common case)
  const isInsideHighlight = before.endsWith('==') && after.startsWith('==');
  
  let newContent;
  let newCursorPos;
  
  if (isSurroundedByMarkers || isInsideHighlight) {
    // Remove highlighting - selection is surrounded by markers
    const beforeWithoutMarker = before.slice(0, -2);
    const afterWithoutMarker = after.slice(2);
    newContent = beforeWithoutMarker + selectedText + afterWithoutMarker;
    newCursorPos = { start: beforeWithoutMarker.length, end: beforeWithoutMarker.length + selectedText.length };
    setStatus('Removed highlighting.', true);
  } else if (containsBothMarkers) {
    // Remove highlighting - selection contains the markers
    const textWithoutMarkers = selectedText.slice(2, -2);
    newContent = before + textWithoutMarkers + after;
    newCursorPos = { start: start, end: start + textWithoutMarkers.length };
    setStatus('Removed highlighting.', true);
  } else {
    // Add highlighting
    const highlightedText = `==${selectedText}==`;
    newContent = before + highlightedText + after;
    newCursorPos = { start: start + 2, end: end + 2 };
    setStatus('Added highlighting.', true);
  }

  note.content = newContent;
  note.dirty = true;
  note.updatedAt = new Date().toISOString();

  const _edt_highlight = getActiveEditorInstance();
  const _ta_highlight = _edt_highlight?.el ?? textarea;
  if (_ta_highlight) {
    _ta_highlight.value = newContent;
    try { _ta_highlight.focus({ preventScroll: true }); } catch (e) { try { _ta_highlight.focus(); } catch (e2) {} }
  }
  // Restore selection with new position
  window.requestAnimationFrame(() => {
    try {
      if (_edt_highlight && typeof _edt_highlight.setSelectionRange === 'function') _edt_highlight.setSelectionRange(newCursorPos.start, newCursorPos.end);
      else (_edt_highlight?.el ?? textarea).setSelectionRange(newCursorPos.start, newCursorPos.end);
    } catch (e) {}
  });

  refreshBlockIndexForNote(note);
  refreshHashtagsForNote(note);
  renderMarkdownPreview(note.content, note.id);
  scheduleSave();
  return true;
};

// Inline Chat Functions
const toggleInlineChat = () => {
  if (state.inlineChat.open) {
    closeInlineChat();
  } else {
    openInlineChat();
  }
};

const openInlineChat = () => {
  if (!elements.inlineChat) {
    return;
  }

  state.inlineChat.open = true;
  
  // Create and show overlay
  const overlay = document.createElement('div');
  overlay.className = 'inline-chat-overlay';
  overlay.addEventListener('click', (event) => {
    // Only close if clicking the overlay itself, not elements inside it
    if (event.target === overlay) {
      closeInlineChat();
    }
  });
  document.body.appendChild(overlay);
  state.inlineChat.overlay = overlay;
  
  // Show chat widget
  elements.inlineChat.hidden = false;
  
  // Render initial state if no messages
  if (state.inlineChat.messages.length === 0) {
    renderChatMessages();
  }
  
  // Focus input
  if (elements.inlineChatInput) {
    elements.inlineChatInput.focus();
  }
  
  setStatus('Inline chat opened. Type your message and press Enter.', true);
};

const closeInlineChat = () => {
  if (!state.inlineChat.open) {
    return;
  }
  
  state.inlineChat.open = false;
  
  // Hide chat widget
  if (elements.inlineChat) {
    elements.inlineChat.hidden = true;
  }
  
  // Remove overlay
  if (state.inlineChat.overlay) {
    state.inlineChat.overlay.remove();
    state.inlineChat.overlay = null;
  }
  
  // Focus back to active editor
  try { getActiveEditorInstance().focus(); } catch (e) { /* ignore */ }
};

const addChatMessage = (content, sender = 'user') => {
  const message = {
    id: Date.now(),
    content,
    sender,
    timestamp: new Date()
  };
  
  state.inlineChat.messages.push(message);
  renderChatMessages();
  
  // Scroll to bottom
  if (elements.inlineChatMessages) {
    elements.inlineChatMessages.scrollTop = elements.inlineChatMessages.scrollHeight;
  }
};

const renderChatMessages = () => {
  if (!elements.inlineChatMessages) {
    return;
  }
  
  if (state.inlineChat.messages.length === 0) {
    elements.inlineChatMessages.innerHTML = `
      <div class="inline-chat__empty">
        <div class="inline-chat__empty-icon">💬</div>
        <div class="inline-chat__empty-text">
          Start a conversation!<br>
          Ask a question or describe what you want to do.
        </div>
      </div>
    `;
    return;
  }
  
  const messagesHtml = state.inlineChat.messages.map(message => {
    const timeStr = message.timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return `
      <div class="inline-chat__message inline-chat__message--${message.sender}">
        <div class="inline-chat__message-bubble">
          ${escapeHtml(message.content)}
        </div>
        <div class="inline-chat__message-time">${timeStr}</div>
      </div>
    `;
  }).join('');
  
  elements.inlineChatMessages.innerHTML = messagesHtml;
};

const executeInlineCommandFromChat = (commandText) => {
  const note = getActiveNote();
  if (!note || note.type !== 'markdown') {
    addChatMessage("I can only execute commands in Markdown files. Please open a Markdown note first.", 'assistant');
    return;
  }
  
  const edt = getActiveEditorInstance();
  const ta = edt?.el ?? null;
  if (!ta) {
    addChatMessage("Editor not available. Please try again.", 'assistant');
    return;
  }

  // Create a fake text with the command at the cursor position to simulate detection
  const cursorPos = ta.selectionStart || ta.value.length;
  const beforeCursor = ta.value.slice(0, cursorPos);
  const afterCursor = ta.value.slice(cursorPos);
  
  // Add the command on a new line if needed
  const needsNewline = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
  const fakeText = beforeCursor + (needsNewline ? '\n' : '') + commandText + '\n' + afterCursor;
  const fakeCaretPos = beforeCursor.length + (needsNewline ? 1 : 0) + commandText.length;
  
  // Try to detect the inline command
  const trigger = detectInlineCommandTrigger(fakeText, fakeCaretPos, { includeTrailingNewline: true });
  
  if (trigger) {
    // Adjust trigger positions to match the real editor
    const realTrigger = {
      ...trigger,
      start: cursorPos + (needsNewline ? 1 : 0),
      end: cursorPos + (needsNewline ? 1 : 0) + commandText.length + (trigger.consumedNewline ? 1 : 0)
    };
    
  // Insert the command text first
  const currentValue = ta.value;
  const newValue = currentValue.slice(0, cursorPos) + 
          (needsNewline ? '\n' : '') + 
          commandText + 
          (trigger.consumedNewline ? '\n' : '') + 
          currentValue.slice(cursorPos);

  try { ta.value = newValue; } catch (e) { edt.setValue(newValue); }

  // Now execute the command on the active textarea
  const success = applyInlineCommandTrigger(ta, note, realTrigger);
    
    if (success) {
      addChatMessage(`Executed: ${commandText}`, 'assistant');
      // Close the chat after successful command execution
      setTimeout(() => {
        closeInlineChat();
      }, 1000);
    } else {
      // If command failed, revert the text insertion
  try { ta.value = currentValue; } catch (e) { edt.setValue(currentValue); }
      addChatMessage(`Failed to execute: ${commandText}`, 'assistant');
    }
  } else {
    addChatMessage(`Invalid command: ${commandText}. Try commands like '&table 4x4', '&code python', '&math', etc.`, 'assistant');
  }
};

const handleChatSend = () => {
  if (!elements.inlineChatInput) {
    return;
  }
  
  const content = elements.inlineChatInput.value.trim();
  if (!content) {
    return;
  }
  
  // Add user message
  addChatMessage(content, 'user');
  
  // Clear input
  elements.inlineChatInput.value = '';
  autoResizeChatInput();
  
  // Check if it's an inline command (starts with &)
  if (content.startsWith('&')) {
    executeInlineCommandFromChat(content);
    return;
  }
  
  // Try to parse as natural language command
  const parsedCommand = parseNaturalLanguageCommand(content);
  
  if (parsedCommand) {
    // Execute the parsed command
    executeNaturalLanguageCommand(parsedCommand);
  } else {
    // If no command was recognized, provide a helpful response
    addChatMessage("I understand commands like:\n• 'Create a 4x4 table'\n• 'Add a python code block'\n• 'Make a 3x3 bmatrix'\n• 'Insert a quote'\n• 'Generate a math block'\n• 'Export as PDF' or 'Export as HTML'\n\nYou can also use inline commands like '&table 4x4'.", 'assistant');
  }
};

const handleChatInputKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleChatSend();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeInlineChat();
  }
};

const autoResizeChatInput = () => {
  if (!elements.inlineChatInput) {
    return;
  }
  
  const input = elements.inlineChatInput;
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
};

// Natural Language Command Parser
const parseNaturalLanguageCommand = (text) => {
  const normalizedText = text.toLowerCase().trim();
  
  // Table patterns
  const tablePatterns = [
    // "create a 4x4 table", "make a 3x5 table"
    /(?:create|make|generate|add|insert).*?(\d+)\s*[x×]\s*(\d+)\s*table/i,
    // "4x4 table", "table 4x4"
    /(?:(\d+)\s*[x×]\s*(\d+)\s*table|table\s*(\d+)\s*[x×]\s*(\d+))/i,
    // "4x4table", "table4x4"
    /(?:(\d+)[x×](\d+)table|table(\d+)[x×](\d+))/i
  ];
  
  for (const pattern of tablePatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      // Extract rows and columns from different capture groups
      const rows = match[1] || match[3] || match[5];
      const cols = match[2] || match[4] || match[6];
      
      if (rows && cols) {
        return {
          type: 'table',
          command: 'table',
          args: `${rows}x${cols}`,
          rows: parseInt(rows),
          cols: parseInt(cols)
        };
      }
    }
  }
  
  // Matrix patterns
  const matrixPatterns = [
    // "create a 3x3 bmatrix", "make a 2x4 pmatrix"
    /(?:create|make|generate|add|insert).*?(\d+)\s*[x×]\s*(\d+)\s*(matrix|bmatrix|pmatrix|Bmatrix|vmatrix|Vmatrix)/i,
    // "3x3 bmatrix", "bmatrix 3x3"
    /(?:(\d+)\s*[x×]\s*(\d+)\s*(matrix|bmatrix|pmatrix|Bmatrix|vmatrix|Vmatrix)|(matrix|bmatrix|pmatrix|Bmatrix|vmatrix|Vmatrix)\s*(\d+)\s*[x×]\s*(\d+))/i,
    // "3x3bmatrix", "bmatrix3x3"
    /(?:(\d+)[x×](\d+)(matrix|bmatrix|pmatrix|Bmatrix|vmatrix|Vmatrix)|(matrix|bmatrix|pmatrix|Bmatrix|vmatrix|Vmatrix)(\d+)[x×](\d+))/i
  ];
  
  for (const pattern of matrixPatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      // Extract matrix type and dimensions from different capture groups
      const rows = match[1] || match[5] || match[7];
      const cols = match[2] || match[6] || match[8];
      const matrixType = match[3] || match[4] || match[9] || match[10];
      
      if (rows && cols && matrixType) {
        return {
          type: 'matrix',
          command: matrixType.toLowerCase(),
          args: `${rows}x${cols}`,
          rows: parseInt(rows),
          cols: parseInt(cols),
          matrixType: matrixType
        };
      }
    }
  }
  
  // Code block patterns
  const codePatterns = [
    // "create a python code block", "add javascript code"
    /(?:create|make|generate|add|insert).*?(python|javascript|js|html|css|java|cpp|c\+\+|php|ruby|go|rust|swift|kotlin|typescript|ts|bash|shell|sql|json|xml|yaml|markdown|md)\s*(?:code|block)/i,
    // "python code", "code python"
    /(?:(python|javascript|js|html|css|java|cpp|c\+\+|php|ruby|go|rust|swift|kotlin|typescript|ts|bash|shell|sql|json|xml|yaml|markdown|md)\s*code|code\s*(python|javascript|js|html|css|java|cpp|c\+\+|php|ruby|go|rust|swift|kotlin|typescript|ts|bash|shell|sql|json|xml|yaml|markdown|md))/i,
    // "code block"
    /(?:create|make|generate|add|insert).*?code\s*block/i,
    /code\s*block/i
  ];
  
  for (const pattern of codePatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      const language = match[1] || match[2] || '';
      return {
        type: 'code',
        command: 'code',
        args: language,
        language: language
      };
    }
  }
  
  // Math block patterns
  const mathPatterns = [
    /(?:create|make|generate|add|insert).*?math/i,
    /math\s*(?:block|equation|formula)/i,
    /(?:equation|formula)\s*block/i
  ];
  
  for (const pattern of mathPatterns) {
    if (normalizedText.match(pattern)) {
      return {
        type: 'math',
        command: 'math',
        args: ''
      };
    }
  }
  
  // Quote patterns
  const quotePatterns = [
    // "create a quote", "add a quote from Einstein"
    /(?:create|make|generate|add|insert).*?quote(?:\s+(?:from|by)\s+(.+))?/i,
    // "quote from Einstein"
    /quote(?:\s+(?:from|by)\s+(.+))?/i,
    // "blockquote"
    /blockquote/i
  ];
  
  for (const pattern of quotePatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      const author = match[1] || '';
      return {
        type: 'quote',
        command: 'quote',
        args: author.trim(),
        author: author.trim()
      };
    }
  }
  
  // Export patterns
  const exportPatterns = [
    // "export as PDF", "export as HTML", "convert to PDF", "export PDF", "export HTML"
    /(?:export|convert)\s*(?:as|to)?\s*(pdf|html)/i,
    // "PDF export", "HTML export"
    /(pdf|html)\s*export/i,
    // Just "PDF" or "HTML"
    /^(pdf|html)$/i
  ];
  
  for (const pattern of exportPatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      const format = match[1].toLowerCase();
      return {
        type: 'export',
        command: 'export',
        args: format,
        format: format
      };
    }
  }

  return null;
};

// Inline Command Explanation System
const showInlineCommandExplanation = (commandInfo) => {
  const explanations = {
    'table': (args) => {
      const dims = args ? ` (${args})` : '';
      return `Table command${dims} - Creates a markdown table with the specified dimensions. Example: &table 4x3`;
    },
    'bmatrix': (args) => {
      const dims = args ? ` (${args})` : '';
      return `Bracket Matrix${dims} - Creates a mathematical matrix with square brackets. Example: &bmatrix 3x3`;
    },
    'pmatrix': (args) => {
      const dims = args ? ` (${args})` : '';
      return `Parentheses Matrix${dims} - Creates a mathematical matrix with parentheses. Example: &pmatrix 2x4`;
    },
    'vmatrix': (args) => {
      const dims = args ? ` (${args})` : '';
      return `Vertical Matrix${dims} - Creates a mathematical matrix with vertical bars (determinant). Example: &vmatrix 3x3`;
    },
    'Bmatrix': (args) => {
      const dims = args ? ` (${args})` : '';
      return `Brace Matrix${dims} - Creates a mathematical matrix with curly braces. Example: &Bmatrix 2x2`;
    },
    'Vmatrix': (args) => {
      const dims = args ? ` (${args})` : '';
      return `Double Vertical Matrix${dims} - Creates a mathematical matrix with double vertical bars. Example: &Vmatrix 3x3`;
    },
    'matrix': (args) => {
      const dims = args ? ` (${args})` : '';
      return `Plain Matrix${dims} - Creates a mathematical matrix without delimiters. Example: &matrix 2x3`;
    },
    'code': (args) => {
      const lang = args ? ` (${args})` : '';
      return `Code Block${lang} - Creates a syntax-highlighted code block. Example: &code python`;
    },
    'math': () => {
      return `Math Block - Creates a LaTeX mathematical equation block. Example: &math`;
    },
    'quote': (args) => {
      const author = args ? ` (${args})` : '';
      return `Quote Block${author} - Creates a blockquote with optional attribution. Example: &quote Einstein`;
    },
    'export': (args) => {
      const format = args ? ` (${args.toUpperCase()})` : '';
      return `Export${format} - Exports the current note as PDF or HTML. Example: export PDF, export HTML`;
    }
  };

  const explanation = explanations[commandInfo.command];
  if (explanation) {
    const message = explanation(commandInfo.argument);
    setStatus(message, false, true); // Non-transient, mark as command explanation
  }
};

const checkInlineCommandAtCursor = () => {
  const note = getActiveNote();
  const edt = getActiveEditorInstance();
  const textarea = edt?.el ?? null;
  if (!note || note.type !== 'markdown' || !textarea) {
    // Clear any existing command explanation
    if (state.currentCommandExplanation) {
      state.currentCommandExplanation = null;
      setStatus('Ready.', false, true); // Clear with command explanation flag
    }
    return;
  }
  const cursorPos = textarea.selectionStart;
  const value = textarea.value;
  
  // Get the current line
  const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1;
  const lineEnd = value.indexOf('\n', cursorPos);
  const actualLineEnd = lineEnd === -1 ? value.length : lineEnd;
  const currentLine = value.slice(lineStart, actualLineEnd);
  
  // Check if there's an inline command on this line
  const inlineCommandPattern = /^(\s*)&(?<command>[a-zA-Z]+)(?:\s+(?<argument>.+?))?(?:\s*)$/;
  const match = currentLine.match(inlineCommandPattern);
  
  if (match && match.groups) {
    const commandInfo = {
      command: match.groups.command,
      argument: match.groups.argument?.trim() || ''
    };
    
    // Only update if this is a different command than currently shown
    const commandKey = `${commandInfo.command}:${commandInfo.argument}`;
    if (state.currentCommandExplanation !== commandKey) {
      state.currentCommandExplanation = commandKey;
      showInlineCommandExplanation(commandInfo);
    }
  } else {
    // No command on current line, clear explanation
    if (state.currentCommandExplanation) {
      state.currentCommandExplanation = null;
      setStatus('Ready.', false, true); // Clear with command explanation flag
    }
  }
};

const executeNaturalLanguageCommand = (parsedCommand) => {
  if (!parsedCommand) {
    return false;
  }
  
  const note = getActiveNote();
  if (!note || note.type !== 'markdown') {
    addChatMessage("I can only execute commands in Markdown files. Please open a Markdown note first.", 'assistant');
    return true;
  }
  
  // Handle export commands specially - they execute immediately
  if (parsedCommand.type === 'export') {
    executeExportCommand(parsedCommand.format);
    return true;
  }
  
  const edt = getActiveEditorInstance();
  const ta = edt?.el ?? null;
  if (!ta) {
    addChatMessage("Editor not available. Please try again.", 'assistant');
    return true;
  }

  // Get current cursor position
  const cursorPos = ta.selectionStart || ta.value.length;
  const beforeCursor = ta.value.slice(0, cursorPos);
  const afterCursor = ta.value.slice(cursorPos);
  
  // Create the inline command text
  const commandText = `&${parsedCommand.command} ${parsedCommand.args}`.trim();
  
  // Insert on a new line if needed
  const needsNewline = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
  const newValue = beforeCursor + 
                  (needsNewline ? '\n' : '') + 
                  commandText + 
                  afterCursor;
  
  // Update the active editor
  if (edt && edt.el) {
    try { edt.el.value = newValue; } catch (e) { edt.setValue(newValue); }
    // Position cursor at the end of the inserted command
    const newCursorPos = cursorPos + (needsNewline ? 1 : 0) + commandText.length;
    try { edt.el.selectionStart = newCursorPos; edt.el.selectionEnd = newCursorPos; } catch (e) {}
    // Focus the editor
    try { edt.focus(); } catch (e) {}
    // Trigger the inline command execution by simulating Enter key press
    setTimeout(() => {
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      });
      try { edt.el.dispatchEvent(enterEvent); } catch (e) {}
    }, 100);
  }
  
  // Provide feedback and close chat
  let message = '';
  switch (parsedCommand.type) {
    case 'table':
      message = `Created a ${parsedCommand.rows}×${parsedCommand.cols} table.`;
      break;
    case 'matrix':
      message = `Created a ${parsedCommand.rows}×${parsedCommand.cols} ${parsedCommand.matrixType}.`;
      break;
    case 'code':
      message = parsedCommand.language ? 
        `Created a ${parsedCommand.language} code block.` : 
        'Created a code block.';
      break;
    case 'math':
      message = 'Created a math block.';
      break;
    case 'quote':
      message = parsedCommand.author ? 
        `Created a quote${parsedCommand.author ? ` attributed to ${parsedCommand.author}` : ''}.` : 
        'Created a quote block.';
      break;
    default:
      message = 'Command executed successfully.';
  }
  
  addChatMessage(message, 'assistant');
  
  // Close the chat after inserting the command
  setTimeout(() => {
    closeInlineChat();
  }, 1000);
  
  return true;
};

const executeExportCommand = async (format) => {
  const note = getActiveNote();
  if (!note || note.type !== 'markdown') {
    addChatMessage("I can only export Markdown files. Please open a Markdown note first.", 'assistant');
    return;
  }
  
  addChatMessage(`Starting ${format.toUpperCase()} export...`, 'assistant');
  
  try {
    let success = false;
    if (format === 'pdf') {
      success = await exportActivePreviewAsPdf();
    } else if (format === 'html') {
      success = await exportActivePreviewAsHtml();
    }
    
    if (success) {
      addChatMessage(`Successfully exported as ${format.toUpperCase()}!`, 'assistant');
    } else {
      addChatMessage(`Failed to export as ${format.toUpperCase()}. Please try again.`, 'assistant');
    }
  } catch (error) {
    addChatMessage(`Error during ${format.toUpperCase()} export: ${error.message}`, 'assistant');
  }
  
  // Close the chat after a delay
  setTimeout(() => {
    closeInlineChat();
  }, 2000);
};

const openCodePopover = (prefill = state.lastCodeLanguage ?? '') => {
  const note = getActiveNote();
  if (!note || note.type !== 'markdown') {
    setStatus('Code blocks can only be inserted into Markdown files.', false);
    return;
  }

  if (!elements.codePopover || !elements.codePopoverInput) {
    insertCodeBlockAtCursor(prefill);
    return;
  }

  state.codePopoverOpen = true;
  elements.codePopover.hidden = false;
  elements.codePopover.setAttribute('aria-hidden', 'false');

  window.requestAnimationFrame(() => {
    elements.codePopoverInput.value = prefill;
    elements.codePopoverInput.select();
    elements.codePopoverInput.focus({ preventScroll: true });
  });
};

const closeCodePopover = (restoreFocus = true) => {
  if (!state.codePopoverOpen) {
    return;
  }

  state.codePopoverOpen = false;

  if (elements.codePopover) {
    elements.codePopover.hidden = true;
    elements.codePopover.setAttribute('aria-hidden', 'true');
  }

  if (restoreFocus) {
    const activeEd = getActiveEditorInstance();
    try { activeEd.focus({ preventScroll: true }); } catch (e) { /* fallback */ try { editorInstances.left?.focus?.({ preventScroll: true }); } catch (e2) {} }
  }
};

const handleCodePopoverSubmit = (event) => {
  event.preventDefault();
  const language = elements.codePopoverInput?.value ?? '';
  const inserted = insertCodeBlockAtCursor(language);
  if (inserted) {
    closeCodePopover(false);
  }
};

const handleCodePopoverSuggestionClick = (event) => {
  const button = event.target.closest('[data-language]');
  if (!button) {
    return;
  }
  event.preventDefault();
  const language = button.dataset.language ?? '';
  if (elements.codePopoverInput) {
    elements.codePopoverInput.value = language;
    elements.codePopoverInput.focus({ preventScroll: true });
    const caret = language.length;
    elements.codePopoverInput.setSelectionRange(caret, caret);
  }
};

const handleCodePopoverOutsidePointerDown = (event) => {
  if (!state.codePopoverOpen || !elements.codePopover) {
    return;
  }

  if (elements.codePopover.contains(event.target)) {
    return;
  }

  if (elements.insertCodeBlockButton?.contains(event.target)) {
    return;
  }

  closeCodePopover(false);
};

const handleCodePopoverKeydown = (event) => {
  if (!state.codePopoverOpen) {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closeCodePopover();
  }
};

const handleInsertCodeBlockButton = (event) => {
  event.preventDefault();

  if (event.altKey) {
    if (insertCodeBlockAtCursor(state.lastCodeLanguage ?? '')) {
      closeCodePopover(false);
    }
    return;
  }

  if (state.codePopoverOpen) {
    closeCodePopover(false);
  } else {
    openCodePopover();
  }
};

const handleExportPreviewClick = async (event) => {
  event.preventDefault();
  await exportActivePreviewAsPdf();
};

const handleExportPreviewHtmlClick = async (event) => {
  event.preventDefault();
  await exportActivePreviewAsHtml();
};

const handleExportImageClick = async (format, event) => {
  event.preventDefault();
  await exportActivePreviewAsImage(format);
};

const handleGlobalShortcuts = (event) => {
  if (!event.metaKey && !event.ctrlKey) {
    return;
  }

  const key = event.key.toLowerCase();
  const target = event.target;
  const targetSupportsMatches = Boolean(target && typeof target.matches === 'function');
  const activeEditorEl = getActiveEditorInstance()?.el;
  const isEditorTarget = target === activeEditorEl;
  const isSearchInputTarget = target === elements.editorSearchInput;
  const isEditableTarget =
    targetSupportsMatches && target.matches('input, textarea, [contenteditable="true"]');
  const isOtherEditableTarget = isEditableTarget && !isEditorTarget && !isSearchInputTarget;

  if (key === 'o') {
    event.preventDefault();
    handleOpenFolder();
  } else if (key === 'n') {
    event.preventDefault();
    closeRenameFileForm(false);
    void createFileInWorkspace('');
  } else if (key === 'b') {
    event.preventDefault();
    if (event.shiftKey) {
      togglePreviewCollapsed();
    } else {
      toggleSidebarCollapsed();
    }
  } else if (key === 'e') {
    event.preventDefault();
    event.stopPropagation();
    // Open the export dropdown via the open helper so we can focus the preferred option
    openExportDropdown();

    // Remember current focus and selection so we can restore it if user presses Escape
    const prevFocused = document.activeElement;
    let prevSelection = null;
    try {
      if (prevFocused && (prevFocused.tagName === 'TEXTAREA' || prevFocused.tagName === 'INPUT')) {
        prevSelection = { start: prevFocused.selectionStart, end: prevFocused.selectionEnd };
      }
    } catch (e) {}

    // Move keyboard focus away from the editor and onto the preferred export option
    setTimeout(() => {
      try {
        // Blur whatever currently has focus (e.g., editor textarea)
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }

        const preferred = readStorage(storageKeys.defaultExportFormat) || elements.defaultExportFormatSelect?.value || '';
        const map = { pdf: 'export-pdf-option', html: 'export-html-option', docx: 'export-docx-option', epub: 'export-epub-option' };
        const prefId = map[('' + preferred).toLowerCase()];
        let target = null;
        if (prefId) target = document.getElementById(prefId);
        // fallback to first button in the menu
        if (!target) target = document.querySelector('#export-dropdown-menu button');
        if (target) {
          try { target.setAttribute('tabindex', '0'); } catch (e) {}
          try { target.focus(); } catch (e) {}

          // Install a one-time keydown listener so pressing Enter immediately after Cmd+E
          // activates the preferred export option instead of inserting text in the editor.
          const onKey = (ev) => {
            if (ev.key === 'Enter' || ev.key === 'Return') {
              try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
              try { target.click(); } catch (e) {}
              try { closeExportDropdown(); } catch (e) {}
              window.removeEventListener('keydown', onKey, true);
              window.removeEventListener('keydown', onEsc, true);
            }
          };
          const onEsc = (ev) => {
            if (ev.key === 'Escape') {
              try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
              try { closeExportDropdown(); } catch (e) {}
              // Restore previous focus and selection if possible
              try {
                if (prevFocused && typeof prevFocused.focus === 'function') {
                  prevFocused.focus();
                  if (prevSelection && typeof prevFocused.setSelectionRange === 'function') {
                    try { prevFocused.setSelectionRange(prevSelection.start, prevSelection.end); } catch (ee) {}
                  }
                }
              } catch (ee) {}
              window.removeEventListener('keydown', onKey, true);
              window.removeEventListener('keydown', onEsc, true);
            }
          };
          window.addEventListener('keydown', onKey, true);
          window.addEventListener('keydown', onEsc, true);
        }
      } catch (e) {
        // ignore
      }
    }, 50);
  } else if (key === 'l') {
  // Use current editor selection for CMD+L functionality (math WYSIWYG toggle)
  const hasSelection = activeEditorEl && activeEditorEl.selectionStart !== activeEditorEl.selectionEnd;
    event.preventDefault();
    if (window.toggleMathWysiwyg) {
      window.toggleMathWysiwyg(hasSelection);
    }
  } else if (key === 't' && event.shiftKey) {
    event.preventDefault();
    showTemplatesModal();
  } else if (key === 't') {
    event.preventDefault();
    generateTableOfContents();
  } else if (key === 'i') {
    // Cmd/Ctrl+I toggles inline chat when Shift is held; otherwise toggle preview scroll sync
    event.preventDefault();
    if (event.shiftKey) {
      toggleInlineChat();
    } else {
      // Toggle preview scroll sync
      state.previewScrollSync = !state.previewScrollSync;
      try {
        setStatus(`Preview scroll sync ${state.previewScrollSync ? 'enabled' : 'disabled'}.`, true);
      } catch (e) {}
      try { applyPreviewScrollSync(state.previewScrollSync); } catch (e) {}
    }
  } else if (key === 'f') {
    if (isOtherEditableTarget) {
      return;
    }
    event.preventDefault();
    openEditorSearch({ focusInput: true, useSelection: true });
  } else if (key === 'g') {
    if (isOtherEditableTarget) {
      return;
    }
    if (!state.search.open && !state.search.query) {
      return;
    }
    event.preventDefault();
    const direction = event.shiftKey ? -1 : 1;
    moveEditorSearch(direction, { focusEditor: isEditorTarget });
  } else if (key === 'h') {
    if (isOtherEditableTarget) {
      return;
    }
    event.preventDefault();
    if (isEditorTarget) {
      highlightSelectedText();
    }
  } else if (event.shiftKey && key === 'c') {
    event.preventDefault();
    if (event.altKey) {
      if (insertCodeBlockAtCursor(state.lastCodeLanguage ?? '')) {
        closeCodePopover(false);
      }
    } else if (state.codePopoverOpen) {
      closeCodePopover();
    } else {
      openCodePopover();
    }
  }
};

const restoreLastWorkspace = async () => {
  const folderPath = getPersistedWorkspaceFolder();
  if (!folderPath) {
    return;
  }

  if (typeof window.api?.loadWorkspaceAtPath !== 'function') {
    return;
  }

  try {
    // Get file size limits from settings
    const fileSizeLimits = {
      image: parseInt(readStorage('NTA.maxImageSize') || '10') * 1024 * 1024,
      video: parseInt(readStorage('NTA.maxVideoSize') || '100') * 1024 * 1024,
      script: parseInt(readStorage('NTA.maxScriptSize') || '5') * 1024 * 1024
    };
    
    const result = await window.api.loadWorkspaceAtPath({ folderPath, fileSizeLimits });
    if (result) {
      try {
        safeAdoptWorkspace(result);
        setStatus('Restored last workspace.', true);
      } catch (e) {
        try { adoptWorkspace(result); setStatus('Restored last workspace.', true); } catch (ee) { persistLastWorkspaceFolder(null); setStatus('Could not reopen the last workspace folder.', false); }
      }
    }
  } catch (error) {
    persistLastWorkspaceFolder(null);
    setStatus('Could not reopen the last workspace folder.', false);
  }
};

// Attach or detach scroll-sync between the active editor and the global preview
const applyPreviewScrollSync = (enable) => {
  // Remove any previous handler
  try {
    if (state._previewSyncHandler && state._previewSyncHandler.detach) state._previewSyncHandler.detach();
  } catch (e) {}
  state._previewSyncHandler = null;

  if (!enable) return;

  const attach = () => {
    const editorInst = getActiveEditorInstance();
    const previewEl = elements.preview;
    if (!editorInst || !editorInst.el || !previewEl) return null;

    // Smooth RAF-driven updater. We capture the latest editor fraction on events
    // and animate the preview.scrollTop toward the target each frame. This avoids
    // running expensive layout calculations on every key event and provides a
    // smooth visual result.
    let running = true;
    let latestFraction = 0;

    const calcFraction = () => {
      try {
        const ta = editorInst.el;
        latestFraction = ta.scrollTop / Math.max(1, ta.scrollHeight - ta.clientHeight);
        if (!Number.isFinite(latestFraction)) latestFraction = 0;
      } catch (e) { latestFraction = 0; }
    };

    // Frame loop with fallback for environments without requestAnimationFrame
    const raf = typeof window.requestAnimationFrame === 'function' ? window.requestAnimationFrame.bind(window) : (cb) => setTimeout(cb, 16);
    const caf = typeof window.cancelAnimationFrame === 'function' ? window.cancelAnimationFrame.bind(window) : (id) => clearTimeout(id);

    let rafId = null;
    const ease = 0.25; // interpolation factor for smoothing (0-1)

    const tick = () => {
      try {
        if (!running) return;
        const target = Math.round(latestFraction * Math.max(0, previewEl.scrollHeight - previewEl.clientHeight));
        const cur = previewEl.scrollTop || 0;
        const next = Math.round(cur + (target - cur) * ease);
        if (Math.abs(next - cur) > 0) previewEl.scrollTop = next;
      } catch (e) {}
      rafId = raf(tick);
    };

    // Attach listeners: scroll and input are sufficient and cheaper than key events
    const eventHandler = () => { try { calcFraction(); } catch (e) {} };
    taAddListeners(editorInst.el, ['scroll', 'input'], eventHandler);
    // Initialize fraction and start loop
    calcFraction();
    rafId = raf(tick);

    return {
      detach: () => {
        try { running = false; if (rafId) caf(rafId); } catch (e) {}
        try { taRemoveListeners(editorInst.el, ['scroll', 'input'], eventHandler); } catch (e) {}
      }
    };
  };

  // Helper to add/remove listeners safely
  const taAddListeners = (el, events, fn) => {
    if (!el) return;
    events.forEach((ev) => { try { el.addEventListener(ev, fn, { passive: true }); } catch (e) {} });
  };
  const taRemoveListeners = (el, events, fn) => {
    if (!el) return;
    events.forEach((ev) => { try { el.removeEventListener(ev, fn, { passive: true }); } catch (e) {} });
  };

  // Attach now and also re-attach on pane switches
  state._previewSyncHandler = attach();
  // If getActiveEditorInstance changes later, listen for pane activation to re-attach
  // We will rely on setActiveEditorPane re-focusing to call this when toggled again.
};

const activateWikiLinkElement = (element) => {
  if (!element) {
    return;
  }

  const noteId = element.dataset.noteId ?? null;
  const target = element.dataset.wikiTarget ?? element.textContent ?? '';
  const blockId = element.dataset.blockId ?? null;
  const blockMissing = element.dataset.blockMissing === 'true';

  if (noteId) {
    if (blockMissing && blockId) {
      setStatus(`Block ^${blockId} not found in target note.`, false);
    }
    openNoteById(noteId, false, blockMissing ? null : blockId ?? null);
  } else {
    setStatus(`No file found for [[${target}]].`, false);
  }
};

const activateWikiEmbedElement = (element) => {
  if (!element) {
    return;
  }

  const noteId = element.dataset.noteId ?? null;
  if (!noteId) {
    return;
  }

  const blockId = element.dataset.blockId ?? null;
  const blockMissing = element.dataset.blockMissing === 'true' || element.classList.contains('wikilink-embed--missing');
  openNoteById(noteId, false, blockMissing ? null : blockId ?? null);
};

const handlePreviewClick = (event) => {
  const target = event.target.closest('.wikilink');
  if (target) {
    event.preventDefault();
    activateWikiLinkElement(target);
    return;
  }

  const header = event.target.closest('.wikilink-embed__header[data-note-id]');
  if (header) {
    event.preventDefault();
    activateWikiEmbedElement(header);
    return;
  }

  const embed = event.target.closest('.wikilink-embed[data-note-id]');
  if (embed) {
    event.preventDefault();
    activateWikiEmbedElement(embed);
    return;
  }

  if (event.button !== 0) {
    return;
  }

  if (event.target.closest('a[href]')) {
    return;
  }

  const blockElement = event.target.closest('[data-source-block-id]');
  if (blockElement) {
    const selection = window.getSelection();
    const hasSelection = selection && !selection.isCollapsed;

    if (hasSelection) {
      const anchorNode = selection.anchorNode;
      const focusNode = selection.focusNode;
      if (!blockElement.contains(anchorNode) || !blockElement.contains(focusNode)) {
        return;
      }
    }

    const metaPressed = event.metaKey || event.ctrlKey;
    if (!metaPressed && !hasSelection) {
      return;
    }

    event.preventDefault();

    focusEditorFromPreviewElement(blockElement, { useSelection: true });
  }
};

const handlePreviewDoubleClick = (event) => {
  const blockElement = event.target.closest('[data-source-block-id]');
  if (!blockElement) {
    return;
  }

  const selection = window.getSelection();
  const hasSelection = selection && !selection.isCollapsed;

  if (hasSelection) {
    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;
    if (!blockElement.contains(anchorNode) || !blockElement.contains(focusNode)) {
      return;
    }
  }

  const metaPressed = event.metaKey || event.ctrlKey;
  if (!metaPressed && !hasSelection) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const success = focusEditorFromPreviewElement(blockElement, { useSelection: true });
  if (success) {
    highlightPreviewElement(blockElement);
  }
};

const handlePreviewKeyDown = (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return;
  }

  const target = event.target.closest('.wikilink');
  if (target) {
    event.preventDefault();
    activateWikiLinkElement(target);
    return;
  }

  const header = event.target.closest('.wikilink-embed__header[data-note-id]');
  if (header) {
    event.preventDefault();
    activateWikiEmbedElement(header);
    return;
  }

  const embed = event.target.closest('.wikilink-embed[data-note-id]');
  if (embed) {
    event.preventDefault();
    activateWikiEmbedElement(embed);
    return;
  }

  const blockElement = event.target.closest('[data-source-block-id]');
  if (blockElement) {
    event.preventDefault();
    focusEditorFromPreviewElement(blockElement, { useSelection: false });
  }
};

const createInlineCommandExtension = () => ([
  {
    name: 'inlineCommand',
    level: 'block',
    start(src) {
      const match = inlineCommandStartRegex.exec(src);
      return match ? match.index : undefined;
    },
    tokenizer(src) {
      const match = inlineCommandLineRegex.exec(src);
      if (!match) {
        return undefined;
      }
      return {
        type: 'inlineCommand',
        raw: match[0]
      };
    },
    renderer() {
      return '';
    }
  }
]);

const createMathExtensions = () => {
  if (!window.katex) {
    return [];
  }

  const renderMath = (content, displayMode) => {
    try {
      const out = renderLatexSync(content, { throwOnError: false, displayMode });
      return out || content;
    } catch (error) {
      return content;
    }
  };

  const blockMath = {
    name: 'mathBlock',
    level: 'block',
    start(src) {
      const match = src.match(/\$\$/);
      return match ? match.index : undefined;
    },
    tokenizer(src) {
      const rule = /^\$\$([\s\S]+?)\$\$(\n+|$)/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'mathBlock',
          raw: match[0],
          text: match[1].trim()
        };
      }
      return undefined;
    },
    renderer(token) {
      const sourceAttr = escapeHtmlAttribute(token.text);
      return `<section class="math-block" data-math-source="${sourceAttr}" tabindex="0">${renderMath(
        token.text,
        true
      )}</section>\n`;
    }
  };

  const inlineMath = {
    name: 'mathInline',
    level: 'inline',
    start(src) {
      const match = src.match(/\$/);
      return match ? match.index : undefined;
    },
    tokenizer(src) {
      if (src[0] !== '$' || src[1] === '$') {
        return undefined;
      }
      const rule = /^\$((?:\\.|[^$\\\n])+?)\$(?!\$)/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'mathInline',
          raw: match[0],
          text: match[1].replace(/\\\$/g, '$')
        };
      }
      return undefined;
    },
    renderer(token) {
      const sourceAttr = escapeHtmlAttribute(token.text);
      return `<span class="math-inline" data-math-source="${sourceAttr}">${renderMath(token.text, false)}</span>`;
    }
  };

  return [blockMath, inlineMath];
};

const getWikiTargetPresentation = (token, targetInfo) => {
  const alias = typeof token?.alias === 'string' ? token.alias.trim() : '';
  const note = targetInfo?.noteId ? state.notes.get(targetInfo.noteId) ?? null : null;
  const blockEntry = targetInfo?.blockEntry ?? null;
  const blockId = targetInfo?.blockId ?? null;
  const hasBlock = Boolean(blockId);
  const labelDisplay = blockEntry?.rawLabel ?? blockId ?? null;
  // Replace any hyphens in the block label with spaces so titles like
  // "some-label" become "some label" when shown in embed headers.
  const labelDisplaySanitized = typeof labelDisplay === 'string' && labelDisplay.length
    ? labelDisplay.replace(/-/g, ' ')
    : labelDisplay;
  const blockTitle = blockEntry?.title ?? null;

  let display = alias;

  if (!display) {
    if (hasBlock) {
      if (blockTitle) {
        display = blockTitle;
      } else if (labelDisplay && note?.title) {
        // Prefer showing the block label first (with hyphens converted to
        // spaces), then the file it comes from, e.g. "my label, My File".
        display = `${labelDisplaySanitized}, ${note.title}`;
      } else if (labelDisplay) {
        display = `${labelDisplaySanitized}`;
      } else if (note?.title) {
        display = note.title;
      } else {
        display = token?.target ?? '';
      }
    } else if (note?.title) {
      display = note.title;
    } else {
      display = token?.target ?? '';
    }
  }

  const metaParts = [];
  if (hasBlock) {
    // Build a concise meta label for block references. Prefer showing the
    // block label first, then the file it comes from, e.g. "label, File Name".
    if (labelDisplay && note?.title) {
      metaParts.push(`${labelDisplaySanitized}, ${note.title}`);
    } else if (labelDisplay) {
      metaParts.push(`${labelDisplaySanitized}`);
    } else if (note?.title) {
      metaParts.push(note.title);
    }
  }

  // Remove any leading hyphen/dash that might have been introduced into
  // a block display or meta (some inputs or previous formatting added
  // a leading "- "). Normalize both the visible display and the meta
  // parts so embedded titles don't start with a stray dash.
  if (typeof display === 'string') {
    display = display.replace(/^\s*-\s*/, '');
  }
  for (let i = 0; i < metaParts.length; i++) {
    if (typeof metaParts[i] === 'string') metaParts[i] = metaParts[i].replace(/^\s*-\s*/, '');
  }

  return {
    display,
    meta: metaParts.join(' · ') || null,
    noteTitle: note?.title ?? null,
    alias,
    blockLabel: labelDisplay,
    blockTitle,
    hasBlock
  };
};

const renderWikiLinkSpan = ({
  noteId,
  targetAttr,
  display,
  extraClass = '',
  blockId = null,
  blockMissing = false
}) => {
  const classes = ['wikilink'];
  if (extraClass) {
    classes.push(extraClass);
  }
  if (!noteId || blockMissing) {
    classes.push('wikilink--missing');
  }

  const attributes = [];
  if (noteId) {
    attributes.push(`data-note-id="${noteId}"`);
  }
  attributes.push(`data-wiki-target="${targetAttr}"`);
  if (blockId) {
    attributes.push(`data-block-id="${blockId}"`);
  }
  if (blockMissing) {
    attributes.push('data-block-missing="true"');
  }

  return `<span class="${classes.join(' ')}" ${attributes.join(' ')} role="link" tabindex="0">${display}</span>`;
};

const renderInlineEmbed = (token, targetInfo, context) => {
  const { noteId } = targetInfo;
  const targetAttr = escapeHtml(token.target);

  if (!noteId) {
    // If no note found, render as broken link
    return `<span class="wikilink wikilink--missing" data-wiki-target="${targetAttr}" role="link" tabindex="0">${escapeHtml(token.target)}</span>`;
  }

  const note = state.notes.get(noteId);
  if (!note) {
    return `<span class="wikilink wikilink--missing" data-wiki-target="${targetAttr}" role="link" tabindex="0">${escapeHtml(token.target)}</span>`;
  }

  if (note.type === 'image') {
    const rawSrc = escapeHtml(note.absolutePath ?? note.storedPath ?? '');
    const baseAlt = note.title || token.target;
    const safeAlt = escapeHtml(baseAlt ?? '');
    return `<img src="${rawSrc}" alt="${safeAlt}" data-note-id="${noteId}" data-raw-src="${rawSrc}" loading="lazy" style="max-width: 100%; height: auto;" />`;
  }

  if (note.type === 'video') {
    const rawSrc = escapeHtml(note.absolutePath ?? note.storedPath ?? '');
    const baseAlt = note.title || token.target;
    const safeAlt = escapeHtml(baseAlt ?? '');
    return `<video data-raw-src="${rawSrc}" data-note-id="${noteId}" controls preload="metadata" style="max-width: 100%; height: auto;">
      <source src="${rawSrc}" type="video/mp4">
      ${safeAlt}
    </video>`;
  }

  // For other types, handle inline embed specially: when the token is an
  // inline embed (!![[...]]), we render the referenced note's HTML inline
  // inside the preview so the preview shows the referenced content as if
  // it were written in-place (useful for equations and small snippets).
  // Images and videos are handled above; for markdown content we'll render
  // the note's markdown to HTML and insert it directly.
  try {
    const renderContext = context ?? { depth: 0, visited: new Set() };
    const depth = (renderContext.depth ?? 0) + 1;
    const visited = new Set(renderContext.visited ?? []);
    // Prevent infinite recursion
    if (visited.has(noteId) || depth > maxWikiEmbedDepth) {
      // Fallback to a link noting the circular reference
      return `<span class="wikilink wikilink--missing" data-wiki-target="${escapeHtml(token.target)}">${escapeHtml(token.target)}</span>`;
    }
    visited.add(noteId);

    // Render the referenced note's markdown to sanitized HTML and return it.
    const { html: inlinedHtml } = renderMarkdownToHtml(note.content ?? '', { noteId: note.id, depth, visited }, { collectSourceMap: false });
    // Wrap in a span to allow styling and to mark it as an inlined wikilink
    return `<span class="wikilink-inline-embedded" data-note-id="${noteId}" data-wiki-target="${escapeHtml(token.target)}">${inlinedHtml}</span>`;
  } catch (e) {
    // On error, fall back to a simple link
    return renderWikiLinkSpan({
      noteId: noteId,
      targetAttr: escapeHtml(token.target),
      display: escapeHtml(note.title || token.target),
      extraClass: 'wikilink--inline-peek',
      blockId: null,
      blockMissing: false
    });
  }
};

const renderWikiEmbed = (token, targetInfo, context) => {
  const presentation = getWikiTargetPresentation(token, targetInfo);
  const display = escapeHtml(presentation.display);
  const baseMeta = presentation.meta;
  const targetAttr = escapeHtml(token.target);
  const { noteId, blockId, hasBlock } = targetInfo;
  const renderContext = context ?? { depth: 0, visited: new Set() };
  const depth = (renderContext.depth ?? 0) + 1;

  const composeMeta = (...parts) => parts.filter(Boolean).join(' · ') || null;

  const buildHeader = (
    headerNoteId,
    meta,
    extraClass = 'wikilink--embed',
    blockMissing = false,
    includeBaseMeta = true
  ) => {
    const metaText = includeBaseMeta ? composeMeta(baseMeta, meta) : meta;
    const metaLabel = metaText ? `<span class="wikilink-embed__meta">${escapeHtml(metaText)}</span>` : '';
    const headerAttributes = ['class="wikilink-embed__header"'];
    headerAttributes.push(`data-wiki-target="${targetAttr}"`);
    headerAttributes.push(`data-block-missing="${blockMissing ? 'true' : 'false'}"`);
    if (blockId) {
      headerAttributes.push(`data-block-id="${blockId}"`);
    }
    if (headerNoteId) {
      headerAttributes.push(`data-note-id="${headerNoteId}"`);
      headerAttributes.push('role="link"');
      headerAttributes.push('tabindex="0"');
    }

    return `<header ${headerAttributes.join(' ')}>${renderWikiLinkSpan({
      noteId: headerNoteId,
      targetAttr,
      display,
      extraClass,
      blockId,
      blockMissing
    })}${metaLabel}</header>`;
  };

  if (!noteId) {
    // If no note found but target looks like an HTML resource, render as iframe embed
    try {
      const ext = getFileExtension(token.target || '') || '';
      if (ext && htmlExtensions.has(ext.toLowerCase())) {
        const iframeId = `html-embed-${Math.random().toString(36).substr(2, 9)}`;
        const attributes = [
          `id="${iframeId}"`,
          `data-raw-src="${escapeHtml(token.target)}"`,
          'sandbox="allow-scripts allow-forms allow-popups"',
          'loading="lazy"',
          'class="html-embed-iframe"'
        ];
        return `<iframe ${attributes.join(' ')}>Your browser does not support iframes.</iframe>`;
      }
    } catch (e) {
      // fall through to missing note handling
    }
    const header = buildHeader(null, 'Missing note', 'wikilink--embed', false, false);
    const message = escapeHtml(`No note found for [[${token.target}]]. Click the link above to create it.`);
    return `<section class="wikilink-embed wikilink-embed--missing" data-wiki-target="${targetAttr}">
      ${header}
      <div class="wikilink-embed__body"><p class="wikilink-embed__message">${message}</p></div>
    </section>`;
  }

  const note = state.notes.get(noteId);
  if (!note) {
    const header = buildHeader(null, 'Not available', 'wikilink--embed', false, false);
    const message = escapeHtml(`[[${token.target}]] exists in the index but is not loaded yet.`);
    return `<section class="wikilink-embed wikilink-embed--error" data-wiki-target="${targetAttr}">
      ${header}
      <div class="wikilink-embed__body"><p class="wikilink-embed__message">${message}</p></div>
    </section>`;
  }

  if (blockId && !hasBlock) {
    const header = buildHeader(noteId, 'Missing block', 'wikilink--embed', true);
    const message = escapeHtml(`Block ^${blockId} was not found in ${note.title}.`);
    return `<section class="wikilink-embed wikilink-embed--missing" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-block-id="${blockId}" data-block-missing="true">
      ${header}
      <div class="wikilink-embed__body"><p class="wikilink-embed__message">${message}</p></div>
    </section>`;
  }

  const visited = new Set(renderContext.visited ?? []);
  if (visited.has(noteId) || depth > maxWikiEmbedDepth) {
    const header = buildHeader(noteId, 'Circular reference');
    const message = escapeHtml(`Cannot embed [[${token.target}]] because it would create a loop.`);
    return `<section class="wikilink-embed wikilink-embed--error" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
      ${header}
      <div class="wikilink-embed__body"><p class="wikilink-embed__message">${message}</p></div>
    </section>`;
  }

  if (blockId && renderContext.noteId && renderContext.noteId === noteId) {
    const header = buildHeader(noteId, 'Self reference');
    const message = escapeHtml('Embedding a block from the same note is not supported.');
    return `<section class="wikilink-embed wikilink-embed--error" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-block-id="${blockId}">
      ${header}
      <div class="wikilink-embed__body"><p class="wikilink-embed__message">${message}</p></div>
    </section>`;
  }

  visited.add(noteId);

  if (blockId) {
    if (note.type !== 'markdown') {
      const header = buildHeader(noteId, 'Unsupported block target');
      const message = escapeHtml('Only Markdown notes support block embeds.');
      return `<section class="wikilink-embed wikilink-embed--error" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-block-id="${blockId}">
        ${header}
        <div class="wikilink-embed__body"><p class="wikilink-embed__message">${message}</p></div>
      </section>`;
    }

    const blockHtml = extractBlockHtmlForEmbed(note, blockId, { depth, visited, noteId });
    if (!blockHtml) {
      const header = buildHeader(noteId, 'Missing block', 'wikilink--embed', true);
      const message = escapeHtml(`Block ^${blockId} could not be rendered.`);
      return `<section class="wikilink-embed wikilink-embed--error" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-block-id="${blockId}" data-block-missing="true">
        ${header}
        <div class="wikilink-embed__body"><p class="wikilink-embed__message">${message}</p></div>
      </section>`;
    }

    const header = buildHeader(noteId, 'Embedded block');
    return `<section class="wikilink-embed" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}" data-block-id="${blockId}" data-block-missing="false">
      ${header}
      <div class="wikilink-embed__body">${blockHtml}</div>
    </section>`;
  }

  if (note.type === 'markdown') {
    const { html: childHtml } = renderMarkdownToHtml(note.content ?? '', {
      noteId,
      depth,
      visited
    });
    const header = buildHeader(noteId, 'Embedded note');
    return `<section class="wikilink-embed" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
      ${header}
      <div class="wikilink-embed__body">${childHtml}</div>
    </section>`;
  }

  if (note.type === 'code') {
    const languageLabel = note.language ? note.language.toUpperCase() : 'Code file';
    const header = buildHeader(noteId, languageLabel);
    const code = escapeHtml(note.content ?? '');
    const languageAttr = escapeHtml(note.language ?? '');
    return `<section class="wikilink-embed" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
      ${header}
      <pre class="wikilink-embed__code" data-language="${languageAttr}">${code}</pre>
    </section>`;
  }

  if (note.type === 'html') {
    const header = buildHeader(noteId, 'HTML');
    const rawSrc = escapeHtml(note.absolutePath ?? note.storedPath ?? '');
    return `<section class="wikilink-embed" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
      ${header}
      <div class="wikilink-embed__body">
        <iframe class="html-embed-iframe" data-raw-src="${rawSrc}" data-note-id="${noteId}" loading="lazy" sandbox="allow-scripts allow-forms allow-popups" style="width:100%; height:600px; border:1px solid #ddd; border-radius:4px; background:#f5f5f5; transition:height 0.3s ease;">Your browser does not support iframes.</iframe>
      </div>
    </section>`;
  }

  if (note.type === 'image') {
    const header = buildHeader(noteId, 'Image');
    const rawSrc = escapeHtml(note.absolutePath ?? note.storedPath ?? '');
    const baseAlt = presentation.display || note.title || token.target;
    const safeAlt = escapeHtml(baseAlt ?? '');
    return `<section class="wikilink-embed" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
      ${header}
      <figure class="wikilink-embed__figure">
        <img src="${rawSrc}" alt="${safeAlt}" data-note-id="${noteId}" data-raw-src="${rawSrc}" loading="lazy" />
        <figcaption>${safeAlt}</figcaption>
      </figure>
    </section>`;
  }

  if (note.type === 'video') {
    const header = buildHeader(noteId, 'Video');
    const rawSrc = escapeHtml(note.absolutePath ?? note.storedPath ?? '');
    const baseAlt = presentation.display || note.title || token.target;
    const safeAlt = escapeHtml(baseAlt ?? '');
    return `<section class="wikilink-embed" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
      ${header}
      <figure class="wikilink-embed__figure">
        <video data-raw-src="${rawSrc}" data-note-id="${noteId}" controls preload="metadata" style="max-width: 100%; height: auto;">
          <figcaption>${safeAlt}</figcaption>
        </video>
      </figure>
    </section>`;
  }

  if (note.type === 'pdf') {
    const header = buildHeader(noteId, 'PDF document');
    return `<section class="wikilink-embed wikilink-embed--error" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
      ${header}
      <div class="wikilink-embed__body"><p class="wikilink-embed__message">Embedded preview for PDFs isn't supported yet. Click the link above to open it in the viewer.</p></div>
    </section>`;
  }

  if (note.type === 'notebook') {
    const header = buildHeader(noteId, 'Notebook');
    return `<section class="wikilink-embed wikilink-embed--error" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
      ${header}
      <div class="wikilink-embed__body"><p class="wikilink-embed__message">Notebook embeds are not available yet. Use the link above to open the file.</p></div>
    </section>`;
  }

  // If note exists but type isn't explicitly supported above, check file extension and fall back to HTML embed
  try {
    const potentialPath = note.absolutePath ?? note.storedPath ?? token.target ?? '';
    const ext = getFileExtension(potentialPath) || '';
    if (ext && htmlExtensions.has(ext.toLowerCase())) {
      const header = buildHeader(noteId, 'HTML');
      const rawSrc = escapeHtml(potentialPath);
      return `<section class="wikilink-embed" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
        ${header}
        <div class="wikilink-embed__body">
          <iframe class="html-embed-iframe" data-raw-src="${rawSrc}" data-note-id="${noteId}" loading="lazy" sandbox="allow-scripts allow-forms allow-popups" style="width:100%; height:600px; border:1px solid #ddd; border-radius:4px; background:#f5f5f5; transition:height 0.3s ease;">Your browser does not support iframes.</iframe>
        </div>
      </section>`;
    } else if (ext && videoExtensions.has(ext.toLowerCase())) {
      const header = buildHeader(noteId, 'Video');
      const rawSrc = escapeHtml(potentialPath);
      const baseAlt = presentation.display || note.title || token.target;
      const safeAlt = escapeHtml(baseAlt ?? '');
      return `<section class="wikilink-embed" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
        ${header}
        <figure class="wikilink-embed__figure">
          <video data-raw-src="${rawSrc}" data-note-id="${noteId}" controls preload="metadata" style="max-width: 100%; height: auto;">
            <figcaption>${safeAlt}</figcaption>
          </video>
        </figure>
      </section>`;
    }
  } catch (e) {
    // ignore and fall through
  }

  const header = buildHeader(noteId, 'Preview unavailable');
  return `<section class="wikilink-embed wikilink-embed--error" data-note-id="${noteId}" data-wiki-target="${targetAttr}" data-embed-depth="${depth}">
    ${header}
    <div class="wikilink-embed__body"><p class="wikilink-embed__message">This file type cannot be embedded.</p></div>
  </section>`;
};

const createWikiLinkExtension = () => ({
  name: 'wikiLink',
  level: 'inline',
  start(src) {
    const inlineEmbedIndex = src.indexOf('!![[', 0);
    const transclusionIndex = src.indexOf('![[', 0);
    const regularIndex = src.indexOf('[[', 0);
    
    // Check for inline embed first (!![[)
    if (inlineEmbedIndex !== -1) {
      return inlineEmbedIndex;
    }
    
    // Then check for regular embed (![[)
    if (transclusionIndex !== -1 && (regularIndex === -1 || transclusionIndex <= regularIndex)) {
      return transclusionIndex;
    }
    
    // Finally check for regular link ([[)
    return regularIndex !== -1 ? regularIndex : undefined;
  },
  tokenizer(src) {
    const parseInner = (raw) => {
      const trimmed = typeof raw === 'string' ? raw.trim() : '';
      if (!trimmed) {
        return { target: '', alias: '' };
      }

      const pipeIndex = trimmed.indexOf('|');
      if (pipeIndex !== -1) {
        return {
          target: trimmed.slice(0, pipeIndex).trim(),
          alias: trimmed.slice(pipeIndex + 1).trim()
        };
      }

      const bracketIndex = trimmed.lastIndexOf('][');
      if (bracketIndex !== -1) {
        return {
          target: trimmed.slice(0, bracketIndex).trim(),
          alias: trimmed.slice(bracketIndex + 2).trim()
        };
      }

      return { target: trimmed, alias: '' };
    };

    const inlineEmbedMatch = /^!!\[\[([\s\S]+?)\]\]/.exec(src);
    if (inlineEmbedMatch) {
      const { target, alias } = parseInner(inlineEmbedMatch[1]);
      return {
        type: 'wikiLink',
        raw: inlineEmbedMatch[0],
        target,
        alias,
        embed: 'inline'
      };
    }

    const embedMatch = /^!\[\[([\s\S]+?)\]\]/.exec(src);
    if (embedMatch) {
      const { target, alias } = parseInner(embedMatch[1]);
      return {
        type: 'wikiLink',
        raw: embedMatch[0],
        target,
        alias,
        embed: true
      };
    }

    const linkMatch = /^\[\[([\s\S]+?)\]\]/.exec(src);
    if (!linkMatch) {
      return undefined;
    }

    const { target, alias } = parseInner(linkMatch[1]);

    return {
      type: 'wikiLink',
      raw: linkMatch[0],
      target,
      alias,
      embed: false
    };
  },
  renderer(token) {
    const context = getRenderContext() ?? { depth: 0, visited: new Set() };
    const targetInfo = parseWikiTarget(token.target, context);
    const targetAttr = escapeHtml(token.target);

    if (token.embed === 'inline') {
      return renderInlineEmbed(token, targetInfo, context);
    }

    if (token.embed) {
      return renderWikiEmbed(token, targetInfo, context);
    }

    const presentation = getWikiTargetPresentation(token, targetInfo);
    const display = escapeHtml(presentation.display);

    return renderWikiLinkSpan({
      noteId: targetInfo.noteId,
      targetAttr,
      display,
      blockId: targetInfo.blockId,
      blockMissing: Boolean(targetInfo.blockId && !targetInfo.hasBlock)
    });
  }
});

const createRendererOverrides = () => {
  const renderer = new window.marked.Renderer();
  const baseImageRenderer = renderer.image?.bind(renderer);

  renderer.image = function imageRenderer(href, title, text) {
    if (!href) {
      return baseImageRenderer ? baseImageRenderer(href, title, text) : '';
    }

    const context = getRenderContext();
    const noteId = context?.noteId ? escapeHtml(context.noteId) : '';
    const rawSrc = escapeHtml(href);
    const altText = escapeHtml(text ?? '');
    
    // Check if this is a video file
    const isVideo = videoExtensions.has(getFileExtension(href));
    
    // Check if this is an HTML file
    const isHtml = htmlExtensions.has(getFileExtension(href));
    
    if (isVideo) {
      // Render as video element instead of image
      const attributes = [`data-raw-src="${rawSrc}"`, 'controls', 'preload="metadata"'];
      
      if (noteId) {
        attributes.push(`data-note-id="${noteId}"`);
      }
      
      if (title) {
        attributes.push(`title="${escapeHtml(title)}"`);
      }
      
      // Add width/height if specified in title or alt text (common convention)
      const dimensionMatch = (title || altText).match(/(\d+)x(\d+)/);
      if (dimensionMatch) {
        attributes.push(`width="${dimensionMatch[1]}"`);
        attributes.push(`height="${dimensionMatch[2]}"`);
      } else {
        // Default responsive video styling
        attributes.push('style="max-width: 100%; height: auto;"');
      }
      
      return `<video ${attributes.join(' ')}>${altText ? `Your browser does not support the video tag. ${altText}` : 'Your browser does not support the video tag.'}</video>`;
    } else if (isHtml) {
      // Render as embedded HTML iframe - src will be resolved asynchronously
      const iframeId = `html-embed-${Math.random().toString(36).substr(2, 9)}`;
      const attributes = [
        `id="${iframeId}"`,
        `data-raw-src="${rawSrc}"`,
        'sandbox="allow-scripts allow-forms allow-popups"',
        'loading="lazy"',
        'class="html-embed-iframe"'
      ];
      
      if (noteId) {
        attributes.push(`data-note-id="${noteId}"`);
      }
      
      if (title) {
        attributes.push(`title="${escapeHtml(title)}"`);
      }
      
      // Add width/height if specified in title or alt text
      const dimensionMatch = (title || altText).match(/(\d+)x(\d+)/);
      if (dimensionMatch) {
        attributes.push(`width="${dimensionMatch[1]}"`);
        attributes.push(`height="${dimensionMatch[2]}"`);
      } else {
        // Default responsive iframe styling with auto-resize capability
        attributes.push('style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; transition: height 0.3s ease;"');
        attributes.push('onload="autoResizeIframe(this)"');
      }
      
      return `<iframe ${attributes.join(' ')}>${altText ? `Your browser does not support iframes. ${altText}` : 'Your browser does not support iframes.'}</iframe>`;
    } else {
      // Regular image handling
      const attributes = [`src="${rawSrc}"`, `alt="${altText}"`, `data-raw-src="${rawSrc}"`, 'loading="lazy"'];

      if (noteId) {
        attributes.push(`data-note-id="${noteId}"`);
      }

      if (title) {
        attributes.push(`title="${escapeHtml(title)}"`);
      }

      return `<img ${attributes.join(' ')} />`;
    }
  };

  return renderer;
};

const createHtmlCodeBlockExtension = () => {
  return {
    name: 'htmlCodeBlock',
    level: 'block',
    tokenizer(src) {
      const rule = /^```html\s*\n([\s\S]*?)^```$/m;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'htmlCodeBlock',
          raw: match[0],
          text: match[1]
        };
      }
      return undefined;
    },
    renderer(token) {
      const htmlContent = token.text;
      const iframeId = `html-block-${Math.random().toString(36).substr(2, 9)}`;
      
      // Inject auto-resize script into the HTML content
      const autoResizeScript = `
        <script>
        // Auto-resize functionality for parent iframe
        function notifyParentOfResize() {
            const height = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            
            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'iframe-resize',
                        height: height,
                        source: window.location.href
                    }, '*');
                }
            } catch (e) {
                // Silently fail if cross-origin
            }
        }
        
        // Notify parent on load and when content might change
        window.addEventListener('load', notifyParentOfResize);
        window.addEventListener('resize', notifyParentOfResize);
        document.addEventListener('DOMContentLoaded', notifyParentOfResize);
        
        // Notify after delays to catch dynamic content
        setTimeout(notifyParentOfResize, 100);
        setTimeout(notifyParentOfResize, 500);
        setTimeout(notifyParentOfResize, 1500);
        
        // Watch for DOM changes
        if (window.MutationObserver) {
            const observer = new MutationObserver(() => {
                setTimeout(notifyParentOfResize, 50);
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
        </script>
      `;
      
      // Insert the script before the closing body tag, or at the end if no body tag
      let modifiedHtml = htmlContent;
      if (modifiedHtml.includes('</body>')) {
        modifiedHtml = modifiedHtml.replace('</body>', autoResizeScript + '</body>');
      } else if (modifiedHtml.includes('</html>')) {
        modifiedHtml = modifiedHtml.replace('</html>', autoResizeScript + '</html>');
      } else {
        modifiedHtml = modifiedHtml + autoResizeScript;
      }
      
      // Create a blob URL for the modified HTML content
      const blob = new Blob([modifiedHtml], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      
      // Store the blob URL for cleanup later
      if (!window.htmlBlobUrls) {
        window.htmlBlobUrls = new Set();
      }
      window.htmlBlobUrls.add(blobUrl);
      
      const attributes = [
        `id="${iframeId}"`,
        `src="${blobUrl}"`,
        'sandbox="allow-scripts allow-forms allow-popups"',
        'style="width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 4px; background: white; transition: height 0.3s ease;"',
        'onload="autoResizeIframe(this)"'
      ];
      
      return `<iframe ${attributes.join(' ')}>Your browser does not support iframes.</iframe>`;
    }
  };
};

const configureMarked = () => {
  const extensions = [...createMathExtensions(), ...createInlineCommandExtension(), createWikiLinkExtension(), createHtmlCodeBlockExtension()];
  const renderer = createRendererOverrides();
  window.marked.use({
    mangle: false,
    headerIds: false,
    breaks: true,
    extensions,
    renderer,
    walkTokens: collectSourceMapToken
  });
};

const openContextMenu = (noteId, x, y) => {
  if (!elements.workspaceContextMenu) {
    return;
  }

  state.contextMenu.open = true;
  state.contextMenu.targetNoteId = noteId;
  state.contextMenu.x = x;
  state.contextMenu.y = y;

  const menu = elements.workspaceContextMenu;
  const note = noteId ? state.notes.get(noteId) : null;

  // Enable/disable menu items based on note type and context
  const cutButton = menu.querySelector('[data-action="cut"]');
  const copyButton = menu.querySelector('[data-action="copy"]');
  const pasteButton = menu.querySelector('[data-action="paste"]');
  const renameButton = menu.querySelector('[data-action="rename"]');
  const revealButton = menu.querySelector('[data-action="reveal"]');
  const deleteButton = menu.querySelector('[data-action="delete"]');

  if (cutButton) {
    cutButton.disabled = !note || !canCutCopyNote(note);
  }

  if (copyButton) {
    copyButton.disabled = !note || !canCutCopyNote(note);
  }

  if (pasteButton) {
    pasteButton.disabled = !canPasteNote();
  }

  if (renameButton) {
    renameButton.disabled = !note || !canRenameNote(note);
  }
  
  if (revealButton) {
    revealButton.disabled = !note || !note.absolutePath;
  }

  if (deleteButton) {
    deleteButton.disabled = !note || !canDeleteNote(note);
  }

  // Position the menu
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.hidden = false;
  menu.setAttribute('aria-hidden', 'false');

  // Don't auto-focus to avoid persistent highlight issues
  // Users can navigate with mouse or keyboard as needed
};

const closeContextMenu = () => {
  if (!elements.workspaceContextMenu || !state.contextMenu.open) {
    return;
  }

  state.contextMenu.open = false;
  state.contextMenu.targetNoteId = null;

  const menu = elements.workspaceContextMenu;
  menu.hidden = true;
  menu.setAttribute('aria-hidden', 'true');
};

const handleContextMenuAction = async (action) => {
  const noteId = state.contextMenu.targetNoteId;
  if (!noteId) {
    return;
  }

  const note = state.notes.get(noteId);
  if (!note) {
    return;
  }

  closeContextMenu();

  try {
    switch (action) {
      case 'cut':
        if (canCutCopyNote(note)) {
          cutNote(noteId);
        }
        break;

      case 'copy':
        if (canCutCopyNote(note)) {
          copyNote(noteId);
        }
        break;

      case 'paste':
        if (canPasteNote()) {
          await pasteNote();
        }
        break;

      case 'rename':
        if (canRenameNote(note)) {
          startRenameFile(noteId);
        }
        break;

      case 'reveal':
        if (note.absolutePath) {
          await window.api.revealInFinder(note.absolutePath);
        }
        break;

      case 'delete':
        if (canDeleteNote(note) && confirm(`Are you sure you want to delete "${note.title}"?`)) {
          await deleteNote(noteId);
        }
        break;

      default:
    }
  } catch (error) {
    setStatus(getActionableErrorMessage(action, error), false);
  }
};

const handleWorkspaceTreeContextMenu = (event) => {
  event.preventDefault();

  const treeNode = event.target.closest('.tree-node');
  const rect = elements.workspaceTree.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;

  if (!treeNode || !treeNode.dataset.noteId) {
    // Right-clicked on empty space - show paste-only context menu if we have something to paste
    if (canPasteNote()) {
      openContextMenu(null, x, y);
    } else {
      closeContextMenu();
    }
    return;
  }

  const noteId = treeNode.dataset.noteId;
  openContextMenu(noteId, x, y);
};

const handleContextMenuClick = (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  event.preventDefault();
  const action = button.dataset.action;
  if (action) {
    handleContextMenuAction(action);
  }
};

const handleContextMenuKeyDown = (event) => {
  if (!state.contextMenu.open) {
    return;
  }

  const menu = elements.workspaceContextMenu;
  if (!menu) {
    return;
  }

  const buttons = Array.from(menu.querySelectorAll('button:not([disabled])'));
  const currentIndex = buttons.indexOf(document.activeElement);

  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      closeContextMenu();
      break;

    case 'ArrowDown':
      event.preventDefault();
      if (currentIndex < buttons.length - 1) {
        buttons[currentIndex + 1].focus();
      } else {
        buttons[0].focus();
      }
      break;

    case 'ArrowUp':
      event.preventDefault();
      if (currentIndex > 0) {
        buttons[currentIndex - 1].focus();
      } else {
        buttons[buttons.length - 1].focus();
      }
      break;

    case 'Enter':
    case ' ':
      event.preventDefault();
      if (document.activeElement && document.activeElement.dataset.action) {
        handleContextMenuAction(document.activeElement.dataset.action);
      }
      break;
  }
};

const handleGlobalClick = (event) => {
  // Close context menu if clicking outside
  if (state.contextMenu.open && !event.target.closest('#workspace-context-menu')) {
    closeContextMenu();
  }
};

const canDeleteNote = (note) => {
  return note && note.absolutePath && state.currentFolder;
};

const canCutCopyNote = (note) => {
  return note && note.absolutePath && state.currentFolder;
};

const canPasteNote = () => {
  return state.clipboard.operation && state.clipboard.sourcePath && state.currentFolder;
};

const cutNote = (noteId) => {
  const note = state.notes.get(noteId);
  if (!note || !canCutCopyNote(note)) {
    return;
  }

  state.clipboard.operation = 'cut';
  state.clipboard.noteId = noteId;
  state.clipboard.sourcePath = note.absolutePath;
  setStatus(`Cut "${note.title}"`, true);
};

const copyNote = (noteId) => {
  const note = state.notes.get(noteId);
  if (!note || !canCutCopyNote(note)) {
    return;
  }

  state.clipboard.operation = 'copy';
  state.clipboard.noteId = noteId;
  state.clipboard.sourcePath = note.absolutePath;
  setStatus(`Copied "${note.title}"`, true);
};

const pasteNote = async () => {
  if (!canPasteNote()) {
    throw new Error('Nothing to paste');
  }

  const sourcePath = state.clipboard.sourcePath;
  const operation = state.clipboard.operation;
  const sourceNote = state.notes.get(state.clipboard.noteId);
  
  if (!sourceNote) {
    throw new Error('Source file no longer exists');
  }

  try {
    const result = await window.api.pasteFile({
      sourcePath,
      targetDirectory: state.currentFolder,
      operation // 'cut' or 'copy'
    });

    if (operation === 'cut') {
      // Clear the cut item from clipboard after successful cut operation
      state.clipboard.operation = null;
      state.clipboard.noteId = null;
      state.clipboard.sourcePath = null;
      
      // If the cut file was the active file, clear the active state
      if (state.activeNoteId === state.clipboard.noteId) {
        state.activeNoteId = null;
      }
    }

    // Reload the workspace to show the changes
    await loadWorkspaceFolder(state.currentFolder);
    setStatus(`${operation === 'cut' ? 'Moved' : 'Copied'} "${sourceNote.title}"`, true);
  } catch (error) {
    throw new Error(`Failed to paste file: ${error.message}`);
  }
};

const deleteNote = async (noteId) => {
  const note = state.notes.get(noteId);
  if (!note || !note.absolutePath) {
    throw new Error('Cannot delete this note');
  }

  try {
    await window.api.deleteFile(note.absolutePath);
    
    // Clear any editor pane mappings that referenced this note
    try {
      Object.keys(state.editorPanes || {}).forEach((pid) => {
        try {
          if (state.editorPanes[pid] && state.editorPanes[pid].noteId === noteId) {
            state.editorPanes[pid].noteId = null;
          }
        } catch (e) { /* ignore per-pane errors */ }
      });
      // Persist pane assignments
      try { localStorage.setItem(storageKeys.editorPanes, JSON.stringify(state.editorPanes)); } catch (e) {}
    } catch (e) { /* ignore */ }

    // Remove any open tabs for this note
    try {
      state.tabs = Array.isArray(state.tabs) ? state.tabs.filter(t => t.noteId !== noteId) : [];
      if (state.activeTabId && !state.tabs.find(t => t.id === state.activeTabId)) {
        state.activeTabId = state.tabs[0]?.id ?? null;
      }
    } catch (e) { /* ignore */ }

    // If this was the active note, clear it
    if (state.activeNoteId === noteId) {
      state.activeNoteId = null;
    }

    // Remove from notes map so renderers won't show it
    try { state.notes.delete(noteId); } catch (e) { /* ignore */ }

    // Re-render workspace, tabs and active editor to reflect deletion
    try { renderWorkspaceTree(); } catch (e) {}
    try { renderTabs(); } catch (e) {}
    try { renderActiveNote(); } catch (e) {}
    try { updateEditorPaneVisuals(); } catch (e) {}

    setStatus(`Deleted "${note.title}"`, true);
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

const initialize = () => {
  // Refresh key element references (tests may create DOM after module load)
  try {
    elements.filePath = document.getElementById('file-path') || elements.filePath;
    elements.fileName = document.getElementById('file-name') || elements.fileName;
    elements.mathPreviewPopup = document.getElementById('math-preview-popup') || elements.mathPreviewPopup;
    elements.mathPreviewPopupContent = document.querySelector('#math-preview-popup .math-preview-popup__content') || elements.mathPreviewPopupContent;
    elements.preview = document.getElementById('markdown-preview') || elements.preview;
    elements.wikiSuggestions = document.getElementById('wikilink-suggestions') || elements.wikiSuggestions;
  } catch (e) { /* ignore */ }
  configureMarked();
  applyEditorRatio();
  renderWorkspaceTree();
  renderActiveNote();
  renderHashtagPanel();
  loadThemeSettings(); // Initialize theme on app start
  loadComponentSettings(); // Initialize component-specific settings
  // Restore persisted editor pane assignments (per-pane open notes)
  try {
    const raw = localStorage.getItem(storageKeys.editorPanes);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        state.editorPanes = state.editorPanes || { left: { noteId: null }, right: { noteId: null } };
        if (parsed.left && parsed.left.noteId) state.editorPanes.left.noteId = parsed.left.noteId;
        if (parsed.right && parsed.right.noteId) state.editorPanes.right.noteId = parsed.right.noteId;
        // If restored panes have noteIds that exist in state.notes, ensure they are opened in tabs
        for (const paneKey of ['left','right']) {
          const nid = state.editorPanes[paneKey]?.noteId;
          if (nid && state.notes.has(nid)) {
            // Create a tab if not present
            if (!state.tabs.find(t => t.noteId === nid)) {
              const note = state.notes.get(nid);
              createTab(nid, note?.title || 'Untitled');
            }
          } else {
            // Clear invalid noteId
            state.editorPanes[paneKey].noteId = null;
          }
        }
      }
    }
  } catch (e) {
  }

  // Rehydrate any dynamically-created panes saved in storage (keys other than left/right).
  try {
    const raw = localStorage.getItem(storageKeys.editorPanes);
    if (raw) {
      let parsed = null;
      try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
      if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach((paneId) => {
          if (paneId === 'left' || paneId === 'right') return;
          // Create pane DOM and instance if not present
          if (!editorInstances[paneId]) {
            try {
              createEditorPane(paneId, parsed[paneId].label || ``);
              // Debug prints removed
            } catch (err) {
            }
          }

          // If pane had a note assigned, populate its editor content
          const noteId = parsed[paneId]?.noteId;
          if (noteId && state.notes && state.notes.has(noteId) && editorInstances[paneId]) {
            try {
              const note = state.notes.get(noteId);
              editorInstances[paneId].setValue(note.content || '');
              state.editorPanes[paneId] = state.editorPanes[paneId] || {};
              state.editorPanes[paneId].noteId = noteId;
            } catch (e) { /* ignore per-pane hydrate failures */ }
          }
        });
        // Persist the normalized structure
        try { localStorage.setItem(storageKeys.editorPanes, JSON.stringify(state.editorPanes)); } catch (e) {}
      }
    }
  } catch (e) {
  }
  
  // dual editor removed
  
  // Add platform class for platform-specific styling
  detectPlatform();

  // Left editor wiring via Editor abstraction
  if (elements.editor) {
    editorInstances.left.addEventListener('input', (e) => handleEditorInput(e, { editorEl: editorInstances.left.el, pane: 'left' }));
    editorInstances.left.addEventListener('keydown', handleEditorKeydown);
    editorInstances.left.addEventListener('keyup', handleEditorKeyup);
    editorInstances.left.addEventListener('click', handleEditorClick);
    editorInstances.left.addEventListener('focus', () => {
      setActiveEditorPane('left');
  const leftTa = editorInstances.left?.el ?? null;
      updateWikiSuggestions(leftTa);
      updateHashtagSuggestions(leftTa);
    });
    editorInstances.left.addEventListener('blur', () => {
      persistNotes();
      // Hide math preview popup when editor loses focus
      if (elements.mathPreviewPopup) {
        elements.mathPreviewPopup.classList.remove('visible');
        elements.mathPreviewPopup.hidden = true;
      }
    });

  // Ensure show-filename-only checkbox is wired (tests may rely on this)
  try {
    const showFilenameOnlyCheckbox = document.getElementById('show-filename-only');
    if (showFilenameOnlyCheckbox) {
      try {
        const enabled = localStorage.getItem(storageKeys.showFileNameOnly) === 'true';
        showFilenameOnlyCheckbox.checked = enabled;
      } catch (e) {}
      try {
        showFilenameOnlyCheckbox.addEventListener('change', (evt) => {
          try {
            const val = evt.target.checked ? 'true' : 'false';
            localStorage.setItem(storageKeys.showFileNameOnly, val);
            try { updateFileMetadataUI(state.notes.get(state.activeNoteId) ?? null, { allowActiveFallback: true }); } catch (e) {}
          } catch (e) {}
        });
      } catch (e) {}
    }
  } catch (e) {}

  // Ensure clicking the file-path copies the full path to clipboard (tests rely on this)
  try {
    const filePathEl = document.getElementById('file-path');
    if (filePathEl) {
      filePathEl.addEventListener('click', (ev) => {
        try {
          const pathToCopy = (filePathEl && filePathEl.title) ? filePathEl.title : (filePathEl && filePathEl.textContent) || '';
          if (!pathToCopy) return;
          const write = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
          if (write) {
            navigator.clipboard.writeText(pathToCopy).catch(() => {
              try { if (window.api && typeof window.api.invoke === 'function') window.api.invoke('clipboard:write', pathToCopy); } catch (e) {}
            });
          } else {
            try { if (window.api && typeof window.api.invoke === 'function') window.api.invoke('clipboard:write', pathToCopy); } catch (e) {}
          }
        } catch (e) {}
      });
    }
  } catch (e) {}
  }
  
  // Function to update math preview popup for 3-line math blocks
  const updateMathPreview = (editor) => {
    if (!editor || !elements.mathPreviewPopup || !elements.mathPreviewPopupContent) return;
    
    const value = editor.value;
    const cursor = editor.selectionStart;
    
    // Check if cursor is within a 3-line math block: $$ \n equation \n $$
    const lines = value.split('\n');
    let blockStart = -1;
    let equation = '';
    
    for (let i = 0; i < lines.length - 2; i++) {
      if (lines[i].trim() === '$$' && lines[i + 2].trim() === '$$') {
        const eq = lines[i + 1].trim();
        if (eq && eq !== '$$') {
          // Find the start and end positions of this block
          let startPos = 0;
          for (let j = 0; j < i; j++) {
            startPos += lines[j].length + 1; // +1 for \n
          }
          const endPos = startPos + lines[i].length + 1 + lines[i + 1].length + 1 + lines[i + 2].length;
          
          if (cursor >= startPos && cursor <= endPos) {
            equation = eq;
            blockStart = startPos;
            break;
          }
        }
      }
    }
    
    if (equation && window.katex) {
      try {
        elements.mathPreviewPopupContent.innerHTML = '';
        const html = window.katex.renderToString(equation, { displayMode: true, throwOnError: false });
        elements.mathPreviewPopupContent.innerHTML = html;
        
        // Position the popup near the block
        const rect = editor.getBoundingClientRect();
        // Position above the block
        const blockLineIndex = value.substring(0, blockStart).split('\n').length - 1;
        const approxTop = rect.top + (blockLineIndex * 20); // rough estimate
        elements.mathPreviewPopup.style.left = `${rect.left + 10}px`;
        elements.mathPreviewPopup.style.top = `${approxTop - 120}px`;
        elements.mathPreviewPopup.classList.add('visible');
        elements.mathPreviewPopup.hidden = false;
        return;
      } catch (e) {
        // ignore
      }
    }
    
    // Hide popup if not in a 3-line block
    elements.mathPreviewPopup.classList.remove('visible');
    elements.mathPreviewPopup.hidden = true;
  };
  
  // Handle math preview popup on selection changes
  document.addEventListener('selectionchange', () => {
    const activeEd = getActiveEditorInstance()?.el;
    if (document.activeElement === activeEd) {
      updateMathPreview(activeEd);
    } else {
      // Hide popup if editor is not focused
      if (elements.mathPreviewPopup) {
        elements.mathPreviewPopup.classList.remove('visible');
        elements.mathPreviewPopup.hidden = true;
      }
    }
  });
  editorInstances.left.addEventListener('blur', handleEditorBlur);
  editorInstances.left.addEventListener('scroll', handleEditorScroll);
  editorInstances.left.addEventListener('select', handleEditorSelect);

  // Drag and drop event listeners for first editor
  editorInstances.left.addEventListener('dragover', handleEditorDragOver, { passive: false });
  editorInstances.left.addEventListener('dragenter', handleEditorDragEnter, { passive: false });
  editorInstances.left.addEventListener('dragleave', handleEditorDragLeave, { passive: false });
  editorInstances.left.addEventListener('drop', handleEditor1Drop);

  // Hover preview for wiki-links in the editor textarea
  try {
    const getCharIndexAtMouse = (textarea, clientX, clientY) => {
      try {
        const rect = textarea.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Create mirror div
        const mirror = document.createElement('div');
        mirror.style.position = 'absolute';
        mirror.style.visibility = 'hidden';
        mirror.style.whiteSpace = 'pre-wrap';
        mirror.style.wordWrap = 'break-word';
        mirror.style.fontSize = window.getComputedStyle(textarea).fontSize;
        mirror.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
        mirror.style.lineHeight = window.getComputedStyle(textarea).lineHeight;
        mirror.style.letterSpacing = window.getComputedStyle(textarea).letterSpacing;
        mirror.style.padding = window.getComputedStyle(textarea).padding;
        mirror.style.width = `${rect.width}px`;
        mirror.style.height = `${rect.height}px`;
        mirror.style.overflow = 'hidden';

        const text = textarea.value;
        let low = 0;
        let high = text.length;
        let bestIndex = -1;

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          mirror.textContent = text.substring(0, mid);
          document.body.appendChild(mirror);
          const mirrorRect = mirror.getBoundingClientRect();
          document.body.removeChild(mirror);

          if (mirrorRect.bottom < y + rect.top) {
            low = mid + 1;
          } else if (mirrorRect.top > y + rect.top) {
            high = mid - 1;
          } else {
            // Check horizontal
            mirror.textContent = text.substring(0, mid + 1);
            document.body.appendChild(mirror);
            const nextRect = mirror.getBoundingClientRect();
            document.body.removeChild(mirror);

            if (x < nextRect.left - rect.left) {
              bestIndex = mid;
              break;
            } else {
              low = mid + 1;
            }
          }
        }

        return bestIndex >= 0 ? bestIndex : text.length;
      } catch (e) {
        return -1;
      }
    };

    const showWikiLinkPreview = (textarea, index, event) => {
      const text = textarea.value;
      // Find the wiki-link containing this index
      const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
      let match;
      while ((match = wikiLinkRegex.exec(text)) !== null) {
        const start = match.index;
        const end = match.index + match[0].length;
        if (index >= start && index < end) {
          const target = match[1];
          const parsed = parseWikiTarget(target, { noteId: state.activeNoteId });
          if (parsed && parsed.noteId) {
            const note = state.notes.get(parsed.noteId);
            if (note) {
              // Show preview
              if (!elements.mathPreviewPopup || !elements.mathPreviewPopupContent) return;
              elements.mathPreviewPopupContent.innerHTML = '';
              if (note.type === 'image') {
                const img = document.createElement('img');
                img.src = note.absolutePath || note.storedPath || '';
                img.alt = note.title || '';
                img.style.maxWidth = '200px';
                img.style.maxHeight = '200px';
                img.style.objectFit = 'contain';
                elements.mathPreviewPopupContent.appendChild(img);
              } else if (note.type === 'video') {
                const v = document.createElement('video');
                v.controls = true;
                v.preload = 'metadata';
                v.style.maxWidth = '200px';
                v.style.maxHeight = '200px';
                const src = document.createElement('source');
                src.src = note.absolutePath || note.storedPath || '';
                v.appendChild(src);
                elements.mathPreviewPopupContent.appendChild(v);
              } else {
                // Render a short HTML snippet from the note's markdown or show title/type for other types
                if (note.type === 'markdown') {
                  elements.mathPreviewPopupContent.textContent = note.title || 'Markdown note';
                } else {
                  elements.mathPreviewPopupContent.textContent = `${note.title || 'Untitled'} (${note.type})`;
                }
              }
              // Position near mouse
              const popupX = event.clientX + 10;
              const popupY = event.clientY + 10;
              elements.mathPreviewPopup.style.left = `${popupX}px`;
              elements.mathPreviewPopup.style.top = `${popupY}px`;
              elements.mathPreviewPopup.classList.add('visible');
              elements.mathPreviewPopup.hidden = false;
              return;
            }
          }
          break;
        }
      }
    };

    const hideWikiLinkPreview = () => {
      if (elements.mathPreviewPopup) {
        elements.mathPreviewPopup.classList.remove('visible');
        elements.mathPreviewPopup.hidden = true;
      }
    };

    editorInstances.left.addEventListener('mouseover', (event) => {
      const textarea = editorInstances.left.el;
      if (!textarea) return;
      const index = getCharIndexAtMouse(textarea, event.clientX, event.clientY);
      if (index >= 0) {
        showWikiLinkPreview(textarea, index, event);
      }
    });

    editorInstances.left.addEventListener('mouseout', () => {
      hideWikiLinkPreview();
    });

    // For right editor if exists
    if (editorInstances.right && editorInstances.right.el) {
      editorInstances.right.addEventListener('mouseover', (event) => {
        const textarea = editorInstances.right.el;
        const index = getCharIndexAtMouse(textarea, event.clientX, event.clientY);
        if (index >= 0) {
          showWikiLinkPreview(textarea, index, event);
        }
      });
      editorInstances.right.addEventListener('mouseout', () => {
        hideWikiLinkPreview();
      });
    }
  } catch (e) { /* non-fatal */ }

  // Also add drop listeners to the editor pane itself
  const editorPane = document.querySelector('.editor-pane');
  if (editorPane) {
    editorPane.addEventListener('dragover', handleEditorDragOver, { passive: false });
    editorPane.addEventListener('dragenter', handleEditorDragEnter, { passive: false });
    editorPane.addEventListener('dragleave', handleEditorDragLeave, { passive: false });
    editorPane.addEventListener('drop', handleEditor1Drop);
  }

  // Hover preview for wiki-links inside the rendered preview area.
  // Use event delegation so dynamic content is handled.
  try {
    const previewRoot = elements.preview || document.getElementById('markdown-preview');
    if (previewRoot) {
      // Track whether a preview is currently shown for hover
      let hoverPreviewTarget = null;

      const showHoverPreviewFor = async (target, event) => {
        if (!target || !elements.mathPreviewPopup || !elements.mathPreviewPopupContent) return;
        hoverPreviewTarget = target;
        // Update last mouse position from the event immediately
        try {
          if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
            state.lastMousePosition = { x: event.clientX, y: event.clientY };
          }
        } catch (e) {}

        // If the target is an inlined embed (wikilink-inline-embedded), simply clone its content
        if (target.classList && target.classList.contains('wikilink-inline-embedded')) {
          try {
            elements.mathPreviewPopupContent.innerHTML = '';
            const clone = target.cloneNode(true);
            // Remove interactive attributes that could break the popup
            clone.removeAttribute('data-source-note-id');
            elements.mathPreviewPopupContent.appendChild(clone);
          } catch (e) {
            try { elements.mathPreviewPopupContent.textContent = target.textContent || ''; } catch (e2) {}
          }

          // Position near mouse pointer (prefer event coords)
          try {
            const popupX = (event && event.clientX) ? (event.clientX + 12) : (state.lastMousePosition?.x + 12 || 12);
            const popupY = (event && event.clientY) ? (event.clientY + 12) : (state.lastMousePosition?.y + 12 || 12);
            elements.mathPreviewPopup.style.left = `${popupX}px`;
            elements.mathPreviewPopup.style.top = `${popupY}px`;
            elements.mathPreviewPopup.classList.add('visible');
            elements.mathPreviewPopup.hidden = false;
          } catch (e) {}
          return;
        }

        // Otherwise resolve the wiki target and render a small preview (title + snippet or image)
        try {
          const wikiTarget = target.dataset?.wikiTarget ?? target.getAttribute('data-wiki-target') ?? target.textContent;
          const parsed = parseWikiTarget(wikiTarget, { noteId: state.activeNoteId });
          if (!parsed || !parsed.noteId) {
            elements.mathPreviewPopupContent.textContent = target.textContent || '';
          } else {
            const note = state.notes.get(parsed.noteId);
            if (!note) {
              elements.mathPreviewPopupContent.textContent = target.textContent || '';
            } else if (note.type === 'image') {
              // create an image preview
              elements.mathPreviewPopupContent.innerHTML = '';
              const img = document.createElement('img');
              img.src = note.absolutePath || note.storedPath || '';
              img.alt = note.title || '';
              img.style.maxWidth = '320px';
              img.style.maxHeight = '240px';
              img.style.objectFit = 'contain';
              img.addEventListener('error', () => { elements.mathPreviewPopupContent.textContent = note.title || 'Image preview'; });
              elements.mathPreviewPopupContent.appendChild(img);
            } else if (note.type === 'video') {
              elements.mathPreviewPopupContent.innerHTML = '';
              const v = document.createElement('video');
              v.controls = true;
              v.preload = 'metadata';
              v.style.maxWidth = '320px';
              v.style.maxHeight = '240px';
              const src = document.createElement('source');
              src.src = note.absolutePath || note.storedPath || '';
              v.appendChild(src);
              elements.mathPreviewPopupContent.appendChild(v);
            } else {
              // Render a short HTML snippet from the note's markdown or show title/type for other types
              if (note.type === 'markdown') {
                elements.mathPreviewPopupContent.textContent = note.title || 'Markdown note';
              } else {
                elements.mathPreviewPopupContent.textContent = `${note.title || 'Untitled'} (${note.type})`;
              }
            }
          }

          // Position popup near cursor
          const popupX = (event && typeof event.clientX === 'number') ? (event.clientX + 12) : (state.lastMousePosition?.x + 12 || 12);
          const popupY = (event && typeof event.clientY === 'number') ? (event.clientY + 12) : (state.lastMousePosition?.y + 12 || 12);
          elements.mathPreviewPopup.style.left = `${popupX}px`;
          elements.mathPreviewPopup.style.top = `${popupY}px`;
          elements.mathPreviewPopup.classList.add('visible');
          elements.mathPreviewPopup.hidden = false;
        } catch (e) {
          try { elements.mathPreviewPopupContent.textContent = target.textContent || ''; } catch (e2) {}
        }
      };

      const hideHoverPreview = (target) => {
        try {
          if (hoverPreviewTarget && (!target || hoverPreviewTarget === target)) {
            hoverPreviewTarget = null;
            elements.mathPreviewPopup.classList.remove('visible');
            elements.mathPreviewPopup.hidden = true;
          }
        } catch (e) {}
      };

      // Delegate mouseenter/mouseleave and mousemove for positioning
      previewRoot.addEventListener('mousemove', (ev) => {
        try { state.lastMousePosition = { x: ev.clientX, y: ev.clientY }; } catch (e) {}
      }, { passive: true });

      previewRoot.addEventListener('mouseover', (ev) => {
        try {
          const target = ev.target.closest && ev.target.closest('.wikilink, .wikilink-inline-embedded, .wikilink-inline-embedded img');
          if (!target) return;
          showHoverPreviewFor(target, ev);
        } catch (e) {}
      });

      previewRoot.addEventListener('mouseout', (ev) => {
        try {
          // If leaving to a child of the same wikilink, do nothing
          const related = ev.relatedTarget;
          const leaveFrom = ev.target.closest && ev.target.closest('.wikilink, .wikilink-inline-embedded');
          if (leaveFrom && related && leaveFrom.contains && leaveFrom.contains(related)) return;
          hideHoverPreview(leaveFrom);
        } catch (e) {}
      });

      // Hide popup on scroll/resize to avoid stale positioning
      window.addEventListener('scroll', () => { try { elements.mathPreviewPopup.classList.remove('visible'); elements.mathPreviewPopup.hidden = true; } catch (e) {} }, true);
      window.addEventListener('resize', () => { try { elements.mathPreviewPopup.classList.remove('visible'); elements.mathPreviewPopup.hidden = true; } catch (e) {} });
    }
  } catch (e) { /* non-fatal */ }

  // second editor removed

  // Right editor (split) listeners
  if (elements.editorRight) {
    elements.editorRight.addEventListener('input', (e) => {
      // reuse same handler but provide reference to right editor
      handleEditorInput(e, { editorEl: editorInstances.right?.el ?? elements.editorRight, pane: 'right' });
      // If right pane is active, update preview
      if (state.activeEditorPane === 'right') {
        const noteId = getPaneNoteId('right') || state.activeNoteId;
        const note = noteId ? state.notes.get(noteId) : null;
        if (note && note.type === 'markdown') {
          renderMarkdownPreview(note.content ?? '', note.id);
        }
      }
    });
    elements.editorRight.addEventListener('keydown', handleEditorKeydown);
    elements.editorRight.addEventListener('keyup', handleEditorKeyup);
    elements.editorRight.addEventListener('click', handleEditorClick);
    elements.editorRight.addEventListener('focus', () => {
      // Make right pane the active pane when focused
      setActiveEditorPane('right');
      const rightTa = editorInstances.right?.el ?? elements.editorRight;
      updateWikiSuggestions(rightTa);
      updateHashtagSuggestions(rightTa);
    });
    elements.editorRight.addEventListener('blur', () => {
      persistNotes();
      if (elements.mathPreviewPopup) {
        elements.mathPreviewPopup.classList.remove('visible');
        elements.mathPreviewPopup.hidden = true;
      }
    });

    editorInstances.right.addEventListener('blur', handleEditorBlur);
    editorInstances.right.addEventListener('scroll', handleEditorScroll);
    editorInstances.right.addEventListener('select', handleEditorSelect);
    
  elements.editorRight.addEventListener('dragover', handleEditorDragOver, { passive: false });
  elements.editorRight.addEventListener('dragenter', handleEditorDragEnter, { passive: false });
  elements.editorRight.addEventListener('dragleave', handleEditorDragLeave, { passive: false });
  elements.editorRight.addEventListener('drop', handleEditor2Drop, true);

    const editorPaneRight = document.querySelector('.editor-pane--right');
    if (editorPaneRight) {
  editorPaneRight.addEventListener('dragover', handleEditorDragOver, { passive: false });
  editorPaneRight.addEventListener('dragenter', handleEditorDragEnter, { passive: false });
  editorPaneRight.addEventListener('dragleave', handleEditorDragLeave, { passive: false });
  editorPaneRight.addEventListener('drop', handleEditor2Drop, true);
    }
  }

  // Split editor toggle wiring
  const toggleSplitBtn = document.getElementById('toggle-split-button');
  const editorPaneRight = document.querySelector('.editor-pane--right');
  const restoreSplitVisible = () => {
    const val = localStorage.getItem(storageKeys.editorSplitVisible);
    // default: visible -> 'true'
    return val === null ? true : val === 'true';
  };

  const setSplitVisible = (visible) => {
  // Debug prints removed
    if (editorPaneRight) {
  // Debug prints removed
      if (visible) {
        editorPaneRight.hidden = false;
        // remove inline display to allow CSS to determine layout
        try { editorPaneRight.style.display = ''; } catch (e) {}
        toggleSplitBtn?.setAttribute('aria-pressed', 'true');
      } else {
        editorPaneRight.hidden = true;
        // force inline hide to override any CSS display rules
        try { editorPaneRight.style.display = 'none'; } catch (e) {}
        toggleSplitBtn?.setAttribute('aria-pressed', 'false');
      }
      // Persist as string so restoreSplitVisible can read it
      localStorage.setItem(storageKeys.editorSplitVisible, visible ? 'true' : 'false');
      // Log computed style and layout to detect CSS overrides
      try {
        const cs = window.getComputedStyle(editorPaneRight);
  // Debug prints removed
      } catch (e) {
  // Debug prints removed
      }
    } else {
    }
  };

  if (toggleSplitBtn) {
    // Initialize state from storage (default hidden)
    const visible = restoreSplitVisible();
    setSplitVisible(visible);
    toggleSplitBtn.addEventListener('click', (e) => {
      e.preventDefault();
  // Debug prints removed
      // Create a new dynamic pane with a default label
      const paneId = createEditorPane(null, ``);
  // Debug prints removed
    });
  }

  // Close button for right editor pane (newly added in index.html)
  const closeRightBtn = document.getElementById('close-right-editor');
  if (closeRightBtn) {
    closeRightBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // reuse existing split visibility logic
      try {
  // Debug prints removed
  // Debug prints removed
        setSplitVisible(false);
  // Debug prints removed
        // Extra diagnostics: inspect DOM structure to ensure there are no duplicates
        try {
          const rightPanes = Array.from(document.querySelectorAll('.editor-pane--right'));
          // Debug prints removed
          rightPanes.forEach((p, i) => {
            try {
              const cs = window.getComputedStyle(p);
              // Debug prints removed
            } catch (e) { }
          });

          const workspace = document.querySelector('.workspace__content');
          if (workspace) {
            // Debug prints removed
            const textareas = Array.from(document.querySelectorAll('textarea'));
            // Debug prints removed
          }
        } catch (e) {  }
        // focus the left editor so keyboard remains usable
        const leftTa = document.getElementById('note-editor');
        if (leftTa) {
          leftTa.focus();
        }
      } catch (err) {
      }
    });
  }

  if (elements.codePopover) {
    elements.codePopover.setAttribute('aria-hidden', elements.codePopover.hidden ? 'true' : 'false');
  }

  if (elements.editorSearch) {
    elements.editorSearch.setAttribute('aria-hidden', elements.editorSearch.hidden ? 'true' : 'false');
  }

  if (elements.editorSearchHighlights) {
    elements.editorSearchHighlights.setAttribute('aria-hidden', elements.editorSearchHighlights.hidden ? 'true' : 'false');
  }

  if (elements.workspaceTree) {
    elements.workspaceTree.addEventListener('click', handleWorkspaceTreeClick);
    elements.workspaceTree.addEventListener('contextmenu', handleWorkspaceTreeContextMenu);
    // Drag and drop event listeners for tree nodes
    elements.workspaceTree.addEventListener('dragstart', handleTreeNodeDragStart);
    elements.workspaceTree.addEventListener('dragend', handleTreeNodeDragEnd);
  }

  // Capture-phase drop handler to intercept internal note drops and route them
  // to the pane under the cursor. This runs before pane-level bubble handlers
  // so it prevents the left-pane listener from stealing drops.
  const handleCapturedNoteDrop = (ev) => {
    try {
      const types = ev.dataTransfer?.types ? Array.from(ev.dataTransfer.types) : [];
      if (!types.includes('text/noteId')) return; // not our internal drag

      // Get the note id and ensure it exists
      const noteId = ev.dataTransfer.getData('text/noteId');
      if (!noteId || !state.notes.has(noteId)) return;

      // Determine element under cursor
      const x = ev.clientX || (ev.touches && ev.touches[0] && ev.touches[0].clientX) || 0;
      const y = ev.clientY || (ev.touches && ev.touches[0] && ev.touches[0].clientY) || 0;
      const el = document.elementFromPoint(x, y);

      let paneId = null;
      if (el) {
        const paneRoot = el.closest && el.closest('[data-pane-id], .editor-pane--dynamic, .editor-pane--right, .editor-pane');
        if (paneRoot) {
          if (paneRoot.getAttribute) {
            const explicit = paneRoot.getAttribute('data-pane-id');
            if (explicit) paneId = explicit;
          }
          if (!paneId) {
            const ta = paneRoot.querySelector && paneRoot.querySelector('textarea');
            if (ta && ta.id) {
              if (ta.id === 'note-editor') paneId = 'left';
              else if (ta.id.startsWith('note-editor-')) paneId = ta.id.replace(/^note-editor-/, '');
            }
          }
          if (!paneId && paneRoot.classList && paneRoot.classList.contains('editor-pane--right')) paneId = 'right';
        }
      }

  if (!paneId || !editorInstances[paneId]) paneId = resolvePaneFallback(true);

          // If this is a markdown note being dropped onto a pane that currently
          // hosts a per-pane PDF viewer, remove the viewer and reveal the textarea
          // before we proceed to open it in the pane. This ensures the pane updates
          // even when an iframe was present.
          try {
            const droppedNote = state.notes.get(noteId);
            if (droppedNote && droppedNote.type === 'markdown') {
              try { clearPaneViewer(paneId); } catch (e) {}
              try {
                const inst = editorInstances[paneId];
                if (inst && inst.el) {
                  inst.el.hidden = false;
                  inst.el.disabled = false;
                  inst.el.value = droppedNote.content ?? '';
                }
              } catch (e) {}
            }
          } catch (e) {}

          // Prevent others from handling it
      try { ev.preventDefault(); } catch (e) {}
      try { ev.stopPropagation(); } catch (e) {}
      try { if (ev.stopImmediatePropagation) ev.stopImmediatePropagation(); } catch (e) {}

  // Debug prints removed
  try { showDropToast && showDropToast(noteId, paneId); } catch (e) {}
  openNoteInPane(noteId, paneId);
      try { ev._nta_handled = true; } catch (e) {}
    } catch (e) {
      // ignore non-fatal capture errors
    }
  };

  // Install capture-phase handler
  try { document.addEventListener('drop', handleCapturedNoteDrop, true); } catch (e) { /* ignore */ }
  
  // Small transient toast to surface drop routing for debugging/UX
  function showDropToast(noteId, paneId) {
    try {
      const id = `nta-drop-toast`;
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.style.position = 'fixed';
        el.style.zIndex = 99999;
        el.style.left = '50%';
        el.style.top = '20px';
        el.style.transform = 'translateX(-50%)';
        el.style.padding = '8px 12px';
        el.style.background = 'rgba(0,0,0,0.8)';
        el.style.color = 'white';
        el.style.borderRadius = '6px';
        el.style.fontSize = '13px';
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)';
        document.body.appendChild(el);
      }
      el.textContent = `Dropped note ${noteId} -> ${paneId}`;
      el.style.opacity = '1';
      clearTimeout(el._nta_toast_timer);
      el._nta_toast_timer = setTimeout(() => {
        try { el.style.transition = 'opacity 300ms ease'; el.style.opacity = '0'; } catch (e) {}
      }, 900);
    } catch (e) { /* ignore */ }
  }

  // Document-level drag tracking so the full pane area highlights while
  // dragging (use capture phase so we can respond before individual elements)
  try {
    let _nta_current_drop_pane = null;

    const docFindPaneAtPoint = (x, y) => {
      try {
        const el = document.elementFromPoint(x, y);
        if (!el) return null;
        return el.closest ? el.closest('[data-pane-id], .editor-pane--dynamic, .editor-pane--right, .editor-pane') : null;
      } catch (e) {
        return null;
      }
    };

    const docDragOver = (ev) => {
      try {
        // Allow drops
        if (ev && ev.preventDefault) ev.preventDefault();
        const x = ev.clientX || 0;
        const y = ev.clientY || 0;
        const pane = docFindPaneAtPoint(x, y);
        // When pointer is over an editor pane, do not show the global
        // editor-drop-target highlight. Clear any existing highlights so the
        // dashed area does not appear while hovering panes.
        if (pane !== _nta_current_drop_pane) {
          try { if (_nta_current_drop_pane) _nta_current_drop_pane.classList.remove('editor-drop-target'); } catch (e) {}
          _nta_current_drop_pane = pane;
          try {
            // Intentionally do not add the 'editor-drop-target' class when over panes
            if (_nta_current_drop_pane && _nta_current_drop_pane.classList) _nta_current_drop_pane.classList.remove('editor-drop-target');
          } catch (e) {}
        }
        if (ev && ev.dataTransfer) ev.dataTransfer.dropEffect = 'copy';
      } catch (e) { /* ignore */ }
    };

    const docDragLeave = (ev) => {
      try {
        // If pointer leaves the window (clientX/Y are 0 or negative), clear
        const x = ev.clientX || -1;
        const y = ev.clientY || -1;
        if (x <= 0 || y <= 0 || x >= window.innerWidth || y >= window.innerHeight) {
          try { if (_nta_current_drop_pane) _nta_current_drop_pane.classList.remove('editor-drop-target'); } catch (e) {}
          _nta_current_drop_pane = null;
        }
      } catch (e) { /* ignore */ }
    };

    const docDropClear = (ev) => {
      try { if (_nta_current_drop_pane) _nta_current_drop_pane.classList.remove('editor-drop-target'); } catch (e) {}
      _nta_current_drop_pane = null;
    };

    document.addEventListener('dragover', docDragOver, true);
    document.addEventListener('dragenter', docDragOver, true);
    document.addEventListener('dragleave', docDragLeave, true);
    document.addEventListener('drop', docDropClear, true);
  } catch (e) { /* ignore */ }

  // Global drag/drop handlers to allow dropping a folder from the OS (Finder/Explorer)
  // into the app to open it as a workspace. We skip internal drags that carry
  // our own 'text/noteId' payload so we don't interfere with dragging notes inside the app.
  document.addEventListener('dragover', (ev) => {
    try {
      ev.preventDefault();
      if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'copy';
    } catch (e) { /* ignore */ }
  });

  document.addEventListener('drop', async (ev) => {
    try {
      ev.preventDefault();

      // If the drag contains an internal note id, don't treat it as a folder drop
      try {
        const types = ev.dataTransfer?.types ? Array.from(ev.dataTransfer.types) : [];
        if (types.includes('text/noteId')) {
          return; // let our editor/tree handlers process internal note drags
        }
      } catch (e) { /* ignore */ }

      const files = ev.dataTransfer?.files;
      if (!files || files.length === 0) return;

      // Use the first dropped path. In Electron, File objects include a `path`.
      const first = files[0];
      let droppedPath = first?.path || null;
      if (!droppedPath) return;

      // If user dropped a single file (not a folder), open its parent folder
      // so the workspace shows that folder's contents. Use a simple heuristic
      // to detect filenames (presence of an extension) to avoid requiring
      // Node APIs from the renderer.
      const lastSegment = String(droppedPath).split(/[\\\/]/).pop() || '';
      let folderPath = droppedPath;
      if (lastSegment && lastSegment.includes('.') && !lastSegment.startsWith('.')) {
        // Treat as file -> use parent directory
        folderPath = String(droppedPath).replace(/[\\\/][^\\\/]+$/, '');
      }
      if (!folderPath) return;

      if (typeof window.api?.loadWorkspaceAtPath !== 'function') {
        setStatus('Cannot open dropped folder: native API unavailable.', false);
        return;
      }

      setStatus('Opening dropped folder...', true);
      
      // Get file size limits from settings
      const fileSizeLimits = {
        image: parseInt(readStorage('NTA.maxImageSize') || '10') * 1024 * 1024,
        video: parseInt(readStorage('NTA.maxVideoSize') || '100') * 1024 * 1024,
        script: parseInt(readStorage('NTA.maxScriptSize') || '5') * 1024 * 1024
      };
      
      const result = await window.api.loadWorkspaceAtPath({ folderPath, fileSizeLimits });
      if (result) {
        try {
          safeAdoptWorkspace(result);
          setStatus('Workspace loaded from drop.', true);
        } catch (e) {
          try { adoptWorkspace(result); setStatus('Workspace loaded from drop.', true); } catch (ee) { setStatus('Could not open dropped folder.', false); }
        }
      } else {
        setStatus('Could not load dropped folder.', false);
      }
    } catch (error) {
      setStatus('Drop failed — see logs.', false);
    }
  });

  // Workspace tree touch scrolling for swipe gestures
  let workspaceTreeLastTouchY = 0;
  const workspaceTreeTouchStart = (ev) => {
    if (!ev.touches || ev.touches.length === 0) return;
    workspaceTreeLastTouchY = ev.touches[0].clientY;
  };

  const workspaceTreeTouchMove = (ev) => {
    try {
      if (!elements.workspaceTree || !ev.touches || ev.touches.length === 0) return;
      const y = ev.touches[0].clientY;
      const dy = workspaceTreeLastTouchY - y;
      if (Math.abs(dy) > 5) { // Minimum threshold to prevent accidental scrolling
        ev.preventDefault();
        elements.workspaceTree.scrollTop += dy;
      }
      workspaceTreeLastTouchY = y;
    } catch (e) {
      // ignore touch handling errors
    }
  };

  if (elements.workspaceTree) {
    elements.workspaceTree.addEventListener('touchstart', workspaceTreeTouchStart, { passive: true });
    elements.workspaceTree.addEventListener('touchmove', workspaceTreeTouchMove, { passive: false });
  }

  // Ensure active pane follows focus reliably
  document.addEventListener('focusin', (ev) => {
    const target = ev.target;
    if (target === elements.editor) {
      setActiveEditorPane('left');
    } else if (target === elements.editorRight) {
      setActiveEditorPane('right');
    }
  });

  if (elements.workspaceContextMenu) {
    elements.workspaceContextMenu.addEventListener('click', handleContextMenuClick);
    
    // Add mouse event handlers to context menu buttons to fix focus/hover issues
    const contextMenuButtons = elements.workspaceContextMenu.querySelectorAll('button');
    contextMenuButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        // Remove focus from all other context menu buttons when hovering
        contextMenuButtons.forEach(otherButton => {
          if (otherButton !== button) {
            otherButton.blur();
          }
        });
      });
    });
  }

  window.addEventListener('click', handleGlobalClick);
  window.addEventListener('keydown', handleContextMenuKeyDown);

  elements.createFileButton?.addEventListener('click', handleCreateFileButtonClick);
  elements.toggleSidebarButton?.addEventListener('click', (event) => {
    event.preventDefault();
    toggleSidebarCollapsed();
  });
  // dual editor toggle removed
  elements.togglePreviewButton?.addEventListener('click', (event) => {
    event.preventDefault();
    togglePreviewCollapsed();
  });
  elements.inlinePreviewClose?.addEventListener('click', (event) => {
    event.preventDefault();
    togglePreviewCollapsed(); // This will cycle to the next mode (from inline to collapsed)
  });

  // New feature button event listeners
  elements.generateTocButton?.addEventListener('click', (event) => {
    event.preventDefault();
    generateTableOfContents();
  });

  elements.showStatsButton?.addEventListener('click', (event) => {
    event.preventDefault();
    showNoteStatistics();
  });

  // Templates button event listener
  elements.showTemplatesButton?.addEventListener('click', (event) => {
    event.preventDefault();
    showTemplatesModal();
  });

  // Math WYSIWYG toggle and handlers
  const mathWysiwygButton = document.getElementById('toggle-math-wysiwyg-button');
  const mathPanel = document.getElementById('math-wysiwyg-panel');
  const mathList = document.getElementById('math-wysiwyg-list');
  const mathPanelClose = document.getElementById('math-wysiwyg-close');
  const mathEditModal = document.getElementById('math-edit-modal');
  const mathEditClose = document.getElementById('math-edit-close');
  const mathEditTextarea = document.getElementById('math-edit-textarea');
  const mathEditPreview = document.getElementById('math-edit-preview');
  const mathEditCancel = document.getElementById('math-edit-cancel');
  const mathEditSave = document.getElementById('math-edit-save');

  const scanMathBlocks = () => {
    if (!elements.preview) return [];
    const blocks = Array.from(elements.preview.querySelectorAll('.math-block'));
    return blocks.map((el, idx) => ({ el, idx, source: el.dataset.mathSource ?? '' }));
  };

  const renderMathList = () => {
    if (!mathList) return;
    mathList.innerHTML = '';
    const blocks = scanMathBlocks();
    if (!blocks.length) {
      const empty = document.createElement('div');
      empty.className = 'math-wysiwyg__empty';
      empty.textContent = 'No math blocks found in the preview.';
      mathList.appendChild(empty);
      return;
    }

    blocks.forEach((b, i) => {
      const item = document.createElement('div');
      item.className = 'math-wysiwyg__item';
      const pre = document.createElement('pre');
      pre.textContent = b.source;
      const actions = document.createElement('div');
      actions.className = 'math-wysiwyg__actions';
      const editBtn = document.createElement('button');
      editBtn.className = 'ghost small';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => openMathEdit(b));
      actions.appendChild(editBtn);
      item.appendChild(pre);
      item.appendChild(actions);
      mathList.appendChild(item);
    });
  };

  const openMathPanel = () => {
    if (!mathPanel) return;
    mathPanel.hidden = false;
    mathWysiwygButton?.setAttribute('aria-pressed', 'true');
    renderMathList();
  };

  const closeMathPanel = () => {
    if (!mathPanel) return;
    mathPanel.hidden = true;
    mathWysiwygButton?.setAttribute('aria-pressed', 'false');
  };

  // Toggle between listing panel and editor live-preview. Default: enable live-preview overlay.
  // Note: there are two overlay DOM nodes (left/right). Existing code historically
  // used a single global `mathOverlay` + `elements.editor`. To support multiple
  // editors we resolve the correct textarea and overlay per-call so both the
  // left and right editors (and any future editors) can share the same logic.
  let mathOverlayEnabled = false;
  let mathOverlaySelectionOnly = false;
  let mathOverlayTimer = null;
  let previousMasked = '';

  const resolveEditorElement = (editorEl) => {
    if (editorEl && editorEl.tagName === 'TEXTAREA') return editorEl;
    // Prefer active pane; if it's a dynamic pane, attempt to resolve its textarea
    const pane = state.activeEditorPane || resolvePaneFallback(true);
    try {
      if (pane && pane !== 'left' && pane !== 'right') {
        const ta = document.getElementById(`note-editor-${pane}`);
        if (ta) return ta;
      }
    } catch (e) {}
    return pane === 'right' ? elements.editorRight : elements.editor;
  };

  const getOverlayForEditor = (editorEl) => {
    const e = resolveEditorElement(editorEl);
    if (!e || !e.id) return document.getElementById('editor-math-overlay');
    // dynamic overlay id pattern: editor-math-overlay-<paneId>
    const match = e.id.match(/^note-editor-(.+)$/);
    if (match && match[1]) {
      const overlay = document.getElementById(`editor-math-overlay-${match[1]}`);
      if (overlay) return overlay;
    }
    if (e === elements.editorRight) return document.getElementById('editor-math-overlay-right');
    return document.getElementById('editor-math-overlay');
  };

  // Map an overlay element back to its corresponding textarea editor
  const getEditorForOverlay = (overlayEl) => {
    if (!overlayEl) return resolveEditorElement();
    // overlay id may be 'editor-math-overlay' or 'editor-math-overlay-right' or 'editor-math-overlay-<paneId>'
    if (overlayEl.id === 'editor-math-overlay-right') return elements.editorRight;
    if (overlayEl.id === 'editor-math-overlay') return elements.editor;
    const m = overlayEl.id.match(/^editor-math-overlay-(.+)$/);
    if (m && m[1]) {
      const ta = document.getElementById(`note-editor-${m[1]}`);
      if (ta) return ta;
    }
    return resolveEditorElement();
  };

  const parseMathBlocksFromEditor = (text) => {
    const blocks = [];
    const regex = /\$\$([\s\S]*?)\$\$\s*/gm;
    let m;
    while ((m = regex.exec(text)) !== null) {
      blocks.push({ text: m[1].trim(), start: m.index, end: regex.lastIndex });
    }
    return blocks;
  };

  // Build ordered segments for overlay rendering and masking.
  // Segments can be: { type: 'text', text }
  // or { type: 'block', text, raw, start, end }
  // or { type: 'inline', text, raw, start, end }
  // or { type: 'heading', text, raw, level, start, end }
  const buildOverlaySegments = (content, offset = 0) => {
    const matches = [];

    // Local helpers for diagnostics and inline/block detection
    const trimmedContent = (typeof content === 'string' ? content : '').trim();
    const inlineMatches = Array.from((content || '').matchAll(/(?<!\$)\$([^\n$]+?)\$(?!\w)/gm));
    const blockMatches = Array.from((content || '').matchAll(/\$\$([\s\S]*?)\$\$\s*/gm));

    // Use renderMarkdownToHtml to collect block-level source map information
    let collector = null;
    try {
      const result = renderMarkdownToHtml(content, null, { collectSourceMap: true });
      collector = result.collector;
        } catch (e) {
        }

    // add block-level tokens from collector (if available)
      // No regex matches. If the trimmed content contains dollar signs, log diagnostic.
      if ((trimmedContent.indexOf('$') !== -1) && inlineMatches.length === 0 && blockMatches.length === 0) {
  // Debug prints removed
      }
    if (collector && Array.isArray(collector.blocks)) {
      // Only include structural blocks that should be rendered/masked specially.
      const specialBlocks = new Set(['mathBlock', 'code', 'heading', 'list_item', 'blockquote', 'table', 'tablecell', 'htmlCodeBlock']);
      for (const b of collector.blocks) {
        if (!b || typeof b.start !== 'number' || typeof b.end !== 'number') continue;
        if (!specialBlocks.has(b.type)) {
          // leave ordinary paragraphs and inline text to be treated as normal text
          continue;
        }
        const raw = content.slice(b.start, b.end);
        const skipInline = b.type === 'mathBlock' || b.type === 'code';
        // For math blocks, extract the content inside the $$ delimiters
        const text = b.type === 'mathBlock' ? raw.slice(raw.indexOf('$$') + 2, raw.lastIndexOf('$$')).trim() : (b.plainText ?? raw).trim();
        matches.push({ type: b.type, text, raw, start: b.start + offset, end: b.end + offset, level: b.depth ?? undefined, skipInline });
      }
    } else {
      // fallback: detect headings and block math with regex
      const blockRe = /\$\$([\s\S]*?)\$\$\s*/gm;
      let m;
      while ((m = blockRe.exec(content)) !== null) {
        matches.push({ type: 'block', text: m[1].trim(), raw: m[0], start: m.index + offset, end: blockRe.lastIndex + offset, skipInline: true });
      }
      const headingRe = /(^|\n)(#{1,6})[ \t]+([^\n]+)/gm;
      while ((m = headingRe.exec(content)) !== null) {
        const leadLen = (m[1] || '').length;
        const s = m.index + leadLen;
        const raw = m[0].slice(leadLen);
        const e = s + raw.length;
        matches.push({ type: 'heading', text: m[3].trim(), raw, level: m[2].length, start: s + offset, end: e + offset });
      }
    }

  // helper to check if a position is inside an existing block range that should skip inline parsing
  const insideBlock = (s, e) => matches.some((r) => r.skipInline && !(e <= r.start || s >= r.end));

    // inline patterns (skip those inside block ranges)
    const inlineMatchers = [
      { type: 'inline-math', re: /(?<!\$)\$([^\n$]+?)\$(?!\w)/gm },
      { type: 'inlinecode', re: /`([^`\n]+?)`/gm },
      { type: 'bold', re: /\*\*([^\n*]+?)\*\*/gm },
      { type: 'italic', re: /\*([^\n*]+?)\*/gm },
      { type: 'image', re: /!\[([^\]]*?)\]\(([^)]+?)\)/gm },
      { type: 'link', re: /\[([^\]]+?)\]\(([^)]+?)\)/gm },
      { type: 'wikilink', re: /!!\[\[([\s\S]+?)\]\]|!\[\[([\s\S]+?)\]\]|\[\[([\s\S]+?)\]\]/gm }
    ];

    for (const im of inlineMatchers) {
      try {
        let mm;
        while ((mm = im.re.exec(content)) !== null) {
          const s = mm.index;
          const e = im.re.lastIndex;
          if (insideBlock(s + offset, e + offset)) continue;
          // for capturing groups, pass relevant parts in text/raw
          const raw = mm[0];
          let text = mm[1] ?? raw;
          // images and links have multiple groups
          if (im.type === 'image' || (im.type === 'link' && mm[2])) {
            // mm[1] = alt/text, mm[2] = url
            matches.push({ type: im.type, text: mm[1], url: mm[2], raw, start: s + offset, end: e + offset });
          } else if (im.type === 'inline-math') {
            matches.push({ type: 'inline', text: mm[1], raw, start: s + offset, end: e + offset });
          } else if (im.type === 'wikilink') {
            // mm[1] for !![[...]], mm[2] for ![[...]], mm[3] for [[...]]
            const inner = mm[1] ?? mm[2] ?? mm[3] ?? '';
            let embed = false;
            if (mm[1]) embed = 'inline';  // !![[...]]
            else if (mm[2]) embed = true;   // ![[...]]
            matches.push({ type: 'wikilink', raw, inner, target: inner.trim(), embed, start: s + offset, end: e + offset });
          } else if (im.type === 'inlinecode') {
            matches.push({ type: 'inlinecode', text: mm[1], raw, start: s + offset, end: e + offset });
          } else if (im.type === 'bold') {
            matches.push({ type: 'bold', text: mm[1], raw, start: s + offset, end: e + offset });
          } else if (im.type === 'italic') {
            // ignore italic matches that are part of bold (**...**)
            const prevChar = content[s - 1];
            if (prevChar === '*') continue;
            matches.push({ type: 'italic', text: mm[1], raw, start: s + offset, end: e + offset });
          } else if (im.type === 'link') {
            matches.push({ type: 'link', text: mm[1], url: mm[2], raw, start: s + offset, end: e + offset });
          }
        }
      } catch (err) {
        // ignore regex issues
      }
    }

    // sort matches by start index
    matches.sort((a, b) => a.start - b.start || a.end - b.end);

    // build segments array by walking through content
    const segments = [];
    let last = 0;
    for (const mt of matches) {
      if (mt.start > last) {
        segments.push({ 
          type: 'text', 
          text: content.slice(last, mt.start - offset),
          start: last,
          end: mt.start - offset
        });
      }
      segments.push(mt);
      last = mt.end;
    }
    if (last < content.length + offset) {
      segments.push({ 
        type: 'text', 
        text: content.slice(last - offset),
        start: last - offset,
        end: content.length
      });
    }
    return segments;
  };

  const renderEditorMathOverlay = (selectionOnly = false, editorEl = null) => {
    console.log('renderEditorMathOverlay called:', { selectionOnly, editorEl, activeSelections: activeSelections.length });
    console.log('Active selections:', activeSelections);
    const editor = resolveEditorElement(editorEl);
    const mathOverlay = getOverlayForEditor(editor);
    if (!mathOverlay || !editor) {
      console.log('No overlay or editor found');
      return;
    }
    // use original content if masked, otherwise current editor value
    const fullContent = editor.__originalContent ?? editor.value ?? '';

    let content = fullContent;
    let offset = 0;
    let selectionStartLine = 0;
    let selectionEndLine = fullContent.length;

    if (selectionOnly && activeSelections.length > 0) {
      // For multi-selection mode, we don't modify content/offset but check against all active selections
      content = fullContent;
      offset = 0;
    }
    
    // Build mirror content: use overlay segments that include block math, inline math, and headings
    const segments = buildOverlaySegments(content, offset);
    console.log('Built segments:', segments.length, segments.map(s => ({ type: s.type, text: s.text?.substring(0, 20), start: s.start, end: s.end })));
    // debug: show segments when troubleshooting
    if (window.__debugMathOverlay) {
  // Debug prints removed
    }

  const frag = document.createDocumentFragment();
    segments.forEach((seg) => {
      // For selection-only mode, only render enhanced content (math, images, etc.) if the segment overlaps with any active selection
      const isInSelection = !selectionOnly || activeSelections.some(sel => 
        seg.start < sel.end && seg.end > sel.start
      );
      console.log('Segment:', { type: seg.type, start: seg.start, end: seg.end, text: seg.text?.substring(0, 20), isInSelection });
      
      if (seg.type === 'text') {
        const span = document.createElement('span');
        span.className = 'mirror-text';
        if (selectionOnly && !isInSelection) {
          span.style.opacity = '0'; // transparent in selection-only mode for text outside selection
          span.style.pointerEvents = 'none'; // allow interaction with editor underneath
        }
        // Always show text, even outside selection in selection-only mode
        const escaped = seg.text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        span.innerHTML = escaped.replace(/\n/g, '<br>');
        console.log('Creating mirror-text span:', {
          text: seg.text,
          escaped: escaped,
          isInSelection: isInSelection,
          selectionOnly: selectionOnly,
          opacity: span.style.opacity,
          innerHTML: span.innerHTML
        });
        frag.appendChild(span);
      } else if (seg.type === 'block' || seg.type === 'mathBlock') {
        if (isInSelection) {
          const wrapper = document.createElement('div');
          wrapper.className = 'editor-math-block';
          try {
            if (window.katex) {
              wrapper.innerHTML = window.katex.renderToString(seg.text, { throwOnError: false, displayMode: true });
            } else {
              wrapper.textContent = seg.text;
            }
          } catch (err) {
            wrapper.textContent = seg.text;
          }
          wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            // Use the Editor instance API so selection/focus target the correct pane
            try {
              const edtInst = getEditorInstanceForElement(editor);
              if (edtInst) { edtInst.focus(); edtInst.setSelectionRange(seg.start, seg.end); }
            } catch (err) { /* ignore */ }
            // Remove all selections that overlap with this segment
            activeSelections = activeSelections.filter(sel => !(sel.start < seg.end && sel.end > sel.start));
            // Re-render overlay
            renderEditorMathOverlay(true);
            // Re-mask
            try { maskSelectedRanges(activeSelections, editor); } catch (e) {}
            previousMasked = editor.value;
          });
          frag.appendChild(wrapper);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const wrapper = document.createElement('div');
          wrapper.className = 'editor-math-block';
          wrapper.style.opacity = '0';
          wrapper.style.pointerEvents = 'none'; // allow interaction with editor underneath
          try {
            if (window.katex) {
              wrapper.innerHTML = window.katex.renderToString(seg.text, { throwOnError: false, displayMode: true });
            } else {
              wrapper.textContent = seg.text;
            }
          } catch (err) {
            wrapper.textContent = seg.text;
          }
          frag.appendChild(wrapper);
        } else {
          // In full mode, don't render non-selected math blocks
        }
      } else if (seg.type === 'inline') {
        if (isInSelection) {
          const span = document.createElement('span');
          span.className = 'editor-math-inline';
          try {
            if (window.katex) {
              span.innerHTML = window.katex.renderToString(seg.text, { throwOnError: false, displayMode: false });
            } else {
              span.textContent = seg.text;
            }
          } catch (err) {
            span.textContent = seg.text;
          }
          span.addEventListener('click', (e) => {
            e.stopPropagation();
            // Use the Editor instance API so selection/focus target the correct pane
            try {
              const edtInst = getEditorInstanceForElement(editor);
              if (edtInst) { edtInst.focus(); edtInst.setSelectionRange(seg.start, seg.end); }
            } catch (err) { /* ignore */ }
            // Remove all selections that overlap with this segment
            activeSelections = activeSelections.filter(sel => !(sel.start < seg.end && sel.end > sel.start));
            // Re-render overlay
            renderEditorMathOverlay(true);
            // Re-mask
            try { maskSelectedRanges(activeSelections, editor); } catch (e) {}
            previousMasked = editor.value;
          });
          frag.appendChild(span);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const span = document.createElement('span');
          span.className = 'editor-math-inline';
          span.style.opacity = '0';
          span.style.pointerEvents = 'none'; // allow interaction with editor underneath
          try {
            if (window.katex) {
              span.innerHTML = window.katex.renderToString(seg.text, { throwOnError: false, displayMode: false });
            } else {
              span.textContent = seg.text;
            }
          } catch (err) {
            span.textContent = seg.text;
          }
          frag.appendChild(span);
        } else {
          // In full mode, don't render non-selected inline math
        }
      } else if (seg.type === 'inlinecode') {
        if (isInSelection) {
          const code = document.createElement('code');
          code.className = 'editor-inline-code';
          code.textContent = seg.text;
          frag.appendChild(code);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const code = document.createElement('code');
          code.className = 'editor-inline-code';
          code.style.opacity = '0';
          code.style.pointerEvents = 'none'; // allow interaction with editor underneath
          code.textContent = seg.text;
          frag.appendChild(code);
        } else {
          // In full mode, don't render non-selected inline code
        }
      } else if (seg.type === 'bold') {
        if (isInSelection) {
          const s = document.createElement('strong');
          s.textContent = seg.text;
          frag.appendChild(s);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const s = document.createElement('strong');
          s.style.opacity = '0';
          s.style.pointerEvents = 'none'; // allow interaction with editor underneath
          s.textContent = seg.text;
          frag.appendChild(s);
        } else {
          // In full mode, don't render non-selected bold
        }
      } else if (seg.type === 'italic') {
        if (isInSelection) {
          const s = document.createElement('em');
          s.textContent = seg.text;
          frag.appendChild(s);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const s = document.createElement('em');
          s.style.opacity = '0';
          s.style.pointerEvents = 'none'; // allow interaction with editor underneath
          s.textContent = seg.text;
          frag.appendChild(s);
        } else {
          // In full mode, don't render non-selected italic
        }
      } else if (seg.type === 'link') {
        if (isInSelection) {
          const a = document.createElement('a');
          a.href = seg.url || '#';
          a.textContent = seg.text || seg.url || '';
          a.target = '_blank';
          frag.appendChild(a);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const a = document.createElement('a');
          a.href = seg.url || '#';
          a.style.opacity = '0';
          a.style.pointerEvents = 'none'; // allow interaction with editor underneath
          a.textContent = seg.text || seg.url || '';
          a.target = '_blank';
          frag.appendChild(a);
        } else {
          // In full mode, don't render non-selected links
        }
      } else if (seg.type === 'image') {
        if (isInSelection) {
          // If the URL looks like a video file, render a video element instead of an <img>
          const ext = getFileExtension(seg.url || '') || '';
          if (videoExtensions.has(ext)) {
            const video = document.createElement('video');
            video.controls = true;
            video.preload = 'metadata';
            video.className = 'editor-overlay-video';
            // store raw src so resolver can replace it with a file:// or blob URL
            if (seg.url) video.setAttribute('data-raw-src', seg.url);
            if (seg.text) video.setAttribute('title', seg.text);
            // If a noteId is available via render context, attach it for resolver caching
            try {
              const ctx = getRenderContext();
              if (ctx && ctx.noteId) video.setAttribute('data-note-id', String(ctx.noteId));
            } catch (e) {
              // ignore
            }
            // Allow interactions on the overlay video; temporarily disable textarea pointerEvents while interacting
            video.style.pointerEvents = 'auto';
            video.addEventListener('mouseenter', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {} });
            video.addEventListener('mouseleave', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = ''; } catch (e) {} });
            video.addEventListener('touchstart', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
            video.addEventListener('touchend', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = ''; } catch (e) {} });
            // Fallback text for browsers that don't support <video>
            video.innerHTML = seg.text ? `Your browser does not support the video tag. ${escapeHtml(seg.text)}` : 'Your browser does not support the video tag.';
            frag.appendChild(video);
          } else {
            const img = document.createElement('img');
            img.src = seg.url || '';
            img.alt = seg.text || '';
            img.className = 'editor-overlay-image';
            frag.appendChild(img);
          }
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const ext = getFileExtension(seg.url || '') || '';
          if (videoExtensions.has(ext)) {
            const video = document.createElement('video');
            video.controls = true;
            video.preload = 'metadata';
            video.className = 'editor-overlay-video';
            video.style.opacity = '0';
            video.style.pointerEvents = 'none'; // allow interaction with editor underneath
            // store raw src so resolver can replace it with a file:// or blob URL
            if (seg.url) video.setAttribute('data-raw-src', seg.url);
            if (seg.text) video.setAttribute('title', seg.text);
            // If a noteId is available via render context, attach it for resolver caching
            try {
              const ctx = getRenderContext();
              if (ctx && ctx.noteId) video.setAttribute('data-note-id', String(ctx.noteId));
            } catch (e) {
              // ignore
            }
            // Allow interactions on the overlay video; temporarily disable textarea pointerEvents while interacting
            video.style.pointerEvents = 'auto';
            video.addEventListener('mouseenter', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {} });
            video.addEventListener('mouseleave', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = ''; } catch (e) {} });
            video.addEventListener('touchstart', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
            video.addEventListener('touchend', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {} });
            video.addEventListener('touchend', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = ''; } catch (e) {} });
            // Fallback text for browsers that don't support <video>
            video.innerHTML = seg.text ? `Your browser does not support the video tag. ${escapeHtml(seg.text)}` : 'Your browser does not support the video tag.';
            frag.appendChild(video);
          } else {
            const img = document.createElement('img');
            img.src = seg.url || '';
            img.alt = seg.text || '';
            img.className = 'editor-overlay-image';
            img.style.opacity = '0';
            img.style.pointerEvents = 'none'; // allow interaction with editor underneath
            frag.appendChild(img);
          }
        } else {
          // In full mode, don't render non-selected images
        }
      } else if (seg.type === 'wikilink') {
        if (isInSelection) {
          const wrapper = document.createElement('span');
          wrapper.className = 'editor-wikilink';
          try {
            const token = { target: seg.target, raw: seg.raw, embed: seg.embed };
            const targetInfo = parseWikiTarget(token.target, null);
            if (token.embed === 'inline') {
              wrapper.innerHTML = renderInlineEmbed(token, targetInfo, null);
            } else if (token.embed) {
              wrapper.innerHTML = renderWikiEmbed(token, targetInfo, null);
            } else {
              const presentation = getWikiTargetPresentation(token, targetInfo);
              const display = escapeHtml(presentation.display);
              wrapper.innerHTML = renderWikiLinkSpan({
                noteId: targetInfo.noteId,
                targetAttr: escapeHtml(token.target),
                display,
                blockId: targetInfo.blockId,
                blockMissing: Boolean(targetInfo.blockId && !targetInfo.hasBlock)
              });
            }
          } catch (err) {
            wrapper.textContent = seg.raw || '';
          }
          frag.appendChild(wrapper);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const wrapper = document.createElement('span');
          wrapper.className = 'editor-wikilink';
          wrapper.style.opacity = '0';
          wrapper.style.pointerEvents = 'none'; // allow interaction with editor underneath
          try {
            const token = { target: seg.target, raw: seg.raw, embed: seg.embed };
            const targetInfo = parseWikiTarget(token.target, null);
            if (token.embed === 'inline') {
              wrapper.innerHTML = renderInlineEmbed(token, targetInfo, null);
            } else if (token.embed) {
              wrapper.innerHTML = renderWikiEmbed(token, targetInfo, null);
            } else {
              const presentation = getWikiTargetPresentation(token, targetInfo);
              const display = escapeHtml(presentation.display);
              wrapper.innerHTML = renderWikiLinkSpan({
                noteId: targetInfo.noteId,
                targetAttr: escapeHtml(token.target),
                display,
                blockId: targetInfo.blockId,
                blockMissing: Boolean(targetInfo.blockId && !targetInfo.hasBlock)
              });
            }
          } catch (err) {
            wrapper.textContent = seg.raw || '';
          }
          frag.appendChild(wrapper);
        } else {
          // In full mode, don't render non-selected wikilinks
        }
      } else if (seg.type === 'htmlCodeBlock') {
        if (isInSelection) {
          // Render HTML code block as sandboxed iframe using a blob URL (same approach as preview renderer)
          const container = document.createElement('div');
          container.className = 'editor-html-block';
          try {
            let modifiedHtml = seg.text || '';
            const autoResizeScript = `\n<script>function notifyParentOfResize(){const height=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight);try{if(window.parent&&window.parent!==window){window.parent.postMessage({type:'iframe-resize',height:height,source:window.location.href},'*');}}catch(e){} }window.addEventListener('load',notifyParentOfResize);window.addEventListener('resize',notifyParentOfResize);document.addEventListener('DOMContentLoaded',notifyParentOfResize);setTimeout(notifyParentOfResize,100);setTimeout(notifyParentOfResize,500);setTimeout(notifyParentOfResize,1500);if(window.MutationObserver){const observer=new MutationObserver(()=>{setTimeout(notifyParentOfResize,50);});observer.observe(document.body,{childList:true,subtree:true,attributes:true});}</script>\n`;
            if (modifiedHtml.includes('</body>')) {
              modifiedHtml = modifiedHtml.replace('</body>', autoResizeScript + '</body>');
            } else if (modifiedHtml.includes('</html>')) {
              modifiedHtml = modifiedHtml.replace('</html>', autoResizeScript + '</html>');
            } else {
              modifiedHtml = modifiedHtml + autoResizeScript;
            }

            const blob = new Blob([modifiedHtml], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);
            if (!window.htmlBlobUrls) window.htmlBlobUrls = new Set();
            window.htmlBlobUrls.add(blobUrl);

            const iframe = document.createElement('iframe');
            iframe.src = blobUrl;
            // mark iframe for overlay processing/resizing
            iframe.classList.add('html-embed-iframe');
            iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups');
            iframe.style.width = '100%';
            iframe.style.border = '1px solid #ddd';
            iframe.style.borderRadius = '4px';
            iframe.style.height = '420px';
            // allow pointer events so user can interact with embedded content
            iframe.style.pointerEvents = 'auto';
            // keep a record of original raw src for resolver flow if needed
            iframe.setAttribute('data-raw-src', blobUrl);
            // Ensure iframe interaction works when the overlay is sitting above the textarea.
            // Temporarily disable textarea pointer events while hovering/touching the iframe so clicks go to the iframe.
            iframe.addEventListener('mouseenter', () => {
              try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {}
            });
            iframe.addEventListener('mouseleave', () => {
              try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = ''; } catch (e) {}
            });
            iframe.addEventListener('touchstart', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
            iframe.addEventListener('touchend', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = ''; } catch (e) {} });
            iframe.onload = function () { /* auto-resize handled via script in iframe */ };
            container.appendChild(iframe);
          } catch (err) {
            container.textContent = seg.text || '';
          }
          frag.appendChild(container);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const container = document.createElement('div');
          container.className = 'editor-html-block';
          container.style.opacity = '0';
          container.style.pointerEvents = 'none'; // allow interaction with editor underneath
          try {
            let modifiedHtml = seg.text || '';
            const autoResizeScript = `\n<script>function notifyParentOfResize(){const height=Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight);try{if(window.parent&&window.parent!==window){window.parent.postMessage({type:'iframe-resize',height:height,source:window.location.href},'*');}}catch(e){} }window.addEventListener('load',notifyParentOfResize);window.addEventListener('resize',notifyParentOfResize);document.addEventListener('DOMContentLoaded',notifyParentOfResize);setTimeout(notifyParentOfResize,100);setTimeout(notifyParentOfResize,500);setTimeout(notifyParentOfResize,1500);if(window.MutationObserver){const observer=new MutationObserver(()=>{setTimeout(notifyParentOfResize,50);});observer.observe(document.body,{childList:true,subtree:true,attributes:true});}</script>\n`;
            if (modifiedHtml.includes('</body>')) {
              modifiedHtml = modifiedHtml.replace('</body>', autoResizeScript + '</body>');
            } else if (modifiedHtml.includes('</html>')) {
              modifiedHtml = modifiedHtml.replace('</html>', autoResizeScript + '</html>');
            } else {
              modifiedHtml = modifiedHtml + autoResizeScript;
            }

            const blob = new Blob([modifiedHtml], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);
            if (!window.htmlBlobUrls) window.htmlBlobUrls = new Set();
            window.htmlBlobUrls.add(blobUrl);

            const iframe = document.createElement('iframe');
            iframe.src = blobUrl;
            // mark iframe for overlay processing/resizing
            iframe.classList.add('html-embed-iframe');
            iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups');
            iframe.style.width = '100%';
            iframe.style.border = '1px solid #ddd';
            iframe.style.borderRadius = '4px';
            iframe.style.height = '420px';
            // allow pointer events so user can interact with embedded content
            iframe.style.pointerEvents = 'auto';
            // keep a record of original raw src for resolver flow if needed
            iframe.setAttribute('data-raw-src', blobUrl);
            // Ensure iframe interaction works when the overlay is sitting above the textarea.
            // Temporarily disable textarea pointer events while hovering/touching the iframe so clicks go to the iframe.
            iframe.addEventListener('mouseenter', () => {
              try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {}
            });
            iframe.addEventListener('mouseleave', () => {
              try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = ''; } catch (e) {}
            });
            iframe.addEventListener('touchstart', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
            iframe.addEventListener('touchend', () => { try { const edt = getEditorForOverlay(getOverlayForEditor(editor)); if (edt) edt.style.pointerEvents = ''; } catch (e) {} });
            iframe.onload = function () { /* auto-resize handled via script in iframe */ };
            container.appendChild(iframe);
          } catch (err) {
            container.textContent = seg.text || '';
          }
          frag.appendChild(container);
        } else {
          // In full mode, don't render non-selected HTML blocks
        }
      } else if (seg.type === 'code') {
        if (isInSelection) {
          const pre = document.createElement('pre');
          const c = document.createElement('code');
          c.textContent = seg.text;
          pre.appendChild(c);
          pre.className = 'editor-block-code';
          frag.appendChild(pre);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const pre = document.createElement('pre');
          const c = document.createElement('code');
          c.textContent = seg.text;
          pre.appendChild(c);
          pre.className = 'editor-block-code';
          pre.style.opacity = '0';
          frag.appendChild(pre);
        } else {
          // In full mode, don't render non-selected code blocks
        }
      } else if (seg.type === 'list_item') {
        if (isInSelection) {
          const li = document.createElement('div');
          li.className = 'editor-list-item';
          li.textContent = seg.text;
          frag.appendChild(li);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const li = document.createElement('div');
          li.className = 'editor-list-item';
          li.style.opacity = '0';
          li.textContent = seg.text;
          frag.appendChild(li);
        } else {
          // In full mode, don't render non-selected list items
        }
      } else if (seg.type === 'blockquote') {
        if (isInSelection) {
          const bq = document.createElement('blockquote');
          bq.textContent = seg.text;
          frag.appendChild(bq);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const bq = document.createElement('blockquote');
          bq.style.opacity = '0';
          bq.textContent = seg.text;
          frag.appendChild(bq);
        } else {
          // In full mode, don't render non-selected blockquotes
        }
      } else if (seg.type === 'table' || seg.type === 'tablecell') {
        if (isInSelection) {
          const span = document.createElement('span');
          span.className = 'editor-table';
          const escaped = (seg.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          span.innerHTML = escaped.replace(/\n/g, '<br>');
          frag.appendChild(span);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const span = document.createElement('span');
          span.className = 'editor-table';
          span.style.opacity = '0';
          const escaped = (seg.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          span.innerHTML = escaped.replace(/\n/g, '<br>');
          frag.appendChild(span);
        } else {
          // In full mode, don't render non-selected tables
        }
      } else if (seg.type === 'heading') {
        if (isInSelection) {
          const h = document.createElement('div');
          h.className = `editor-heading editor-heading--h${seg.level}`;
          // render heading text as plain text (escaped)
          const escaped = seg.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const strong = document.createElement('strong');
          try { strong.textContent = escaped; } catch (e) { strong.textContent = seg.text; }
          h.appendChild(strong);
          frag.appendChild(h);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const h = document.createElement('div');
          h.className = `editor-heading editor-heading--h${seg.level}`;
          h.style.opacity = '0';
          // render heading text as plain text (escaped)
          const escaped = seg.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const strong2 = document.createElement('strong');
          try { strong2.textContent = escaped; } catch (e) { strong2.textContent = seg.text; }
          h.appendChild(strong2);
          frag.appendChild(h);
        } else {
          // In full mode, don't render non-selected headings
        }
      }
    });

  mathOverlay.innerHTML = '';
  mathOverlay.appendChild(frag);
  // ensure overlay scroll matches editor
  mathOverlay.scrollTop = editor.scrollTop;
    // Resolve any iframe.html-embed-iframe[data-raw-src] inside the overlay (like preview)
    try {
      processOverlayHtmlIframes();
      processOverlayImages();
      processOverlayVideos();
    } catch (e) {
      // ignore
    }
  };

  const processOverlayHtmlIframes = async (editorEl = null) => {
  const mathOverlay = getOverlayForEditor(editorEl);
  const editor = resolveEditorElement(editorEl);
  if (!mathOverlay) return;
    const iframes = Array.from(mathOverlay.querySelectorAll('iframe.html-embed-iframe[data-raw-src]'));
    if (!iframes.length) return;

    await Promise.all(iframes.map(async (iframe) => {
      const rawSrc = iframe.getAttribute('data-raw-src');
      if (!rawSrc) return;

      // Defensive: ignore raw sources pointing at app renderer files only
      try {
        const normalized = String(rawSrc).replace(/\\/g, '/');
        if (normalized.includes('/src/renderer/')) {
          iframe.setAttribute('data-resolve-status', 'skipped-local');
          return;
        }
      } catch (e) {
        // continue if normalization fails
      }

      if (isLikelyExternalUrl(rawSrc) || rawSrc.startsWith('data:') || rawSrc.startsWith('blob:')) {
        iframe.src = rawSrc;
        // mark interactive and wire pointer handling
        try {
          iframe.classList.add('html-embed-iframe');
          iframe.style.pointerEvents = 'auto';
          // add helpers so the underlying textarea doesn't steal pointer events while interacting with iframe
          iframe.addEventListener('mouseenter', () => { try { const edt = getEditorForOverlay(mathOverlay); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {} });
          iframe.addEventListener('mouseleave', () => { try { const edt = getEditorForOverlay(mathOverlay); if (edt) edt.style.pointerEvents = ''; } catch (e) {} });
          iframe.addEventListener('touchstart', () => { try { const edt = getEditorForOverlay(mathOverlay); if (edt) edt.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
          iframe.addEventListener('touchend', () => { try { const edt = getEditorForOverlay(mathOverlay); if (edt) edt.style.pointerEvents = ''; } catch (e) {} });
        } catch (e) { /* ignore */ }
        iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
        return;
      }

  const noteId = iframe.getAttribute('data-note-id') || getPaneNoteId(editor === elements.editorRight ? 'right' : 'left') || state.activeNoteId;
      const cacheKey = `${noteId ?? 'unknown'}::${rawSrc}`;
      if (htmlResourceCache.has(cacheKey)) {
        const cached = htmlResourceCache.get(cacheKey);
        if (cached) {
          iframe.src = cached;
          iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
        }
        return;
      }

      if (typeof window.api?.resolveResource !== 'function') {
        try {
          let candidate = null;
          if (rawSrc.startsWith('/')) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc}`;
          } else if (/^[A-Za-z]:\\/.test(rawSrc)) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc.replace(/\\/g, '/')}`;
          } else if (state.currentFolder) {
            const joined = `${state.currentFolder.replace(/\/$/, '')}/${rawSrc}`;
            candidate = `file://${joined}`;
          }

          if (candidate) {
            htmlResourceCache.set(cacheKey, candidate);
            iframe.src = candidate;
            iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
            return;
          }
        } catch (err) {
          // fall-through
        }

        htmlResourceCache.set(cacheKey, null);
        return;
      }

      const note = noteId ? state.notes.get(noteId) ?? null : null;
      const payload = { src: rawSrc, notePath: note?.absolutePath ?? null, folderPath: note?.folderPath ?? state.currentFolder ?? null };
      try {
        const result = await window.api.resolveResource(payload);
  // Debug prints removed
        if (result?.value) {
          htmlResourceCache.set(cacheKey, result.value);
          iframe.src = result.value;
          iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
        } else {
          htmlResourceCache.set(cacheKey, null);
        }
      } catch (err) {
        htmlResourceCache.set(cacheKey, null);
      }
    }));
  };

  const processOverlayImages = async (editorEl = null) => {
  const mathOverlay = getOverlayForEditor(editorEl);
  const editor = resolveEditorElement(editorEl);
  if (!mathOverlay) return;
    const images = Array.from(mathOverlay.querySelectorAll('img[data-raw-src]'));
    if (!images.length) return;

    await Promise.all(images.map(async (img) => {
      const rawSrc = img.getAttribute('data-raw-src');
      if (!rawSrc) return;

      if (isLikelyExternalUrl(rawSrc) || rawSrc.startsWith('data:') || rawSrc.startsWith('blob:')) {
        try {
          img.src = rawSrc;
        } catch (e) {
          // ignore
        }
        return;
      }

  const noteId = img.getAttribute('data-note-id') || getPaneNoteId(editor === elements.editorRight ? 'right' : 'left') || state.activeNoteId;
  const cacheKey = `${noteId ?? 'unknown'}::${rawSrc}`;
      if (imageResourceCache.has(cacheKey)) {
        const cached = imageResourceCache.get(cacheKey);
        if (cached) img.src = cached;
        return;
      }

      const note = noteId ? state.notes.get(noteId) ?? null : null;
      const payload = { src: rawSrc, notePath: note?.absolutePath ?? null, folderPath: note?.folderPath ?? state.currentFolder ?? null };
      try {
        const result = await window.api.resolveResource(payload);
        if (result?.value) {
          imageResourceCache.set(cacheKey, result.value);
          img.src = result.value;
        } else {
          imageResourceCache.set(cacheKey, null);
        }
      } catch (err) {
        imageResourceCache.set(cacheKey, null);
      }
    }));
  };

  const processOverlayVideos = async (editorEl = null) => {
  const mathOverlay = getOverlayForEditor(editorEl);
  const editor = resolveEditorElement(editorEl);
  if (!mathOverlay) return;
    const videos = Array.from(mathOverlay.querySelectorAll('video[data-raw-src]'));
    if (!videos.length) return;

    await Promise.all(videos.map(async (video) => {
      const rawSrc = video.getAttribute('data-raw-src');
      if (!rawSrc) return;

      if (isLikelyExternalUrl(rawSrc) || rawSrc.startsWith('data:') || rawSrc.startsWith('blob:')) {
        try {
          video.src = rawSrc;
        } catch (e) {
          // ignore
        }
        return;
      }

  const noteId = video.getAttribute('data-note-id') || getPaneNoteId(editor === elements.editorRight ? 'right' : 'left') || state.activeNoteId;
  const cacheKey = `${noteId ?? 'unknown'}::${rawSrc}`;
      if (videoResourceCache.has(cacheKey)) {
        const cached = videoResourceCache.get(cacheKey);
        if (cached) video.src = cached;
        return;
      }

      if (typeof window.api?.resolveResource !== 'function') {
        try {
          let candidate = null;
          if (rawSrc.startsWith('/')) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc}`;
          } else if (/^[A-Za-z]:\\/.test(rawSrc)) {
            candidate = rawSrc.startsWith('file://') ? rawSrc : `file://${rawSrc.replace(/\\/g, '/')}`;
          } else if (state.currentFolder) {
            const joined = `${state.currentFolder.replace(/\/$/, '')}/${rawSrc}`;
            candidate = `file://${joined}`;
          }

          if (candidate) {
            videoResourceCache.set(cacheKey, candidate);
            video.src = candidate;
            return;
          }
        } catch (err) {
          // fall-through
        }

        videoResourceCache.set(cacheKey, null);
        return;
      }

      const note = noteId ? state.notes.get(noteId) ?? null : null;
      const payload = { src: rawSrc, notePath: note?.absolutePath ?? null, folderPath: note?.folderPath ?? state.currentFolder ?? null };
      try {
        const result = await window.api.resolveResource(payload);
        if (result?.value) {
          videoResourceCache.set(cacheKey, result.value);
          video.src = result.value;
        } else {
          videoResourceCache.set(cacheKey, null);
        }
      } catch (err) {
        videoResourceCache.set(cacheKey, null);
      }
    }));
  };

  // Masking math blocks in the textarea with invisible placeholders while overlay is active
  const maskMathInEditor = (selectionOnly = false, editorEl = null) => {
    const editor = resolveEditorElement(editorEl);
    if (!editor) return;
    const orig = editor.value || '';
    const segments = buildOverlaySegments(orig);
    const maskChar = '\u2800'; // braille blank
    let masked = '';
    const ranges = [];
    let pos = 0;
    for (const seg of segments) {
      if (seg.type === 'text') {
        masked += seg.text;
        pos += seg.text.length;
      } else {
        // for block, inline, heading: mask the raw source length
        const raw = seg.raw ?? (seg.type === 'block' ? `$$\n${seg.text}\n$$` : seg.text);
        const len = raw.length;
        const start = masked.length;
        masked += maskChar.repeat(len);
        const end = masked.length;
        ranges.push({ start, end, type: seg.type });
        pos += len;
      }
    }

    // store original content and masked ranges
    editor.__originalContent = orig;
    editor.__maskedRanges = ranges;
    editor.value = masked;
  };

  const maskSelectedRanges = (selections, editorEl = null) => {
    const editor = resolveEditorElement(editorEl);
    if (!editor || !editor.__originalContent) {
      return;
    }
    let content = editor.__originalContent;
    // Sort selections by start position descending to avoid offset issues when replacing
    const sorted = selections.slice().sort((a, b) => b.start - a.start);
    for (const sel of sorted) {
      const before = content.slice(0, sel.start);
      const after = content.slice(sel.end);
      const original = content.slice(sel.start, sel.end);
      const masked = original.replace(/[^\n]/g, '\u2800');
      content = before + masked + after;
    }
    editor.value = content;
  };

  const isInMaskedRange = (pos, editorEl = null) => {
    const editor = resolveEditorElement(editorEl);
    const ranges = editor?.__maskedRanges || [];
    for (const r of ranges) {
      if (pos >= r.start && pos <= r.end) return r;
    }
    return null;
  };

  const unmaskEditor = (editorEl = null) => {
    const editor = resolveEditorElement(editorEl);
    if (editor && editor.__originalContent !== undefined) {
      editor.value = editor.__originalContent;
      delete editor.__originalContent;
      delete editor.__maskedRanges;
    }
  };

  const handleBeforeInput = (ev) => {
    try {
      const editor = resolveEditorElement();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const inStart = isInMaskedRange(start, editor);
      const inEnd = isInMaskedRange(end, editor);
      if (inStart || inEnd) {
        // prevent edits inside masked math; move caret to end of masked block
        ev.preventDefault();
        const r = inEnd || inStart;
        editor.selectionStart = editor.selectionEnd = r.end;
        return false;
      }
    } catch (e) {
      // ignore
    }
  };

  const enableMathOverlay = (selectionOnly = false) => {
    mathOverlayEnabled = true;
    mathOverlaySelectionOnly = selectionOnly;
    const editor = resolveEditorElement();
    const overlay = getOverlayForEditor(editor);
    if (overlay) {
      overlay.hidden = false;
      overlay.style.display = '';
      overlay.setAttribute('aria-hidden', 'false');
      try { overlay.style.pointerEvents = selectionOnly ? 'none' : 'auto'; } catch (e) {}
    }

    if (editor) {
      if (selectionOnly) {
        // For selection-only mode, keep text visible but mask selected ranges
        editor.__prevColor = editor.style.color || '';
        editor.__originalContent = editor.value;
        // Store current selection before masking
        editor.__storedSelection = { start: editor.selectionStart, end: editor.selectionEnd };
        // Don't make text transparent for selection-only mode
        editor.style.caretColor = getComputedStyle(document.documentElement).getPropertyValue('--fg') || '#000';
        // Mask the selected ranges
        maskSelectedRanges(activeSelections, editor);
        previousMasked = editor.value;
      } else {
        // For full document mode, make text transparent so overlay shows through
        editor.__prevColor = editor.style.color || '';
        editor.style.color = 'transparent';
        editor.style.caretColor = getComputedStyle(document.documentElement).getPropertyValue('--fg') || '#000';
      }

      // sync scroll
      editor.addEventListener('scroll', syncOverlayScroll);
      // allow overlay interactions to scroll the editor: listen for wheel and touch events on overlay
      if (overlay) {
        overlay.addEventListener('wheel', overlayWheelHandler, { passive: false });
        overlay.addEventListener('touchstart', overlayTouchStart, { passive: true });
        overlay.addEventListener('touchmove', overlayTouchMove, { passive: false });
        // If user interacts directly with overlay scrollbar or scrollbar thumb, forward overlay scroll to editor
        overlay.addEventListener('scroll', overlayScrollHandler);
      }
      // mask math segments in editor so they temporarily disappear (only for full mode)
      if (!selectionOnly) {
        maskMathInEditor(selectionOnly, editor);
        // Prevent user from editing masked regions
        editor.addEventListener('beforeinput', handleBeforeInput, { capture: true });
      }
    }
    // render overlay after masking so we base on original content
    renderEditorMathOverlay(selectionOnly);
    try { void processOverlayImages(); void processOverlayVideos(); } catch (e) { /* ignore */ }

    // Update button state based on mode
    if (selectionOnly) {
      mathWysiwygButton?.setAttribute('aria-pressed', 'false');
      mathWysiwygButton?.classList.remove('active');
    } else {
      mathWysiwygButton?.setAttribute('aria-pressed', 'true');
      mathWysiwygButton?.classList.add('active');
    }
    const icon = mathWysiwygButton?.querySelector('.icon');
    if (icon) icon.textContent = '∑';
  };

  const disableMathOverlay = () => {
    mathOverlayEnabled = false;
    mathOverlaySelectionOnly = false;
    // Clear active selections when disabling overlay
    activeSelections = [];
    previousMasked = '';
    const editor = resolveEditorElement();
    const overlay = getOverlayForEditor(editor);
    if (overlay) {
      overlay.hidden = true;
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = '';
      try { overlay.style.pointerEvents = 'none'; } catch (e) {}
    }
    if (editor) {
      // Remove input listener
      if (editor.__mathOverlayInputListener) {
        editor.removeEventListener('input', editor.__mathOverlayInputListener);
        editor.__mathOverlayInputListener = null;
      }
      // restore editor content and styles
      unmaskEditor(editor);
      editor.style.color = editor.__prevColor || '';
      editor.style.caretColor = '';
      // Restore stored selection if any
      if (editor.__storedSelection) {
        editor.selectionStart = editor.__storedSelection.start;
        editor.selectionEnd = editor.__storedSelection.end;
        delete editor.__storedSelection;
      }
      editor.removeEventListener('scroll', syncOverlayScroll);
      if (overlay) {
        overlay.removeEventListener('wheel', overlayWheelHandler, { passive: false });
        overlay.removeEventListener('touchstart', overlayTouchStart, { passive: true });
        overlay.removeEventListener('touchmove', overlayTouchMove, { passive: false });
        overlay.removeEventListener('scroll', overlayScrollHandler);
      }
      editor.removeEventListener('beforeinput', handleBeforeInput, { capture: true });
    }
    // revoke any blob URLs created for HTML blocks
    if (window.htmlBlobUrls && window.htmlBlobUrls.size) {
      try {
        for (const u of window.htmlBlobUrls) {
          try { URL.revokeObjectURL(u); } catch (e) { /* ignore */ }
        }
      } finally {
        window.htmlBlobUrls.clear();
      }
    }
  };
  window.disableMathOverlay = disableMathOverlay;

  const toggleMathWysiwyg = (hasSelection = null) => {
    if (mathOverlayEnabled) {
      // Use provided selection state, or detect it if not provided
      const activeEditor = resolveEditorElement();
      const selectionDetected = hasSelection !== null ? hasSelection : (activeEditor && activeEditor.selectionStart !== activeEditor.selectionEnd);
      
      if (selectionDetected) {
        if (!mathOverlaySelectionOnly) {
          // Currently in full mode, switch to selection-only mode
          disableMathOverlay();
          // Expand selection intelligently: prefer enclosing math delimiters or full line
          const expandSelection = (el, s, e) => {
            try {
              const value = el.value || '';
              // If selection spans multiple lines, keep it as-is
              if (value.slice(s, e).includes('\n')) return { start: s, end: e };

              // Try to expand to enclosing $$...$$ first
              const before = value.slice(0, s);
              const after = value.slice(e);
              const idxBeforeDouble = before.lastIndexOf('$$');
              const idxAfterDouble = after.indexOf('$$');
              if (idxBeforeDouble !== -1 && idxAfterDouble !== -1) {
                const start = idxBeforeDouble;
                const end = e + idxAfterDouble + 2; // include trailing $$
                return { start, end };
              }

              // Then try single $...$
              const idxBeforeSingle = before.lastIndexOf('$');
              const idxAfterSingle = after.indexOf('$');
              if (idxBeforeSingle !== -1 && idxAfterSingle !== -1) {
                const start = idxBeforeSingle;
                const end = e + idxAfterSingle + 1; // include trailing $
                return { start, end };
              }

              // Otherwise expand to whole line
              const lineStart = before.lastIndexOf('\n') + 1;
              const nextNl = after.indexOf('\n');
              const lineEnd = nextNl === -1 ? value.length : e + nextNl;
              return { start: lineStart, end: lineEnd };
            } catch (err) { return { start: s, end: e }; }
          };

          const expanded = expandSelection(activeEditor, activeEditor.selectionStart, activeEditor.selectionEnd);
          console.log('Selection expansion:', {
            original: { start: activeEditor.selectionStart, end: activeEditor.selectionEnd },
            expanded: expanded,
            selectedText: activeEditor.value.substring(activeEditor.selectionStart, activeEditor.selectionEnd)
          });
          const currentSelection = {
            start: expanded.start,
            end: expanded.end
          };
          activeSelections = [currentSelection];
          enableMathOverlay(true);
          // Add input listener for live overlay updates
          const editor = resolveEditorElement();
          if (editor && !editor.__mathOverlayInputListener) {
            editor.__mathOverlayInputListener = () => {
              if (mathOverlayEnabled && mathOverlaySelectionOnly) {
                renderEditorMathOverlay(true);
              }
            };
            editor.addEventListener('input', editor.__mathOverlayInputListener);
          }
        } else {
          // Already in selection-only mode, toggle this selection in active selections
          const expandSelection = (el, s, e) => {
            try {
              const value = el.value || '';
              if (value.slice(s, e).includes('\n')) return { start: s, end: e };
              const before = value.slice(0, s);
              const after = value.slice(e);
              const idxBeforeDouble = before.lastIndexOf('$$');
              const idxAfterDouble = after.indexOf('$$');
              if (idxBeforeDouble !== -1 && idxAfterDouble !== -1) {
                const start = idxBeforeDouble;
                const end = e + idxAfterDouble + 2;
                return { start, end };
              }
              const idxBeforeSingle = before.lastIndexOf('$');
              const idxAfterSingle = after.indexOf('$');
              if (idxBeforeSingle !== -1 && idxAfterSingle !== -1) {
                const start = idxBeforeSingle;
                const end = e + idxAfterSingle + 1;
                return { start, end };
              }
              const lineStart = before.lastIndexOf('\n') + 1;
              const nextNl = after.indexOf('\n');
              const lineEnd = nextNl === -1 ? value.length : e + nextNl;
              return { start: lineStart, end: lineEnd };
            } catch (err) { return { start: s, end: e }; }
          };
          const expanded = expandSelection(activeEditor, activeEditor.selectionStart, activeEditor.selectionEnd);
          console.log('Selection expansion (else case):', {
            original: { start: activeEditor.selectionStart, end: activeEditor.selectionEnd },
            expanded: expanded,
            selectedText: activeEditor.value.substring(activeEditor.selectionStart, activeEditor.selectionEnd)
          });
          const currentSelection = {
            start: expanded.start,
            end: expanded.end
          };
          // Check if this selection already exists
          const existingIndex = activeSelections.findIndex(sel => 
            sel.start === currentSelection.start && sel.end === currentSelection.end
          );
          if (existingIndex !== -1) {
            // Remove the existing selection
            activeSelections.splice(existingIndex, 1);
            if (activeSelections.length === 0) {
              // No more selections, disable overlay
              disableMathOverlay();
              return;
            } else {
              // Update masking for remaining selections
              maskSelectedRanges(activeSelections);
            }
          } else {
            // Add the new selection
            activeSelections.push(currentSelection);
            // Update masking
            maskSelectedRanges(activeSelections);
          }
          // Re-render with updated selections
          renderEditorMathOverlay(true);
          // Add input listener for live overlay updates
          const editor = resolveEditorElement();
          if (editor && !editor.__mathOverlayInputListener) {
            editor.__mathOverlayInputListener = () => {
              if (mathOverlayEnabled && mathOverlaySelectionOnly) {
                renderEditorMathOverlay(true);
              }
            };
            editor.addEventListener('input', editor.__mathOverlayInputListener);
          }
        }
        closeMathPanel();
      } else {
        // No selection, disable overlay
        disableMathOverlay();
        mathWysiwygButton?.setAttribute('aria-pressed', 'false');
        mathWysiwygButton?.classList.remove('active');
        const icon = mathWysiwygButton?.querySelector('.icon');
        if (icon) icon.textContent = '∑';
        closeMathPanel();
      }
    } else {
      // Overlay not enabled, enable it
      const activeEditor = resolveEditorElement();
      const selectionDetected = hasSelection !== null ? hasSelection : (activeEditor && activeEditor.selectionStart !== activeEditor.selectionEnd);

      if (selectionDetected && activeEditor) {
        const currentSelection = {
          start: activeEditor.selectionStart,
          end: activeEditor.selectionEnd
        };
        activeSelections = [currentSelection];
      } else {
        activeSelections = [];
      }

      enableMathOverlay(selectionDetected);
      mathWysiwygButton?.setAttribute('aria-pressed', 'true');
      mathWysiwygButton?.classList.add('active');
      const icon = mathWysiwygButton?.querySelector('.icon');
      if (icon) icon.textContent = '∑';
      closeMathPanel();
    }
  };
  window.toggleMathWysiwyg = toggleMathWysiwyg;

  const syncOverlayScroll = () => {
    // If called as an event listener, 'this' or event.currentTarget may be the editor textarea
    try {
      const editor = resolveEditorElement();
      const overlay = getOverlayForEditor(editor);
      if (!overlay || !editor) return;
      overlay.scrollTop = editor.scrollTop;
      overlay.scrollLeft = editor.scrollLeft;
    } catch (e) {
      // ignore
    }
  };

  // Forward wheel events that occur on the overlay to the editor textarea so users can scroll
  // when interacting with overlay content (e.g., embedded iframes).
  let lastTouchY = 0;
  const overlayWheelHandler = (ev) => {
    try {
      const overlay = ev?.currentTarget || getOverlayForEditor();
      const editor = getEditorForOverlay(overlay);
      if (!editor || !overlay) return;
      // If the event target is an element that should handle its own scroll (like an iframe), allow default behavior.
      const target = ev.target;
      if (target && (target.tagName === 'IFRAME' || target.closest && target.closest('iframe'))) {
        return;
      }
      ev.preventDefault();
      // Scroll the overlay by the wheel delta.
      overlay.scrollTop += ev.deltaY;
      // Call overlay scroll handler to propagate proportional scroll to the editor
      overlayScrollHandler(overlay);
    } catch (e) {
      // ignore
    }
  };

  const overlayTouchStart = (ev) => {
    if (!ev.touches || ev.touches.length === 0) return;
    lastTouchY = ev.touches[0].clientY;
  };

  const overlayTouchMove = (ev) => {
    try {
      const overlay = ev?.currentTarget || getOverlayForEditor();
      const editor = getEditorForOverlay(overlay);
      if (!overlay || !ev.touches || ev.touches.length === 0) return;
      // If the touch originated inside an iframe, don't intercept
      const target = ev.target;
      if (target && (target.tagName === 'IFRAME' || target.closest && target.closest('iframe'))) return;
      const y = ev.touches[0].clientY;
      const dy = lastTouchY - y;
      if (Math.abs(dy) > 0) {
        ev.preventDefault();
        // Scroll the overlay itself and let the overlayScrollHandler map it proportionally
        overlay.scrollTop += dy;
        overlayScrollHandler(overlay);
      }
      lastTouchY = y;
    } catch (e) {
      // ignore
    }
  };

  const overlayScrollHandler = (evOrOverlay) => {
    try {
      let overlay = null;
      if (!evOrOverlay) overlay = getOverlayForEditor();
      else if (evOrOverlay.currentTarget) overlay = evOrOverlay.currentTarget;
      else overlay = evOrOverlay;
      const editor = getEditorForOverlay(overlay);
      if (!overlay || !editor) return;
      // Map overlay scroll position to editor scroll proportionally
      const overlayTop = overlay.scrollTop || 0;
      const overlayScrollable = Math.max(0, overlay.scrollHeight - overlay.clientHeight);
      const editorScrollable = Math.max(0, editor.scrollHeight - editor.clientHeight);

      if (overlayScrollable <= 0 || editorScrollable <= 0) {
        // Fallback to direct mapping when one side isn't scrollable
        if (Math.abs(overlayTop - (editor.scrollTop || 0)) > 2) {
          editor.scrollTop = overlayTop;
        }
        return;
      }

      const ratio = overlayTop / overlayScrollable;
      const targetEditorTop = Math.round(ratio * editorScrollable);
      if (Math.abs((editor.scrollTop || 0) - targetEditorTop) > 2) {
        editor.scrollTop = targetEditorTop;
      }
    } catch (e) {
      // ignore
    }
  };

  mathWysiwygButton?.addEventListener('click', (e) => {
    e.preventDefault();
    // Toggle overlay on button click
    if (mathOverlayEnabled) {
      disableMathOverlay();
      mathWysiwygButton?.setAttribute('aria-pressed', 'false');
      mathWysiwygButton?.classList.remove('active');
      const icon = mathWysiwygButton?.querySelector('.icon');
      if (icon) icon.textContent = '∑';
      // keep panel closed
      closeMathPanel();
    } else {
      enableMathOverlay();
      mathWysiwygButton?.setAttribute('aria-pressed', 'true');
      mathWysiwygButton?.classList.add('active');
      const icon = mathWysiwygButton?.querySelector('.icon');
      if (icon) icon.textContent = '∑';
      // ensure panel is closed when showing overlay
      closeMathPanel();
    }
  });

  // Update overlay while editing (debounced) - attach to left editor instance
  editorInstances.left?.addEventListener('input', () => {
    if (!mathOverlayEnabled) return;
    if (mathOverlayTimer) clearTimeout(mathOverlayTimer);
    mathOverlayTimer = setTimeout(() => {
      renderEditorMathOverlay(mathOverlaySelectionOnly);
      // Re-apply masking for selection-only mode after content changes
      if (mathOverlaySelectionOnly && activeSelections.length > 0) {
  const edt = getActiveEditorInstance();
  const ta = edt?.el ?? null;
  const currentMasked = ta?.value ?? '';
        // Find the difference between previousMasked and currentMasked
        let diffPos = -1;
        let diffType = ''; // 'insert' or 'delete'
        let diffChar = '';
        if (currentMasked.length > previousMasked.length) {
          // Insertion
          for (let i = 0; i < previousMasked.length; i++) {
            if (currentMasked[i] !== previousMasked[i]) {
              diffPos = i;
              diffChar = currentMasked[i];
              diffType = 'insert';
              break;
            }
          }
          if (diffPos === -1) {
            // Insertion at end
            diffPos = previousMasked.length;
            diffChar = currentMasked.slice(previousMasked.length);
            diffType = 'insert';
          }
        } else if (currentMasked.length < previousMasked.length) {
          // Deletion
          for (let i = 0; i < currentMasked.length; i++) {
            if (currentMasked[i] !== previousMasked[i]) {
              diffPos = i;
              diffType = 'delete';
              break;
            }
          }
          if (diffPos === -1) {
            // Deletion at end
            diffPos = currentMasked.length;
            diffType = 'delete';
          }
        }

        if (diffPos !== -1) {
          // Check if the position is in a blank area (braille blank)
          const isInBlank = previousMasked[diffPos] === '\u2800';
          if (!isInBlank) {
            // Apply the change to __originalContent
            if (diffType === 'insert') {
              if (ta) ta.__originalContent = ta.__originalContent.slice(0, diffPos) + diffChar + ta.__originalContent.slice(diffPos);
            } else if (diffType === 'delete') {
              if (ta) ta.__originalContent = ta.__originalContent.slice(0, diffPos) + ta.__originalContent.slice(diffPos + 1);
            }
            // Adjust activeSelections if insertion/deletion before selections
            for (const sel of activeSelections) {
              if (diffPos <= sel.start) {
                if (diffType === 'insert') {
                  sel.start += diffChar.length;
                  sel.end += diffChar.length;
                } else if (diffType === 'delete') {
                  sel.start = Math.max(sel.start - 1, diffPos);
                  sel.end = Math.max(sel.end - 1, diffPos);
                }
              }
            }
          }
        }

  // Preserve cursor position during masking for the active editor (edt/ta defined above)
  const savedStart = ta?.selectionStart ?? 0;
        const savedEnd = ta?.selectionEnd ?? savedStart;
        maskSelectedRanges(activeSelections, ta);
        previousMasked = ta?.value ?? '';
        // Restore cursor position, clamped to new content length
        const newLength = ta ? ta.value.length : 0;
        try { if (ta) { ta.selectionStart = Math.min(savedStart, newLength); ta.selectionEnd = Math.min(savedEnd, newLength); } } catch (e) {}
      }
      try { void processOverlayImages(); void processOverlayVideos(); } catch (e) { /* ignore */ }
    }, 220);
  });

  // Same for right editor instance
  editorInstances.right?.addEventListener('input', () => {
    if (!mathOverlayEnabled) return;
    if (mathOverlayTimer) clearTimeout(mathOverlayTimer);
    mathOverlayTimer = setTimeout(() => {
      renderEditorMathOverlay(mathOverlaySelectionOnly);
      // Re-apply masking for selection-only mode after content changes
      if (mathOverlaySelectionOnly && activeSelections.length > 0) {
  const edt = getActiveEditorInstance();
  const ta = edt?.el ?? null;
  const currentMasked = ta?.value ?? '';
        // Find the difference between previousMasked and currentMasked
        let diffPos = -1;
        let diffType = ''; // 'insert' or 'delete'
        let diffChar = '';
        if (currentMasked.length > previousMasked.length) {
          // Insertion
          for (let i = 0; i < previousMasked.length; i++) {
            if (currentMasked[i] !== previousMasked[i]) {
              diffPos = i;
              diffChar = currentMasked[i];
              diffType = 'insert';
              break;
            }
          }
          if (diffPos === -1) {
            // Insertion at end
            diffPos = previousMasked.length;
            diffChar = currentMasked.slice(previousMasked.length);
            diffType = 'insert';
          }
        } else if (currentMasked.length < previousMasked.length) {
          // Deletion
          for (let i = 0; i < currentMasked.length; i++) {
            if (currentMasked[i] !== previousMasked[i]) {
              diffPos = i;
              diffType = 'delete';
              break;
            }
          }
          if (diffPos === -1) {
            // Deletion at end
            diffPos = currentMasked.length;
            diffType = 'delete';
          }
        }

        if (diffPos !== -1) {
          // Check if the position is in a blank area (braille blank)
          const isInBlank = previousMasked[diffPos] === '\u2800';
          if (!isInBlank) {
            // Apply the change to __originalContent
            if (diffType === 'insert') {
              if (ta) ta.__originalContent = ta.__originalContent.slice(0, diffPos) + diffChar + ta.__originalContent.slice(diffPos);
            } else if (diffType === 'delete') {
              if (ta) ta.__originalContent = ta.__originalContent.slice(0, diffPos) + ta.__originalContent.slice(diffPos + 1);
            }
            // Adjust activeSelections if insertion/deletion before selections
            for (const sel of activeSelections) {
              if (diffPos <= sel.start) {
                if (diffType === 'insert') {
                  sel.start += diffChar.length;
                  sel.end += diffChar.length;
                } else if (diffType === 'delete') {
                  sel.start = Math.max(sel.start - 1, diffPos);
                  sel.end = Math.max(sel.end - 1, diffPos);
                }
              }
            }
          }
        }

  // Preserve cursor position during masking for the active editor (edt/ta defined above)
  const savedStart = ta?.selectionStart ?? 0;
        const savedEnd = ta?.selectionEnd ?? savedStart;
        maskSelectedRanges(activeSelections, ta);
        previousMasked = ta?.value ?? '';
        // Restore cursor position, clamped to new content length
        const newLength = ta ? ta.value.length : 0;
        try { if (ta) { ta.selectionStart = Math.min(savedStart, newLength); ta.selectionEnd = Math.min(savedEnd, newLength); } } catch (e) {}
      }
      try { void processOverlayImages(); void processOverlayVideos(); } catch (e) { /* ignore */ }
    }, 220);
  });

  mathPanelClose?.addEventListener('click', (e) => { e.preventDefault(); closeMathPanel(); });

  // Modal helpers
  let currentEdit = null; // {el, idx, source}
  const openMathEdit = (block) => {
    currentEdit = block;
    if (!mathEditModal) return;
    mathEditTextarea.value = block.source ?? '';
    updateMathEditPreview();
    mathEditModal.hidden = false;
    mathEditModal.setAttribute('aria-hidden', 'false');
  };

  const closeMathEdit = () => {
    currentEdit = null;
    if (!mathEditModal) return;
    mathEditModal.hidden = true;
    mathEditModal.setAttribute('aria-hidden', 'true');
  };

  const updateMathEditPreview = () => {
    if (!mathEditPreview) return;
    const content = mathEditTextarea.value || '';
    try {
      const html = window.katex ? window.katex.renderToString(content, { throwOnError: false, displayMode: true }) : content;
      mathEditPreview.innerHTML = html;
    } catch (err) {
      mathEditPreview.textContent = content;
    }
  };

  mathEditTextarea?.addEventListener('input', updateMathEditPreview);
  mathEditClose?.addEventListener('click', (e) => { e.preventDefault(); closeMathEdit(); });
  mathEditCancel?.addEventListener('click', (e) => { e.preventDefault(); closeMathEdit(); });

  mathEditSave?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentEdit) return closeMathEdit();
    const newSource = mathEditTextarea.value || '';

    // Replace in the editor textarea source: find the $$...$$ occurrence by matching original source
  const editorInstance = getActiveEditorInstance();
  const editor = editorInstance?.el ?? null;
  if (editor) {
      const original = currentEdit.source;
      // Build regex to find $$<original>$$; escape special regex chars in original
      const esc = original.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const re = new RegExp('\\$\\$\\s*' + esc + '\\s*\\$\\$', 'm');
        if (re.test(editor.value)) {
          editor.value = editor.value.replace(re, `$$\n${newSource}\n$$`);
        } else {
          // Fallback: try to replace the first math block occurrence
          editor.value = editor.value.replace(/\$\$([\s\S]*?)\$\$/m, `$$\n${newSource}\n$$`);
        }
      // Trigger re-render of preview
      renderActiveNote();
    }

    closeMathEdit();
    // refresh list after update
    setTimeout(renderMathList, 120);
  });

  // Table of Contents modal event listeners
  elements.tocClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closeTocModal();
  });

  elements.tocInsert?.addEventListener('click', (e) => {
    e.preventDefault();
    insertTocAtCursor();
  });

  elements.tocCopy?.addEventListener('click', (e) => {
    e.preventDefault();
    copyTocToClipboard();
  });

  // Statistics modal event listeners
  elements.statsClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closeStatsModal();
  });

  // Templates modal event listeners
  elements.templatesClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closeTemplatesModal();
  });

  // Close modal on outside click
  mathEditModal?.addEventListener('click', (ev) => {
    if (ev.target === mathEditModal) closeMathEdit();
  });

  // Re-scan math blocks whenever preview DOM changes using MutationObserver
  if (elements.preview) {
    const observer = new MutationObserver(() => {
      try { renderMathList(); } catch (e) { /* ignore */ }
    });
    observer.observe(elements.preview, { childList: true, subtree: true, characterData: true });
  }
  elements.fileName?.addEventListener('dblclick', handleFileNameDoubleClick);
  elements.fileName?.addEventListener('keydown', handleFileNameKeyDown);
  // Clicking the file path copies it to clipboard
  try {
    elements.filePath?.addEventListener('click', (ev) => {
      try {
        const pathToCopy = (elements.filePath && elements.filePath.title) ? elements.filePath.title : (elements.filePath && elements.filePath.textContent) || '';
        if (!pathToCopy) return;
        // Prefer navigator.clipboard when available
        const write = typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
        if (write) {
          navigator.clipboard.writeText(pathToCopy).then(() => {
            try { if (elements.statusText) { elements.statusText.textContent = 'Copied path to clipboard'; setTimeout(() => { if (elements.statusText) elements.statusText.textContent = ''; }, 1200); } } catch (e) {}
          }).catch(() => {
            // fallback to IPC if provided
            try { if (window.api && typeof window.api.invoke === 'function') window.api.invoke('clipboard:write', pathToCopy); } catch (e) {}
          });
        } else {
          try { if (window.api && typeof window.api.invoke === 'function') window.api.invoke('clipboard:write', pathToCopy); if (elements.statusText) { elements.statusText.textContent = 'Copied path to clipboard'; setTimeout(() => { if (elements.statusText) elements.statusText.textContent = ''; }, 1200); } } catch (e) {}
        }
      } catch (e) { }
    });
  } catch (e) { }
  elements.renameFileForm?.addEventListener('submit', handleRenameFileFormSubmit);
  elements.renameFileInput?.addEventListener('keydown', handleRenameInputKeydown);
  elements.renameFileInput?.addEventListener('blur', handleRenameInputBlur);
  elements.insertCodeBlockButton?.addEventListener('click', handleInsertCodeBlockButton);
  elements.exportPreviewButton?.addEventListener('click', handleExportPreviewClick);
  elements.exportPreviewHtmlButton?.addEventListener('click', handleExportPreviewHtmlClick);

  // Toggle a data attribute to show the scroll hint on settings nav if it overflows
  const updateSettingsNavOverflowHint = () => {
    try {
      const nav = document.querySelector('.settings-nav');
      if (!nav) return;
      const isOverflowing = nav.scrollWidth > nav.clientWidth + 2;
      nav.setAttribute('data-overflow', isOverflowing ? 'true' : 'false');
    } catch (e) { /* ignore */ }
  };
  // update on load and on resize
  try { updateSettingsNavOverflowHint(); window.addEventListener('resize', updateSettingsNavOverflowHint); } catch (e) {}
  
  // Export dropdown functionality
  elements.exportDropdownButton?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleExportDropdown();
  });
  
  elements.exportPdfOption?.addEventListener('click', (event) => {
    event.preventDefault();
    closeExportDropdown();
    handleExportPreviewClick(event);
  });
  
  elements.exportHtmlOption?.addEventListener('click', (event) => {
    event.preventDefault();
    closeExportDropdown();
    handleExportPreviewHtmlClick(event);
  });
  
  elements.exportPngOption?.addEventListener('click', (event) => {
    event.preventDefault();
    closeExportDropdown();
    handleExportImageClick('png', event);
  });
  
  elements.exportJpgOption?.addEventListener('click', (event) => {
    event.preventDefault();
    closeExportDropdown();
    handleExportImageClick('jpg', event);
  });
  
  elements.exportJpegOption?.addEventListener('click', (event) => {
    event.preventDefault();
    closeExportDropdown();
    handleExportImageClick('jpeg', event);
  });
  
  elements.exportTiffOption?.addEventListener('click', (event) => {
    event.preventDefault();
    closeExportDropdown();
    handleExportImageClick('tiff', event);
  });
  
  // Add mouse event listeners to clear focus on hover
  elements.exportPdfOption?.addEventListener('mouseenter', (event) => {
    // Remove focus from other options
    elements.exportHtmlOption?.blur();
    elements.exportPngOption?.blur();
    elements.exportJpgOption?.blur();
    elements.exportJpegOption?.blur();
    elements.exportTiffOption?.blur();
  });
  
  elements.exportHtmlOption?.addEventListener('mouseenter', (event) => {
    // Remove focus from other options
    elements.exportPdfOption?.blur();
    elements.exportPngOption?.blur();
    elements.exportJpgOption?.blur();
    elements.exportJpegOption?.blur();
    elements.exportTiffOption?.blur();
  });
  
  elements.exportPngOption?.addEventListener('mouseenter', (event) => {
    // Remove focus from other options
    elements.exportPdfOption?.blur();
    elements.exportHtmlOption?.blur();
    elements.exportJpgOption?.blur();
    elements.exportJpegOption?.blur();
    elements.exportTiffOption?.blur();
  });
  
  elements.exportJpgOption?.addEventListener('mouseenter', (event) => {
    // Remove focus from other options
    elements.exportPdfOption?.blur();
    elements.exportHtmlOption?.blur();
    elements.exportPngOption?.blur();
    elements.exportJpegOption?.blur();
    elements.exportTiffOption?.blur();
  });
  
  elements.exportJpegOption?.addEventListener('mouseenter', (event) => {
    // Remove focus from other options
    elements.exportPdfOption?.blur();
    elements.exportHtmlOption?.blur();
    elements.exportPngOption?.blur();
    elements.exportJpgOption?.blur();
    elements.exportTiffOption?.blur();
  });
  
  elements.exportTiffOption?.addEventListener('mouseenter', (event) => {
    // Remove focus from other options
    elements.exportPdfOption?.blur();
    elements.exportHtmlOption?.blur();
    elements.exportPngOption?.blur();
    elements.exportJpgOption?.blur();
    elements.exportJpegOption?.blur();
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!elements.exportDropdownButton?.contains(event.target) && 
        !elements.exportDropdownMenu?.contains(event.target)) {
      closeExportDropdown();
    }
  });
  
  // Close dropdown on escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeExportDropdown();
    }
  });
  elements.codePopoverForm?.addEventListener('submit', handleCodePopoverSubmit);
  
  // Settings modal event listeners
  elements.settingsButton?.addEventListener('click', openSettingsModal);
  elements.settingsClose?.addEventListener('click', closeSettingsModal);
  console.log('checkUpdatesButton element:', elements.checkUpdatesButton);
  if (elements.checkUpdatesButton) {
    console.log('Adding click listener to checkUpdatesButton');
    elements.checkUpdatesButton.addEventListener('click', checkForUpdatesManually);
  } else {
    console.warn('checkUpdatesButton not found, cannot add click listener');
  }
  elements.themeSelect?.addEventListener('change', handleThemeChange);
  elements.bgColorPicker?.addEventListener('change', handleBgColorChange);
  elements.resetBgColorButton?.addEventListener('click', resetBgColor);
              
  elements.fontSizeSlider?.addEventListener('input', handleFontSizeChange);
  elements.resetFontSizeButton?.addEventListener('click', resetFontSize);
  elements.resetFontFamilyButton?.addEventListener('click', resetFontFamily);
  elements.textColorPicker?.addEventListener('change', handleTextColorChange);
  elements.resetTextColorButton?.addEventListener('click', resetTextColor);
  elements.resetBorderColorButton?.addEventListener('click', resetBorderColor);
  elements.borderThicknessSlider?.addEventListener('input', handleBorderThicknessChange);
  elements.resetBorderThicknessButton?.addEventListener('click', resetBorderThickness);
  
  // Unified component settings event listeners
  elements.componentSelector?.addEventListener('change', handleComponentSelectionChange);
  elements.componentUseGlobalBg?.addEventListener('change', handleComponentGlobalToggle);
  elements.componentBgColorPicker?.addEventListener('change', handleComponentBgColorChange);
  elements.resetComponentBgColorButton?.addEventListener('click', resetComponentBgColor);
  elements.componentUseGlobalFont?.addEventListener('change', handleComponentGlobalToggle);
  elements.componentFontFamilySelect?.addEventListener('change', handleComponentFontFamilyChange);
  elements.resetComponentFontFamilyButton?.addEventListener('click', resetComponentFontFamily);
  elements.componentUseGlobalSize?.addEventListener('change', handleComponentGlobalToggle);
  elements.componentFontSizeSlider?.addEventListener('input', handleComponentFontSizeChange);
  elements.resetComponentFontSizeButton?.addEventListener('click', resetComponentFontSize);
  elements.componentUseGlobalColor?.addEventListener('change', handleComponentGlobalToggle);
  elements.componentTextColorPicker?.addEventListener('change', handleComponentTextColorChange);
  elements.resetComponentTextColorButton?.addEventListener('click', resetComponentTextColor);
  elements.componentUseGlobalStyle?.addEventListener('change', handleComponentGlobalToggle);
  elements.componentFontStyleSelect?.addEventListener('change', handleComponentFontStyleChange);
  elements.componentShowPath?.addEventListener('change', handleComponentShowPathChange);
  
  // New advanced settings event listeners
  elements.previewScrollSyncToggle?.addEventListener('change', handlePreviewScrollSyncChange);
  elements.editorCursorStyleSelect?.addEventListener('change', handleEditorCursorStyleChange);
  elements.searchCaseSensitiveToggle?.addEventListener('change', handleSearchCaseSensitiveChange);
  elements.autocompleteDelaySlider?.addEventListener('input', handleAutocompleteDelayChange);
  elements.resetAutocompleteDelayButton?.addEventListener('click', resetAutocompleteDelay);
  elements.fileTreeSortSelect?.addEventListener('change', handleFileTreeSortChange);
  elements.mathRenderingQualitySelect?.addEventListener('change', handleMathRenderingQualityChange);

  elements.settingsModal?.addEventListener('click', (event) => {
    if (event.target === elements.settingsModal) {
      closeSettingsModal();
    }
  });
  elements.codePopoverCancel?.addEventListener('click', () => closeCodePopover());
  elements.codePopoverSuggestions?.addEventListener('click', handleCodePopoverSuggestionClick);
  elements.wikiSuggestions?.addEventListener('pointerdown', handleWikiSuggestionPointerDown);
  elements.wikiSuggestions?.addEventListener('pointermove', handleWikiSuggestionPointerOver);
  elements.hashtagSuggestions?.addEventListener('pointerdown', handleHashtagSuggestionPointerDown);
  elements.hashtagSuggestions?.addEventListener('pointermove', handleHashtagSuggestionPointerOver);

  elements.editorSearchInput?.addEventListener('input', handleEditorSearchInput);
  elements.editorSearchInput?.addEventListener('keydown', handleEditorSearchKeydown);
  elements.editorSearchPrevButton?.addEventListener('click', handleEditorSearchPrev);
  elements.editorSearchNextButton?.addEventListener('click', handleEditorSearchNext);
  elements.editorSearchCloseButton?.addEventListener('click', handleEditorSearchClose);

  if (elements.openFolderButtons && typeof elements.openFolderButtons.forEach === 'function') {
    elements.openFolderButtons.forEach((button) => {
      button.addEventListener('click', handleOpenFolder);
    });
  }

  elements.hashtagList?.addEventListener('click', handleHashtagListClick);
  elements.hashtagDetail?.addEventListener('click', handleHashtagDetailClick);
  elements.clearHashtagFilter?.addEventListener('click', handleClearHashtagFilter);

  elements.preview?.addEventListener('click', handlePreviewClick);
  elements.preview?.addEventListener('dblclick', handlePreviewDoubleClick);
  elements.preview?.addEventListener('keydown', handlePreviewKeyDown);
  window.addEventListener('pointerdown', handleCodePopoverOutsidePointerDown);
  window.addEventListener('keydown', handleCodePopoverKeydown, true);

  window.addEventListener('keydown', handleGlobalShortcuts);

  // Inline chat event listeners
  elements.inlineChatSend?.addEventListener('click', handleChatSend);
  elements.inlineChatClose?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeInlineChat();
  });
  elements.inlineChatInput?.addEventListener('keydown', handleChatInputKeydown);
  elements.inlineChatInput?.addEventListener('input', autoResizeChatInput);
  
  // Prevent chat widget clicks from bubbling to overlay
  elements.inlineChat?.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  if (elements.workspaceSplitter) {
    elements.workspaceSplitter.addEventListener('pointerdown', handleSplitterPointerDown);
    elements.workspaceSplitter.addEventListener('pointermove', handleSplitterPointerMove);
    elements.workspaceSplitter.addEventListener('pointerup', handleSplitterPointerUp);
    elements.workspaceSplitter.addEventListener('pointercancel', handleSplitterPointerUp);
    elements.workspaceSplitter.addEventListener('keydown', handleSplitterKeyDown);
    elements.workspaceSplitter.addEventListener('dblclick', () => setEditorRatio(0.5, true));
  }

  if (elements.sidebarResizeHandle) {
    elements.sidebarResizeHandle.addEventListener('pointerdown', handleSidebarResizePointerDown);
    elements.sidebarResizeHandle.addEventListener('pointermove', handleSidebarResizePointerMove);
    elements.sidebarResizeHandle.addEventListener('pointerup', handleSidebarResizePointerUp);
    elements.sidebarResizeHandle.addEventListener('pointercancel', handleSidebarResizePointerUp);
    elements.sidebarResizeHandle.addEventListener('dblclick', () => setSidebarWidth(260));
  }

  if (elements.hashtagResizeHandle) {
    elements.hashtagResizeHandle.addEventListener('pointerdown', handleHashtagPanelResizeStart);
    elements.hashtagResizeHandle.addEventListener('pointermove', handleHashtagPanelResizeMove);
    elements.hashtagResizeHandle.addEventListener('pointerup', handleHashtagPanelResizeEnd);
    elements.hashtagResizeHandle.addEventListener('pointercancel', handleHashtagPanelResizeEnd);
    elements.hashtagResizeHandle.addEventListener('dblclick', () => setHashtagPanelHeight(200));
  }

  // Toggle minimize/restore for hashtag panel
  if (elements.toggleHashtagMinimize) {
    elements.toggleHashtagMinimize.addEventListener('click', (evt) => {
      evt.preventDefault();
      const container = document.querySelector('.hashtag-container');
      if (!container) return;
      const minimized = container.classList.contains('hashtag-minimized');
      if (minimized) {
        restoreHashtagPanel();
      } else {
        minimizeHashtagPanel();
      }
    });
  }

  // Tab event listeners
  const newTabBtn = document.getElementById('new-tab-button');
  if (newTabBtn) {
    newTabBtn.addEventListener('click', () => {
      // If workspace folder is open, create a physical file. Otherwise create an in-memory untitled note.
      if (state.currentFolder) {
        void createFileInWorkspace('');
        return;
      }

      // Create in-memory untitled note and open it in a new tab
      const note = createUntitledNote();
      const tab = createTab(note.id, note.title || 'Untitled');
      setActiveTab(tab.id);
      renderTabs();
      renderActiveNote();
    });
  }

  window.addEventListener('pointermove', handleSplitterPointerMove);
  window.addEventListener('pointermove', handleSidebarResizePointerMove);
  window.addEventListener('pointermove', handleHashtagPanelResizeMove);
  window.addEventListener('pointerup', handleSplitterPointerUp);
  window.addEventListener('pointerup', handleSidebarResizePointerUp);
  window.addEventListener('pointerup', handleHashtagPanelResizeEnd);
  window.addEventListener('beforeunload', clearPdfCache);
  window.addEventListener('resize', handleEditorSearchResize);

  // Set up workspace file system watcher
  if (window.api?.onWorkspaceChanged) {
    window.api.onWorkspaceChanged((data) => {
      // Don't update workspace if user is actively typing or has file suggestions open
      if (state.userTyping || (elements.fileSuggestions && !elements.fileSuggestions.hidden)) {
        // Schedule update for later when user is done typing and suggestions are closed
        setTimeout(() => {
          if (!state.userTyping && elements.fileSuggestions.hidden) {
            adoptWorkspace(data);
            setStatus('Workspace updated - files changed externally.', true);
          }
        }, 2000);
        return;
      }
      
      // Update the workspace when files change externally
      adoptWorkspace(data);
      setStatus('Workspace updated - files changed externally.', true);
    });
  }

  // Initialize sidebar width
  setSidebarWidth(state.sidebarWidth);

  restoreLastWorkspace();
  applySidebarCollapsed(state.sidebarCollapsed);
  applyPreviewState(state.previewCollapsed);
  updateEditorSearchCount();
  renderEditorSearchHighlights();
  syncEditorSearchHighlightScroll();
};

// Auto-resize iframe functionality
window.autoResizeIframe = (iframe) => {
  if (!iframe) return;

  // Reduce noise unless debugging explicitly enabled
  if (window.__nta_debug_iframe) {
  }

  // If iframe appears to point to a file:// URL or to an unavailable local path,
  // avoid trying to access contentDocument (which will throw) and set a safe default.
  try {
    const src = String(iframe.src || iframe.getAttribute('src') || iframe.dataset?.rawSrc || '');
    const normalized = src.replace(/\\/g, '/');
    if (normalized.startsWith('file://') || normalized.includes('/src/renderer/')) {
      // Use a reasonable fallback height and don't attempt same-origin access
      iframe.style.height = iframe.style.height || '800px';
      return;
    }
  } catch (e) {
    // ignore and continue to safe attempt
  }

  const attemptResize = () => {
    try {
      const iframeDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
      if (iframeDoc && iframeDoc.body) {
        // Wait a bit for content to render
        setTimeout(() => {
          try {
            const contentHeight = Math.max(
              iframeDoc.body.scrollHeight,
              iframeDoc.body.offsetHeight,
              iframeDoc.documentElement.clientHeight,
              iframeDoc.documentElement.scrollHeight,
              iframeDoc.documentElement.offsetHeight
            );
            const finalHeight = Math.min(Math.max(contentHeight + 40, 400), 1200);
            iframe.style.height = finalHeight + 'px';
          } catch (err) {
            if (window.__nta_debug_iframe) { }
          }
        }, 200);
        return true;
      }
    } catch (err) {
      // Cross-origin or other access problem — rely on postMessage or default size
      if (window.__nta_debug_iframe) { }
      iframe.style.height = iframe.style.height || '800px';
      return false;
    }
    return false;
  };

  // Try immediate resize and then delayed attempts for dynamic content
  if (!attemptResize()) {
    setTimeout(attemptResize, 500);
    setTimeout(attemptResize, 1000);
    setTimeout(attemptResize, 2000);
  }
};

// Listen for resize messages from iframes
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'iframe-resize') {
    
    // Find the iframe that sent the message
    const iframes = document.querySelectorAll('iframe.html-embed-iframe, iframe[data-raw-src]');
    let targetIframe = null;
    
    for (const iframe of iframes) {
      try {
        if (iframe.contentWindow === event.source) {
          targetIframe = iframe;
          break;
        }
      } catch (e) {
        // Skip if can't access contentWindow
      }
    }
    
    if (targetIframe && event.data.height) {
      const finalHeight = Math.min(Math.max(event.data.height + 20, 200), 1000);
      targetIframe.style.height = finalHeight + 'px';
    }
  }
});

// Diagnostic helpers you can call from renderer DevTools:
window.dumpVideoDiagnostics = () => {
  try {
    const videos = Array.from(document.querySelectorAll('video[data-raw-src], video'));
    const out = videos.map((v) => {
      const raw = v.getAttribute('data-raw-src') || null;
      return {
        node: v,
        dataRawSrc: raw,
        src: v.getAttribute('src') || v.src || null,
        currentSrc: v.currentSrc || null,
        readyState: v.readyState,
        networkState: v.networkState,
        paused: v.paused,
        hasMetadata: !!(v.readyState >= 1),
      };
    });
    return out;
  } catch (e) {
    return null;
  }
};

// Delegated fallback: ensure settings button opens modal even if initial wiring failed
document.addEventListener('click', (ev) => {
  try {
    const btn = ev.target && ev.target.closest && ev.target.closest('#settings-button');
    if (btn) {
      openSettingsModal();
    }
  } catch (e) {
    // ignore
  }
});

window.dumpResourceCaches = () => {
  try {
    const htmlCache = Array.from(htmlResourceCache.entries());
    const imageCache = Array.from(imageResourceCache.entries());
    const videoCache = Array.from(videoResourceCache.entries());
    return { htmlCache, imageCache, videoCache };
  } catch (e) {
    return null;
  }
};

// Update notification functionality
const updateNotification = document.getElementById('update-notification');
const updateMessage = document.querySelector('.update-notification__message');
const updateProgress = document.querySelector('.update-notification__progress');
const updateSubMessage = document.querySelector('.update-notification__submessage');
const inlineCheckSubmessage = document.getElementById('check-updates-submessage');
const updateProgressFill = document.querySelector('.update-notification__progress-fill');
const updateProgressText = document.querySelector('.update-notification__progress-text');
// The update download button now lives in the Settings pane next to Check Now
const updateDownloadButton = document.getElementById('update-download-button');
const updateInstallButton = document.getElementById('update-install-button');
const updateDismissButton = document.getElementById('update-dismiss-button');
let fallbackAvailable = false;
let fallbackWatchdog = null;
let releaseUrlForUI = null;

// Positioning helper: try to show the update notification directly below the
// 'Check for Updates' button if it's present and visible. Falls back to the
// default centered behavior when the button isn't available.
function positionUpdateNotificationBelowCheckBtn() {
  try {
    const btn = elements && elements.checkUpdatesButton ? elements.checkUpdatesButton : document.getElementById('check-updates-btn');
    if (!btn) {
      // revert any inline positioning so CSS rules apply
      updateNotification.style.position = '';
      updateNotification.style.top = '';
      updateNotification.style.left = '';
      updateNotification.style.transform = '';
      updateNotification.style.width = '';
      updateNotification.style.maxWidth = '';
      return;
    }

    const rect = btn.getBoundingClientRect();
    if (!rect) return;

    // Ensure the notification is fixed relative to the viewport so it follows
    // the settings panel / button even if the page scrolls.
    updateNotification.style.position = 'fixed';
    const padding = 8; // space between button and notification
    const top = Math.round(rect.bottom + padding);

    // Center notification above/below the button horizontally
    const centerX = Math.round(rect.left + rect.width / 2);
    updateNotification.style.top = `${top}px`;
    updateNotification.style.left = `${centerX}px`;
    updateNotification.style.transform = 'translateX(-50%)';
    // Keep a sensible max width
    updateNotification.style.maxWidth = '660px';
    // Let the notification shrink to content width but not be narrower than the button
    updateNotification.style.width = `${Math.max(240, rect.width)}px`;
    // Ensure it's above most UI but below title-bar traffic lights
    updateNotification.style.zIndex = '900';
  } catch (e) {
    // ignore positioning errors and fall back to CSS defaults
  }
}
const startFallbackWatchdog = (timeoutMs = 30000) => {
  try {
    clearFallbackWatchdog();
    fallbackWatchdog = setTimeout(() => {
      try {
  updateMessage.textContent = 'The installer appears to be stuck. You can open the release page to retry installation.';
  updateDownloadButton.hidden = false;
  updateDownloadButton.disabled = false;
  updateDownloadButton.textContent = fallbackAvailable ? 'Open Release Page (Fallback)' : 'Open Release Page';
      } catch (e) {}
    }, timeoutMs);
  } catch (e) {}
};
const clearFallbackWatchdog = () => { try { if (fallbackWatchdog) { clearTimeout(fallbackWatchdog); fallbackWatchdog = null; } } catch (e) {} };

// Listen for update events from main process
window.api.on('update-available', (info) => {
  updateMessage.textContent = `Version ${info.version} is available. You can open the release page to download it manually.`;
  if (updateSubMessage) updateSubMessage.textContent = 'New update available';
  // Store release URL for the UI to open externally
  releaseUrlForUI = info && info.releaseUrl ? info.releaseUrl : null;
  updateDownloadButton.hidden = false;
  updateDownloadButton.disabled = false;
  updateDownloadButton.textContent = 'Open Release Page';
  updateNotification.hidden = false;
  positionUpdateNotificationBelowCheckBtn();
});

window.api.on('update-progress', (progressObj) => {
  updateProgress.hidden = false;
  updateDownloadButton.hidden = true;
  updateProgressFill.style.width = `${progressObj.percent}%`;
  updateProgressText.textContent = `Downloading... ${Math.round(progressObj.percent)}%`;
});

window.api.on('update-downloaded', (info) => {
  updateProgress.hidden = true;
  updateDownloadButton.hidden = true;
  updateInstallButton.hidden = false;
  updateMessage.textContent = `Version ${info.version} has been downloaded. Would you like to install it now?`;
});

window.api.on('update-not-available', (info) => {
  console.info('update-not-available', info);
  // Optionally notify the user in the UI
  try {
    updateMessage.textContent = 'No updates available.';
    if (updateSubMessage) updateSubMessage.textContent = 'You are running the newest version';
  updateNotification.hidden = false;
  positionUpdateNotificationBelowCheckBtn();
    setTimeout(() => { updateNotification.hidden = true; }, 3000);
  } catch (e) { }
});

window.api.on('update-error', (err) => {
  console.error('update-error', err);
  // Surface in UI so user gets a clear indication
  try {
    updateMessage.textContent = `Update check failed: ${String(err)}`;
  updateNotification.hidden = false;
  positionUpdateNotificationBelowCheckBtn();
    // Also ensure the check button resets if present
    if (elements.checkUpdatesButton) {
      elements.checkUpdatesButton.disabled = false;
      elements.checkUpdatesButton.textContent = 'Check Failed';
    }
  } catch (e) { }
});

window.api.on('fallback-started', () => {
  console.log('fallback update started');
  try {
    // If a fallback update run starts, clear any watchdog that might think the installer is stuck
    try { clearFallbackWatchdog(); } catch (e) {}
    updateMessage.textContent = 'Update check failed, trying alternative update method...';
    updateNotification.hidden = false;
    if (elements.checkUpdatesButton) {
      elements.checkUpdatesButton.disabled = true;
      elements.checkUpdatesButton.textContent = 'Updating...';
    }
  } catch (e) { }
});

window.api.on('fallback-available', () => {
  try {
    fallbackAvailable = true;
  updateMessage.textContent = 'An alternative update method is available due to an error. Click "Open Release Page" to try it.';
    updateDownloadButton.hidden = false;
    updateDownloadButton.disabled = false;
  updateDownloadButton.textContent = 'Open Release Page (Fallback)';
    updateNotification.hidden = false;
  } catch (e) { }
});

// Receive detailed fallback progress updates
window.api.on('fallback-progress', (payload) => {
  try {
    // Ensure the update notification is visible
    updateNotification.hidden = false;

    if (!payload) return;
    const stage = payload.stage || 'working';

    if (stage === 'downloading') {
      // Any active watchdog should be cleared while downloading
      clearFallbackWatchdog();
      updateProgress.hidden = false;
      updateDownloadButton.hidden = true;
      const percent = payload.percent != null ? payload.percent : 0;
      updateProgressFill.style.width = (percent ? `${percent}%` : '10%');
      updateProgressText.textContent = payload.total ? `Downloading... ${percent || 0}%` : `Downloading... ${Math.round((payload.transferred||0)/1024)} KB`;
      updateMessage.textContent = payload.message || 'Downloading update...';
    } else if (stage === 'downloaded') {
      clearFallbackWatchdog();
      updateProgressText.textContent = 'Download complete.';
      updateProgressFill.style.width = '100%';
      updateMessage.textContent = payload.message || 'Download complete.';
    } else if (stage === 'extracting') {
      // Keep watchdog cleared while extraction is active
      clearFallbackWatchdog();
      updateProgress.hidden = false;
      updateDownloadButton.hidden = true;
      updateProgressText.textContent = payload.message || 'Extracting update...';
      // keep a small animated width to show activity when no percent is provided
      const current = parseInt(updateProgressFill.style.width) || 0;
      updateProgressFill.style.width = Math.min(95, current + 5) + '%';
      updateMessage.textContent = payload.message || 'Extracting update...';
    } else if (stage === 'extracted' || stage === 'ready') {
      updateProgressFill.style.width = '100%';
      updateProgressText.textContent = payload.message || 'Ready to install';
      updateMessage.textContent = payload.message || 'Ready to install';
      updateInstallButton.hidden = false;
      // Start a watchdog: if we don't get a final result soon, offer retry
      startFallbackWatchdog(30000);
    } else if (stage === 'error') {
      clearFallbackWatchdog();
      updateMessage.textContent = payload.message || 'Update failed';
  updateNotification.hidden = false;
  positionUpdateNotificationBelowCheckBtn();
      updateDownloadButton.hidden = false;
      updateDownloadButton.disabled = false;
  updateDownloadButton.textContent = fallbackAvailable ? 'Open Release Page (Fallback)' : 'Open Release Page';
    }
  } catch (e) { }
});

window.api.on('fallback-result', (result) => {
  console.log('fallback update result:', result);
  // Clear any pending watchdog when we receive a result
  try { clearFallbackWatchdog(); } catch (e) {}
  try {
    if (result && result.ok) {
      // Check if this is development mode (update downloaded but not installed)
      if (result.message && result.message.includes('Development mode')) {
        updateMessage.textContent = 'Update downloaded successfully. (Development mode - app not replaced)';
        updateNotification.hidden = false;
        if (elements.checkUpdatesButton) {
          elements.checkUpdatesButton.disabled = false;
          elements.checkUpdatesButton.textContent = 'Check for Updates';
        }
      } else {
        // Show the install button for manual restart
        updateProgress.hidden = true;
        updateDownloadButton.hidden = true;
        updateInstallButton.hidden = false;
        updateMessage.textContent = 'Update downloaded successfully. Click Install & Restart to complete the update.';
        updateNotification.hidden = false;
        console.log('fallback-result: success - showing install button for manual restart');
      }
    } else {
      const errorMsg = result && result.error ? result.error : 'Unknown error';
      updateMessage.textContent = `Alternative update failed: ${errorMsg}`;
  updateNotification.hidden = false;
  positionUpdateNotificationBelowCheckBtn();
      if (elements.checkUpdatesButton) {
        elements.checkUpdatesButton.disabled = false;
        elements.checkUpdatesButton.textContent = 'Try Again';
      }
    }
  } catch (e) { }
});

// Handle update actions
updateDownloadButton.addEventListener('click', async () => {
  console.log('updateDownloadButton clicked; releaseUrlForUI=', releaseUrlForUI);
  updateDownloadButton.disabled = true;
  updateDownloadButton.textContent = 'Opening release page...';
  try {
    // Clear watchdog so we don't show the 'installer appears stuck' while actively downloading
    try { clearFallbackWatchdog(); } catch (e) {}
  const defaultReleaseUrl = 'https://github.com/Maurone7/NTA/releases/latest';
    const targetUrl = releaseUrlForUI || defaultReleaseUrl;

    if (fallbackAvailable) {
      // Downloads disabled: open release page or instruct manual install
      try {
        if (targetUrl && window.api && typeof window.api.invoke === 'function') {
          // Try main-process openExternal first
          try {
            const res = await window.api.invoke('app:openExternal', targetUrl);
            if (res && res.success) {
              updateMessage.textContent = 'Opened release page in your browser.';
            } else {
              // Fallback: try window.open then anchor click, then copy to clipboard
              let opened = false;
              try { window.open(targetUrl, '_blank', 'noopener'); opened = true; } catch (e) {}
              if (!opened) {
                try {
                  const a = document.createElement('a');
                  a.href = targetUrl;
                  a.target = '_blank';
                  a.rel = 'noopener';
                  a.style.display = 'none';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  opened = true;
                } catch (e) {}
              }
              if (opened) {
                updateMessage.textContent = 'Opened release page in your browser.';
              } else {
                // Last resort: copy URL to clipboard and instruct user
                try {
                  if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                    await navigator.clipboard.writeText(targetUrl);
                    updateMessage.textContent = 'Could not open browser automatically — release URL copied to clipboard.';
                  } else {
                    updateMessage.textContent = `Please open: ${targetUrl}`;
                  }
                } catch (e) {
                  updateMessage.textContent = `Please open: ${targetUrl}`;
                }
              }
            }
          } catch (e) {
            // If invoke itself threw, attempt same fallbacks
            let opened = false;
            try { window.open(targetUrl, '_blank', 'noopener'); opened = true; } catch (e) {}
            if (!opened) {
              try {
                const a = document.createElement('a');
                a.href = targetUrl;
                a.target = '_blank';
                a.rel = 'noopener';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                a.remove();
                opened = true;
              } catch (e) {}
            }
            if (opened) {
              updateMessage.textContent = 'Opened release page in your browser.';
            } else {
              try {
                if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                  await navigator.clipboard.writeText(targetUrl);
                  updateMessage.textContent = 'Could not open browser automatically — release URL copied to clipboard.';
                } else {
                  updateMessage.textContent = `Please open: ${targetUrl}`;
                }
              } catch (err2) {
                updateMessage.textContent = `Please open: ${targetUrl}`;
              }
            }
          }
        } else {
          updateMessage.textContent = 'Alternative update available - please install manually from releases.';
        }
      } catch (e) {
        console.error('Failed to open release page', e);
        updateMessage.textContent = 'Failed to open release page.';
      }
    } else {
      // Downloads are disabled; open the release page externally if available
      try {
        if (targetUrl && window.api && typeof window.api.invoke === 'function') {
          const res = await window.api.invoke('app:openExternal', targetUrl);
          if (res && res.success) updateMessage.textContent = 'Opened release page in your browser.';
          else updateMessage.textContent = 'Could not open browser automatically — please open the release page manually.';
        } else {
          updateMessage.textContent = 'Updates must be downloaded manually from the project releases.';
        }
      } catch (e) {
        console.error('Failed to open release page', e);
        updateMessage.textContent = 'Failed to open release page.';
      }
    }
  } catch (error) {
    updateDownloadButton.disabled = false;
    updateDownloadButton.textContent = 'Open Release Page';
    updateMessage.textContent = `Opening failed: ${error.message}`;
  }
});

updateInstallButton.addEventListener('click', async () => {
  console.log('Install & Restart button clicked - handler triggered');
  try {
    // Immediately clear any watchdog - we're actively installing now
    try { clearFallbackWatchdog(); } catch (e) {}
    updateInstallButton.disabled = true;
    updateMessage.textContent = 'Installing update... Please wait.';

    if (window.api && typeof window.api.quitAndInstall === 'function') {
      console.log('Calling window.api.quitAndInstall()');
      // Don't await - the app will quit and won't send a response
      window.api.quitAndInstall();
      console.log('quitAndInstall call initiated - app should quit');
    } else if (window.api && typeof window.api.invoke === 'function') {
      console.log('Calling window.api.invoke(app:quitAndInstall)');
      // Don't await - the app will quit and won't send a response
      window.api.invoke('app:quitAndInstall');
      console.log('invoke call initiated - app should quit');
    } else {
      console.error('No quitAndInstall API available');
      updateMessage.textContent = 'Install failed: API not available';
    }
  } catch (e) {
    console.error('Install & Restart failed:', e);
    updateMessage.textContent = 'Install failed: ' + e.message;
  }
});

updateDismissButton.addEventListener('click', () => {
  updateNotification.hidden = true;
});

// Check for updates on app startup (only once)
window.addEventListener('load', async () => {
  // Automatic update check is handled by main process
  // Initialize common settings controls (autosave, spellcheck, softwrap, default export)
  try { if (typeof initCommonSettingsControls === 'function') initCommonSettingsControls(); } catch (e) {  }
  // Re-apply editor styles shortly after load to mitigate any startup ordering
  // issues where the right editor may not receive the injected styles on initial render.
  try {
    setTimeout(() => { try { if (typeof applyEditorStyles === 'function') applyEditorStyles(); } catch (e) {} }, 100);
    setTimeout(() => { try { if (typeof applyEditorStyles === 'function') applyEditorStyles(); } catch (e) {} }, 1000);
  } catch (e) {}
  // Restore persisted hashtag panel height/minimize state
  try {
    const persistedH = readStorage('NTA.hashtagPanelHeight');
    if (persistedH) {
      const v = parseInt(persistedH, 10);
      if (!Number.isNaN(v)) setHashtagPanelHeight(v);
    }
    const minimized = readStorage('NTA.hashtagPanelMinimized') === 'true';
    if (minimized) {
      const container = document.querySelector('.hashtag-container');
      if (container) {
        container.classList.add('hashtag-minimized');
      }
      const toggleBtn = document.getElementById('toggle-hashtag-minimize');
      if (toggleBtn) {
        toggleBtn.textContent = '▴';
        toggleBtn.setAttribute('aria-pressed', 'true');
      }
    }
    else {
      const toggleBtn = document.getElementById('toggle-hashtag-minimize');
      if (toggleBtn) {
        toggleBtn.textContent = '▾';
        toggleBtn.setAttribute('aria-pressed', 'false');
      }
    }
  } catch (e) {}
});

// Settings modal functions
function openSettingsModal() {
  if (elements.settingsModal) {
    elements.settingsModal.classList.add('visible');
    loadAppVersion();
    loadThemeSettings();
    initializeSettingsTabs();
  }
}

// Compute centered traffic light coordinates from the current DOM title bar and title text.
function computeCenteredTrafficLightCoords() {
  const titleBarEl = document.querySelector('.workspace__toolbar');
  const titleEl = document.querySelector('.title-bar__title') || document.querySelector('.workspace__filemeta .workspace__filename') || titleBarEl;

  // Defaults (in case DOM is not available)
  let centerX = 12;
  let y = 8;

  try {
    const titleBarRect = titleBarEl && typeof titleBarEl.getBoundingClientRect === 'function' ? titleBarEl.getBoundingClientRect() : null;

    if (titleEl && typeof titleEl.getBoundingClientRect === 'function' && titleBarRect) {
      const rect = titleEl.getBoundingClientRect();
      // Compute title center in global (viewport) coordinates (use only for vertical alignment)
      const titleCenterGlobalY = rect.top + rect.height / 2;

      const titleBarTop = titleBarRect.top;

      // Heuristic for traffic light height
      const approxTrafficHeight = 16;

      // X: keep a fixed left margin matching the top-left preset so switching modes doesn't jump
      // Use 12px to match the main process's top-left default.
      // Y: align vertically with the center of the title text inside the title bar
      y = Math.round(titleCenterGlobalY - titleBarTop - Math.round(approxTrafficHeight / 2) - 2); // 2px upward correction
      y = Math.max(4, y);
    } else if (titleBarRect) {
      // Fallback: center vertically within title bar, keep fixed X
      centerX = 12;
      y = Math.max(4, Math.round(titleBarRect.height / 2) - 2);
    } else {
      // Final fallback: use stored title bar size or 32px
      const titleBarHeight = parseInt(localStorage.getItem('titleBarSize') || '32', 10);
      centerX = 12;
      y = Math.max(4, Math.round(titleBarHeight / 2) - 2);
    }
  } catch (err) {
  }

  // Debug output so we can verify values during testing
  try {
  // Debug prints removed
  } catch (e) {}

  // Ensure helper is reachable from other runtime code during reloads
  if (typeof window !== 'undefined') {
    window.computeCenteredTrafficLightCoords = computeCenteredTrafficLightCoords;
  }

  return { x: centerX, y, mode: 'absolute' };
}

function closeSettingsModal() {
  if (elements.settingsModal) {
    elements.settingsModal.classList.remove('visible');
  }
}

function initializeSettingsTabs() {
  // Idempotent: prevent double-registration of event listeners
  if (typeof window._settingsTabsInitialized !== 'undefined' && window._settingsTabsInitialized) return;

  const navItems = document.querySelectorAll('.settings-nav__item');
  const tabs = document.querySelectorAll('.settings-tab');

  // Add event listeners to navigation items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.dataset.tab;
      switchToTab(targetTab);
    });
  });

  // Initialize advanced settings toggles
  initializeAdvancedToggles();

  // Initialize component selector
  initializeComponentSelector();

  // Initialize new advanced settings
  initializeNewAdvancedSettings();

  window._settingsTabsInitialized = true;
}

function initializeAdvancedToggles() {
  const toggles = document.querySelectorAll('.settings-toggle, .settings-arrow-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.dataset.target;
      const targetSection = document.getElementById(targetId);
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      
      if (targetSection) {
        if (isExpanded) {
          // Collapse
          toggle.setAttribute('aria-expanded', 'false');
          targetSection.classList.remove('visible');
          targetSection.setAttribute('hidden', '');
        } else {
          // Expand
          toggle.setAttribute('aria-expanded', 'true');
          targetSection.removeAttribute('hidden');
          setTimeout(() => targetSection.classList.add('visible'), 10);
        }
      }
    });
    
    // Initialize state
    toggle.setAttribute('aria-expanded', 'false');
  });
  
  // File input handlers
  const fontImportBtn = document.getElementById('font-import-btn');
  const fontImportInput = document.getElementById('font-import');
  
  if (fontImportBtn && fontImportInput) {
    fontImportBtn.addEventListener('click', () => {
      fontImportInput.click();
    });
    
    fontImportInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      fontImportBtn.textContent = file.name;

      try {
        // Read the file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Send bytes to main process for saving
        if (window.fontImporter && typeof window.fontImporter.importFont === 'function') {
          const resp = await window.fontImporter.importFont(file.name, file.name, arrayBuffer);
          if (resp && resp.success && resp.url && resp.family) {
            // Register @font-face using the returned URL and family
            const styleId = `imported-font-${resp.family}`;
            if (!document.getElementById(styleId)) {
              const s = document.createElement('style');
              s.id = styleId;
              s.textContent = `@font-face { font-family: "${resp.family}"; src: url("${resp.url}"); font-display: swap; }`;
              document.head.appendChild(s);
            }

            // Add option to font-family select (if present) and select it
            const select = document.getElementById('font-family-select');
            if (select) {
              // Use family name as value to apply later via applyFontFamily
              const opt = document.createElement('option');
              opt.value = resp.family;
              opt.textContent = `${resp.family} (Imported)`;
              select.appendChild(opt);
              select.value = resp.family;

              // Apply immediately using existing handler
              if (typeof handleFontFamilyChange === 'function') {
                // Create a fake event target to pass into the handler
                handleFontFamilyChange({ target: { value: resp.family } });
              } else {
                applyFontFamily(resp.family);
              }

              // Update preview next to the select if exists
              let preview = document.getElementById('font-preview-sample');
              if (!preview) {
                preview = document.createElement('span');
                preview.id = 'font-preview-sample';
                preview.className = 'font-preview-sample';
                // Use the sample phrase for previewing the imported font
                preview.textContent = 'The quick brown fox';
                select.parentNode.appendChild(preview);
              }
              preview.style.fontFamily = resp.family;
            }
          } else {
          }
        } else {
          }
      } catch (err) {
      }
    });
  }
  
  // Initialize slider value displays and functionality
  initializeSliders();
  
  // Load saved traffic light settings
  loadTrafficLightSettings();
}

function loadTrafficLightSettings() {
  // Restore saved traffic light position
  const savedPosition = localStorage.getItem('trafficLightPosition') || 'center';
  const positionSelect = document.getElementById('traffic-light-position-select');
  if (positionSelect) {
    positionSelect.value = savedPosition;
    applyTrafficLightPosition(savedPosition);
    
    // Show custom controls if needed
    const customContainer = document.getElementById('traffic-light-custom-container');
    if (customContainer) {
      if (savedPosition === 'custom') {
        customContainer.removeAttribute('hidden');
      } else {
        customContainer.setAttribute('hidden', '');
      }
    }
  }
  
  // Restore saved traffic light offset
  const savedOffset = localStorage.getItem('trafficLightOffset') || '8';
  const offsetSlider = document.getElementById('traffic-light-offset-slider');
  const offsetValue = document.getElementById('traffic-light-offset-value');
  if (offsetSlider && offsetValue) {
    offsetSlider.value = savedOffset;
    offsetValue.textContent = `${savedOffset}px`;
    applyTrafficLightOffset(savedOffset);
  }
}

function initializeComponentSelector() {
  const componentSelector = document.getElementById('component-selector');
  if (!componentSelector) return;

  // Initialize with workspace selected
  updateComponentSettings('workspace');

  // Add event listener for component selection
  componentSelector.addEventListener('change', (event) => {
    const selectedComponent = event.target.value;
    updateComponentSettings(selectedComponent);
  });
}

function updateComponentSettings(component) {
  // Component-specific settings mapping
  const componentSettings = {
    workspace: {
      bgColor: '#f1f3f4',
      fontSize: { min: 11, max: 18, default: 13 },
      textColor: '#374151',
      showTitlebarSpecific: false
    },
    editor: {
      bgColor: '#ffffff',
      fontSize: { min: 12, max: 20, default: 14 },
      textColor: '#1f2933',
      showTitlebarSpecific: false
    },
    preview: {
      bgColor: '#ffffff',
      fontSize: { min: 12, max: 20, default: 14 },
      textColor: '#1f2933',
      showTitlebarSpecific: false
    },
    statusbar: {
      bgColor: '#f1f3f4',
      fontSize: { min: 10, max: 16, default: 12 },
      textColor: '#374151',
      showTitlebarSpecific: false
    },
    titlebar: {
      bgColor: '#ffffff',
      fontSize: { min: 11, max: 18, default: 14 },
      textColor: '#1f2933',
      showTitlebarSpecific: true
    }
  };

  const settings = componentSettings[component];
  if (!settings) return;

  // Update slider ranges and values
  const fontSizeSlider = document.getElementById('component-font-size-slider');
  const fontSizeValue = document.getElementById('component-font-size-value');
  if (fontSizeSlider && fontSizeValue) {
    fontSizeSlider.min = settings.fontSize.min;
    fontSizeSlider.max = settings.fontSize.max;
    fontSizeSlider.value = settings.fontSize.default;
    fontSizeValue.textContent = `${settings.fontSize.default}px`;
  }

  // Update color picker defaults
  const bgColorPicker = document.getElementById('component-bg-color-picker');
  const textColorPicker = document.getElementById('component-text-color-picker');
  if (bgColorPicker) bgColorPicker.value = settings.bgColor;
  if (textColorPicker) textColorPicker.value = settings.textColor;

  // Show/hide titlebar-specific setting
  const titlebarSpecificSetting = document.getElementById('titlebar-specific-setting');
  if (titlebarSpecificSetting) {
    if (settings.showTitlebarSpecific) {
      titlebarSpecificSetting.removeAttribute('hidden');
    } else {
      titlebarSpecificSetting.setAttribute('hidden', '');
    }
  }

  // Load saved settings for this component
  loadComponentSettings(component);
}

function loadComponentSettings(component) {
  // Load checkbox states
  const useGlobalBg = localStorage.getItem(`${component}-use-global-bg`) !== 'false';
  const useGlobalFont = localStorage.getItem(`${component}-use-global-font`) !== 'false';
  const useGlobalSize = localStorage.getItem(`${component}-use-global-size`) !== 'false';
  const useGlobalColor = localStorage.getItem(`${component}-use-global-color`) !== 'false';
  const useGlobalStyle = localStorage.getItem(`${component}-use-global-style`) !== 'false';

  // Update checkboxes
  const bgCheckbox = document.getElementById('component-use-global-bg');
  const fontCheckbox = document.getElementById('component-use-global-font');
  const sizeCheckbox = document.getElementById('component-use-global-size');
  const colorCheckbox = document.getElementById('component-use-global-color');
  const styleCheckbox = document.getElementById('component-use-global-style');

  if (bgCheckbox) bgCheckbox.checked = useGlobalBg;
  if (fontCheckbox) fontCheckbox.checked = useGlobalFont;
  if (sizeCheckbox) sizeCheckbox.checked = useGlobalSize;
  if (colorCheckbox) colorCheckbox.checked = useGlobalColor;
  if (styleCheckbox) styleCheckbox.checked = useGlobalStyle;

  // Update control states
  updateComponentControlStates(component);

  // Load saved values
  const savedBgColor = localStorage.getItem(`${component}-bg-color`);
  const savedFontFamily = localStorage.getItem(`${component}-font-family`);
  const savedFontSize = localStorage.getItem(`${component}-font-size`);
  const savedTextColor = localStorage.getItem(`${component}-text-color`);
  const savedFontStyle = localStorage.getItem(`${component}-font-style`);

  const bgColorPicker = document.getElementById('component-bg-color-picker');
  const fontFamilySelect = document.getElementById('component-font-family-select');
  const fontSizeSlider = document.getElementById('component-font-size-slider');
  const fontSizeValue = document.getElementById('component-font-size-value');
  const textColorPicker = document.getElementById('component-text-color-picker');
  const fontStyleSelect = document.getElementById('component-font-style-select');

  if (savedBgColor && bgColorPicker) bgColorPicker.value = savedBgColor;
  if (savedFontFamily && fontFamilySelect) fontFamilySelect.value = savedFontFamily;
  if (savedFontSize && fontSizeSlider && fontSizeValue) {
    fontSizeSlider.value = savedFontSize;
    fontSizeValue.textContent = `${savedFontSize}px`;
  }
  if (savedTextColor && textColorPicker) textColorPicker.value = savedTextColor;
  if (savedFontStyle && fontStyleSelect) fontStyleSelect.value = savedFontStyle;

  // Load titlebar-specific setting
  if (component === 'titlebar') {
    const showPath = localStorage.getItem('titlebar-show-path') !== 'false';
    const showPathCheckbox = document.getElementById('titlebar-show-path');
    if (showPathCheckbox) showPathCheckbox.checked = showPath;
  }

  // Load global "show filename only" setting into the settings checkbox
  const showFilenameOnlyCheckbox = document.getElementById('show-filename-only');
  if (showFilenameOnlyCheckbox) {
    try {
      const enabled = localStorage.getItem(storageKeys.showFileNameOnly) === 'true';
      showFilenameOnlyCheckbox.checked = enabled;
      showFilenameOnlyCheckbox.addEventListener('change', (evt) => {
        try {
          const val = evt.target.checked ? 'true' : 'false';
          localStorage.setItem(storageKeys.showFileNameOnly, val);
          // Refresh visible file metadata for the active pane/note
          try { updateFileMetadataUI(state.notes.get(state.activeNoteId) ?? null, { allowActiveFallback: true }); } catch (e) {}
        } catch (e) { }
      });
    } catch (e) { }
  }
}

function updateComponentControlStates(component) {
  const bgCheckbox = document.getElementById('component-use-global-bg');
  const fontCheckbox = document.getElementById('component-use-global-font');
  const sizeCheckbox = document.getElementById('component-use-global-size');
  const colorCheckbox = document.getElementById('component-use-global-color');
  const styleCheckbox = document.getElementById('component-use-global-style');

  const bgColorPicker = document.getElementById('component-bg-color-picker');
  const bgResetBtn = document.getElementById('reset-component-bg-color');
  const fontFamilySelect = document.getElementById('component-font-family-select');
  const fontResetBtn = document.getElementById('reset-component-font-family');
  const fontSizeSlider = document.getElementById('component-font-size-slider');
  const fontSizeResetBtn = document.getElementById('reset-component-font-size');
  const textColorPicker = document.getElementById('component-text-color-picker');
  const textColorResetBtn = document.getElementById('reset-component-text-color');
  const fontStyleSelect = document.getElementById('component-font-style-select');

  // Background controls
  if (bgColorPicker) bgColorPicker.disabled = bgCheckbox?.checked || false;
  if (bgResetBtn) bgResetBtn.disabled = bgCheckbox?.checked || false;

  // Font family controls
  if (fontFamilySelect) fontFamilySelect.disabled = fontCheckbox?.checked || false;
  if (fontResetBtn) fontResetBtn.disabled = fontCheckbox?.checked || false;

  // Font size controls
  if (fontSizeSlider) fontSizeSlider.disabled = sizeCheckbox?.checked || false;
  if (fontSizeResetBtn) fontSizeResetBtn.disabled = sizeCheckbox?.checked || false;

  // Text color controls
  if (textColorPicker) textColorPicker.disabled = colorCheckbox?.checked || false;
  if (textColorResetBtn) textColorResetBtn.disabled = colorCheckbox?.checked || false;

  // Font style controls
  if (fontStyleSelect) fontStyleSelect.disabled = styleCheckbox?.checked || false;
}

function initializeNewAdvancedSettings() {
  // Auto-save interval slider
  if (elements.autosaveIntervalSlider && elements.autosaveIntervalValue) {
    const savedInterval = readStorage('NTA.autosaveInterval') || '30';
    elements.autosaveIntervalSlider.value = savedInterval;
    elements.autosaveIntervalValue.textContent = `${savedInterval}s`;
    
    elements.autosaveIntervalSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      elements.autosaveIntervalValue.textContent = `${value}s`;
      writeStorage('NTA.autosaveInterval', value);
      // Update autosave interval if autosave is enabled
      if (readStorage(storageKeys.autosaveEnabled) === 'true') {
        // This would need to restart the autosave timer
      }
    });
    
    if (elements.resetAutosaveIntervalButton) {
      elements.resetAutosaveIntervalButton.addEventListener('click', () => {
        writeStorage('NTA.autosaveInterval', '30');
        elements.autosaveIntervalSlider.value = '30';
        elements.autosaveIntervalValue.textContent = '30s';
      });
    }
  }
  
  // Word wrap toggle
  if (elements.wordWrapToggle) {
    const savedWordWrap = readStorage('NTA.wordWrap') === 'true';
    elements.wordWrapToggle.checked = savedWordWrap;
    
    function applyWordWrap(enabled) {
      const applyTo = Object.values(editorInstances).filter(Boolean).map(i => i.el).concat([elements.editor, elements.editorRight]);
      applyTo.forEach(el => { 
        try { 
          if (el && el.tagName) {
            el.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
            el.style.wordWrap = enabled ? 'break-word' : 'normal';
          } 
        } catch (e) {} 
      });
    }
    
    applyWordWrap(savedWordWrap);
    elements.wordWrapToggle.addEventListener('change', (e) => { 
      writeStorage('NTA.wordWrap', e.target.checked); 
      applyWordWrap(e.target.checked); 
    });
  }
  
  // Default file extension select
  if (elements.defaultFileExtensionSelect) {
    const savedExtension = readStorage('NTA.defaultFileExtension') || '.md';
    elements.defaultFileExtensionSelect.value = savedExtension;
    
    elements.defaultFileExtensionSelect.addEventListener('change', (e) => {
      writeStorage('NTA.defaultFileExtension', e.target.value);
    });
  }
  
  // Show hidden files toggle
  if (elements.showHiddenFilesToggle) {
    const savedShowHidden = readStorage('NTA.showHiddenFiles') === 'true';
    elements.showHiddenFilesToggle.checked = savedShowHidden;
    
    elements.showHiddenFilesToggle.addEventListener('change', (e) => {
      writeStorage('NTA.showHiddenFiles', e.target.checked);
      // This would need to refresh the file tree
    });
  }
  
  // Max recent files slider
  if (elements.maxRecentFilesSlider && elements.maxRecentFilesValue) {
    const savedMax = readStorage('NTA.maxRecentFiles') || '20';
    elements.maxRecentFilesSlider.value = savedMax;
    elements.maxRecentFilesValue.textContent = savedMax;
    
    elements.maxRecentFilesSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      elements.maxRecentFilesValue.textContent = value;
      writeStorage('NTA.maxRecentFiles', value);
    });
    
    if (elements.resetMaxRecentFilesButton) {
      elements.resetMaxRecentFilesButton.addEventListener('click', () => {
        writeStorage('NTA.maxRecentFiles', '20');
        elements.maxRecentFilesSlider.value = '20';
        elements.maxRecentFilesValue.textContent = '20';
      });
    }
  }
  
  // Max image size slider
  if (elements.maxImageSizeSlider && elements.maxImageSizeValue) {
    const savedMax = readStorage('NTA.maxImageSize') || '10';
    elements.maxImageSizeSlider.value = savedMax;
    elements.maxImageSizeValue.textContent = `${savedMax}MB`;
    
    elements.maxImageSizeSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      elements.maxImageSizeValue.textContent = `${value}MB`;
      writeStorage('NTA.maxImageSize', value);
    });
    
    if (elements.resetMaxImageSizeButton) {
      elements.resetMaxImageSizeButton.addEventListener('click', () => {
        writeStorage('NTA.maxImageSize', '10');
        elements.maxImageSizeSlider.value = '10';
        elements.maxImageSizeValue.textContent = '10MB';
      });
    }
  }
  
  // Max video size slider
  if (elements.maxVideoSizeSlider && elements.maxVideoSizeValue) {
    const savedMax = readStorage('NTA.maxVideoSize') || '100';
    elements.maxVideoSizeSlider.value = savedMax;
    elements.maxVideoSizeValue.textContent = `${savedMax}MB`;
    
    elements.maxVideoSizeSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      elements.maxVideoSizeValue.textContent = `${value}MB`;
      writeStorage('NTA.maxVideoSize', value);
    });
    
    if (elements.resetMaxVideoSizeButton) {
      elements.resetMaxVideoSizeButton.addEventListener('click', () => {
        writeStorage('NTA.maxVideoSize', '100');
        elements.maxVideoSizeSlider.value = '100';
        elements.maxVideoSizeValue.textContent = '100MB';
      });
    }
  }
  
  // Max script size slider
  if (elements.maxScriptSizeSlider && elements.maxScriptSizeValue) {
    const savedMax = readStorage('NTA.maxScriptSize') || '5';
    elements.maxScriptSizeSlider.value = savedMax;
    elements.maxScriptSizeValue.textContent = `${savedMax}MB`;
    
    elements.maxScriptSizeSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      elements.maxScriptSizeValue.textContent = `${value}MB`;
      writeStorage('NTA.maxScriptSize', value);
    });
    
    if (elements.resetMaxScriptSizeButton) {
      elements.resetMaxScriptSizeButton.addEventListener('click', () => {
        writeStorage('NTA.maxScriptSize', '5');
        elements.maxScriptSizeSlider.value = '5';
        elements.maxScriptSizeValue.textContent = '5MB';
      });
    }
  }
}

function initializeSliders() {
  // Title bar size slider
  const titleBarSlider = document.getElementById('title-bar-size-slider');
  const titleBarValue = document.getElementById('title-bar-size-value');
  const titleBarReset = document.getElementById('reset-title-bar-size');
  
  if (titleBarSlider && titleBarValue) {
    // Load saved value
    const savedTitleBarSize = localStorage.getItem('title-bar-size') || '32';
    titleBarSlider.value = savedTitleBarSize;
    titleBarValue.textContent = `${savedTitleBarSize}px`;
    applyTitleBarSize(savedTitleBarSize);

    titleBarSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      titleBarValue.textContent = `${value}px`;
      localStorage.setItem('title-bar-size', value);
      applyTitleBarSize(value);
    });

    if (titleBarReset) {
      titleBarReset.addEventListener('click', () => {
        localStorage.removeItem('title-bar-size');
        titleBarSlider.value = 32;
        titleBarValue.textContent = '32px';
        applyTitleBarSize(32);
      });
    }
  }
  
  // Traffic light position
  const trafficLightPosition = document.getElementById('traffic-light-position-select');
  const trafficLightCustomContainer = document.getElementById('traffic-light-custom-container');
  
  if (trafficLightPosition) {
    trafficLightPosition.addEventListener('change', (e) => {
      const position = e.target.value;
      applyTrafficLightPosition(position);
      
      // Show/hide custom offset controls
      if (trafficLightCustomContainer) {
        if (position === 'custom') {
          trafficLightCustomContainer.removeAttribute('hidden');
        } else {
          trafficLightCustomContainer.setAttribute('hidden', '');
        }
      }
      // Disable offset slider when position is centered
      const trafficLightSliderEl = document.getElementById('traffic-light-offset-slider');
      if (trafficLightSliderEl) {
        trafficLightSliderEl.disabled = (position === 'center');
      }
      // Update offset display to show locked state when centered
      const trafficLightValueEl = document.getElementById('traffic-light-offset-value');
      if (trafficLightValueEl) {
        trafficLightValueEl.textContent = (position === 'center') ? 'locked' : `${localStorage.getItem('trafficLightOffset') || '8'}px`;
      }
    });
    // Ensure initial disabled state matches saved/initial position
    try {
      const initPos = trafficLightPosition.value || localStorage.getItem('trafficLightPosition') || 'center';
      const trafficLightSliderEl = document.getElementById('traffic-light-offset-slider');
      const trafficLightValueEl = document.getElementById('traffic-light-offset-value');
      if (trafficLightSliderEl) trafficLightSliderEl.disabled = (initPos === 'center');
      if (trafficLightValueEl) trafficLightValueEl.textContent = (initPos === 'center') ? 'locked' : `${localStorage.getItem('trafficLightOffset') || '8'}px`;
    } catch (err) {
      // ignore
    }
  }
  
  // Traffic light offset slider
  const trafficLightSlider = document.getElementById('traffic-light-offset-slider');
  const trafficLightValue = document.getElementById('traffic-light-offset-value');
  const trafficLightReset = document.getElementById('reset-traffic-light-offset');
  
  if (trafficLightSlider && trafficLightValue) {
    trafficLightSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      trafficLightValue.textContent = `${value}px`;
      applyTrafficLightOffset(value);
    });
    
    if (trafficLightReset) {
      trafficLightReset.addEventListener('click', () => {
        trafficLightSlider.value = 8;
        trafficLightValue.textContent = '8px';
        applyTrafficLightOffset(8);
      });
    }
  }
  
  // Status bar size slider
  const statusBarSlider = document.getElementById('status-bar-size-slider');
  const statusBarValue = document.getElementById('status-bar-size-value');
  const statusBarReset = document.getElementById('reset-status-bar-size');
  
  if (statusBarSlider && statusBarValue) {
    statusBarSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      statusBarValue.textContent = `${value}px`;
      applyStatusBarSize(value);
    });
    
    if (statusBarReset) {
      statusBarReset.addEventListener('click', () => {
        statusBarSlider.value = 28;
        statusBarValue.textContent = '28px';
        applyStatusBarSize(28);
      });
    }
  }
  
  // Status bar position
  const statusBarPosition = document.getElementById('status-bar-position-select');
  if (statusBarPosition) {
    statusBarPosition.addEventListener('change', (e) => {
      applyStatusBarPosition(e.target.value);
    });
  }
}

function applyTitleBarSize(size) {
  // Apply title bar size changes to CSS variable for macOS title bar
  document.documentElement.style.setProperty('--title-bar-height', `${size}px`);

  // Also apply to workspace toolbar for consistency
  const titleBar = document.querySelector('.workspace__toolbar');
  if (titleBar) {
    titleBar.style.height = `${size}px`;
    titleBar.style.minHeight = `${size}px`;
  }
}

function applyTrafficLightPosition(position) {
  
  // Store the setting
  localStorage.setItem('trafficLightPosition', position);
  
  // Add visual feedback
  const positionSelect = document.getElementById('traffic-light-position-select');
  if (positionSelect) {
    positionSelect.style.borderColor = 'var(--accent)';
    setTimeout(() => {
      positionSelect.style.borderColor = '';
    }, 300);
  }
  
  // Use the updated API
  if (window.api && window.api.setTrafficLightPosition) {
    // If user requested 'center' we compute coordinates based on the current title bar height
    // so the traffic lights are vertically centered within the title bar instead of placed at the border.
    let payload = position;
    if (position === 'center') {
      try {
        payload = computeCenteredTrafficLightCoords();
  // Debug prints removed
      } catch (err) {
        payload = 'center';
      }
    }

    window.api.setTrafficLightPosition(payload).then(result => {
      if (!result.success) {
      }
    }).catch(error => {
    });
  } else {
  }
}

function applyTrafficLightOffset(offset) {
  
  // Store the setting
  localStorage.setItem('trafficLightOffset', offset);
  // If the user chose to center the traffic lights, ignore offset changes.
  const currentPosition = localStorage.getItem('trafficLightPosition') || 'center';
  if (currentPosition === 'center') {
    // Re-apply center position to the main process in case offset previously moved them.
    if (window.api && window.api.setTrafficLightPosition) {
      const payload = computeCenteredTrafficLightCoords();
      window.api.setTrafficLightPosition(payload).then(result => {
      }).catch(err => {
      });
    }
    return;
  }
  
  // Add visual feedback
  const offsetSlider = document.getElementById('traffic-light-offset-slider');
  if (offsetSlider) {
    offsetSlider.style.accentColor = 'var(--accent)';
    setTimeout(() => {
      offsetSlider.style.accentColor = '';
    }, 300);
  }
  
  // Use the updated API
  if (window.api && window.api.setTrafficLightOffset) {
    window.api.setTrafficLightOffset(parseInt(offset)).then(result => {
      if (!result.success) {
      }
    }).catch(error => {
    });
  } else {
  }
}

function showTrafficLightWarning() {
  // Only show once per session
  if (!window.trafficLightWarningShown) {
  // Debug prints removed
    window.trafficLightWarningShown = true;
  }
}

function applyStatusBarSize(size) {
  // Apply status bar size changes
  const statusBar = document.querySelector('.status-bar');
  if (statusBar) {
    statusBar.style.height = `${size}px`;
    statusBar.style.minHeight = `${size}px`;
  }
}

function applyStatusBarPosition(position) {
  // Apply status bar position changes
  const statusBar = document.querySelector('.status-bar');
  const workspace = document.querySelector('.workspace');
  
  if (statusBar && workspace) {
    switch (position) {
      case 'top':
        workspace.style.flexDirection = 'column-reverse';
        statusBar.style.display = 'flex';
        break;
      case 'bottom':
        workspace.style.flexDirection = 'column';
        statusBar.style.display = 'flex';
        break;
      case 'hidden':
        statusBar.style.display = 'none';
        break;
    }
  }
}

function switchToTab(targetTabId) {
  const navItems = document.querySelectorAll('.settings-nav__item');
  const tabs = document.querySelectorAll('.settings-tab');
  const currentActiveTab = document.querySelector('.settings-tab.active');
  const targetTab = document.getElementById(`${targetTabId}-tab`);
  
  if (!targetTab || targetTab.classList.contains('active')) return;
  
  // Update navigation active state
  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.tab === targetTabId);
  });
  
  // Determine slide direction
  const currentIndex = Array.from(tabs).indexOf(currentActiveTab);
  const targetIndex = Array.from(tabs).indexOf(targetTab);
  const slideLeft = targetIndex < currentIndex;
  
  // Apply slide-out animation to current tab
  if (currentActiveTab) {
    currentActiveTab.classList.add(slideLeft ? 'slide-out-right' : 'slide-out-left');
    currentActiveTab.classList.remove('active');
  }
  
  // Apply slide-in animation to target tab
  targetTab.classList.add(slideLeft ? 'slide-in-left' : 'slide-in-right');
  
  // Clean up and activate new tab after animation
  setTimeout(() => {
    tabs.forEach(tab => {
      tab.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
    });
    targetTab.classList.add('active');
  }, 50);
}

async function loadAppVersion() {
  try {
    let version = 'Unknown';
    if (window.api && typeof window.api.getVersion === 'function') {
      version = await window.api.getVersion();
    } else if (window.api && typeof window.api.invoke === 'function') {
      version = await window.api.invoke('app:getVersion');
    }
    if (elements.appVersion) {
      elements.appVersion.textContent = version;
    }
  } catch (error) {
    if (elements.appVersion) {
      elements.appVersion.textContent = 'Unknown';
    }
  }
}

function loadThemeSettings() {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('app-theme') || 'system';
  if (elements.themeSelect) {
    elements.themeSelect.value = savedTheme;
  }
  
  // Apply theme first
  applyTheme(savedTheme);
  
  // Load saved background color
  const savedBgColor = localStorage.getItem('app-bg-color');
  if (savedBgColor && elements.bgColorPicker) {
    elements.bgColorPicker.value = savedBgColor;
    updateBackgroundColor(savedBgColor);
  } else {
    // Set color picker to current theme's default
    updateColorPickerForCurrentTheme();
  }
  
  // Load font settings
  const savedFontFamily = localStorage.getItem('app-font-family') || 'system';
  if (elements.fontFamilySelect) {
    elements.fontFamilySelect.value = savedFontFamily;
  }
  applyFontFamily(savedFontFamily);
  
  const savedFontSize = localStorage.getItem('app-font-size') || '14';
  if (elements.fontSizeSlider && elements.fontSizeValue) {
    elements.fontSizeSlider.value = savedFontSize;
    elements.fontSizeValue.textContent = savedFontSize + 'px';
    applyFontSize(savedFontSize);
  }
  
  // Load color settings
  const savedTextColor = localStorage.getItem('app-text-color');
  if (savedTextColor && elements.textColorPicker) {
    elements.textColorPicker.value = savedTextColor;
    applyTextColor(savedTextColor);
  }
  
  const savedBorderColor = localStorage.getItem('app-border-color');
  if (savedBorderColor && elements.borderColorPicker) {
    elements.borderColorPicker.value = savedBorderColor;
    applyBorderColor(savedBorderColor);
  }
  
  const savedBorderThickness = localStorage.getItem('app-border-thickness') || '1';
  if (elements.borderThicknessSlider && elements.borderThicknessValue) {
    elements.borderThicknessSlider.value = savedBorderThickness;
    elements.borderThicknessValue.textContent = savedBorderThickness + 'px';
    applyBorderThickness(savedBorderThickness);
  }
}

function handleThemeChange(event) {
  const theme = event.target.value;
  localStorage.setItem('app-theme', theme);
  applyTheme(theme);
}

function applyTheme(theme) {
  const body = document.body;
  
  // Remove existing theme classes
  body.removeAttribute('data-theme');
  
  if (theme === 'light') {
    body.setAttribute('data-theme', 'light');
  } else if (theme === 'dark') {
    body.setAttribute('data-theme', 'dark');
  }
  // For 'system', we don't set a data-theme attribute, letting CSS media queries handle it
  
  // Update color picker for new theme if no custom color is set
  const savedBgColor = localStorage.getItem('app-bg-color');
  if (!savedBgColor) {
    updateColorPickerForCurrentTheme();
  }
}



function handleBgColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('app-bg-color', color);
  updateBackgroundColor(color);
  
  // Update component styles that are using global background color
  applyWorkspaceStyles();
  applyEditorStyles();
  applyPreviewStyles();
}

function updateBackgroundColor(color) {
  // Update CSS custom properties for background color
  const root = document.documentElement;
  
  // Convert hex to RGB for rgba calculations
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate variations based on whether it's a dark or light color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDarkColor = brightness < 128;
  
  let elevated, sidebar, muted;
  if (isDarkColor) {
    // For dark colors, make elevated brighter and sidebar darker
    elevated = `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`;
    sidebar = `rgb(${Math.max(0, r - 15)}, ${Math.max(0, g - 15)}, ${Math.max(0, b - 15)})`;
    muted = `rgb(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)})`;
  } else {
    // For light colors, make elevated brighter and sidebar darker
    elevated = `rgb(${Math.min(255, r + 15)}, ${Math.min(255, g + 15)}, ${Math.min(255, b + 15)})`;
    sidebar = `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`;
    muted = `rgb(${Math.max(0, r - 10)}, ${Math.max(0, g - 10)}, ${Math.max(0, b - 10)})`;
  }
  
  // Apply directly to the current theme variables
  root.style.setProperty('--bg', color);
  root.style.setProperty('--bg-elevated', elevated);
  root.style.setProperty('--bg-sidebar', sidebar);
  root.style.setProperty('--bg-muted', muted);
}

function resetBgColor() {
  // Remove custom background color
  localStorage.removeItem('app-bg-color');
  
  const root = document.documentElement;
  root.style.removeProperty('--bg');
  root.style.removeProperty('--bg-elevated');
  root.style.removeProperty('--bg-sidebar');
  root.style.removeProperty('--bg-muted');
  
  // Reset color picker to default
  if (elements.bgColorPicker) {
    const isDark = document.body.getAttribute('data-theme') === 'dark' || 
      (document.body.getAttribute('data-theme') !== 'light' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    elements.bgColorPicker.value = isDark ? '#0f1117' : '#f7f8fa';
  }
}

// Font family handlers
function handleFontFamilyChange(event) {
  const fontFamily = event.target.value;
  localStorage.setItem('app-font-family', fontFamily);
  applyFontFamily(fontFamily);
  
  // Update component styles that are using global font family
  applyWorkspaceStyles();
  applyEditorStyles();
  applyPreviewStyles();
}

function applyFontFamily(fontFamily) {
  const root = document.documentElement;
  let fontStack;
  
  switch (fontFamily) {
    case 'system':
      // Platform-specific system fonts
      if (window.currentPlatform === 'win32') {
        fontStack = '"Segoe UI", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      } else if (window.currentPlatform === 'linux') {
        fontStack = '"Ubuntu", "Liberation Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      } else {
        fontStack = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      }
      break;
    case 'Inter':
      fontStack = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      break;
    case 'JetBrains Mono':
    case 'Fira Code':
    case 'Monaco':
      if (window.currentPlatform === 'win32') {
        fontStack = `"${fontFamily}", "Consolas", "Courier New", monospace`;
      } else {
        fontStack = `"${fontFamily}", "SF Mono", Monaco, monospace`;
      }
      break;
    default:
      fontStack = `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  }
  
  // Apply to CSS custom property
  root.style.setProperty('--font-family', fontStack);
  
  // Create or update custom font family styles
  let fontFamilyStyle = document.getElementById('custom-font-family');
  if (!fontFamilyStyle) {
    fontFamilyStyle = document.createElement('style');
    fontFamilyStyle.id = 'custom-font-family';
    document.head.appendChild(fontFamilyStyle);
  }
  
  fontFamilyStyle.textContent = `
    body,
    #note-editor,
    #note-editor-right,
    .editor-pane textarea,
    #markdown-preview,
    .tree-node__name,
    .explorer__title,
    .explorer__path,
    .hashtag-detail__item,
    .settings-modal,
    .status-bar {
      font-family: ${fontStack} !important;
    }
  `;

  // Also update shared editor config so all Editor instances inherit this
  try {
    const sharedFontStack = getFontStackForName(fontFamily);
    Editor.sharedConfig = Editor.sharedConfig || {};
    Editor.sharedConfig.fontFamily = sharedFontStack;
    // Reapply to all existing editor instances
    Object.values(editorInstances).forEach(inst => { try { if (inst && typeof inst.applySharedSettings === 'function') inst.applySharedSettings(); } catch (e) {} });
  } catch (e) {}
}

// Return the CSS font-stack for a given fontFamily value (matches applyFontFamily logic)
function getFontStackForName(fontFamily) {
  if (!fontFamily) return getFontStackForName('system');

  switch (fontFamily) {
    case 'system':
      if (window.currentPlatform === 'win32') {
        return '"Segoe UI", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      } else if (window.currentPlatform === 'linux') {
        return '"Ubuntu", "Liberation Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      } else {
        return '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      }
    case 'Inter':
      return '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'JetBrains Mono':
    case 'Fira Code':
    case 'Monaco':
      if (window.currentPlatform === 'win32') {
        return `"${fontFamily}", "Consolas", "Courier New", monospace`;
      } else {
        return `"${fontFamily}", "SF Mono", Monaco, monospace`;
      }
    default:
      // If the value is an imported family (starts with 'NTA-' or contains spaces), use it directly
      if (fontFamily.startsWith('NTA-') || fontFamily.includes(' ')) {
        return `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      }
      return `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  }
}

// Ensure a small preview element exists next to a select and update its font
function ensureFontPreview(selectEl) {
  if (!selectEl || !selectEl.parentNode) return null;
  let preview = selectEl.parentNode.querySelector('.font-preview-sample');
  if (!preview) {
    preview = document.createElement('span');
    preview.className = 'font-preview-sample';
    preview.id = `font-preview-${(selectEl.id || Math.random()).replace(/[^a-zA-Z0-9_-]/g, '')}`;
    // Show a short label for the preview area
    preview.textContent = 'Font';
    selectEl.parentNode.appendChild(preview);
  }
  return preview;
}

function updateSelectPreview(selectEl) {
  if (!selectEl) return;
  const preview = ensureFontPreview(selectEl);
  if (!preview) return;

  const val = selectEl.value;
  const stack = getFontStackForName(val);
  // Apply the computed stack for preloaded fonts or direct family names
  preview.style.fontFamily = stack;
  // Keep the sample text but update the preview font used for rendering
  // (do not change preview.textContent here)
}

function updateAllFontPreviews() {
  const selects = [
    elements.fontFamilySelect,
    elements.componentFontFamilySelect
  ].filter(Boolean);

  selects.forEach(sel => updateSelectPreview(sel));
}

function resetFontFamily() {
  localStorage.removeItem('app-font-family');
  const root = document.documentElement;
  root.style.removeProperty('--font-family');
  
  // Remove custom font family styles
  const fontFamilyStyle = document.getElementById('custom-font-family');
  if (fontFamilyStyle) {
    fontFamilyStyle.remove();
  }
  
  if (elements.fontFamilySelect) {
    elements.fontFamilySelect.value = 'system';
  }
}

// Font size handlers
function handleFontSizeChange(event) {
  const fontSize = event.target.value;
  localStorage.setItem('app-font-size', fontSize);
  if (elements.fontSizeValue) {
    elements.fontSizeValue.textContent = fontSize + 'px';
  }
  applyFontSize(fontSize);
  
  // Update component styles that are using global font size
  applyWorkspaceStyles();
  applyEditorStyles();
  applyPreviewStyles();
}

function applyFontSize(fontSize) {
  const root = document.documentElement;
  const fontSizePx = fontSize + 'px';
  
  // Apply to CSS custom property for general use
  root.style.setProperty('--font-size', fontSizePx);
  
  // Create or update custom font size styles
  let fontSizeStyle = document.getElementById('custom-font-size');
  if (!fontSizeStyle) {
    fontSizeStyle = document.createElement('style');
    fontSizeStyle.id = 'custom-font-size';
    document.head.appendChild(fontSizeStyle);
  }
  
  // Calculate scaled sizes based on the base font size
  const baseSize = parseInt(fontSize);
  const editorSize = Math.max(12, baseSize + 1); // Editor slightly larger
  const smallSize = Math.max(10, baseSize - 2); // Smaller elements
  const tinySize = Math.max(9, baseSize - 3); // Very small elements
  
  fontSizeStyle.textContent = `
    /* Main content areas */
    #note-editor {
      font-size: ${editorSize}px !important;
    }
    
    /* File tree with responsive spacing */
    .tree-node__name {
      font-size: ${baseSize}px !important;
    }
    
    .tree-node__label {
      padding: ${Math.max(3, baseSize * 0.3)}px 12px ${Math.max(3, baseSize * 0.3)}px 0 !important;
    }
    
    .tree-node {
      padding-left: calc(var(--depth) * ${Math.max(12, baseSize)}px + ${Math.max(8, baseSize * 0.6)}px) !important;
    }
    
    /* Explorer sections */
    .explorer__title {
      font-size: ${baseSize + 1}px !important;
    }
    
    .explorer__path {
      font-size: ${smallSize}px !important;
    }
    
    /* Preview content */
    #markdown-preview {
      font-size: ${baseSize}px !important;
    }
    
    #markdown-preview p,
    #markdown-preview li,
    #markdown-preview td,
    #markdown-preview th {
      font-size: ${baseSize}px !important;
    }
    
    #markdown-preview h1 { font-size: ${baseSize + 10}px !important; }
    #markdown-preview h2 { font-size: ${baseSize + 8}px !important; }
    #markdown-preview h3 { font-size: ${baseSize + 6}px !important; }
    #markdown-preview h4 { font-size: ${baseSize + 4}px !important; }
    #markdown-preview h5 { font-size: ${baseSize + 2}px !important; }
    #markdown-preview h6 { font-size: ${baseSize + 1}px !important; }
    
    /* Hashtag panel */
    .hashtag-list .tree-node__name {
      font-size: ${baseSize}px !important;
    }
    
    .hashtag-detail__item {
      font-size: ${baseSize}px !important;
      padding: ${Math.max(6, baseSize * 0.5)}px ${Math.max(8, baseSize * 0.6)}px !important;
    }
    
    /* Status bar */
    .status-bar {
      font-size: ${smallSize}px !important;
      padding: ${Math.max(4, smallSize * 0.4)}px 24px !important;
    }
    
    /* Code blocks in preview */
    #markdown-preview code,
    #markdown-preview pre {
      font-size: ${baseSize - 1}px !important;
    }
    
    /* Search and suggestions */
    .wikilink-suggestions,
    .hashtag-suggestions,
    .file-suggestions {
      font-size: ${baseSize}px !important;
    }
    
    /* File name in header */
    #file-name {
      font-size: ${baseSize + 2}px !important;
    }
    
    /* General body text */
    body {
      font-size: ${baseSize}px !important;
    }
  `;

  // Also update shared editor config so Editor instances use the computed editor size
  try {
    const baseSize = parseInt(fontSize);
    const editorSize = Math.max(12, baseSize + 1);
    Editor.sharedConfig = Editor.sharedConfig || {};
    Editor.sharedConfig.fontSize = editorSize;
    Object.values(editorInstances).forEach(inst => { try { if (inst && typeof inst.applySharedSettings === 'function') inst.applySharedSettings(); } catch (e) {} });
  } catch (e) {}
}

function resetFontSize() {
  localStorage.removeItem('app-font-size');
  const root = document.documentElement;
  root.style.removeProperty('--font-size');
  
  // Remove custom font size styles
  const fontSizeStyle = document.getElementById('custom-font-size');
  if (fontSizeStyle) {
    fontSizeStyle.remove();
  }
  
  if (elements.fontSizeSlider && elements.fontSizeValue) {
    elements.fontSizeSlider.value = '14';
    elements.fontSizeValue.textContent = '14px';
  }
}

// Text color handlers
function handleTextColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('app-text-color', color);
  applyTextColor(color);
  
  // Update component styles that are using global text color
  applyWorkspaceStyles();
  applyEditorStyles();
  applyPreviewStyles();
}

function applyTextColor(color) {
  const root = document.documentElement;
  
  // Convert hex to RGB for alpha variations
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const softColor = `rgba(${r}, ${g}, ${b}, 0.72)`;
  
  root.style.setProperty('--fg', color);
  root.style.setProperty('--fg-soft', softColor);
}

function resetTextColor() {
  localStorage.removeItem('app-text-color');
  const root = document.documentElement;
  root.style.removeProperty('--fg');
  root.style.removeProperty('--fg-soft');
  
  if (elements.textColorPicker) {
    const isDark = document.body.getAttribute('data-theme') === 'dark' || 
      (document.body.getAttribute('data-theme') !== 'light' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    elements.textColorPicker.value = isDark ? '#e9edf5' : '#1f2933';
  }
}

// Workspace Settings Handlers
function handleWorkspaceBgColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('workspace-bg-color', color);
  applyWorkspaceStyles();
}

function resetWorkspaceBgColor() {
  localStorage.removeItem('workspace-bg-color');
  if (elements.workspaceBgColorPicker) {
    elements.workspaceBgColorPicker.value = '#f1f3f4';
  }
  applyWorkspaceStyles();
}

function handleWorkspaceFontFamilyChange(event) {
  const fontFamily = event.target.value;
  localStorage.setItem('workspace-font-family', fontFamily);
  applyWorkspaceStyles();
}

function resetWorkspaceFontFamily() {
  localStorage.removeItem('workspace-font-family');
  if (elements.workspaceFontFamilySelect) {
    elements.workspaceFontFamilySelect.value = 'system';
  }
  applyWorkspaceStyles();
}

function handleWorkspaceFontSizeChange(event) {
  const fontSize = event.target.value;
  localStorage.setItem('workspace-font-size', fontSize);
  if (elements.workspaceFontSizeValue) {
    elements.workspaceFontSizeValue.textContent = fontSize + 'px';
  }
  applyWorkspaceStyles();
}

function resetWorkspaceFontSize() {
  localStorage.removeItem('workspace-font-size');
  if (elements.workspaceFontSizeSlider && elements.workspaceFontSizeValue) {
    elements.workspaceFontSizeSlider.value = '13';
    elements.workspaceFontSizeValue.textContent = '13px';
  }
  applyWorkspaceStyles();
}

function handleWorkspaceTextColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('workspace-text-color', color);
  applyWorkspaceStyles();
}

function resetWorkspaceTextColor() {
  localStorage.removeItem('workspace-text-color');
  if (elements.workspaceTextColorPicker) {
    elements.workspaceTextColorPicker.value = '#374151';
  }
  applyWorkspaceStyles();
}

function handleWorkspaceFontStyleChange(event) {
  const fontStyle = event.target.value;
  localStorage.setItem('workspace-font-style', fontStyle);
  applyWorkspaceStyles();
}

// Editor Settings Handlers
function handleEditorBgColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('editor-bg-color', color);
  applyEditorStyles();
}

function resetEditorBgColor() {
  localStorage.removeItem('editor-bg-color');
  if (elements.editorBgColorPicker) {
    elements.editorBgColorPicker.value = '#ffffff';
  }
  applyEditorStyles();
}

function handleEditorFontFamilyChange(event) {
  const fontFamily = event.target.value;
  localStorage.setItem('editor-font-family', fontFamily);
  applyEditorStyles();
}

function resetEditorFontFamily() {
  localStorage.removeItem('editor-font-family');
  if (elements.editorFontFamilySelect) {
    elements.editorFontFamilySelect.value = 'system';
  }
  applyEditorStyles();
}

function handleEditorFontSizeChange(event) {
  const fontSize = event.target.value;
  localStorage.setItem('editor-font-size', fontSize);
  if (elements.editorFontSizeValue) {
    elements.editorFontSizeValue.textContent = fontSize + 'px';
  }
  applyEditorStyles();
}

function resetEditorFontSize() {
  localStorage.removeItem('editor-font-size');
  if (elements.editorFontSizeSlider && elements.editorFontSizeValue) {
    elements.editorFontSizeSlider.value = '14';
    elements.editorFontSizeValue.textContent = '14px';
  }
  applyEditorStyles();
}

function handleEditorTextColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('editor-text-color', color);
  applyEditorStyles();
}

function resetEditorTextColor() {
  localStorage.removeItem('editor-text-color');
  if (elements.editorTextColorPicker) {
    elements.editorTextColorPicker.value = '#1f2933';
  }
  applyEditorStyles();
}

function handleEditorFontStyleChange(event) {
  const fontStyle = event.target.value;
  localStorage.setItem('editor-font-style', fontStyle);
  applyEditorStyles();
}

// Preview Settings Handlers
function handlePreviewBgColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('preview-bg-color', color);
  applyPreviewStyles();
}

function resetPreviewBgColor() {
  localStorage.removeItem('preview-bg-color');
  if (elements.previewBgColorPicker) {
    elements.previewBgColorPicker.value = '#ffffff';
  }
  applyPreviewStyles();
}

function handlePreviewFontFamilyChange(event) {
  const fontFamily = event.target.value;
  localStorage.setItem('preview-font-family', fontFamily);
  applyPreviewStyles();
}

function resetPreviewFontFamily() {
  localStorage.removeItem('preview-font-family');
  if (elements.previewFontFamilySelect) {
    elements.previewFontFamilySelect.value = 'system';
  }
  applyPreviewStyles();
}

function handlePreviewFontSizeChange(event) {
  const fontSize = event.target.value;
  localStorage.setItem('preview-font-size', fontSize);
  if (elements.previewFontSizeValue) {
    elements.previewFontSizeValue.textContent = fontSize + 'px';
  }
  applyPreviewStyles();
}

function resetPreviewFontSize() {
  localStorage.removeItem('preview-font-size');
  if (elements.previewFontSizeSlider && elements.previewFontSizeValue) {
    elements.previewFontSizeSlider.value = '14';
    elements.previewFontSizeValue.textContent = '14px';
  }
  applyPreviewStyles();
}

function handlePreviewTextColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('preview-text-color', color);
  applyPreviewStyles();
}

function resetPreviewTextColor() {
  localStorage.removeItem('preview-text-color');
  if (elements.previewTextColorPicker) {
    elements.previewTextColorPicker.value = '#1f2933';
  }
  applyPreviewStyles();
}

function handlePreviewFontStyleChange(event) {
  const fontStyle = event.target.value;
  localStorage.setItem('preview-font-style', fontStyle);
  applyPreviewStyles();
}

// Status Bar Settings Handlers
function handleStatusBarBgColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('statusbar-bg-color', color);
  applyStatusBarStyles();
}

function resetStatusBarBgColor() {
  localStorage.removeItem('statusbar-bg-color');
  if (elements.statusbarBgColorPicker) {
    elements.statusbarBgColorPicker.value = '#f1f3f4';
  }
  applyStatusBarStyles();
}

function handleStatusBarFontFamilyChange(event) {
  const fontFamily = event.target.value;
  localStorage.setItem('statusbar-font-family', fontFamily);
  applyStatusBarStyles();
}

function resetStatusBarFontFamily() {
  localStorage.removeItem('statusbar-font-family');
  if (elements.statusbarFontFamilySelect) {
    elements.statusbarFontFamilySelect.value = 'system';
  }
  applyStatusBarStyles();
}

function handleStatusBarFontSizeChange(event) {
  const fontSize = event.target.value;
  localStorage.setItem('statusbar-font-size', fontSize);
  if (elements.statusbarFontSizeValue) {
    elements.statusbarFontSizeValue.textContent = fontSize + 'px';
  }
  applyStatusBarStyles();
}

function resetStatusBarFontSize() {
  localStorage.removeItem('statusbar-font-size');
  if (elements.statusbarFontSizeSlider && elements.statusbarFontSizeValue) {
    elements.statusbarFontSizeSlider.value = '12';
    elements.statusbarFontSizeValue.textContent = '12px';
  }
  applyStatusBarStyles();
}

function handleStatusBarTextColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('statusbar-text-color', color);
  applyStatusBarStyles();
}

function resetStatusBarTextColor() {
  localStorage.removeItem('statusbar-text-color');
  if (elements.statusbarTextColorPicker) {
    elements.statusbarTextColorPicker.value = '#374151';
  }
  applyStatusBarStyles();
}

function handleStatusBarFontStyleChange(event) {
  const fontStyle = event.target.value;
  localStorage.setItem('statusbar-font-style', fontStyle);
  applyStatusBarStyles();
}

// Title Bar Settings Handlers
function handleTitleBarBgColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('titlebar-bg-color', color);
  applyTitleBarStyles();
}

function resetTitleBarBgColor() {
  localStorage.removeItem('titlebar-bg-color');
  if (elements.titlebarBgColorPicker) {
    elements.titlebarBgColorPicker.value = '#ffffff';
  }
  applyTitleBarStyles();
}

function handleTitleBarFontFamilyChange(event) {
  const fontFamily = event.target.value;
  localStorage.setItem('titlebar-font-family', fontFamily);
  applyTitleBarStyles();
}

function resetTitleBarFontFamily() {
  localStorage.removeItem('titlebar-font-family');
  if (elements.titlebarFontFamilySelect) {
    elements.titlebarFontFamilySelect.value = 'system';
  }
  applyTitleBarStyles();
}

function handleTitleBarFontSizeChange(event) {
  const fontSize = event.target.value;
  localStorage.setItem('titlebar-font-size', fontSize);
  if (elements.titlebarFontSizeValue) {
    elements.titlebarFontSizeValue.textContent = fontSize + 'px';
  }
  applyTitleBarStyles();
}

function resetTitleBarFontSize() {
  localStorage.removeItem('titlebar-font-size');
  if (elements.titlebarFontSizeSlider && elements.titlebarFontSizeValue) {
    elements.titlebarFontSizeSlider.value = '14';
    elements.titlebarFontSizeValue.textContent = '14px';
  }
  applyTitleBarStyles();
}

function handleTitleBarTextColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('titlebar-text-color', color);
  applyTitleBarStyles();
}

function resetTitleBarTextColor() {
  localStorage.removeItem('titlebar-text-color');
  if (elements.titlebarTextColorPicker) {
    elements.titlebarTextColorPicker.value = '#1f2933';
  }
  applyTitleBarStyles();
}

function handleTitleBarFontStyleChange(event) {
  const fontStyle = event.target.value;
  localStorage.setItem('titlebar-font-style', fontStyle);
  applyTitleBarStyles();
}

function handleTitleBarShowPathChange(event) {
  const showPath = event.target.checked;
  localStorage.setItem('titlebar-show-path', showPath);
  updateTitleBarDisplay();
}

// Unified Component Settings Handlers
function handleComponentSelectionChange(event) {
  const selectedComponent = event.target.value;
  updateComponentSettings(selectedComponent);
}

function handleComponentGlobalToggle(event) {
  const component = elements.componentSelector?.value;
  if (!component) return;

  const setting = event.target.id.replace('component-use-global-', '');
  const useGlobal = event.target.checked;
  localStorage.setItem(`${component}-use-global-${setting}`, useGlobal);

  // Update control states immediately
  updateComponentControlStates(component);

  // Apply the appropriate styles based on component
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function handleComponentBgColorChange(event) {
  const component = elements.componentSelector?.value;
  if (!component) return;
  
  const color = event.target.value;
  localStorage.setItem(`${component}-bg-color`, color);
  
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function resetComponentBgColor() {
  const component = elements.componentSelector?.value;
  if (!component) return;
  
  localStorage.removeItem(`${component}-bg-color`);
  if (elements.componentBgColorPicker) {
    const defaultColor = component === 'workspace' ? '#f1f3f4' : '#ffffff';
    elements.componentBgColorPicker.value = defaultColor;
  }
  
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function handleComponentFontFamilyChange(event) {
  const component = elements.componentSelector?.value;
  if (!component) return;
  
  const fontFamily = event.target.value;
  localStorage.setItem(`${component}-font-family`, fontFamily);
  
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function resetComponentFontFamily() {
  const component = elements.componentSelector?.value;
  if (!component) return;
  
  localStorage.removeItem(`${component}-font-family`);
  if (elements.componentFontFamilySelect) {
    elements.componentFontFamilySelect.value = 'system';
  }
  
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function handleComponentFontSizeChange(event) {
  const component = elements.componentSelector?.value;
  if (!component) return;
  
  const fontSize = event.target.value;
  localStorage.setItem(`${component}-font-size`, fontSize);
  if (elements.componentFontSizeValue) {
    elements.componentFontSizeValue.textContent = fontSize + 'px';
  }
  
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function resetComponentFontSize() {
  const component = elements.componentSelector?.value;
  if (!component) return;
  
  localStorage.removeItem(`${component}-font-size`);
  if (elements.componentFontSizeSlider) {
    const defaultSize = component === 'statusbar' ? '12' : component === 'titlebar' ? '13' : '14';
    elements.componentFontSizeSlider.value = defaultSize;
  }
  if (elements.componentFontSizeValue) {
    const defaultSize = component === 'statusbar' ? '12' : component === 'titlebar' ? '13' : '14';
    elements.componentFontSizeValue.textContent = defaultSize + 'px';
  }
  
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function handleComponentTextColorChange(event) {
  const component = elements.componentSelector?.value;
  if (!component) return;
  
  const color = event.target.value;
  localStorage.setItem(`${component}-text-color`, color);
  
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function resetComponentTextColor() {
  const component = elements.componentSelector?.value;
  if (!component) return;
  
  localStorage.removeItem(`${component}-text-color`);
  if (elements.componentTextColorPicker) {
    const defaultColor = component === 'workspace' ? '#202124' : '#000000';
    elements.componentTextColorPicker.value = defaultColor;
  }
  
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function handleComponentFontStyleChange(event) {
  const component = elements.componentSelector?.value;
  if (!component) return;
  
  const fontStyle = event.target.value;
  localStorage.setItem(`${component}-font-style`, fontStyle);
  
  switch(component) {
    case 'workspace': applyWorkspaceStyles(); break;
    case 'editor': applyEditorStyles(); break;
    case 'preview': applyPreviewStyles(); break;
    case 'statusbar': applyStatusBarStyles(); break;
    case 'titlebar': applyTitleBarStyles(); break;
  }
}

function handleComponentShowPathChange(event) {
  const showPath = event.target.checked;
  localStorage.setItem('titlebar-show-path', showPath);
  updateTitleBarDisplay();
}

// Apply styles functions for each component
function applyWorkspaceStyles() {
  const useGlobalBg = localStorage.getItem('workspace-use-global-bg') !== 'false';
  const useGlobalFont = localStorage.getItem('workspace-use-global-font') !== 'false';
  const useGlobalSize = localStorage.getItem('workspace-use-global-size') !== 'false';
  const useGlobalColor = localStorage.getItem('workspace-use-global-color') !== 'false';
  const useGlobalStyle = localStorage.getItem('workspace-use-global-style') !== 'false';
  
  // Use global settings or component-specific settings
  const bgColor = useGlobalBg ? 
    getCurrentGlobalBackgroundColor() :
    localStorage.getItem('workspace-bg-color') || '#f1f3f4';
    
  const fontFamily = useGlobalFont ?
    localStorage.getItem('app-font-family') || 'system' :
    localStorage.getItem('workspace-font-family') || 'system';
    
  const fontSize = useGlobalSize ?
    localStorage.getItem('app-font-size') || '13' :
    localStorage.getItem('workspace-font-size') || '13';
    
  const textColor = useGlobalColor ?
    getCurrentGlobalTextColor() :
    localStorage.getItem('workspace-text-color') || '#374151';
    
  const fontStyle = useGlobalStyle ?
    'normal' : // Global doesn't have style setting
    localStorage.getItem('workspace-font-style') || 'normal';
  
  let fontStack = getFontStack(fontFamily);
  
  let workspaceStyle = document.getElementById('workspace-custom-styles');
  if (!workspaceStyle) {
    workspaceStyle = document.createElement('style');
    workspaceStyle.id = 'workspace-custom-styles';
    document.head.appendChild(workspaceStyle);
  }
  
  workspaceStyle.textContent = `
    .explorer,
    .hashtag-panel,
    .tree-node__name,
    .explorer__title,
    .explorer__path,
    .hashtag-detail__item {
      background-color: ${bgColor} !important;
      font-family: ${fontStack} !important;
      font-size: ${fontSize}px !important;
      color: ${textColor} !important;
      font-style: ${fontStyle} !important;
    }
  `;
}

function applyEditorStyles() {
  const useGlobalBg = localStorage.getItem('editor-use-global-bg') !== 'false';
  const useGlobalFont = localStorage.getItem('editor-use-global-font') !== 'false';
  const useGlobalSize = localStorage.getItem('editor-use-global-size') !== 'false';
  const useGlobalColor = localStorage.getItem('editor-use-global-color') !== 'false';
  const useGlobalStyle = localStorage.getItem('editor-use-global-style') !== 'false';
  
  const bgColor = useGlobalBg ?
    getCurrentGlobalBackgroundColor() :
    localStorage.getItem('editor-bg-color') || '#ffffff';
    
  const fontFamily = useGlobalFont ?
    localStorage.getItem('app-font-family') || 'system' :
    localStorage.getItem('editor-font-family') || 'system';
    
  const fontSize = useGlobalSize ?
    localStorage.getItem('app-font-size') || '14' :
    localStorage.getItem('editor-font-size') || '14';
    
  const textColor = useGlobalColor ?
    getCurrentGlobalTextColor() :
    localStorage.getItem('editor-text-color') || '#1f2933';
    
  const fontStyle = useGlobalStyle ?
    'normal' :
    localStorage.getItem('editor-font-style') || 'normal';
  
  let fontStack = getFontStack(fontFamily);
  
  let editorStyle = document.getElementById('editor-custom-styles');
  if (!editorStyle) {
    editorStyle = document.createElement('style');
    editorStyle.id = 'editor-custom-styles';
    document.head.appendChild(editorStyle);
  }
  
  editorStyle.textContent = `
    #note-editor,
    #note-editor-right,
    .editor-pane textarea,
    textarea[id^="note-editor-"] {
      background-color: ${bgColor} !important;
      font-family: ${fontStack} !important;
      font-size: ${fontSize}px !important;
      color: ${textColor} !important;
      font-style: ${fontStyle} !important;
    }
  `;
}

function applyPreviewStyles() {
  const useGlobalBg = localStorage.getItem('preview-use-global-bg') !== 'false';
  const useGlobalFont = localStorage.getItem('preview-use-global-font') !== 'false';
  const useGlobalSize = localStorage.getItem('preview-use-global-size') !== 'false';
  const useGlobalColor = localStorage.getItem('preview-use-global-color') !== 'false';
  const useGlobalStyle = localStorage.getItem('preview-use-global-style') !== 'false';
  
  const bgColor = useGlobalBg ?
    getCurrentGlobalBackgroundColor() :
    localStorage.getItem('preview-bg-color') || '#ffffff';
    
  const fontFamily = useGlobalFont ?
    localStorage.getItem('app-font-family') || 'system' :
    localStorage.getItem('preview-font-family') || 'system';
    
  const fontSize = useGlobalSize ?
    localStorage.getItem('app-font-size') || '14' :
    localStorage.getItem('preview-font-size') || '14';
    
  const textColor = useGlobalColor ?
    getCurrentGlobalTextColor() :
    localStorage.getItem('preview-text-color') || '#1f2933';
    
  const fontStyle = useGlobalStyle ?
    'normal' :
    localStorage.getItem('preview-font-style') || 'normal';
  
  let fontStack = getFontStack(fontFamily);
  
  let previewStyle = document.getElementById('preview-custom-styles');
  if (!previewStyle) {
    previewStyle = document.createElement('style');
    previewStyle.id = 'preview-custom-styles';
    document.head.appendChild(previewStyle);
  }
  
  previewStyle.textContent = `
    #markdown-preview,
    #markdown-preview p,
    #markdown-preview li,
    #markdown-preview td,
    #markdown-preview th,
    #markdown-preview h1,
    #markdown-preview h2,
    #markdown-preview h3,
    #markdown-preview h4,
    #markdown-preview h5,
    #markdown-preview h6 {
      background-color: ${bgColor} !important;
      font-family: ${fontStack} !important;
      font-size: ${fontSize}px !important;
      color: ${textColor} !important;
      font-style: ${fontStyle} !important;
    }
  `;
}

function applyStatusBarStyles() {
  const useGlobalBg = localStorage.getItem('statusbar-use-global-bg') !== 'false';
  const useGlobalFont = localStorage.getItem('statusbar-use-global-font') !== 'false';
  const useGlobalSize = localStorage.getItem('statusbar-use-global-size') !== 'false';
  const useGlobalColor = localStorage.getItem('statusbar-use-global-color') !== 'false';
  const useGlobalStyle = localStorage.getItem('statusbar-use-global-style') !== 'false';
  
  const bgColor = useGlobalBg ?
    getCurrentGlobalBackgroundColor() :
    localStorage.getItem('statusbar-bg-color') || '#f1f3f4';
    
  const fontFamily = useGlobalFont ?
    localStorage.getItem('app-font-family') || 'system' :
    localStorage.getItem('statusbar-font-family') || 'system';
    
  const fontSize = useGlobalSize ?
    localStorage.getItem('app-font-size') || '12' :
    localStorage.getItem('statusbar-font-size') || '12';
    
  const textColor = useGlobalColor ?
    getCurrentGlobalTextColor() :
    localStorage.getItem('statusbar-text-color') || '#374151';
    
  const fontStyle = useGlobalStyle ?
    'normal' :
    localStorage.getItem('statusbar-font-style') || 'normal';
  
  let fontStack = getFontStack(fontFamily);
  
  let statusBarStyle = document.getElementById('statusbar-custom-styles');
  if (!statusBarStyle) {
    statusBarStyle = document.createElement('style');
    statusBarStyle.id = 'statusbar-custom-styles';
    document.head.appendChild(statusBarStyle);
  }
  
  statusBarStyle.textContent = `
    .status-bar,
    .status-bar #status-text,
    .status-bar__settings {
      background-color: ${bgColor} !important;
      font-family: ${fontStack} !important;
      font-size: ${fontSize}px !important;
      color: ${textColor} !important;
      font-style: ${fontStyle} !important;
    }
  `;
}

function applyTitleBarStyles() {
  const useGlobalBg = localStorage.getItem('titlebar-use-global-bg') !== 'false';
  const useGlobalFont = localStorage.getItem('titlebar-use-global-font') !== 'false';
  const useGlobalSize = localStorage.getItem('titlebar-use-global-size') !== 'false';
  const useGlobalColor = localStorage.getItem('titlebar-use-global-color') !== 'false';
  const useGlobalStyle = localStorage.getItem('titlebar-use-global-style') !== 'false';
  
  const bgColor = useGlobalBg ?
    getCurrentGlobalBackgroundColor() :
    localStorage.getItem('titlebar-bg-color') || '#ffffff';
    
  const fontFamily = useGlobalFont ?
    localStorage.getItem('app-font-family') || 'system' :
    localStorage.getItem('titlebar-font-family') || 'system';
    
  const fontSize = useGlobalSize ?
    localStorage.getItem('app-font-size') || '14' :
    localStorage.getItem('titlebar-font-size') || '14';
    
  const textColor = useGlobalColor ?
    getCurrentGlobalTextColor() :
    localStorage.getItem('titlebar-text-color') || '#1f2933';
    
  const fontStyle = useGlobalStyle ?
    'normal' :
    localStorage.getItem('titlebar-font-style') || 'normal';
  
  let fontStack = getFontStack(fontFamily);
  
  let titleBarStyle = document.getElementById('titlebar-custom-styles');
  if (!titleBarStyle) {
    titleBarStyle = document.createElement('style');
    titleBarStyle.id = 'titlebar-custom-styles';
    document.head.appendChild(titleBarStyle);
  }
  
  titleBarStyle.textContent = `
    .title-bar,
    .title-bar__title {
      background-color: ${bgColor} !important;
      font-family: ${fontStack} !important;
      font-size: ${fontSize}px !important;
      color: ${textColor} !important;
      font-style: ${fontStyle} !important;
    }
  `;
}

function updateTitleBarDisplay() {
  const showPath = localStorage.getItem('titlebar-show-path') !== 'false';
  const titleElement = document.querySelector('.title-bar__title');
  
  const activeNote = getActiveNote();
  if (titleElement && activeNote?.path) {
    if (showPath) {
      // Show full path
      titleElement.textContent = activeNote.path;
    } else {
      // Show only filename
      const fileName = activeNote.path.split(/[\\/]/).pop() || 'Untitled';
      titleElement.textContent = fileName;
    }
  } else if (titleElement) {
    titleElement.textContent = 'NTA';
  }
}

// Helper functions to get current global colors from CSS custom properties
function getCurrentGlobalBackgroundColor() {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  // Try to get the current --bg value, fallback to stored value, then default
  let bgColor = computedStyle.getPropertyValue('--bg').trim();
  
  if (!bgColor) {
    // Fallback to stored value
    bgColor = localStorage.getItem('app-bg-color');
  }
  
  if (!bgColor) {
    // Final fallback based on theme
    const isDark = document.body.getAttribute('data-theme') === 'dark' || 
      (document.body.getAttribute('data-theme') !== 'light' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    bgColor = isDark ? '#0f1117' : '#f7f8fa';
  }
  
  return bgColor;
}

function getCurrentGlobalTextColor() {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  // Try to get the current --fg value, fallback to stored value, then default
  let textColor = computedStyle.getPropertyValue('--fg').trim();
  
  if (!textColor) {
    // Fallback to stored value
    textColor = localStorage.getItem('app-text-color');
  }
  
  if (!textColor) {
    // Final fallback based on theme
    const isDark = document.body.getAttribute('data-theme') === 'dark' || 
      (document.body.getAttribute('data-theme') !== 'light' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    textColor = isDark ? '#e9edf5' : '#1f2933';
  }
  
  return textColor;
}

function getFontStack(fontFamily) {
  switch (fontFamily) {
    case 'system':
      if (window.currentPlatform === 'win32') {
        return '"Segoe UI", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      } else if (window.currentPlatform === 'linux') {
        return '"Ubuntu", "Liberation Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      } else {
        return '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      }
    case 'Inter':
      return '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case 'JetBrains Mono':
    case 'Fira Code':
    case 'Monaco':
      if (window.currentPlatform === 'win32') {
        return `"${fontFamily}", "Consolas", "Courier New", monospace`;
      } else {
        return `"${fontFamily}", "SF Mono", Monaco, monospace`;
      }
    default:
      return `"${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  }
}

// Border color handlers
function handleBorderColorChange(event) {
  const color = event.target.value;
  localStorage.setItem('app-border-color', color);
  applyBorderColor(color);
}

function applyBorderColor(color) {
  const root = document.documentElement;
  
  // Convert hex to RGB for alpha variations
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const normalBorder = `rgba(${r}, ${g}, ${b}, 0.3)`;
  const strongBorder = `rgba(${r}, ${g}, ${b}, 0.6)`;
  
  root.style.setProperty('--border', normalBorder);
  root.style.setProperty('--border-strong', strongBorder);
}

function resetBorderColor() {
  localStorage.removeItem('app-border-color');
  const root = document.documentElement;
  root.style.removeProperty('--border');
  root.style.removeProperty('--border-strong');
  
  if (elements.borderColorPicker) {
    elements.borderColorPicker.value = '#e2e8f0';
  }
}

// Border thickness handlers
function handleBorderThicknessChange(event) {
  const thickness = event.target.value;
  localStorage.setItem('app-border-thickness', thickness);
  if (elements.borderThicknessValue) {
    elements.borderThicknessValue.textContent = thickness + 'px';
  }
  applyBorderThickness(thickness);
}

function applyBorderThickness(thickness) {
  const root = document.documentElement;
  root.style.setProperty('--border-width', thickness + 'px');
  
  // Apply to common border elements
  const style = document.createElement('style');
  style.id = 'custom-border-thickness';
  
  // Remove existing custom border style
  const existing = document.getElementById('custom-border-thickness');
  if (existing) existing.remove();
  
  style.textContent = `
    .sidebar, .workspace__content, .status-bar, .settings-modal__content {
      border-width: ${thickness}px !important;
    }
    .sidebar-resize-handle {
      width: ${Math.max(1, thickness)}px !important;
    }
  `;
  
  document.head.appendChild(style);
}

function resetBorderThickness() {
  localStorage.removeItem('app-border-thickness');
  const root = document.documentElement;
  root.style.removeProperty('--border-width');
  
  // Remove custom border style
  const existing = document.getElementById('custom-border-thickness');
  if (existing) existing.remove();
  
  if (elements.borderThicknessSlider && elements.borderThicknessValue) {
    elements.borderThicknessSlider.value = '1';
    elements.borderThicknessValue.textContent = '1px';
  }
}

async function checkForUpdatesManually() {
  console.log('checkForUpdatesManually: Function called!');
  console.log('checkForUpdatesManually: elements.checkUpdatesButton exists:', !!elements.checkUpdatesButton);
  if (elements.checkUpdatesButton) {
    const originalText = elements.checkUpdatesButton.textContent;
    elements.checkUpdatesButton.disabled = true;
    elements.checkUpdatesButton.textContent = 'Checking...';
    
    try {
        // Show immediate feedback below the main update message
        try {
          if (updateSubMessage) updateSubMessage.textContent = 'Checking for updates...';
          if (inlineCheckSubmessage) inlineCheckSubmessage.textContent = 'Checking for updates...';
          updateNotification.hidden = false;
          positionUpdateNotificationBelowCheckBtn();
        } catch (e) {}
      // Check if running in development mode
      let version = 'Unknown';
      if (window.api && typeof window.api.getVersion === 'function') {
        version = await window.api.getVersion();
        console.log('checkForUpdatesManually: Got version via api.getVersion:', version);
      } else if (window.api && typeof window.api.invoke === 'function') {
        version = await window.api.invoke('app:getVersion');
        console.log('checkForUpdatesManually: Got version via api.invoke:', version);
      }
      if (String(version).includes('dev')) {
        console.log('checkForUpdatesManually: Detected dev mode, skipping');
        elements.checkUpdatesButton.textContent = 'Dev Mode - N/A';
        setTimeout(() => {
          elements.checkUpdatesButton.disabled = false;
          elements.checkUpdatesButton.textContent = originalText;
        }, 2000);
        return;
      }
      
      console.log('checkForUpdatesManually: Calling update check API');
      let checkResult = null;
      if (window.api && typeof window.api.checkForUpdates === 'function') {
        console.log('checkForUpdatesManually: Using window.api.checkForUpdates()');
        try {
          checkResult = await window.api.checkForUpdates();
          console.log('checkForUpdatesManually: window.api.checkForUpdates() completed successfully', checkResult);
        } catch (e) {
          console.log('checkForUpdatesManually: window.api.checkForUpdates() returned error', e && e.message);
        }
      } else if (window.api && typeof window.api.invoke === 'function') {
        console.log('checkForUpdatesManually: Using window.api.invoke("app:checkForUpdates")');
        try {
          checkResult = await window.api.invoke('app:checkForUpdates');
          console.log('checkForUpdatesManually: window.api.invoke() completed successfully', checkResult);
        } catch (e) {
          console.log('checkForUpdatesManually: window.api.invoke() returned error', e && e.message);
        }
      }

      // Reflect result in the submessage so user sees immediate feedback even if events don't arrive
      try {
        if (checkResult && checkResult.status === 'update-available') {
          if (updateSubMessage) updateSubMessage.textContent = 'New update available';
          if (inlineCheckSubmessage) inlineCheckSubmessage.textContent = 'New update available';
        } else if (checkResult && checkResult.status === 'update-not-available') {
          if (updateSubMessage) updateSubMessage.textContent = 'You are running the newest version';
          if (inlineCheckSubmessage) inlineCheckSubmessage.textContent = 'You are running the newest version';
        } else {
          // If no structured result returned, keep the existing updateNotification state
          if (updateSubMessage && !updateSubMessage.textContent) updateSubMessage.textContent = '';
          if (inlineCheckSubmessage && !inlineCheckSubmessage.textContent) inlineCheckSubmessage.textContent = '';
        }
      } catch (e) {}

      // Debug: log notification and submessage visibility/state
      try {
        console.log('checkForUpdatesManually: updateNotification.hidden=', !!updateNotification.hidden, 'updateSubMessage=', updateSubMessage ? updateSubMessage.textContent : null);
      } catch (e) {}

      console.log('checkForUpdatesManually: Update check completed, setting button to "Check Complete"');
      elements.checkUpdatesButton.textContent = 'Check Complete';
      setTimeout(() => {
        elements.checkUpdatesButton.disabled = false;
        elements.checkUpdatesButton.textContent = originalText;
      }, 2000);
    } catch (error) {
      console.error('checkForUpdatesManually: Caught error:', error);
      console.error('checkForUpdatesManually: Error message:', error.message);
      console.error('checkForUpdatesManually: Error stack:', error.stack);
      
      // Check if it's a development mode error
      if (error.message && error.message.includes('not packed')) {
        console.log('checkForUpdatesManually: Detected "not packed" error, setting to "Dev Mode Only"');
        elements.checkUpdatesButton.textContent = 'Dev Mode Only';
      } else {
        console.log('checkForUpdatesManually: Setting button to "Check Failed"');
        elements.checkUpdatesButton.textContent = 'Check Failed';
      }
      
      setTimeout(() => {
        elements.checkUpdatesButton.disabled = false;
        elements.checkUpdatesButton.textContent = originalText;
      }, 2000);
    }
  } else {
    console.warn('checkForUpdatesManually: checkUpdatesButton element not found');
  }
}

// Handle ESC key to close settings modal
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && elements.settingsModal?.classList.contains('visible')) {
    closeSettingsModal();
  }
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const savedTheme = localStorage.getItem('app-theme') || 'system';
  if (savedTheme === 'system') {
    updateColorPickerForCurrentTheme();
  }
});

function updateColorPickerForCurrentTheme() {
  if (!elements.bgColorPicker) return;
  
  const savedBgColor = localStorage.getItem('app-bg-color');
  if (!savedBgColor) {
    const isDark = document.body.getAttribute('data-theme') === 'dark' || 
      (document.body.getAttribute('data-theme') !== 'light' && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    elements.bgColorPicker.value = isDark ? '#0f1117' : '#f7f8fa';
  }
}

// Platform detection for platform-specific styling
function detectPlatform() {
  // Get platform info from user agent as a fallback
  let platform = 'unknown';
  
  if (navigator.userAgent.includes('Windows')) {
    platform = 'win32';
  } else if (navigator.userAgent.includes('Mac')) {
    platform = 'darwin';
  } else if (navigator.userAgent.includes('Linux')) {
    platform = 'linux';
  }
  
  // Add platform class to body
  document.body.classList.add(`platform-${platform}`);
  
  // Store platform info for later use
  window.currentPlatform = platform;
}

// Export/Import Settings Functions
function handleExportSettings() {
  const format = elements.exportFormatSelect?.value || 'json';
  const settings = getAllSettings();
  
  let exportText = '';
  
  switch (format) {
    case 'json':
      exportText = JSON.stringify(settings, null, 2);
      break;
    case 'yaml':
      exportText = convertToYAML(settings);
      break;
    case 'txt':
      exportText = convertToText(settings);
      break;
    default:
      exportText = JSON.stringify(settings, null, 2);
  }
  
  if (elements.exportPreviewText) {
    elements.exportPreviewText.value = exportText;
    elements.copySettingsBtn.disabled = false;
    elements.downloadSettingsBtn.disabled = false;
  }
}

function getAllSettings() {
  const settings = {};
  
  // Get all localStorage items that are app settings
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('app-') || key.startsWith('workspace-') || 
        key.startsWith('editor-') || key.startsWith('preview-') ||
        key.includes('trafficLight') || key.includes('statusBar') ||
        key.includes('use-global')) {
      settings[key] = localStorage.getItem(key);
    }
  }
  
  // Also get current computed styles that might not be in localStorage
  const computedBg = getCurrentGlobalBackgroundColor();
  const computedText = getCurrentGlobalTextColor();
  
  // Add computed values if they differ from stored values
  if (computedBg && computedBg !== settings['app-bg-color']) {
    settings['computed-bg-color'] = computedBg;
  }
  
  if (computedText && computedText !== settings['app-text-color']) {
    settings['computed-text-color'] = computedText;
  }
  
  // Add current theme information
  const currentTheme = document.body.getAttribute('data-theme') || 'system';
  settings['current-theme'] = currentTheme;
  
  // Add font family options that are currently applied
  const currentFontFamily = localStorage.getItem('app-font-family') || 'system';
  settings['app-font-family'] = currentFontFamily;
  
  // Ensure all component settings are captured
  const componentSettings = [
    'workspace-bg-color', 'workspace-font-family', 'workspace-font-size', 
    'workspace-text-color', 'workspace-font-style',
    'editor-bg-color', 'editor-font-family', 'editor-font-size', 
    'editor-text-color', 'editor-font-style',
    'preview-bg-color', 'preview-font-family', 'preview-font-size', 
    'preview-text-color', 'preview-font-style',
    'workspace-use-global-bg', 'workspace-use-global-font', 'workspace-use-global-size',
    'workspace-use-global-color', 'workspace-use-global-style',
    'editor-use-global-bg', 'editor-use-global-font', 'editor-use-global-size',
    'editor-use-global-color', 'editor-use-global-style',
    'preview-use-global-bg', 'preview-use-global-font', 'preview-use-global-size',
    'preview-use-global-color', 'preview-use-global-style'
  ];
  
  componentSettings.forEach(key => {
    if (!settings[key]) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        settings[key] = value;
      } else {
        // Set default values for missing settings
        if (key.includes('use-global')) {
          settings[key] = 'true'; // Default to using global settings
        } else if (key.includes('font-family')) {
          settings[key] = 'system';
        } else if (key.includes('font-style')) {
          settings[key] = 'normal';
        } else if (key.includes('font-size')) {
          if (key.includes('workspace')) settings[key] = '13';
          else settings[key] = '14';
        } else if (key.includes('bg-color')) {
          if (key.includes('workspace')) settings[key] = '#f1f3f4';
          else settings[key] = '#ffffff';
        } else if (key.includes('text-color')) {
          if (key.includes('workspace')) settings[key] = '#374151';
          else settings[key] = '#1f2933';
        }
      }
    }
  });
  
  // Add export metadata
  settings['export-timestamp'] = new Date().toISOString();
  settings['export-version'] = '1.0';
  settings['app-name'] = 'NTA';
  
  return settings;
}

function convertToYAML(obj) {
  let yaml = '# NTA Settings Export\n';
  yaml += `# Exported on: ${new Date().toLocaleString()}\n\n`;
  
  // Group settings by category for better organization
  const categories = {
    global_settings: {},
    workspace_settings: {},
    editor_settings: {},
    preview_settings: {},
    traffic_light_settings: {},
    status_bar_settings: {},
    other_settings: {}
  };
  
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('app-') || key === 'current-theme' || key.includes('computed-')) {
      categories.global_settings[key] = value;
    } else if (key.startsWith('workspace-')) {
      categories.workspace_settings[key] = value;
    } else if (key.startsWith('editor-')) {
      categories.editor_settings[key] = value;
    } else if (key.startsWith('preview-')) {
      categories.preview_settings[key] = value;
    } else if (key.includes('trafficLight')) {
      categories.traffic_light_settings[key] = value;
    } else if (key.includes('statusBar')) {
      categories.status_bar_settings[key] = value;
    } else {
      categories.other_settings[key] = value;
    }
  }
  
  // Convert each category to YAML
  for (const [categoryName, categoryData] of Object.entries(categories)) {
    if (Object.keys(categoryData).length > 0) {
      yaml += `${categoryName}:\n`;
      for (const [key, value] of Object.entries(categoryData)) {
        yaml += `  ${key}: ${JSON.stringify(value)}\n`;
      }
      yaml += '\n';
    }
  }
  
  return yaml;
}

function convertToText(obj) {
  let text = 'NTA Settings Export\n';
  text += '================================\n';
  text += `Exported on: ${new Date().toLocaleString()}\n\n`;
  
  // Group settings by category
  const categories = {
    'Global Settings': [],
    'Workspace Settings': [],
    'Editor Settings': [],
    'Preview Settings': [],
    'Traffic Light Settings': [],
    'Status Bar Settings': [],
    'Other Settings': []
  };
  
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('app-') || key === 'current-theme' || key.includes('computed-')) {
      categories['Global Settings'].push(`${key}: ${value}`);
    } else if (key.startsWith('workspace-')) {
      categories['Workspace Settings'].push(`${key}: ${value}`);
    } else if (key.startsWith('editor-')) {
      categories['Editor Settings'].push(`${key}: ${value}`);
    } else if (key.startsWith('preview-')) {
      categories['Preview Settings'].push(`${key}: ${value}`);
    } else if (key.includes('trafficLight')) {
      categories['Traffic Light Settings'].push(`${key}: ${value}`);
    } else if (key.includes('statusBar')) {
      categories['Status Bar Settings'].push(`${key}: ${value}`);
    } else {
      categories['Other Settings'].push(`${key}: ${value}`);
    }
  }
  
  // Add each category to the text
  for (const [category, items] of Object.entries(categories)) {
    if (items.length > 0) {
      text += `${category}:\n`;
      text += '-'.repeat(category.length + 1) + '\n';
      items.forEach(item => {
        text += `  ${item}\n`;
      });
      text += '\n';
    }
  }
  
  return text;
}

function handleImportSettings(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      let settings = {};
      
      if (file.name.endsWith('.json')) {
        settings = JSON.parse(content);
      } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        settings = parseYAML(content);
      } else if (file.name.endsWith('.txt')) {
        settings = parseText(content);
      } else {
        throw new Error('Unsupported file format');
      }
      
      // Apply imported settings
      applyImportedSettings(settings);
      
      if (elements.importStatus) {
        elements.importStatus.textContent = 'Settings imported successfully!';
        elements.importStatus.className = 'import-status success';
        setTimeout(() => {
          elements.importStatus.textContent = '';
          elements.importStatus.className = 'import-status';
        }, 3000);
      }
      
    } catch (error) {
      if (elements.importStatus) {
        elements.importStatus.textContent = 'Import failed: ' + error.message;
        elements.importStatus.className = 'import-status error';
        setTimeout(() => {
          elements.importStatus.textContent = '';
          elements.importStatus.className = 'import-status';
        }, 5000);
      }
    }
  };
  
  reader.readAsText(file);
  event.target.value = ''; // Reset file input
}

function parseYAML(content) {
  const settings = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.includes(':')) {
      const [key, ...valueParts] = trimmed.split(':');
      let value = valueParts.join(':').trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      settings[key.trim()] = value;
    }
  }
  
  return settings;
}

function parseText(content) {
  const settings = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.includes(':') && !trimmed.startsWith('=')) {
      const [key, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();
      
      if (key.trim().startsWith('app-') || key.trim().startsWith('workspace-') ||
          key.trim().startsWith('editor-') || key.trim().startsWith('preview-') ||
          key.trim().includes('trafficLight') || key.trim().includes('statusBar')) {
        settings[key.trim()] = value;
      }
    }
  }
  
  return settings;
}

function applyImportedSettings(settings) {
  // Apply each setting to localStorage and update UI
  for (const [key, value] of Object.entries(settings)) {
    // Skip metadata and computed values
    if (key.startsWith('export-') || key.startsWith('computed-') || key === 'app-name') {
      continue;
    }
    
    localStorage.setItem(key, value);
  }
  
  // Reload all settings to update UI elements
  loadThemeSettings();
  loadComponentSettings();
  loadTrafficLightSettings();
  
  // Apply theme if it was imported
  if (settings['current-theme']) {
    applyTheme(settings['current-theme']);
  }
  
  // Force refresh of all styles to ensure everything is applied
  setTimeout(() => {
    applyWorkspaceStyles();
    applyEditorStyles();
    applyPreviewStyles();
    
    // Update UI elements with imported values
    updateUIFromImportedSettings(settings);
  }, 100);
}

function updateUIFromImportedSettings(settings) {
  // Update main appearance settings
  if (settings['app-theme'] && elements.themeSelect) {
    elements.themeSelect.value = settings['app-theme'];
  }
  
  if (settings['app-bg-color'] && elements.bgColorPicker) {
    elements.bgColorPicker.value = settings['app-bg-color'];
    updateBackgroundColor(settings['app-bg-color']);
  }
  
  if (settings['app-font-family'] && elements.fontFamilySelect) {
    elements.fontFamilySelect.value = settings['app-font-family'];
  }
  
  if (settings['app-font-size']) {
    if (elements.fontSizeSlider) elements.fontSizeSlider.value = settings['app-font-size'];
    if (elements.fontSizeValue) elements.fontSizeValue.textContent = settings['app-font-size'] + 'px';
  }
  
  if (settings['app-text-color'] && elements.textColorPicker) {
    elements.textColorPicker.value = settings['app-text-color'];
    applyTextColor(settings['app-text-color']);
  }
  
  // Update component checkboxes
  const checkboxMappings = [
    'workspace-use-global-bg', 'workspace-use-global-font', 'workspace-use-global-size',
    'workspace-use-global-color', 'workspace-use-global-style',
    'editor-use-global-bg', 'editor-use-global-font', 'editor-use-global-size', 
    'editor-use-global-color', 'editor-use-global-style',
    'preview-use-global-bg', 'preview-use-global-font', 'preview-use-global-size',
    'preview-use-global-color', 'preview-use-global-style'
  ];
  
  checkboxMappings.forEach(key => {
    const element = document.getElementById(key.replace('use-global', 'use-global'));
    if (element && settings[key] !== undefined) {
      element.checked = settings[key] === 'true' || settings[key] === true;
      
      // Trigger the toggle to update controls
      const event = new Event('change');
      element.dispatchEvent(event);
    }
  });
}

function handleCopySettings() {
  const text = elements.exportPreviewText?.value;
  if (!text) return;
  
  navigator.clipboard.writeText(text).then(() => {
    // Show feedback
    const btn = elements.copySettingsBtn;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  }).catch(err => {
  });
}

function handleDownloadSettings() {
  const text = elements.exportPreviewText?.value;
  const format = elements.exportFormatSelect?.value || 'json';
  
  if (!text) return;
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `nta-settings.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Component Global Toggle Functions
function handleWorkspaceGlobalToggle(event) {
  const setting = event.target.id.replace('workspace-use-global-', '');
  const isChecked = event.target.checked;
  
  localStorage.setItem(`workspace-use-global-${setting}`, isChecked);
  
  // Enable/disable corresponding controls
  const controls = getWorkspaceControls(setting);
  controls.forEach(control => {
    if (control) {
      control.disabled = isChecked;
    }
  });
  
  applyWorkspaceStyles();
}

function handleEditorGlobalToggle(event) {
  const setting = event.target.id.replace('editor-use-global-', '');
  const isChecked = event.target.checked;
  
  localStorage.setItem(`editor-use-global-${setting}`, isChecked);
  
  // Enable/disable corresponding controls
  const controls = getEditorControls(setting);
  controls.forEach(control => {
    if (control) {
      control.disabled = isChecked;
    }
  });
  
  applyEditorStyles();
}

function handlePreviewGlobalToggle(event) {
  const setting = event.target.id.replace('preview-use-global-', '');
  const isChecked = event.target.checked;
  
  localStorage.setItem(`preview-use-global-${setting}`, isChecked);
  
  // Enable/disable corresponding controls
  const controls = getPreviewControls(setting);
  controls.forEach(control => {
    if (control) {
      control.disabled = isChecked;
    }
  });
  
  applyPreviewStyles();
}

function getWorkspaceControls(setting) {
  switch (setting) {
    case 'bg':
      return [elements.workspaceBgColorPicker, elements.resetWorkspaceBgColorButton];
    case 'font':
      return [elements.workspaceFontFamilySelect, elements.resetWorkspaceFontFamilyButton];
    case 'size':
      return [elements.workspaceFontSizeSlider, elements.resetWorkspaceFontSizeButton];
    case 'color':
      return [elements.workspaceTextColorPicker, elements.resetWorkspaceTextColorButton];
    case 'style':
      return [elements.workspaceFontStyleSelect];
    default:
      return [];
  }
}

function getEditorControls(setting) {
  switch (setting) {
    case 'bg':
      return [elements.editorBgColorPicker, elements.resetEditorBgColorButton];
    case 'font':
      return [elements.editorFontFamilySelect, elements.resetEditorFontFamilyButton];
    case 'size':
      return [elements.editorFontSizeSlider, elements.resetEditorFontSizeButton];
    case 'color':
      return [elements.editorTextColorPicker, elements.resetEditorTextColorButton];
    case 'style':
      return [elements.editorFontStyleSelect];
    default:
      return [];
  }
}

function getPreviewControls(setting) {
  switch (setting) {
    case 'bg':
      return [elements.previewBgColorPicker, elements.resetPreviewBgColorButton];
    case 'font':
      return [elements.previewFontFamilySelect, elements.resetPreviewFontFamilyButton];
    case 'size':
      return [elements.previewFontSizeSlider, elements.resetPreviewFontSizeButton];
    case 'color':
      return [elements.previewTextColorPicker, elements.resetPreviewTextColorButton];
    case 'style':
      return [elements.previewFontStyleSelect];
    default:
      return [];
  }
}

function handleStatusBarGlobalToggle(event) {
  const setting = event.target.id.replace('statusbar-use-global-', '');
  const isChecked = event.target.checked;
  
  localStorage.setItem(`statusbar-use-global-${setting}`, isChecked);
  
  // Enable/disable corresponding controls
  const controls = getStatusBarControls(setting);
  controls.forEach(control => {
    if (control) {
      control.disabled = isChecked;
    }
  });
  
  applyStatusBarStyles();
}

function handleTitleBarGlobalToggle(event) {
  const setting = event.target.id.replace('titlebar-use-global-', '');
  const isChecked = event.target.checked;
  
  localStorage.setItem(`titlebar-use-global-${setting}`, isChecked);
  
  // Enable/disable corresponding controls
  const controls = getTitleBarControls(setting);
  controls.forEach(control => {
    if (control) {
      control.disabled = isChecked;
    }
  });
  
  applyTitleBarStyles();
}

function getStatusBarControls(setting) {
  switch (setting) {
    case 'bg':
      return [elements.statusbarBgColorPicker, elements.resetStatusbarBgColorButton];
    case 'font':
      return [elements.statusbarFontFamilySelect, elements.resetStatusbarFontFamilyButton];
    case 'size':
      return [elements.statusbarFontSizeSlider, elements.resetStatusbarFontSizeButton];
    case 'color':
      return [elements.statusbarTextColorPicker, elements.resetStatusbarTextColorButton];
    case 'style':
      return [elements.statusbarFontStyleSelect];
    default:
      return [];
  }
}

function getTitleBarControls(setting) {
  switch (setting) {
    case 'bg':
      return [elements.titlebarBgColorPicker, elements.resetTitlebarBgColorButton];
    case 'font':
      return [elements.titlebarFontFamilySelect, elements.resetTitlebarFontFamilyButton];
    case 'size':
      return [elements.titlebarFontSizeSlider, elements.resetTitlebarFontSizeButton];
    case 'color':
      return [elements.titlebarTextColorPicker, elements.resetTitlebarTextColorButton];
    case 'style':
      return [elements.titlebarFontStyleSelect];
    default:
      return [];
  }
}

const addImageHoverPreviews = () => {
  if (!elements.preview || !elements.mathPreviewPopup || !elements.mathPreviewPopupContent) {
    return;
  }

  // Remove existing hover listeners
  const existingImages = elements.preview.querySelectorAll('img[data-hover-preview]');
  existingImages.forEach(img => {
    img.removeEventListener('mouseenter', img._hoverEnter);
    img.removeEventListener('mouseleave', img._hoverLeave);
  });

  // Add hover listeners to all images
  const images = elements.preview.querySelectorAll('img[data-raw-src]');
  images.forEach(img => {
    if (img.hasAttribute('data-hover-preview')) {
      return; // Already processed
    }

    img.setAttribute('data-hover-preview', 'true');

      const showPreview = (event) => {
      const src = img.src || img.getAttribute('data-raw-src');
      if (!src) return;

      try {
        elements.mathPreviewPopupContent.textContent = '';
        const previewImg = document.createElement('img');
        previewImg.src = src;
        previewImg.alt = 'Preview';
        previewImg.style.maxWidth = '300px';
        previewImg.style.maxHeight = '300px';
        previewImg.style.objectFit = 'contain';
        previewImg.style.borderRadius = '4px';
        previewImg.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        previewImg.addEventListener('load', () => { previewImg.style.display = 'block'; });
        previewImg.addEventListener('error', () => { try { elements.mathPreviewPopupContent.textContent = 'Image not found'; } catch (e) { /* swallow */ } });
        elements.mathPreviewPopupContent.appendChild(previewImg);
      } catch (e) {
        try { elements.mathPreviewPopupContent.textContent = src; } catch (e2) { /* swallow */ }
      }

      // Position the popup near the cursor
      const popupX = event.clientX + 10;
      const popupY = event.clientY + 10;

      elements.mathPreviewPopup.style.left = `${popupX}px`;
      elements.mathPreviewPopup.style.top = `${popupY}px`;

      // Show the popup
      elements.mathPreviewPopup.classList.add('visible');
      elements.mathPreviewPopup.hidden = false;
    };

    const hidePreview = () => {
      elements.mathPreviewPopup.classList.remove('visible');
      elements.mathPreviewPopup.hidden = true;
    };

    img._hoverEnter = showPreview;
    img._hoverLeave = hidePreview;

    img.addEventListener('mouseenter', showPreview);
    img.addEventListener('mouseleave', hidePreview);
  });
};

// Export initialize() for programmatic use (tests / embedding) and only
// auto-run initialization when loaded in a browser-like environment (no
// CommonJS exports). This avoids side-effects at require-time in Node/jsdom.
try {
  if (typeof module !== 'undefined' && module && module.exports) {
    // CommonJS environment (Node/tests): export initialize for callers to run.
    module.exports = module.exports || {};
    module.exports.initialize = typeof initialize === 'function' ? initialize : null;
  } else {
    // Browser environment: run initialize when DOM is ready.
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
      } else {
        initialize();
      }
    }
  }
} catch (e) {
  // Fallback: if we can access document, try to initialize; otherwise, do nothing.
  try { if (typeof document !== 'undefined') initialize(); } catch (ee) { /* ignore */ }
}

// Table of Contents and Statistics functions
const generateTableOfContents = () => {
  const editor = getActiveEditorInstance()?.el;
  if (!editor) return;

  const content = editor.value;
  const lines = content.split('\n');
  const toc = [];
  let currentLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2];
      const anchor = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      
      toc.push({
        level,
        title,
        anchor,
        lineNumber: i + 1
      });
    }
  }

  if (toc.length === 0) {
    elements.tocContent.innerHTML = '<p>No headings found in the document.</p>';
  } else {
    const tocHtml = buildTocHtml(toc);
    elements.tocContent.innerHTML = tocHtml;
  }

  elements.tocModal.hidden = false;
  elements.tocModal.style.display = 'flex';
  elements.tocModal.setAttribute('aria-hidden', 'false');
};

const buildTocHtml = (toc) => {
  let html = '<ul>';
  let currentLevel = 1;
  const levelStack = [1];

  for (const item of toc) {
    while (item.level > currentLevel) {
      html += '<ul>';
      levelStack.push(item.level);
      currentLevel = item.level;
    }
    
    while (item.level < currentLevel) {
      html += '</ul>';
      levelStack.pop();
      currentLevel = levelStack[levelStack.length - 1] || 1;
    }
    
    html += `<li><a href="#${item.anchor}" data-line="${item.lineNumber}">${item.title}</a></li>`;
  }
  
  while (levelStack.length > 1) {
    html += '</ul>';
    levelStack.pop();
  }
  
  html += '</ul>';
  return html;
};

const closeTocModal = () => {
  elements.tocModal.hidden = true;
  elements.tocModal.style.display = 'none';
  elements.tocModal.setAttribute('aria-hidden', 'true');
};

const insertTocAtCursor = () => {
  const editor = getActiveEditorInstance()?.el;
  if (!editor) return;

  const tocText = elements.tocContent.textContent || elements.tocContent.innerText || '';
  if (!tocText.trim()) return;

  const cursorPos = editor.selectionStart;
  const beforeText = editor.value.substring(0, cursorPos);
  const afterText = editor.value.substring(cursorPos);
  
  editor.value = beforeText + tocText + '\n\n' + afterText;
  editor.selectionStart = editor.selectionEnd = cursorPos + tocText.length + 2;
  editor.focus();
  
  closeTocModal();
  renderActiveNote();
};

const copyTocToClipboard = () => {
  const tocText = elements.tocContent.textContent || elements.tocContent.innerText || '';
  if (!tocText.trim()) return;

  navigator.clipboard.writeText(tocText).then(() => {
    // Show a brief success message
    const originalText = elements.tocCopy.textContent;
    elements.tocCopy.textContent = 'Copied!';
    setTimeout(() => {
      elements.tocCopy.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy TOC:', err);
  });
};

const showNoteStatistics = () => {
  const editor = getActiveEditorInstance()?.el;
  if (!editor) return;

  const content = editor.value;
  
  // Calculate statistics
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  const charsNoSpaces = content.replace(/\s/g, '').length;
  const lines = content.split('\n').length;
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim()).length;
  
  // Count headings
  const headings = (content.match(/^#{1,6}\s+.+$/gm) || []).length;
  
  // Count links
  const links = (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
  
  // Count images
  const images = (content.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || []).length;
  
  // Count code blocks
  const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
  
  // Count math expressions
  const mathExpressions = (content.match(/\$[^$\n]+\$/g) || []).length + (content.match(/\$\$[\s\S]*?\$\$/g) || []).length;
  
  // Count hashtags
  const hashtags = (content.match(/#\w+/g) || []).length;
  
  // Calculate reading time (average 200 words per minute)
  const readingTime = Math.ceil(words / 200);
  
  // Update the UI
  document.getElementById('stat-words').textContent = words.toLocaleString();
  document.getElementById('stat-chars').textContent = chars.toLocaleString();
  document.getElementById('stat-chars-no-spaces').textContent = charsNoSpaces.toLocaleString();
  document.getElementById('stat-lines').textContent = lines.toLocaleString();
  document.getElementById('stat-paragraphs').textContent = paragraphs.toLocaleString();
  document.getElementById('stat-headings').textContent = headings.toLocaleString();
  document.getElementById('stat-links').textContent = links.toLocaleString();
  document.getElementById('stat-images').textContent = images.toLocaleString();
  document.getElementById('stat-code-blocks').textContent = codeBlocks.toLocaleString();
  document.getElementById('stat-math').textContent = mathExpressions.toLocaleString();
  document.getElementById('stat-reading-time').textContent = `${readingTime} min`;
  document.getElementById('stat-hashtags').textContent = hashtags.toLocaleString();
  
  elements.statsModal.hidden = false;
  elements.statsModal.style.display = 'flex';
  elements.statsModal.setAttribute('aria-hidden', 'false');
};

const closeStatsModal = () => {
  elements.statsModal.hidden = true;
  elements.statsModal.style.display = 'none';
  elements.statsModal.setAttribute('aria-hidden', 'true');
};

// Templates functions
const createTemplateNote = async (templateType, content) => {
  if (!state.currentFolder) {
    setStatus('Open a folder before creating template notes.', false);
    return;
  }

  if (typeof window.api?.createMarkdownFile !== 'function' || typeof window.api?.saveExternalMarkdown !== 'function') {
    setStatus('File creation is unavailable in this build.', false);
    return;
  }

  // Generate a filename based on template type
  const templateNames = {
    meeting: 'Meeting Notes',
    project: 'Project Plan',
    research: 'Research Notes',
    journal: 'Journal Entry',
    todo: 'Todo List',
    brainstorm: 'Brainstorm'
  };
  
  const baseName = templateNames[templateType] || 'New Note';
  const fileName = `${baseName}.md`;

  try {
    // Create the new file with the template content directly
    console.log('Creating template file:', fileName);
    console.log('Content length:', content.length);
    console.log('Content preview:', content.substring(0, 200) + '...');
    
    const createResult = await window.api.createMarkdownFile({
      folderPath: state.currentFolder,
      fileName,
      content: content
    });

    if (!createResult || !createResult.createdNoteId) {
      setStatus('Could not create template note.', false);
      return;
    }

    // Adopt the returned workspace immediately so state.notes is populated
    adoptWorkspace(createResult, createResult.createdNoteId);

    // Now retrieve the created note from state
    const createdNote = state.notes.get(createResult.createdNoteId);
    if (!createdNote) {
      setStatus('Could not find created note after workspace adoption.', false);
      return;
    }

    console.log('Template file created successfully with content');

  // Open the new note in the current active pane. Use openNoteInPane to
  // force-populate the editor textarea even if a tab already exists.
  const targetPane = state.activeEditorPane || resolvePaneFallback(true);
  console.log('Opening note in pane:', targetPane);
  openNoteInPane(createResult.createdNoteId, targetPane, { activate: true });

    const createdTitle = createdNote.title || fileName;
    setStatus(`${createdTitle} created from template.`, true);
    
    // Focus the editor
    try { getActiveEditorInstance()?.el?.focus({ preventScroll: true }); } catch (e) {}
    
  } catch (error) {
    console.error('Error creating template note:', error);
    setStatus('Error creating template note.', false);
  }
};

const handleTemplateClick = (e) => {
  const templateItem = e.target.closest('.template-item');
  if (templateItem) {
    e.preventDefault();
    const templateType = templateItem.dataset.template;
    const content = getTemplateContent(templateType);
    
    if (content) {
      // Create a new note with the template content instead of overwriting current note
      createTemplateNote(templateType, content);
    }
    
    closeTemplatesModal();
  }
};

const showTemplatesModal = () => {
  elements.templatesModal.hidden = false;
  elements.templatesModal.style.display = 'flex';
  elements.templatesModal.setAttribute('aria-hidden', 'false');
  
  // Attach template click handlers when modal is shown (only once)
  if (!elements.templatesModal.hasTemplateClickListener) {
    elements.templatesModal.addEventListener('click', handleTemplateClick);
    elements.templatesModal.hasTemplateClickListener = true;
  }
};

const closeTemplatesModal = () => {
  elements.templatesModal.hidden = true;
  elements.templatesModal.style.display = 'none';
  elements.templatesModal.setAttribute('aria-hidden', 'true');
};

const getTemplateContent = (templateType) => {
  const templates = {
    meeting: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Time:** 
**Location:** 
**Attendees:** 

## Agenda
- 

## Discussion Notes
- 

## Action Items
- [ ] 

## Next Steps
- 

## Follow-up
- `,
    
    project: `# Project Plan: [Project Name]

**Start Date:** ${new Date().toLocaleDateString()}
**Deadline:** 
**Status:** Planning

## Project Overview
Brief description of the project goals and objectives.

## Objectives
- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

## Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Resources Needed
- 

## Timeline
- Phase 1: 
- Phase 2: 
- Phase 3: 

## Risks & Mitigation
- Risk: 
  Mitigation: `,
    
    research: `# Research Notes: [Topic]

**Date:** ${new Date().toLocaleDateString()}
**Researcher:** 

## Research Question
What is the main question or hypothesis being investigated?

## Background
Relevant context and prior work in this area.

## Methodology
How the research will be conducted.

## Data/Findings
- 

## Analysis
- 

## Conclusions
- 

## References
- `,
    
    journal: `# Daily Journal - ${new Date().toLocaleDateString()}

## Today's Focus
What are the main goals or priorities for today?

## Accomplishments
- 

## Challenges
- 

## Learnings
- 

## Tomorrow's Plan
- `,
    
    todo: `# Task List

**Created:** ${new Date().toLocaleDateString()}

## High Priority
- [ ] 

## Medium Priority
- [ ] 

## Low Priority
- [ ] 

## Completed
- [x] Set up task list template

## Notes
- `,
    
    blank: ''
  };
  
  return templates[templateType] || '';
};

// -------------------------
// Citation / Bibliography
// -------------------------

// Show a simple citation picker modal
const showCitationModal = () => {
  if (!elements.citationModal) return;
  elements.citationModal.hidden = false;
  elements.citationModal.style.display = 'flex';
  elements.citationModal.setAttribute('aria-hidden', 'false');
  // Focus search input if present
  try { elements.citationSearchInput.focus(); } catch (e) {}
};

const closeCitationModal = () => {
  if (!elements.citationModal) return;
  elements.citationModal.hidden = true;
  elements.citationModal.style.display = 'none';
  elements.citationModal.setAttribute('aria-hidden', 'true');
};

// Very small BibTeX parser: maps citekey -> { title, author, year, url }
const parseBibtex = (bibtexText) => {
  if (!bibtexText) return {};
  const entries = {};
  // Split by @ and parse simple fields
  const raw = bibtexText.split(/@/).map(s => s.trim()).filter(Boolean);
  for (const item of raw) {
    // item starts like: article{key, ...}
    const m = item.match(/^[^{]+\{\s*([^,\s]+)\s*,([\s\S]*)\}\s*$/m);
    if (!m) continue;
    const key = m[1].trim();
    const body = m[2];
    const entry = { key };
    // extract common fields
    const titleM = body.match(/title\s*=\s*\{([^}]*)\}/i);
    const authorM = body.match(/author\s*=\s*\{([^}]*)\}/i);
    const yearM = body.match(/year\s*=\s*\{([^}]*)\}/i);
    const urlM = body.match(/url\s*=\s*\{([^}]*)\}/i);
    if (titleM) entry.title = titleM[1].trim();
    if (authorM) entry.author = authorM[1].trim();
    if (yearM) entry.year = yearM[1].trim();
    if (urlM) entry.url = urlM[1].trim();
    entries[key] = entry;
  }
  return entries;
};

// Load bibliography file from workspace path if available
const loadBibliographyForWorkspace = async (folderPath) => {
  if (!folderPath) return {};
  // Look for common bib filenames
  const candidates = ['bibliography.bib', 'references.bib', 'refs.bib'];
  for (const c of candidates) {
    const p = `${folderPath}/${c}`;
    try {
      const res = await window.api.readBibliography({ path: p });
      if (res && res.content) {
        return parseBibtex(res.content || '');
      }
    } catch (e) {
      // ignore
    }
  }
  return {};
};

let _cachedBibliography = null;

// Open citation picker: load bib if needed and show modal
const openCitationPicker = async () => {
  const folderPathEl = elements.workspacePath && elements.workspacePath.title ? elements.workspacePath.title : null;
  if (!_cachedBibliography) {
    _cachedBibliography = await loadBibliographyForWorkspace(folderPathEl);
  }

  // If user wants to pick a specific .bib file, wire the choose button
  try {
    const chooseBtn = document.getElementById('citation-choose-bib-button');
    if (chooseBtn) {
      chooseBtn.onclick = async (ev) => {
        ev.preventDefault();
        try {
          const res = await window.api.chooseBibFile();
          if (res && !res.canceled && res.content) {
            _cachedBibliography = parseBibtex(res.content || '');
            // Refresh list view
            openCitationPicker();
            return;
          }
        } catch (e) {
          // ignore
        }
        // If choose was cancelled or failed, just re-open modal
        openCitationPicker();
      };
    }
  } catch (e) { /* ignore */ }

  // Populate list
  const listEl = elements.citationList;
  try {
    listEl.innerHTML = '';
  } catch (e) { return showCitationModal(); }

  const entries = Object.values(_cachedBibliography || {});
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.textContent = 'No bibliography found in workspace (looked for bibliography.bib, references.bib, refs.bib)';
    listEl.appendChild(empty);
    showCitationModal();
    return;
  }

  for (const e of entries) {
    const it = document.createElement('div');
    it.className = 'citation-item';
    it.tabIndex = 0;
    const keySpan = document.createElement('div'); keySpan.className = 'cite-key'; keySpan.textContent = `@${e.key}`;
    const titleSpan = document.createElement('div'); titleSpan.className = 'cite-title'; titleSpan.textContent = e.title || '(no title)';
    const metaSpan = document.createElement('div'); metaSpan.className = 'cite-meta'; metaSpan.textContent = `${e.author || ''} ${e.year ? `— ${e.year}` : ''}`;
    it.appendChild(keySpan); it.appendChild(titleSpan); it.appendChild(metaSpan);
    it.addEventListener('click', () => {
      insertCitationMarker(e.key);
      closeCitationModal();
    });
    it.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { insertCitationMarker(e.key); closeCitationModal(); } });
    listEl.appendChild(it);
  }

  // simple search wiring
  try {
    elements.citationSearchInput.value = '';
    elements.citationSearchInput.oninput = (ev) => {
      const q = (ev.target.value || '').toLowerCase();
      const items = Array.from(listEl.querySelectorAll('.citation-item'));
      items.forEach(it => {
        const txt = it.textContent.toLowerCase();
        it.hidden = q && !txt.includes(q);
      });
    };
  } catch (e) { /* ignore */ }

  showCitationModal();
};

// Insert citation marker at cursor (Markdown style [@key])
const insertCitationMarker = (citeKey) => {
  const inst = getAnyEditorInstance();
  if (!inst || !inst.isPresent()) return setStatus('No editor to insert citation into.', true);
  const start = inst.selectionStart || 0;
  const end = inst.selectionEnd || start;
  const marker = `[@${citeKey}]`;
  try {
    // Use style-aware insertion
    insertCitationWithStyleInternal(inst, citeKey, start, end);
    const pos = start + marker.length;
    try { inst.setSelectionRange(pos, pos); } catch (e) {}
    inst.focus({ preventScroll: true });
    // Trigger a preview update
    const note = getActiveNote();
    if (note && note.type === 'markdown') debouncedRenderPreview(inst.getValue(), note.id);
    setStatus('Inserted citation', true);
  } catch (error) {
    setStatus('Failed to insert citation', 'error');
  }
};

// Helper: build numeric index map for bibliography (order-based)
const _getBibIndexMap = () => {
  const map = {};
  const keys = Object.keys(_cachedBibliography || {});
  keys.forEach((k, idx) => { map[k] = idx + 1; });
  return map;
};

const insertCitationWithStyleInternal = (inst, citeKey, start, end) => {
  const styleEl = elements.citationStyleSelect;
  let style = 'brackets';
  try { style = styleEl && styleEl.value ? styleEl.value : 'brackets'; } catch (e) {}

  const bibIndexMap = _getBibIndexMap();
  const entry = (_cachedBibliography || {})[citeKey] || {};
  let replacement = `[@${citeKey}]`;

  if (style === 'author-year') {
    const a = entry.author ? entry.author.split(' and ')[0].split(',')[0] : citeKey;
    replacement = `(${a}${entry.year ? `, ${entry.year}` : ''})`;
  } else if (style === 'numeric') {
    const num = bibIndexMap[citeKey] || '?';
    replacement = `[${num}]`;
  } else if (style === 'author-inline') {
    const a = entry.author ? entry.author.split(' and ')[0].split(',')[0] : citeKey;
    replacement = `${a}${entry.year ? ` (${entry.year})` : ''}`;
  } else if (style === 'brackets') {
    replacement = `[@${citeKey}]`;
  }

  try {
    if (typeof inst.setRangeText === 'function') {
      inst.setRangeText(replacement);
    } else {
      const v = inst.getValue();
      inst.setValue(v.slice(0, start) + replacement + v.slice(end));
    }
    const pos = start + replacement.length;
    try { inst.setSelectionRange(pos, pos); } catch (e) {}
  } catch (e) {
    // fallback
    const v = inst.getValue();
    inst.setValue(v.slice(0, start) + replacement + v.slice(end));
  }
};

// Initialize accessibility features
function initializeAccessibility() {
  // Load high contrast setting
  const highContrastEnabled = localStorage.getItem(storageKeys.highContrast) === 'true';
  if (elements.highContrastToggle) {
    elements.highContrastToggle.checked = highContrastEnabled;
    updateHighContrastMode(highContrastEnabled);
  }
  
  // Load keybindings
  loadKeybindings();
  renderKeybindingsList();
  
  // Add event listeners
  if (elements.highContrastToggle) {
    elements.highContrastToggle.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      localStorage.setItem(storageKeys.highContrast, enabled);
      updateHighContrastMode(enabled);
    });
  }
  
  if (elements.resetKeybindingsBtn) {
    elements.resetKeybindingsBtn.addEventListener('click', resetKeybindings);
  }

  // Keybinding input handling
  let recordingKeys = false;
  if (elements.keybindingKeysInput) {
    elements.keybindingKeysInput.addEventListener('focus', () => {
      recordingKeys = true;
      elements.keybindingKeysInput.value = 'Press keys...';
    });
    elements.keybindingKeysInput.addEventListener('blur', () => {
      recordingKeys = false;
    });
    elements.keybindingKeysInput.addEventListener('keydown', (e) => {
      if (recordingKeys) {
        e.preventDefault();
        const combo = getKeyCombo(e);
        elements.keybindingKeysInput.value = combo;
        elements.keybindingKeysInput.blur();
        recordingKeys = false;
      }
    });
  }

  if (elements.addKeybindingBtn) {
    elements.addKeybindingBtn.addEventListener('click', () => {
      const action = elements.keybindingActionSelect?.value;
      const keys = elements.keybindingKeysInput?.value;
      if (action && keys && keys !== 'Press keys...') {
        addKeybinding(action, keys);
        elements.keybindingActionSelect.value = '';
        elements.keybindingKeysInput.value = '';
      } else {
        alert('Please select an action and record a key combination.');
      }
    });
  }
  
  // Add global keydown listener for keybindings
  document.addEventListener('keydown', handleKeybinding);

  // Populate citation style select if present
  try {
    const sel = elements.citationStyleSelect;
    if (sel && sel.tagName === 'SELECT' && sel.options.length === 0) {
      const styles = [
        { val: 'brackets', label: '[@key] (default)' },
        { val: 'author-year', label: 'Author–Year (Smith, 2020)' },
        { val: 'numeric', label: 'Numeric [1]' },
        { val: 'author-inline', label: 'Author (2020)' }
      ];
      styles.forEach(s => {
        const opt = document.createElement('option'); opt.value = s.val; opt.textContent = s.label; sel.appendChild(opt);
      });
      sel.value = 'brackets';
    }
  } catch (e) {}
}

function updateHighContrastMode(enabled) {
  if (enabled) {
    document.body.setAttribute('data-high-contrast', 'true');
  } else {
    document.body.removeAttribute('data-high-contrast');
  }
}

// --- Keybindings: minimal safe stubs to avoid startup errors ---
let _keybindings = [];
function loadKeybindings() {
  try {
    const raw = localStorage.getItem('NTA.keybindings');
    _keybindings = raw ? JSON.parse(raw) : [];
  } catch (e) { _keybindings = []; }
}

function renderKeybindingsList() {
  if (!elements.keybindingsList) return;
  elements.keybindingsList.innerHTML = '';
  (_keybindings || []).forEach((k, index) => {
    const div = document.createElement('div');
    div.className = 'keybinding-item';
    
    const label = document.createElement('span');
    label.className = 'keybinding-label';
    label.textContent = `${k.action || 'unknown'} — ${k.keys || ''}`;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'settings-button--secondary';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => {
      _keybindings.splice(index, 1);
      saveKeybindings();
      renderKeybindingsList();
    };
    
    div.appendChild(label);
    div.appendChild(removeBtn);
    elements.keybindingsList.appendChild(div);
  });
}

function resetKeybindings() {
  _keybindings = [];
  try { localStorage.removeItem('NTA.keybindings'); } catch (e) {}
  renderKeybindingsList();
}

function addKeybinding(action, keys) {
  if (!action || !keys) return;
  // Check if already exists
  if (_keybindings.some(kb => kb.keys === keys)) {
    alert('This key combination is already assigned.');
    return;
  }
  _keybindings.push({ action, keys });
  saveKeybindings();
  renderKeybindingsList();
}

function saveKeybindings() {
  try {
    localStorage.setItem('NTA.keybindings', JSON.stringify(_keybindings));
  } catch (e) {}
}

function handleKeybinding(e) {
  // Check custom keybindings first
  const keyCombo = getKeyCombo(e);
  for (const kb of _keybindings || []) {
    if (kb.keys === keyCombo) {
      e.preventDefault();
      executeKeybindingAction(kb.action, e);
      return;
    }
  }

  // Minimal: intercept Ctrl/Cmd+Shift+P as example
  // Toggle: Cmd/Ctrl+Shift+P (example)
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
    e.preventDefault();
    setStatus('Keybinding triggered: Cmd/Ctrl+Shift+P', true);
    return;
  }

  // Toggle LaTeX preview: Cmd/Ctrl+Shift+L
  // (removed Cmd/Ctrl+Shift+L) - kept for backward compatibility, no action

  // Insert LaTeX block at cursor: Cmd/Ctrl+Alt+L
  if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'l') {
    e.preventDefault();
    insertLatexBlockAtCursor();
    return;
  }

  // Open citation picker: Cmd/Ctrl+Alt+C
  if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'c') {
    e.preventDefault();
    openCitationPicker();
    return;
  }
}

// Initialize accessibility features when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// Export functionality
async function handleExport(format) {
  if (!elements.preview || !elements.editor) return;
  
  const note = getActiveNote();
  if (!note) return;
  
  const title = note.title || 'Untitled';
  const html = elements.preview ? elements.preview.innerHTML : '';
  const folderPath = elements.workspacePath?.title;
  
  try {
    let result;
    switch (format) {
      case 'pdf':
        result = await window.api.exportPreviewPdf({ html, title, folderPath });
        break;
      case 'html':
        result = await window.api.exportPreviewHtml({ html, title, folderPath });
        break;
      case 'docx':
        result = await window.api.exportPreviewDocx({ html, title, folderPath });
        break;
      case 'epub':
        result = await window.api.exportPreviewEpub({ html, title, folderPath });
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    if (result && result.filePath) {
      showStatusMessage(`Exported to ${format.toUpperCase()} successfully`);
    }
  } catch (error) {
    showStatusMessage(`Export failed: ${error.message}`, 'error');
  }
}

function showStatusMessage(message, type = 'info') {
  if (elements.statusText) {
    elements.statusText.textContent = message;
    elements.statusText.className = type === 'error' ? 'status-error' : '';
    
    // Clear message after 5 seconds
    setTimeout(() => {
      elements.statusText.textContent = 'Ready.';
      elements.statusText.className = '';
    }, 5000);
  }
}

// Add export event listeners
function initializeExportHandlers() {
  const exportOptions = [
    { element: elements.exportPdfOption, format: 'pdf' },
    { element: elements.exportHtmlOption, format: 'html' },
    { element: elements.exportDocxOption, format: 'docx' },
    { element: elements.exportEpubOption, format: 'epub' }
  ];
  
  exportOptions.forEach(({ element, format }) => {
    if (element) {
      element.addEventListener('click', () => handleExport(format));
    }
  });
}

// Expose selected internals for unit testing in Node/jsdom environments.
try {
  if (typeof module !== 'undefined' && module && module.exports) {
    module.exports.__test__ = module.exports.__test__ || {};
    // Export the visual updater and state so tests can exercise DOM updates.
    module.exports.__test__.updateEditorPaneVisuals = typeof updateEditorPaneVisuals === 'function' ? updateEditorPaneVisuals : null;
    module.exports.__test__.state = typeof state !== 'undefined' ? state : null;
    // Export initialize so tests can explicitly initialize the app when needed.
    module.exports.__test__.initialize = typeof initialize === 'function' ? initialize : null;
    // Export a few runtime helpers so tests can simulate pane interactions
    module.exports.__test__.openNoteInPane = typeof openNoteInPane === 'function' ? openNoteInPane : null;
    module.exports.__test__.setActiveEditorPane = typeof setActiveEditorPane === 'function' ? setActiveEditorPane : null;
    module.exports.__test__.renderActiveNote = typeof renderActiveNote === 'function' ? renderActiveNote : null;
    module.exports.__test__.renderMarkdownPreview = typeof renderMarkdownPreview === 'function' ? renderMarkdownPreview : null;
    module.exports.__test__.renderLatexPreview = typeof renderLatexPreview === 'function' ? renderLatexPreview : null;
    module.exports.__test__.openNoteById = typeof openNoteById === 'function' ? openNoteById : null;
    module.exports.__test__.updateFileMetadataUI = typeof updateFileMetadataUI === 'function' ? updateFileMetadataUI : null;
  module.exports.__test__.applyWikiSuggestion = typeof applyWikiSuggestion === 'function' ? applyWikiSuggestion : null;
  module.exports.__test__.updateWikiSuggestions = typeof updateWikiSuggestions === 'function' ? updateWikiSuggestions : null;
  }
} catch (e) { /* ignore in browsers */ }

// Initialize export handlers when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExportHandlers);
} else {
  initializeExportHandlers();
}

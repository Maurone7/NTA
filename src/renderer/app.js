const elements = {
  appShell: document.querySelector('.app-shell'),
  workspaceTree: document.getElementById('workspace-tree'),
  workspaceEmpty: document.getElementById('workspace-empty'),
  workspacePath: document.getElementById('workspace-path'),
  workspaceContent: document.querySelector('.workspace__content'),
  workspaceSplitter: document.getElementById('workspace-splitter'),
  sidebarResizeHandle: document.querySelector('.sidebar-resize-handle'),
  hashtagResizeHandle: document.getElementById('hashtag-resize-handle'),
  explorer: document.querySelector('.explorer'),
  editor: document.getElementById('note-editor'),
  preview: document.getElementById('markdown-preview'),
  pdfViewer: document.getElementById('pdf-viewer'),
  codeViewer: document.getElementById('code-viewer'),
  codeViewerCode: document.querySelector('#code-viewer code'),
  imageViewer: document.getElementById('image-viewer'),
  imageViewerImg: document.getElementById('image-viewer-img'),
  imageViewerCaption: document.getElementById('image-viewer-caption'),
  imageViewerError: document.getElementById('image-viewer-error'),
  videoViewer: document.getElementById('video-viewer'),
  videoViewerVideo: document.getElementById('video-viewer-video'),
  videoViewerCaption: document.getElementById('video-viewer-caption'),
  videoViewerError: document.getElementById('video-viewer-error'),
  htmlViewer: document.getElementById('html-viewer'),
  htmlViewerFrame: document.getElementById('html-viewer-frame'),
  htmlViewerError: document.getElementById('html-viewer-error'),
  wikiSuggestions: document.getElementById('wikilink-suggestions'),
  hashtagSuggestions: document.getElementById('hashtag-suggestions'),
  fileSuggestions: document.getElementById('file-suggestions'),
  statusText: document.getElementById('status-text'),
  fileName: document.getElementById('file-name'),
  filePath: document.getElementById('file-path'),
  createFileButton: document.getElementById('create-file-button'),
  toggleSidebarButton: document.getElementById('toggle-sidebar-button'),
  // dual editor removed
  togglePreviewButton: document.getElementById('toggle-preview-button'),
  renameFileForm: document.getElementById('rename-file-form'),
  renameFileInput: document.getElementById('rename-file-input'),
  editorSearch: document.getElementById('editor-search'),
  editorSearchInput: document.getElementById('editor-search-input'),
  editorSearchPrevButton: document.getElementById('editor-search-prev'),
  editorSearchNextButton: document.getElementById('editor-search-next'),
  editorSearchCloseButton: document.getElementById('editor-search-close'),
  editorSearchCount: document.getElementById('editor-search-count'),
  editorSearchHighlights: document.getElementById('editor-search-highlights'),
  editorSearchHighlightsContent: document.getElementById('editor-search-highlights-content'),
  insertCodeBlockButton: document.getElementById('insert-code-block-button'),
  exportPreviewButton: document.getElementById('export-preview-button'), // Keep for compatibility
  exportPreviewHtmlButton: document.getElementById('export-html-button'), // Keep for compatibility
  exportDropdownButton: document.getElementById('export-dropdown-button'),
  exportDropdownMenu: document.getElementById('export-dropdown-menu'),
  exportPdfOption: document.getElementById('export-pdf-option'),
  exportHtmlOption: document.getElementById('export-html-option'),
  exportDocxOption: document.getElementById('export-docx-option'),
  exportEpubOption: document.getElementById('export-epub-option'),
  codePopover: document.getElementById('code-block-popover'),
  codePopoverForm: document.getElementById('code-block-form'),
  codePopoverInput: document.getElementById('code-block-language'),
  settingsButton: document.getElementById('settings-button'),
  settingsModal: document.getElementById('settings-modal'),
  settingsClose: document.getElementById('settings-close'),
  checkUpdatesButton: document.getElementById('check-updates-btn'),
  appVersion: document.getElementById('app-version'),
  themeSelect: document.getElementById('theme-select'),
  bgColorPicker: document.getElementById('bg-color-picker'),
  resetBgColorButton: document.getElementById('reset-bg-color'),
  // Legacy font settings (keeping for compatibility)
  fontFamilySelect: document.getElementById('font-family-select'),
  resetFontFamilyButton: document.getElementById('reset-font-family'),
  fontSizeSlider: document.getElementById('font-size-slider'),
  fontSizeValue: document.getElementById('font-size-value'),
  resetFontSizeButton: document.getElementById('reset-font-size'),
  textColorPicker: document.getElementById('text-color-picker'),
  resetTextColorButton: document.getElementById('reset-text-color'),
  // Workspace settings
  workspaceBgColorPicker: document.getElementById('workspace-bg-color-picker'),
  resetWorkspaceBgColorButton: document.getElementById('reset-workspace-bg-color'),
  workspaceFontFamilySelect: document.getElementById('workspace-font-family-select'),
  resetWorkspaceFontFamilyButton: document.getElementById('reset-workspace-font-family'),
  workspaceFontSizeSlider: document.getElementById('workspace-font-size-slider'),
  workspaceFontSizeValue: document.getElementById('workspace-font-size-value'),
  resetWorkspaceFontSizeButton: document.getElementById('reset-workspace-font-size'),
  workspaceTextColorPicker: document.getElementById('workspace-text-color-picker'),
  resetWorkspaceTextColorButton: document.getElementById('reset-workspace-text-color'),
  workspaceFontStyleSelect: document.getElementById('workspace-font-style-select'),
  // Editor settings
  editorBgColorPicker: document.getElementById('editor-bg-color-picker'),
  resetEditorBgColorButton: document.getElementById('reset-editor-bg-color'),
  editorFontFamilySelect: document.getElementById('editor-font-family-select'),
  resetEditorFontFamilyButton: document.getElementById('reset-editor-font-family'),
  editorFontSizeSlider: document.getElementById('editor-font-size-slider'),
  editorFontSizeValue: document.getElementById('editor-font-size-value'),
  resetEditorFontSizeButton: document.getElementById('reset-editor-font-size'),
  editorTextColorPicker: document.getElementById('editor-text-color-picker'),
  resetEditorTextColorButton: document.getElementById('reset-editor-text-color'),
  editorFontStyleSelect: document.getElementById('editor-font-style-select'),
  // Preview settings
  previewBgColorPicker: document.getElementById('preview-bg-color-picker'),
  resetPreviewBgColorButton: document.getElementById('reset-preview-bg-color'),
  previewFontFamilySelect: document.getElementById('preview-font-family-select'),
  resetPreviewFontFamilyButton: document.getElementById('reset-preview-font-family'),
  previewFontSizeSlider: document.getElementById('preview-font-size-slider'),
  previewFontSizeValue: document.getElementById('preview-font-size-value'),
  resetPreviewFontSizeButton: document.getElementById('reset-preview-font-size'),
  previewTextColorPicker: document.getElementById('preview-text-color-picker'),
  resetPreviewTextColorButton: document.getElementById('reset-preview-text-color'),
  previewFontStyleSelect: document.getElementById('preview-font-style-select'),
  // Status Bar settings
  statusbarBgColorPicker: document.getElementById('statusbar-bg-color-picker'),
  resetStatusbarBgColorButton: document.getElementById('reset-statusbar-bg-color'),
  statusbarFontFamilySelect: document.getElementById('statusbar-font-family-select'),
  resetStatusbarFontFamilyButton: document.getElementById('reset-statusbar-font-family'),
  statusbarFontSizeSlider: document.getElementById('statusbar-font-size-slider'),
  statusbarFontSizeValue: document.getElementById('statusbar-font-size-value'),
  resetStatusbarFontSizeButton: document.getElementById('reset-statusbar-font-size'),
  statusbarTextColorPicker: document.getElementById('statusbar-text-color-picker'),
  resetStatusbarTextColorButton: document.getElementById('reset-statusbar-text-color'),
  statusbarFontStyleSelect: document.getElementById('statusbar-font-style-select'),
  // Title Bar settings
  titlebarBgColorPicker: document.getElementById('titlebar-bg-color-picker'),
  resetTitlebarBgColorButton: document.getElementById('reset-titlebar-bg-color'),
  titlebarFontFamilySelect: document.getElementById('titlebar-font-family-select'),
  resetTitlebarFontFamilyButton: document.getElementById('reset-titlebar-font-family'),
  titlebarFontSizeSlider: document.getElementById('titlebar-font-size-slider'),
  titlebarFontSizeValue: document.getElementById('titlebar-font-size-value'),
  resetTitlebarFontSizeButton: document.getElementById('reset-titlebar-font-size'),
  titlebarTextColorPicker: document.getElementById('titlebar-text-color-picker'),
  resetTitlebarTextColorButton: document.getElementById('reset-titlebar-text-color'),
  titlebarFontStyleSelect: document.getElementById('titlebar-font-style-select'),
  titlebarShowPath: document.getElementById('titlebar-show-path'),
  // Export/Import elements
  exportSettingsBtn: document.getElementById('export-settings-btn'),
  exportFormatSelect: document.getElementById('export-format-select'),
  importSettingsBtn: document.getElementById('import-settings-btn'),
  importSettingsInput: document.getElementById('import-settings-input'),
  importStatus: document.getElementById('import-status'),
  exportPreviewText: document.getElementById('export-preview-text'),
  copySettingsBtn: document.getElementById('copy-settings-btn'),
  downloadSettingsBtn: document.getElementById('download-settings-btn'),
  // Unified component controls
  componentSelector: document.getElementById('component-selector'),
  componentUseGlobalBg: document.getElementById('component-use-global-bg'),
  componentUseGlobalFont: document.getElementById('component-use-global-font'),
  componentUseGlobalSize: document.getElementById('component-use-global-size'),
  componentUseGlobalColor: document.getElementById('component-use-global-color'),
  componentUseGlobalStyle: document.getElementById('component-use-global-style'),
  componentBgColorPicker: document.getElementById('component-bg-color-picker'),
  componentFontFamilySelect: document.getElementById('component-font-family-select'),
  componentFontSizeSlider: document.getElementById('component-font-size-slider'),
  componentFontSizeValue: document.getElementById('component-font-size-value'),
  componentTextColorPicker: document.getElementById('component-text-color-picker'),
  componentFontStyleSelect: document.getElementById('component-font-style-select'),
  resetComponentBgColor: document.getElementById('reset-component-bg-color'),
  resetComponentFontFamily: document.getElementById('reset-component-font-family'),
  resetComponentFontSize: document.getElementById('reset-component-font-size'),
  resetComponentTextColor: document.getElementById('reset-component-text-color'),
  titlebarShowPath: document.getElementById('titlebar-show-path'),
  titlebarSpecificSetting: document.getElementById('titlebar-specific-setting'),
  borderColorPicker: document.getElementById('border-color-picker'),
  resetBorderColorButton: document.getElementById('reset-border-color'),
  borderThicknessSlider: document.getElementById('border-thickness-slider'),
  borderThicknessValue: document.getElementById('border-thickness-value'),
  resetBorderThicknessButton: document.getElementById('reset-border-thickness'),
  updateNotification: document.getElementById('update-notification'),
  updateDownloadButton: document.getElementById('update-download-button'),
  updateInstallButton: document.getElementById('update-install-button'),
  updateDismissButton: document.getElementById('update-dismiss-button'),
  codePopoverSuggestions: document.getElementById('code-block-suggestions'),
  codePopoverCancel: document.querySelector('#code-block-popover [data-action="cancel"]'),
  openFolderButtons: [
    document.getElementById('open-folder-button')
  ].filter(Boolean),
  hashtagPanel: document.getElementById('hashtag-panel'),
  hashtagList: document.getElementById('hashtag-list'),
  hashtagDetail: document.getElementById('hashtag-detail'),
  hashtagEmpty: document.getElementById('hashtag-empty'),
  clearHashtagFilter: document.getElementById('clear-hashtag-filter'),
  workspaceContextMenu: document.getElementById('workspace-context-menu'),
  inlineChat: document.getElementById('inline-chat'),
  inlineChatMessages: document.getElementById('inline-chat-messages'),
  inlineChatInput: document.getElementById('inline-chat-input'),
  inlineChatSend: document.getElementById('inline-chat-send'),
  inlineChatClose: document.getElementById('inline-chat-close'),
  // Math preview popup
  mathPreviewPopup: document.getElementById('math-preview-popup'),
  mathPreviewPopupContent: document.querySelector('#math-preview-popup .math-preview-popup__content'),
  // Accessibility elements
  highContrastToggle: document.getElementById('high-contrast-toggle'),
  keybindingsList: document.getElementById('keybindings-list'),
  resetKeybindingsBtn: document.getElementById('reset-keybindings-btn')
};

// Global selection tracking for CMD+E functionality
let activeSelections = []; // Array of {start, end} ranges for multi-selection math rendering

const storagePrefix = 'NTA.';
const storageKeys = {
  workspaceFolder: `${storagePrefix}lastWorkspaceFolder`,
  codeLanguage: `${storagePrefix}lastCodeLanguage`,
  sidebarCollapsed: `${storagePrefix}sidebarCollapsed`,
  previewCollapsed: `${storagePrefix}previewCollapsed`,
  sidebarWidth: `${storagePrefix}sidebarWidth`,
  highContrast: `${storagePrefix}high-contrast`,
  keybindings: `${storagePrefix}keybindings`
};

// Default keybindings
const defaultKeybindings = {
  'open-folder': 'CmdOrCtrl+O',
  'new-file': 'CmdOrCtrl+N',
  'save-file': 'CmdOrCtrl+S',
  'toggle-sidebar': 'CmdOrCtrl+B',
  'toggle-preview': 'CmdOrCtrl+Shift+B',
  'search': 'CmdOrCtrl+F',
  'export-pdf': 'CmdOrCtrl+E',
  'export-html': 'CmdOrCtrl+Shift+E',
  'settings': 'CmdOrCtrl+,',
  'bold': 'CmdOrCtrl+B',
  'italic': 'CmdOrCtrl+I',
  'code': 'CmdOrCtrl+Shift+C',
  'link': 'CmdOrCtrl+K'
};

// Current keybindings (loaded from storage)
let currentKeybindings = { ...defaultKeybindings };

// Keybinding handling
function loadKeybindings() {
  const stored = localStorage.getItem(storageKeys.keybindings);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      currentKeybindings = { ...defaultKeybindings, ...parsed };
    } catch (error) {
      console.warn('Failed to parse stored keybindings, using defaults');
      currentKeybindings = { ...defaultKeybindings };
    }
  }
}

function saveKeybindings() {
  localStorage.setItem(storageKeys.keybindings, JSON.stringify(currentKeybindings));
}

function resetKeybindings() {
  currentKeybindings = { ...defaultKeybindings };
  saveKeybindings();
  renderKeybindingsList();
}

function renderKeybindingsList() {
  if (!elements.keybindingsList) return;
  
  elements.keybindingsList.innerHTML = '';
  
  Object.entries(currentKeybindings).forEach(([action, keybinding]) => {
    const item = document.createElement('div');
    item.className = 'keybinding-item';
    
    const label = document.createElement('span');
    label.className = 'keybinding-label';
    label.textContent = action.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'keybinding-input';
    input.value = keybinding;
    input.dataset.action = action;
    
    input.addEventListener('keydown', (e) => {
      e.preventDefault();
      const keys = [];
      
      if (e.ctrlKey || e.metaKey) keys.push('CmdOrCtrl');
      if (e.shiftKey) keys.push('Shift');
      if (e.altKey) keys.push('Alt');
      
      if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
        keys.push(e.key.toUpperCase());
      }
      
      if (keys.length > 1) {
        input.value = keys.join('+');
      }
    });
    
    input.addEventListener('blur', () => {
      const newBinding = input.value.trim();
      if (newBinding) {
        currentKeybindings[action] = newBinding;
        saveKeybindings();
      } else {
        input.value = currentKeybindings[action];
      }
    });
    
    item.appendChild(label);
    item.appendChild(input);
    elements.keybindingsList.appendChild(item);
  });
}

function handleKeybinding(event) {
  // Create key combination string
  const keys = [];
  
  if (event.ctrlKey || event.metaKey) keys.push('CmdOrCtrl');
  if (event.shiftKey) keys.push('Shift');
  if (event.altKey) keys.push('Alt');
  keys.push(event.key.toUpperCase());
  
  const keyCombo = keys.join('+');
  
  // Find action for this keybinding
  for (const [action, binding] of Object.entries(currentKeybindings)) {
    if (binding === keyCombo) {
      executeKeybindingAction(action, event);
      break;
    }
  }
}

function executeKeybindingAction(action, event) {
  switch (action) {
    case 'open-folder':
      event.preventDefault();
      elements.openFolderButtons[0]?.click();
      break;
    case 'new-file':
      event.preventDefault();
      elements.createFileButton?.click();
      break;
    case 'save-file':
      event.preventDefault();
      // Implement save functionality
      break;
    case 'toggle-sidebar':
      event.preventDefault();
      elements.toggleSidebarButton?.click();
      break;
    case 'toggle-preview':
      event.preventDefault();
      elements.togglePreviewButton?.click();
      break;
    case 'search':
      event.preventDefault();
      elements.editorSearchInput?.focus();
      break;
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
  }
}

function wrapSelection(before, after) {
  if (!elements.editor) return;
  
  const start = elements.editor.selectionStart;
  const end = elements.editor.selectionEnd;
  const selectedText = elements.editor.value.substring(start, end);
  
  const replacement = before + selectedText + after;
  elements.editor.setRangeText(replacement);
  
  // Position cursor appropriately
  const newCursorPos = start + before.length + selectedText.length;
  elements.editor.setSelectionRange(newCursorPos, newCursorPos);
  elements.editor.focus();
}

const readStorage = (key) => {
  try {
    return window.localStorage?.getItem(key) ?? null;
  } catch (error) {
    console.warn('Failed to read storage key', key, error);
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    window.localStorage?.setItem(key, value);
  } catch (error) {
    console.warn('Failed to write storage key', key, error);
  }
};

const removeStorage = (key) => {
  try {
    window.localStorage?.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove storage key', key, error);
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
  saveTimer: null,
  saving: false,
  currentFolder: null,
  lastCodeLanguage: initialCodeLanguage,
  wikiIndex: new Map(),
  codePopoverOpen: false,
  imagePreviewToken: null,
  videoPreviewToken: null,
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
};

const minEditorRatio = 0.2;
const maxEditorRatio = 0.8;
const pdfCache = new Map();
let statusTimer = null;
const maxWikiEmbedDepth = 3;
const imageResourceCache = new Map();
const videoResourceCache = new Map();
const htmlResourceCache = new Map();

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
    console.warn('Failed to measure preview selection offset', error);
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
      console.warn('Failed to rebuild block mapping for preview fallback', error);
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
      console.warn('Invalid preview fallback regex', candidate.value, error);
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
    console.warn('Failed to position editor selection', error);
  }
};

const highlightEditorRange = (start, end) => {
  const textarea = elements.editor;
  if (!textarea) {
    return false;
  }

  const valueLength = typeof textarea.value === 'string' ? textarea.value.length : 0;
  const safeStart = clamp(Number.isFinite(start) ? Math.floor(start) : 0, 0, valueLength);
  const safeEnd = clamp(Number.isFinite(end) ? Math.ceil(end) : safeStart, safeStart, valueLength);

  try {
    textarea.focus({ preventScroll: true });
  } catch (error) {
    textarea.focus();
  }
  textarea.setSelectionRange(safeStart, safeEnd);
  ensureEditorSelectionVisible(textarea, safeStart);
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

  const editorValue = typeof elements.editor?.value === 'string' ? elements.editor.value : '';
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
      console.warn('Failed to build editor search regex', pattern, error);
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

const releasePdfResource = (resource) => {
  if (!resource || resource.type !== 'objectUrl' || !resource.value) {
    return;
  }

  try {
    URL.revokeObjectURL(resource.value);
  } catch (error) {
    console.warn('Failed to revoke PDF object URL', error);
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

  // Use our custom PDF.js viewer with the PDF file URL
  const viewerUrl = './pdfjs/pdf-viewer.html?file=' + encodeURIComponent(resource.value);
  elements.pdfViewer.src = viewerUrl;
  elements.pdfViewer.classList.add('visible');
  return true;
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
  if (!value) {
    return false;
  }
  if (protocolRelativePattern.test(value)) {
    return true;
  }
  if (absoluteUrlPattern.test(value)) {
    return true;
  }
  return false;
};

const toWikiSlug = (value) => {
  if (!value) {
    return null;
  }
  return value
    .toLowerCase()
    .replace(/\.[^./\\]+$/, '')
    .replace(/[^a-z0-9]+/gi, '')
    .trim();
};

const rebuildWikiIndex = () => {
  const index = new Map();

  state.notes.forEach((note, noteId) => {
    const candidates = new Set();
    candidates.add(note.title ?? '');
    if (note.absolutePath) {
      const base = note.absolutePath.split(/[\\/]/).pop();
      if (base) {
        candidates.add(base);
        candidates.add(stripExtension(base));
      }
    }
    if (note.title) {
      candidates.add(stripExtension(note.title));
    }

    candidates.forEach((candidate) => {
      const slug = toWikiSlug(candidate);
      if (slug && !index.has(slug)) {
        index.set(slug, noteId);
      }
    });
  });

  state.wikiIndex = index;
};

const refreshBlockIndexForNote = (note) => {
  if (!note || !note.id) {
    return;
  }

  const prefix = `${note.id}::`;

  const currentLabels = new Map();
  if (note.type === 'markdown') {
    const definitions = extractBlockDefinitions(note.content ?? '');
    definitions.forEach((def, label) => {
      if (label) {
        currentLabels.set(label, def);
      }
    });
  }

  // Remove stale entries
  for (const key of Array.from(state.blockIndex.keys())) {
    if (key.startsWith(prefix)) {
      const label = key.slice(prefix.length);
      if (!currentLabels.has(label)) {
        state.blockIndex.delete(key);
      }
    }
  }

  if (!currentLabels.size) {
    state.blockLabelsByNote.delete(note.id);
    return;
  }

  currentLabels.forEach((definition, label) => {
    const key = `${note.id}::${label}`;
    state.blockIndex.set(key, {
      noteId: note.id,
      label,
      rawLabel: definition.rawLabel,
      title: definition.title
    });
  });

  state.blockLabelsByNote.set(note.id, currentLabels);
};

const rebuildBlockIndex = () => {
  state.blockIndex = new Map();
  state.blockLabelsByNote = new Map();

  state.notes.forEach((note) => {
    refreshBlockIndexForNote(note);
  });
};

const hashtagPattern = /(^|[^0-9A-Za-z_#])#([A-Za-z][\w-]{0,63})\b/g;

const normalizeHashtagKey = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase();
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
        elements.editor?.focus({ preventScroll: true });
      } catch (error) {
        elements.editor?.focus();
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
  
  // Don't auto-focus to avoid persistent highlight issues
  // Users can navigate with mouse or keyboard as needed
};

const closeExportDropdown = () => {
  const dropdown = elements.exportDropdownButton?.closest('.export-dropdown');
  if (!dropdown) return;
  
  dropdown.setAttribute('data-open', 'false');
  elements.exportDropdownButton?.setAttribute('aria-expanded', 'false');
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
  const allowedTypes = new Set(['markdown', 'pdf', 'code', 'notebook', 'image', 'video', 'html']);
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
    } else if (node.ext === '.pdf') {
      icon.textContent = '📄';
    } else if (node.ext === '.py') {
      icon.textContent = '🐍';
    } else if (node.ext === '.ipynb') {
      icon.textContent = '📓';
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
};

const handleTreeNodeDragEnd = (event) => {
  const nodeElement = event.target.closest('.tree-node');
  if (nodeElement) {
    nodeElement.classList.remove('tree-node--dragging');
  }
};

// Drop handlers for editors
const handleEditorDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

const handleEditorDragEnter = (event) => {
  event.preventDefault();
  event.target.classList.add('editor-drop-target');
};

const handleEditorDragLeave = (event) => {
  // Only remove the class if we're actually leaving the editor
  if (!event.target.contains(event.relatedTarget)) {
    event.target.classList.remove('editor-drop-target');
  }
};

const handleEditor1Drop = (event) => {
  event.preventDefault();
  event.target.classList.remove('editor-drop-target');
  
  const noteId = event.dataTransfer.getData('text/noteId');
  if (noteId && state.notes.has(noteId)) {
    state.activeNoteId = noteId;
    renderWorkspaceTree();
    renderActiveNote();
    setStatus('File opened in first editor.', true);
  }
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
  if (!elements.preview || typeof window.api?.resolveResource !== 'function') {
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
        console.warn('Failed to resolve resource', rawSrc, error);
        imageResourceCache.set(cacheKey, null);
      }
    })
  );
};

const processPreviewVideos = async () => {
  if (!elements.preview || typeof window.api?.resolveResource !== 'function') {
    return;
  }

  const videos = Array.from(elements.preview.querySelectorAll('video[data-raw-src]'));
  if (!videos.length) {
    return;
  }

  await Promise.all(
    videos.map(async (video) => {
      const rawSrc = video.getAttribute('data-raw-src');
      if (!rawSrc) {
        return;
      }

      if (isLikelyExternalUrl(rawSrc) || rawSrc.startsWith('data:')) {
        return;
      }

      const noteId = video.getAttribute('data-note-id') || state.activeNoteId;
      const cacheKey = `${noteId ?? 'unknown'}::${rawSrc}`;
      if (videoResourceCache.has(cacheKey)) {
        const cached = videoResourceCache.get(cacheKey);
        if (cached) {
          video.src = cached;
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
          videoResourceCache.set(cacheKey, result.value);
          video.src = result.value;
        } else {
          videoResourceCache.set(cacheKey, null);
        }
      } catch (error) {
        console.warn('Failed to resolve video resource', rawSrc, error);
        videoResourceCache.set(cacheKey, null);
      }
    })
  );
};

const processPreviewHtmlIframes = async () => {
  if (!elements.preview || typeof window.api?.resolveResource !== 'function') {
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
      if (htmlResourceCache.has(cacheKey)) {
        const cached = htmlResourceCache.get(cacheKey);
        if (cached) {
          iframe.src = cached;
          
          // Auto-resize the iframe after src is set
          iframe.onload = () => {
            if (window.autoResizeIframe) {
              window.autoResizeIframe(iframe);
            }
          };
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
          htmlResourceCache.set(cacheKey, result.value);
          iframe.src = result.value;
          
          // Auto-resize the iframe after src is set
          iframe.onload = () => {
            if (window.autoResizeIframe) {
              window.autoResizeIframe(iframe);
            }
          };
        } else {
          htmlResourceCache.set(cacheKey, null);
        }
      } catch (error) {
        console.warn('Failed to resolve HTML resource', rawSrc, error);
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

const renderMarkdownPreview = (markdown, noteId = state.activeNoteId) => {
  if (!elements.preview) {
    return;
  }

  const renderBasicPreview = (content) => {
    try {
      const rawHtml = window.marked.parse(content ?? '');
      return window.DOMPurify.sanitize(rawHtml, domPurifyConfig);
    } catch (error) {
      console.error('Basic markdown render failed', error);
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
    console.error('Failed to render markdown preview with source map collection', error);
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
      console.error('Fallback markdown render also failed', fallbackError);
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
      elements.preview.innerHTML = html;
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
        console.error('Failed to apply preview source blocks', blockError);
        state.previewSourceBlocks.delete(noteId);
      }
    } else if (noteId) {
      state.previewSourceBlocks.delete(noteId);
    }

    try {
      decorateBlockAnchors(noteId);
    } catch (anchorError) {
      console.error('Failed to decorate block anchors', anchorError);
    }

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
    console.error('Failed to finalize markdown preview render', renderError);
    if (elements.preview) {
      elements.preview.innerHTML = renderBasicPreview(markdown);
    }
    if (noteId) {
      state.previewSourceBlocks.delete(noteId);
    }
  }
};

const getPreviewHtmlForExport = () => {
  if (!elements.preview) {
    return '';
  }

  const raw = elements.preview.innerHTML ?? '';
  if (!raw.trim()) {
    return '';
  }

  try {
    const sanitized = window.DOMPurify.sanitize(raw, domPurifyConfig);
    if (!sanitized.trim()) {
      return '';
    }

    const container = document.createElement('div');
    container.innerHTML = sanitized;
    container.querySelectorAll('.hashtag-hidden').forEach((node) => {
      node.remove();
    });

    return container.innerHTML;
  } catch (error) {
    console.error('Failed to sanitize preview HTML for export', error);
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
  if (!note || note.type !== 'markdown') {
    setStatus('Only Markdown notes can be exported as PDF.', false);
    return false;
  }

  if (typeof window.api?.exportPreviewPdf !== 'function') {
    setStatus('Preview export is unavailable in this build.', false);
    return false;
  }

  const html = getPreviewHtmlForExport();
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
    console.error('Failed to export preview as PDF', error);
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
  if (!note || note.type !== 'markdown') {
    setStatus('Only Markdown notes can be exported as HTML.', false);
    return false;
  }

  if (typeof window.api?.exportPreviewHtml !== 'function') {
    setStatus('HTML export is unavailable in this build.', false);
    return false;
  }

  const html = getPreviewHtmlForExport();
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
    console.error('Failed to export preview as HTML', error);
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
  if (!note || note.type !== 'markdown') {
    setStatus(`Only Markdown notes can be exported as ${format.toUpperCase()}.`, false);
    return false;
  }

  const html = getPreviewHtmlForExport();
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
    console.error(`Failed to export preview as ${format}`, error);
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

const renderNotebookPreview = (note) => {
  if (!elements.preview) {
    return;
  }

  const notebook = note?.notebook;

  elements.preview.replaceChildren();

  const container = document.createElement('div');
  container.className = 'notebook-preview';

  if (note?.language) {
    container.dataset.language = note.language.toUpperCase();
  }

  const cells = Array.isArray(notebook?.cells) ? notebook.cells : [];

  cells.forEach((cell) => {
    const section = document.createElement('section');
    section.className = `nb-cell nb-cell--${cell.type ?? 'unknown'}`;

    if (cell.type === 'markdown') {
      const html = window.DOMPurify.sanitize(window.marked.parse(cell.source ?? ''));
      const content = document.createElement('div');
      content.className = 'nb-cell__markdown';
      content.innerHTML = html;
      section.appendChild(content);
    } else {
      const header = document.createElement('header');
      header.className = 'nb-cell__header';
      header.textContent = `In [${(cell.index ?? 0) + 1}]`;
      section.appendChild(header);

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

  elements.preview.appendChild(container);
  elements.preview.scrollTop = 0;
};

const renderPdfPreview = async (note) => {
  if (!note || note.type !== 'pdf' || !elements.pdfViewer) {
    return;
  }

  const cacheKey = getPdfCacheKey(note);

  const resetViewer = () => {
    elements.pdfViewer.classList.remove('visible');
    elements.pdfViewer.removeAttribute('src');
  };

  resetViewer();

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

    resetViewer();
    setStatus('Unable to load PDF data.', false);
  } catch (error) {
    console.error('Failed to load PDF', error);
    resetViewer();
    setStatus('Failed to load PDF.', false);
  }
};

const renderImagePreview = async (note) => {
  if (!note || note.type !== 'image' || !elements.imageViewer) {
    return;
  }

  const caption = note.title ?? note.absolutePath ?? 'Image';
  state.imagePreviewToken = Symbol('imagePreview');
  const requestToken = state.imagePreviewToken;

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
    const result = await window.api.resolveResource(payload);
    if (state.imagePreviewToken !== requestToken) {
      return;
    }

    const value = result?.value ?? null;
    if (value && elements.imageViewerImg) {
      const cacheKey = `${note.id}::${rawSrc}`;
      imageResourceCache.set(cacheKey, value);
      elements.imageViewerImg.src = value;
      elements.imageViewerImg.dataset.rawSrc = rawSrc;
      elements.imageViewerImg.dataset.noteId = note.id;
      if (elements.imageViewerError) {
        elements.imageViewerError.hidden = true;
      }
      setStatus('Image ready.', true);
    } else if (elements.imageViewerError) {
      elements.imageViewerError.textContent = 'Unable to load this image.';
      elements.imageViewerError.hidden = false;
      setStatus('Unable to load image preview.', false);
    }
  } catch (error) {
    if (state.imagePreviewToken !== requestToken) {
      return;
    }
    console.error('Failed to render image preview', error);
    if (elements.imageViewerError) {
      elements.imageViewerError.textContent = 'Unable to load this image.';
      elements.imageViewerError.hidden = false;
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
    console.error('Failed to render video preview', error);
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
    console.error('Failed to render HTML preview', error);
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
    console.error('Failed to extract block HTML for embed', error);
    return null;
  }
};

const updateFileMetadataUI = (note) => {
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
    
    elements.filePath.innerHTML = directory ? 
      `${directory}/<span class="filename">${filename}</span>` : 
      `<span class="filename">${filename}</span>`;
  } else {
    elements.filePath.textContent = 'Stored inside the application library.';
  }
  elements.filePath.title = location;
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
    const canExport = Boolean(note && note.type === 'markdown');
    elements.exportPreviewButton.disabled = !canExport;
  }

  if (elements.exportPreviewHtmlButton) {
    const canExport = Boolean(note && note.type === 'markdown');
    elements.exportPreviewHtmlButton.disabled = !canExport;
  }

  // Update export dropdown
  if (elements.exportDropdownButton) {
    const canExport = Boolean(note && note.type === 'markdown');
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
    console.warn('Failed to compute editor search matches', error);
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
  const textarea = elements.editor;
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

  const textarea = elements.editor;
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
  const textarea = elements.editor;

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
  const textarea = elements.editor;

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
    try {
      textarea.setSelectionRange(match.start, match.end);
    } catch (error) {
      textarea.setSelectionRange(match.start, match.end);
    }

    if (shouldFocusEditor && !textarea.disabled) {
      try {
        textarea.focus({ preventScroll: true });
      } catch (error) {
        textarea.focus();
      }
    }

    ensureEditorSelectionVisible(textarea, match.start);
    state.search.lastCaret = textarea.selectionStart ?? match.start;
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

  const textarea = elements.editor;
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

  const textarea = elements.editor;
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

  if (restoreFocus && wasOpen && elements.editor && !elements.editor.disabled) {
    window.requestAnimationFrame(() => {
      try {
        elements.editor.focus({ preventScroll: true });
      } catch (error) {
        elements.editor.focus();
      }
    });
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
    caret: state.search.lastCaret ?? (elements.editor?.selectionStart ?? 0),
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

const openNoteById = (noteId, silent = false, blockId = null) => {
  if (!noteId || !state.notes.has(noteId)) {
    if (!silent) {
      setStatus('Linked note not found.', false);
    }
    return;
  }

  state.activeNoteId = noteId;
  state.pendingBlockFocus = blockId ? { noteId, blockId } : null;
  renderWorkspaceTree();
  renderActiveNote();
  if (!silent) {
    const message = blockId ? `Opened linked note at ^${blockId}.` : 'Opened linked note.';
    setStatus(message, true);
  }
};

const renderActiveNote = () => {
  const note = getActiveNote();
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
    elements.preview.innerHTML = '';
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
  };

  if (!note) {
    elements.editor.value = '';
    elements.editor.disabled = true;
    resetPreviewState();
    closeEditorSearch(false);
    syncHashtagDetailSelection();
    return;
  }

  resetPreviewState();

  if (note.type === 'markdown') {
    elements.editor.disabled = false;
    elements.editor.value = note.content ?? '';
    renderMarkdownPreview(note.content ?? '', note.id);

    if (state.search.open) {
      const caret = elements.editor?.selectionStart ?? 0;
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
    elements.editor.disabled = true;
    elements.editor.value = '';

    if (note.type === 'image') {
      elements.workspaceContent?.classList.add('image-mode');
      void renderImagePreview(note);
    } else if (note.type === 'video') {
      elements.workspaceContent?.classList.add('video-mode');
      void renderVideoPreview(note);
    } else if (note.type === 'html') {
      elements.workspaceContent?.classList.add('html-mode');
      void renderHtmlPreview(note);
    } else if (note.type === 'pdf') {
      elements.workspaceContent?.classList.add('pdf-mode');
      renderPdfPreview(note);
    } else if (note.type === 'code') {
      elements.workspaceContent?.classList.add('code-mode');
      renderCodePreview(note.content ?? '', note.language);
    } else if (note.type === 'notebook') {
      elements.workspaceContent?.classList.add('notebook-mode');
      renderNotebookPreview(note);
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
    console.error('Failed to save files', error);
    setStatus('Failed to save — check logs.', false);
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
  } else if (state.activeNoteId && state.notes.has(state.activeNoteId)) {
    // keep existing
  } else {
    state.activeNoteId = normalizedNotes[0]?.id ?? null;
  }

  renderWorkspaceTree();
  renderActiveNote();
};

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
    if (noteId && state.notes.has(noteId)) {
      state.activeNoteId = noteId;
      renderWorkspaceTree();
      renderActiveNote();
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
      textarea.value = newValue;
      textarea.setSelectionRange(newCaretPosition, newCaretPosition);
      
      return true; // Indicate that auto-completion was performed
    }
  }
  
  return false;
};

const updateMathPreview = (textarea) => {
  if (!elements.mathPreviewPopup || !elements.mathPreviewPopupContent) {
    return;
  }

  const value = textarea.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
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
    
    console.log('updateMathPreview: currentLine:', JSON.stringify(currentLine), 'hasImagePattern:', hasImagePattern, 'start:', start, 'lineEndPos:', lineEndPos, 'lineNewlinePos:', lineNewlinePos);
    
    if (!hasImagePattern && start !== lineEndPos && start !== lineNewlinePos) {
      contentToRender = ''; // Don't show preview unless cursor is at end of line
    }
  }
  
  // Only show preview if there's content to render
  if (contentToRender.trim()) {
    const mathContent = contentToRender.trim();
    try {
      // Check if content contains math expressions
      const inlineMathRegex = /(?<!\$)\$([^\n$]+?)\$(?!\w)/gm;
      const blockMathRegex = /\$\$([\s\S]*?)\$\$\s*/gm;
      
      const inlineMatches = [...contentToRender.matchAll(inlineMathRegex)];
      const blockMatches = [...contentToRender.matchAll(blockMathRegex)];
      
      if (inlineMatches.length > 0 || blockMatches.length > 0) {
        // Content contains math expressions - render them
        let renderedContent = contentToRender;
        
        // Replace block math first (to avoid conflicts)
        renderedContent = renderedContent.replace(blockMathRegex, (match, mathContent) => {
          try {
            const rendered = window.katex.renderToString(mathContent.trim(), { 
              throwOnError: false, 
              displayMode: true 
            });
            return rendered;
          } catch (error) {
            return match; // Return original on error
          }
        });
        
        // Then replace inline math
        renderedContent = renderedContent.replace(inlineMathRegex, (match, mathContent) => {
          try {
            const rendered = window.katex.renderToString(mathContent.trim(), { 
              throwOnError: false, 
              displayMode: false 
            });
            return rendered;
          } catch (error) {
            return match; // Return original on error
          }
        });
        
        elements.mathPreviewPopupContent.innerHTML = renderedContent;
      } else if (/^#{1,6}\s/.test(mathContent)) {
        // Markdown header: # Title, ## Title, ### Title, etc.
        const headerMatch = mathContent.match(/^(#{1,6})\s+(.*)$/);
        if (headerMatch) {
          const level = headerMatch[1].length;
          const title = headerMatch[2];
          elements.mathPreviewPopupContent.innerHTML = `<h${level}>${title}</h${level}>`;
        } else {
          // Fallback to plain text
          elements.mathPreviewPopupContent.textContent = mathContent;
        }
      } else if (/\!\[\[([^\]]+)\]\]/.test(mathContent)) {
        // Wiki-link: ![[filename]]
        console.log('Detected wiki-link in mathContent:', JSON.stringify(mathContent));
        const wikiMatch = mathContent.match(/\!\[\[([^\]]+)\]\]/);
        if (wikiMatch) {
          const filename = wikiMatch[1];
          console.log('Wiki-link filename:', filename);
          let workspacePath = elements.workspacePath?.title || '';
          
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
          
          console.log('Adjusted workspace path:', workspacePath);
          
          if (workspacePath) {
            // Construct file path
            const filePath = `file://${workspacePath}/${filename}`;
            
            // Determine file type and show appropriate preview
            if (/\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/i.test(filename)) {
              elements.mathPreviewPopupContent.innerHTML = `<div style="width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px;"><div style="font-size: 24px;">🖼️</div><div>Loading...</div></div><img src="${filePath}" alt="${filename}" style="display: none; max-width: 200px; max-height: 150px; object-fit: contain;" onload="console.log('Image loaded successfully:', this.src); this.style.display='block'; this.previousElementSibling.style.display='none';" onerror="console.log('Image failed to load:', this.src); this.previousElementSibling.innerHTML='<div style=font-size:24px;>🖼️</div><div>Image not found</div><div style=font-size:10px;color:#6c757d;>${filename}</div>';">`;
            } else if (/\.(mp4|webm|ogg|avi|mov|wmv|flv|m4v)$/i.test(filename)) {
              elements.mathPreviewPopupContent.innerHTML = `<div style="width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px;"><div style="font-size: 24px;">🎥</div><div>Loading...</div></div><video controls style="display: none; max-width: 200px; max-height: 150px;" onload="console.log('Video loaded successfully:', this.src); this.style.display='block'; this.previousElementSibling.style.display='none';" onerror="console.log('Video failed to load:', this.src); this.previousElementSibling.innerHTML='<div style=font-size:24px;>🎥</div><div>Video not found</div><div style=font-size:10px;color:#6c757d;>${filename}</div>';"><source src="${filePath}" type="video/mp4"></video>`;
            } else if (/\.(pdf)$/i.test(filename)) {
              console.log('Detected as PDF');
              elements.mathPreviewPopupContent.innerHTML = `<div style="width: 200px; height: 150px; background: #f0f0f0; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px;">📄 PDF: ${filename}</div>`;
            } else if (/\.(html|htm)$/i.test(filename)) {
              console.log('Detected as HTML');
              const htmlPath = `file://${workspacePath}/${filename}`;
              elements.mathPreviewPopupContent.innerHTML = `<div style="width: 200px; height: 150px; overflow: hidden; border: 1px solid #ddd;"><iframe src="${htmlPath}" style="width: 400px; height: 300px; border: none; background: white; transform: scale(0.5); transform-origin: top left;" sandbox="allow-scripts"></iframe></div>`;
            } else {
              // No extension - try as image first (most common wiki-link use case)
              console.log('No extension detected, trying as image');
              const imageFilePath = `${filePath}.jpg`; // Try .jpg first
              elements.mathPreviewPopupContent.innerHTML = `<div style="width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px;"><div style="font-size: 24px;">�️</div><div>Loading...</div></div><img src="${imageFilePath}" alt="${filename}" style="display: none; max-width: 200px; max-height: 150px; object-fit: contain;" onload="console.log('Image loaded successfully:', this.src); this.style.display='block'; this.previousElementSibling.style.display='none';" onerror="console.log('Image failed to load, trying PNG:', this.src); 
                // Try PNG if JPG fails
                const pngPath = this.src.replace('.jpg', '.png');
                this.src = pngPath;
                this.onerror = function() { 
                  console.log('PNG also failed, trying GIF:', this.src);
                  const gifPath = this.src.replace('.png', '.gif');
                  this.src = gifPath;
                  this.onerror = function() {
                    console.log('GIF also failed, trying video:', '${filename}');
                    // Try video format
                    const videoContainer = this.previousElementSibling;
                    videoContainer.innerHTML = '<div style=font-size:24px;>🎥</div><div>Loading video...</div>';
                    
                    // Create video element to show first frame
                    const video = document.createElement('video');
                    video.style.display = 'none';
                    video.style.width = '200px';
                    video.style.height = '150px';
                    video.style.objectFit = 'contain';
                    video.preload = 'metadata'; // Only load metadata, not full video
                    
                    video.onloadedmetadata = function() {
                      console.log('Video metadata loaded, showing first frame');
                      // Video loaded successfully, show it
                      video.style.display = 'block';
                      video.controls = true;
                      videoContainer.style.display = 'none';
                    };
                    
                    video.onerror = function() {
                      console.log('Video failed to load:', '${filename}');
                      videoContainer.innerHTML='<div style=font-size:24px;>📄</div><div>File not found</div><div style=font-size:10px;color:#6c757d;>${filename}</div>';
                      video.style.display = 'none';
                    };
                    
                    // Try MP4 first
                    const source = document.createElement('source');
                    source.src = '${filePath}.mp4';
                    source.type = 'video/mp4';
                    video.appendChild(source);
                    
                    // Insert video after the container
                    videoContainer.parentNode.insertBefore(video, videoContainer.nextSibling);
                  };
                };">`;
            }
          } else {
            console.log('No workspace path available');
            // No workspace path available
            elements.mathPreviewPopupContent.innerHTML = `<div style="width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; align-items: center; justify-content: center; font-size: 12px;">Wiki-link: ${filename}</div>`;
          }
        } else {
          console.log('Wiki-link regex matched but no capture groups');
          elements.mathPreviewPopupContent.textContent = mathContent;
        }
      } else if (/!\[.*?\]\(.*?\)/.test(mathContent)) {
        // Markdown image: ![alt](url)
        const imageMatch = mathContent.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch) {
          const imageUrl = imageMatch[1];
          elements.mathPreviewPopupContent.innerHTML = `<div style="width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px;"><div style="font-size: 24px;">🖼️</div><div>Loading...</div></div><img src="${imageUrl}" alt="Preview" style="display: none; max-width: 200px; max-height: 150px; object-fit: contain;" onload="this.style.display='block'; this.previousElementSibling.style.display='none';" onerror="this.previousElementSibling.innerHTML='<div style=font-size:24px;>🖼️</div><div>Image not found</div>';">`;
        } else {
          elements.mathPreviewPopupContent.textContent = mathContent;
        }
      } else if (/^(https?:\/\/|file:\/\/)?[^\s]+\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)(\?.*)?$/i.test(mathContent) && !/\s/.test(mathContent)) {
        // Direct image URL or file path (no spaces, looks like a URL/filename)
        elements.mathPreviewPopupContent.innerHTML = `<div style="width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px;"><div style="font-size: 24px;">🖼️</div><div>Loading...</div></div><img src="${mathContent}" alt="Preview" style="display: none; max-width: 200px; max-height: 150px; object-fit: contain;" onload="this.style.display='block'; this.previousElementSibling.style.display='none';" onerror="this.previousElementSibling.innerHTML='<div style=font-size:24px;>🖼️</div><div>Image not found</div>';">`;
      } else if (/^(https?:\/\/|file:\/\/)?[^\s]+\.(mp4|webm|ogg|avi|mov|wmv|flv|m4v)(\?.*)?$/i.test(mathContent) && !/\s/.test(mathContent)) {
        // Video file URL or path (no spaces, looks like a URL/filename)
        elements.mathPreviewPopupContent.innerHTML = `<div style="width: 200px; height: 150px; background: #f8f9fa; border: 1px solid #dee2e6; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px;"><div style="font-size: 24px;">🎥</div><div>Loading...</div></div><video controls style="display: none; max-width: 200px; max-height: 150px;" onload="this.style.display='block'; this.previousElementSibling.style.display='none';" onerror="this.previousElementSibling.innerHTML='<div style=font-size:24px;>🎥</div><div>Video not found</div>';"><source src="${mathContent}" type="video/mp4"></video>`;
      } else if (/^<.*>.*<\/.*>$/.test(mathContent) || /^<.*\/>$/.test(mathContent)) {
        // HTML content (basic detection)
        // For security, we'll show a sanitized preview
        const sanitizedHtml = mathContent
          .replace(/<script[^>]*>.*?<\/script>/gi, '[SCRIPT REMOVED]')
          .replace(/<style[^>]*>.*?<\/style>/gi, '[STYLE REMOVED]')
          .replace(/javascript:/gi, '')
          .replace(/on\w+="[^"]*"/gi, '');
        elements.mathPreviewPopupContent.innerHTML = `<div style="font-family: monospace; font-size: 12px; background: #f5f5f5; padding: 8px; border-radius: 4px; max-width: 200px; overflow: hidden;">${sanitizedHtml}</div>`;
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
      console.error('Math preview render error:', error);
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

const positionMathPreviewPopup = (textarea, mathStartIndex) => {
  if (!elements.mathPreviewPopup) return;
  
  // Get the text before the math expression to calculate line position
  const textBeforeMath = textarea.value.substring(0, mathStartIndex);
  const lines = textBeforeMath.split('\n');
  const currentLineIndex = lines.length - 1;
  const currentLineText = lines[currentLineIndex];
  
  // Create a temporary div to measure text width
  const measureDiv = document.createElement('div');
  measureDiv.style.position = 'absolute';
  measureDiv.style.visibility = 'hidden';
  measureDiv.style.whiteSpace = 'pre';
  measureDiv.style.font = window.getComputedStyle(textarea).font;
  measureDiv.style.fontSize = window.getComputedStyle(textarea).fontSize;
  measureDiv.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
  measureDiv.textContent = currentLineText;
  document.body.appendChild(measureDiv);
  
  const textWidth = measureDiv.getBoundingClientRect().width;
  document.body.removeChild(measureDiv);
  
  // Get textarea position
  const textareaRect = textarea.getBoundingClientRect();
  const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight) || 20;
  
  // Position popup to the right of the current line
  let popupX = textareaRect.left + textWidth + 10; // 10px offset
  const popupY = textareaRect.top + (currentLineIndex * lineHeight) - (lineHeight / 2);
  
  // Ensure popup stays within window bounds
  const popupWidth = 220; // Approximate popup width
  const windowWidth = window.innerWidth;
  if (popupX + popupWidth > windowWidth) {
    popupX = windowWidth - popupWidth - 10; // Position from right edge
  }
  
  elements.mathPreviewPopup.style.left = `${popupX}px`;
  elements.mathPreviewPopup.style.top = `${popupY}px`;
};

const handleEditorInput = (event) => {
  // Set typing flag and clear it after a delay
  state.userTyping = true;
  clearTimeout(state.typingTimer);
  state.typingTimer = setTimeout(() => {
    state.userTyping = false;
  }, 1500);

  const note = getActiveNote();
  if (!note || note.type !== 'markdown') {
    return;
  }

  // Update math preview popup
  updateMathPreview(event.target);
  
  // Check for LaTeX auto-completion before updating note content
  // Pass the inputType to avoid triggering on delete operations
  const latexCompleted = handleLatexAutoCompletion(event.target, event.inputType);
  
  note.content = event.target.value;
  note.updatedAt = new Date().toISOString();
  note.dirty = true;
  refreshBlockIndexForNote(note);
  refreshHashtagsForNote(note);
  renderMarkdownPreview(note.content, note.id);
  scheduleSave();

  if (state.search.open) {
    const caret = elements.editor?.selectionStart ?? state.search.lastCaret ?? 0;
    updateEditorSearchMatches({ preserveActive: true, caret, focusEditor: false });
  }

  updateWikiSuggestions(event.target);
  updateHashtagSuggestions(event.target);
  updateFileSuggestions(event.target);
  
  // If LaTeX was auto-completed, trigger another input event to update everything with the new content
  if (latexCompleted) {
    note.content = event.target.value;
    renderMarkdownPreview(note.content, note.id);
  }
};

// second editor input handling removed

const inlineCommandPattern = /^\s*&(?<command>[a-z]+)(?:(?::|\s+)(?<argument>[^\s]+))?\s*$/i;
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
        textarea.value = nextContent;
        textarea.focus({ preventScroll: true });
        const caret = Math.min(updateResult.caretPosition, nextContent.length);
        textarea.setSelectionRange(caret, caret);

        note.content = nextContent;
        note.updatedAt = new Date().toISOString();
        note.dirty = true;

        refreshBlockIndexForNote(note);
        refreshHashtagsForNote(note);
        renderMarkdownPreview(note.content, note.id);
        scheduleSave();
        updateWikiSuggestions(textarea);
        updateHashtagSuggestions(textarea);
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

    textarea.value = baseContent;
    textarea.focus({ preventScroll: true });
    const caret = beforeCommand.length + separation.newline.length;
    textarea.setSelectionRange(caret, caret);

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

    textarea.value = nextContent;
    textarea.focus({ preventScroll: true });

    const placeholderStart =
      before.length +
      (needsLeadingNewline ? 1 : 0) +
      openingLine.length +
      1;
    const placeholderEnd = placeholderStart + placeholder.length;

    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(placeholderStart, placeholderEnd);
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
      textarea.setSelectionRange(selectionStart, selectionEnd);
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
    console.error('Failed to apply matrix trigger:', error);
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

  const match = trimmed.match(/^([1-9]\d?)\s*[xX]\s*([1-9]\d?)$/);
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
    clamped
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

    textarea.value = nextContent;
    textarea.focus({ preventScroll: true });

    // Position cursor at the quote text for immediate editing
    const selectionStart = beforeCommand.length + snippetPrefix.length + 2; // After "> "
    const selectionEnd = selectionStart + quotePlaceholder.length;

    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(selectionStart, selectionEnd);
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
    console.error('Failed to apply quote trigger:', error);
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
    setStatus('Use "&table ROWSxCOLS" (e.g. "&table 3x4").', false);
    return false;
  }

  const { rows, columns, clamped } = dimensions;
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
    
    // Create body rows, preserving existing data
    const bodyRows = Array.from({ length: rows }, (_, rowIndex) =>
      makeRow(
        Array.from({ length: columns }, (_, columnIndex) => {
          if (existingTable && existingTable.rows && existingTable.rows[rowIndex] && existingTable.rows[rowIndex][columnIndex]) {
            return existingTable.rows[rowIndex][columnIndex];
          }
          return `Row ${rowIndex + 1} Col ${columnIndex + 1}`;
        })
      )
    );

    const lines = [makeRow(headers), makeRow(divider), ...bodyRows];
    const snippetCore = `${lines.join('\n')}\n`;
    const snippetPrefix = '\n';
    const snippetSuffix = needsTrailingNewline ? '\n' : '';
    const snippet = `${snippetPrefix}${snippetCore}${snippetSuffix}`;
    const nextContent = `${beforeCommand}${snippet}${afterCommand}`;

    textarea.value = nextContent;
    textarea.focus({ preventScroll: true });

    const firstDataCell = rows > 0 ? `Row 1 Col 1` : headers[0] ?? '';
    const selectionAnchorInSnippet = snippetCore.indexOf(firstDataCell);
    const selectionStart =
  beforeCommand.length +
  snippetPrefix.length +
      (selectionAnchorInSnippet >= 0 ? selectionAnchorInSnippet : 0);
    const selectionEnd = selectionStart + firstDataCell.length;

    window.requestAnimationFrame(() => {
      textarea.setSelectionRange(selectionStart, selectionEnd);
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
    !state.tagSuggest.open
  ) {
    const note = getActiveNote();
    const textarea = elements.editor;
    if (note && note.type === 'markdown' && textarea) {
      const caret = textarea.selectionStart ?? 0;
      const trigger = detectInlineCommandTrigger(textarea.value, caret, { includeTrailingNewline: false });
      if (trigger) {
        event.preventDefault();
        if (applyInlineCommandTrigger(textarea, note, trigger)) {
          return;
        }
      }
    }
  }
};

const handleEditorKeyup = (event) => {
  if (event.key === 'Backspace' || event.key === 'Delete') {
    if (!state.wikiSuggest.open) {
      updateWikiSuggestions(elements.editor);
    }
    if (!state.tagSuggest.open) {
      updateHashtagSuggestions(elements.editor);
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
    // Update math preview on cursor movement
    updateMathPreview(elements.editor);
  }

  if (state.search.open) {
    const textarea = elements.editor;
    if (textarea) {
      state.search.lastCaret = textarea.selectionStart ?? state.search.lastCaret ?? 0;
    }
  }
  
  // Update stored selection for CMD+E functionality
  const textarea = elements.editor;
  if (textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    // Note: activeSelections is managed by toggleMathWysiwyg, this is just for reference
  }
};

// Lightweight click handler for the editor to refresh suggestions and cursor-dependent UI
const handleEditorClick = (event) => {
  // Update wiki and hashtag suggestions based on cursor position
  if (elements.editor) {
    updateWikiSuggestions(elements.editor);
    updateHashtagSuggestions(elements.editor);
    updateFileSuggestions(elements.editor);
    updateMathPreview(elements.editor);
    
    // Update stored selection for CMD+E functionality
    const start = elements.editor.selectionStart;
    const end = elements.editor.selectionEnd;
    // Note: activeSelections is managed by toggleMathWysiwyg, this is just for reference
  }
};

// second editor input handling removed

const handleEditorSelect = () => {
  if (!state.search.open) {
    return;
  }
  const textarea = elements.editor;
  if (!textarea) {
    return;
  }
  state.search.lastCaret = textarea.selectionStart ?? state.search.lastCaret ?? 0;
  
  // Update stored selection for CMD+E functionality
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  lastSelection = start !== end ? { start, end } : null;
  
  // Update math preview when selection changes
  updateMathPreview(textarea);
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
  if (!state.resizingHashtagPanel || !state.initialMouseY || !state.initialHashtagHeight) {
    return;
  }
  
  // Calculate the movement delta
  const deltaY = state.initialMouseY - event.clientY; // Negative when moving down, positive when moving up
  const newHeight = state.initialHashtagHeight + deltaY;
  
  setHashtagPanelHeight(newHeight);
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
};

const handleOpenFolder = async () => {
  try {
    // Defensive: ensure the preload/native API is available
    if (!window.api || typeof window.api.chooseFolder !== 'function') {
      console.error('Native API missing: window.api.chooseFolder is not available');
      setStatus('Cannot open folders: native file-chooser API is unavailable.', false);
      return;
    }

    console.debug('Invoking native folder chooser (window.api.chooseFolder)');
    const result = await window.api.chooseFolder();
    if (!result) {
      setStatus('Folder selection cancelled.', true);
      return;
    }

    adoptWorkspace(result);
    if (state.activeNoteId) {
      setStatus('Workspace loaded.', true);
    } else {
      setStatus('Folder opened. Select a file to view it.', true);
    }
  } catch (error) {
    console.error('Failed to open folder', error);
    setStatus('Failed to open folder — see logs.', false);
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
  state.wikiSuggest.open = false;
  state.wikiSuggest.items = [];
  state.wikiSuggest.selectedIndex = 0;
  state.wikiSuggest.start = 0;
  state.wikiSuggest.end = 0;
  state.wikiSuggest.query = '';
  state.wikiSuggest.embed = false;
  state.wikiSuggest.position.top = 24;
  state.wikiSuggest.position.left = 24;
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
  const parent = elements.wikiSuggestions?.parentElement ?? null;
  const parentHeight = parent?.clientHeight ?? window.innerHeight;
  const parentWidth = parent?.clientWidth ?? window.innerWidth;
  const estimatedHeight = Math.min(state.wikiSuggest.items.length * 36 + 12, 280);
  const estimatedWidth = Math.min(360, parentWidth - 32);

  let anchorTop = (textarea?.offsetTop ?? 0) + coords.top + coords.lineHeight + 6;
  let anchorLeft = (textarea?.offsetLeft ?? 0) + coords.left;

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

  state.wikiSuggest.position.top = anchorTop;
  state.wikiSuggest.position.left = anchorLeft;
};

const computeHashtagSuggestionPosition = (textarea, caret) => {
  const coords = getTextareaCaretCoordinates(textarea, caret);
  const parent = elements.hashtagSuggestions?.parentElement ?? null;
  const parentHeight = parent?.clientHeight ?? window.innerHeight;
  const parentWidth = parent?.clientWidth ?? window.innerWidth;
  const estimatedHeight = Math.min(state.tagSuggest.items.length * 36 + 12, 240);
  const estimatedWidth = Math.min(320, parentWidth - 32);

  let anchorTop = (textarea?.offsetTop ?? 0) + coords.top + coords.lineHeight + 6;
  let anchorLeft = (textarea?.offsetLeft ?? 0) + coords.left;

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
  const container = elements.wikiSuggestions;
  if (!container) {
    return;
  }

  if (!state.wikiSuggest.open || !state.wikiSuggest.items.length) {
    closeWikiSuggestions();
    return;
  }

  container.hidden = false;
  container.setAttribute('data-open', 'true');
  container.style.top = `${state.wikiSuggest.position.top}px`;
  container.style.left = `${state.wikiSuggest.position.left}px`;

  const itemsHtml = state.wikiSuggest.items
    .map((item, index) => {
      const active = index === state.wikiSuggest.selectedIndex;
      const meta = item.meta ? `<div class="wiki-suggest__meta">${escapeHtml(item.meta)}</div>` : '';
      return `<div class="wiki-suggest__item" id="wiki-suggest-item-${index}" role="option" data-index="${index}" data-active="${
        active ? 'true' : 'false'
      }">
        <div class="wiki-suggest__title">${escapeHtml(item.display)}</div>
        ${meta}
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

const updateHashtagSuggestions = (textarea = elements.editor) => {
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
  const textarea = elements.editor;
  if (!suggestion || !textarea) {
    return false;
  }

  const start = state.tagSuggest.start;
  const end = state.tagSuggest.end;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const replacement = suggestion.insert ?? suggestion.display ?? '';

  const nextValue = `${before}${replacement}${after}`;
  textarea.value = nextValue;
  const caret = before.length + replacement.length;
  textarea.setSelectionRange(caret, caret);

  state.tagSuggest.suppress = true;
  closeHashtagSuggestions();
  handleEditorInput({ target: textarea });
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

const updateFileSuggestions = (textarea = elements.editor) => {
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
  const textarea = elements.editor;
  if (!suggestion || !textarea) {
    return false;
  }

  const start = state.fileSuggest.start;
  const end = state.fileSuggest.end;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const replacement = suggestion.relativePath;

  const nextValue = `${before}${replacement}${after}`;
  textarea.value = nextValue;
  const caret = before.length + replacement.length;
  textarea.setSelectionRange(caret, caret);

  state.fileSuggest.suppress = true;
  closeFileSuggestions();
  handleEditorInput({ target: textarea });
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
  const suggestions = [];

  const generalVariants = buildQueryVariants(parsed.embedless);
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
  if (!value || caret === null || caret === undefined) {
    return null;
  }

  if (caret > value.length) {
    caret = value.length;
  }

  const before = value.slice(0, caret);
  
  // Check for !![[ first
  let lastOpen = before.lastIndexOf('!![[');
  let embedType = 'inline';
  if (lastOpen === -1) {
    // Check for ![[
    lastOpen = before.lastIndexOf('![[');
    embedType = true;
    if (lastOpen === -1) {
      // Check for [[
      lastOpen = before.lastIndexOf('[[');
      embedType = false;
      if (lastOpen === -1) {
        return null;
      }
    }
  }

  // For !![[, we need to check that it's not !!![[ or more
  if (embedType === 'inline' && lastOpen > 0 && before[lastOpen - 1] === '!') {
    // It's !!![[ or more, not valid
    return null;
  }

  // For ![[, check it's not !![[
  if (embedType === true && lastOpen > 0 && before[lastOpen - 1] === '!') {
    // It's !![[, which should be handled above
    return null;
  }

  // For [[, check it's not ![[ or !![[
  if (embedType === false && lastOpen > 0 && (before[lastOpen - 1] === '!' || (lastOpen > 1 && before[lastOpen - 2] === '!' && before[lastOpen - 1] === '!'))) {
    return null;
  }

  const openLength = embedType === 'inline' ? 4 : (embedType === true ? 3 : 2);
  const sinceOpen = before.slice(lastOpen + openLength);
  if (sinceOpen.includes(']]')) {
    return null;
  }

  if (sinceOpen.includes('|')) {
    return null;
  }

  if (sinceOpen.includes('\n')) {
    return null;
  }

  return {
    start: lastOpen + openLength,
    end: caret,
    query: sinceOpen,
    embed: embedType
  };
};

const openWikiSuggestions = (trigger, textarea) => {
  const items = collectWikiSuggestionItems(trigger.query);
  if (!items.length) {
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

const updateWikiSuggestions = (textarea = elements.editor, editorType = 'editor1') => {
  if (!textarea || textarea !== document.activeElement) {
    closeWikiSuggestions(editorType);
    return;
  }

  if (state.wikiSuggest.suppress) {
    state.wikiSuggest.suppress = false;
    closeWikiSuggestions(editorType);
    return;
  }

  const selectionStart = textarea.selectionStart ?? 0;
  const selectionEnd = textarea.selectionEnd ?? 0;
  if (selectionStart !== selectionEnd) {
    closeWikiSuggestions(editorType);
    return;
  }

  const trigger = getWikiSuggestionTrigger(textarea.value, selectionStart);
  if (!trigger) {
    closeWikiSuggestions(editorType);
    return;
  }

  if (state.wikiSuggest.open && trigger.start === state.wikiSuggest.start && trigger.query === state.wikiSuggest.query) {
    state.wikiSuggest.end = trigger.end;
    computeWikiSuggestionPosition(textarea, trigger.end, editorType);
    renderWikiSuggestions(editorType);
    return;
  }

  openWikiSuggestions(trigger, textarea);
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
  const textarea = elements.editor;
  if (!suggestion || !textarea) {
    return false;
  }

  const start = state.wikiSuggest.start;
  const end = state.wikiSuggest.end;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const replacement = suggestion.target;

  const nextValue = `${before}${replacement}${after}`;
  textarea.value = nextValue;
  const caret = before.length + replacement.length;
  textarea.setSelectionRange(caret, caret);

  state.wikiSuggest.suppress = true;
  closeWikiSuggestions();
  handleEditorInput({ target: textarea });
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
      const createdNote = state.notes.get(result.createdNoteId) ?? null;
      const createdTitle = createdNote?.title ?? fileName;
      setStatus(`${createdTitle} created.`, true);
      elements.editor?.focus({ preventScroll: true });
    } else {
      setStatus('File created. Select it from the explorer.', true);
    }

    return true;
  } catch (error) {
    console.error('Failed to create markdown file', error);
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
    if (activeNote && elements.editor) {
      elements.editor.value = activeNote.content ?? '';
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
    console.error('Failed to rename markdown file', error);
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

  const textarea = elements.editor;
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

  textarea.value = nextContent;
  textarea.focus({ preventScroll: true });
  const placeholderStart = start + (needsLeadingNewline ? 1 : 0) + openingLine.length + 1;
  const placeholderEnd = placeholderStart + placeholder.length;
  window.requestAnimationFrame(() => {
    textarea.setSelectionRange(placeholderStart, placeholderEnd);
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

  const textarea = elements.editor;
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

  textarea.value = newContent;
  textarea.focus({ preventScroll: true });
  
  // Restore selection with new position
  window.requestAnimationFrame(() => {
    textarea.setSelectionRange(newCursorPos.start, newCursorPos.end);
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
  
  // Focus back to editor
  if (elements.editor) {
    elements.editor.focus();
  }
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
  
  if (!elements.editor) {
    addChatMessage("Editor not available. Please try again.", 'assistant');
    return;
  }
  
  // Create a fake text with the command at the cursor position to simulate detection
  const cursorPos = elements.editor.selectionStart || elements.editor.value.length;
  const beforeCursor = elements.editor.value.slice(0, cursorPos);
  const afterCursor = elements.editor.value.slice(cursorPos);
  
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
    const currentValue = elements.editor.value;
    const newValue = currentValue.slice(0, cursorPos) + 
                    (needsNewline ? '\n' : '') + 
                    commandText + 
                    (trigger.consumedNewline ? '\n' : '') + 
                    currentValue.slice(cursorPos);
    
    elements.editor.value = newValue;
    
    // Now execute the command
    const success = applyInlineCommandTrigger(elements.editor, note, realTrigger);
    
    if (success) {
      addChatMessage(`Executed: ${commandText}`, 'assistant');
      // Close the chat after successful command execution
      setTimeout(() => {
        closeInlineChat();
      }, 1000);
    } else {
      // If command failed, revert the text insertion
      elements.editor.value = currentValue;
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
  if (!note || note.type !== 'markdown' || !elements.editor) {
    // Clear any existing command explanation
    if (state.currentCommandExplanation) {
      state.currentCommandExplanation = null;
      setStatus('Ready.', false, true); // Clear with command explanation flag
    }
    return;
  }

  const textarea = elements.editor;
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
  
  if (!elements.editor) {
    addChatMessage("Editor not available. Please try again.", 'assistant');
    return true;
  }
  
  // Get current cursor position
  const cursorPos = elements.editor.selectionStart || elements.editor.value.length;
  const beforeCursor = elements.editor.value.slice(0, cursorPos);
  const afterCursor = elements.editor.value.slice(cursorPos);
  
  // Create the inline command text
  const commandText = `&${parsedCommand.command} ${parsedCommand.args}`.trim();
  
  // Insert on a new line if needed
  const needsNewline = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
  const newValue = beforeCursor + 
                  (needsNewline ? '\n' : '') + 
                  commandText + 
                  afterCursor;
  
  // Update the editor
  elements.editor.value = newValue;
  
  // Position cursor at the end of the inserted command
  const newCursorPos = cursorPos + (needsNewline ? 1 : 0) + commandText.length;
  elements.editor.selectionStart = newCursorPos;
  elements.editor.selectionEnd = newCursorPos;
  
  // Focus the editor
  elements.editor.focus();
  
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
    elements.editor.dispatchEvent(enterEvent);
  }, 100);
  
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
    console.error('Export command error:', error);
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

  if (restoreFocus && elements.editor) {
    elements.editor.focus({ preventScroll: true });
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
  if (!event.metaKey) {
    return;
  }

  const key = event.key.toLowerCase();
  const target = event.target;
  const targetSupportsMatches = Boolean(target && typeof target.matches === 'function');
  const isEditorTarget = target === elements.editor;
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
    // Use current editor selection for CMD+E functionality
    const hasSelection = elements.editor && elements.editor.selectionStart !== elements.editor.selectionEnd;
    console.log('[handleGlobalShortcuts] Cmd+E pressed, hasSelection:', hasSelection, 'selectionStart:', elements.editor?.selectionStart, 'selectionEnd:', elements.editor?.selectionEnd);
    event.preventDefault();
    if (window.toggleMathWysiwyg) {
      window.toggleMathWysiwyg(hasSelection);
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
  } else if (key === 'i') {
    event.preventDefault();
    toggleInlineChat();
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
    const result = await window.api.loadWorkspaceAtPath({ folderPath });
    if (result) {
      adoptWorkspace(result);
      setStatus('Restored last workspace.', true);
    }
  } catch (error) {
    console.error('Failed to restore last workspace', error);
    persistLastWorkspaceFolder(null);
    setStatus('Could not reopen the last workspace folder.', false);
  }
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
      return window.katex.renderToString(content, { throwOnError: false, displayMode });
    } catch (error) {
      console.error('KaTeX failed to render expression', error, content);
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
  const blockTitle = blockEntry?.title ?? null;

  let display = alias;

  if (!display) {
    if (hasBlock) {
      if (blockTitle) {
        display = blockTitle;
      } else if (note?.title && labelDisplay) {
        display = `${note.title} · ^${labelDisplay}`;
      } else if (labelDisplay) {
        display = `^${labelDisplay}`;
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
    const blockMetaParts = [];
    if (note?.title) {
      blockMetaParts.push(note.title);
    }
    if (labelDisplay) {
      blockMetaParts.push(`^${labelDisplay}`);
    }
    if (blockMetaParts.length) {
      metaParts.push(blockMetaParts.join(' · '));
    }
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

  // For other types, fall back to regular embed
  return renderWikiEmbed(token, targetInfo, context);
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
        console.warn('Unknown context menu action:', action);
    }
  } catch (error) {
    console.error('Context menu action failed:', error);
    setStatus(`Failed to ${action} file: ${error.message}`, false);
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
    
    // If this was the active note, clear it
    if (state.activeNoteId === noteId) {
      state.activeNoteId = null;
    }

    // Reload the workspace
    await loadWorkspaceFolder(state.currentFolder);
    setStatus(`Deleted "${note.title}"`, true);
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

const initialize = () => {
  configureMarked();
  applyEditorRatio();
  renderWorkspaceTree();
  renderActiveNote();
  renderHashtagPanel();
  loadThemeSettings(); // Initialize theme on app start
  loadComponentSettings(); // Initialize component-specific settings
  
  // dual editor removed
  
  // Add platform class for platform-specific styling
  detectPlatform();

  elements.editor.addEventListener('input', handleEditorInput);
  elements.editor.addEventListener('keydown', handleEditorKeydown);
  elements.editor.addEventListener('keyup', handleEditorKeyup);
  elements.editor.addEventListener('click', handleEditorClick);
  elements.editor.addEventListener('focus', () => {
    updateWikiSuggestions(elements.editor);
    updateHashtagSuggestions(elements.editor);
  });
  elements.editor.addEventListener('blur', () => {
    persistNotes();
    // Hide math preview popup when editor loses focus
    if (elements.mathPreviewPopup) {
      elements.mathPreviewPopup.classList.remove('visible');
      elements.mathPreviewPopup.hidden = true;
    }
  });
  
  // Handle math preview popup on selection changes
  document.addEventListener('selectionchange', () => {
    if (document.activeElement === elements.editor) {
      updateMathPreview(elements.editor);
    } else {
      // Hide popup if editor is not focused
      if (elements.mathPreviewPopup) {
        elements.mathPreviewPopup.classList.remove('visible');
        elements.mathPreviewPopup.hidden = true;
      }
    }
  });
  elements.editor.addEventListener('blur', handleEditorBlur);
  elements.editor.addEventListener('scroll', handleEditorScroll);
  elements.editor.addEventListener('select', handleEditorSelect);

  // Drag and drop event listeners for first editor
  elements.editor.addEventListener('dragover', handleEditorDragOver);
  elements.editor.addEventListener('dragenter', handleEditorDragEnter);
  elements.editor.addEventListener('dragleave', handleEditorDragLeave);
  elements.editor.addEventListener('drop', handleEditor1Drop);

  // Also add drop listeners to the editor pane itself
  const editorPane = document.querySelector('.editor-pane');
  if (editorPane) {
    editorPane.addEventListener('dragover', handleEditorDragOver);
    editorPane.addEventListener('dragenter', handleEditorDragEnter);
    editorPane.addEventListener('dragleave', handleEditorDragLeave);
    editorPane.addEventListener('drop', handleEditor1Drop);
  }

  // second editor removed

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
  const mathOverlay = document.getElementById('editor-math-overlay');
  let mathOverlayEnabled = false;
  let mathOverlaySelectionOnly = false;
  let mathOverlayTimer = null;
  let previousMasked = '';

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

    // Use renderMarkdownToHtml to collect block-level source map information
    let collector = null;
    try {
      const result = renderMarkdownToHtml(content, null, { collectSourceMap: true });
      collector = result.collector;
    } catch (err) {
      collector = null;
    }

    // add block-level tokens from collector (if available)
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
        segments.push({ type: 'text', text: content.slice(last, mt.start - offset) });
      }
      segments.push(mt);
      last = mt.end;
    }
    if (last < content.length + offset) segments.push({ type: 'text', text: content.slice(last - offset) });
    return segments;
  };

  const renderEditorMathOverlay = (selectionOnly = false) => {
    if (!mathOverlay || !elements.editor) return;
    // use original content if masked, otherwise current editor value
    const fullContent = elements.editor.__originalContent ?? elements.editor.value ?? '';
    
    let content = fullContent;
    let offset = 0;
    let selectionStartLine = 0;
    let selectionEndLine = fullContent.length;
    
    console.log('[renderEditorMathOverlay] selectionOnly:', selectionOnly, 'activeSelections:', activeSelections);
    
    if (selectionOnly && activeSelections.length > 0) {
      // For multi-selection mode, we don't modify content/offset but check against all active selections
      content = fullContent;
      offset = 0;
    }
    
    // Build mirror content: use overlay segments that include block math, inline math, and headings
    const segments = buildOverlaySegments(content, offset);
    // debug: show segments when troubleshooting
    if (window.__debugMathOverlay) {
      console.debug('[math-overlay] segments:', segments.map((s) => ({ t: s.type, start: s.start, end: s.end, raw: (s.raw || '').slice(0, 40) })));
    }

    const frag = document.createDocumentFragment();
    segments.forEach((seg) => {
      // For selection-only mode, only render enhanced content (math, images, etc.) if the segment overlaps with any active selection
      const isInSelection = !selectionOnly || activeSelections.some(sel => 
        seg.start < sel.end && seg.end > sel.start
      );
      
      console.log('[renderEditorMathOverlay] segment:', seg.type, 'start:', seg.start, 'end:', seg.end, 'isInSelection:', isInSelection, 'text:', JSON.stringify(seg.text?.slice(0, 50)));
      
      if (seg.type === 'text') {
        const span = document.createElement('span');
        span.className = 'mirror-text';
        if (selectionOnly) {
          span.style.opacity = '0'; // transparent in selection-only mode
          span.style.pointerEvents = 'none'; // allow interaction with editor underneath
        }
        // Always show text, even outside selection in selection-only mode
        const escaped = seg.text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        span.innerHTML = escaped.replace(/\n/g, '<br>');
        frag.appendChild(span);
      } else if (seg.type === 'block' || seg.type === 'mathBlock') {
        if (isInSelection) {
          console.log('[renderEditorMathOverlay] rendering block math at position', seg.start, '-', seg.end, 'text:', JSON.stringify(seg.text));
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
          console.log('[renderEditorMathOverlay] block math wrapper created, adding click handler');
          wrapper.addEventListener('mousedown', (e) => {
            console.log('[renderEditorMathOverlay] block math mousedown at', e.clientX, e.clientY);
          });
          wrapper.addEventListener('click', (e) => {
            console.log('[renderEditorMathOverlay] block math clicked at', e.clientX, e.clientY, 'selecting range', seg.start, '-', seg.end);
            e.stopPropagation();
            // Set the editor selection to this math block range
            if (elements.editor) {
              elements.editor.focus();
              elements.editor.setSelectionRange(seg.start, seg.end);
            }
            // Remove all selections that overlap with this segment
            activeSelections = activeSelections.filter(sel => !(sel.start < seg.end && sel.end > seg.start));
            console.log('[renderEditorMathOverlay] remaining selections:', activeSelections);
            // Re-render overlay
            renderEditorMathOverlay(true);
            // Re-mask
            maskSelectedRanges(activeSelections);
            previousMasked = elements.editor.value;
          });
          frag.appendChild(wrapper);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          console.log('[renderEditorMathOverlay] rendering transparent block math');
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
          console.log('[renderEditorMathOverlay] rendering inline math');
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
            console.log('[renderEditorMathOverlay] inline math clicked, selecting range', seg.start, '-', seg.end);
            e.stopPropagation();
            // Set the editor selection to this math range
            if (elements.editor) {
              elements.editor.focus();
              elements.editor.setSelectionRange(seg.start, seg.end);
            }
            // Remove all selections that overlap with this segment
            activeSelections = activeSelections.filter(sel => !(sel.start < seg.end && sel.end > seg.start));
            // Re-render overlay
            renderEditorMathOverlay(true);
            // Re-mask
            maskSelectedRanges(activeSelections);
            previousMasked = elements.editor.value;
          });
          frag.appendChild(span);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          console.log('[renderEditorMathOverlay] rendering transparent inline math');
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
            video.addEventListener('mouseenter', () => { try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {} });
            video.addEventListener('mouseleave', () => { try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {} });
            video.addEventListener('touchstart', () => { try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
            video.addEventListener('touchend', () => { try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {} });
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
            video.addEventListener('mouseenter', () => { try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {} });
            video.addEventListener('mouseleave', () => { try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {} });
            video.addEventListener('touchstart', () => { try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
            video.addEventListener('touchend', () => { try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {} });
            video.addEventListener('touchend', () => { try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {} });
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
              try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {}
            });
            iframe.addEventListener('mouseleave', () => {
              try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {}
            });
            iframe.addEventListener('touchstart', () => { try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
            iframe.addEventListener('touchend', () => { try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {} });
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
              try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {}
            });
            iframe.addEventListener('mouseleave', () => {
              try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {}
            });
            iframe.addEventListener('touchstart', () => { try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
            iframe.addEventListener('touchend', () => { try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {} });
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
          h.innerHTML = `<strong>${escaped}</strong>`;
          frag.appendChild(h);
        } else if (selectionOnly) {
          // In selection-only mode, render transparent enhanced content to maintain layout
          const h = document.createElement('div');
          h.className = `editor-heading editor-heading--h${seg.level}`;
          h.style.opacity = '0';
          // render heading text as plain text (escaped)
          const escaped = seg.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          h.innerHTML = `<strong>${escaped}</strong>`;
          frag.appendChild(h);
        } else {
          // In full mode, don't render non-selected headings
        }
      }
    });

    mathOverlay.innerHTML = '';
    console.log('[renderEditorMathOverlay] clearing overlay and appending', frag.children.length, 'elements');
    console.log('[renderEditorMathOverlay] overlay element:', mathOverlay, 'hidden:', mathOverlay.hidden);
    console.log('[renderEditorMathOverlay] overlay bounding rect:', mathOverlay.getBoundingClientRect());
    console.log('[renderEditorMathOverlay] editor bounding rect:', elements.editor.getBoundingClientRect());
    mathOverlay.appendChild(frag);
    // ensure overlay scroll matches editor
    mathOverlay.scrollTop = elements.editor.scrollTop;
    console.log('[renderEditorMathOverlay] set overlay scrollTop to', elements.editor.scrollTop);
    // Resolve any iframe.html-embed-iframe[data-raw-src] inside the overlay (like preview)
    try {
      processOverlayHtmlIframes();
      processOverlayImages();
      processOverlayVideos();
    } catch (e) {
      // ignore
    }
  };

  const processOverlayHtmlIframes = async () => {
    if (!mathOverlay || typeof window.api?.resolveResource !== 'function') return;
    const iframes = Array.from(mathOverlay.querySelectorAll('iframe.html-embed-iframe[data-raw-src]'));
    if (!iframes.length) return;

    await Promise.all(iframes.map(async (iframe) => {
      const rawSrc = iframe.getAttribute('data-raw-src');
      if (!rawSrc) return;

      if (isLikelyExternalUrl(rawSrc) || rawSrc.startsWith('data:') || rawSrc.startsWith('blob:')) {
        iframe.src = rawSrc;
        // mark interactive and wire pointer handling
        try {
          iframe.classList.add('html-embed-iframe');
          iframe.style.pointerEvents = 'auto';
          // add helpers so the underlying textarea doesn't steal pointer events while interacting with iframe
          iframe.addEventListener('mouseenter', () => { try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {} });
          iframe.addEventListener('mouseleave', () => { try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {} });
          iframe.addEventListener('touchstart', () => { try { if (elements.editor) elements.editor.style.pointerEvents = 'none'; } catch (e) {} }, { passive: true });
          iframe.addEventListener('touchend', () => { try { if (elements.editor) elements.editor.style.pointerEvents = ''; } catch (e) {} });
        } catch (e) { /* ignore */ }
        iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
        return;
      }

      const noteId = iframe.getAttribute('data-note-id') || state.activeNoteId;
      const cacheKey = `${noteId ?? 'unknown'}::${rawSrc}`;
      if (htmlResourceCache.has(cacheKey)) {
        const cached = htmlResourceCache.get(cacheKey);
        if (cached) {
          iframe.src = cached;
          iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
        }
        return;
      }

      const note = noteId ? state.notes.get(noteId) ?? null : null;
      const payload = { src: rawSrc, notePath: note?.absolutePath ?? null, folderPath: note?.folderPath ?? state.currentFolder ?? null };
      try {
        const result = await window.api.resolveResource(payload);
        if (result?.value) {
          htmlResourceCache.set(cacheKey, result.value);
          iframe.src = result.value;
          iframe.onload = () => { if (window.autoResizeIframe) window.autoResizeIframe(iframe); };
        } else {
          htmlResourceCache.set(cacheKey, null);
        }
      } catch (err) {
        console.warn('Failed to resolve HTML resource (overlay)', rawSrc, err);
        htmlResourceCache.set(cacheKey, null);
      }
    }));
  };

  const processOverlayImages = async () => {
    if (!mathOverlay || typeof window.api?.resolveResource !== 'function') return;
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

      const noteId = img.getAttribute('data-note-id') || state.activeNoteId;
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
        console.warn('Failed to resolve image resource (overlay)', rawSrc, err);
        imageResourceCache.set(cacheKey, null);
      }
    }));
  };

  const processOverlayVideos = async () => {
    if (!mathOverlay || typeof window.api?.resolveResource !== 'function') return;
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

      const noteId = video.getAttribute('data-note-id') || state.activeNoteId;
      const cacheKey = `${noteId ?? 'unknown'}::${rawSrc}`;
      if (videoResourceCache.has(cacheKey)) {
        const cached = videoResourceCache.get(cacheKey);
        if (cached) video.src = cached;
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
        console.warn('Failed to resolve video resource (overlay)', rawSrc, err);
        videoResourceCache.set(cacheKey, null);
      }
    }));
  };

  // Masking math blocks in the textarea with invisible placeholders while overlay is active
  const maskMathInEditor = (selectionOnly = false) => {
    if (!elements.editor) return;
    const orig = elements.editor.value || '';
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
    elements.editor.__originalContent = orig;
    elements.editor.__maskedRanges = ranges;
    elements.editor.value = masked;
  };

  const maskSelectedRanges = (selections) => {
    console.log('[maskSelectedRanges] called with selections:', selections);
    if (!elements.editor || !elements.editor.__originalContent) {
      console.log('[maskSelectedRanges] no editor or original content');
      return;
    }
    let content = elements.editor.__originalContent;
    console.log('[maskSelectedRanges] original content length:', content.length);
    // Sort selections by start position descending to avoid offset issues when replacing
    const sorted = selections.slice().sort((a, b) => b.start - a.start);
    console.log('[maskSelectedRanges] sorted selections:', sorted);
    for (const sel of sorted) {
      const before = content.slice(0, sel.start);
      const after = content.slice(sel.end);
      const original = content.slice(sel.start, sel.end);
      const masked = original.replace(/[^\n]/g, '\u2800');
      console.log('[maskSelectedRanges] masking range', sel.start, '-', sel.end, 'original:', JSON.stringify(original), 'masked:', JSON.stringify(masked));
      content = before + masked + after;
    }
    console.log('[maskSelectedRanges] final masked content length:', content.length);
    elements.editor.value = content;
  };

  const isInMaskedRange = (pos) => {
    const ranges = elements.editor?.__maskedRanges || [];
    for (const r of ranges) {
      if (pos >= r.start && pos <= r.end) return r;
    }
    return null;
  };

  const unmaskEditor = () => {
    if (elements.editor && elements.editor.__originalContent !== undefined) {
      elements.editor.value = elements.editor.__originalContent;
      delete elements.editor.__originalContent;
      delete elements.editor.__maskedRanges;
    }
  };

  const handleBeforeInput = (ev) => {
    try {
      const start = elements.editor.selectionStart;
      const end = elements.editor.selectionEnd;
      const inStart = isInMaskedRange(start);
      const inEnd = isInMaskedRange(end);
      if (inStart || inEnd) {
        // prevent edits inside masked math; move caret to end of masked block
        ev.preventDefault();
        const r = inEnd || inStart;
        elements.editor.selectionStart = elements.editor.selectionEnd = r.end;
        return false;
      }
    } catch (e) {
      // ignore
    }
  };

  const enableMathOverlay = (selectionOnly = false) => {
    mathOverlayEnabled = true;
    mathOverlaySelectionOnly = selectionOnly;
    if (mathOverlay) {
      mathOverlay.hidden = false;
      mathOverlay.style.display = '';
      mathOverlay.setAttribute('aria-hidden', 'false');
        try { mathOverlay.style.pointerEvents = selectionOnly ? 'none' : 'auto'; } catch (e) {}
    }
    
    if (elements.editor) {
      if (selectionOnly) {
        // For selection-only mode, keep text visible but mask selected ranges
        elements.editor.__prevColor = elements.editor.style.color || '';
        elements.editor.__originalContent = elements.editor.value;
        // Store current selection before masking
        elements.editor.__storedSelection = { start: elements.editor.selectionStart, end: elements.editor.selectionEnd };
        // Don't make text transparent for selection-only mode
        elements.editor.style.caretColor = getComputedStyle(document.documentElement).getPropertyValue('--fg') || '#000';
        // Mask the selected ranges
        maskSelectedRanges(activeSelections);
        previousMasked = elements.editor.value;
      } else {
        // For full document mode, make text transparent so overlay shows through
        elements.editor.__prevColor = elements.editor.style.color || '';
        elements.editor.style.color = 'transparent';
        elements.editor.style.caretColor = getComputedStyle(document.documentElement).getPropertyValue('--fg') || '#000';
      }
      
      // sync scroll
      elements.editor.addEventListener('scroll', syncOverlayScroll);
  // allow overlay interactions to scroll the editor: listen for wheel and touch events on overlay
  mathOverlay.addEventListener('wheel', overlayWheelHandler, { passive: false });
  mathOverlay.addEventListener('touchstart', overlayTouchStart, { passive: true });
  mathOverlay.addEventListener('touchmove', overlayTouchMove, { passive: false });
  // If user interacts directly with overlay scrollbar or scrollbar thumb, forward overlay scroll to editor
  mathOverlay.addEventListener('scroll', overlayScrollHandler);
      // mask math segments in editor so they temporarily disappear (only for full mode)
      if (!selectionOnly) {
        maskMathInEditor(selectionOnly);
        // Prevent user from editing masked regions
        elements.editor.addEventListener('beforeinput', handleBeforeInput, { capture: true });
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
    if (mathOverlay) {
      mathOverlay.hidden = true;
      mathOverlay.style.display = 'none';
      mathOverlay.setAttribute('aria-hidden', 'true');
      mathOverlay.innerHTML = '';
        try { mathOverlay.style.pointerEvents = 'none'; } catch (e) {}
    }
    if (elements.editor) {
      // restore editor content and styles
      unmaskEditor();
      elements.editor.style.color = elements.editor.__prevColor || '';
      elements.editor.style.caretColor = '';
      // Restore stored selection if any
      if (elements.editor.__storedSelection) {
        elements.editor.selectionStart = elements.editor.__storedSelection.start;
        elements.editor.selectionEnd = elements.editor.__storedSelection.end;
        delete elements.editor.__storedSelection;
      }
      elements.editor.removeEventListener('scroll', syncOverlayScroll);
      if (mathOverlay) {
  mathOverlay.removeEventListener('wheel', overlayWheelHandler, { passive: false });
  mathOverlay.removeEventListener('touchstart', overlayTouchStart, { passive: true });
  mathOverlay.removeEventListener('touchmove', overlayTouchMove, { passive: false });
  mathOverlay.removeEventListener('scroll', overlayScrollHandler);
      }
      elements.editor.removeEventListener('beforeinput', handleBeforeInput, { capture: true });
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
      const selectionDetected = hasSelection !== null ? hasSelection : (elements.editor && elements.editor.selectionStart !== elements.editor.selectionEnd);
      console.log('[toggleMathWysiwyg] overlay enabled, selectionDetected:', selectionDetected, 'mathOverlaySelectionOnly:', mathOverlaySelectionOnly, 'activeSelections:', activeSelections);
      
      if (selectionDetected) {
        if (!mathOverlaySelectionOnly) {
          // Currently in full mode, switch to selection-only mode
          console.log('[toggleMathWysiwyg] switching from full to selection-only mode');
          disableMathOverlay();
          // Add the current selection
          const currentSelection = {
            start: elements.editor.selectionStart,
            end: elements.editor.selectionEnd
          };
          console.log('[toggleMathWysiwyg] initial selection for selection-only mode:', currentSelection);
          activeSelections = [currentSelection];
          enableMathOverlay(true);
        } else {
          // Already in selection-only mode, toggle this selection in active selections
          const currentSelection = {
            start: elements.editor.selectionStart,
            end: elements.editor.selectionEnd
          };
          console.log('[toggleMathWysiwyg] current selection detected:', currentSelection, 'editor value length:', elements.editor.value.length);
          // Check if this selection already exists
          const existingIndex = activeSelections.findIndex(sel => 
            sel.start === currentSelection.start && sel.end === currentSelection.end
          );
          if (existingIndex !== -1) {
            // Remove the existing selection
            activeSelections.splice(existingIndex, 1);
            console.log('[toggleMathWysiwyg] removed selection from activeSelections:', currentSelection, 'total:', activeSelections.length);
            if (activeSelections.length === 0) {
              // No more selections, disable overlay
              console.log('[toggleMathWysiwyg] no more selections, disabling overlay');
              disableMathOverlay();
              return;
            } else {
              // Update masking for remaining selections
              maskSelectedRanges(activeSelections);
            }
          } else {
            // Add the new selection
            activeSelections.push(currentSelection);
            console.log('[toggleMathWysiwyg] added selection to activeSelections:', currentSelection, 'total:', activeSelections.length);
            // Update masking
            maskSelectedRanges(activeSelections);
          }
          // Re-render with updated selections
          renderEditorMathOverlay(true);
        }
        closeMathPanel();
      } else {
        // No selection, disable overlay
        console.log('[toggleMathWysiwyg] disabling overlay (no selection)');
        disableMathOverlay();
        mathWysiwygButton?.setAttribute('aria-pressed', 'false');
        mathWysiwygButton?.classList.remove('active');
        const icon = mathWysiwygButton?.querySelector('.icon');
        if (icon) icon.textContent = '∑';
        closeMathPanel();
      }
    } else {
      // Overlay not enabled, enable it
      const selectionDetected = hasSelection !== null ? hasSelection : (elements.editor && elements.editor.selectionStart !== elements.editor.selectionEnd);
      console.log('[toggleMathWysiwyg] enabling overlay, selectionDetected:', selectionDetected);
      
      if (selectionDetected && elements.editor) {
        const currentSelection = {
          start: elements.editor.selectionStart,
          end: elements.editor.selectionEnd
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
    if (!mathOverlay || !elements.editor) return;
    mathOverlay.scrollTop = elements.editor.scrollTop;
    mathOverlay.scrollLeft = elements.editor.scrollLeft;
  };

  // Forward wheel events that occur on the overlay to the editor textarea so users can scroll
  // when interacting with overlay content (e.g., embedded iframes).
  let lastTouchY = 0;
  const overlayWheelHandler = (ev) => {
    try {
      if (!elements.editor) return;
      // If the event target is an element that should handle its own scroll (like an iframe),
      // allow default behavior. We only intercept when the overlay itself or inert elements are targeted.
      const target = ev.target;
      if (target && (target.tagName === 'IFRAME' || target.closest && target.closest('iframe'))) {
        // let iframe handle wheel normally; but also sync editor scroll if needed
        return;
      }
      ev.preventDefault();
      // Scroll the overlay by the wheel delta. This lets the overlay scroll even when it's taller
      // than the underlying textarea content. We'll then sync the editor position proportionally.
      if (mathOverlay) {
        mathOverlay.scrollTop += ev.deltaY;
        // Call overlay scroll handler to propagate proportional scroll to the editor
        overlayScrollHandler();
      }
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
      if (!mathOverlay || !ev.touches || ev.touches.length === 0) return;
      // If the touch originated inside an iframe, don't intercept
      const target = ev.target;
      if (target && (target.tagName === 'IFRAME' || target.closest && target.closest('iframe'))) return;
      const y = ev.touches[0].clientY;
      const dy = lastTouchY - y;
      if (Math.abs(dy) > 0) {
        ev.preventDefault();
        // Scroll the overlay itself and let the overlayScrollHandler map it proportionally
        if (mathOverlay) {
          mathOverlay.scrollTop += dy;
          overlayScrollHandler();
        }
      }
      lastTouchY = y;
    } catch (e) {
      // ignore
    }
  };

  const overlayScrollHandler = (ev) => {
    try {
      if (!mathOverlay || !elements.editor) return;
      // Map overlay scroll position to editor scroll proportionally so the editor follows
      // even when overlay.scrollHeight != editor.scrollHeight.
      const overlayTop = mathOverlay.scrollTop || 0;
      const overlayScrollable = Math.max(0, mathOverlay.scrollHeight - mathOverlay.clientHeight);
      const editorScrollable = Math.max(0, elements.editor.scrollHeight - elements.editor.clientHeight);

      if (overlayScrollable <= 0 || editorScrollable <= 0) {
        // Fallback to direct mapping when one side isn't scrollable
        if (Math.abs(overlayTop - (elements.editor.scrollTop || 0)) > 2) {
          elements.editor.scrollTop = overlayTop;
        }
        return;
      }

      const ratio = overlayTop / overlayScrollable;
      const targetEditorTop = Math.round(ratio * editorScrollable);
      if (Math.abs((elements.editor.scrollTop || 0) - targetEditorTop) > 2) {
        elements.editor.scrollTop = targetEditorTop;
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

  // Update overlay while editing (debounced)
  elements.editor?.addEventListener('input', () => {
    if (!mathOverlayEnabled) return;
    if (mathOverlayTimer) clearTimeout(mathOverlayTimer);
    mathOverlayTimer = setTimeout(() => {
      renderEditorMathOverlay(mathOverlaySelectionOnly);
      // Re-apply masking for selection-only mode after content changes
      if (mathOverlaySelectionOnly && activeSelections.length > 0) {
        const currentMasked = elements.editor.value;
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
              elements.editor.__originalContent = elements.editor.__originalContent.slice(0, diffPos) + diffChar + elements.editor.__originalContent.slice(diffPos);
            } else if (diffType === 'delete') {
              elements.editor.__originalContent = elements.editor.__originalContent.slice(0, diffPos) + elements.editor.__originalContent.slice(diffPos + 1);
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

        // Preserve cursor position during masking
        const savedStart = elements.editor.selectionStart;
        const savedEnd = elements.editor.selectionEnd;
        maskSelectedRanges(activeSelections);
        previousMasked = elements.editor.value;
        // Restore cursor position, clamped to new content length
        const newLength = elements.editor.value.length;
        elements.editor.selectionStart = Math.min(savedStart, newLength);
        elements.editor.selectionEnd = Math.min(savedEnd, newLength);
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
    const editor = elements.editor;
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
  elements.renameFileForm?.addEventListener('submit', handleRenameFileFormSubmit);
  elements.renameFileInput?.addEventListener('keydown', handleRenameInputKeydown);
  elements.renameFileInput?.addEventListener('blur', handleRenameInputBlur);
  elements.insertCodeBlockButton?.addEventListener('click', handleInsertCodeBlockButton);
  elements.exportPreviewButton?.addEventListener('click', handleExportPreviewClick);
  elements.exportPreviewHtmlButton?.addEventListener('click', handleExportPreviewHtmlClick);
  
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
  elements.checkUpdatesButton?.addEventListener('click', checkForUpdatesManually);
  elements.themeSelect?.addEventListener('change', handleThemeChange);
  elements.bgColorPicker?.addEventListener('change', handleBgColorChange);
  elements.resetBgColorButton?.addEventListener('click', resetBgColor);
  elements.fontFamilySelect?.addEventListener('change', handleFontFamilyChange);
  elements.fontSizeSlider?.addEventListener('input', handleFontSizeChange);
  elements.resetFontSizeButton?.addEventListener('click', resetFontSize);
  elements.resetFontFamilyButton?.addEventListener('click', resetFontFamily);
  elements.textColorPicker?.addEventListener('change', handleTextColorChange);
  elements.resetTextColorButton?.addEventListener('click', resetTextColor);
  elements.borderColorPicker?.addEventListener('change', handleBorderColorChange);
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

  elements.openFolderButtons.forEach((button) => {
    button.addEventListener('click', handleOpenFolder);
  });

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
  
  console.log('Auto-resizing iframe:', iframe.src || iframe.dataset.rawSrc);
  
  // Function to attempt resize
  const attemptResize = () => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      if (iframeDoc && iframeDoc.body) {
        // Wait a bit more for content to render
        setTimeout(() => {
          try {
            const contentHeight = Math.max(
              iframeDoc.body.scrollHeight,
              iframeDoc.body.offsetHeight,
              iframeDoc.documentElement.clientHeight,
              iframeDoc.documentElement.scrollHeight,
              iframeDoc.documentElement.offsetHeight
            );
            
            // Set height with some padding, ensuring minimum
            const finalHeight = Math.min(Math.max(contentHeight + 40, 400), 1200);
            iframe.style.height = finalHeight + 'px';
            console.log('Iframe resized to:', finalHeight + 'px', 'Content height was:', contentHeight);
          } catch (e) {
            console.log('Failed to resize iframe:', e);
          }
        }, 200);
        return true;
      }
    } catch (e) {
      console.log('Cross-origin iframe, using postMessage approach');
      // For cross-origin or file:// protocol, set a larger default height
      iframe.style.height = '800px';
      return false;
    }
    return false;
  };
  
  // Try immediate resize
  if (!attemptResize()) {
    // Try after delays for dynamic content
    setTimeout(attemptResize, 500);
    setTimeout(attemptResize, 1000);
    setTimeout(attemptResize, 2000);
  }
};

// Listen for resize messages from iframes
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'iframe-resize') {
    console.log('Received resize message:', event.data);
    
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
      console.log('Iframe resized via postMessage to:', finalHeight + 'px');
    }
  }
});

// Update notification functionality
const updateNotification = document.getElementById('update-notification');
const updateMessage = document.querySelector('.update-notification__message');
const updateProgress = document.querySelector('.update-notification__progress');
const updateProgressFill = document.querySelector('.update-notification__progress-fill');
const updateProgressText = document.querySelector('.update-notification__progress-text');
const updateDownloadButton = document.getElementById('update-download-button');
const updateInstallButton = document.getElementById('update-install-button');
const updateDismissButton = document.getElementById('update-dismiss-button');

// Listen for update events from main process
window.api.on('update-available', (info) => {
  updateMessage.textContent = `Version ${info.version} is available for download.`;
  updateNotification.hidden = false;
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
  updateMessage.textContent = `Version ${info.version} has been downloaded and is ready to install.`;
});

// Handle update actions
updateDownloadButton.addEventListener('click', async () => {
  updateDownloadButton.disabled = true;
  updateDownloadButton.textContent = 'Downloading...';
  try {
    // Prefer direct method if available, fall back to invoke-style if present
    if (window.api && typeof window.api.checkForUpdates === 'function') {
      await window.api.checkForUpdates();
    } else if (window.api && typeof window.api.invoke === 'function') {
      await window.api.invoke('app:checkForUpdates');
    } else {
      throw new Error('Update API unavailable');
    }
  } catch (error) {
    console.error('Error starting download:', error);
    updateDownloadButton.disabled = false;
    updateDownloadButton.textContent = 'Download';
  }
});

updateInstallButton.addEventListener('click', async () => {
  if (window.api && typeof window.api.quitAndInstall === 'function') {
    await window.api.quitAndInstall();
  } else if (window.api && typeof window.api.invoke === 'function') {
    await window.api.invoke('app:quitAndInstall');
  }
});

updateDismissButton.addEventListener('click', () => {
  updateNotification.hidden = true;
});

// Check for updates on app startup (only once)
window.addEventListener('load', async () => {
  try {
    if (window.api && typeof window.api.checkForUpdates === 'function') {
      await window.api.checkForUpdates();
    } else if (window.api && typeof window.api.invoke === 'function') {
      await window.api.invoke('app:checkForUpdates');
    }
  } catch (error) {
    console.log('Startup update check failed:', error);
  }
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
    console.warn('computeCenteredTrafficLightCoords: failed to calculate coords, using fallback', err);
  }

  // Debug output so we can verify values during testing
  try {
    console.info('Computed centered traffic light coords', JSON.stringify({ x: centerX, y }));
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
            console.warn('Font import failed', resp && resp.error);
          }
        } else {
          console.warn('fontImporter importFont is not available');
        }
      } catch (err) {
        console.error('Failed to import font:', err);
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
  console.log('Applying traffic light position:', position);
  
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
        console.info('Computed centered traffic light coords:', payload);
      } catch (err) {
        console.warn('Failed to compute centered traffic light coordinates, falling back to string mode', err);
        payload = 'center';
      }
    }

    window.api.setTrafficLightPosition(payload).then(result => {
      console.log('Traffic light position result:', result);
      if (!result.success) {
        console.warn('Failed to set traffic light position:', result.reason || result.error);
      }
    }).catch(error => {
      console.error('Error setting traffic light position:', error);
    });
  } else {
    console.warn('Traffic light positioning API not available');
  }
}

function applyTrafficLightOffset(offset) {
  console.log('Applying traffic light offset:', offset);
  
  // Store the setting
  localStorage.setItem('trafficLightOffset', offset);
  // If the user chose to center the traffic lights, ignore offset changes.
  const currentPosition = localStorage.getItem('trafficLightPosition') || 'center';
  if (currentPosition === 'center') {
    console.log('Ignoring traffic light offset because position is set to "center"');
    // Re-apply center position to the main process in case offset previously moved them.
    if (window.api && window.api.setTrafficLightPosition) {
      const payload = computeCenteredTrafficLightCoords();
      console.info('Re-applying computed centered coords after ignoring offset:', payload);
      window.api.setTrafficLightPosition(payload).then(result => {
        console.log('Re-applied center traffic light position after ignoring offset:', result);
      }).catch(err => {
        console.error('Failed to re-apply center traffic light position:', err);
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
      console.log('Traffic light offset result:', result);
      if (!result.success) {
        console.warn('Failed to set traffic light offset:', result.reason || result.error);
      }
    }).catch(error => {
      console.error('Error setting traffic light offset:', error);
    });
  } else {
    console.warn('Traffic light offset API not available');
  }
}

function showTrafficLightWarning() {
  // Only show once per session
  if (!window.trafficLightWarningShown) {
    console.info('Traffic light controls require implementation in the Electron main process');
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
    console.error('Failed to get app version:', error);
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
    #note-editor textarea {
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
  
  if (titleElement && currentNotePath) {
    if (showPath) {
      // Show full path
      titleElement.textContent = currentNotePath;
    } else {
      // Show only filename
      const fileName = currentNotePath.split('/').pop() || 'Untitled';
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
  if (elements.checkUpdatesButton) {
    const originalText = elements.checkUpdatesButton.textContent;
    elements.checkUpdatesButton.disabled = true;
    elements.checkUpdatesButton.textContent = 'Checking...';
    
    try {
      // Check if running in development mode
      let version = 'Unknown';
      if (window.api && typeof window.api.getVersion === 'function') {
        version = await window.api.getVersion();
      } else if (window.api && typeof window.api.invoke === 'function') {
        version = await window.api.invoke('app:getVersion');
      }
      if (String(version).includes('dev') || process.env.NODE_ENV === 'development') {
        elements.checkUpdatesButton.textContent = 'Dev Mode - N/A';
        setTimeout(() => {
          elements.checkUpdatesButton.disabled = false;
          elements.checkUpdatesButton.textContent = originalText;
        }, 2000);
        return;
      }
      
      if (window.api && typeof window.api.checkForUpdates === 'function') {
        await window.api.checkForUpdates();
      } else if (window.api && typeof window.api.invoke === 'function') {
        await window.api.invoke('app:checkForUpdates');
      }
      elements.checkUpdatesButton.textContent = 'Check Complete';
      setTimeout(() => {
        elements.checkUpdatesButton.disabled = false;
        elements.checkUpdatesButton.textContent = originalText;
      }, 2000);
    } catch (error) {
      console.error('Manual update check failed:', error);
      
      // Check if it's a development mode error
      if (error.message && error.message.includes('not packed')) {
        elements.checkUpdatesButton.textContent = 'Dev Mode Only';
      } else {
        elements.checkUpdatesButton.textContent = 'Check Failed';
      }
      
      setTimeout(() => {
        elements.checkUpdatesButton.disabled = false;
        elements.checkUpdatesButton.textContent = originalText;
      }, 2000);
    }
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
      console.error('Import failed:', error);
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
    console.error('Failed to copy settings:', err);
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

      // Create a larger preview of the image
      elements.mathPreviewPopupContent.innerHTML = `<img src="${src}" alt="Preview" style="max-width: 300px; max-height: 300px; object-fit: contain; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" onload="this.style.display='block';" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=color:#6c757d;text-align:center;>Image not found</div>';">`;

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

initialize();

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
  
  // Add global keydown listener for keybindings
  document.addEventListener('keydown', handleKeybinding);
}

function updateHighContrastMode(enabled) {
  if (enabled) {
    document.body.setAttribute('data-high-contrast', 'true');
  } else {
    document.body.removeAttribute('data-high-contrast');
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
  const html = elements.preview.innerHTML;
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
    console.error(`Export failed:`, error);
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

// Initialize export handlers when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExportHandlers);
} else {
  initializeExportHandlers();
}

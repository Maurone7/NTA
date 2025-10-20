/* eslint-disable no-empty, no-unused-vars */
// Tree module: encapsulates workspace tree rendering and helpers
module.exports = ({ state, elements, imageExtensions, videoExtensions, htmlExtensions }) => {
  // External action callbacks supplied by the main app when initializing the
  // module. These allow the tree module to delegate operations like opening
  // notes, performing cut/copy/paste, and other app-level behaviors without
  // importing app internals directly.
  let actions = {};

  // Initialize the module with callbacks. This will attach event listeners
  // to the workspace tree and context menu. Callers should pass only the
  // functions the module needs (they are optional and will be checked).
  const init = (providedActions = {}) => {
    actions = providedActions || {};

    // Attach tree event listeners (click/contextmenu/drag). If the app has
    // already wired these listeners we avoid double-attaching by checking
    // for a marker attribute on the tree root.
    try {
      const root = elements.workspaceTree;
      if (!root) return;
      if (root._nta_tree_inited) return;
      root._nta_tree_inited = true;

      // Delegate click handling to the host app if it provides a handler
      root.addEventListener('click', (e) => {
        try { if (actions.handleWorkspaceTreeClick) actions.handleWorkspaceTreeClick(e); } catch (err) { /* ignore */ }
      });
      root.addEventListener('contextmenu', handleWorkspaceTreeContextMenu);
      root.addEventListener('dragstart', handleTreeNodeDragStart);
      root.addEventListener('dragend', handleTreeNodeDragEnd);

      // Context menu wiring
      if (elements.workspaceContextMenu) {
        elements.workspaceContextMenu.addEventListener('click', handleContextMenuClick);
        document.addEventListener('keydown', handleContextMenuKeyDown);
        document.addEventListener('click', handleGlobalClick);
      }
    } catch (e) {
      // Best-effort: don't throw when init fails in test environments
    }
  };
  const workspaceNodeContainsActive = (node) => {
    if (!node) return false;
    if (node.type === 'file') return node.noteId === state.activeNoteId;
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
      // Default top-level directories (depth 0) to expanded on first render so
      // tests and UX see children immediately. Deeper levels respect the stored state.
      const collapsed = depth === 0 ? false : state.collapsedFolders.has(node.path);
      const hasChildren = Array.isArray(node.children) && node.children.length;
      element.dataset.hasChildren = hasChildren ? 'true' : 'false';
      if (collapsed) {
        element.classList.add('tree-node--collapsed');
      }
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
        icon.textContent = '∑';
      } else if (node.ext === '.pdf') {
        icon.textContent = '📄';
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
        element.draggable = true;
        if (node.noteId === state.activeNoteId) {
          element.classList.add('tree-node--active');
          element.setAttribute('aria-selected', 'true');
        }
      } else {
        try {
          if (node.path) {
            for (const [nid, n] of state.notes.entries()) {
              try {
                if (n && (n.absolutePath === node.path || n.storedPath === node.path || n.absolutePath === node.path)) {
                  element.dataset.noteId = nid;
                  element.draggable = true;
                  if (nid === state.activeNoteId) {
                    element.classList.add('tree-node--active');
                    element.setAttribute('aria-selected', 'true');
                  }
                  node.supported = true;
                  break;
                }
              } catch (e) { /* per-note ignore */ }
            }
          }
        } catch (e) { /* ignore fallback errors */ }

        if (!node.supported) {
          element.classList.add('tree-node--unsupported');
          element.setAttribute('aria-disabled', 'true');
        }
      }
    }

    return element;
  };

  const renderWorkspaceTree = () => {
    if (!elements.workspaceTree || !elements.workspaceEmpty) return;

    const treeData = state.tree ?? null;
    const rootChildren = Array.isArray(treeData?.children) ? treeData.children : [];

    console.log('renderWorkspaceTree: treeData =', treeData);
    console.log('renderWorkspaceTree: rootChildren.length =', rootChildren.length);

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
      emptyMessage.textContent = 'No files found in this folder.';
      elements.workspaceTree.replaceChildren(emptyMessage);
      elements.workspaceTree.hidden = false;
      return;
    }

    const fragment = document.createDocumentFragment();
    rootChildren.forEach((child) => {
      fragment.appendChild(createWorkspaceTreeNode(child, 0));
    });

    elements.workspaceTree.replaceChildren(fragment);
    // Normalize active selection: ensure only the active note node is highlighted
    try {
      const activeId = state.activeNoteId;
      const previouslyActive = elements.workspaceTree.querySelectorAll('.tree-node--active');
      previouslyActive.forEach((n) => {
        try { n.classList.remove('tree-node--active'); n.removeAttribute('aria-selected'); } catch (e) {}
      });
      if (activeId) {
        const sel = `[data-note-id="${activeId}"]`;
        const nodeEl = elements.workspaceTree.querySelector(sel);
        if (nodeEl) {
          nodeEl.classList.add('tree-node--active');
          nodeEl.setAttribute('aria-selected', 'true');
          let p = nodeEl.parentElement;
          while (p && p !== elements.workspaceTree) {
            try {
              if (p.classList && p.classList.contains('tree-node--directory')) {
                p.classList.remove('tree-node--collapsed');
                p.setAttribute('aria-expanded', 'true');
              }
            } catch (e) {}
            p = p.parentElement;
          }
        }
      }
    } catch (e) {}

    elements.workspaceTree.hidden = false;
    elements.workspaceEmpty.hidden = true;
  };

  // ----------------------- Event handlers & context menu ------------------
  // These are intentionally colocated with the tree rendering logic so
  // that all workspace-tree concern live in one module. They call back to
  // the host application via the `actions` object when performing app-level
  // operations (open, cut/copy/paste, rename, reveal, delete, status).

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

    try { event.dataTransfer.setData('text/noteId', noteId); } catch (e) {}
    try { event.dataTransfer.effectAllowed = 'copy'; } catch (e) {}
    try { nodeElement.classList.add('tree-node--dragging'); } catch (e) {}
    try { document.querySelectorAll('.pdf-pane-viewer').forEach((f) => { f.style.pointerEvents = 'none'; }); } catch (e) {}
  };

  const handleTreeNodeDragEnd = (event) => {
    const nodeElement = event.target.closest('.tree-node');
    if (nodeElement) nodeElement.classList.remove('tree-node--dragging');
    try { document.querySelectorAll('.pdf-pane-viewer').forEach((f) => { f.style.pointerEvents = ''; }); } catch (e) {}
  };

  const openContextMenu = (noteId, x, y) => {
    if (!elements.workspaceContextMenu) return;
    state.contextMenu.open = true;
    state.contextMenu.targetNoteId = noteId;
    state.contextMenu.x = x;
    state.contextMenu.y = y;

    const menu = elements.workspaceContextMenu;
    const note = noteId ? state.notes.get(noteId) : null;

    // Enable/disable menu items using action callbacks when available
    const setDisabled = (selector, disabled) => {
      try {
        const btn = menu.querySelector(selector);
        if (btn) btn.disabled = !!disabled;
      } catch (e) {}
    };

    setDisabled('[data-action="cut"]', !(actions.canCutCopyNote ? actions.canCutCopyNote(note) : false));
    setDisabled('[data-action="copy"]', !(actions.canCutCopyNote ? actions.canCutCopyNote(note) : false));
    setDisabled('[data-action="paste"]', !(actions.canPasteNote ? actions.canPasteNote() : false));
    setDisabled('[data-action="rename"]', !(actions.canRenameNote ? actions.canRenameNote(note) : false));
    setDisabled('[data-action="reveal"]', !(note && note.absolutePath));
    setDisabled('[data-action="delete"]', !(actions.canDeleteNote ? actions.canDeleteNote(note) : false));

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.hidden = false;
    menu.setAttribute('aria-hidden', 'false');
  };

  const closeContextMenu = () => {
    if (!elements.workspaceContextMenu || !state.contextMenu.open) return;
    state.contextMenu.open = false;
    state.contextMenu.targetNoteId = null;
    const menu = elements.workspaceContextMenu;
    menu.hidden = true;
    menu.setAttribute('aria-hidden', 'true');
  };

  const handleContextMenuAction = async (action) => {
    const noteId = state.contextMenu.targetNoteId;
    if (!noteId) return;
    const note = state.notes.get(noteId);
    if (!note) return;
    closeContextMenu();
    try {
      switch (action) {
      case 'cut':
        if (actions.canCutCopyNote && actions.canCutCopyNote(note)) actions.cutNote && actions.cutNote(noteId);
        break;
      case 'copy':
        if (actions.canCutCopyNote && actions.canCutCopyNote(note)) actions.copyNote && actions.copyNote(noteId);
        break;
      case 'paste':
        if (actions.canPasteNote && actions.canPasteNote()) actions.pasteNote && await actions.pasteNote();
        break;
      case 'rename':
        if (actions.canRenameNote && actions.canRenameNote(note)) actions.startRenameFile && actions.startRenameFile(noteId);
        break;
      case 'reveal':
        if (note.absolutePath && actions.revealInFinder) actions.revealInFinder(note.absolutePath);
        break;
      case 'delete':
        if (actions.canDeleteNote && actions.canDeleteNote(note) && confirm(`Are you sure you want to delete "${note.title}"?`)) {
          actions.deleteNote && await actions.deleteNote(noteId);
        }
        break;
      default:
      }
    } catch (error) {
      try { actions.setStatus && actions.setStatus(String(error), false); } catch (e) {}
    }
  };

  const handleWorkspaceTreeContextMenu = (event) => {
    try {
      event.preventDefault();
      const treeNode = event.target.closest('.tree-node');
      const x = event.clientX;
      const y = event.clientY;
      if (!treeNode || !treeNode.dataset.noteId) {
        if (actions.canPasteNote && actions.canPasteNote()) {
          openContextMenu(null, x, y);
        } else {
          closeContextMenu();
        }
        return;
      }
      const noteId = treeNode.dataset.noteId;
      openContextMenu(noteId, x, y);
    } catch (e) {}
  };

  const handleContextMenuClick = (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    event.preventDefault();
    const action = button.dataset.action;
    if (action) handleContextMenuAction(action);
  };

  const handleContextMenuKeyDown = (event) => {
    if (!state.contextMenu.open) return;
    const menu = elements.workspaceContextMenu;
    if (!menu) return;
    const buttons = Array.from(menu.querySelectorAll('button:not([disabled])'));
    const currentIndex = buttons.indexOf(document.activeElement);
    switch (event.key) {
    case 'Escape':
      event.preventDefault();
      closeContextMenu();
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (currentIndex < buttons.length - 1) buttons[currentIndex + 1].focus(); else buttons[0].focus();
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (currentIndex > 0) buttons[currentIndex - 1].focus(); else buttons[buttons.length - 1].focus();
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (document.activeElement && document.activeElement.dataset.action) handleContextMenuAction(document.activeElement.dataset.action);
      break;
    }
  };

  const handleGlobalClick = (event) => {
    if (state.contextMenu.open && !event.target.closest('#workspace-context-menu')) closeContextMenu();
  };


  return {
    workspaceNodeContainsActive,
    createWorkspaceTreeNode,
    renderWorkspaceTree
  };
};

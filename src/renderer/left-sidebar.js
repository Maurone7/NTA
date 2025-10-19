// Left sidebar helper: centralizes wiring for the workspace explorer (left sidebar)
module.exports = ({ state, elements, treeModule, windowApi, adoptWorkspace, renderWorkspaceTree }) => {
  // Wire open-folder button(s)
  const wireOpenFolderButtons = () => {
    try {
      const buttons = elements.openFolderButtons || [];
      Array.from(buttons).forEach((btn) => {
        try {
          btn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
              if (windowApi && typeof windowApi.chooseFolder === 'function') {
                const result = await windowApi.chooseFolder();
                if (result && result.folderPath) {
                  // ask main process to load
                  if (windowApi && typeof windowApi.loadWorkspaceAtPath === 'function') {
                    try {
                      const payload = await windowApi.loadWorkspaceAtPath({ folderPath: result.folderPath });
                      if (payload) {
                        if (typeof adoptWorkspace === 'function') {
                          try { adoptWorkspace(payload); } catch (e) { /* ignore */ }
                        } else if (window && window.api && typeof window.api.onWorkspaceChanged === 'function') {
                          // Attempt to notify via the standard IPC callback if adopt not provided
                          try { window.api.onWorkspaceChanged && window.api.onWorkspaceChanged(payload); } catch (e) { }
                        }
                      }
                    } catch (err) { /* ignore */ }
                  }
                }
              }
            } catch (err) { }
          });
        } catch (e) {}
      });
    } catch (e) {}
  };

  const wireToggleSidebar = () => {
    try {
      const btn = elements.toggleSidebarButton;
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        try {
          const collapsed = !document.documentElement.classList.contains('sidebar-collapsed');
          document.documentElement.classList.toggle('sidebar-collapsed', collapsed);
          try { localStorage.setItem('NTA.sidebarCollapsed', collapsed ? 'true' : 'false'); } catch (err) {}
          btn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
        } catch (err) { }
      });
    } catch (e) {}
  };

  // Expose a small public API for left-sidebar interactions
  const init = () => {
    try {
      wireOpenFolderButtons();
      wireToggleSidebar();
      // Ensure tree module is initialized (treeModule.init called from app.js normally)
      if (treeModule && typeof treeModule.init === 'function') {
        try { treeModule.init(); } catch (e) { /* ignore - app may initialize with actions */ }
      }
      // Make folder chevrons act like dropdown toggles (click + keyboard)
      try {
        const root = elements.workspaceTree;
        if (root && typeof root.addEventListener === 'function') {
          // Click on chevron toggles collapsed state
          root.addEventListener('click', (ev) => {
            try {
              const chevron = ev.target && ev.target.closest ? ev.target.closest('.tree-node__chevron') : null;
              if (!chevron) return;
              const nodeEl = chevron.closest('.tree-node--directory') || chevron.closest('.tree-node');
              if (!nodeEl) return;
              const path = nodeEl.dataset.path;
              if (!path) return;
              try {
                if (state.collapsedFolders.has(path)) state.collapsedFolders.delete(path); else state.collapsedFolders.add(path);
              } catch (e) {}
              try { ev.stopImmediatePropagation(); } catch (e) {}
              // Re-render via treeModule when possible
              try { if (treeModule && typeof treeModule.renderWorkspaceTree === 'function') { treeModule.renderWorkspaceTree(); } else if (typeof renderWorkspaceTree === 'function') { renderWorkspaceTree(); } } catch (e) {}
            } catch (e) {}
          }, { passive: true });

          // Click on the directory label should also toggle expansion.
          // When treeModule is available, use re-render for consistency.
          // When treeModule is absent (e.g., tests), use in-place DOM creation.
          const findNodeByPath = (p) => {
            try {
              const root = state.tree;
              if (!root || !p) return null;
              const stack = [root];
              while (stack.length) {
                const node = stack.pop();
                if (!node) continue;
                if (node.path === p) return node;
                if (Array.isArray(node.children)) {
                  for (let i = 0; i < node.children.length; i++) stack.push(node.children[i]);
                }
              }
            } catch (e) {}
            return null;
          };

          root.addEventListener('click', (ev) => {
            try {
              const label = ev.target && ev.target.closest ? ev.target.closest('.tree-node__label') : null;
              if (!label) return;
              const nodeEl = label.parentElement;
              if (!nodeEl) return;
              // Some renderers (fallback in app.js) don't set dataset.nodeType;
              // fall back to checking CSS class for directory nodes.
              let nodeType = nodeEl.dataset.nodeType;
              if (!nodeType) {
                try {
                  if (nodeEl.classList && nodeEl.classList.contains('tree-node--directory')) nodeType = 'directory';
                  else if (nodeEl.classList && nodeEl.classList.contains('tree-node--file')) nodeType = 'file';
                } catch (e) { nodeType = null; }
              }
              if (nodeType !== 'directory') return;
              const path = nodeEl.dataset.path;
              if (!path) return;

              if (treeModule && typeof treeModule.renderWorkspaceTree === 'function') {
                // Toggle collapsed state and re-render for consistency
                if (state.collapsedFolders.has(path)) {
                  state.collapsedFolders.delete(path);
                } else {
                  state.collapsedFolders.add(path);
                }
                treeModule.renderWorkspaceTree();
                try { ev.stopImmediatePropagation(); } catch (e) {}
                return;
              }

              // Fallback to in-place DOM manipulation when treeModule is absent (e.g., tests)
              // If children container already exists, just toggle visibility
              let childrenContainer = nodeEl.querySelector('.tree-node__children');
              const isCollapsed = !!state.collapsedFolders.has(path);
              if (childrenContainer) {
                try {
                  if (isCollapsed) {
                    // expand
                    state.collapsedFolders.delete(path);
                    childrenContainer.hidden = false;
                    nodeEl.classList.remove('tree-node--collapsed');
                    nodeEl.setAttribute('aria-expanded', 'true');
                    const chevron = nodeEl.querySelector('.tree-node__chevron'); if (chevron) chevron.textContent = '▾';
                  } else {
                    // collapse
                    state.collapsedFolders.add(path);
                    childrenContainer.hidden = true;
                    nodeEl.classList.add('tree-node--collapsed');
                    nodeEl.setAttribute('aria-expanded', 'false');
                    const chevron = nodeEl.querySelector('.tree-node__chevron'); if (chevron) chevron.textContent = '▸';
                  }
                } catch (e) {}
                try { ev.stopPropagation(); } catch (e) {}
                return;
              }

              // No children container in DOM yet: attempt to create it from
              // in-memory tree data so nested files are visible immediately.
              try {
                const nodeData = findNodeByPath(path);
                // debug log removed
                if (!nodeData || !Array.isArray(nodeData.children) || nodeData.children.length === 0) {
                  // Nothing to render
                  // debug log removed
                  try { ev.stopPropagation(); } catch (e) {}
                  return;
                }

                // Build children container and append child nodes (use treeModule helper when available)
                childrenContainer = document.createElement('div');
                childrenContainer.className = 'tree-node__children';
                childrenContainer.setAttribute('role', 'group');
                try {
                  if (treeModule && typeof treeModule.createWorkspaceTreeNode === 'function') {
                    nodeData.children.forEach((child) => {
                      try { childrenContainer.appendChild(treeModule.createWorkspaceTreeNode(child, 1)); } catch (e) {}
                    });
                  } else {
                    nodeData.children.forEach((child) => {
                      try {
                        const el = document.createElement('div');
                        el.className = 'tree-node';
                        // Set explicit nodeType so left-sidebar click handlers recognize directories/files
                        el.dataset.nodeType = child.type === 'file' ? 'file' : 'directory';
                        el.dataset.path = child.path || '';
                        el.style.setProperty('--depth', 1);

                        const label2 = document.createElement('div');
                        label2.className = 'tree-node__label';

                        if (child.type === 'directory') {
                          el.classList.add('tree-node--directory');
                          const collapsedChild = state.collapsedFolders.has(child.path);
                          if (collapsedChild) el.classList.add('tree-node--collapsed');
                          if (Array.isArray(child.children) && child.children.length) {
                            el.dataset.hasChildren = 'true';
                            el.setAttribute('aria-expanded', collapsedChild ? 'false' : 'true');
                          }
                          const chev = document.createElement('span'); chev.className = 'tree-node__chevron'; chev.textContent = (Array.isArray(child.children) && child.children.length) ? (collapsedChild ? '▸' : '▾') : ' ';
                          label2.appendChild(chev);
                        } else {
                          el.classList.add('tree-node--file');
                          const icon = document.createElement('span'); icon.className = 'tree-node__icon'; icon.textContent = '•';
                          label2.appendChild(icon);
                        }

                        const name = document.createElement('span'); name.className = 'tree-node__name'; name.textContent = child.name || child.path || '';
                        label2.appendChild(name);
                        el.appendChild(label2);

                        // If directory has children and it's not collapsed, render children container recursively
                        if (child.type === 'directory' && Array.isArray(child.children) && child.children.length && !state.collapsedFolders.has(child.path)) {
                          const innerChildren = document.createElement('div');
                          innerChildren.className = 'tree-node__children';
                          innerChildren.setAttribute('role', 'group');
                          child.children.forEach((c2) => {
                            try {
                              // Use treeModule helper if available for deeper nodes
                              if (treeModule && typeof treeModule.createWorkspaceTreeNode === 'function') {
                                innerChildren.appendChild(treeModule.createWorkspaceTreeNode(c2, 2));
                              } else {
                                const el2 = document.createElement('div');
                                el2.className = 'tree-node ' + (c2.type === 'file' ? 'tree-node--file' : 'tree-node--directory');
                                el2.dataset.nodeType = c2.type === 'file' ? 'file' : 'directory';
                                el2.dataset.path = c2.path || '';
                                el2.style.setProperty('--depth', 2);
                                const label3 = document.createElement('div'); label3.className = 'tree-node__label';
                                const name3 = document.createElement('span'); name3.className = 'tree-node__name'; name3.textContent = c2.name || c2.path || '';
                                label3.appendChild(name3);
                                el2.appendChild(label3);
                                innerChildren.appendChild(el2);
                              }
                            } catch (e) {}
                          });
                          el.appendChild(innerChildren);
                        }

                        childrenContainer.appendChild(el);
                      } catch (e) {}
                    });
                  }
                } catch (e) {}

                try {
                  nodeEl.appendChild(childrenContainer);
                  nodeEl.classList.remove('tree-node--collapsed');
                  nodeEl.setAttribute('aria-expanded', 'true');
                  const chevron = nodeEl.querySelector('.tree-node__chevron'); if (chevron) chevron.textContent = '▾';
                  state.collapsedFolders.delete(path);
                } catch (e) {}
              } catch (e) {}

              try { ev.stopImmediatePropagation(); } catch (e) {}
            } catch (e) {}
          }, { passive: false });

          // Keyboard accessibility: Enter/Space on chevron or label toggles
          root.addEventListener('keydown', (ev) => {
            try {
              if (ev.key !== 'Enter' && ev.key !== ' ') return;
              const focused = document.activeElement;
              if (!focused) return;
              const chevron = focused.classList && focused.classList.contains('tree-node__chevron') ? focused : focused.querySelector && focused.querySelector('.tree-node__chevron');
              if (!chevron) return;
              ev.preventDefault();
              const nodeEl = chevron.closest('.tree-node--directory') || chevron.closest('.tree-node');
              if (!nodeEl) return;
              const path = nodeEl.dataset.path;
              if (!path) return;
              try {
                if (state.collapsedFolders.has(path)) state.collapsedFolders.delete(path); else state.collapsedFolders.add(path);
              } catch (e) {}
              try { if (treeModule && typeof treeModule.renderWorkspaceTree === 'function') treeModule.renderWorkspaceTree(); else if (typeof renderWorkspaceTree === 'function') renderWorkspaceTree(); } catch (e) {}
            } catch (e) {}
          }, { passive: false });
        }
      } catch (e) {}
    } catch (e) { }
  };

  const updateWorkspacePath = (folderPath) => {
    try {
      if (elements.workspacePath) {
        elements.workspacePath.textContent = folderPath ? String(folderPath) : 'No folder open';
        elements.workspacePath.classList.toggle('no-folder', !folderPath);
      }
    } catch (e) {}
  };

  // UI-only updates for workspace adoption. Kept here so left-sidebar owns
  // all DOM manipulations related to the explorer UI (visibility, labels).
  const updateWorkspaceUI = (payload) => {
    try {
      if (payload?.folderPath) {
        try { if (elements.workspacePath) { elements.workspacePath.classList.remove('no-folder'); } } catch (e) {}
        try { elements.workspaceTree && (elements.workspaceTree.hidden = false); } catch (e) {}
        try { elements.workspaceEmpty && (elements.workspaceEmpty.hidden = true); } catch (e) {}
        try { if (elements.workspaceTree && elements.workspacePath && elements.workspacePath.textContent) elements.workspaceTree.setAttribute('aria-label', `Workspace files for ${elements.workspacePath.textContent}`); } catch (e) {}
      } else {
        try { if (elements.workspacePath) elements.workspacePath.textContent = 'No folder open'; } catch (e) {}
        try { if (elements.workspacePath) elements.workspacePath.classList.add('no-folder'); } catch (e) {}
        try { elements.workspaceTree && (elements.workspaceTree.hidden = true); } catch (e) {}
        try { elements.workspaceEmpty && (elements.workspaceEmpty.hidden = false); } catch (e) {}
      }
    } catch (e) { /* swallow UI errors */ }
  };

  return { init, updateWorkspacePath, updateWorkspaceUI };
};

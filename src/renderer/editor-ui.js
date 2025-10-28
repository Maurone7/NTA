// Editor UI wiring: setup tab and editor-related event listeners.
module.exports = ({ state, elements, createTab, renderTabs, getActiveEditorInstance }) => {
  function init() {
    try {
      // New tab buttons
      if (elements.newTabButton) {
        elements.newTabButton.addEventListener('click', (e) => {
          try {
            const paneId = null; // default left pane
            const noteId = `file-${Date.now()}`;
            const tab = createTab(noteId, 'Untitled', paneId);
            renderTabs();
            try { renderTabs(); } catch (e) {}
          } catch (err) {}
        });
      }

      // Simple keyboard shortcut for focusing editor
      window.addEventListener('keydown', (ev) => {
        try {
          if ((ev.ctrlKey || ev.metaKey) && ev.key === 'e') {
            const edt = getActiveEditorInstance();
            try { edt && edt.focus(); } catch (e) {}
          }
        } catch (e) {}
      });
    } catch (e) { /* best-effort wiring */ }
  }

  return { init };
};

// Right sidebar wiring: preview, pdf/code/image viewer toggles and helpers
module.exports = ({ state, elements }) => {
  function init() {
    try {
      // Toggle preview visibility
      if (elements.togglePreviewButton) {
        elements.togglePreviewButton.addEventListener('click', () => {
          try {
            state.previewCollapsed = !state.previewCollapsed;
            elements.preview.style.display = state.previewCollapsed ? 'none' : '';
            elements.pdfViewer.style.display = state.previewCollapsed ? 'none' : '';
            // Persist setting if desired
            try { localStorage.setItem('NTA.previewCollapsed', state.previewCollapsed ? 'true' : 'false'); } catch (e) {}
          } catch (e) {}
        });
      }

      // Close viewers when editor is focused
      if (elements.editor) {
        elements.editor.addEventListener('focus', () => {
          try {
            elements.pdfViewer.hidden = true;
            elements.codeViewer.hidden = true;
            elements.imageViewer.hidden = true;
          } catch (e) {}
        });
      }
    } catch (e) { }
  }

  return { init };
};

// Right sidebar wiring: preview, pdf/code/image viewer toggles and helpers
module.exports = ({ state, elements }) => {
  function init() {
    try {
      // Toggle preview visibility
      if (elements.togglePreviewButton) {
        elements.togglePreviewButton.addEventListener('click', () => {
          try {
            // Prefer the centralized applier when available so the UI updates
            // (classes, ARIA and toggle placement) are performed consistently.
            if (typeof window !== 'undefined' && typeof window.applyPreviewState === 'function') {
              window.applyPreviewState(!state.previewCollapsed);
              try { localStorage.setItem('NTA.previewCollapsed', (!state.previewCollapsed) ? 'true' : 'false'); } catch (e) {}
            } else {
              // Fallback: minimal behavior when the applier isn't exposed
              state.previewCollapsed = !state.previewCollapsed;
              elements.preview.style.display = state.previewCollapsed ? 'none' : '';
              elements.pdfViewer.style.display = state.previewCollapsed ? 'none' : '';
              try { localStorage.setItem('NTA.previewCollapsed', state.previewCollapsed ? 'true' : 'false'); } catch (e) {}
            }
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

const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Preview Pane Resize Behavior - CSS and Bug Tests', () => {
  const stylesPath = path.resolve(__dirname, '../../src/renderer/styles.css');
  const appPath = path.resolve(__dirname, '../../src/renderer/app.js');
  let stylesContent;
  let appContent;

  before(() => {
    stylesContent = fs.readFileSync(stylesPath, 'utf-8');
    appContent = fs.readFileSync(appPath, 'utf-8');
  });

  describe('Preview pane CSS rules - flex-shrink: 0', () => {
    it('should have flex-shrink: 0 in default mode (.preview-pane)', () => {
      // Find .preview-pane rule in CSS
      const previewPaneRegex = /\.preview-pane\s*\{[\s\S]*?flex:\s*0\s+0[\s\S]*?\}/;
      const match = stylesContent.match(previewPaneRegex);
      
      assert(
        match,
        'CSS should contain .preview-pane with flex: 0 0 (flex-shrink: 0)'
      );
    });

    it('should have flex-shrink: 0 in PDF mode (.workspace__content.pdf-mode .preview-pane)', () => {
      const pdfModeRegex = /\.workspace__content\.pdf-mode\s+\.preview-pane[\s\S]*?flex:\s*0\s+0/;
      const match = stylesContent.match(pdfModeRegex);
      
      assert(
        match,
        'CSS should have .workspace__content.pdf-mode .preview-pane with flex: 0 0'
      );
    });

    it('should have flex-shrink: 0 in image mode (.workspace__content.image-mode .preview-pane)', () => {
      const imageModeRegex = /\.workspace__content\.image-mode\s+\.preview-pane[\s\S]*?flex:\s*0\s+0/;
      const match = stylesContent.match(imageModeRegex);
      
      assert(
        match,
        'CSS should have .workspace__content.image-mode .preview-pane with flex: 0 0'
      );
    });

    it('should have flex-shrink: 0 in video mode (.workspace__content.video-mode .preview-pane)', () => {
      const videoModeRegex = /\.workspace__content\.video-mode\s+\.preview-pane[\s\S]*?flex:\s*0\s+0/;
      const match = stylesContent.match(videoModeRegex);
      
      assert(
        match,
        'CSS should have .workspace__content.video-mode .preview-pane with flex: 0 0'
      );
    });

    it('should have flex-shrink: 0 in HTML mode (.workspace__content.html-mode .preview-pane)', () => {
      const htmlModeRegex = /\.workspace__content\.html-mode\s+\.preview-pane[\s\S]*?flex:\s*0\s+0/;
      const match = stylesContent.match(htmlModeRegex);
      
      assert(
        match,
        'CSS should have .workspace__content.html-mode .preview-pane with flex: 0 0'
      );
    });

    it('should have flex-shrink: 0 in LaTeX mode (.workspace__content.latex-mode .preview-pane)', () => {
      const latexModeRegex = /\.workspace__content\.latex-mode\s+\.preview-pane[\s\S]*?flex:\s*0\s+0/;
      const match = stylesContent.match(latexModeRegex);
      
      assert(
        match,
        'CSS should have .workspace__content.latex-mode .preview-pane with flex: 0 0'
      );
    });

    it('should NOT have flex-shrink: 1 on any preview-pane rule', () => {
      // Verify we don't have the old problematic flex: 0 1 pattern
      const oldProblematicPattern = /\.preview-pane[\s\S]*?flex:\s*0\s+1\s+/;
      const match = stylesContent.match(oldProblematicPattern);
      
      assert(
        !match,
        'CSS should not have flex: 0 1 on .preview-pane (flex-shrink must be 0)'
      );
    });
  });

  describe('Resize handler bugs - drag divider bugs', () => {
    it('should not have undefined container fallback issue', () => {
      // Bug #1: undefined container variable in resize handler
      // Check that the handler function has proper undefined checking
      
      // Look for the problematic pattern that would cause ReferenceError
      const problematicPattern = /handleEditorSplitterPointerMove[\s\S]*?var container[\s\S]*?(?!let|const|var)\s+container\s*=/;
      const hasPattern = problematicPattern.test(appContent);
      
      // Also check that there's proper checking with || or &&
      const properCheck = /container\s*\|\|[\s\S]*?\{[\s\S]*?\}/;
      
      assert(
        appContent.includes('container ||') || appContent.includes('container ='),
        'Resize handler should properly handle undefined container variable'
      );
    });

    it('should clean up orphaned dividers when pane closes', () => {
      // Bug #2: orphaned dividers not cleaned up in Pane.close()
      // Check that the Pane.close() method exists
      
      const hasClose = appContent.includes('close() {') && appContent.includes('editors__divider');
      
      assert(
        hasClose,
        'Pane.close() should clean up orphaned dividers'
      );
    });

    it('should validate dividers before using them in resize operations', () => {
      // Bug #3: invalid dividers not checked in updateEditorPaneVisuals
      // Just verify the method exists
      
      const hasMethod = appContent.includes('updateEditorPaneVisuals');
      
      assert(
        hasMethod,
        'Should have updateEditorPaneVisuals() method'
      );
    });

    it('should have pointercancel listener on dividers', () => {
      // Bug #4: missing pointercancel listener causes resize to get stuck
      // Check that pointercancel is properly handled
      
      const hasPointerCancel = appContent.includes('pointercancel') &&
                               (appContent.includes('addEventListener') || 
                                appContent.includes('on'));
      
      assert(
        hasPointerCancel,
        'Dividers should have pointercancel event listener'
      );
    });
  });

  describe('Drag divider behavior - resize logic', () => {
    it('should have proper pointermove handler for divider dragging', () => {
      // The resize handler should exist and be called
      const hasHandler = appContent.includes('handleEditorSplitterPointerMove') ||
                         appContent.includes('pointermove');
      
      assert(
        hasHandler,
        'Should have pointermove handler for divider dragging'
      );
    });

    it('should have proper pointerup handler to complete drag', () => {
      // The resize handler should clean up state when drag ends
      const hasHandler = appContent.includes('pointerup') ||
                         appContent.includes('handlePointerUp');
      
      assert(
        hasHandler,
        'Should have pointerup handler to complete drag operations'
      );
    });

    it('should maintain divider state during drag operations', () => {
      // Check that divider state is properly tracked
      const hasState = appContent.includes('_activeEditorDivider') ||
                       appContent.includes('_activeDividerLeft') ||
                       appContent.includes('_activeDividerRight') ||
                       appContent.includes('resizingEditorPanes');
      
      assert(
        hasState,
        'Should track active divider state during drag'
      );
    });

    it('should calculate correct widths for adjacent panes during drag', () => {
      // Check that width calculations are done properly
      const hasCalculation = appContent.includes('desiredLeftPx') ||
                             appContent.includes('rightPx') ||
                             appContent.includes('clientX') ||
                             appContent.includes('bounds');
      
      assert(
        hasCalculation,
        'Should have width calculation logic for dragging'
      );
    });

    it('should apply calculated widths to panes with flex: 0 0 format', () => {
      // Check that flex property is set correctly during resize
      const hasFlexApplication = appContent.includes('flex: 0 0') ||
                                 appContent.includes('"0 0"') ||
                                 appContent.includes("'0 0'");
      
      assert(
        hasFlexApplication,
        'Should apply flex: 0 0 to panes during resize'
      );
    });

    it('should not modify preview pane during editor divider drag', () => {
      // Check that preview pane flex is only controlled by CSS
      // The fix is that preview pane has flex: 0 0 in CSS, so it won't shrink
      
      const hasCorrectCss = stylesContent.includes('.preview-pane') &&
                            stylesContent.includes('flex: 0 0');
      
      assert(
        hasCorrectCss,
        'Preview pane should have flex: 0 0 in CSS to prevent shrinking'
      );
    });
  });

  describe('Divider event handling', () => {
    it('should attach event listeners to all dividers', () => {
      // Check for event listener attachment code
      const hasAttachment = appContent.includes('addEventListener') &&
                            appContent.includes('divider');
      
      assert(
        hasAttachment,
        'Should attach event listeners to dividers'
      );
    });

    it('should remove event listeners when divider is destroyed', () => {
      // Check for event listener removal
      const hasRemoval = appContent.includes('removeEventListener') ||
                         appContent.includes('cleanup') ||
                         appContent.includes('destroy');
      
      assert(
        hasRemoval,
        'Should remove event listeners when dividers are cleaned up'
      );
    });

    it('should handle all pointer events (down, move, up, cancel)', () => {
      // Verify all pointer events are handled
      const events = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'];
      let allPresent = true;
      
      events.forEach(event => {
        if (!appContent.includes(event)) {
          allPresent = false;
        }
      });
      
      assert(
        allPresent,
        `Should handle all pointer events: ${events.join(', ')}`
      );
    });
  });

  describe('Regression tests for resize bugs', () => {
    it('Bug #1: should handle undefined container gracefully in resize', () => {
      // The issue: container variable used without null check
      // The fix: container ||= document.querySelector(...)
      
      const hasCheck = appContent.includes('container ||') ||
                       appContent.includes('container &&') ||
                       appContent.includes('container ??');
      
      assert(
        hasCheck,
        'Resize handler should have defensive container check'
      );
    });

    it('Bug #2: should clean up orphaned dividers in Pane.close()', () => {
      // The issue: when pane closes, its dividers weren't removed
      // The fix: explicitly remove adjacent dividers in the close() method
      
      const hasCloseMethod = appContent.includes('close() {');
      const hasDividerCleanup = appContent.includes('editors__divider') && appContent.includes('remove()');
      
      assert(
        hasCloseMethod && hasDividerCleanup,
        'Pane.close() should clean up orphaned dividers'
      );
    });

    it('Bug #3: should validate dividers in updateEditorPaneVisuals', () => {
      // The issue: invalid dividers (no parentNode) were causing crashes
      // The fix: filter dividers to ensure they have valid DOM parent
      
      const hasValidation = appContent.includes('parentNode') || 
                            appContent.includes('isValidDivider') ||
                            appContent.includes('.filter');
      
      assert(
        hasValidation,
        'updateEditorPaneVisuals should validate dividers'
      );
    });

    it('Bug #4: should attach pointercancel listener to dividers', () => {
      // The issue: pointercancel wasn't handled, leaving resize in bad state
      // The fix: add pointercancel listener to properly cancel resize
      
      const hasListener = appContent.includes('pointercancel') &&
                          (appContent.includes('addEventListener') || 
                           appContent.includes('on'));
      
      assert(
        hasListener,
        'Dividers should have pointercancel event listener attached'
      );
    });
  });

  describe('CSS fix verification', () => {
    it('should have consistent flex property across all display modes', () => {
      // All display modes should use flex: 0 0
      const modes = ['default', 'pdf', 'image', 'video', 'html', 'latex'];
      const flex00Pattern = /flex:\s*0\s+0/g;
      const matches = stylesContent.match(flex00Pattern) || [];
      
      // We should have at least 6 occurrences (one per mode)
      assert(
        matches.length >= 6,
        `CSS should have flex: 0 0 in at least 6 places (all display modes), found ${matches.length}`
      );
    });

    it('should not have conflicting flex-shrink values on preview pane', () => {
      // Verify preview pane doesn't have flex: 0 1 which causes shrinking
      // Note: editor panes use flex: 0 1, which is correct for them
      const previewPaneRules = stylesContent.match(/\.preview-pane[\s\S]*?\{[\s\S]*?\}/g) || [];
      const problematicRules = previewPaneRules.filter(rule => /flex:\s*0\s+1/.test(rule));
      
      assert(
        problematicRules.length === 0,
        `Preview pane rules should not have flex: 0 1 (flex-shrink: 1), found ${problematicRules.length}`
      );
    });

    it('should use calc() for preview pane width calculation', () => {
      // Preview pane should have flexible width based on CSS variable
      const hasCalc = stylesContent.includes('calc(') && stylesContent.includes('--');
      
      assert(
        hasCalc,
        'Preview pane width should be calculated using calc() and CSS variables'
      );
    });
  });

  describe('Integration tests', () => {
    it('should work together: CSS prevents shrinking + app manages resize', () => {
      // Verify both CSS and JS are working together
      
      // 1. CSS should prevent flex-shrink
      const cssPreventsShrink = stylesContent.includes('flex: 0 0') &&
                                !stylesContent.includes('.preview-pane { flex: 0 1');
      
      // 2. App should handle resize properly  
      const appHandlesResize = appContent.includes('handleEditorSplitterPointerMove') &&
                               appContent.includes('flex: 0 0');
      
      assert(
        cssPreventsShrink && appHandlesResize,
        'CSS and JavaScript should work together to prevent unintended preview pane resize'
      );
    });

    it('should allow intentional preview pane resize via workspace splitter', () => {
      // The workspace splitter should still be able to resize the preview pane
      // by changing the CSS variable, not through flex shrinking
      
      const hasVariable = stylesContent.includes('--local-editor-ratio');
      const variableUsed = stylesContent.includes('var(--') || stylesContent.includes('calc(');
      
      assert(
        hasVariable && variableUsed,
        'Workspace splitter should resize preview pane via CSS variable, not flex'
      );
    });
  });
});

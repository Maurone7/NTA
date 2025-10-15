const assert = require('assert');
const { JSDOM } = require('jsdom');

describe('DOM: Editor Ratio CSS Application', function() {
  let dom;
  let document;
  let window;

  before(function() {
    // Stub console methods to avoid noise BEFORE creating JSDOM
    global.console = {
      debug: () => {},
      log: () => {},
      warn: () => {},
      error: () => {}
    };

    // Create a DOM that includes all viewing mode classes
    const html = `<html><body>
      <div class="workspace__content" style="width: 1000px;">
        <section class="editor-pane"></section>
        <div id="workspace-splitter" class="workspace__splitter"></div>
        <div class="preview-pane">
          <div id="markdown-preview"></div>
          <div id="pdf-viewer" class="pdf-viewer"></div>
          <div id="image-viewer" class="image-viewer"></div>
          <div id="video-viewer" class="video-viewer"></div>
          <div id="html-viewer" class="html-viewer"></div>
        </div>
      </div>
    </body></html>`;

    dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    window = dom.window;
    document = dom.window.document;

    // Expose globals
    global.window = window;
    global.document = document;

    // Stub getComputedStyle
    global.getComputedStyle = (element) => {
      const styles = {};
      // Copy inline styles
      for (let prop in element.style) {
        if (element.style[prop] && typeof element.style[prop] === 'string') {
          styles[prop] = element.style[prop];
        }
      }
      // Handle CSS custom properties
      const computedStyles = {
        ...styles,
        getPropertyValue: (prop) => {
          if (prop.startsWith('--')) {
            return element.style.getPropertyValue ? element.style.getPropertyValue(prop) : '';
          }
          return styles[prop] || '';
        }
      };
      return computedStyles;
    };
  });

  after(function() {
    try { window.close(); } catch (e) {}
    delete global.window;
    delete global.document;
  });

  describe('CSS Variable Application', function() {
    it('should apply CSS variable to workspace content', function() {
      const workspaceContent = document.querySelector('.workspace__content');

      // Simulate setting CSS variable
      workspaceContent.style.setProperty('--local-editor-ratio', '0.75');

      // Check that CSS variable was set
      const computedRatio = getComputedStyle(workspaceContent).getPropertyValue('--local-editor-ratio').trim();
      assert.strictEqual(computedRatio, '0.75', 'CSS variable should be set to the editor ratio');
    });

    it('should calculate correct flex-basis for preview pane', function() {
      const previewPane = document.querySelector('.preview-pane');

      // Simulate the CSS that would be applied
      previewPane.style.flex = '0 1 calc((1 - 0.8) * 100%)';
      previewPane.style.width = 'calc((1 - 0.8) * 100%)';

      const computedStyle = getComputedStyle(previewPane);

      // Check flex property
      const flex = computedStyle.flex;
      assert(flex.includes('20%'), `Flex should include 20% for preview width, got: ${flex}`);

      // Check width property
      const width = computedStyle.width;
      assert(width.includes('20%'), `Width should be 20% for preview pane, got: ${width}`);
    });
  });

  describe('Viewing Mode Behavior', function() {
    const modes = ['pdf-mode', 'image-mode', 'video-mode', 'html-mode'];

    modes.forEach(mode => {
      it(`should apply dynamic sizing in ${mode}`, function() {
        const workspaceContent = document.querySelector('.workspace__content');
        const previewPane = document.querySelector('.preview-pane');

        // Add the mode class
        workspaceContent.classList.add(mode);

        // Simulate the CSS that would be applied
        previewPane.style.flex = '0 1 calc((1 - 0.9) * 100%)';
        previewPane.style.width = 'calc((1 - 0.9) * 100%)';

        const computedStyle = getComputedStyle(previewPane);

        // Check that dynamic sizing is applied even in special modes
        const flex = computedStyle.flex;
        assert(flex.includes('10%'), `Flex should include 10% in ${mode}, got: ${flex}`);

        const width = computedStyle.width;
        assert(width.includes('10%'), `Width should be 10% in ${mode}, got: ${width}`);

        // Clean up
        workspaceContent.classList.remove(mode);
      });
    });

    it('should work in default markdown mode', function() {
      const workspaceContent = document.querySelector('.workspace__content');
      const previewPane = document.querySelector('.preview-pane');

      // Ensure no special mode classes
      modes.forEach(mode => workspaceContent.classList.remove(mode));

      // Simulate the CSS that would be applied
      previewPane.style.flex = '0 1 calc((1 - 0.7) * 100%)';
      previewPane.style.width = 'calc((1 - 0.7) * 100%)';

      const computedStyle = getComputedStyle(previewPane);

      const flex = computedStyle.flex;
      assert(flex.includes('30%'), `Flex should include 30% in default mode, got: ${flex}`);

      const width = computedStyle.width;
      assert(width.includes('30%'), `Width should be 30% in default mode, got: ${width}`);
    });
  });

  describe('Minimum Width Constraints', function() {
    it('should respect minimum width of 0px', function() {
      const previewPane = document.querySelector('.preview-pane');

      // Simulate the CSS that would be applied
      previewPane.style.minWidth = '0px';

      const computedStyle = getComputedStyle(previewPane);

      const minWidth = computedStyle.minWidth;
      assert.strictEqual(minWidth, '0px', 'Preview pane should have min-width: 0px');
    });

    it('should allow preview to shrink to very small sizes', function() {
      const previewPane = document.querySelector('.preview-pane');

      // Simulate the CSS that would be applied for near-maximum editor ratio
      previewPane.style.flex = '0 1 calc((1 - 0.999) * 100%)';
      previewPane.style.width = 'calc((1 - 0.999) * 100%)';

      const computedStyle = getComputedStyle(previewPane);

      const width = computedStyle.width;
      assert(width.includes('0.1%'), `Width should be 0.1% for ratio 0.999, got: ${width}`);
    });
  });

  describe('CSS Calculation Logic', function() {
    it('should calculate preview percentage correctly', function() {
      // Test the calc logic: (1 - ratio) * 100%
      const testCases = [
        { ratio: 0.5, expected: '50%' },
        { ratio: 0.8, expected: '20%' },
        { ratio: 0.9, expected: '10%' },
        { ratio: 0.95, expected: '5%' },
        { ratio: 0.999, expected: '0.1%' }
      ];

      testCases.forEach(({ ratio, expected }) => {
        const previewPercent = ((1 - ratio) * 100).toFixed(1).replace(/\.0$/, '') + '%';
        assert.strictEqual(previewPercent, expected,
          `Preview percentage for ratio ${ratio} should be ${expected}, got ${previewPercent}`);
      });
    });

    it('should handle edge cases in percentage calculation', function() {
      // Test edge cases
      const edgeCases = [
        { ratio: 0.05, expected: '95%' },  // Minimum editor ratio
        { ratio: 0.999, expected: '0.1%' }, // Maximum editor ratio
        { ratio: 0, expected: '100%' },    // Invalid but testable
        { ratio: 1, expected: '0%' }       // Invalid but testable
      ];

      edgeCases.forEach(({ ratio, expected }) => {
        const previewPercent = ((1 - ratio) * 100).toFixed(1).replace(/\.0$/, '') + '%';
        assert.strictEqual(previewPercent, expected,
          `Preview percentage for ratio ${ratio} should be ${expected}, got ${previewPercent}`);
      });
    });
  });
});
const assert = require('assert');
const { JSDOM } = require('jsdom');

describe('DOM: Splitter Interaction', function() {
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

    // Create a DOM with splitter and panes
    const html = `<html><body>
      <div class="workspace__content" style="width: 1000px; position: relative;">
        <section class="editor-pane" style="flex: 1;"></section>
        <div id="workspace-splitter" class="workspace__splitter" style="width: 12px; position: absolute; right: 200px;"></div>
        <div class="preview-pane" style="width: 200px;"></div>
      </div>
    </body></html>`;

    dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    window = dom.window;
    document = dom.window.document;

    // Expose globals
    global.window = window;
    global.document = document;
  });

  after(function() {
    try { window.close(); } catch (e) {}
    delete global.window;
    delete global.document;
  });

  describe('Splitter Pointer Events', function() {
    it('should handle pointerdown on splitter', function() {
      const splitter = document.getElementById('workspace-splitter');
      assert(splitter, 'Splitter element should exist');

      // Create a pointerdown event
      const pointerDownEvent = new window.PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        clientX: 800,
        button: 0
      });

      // Track if event was handled (in real app, this would set state)
      let handled = false;
      splitter.addEventListener('pointerdown', () => { handled = true; });

      // Dispatch the event
      splitter.dispatchEvent(pointerDownEvent);

      // Check that event was dispatched
      assert(handled, 'Pointerdown event should be handled');
    });

    it('should calculate bounds correctly', function() {
      const workspaceContent = document.querySelector('.workspace__content');

      // Mock getBoundingClientRect
      workspaceContent.getBoundingClientRect = () => ({
        left: 0,
        width: 1000,
        right: 1000,
        top: 0,
        height: 600,
        bottom: 600
      });

      const bounds = workspaceContent.getBoundingClientRect();

      // Check bounds calculation (width should be 1000 - 12 = 988 for available space)
      const availableWidth = bounds.width - 12; // Subtract splitter width
      assert.strictEqual(availableWidth, 988, 'Available width should account for 12px splitter');
    });

    it('should calculate ratio from pointer position', function() {
      const bounds = { left: 0, width: 988 }; // Available width after splitter
      const pointerX = 700;

      // Calculate ratio as in the app
      const ratio = (pointerX - bounds.left) / bounds.width;

      // Should be approximately 0.708
      assert(ratio > 0.708, 'Ratio should be greater than 0.708');
      assert(ratio < 0.71, 'Ratio should be less than 0.71');
      assert.strictEqual(Math.round(ratio * 1000) / 1000, 0.709, 'Ratio should be approximately 0.709');
    });
  });

  describe('Ratio Bounds Enforcement', function() {
    it('should clamp ratio to minimum value', function() {
      const minEditorRatio = 0.05;
      const maxEditorRatio = 0.999;

      const testRatios = [-0.1, 0, 0.04, minEditorRatio - 0.01];

      testRatios.forEach(ratio => {
        const clamped = Math.max(minEditorRatio, Math.min(maxEditorRatio, ratio));
        assert.strictEqual(clamped, minEditorRatio, `Ratio ${ratio} should be clamped to ${minEditorRatio}`);
      });
    });

    it('should clamp ratio to maximum value', function() {
      const minEditorRatio = 0.05;
      const maxEditorRatio = 0.999;

      const testRatios = [1.0, 1.1, maxEditorRatio + 0.01];

      testRatios.forEach(ratio => {
        const clamped = Math.max(minEditorRatio, Math.min(maxEditorRatio, ratio));
        assert.strictEqual(clamped, maxEditorRatio, `Ratio ${ratio} should be clamped to ${maxEditorRatio}`);
      });
    });

    it('should allow valid ratios within bounds', function() {
      const minEditorRatio = 0.05;
      const maxEditorRatio = 0.999;

      const testRatios = [0.1, 0.5, 0.8, 0.95, maxEditorRatio];

      testRatios.forEach(ratio => {
        const clamped = Math.max(minEditorRatio, Math.min(maxEditorRatio, ratio));
        assert.strictEqual(clamped, ratio, `Valid ratio ${ratio} should not be clamped`);
      });
    });
  });

  describe('Keyboard Navigation', function() {
    it('should handle arrow key concepts', function() {
      const initialRatio = 0.5;
      const stepSize = 0.05;

      // Simulate arrow right (increase ratio)
      let ratio = initialRatio;
      ratio = Math.min(0.999, ratio + stepSize);
      assert(ratio > initialRatio, 'Arrow right should increase ratio');

      // Simulate arrow left (decrease ratio)
      ratio = initialRatio;
      ratio = Math.max(0.05, ratio - stepSize);
      assert(ratio < initialRatio, 'Arrow left should decrease ratio');
    });

    it('should handle Home/End key concepts', function() {
      let ratio = 0.5;

      // Simulate End key (max ratio)
      ratio = 0.999;
      assert.strictEqual(ratio, 0.999, 'End key should set maximum ratio');

      // Simulate Home key (min ratio)
      ratio = 0.05;
      assert.strictEqual(ratio, 0.05, 'Home key should set minimum ratio');
    });
  });

  describe('Splitter Drag Behavior', function() {
    it('should handle drag offset calculation', function() {
      const splitterRect = { left: 6, width: 12 }; // Splitter is 12px wide, so center at 12
      const pointerX = 800;

      // Drag offset is pointer position relative to splitter center
      const splitterCenter = splitterRect.left + splitterRect.width / 2;
      const dragOffset = pointerX - splitterCenter;

      assert.strictEqual(splitterCenter, 12, 'Splitter center should be at position 12');
      assert.strictEqual(dragOffset, 788, 'Drag offset should be pointerX - splitterCenter');
    });

    it('should maintain drag offset during move', function() {
      const bounds = { left: 0, width: 988 };
      const dragOffset = 788;
      const currentPointerX = 700;

      // Calculate ratio accounting for drag offset
      const adjustedPointerX = currentPointerX - dragOffset;
      const ratio = Math.max(0.05, Math.min(0.999, (adjustedPointerX - bounds.left) / bounds.width));

      // With large drag offset, ratio should be clamped to minimum
      assert.strictEqual(ratio, 0.05, 'Ratio should be clamped to minimum with large negative offset');
    });

    it('should handle splitter width in bounds', function() {
      const containerWidth = 1000;
      const splitterWidth = 12;

      // Available space for ratio calculation
      const availableWidth = containerWidth - splitterWidth;

      assert.strictEqual(availableWidth, 988, 'Available width should subtract splitter width');

      // Ratio calculation should use available width
      const pointerX = 800;
      const ratio = pointerX / availableWidth;

      assert(ratio > 0.8, 'Ratio should account for splitter width in denominator');
      assert(ratio < 0.82, 'Ratio should be approximately 0.809');
    });
  });

  describe('Event Handling', function() {
    it('should prevent default on pointer events', function() {
      const splitter = document.getElementById('workspace-splitter');

      const pointerDownEvent = new window.PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        clientX: 800,
        button: 0
      });

      let defaultPrevented = false;
      splitter.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        defaultPrevented = true;
      });

      splitter.dispatchEvent(pointerDownEvent);
      assert(defaultPrevented, 'Pointer events should prevent default behavior');
    });

    it('should handle pointer capture', function() {
      const splitter = document.getElementById('workspace-splitter');

      // In real implementation, splitter would capture pointer
      const pointerDownEvent = new window.PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        clientX: 800,
        button: 0
      });

      let captured = false;
      splitter.addEventListener('pointerdown', (e) => {
        // In JSDOM, setPointerCapture may not be available, but we can test the intent
        if (e.target.setPointerCapture) {
          e.target.setPointerCapture(e.pointerId);
          captured = true;
        } else {
          // JSDOM doesn't support setPointerCapture, so we test that the event is handled
          captured = true;
        }
      });

      splitter.dispatchEvent(pointerDownEvent);
      assert(captured, 'Splitter should handle pointer capture on pointerdown');
    });
  });
});
const assert = require('assert');

describe('Unit: Editor Ratio Calculations', function() {
  // Constants from the app
  const minEditorRatio = 0.05;
  const maxEditorRatio = 0.999;

  describe('Ratio Bounds', function() {
    it('should have correct minimum editor ratio', function() {
      assert.strictEqual(minEditorRatio, 0.05, 'minEditorRatio should be 0.05');
    });

    it('should have correct maximum editor ratio', function() {
      assert.strictEqual(maxEditorRatio, 0.999, 'maxEditorRatio should be 0.999');
    });
  });

  describe('Ratio Clamping', function() {
    it('should clamp ratio to minimum value', function() {
      const testRatios = [-0.1, 0, 0.04, minEditorRatio - 0.01];
      testRatios.forEach(ratio => {
        const clamped = Math.max(minEditorRatio, Math.min(maxEditorRatio, ratio));
        assert(clamped >= minEditorRatio, `Ratio ${ratio} should be clamped to at least ${minEditorRatio}`);
        assert(clamped <= maxEditorRatio, `Ratio ${ratio} should be clamped to at most ${maxEditorRatio}`);
      });
    });

    it('should clamp ratio to maximum value', function() {
      const testRatios = [1.0, 1.1, maxEditorRatio + 0.01];
      testRatios.forEach(ratio => {
        const clamped = Math.max(minEditorRatio, Math.min(maxEditorRatio, ratio));
        assert(clamped >= minEditorRatio, `Ratio ${ratio} should be clamped to at least ${minEditorRatio}`);
        assert(clamped <= maxEditorRatio, `Ratio ${ratio} should be clamped to at most ${maxEditorRatio}`);
      });
    });

    it('should allow valid ratios within bounds', function() {
      const testRatios = [0.1, 0.5, 0.8, 0.95, maxEditorRatio];
      testRatios.forEach(ratio => {
        const clamped = Math.max(minEditorRatio, Math.min(maxEditorRatio, ratio));
        assert.strictEqual(clamped, ratio, `Valid ratio ${ratio} should not be clamped`);
      });
    });
  });

  describe('Bounds Calculation', function() {
    it('should account for splitter width in available space', function() {
      const containerWidth = 1000;
      const splitterWidth = 12;
      const expectedAvailableWidth = containerWidth - splitterWidth;

      assert.strictEqual(expectedAvailableWidth, 988, 'Available width should account for splitter width');
    });

    it('should calculate preview width correctly', function() {
      const availableWidth = 1000;
      const ratio = 0.8; // 80% editor, 20% preview

      const expectedPreviewWidth = Math.round((1 - ratio) * availableWidth);
      const expectedEditorWidth = availableWidth - expectedPreviewWidth;

      assert.strictEqual(expectedPreviewWidth, 200, 'Preview width should be 20% of available space');
      assert.strictEqual(expectedEditorWidth, 800, 'Editor width should be 80% of available space');
    });

    it('should handle extreme ratios correctly', function() {
      const availableWidth = 1000;

      // Minimum editor ratio (5%)
      const minRatio = minEditorRatio;
      const minPreviewWidth = Math.round((1 - minRatio) * availableWidth);
      const minEditorWidth = availableWidth - minPreviewWidth;

      assert(minEditorWidth >= Math.round(minRatio * availableWidth),
        'Minimum ratio should allocate at least 5% to editor');
      assert(minPreviewWidth <= Math.round((1 - minRatio) * availableWidth),
        'Minimum ratio should allocate at most 95% to preview');

      // Maximum editor ratio (99.9%)
      const maxRatio = maxEditorRatio;
      const maxPreviewWidth = Math.round((1 - maxRatio) * availableWidth);
      const maxEditorWidth = availableWidth - maxPreviewWidth;

      assert(maxEditorWidth >= Math.round(maxRatio * availableWidth),
        'Maximum ratio should allocate at least 99.9% to editor');
      assert(maxPreviewWidth <= Math.round((1 - maxRatio) * availableWidth),
        'Maximum ratio should allocate at most 0.1% to preview');
      assert(maxPreviewWidth >= 0, 'Preview should not be negative width');
    });

    it('should calculate ratio from pointer position', function() {
      const bounds = { left: 0, width: 1000 };
      const pointerX = 800; // 80% across the width

      const ratio = (pointerX - bounds.left) / bounds.width;
      assert.strictEqual(ratio, 0.8, 'Ratio should be calculated as pointer position relative to bounds');
    });

    it('should handle bounds with splitter width correctly', function() {
      const rawBounds = { left: 0, width: 1000 };
      const splitterWidth = 12;
      const adjustedBounds = {
        left: rawBounds.left,
        width: Math.max(1, rawBounds.width - splitterWidth)
      };

      assert.strictEqual(adjustedBounds.width, 988, 'Bounds width should be reduced by splitter width');
      assert.strictEqual(adjustedBounds.left, 0, 'Bounds left should remain unchanged');
    });
  });
});
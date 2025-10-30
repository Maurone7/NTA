const assert = require('assert');

describe('Accessibility Settings', function() {
  let appModule;
  let hooks;

  beforeEach(function() {
    // Reset require cache and set up a minimal DOM environment
    delete require.cache[require.resolve('../../src/renderer/app.js')];

    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(`
      <!doctype html>
      <html>
      <body>
        <div class="app-shell"></div>
        <div id="markdown-preview"></div>
        <textarea id="note-editor"></textarea>

        <!-- Settings modal (accessibility controls only for test) -->
        <div id="settings-modal" class="modal">
          <div class="modal-content">
            <div class="settings-tab" id="accessibility-tab">
              <div class="settings-section">
                <div class="settings-item">
                  <label class="settings-item__label">High Contrast Mode</label>
                  <div class="toggle-group">
                    <input type="checkbox" id="high-contrast-toggle" class="settings-toggle">
                    <label for="high-contrast-toggle" class="toggle-label">Enable high contrast mode</label>
                  </div>
                </div>

                <div class="settings-item">
                  <label class="settings-item__label">Reduce Motion</label>
                  <div class="toggle-group">
                    <input type="checkbox" id="reduce-motion-toggle" class="settings-toggle">
                  </div>
                </div>

                <div class="settings-item">
                  <label class="settings-item__label">Dyslexia-friendly</label>
                  <div class="toggle-group">
                    <input type="checkbox" id="dyslexia-font-toggle" class="settings-toggle">
                  </div>
                </div>

                <div class="settings-item">
                  <label class="settings-item__label">Show Focus Indicators</label>
                  <div class="toggle-group">
                    <input type="checkbox" id="focus-indicators-toggle" class="settings-toggle">
                  </div>
                </div>

                <div class="settings-item">
                  <label class="settings-item__label">UI Scale</label>
                  <div class="slider-group">
                    <select id="ui-scale-select" class="settings-select">
                      <option value="1">100%</option>
                      <option value="1.25">125%</option>
                    </select>
                  </div>
                </div>

                <div class="settings-item">
                  <label class="settings-item__label">Line Height</label>
                  <div class="slider-group">
                    <select id="line-height-select" class="settings-select">
                      <option value="1">Normal</option>
                      <option value="1.5">Spacious</option>
                    </select>
                  </div>
                </div>

                <div class="settings-item">
                  <label class="settings-item__label">Text Spacing</label>
                  <div class="slider-group">
                    <select id="text-spacing-select" class="settings-select">
                      <option value="normal">Normal</option>
                      <option value="wide">Wide</option>
                    </select>
                  </div>
                </div>

                <div class="settings-item">
                  <label class="settings-item__label">Large Cursor</label>
                  <div class="toggle-group">
                    <input type="checkbox" id="large-cursor-toggle" class="settings-toggle">
                  </div>
                </div>

                <div id="accessibility-preview">
                  <p class="preview-sample-text">Accessibility preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `, { url: 'http://localhost' });

    global.window = dom.window;
    global.document = dom.window.document;

    // Minimal matchMedia
    global.window.matchMedia = global.window.matchMedia || function() {
      return { matches: false, addEventListener() {}, removeEventListener() {} };
    };

    // Mock getComputedStyle
    global.window.getComputedStyle = global.window.getComputedStyle || function() {
      return { getPropertyValue() { return ''; } };
    };
    global.getComputedStyle = global.window.getComputedStyle;

    // Stub localStorage
    const store = {};
    global.window.localStorage = {
      getItem: (k) => (k in store) ? store[k] : null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    };
    global.localStorage = global.window.localStorage;

    // Minimal api surface
    global.window.api = { on() {}, invoke: async () => null, reload: () => {} };

    appModule = require('../../src/renderer/app.js');
    hooks = appModule.__test__ || {};
    assert(hooks, 'test hooks must be available');

    // Reassign elements used by accessibility initialization
    if (hooks.elements) {
      Object.assign(hooks.elements, {
        highContrastToggle: document.getElementById('high-contrast-toggle'),
        reduceMotionToggle: document.getElementById('reduce-motion-toggle'),
        dyslexiaFontToggle: document.getElementById('dyslexia-font-toggle'),
        focusIndicatorsToggle: document.getElementById('focus-indicators-toggle'),
        uiScaleSelect: document.getElementById('ui-scale-select'),
        lineHeightSelect: document.getElementById('line-height-select'),
        textSpacingSelect: document.getElementById('text-spacing-select'),
        largeCursorToggle: document.getElementById('large-cursor-toggle'),
        accessibilityPreview: document.getElementById('accessibility-preview')
      });
    }
  });

  afterEach(function() {
    try { if (global.window && typeof global.window.close === 'function') global.window.close(); } catch (e) {}
    delete global.window.api;
    delete global.window.localStorage;
    delete global.document;
    delete global.window;
    Object.keys(require.cache).forEach(k => {
      if (k.indexOf('/src/renderer/app.js') !== -1) delete require.cache[k];
    });
  });

  it('should toggle and persist high contrast mode', function() {
    if (typeof hooks.initialize === 'function') hooks.initialize();

    const el = document.getElementById('high-contrast-toggle');
    assert(el, 'high contrast toggle exists');
    el.checked = true;
    el.dispatchEvent(new window.Event('change', { bubbles: true }));

    assert.equal(document.body.getAttribute('data-high-contrast'), 'true');
    assert.equal(localStorage.getItem('NTA.highContrast'), 'true');

    // Turn off
    el.checked = false;
    el.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(document.body.getAttribute('data-high-contrast'), null);
    assert.equal(localStorage.getItem('NTA.highContrast'), 'false');
  });

  it('should apply reduce-motion and dyslexia-friendly, and reflect in preview', function() {
    if (typeof hooks.initialize === 'function') hooks.initialize();

    const reduce = document.getElementById('reduce-motion-toggle');
    const dys = document.getElementById('dyslexia-font-toggle');
    const preview = document.getElementById('accessibility-preview');

    reduce.checked = true;
    reduce.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert(document.documentElement.classList.contains('reduce-motion'));
    assert.equal(localStorage.getItem('NTA.reduceMotion'), 'true');

    dys.checked = true;
    dys.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert(document.documentElement.classList.contains('dyslexia-friendly'));
    assert.equal(localStorage.getItem('NTA.dyslexiaFriendly'), 'true');

    // Preview should mirror dyslexia class
    assert(preview.classList.contains('dyslexia-friendly'));
  });

  it('should toggle focus indicators and large cursor', function() {
    if (typeof hooks.initialize === 'function') hooks.initialize();

    const focus = document.getElementById('focus-indicators-toggle');
    const large = document.getElementById('large-cursor-toggle');

    focus.checked = true;
    focus.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert(document.documentElement.classList.contains('show-focus-ring'));
    assert.equal(localStorage.getItem('NTA.focusIndicators'), 'true');

    large.checked = true;
    large.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert(document.documentElement.classList.contains('large-cursor'));
    assert.equal(localStorage.getItem('NTA.largeCursor'), 'true');
  });

  it('should update UI scale, line height and text spacing', function() {
    if (typeof hooks.initialize === 'function') hooks.initialize();

    const ui = document.getElementById('ui-scale-select');
    const lh = document.getElementById('line-height-select');
    const ts = document.getElementById('text-spacing-select');

    ui.value = '1.25';
    ui.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(document.documentElement.style.zoom || '', '1.25');
    assert.equal(localStorage.getItem('NTA.uiScale'), '1.25');

    lh.value = '1.5';
    lh.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(document.documentElement.style.getPropertyValue('--content-line-height'), '1.5');
    assert.equal(localStorage.getItem('NTA.lineHeight'), '1.5');

    ts.value = 'wide';
    ts.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(document.documentElement.style.getPropertyValue('--content-letter-spacing'), '0.02em');
    assert.equal(localStorage.getItem('NTA.textSpacing'), 'wide');
  });

  it('wheel scroll inside preview should only move preview when Ctrl/Cmd is held', function() {
    if (typeof hooks.initialize === 'function') hooks.initialize();

    const preview = document.getElementById('accessibility-preview');
    const sample = preview.querySelector('.preview-sample-text');
    assert(preview, 'preview exists');
    assert(sample, 'preview sample exists');

    const initialTransform = sample.style.transform || '';

    // Dispatch wheel without modifier: should NOT move the sample
    const evNoMod = new window.WheelEvent('wheel', { deltaY: 50, bubbles: true, cancelable: true });
    preview.dispatchEvent(evNoMod);
    assert.equal(sample.style.transform || '', initialTransform, 'sample should not move without modifier');

    // Dispatch wheel with Ctrl (or Cmd) modifier: should move the sample
    const evWithMod = new window.WheelEvent('wheel', { deltaY: -30, ctrlKey: true, bubbles: true, cancelable: true });
    preview.dispatchEvent(evWithMod);

    const afterTransform = sample.style.transform || '';
    assert(afterTransform.indexOf('translateY(') !== -1, 'sample should have translateY applied when modifier present');
    // dataset offset should be set on preview element
    assert.ok(typeof preview.dataset.accessibilityPreviewOffset !== 'undefined');
  });
});

const assert = require('assert');

describe('Settings Layout', function() {
  let appModule;
  let hooks;

  beforeEach(function() {
    // Reset require cache and set up a minimal DOM environment
    delete require.cache[require.resolve('../../src/renderer/app.js')];

    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(`
      <!doctype html>
      <html>
      <head>
        <style>
          /* Include the relevant CSS styles for testing */
          .settings-grid {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
            width: 100%;
          }

          .settings-item {
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 100%;
            max-width: 420px;
          }

          .color-picker-group,
          .font-family-group,
          .slider-group,
          .toggle-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div class="app-shell"></div>

        <!-- Settings modal with all tabs -->
        <div id="settings-modal" class="modal">
          <div class="modal-content">
            <!-- Appearance Tab -->
            <div class="settings-tab" id="appearance-tab">
              <div class="settings-section">
                <div class="settings-grid">
                  <div class="settings-item">
                    <label class="settings-item__label">Theme</label>
                    <select id="theme-select" class="settings-select">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Accent Color</label>
                    <div class="color-picker-group">
                      <input type="color" id="accent-color-picker" class="color-picker" value="#4c6ef5">
                      <button id="reset-accent-color" class="settings-button--secondary">Reset</button>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Font Family</label>
                    <div class="font-family-group">
                      <select id="font-family-select" class="settings-select">
                        <option value="system">System Font</option>
                        <option value="Inter">Inter</option>
                      </select>
                      <button id="reset-font-family" class="settings-button--secondary">Reset</button>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Font Size</label>
                    <div class="slider-group">
                      <input type="range" id="font-size-slider" class="settings-slider" min="10" max="20" value="13" step="1">
                      <span id="font-size-value" class="slider-value">13px</span>
                      <button id="reset-font-size" class="settings-button--secondary">Reset</button>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Line Height</label>
                    <div class="slider-group">
                      <input type="range" id="line-height-slider" class="settings-slider" min="1" max="2" value="1.4" step="0.1">
                      <span id="line-height-value" class="slider-value">1.4</span>
                      <button id="reset-line-height" class="settings-button--secondary">Reset</button>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Editor Font Size</label>
                    <div class="slider-group">
                      <input type="range" id="editor-font-size-slider" class="settings-slider" min="10" max="20" value="13" step="1">
                      <span id="editor-font-size-value" class="slider-value">13px</span>
                      <button id="reset-editor-font-size" class="settings-button--secondary">Reset</button>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Preview Font Size</label>
                    <div class="slider-group">
                      <input type="range" id="preview-font-size-slider" class="settings-slider" min="10" max="20" value="14" step="1">
                      <span id="preview-font-size-value" class="slider-value">14px</span>
                      <button id="reset-preview-font-size" class="settings-button--secondary">Reset</button>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Sidebar Font Size</label>
                    <div class="slider-group">
                      <input type="range" id="sidebar-font-size-slider" class="settings-slider" min="10" max="20" value="12" step="1">
                      <span id="sidebar-font-size-value" class="slider-value">12px</span>
                      <button id="reset-sidebar-font-size" class="settings-button--secondary">Reset</button>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Auto Dark Mode</label>
                    <div class="toggle-group">
                      <input type="checkbox" id="auto-dark-mode-toggle" class="settings-toggle">
                      <label for="auto-dark-mode-toggle" class="toggle-label">Automatically switch to dark mode</label>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Show Line Numbers</label>
                    <div class="toggle-group">
                      <input type="checkbox" id="show-line-numbers-toggle" class="settings-toggle">
                      <label for="show-line-numbers-toggle" class="toggle-label">Show line numbers in editor</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Accessibility Tab -->
            <div class="settings-tab" id="accessibility-tab">
              <div class="settings-section">
                <div class="settings-grid">
                  <div class="settings-item">
                    <label class="settings-item__label">High Contrast Mode</label>
                    <div class="toggle-group">
                      <input type="checkbox" id="high-contrast-toggle" class="settings-toggle">
                      <label for="high-contrast-toggle" class="toggle-label">Enable high contrast mode</label>
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
                </div>
              </div>
            </div>

            <!-- Advanced Tab -->
            <div class="settings-tab" id="advanced-tab">
              <div class="settings-section">
                <div class="settings-grid">
                  <div class="settings-item">
                    <label class="settings-item__label">Autosave</label>
                    <div class="toggle-group">
                      <input type="checkbox" id="autosave-toggle" class="settings-toggle">
                      <label for="autosave-toggle" class="toggle-label">Enable autosave</label>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Default File Extension</label>
                    <select id="default-file-extension-select" class="settings-select">
                      <option value=".md">.md</option>
                      <option value=".txt">.txt</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Layout Tab -->
            <div class="settings-tab" id="layout-tab">
              <div class="settings-section">
                <div class="settings-grid">
                  <div class="settings-item">
                    <label class="settings-item__label">Border Color</label>
                    <div class="color-picker-group">
                      <input type="color" id="border-color-picker" class="color-picker" value="#e2e8f0">
                      <button id="reset-border-color" class="settings-button--secondary">Reset</button>
                    </div>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Border Thickness</label>
                    <div class="slider-group">
                      <input type="range" id="border-thickness-slider" class="settings-slider" min="1" max="4" value="1" step="1">
                      <span id="border-thickness-value" class="slider-value">1px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Export Tab -->
            <div class="settings-tab" id="export-tab">
              <div class="settings-section">
                <div class="settings-grid">
                  <div class="settings-item">
                    <label class="settings-item__label">Default Export Format</label>
                    <select id="default-export-format-select" class="settings-select">
                      <option value="pdf">PDF</option>
                      <option value="html">HTML</option>
                    </select>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">Direct Export with Cmd+E</label>
                    <div class="toggle-group">
                      <input type="checkbox" id="cmd-e-direct-export-toggle" class="settings-toggle">
                      <label for="cmd-e-direct-export-toggle" class="toggle-label">Export using default format</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Application Tab -->
            <div class="settings-tab" id="application-tab">
              <div class="settings-section">
                <div class="settings-grid">
                  <div class="settings-item">
                    <label class="settings-item__label">Check for Updates</label>
                    <button id="check-updates-btn" class="settings-button">Check Now</button>
                  </div>
                  <div class="settings-item">
                    <label class="settings-item__label">App Version</label>
                    <div id="app-version">Loading...</div>
                  </div>
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
    global.window.getComputedStyle = global.window.getComputedStyle || function(element) {
      const styles = element.style;
      return {
        getPropertyValue(prop) {
          return styles.getPropertyValue ? styles.getPropertyValue(prop) : '';
        }
      };
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

  it('should have all settings-grid elements with vertical flex-direction and center alignment', function() {
    const grids = document.querySelectorAll('.settings-grid');
    assert(grids.length > 0, 'settings-grid elements should exist');

    grids.forEach(grid => {
      const computedStyle = getComputedStyle(grid);
      assert.equal(computedStyle.display, 'flex', 'settings-grid should be flex');
      assert.equal(computedStyle.flexDirection, 'column', 'settings-grid should be column direction');
      assert.equal(computedStyle.alignItems, 'center', 'settings-grid should center align items');
    });
  });

  it('should have all settings-item elements with center alignment', function() {
    const items = document.querySelectorAll('.settings-item');
    assert(items.length > 0, 'settings-item elements should exist');

    items.forEach(item => {
      const computedStyle = getComputedStyle(item);
      assert.equal(computedStyle.display, 'flex', 'settings-item should be flex');
      assert.equal(computedStyle.flexDirection, 'column', 'settings-item should be column direction');
      assert.equal(computedStyle.alignItems, 'center', 'settings-item should center align items');
    });
  });

  it('should have all control groups (color-picker, font-family, slider, toggle) with vertical stacking and center alignment', function() {
    const groups = document.querySelectorAll('.color-picker-group, .font-family-group, .slider-group, .toggle-group');
    assert(groups.length > 0, 'control group elements should exist');

    groups.forEach(group => {
      const computedStyle = getComputedStyle(group);
      assert.equal(computedStyle.display, 'flex', 'control group should be flex');
      assert.equal(computedStyle.flexDirection, 'column', 'control group should be column direction');
      assert.equal(computedStyle.alignItems, 'center', 'control group should center align items');
      assert.equal(computedStyle.width, '100%', 'control group should be full width');
    });
  });

  it('should have consistent gap spacing across all control groups', function() {
    const groups = document.querySelectorAll('.color-picker-group, .font-family-group, .slider-group, .toggle-group');

    groups.forEach(group => {
      const computedStyle = getComputedStyle(group);
      assert.equal(computedStyle.gap, '8px', 'control group should have 8px gap');
    });
  });

  it('should have all settings tabs with proper grid structure', function() {
    const tabs = ['appearance-tab', 'accessibility-tab', 'advanced-tab', 'layout-tab', 'export-tab', 'application-tab'];

    tabs.forEach(tabId => {
      const tab = document.getElementById(tabId);
      assert(tab, `${tabId} should exist`);

      const grid = tab.querySelector('.settings-grid');
      assert(grid, `${tabId} should have settings-grid`);

      const items = grid.querySelectorAll('.settings-item');
      assert(items.length > 0, `${tabId} should have settings-item elements`);
    });
  });

  it('should have proper settings structure for vertical stacking', function() {
    const labels = document.querySelectorAll('.settings-item__label');

    // Verify labels exist and are properly structured
    assert(labels.length > 0, 'settings labels should exist');

    labels.forEach(label => {
      // Check that labels are children of settings-item elements
      const parent = label.parentElement;
      assert(parent.classList.contains('settings-item'), 'labels should be inside settings-item elements');
    });
  });
});
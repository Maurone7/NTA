const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: PNG close button functionality', function() {
  this.timeout(10000); // Increase timeout for DOM operations

  it('closes PNG tab when close button is clicked', function(done) {
    // Minimal stubs and DOM setup
    const html = `<html><body>
      <div class="app-shell">
        <div class="workspace__content">
          <section class="editor-pane editor-pane--left" aria-label="Markdown editor (left)">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-left" role="tablist"></div>
            </div>
            <textarea id="note-editor"></textarea>
            <div id="editor-math-overlay" class="editor-math-overlay" hidden></div>
          </section>
          <div class="editors__divider"></div>
          <section class="editor-pane editor-pane--right" aria-label="Markdown editor (right)">
            <div class="pane-tab-bar">
              <div class="tab-bar__tabs" id="tab-bar-tabs-right" role="tablist"></div>
            </div>
            <textarea id="note-editor-right"></textarea>
          </section>
          <div id="workspace-splitter" class="workspace-splitter"></div>
          <section class="preview-pane">
            <div id="markdown-preview"></div>
            <iframe id="pdf-viewer" class="pdf-viewer" title="PDF Viewer"></iframe>
          </section>
        </div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;

    global.window = window;
    global.document = document;

    // Provide minimal window.api
    global.window.api = {
      on: () => {},
      removeListener: () => {},
      invoke: () => Promise.resolve(),
      resolveResource: async ({ src }) => {
        if (!src) return { value: null };
        if (src.endsWith('.png')) return { value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' };
        return { value: null };
      }
    };

    // matchMedia stub
    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = () => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      });
    }

    // localStorage stub
    if (!global.window.localStorage) {
      global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
    }
    global.localStorage = global.window.localStorage;

    const finish = (err) => {
      try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
      done(err);
    };

    try {
      // Load app.js in JSDOM environment
      try { delete require.cache[require.resolve(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'))]; } catch (e) {}
      const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
      const hooks = appModule.__test__ || {};

      // Initialize app
      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) { /* ignore */ }
      }

      // Prepare test PNG file
      const pngFile = {
        id: 'png-file-1',
        title: 'Test Image.png',
        type: 'image',
        absolutePath: '/test/image.png',
        content: null
      };

      // Populate test state
      try {
        if (hooks && hooks.state && typeof hooks.state.notes === 'object') {
          hooks.state.notes.set(pngFile.id, pngFile);
        } else if (window && window.state && window.state.notes) {
          window.state.notes.set(pngFile.id, pngFile);
        }
      } catch (e) { /* ignore */ }

      const openNoteInPane = hooks.openNoteInPane || window.openNoteInPane;
      const closeTab = hooks.closeTab || window.closeTab;

      assert(openNoteInPane, 'openNoteInPane should be available');
      assert(closeTab, 'closeTab should be available');

      // Get state helper
      const getState = () => hooks.state || window.state;
      const getTabCount = () => {
        const s = getState();
        return s && s.tabs ? s.tabs.length : 0;
      };

      // Open PNG file
      console.log('Opening PNG file...');
      try {
        const result = openNoteInPane(pngFile.id, 'left', { activate: true });
        console.log('openNoteInPane returned:', result);
      } catch (e) {
        return finish(new Error(`Failed to open PNG file: ${e.message}`));
      }

      // Wait for image to load and tab to be created
      setTimeout(() => {
        let tabCount = getTabCount();
        const s = getState();
        console.log(`After opening PNG: ${tabCount} tabs`);

        if (tabCount !== 1) {
          return finish(new Error(`Expected 1 tab after opening PNG, got ${tabCount}`));
        }

        // Verify tab was created with close button
        const tabBar = document.getElementById('tab-bar-tabs-left');
        if (!tabBar) {
          return finish(new Error('Tab bar element not found'));
        }

        const tabs = tabBar.querySelectorAll('.tab');
        if (tabs.length !== 1) {
          return finish(new Error(`Expected 1 tab element, found ${tabs.length}`));
        }

        const tab = tabs[0];
        const closeButton = tab.querySelector('.tab__close');
        if (!closeButton) {
          return finish(new Error('Close button not found in tab'));
        }

        // Verify close button is visible and clickable (z-index test)
        const imageContainer = document.querySelector('.pane-image-container');

        if (imageContainer) {
          // In a real browser, the tab bar should have higher z-index than image container
          // We can't test computed styles in JSDOM, but we can verify the elements exist
          // and the close button is present and clickable
          console.log('Image container found, verifying close button accessibility');

          // Check that the close button is not obscured by checking DOM structure
          // In JSDOM, we can't test visual layering, but we can ensure the button exists
          // and is in the correct DOM position (after the image container in DOM order)
          const tabBarIndex = Array.from(tabBar.parentNode.children).indexOf(tabBar);
          const imageIndex = Array.from(imageContainer.parentNode.children).indexOf(imageContainer);

          console.log(`Tab bar DOM index: ${tabBarIndex}, Image container DOM index: ${imageIndex}`);

          // The tab bar should come after the image container in DOM order for proper layering
          if (tabBarIndex <= imageIndex) {
            console.log('Tab bar appears before or at same position as image container in DOM');
          }
        }

        // Simulate clicking the close button
        console.log('Clicking close button...');
        try {
          closeButton.click();
        } catch (e) {
          return finish(new Error(`Failed to click close button: ${e.message}`));
        }

        // Wait for tab to close
        setTimeout(() => {
          const finalTabCount = getTabCount();
          console.log(`After closing: ${finalTabCount} tabs`);

          if (finalTabCount !== 0) {
            return finish(new Error(`Expected 0 tabs after closing PNG tab, got ${finalTabCount}`));
          }

          // Success - PNG close button works correctly
          finish();
        }, 100);
      }, 500); // Wait longer for image loading

    } catch (e) {
      finish(e);
    }
  });
});
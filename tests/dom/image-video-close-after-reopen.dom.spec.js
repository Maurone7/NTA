const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

describe('DOM: image/video close after reopen cycles', function() {
  this.timeout(15000); // Increase timeout for DOM operations and image loading

  it('can close image tab after closing all tabs and reopening via workspace click', function(done) {
    // Keep console.log for debugging but stub others
    const originalLog = console.log;
    global.console = { debug: () => {}, log: originalLog, warn: () => {}, error: () => {} };

    const html = `<html><body>
      <div class="app-shell">
        <div class="workspace__content">
          <section class="editor-pane editor-pane--left" data-pane-id="left">
            <div class="pane-tab-bar"><div class="tab-bar__tabs" id="tab-bar-tabs-left" role="tablist"></div></div>
            <textarea id="note-editor"></textarea>
          </section>
          <div class="editors__divider"></div>
          <section class="editor-pane editor-pane--right" data-pane-id="right">
            <div class="pane-tab-bar"><div class="tab-bar__tabs" id="tab-bar-tabs-right" role="tablist"></div></div>
            <textarea id="note-editor-right"></textarea>
          </section>
        </div>
        <div id="workspace-tree"></div>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost' });
    const window = dom.window;
    const document = window.document;

    global.window = window;
    global.document = document;

    // Mock API for image resolution
    global.window.api = {
      on: () => {},
      removeListener: () => {},
      invoke: async (channel, payload) => {
        if (channel === 'resolveResource') {
          if (payload.src && payload.src.endsWith('.png')) {
            return { value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' };
          }
          if (payload.src && payload.src.endsWith('.mp4')) {
            return { value: 'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXQ=' };
          }
        }
        return Promise.resolve({ value: null });
      }
    };

    if (typeof global.window.matchMedia !== 'function') {
      global.window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
    }

    global.window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    global.localStorage = global.window.localStorage;

    const finish = (err) => {
      try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
      done(err);
    };

    try {
      const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
      try { delete require.cache[require.resolve(appPath)]; } catch (e) {}
      const appModule = require(appPath);
      const hooks = appModule.__test__ || {};

      if (typeof hooks.initialize === 'function') {
        try { hooks.initialize(); } catch (e) {}
      }

      // Prepare test files: markdown, image, and video
      const files = [
        { id: 'md-1', title: 'Test.md', type: 'markdown', absolutePath: '/test.md', content: '# Test' },
        { id: 'img-1', title: 'Test.png', type: 'image', absolutePath: '/test.png', content: null },
        { id: 'vid-1', title: 'Test.mp4', type: 'video', absolutePath: '/test.mp4', content: null }
      ];

      const state = hooks.state || window.state;
      files.forEach(f => state.notes.set(f.id, f));

      const openByClick = (file) => {
        const tree = document.getElementById('workspace-tree');
        // Create a workspace tree node
        const node = document.createElement('div');
        node.className = 'tree-node tree-node--file';
        node.dataset.nodeType = 'file';
        node.dataset.noteId = file.id;
        node.dataset.path = file.absolutePath;
        const label = document.createElement('div');
        label.className = 'tree-node__label';
        label.textContent = file.title;
        node.appendChild(label);
        tree.appendChild(node);

        // Dispatch click on label
        const clickEvt = new window.Event('click', { bubbles: true, cancelable: true });
        label.dispatchEvent(clickEvt);
      };

      const closeAllTabsHelper = () => {
        const closeTab = hooks.closeTab || window.closeTab;
        const s = hooks.state || window.state;
        if (s && s.tabs && Array.isArray(s.tabs)) {
          const tabs = [...s.tabs];
          tabs.forEach(t => { try { closeTab(t.id); } catch (e) {} });
        }
      };

      const getTabCount = () => {
        const s = hooks.state || window.state;
        return s && s.tabs ? s.tabs.length : 0;
      };

            // First, open a markdown file
      openByClick(files[0]); // Test.md

      setTimeout(() => {
        if (getTabCount() !== 1) {
          return finish(new Error(`Expected 1 tab after opening markdown, got ${getTabCount()}`));
        }

        // Close all tabs
        closeAllTabsHelper();

        setTimeout(() => {
          if (getTabCount() !== 0) {
            return finish(new Error(`Expected 0 tabs after closing all, got ${getTabCount()}`));
          }

          // Reopen all tabs to simulate the reopen scenario
          console.log('Reopening all tabs...');
          openByClick(files[0]); // Test.md
          openByClick(files[1]); // Test.png
          openByClick(files[2]); // Test.mp4

          setTimeout(() => {
            if (getTabCount() !== 3) {
              return finish(new Error(`Expected 3 tabs after reopening all, got ${getTabCount()}`));
            }

            // Now test image close after reopen
            console.log('Testing image close after reopen...');

            // Find the image tab close button
            const tabBarTabs = document.getElementById('tab-bar-tabs-left');
            const tabs = tabBarTabs.querySelectorAll('.tab');
            const imageTab = Array.from(tabs).find(tab => tab.textContent.includes('Test.png'));
            if (!imageTab) {
              return finish(new Error('Image tab not found'));
            }

            const imageCloseButton = imageTab.querySelector('.tab__close');
            if (!imageCloseButton) {
              return finish(new Error('Close button not found in image tab'));
            }

            // Verify image container exists and is positioned correctly
            const imageContainer = document.querySelector('.pane-image-container');
            if (!imageContainer) {
              return finish(new Error('Image container not found after reopening'));
            }

            // Check that the image container has proper positioning (below tab bar)
            const tabBar = document.querySelector('.pane-tab-bar');
            if (tabBar) {
              const tabBarHeight = tabBar.getBoundingClientRect().height;
              const containerTop = parseFloat(imageContainer.style.top) || 0;
              if (containerTop < tabBarHeight) {
                return finish(new Error(`Image container top (${containerTop}px) should be >= tab bar height (${tabBarHeight}px)`));
              }
            }

            // Click the close button
            console.log('Clicking image tab close button...');
            imageCloseButton.click();

            setTimeout(() => {
              if (getTabCount() !== 2) {
                return finish(new Error(`Expected 2 tabs after closing image tab, got ${getTabCount()}`));
              }

              // Now test video close after reopen
              console.log('Testing video close after reopen...');

              // Find the video tab close button
              const remainingTabs = tabBarTabs.querySelectorAll('.tab');
              const videoTab = Array.from(remainingTabs).find(tab => tab.textContent.includes('Test.mp4'));
              if (!videoTab) {
                return finish(new Error('Video tab not found'));
              }

              const videoCloseButton = videoTab.querySelector('.tab__close');
              if (!videoCloseButton) {
                return finish(new Error('Close button not found in video tab'));
              }

              // Verify video container exists and is positioned correctly
              const videoContainer = document.querySelector('.pane-video-container');
              console.log(`Video container found: ${!!videoContainer}`);
              if (!videoContainer) {
                return finish(new Error('Video container not found after reopening'));
              }

              // Manually trigger loadedmetadata event for video since JSDOM doesn't load actual video
              const videoElement = document.querySelector('video.video-pane-viewer');
              if (videoElement) {
                console.log('Triggering loadedmetadata event for video');
                videoElement.dispatchEvent(new window.Event('loadedmetadata'));
              }

              // Check that the video container has proper positioning (below tab bar)
              if (tabBar) {
                const tabBarHeight = tabBar.getBoundingClientRect().height;
                const containerTop = parseFloat(videoContainer.style.top) || 0;
                console.log(`Video container top: ${containerTop}px, tab bar height: ${tabBarHeight}px`);
                if (containerTop < tabBarHeight) {
                  return finish(new Error(`Video container top (${containerTop}px) should be >= tab bar height (${tabBarHeight}px)`));
                }
              }

              // Click the close button
              console.log('Clicking video tab close button...');
              videoCloseButton.click();

              setTimeout(() => {
                const finalTabCount = getTabCount();
                console.log(`After closing video tab: ${finalTabCount} tabs`);
                if (finalTabCount !== 1) {
                  return finish(new Error(`Expected 1 tab after closing video tab (markdown should remain), got ${finalTabCount}`));
                }

                console.log('All tests passed: image and video tabs close correctly after reopen cycles');
                finish();
              }, 100);
            }, 100);
          }, 500); // Wait for tabs to reopen
        }, 100);
      }, 100);
    } catch (e) {
      finish(e);
    }
  });
});
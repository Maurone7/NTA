const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  // Stub console methods to avoid noise BEFORE creating JSDOM
  global.console = {
    debug: () => {},
    log: () => {},
    warn: () => {},
    error: () => {}
  };

  const domHtml = `<!doctype html><html><body>
    <div class="hashtag-container">
      <div class="hashtag-panel">
        <button id="toggle-hashtag-minimize" title="Minimize/Restore hashtags">▾</button>
        <div class="hashtag-content">Hashtag content</div>
      </div>
    </div>
  </body></html>`;
  const dom = new JSDOM(domHtml, { runScripts: 'outside-only', url: 'http://localhost' });
  const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;

  // minimal stubs
  w.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {} };

  // Provide a robust matchMedia stub
  if (typeof w.matchMedia !== 'function') {
    w.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {}
    });
  }

  w.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };

  // Minimal MutationObserver stub for JSDOM environment
  if (typeof w.MutationObserver === 'undefined') {
    w.MutationObserver = function(callback) {
      this.observe = () => {};
      this.disconnect = () => {};
    };
  }

  return w;
}

describe('DOM: hashtag panel minimization', function() {
  it('toggles hashtag panel minimized state when button is clicked', function(done) {
    const window = makeWindow();
    global.window = window;
    global.document = window.document;
    global.localStorage = window.localStorage;
    global.MutationObserver = window.MutationObserver;

    // Require the module
    const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};

    // Initialize if available
    if (typeof hooks.initialize === 'function') {
      try { hooks.initialize(); } catch (e) { /* ignore init errors in test env */ }
    }

    try {
      const hashtagContainer = document.querySelector('.hashtag-container');
      const minimizeBtn = document.querySelector('#toggle-hashtag-minimize');

      assert(hashtagContainer, 'hashtag container must exist');
      assert(minimizeBtn, 'hashtag minimize button must exist');

      // Initially should not be minimized
      assert(!hashtagContainer.classList.contains('hashtag-minimized'), 'hashtag container should not be minimized initially');

      // Click the minimize button
      const clickEvent = new window.MouseEvent('click', { bubbles: true, cancelable: true });
      minimizeBtn.dispatchEvent(clickEvent);

      // Allow any asynchronous event handlers to run
      setTimeout(() => {
        try {
          // Should now be minimized
          assert(hashtagContainer.classList.contains('hashtag-minimized'), 'hashtag container should be minimized after clicking button');

          // Click again to expand
          minimizeBtn.dispatchEvent(clickEvent);

          setTimeout(() => {
            try {
              // Should now be expanded
              assert(!hashtagContainer.classList.contains('hashtag-minimized'), 'hashtag container should be expanded after second click');
              done();
            } catch (err) {
              done(err);
            } finally {
              // cleanup
              delete global.window;
              delete global.document;
              delete global.localStorage;
              delete global.MutationObserver;
            }
          }, 10);
        } catch (err) {
          done(err);
          // cleanup
          delete global.window;
          delete global.document;
          delete global.localStorage;
          delete global.MutationObserver;
        }
      }, 10);
    } catch (e) {
      delete global.window;
      delete global.document;
      delete global.localStorage;
      delete global.MutationObserver;
      done(e);
    }
  });

  it('persists hashtag panel minimized state to localStorage', function(done) {
    // Track localStorage calls
    let localStorageCalls = [];
    const window = makeWindow();

    global.window = window;
    global.document = window.document;
    global.localStorage = window.localStorage;
    global.MutationObserver = window.MutationObserver;
    global.testLocalStorageCalls = localStorageCalls;

    // Require the module
    const appModule = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = appModule.__test__ || {};

    // Initialize if available
    if (typeof hooks.initialize === 'function') {
      try { hooks.initialize(); } catch (e) { /* ignore init errors in test env */ }
    }

    try {
      const minimizeBtn = document.querySelector('#toggle-hashtag-minimize');
      assert(minimizeBtn, 'hashtag minimize button must exist');

      // Click the minimize button
      const clickEvent = new window.MouseEvent('click', { bubbles: true, cancelable: true });
      minimizeBtn.dispatchEvent(clickEvent);

      // Check immediately
      const minimizeCall = localStorageCalls.find(call => call.key === 'NTA.hashtagPanelMinimized' && call.value === 'true');
      assert(minimizeCall, 'localStorage.setItem should be called for hashtagPanelMinimized with value "true"');

      done();
    } catch (e) {
      delete global.window;
      delete global.document;
      delete global.localStorage;
      delete global.MutationObserver;
      delete global.testLocalStorageCalls;
      done(e);
    }
  });
});
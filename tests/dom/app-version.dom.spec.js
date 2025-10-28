const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Settings App Version (dom)', function() {
  this.timeout(3000);

  beforeEach(function() {
    // Clear module cache so each test requires a fresh copy
    Object.keys(require.cache).forEach(k => {
      if (k.indexOf(path.join('src', 'renderer', 'app.js')) !== -1) delete require.cache[k];
    });
  });

  it('prefers preload API getVersion when available', function(done) {
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html'), 'utf8');
    const dom = new JSDOM(html, { url: 'http://localhost' });
    // Expose minimal globals expected by the renderer before requiring it
    global.window = dom.window;
    global.document = dom.window.document;
  global.window.matchMedia = function() { return { matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }; };
    const store = {};
    global.window.localStorage = {
      getItem: (k) => (k in store) ? store[k] : null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    };
    global.localStorage = global.window.localStorage;

    // Provide preload API before loading the module
    global.window.api = {
      getVersion: async () => '1.2.3',
      invoke: async () => null,
      on: () => {},
      removeListener: () => {},
      addListener: () => {}
    };

    // Require the renderer module (runs in Node context but will use the
    // provided global.window/document objects for DOM interactions)
    const appModule = require('../../src/renderer/app.js');

    // Allow any initialization to run
    setTimeout(() => {
      try {
        const btn = window.document.getElementById('settings-button');
        assert(btn, 'settings-button must exist');
        btn.click();
        setTimeout(() => {
          try {
            const appVer = window.document.getElementById('app-version');
            assert(appVer, 'app-version element should exist');
            assert.ok(appVer.textContent.includes('1.2.3'), `expected app-version to include 1.2.3 but was "${appVer.textContent}"`);
            // Cleanup globals
            try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
            done();
          } catch (err) { done(err); }
        }, 40);
      } catch (err) { done(err); }
    }, 40);
  });

  it('falls back to process.env.npm_package_version when preload missing', function(done) {
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html'), 'utf8');
    const dom = new JSDOM(html, { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;
  global.window.matchMedia = function() { return { matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }; };
    const store = {};
    global.window.localStorage = {
      getItem: (k) => (k in store) ? store[k] : null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    };
    global.localStorage = global.window.localStorage;
  // Set npm_package_version on the Node process env so module sees it
  const oldPkgVer = process.env.npm_package_version;
  process.env.npm_package_version = '0.0.1';
    global.window.api = { invoke: async () => null, on: () => {}, removeListener: () => {}, addListener: () => {} };
    const appModule = require('../../src/renderer/app.js');

    setTimeout(() => {
      try {
        const btn = window.document.getElementById('settings-button');
        assert(btn, 'settings-button must exist');
        btn.click();
          setTimeout(() => {
            try {
              const appVer = window.document.getElementById('app-version');
              assert(appVer, 'app-version element should exist');
              assert.ok(appVer.textContent.includes('0.0.1'), `expected app-version to include 0.0.1 but was "${appVer.textContent}"`);
            try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
            // restore env
            try { if (oldPkgVer === undefined) delete process.env.npm_package_version; else process.env.npm_package_version = oldPkgVer; } catch (e) {}
            done();
            } catch (err) { done(err); }
          }, 30);
      } catch (err) { done(err); }
    }, 40);
  });

  it('falls back to fetching package.json when other sources missing', function(done) {
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html'), 'utf8');
    const dom = new JSDOM(html, { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window.document;
  global.window.matchMedia = function() { return { matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }; };
    const store = {};
    global.window.localStorage = {
      getItem: (k) => (k in store) ? store[k] : null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    };
    global.localStorage = global.window.localStorage;
  // Ensure npm_package_version (set by npm test) does not short-circuit the fetch fallback
  const oldPkgVer = process.env.npm_package_version;
  try { delete process.env.npm_package_version; } catch (e) {}
  // Stub global fetch so module's typeof fetch check succeeds
  const oldFetch = global.fetch;
  global.fetch = async () => ({ status: 200, async json() { return { version: '2.3.4' }; } });
    global.window.api = { invoke: async () => null, on: () => {}, removeListener: () => {}, addListener: () => {} };
    const appModule = require('../../src/renderer/app.js');

    setTimeout(() => {
      try {
        const btn = window.document.getElementById('settings-button');
        assert(btn, 'settings-button must exist');
        btn.click();
        setTimeout(() => {
          try {
            const appVer = window.document.getElementById('app-version');
            assert(appVer, 'app-version element should exist');
            assert.ok(appVer.textContent.includes('2.3.4'), `expected app-version to include 2.3.4 but was "${appVer.textContent}"`);
            try { delete global.window; delete global.document; delete global.localStorage; } catch (e) {}
            // restore fetch and env
            try { global.fetch = oldFetch; } catch (e) {}
            try { if (oldPkgVer === undefined) delete process.env.npm_package_version; else process.env.npm_package_version = oldPkgVer; } catch (e) {}
            done();
          } catch (err) { done(err); }
        }, 40);
      } catch (err) { done(err); }
    }, 40);
  });
});

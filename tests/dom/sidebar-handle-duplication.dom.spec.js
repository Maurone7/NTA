const { JSDOM } = require('jsdom');
const { describe, it } = require('mocha');

describe('DOM: sidebar handle duplication', () => {
  it('initialization does not create duplicate sidebar-resize-handle', () => {
    const dom = new JSDOM(`<!doctype html><html><head></head><body><div class="app-shell"><div class="sidebar"></div></div></body></html>`);
    const { window } = dom;
    global.window = window; // some init code expects global window
    global.document = window.document;

    // Simulate the initialization function that may insert a handle
    function initSidebarHandle() {
      const existing = document.querySelectorAll('.sidebar-resize-handle');
      if (existing && existing.length) return;
      const h = document.createElement('div');
      h.className = 'sidebar-resize-handle';
      document.querySelector('.sidebar').appendChild(h);
    }

    // Call it multiple times quickly
    initSidebarHandle();
    initSidebarHandle();
    initSidebarHandle();

    const handles = document.querySelectorAll('.sidebar-resize-handle');
    if (handles.length !== 1) throw new Error('expected exactly one sidebar-resize-handle, got ' + handles.length);
  });
});

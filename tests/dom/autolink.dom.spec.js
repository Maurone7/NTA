const assert = require('assert');
const { JSDOM, VirtualConsole } = require('jsdom');

describe('DOM: autolinkPlainUrlsInTextarea', function() {
  let window, document;

  beforeEach(function() {
    const vConsole = new VirtualConsole();
    const dom = new JSDOM(`<!doctype html><html><body><textarea id="ta"></textarea></body></html>`, { runScripts: 'outside-only', virtualConsole: vConsole });
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;
  });

  afterEach(function() {
    try { window.close(); } catch (e) {}
    delete global.window;
    delete global.document;
  });

  // Use the real implementation so the test validates the module directly.
  const { autolinkPlainUrlsInTextarea } = require('../../src/renderer/autolink');

  it('converts bare www URL when followed by space and preserves caret after space', function() {
    const ta = document.getElementById('ta');
    // Simulate typing 'www.google.com' then pressing space
    ta.value = 'Visit www.google.com ';
    // cursor at end (after space)
    ta.selectionStart = ta.selectionEnd = ta.value.length;

  autolinkPlainUrlsInTextarea(ta);
  // Should contain the linked URL and preserve trailing space + caret at end
  assert(ta.value.includes('(www.google.com)'), 'expected URL to be present in converted value');
  assert.strictEqual(ta.value.endsWith(' '), true);
  assert.strictEqual(ta.selectionStart, ta.selectionEnd);
  assert.strictEqual(ta.selectionStart, ta.value.length);
  });

  it('converts http URL when followed by Enter and places caret on new line', function() {
    const ta = document.getElementById('ta');
    // Simulate typing 'http://example.com' then pressing Enter
    ta.value = 'Line1 http://example.com\n';
    // cursor at end (on new empty line)
    ta.selectionStart = ta.selectionEnd = ta.value.length;

  autolinkPlainUrlsInTextarea(ta);
  // After conversion, the link should include the URL and newline preserved
  const lines = ta.value.split('\n');
  assert(lines[0].includes('(http://example.com)'), 'expected URL to be present in converted first line');
  // Caret should be at the end (after the newline)
  assert.strictEqual(ta.selectionStart, ta.selectionEnd);
  assert.strictEqual(ta.selectionStart, ta.value.length);
  });
});

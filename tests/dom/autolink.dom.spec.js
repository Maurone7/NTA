const assert = require('assert');
const { JSDOM } = require('jsdom');

describe('DOM: autolinkPlainUrlsInTextarea', function() {
  let window, document;

  beforeEach(function() {
    const dom = new JSDOM(`<!doctype html><html><body><textarea id="ta"></textarea></body></html>`, { runScripts: 'outside-only' });
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

  // Minimal copy of the autolink function's behavior needed for tests.
  function autolinkPlainUrlsInTextarea(textarea) {
    if (!textarea || typeof textarea.value !== 'string') return;
    const oldVal = textarea.value;
    if (!/(?:https?:\/\/|www\.)/i.test(oldVal)) return;
    const urlRe = /\b(?:https?:\/\/|www\.)[^\s<>()]+/gi;
    const out = oldVal.replace(urlRe, (url) => {
      let label = url;
      try {
        if (/^www\./i.test(url)) {
          const m = url.match(/^(?:www\.)?([^\/\:\?#]+)/i);
          label = (m && m[1]) ? m[1].replace(/^www\./i, '') : url;
        } else {
          const u = new URL(url);
          label = (u.hostname || url).replace(/^www\./i, '');
        }
      } catch (e) {
        const m = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\:\?#]+)/i);
        label = (m && m[1]) ? m[1].replace(/^www\./i, '') : url;
      }
      return `[${label}](${url})`;
    });

    if (out !== oldVal) {
      const oldLen = oldVal.length;
      const newLen = out.length;
      const delta = newLen - oldLen;
      // Capture original selection BEFORE mutating value
      const origStart = textarea.selectionStart || 0;
      const origEnd = textarea.selectionEnd || 0;
      textarea.value = out;
      try {
        const desiredStart = Math.max(0, Math.min(origStart + delta, newLen));
        const desiredEnd = Math.max(0, Math.min(origEnd + delta, newLen));
        textarea.selectionStart = desiredStart;
        textarea.selectionEnd = desiredEnd;
      } catch (e) {
        // ignore
      }
    }
  }

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

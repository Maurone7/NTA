const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Update UI (unit)', function() {
  let dom;
  let document;
  before(function() {
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html'), 'utf8');
    dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    document = dom.window.document;
  });

  it('should include check updates and open release buttons', function() {
    const checkBtn = document.getElementById('check-updates-btn');
    const openBtn = document.getElementById('update-download-button');
    assert(checkBtn, 'Check updates button exists');
    assert(openBtn, 'Open release page button exists');
  });

  it('should reserve space for the submessage element', function() {
    const sub = document.getElementById('check-updates-submessage');
    assert(sub, 'Submessage element exists');
    // Should be present but empty by default
    assert.strictEqual(sub.textContent.trim(), '', 'Submessage starts empty');
  });
});

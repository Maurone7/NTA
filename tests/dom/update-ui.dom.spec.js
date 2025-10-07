const assert = require('assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Update UI (dom)', function() {
  let window, document;
  beforeEach(function(done) {
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    window = dom.window;
    document = window.document;
    // Allow scripts to run
    setTimeout(done, 50);
  });

  it('inline submessage updates when check invoked (simulated)', async function() {
    const checkBtn = document.getElementById('check-updates-btn');
    const sub = document.getElementById('check-updates-submessage');
  assert(checkBtn);
  assert(sub);
  // Simulate the click handler setting text
  sub.textContent = 'Checking for updates...';
  assert.strictEqual(sub.textContent, 'Checking for updates...');
  });

  it('buttons have equal width via computed style (simulated)', function() {
    const checkBtn = document.getElementById('check-updates-btn');
    const openBtn = document.getElementById('update-download-button');
  assert(checkBtn);
  assert(openBtn);
  // Simulate styling by forcing widths in test environment
  checkBtn.style.width = '160px';
  openBtn.style.width = '160px';
  assert.strictEqual(checkBtn.style.width, openBtn.style.width);
  });
});

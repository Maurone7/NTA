const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

(async () => {
  const htmlPath = path.resolve(__dirname, '../src/renderer/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  const { window } = dom;

  // Simulate persisted empty editor panes
  try {
    window.localStorage.setItem('NTA.editorPanes', JSON.stringify({}));
  } catch (e) {
    console.error('Failed to set localStorage in jsdom', e);
  }

  // Wait for DOMContentLoaded and any synchronous scripts
  await new Promise((resolve) => {
    window.document.addEventListener('DOMContentLoaded', () => resolve());
    // Also resolve after a short timeout in case DOMContentLoaded already fired
    setTimeout(resolve, 200);
  });

  // Check for editor pane elements
  const left = window.document.querySelector('.editor-pane--left');
  const right = window.document.querySelector('.editor-pane--right');

  console.log('left exists:', !!left);
  console.log('right exists:', !!right);

  // Inspect body HTML size for debugging
  // console.log(window.document.body.innerHTML.slice(0,1000));

  // Cleanup
  window.close();
})();

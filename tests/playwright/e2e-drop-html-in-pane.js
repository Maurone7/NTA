const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Electron app for e2e-drop-html-in-pane test...');
  const app = await electron.launch({ args: ['.'] });
  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  await window.waitForTimeout(400);

  const htmlPath = path.join(process.cwd(), 'test-folder', 'sample-page.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('Test HTML missing at', htmlPath);
    await app.close();
    process.exit(3);
  }

  // Drop HTML into left pane
  const drop = await window.evaluate(async ({ filePath, fileName }) => {
    const paneEl = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
    if (!paneEl) return { ok: false, error: 'no-left' };
    const fakeDataTransfer = { files: [ { name: fileName, path: filePath } ] };
    const ev = new Event('drop', { bubbles: true, cancelable: true });
    try { ev.dataTransfer = fakeDataTransfer; } catch(e) { ev._dataTransfer = fakeDataTransfer; }
    paneEl.dispatchEvent(ev);
    return { ok: true };
  }, { filePath: htmlPath, fileName: path.basename(htmlPath) });

  if (!drop.ok) { console.error('Drop failed', drop); await app.close(); process.exit(2); }

  // Wait for the app to process the drop and populate textarea
  await window.waitForTimeout(800);

  const textareaValue = await window.evaluate(() => {
    const ta = document.querySelector('.editor-pane--left textarea') || document.querySelector('.editor-pane textarea');
    return ta ? ta.value : null;
  });

  console.log('Textarea length after drop:', textareaValue ? textareaValue.length : null);
  if (!textareaValue || textareaValue.length < 10) {
    console.error('HTML source not present in pane textarea');
    await app.close();
    process.exit(2);
  }

  console.log('HTML source appeared in pane textarea. Test passed.');
  await app.close();
  process.exit(0);
})();

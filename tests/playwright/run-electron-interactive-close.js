const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Electron app via Playwright...');
  const app = await electron.launch({ args: ['.'] });

  // Get the first renderer window
  const window = await app.firstWindow();
  if (!window) {
    console.error('No app window detected');
    await app.close();
    process.exit(3);
  }

  // Wait for UI to be ready
  await window.waitForLoadState('domcontentloaded');
  await window.waitForTimeout(400);

  // Click all close buttons within editor panes
  const closeButtons = await window.$$('.editor-pane .editor-pane__actions button');
  console.log('Found close buttons in renderer:', closeButtons.length);
  for (let i = closeButtons.length - 1; i >= 0; i--) {
    try {
      await closeButtons[i].click({ force: true });
      await window.waitForTimeout(120);
    } catch (e) {
      // ignore
    }
  }

  // Try legacy control
  try {
    const legacy = await window.$('#close-left-editor');
    if (legacy) {
      console.log('Found legacy close-left control, clicking it.');
      await legacy.click({ force: true });
      await window.waitForTimeout(120);
    }
  } catch (e) {}

  // Collect pane snapshot from renderer DOM
  const panes = await window.$$eval('.editor-pane', (nodes) => nodes.map((n) => {
    const badge = n.querySelector('.editor-pane__badge');
    const actions = n.querySelector('.editor-pane__actions');
    return {
      badgeText: badge ? badge.textContent.trim() : null,
      hasCloseButton: !!(actions && actions.querySelector('button')),
      dataPaneId: n.getAttribute('data-pane-id') || null,
      outerHTML: n.outerHTML.slice(0, 2000)
    };
  }));

  console.log('Panes after close (from Electron window):');
  console.log(JSON.stringify(panes, null, 2));

  const stray = panes.find(p => p.badgeText === 'Left' && p.hasCloseButton);
  if (stray) console.error('Stray Left pane detected in Electron runtime:', stray);
  else console.log('No stray Left pane detected in Electron runtime.');

  // Also fetch last 200 lines from .debug/nta-debug.log if present
  try {
    const debugLogPath = path.join(process.cwd(), '.debug', 'nta-debug.log');
    if (fs.existsSync(debugLogPath)) {
      const content = fs.readFileSync(debugLogPath, 'utf8');
      const lines = content.trim().split(/\r?\n/);
      const tail = lines.slice(-200);
      console.log('\n--- last debug log lines ---\n' + tail.join('\n'));
    } else {
      console.log('.debug/nta-debug.log not found');
    }
  } catch (e) {
    console.error('Failed to read debug log:', e);
  }

  await app.close();
  process.exit(stray ? 2 : 0);
})();

const { test, expect } = require('@playwright/test');
const path = require('path');

// This test runs headless against the renderer index.html and simulates
// closing all editor panes, then verifies no stray static placeholder
// with label 'Left' and a close button remains.

test('close all panes and ensure no stray Left placeholder', async ({ page }) => {
  const file = path.join(__dirname, '..', '..', 'src', 'renderer', 'index.html');
  await page.goto('file://' + file);

  // wait for layout to initialize
  await page.waitForTimeout(200);

  // gather all close buttons inside .editor-pane elements
  const closeButtons = await page.locator('.editor-pane .editor-pane__actions button').elementHandles();

  // Click each close button (from right-to-left) to simulate user closing panes
  for (let i = closeButtons.length - 1; i >= 0; i--) {
    try {
      await closeButtons[i].click({ force: true });
      await page.waitForTimeout(80);
    } catch (e) {
      // ignore click errors
    }
  }

  // Additionally, if there is a legacy left close control, click it
  try {
    const legacy = await page.$('#close-left-editor');
    if (legacy) await legacy.click({ force: true });
  } catch (e) {}

  await page.waitForTimeout(200);

  // Capture editor pane badges and attributes
  const panes = await page.$$eval('.editor-pane', (nodes) => {
    return nodes.map((n) => {
      const badge = n.querySelector('.editor-pane__badge');
      return {
        html: n.outerHTML.slice(0, 2000),
        badgeText: badge ? badge.textContent.trim() : null,
        hasCloseButton: !!n.querySelector('.editor-pane__actions button')
      };
    });
  });

  console.log('Panes after close:', JSON.stringify(panes, null, 2));

  // Assert no visible pane has badgeText === 'Left' and hasCloseButton true
  const stray = panes.find(p => p.badgeText === 'Left' && p.hasCloseButton);
  expect(stray).toBeUndefined();
});

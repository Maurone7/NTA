const DEFAULT = { checks: 4, interval: 80, timeout: 8000 };

async function waitForStableBoundingBox(page, selector, opts) {
  opts = Object.assign({}, DEFAULT, opts || {});
  const start = Date.now();
  let last = null;
  let stable = 0;
  while (Date.now() - start < opts.timeout) {
    try {
      const el = await page.$(selector);
      if (!el) { stable = 0; last = null; await page.waitForTimeout(opts.interval); continue; }
      const box = await el.boundingBox();
      if (!box) { stable = 0; last = null; await page.waitForTimeout(opts.interval); continue; }
      const snapshot = `${Math.round(box.x)}:${Math.round(box.y)}:${Math.round(box.width)}:${Math.round(box.height)}`;
      if (snapshot === last) {
        stable++;
        if (stable >= opts.checks) return box;
      } else {
        stable = 1; last = snapshot;
      }
    } catch (e) {
      // ignore transient failures and retry
      stable = 0; last = null;
    }
    await page.waitForTimeout(opts.interval);
  }
  // final attempt to return whatever we have
  try { const el = await page.$(selector); return el ? await el.boundingBox() : null; } catch (e) { return null; }
}

async function callUpdateAndWaitForMarker(page, markerAttr = 'data-nta-last-preview-applied', opts) {
  opts = Object.assign({}, DEFAULT, opts || {});
  const initial = await page.evaluate((a) => document.documentElement.getAttribute(a) || null, markerAttr);
  try { await page.evaluate(() => { try { if (typeof updatePreviewTogglePosition === 'function') updatePreviewTogglePosition(); } catch (e) {} }); } catch (e) {}
  const start = Date.now();
  while (Date.now() - start < opts.timeout) {
    try {
      const cur = await page.evaluate((a) => document.documentElement.getAttribute(a) || null, markerAttr);
      if (cur && cur !== initial) return cur;
    } catch (e) {}
    await page.waitForTimeout(opts.interval);
  }
  return null;
}

module.exports = { waitForStableBoundingBox, callUpdateAndWaitForMarker };

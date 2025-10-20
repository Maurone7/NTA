// Lightweight autolink helper extracted from app renderer logic so it can be
// unit-tested independently and reused by the renderer.
function autolinkPlainUrlsInTextarea(textarea) {
  try {
    if (!textarea || typeof textarea.value !== 'string') return;
    let v = textarea.value;
    if (!/(?:https?:\/\/|www\.)/i.test(v)) return;

    // Match either scheme-prefixed URLs or bare www. URLs
    const urlRe = /\b(?:https?:\/\/|www\.)[^\s<>()]+/gi;
    let match;
    const originalSelectionStart = textarea.selectionStart || 0;
    const originalSelectionEnd = textarea.selectionEnd || 0;
    // We'll build a new string progressively to allow conservative skipping
    let out = v;
    while ((match = urlRe.exec(v)) !== null) {
      const url = match[0];
      const idx = match.index;
      // Check surrounding chars to avoid URLs already in links or parentheses
      const beforeChar = v[idx - 1] || '';
      const afterChar = v[idx + url.length] || '';
      if (beforeChar === '(' || beforeChar === ']' || afterChar === ')' || afterChar === ']') {
        continue;
      }

      // Avoid transforming if this URL is already part of a markdown link like [text](url)
      const lookback = Math.max(0, idx - 60);
      const contextBefore = v.slice(lookback, idx + url.length + 2);
      if (/\[[^\]]*\]\($/m.test(contextBefore) || /\[[^\]]+\]\([^)]*$/m.test(contextBefore)) {
        continue;
      }

      // Build a label using the URL host (strip leading www.).
      let label = url;
      try {
        if (/^www\./i.test(url)) {
          const m = url.match(/^(?:www\.)?([^\/\:?#]+)/i);
          label = (m && m[1]) ? m[1].replace(/^www\./i, '') : url;
        } else {
          const u = new URL(url);
          label = (u.hostname || url).replace(/^www\./i, '');
        }
      } catch (e) {
        const m = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\:?#]+)/i);
        label = (m && m[1]) ? m[1].replace(/^www\./i, '') : url;
      }

      const replacement = `[${label}](${url})`;
      const before = out.slice(0, idx);
      const after = out.slice(idx + url.length);
      out = before + replacement + after;
      // Move lastIndex forward in the original string to avoid infinite loop
      urlRe.lastIndex = idx + replacement.length;
    }

    if (out !== textarea.value) {
      const oldLen = textarea.value.length;
      const newLen = out.length;
      const delta = newLen - oldLen;
      // Preserve original selection positions
      const origStart = textarea.selectionStart || 0;
      const origEnd = textarea.selectionEnd || 0;
      textarea.value = out;
      try {
        const desiredStart = Math.max(0, Math.min(origStart + delta, newLen));
        const desiredEnd = Math.max(0, Math.min(origEnd + delta, newLen));
        textarea.selectionStart = desiredStart;
        textarea.selectionEnd = desiredEnd;
      } catch (e) { /* ignore selection restore errors */ }
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } catch (e) {
    // swallow errors to avoid breaking typing
  }
}

module.exports = { autolinkPlainUrlsInTextarea };

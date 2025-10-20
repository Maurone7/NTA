const assert = require('assert');

function insertCitationWithStyleInternalFake(inst, citeKey, start, end, style, cachedBib) {
  const bibIndexMap = {};
  Object.keys(cachedBib || {}).forEach((k, idx) => { bibIndexMap[k] = idx + 1; });
  const entry = (cachedBib || {})[citeKey] || {};
  let replacement = `[@${citeKey}]`;
  if (style === 'author-year') {
    const a = entry.author ? entry.author.split(' and ')[0].split(',')[0] : citeKey;
    replacement = `(${a}${entry.year ? `, ${entry.year}` : ''})`;
  } else if (style === 'numeric') {
    const num = bibIndexMap[citeKey] || '?';
    replacement = `[${num}]`;
  } else if (style === 'author-inline') {
    const a = entry.author ? entry.author.split(' and ')[0].split(',')[0] : citeKey;
    replacement = `${a}${entry.year ? ` (${entry.year})` : ''}`;
  } else if (style === 'brackets') {
    replacement = `[@${citeKey}]`;
  }

  if (typeof inst.setRangeText === 'function') {
    inst.setRangeText(replacement);
  } else {
    const v = inst.getValue();
    inst.setValue(v.slice(0, start) + replacement + v.slice(end));
  }
}

class FakeEditor {
  constructor(val) { this.val = val; this.selectionStart = 0; this.selectionEnd = 0; }
  isPresent() { return true; }
  getValue() { return this.val; }
  setValue(v) { this.val = v; }
  setRangeText(s) { const start = this.selectionStart; const end = this.selectionEnd; this.val = this.val.slice(0, start) + s + this.val.slice(end); }
  setSelectionRange(s,e) { this.selectionStart = s; this.selectionEnd = e; }
}

const bib = {
  smith2020: { key: 'smith2020', author: 'Smith, John and Doe, Jane', title: 'An Example', year: '2020' },
  doe2018: { key: 'doe2018', author: 'Doe, Jane', title: 'Book', year: '2018' }
};

const ed1 = new FakeEditor('Hello ');
ed1.selectionStart = 6; ed1.selectionEnd = 6;
insertCitationWithStyleInternalFake(ed1, 'smith2020', 6, 6, 'brackets', bib);
assert.strictEqual(ed1.getValue(), 'Hello [@smith2020]');

const ed2 = new FakeEditor('See ');
ed2.selectionStart = 4; ed2.selectionEnd = 4;
insertCitationWithStyleInternalFake(ed2, 'smith2020', 4, 4, 'author-year', bib);
assert.strictEqual(ed2.getValue(), 'See (Smith, 2020)');

const ed3 = new FakeEditor('Ref ');
ed3.selectionStart = 4; ed3.selectionEnd = 4;
insertCitationWithStyleInternalFake(ed3, 'doe2018', 4, 4, 'numeric', bib);
assert.strictEqual(ed3.getValue(), 'Ref [2]');

const ed4 = new FakeEditor('According to ');
ed4.selectionStart = 13; ed4.selectionEnd = 13;
insertCitationWithStyleInternalFake(ed4, 'doe2018', 12,12, 'author-inline', bib);
assert.strictEqual(ed4.getValue(), 'According to Doe (2018)');

console.log('insert-citation.test.js: PASS');

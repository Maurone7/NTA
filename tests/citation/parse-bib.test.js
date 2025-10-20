const assert = require('assert');

function parseBibtex(bibtexText) {
  if (!bibtexText) return {};
  const entries = {};
  const raw = bibtexText.split(/@/).map(s => s.trim()).filter(Boolean);
  for (const item of raw) {
    const m = item.match(/^[^{]+\{\s*([^,\s]+)\s*,([\s\S]*)\}\s*$/m);
    if (!m) continue;
    const key = m[1].trim();
    const body = m[2];
    const entry = { key };
    const titleM = body.match(/title\s*=\s*\{([^}]*)\}/i);
    const authorM = body.match(/author\s*=\s*\{([^}]*)\}/i);
    const yearM = body.match(/year\s*=\s*\{([^}]*)\}/i);
    const urlM = body.match(/url\s*=\s*\{([^}]*)\}/i);
    if (titleM) entry.title = titleM[1].trim();
    if (authorM) entry.author = authorM[1].trim();
    if (yearM) entry.year = yearM[1].trim();
    if (urlM) entry.url = urlM[1].trim();
    entries[key] = entry;
  }
  return entries;
}

const sample = `@article{smith2020,
  title={An Example Paper},
  author={Smith, John and Doe, Jane},
  year={2020},
  url={http://example.com}
}

@book{doe2018,
  title={A Book},
  author={Doe, Jane},
  year={2018}
}`;

const parsed = parseBibtex(sample);
assert(parsed.smith2020);
assert.strictEqual(parsed.smith2020.title, 'An Example Paper');
assert.strictEqual(parsed.smith2020.author, 'Smith, John and Doe, Jane');
assert.strictEqual(parsed.smith2020.year, '2020');
assert.strictEqual(parsed.smith2020.url, 'http://example.com');
assert(parsed.doe2018);
assert.strictEqual(parsed.doe2018.title, 'A Book');
assert.strictEqual(parsed.doe2018.year, '2018');

console.log('parse-bib.test.js: PASS');

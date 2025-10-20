const assert = require('assert');

describe('Basic smoke parts (settings & filetype detection)', function() {
  it('settings storage behavior (mock)', function() {
    const mockStorage = {};
    const localStorage = {
      getItem: (k) => mockStorage[k] || null,
      setItem: (k, v) => { mockStorage[k] = v; },
      removeItem: (k) => { delete mockStorage[k]; }
    };
    localStorage.setItem('a', '1');
    assert.equal(localStorage.getItem('a'), '1');
    localStorage.removeItem('a');
    assert.equal(localStorage.getItem('a'), null);
  });

  it('file type detection (simple cases)', function() {
    function detectType(filename) {
      const lower = filename.toLowerCase();
      if (lower.endsWith('.synctex.gz')) return 'code';
      const ext = require('path').extname(filename).toLowerCase();
      switch (ext) {
        case '.md': return 'markdown';
        case '.tex': return 'latex';
        case '.py': case '.js': case '.ts': case '.txt': case '.aux': case '.log': case '.sh': 
        case '.fdb_latexmk': case '.out': case '.synctex.gz': case '.toc': return 'code';
        case '.ipynb': return 'notebook';
        case '.pdf': return 'pdf';
        case '.pptx': return 'pptx';
        case '.html': case '.htm': return 'html';
        case '.json': return 'json';
        default: return 'unknown';
      }
    }
    assert.equal(detectType('a.md'), 'markdown');
    assert.equal(detectType('a.tex'), 'latex');
    assert.equal(detectType('a.txt'), 'code');
    assert.equal(detectType('a.unknownext'), 'unknown');
  });
});

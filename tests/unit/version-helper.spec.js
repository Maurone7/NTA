const assert = require('assert');
const { getAppVersion } = require('../../src/main/version-helper');

describe('version-helper', function() {
  it('returns app.getVersion when available', async function() {
    const app = { getVersion: () => '1.2.3' };
    const v = await getAppVersion(app);
    assert.strictEqual(v, '1.2.3');
  });

  it('falls back to process.env.npm_package_version', async function() {
    const old = process.env.npm_package_version;
    process.env.npm_package_version = '9.9.9';
    try {
      const v = await getAppVersion(null);
      assert.strictEqual(v, '9.9.9');
    } finally {
      if (old === undefined) delete process.env.npm_package_version; else process.env.npm_package_version = old;
    }
  });

  it('falls back to package.json when env not set', async function() {
    // Remove env var to force package.json lookup
    const old = process.env.npm_package_version;
    if (old !== undefined) delete process.env.npm_package_version;
    try {
      const v = await getAppVersion(null);
      // The repository package.json contains a version; assert that we at least
      // return a non-empty string that is not 'Unknown'
      assert.ok(typeof v === 'string' && v.length > 0);
      assert.notStrictEqual(v, 'Unknown');
    } finally {
      if (old !== undefined) process.env.npm_package_version = old;
    }
  });
});

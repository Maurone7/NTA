const assert = require('assert');
const { execSync } = require('child_process');
const path = require('path');

describe('Smoke script', function() {
  this.timeout(30000);
  it('runs scripts/smoke-test.js without error', function() {
    const script = path.join(__dirname, '..', '..', 'scripts', 'smoke-test.js');
    // Run the smoke test script; if it exits non-zero execSync will throw.
    execSync(`node "${script}"`, { stdio: 'inherit' });
    assert.ok(true);
  });
});

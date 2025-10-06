const { execSync } = require('child_process');
const path = require('path');

const tests = ['parse-bib.test.js', 'insert-citation.test.js'];
const base = path.join(__dirname);
let failed = false;
for (const t of tests) {
  try {
    console.log('Running', t);
    execSync(`node "${path.join(base, t)}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Test failed:', t);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('All citation tests passed');

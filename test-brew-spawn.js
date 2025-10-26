#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('\n=== Testing Brew Installation Command ===\n');

// Step 1: Find brew
function findBrewPath() {
  const commonPaths = [
    '/opt/homebrew/bin/brew',
    '/usr/local/bin/brew',
    '/home/linuxbrew/.linuxbrew/bin/brew'
  ];
  
  for (const path of commonPaths) {
    if (fs.existsSync(path)) {
      console.log(`✓ Found brew at: ${path}`);
      return path;
    }
  }
  
  console.log('✗ Brew not found in common locations');
  return 'brew';
}

const brewPath = findBrewPath();
const brewDir = brewPath.substring(0, brewPath.lastIndexOf('/'));

// Step 2: Set up environment
const env = Object.assign({}, process.env, {
  PATH: `${brewDir}:${process.env.PATH || ''}`
});

console.log(`\nBrew directory: ${brewDir}`);
console.log(`New PATH starts with: ${env.PATH.split(':').slice(0, 3).join(':')}\n`);

// Step 3: Test a simple brew command
console.log('Running: brew --version\n');
const command = 'brew --version';

const child = spawn('bash', ['-c', command], {
  stdio: 'inherit',  // Show output directly
  env: env
});

child.on('close', (code) => {
  console.log(`\n✓ Command exited with code: ${code}\n`);
  
  if (code === 0) {
    console.log('SUCCESS: Brew is accessible with the new PATH!');
    console.log('The installation should work now.\n');
  } else {
    console.log('FAILED: Brew still not found. Debugging info:');
    console.log(`- Brew path used: ${brewPath}`);
    console.log(`- Command: ${command}`);
    console.log(`- Exit code: ${code}\n`);
  }
});

child.on('error', (err) => {
  console.error(`\nERROR: ${err.message}\n`);
});

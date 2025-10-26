#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('\n=== Testing Brew Install Command (with stderr capture) ===\n');

function findBrewPath() {
  const commonPaths = [
    '/opt/homebrew/bin/brew',
    '/usr/local/bin/brew',
    '/home/linuxbrew/.linuxbrew/bin/brew'
  ];
  
  for (const path of commonPaths) {
    if (fs.existsSync(path)) {
      return path;
    }
  }
  return 'brew';
}

const brewPath = findBrewPath();
const brewDir = brewPath.substring(0, brewPath.lastIndexOf('/'));
const env = Object.assign({}, process.env, {
  PATH: `${brewDir}:${process.env.PATH || ''}`
});

console.log(`Brew path: ${brewPath}`);
console.log(`Command: ${brewPath} install basictex\n`);
console.log('Starting installation...\n');

const startTime = Date.now();
const child = spawn('bash', ['-c', `${brewPath} install basictex`], {
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true,
  env: env
});

let stdout = '';
let stderr = '';

child.stdout.on('data', (data) => {
  const text = data.toString();
  stdout += text;
  process.stdout.write(text);  // Show in real time
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  stderr += text;
  process.stderr.write(text);  // Show in real time
});

child.on('close', (code) => {
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  
  console.log(`\n\n=== Installation Complete ===`);
  console.log(`Exit code: ${code}`);
  console.log(`Duration: ${elapsed}s`);
  
  if (stderr) {
    console.log(`\nStderr captured:\n${stderr}\n`);
  }
  
  if (code === 0) {
    console.log('✓ Installation likely succeeded!');
  } else if (code === 1 || code === 2) {
    console.log('⚠ Exit code indicates warning/already installed');
  } else {
    console.log(`✗ Installation may have failed (code ${code})`);
  }
});

child.on('error', (err) => {
  console.error(`\nError: ${err.message}`);
});

console.log('(This is running in the background, detached)');
console.log('Close this script with Ctrl+C or wait for completion...\n');

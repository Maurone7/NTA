#!/usr/bin/env node

// Test LaTeX detection directly
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  LaTeX Detection Test');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('System Info:');
console.log(`  Platform: ${process.platform}`);
console.log(`  HOME: ${process.env.HOME}`);
console.log(`  Node: ${process.version}\n`);

// Test 1: System PATH
console.log('1. Testing system PATH...');
try {
  const result = execSync('pdflatex --version 2>&1', { encoding: 'utf8' });
  console.log(`   ✓ pdflatex found: ${result.split('\n')[0]}`);
} catch (e) {
  console.log(`   ✗ pdflatex not in PATH`);
}

try {
  const result = execSync('xelatex --version 2>&1', { encoding: 'utf8' });
  console.log(`   ✓ xelatex found: ${result.split('\n')[0]}`);
} catch (e) {
  console.log(`   ✗ xelatex not in PATH`);
}

// Test 2: TinyTeX locations
console.log('\n2. Testing TinyTeX locations...');
const home = process.env.HOME || os.homedir();
const tinytexLocations = [
  path.join(home, '.TinyTeX', 'bin', 'pdflatex'),
  path.join(home, '.TinyTeX', 'bin', 'xelatex'),
  path.join(home, '.local', 'bin', 'pdflatex'),
  path.join(home, '.local', 'bin', 'xelatex')
];

for (const binPath of tinytexLocations) {
  if (fs.existsSync(binPath)) {
    console.log(`   ✓ Found: ${binPath}`);
    try {
      const result = execSync(`"${binPath}" --version 2>&1`, { encoding: 'utf8' });
      console.log(`     Version: ${result.split('\n')[0]}`);
    } catch (e) {
      console.log(`     (Could not get version)`);
    }
  } else {
    console.log(`   ✗ Not found: ${binPath}`);
  }
}

// Test 3: Shell PATH variable
console.log('\n3. Shell PATH:');
try {
  const result = execSync('echo $PATH', { encoding: 'utf8', shell: '/bin/zsh' });
  result.split(':').forEach(p => {
    console.log(`   - ${p}`);
  });
} catch (e) {
  console.log('   (Could not get PATH)');
}

console.log('\n═══════════════════════════════════════════════════════════════\n');

#!/usr/bin/env node

/**
 * Test script for terminal functionality
 * Tests the shell spawning and command execution
 */

const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

console.log('🧪 Terminal Testing Suite\n');

// Test 1: Check if /bin/bash exists
console.log('Test 1: Check bash availability');
const fs = require('fs');
if (fs.existsSync('/bin/bash')) {
  console.log('✓ /bin/bash exists');
} else {
  console.log('✗ /bin/bash NOT FOUND');
  process.exit(1);
}

// Test 2: Simple shell spawn
console.log('\nTest 2: Spawn shell and execute simple command');
const shell = spawn('/bin/bash', [], {
  cwd: os.homedir(),
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, TERM: 'xterm-256color' }
});

let testOutput = '';
let testError = '';

shell.stdout.on('data', (data) => {
  testOutput += data.toString();
  console.log('  stdout:', data.toString().trim());
});

shell.stderr.on('data', (data) => {
  testError += data.toString();
  console.log('  stderr:', data.toString().trim());
});

// Send a simple echo command
setTimeout(() => {
  console.log('  Sending command: echo "Hello Terminal"');
  shell.stdin.write('echo "Hello Terminal"\n');
}, 100);

// Send exit code marker
setTimeout(() => {
  console.log('  Sending exit code marker');
  shell.stdin.write('echo "___TEST_COMPLETE___"\n');
}, 200);

// Wait for completion
setTimeout(() => {
  shell.stdin.end();
  
  if (testOutput.includes('Hello Terminal')) {
    console.log('✓ Echo command worked');
  } else {
    console.log('✗ Echo command did NOT produce expected output');
  }
  
  if (testOutput.includes('___TEST_COMPLETE___')) {
    console.log('✓ Exit marker detected');
  } else {
    console.log('✗ Exit marker NOT detected');
  }
  
  console.log('\n  Full output:', JSON.stringify(testOutput));
  console.log('  Full error:', JSON.stringify(testError));
  
  // Test 3: pwd command
  runPwdTest();
}, 500);

function runPwdTest() {
  console.log('\nTest 3: PWD command');
  
  const shell2 = spawn('/bin/bash', [], {
    cwd: os.homedir(),
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, TERM: 'xterm-256color' }
  });
  
  let pwdOutput = '';
  
  shell2.stdout.on('data', (data) => {
    pwdOutput += data.toString();
  });
  
  setTimeout(() => {
    console.log('  Sending command: pwd');
    shell2.stdin.write('pwd\n');
  }, 100);
  
  setTimeout(() => {
    shell2.stdin.write('echo "___PWD_DONE___"\n');
  }, 200);
  
  setTimeout(() => {
    shell2.stdin.end();
    
    const homeDir = os.homedir();
    if (pwdOutput.includes(homeDir)) {
      console.log('✓ PWD returned home directory');
    } else {
      console.log('✗ PWD did NOT return expected directory');
    }
    
    console.log('  Output:', pwdOutput.trim());
    
    // Test 4: cd command
    runCdTest();
  }, 500);
}

function runCdTest() {
  console.log('\nTest 4: CD command');
  
  const shell3 = spawn('/bin/bash', [], {
    cwd: os.homedir(),
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, TERM: 'xterm-256color' }
  });
  
  let cdOutput = '';
  
  shell3.stdout.on('data', (data) => {
    cdOutput += data.toString();
  });
  
  setTimeout(() => {
    console.log('  Sending command: cd /tmp');
    shell3.stdin.write('cd /tmp\n');
  }, 100);
  
  setTimeout(() => {
    console.log('  Sending command: pwd');
    shell3.stdin.write('pwd\n');
  }, 200);
  
  setTimeout(() => {
    shell3.stdin.write('echo "___CD_DONE___"\n');
  }, 300);
  
  setTimeout(() => {
    shell3.stdin.end();
    
    if (cdOutput.includes('/tmp')) {
      console.log('✓ CD command worked');
    } else {
      console.log('✗ CD command did NOT work');
    }
    
    console.log('  Output:', cdOutput.trim());
    
    // Test 5: Test ls
    runLsTest();
  }, 600);
}

function runLsTest() {
  console.log('\nTest 5: LS command');
  
  const shell4 = spawn('/bin/bash', [], {
    cwd: os.homedir(),
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, TERM: 'xterm-256color' }
  });
  
  let lsOutput = '';
  
  shell4.stdout.on('data', (data) => {
    lsOutput += data.toString();
  });
  
  setTimeout(() => {
    console.log('  Sending command: ls');
    shell4.stdin.write('ls\n');
  }, 100);
  
  setTimeout(() => {
    shell4.stdin.write('echo "___LS_DONE___"\n');
  }, 200);
  
  setTimeout(() => {
    shell4.stdin.end();
    
    if (lsOutput.length > 0 && !lsOutput.includes('No such file')) {
      console.log('✓ LS command produced output');
    } else {
      console.log('✗ LS command did NOT produce expected output');
    }
    
    console.log('  Output lines:', lsOutput.trim().split('\n').length);
    console.log('  First 200 chars:', lsOutput.trim().substring(0, 200));
    
    console.log('\n✅ Terminal testing complete');
  }, 500);
}

// Handle errors
setTimeout(() => {
  console.log('\n⚠️  Test timeout - some operations may not have completed');
  process.exit(0);
}, 5000);

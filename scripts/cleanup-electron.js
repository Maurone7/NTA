const { execSync } = require('child_process');
const path = require('path');

console.log('Cleaning up leftover Electron processes...');

try {
  const repoRoot = path.resolve(__dirname, '..');
  console.log('Repository root for process matching:', repoRoot);

  const psOutput = execSync('ps aux', { encoding: 'utf8' });
  const lines = psOutput.split('\n').filter(l => l.trim());

  // Find candidate lines that reference 'electron' (case-insensitive) or the repo root path
  const candidates = lines.filter(line => {
    const low = line.toLowerCase();
    if (low.includes('cleanup-electron.js')) return false; // ignore our own script
    if (low.includes('visual')) return false; // ignore VS Code helpers
    return low.includes('electron') || line.includes(repoRoot);
  });

  if (candidates.length === 0) {
    console.log('No matching Electron or repo-root processes found.');
    process.exit(0);
  }

  console.log('Found candidate processes:\n' + candidates.join('\n'));

  for (const line of candidates) {
    const parts = line.trim().split(/\s+/);
    const pid = parts[1];
    if (!pid || isNaN(Number(pid))) continue;
    try {
      // Try graceful
      execSync(`kill ${pid}`, { stdio: 'inherit' });
      console.log('Sent SIGTERM to PID', pid);
    } catch (e) {
      console.log('Failed to SIGTERM PID', pid, e.message);
    }
    // Small delay then SIGKILL
    try { execSync(`sleep 0.2`); } catch (_) {}
    try {
      execSync(`kill -9 ${pid}`, { stdio: 'inherit' });
      console.log('Sent SIGKILL to PID', pid);
    } catch (e) {
      console.log('Failed to SIGKILL PID', pid, e.message);
    }
  }
} catch (e) {
  console.log('Error in cleanup:', e && e.message);
}
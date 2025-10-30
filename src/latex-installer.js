/**
 * LaTeX Installation Helper
 * 
 * Helps users install LaTeX with minimal friction
 * Detects OS and provides appropriate installation commands
 */

const { execSync } = require('child_process');
const { dialog, shell } = require('electron');
const os = require('os');
const fs = require('fs');
const { spawn } = require('child_process');

/**
 * Find brew executable path
 * Checks common Homebrew installation locations
 */
function findBrewPath() {
  const commonPaths = [
    '/opt/homebrew/bin/brew',      // Apple Silicon (M1/M2/etc)
    '/usr/local/bin/brew',          // Intel Macs & Linux
    '/home/linuxbrew/.linuxbrew/bin/brew'  // Linux Homebrew
  ];
  
  for (const path of commonPaths) {
    if (fs.existsSync(path)) {
      console.log(`[LaTeX] Found brew at: ${path}`);
      return path;
    }
  }
  
  // Fallback: assume brew is in PATH
  console.log('[LaTeX] Brew not found in common locations, will assume it is in PATH');
  return 'brew';
}

/**
 * Get platform-specific LaTeX installation info
 */
function getLatexInstallationInfo() {
  const platform = process.platform;
  
  const info = {
    platform,
    installed: false,
    engine: null,
    canAutoInstall: false,
    installCommand: null,
    installUrl: null,
    message: ''
  };

  try {
    // Check if pdflatex is installed
    execSync('pdflatex --version 2>&1', { encoding: 'utf8' });
    info.installed = true;
    info.engine = 'pdflatex';
    return info;
  } catch (e) {
    // LaTeX not installed, provide installation instructions
  }

  // Platform-specific installation info
  if (platform === 'darwin') {
    // macOS
    info.canAutoInstall = true;
    info.installCommand = 'brew install mactex-no-gui';
    info.installUrl = 'https://www.tug.org/mactex/';
    info.message = 
      'LaTeX is not installed.\n\n' +
      'Quick install for macOS:\n' +
      '1. Install Homebrew (if not installed):\n' +
      '   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n\n' +
      '2. Install MacTeX (minimal version):\n' +
      '   brew install mactex-no-gui\n\n' +
      '3. Restart this app\n\n' +
      'Or download full MacTeX from:\n' +
      'https://www.tug.org/mactex/';
  } else if (platform === 'linux') {
    // Linux
    info.canAutoInstall = false; // Can\'t auto-run sudo
    info.installCommand = 'sudo apt install texlive-latex-base texlive-fonts-recommended texlive-latex-extra';
    info.installUrl = 'https://www.tug.org/texlive/';
    info.message = 
      'LaTeX is not installed.\n\n' +
      'For Ubuntu/Debian:\n' +
      'sudo apt update\n' +
      'sudo apt install texlive-latex-base texlive-fonts-recommended texlive-latex-extra\n\n' +
      'For Fedora/CentOS:\n' +
      'sudo dnf install texlive-collection-latex\n\n' +
      'Then restart this app.';
  } else if (platform === 'win32') {
    // Windows
    info.installUrl = 'https://miktex.org/download';
    info.message = 
      'LaTeX is not installed.\n\n' +
      'For Windows, download and install MiKTeX:\n' +
      'https://miktex.org/download\n\n' +
      'After installation, restart this app.';
  }

  return info;
}

/**
 * Show installation dialog to user
 */
async function showInstallationDialog(mainWindow) {
  const info = getLatexInstallationInfo();
  
  if (info.installed) {
    return { installed: true, engine: info.engine };
  }

  const buttons = ['Learn More', 'Cancel'];
  if (info.canAutoInstall) {
    buttons.unshift('Install Now');
  }

  const result = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'LaTeX Installation',
    message: 'LaTeX is not installed on your system',
    detail: info.message,
    buttons,
    defaultId: info.canAutoInstall ? 0 : 1,
    cancelId: buttons.length - 1
  });

  if (result.response === 0) {
    if (info.canAutoInstall) {
      // Install Now
      return await attemptAutoInstall(mainWindow);
    } else {
      // Learn More
      if (info.installUrl) {
        shell.openExternal(info.installUrl);
      }
    }
  }

  return { installed: false, engine: null };
}

/**
 * Try to locate the tlmgr executable. Prefer which, then common TinyTeX locations.
 */
function locateTlmgr() {
  try {
    const which = execSync('which tlmgr', { encoding: 'utf8' }).trim();
    if (which) return which;
  } catch (e) {}

  const candidates = [
    `${os.homedir()}/Library/TinyTeX/bin/universal-darwin/tlmgr`,
    `${os.homedir()}/Library/TinyTeX/bin/*/tlmgr`,
    `${os.homedir()}/.TinyTeX/bin/universal-darwin/tlmgr`,
    `${os.homedir()}/.TinyTeX/bin/*/tlmgr`
  ];

  for (const c of candidates) {
    // glob-like check: test the directory prefix
    try {
      const dir = c.replace(/\/[^/]+$/, '');
      if (fs.existsSync(dir)) {
        // try to find any tlmgr under the path
        const findCmd = `find ${dir} -name tlmgr 2>/dev/null | head -1`;
        try {
          const p = execSync(findCmd, { encoding: 'utf8' }).trim();
          if (p) return p;
        } catch (e) {}
      }
    } catch (e) {}
  }

  return null;
}

/**
 * Spawn a tlmgr command and stream output back to the renderer as progress messages.
 */
function spawnTlmgrCommand(args, mainWindow, label) {
  return new Promise((resolve, reject) => {
    const tlmgrPath = locateTlmgr() || 'tlmgr';
    let child;
    try {
      child = spawn(tlmgrPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      return reject(err);
    }

    child.stdout.on('data', (chunk) => {
      try {
        mainWindow.webContents.send('latex:installation-progress', {
          progress: null,
          message: `${label}: ${chunk.toString()}`
        });
      } catch (e) {}
    });
    child.stderr.on('data', (chunk) => {
      try {
        mainWindow.webContents.send('latex:installation-progress', {
          progress: null,
          message: `${label} (err): ${chunk.toString()}`
        });
      } catch (e) {}
    });
    child.on('close', (code) => {
      if (code === 0) resolve(); else reject(new Error(`${label} exited with ${code}`));
    });
    child.on('error', (err) => reject(err));
  });
}

/**
 * Run repository selection and update maintenance for tlmgr.
 * - set repository to CTAN redirector (mirror chooser)
 * - update tlmgr itself and all packages
 */
async function runTlmgrMaintenance(mainWindow) {
  // prefer the CTAN redirector which resolves to nearby up-to-date mirror
  try {
    mainWindow.webContents.send('latex:installation-progress', {
      progress: 96,
      message: 'Setting tlmgr repository to CTAN redirector...'
    });
  } catch (e) {}

  try {
    await spawnTlmgrCommand(['option', 'repository', 'http://mirror.ctan.org/systems/texlive/tlnet'], mainWindow, 'tlmgr set repository');
  } catch (e) {
    // non-fatal: continue
    console.warn('[LaTeX] failed to set repository:', e && e.message ? e.message : e);
  }

  try {
    await spawnTlmgrCommand(['update', '--self'], mainWindow, 'tlmgr update --self');
  } catch (e) {
    console.warn('[LaTeX] tlmgr --self update failed:', e && e.message ? e.message : e);
  }

  try {
    await spawnTlmgrCommand(['update', '--all'], mainWindow, 'tlmgr update --all');
  } catch (e) {
    console.warn('[LaTeX] tlmgr update --all failed:', e && e.message ? e.message : e);

    // Try fallback mirrors if update --all failed (common case: mirror out of sync)
    const fallbackMirrors = [
      'https://mirrors.mit.edu/CTAN/systems/texlive/tlnet',
      'https://ctan.math.illinois.edu/systems/texlive/tlnet',
      'https://mirror.clarkson.edu/ctan/systems/texlive/tlnet',
      'https://mirrors.ibiblio.org/pub/mirrors/CTAN/systems/texlive/tlnet'
    ];

    let lastErr = e;
    for (const m of fallbackMirrors) {
      try {
        try {
          mainWindow.webContents.send('latex:installation-progress', {
            progress: null,
            message: `tlmgr update failed, trying mirror: ${m}`
          });
        } catch (er) {}

        await spawnTlmgrCommand(['option', 'repository', m], mainWindow, `tlmgr set repo ${m}`);
        await spawnTlmgrCommand(['update', '--all'], mainWindow, 'tlmgr update --all');
        // success
        try {
          mainWindow.webContents.send('latex:installation-progress', {
            progress: 98,
            message: `tlmgr update succeeded using mirror: ${m}`
          });
        } catch (er) {}
        lastErr = null;
        break;
      } catch (err2) {
        lastErr = err2;
        console.warn('[LaTeX] retry with mirror failed:', m, err2 && err2.message ? err2.message : err2);
        // continue to next mirror
      }
    }

    if (lastErr) {
      // All retries failed - propagate original error to caller
      console.error('[LaTeX] All tlmgr update attempts failed');
      throw lastErr;
    }
  }
}

/**
 * Show LaTeX distribution picker
 */
async function showDistributionPicker(mainWindow) {
  const brewPath = findBrewPath();
  
  // Note: Brew will require sudo for package installation (cask)
  // This is normal and expected - users need to enter their password
  
  const distributions = [
    {
      name: 'TinyTeX',
      size: '150 MB',
      description: 'Lightweight LaTeX with essential packages pre-installed',
      installTime: '3-4 min',
      command: 'curl -fsSL "https://yihui.org/gh/tinytex/tools/install-unx.sh" | sh && tlmgr path add && tlmgr install scheme-basic',
      recommended: true
    },
    {
      name: 'BasicTeX',
      size: '400 MB',
      description: 'Lightweight LaTeX with auto-install packages',
      installTime: '2-5 min',
      command: `${brewPath} install basictex`,
      recommended: false
    },
    {
      name: 'MacTeX-No-GUI',
      size: '2.0 GB',
      description: 'Complete LaTeX with all packages pre-installed',
      installTime: '15-30 min',
      command: `${brewPath} install mactex-no-gui`,
      recommended: false
    }
  ];

  const buttons = [
    'TinyTeX (Lightest) - 150 MB',
    'BasicTeX - 400 MB',
    'MacTeX-No-GUI (Full) - 2 GB',
    'Cancel'
  ];

  const detail = 
    'Choose which LaTeX distribution to install:\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '⚡ TinyTeX (Recommended - Lightest)\n' +
    '   • Size: 150 MB | Time: 3-4 minutes\n' +
    '   • Essential LaTeX packages pre-installed\n' +
    '   • Auto-installs additional packages as needed\n' +
    '   • Automatically generates format files for immediate use\n' +
    '   • Fast installation, small footprint\n' +
    '   • Perfect for quick note exports\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '📦 BasicTeX\n' +
    '   • Size: 400 MB | Time: 2-5 minutes\n' +
    '   • Has more essential LaTeX packages\n' +
    '   • Auto-installs additional packages as needed\n' +
    '   • Better for complex LaTeX documents\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '📚 MacTeX-No-GUI (Full)\n' +
    '   • Size: 2.0 GB | Time: 15-30 minutes\n' +
    '   • Has every LaTeX package ever created\n' +
    '   • No need to download packages later\n' +
    '   • Use if you need obscure packages\n';

  const result = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Choose LaTeX Distribution',
    message: 'Which LaTeX version would you like to install?',
    detail,
    buttons,
    defaultId: 0,
    cancelId: 3
  });

  if (result.response === 3) {
    // Cancel
    return null;
  }

  return distributions[result.response];
}

/**
 * Attempt automatic installation
 */
async function attemptAutoInstall(mainWindow) {
  const info = getLatexInstallationInfo();
  
  if (!info.canAutoInstall) {
    return { installed: false, engine: null };
  }

  // Let user pick distribution
  const selected = await showDistributionPicker(mainWindow);
  if (!selected) {
    return { installed: false, engine: null };
  }

  // Skip warning dialog and install directly
  runInstallationInBackground(selected.command, mainWindow, selected.name);
  return { 
    installed: false, 
    engine: null, 
    installing: true,
    distribution: selected.name,
    message: `Installing ${selected.name}... Please wait.`
  };
}

/**
 * Run installation in background using the app's built-in terminal
 */
function runInstallationInBackground(command, mainWindow, distribution) {
  const { ipcMain } = require('electron');
  
  console.log(`[LaTeX] ========== INSTALLATION START ==========`);
  console.log(`[LaTeX] Distribution: ${distribution}`);
  console.log(`[LaTeX] Command: ${command}`);
  console.log(`[LaTeX] Running installation in app terminal...`);
  console.log(`[LaTeX] ==========================================`);
  
  try {
    // Send progress update to renderer
    try {
      mainWindow.webContents.send('latex:installation-progress', {
        progress: 10,
  message: `Installing ${distribution}... Running the installation command automatically in the built-in terminal.`,
        elapsed: 0
      });
    } catch (e) {
      // Window might have closed
    }
    
    // Tell renderer to show terminal and send installation command
    try {
      mainWindow.webContents.send('latex:show-terminal-for-install', {
        command: command,
        distribution: distribution,
        message: `Installing ${distribution}...\n\nExecuting: ${command}\n\nThis will take a few minutes. Press Enter to start.`
      });
    } catch (e) {
      console.error(`[LaTeX] Error sending terminal command: ${e.message}`);
    }
    
    // Monitor for completion by checking if LaTeX is installed
    monitorInstallationCompletion(mainWindow, distribution);
    
  } catch (err) {
    console.error(`[LaTeX] Error starting installation: ${err.message}`);
    try {
      mainWindow.webContents.send('latex:installation-error', {
        error: `Failed to start installation: ${err.message}`,
        distribution
      });
    } catch (e) {
      // Window might have closed
    }
  }
}

/**
 * Monitor for installation completion
 */
function monitorInstallationCompletion(mainWindow, distribution) {
  let checkCount = 0;
  
  // Set max checks based on distribution
  let maxChecks;
  let estimatedTotal;
  
  if (distribution === 'TinyTeX') {
    maxChecks = 120; // Check for up to 20 minutes (120 * 10 seconds) - should complete in ~60s
    estimatedTotal = 60;
  } else if (distribution === 'BasicTeX') {
    maxChecks = 180; // Check for up to 30 minutes - should complete in ~180-300s
    estimatedTotal = 300;
  } else {
    maxChecks = 360; // Check for up to 60 minutes for MacTeX-No-GUI - should complete in ~1320s
    estimatedTotal = 1800;
  }
  
  console.log(`[LaTeX] Starting completion monitor: ${distribution}, timeout=${maxChecks * 10}s, estimated=${estimatedTotal}s`);
  
  const checkInterval = setInterval(() => {
    checkCount++;
    
    // Check if LaTeX is now installed and functional (try to compile a small document)
    let isInstalled = false;
    let checkedCmd = '';
    
    try {
      // Create a temporary small LaTeX document
      const tempDir = require('os').tmpdir();
      const testFile = require('path').join(tempDir, `latex-test-${Date.now()}.tex`);
      const testContent = '\\documentclass{article}\n\\begin{document}\nHello\n\\end{document}\n';
      require('fs').writeFileSync(testFile, testContent);
      
      // Try to compile it
      checkedCmd = 'pdflatex --version && pdflatex -interaction=nonstopmode -halt-on-error "' + testFile + '"';
      require('child_process').execSync(checkedCmd, { 
        stdio: 'pipe',
        timeout: 10000
      });
      
      // Check if PDF was created
      const pdfFile = testFile.replace('.tex', '.pdf');
      if (require('fs').existsSync(pdfFile)) {
        isInstalled = true;
        // Clean up
        try {
          require('fs').unlinkSync(testFile);
          require('fs').unlinkSync(pdfFile);
          const logFile = testFile.replace('.tex', '.log');
          if (require('fs').existsSync(logFile)) require('fs').unlinkSync(logFile);
        } catch (e) {}
      }
    } catch (e) {
      // Still not installed or not functional
    }
    
    if (isInstalled) {
      // LaTeX is now installed and functional!
      clearInterval(checkInterval);
      console.log(`[LaTeX] ✓ Installation completed! Verified with compilation test`);

      try {
        mainWindow.webContents.send('latex:installation-progress', {
          progress: 96,
          message: `Finalizing ${distribution} setup: updating tlmgr and packages...`,
          elapsed: checkCount * 10
        });
      } catch (e) {}

      // Run tlmgr maintenance (set repo, update self & all) and then report completion
      (async () => {
        try {
          await runTlmgrMaintenance(mainWindow);
          try {
            mainWindow.webContents.send('latex:installation-complete', {
              success: true,
              code: 0,
              distribution,
              elapsed: checkCount * 10,
              message: `✓ ${distribution} installed successfully. LaTeX compilation verified and tlmgr packages updated. Restart the app to use LaTeX export.`
            });
          } catch (e) {}
        } catch (err) {
          console.error('[LaTeX] tlmgr maintenance failed:', err && err.message ? err.message : err);
          try {
            mainWindow.webContents.send('latex:installation-complete', {
              success: true,
              code: 0,
              distribution,
              elapsed: checkCount * 10,
              message: `✓ ${distribution} installed successfully. LaTeX compilation verified. However, automatic tlmgr update failed: ${err && err.message ? err.message : err}. You can run 'tlmgr update --self --all' manually.`
            });
          } catch (e) {}
        }
      })();

    } else {
      // LaTeX not installed yet, keep checking
      
      // Send progress updates
      const elapsed = checkCount * 10;
      const progress = Math.min(99, Math.round((elapsed / estimatedTotal) * 95) + 1); // 1-99% progress
      
      console.log(`[LaTeX] Check ${checkCount}/${maxChecks}: not functional yet (${progress}% / ${Math.round(elapsed / 60)}m)`);
      
      try {
        mainWindow.webContents.send('latex:installation-progress', {
          progress,
          message: `${distribution} installing... ${progress}% (${Math.round(elapsed / 60)}m elapsed)`,
          elapsed
        });
      } catch (err) {
        // Window might have closed
      }
      
      // Stop checking after max time
      if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        console.log(`[LaTeX] Installation check timed out after ${Math.round(maxChecks * 10 / 60)}m`);
        
        try {
          mainWindow.webContents.send('latex:installation-complete', {
            success: true,
            code: 0,
            distribution,
            elapsed: checkCount * 10,
            message: `Installation monitoring stopped after ${Math.round(maxChecks * 10 / 60)}m. LaTeX may still be installing in the background. Please restart the app to verify LaTeX installation.`
          });
        } catch (err) {
          // Window might have closed
        }
      }
    }
  }, 10000); // Check every 10 seconds
}

module.exports = {
  getLatexInstallationInfo,
  showInstallationDialog,
  attemptAutoInstall
};

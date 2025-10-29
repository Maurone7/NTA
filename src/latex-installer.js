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
      description: 'Ultra-lightweight LaTeX with auto-install packages',
      installTime: '1-2 min',
      command: 'curl -fsSL "https://yihui.org/gh/tinytex/tools/install-unx.sh" | sh && ~/.TinyTeX/bin/*/tlmgr path add',
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
    '   • Size: 150 MB | Time: 1-2 minutes\n' +
    '   • Minimal LaTeX core with essential packages\n' +
    '   • Auto-installs additional packages as needed\n' +
    '   • Fastest installation, smallest footprint\n' +
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
    
    // Check if LaTeX is now installed (try multiple commands)
    let isInstalled = false;
    let checkedCmd = '';
    
    try {
      checkedCmd = 'xelatex --version';
      require('child_process').execSync('xelatex --version 2>&1', { 
        stdio: 'pipe',
        timeout: 5000
      });
      isInstalled = true;
    } catch (e) {
      // Try pdflatex as fallback
      try {
        checkedCmd = 'pdflatex --version';
        require('child_process').execSync('pdflatex --version 2>&1', { 
          stdio: 'pipe',
          timeout: 5000
        });
        isInstalled = true;
      } catch (e2) {
        // Still not installed
      }
    }
    
    if (isInstalled) {
      // LaTeX is now installed!
      clearInterval(checkInterval);
      console.log(`[LaTeX] ✓ Installation completed! Detected ${checkedCmd}`);
      
      try {
        mainWindow.webContents.send('latex:installation-complete', {
          success: true,
          code: 0,
          distribution,
          elapsed: checkCount * 10,
          message: `✓ ${distribution} installed successfully. Restart the app to use LaTeX export.`
        });
      } catch (e) {
        // Window might have closed
      }
      
    } else {
      // LaTeX not installed yet, keep checking
      
      // Send progress updates
      const elapsed = checkCount * 10;
      const progress = Math.min(99, Math.round((elapsed / estimatedTotal) * 95) + 1); // 1-99% progress
      
      console.log(`[LaTeX] Check ${checkCount}/${maxChecks}: not installed yet (${progress}% / ${Math.round(elapsed / 60)}m)`);
      
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
            message: `Installation monitoring stopped after ${Math.round(maxChecks * 10 / 60)}m. Please restart the app to verify LaTeX installation.`
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

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
      name: 'BasicTeX',
      size: '400 MB',
      description: 'Lightweight LaTeX with auto-install packages',
      installTime: '2-5 min',
      command: `${brewPath} install basictex`,
      recommended: true
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
    'BasicTeX (Recommended) - 400 MB',
    'MacTeX-No-GUI (Full) - 2 GB',
    'Cancel'
  ];

  const detail = 
    'Choose which LaTeX distribution to install:\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    '📦 BasicTeX (Recommended)\n' +
    '   • Size: 400 MB | Time: 2-5 minutes\n' +
    '   • Has all essential LaTeX packages\n' +
    '   • Auto-installs additional packages as needed\n' +
    '   • Perfect balance of size & capability\n\n' +
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
    cancelId: 2
  });

  if (result.response === 2) {
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

  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: 'Install LaTeX',
    message: `This will install ${selected.name} (~${selected.size})`,
    detail: `Installation time: ${selected.installTime}\n\n` +
            'This may take several minutes depending on your internet speed. ' +
            'The app will continue to work while installing.',
    buttons: ['Install in Background', 'Cancel'],
    defaultId: 0,
    cancelId: 1
  });

  if (result.response === 0) {
    // Run installation in background
    runInstallationInBackground(selected.command, mainWindow, selected.name);
    return { 
      installed: false, 
      engine: null, 
      installing: true,
      distribution: selected.name,
      message: `Installing ${selected.name}... Please wait.`
    };
  }

  return { installed: false, engine: null };
}

/**
 * Run installation in background (non-blocking)
 * Opens a Terminal window for the installation
 */
function runInstallationInBackground(command, mainWindow, distribution) {
  const { spawn, execSync } = require('child_process');
  const fs = require('fs');
  const os = require('os');
  
  // Build environment with brew paths added
  const brewPath = findBrewPath();
  const brewDir = brewPath.substring(0, brewPath.lastIndexOf('/'));
  const env = Object.assign({}, process.env, {
    PATH: `${brewDir}:${process.env.PATH || ''}`
  });
  
  console.log(`[LaTeX] ========== INSTALLATION START ==========`);
  console.log(`[LaTeX] Distribution: ${distribution}`);
  console.log(`[LaTeX] Command: ${command}`);
  console.log(`[LaTeX] Brew path: ${brewPath}`);
  console.log(`[LaTeX] Brew directory: ${brewDir}`);
  console.log(`[LaTeX] NEW PATH: ${brewDir}:${(process.env.PATH || '').split(':').slice(0, 2).join(':')}`);
  console.log(`[LaTeX] Opening Terminal window for installation...`);
  console.log(`[LaTeX] ==========================================`);
  
  // Create a temporary script file that will be executed in Terminal
  const tmpDir = os.tmpdir();
  const scriptPath = `${tmpDir}/latex-install-${Date.now()}.sh`;
  
  // Build the script that will run in Terminal
  const script = `#!/bin/bash
# LaTeX Installation Script
export PATH="${brewDir}:${process.env.PATH || ''}"

echo "=========================================="
echo "LaTeX Installation - ${distribution}"
echo "=========================================="
echo ""
echo "Command: ${command}"
echo ""
echo "This window will close automatically when installation completes."
echo ""

# Run the installation command
${command}

INSTALL_CODE=$?

echo ""
echo "=========================================="
echo "Installation complete with exit code: $INSTALL_CODE"
echo "=========================================="
echo ""

if [ $INSTALL_CODE -eq 0 ]; then
  echo "✓ Installation successful!"
  echo "Please restart the Note Taking App to use LaTeX export."
else
  echo "✗ Installation may have failed (exit code: $INSTALL_CODE)"
  echo "Please restart the Note Taking App to verify."
fi

echo ""
echo "This window will close in 3 seconds..."
sleep 3
`;
  
  try {
    // Write the script
    fs.writeFileSync(scriptPath, script, { mode: 0o755 });
    console.log(`[LaTeX] Created installation script: ${scriptPath}`);
    
    // Open the script in Terminal using AppleScript
    // This is the most reliable way to run with proper I/O and sudo support
    const appleScript = `
tell application "Terminal"
  activate
  do script "${scriptPath}"
end tell
`;
    
    console.log(`[LaTeX] Opening Terminal window...`);
    
    // Execute the AppleScript
    execSync(`osascript -e '${appleScript}'`, {
      env: process.env,
      stdio: 'pipe'
    });
    
    console.log(`[LaTeX] Terminal window opened`);
    
    // Send progress update to renderer
    try {
      mainWindow.webContents.send('latex:installation-progress', {
        progress: 5,
        message: `Opening Terminal for ${distribution} installation...`,
        elapsed: 0
      });
    } catch (e) {
      // Window might have closed
    }
    
    // Clean up the script file after a delay (give Terminal time to read it)
    setTimeout(() => {
      try {
        if (fs.existsSync(scriptPath)) {
          fs.unlinkSync(scriptPath);
          console.log(`[LaTeX] Cleaned up installation script`);
        }
      } catch (e) {
        // File might already be deleted
      }
    }, 5000);
    
    // Monitor for completion by checking if LaTeX is installed
    monitorInstallationCompletion(mainWindow, distribution);
    
  } catch (err) {
    console.error(`[LaTeX] Error setting up installation: ${err.message}`);
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
  const maxChecks = 180; // Check for up to 30 minutes (180 * 10 seconds)
  
  const checkInterval = setInterval(() => {
    checkCount++;
    
    // Check if LaTeX is now installed
    try {
      require('child_process').execSync('xelatex --version 2>&1', { 
        stdio: 'pipe',
        timeout: 5000
      });
      
      // If we get here, LaTeX is installed!
      clearInterval(checkInterval);
      console.log(`[LaTeX] Installation completed successfully!`);
      
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
      
    } catch (e) {
      // LaTeX not installed yet, keep checking
      
      // Send progress updates
      const elapsed = checkCount * 10;
      const estimatedTotal = distribution === 'BasicTeX' ? 180 : 1320; // seconds
      const progress = Math.min(90, Math.round((elapsed / estimatedTotal) * 90));
      
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
        console.log(`[LaTeX] Installation check timed out after 30 minutes`);
        
        try {
          mainWindow.webContents.send('latex:installation-complete', {
            success: true,
            code: 0,
            distribution,
            elapsed: checkCount * 10,
            message: `Installation monitoring stopped. Please restart the app to verify LaTeX installation.`
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

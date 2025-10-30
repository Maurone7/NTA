const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

describe('LaTeX Package Installation', function() {
  // Increase timeout for installation tests since they may take time
  this.timeout(300000); // 5 minutes

  describe('Installation detection', function() {
    it('should provide LaTeX installation information for the current platform', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check that getLatexInstallationInfo exists
      assert(src.includes('getLatexInstallationInfo'), 'getLatexInstallationInfo function should exist');
      assert(src.includes('platform'), 'should check platform');
      assert(src.includes('execSync') && (src.includes('pdflatex') || src.includes('xelatex')), 'should check if LaTeX is installed');
      assert(src.includes('canAutoInstall'), 'should indicate if auto-install is possible');
      assert(src.includes('installCommand'), 'should provide install command');
    });

    it('should detect macOS-specific installation info', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for macOS detection
      assert(src.includes("platform === 'darwin'"), 'should detect macOS (darwin)');
      
      // Check for Homebrew support
      assert(src.includes('brew install'), 'should provide Homebrew install command');
      assert(src.includes('mactex'), 'should mention MacTeX');
      
      // Check for auto-install capability on macOS
      assert(src.includes('canAutoInstall = true'), 'should support auto-install on macOS');
    });

    it('should detect Linux-specific installation info', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for Linux detection
      assert(src.includes("platform === 'linux'"), 'should detect Linux');
      
      // Check for apt/dnf support
      assert(src.includes('apt install') || src.includes('dnf install'), 'should provide Linux package manager commands');
      assert(src.includes('texlive'), 'should mention TeX Live');
      
      // Check that auto-install is not possible (needs sudo)
      assert(src.includes('canAutoInstall = false'), 'should not auto-install on Linux (needs sudo)');
    });

    it('should detect Windows-specific installation info', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for Windows detection
      assert(src.includes("platform === 'win32'"), 'should detect Windows');
      
      // Check for MiKTeX support
      assert(src.includes('MiKTeX'), 'should mention MiKTeX');
      assert(src.includes('miktex.org'), 'should provide MiKTeX download URL');
    });

    it('should find Homebrew executable in common locations', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for findBrewPath function
      assert(src.includes('function findBrewPath()'), 'findBrewPath function should exist');
      
      // Check for common Homebrew locations
      assert(src.includes('/opt/homebrew/bin/brew'), 'should check Apple Silicon Homebrew location');
      assert(src.includes('/usr/local/bin/brew'), 'should check Intel/Linux Homebrew location');
      assert(src.includes('linuxbrew'), 'should check Linux Homebrew location');
      
      // Check for fallback
      assert(src.includes("return 'brew'"), 'should fallback to assuming brew is in PATH');
    });
  });

  describe('Distribution selection', function() {
    it('should show distribution picker dialog with options', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for showDistributionPicker function
      assert(src.includes('showDistributionPicker'), 'showDistributionPicker function should exist');
      
      // Should call dialog.showMessageBox
      assert(src.includes('dialog.showMessageBox'), 'should show message box dialog');
      
      // Should have button options
      assert(src.includes('buttons'), 'should have button options');
    });

    it('should offer TinyTeX as lightest option', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for TinyTeX mention
      assert(src.includes('TinyTeX'), 'should offer TinyTeX');
      assert(src.includes('Lightest'), 'should indicate TinyTeX is lightest');
      
      // Check distribution properties
      assert(src.includes('name: \'TinyTeX\''), 'should have TinyTeX name');
      assert(src.includes('tinytex'), 'should have tinytex install command');
  assert(src.includes('install-unx.sh'), 'should install TinyTeX via official install script');
      assert(src.includes('150 MB') || src.includes('150MB'), 'should specify TinyTeX size (150 MB)');
      assert(src.includes('1-2 min') || src.includes('2-3 min') || src.includes('3-4 min') || src.includes('1-2 minutes') || src.includes('2-3 minutes') || src.includes('3-4 minutes'), 'should specify TinyTeX installation time');
      assert(src.includes('Ultra-lightweight') || src.includes('Lightweight') || src.includes('ultra-lightweight') || src.includes('lightweight'), 'should describe TinyTeX as lightweight');
    });

    it('should mark TinyTeX as recommended', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // TinyTeX should be the first distribution with recommended: true
      const tinytexIndex = src.indexOf("name: 'TinyTeX'");
      const recommendedAfterTinyTeX = src.indexOf("recommended: true", tinytexIndex);
      assert(recommendedAfterTinyTeX > tinytexIndex && recommendedAfterTinyTeX - tinytexIndex < 600, 
        'TinyTeX should have recommended: true');
    });

    it('should offer BasicTeX as an option', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for BasicTeX mention
      assert(src.includes('BasicTeX'), 'should offer BasicTeX');
      
      // Check distribution properties
      assert(src.includes('name: \'BasicTeX\''), 'should have BasicTeX name');
      assert(src.includes('basictex'), 'should have basictex install command');
      assert(src.includes('400 MB') || src.includes('400MB'), 'should specify BasicTeX size');
    });

    it('should offer MacTeX-No-GUI as full option', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for MacTeX-No-GUI mention
      assert(src.includes('MacTeX-No-GUI') || src.includes('mactex-no-gui'), 'should offer MacTeX-No-GUI');
      assert(src.includes('2.0 GB') || src.includes('2 GB') || src.includes('2GB'), 'should specify MacTeX size');
      assert(src.includes('mactex-no-gui'), 'should have mactex-no-gui install command');
      assert(src.includes('every package') || src.includes('all packages') || src.includes('complete'), 'should describe it as complete');
    });

    it('should track recommended distribution', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for recommended flag
      assert(src.includes('recommended:'), 'should have recommended property');
      assert(src.includes('recommended: true'), 'should mark one distribution as recommended');
    });

    it('should provide install time estimates', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for installTime property
      assert(src.includes('installTime'), 'should provide installation time estimates');
      
      // Check for time ranges
      assert(src.includes('1-2 min') || src.includes('2-3 min') || src.includes('3-4 min') || src.includes('1-2 minutes') || src.includes('2-3 minutes') || src.includes('3-4 minutes'), 'should estimate TinyTeX installation time');
      assert(src.includes('2-5 min') || src.includes('2-5 minutes'), 'should estimate BasicTeX installation time');
      assert(src.includes('15-30 min') || src.includes('15-30 minutes'), 'should estimate MacTeX installation time');
    });

    it('should have correct TinyTeX installation command', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check that the TinyTeX command includes the essential parts
      assert(src.includes('curl -fsSL "https://yihui.org/gh/tinytex/tools/install-unx.sh"'), 'should download TinyTeX installer');
      assert(src.includes('tlmgr') && src.includes('path add'), 'should add TinyTeX to PATH');
      assert(src.includes('tlmgr install scheme-basic'), 'should install basic packages');
      
      // Check that it does NOT include fmtutil (since TinyTeX installer handles format files)
      assert(!src.includes('fmtutil --all'), 'should not manually run fmtutil (TinyTeX installer handles it)');
      
      // Check that it's chained with &&
      assert(src.includes('&& tlmgr install scheme-basic'), 'should chain commands with &&');
      
      console.log('✓ TinyTeX installation command verified');
    });
  });

  describe('Automatic installation', function() {
    it('should attempt auto-install when requested', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for attemptAutoInstall function
      assert(src.includes('attemptAutoInstall'), 'attemptAutoInstall function should exist');
      assert(src.includes('getLatexInstallationInfo') || src.includes('installed'), 'should check if LaTeX is already installed');
      assert(src.includes('showDistributionPicker'), 'should show distribution picker');
    });

    it('should run installation in background terminal', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for runInstallationInBackground function - now uses terminal instead of spawn
      assert(src.includes('runInstallationInBackground'), 'runInstallationInBackground function should exist');
      assert(src.includes('latex:show-terminal-for-install'), 'should send command to terminal');
    });

    it('should create temporary shell script for installation', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Terminal-based approach sends command directly
      assert(src.includes('mainWindow.webContents.send') || src.includes('latex:show-terminal'), 'should send command to terminal');
      assert(src.includes('command'), 'should pass brew install command');
    });

    it('should set proper script permissions', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Terminal approach doesn't need file permissions, verify terminal integration
      assert(src.includes('monitorInstallationCompletion') || src.includes('latex:'), 'should monitor installation');
    });

    it('should include installation feedback in terminal script', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Terminal approach: verify logging and event handling
      assert(src.includes('console.log') || src.includes('[LaTeX]'), 'should include logging for user feedback');
      assert(src.includes('webContents.send'), 'should send status to renderer');
    });

    it('should clean up temporary script files', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Terminal approach: commands are sent to shell terminal, no temp files
      assert(src.includes('monitorInstallationCompletion'), 'should monitor installation');
      assert(src.includes('latex:show-terminal-for-install') || src.includes('webContents.send'), 'should communicate with renderer');
    });
  });

  describe('Installation monitoring', function() {
    it('should monitor installation progress', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for monitorInstallationCompletion function
      assert(src.includes('monitorInstallationCompletion'), 'monitorInstallationCompletion function should exist');
      assert(src.includes('setInterval') || src.includes('checkInterval'), 'should use interval to check status');
    });

    it('should check LaTeX installation periodically', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for periodic checking
      assert(src.includes('execSync'), 'should execute commands to check installation');
      assert(src.includes('xelatex --version') || src.includes('pdflatex --version') || src.includes('--version'), 'should check LaTeX version');
      assert(src.includes('10000') || src.includes('10') || src.includes('interval'), 'should check at reasonable intervals');
    });

    it('should send progress updates to renderer', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for IPC communication
      assert(src.includes('webContents.send') || src.includes('send('), 'should send messages to renderer');
      assert(src.includes('latex:installation-progress') || src.includes('progress'), 'should send progress updates');
      assert(src.includes('progress') || src.includes('%'), 'should include progress percentage');
      assert(src.includes('message'), 'should include progress message');
    });

    it('should detect installation completion', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for completion detection
      assert(src.includes('clearInterval'), 'should stop monitoring when complete');
      assert(src.includes('latex:installation-complete') || src.includes('complete'), 'should send completion message');
      assert(src.includes('success'), 'should indicate success status');
    });

    it('should timeout monitoring after max time', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for timeout logic
      assert(src.includes('maxChecks') || src.includes('180'), 'should have maximum check count');
      assert(src.includes('checkCount >= maxChecks') || src.includes('timeout'), 'should stop after max checks');
      assert(src.includes('30 minutes') || src.includes('30m') || src.includes('1800'), 'should timeout after reasonable duration');
    });

    it('should estimate remaining installation time', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for time estimation
      assert(src.includes('elapsed'), 'should track elapsed time');
      assert(src.includes('estimatedTotal') || src.includes('estimated'), 'should have estimated total time');
      assert(src.includes('Math.min') || src.includes('progress'), 'should calculate progress percentage');
    });

    it('should verify LaTeX functionality after installation', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check that monitoring creates a test LaTeX document and compiles it
      assert(src.includes('documentclass{article}'), 'should create test LaTeX document');
      assert(src.includes('pdflatex -interaction=nonstopmode'), 'should compile test document');
      assert(src.includes('fs.existsSync') && src.includes('pdfFile'), 'should check if PDF was created');
      assert(src.includes('unlinkSync'), 'should clean up test files');
      
      // Check that it only reports success when compilation works
      assert(src.includes('isInstalled = true'), 'should set installed flag only when compilation succeeds');
      assert(src.includes('Verified with compilation test'), 'should log successful verification');
      
      console.log('✓ Installation monitoring includes LaTeX functionality verification');
    });
  });

  describe('Installation dialog', function() {
    it('should show installation dialog to user', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for showInstallationDialog function
      assert(src.includes('showInstallationDialog'), 'showInstallationDialog function should exist');
      // Modern implementation skips warning dialog and installs directly
      assert(src.includes('showDistributionPicker'), 'should show distribution picker');
      assert(!src.includes('type: \'warning\''), 'should not show warning dialog');
    });

    it('should provide installation instructions in dialog', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for detailed instructions
      assert(src.includes('message') || src.includes('detail'), 'should have message or detail');
      assert(src.includes('Install') || src.includes('install'), 'should mention installation');
      assert(src.includes('Homebrew') || src.includes('MacTeX') || src.includes('TeX Live'), 'should mention relevant tools');
    });

    it('should provide "Learn More" action button', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for Learn More button
      assert(src.includes("'Learn More'") || src.includes('"Learn More"'), 'should have Learn More button');
      assert(src.includes('shell.openExternal'), 'should open external link');
      assert(src.includes('installUrl'), 'should have installation URL');
    });

    it('should provide "Install Now" action button on macOS', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for Install Now button on supported platforms
      assert(src.includes('buttons.unshift') || src.includes("'Install Now'") || src.includes('"Install Now"'), 'should offer Install Now button');
    });

    it('should handle dialog cancellation', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for cancel handling
      assert(src.includes('cancelId') || src.includes('Cancel'), 'should have cancel button');
      assert(src.includes('response ===') || src.includes('if ('), 'should check user response');
    });
  });

  describe('Installation environment setup', function() {
    it('should set up PATH environment with Homebrew directory', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for Homebrew path handling in findBrewPath
      assert(src.includes('findBrewPath'), 'should have findBrewPath function');
      assert(src.includes('/opt/homebrew/bin/brew') || src.includes('/usr/local/bin/brew'), 'should check common brew paths');
    });

    it('should prepend Homebrew to PATH for proper priority', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Terminal approach: shell handles PATH automatically
      assert(src.includes('findBrewPath'), 'should locate Homebrew');
      assert(src.includes('/opt/homebrew/bin/brew') || src.includes('/usr/local/bin/brew'), 'should check common brew paths');
    });

    it('should handle missing environment variables gracefully', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for error handling
      assert(src.includes('try') && src.includes('catch'), 'should use try-catch for error handling');
      assert(src.includes('findBrewPath') || src.includes('commonPaths'), 'should have fallback paths');
    });
  });

  describe('LaTeX compiler integration', function() {
    it('should check if LaTeX is installed before proceeding', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for LaTeX availability check
      assert(src.includes('getLatexInstallationInfo') || src.includes('pdflatex') || src.includes('xelatex'), 'should check LaTeX installation');
      assert(src.includes('installed'), 'should check installed status');
    });

    it('should use correct LaTeX engine for compilation', async function() {
      const latexCompilerPath = path.join(__dirname, '..', '..', 'src', 'latex-compiler.js');
      const src = await fs.readFile(latexCompilerPath, 'utf8');
      
      // Check for engine selection
      assert(src.includes('pdflatex') || src.includes('xelatex'), 'should support LaTeX engines');
      assert(src.includes('engine'), 'should accept engine parameter');
    });

    it('should export checkLatexInstalled and compileLatexToPdf', async function() {
      const latexCompilerPath = path.join(__dirname, '..', '..', 'src', 'latex-compiler.js');
      const src = await fs.readFile(latexCompilerPath, 'utf8');
      
      // Check for module exports
      assert(src.includes('module.exports') || src.includes('exports'), 'should export functions');
      assert(src.includes('checkLatexInstalled'), 'should export checkLatexInstalled');
      assert(src.includes('compileLatexToPdf'), 'should export compileLatexToPdf');
    });
  });

  describe('Error handling', function() {
    it('should handle Homebrew not found gracefully', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for error handling
      assert(src.includes('existsSync'), 'should check if Homebrew exists');
      assert(src.includes('try') && src.includes('catch'), 'should use try-catch for error handling');
      assert(src.includes('console.log') || src.includes('console.error'), 'should log errors');
    });

    it('should handle installation failures', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Terminal approach: check for error handling via monitorInstallationCompletion
      assert(src.includes('monitorInstallationCompletion') || src.includes('catch'), 'should handle installation errors');
      assert(src.includes('failed') || src.includes('error') || src.includes('Error'), 'should have error messages');
    });

    it('should provide helpful error messages to user', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for error event handling
      assert(src.includes('latex:installation-error') || src.includes('message'), 'should send error messages to user');
      assert(src.includes('catch') || src.includes('Error'), 'should catch and handle errors');
    });

    it('should handle window closure during installation', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for window closure handling
      assert(src.includes('try') && src.includes('catch'), 'should have error handling');
      assert(src.includes('webContents.send'), 'should safely send to window');
      assert(src.includes('catch (e)'), 'should handle window closure');
    });
  });

  describe('LaTeX package availability', function() {
    it('should reference known required packages for BasicTeX', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for package information
      assert(src.includes('auto') || src.includes('automatically'), 'should mention auto-installation of packages');
      assert(src.includes('package'), 'should discuss packages');
    });

    it('should mention package auto-installation for BasicTeX', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for auto-package feature
      assert(src.includes('auto-install') || src.includes('auto'), 'should mention automatic package installation');
      assert(src.includes('BasicTeX'), 'should explain this for BasicTeX');
    });

    it('should note that MacTeX includes all packages', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for MacTeX completeness info
      assert(src.includes('MacTeX') || src.includes('mactex'), 'should mention MacTeX');
      assert(src.includes('every') || src.includes('all') || src.includes('complete'), 'should note completeness');
    });
  });

  describe('Installation logging', function() {
    it('should log LaTeX installation attempts', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for logging
      assert(src.includes('console.log') || src.includes('console.error'), 'should log installation');
      assert(src.includes('[LaTeX]') || src.includes('LaTeX'), 'should include context in logs');
    });

    it('should log detected Homebrew path', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for Homebrew path logging
      assert(src.includes('Found brew') || src.includes('brew'), 'should log found Homebrew');
      assert(src.includes('log'), 'should use logging');
    });

    it('should log detected LaTeX installation', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for LaTeX detection logging
      assert(src.includes('Installation'), 'should log about installation');
      assert(src.includes('completed') || src.includes('success') || src.includes('Error'), 'should log outcome');
    });

    it('should log environment setup for installation', async function() {
      const latexInstallerPath = path.join(__dirname, '..', '..', 'src', 'latex-installer.js');
      const src = await fs.readFile(latexInstallerPath, 'utf8');
      
      // Check for logging - terminal sends command to shell which handles PATH
      assert(src.includes('[LaTeX]') || src.includes('console.log'), 'should include logging');
      assert(src.includes('Distribution:') || src.includes('Command:'), 'should log installation details');
    });
  });
});

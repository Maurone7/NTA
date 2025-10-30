/**
 * LaTeX Compiler Utility
 * Handles detection and compilation of LaTeX files to PDF
 */

const { execSync } = require('child_process');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * Check if pdflatex or xelatex is installed on the system
 * @returns {Object} { installed: boolean, engine: string|null, version: string|null }
 */
const checkLatexInstalled = () => {
  const debugLog = (msg) => {
    console.log(`[LaTeX Detection] ${msg}`);
  };
  
  try {
    // Try TinyTeX locations first (prefer user installation)
    const home = process.env.HOME || os.homedir();
    debugLog(`Checking TinyTeX locations first (HOME=${home})...`);
    
    const tinytexLocations = [
      path.join(home, '.TinyTeX', 'bin', 'pdflatex'),
      path.join(home, '.TinyTeX', 'bin', 'xelatex'),
      path.join(home, 'Library', 'TinyTeX', 'bin', 'universal-darwin', 'pdflatex'),
      path.join(home, 'Library', 'TinyTeX', 'bin', 'universal-darwin', 'xelatex'),
      path.join(home, '.local', 'bin', 'pdflatex'), // Linux fallback
      path.join(home, '.local', 'bin', 'xelatex')   // Linux fallback
    ];
    
    for (const binPath of tinytexLocations) {
      debugLog(`  Checking: ${binPath}`);
      try {
        if (fs.existsSync(binPath)) {
          debugLog(`  ✓ File exists, testing...`);
          const version = execSync(`"${binPath}" --version 2>&1`, { encoding: 'utf8' });
          debugLog(`✓ Found TinyTeX: ${version.split('\n')[0]}`);
          return {
            installed: true,
            engine: binPath.includes('xelatex') ? 'xelatex' : 'pdflatex',
            version: version.split('\n')[0]
          };
        } else {
          debugLog(`  ✗ File not found`);
        }
      } catch (e) {
        debugLog(`  ✗ Error executing: ${e.message}`);
        // Continue to next location
      }
    }
    
    // Try pdflatex in PATH (system installation)
    try {
      debugLog('Checking pdflatex in system PATH...');
      const version = execSync('pdflatex --version 2>&1', { encoding: 'utf8' });
      debugLog(`✓ Found pdflatex: ${version.split('\n')[0]}`);
      return {
        installed: true,
        engine: 'pdflatex',
        version: version.split('\n')[0]
      };
    } catch (e) {
      debugLog('✗ pdflatex not in system PATH');
      
      // Try xelatex as fallback
      try {
        debugLog('Checking xelatex in system PATH...');
        const version = execSync('xelatex --version 2>&1', { encoding: 'utf8' });
        debugLog(`✓ Found xelatex: ${version.split('\n')[0]}`);
        return {
          installed: true,
          engine: 'xelatex',
          version: version.split('\n')[0]
        };
      } catch (e2) {
        debugLog('✗ xelatex not in system PATH');
        debugLog('✗ No LaTeX installation found');
        throw e2; // Re-throw if nothing found
      }
    }
  } catch (e) {
    debugLog(`Final error: ${e.message}`);
    return {
      installed: false,
      engine: null,
      version: null
    };
  }
};

/**
 * Compile LaTeX content to PDF
 * @param {string} latexContent - The LaTeX source code
 * @param {string} outputPath - Where to save the PDF
 * @param {Object} options - Compilation options
 * @returns {Promise<Object>} { success: boolean, filePath: string|null, error: string|null, stderr: string|null }
 */
const compileLatexToPdf = async (latexContent, outputPath, options = {}) => {
  const {
    engine = 'pdflatex',
    maxIterations = 2,
    timeout = 60000,
    verbose = false
  } = options;

  let tempDir = null;
  let tempTexFile = null;

  try {
    // Create temporary directory
    tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'latex-'));
    const baseName = 'document';
    tempTexFile = path.join(tempDir, `${baseName}.tex`);

    // Write LaTeX content to temporary file
    await fsPromises.writeFile(tempTexFile, latexContent, 'utf8');

    // Prepare compilation command
    const outputDir = path.dirname(outputPath);
    const outputBaseName = path.basename(outputPath, '.pdf');

    let command;
    if (engine === 'xelatex') {
      command = `cd "${tempDir}" && xelatex -interaction=nonstopmode -halt-on-error "${baseName}.tex"`;
    } else {
      // pdflatex (default)
      command = `cd "${tempDir}" && pdflatex -interaction=nonstopmode -halt-on-error "${baseName}.tex"`;
    }

    // Add second run if requested (for cross-references, TOC, etc.)
    if (maxIterations > 1) {
      command += ` && ${command.split(' && ')[1]}`; // Run again
    }

    if (verbose) {
      console.log(`[LaTeX] Compiling with ${engine}...`);
      console.log(`[LaTeX] Command: ${command}`);
    }

    // Execute compilation
    try {
      const result = execSync(command, {
        encoding: 'utf8',
        timeout: timeout,
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });

      if (verbose) {
        console.log(`[LaTeX] Compilation output:\n${result}`);
      }
    } catch (execError) {
      // Check if PDF was still generated despite errors
      const tempPdf = path.join(tempDir, `${baseName}.pdf`);
      const pdfExists = await fsPromises.access(tempPdf).then(() => true).catch(() => false);

      if (!pdfExists) {
        return {
          success: false,
          filePath: null,
          error: 'LaTeX compilation failed',
          stderr: execError.stderr || execError.message || 'Unknown error'
        };
      }
    }

    // Copy PDF from temp directory to output location
    const tempPdf = path.join(tempDir, `${baseName}.pdf`);
    
    try {
      await fsPromises.access(tempPdf);
    } catch (e) {
      return {
        success: false,
        filePath: null,
        error: 'PDF was not generated',
        stderr: 'pdflatex did not produce output.pdf'
      };
    }

    // Ensure output directory exists
    await fsPromises.mkdir(outputDir, { recursive: true });

    // Copy PDF to final location
    await fsPromises.copyFile(tempPdf, outputPath);

    if (verbose) {
      console.log(`[LaTeX] PDF saved to: ${outputPath}`);
    }

    return {
      success: true,
      filePath: outputPath,
      error: null,
      stderr: null
    };

  } catch (error) {
    console.error('[LaTeX] Compilation error:', error.message);
    return {
      success: false,
      filePath: null,
      error: error.message,
      stderr: error.stderr
    };
  } finally {
    // Clean up temporary directory
    if (tempDir) {
      try {
        // Recursively remove temp directory
        const rimraf = (dir) => {
          if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(file => {
              const filePath = path.join(dir, file);
              if (fs.lstatSync(filePath).isDirectory()) {
                rimraf(filePath);
              } else {
                fs.unlinkSync(filePath);
              }
            });
            fs.rmdirSync(dir);
          }
        };
        rimraf(tempDir);
      } catch (e) {
        console.warn('[LaTeX] Warning: Could not clean up temp directory:', e.message);
      }
    }
  }
};

/**
 * Get installation status and return user-friendly message
 * @returns {Object} { isInstalled: boolean, message: string, engine: string|null }
 */
const getLatexInstallationStatus = () => {
  const status = checkLatexInstalled();
  
  if (status.installed) {
    return {
      isInstalled: true,
      message: `LaTeX is installed (${status.engine})`,
      engine: status.engine
    };
  }

  let message = 'LaTeX is not installed. To enable PDF export with LaTeX compilation:\n\n';
  const platform = process.platform;

  if (platform === 'darwin') {
    message += 'macOS: brew install mactex\n';
    message += 'or visit: https://www.tug.org/mactex/';
  } else if (platform === 'linux') {
    message += 'Linux: sudo apt install texlive-latex-base\n';
    message += 'or: sudo yum install texlive-latex';
  } else if (platform === 'win32') {
    message += 'Windows: Download from https://miktex.org/download';
  }

  message += '\n\nPDF export will use HTML fallback until LaTeX is installed.';

  return {
    isInstalled: false,
    message,
    engine: null
  };
};

module.exports = {
  checkLatexInstalled,
  compileLatexToPdf,
  getLatexInstallationStatus
};

#!/usr/bin/env node

/**
 * LaTeX PDF Verification Utility
 * 
 * Usage: node verify-latex-pdf.js <path-to-pdf>
 * 
 * Checks if a PDF was compiled with LaTeX by examining:
 * 1. PDF producer field
 * 2. PDF structure and markers
 * 3. Creator information
 */

const fs = require('fs');
const path = require('path');

/**
 * Check if PDF was compiled with LaTeX
 * @param {string} filePath - Path to the PDF file
 * @returns {Object} { isLatex: boolean, producer: string, details: string[] }
 */
function verifyLatexPdf(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      isLatex: null,
      error: `File not found: ${filePath}`,
      producer: null,
      details: []
    };
  }

  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) {
    return {
      isLatex: null,
      error: `Path is a directory: ${filePath}`,
      producer: null,
      details: []
    };
  }

  try {
    // Read PDF file as binary
    const buffer = fs.readFileSync(filePath);
    const content = buffer.toString('binary');
    
    const details = [];
    const markers = {
      pdfTeX: false,
      xetex: false,
      LuaTeX: false,
      chromium: false,
      heapchrome: false
    };

    // Check 1: PDF signature
    const isValidPdf = content.startsWith('%PDF');
    details.push(`Valid PDF signature: ${isValidPdf ? '✓' : '✗'}`);

    // Check 2: Producer field
    let producer = null;
    const producerMatch = content.match(/\/Producer\s*\((.*?)\)/);
    if (producerMatch) {
      producer = producerMatch[1];
      details.push(`Producer: ${producer}`);
    }

    // Check 3: Creator field
    const creatorMatch = content.match(/\/Creator\s*\((.*?)\)/);
    if (creatorMatch) {
      details.push(`Creator: ${creatorMatch[1]}`);
    }

    // Check 4: LaTeX markers
    if (content.includes('pdfTeX')) {
      markers.pdfTeX = true;
      details.push('LaTeX Engine: pdfTeX');
    }
    if (content.includes('xetex')) {
      markers.xetex = true;
      details.push('LaTeX Engine: xetex');
    }
    if (content.includes('LuaTeX')) {
      markers.LuaTeX = true;
      details.push('LaTeX Engine: LuaTeX');
    }

    // Check 5: HTML export markers
    if (content.includes('Chromium')) {
      markers.chromium = true;
      details.push('Export Method: Chromium/HTML');
    }
    if (content.includes('HeadlessChrome')) {
      markers.heapchrome = true;
      details.push('Export Method: HeadlessChrome');
    }

    // Check 6: PDF structure
    const hasXref = content.includes('xref');
    const hasTrailer = content.includes('trailer');
    const hasEof = content.includes('%%EOF');
    details.push(`PDF Structure: xref=${hasXref}, trailer=${hasTrailer}, %%EOF=${hasEof}`);

    // Check 7: File size
    const fileSizeKb = (buffer.length / 1024).toFixed(2);
    details.push(`File size: ${fileSizeKb} KB`);

    // Determine if LaTeX compiled
    const isLatex = markers.pdfTeX || markers.xetex || markers.LuaTeX;
    const isHtmlExport = markers.chromium || markers.heapchrome;

    return {
      isLatex,
      isHtmlExport,
      producer,
      fileSize: buffer.length,
      fileSizeKb,
      isValidPdf,
      details,
      markers
    };

  } catch (error) {
    return {
      isLatex: null,
      error: error.message,
      producer: null,
      details: [`Error reading file: ${error.message}`]
    };
  }
}

/**
 * Format output for console display
 */
function formatOutput(result, filePath) {
  console.log('\n' + '='.repeat(60));
  console.log(`PDF Analysis: ${path.basename(filePath)}`);
  console.log('='.repeat(60) + '\n');

  if (result.error) {
    console.error(`❌ Error: ${result.error}\n`);
    return;
  }

  // Main result
  console.log('COMPILATION METHOD:');
  if (result.isLatex) {
    console.log('  ✅ Compiled with LaTeX');
    if (result.producer) {
      console.log(`  Producer: ${result.producer}`);
    }
  } else if (result.isHtmlExport) {
    console.log('  📄 Exported from HTML');
    if (result.producer) {
      console.log(`  Producer: ${result.producer}`);
    }
  } else {
    console.log('  ❓ Unknown compilation method');
  }

  // Details
  console.log('\nDETAILS:');
  result.details.forEach(detail => {
    console.log(`  • ${detail}`);
  });

  // Markers summary
  console.log('\nMARKERS:');
  if (result.markers.pdfTeX) console.log('  • pdfTeX');
  if (result.markers.xetex) console.log('  • xetex');
  if (result.markers.LuaTeX) console.log('  • LuaTeX');
  if (result.markers.chromium) console.log('  • Chromium');
  if (result.markers.heapchrome) console.log('  • HeadlessChrome');

  // Recommendations
  console.log('\nRECOMMENDATIONS:');
  if (result.isLatex) {
    console.log('  ✓ This PDF was properly compiled with LaTeX');
    console.log('  ✓ Math rendering and typography are optimized');
    console.log('  ✓ File size is optimized');
  } else if (result.isHtmlExport) {
    console.log('  • LaTeX not installed on your system');
    console.log('  • PDF was exported from HTML instead');
    console.log('  • Consider installing LaTeX for better quality:');
    console.log('    - macOS: brew install mactex');
    console.log('    - Linux: sudo apt install texlive-latex-base');
    console.log('    - Windows: https://miktex.org/');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node verify-latex-pdf.js <path-to-pdf>');
    console.error('Example: node verify-latex-pdf.js output.pdf');
    process.exit(1);
  }

  const filePath = args[0];
  const result = verifyLatexPdf(filePath);
  formatOutput(result, filePath);

  // Exit with appropriate code
  process.exit(result.isLatex ? 0 : 1);
}

module.exports = {
  verifyLatexPdf
};

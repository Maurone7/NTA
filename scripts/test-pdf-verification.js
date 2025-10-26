#!/usr/bin/env node

/**
 * Integration test for LaTeX PDF verification
 * 
 * This script demonstrates how to verify that a PDF was compiled with LaTeX
 * by checking the PDF internal structure and metadata.
 */

const fs = require('fs');
const path = require('path');
const { verifyLatexPdf } = require('./verify-latex-pdf');

console.log('\n' + '='.repeat(70));
console.log('LaTeX PDF Verification - Integration Test');
console.log('='.repeat(70) + '\n');

// Test 1: Test verification function with mock data
console.log('Test 1: Verify function works with mock LaTeX PDF data');
console.log('-'.repeat(70));

function createMockLatexPdf() {
  // Minimal but realistic LaTeX PDF structure
  return Buffer.from(`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 100 >>
stream
BT
/F1 12 Tf
100 700 Td
(Hello LaTeX!) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000209 00000 n
trailer
<< /Size 5 /Root 1 0 R /Producer (pdfTeX-1.40.21) /Creator (TeX) >>
startxref
410
%%EOF`, 'utf8');
}

function createMockHtmlPdf() {
  // Minimal HTML-generated PDF structure
  return Buffer.from(`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>
endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
trailer
<< /Size 4 /Root 1 0 R /Producer (Chromium) /Creator (HeadlessChrome) >>
startxref
209
%%EOF`, 'utf8');
}

// Create temp directory for test PDFs
const tempDir = path.join('/tmp', 'latex-pdf-test-' + Date.now());
fs.mkdirSync(tempDir, { recursive: true });

try {
  const latexPdfPath = path.join(tempDir, 'latex-generated.pdf');
  const htmlPdfPath = path.join(tempDir, 'html-generated.pdf');

  fs.writeFileSync(latexPdfPath, createMockLatexPdf());
  fs.writeFileSync(htmlPdfPath, createMockHtmlPdf());

  // Test LaTeX PDF
  console.log('Checking LaTeX-generated PDF...');
  const latexResult = verifyLatexPdf(latexPdfPath);
  if (latexResult.isLatex) {
    console.log('  ✓ Correctly identified as LaTeX PDF');
    console.log(`  Producer: ${latexResult.producer}`);
  } else {
    console.log('  ✗ Failed to identify LaTeX PDF');
    process.exit(1);
  }

  // Test HTML PDF
  console.log('\nChecking HTML-generated PDF...');
  const htmlResult = verifyLatexPdf(htmlPdfPath);
  if (!htmlResult.isLatex && htmlResult.isHtmlExport) {
    console.log('  ✓ Correctly identified as HTML-generated PDF');
    console.log(`  Producer: ${htmlResult.producer}`);
  } else {
    console.log('  ✗ Failed to identify HTML PDF');
    process.exit(1);
  }

} finally {
  // Cleanup
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {
    console.warn('Warning: Could not clean up temp directory:', e.message);
  }
}

console.log('\n' + '-'.repeat(70));
console.log('✓ All verification tests passed!');
console.log('-'.repeat(70));

// Test 2: Show how to use the CLI tool
console.log('\nTest 2: CLI tool usage');
console.log('-'.repeat(70));
console.log('Usage: node verify-latex-pdf.js <path-to-pdf>');
console.log('Example: node verify-latex-pdf.js output.pdf');
console.log('\nThe tool will analyze the PDF and report:');
console.log('  • Compilation method (LaTeX vs HTML)');
console.log('  • Producer information');
console.log('  • PDF structure validation');
console.log('  • File size metrics');

console.log('\n' + '='.repeat(70));
console.log('Integration test completed successfully!');
console.log('='.repeat(70) + '\n');

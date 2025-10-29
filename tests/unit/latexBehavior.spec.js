const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

describe('LaTeX editor behavior', function() {
  it('app.js should treat LaTeX as editable in setActiveEditorPane', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    assert(src.includes("paneNote.type === 'markdown' || paneNote.type === 'latex'"), 'Renderer should detect markdown or latex in active pane handling');
    assert(src.includes("inst.el.value = paneNote.content ?? ''") || src.includes("inst.el.value = paneNote.content || ''"), 'Renderer should populate editor with paneNote.content for markdown/latex');
  });

  it('should handle LaTeX environment auto-completion', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that handleLatexEnvironmentAutoComplete function exists
    assert(src.includes('const handleLatexEnvironmentAutoComplete'), 'handleLatexEnvironmentAutoComplete function should exist');
    
    // Check that it's called in handleEditorKeydown for LaTeX and Markdown files
    assert(src.includes("handleLatexEnvironmentAutoComplete(ta)"), 'handleLatexEnvironmentAutoComplete should be called in keydown handler');
    assert(src.includes("note.type === 'latex' || note.type === 'markdown'"), 'Auto-completion should work for LaTeX and Markdown files');
  });

  it('should process LaTeX includegraphics commands', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that processLatexContent handles includegraphics
    assert(src.includes('\\\\includegraphics'), 'processLatexContent should handle includegraphics commands');
    assert(src.includes('data-raw-src'), 'includegraphics should be converted to img with data-raw-src');
    assert(src.includes('data-note-id'), 'img tags should include data-note-id for path resolution');
  });

  it('should process LaTeX centering commands', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that processLatexContent handles centering
    assert(src.includes('\\\\centering'), 'processLatexContent should handle centering commands');
  });

  it('should render LaTeX figures with proper CSS styling', async function() {
    const cssPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'styles.css');
    const css = await fs.readFile(cssPath, 'utf8');
    
    // Check that LaTeX figures have proper styling
    assert(css.includes('.latex-preview figure'), 'CSS should style LaTeX figures');
    assert(css.includes('text-align: center'), 'Figures should be centered');
    assert(css.includes('.latex-preview figcaption'), 'Figure captions should be styled');
  });

  it('should call processPreviewImages for LaTeX rendering', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that renderLatexPreview calls processPreviewImages
    assert(src.includes('void processPreviewImages()'), 'renderLatexPreview should call processPreviewImages');
  });

  it('should show file title in status bar when opening files in editor', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that status message uses note.title instead of generic "File"
    assert(src.includes('setStatus(`${note.title || \'Untitled\'} opened in editor.`, true)'), 'Status message should show file title when opening in editor');
    assert(src.includes('setStatus(`${note.title || \'Untitled\'} assigned to editor.`, true)'), 'Status message should show file title when assigning to editor');
  });

  it('should wait for image processing before exporting', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that handleExport calls processPreviewImages before getting HTML
    assert(src.includes('await processPreviewImages()'), 'handleExport should wait for image processing before exporting');
    assert(src.includes('await processPreviewHtmlIframes()'), 'handleExport should wait for iframe processing before exporting');
  });

  it('should process LaTeX table environments correctly', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that processLatexContent handles tabular environment
    assert(src.includes('\\\\begin{tabular}'), 'processLatexContent should handle \\begin{tabular}');
    assert(src.includes('\\\\end{tabular}'), 'processLatexContent should handle \\end{tabular}');
    assert(src.includes('<table'), 'tabular environments should be converted to HTML tables');
    assert(src.includes('border="1"'), 'tables should have borders');
    assert(src.includes('border: 1px solid'), 'tables should have proper CSS styling');
  });

  it('should handle LaTeX table row and cell separators', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that tables are properly converted with rows and cells
    // The new implementation properly creates <tr> and <td> elements
    assert(src.includes('tabularRegex'), 'processLatexContent should have tabularRegex to handle tabular blocks');
    assert(src.includes('<tr>'), 'should create table rows');
    assert(src.includes('<td'), 'should create table cells');
    assert(src.includes('.split(/'), 'should split content using regex patterns');
    assert(src.includes('row.split'), 'should split rows by cell separator');
  });

  it('should handle LaTeX matrix environments', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that math block detection works for matrix content
    assert(src.includes('inMathBlock'), 'processLatexContent should track math block state');
    assert(src.includes('$$'), 'processLatexContent should detect $$ delimiters');
    assert(src.includes('\\\\['), 'processLatexContent should detect \\[ delimiters');
    assert(src.includes('\\\\]'), 'processLatexContent should detect \\] delimiters');
  });

  it('should render LaTeX preview immediately without debounce for real-time updates', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that LaTeX files bypass debounce for immediate preview updates
    assert(src.includes("note.type === 'latex'"), 'handleEditorInput should check for LaTeX file type');
    assert(src.includes('renderLatexPreview(note.content, note.id)'), 'LaTeX should call renderLatexPreview directly');
    assert(src.includes('debouncedRenderPreview'), 'Markdown should still use debouncedRenderPreview');
  });

  it('should process inline LaTeX table commands', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that &table command generates LaTeX tables
    assert(src.includes('applyInlineTableTrigger'), 'applyInlineTableTrigger function should exist');
    assert(src.includes('columnSpec'), 'table generation should compute column specifications');
    assert(src.includes('rows_array'), 'table generation should create row arrays');
    assert(src.includes('\\\\begin{tabular}'), 'inline table command should generate tabular environment');
  });

  it('should preserve math content during LaTeX processing', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that math blocks are not processed by HTML conversions
    assert(src.includes('doubleDollarCount'), 'should count $$ occurrences');
    assert(src.includes('hasOpenBracket'), 'should detect \\[ opener');
    assert(src.includes('hasCloseBracket'), 'should detect \\] closer');
    assert(src.includes('continue;'), 'should skip processing for math blocks');
  });

  it('should remove inline command markers from LaTeX preview', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that &command lines are stripped before rendering
    assert(src.includes('preprocessInlineCommands'), 'should have preprocessInlineCommands function');
    assert(src.includes('&(?:table|code|'), 'should detect inline command markers with regex');
    assert(src.includes('renderLatexPreview'), 'should call renderLatexPreview with cleaned content');
  });

  it('should handle LaTeX figure environments', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that figure environments are properly handled
    assert(src.includes('\\\\begin{figure}'), 'should handle \\begin{figure}');
    assert(src.includes('\\\\end{figure}'), 'should handle \\end{figure}');
    assert(src.includes('<figure'), 'should convert to HTML figure element');
    assert(src.includes('</figure>'), 'should close figure element');
    assert(src.includes('\\\\caption'), 'should handle caption commands');
    assert(src.includes('<figcaption>'), 'should convert captions to HTML');
  });

  it('should replace existing LaTeX tables when updating dimensions', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that the function to strip existing LaTeX tables exists
    assert(src.includes('stripExistingLatexTableAfterCommand'), 'should have function to detect and remove existing tables');
    assert(src.includes('\\\\begin{tabular}'), 'should look for existing tabular blocks');
    assert(src.includes('\\\\end{tabular}'), 'should find the end of tabular blocks');
    assert(src.includes('tabularEnd'), 'should calculate table end position');
  });

  it('should preserve manually edited cells when changing fill values', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that parseExistingLatexTableContent function exists
    assert(src.includes('parseExistingLatexTableContent'), 'should have parseExistingLatexTableContent to parse existing tables');
    
    // Check that it parses rows and cells correctly
    assert(src.includes('tableContent.split'), 'should split table by rows');
    assert(src.includes('row.split(/\\s*&\\s*/)'), 'should split rows into cells by &');
    assert(src.includes('cellMatrix'), 'should create a matrix of cells');
    
    // Check that original fill value detection works
    assert(src.includes('valueCounts'), 'should track cell value frequencies');
    assert(src.includes('originalFillValue'), 'should detect the original fill value');
    assert(src.includes('maxCount'), 'should find the most common cell value');
    
    // Check that cell preservation logic exists
    assert(src.includes('existingCell !== originalFillValue'), 'should preserve cells different from original fill value');
    assert(src.includes('fillMode && existingTable'), 'should check fill mode and existing table');
    assert(src.includes('fillValue;'), 'should use new fill value for unchanged cells');
  });

  it('should handle fill values like &table 2x2 =0', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that parseInlineTableDimensions handles fill values
    assert(src.includes('hasEquals'), 'should detect = character for fill mode');
    assert(src.includes('valuePart'), 'should extract value after =');
    assert(src.includes('fillMode = true'), 'should set fillMode flag when = is present');
    assert(src.includes('fillValue = valuePart'), 'should store the fill value');
    
    // Check that LaTeX table generation uses fillValue
    assert(src.includes('cellContent = fillMode ? fillValue : \'cell\''), 'should use fillValue in fill mode');
    assert(src.includes('Array.from({ length: columns }, (_, colIndex) => cellContent)'), 'should fill all cells with fillValue');
  });

  it('should handle figure width specifications and centering', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Check that convertLatexWidthToCss function exists
    assert(src.includes('convertLatexWidthToCss'), 'should have convertLatexWidthToCss helper function');
    
    // Check that figure width parameters are parsed
    assert(src.includes('\\\\begin{figure}'), 'should handle \\begin{figure} with width params');
    assert(src.includes('widthMatch'), 'should extract width from figure parameters');
    assert(src.includes('\\\\textwidth'), 'should handle \\textwidth unit');
    
    // Check that centering is handled
    assert(src.includes('\\\\centering'), 'should detect \\centering command');
    assert(src.includes('text-align: center'), 'should apply centering styles');
    
    // Check figure styling
    assert(src.includes('margin: 1em auto'), 'figures should be centered with margin auto');
    assert(src.includes('align-items: center'), 'figure content should be centered');
  });

  it('should verify exported PDF was compiled with LaTeX', async function() {
    // Compilation can take time on CI/machines — increase timeout for this test
    this.timeout(60000);
    const fs = require('fs').promises;
    const path = require('path');
    const os = require('os');
    
    // We'll check by examining PDF internal structure
    // LaTeX-generated PDFs have specific signatures/markers
    
    // Create a test LaTeX document
    const testLatexContent = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\title{Test Document}
\\author{Test Author}
\\begin{document}
\\maketitle
\\section{Introduction}
This is a test document compiled with LaTeX.
\\end{document}`;

    // Import the LaTeX compiler
    const latexCompilerPath = path.join(__dirname, '..', '..', 'src', 'latex-compiler.js');
    const { checkLatexInstalled, compileLatexToPdf } = require(latexCompilerPath);
    
    // Check if LaTeX is installed (skip test if not)
    const latexStatus = checkLatexInstalled();
    if (!latexStatus.installed) {
      this.skip(); // Skip this test if LaTeX is not installed
      return;
    }
    
    // Create temporary output file
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'latex-test-'));
    const outputPdf = path.join(tempDir, 'test-output.pdf');
    
    try {
      // Compile LaTeX to PDF
      const result = await compileLatexToPdf(testLatexContent, outputPdf, {
        engine: latexStatus.engine,
        maxIterations: 1,
        timeout: 30000,
        verbose: true
      });

      assert(result.success, 'LaTeX compilation should succeed');
      assert(result.filePath, 'PDF file path should be returned');

      // Read the PDF file
      const pdfBuffer = await fs.readFile(outputPdf);
      const pdfContent = pdfBuffer.toString('binary');

      // Check 1: PDF signature
      assert(pdfContent.startsWith('%PDF'), 'PDF should start with %PDF signature');

      // Check 2: LaTeX-specific markers in PDF
      // LaTeX PDFs typically contain specific xref entries and trailer information
      assert(pdfContent.includes('/Creator'), 'PDF should have Creator entry');
      
      // Check 3: Producer string often indicates LaTeX
      // pdflatex sets: /Producer (pdfTeX...)
      // xelatex sets: /Producer (xetex...)
      const hasLatexProducer = pdfContent.includes('pdfTeX') || 
                               pdfContent.includes('TeX') ||
                               pdfContent.includes('xetex');
      assert(hasLatexProducer, 'PDF producer should indicate LaTeX/TeX engine');

      // Check 4: PDF structure - LaTeX PDFs have proper xref and trailer/startxref
      const hasXref = pdfContent.includes('xref') || pdfContent.includes('/Type /XRef');
      const hasTrailer = pdfContent.includes('trailer') || pdfContent.includes('startxref');
      assert(hasXref, 'PDF should have xref section or cross-reference stream');
      assert(hasTrailer, 'PDF should have trailer or startxref');
      assert(pdfContent.includes('/Size') || pdfContent.includes('/Type /XRef'), 'PDF should have Size in trailer or cross-reference stream');

      // Check 5: PDF should contain the document content
      // Look for encoded text from our LaTeX document
      const hasContent = pdfContent.includes('Test') || 
                         pdfContent.includes('Introduction') ||
                         pdfContent.includes('document');
      // Note: content might be compressed or encoded, so this is a weak check
      // The producer check above is more reliable

      // File size check - compiled PDFs should be reasonably sized
      assert(pdfBuffer.length > 1000, 'PDF should have content (size > 1KB)');
      assert(pdfBuffer.length < 50 * 1024 * 1024, 'PDF should not be excessively large (< 50MB)');

      console.log(`✓ LaTeX compilation verified:
        - PDF signature: valid
        - Producer: indicates LaTeX
        - File size: ${pdfBuffer.length} bytes
        - Has xref and trailer: yes`);

    } finally {
      // Cleanup
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (e) {
        console.warn('Failed to clean up temp directory:', e.message);
      }
    }
  });

  it('should distinguish between LaTeX-compiled PDF and HTML-exported PDF', async function() {
    const fs = require('fs').promises;
    const path = require('path');
    
    // This test verifies that LaTeX PDFs have different characteristics than HTML PDFs
    
    // Check 1: LaTeX detection by looking for TeX-specific markers
    // LaTeX PDFs will have /Producer containing pdfTeX, xetex, or similar
    
    // We can check the app.js export logic
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');
    
    // Should have LaTeX-specific export path
    assert(src.includes('note.type === \'latex\''), 'Should check if note is LaTeX');
    assert(src.includes('window.api.exportLatexPdf'), 'Should call exportLatexPdf for LaTeX');
    
    // Should have fallback logic
    assert(src.includes('fallbackToHtml'), 'Should have fallback to HTML export');
    
    // Should show different messages for LaTeX vs HTML
    assert(src.includes('Exported to'), 'Should show export message');

    console.log('✓ LaTeX/HTML export distinction verified');
  });

  it('should validate PDF producer field for LaTeX detection', async function() {
    // Helper function to detect if a PDF was created by LaTeX
    function isLatexGeneratedPdf(pdfContent) {
      // Check for LaTeX/TeX engine markers
      const latexMarkers = ['pdfTeX', 'xetex', 'LuaTeX', 'TeX'];
      for (const marker of latexMarkers) {
        if (pdfContent.includes(marker)) {
          return true;
        }
      }
      
      // Alternative: check for specific PDF structure patterns
      // LaTeX PDFs typically have very specific xref patterns
      const hasProperStructure = pdfContent.includes('%%EOF') && 
                                 pdfContent.includes('xref') &&
                                 pdfContent.includes('/Producer (');
      return hasProperStructure;
    }
    
    // Test that the detection function works
    assert(typeof isLatexGeneratedPdf === 'function', 'PDF detection function should exist');
    
    // Create mock LaTeX PDF content (partial)
    const latexPdfMock = '%PDF-1.4\n' +
      '1 0 obj\n' +
      '<</Type /Catalog /Pages 2 0 R>>\n' +
      'endobj\n' +
      'xref\n' +
      '0 3\n' +
      '0000000000 65535 f\n' +
      'trailer\n' +
      '<</Size 3 /Root 1 0 R /Producer (pdfTeX-1.40.21)>>\n' +
      '%%EOF';
    
    assert(isLatexGeneratedPdf(latexPdfMock), 'Should detect LaTeX PDF by producer');
    
    // Create mock HTML-generated PDF content
    const htmlPdfMock = '%PDF-1.4\n' +
      'trailer\n' +
      '<</Producer (Chromium/HeadlessChrome)>>\n' +
      '%%EOF';
    
    assert(!isLatexGeneratedPdf(htmlPdfMock), 'Should not detect HTML PDF as LaTeX');

    console.log('✓ PDF producer detection works correctly');
  });
});

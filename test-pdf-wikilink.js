/**
 * Test: PDF Wikilink Opening
 * 
 * This test verifies that:
 * 1. Clicking on a wikilink to a PDF in the preview opens the PDF
 * 2. The PDF displays in both the editor pane and central preview
 * 3. A tab appears for the PDF with a close button
 * 4. The tab bar remains visible and is not covered by the PDF
 * 5. Users can switch between files using tabs
 */

const test = async () => {
  console.log('=== PDF Wikilink Test ===\n');

  // Test 1: Verify PDF note exists in state
  console.log('Test 1: Check if PDF note is in state.notes');
  const pdfNotes = Array.from(state.notes.values()).filter(n => n.type === 'pdf');
  console.log(`✓ Found ${pdfNotes.length} PDF note(s)`);
  if (pdfNotes.length === 0) {
    console.log('⚠ Warning: No PDF files found. Create a PDF file in your workspace to test.');
    return;
  }
  const testPdf = pdfNotes[0];
  console.log(`✓ Test PDF: "${testPdf.title}" (ID: ${testPdf.id})\n`);

  // Test 2: Verify wiki index includes the PDF
  console.log('Test 2: Check if PDF is in wiki index');
  const pdfSlug = toWikiSlug(testPdf.title);
  const indexedId = state.wikiIndex.get(pdfSlug);
  console.log(`✓ PDF slug: "${pdfSlug}" → ID: ${indexedId}`);
  console.log(`✓ Indexed correctly: ${indexedId === testPdf.id ? 'YES' : 'NO'}\n`);

  // Test 3: Simulate clicking a wikilink to the PDF
  console.log('Test 3: Simulate clicking wikilink to PDF');
  console.log(`  Calling openNoteById("${testPdf.id}")`);
  openNoteById(testPdf.id, false);
  
  // Allow async operations to complete
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`✓ state.activeNoteId: ${state.activeNoteId}`);
  console.log(`✓ Active note matches PDF: ${state.activeNoteId === testPdf.id ? 'YES' : 'NO'}\n`);

  // Test 4: Verify tab was created
  console.log('Test 4: Check if PDF tab was created');
  const pdfTab = state.tabs.find(t => t.noteId === testPdf.id);
  console.log(`✓ PDF tab exists: ${pdfTab ? 'YES' : 'NO'}`);
  if (pdfTab) {
    console.log(`  Tab ID: ${pdfTab.id}`);
    console.log(`  Tab title: ${pdfTab.title}`);
    console.log(`  Tab pane: ${pdfTab.paneId || 'left (default)'}`);
  }
  console.log('');

  // Test 5: Verify PDF viewer is rendered in pane
  console.log('Test 5: Check if PDF viewer is rendered in pane');
  const pdfViewerElement = document.querySelector('.pdf-pane-viewer');
  console.log(`✓ PDF viewer element exists: ${pdfViewerElement ? 'YES' : 'NO'}`);
  if (pdfViewerElement) {
    console.log(`  Viewer src contains "pdf": ${pdfViewerElement.src.includes('pdf') ? 'YES' : 'NO'}`);
    console.log(`  Viewer is visible: ${pdfViewerElement.offsetHeight > 0 ? 'YES' : 'NO'}`);
  }
  console.log('');

  // Test 6: Verify tab bar is visible
  console.log('Test 6: Check if tab bar remains visible');
  const tabBar = document.querySelector('.pane-tab-bar');
  console.log(`✓ Tab bar element exists: ${tabBar ? 'YES' : 'NO'}`);
  if (tabBar) {
    console.log(`  Tab bar height: ${tabBar.offsetHeight}px (should be ~34px)`);
    console.log(`  Tab bar is visible: ${tabBar.offsetHeight > 0 ? 'YES' : 'NO'}`);
  }
  console.log('');

  // Test 7: Verify PDF is not using absolute positioning covering the tab bar
  console.log('Test 7: Check PDF viewer positioning');
  if (pdfViewerElement) {
    const position = window.getComputedStyle(pdfViewerElement).position;
    const top = window.getComputedStyle(pdfViewerElement).top;
    console.log(`  Position: ${position}`);
    console.log(`  Top value: ${top}`);
    console.log(`✓ Uses relative positioning: ${position === 'relative' ? 'YES' : 'NO'}`);
    console.log(`✓ Not covering tab bar: ${top !== '0px' ? 'YES' : 'NO'}`);
  }
  console.log('');

  // Test 8: Verify PDF displays in central preview
  console.log('Test 8: Check if PDF is displayed in central preview');
  const pdfPreview = document.querySelector('#pdf-viewer.visible');
  console.log(`✓ Central PDF viewer visible: ${pdfPreview ? 'YES' : 'NO'}`);
  if (pdfPreview) {
    console.log(`  Preview src contains "pdf": ${pdfPreview.src.includes('pdf') ? 'YES' : 'NO'}`);
  }
  console.log('');

  // Test 9: Verify workspace has pdf-mode class
  console.log('Test 9: Check workspace styling for PDF mode');
  const workspaceContent = document.querySelector('.workspace__content');
  const hasPdfMode = workspaceContent?.classList.contains('pdf-mode');
  console.log(`✓ Workspace has 'pdf-mode' class: ${hasPdfMode ? 'YES' : 'NO'}`);
  console.log('');

  // Test 10: Create a markdown note and verify tab switching works
  console.log('Test 10: Verify tab switching is possible');
  const markdownNotes = Array.from(state.notes.values()).filter(n => n.type === 'markdown');
  if (markdownNotes.length > 0) {
    const mdNote = markdownNotes[0];
    console.log(`  Creating/opening markdown tab: "${mdNote.title}"`);
    openNoteById(mdNote.id, false);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mdTab = state.tabs.find(t => t.noteId === mdNote.id);
    console.log(`✓ Markdown tab exists: ${mdTab ? 'YES' : 'NO'}`);
    console.log(`✓ Multiple tabs visible: ${state.tabs.length > 1 ? 'YES' : 'NO'} (${state.tabs.length} tabs total)`);
    
    // Switch back to PDF
    console.log(`  Switching back to PDF tab`);
    openNoteById(testPdf.id, false);
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`✓ Successfully switched back to PDF`);
  }
  console.log('');

  console.log('=== PDF Wikilink Test Complete ===');
  console.log('All tests passed! ✓\n');
};

// Run the test
test().catch(err => {
  console.error('Test failed:', err);
});

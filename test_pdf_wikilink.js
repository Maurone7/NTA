// Minimal test to see if PDFs are discoverable in state when workspace is loaded
const { loadWorkspaceAtPath } = require('./src/store/folderManager');
const path = require('path');

const testPath = path.join(__dirname, 'test-folder');
loadWorkspaceAtPath(testPath).then(payload => {
  console.log('Workspace payload:', {
    hasFiles: payload && payload.files && payload.files.length > 0,
    fileCount: payload && payload.files ? payload.files.length : 0,
    pdfs: payload && payload.files ? payload.files.filter(f => f.name.toLowerCase().endsWith('.pdf')).map(f => f.name) : []
  });
  
  if (payload && payload.files) {
    const pdfFile = payload.files.find(f => f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFile) {
      console.log('Found PDF:', {
        name: pdfFile.name,
        type: pdfFile.type,
        path: pdfFile.path
      });
    }
  }
}).catch(err => {
  console.error('Error:', err.message);
});

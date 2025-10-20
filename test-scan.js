const fs = require('fs');
const path = require('path');

async function testScan() {
  const folderPath = '/Users/mauro/Desktop/NoteTakingApp/test-folder';

  let allNotes = [];
  const scanDirectory = async (dirPath, relativePath = '') => {
    const children = [];
    try {
      const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
      console.log(`Scanning ${dirPath}, found ${dirents.length} items`);
      for (const d of dirents) {
        const name = d.name;
        const fullPath = path.join(dirPath, name);
        const relPath = path.join(relativePath, name);

        if (d.isDirectory()) {
          console.log(`Directory: ${name}`);
          // Recurse into subdirectory
          const subChildren = await scanDirectory(fullPath, relPath);
          if (subChildren.length > 0) {
            children.push({
              type: 'directory',
              name,
              path: fullPath,
              children: subChildren,
              hasChildren: subChildren.length > 0
            });
          }
        } else if (d.isFile()) {
          const ext = String(name).split('.').pop().toLowerCase();
          console.log(`File: ${name}, ext: ${ext}`);
          if (['md', 'pdf', 'ipynb', 'html', 'txt'].includes(ext)) {
            console.log(`  -> Supported file: ${name}`);
            const stat = await fs.promises.stat(fullPath).catch(() => null);
            const note = {
              id: `file-${Buffer.from(fullPath).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 20)}`,
              title: name,
              type: ext === 'ipynb' ? 'notebook' : (ext === 'pdf' ? 'pdf' : 'markdown'),
              absolutePath: fullPath,
              folderPath,
              createdAt: stat ? stat.ctime.toISOString() : new Date().toISOString(),
              updatedAt: stat ? stat.mtime.toISOString() : new Date().toISOString(),
            };
            allNotes.push(note);
            children.push({
              type: 'file',
              name,
              path: fullPath,
              ext: ext ? `.${ext}` : '',
              supported: true,
              noteId: note.id
            });
          }
        }
      }
    } catch (e) {
      console.error(`Error scanning ${dirPath}:`, e);
    }
    return children;
  };

  const children = await scanDirectory(folderPath);
  const tree = { name: path.basename(folderPath), path: folderPath, children };

  console.log('Tree:', JSON.stringify(tree, null, 2));
  console.log('Notes:', allNotes.length);
}

testScan();
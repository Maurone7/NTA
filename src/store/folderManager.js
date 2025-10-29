
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');

const MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown', '.mdx']);
const LATEX_EXTENSIONS = new Set(['.tex']);
const BIB_EXTENSIONS = new Set(['.bib']);
const PDF_EXTENSION = '.pdf';
const PPTX_EXTENSION = '.pptx';
const DEFAULT_MARKDOWN_EXTENSION = '.md';
const SCRIPT_EXTENSIONS = {
  // Common scripting and text formats
  '.py': { language: 'python' },
  '.js': { language: 'javascript' },
  '.jsx': { language: 'javascript' },
  '.ts': { language: 'typescript' },
  '.tsx': { language: 'typescript' },
  '.json': { language: 'json' },
  '.html': { language: 'html' },
  '.htm': { language: 'html' },
  '.css': { language: 'css' },
  '.scss': { language: 'scss' },
  '.md': { language: 'markdown' },
  '.markdown': { language: 'markdown' },
  '.mdx': { language: 'markdown' },
  '.txt': { language: 'text' },
  '.log': { language: 'text' },
  '.yml': { language: 'yaml' },
  '.yaml': { language: 'yaml' },
  '.pyc': { language: 'python' },

  // LaTeX related
  '.tex': { language: 'latex' },
  '.aux': { language: 'latex' },
  '.lot': { language: 'latex' },
  '.lof': { language: 'latex' },
  '.fdb_latexmk': { language: 'latex' },
  '.cls': { language: 'latex' },
  '.toc': { language: 'latex' },

  // Bibliography and support files
  '.bib': { language: 'bibtex' },
  '.blg': { language: 'bibtex' },
  '.bbl': { language: 'bibtex' },

  // Shell / scripts
  '.sh': { language: 'shell' },
  '.bash': { language: 'shell' },
  '.zsh': { language: 'shell' },
  '.ps1': { language: 'powershell' },

  // Compiled/auxiliary
  '.out': { language: 'text' },
  '.fls': { language: 'text' },
  '.synctex.gz': { language: 'text' },
  '.iges': { language: 'text' }
};
const IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.bmp',
  '.tif',
  '.tiff',
  '.svg',
  '.avif',
  '.ico'
]);

const VIDEO_EXTENSIONS = new Set([
  '.mp4',
  '.webm',
  '.ogg',
  '.ogv',
  '.avi',
  '.mov',
  '.wmv',
  '.flv',
  '.mkv',
  '.m4v'
]);

const HTML_EXTENSIONS = new Set(['.html', '.htm']);

// File size limits (in bytes) - will be configurable via settings
const DEFAULT_FILE_SIZE_LIMITS = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  script: 5 * 1024 * 1024   // 5MB
};

function getFileSizeLimit(fileType, fileSizeLimits = null) {
  if (fileSizeLimits && fileSizeLimits[fileType]) {
    return fileSizeLimits[fileType];
  }
  return DEFAULT_FILE_SIZE_LIMITS[fileType] || 10 * 1024 * 1024; // 10MB default
}

function isFileSizeAllowed(absolutePath, fileType, fileSizeLimits = null) {
  try {
    const stats = fs.statSync(absolutePath);
    const limit = getFileSizeLimit(fileType, fileSizeLimits);
    return stats.size <= limit;
  } catch (error) {
    return true; // Allow if we can't check
  }
}

const hashPath = (absolutePath) =>
  crypto.createHash('sha1').update(absolutePath).digest('hex');

const toIsoString = (value) => (value instanceof Date ? value.toISOString() : new Date(value).toISOString());

const sortEntries = (entries) =>
  entries.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), undefined, { numeric: true });
    }
    return a.type === 'directory' ? -1 : 1;
  });

const ensureMarkdownFileName = (input) => {
  const sanitized = path.basename(input).trim() || 'Untitled.md';
  const ext = path.extname(sanitized).toLowerCase();
  if (!ext) {
    return `${sanitized}${DEFAULT_MARKDOWN_EXTENSION}`;
  }
  if (!MARKDOWN_EXTENSIONS.has(ext)) {
    const { name } = path.parse(sanitized);
    return `${name}${DEFAULT_MARKDOWN_EXTENSION}`;
  }
  return sanitized;
};

const pathExists = async (absolutePath) =>
  fsp
    .access(absolutePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);

const buildDirectoryTree = async (directoryPath, fileSizeLimits = null) => {
  const entries = await fsp.readdir(directoryPath, { withFileTypes: true }).catch((error) => {
    return [];
  });

  const children = [];
  const collectedNotes = [];

  for (const entry of entries) {
    if (entry.name === '.' || entry.name === '..' || entry.name.startsWith('.')) {
      continue;
    }

    const absolutePath = path.join(directoryPath, entry.name);

    if (entry.isSymbolicLink()) {
      continue;
    }

    if (entry.isDirectory()) {
      const { tree, notes } = await buildDirectoryTree(absolutePath, fileSizeLimits);
      children.push(tree);
      collectedNotes.push(...notes);
      continue;
    }

    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      const stats = await fsp.stat(absolutePath).catch((error) => {
        return null;
      });

      if (!stats) {
        continue;
      }

      const baseNode = {
        id: `tree-${hashPath(absolutePath)}`,
        name: entry.name,
        type: 'file',
        path: absolutePath,
        ext,
        supported: false
      };

      if (MARKDOWN_EXTENSIONS.has(ext)) {
        try {
          const content = await fsp.readFile(absolutePath, 'utf-8');
          const noteId = `external-${hashPath(absolutePath)}`;
          collectedNotes.push({
            id: noteId,
            title: path.parse(entry.name).name,
            type: 'markdown',
            origin: 'external',
            absolutePath,
            folderPath: directoryPath,
            content,
            createdAt: toIsoString(stats.birthtime),
            updatedAt: toIsoString(stats.mtime)
          });
          children.push({
            ...baseNode,
            supported: true,
            noteId
          });
        } catch (error) {
          children.push(baseNode);
        }
        continue;
      }

      if (LATEX_EXTENSIONS.has(ext)) {
        try {
          const content = await fsp.readFile(absolutePath, 'utf-8');
          const noteId = `external-${hashPath(absolutePath)}`;
          collectedNotes.push({
            id: noteId,
            title: path.parse(entry.name).name,
            type: 'latex',
            origin: 'external',
            absolutePath,
            folderPath: directoryPath,
            content,
            createdAt: toIsoString(stats.birthtime),
            updatedAt: toIsoString(stats.mtime)
          });
          children.push({
            ...baseNode,
            supported: true,
            noteId
          });
        } catch (error) {
          children.push(baseNode);
        }
        continue;
      }

      if (BIB_EXTENSIONS.has(ext)) {
        try {
          const content = await fsp.readFile(absolutePath, 'utf-8');
          const noteId = `external-${hashPath(absolutePath)}`;
          collectedNotes.push({
            id: noteId,
            title: path.parse(entry.name).name,
            type: 'bib',
            origin: 'external',
            absolutePath,
            folderPath: directoryPath,
            content,
            createdAt: toIsoString(stats.birthtime),
            updatedAt: toIsoString(stats.mtime)
          });
          children.push({
            ...baseNode,
            supported: true,
            noteId
          });
        } catch (error) {
          children.push(baseNode);
        }
        continue;
      }

      if (IMAGE_EXTENSIONS.has(ext)) {
        if (!isFileSizeAllowed(absolutePath, 'image', fileSizeLimits)) {
          children.push({
            ...baseNode,
            supported: false,
            error: 'File too large'
          });
          continue;
        }
        
        const noteId = `external-${hashPath(absolutePath)}`;
        collectedNotes.push({
          id: noteId,
          title: path.parse(entry.name).name,
          type: 'image',
          origin: 'external',
          absolutePath,
          folderPath: directoryPath,
          createdAt: toIsoString(stats.birthtime),
          updatedAt: toIsoString(stats.mtime)
        });
        children.push({
          ...baseNode,
          supported: true,
          noteId
        });
        continue;
      }

      if (VIDEO_EXTENSIONS.has(ext)) {
        if (!isFileSizeAllowed(absolutePath, 'video', fileSizeLimits)) {
          children.push({
            ...baseNode,
            supported: false,
            error: 'File too large'
          });
          continue;
        }
        
        const noteId = `external-${hashPath(absolutePath)}`;
        collectedNotes.push({
          id: noteId,
          title: path.parse(entry.name).name,
          type: 'video',
          origin: 'external',
          absolutePath,
          folderPath: directoryPath,
          createdAt: toIsoString(stats.birthtime),
          updatedAt: toIsoString(stats.mtime)
        });
        children.push({
          ...baseNode,
          supported: true,
          noteId
        });
        continue;
      }

      if (HTML_EXTENSIONS.has(ext)) {
        const noteId = `external-${hashPath(absolutePath)}`;
        collectedNotes.push({
          id: noteId,
          title: path.parse(entry.name).name,
          type: 'html',
          origin: 'external',
          absolutePath,
          folderPath: directoryPath,
          createdAt: toIsoString(stats.birthtime),
          updatedAt: toIsoString(stats.mtime)
        });
        children.push({
          ...baseNode,
          supported: true,
          noteId
        });
        continue;
      }

      if (ext === PDF_EXTENSION) {
        const noteId = `external-${hashPath(absolutePath)}`;
        collectedNotes.push({
          id: noteId,
          title: path.parse(entry.name).name,
          type: 'pdf',
          origin: 'external',
          absolutePath,
          folderPath: directoryPath,
          createdAt: toIsoString(stats.birthtime),
          updatedAt: toIsoString(stats.mtime)
        });
        children.push({
          ...baseNode,
          supported: true,
          noteId
        });
        continue;
      }

      if (ext === PPTX_EXTENSION) {
        const noteId = `external-${hashPath(absolutePath)}`;
        collectedNotes.push({
          id: noteId,
          title: path.parse(entry.name).name,
          type: 'pptx',
          origin: 'external',
          absolutePath,
          folderPath: directoryPath,
          createdAt: toIsoString(stats.birthtime),
          updatedAt: toIsoString(stats.mtime)
        });
        children.push({
          ...baseNode,
          supported: true,
          noteId
        });
        continue;
      }

      if (ext in SCRIPT_EXTENSIONS) {
        if (!isFileSizeAllowed(absolutePath, 'script', fileSizeLimits)) {
          children.push({
            ...baseNode,
            supported: false,
            error: 'File too large'
          });
          continue;
        }
        
        try {
          const content = await fsp.readFile(absolutePath, 'utf-8');
          const noteId = `external-${hashPath(absolutePath)}`;
          const { language } = SCRIPT_EXTENSIONS[ext];
          collectedNotes.push({
            id: noteId,
            title: path.parse(entry.name).name,
            type: 'code',
            language,
            origin: 'external',
            absolutePath,
            folderPath: directoryPath,
            content,
            createdAt: toIsoString(stats.birthtime),
            updatedAt: toIsoString(stats.mtime)
          });
          children.push({
            ...baseNode,
            supported: true,
            noteId
          });
        } catch (error) {
          children.push(baseNode);
        }
        continue;
      }

      if (ext === '.ipynb') {
        try {
          const raw = await fsp.readFile(absolutePath, 'utf-8');
          const parsed = JSON.parse(raw);
          const languageInfo =
            parsed && parsed.metadata && typeof parsed.metadata === 'object'
              ? parsed.metadata.language_info
              : null;
          const primaryLanguage =
            languageInfo && typeof languageInfo.name === 'string' ? languageInfo.name : null;
          const cells = Array.isArray(parsed.cells)
            ? parsed.cells.map((cell, index) => {
                const cellType = typeof cell.cell_type === 'string' ? cell.cell_type : 'unknown';
                const source = Array.isArray(cell.source)
                  ? cell.source.join('')
                  : typeof cell.source === 'string'
                  ? cell.source
                  : '';
                const metadata = typeof cell.metadata === 'object' && cell.metadata !== null ? cell.metadata : {};
                const outputs = Array.isArray(cell.outputs)
                  ? cell.outputs
                      .map((output) => {
                        if (Array.isArray(output.text)) {
                          return output.text.join('');
                        }
                        if (typeof output.text === 'string') {
                          return output.text;
                        }
                        if (output.data) {
                          const data = output.data;
                          if (typeof data['text/plain'] === 'string') {
                            return data['text/plain'];
                          }
                          if (Array.isArray(data['text/plain'])) {
                            return data['text/plain'].join('');
                          }
                        }
                        return null;
                      })
                      .filter((value) => typeof value === 'string' && value.trim().length)
                  : [];
                return {
                  index,
                  type: cellType,
                  source,
                  metadata,
                  outputs
                };
              })
            : [];

          const noteId = `external-${hashPath(absolutePath)}`;
          collectedNotes.push({
            id: noteId,
            title: path.parse(entry.name).name,
            type: 'notebook',
            language: primaryLanguage,
            origin: 'external',
            absolutePath,
            folderPath: directoryPath,
            notebook: {
              cells,
              metadata: typeof parsed.metadata === 'object' && parsed.metadata !== null ? parsed.metadata : {}
            },
            createdAt: toIsoString(stats.birthtime),
            updatedAt: toIsoString(stats.mtime)
          });

          children.push({
            ...baseNode,
            supported: true,
            noteId
          });
        } catch (error) {
          children.push(baseNode);
        }
        continue;
      }

      // Handle unknown extensions as code files
      if (!isFileSizeAllowed(absolutePath, 'script', fileSizeLimits)) {
        children.push({
          ...baseNode,
          supported: false,
          error: 'File too large'
        });
        continue;
      }
      
      try {
        const content = await fsp.readFile(absolutePath, 'utf-8');
        const noteId = `external-${hashPath(absolutePath)}`;
        collectedNotes.push({
          id: noteId,
          title: path.parse(entry.name).name,
          type: 'code',
          language: 'text',
          origin: 'external',
          absolutePath,
          folderPath: directoryPath,
          content,
          createdAt: toIsoString(stats.birthtime),
          updatedAt: toIsoString(stats.mtime)
        });
        children.push({
          ...baseNode,
          supported: true,
          noteId
        });
      } catch (error) {
        children.push(baseNode);
      }
      continue;

      children.push(baseNode);
    }
  }

  sortEntries(children);

  return {
    tree: {
      id: `tree-${hashPath(directoryPath)}`,
      name: path.basename(directoryPath) || directoryPath,
      type: 'directory',
      path: directoryPath,
      children
    },
    notes: collectedNotes
  };
};

const loadFolderNotes = async (folderPath, fileSizeLimits = null) => {
  if (!folderPath) {
    throw new Error('folderPath is required');
  }

  const stats = await fsp.stat(folderPath);
  if (!stats.isDirectory()) {
    throw new Error(`${folderPath} is not a directory`);
  }

  const { tree, notes } = await buildDirectoryTree(folderPath, fileSizeLimits);

  return {
    tree,
    notes
  };
};

const createMarkdownFile = async (folderPath, requestedName, initialContent = '') => {
  if (!folderPath) {
    throw new Error('folderPath is required');
  }

  const folderStats = await fsp.stat(folderPath);
  if (!folderStats.isDirectory()) {
    throw new Error(`${folderPath} is not a directory`);
  }

  const baseName = ensureMarkdownFileName(requestedName || 'Untitled.md');
  const { name } = path.parse(baseName);

  let candidate = path.join(folderPath, baseName);
  let suffix = 1;
  while (await pathExists(candidate)) {
    candidate = path.join(folderPath, `${name}-${suffix}${DEFAULT_MARKDOWN_EXTENSION}`);
    suffix += 1;
  }

  await fsp.writeFile(candidate, initialContent, 'utf-8');

  const { tree, notes } = await loadFolderNotes(folderPath);
  const createdNote = notes.find((note) => note.absolutePath === candidate) ?? null;

  return {
    tree,
    notes,
    folderPath,
    createdNoteId: createdNote ? createdNote.id : null
  };
};

const renameMarkdownFile = async (workspaceFolderPath, oldAbsolutePath, requestedName) => {
  if (!workspaceFolderPath) {
    throw new Error('workspaceFolderPath is required');
  }

  if (!oldAbsolutePath) {
    throw new Error('oldAbsolutePath is required');
  }

  const workspaceStats = await fsp.stat(workspaceFolderPath);
  if (!workspaceStats.isDirectory()) {
    throw new Error(`${workspaceFolderPath} is not a directory`);
  }

  const existingStats = await fsp.stat(oldAbsolutePath);
  if (!existingStats.isFile()) {
    throw new Error(`${oldAbsolutePath} is not a file`);
  }

  const directory = path.dirname(oldAbsolutePath);
  // Don't force markdown extension - allow renaming to any filename (preserves PDF, image, etc. extensions)
  const baseName = path.basename(requestedName || 'Untitled.md').trim() || 'Untitled.md';
  const targetPath = path.join(directory, baseName);
  const samePath = path.resolve(targetPath) === path.resolve(oldAbsolutePath);

  if (!samePath) {
    if (await pathExists(targetPath)) {
      throw new Error(`A file named ${baseName} already exists in this folder.`);
    }

    await fsp.rename(oldAbsolutePath, targetPath);
  }

  const { tree, notes } = await loadFolderNotes(workspaceFolderPath);
  const nextPath = samePath ? oldAbsolutePath : targetPath;
  const renamedNote = notes.find((note) => note.absolutePath === nextPath) ?? null;

  return {
    tree,
    notes,
    folderPath: workspaceFolderPath,
    renamedNoteId: renamedNote ? renamedNote.id : null,
    previousAbsolutePath: oldAbsolutePath,
    nextAbsolutePath: renamedNote ? renamedNote.absolutePath : nextPath
  };
};

const readPdfAsDataUri = async (absolutePath) => {
  if (!absolutePath) {
    return null;
  }

  try {
    const buffer = await fsp.readFile(absolutePath);
    return `data:application/pdf;base64,${buffer.toString('base64')}`;
  } catch (error) {
    return null;
  }
};

const saveMarkdownFile = async (filePath, content) => {
  if (!filePath) {
    throw new Error('filePath is required');
  }

  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.writeFile(filePath, content ?? '', 'utf-8');
};

const readPdfBuffer = async (absolutePath) => {
  if (!absolutePath) {
    return null;
  }

  try {
    return await fsp.readFile(absolutePath);
  } catch (error) {
    return null;
  }
};

module.exports = {
  loadFolderNotes,
  createMarkdownFile,
  renameMarkdownFile,
  readPdfAsDataUri,
  readPdfBuffer,
  saveMarkdownFile
};


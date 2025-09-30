const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');

const MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown', '.mdx']);
const PDF_EXTENSION = '.pdf';
const DEFAULT_MARKDOWN_EXTENSION = '.md';
const SCRIPT_EXTENSIONS = {
  '.py': { language: 'python' }
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

const HTML_EXTENSIONS = new Set([
  '.html',
  '.htm'
]);

const hashPath = (absolutePath) =>
  crypto.createHash('sha1').update(absolutePath).digest('hex');

const toIsoString = (value) => (value instanceof Date ? value.toISOString() : new Date(value).toISOString());

const sortEntries = (entries) =>
  entries.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
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

const buildDirectoryTree = async (directoryPath) => {
  const entries = await fsp.readdir(directoryPath, { withFileTypes: true }).catch((error) => {
    console.error(`Failed to read directory ${directoryPath}`, error);
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
      const { tree, notes } = await buildDirectoryTree(absolutePath);
      children.push(tree);
      collectedNotes.push(...notes);
      continue;
    }

    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      const stats = await fsp.stat(absolutePath).catch((error) => {
        console.error(`Failed to stat file ${absolutePath}`, error);
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
          console.error(`Failed to read markdown file ${absolutePath}`, error);
          children.push(baseNode);
        }
        continue;
      }

      if (IMAGE_EXTENSIONS.has(ext)) {
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

      if (ext in SCRIPT_EXTENSIONS) {
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
          console.error(`Failed to read code file ${absolutePath}`, error);
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
          console.error(`Failed to read notebook file ${absolutePath}`, error);
          children.push(baseNode);
        }
        continue;
      }

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

const loadFolderNotes = async (folderPath) => {
  if (!folderPath) {
    throw new Error('folderPath is required');
  }

  const stats = await fsp.stat(folderPath);
  if (!stats.isDirectory()) {
    throw new Error(`${folderPath} is not a directory`);
  }

  const { tree, notes } = await buildDirectoryTree(folderPath);

  return {
    tree,
    notes
  };
};

const createMarkdownFile = async (folderPath, requestedName) => {
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

  await fsp.writeFile(candidate, '', 'utf-8');

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
  const baseName = ensureMarkdownFileName(requestedName || 'Untitled.md');
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
    console.error(`Failed to read external PDF ${absolutePath}`, error);
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
    console.error(`Failed to read external PDF buffer ${absolutePath}`, error);
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

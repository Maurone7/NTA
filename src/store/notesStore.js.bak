const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const NOTES_FILENAME = 'notes.json';
const PDF_DIRECTORY = 'pdfs';
const APP_NAMESPACE = 'NTA';

const defaultContent = JSON.stringify({ notes: [] }, null, 2);

const fileExists = async (target) => {
  try {
    await fsp.access(target, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

const ensureDirectory = async (target) => {
  await fsp.mkdir(target, { recursive: true });
};

const readJsonFile = async (target) => {
  const raw = await fsp.readFile(target, 'utf-8');
  return JSON.parse(raw);
};

const writeJsonFile = async (target, data) => {
  const payload = JSON.stringify(data, null, 2);
  await fsp.writeFile(target, `${payload}\n`, 'utf-8');
};

const safeJoin = (...segments) => path.join(...segments.filter(Boolean));

const createNotesStore = (basePath) => {
  if (!basePath) {
    throw new Error('createNotesStore requires a basePath');
  }

  const dataDir = safeJoin(basePath, APP_NAMESPACE);
  const notesFile = safeJoin(dataDir, NOTES_FILENAME);
  const pdfDir = safeJoin(dataDir, PDF_DIRECTORY);

  const initialize = async () => {
    await ensureDirectory(dataDir);
    await ensureDirectory(pdfDir);

    if (!(await fileExists(notesFile))) {
      await fsp.writeFile(notesFile, `${defaultContent}\n`, 'utf-8');
    }
  };

  const loadNotes = async () => {
    const json = await readJsonFile(notesFile).catch(async (err) => {
      await fsp.writeFile(notesFile, `${defaultContent}\n`, 'utf-8');
      return JSON.parse(defaultContent);
    });

    if (!json || !Array.isArray(json.notes)) {
      return [];
    }

    return json.notes;
  };

  const saveNotes = async (notes) => {
    if (!Array.isArray(notes)) {
      throw new Error('notes must be an array');
    }

    const payload = {
      notes: notes.map((note) => ({
        ...note,
        id: note.id || crypto.randomUUID(),
        updatedAt: note.updatedAt || new Date().toISOString()
      }))
    };

    await writeJsonFile(notesFile, payload);
  };

  const importPdf = async (sourcePath) => {
    if (!sourcePath) {
      throw new Error('sourcePath required for importPdf');
    }

    const pdfId = crypto.randomUUID();
    const storedName = `${pdfId}.pdf`;
    const destination = safeJoin(pdfDir, storedName);

    await fsp.copyFile(sourcePath, destination);

    const { name } = path.parse(sourcePath);
    const now = new Date().toISOString();

    return {
      id: pdfId,
      title: name,
      type: 'pdf',
      storedPath: storedName,
      createdAt: now,
      updatedAt: now
    };
  };

  const readPdfAsDataUri = async (storedPath) => {
    if (!storedPath) {
      return null;
    }

    const filePath = safeJoin(pdfDir, storedPath);
    if (!(await fileExists(filePath))) {
      return null;
    }

    const buffer = await fsp.readFile(filePath);
    const base64 = buffer.toString('base64');
    return `data:application/pdf;base64,${base64}`;
  };

  const getPaths = () => ({
    basePath,
    dataDir,
    notesFile,
    pdfDir
  });

  return {
    initialize,
    loadNotes,
    saveNotes,
    importPdf,
    readPdfAsDataUri,
    getPaths
  };
};

module.exports = { createNotesStore };

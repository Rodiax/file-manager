import { glob } from 'glob';
import { promises as fs } from 'fs';
const path = require('path');
const { dialog } = require('electron');

export async function loadUserDirectory(dirPath?: string) {
  if (dirPath) {
    const filePaths = await loadFiles(dirPath);

    return {
      directoryPath: dirPath,
      filePaths,
    };
  }

  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { directoryPath: '', filePaths: [] };
  }

  const directoryPath = result.filePaths[0];
  const filePaths = await loadFiles(directoryPath);
  filePaths.sort();

  return {
    directoryPath,
    filePaths,
  };
}

export async function loadAppsDirectory(dirPath?: string) {
  if (dirPath) {
    const rootDirectories = await loadDirents(dirPath);
    return {
      directoryPath: dirPath,
      rootDirectories,
    };
  }

  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { directoryPath: '', rootDirectories: [] };
  }

  const directoryPath = result.filePaths[0];
  const rootDirectories = await loadDirents(directoryPath);
  rootDirectories.sort();

  return {
    directoryPath,
    rootDirectories,
  };
}

async function loadFiles(dirPath: string) {
  const filePaths = await glob('**/*', {
    cwd: dirPath,
    nodir: true, // Nevrací složky
    absolute: true, // Vrátí absolutní cesty
  });

  return filePaths;
}

async function loadDirents(dirPath: string) {
  const dirents = await fs.readdir(dirPath, { withFileTypes: true });
  const rootDirectories = dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.join(dirPath, dirent.name)); // Sestaví absolutní cestu

  return rootDirectories;
}

export async function copyFile(
  filePath: FilePath,
  targetPath: FilePath
): Promise<CopyFileStatus> {
  try {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(filePath, targetPath);

    return { status: 'success', message: '' };
  } catch (err) {
    console.error('Chyba při kopírování souboru:', err);
    return { status: 'error', message: err?.message };
  }
}

export async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch (e) {
    console.error('Chyba při ověření souboru:', e);
  }

  return false;
}

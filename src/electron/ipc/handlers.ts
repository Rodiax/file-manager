import { ipcMain } from 'electron';
import {
  loadUserDirectory,
  loadAppsDirectory,
  copyFile,
  fileExists,
} from '../main/files';
import {
  COPY_FILE,
  LOAD_USER_DIRECTORY,
  LOAD_APPS_DIRECTORY,
  CHECK_FILE,
} from './actions';

export function registerIPCHandlers() {
  ipcMain.handle(LOAD_USER_DIRECTORY, (_, dirPath?: string) =>
    loadUserDirectory(dirPath)
  );
  ipcMain.handle(LOAD_APPS_DIRECTORY, (_, dirPath?: string) =>
    loadAppsDirectory(dirPath)
  );
  ipcMain.handle(COPY_FILE, (_, filePath: FilePath, targetPath: FilePath) =>
    copyFile(filePath, targetPath)
  );
  ipcMain.handle(CHECK_FILE, (_, filePath: FilePath) => fileExists(filePath));
}

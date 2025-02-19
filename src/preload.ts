const { contextBridge, ipcRenderer } = require('electron');
import {
  LOAD_APPS_DIRECTORY,
  LOAD_USER_DIRECTORY,
  COPY_FILE,
  CHECK_FILE,
} from './electron/ipc/actions';

contextBridge.exposeInMainWorld('FileService', {
  loadUserDirectory: (dirPath?: string) =>
    ipcRenderer.invoke(LOAD_USER_DIRECTORY, dirPath),
  loadAppsDirectory: (dirPath?: string) =>
    ipcRenderer.invoke(LOAD_APPS_DIRECTORY, dirPath),
  copyFile: (filePath: FilePath, targetPath: FilePath) =>
    ipcRenderer.invoke(COPY_FILE, filePath, targetPath),
  fileExists: (filePath: FilePath) => ipcRenderer.invoke(CHECK_FILE, filePath),
});

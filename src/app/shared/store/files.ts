import { create } from 'zustand';
import { FilePath, CopyStatus, NewFilePath } from '../types/files';
import { truncatePathFromLeft, getFolderNameFromPath } from '../utils/files';

interface UserDirectoryStore {
  directoryPath: string;
  filePaths: FilePath[];
  setUserDirectory: (
    directoryPath: UserDirectoryStore['directoryPath'],
    filePaths: UserDirectoryStore['filePaths']
  ) => void;
  removeFilePaths: (fileIds: FilePath['id'][]) => void;
  reset: () => void;
}
export const useUserDirectoryStore = create<UserDirectoryStore>()((set) => ({
  directoryPath: '',
  filePaths: [],

  setUserDirectory: (
    directoryPath: UserDirectoryStore['directoryPath'],
    filePaths: UserDirectoryStore['filePaths']
  ) => set({ directoryPath, filePaths }),
  removeFilePaths: (fileIds: UserDirectoryStore['filePaths'][number]['id'][]) =>
    set((state) => ({
      filePaths: state.filePaths.filter((path) => !fileIds.includes(path.id)),
    })),
  reset: () => set({ directoryPath: '', filePaths: [] }),
}));
interface AppDirectoryStore {
  directoryPath: string;
  rootDirectories: FilePath[];
  setAppDirectory: (
    directoryPath: string,
    rootDirectories: AppDirectoryStore['rootDirectories']
  ) => void;
  removeRootDirectories: (id: FilePath['id'][]) => void;
  reset: () => void;
}
export const useAppDirectoryStore = create<AppDirectoryStore>()((set) => ({
  directoryPath: '',
  rootDirectories: [],

  setAppDirectory: (
    directoryPath: AppDirectoryStore['directoryPath'],
    rootDirectories: AppDirectoryStore['rootDirectories']
  ) => set({ directoryPath, rootDirectories }),
  removeRootDirectories: (
    appIds: AppDirectoryStore['rootDirectories'][number]['id'][]
  ) =>
    set((state) => ({
      rootDirectories: state.rootDirectories.filter(
        (path) => !appIds.includes(path.id)
      ),
    })),
  reset: () => set({ directoryPath: '', rootDirectories: [] }),
}));

interface NewFileStore {
  filePaths: NewFilePath[];
  setFilePaths: (filePaths?: NewFileStore['filePaths']) => void;
  removeFilePaths: (fileIds: FilePath['id'][]) => void;
  setCopyStatus: (
    fileId: FilePath['id'],
    status: NewFileStore['filePaths'][number]['copyStatus']
  ) => void;
  reset: () => void;
}
export const useNewFileStore = create<NewFileStore>((set) => ({
  filePaths: [],
  setFilePaths: (filePaths: NewFileStore['filePaths']) =>
    set({ filePaths: filePaths }),
  removeFilePaths: (fileIds: NewFileStore['filePaths'][number]['id'][]) =>
    set((state) => ({
      filePaths: state.filePaths.filter((path) => !fileIds.includes(path.id)),
    })),
  setCopyStatus: (
    fileId: NewFileStore['filePaths'][number]['id'],
    status: NewFileStore['filePaths'][number]['copyStatus']
  ) =>
    set((state) => ({
      filePaths: state.filePaths.map((path) =>
        path.id === fileId ? { ...path, copyStatus: status } : path
      ),
    })),
  reset: () => set({ filePaths: [] }),
}));

export function isDirectorySetupOk() {
  const userDirectory = useUserDirectoryStore.getState();
  const appDirectory = useAppDirectoryStore.getState();

  return (
    userDirectory.filePaths.length > 0 &&
    appDirectory.rootDirectories.length > 0
  );
}

export function isDirectoriesSet() {
  const userDirectory = useUserDirectoryStore.getState();
  const appDirectory = useAppDirectoryStore.getState();

  return (
    userDirectory.directoryPath.length > 0 &&
    appDirectory.directoryPath.length > 0
  );
}

export function isNewFilePathsOk() {
  const newFilePaths = useNewFileStore.getState();

  return newFilePaths.filePaths.length > 0;
}

export const getNewFilePaths = async () => {
  const appDirectory = useAppDirectoryStore.getState();
  const userDirectory = useUserDirectoryStore.getState();

  if (!appDirectory.rootDirectories.length || !userDirectory.filePaths.length) {
    return [];
  }

  const newFilePaths: NewFilePath[] = [];

  for (const appRootDirectory of appDirectory.rootDirectories) {
    for (const userFilePath of userDirectory.filePaths) {
      const newPath = `${appRootDirectory.path}\\${truncatePathFromLeft(
        userFilePath.path,
        getFolderNameFromPath(userDirectory.directoryPath)
      )}`;
      const fileExists = await FileService.fileExists(newPath);

      newFilePaths.push({
        id: `${appRootDirectory.id}-${userFilePath.id}`,
        path: userFilePath.path,
        newPath,
        copyStatus: null,
        fileExists,
      });
    }
  }

  newFilePaths.sort();

  return newFilePaths;
};

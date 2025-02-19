type CopyFileStatus = { status: 'success' | 'error'; message: string };
type FilePath = string;
declare var FileService: {
  loadUserDirectory: (dirPath?: string) => Promise<{
    directoryPath: string;
    filePaths: string[];
  }>;
  loadAppsDirectory: (dirPath?: string) => Promise<{
    directoryPath: string;
    rootDirectories: FilePath[];
  }>;
  copyFile: (
    filePath: FilePath,
    targetPath: FilePath
  ) => Promise<CopyFileStatus>;
  fileExists: (filePath: FilePath) => Promise<boolean>;
};

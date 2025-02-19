export type FilePath = { id: string; path: string };

export type NewFilePath = FilePath & {
  newPath: FilePath['path'];
  copyStatus: CopyStatus;
  fileExists: boolean;
};

export type CopyStatus = 'loading' | 'success' | 'error' | null;

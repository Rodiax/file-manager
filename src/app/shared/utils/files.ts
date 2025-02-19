import { FilePath } from '../types/files';

export const getFolderNameFromPath = (path: FilePath['path']) => {
  return path.split('\\').pop();
};

export const truncatePathFromLeft = (
  path: FilePath['path'],
  toFolder: string
) => {
  const segments = path.split('\\');
  const folderIndex = segments.findIndex((segment) => segment === toFolder);
  return segments.slice(folderIndex + 1).join('\\');
};

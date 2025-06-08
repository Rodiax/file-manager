import { getFolderNameFromPath, truncatePathFromLeft } from '../../src/app/shared/utils/files';

describe('getFolderNameFromPath', () => {
  it('returns the last segment of the path', () => {
    expect(getFolderNameFromPath('folder1\\folder2\\file.txt')).toBe('file.txt');
  });

  it('handles absolute paths', () => {
    expect(getFolderNameFromPath('C:\\Users\\User')).toBe('User');
  });
});

describe('truncatePathFromLeft', () => {
  it('removes everything up to and including the specified folder', () => {
    expect(truncatePathFromLeft('root\\sub\\file.txt', 'root')).toBe('sub\\file.txt');
  });

  it('returns original path when folder is not found', () => {
    expect(truncatePathFromLeft('root\\sub\\file.txt', 'none')).toBe('root\\sub\\file.txt');
  });
});

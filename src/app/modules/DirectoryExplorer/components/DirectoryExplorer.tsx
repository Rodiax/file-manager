import { useState } from 'react';
import {
  Stack,
  Button,
  Breadcrumbs,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import {
  useAppDirectoryStore,
  useUserDirectoryStore,
  useNewFileStore,
  isDirectorySetupOk,
  getNewFilePaths,
} from '../../../shared/store/files';
import { useWindowStore } from '../../../shared/store/window';
import { FilePath } from '../../../shared/types/files';
import Table from '../../../shared/ui/Table';
import { getFolderNameFromPath } from '../../../shared/utils/files';
import { truncatePathFromLeft } from '../../../shared/utils/files';
import RefreshButton from '../../../shared/ui/RefreshButton';

export default function DirectoryExplorer() {
  const setWindow = useWindowStore((state) => state.setWindow);
  const appRootDirectories = useAppDirectoryStore(
    (state) => state.rootDirectories
  );
  const appDirectoryPath = useAppDirectoryStore((state) => state.directoryPath);
  const removeAppRootDirectories = useAppDirectoryStore(
    (state) => state.removeRootDirectories
  );
  const setAppDirectory = useAppDirectoryStore(
    (state) => state.setAppDirectory
  );
  const userFilePaths = useUserDirectoryStore((state) => state.filePaths);
  const userDirectoryPath = useUserDirectoryStore(
    (state) => state.directoryPath
  );
  const setUserDirectory = useUserDirectoryStore(
    (state) => state.setUserDirectory
  );
  const removeUserDirectoryFilePaths = useUserDirectoryStore(
    (state) => state.removeFilePaths
  );
  const setNewFilePaths = useNewFileStore((state) => state.setFilePaths);

  const [userTableIsLoding, setUserTableIsLoding] = useState(false);
  const [appTableIsLoding, setAppTableIsLoding] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');

  const filteredUserFilePaths = userFilePaths.filter((file) =>
    file.path.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredAppRootDirectories = appRootDirectories.filter((dir) =>
    dir.path.toLowerCase().includes(appSearch.toLowerCase())
  );

  const renderCell = (folderName: string) => (row: FilePath) =>
    (
      <Breadcrumbs>
        {truncatePathFromLeft(row.path, folderName)
          .split('\\')
          .map((path) => (
            <Typography key={path} variant="body2">
              {path}
            </Typography>
          ))}
      </Breadcrumbs>
    );
  const renderTitle2 = (text: string) => (
    <Typography
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      {text}
    </Typography>
  );
  const renderRefreshFiles = () => {
    if (userFilePaths.length > 0) return null;

    return (
      <RefreshButton
        onClick={async () => {
          setUserTableIsLoding(true);
          const { directoryPath, filePaths } =
            await FileService.loadUserDirectory(userDirectoryPath);

          setUserDirectory(
            directoryPath,
            filePaths.map((path, index) => ({ id: index + '', path }))
          );

          const newFiles = await getNewFilePaths();
          setNewFilePaths(newFiles);

          setUserTableIsLoding(false);
        }}
        tooltipTitle="Znovu načíst"
      />
    );
  };
  const renderRefreshApps = () => {
    if (appRootDirectories.length > 0) return null;

    return (
      <RefreshButton
        onClick={async () => {
          setAppTableIsLoding(true);
          const { directoryPath, rootDirectories } =
            await FileService.loadAppsDirectory(appDirectoryPath);

          setAppDirectory(
            directoryPath,
            rootDirectories.map((path, index) => ({ id: index + '', path }))
          );

          const newFiles = await getNewFilePaths();
          setNewFilePaths(newFiles);

          setAppTableIsLoding(false);
        }}
        tooltipTitle="Znovu načíst"
      />
    );
  };

  return (
    <Stack
      flexDirection="column"
      spacing={2}
      sx={{ height: '100%', paddingTop: 2 }}
    >
      <Stack spacing={1}>
        <TextField
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          placeholder="Hledat"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              userSearch && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setUserSearch('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            ),
          }}
        />
        <Table
          renderCell={(row) =>
            renderCell(getFolderNameFromPath(userDirectoryPath))(row)
          }
          data={filteredUserFilePaths}
          title="Soubory"
          title2={renderTitle2(getFolderNameFromPath(userDirectoryPath))}
          afterTitle={renderRefreshFiles()}
          onRemove={async (files: FilePath['id'][]) => {
            setUserTableIsLoding(true);
            removeUserDirectoryFilePaths(files);

            const newFiles = await getNewFilePaths();
            setNewFilePaths(newFiles);

            setUserTableIsLoding(false);
          }}
          sx={{ maxHeight: '48vh', height: '100%' }}
          isLoading={userTableIsLoding}
        />
      </Stack>
      <Stack spacing={1}>
        <TextField
          value={appSearch}
          onChange={(e) => setAppSearch(e.target.value)}
          placeholder="Hledat"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              appSearch && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setAppSearch('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            ),
          }}
        />
        <Table
          renderCell={(row) =>
            renderCell(getFolderNameFromPath(appDirectoryPath))(row)
          }
          data={filteredAppRootDirectories}
          title="Aplikace"
          title2={renderTitle2(getFolderNameFromPath(appDirectoryPath))}
          afterTitle={renderRefreshApps()}
          onRemove={async (files: FilePath['id'][]) => {
            setAppTableIsLoding(true);
            removeAppRootDirectories(files);

            const newFiles = await getNewFilePaths();
            setNewFilePaths(newFiles);

            setAppTableIsLoding(false);
          }}
          sx={{ maxHeight: '48vh', height: '100%' }}
          isLoading={appTableIsLoding}
        />
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ paddingBottom: 2 }}
      >
        <Button variant="text" onClick={() => setWindow('directory-setup')}>
          Zpět
        </Button>
        <Button
          variant="contained"
          disabled={!isDirectorySetupOk()}
          onClick={() => setWindow('copy-process')}
        >
          Pokračovat
        </Button>
      </Stack>
    </Stack>
  );
}

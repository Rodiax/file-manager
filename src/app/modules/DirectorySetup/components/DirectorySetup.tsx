import { useState } from 'react';
import { Stack, Button, Box, Breadcrumbs, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  InsertDriveFile as InsertDriveFileIcon,
  Apps as AppsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Popover from '../../../shared/ui/IconPopover';
import {
  useAppDirectoryStore,
  useUserDirectoryStore,
  useNewFileStore,
  getNewFilePaths,
  isDirectorySetupOk,
} from '../../../shared/store/files';
import { useWindowStore } from '../../../shared/store/window';

export default function DirectorySetup() {
  const setWindow = useWindowStore((state) => state.setWindow);
  const userDirectoryPath = useUserDirectoryStore(
    (state) => state.directoryPath
  );
  const userFilePaths = useUserDirectoryStore((state) => state.filePaths);
  const setUserDirectory = useUserDirectoryStore(
    (state) => state.setUserDirectory
  );
  const appDirectoryPath = useAppDirectoryStore((state) => state.directoryPath);
  const appRootDirectories = useAppDirectoryStore(
    (state) => state.rootDirectories
  );
  const setAppDirectory = useAppDirectoryStore(
    (state) => state.setAppDirectory
  );
  const setNewFilePaths = useNewFileStore((state) => state.setFilePaths);

  const [isUserDirLoading, setIsUserDirLoading] = useState(false);
  const [isAppDirLoading, setIsAppDirLoading] = useState(false);

  const handleUserDirectory = async () => {
    setIsUserDirLoading(true);

    const { directoryPath, filePaths } = await FileService.loadUserDirectory();

    setUserDirectory(
      directoryPath,
      filePaths.map((path, index) => ({ id: index + '', path }))
    );

    const newFiles = await getNewFilePaths();
    setNewFilePaths(newFiles);

    setIsUserDirLoading(false);
  };

  const handleAppsDirectory = async () => {
    setIsAppDirLoading(true);

    const { directoryPath, rootDirectories } =
      await FileService.loadAppsDirectory();

    setAppDirectory(
      directoryPath,
      rootDirectories.map((path, index) => ({ id: index + '', path }))
    );

    const newFiles = await getNewFilePaths();
    setNewFilePaths(newFiles);

    setIsAppDirLoading(false);
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: '100%' }}
    >
      <Stack spacing={2} maxWidth={320} width="100%" alignContent="center">
        <Stack direction="row" alignItems="center" gap={1}>
          <LoadingButton
            onClick={() => handleUserDirectory()}
            loading={isUserDirLoading}
            loadingPosition="start"
            startIcon={<InsertDriveFileIcon />}
            variant="contained"
            sx={{ flex: 1, maxWidth: 280 }}
          >
            Načíst složku se soubory
          </LoadingButton>
          {userFilePaths.length > 0 && (
            <Box>
              <Popover Icon={CheckCircleIcon} iconProps={{ color: 'success' }}>
                <Box sx={{ padding: '.5rem .7rem' }}>
                  <Breadcrumbs>
                    {userDirectoryPath.split('\\').map((segment, index) => (
                      <Typography key={index} variant="body2">
                        {segment}
                      </Typography>
                    ))}
                  </Breadcrumbs>
                </Box>
              </Popover>
            </Box>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          <LoadingButton
            onClick={() => handleAppsDirectory()}
            loading={isAppDirLoading}
            loadingPosition="start"
            startIcon={<AppsIcon />}
            variant="contained"
            sx={{ flex: 1, maxWidth: 280 }}
          >
            Načíst složku aplikací
          </LoadingButton>
          {appRootDirectories.length > 0 && (
            <Box>
              <Popover Icon={CheckCircleIcon} iconProps={{ color: 'success' }}>
                <Box sx={{ padding: '.5rem .7rem' }}>
                  <Breadcrumbs>
                    {appDirectoryPath.split('\\').map((segment, index) => (
                      <Typography key={index} variant="body2">
                        {segment}
                      </Typography>
                    ))}
                  </Breadcrumbs>
                </Box>
              </Popover>
            </Box>
          )}
        </Stack>
        <Stack
          direction="row"
          justifyContent="end"
          gap={1}
          sx={{ maxWidth: 280 }}
        >
          <Button
            onClick={() => setWindow('directory-explorer')}
            variant="contained"
            color="primary"
            disabled={!isDirectorySetupOk()}
          >
            Pokračovat
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

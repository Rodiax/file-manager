import { useState } from 'react';
import {
  Stack,
  Button,
  Breadcrumbs,
  Typography,
  Box,
  Chip,
  Paper,
} from '@mui/material';
import StatusRow from './StatusRow';
import ProcessButton from './ProcessButton';
import {
  useNewFileStore,
  useAppDirectoryStore,
  useUserDirectoryStore,
  getNewFilePaths,
} from '../../../shared/store/files';
import { useAppStore } from '../../../shared/store/app';
import { useWindowStore } from '../../../shared/store/window';
import Table from '../../../shared/ui/Table';
import { FilePath, CopyStatus, NewFilePath } from '../../../shared/types/files';
import { getFolderNameFromPath } from '../../../shared/utils/files';
import { truncatePathFromLeft } from '../../../shared/utils/files';
import RefreshButton from '../../../shared/ui/RefreshButton';
import ChipPopover from '../../../shared/ui/ChipPopover';

const getCopyStatus = (status: CopyStatus, processing: boolean): CopyStatus => {
  if (status === 'success') {
    return 'success';
  } else if (status === 'error') {
    return 'error';
  } else if (processing) {
    return 'loading';
  } else {
    return null;
  }
};

export default function CopyProcess() {
  const setWindow = useWindowStore((state) => state.setWindow);
  const newFilePaths = useNewFileStore((state) => state.filePaths);
  const removeNewFilePaths = useNewFileStore((state) => state.removeFilePaths);
  const appDirectoryPath = useAppDirectoryStore((state) => state.directoryPath);
  const appRootDirectories = useAppDirectoryStore(
    (state) => state.rootDirectories
  );
  const setCopyStatus = useNewFileStore((state) => state.setCopyStatus);
  const isCopyDone = useAppStore((state) => state.isCopyDone);
  const isProcessing = useAppStore((state) => state.isProcessing);
  const setCopyDone = useAppStore((state) => state.setCopyDone);
  const setIsProcessing = useAppStore((state) => state.setIsProcessing);

  const resetUserDirectory = useUserDirectoryStore((state) => state.reset);
  const resetAppDirectory = useAppDirectoryStore((state) => state.reset);
  const resetNewFilePaths = useNewFileStore((state) => state.reset);
  const setNewFilePaths = useNewFileStore((state) => state.setFilePaths);

  const [tableIsEditable, setTableIsEditable] = useState(true);
  const [newFilesTableIsLoading, setNewFilesTableIsLoading] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    setTableIsEditable(false);

    for (let file of newFilePaths) {
      const result = await FileService.copyFile(file.path, file.newPath);

      setCopyStatus(file.id, result.status);
    }

    setIsProcessing(false);
    setCopyDone(true);
  };

  const handleNewProcess = () => {
    resetUserDirectory();
    resetAppDirectory();
    resetNewFilePaths();

    setCopyDone(false);
    setWindow('directory-setup');
  };

  const renderCell = (row: NewFilePath, folderName: string) => (
    <StatusRow status={getCopyStatus(row.copyStatus, isProcessing)}>
      <Breadcrumbs>
        {truncatePathFromLeft(row.newPath, folderName)
          .split('\\')
          .map((path) => (
            <Typography key={path} variant="body2">
              {path}
            </Typography>
          ))}
      </Breadcrumbs>
      {!isCopyDone && !isProcessing && (
        <ChipPopover
          chipProps={{
            label: row.fileExists ? 'existuje' : 'neexistuje',
            color: row.fileExists ? 'secondary' : 'primary',
            size: 'small',
          }}
        >
          <Typography sx={{ p: 2 }} variant="body2">
            {row.fileExists
              ? 'Soubor, který v aplikaci již existuje'
              : 'Soubor, který v aplikaci ještě neexistuje'}
          </Typography>
        </ChipPopover>
      )}
    </StatusRow>
  );
  const renderRefreshNewFiles = () => {
    if (newFilePaths.length > 0) return null;

    return (
      <RefreshButton
        onClick={async () => {
          setNewFilesTableIsLoading(true);

          const newFiles = await getNewFilePaths();
          setNewFilePaths(newFiles);

          setNewFilesTableIsLoading(false);
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
      <Paper elevation={3}>
        <Stack direction="column" spacing={2} p={2}>
          <Stack justifyContent="space-between" direction="row">
            <Typography variant="h5">Aplikace</Typography>
            <ProcessButton
              handleNewProcess={handleNewProcess}
              handleProcess={handleProcess}
              isCopyDone={isCopyDone}
              newFilePaths={newFilePaths}
              processing={isProcessing}
            />
          </Stack>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '.5rem',
              overflowY: 'auto',
              maxHeight: '20vh',
            }}
          >
            {appRootDirectories.map((rootDir) => (
              <Chip
                key={rootDir.id}
                label={getFolderNameFromPath(rootDir.path)}
              />
            ))}
          </Box>
        </Stack>
      </Paper>
      <Table
        renderCell={(row) =>
          renderCell(row, getFolderNameFromPath(appDirectoryPath))
        }
        data={newFilePaths}
        title="Výsledná cesta souborů"
        title2={
          isCopyDone && (
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
              }}
              color="primary"
            >
              Hotovo
            </Typography>
          )
        }
        afterTitle={renderRefreshNewFiles()}
        onRemove={(files: FilePath['id'][]) => {
          setNewFilesTableIsLoading(true);
          removeNewFilePaths(files);
          setNewFilesTableIsLoading(false);
        }}
        editable={tableIsEditable}
        sx={{ maxHeight: '56vh' }}
        isLoading={newFilesTableIsLoading}
      />
      {!isCopyDone && !isProcessing && (
        <Box sx={{ paddingBottom: 2 }}>
          <Button
            variant="text"
            onClick={() => setWindow('directory-explorer')}
          >
            Zpět
          </Button>
        </Box>
      )}
    </Stack>
  );
}

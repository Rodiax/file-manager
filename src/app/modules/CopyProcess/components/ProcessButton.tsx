import { LoadingButton } from '@mui/lab';
import {
  FileCopy as FileCopyIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { NewFilePath } from '../../../shared/types/files';

interface Props {
  isCopyDone: boolean;
  processing: boolean;
  newFilePaths: NewFilePath[];
  handleProcess: () => void;
  handleNewProcess: () => void;
}
export default function ProcessButton({
  isCopyDone,
  processing,
  newFilePaths,
  handleNewProcess,
  handleProcess,
}: Props) {
  const handleClick = () => {
    return !isCopyDone ? handleProcess() : handleNewProcess();
  };

  return (
    <LoadingButton
      onClick={handleClick}
      variant="contained"
      disabled={processing || newFilePaths.length === 0}
      loading={processing}
      startIcon={!isCopyDone ? <FileCopyIcon /> : <RefreshIcon />}
    >
      {!isCopyDone ? 'Zahájit kopírování' : 'Zahájit nový proces'}
    </LoadingButton>
  );
}

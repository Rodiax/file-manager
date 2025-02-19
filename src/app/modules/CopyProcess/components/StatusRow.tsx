import { Stack, CircularProgress } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { CopyStatus } from '../../../shared/types/files';
interface Props {
  children: React.ReactNode;
  status: CopyStatus;
}

const renderStatus = (status: Props['status']) => {
  switch (status) {
    case 'loading':
      return <CircularProgress size="20px" />;
    case 'success':
      return <CheckCircleIcon color="success" />;
    case 'error':
      return <CancelIcon />;
    default:
      return null;
  }
};

export default function StatusRow({ children, status }: Props) {
  return (
    <Stack
      justifyContent="space-between"
      alignItems="center"
      direction="row"
      sx={{ paddingRight: '1rem' }}
      spacing={1}
    >
      {children}
      {renderStatus(status)}
    </Stack>
  );
}

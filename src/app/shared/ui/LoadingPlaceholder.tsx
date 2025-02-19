import { SxProps, Box, CircularProgress } from '@mui/material';

interface Props {
  sx?: SxProps;
}

export default function LoadingPlaceholder({}: Props) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 999,
      }}
    >
      <CircularProgress size={40} />
    </Box>
  );
}

import { useState } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  tooltipTitle: string;
  onClick: () => Promise<void>;
}
export default function RefreshButton({ tooltipTitle, onClick }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  };

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        onClick={handleClick}
        loading={loading}
        size="small"
        color="primary"
      >
        <RefreshIcon />
      </IconButton>
    </Tooltip>
  );
}

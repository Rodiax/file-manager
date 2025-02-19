import { useState } from 'react';
import {
  Popover as PopoverComponent,
  Box,
  Chip,
  ChipProps,
} from '@mui/material';

interface Props {
  children: React.ReactNode;
  chipProps?: ChipProps;
}
export default function ChipPopover({ children, chipProps }: Props) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorElement(null);
  };

  const open = Boolean(anchorElement);

  return (
    <Box>
      <Chip
        {...chipProps}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <PopoverComponent
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {children}
      </PopoverComponent>
    </Box>
  );
}

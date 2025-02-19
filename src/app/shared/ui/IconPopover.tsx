import { useState } from 'react';
import {
  Popover as PopoverComponent,
  Box,
  Icon,
  IconProps,
} from '@mui/material';

interface Props {
  children: React.ReactNode;
  Icon: typeof Icon;
  iconProps?: IconProps;
}
export default function IconPopover({ children, Icon, iconProps }: Props) {
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
      <Icon
        {...iconProps}
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

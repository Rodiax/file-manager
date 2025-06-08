import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchField({ value, onChange, placeholder = 'Hledat' }: Props) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment:
          value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange('')}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
      }}
    />
  );
}

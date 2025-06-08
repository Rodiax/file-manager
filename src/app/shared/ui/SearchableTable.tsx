import { useState } from 'react';
import { Stack, SxProps } from '@mui/material';
import Table from './Table';
import SearchField from './SearchField';

interface TableData {
  id: string;
  path: string;
}

interface Props<T extends TableData> {
  title: string;
  title2?: React.ReactNode;
  afterTitle?: React.ReactNode;
  editable?: boolean;
  data: T[];
  onRemove: (ids: string[]) => void;
  renderCell: (row: T) => React.ReactNode;
  sx?: SxProps;
  isLoading?: boolean;
}

export default function SearchableTable<T extends TableData>({
  data,
  ...props
}: Props<T>) {
  const [search, setSearch] = useState('');

  const filteredData = data.filter((row) =>
    row.path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack spacing={1}>
      <SearchField value={search} onChange={setSearch} />
      <Table<T> {...props} data={filteredData} />
    </Stack>
  );
}

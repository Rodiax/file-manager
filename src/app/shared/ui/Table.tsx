import { useState } from 'react';
import { alpha, SxProps } from '@mui/material/styles';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableContainer,
  TableHead as TableHeadComponent,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  Tooltip,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import LoadingPlaceholder from './LoadingPlaceholder';

type TableData = {
  id: string;
};
interface Props<T> {
  title: string;
  title2?: React.ReactNode;
  afterTitle?: React.ReactNode;
  editable?: boolean;
  data: (TableData & T)[];
  onRemove: (ids: TableData['id'][]) => void;
  renderCell: (row: TableData & T) => React.ReactNode;
  sx?: SxProps;
  isLoading?: boolean;
}

export default function Table<T>({
  data,
  title,
  title2,
  afterTitle,
  editable = true,
  onRemove,
  renderCell,
  sx,
  isLoading,
}: Props<T>) {
  const [selectedRows, setSelectedRows] = useState<TableData['id'][]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked?: boolean
  ) => {
    if (!editable || !isEditing) {
      return;
    }

    if (event?.target.checked ?? checked) {
      const newSelected = data.map((n) => n.id);
      setSelectedRows(newSelected);
      return;
    }
    setSelectedRows([]);
  };

  const handleClick = (
    event: React.MouseEvent<unknown>,
    id: TableData['id']
  ) => {
    if (!editable || !isEditing) {
      return;
    }

    const selectedIndex = selectedRows.indexOf(id);
    let newSelectedRow: TableData['id'][] = [];

    if (selectedIndex === -1) {
      newSelectedRow = newSelectedRow.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelectedRow = newSelectedRow.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelectedRow = newSelectedRow.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedRow = newSelectedRow.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }
    setSelectedRows(newSelectedRow);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setSelectedRows([]);
  };

  const removeSelectedRows = () => {
    onRemove(selectedRows);
    setSelectedRows([]);
  };

  return (
    <Paper
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...sx,
      }}
      elevation={3}
    >
      <TableToolbar
        selectedRows={selectedRows}
        title={title}
        title2={title2}
        afterTitle={afterTitle}
        removeSelectedRows={removeSelectedRows}
      />
      <TableContainer sx={{ height: '100%' }}>
        <TableComponent size="medium" stickyHeader>
          {editable && (
            <TableHead
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              numSelected={selectedRows.length}
              onSelectAllClick={handleSelectAllClick}
              onCancelEdit={onCancelEdit}
              rowCount={data.length}
            />
          )}
          <TableBody>
            {data.map((row) => (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row.id)}
                role="checkbox"
                tabIndex={-1}
                key={row.id}
                selected={selectedRows.includes(row.id)}
                sx={{ cursor: 'pointer' }}
              >
                {editable && isEditing && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedRows.includes(row.id)}
                    />
                  </TableCell>
                )}
                <TableCell
                  component="th"
                  scope="row"
                  padding={editable && isEditing ? 'none' : 'normal'}
                >
                  {renderCell(row)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableComponent>
      </TableContainer>
      {isLoading && <LoadingPlaceholder />}
    </Paper>
  );
}

interface TableHeadProps {
  numSelected: number;
  rowCount: number;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onCancelEdit: () => void;
  onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked?: boolean
  ) => void;
}
function TableHead({
  onSelectAllClick,
  onCancelEdit,
  numSelected,
  rowCount,
  isEditing,
  setIsEditing,
}: TableHeadProps) {
  const checked = rowCount > 0 && numSelected === rowCount;

  if (!isEditing) {
    return (
      <TableHeadComponent>
        <TableRow>
          <TableCell padding="checkbox" sx={{ pl: 1 }}>
            <Button variant="text" onClick={() => setIsEditing(true)}>
              Upravit
            </Button>
          </TableCell>
        </TableRow>
      </TableHeadComponent>
    );
  }

  return (
    <TableHeadComponent>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={checked}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        <TableCell padding="none">
          <Stack
            justifyContent="space-between"
            alignItems="center"
            flexDirection="row"
            sx={{ pr: 1 }}
          >
            <Button
              variant="text"
              onClick={() => onSelectAllClick(null, !checked)}
            >
              {checked ? 'Zrušit výběr' : 'Vybrat vše'}
            </Button>
            <Button variant="text" onClick={() => onCancelEdit()}>
              Zrušit
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    </TableHeadComponent>
  );
}

interface TableToolbarProps {
  title: string;
  title2?: React.ReactNode;
  afterTitle?: React.ReactNode;
  selectedRows: TableData['id'][];
  removeSelectedRows: () => void;
}
function TableToolbar({
  selectedRows,
  title,
  title2,
  afterTitle,
  removeSelectedRows,
}: TableToolbarProps) {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { sm: 2 },
        },
        selectedRows.length > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {selectedRows.length > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selectedRows.length} Vybráno
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h5" component="div">
          {title} {afterTitle}
        </Typography>
      )}
      {selectedRows.length > 0 ? (
        <Tooltip title="Odebrat">
          <IconButton onClick={() => removeSelectedRows()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        title2 && (
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            {title2}
          </Typography>
        )
      )}
    </Toolbar>
  );
}

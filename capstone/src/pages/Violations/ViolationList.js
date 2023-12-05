import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const columns = [
  { id: 'icon', label: 'Icon', minWidth: 50 },
  { id: 'violation', label: 'Violation', minWidth: 150 },
  { id: 'totalprice', label: 'Price', minWidth: 130, align: 'justify' },
  { id: 'edit', label: 'Edit', minWidth: 50 },
];

function createData(violation, icon, totalprice) {
  return { violation, icon, totalprice };
}

const initialRows = [
  createData(
    'Employing Insolent, Discourteous, or Arrogant Driver',
    <AssessmentIcon />,
    '1500'
  ),
  // Add more rows as needed
];

export default function ViolationList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedViolation, setEditedViolation] = useState({
    violation: '',
    totalprice: '',
  });
  const [dataRows, setDataRows] = useState(initialRows);
  const [uploadedIcon, setUploadedIcon] = useState(null);

  const handleOpenEditDialog = (row) => {
    setSelectedRow(row);
    setEditedViolation({
      violation: row.violation,
      totalprice: row.totalprice,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedRow(null);
    setUploadedIcon(null); // Clear uploaded icon on dialog close
  };

  const handleViolationChange = (event) => {
    const { name, value } = event.target;
    setEditedViolation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (selectedRow) {
      const updatedRow = {
        ...selectedRow,
        violation: editedViolation.violation,
        totalprice: editedViolation.totalprice,
        icon: uploadedIcon || selectedRow.icon, // Use uploaded icon or previous icon
      };

      const updatedRows = dataRows.map((row) =>
        row === selectedRow ? { ...row, ...updatedRow } : row
      );

      setDataRows(updatedRows);
    } else {
      console.error('No row selected to update.');
    }
    handleCloseEditDialog();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>

<TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'edit' ? (
                            <button
                              style={{ border: 'none', background: 'none' }}
                              onClick={() => handleOpenEditDialog(row)}
                            >
                              <EditIcon />
                            </button>
                          ) : column.id === 'icon' ? (
                            <img
                              src={row.icon}
                              alt="Uploaded Icon"
                              style={{ maxWidth: '50px' }}
                            />
                          ) : column.format && typeof value === 'number' ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={dataRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {selectedRow && (
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Violation</DialogTitle>
          <DialogContent>
            <TextField
              label="Violation Name"
              name="violation"
              value={editedViolation.violation}
              onChange={handleViolationChange}
              fullWidth
              margin="normal"
            />
            {/* Displaying the uploaded icon or default icon */}
            {uploadedIcon ? (
              <img
                src={uploadedIcon}
                alt="Uploaded Icon"
                style={{ maxWidth: '50px' }}
              />
            ) : (
              <img
                src={selectedRow.icon}
                alt="Default Icon"
                style={{ maxWidth: '50px' }}
              />
            )}
            {/* File input for icon upload */}
            <input
              type="file"
              onChange={handleIconUpload}
              accept="image/*"
            />
            <TextField
              label="Total Price"
              name="totalprice"
              value={editedViolation.totalprice}
              onChange={handleViolationChange}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleSaveChanges}>Save Changes</Button>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  );
}

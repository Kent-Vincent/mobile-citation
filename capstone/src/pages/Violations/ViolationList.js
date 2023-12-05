import React, { useState, useEffect } from 'react';
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
import Loading from '../Loading';
import { ref, onValue, getDatabase } from 'firebase/database';

const columns = [
  { id: 'icon', label: 'Icon', minWidth: 30 },
  { id: 'violation', label: 'Violation', minWidth: 100 },
  { id: 'totalprice', label: 'Price', minWidth: 80, align: 'justify' },
  { id: 'edit', label: 'Edit', minWidth: 30 },
];

function createData(violation, iconUrl, totalprice) {
  return { violation, iconUrl, totalprice };
}

export default function ViolationList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedViolation, setEditedViolation] = useState({
    violation: '',
    totalprice: '',
  });
  const [dataRows, setDataRows] = useState([]);
  const [uploadedIcon, setUploadedIcon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const database = getDatabase();
    const violationsRef = ref(database, 'violations');

    onValue(violationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const violationData = Object.entries(data).map(([key, value]) =>
          createData(value.Name, value.IconForViolationUrl, value.Price)
        );
        setDataRows(violationData);
        setLoading(false);
      }
    });
  }, []);

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
    setUploadedIcon(null);
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
        icon: uploadedIcon || selectedRow.icon,
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
    <div style={{ position: 'relative', margin: '20px' }}>
      {loading && (
        <Loading
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        />
      )}
      {!loading && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <>
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
                                  <>
                                    {row.iconLoading ? (
                                      <LoadingIcon />
                                    ) : (
                                      <img
                                        src={row.iconUrl}
                                        alt={`Icon for ${row.violation}`}
                                        style={{ maxWidth: '50px' }}
                                        onLoad={() => {
                                          setDataRows((prevRows) =>
                                            prevRows.map((prevRow) =>
                                              prevRow === row ? {...prevRow, iconLoading: false } : prevRow
                                            )
                                          );
                                        }}
                                        onError={() => {
                                          setDataRows((prevRows) =>
                                          prevRows.map((prevRow) =>
                                            prevRow === row ? {...prevRow, iconLoading: false } :prevRow
                                            )
                                          );
                                        }}
                                      />
                                    )}
                                  </>
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
          </>
        </Paper>
      )}
    </div>
  );
}
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Loading from '../Loading';
import AddViolation from './addViolation';
import EditViolation from './editViolation';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogActions from '@mui/material/DialogActions';
import { ref, onValue, getDatabase, remove } from 'firebase/database';

const columns = [
  { id: 'icon', label: 'Icon', minWidth: 30 },
  { id: 'violation', label: 'Violation', minWidth: 100 },
  { id: 'totalprice', label: 'Price', minWidth: 80, align: 'justify' },
  { id: 'edit', label: 'Edit', minWidth: 30 },
  { id: 'delete', label: 'Delete', minWidth: 30 },
];

function createData(violation, iconUrl, totalprice, locationId) {
  return { violation, iconUrl, totalprice, locationId };
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
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetRow, setDeleteTargetRow] = useState(null);

  useEffect(() => {
    const database = getDatabase();
    const violationsRef = ref(database, 'violations');

    onValue(violationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const violationData = Object.entries(data).map(([key, value]) =>
        createData(value.Name, value.IconForViolationUrl, value.Price, key)
        );
        setDataRows(violationData);
        setLoading(false);
      }
    });
  }, []);

  const handleDelete = (locationId) => {
    const rowToDelete = dataRows.find((row) => row.locationId === locationId);
    if (rowToDelete) {
      setDeleteTargetRow(rowToDelete);
      setDeleteDialogOpen(true);
    }
  };

  const handleOpenDeleteDialog = (row) => {
    setDeleteTargetRow(row);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteTargetRow(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetRow) {
      const database = getDatabase();
      const violationRef = ref(database, `violations/${deleteTargetRow.locationId}`);
      remove(violationRef)
        .then(() => {
          // Handle success, close the dialog, and update the UI if needed
          handleCloseDeleteDialog();
        })
        .catch((error) => {
          // Handle error, log or show an error message
          console.error('Error deleting violation:', error);
          handleCloseDeleteDialog();
        });
    }
  };

  const handleOpenAddDialog = () => {
    if (!loading) {
      setOpenAddDialog(true);
    }
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (row) => {
    setSelectedRow(row);
    setEditedViolation({
      violation: row.violation,
      totalprice: row.totalprice,
    });
    setUploadedIcon(row.iconUrl);
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
            {/* Other JSX code... */}

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
                                ) : column.id === 'delete' ? (
                                  <button
                                    style={{ border: 'none', background: 'none' }}
                                    onClick={() => handleOpenDeleteDialog(row)}
                                  >
                                    <DeleteIcon />
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
                                              prevRow === row ? { ...prevRow, iconLoading: false } : prevRow
                                            )
                                          );
                                        }}
                                        onError={() => {
                                          setDataRows((prevRows) =>
                                            prevRows.map((prevRow) =>
                                              prevRow === row ? { ...prevRow, iconLoading: false } : prevRow
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
              <EditViolation
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                selectedRow={selectedRow}
                handleSaveChanges={handleSaveChanges}
                handleViolationChange={handleViolationChange}
                uploadedIcon={uploadedIcon}
                handleIconUpload={handleIconUpload}
                locationId={selectedRow.locationId}
              />
            )}

            <Dialog
              open={deleteDialogOpen}
              onClose={handleCloseDeleteDialog}
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-description"
            >
              <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <p>Are you sure you want to delete this violation?</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="primary">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </Paper>
      )}
    </div>
  );
}
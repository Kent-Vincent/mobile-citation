import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Loading from '../Loading';
import { getDatabase, ref, push, set, onValue, remove } from 'firebase/database';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const columns = [
  { id: 'Name', label: 'Name', minWidth: 150 },
  { id: 'Email', label: 'Email', minWidth: 200 },
  { id: 'AccountType', label: 'Account Type', minWidth: 150 },
  { id: 'delete', minWidth: 150 },
];

function createData(Name, Email, AccountType, key) {
  return { Name, Email, AccountType, key };
}

export default function TransactionList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [AccountType, setAccountType] = useState('');

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const addItem = () => {
    const newItem = createData(Name, Email, AccountType);

    const database = getDatabase();
    const usersRef = ref(database, 'users');

    push(usersRef, newItem)
      .then((newRef) => {
        setItems([...items, { ...newItem, key: newRef.key }]);
        setName('');
        setEmail('');
        setAccountType('');
        handleClose();
      })
      .catch((error) => {
        console.error('Error adding item to Firebase:', error);
      });
  };

  useEffect(() => {
    const database = getDatabase();
    const usersRef = ref(database, 'users');

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userData = Object.entries(data).map(([key, { Name, Email, AccountType }]) =>
          createData(Name, Email, AccountType, key)
        );
        setItems(userData);
        setLoading(false);
      }
    });
  }, []);

  const handleDelete = (index) => {
    const itemToDelete = items[index + page * rowsPerPage];
    if (itemToDelete) {
      const database = getDatabase();
      const usersRef = ref(database, `users/${itemToDelete.key}`);
      remove(usersRef)
        .then(() => {
          const updatedItems = items.filter((_, idx) => idx !== index + page * rowsPerPage);
          setItems(updatedItems);
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
        });
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Paper sx={{ width: '80%', overflow: 'hidden', marginLeft: '150px' }}>
          <TableContainer sx={{ maxHeight: 'calc(50vh - 50px)' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <Button variant="contained" color="primary" onClick={handleClickOpen}>
                      Add Account
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.id === 'name' ? 'justify' : 'left'}
                      style={{
                        minWidth: column.minWidth,
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        maxWidth: '200px',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.id === 'name' ? 'justify' : 'left'}
                          style={{
                            minWidth: column.minWidth,
                            whiteSpace: 'nowrap',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {column.id === 'delete' ? (
                            <>
                              {row[column.id]}
                              <IconButton onClick={() => handleDelete(index)} aria-label="delete" style={{ color: 'red' }}>
                                <DeleteIcon />
                              </IconButton>
                            </>
                          ) : (
                            row[column.id]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={items.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '15px',
            backgroundColor: '#FFF',
            color: '',
          },
        }}
      >
        <DialogTitle>Add New Account</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Account Type</InputLabel>
            <Select
              value={AccountType}
              onChange={(e) => setAccountType(e.target.value)}
              label="Account Type"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                },
              }}
            >
              <MenuItem value="officer">Officer</MenuItem>
              <MenuItem value="treasurer">Treasurer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addItem} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'password', label: 'Password' },
  ];

function createData(name, email, password) {
    return { name, email, password };
  }

  export default function TransactionList() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [items, setItems] = useState([
      createData('Kent Sarsalejo', 'admin@gmail.com'),
    ]);
  
    const [openDialog, setOpenDialog] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
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
      setItems([...items, createData(name, email, password)]);
      setName('');
      setEmail('');
      setPassword('');
      handleClose(); // Close the dialog after adding an item
    };

    return (
        <>
          <Paper sx={{ width: '80%', overflow: 'hidden', marginLeft: '150px' }}>

          <TableContainer sx={{ maxHeight: 'calc(100vh - 100px)' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Item
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, whiteSpace: 'nowrap', fontWeight: 'bold' }}
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
                      <TableCell key={column.id} align={column.align}>
                        {row[column.id]}
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

      <Dialog
        open={openDialog}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '15px',
            backgroundColor: '#fff',
            color: '',
          },
        }}
      >

<DialogTitle>Add New Item</DialogTitle>
        <DialogContent >
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}

            InputProps={{
                sx: {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'red', // Change this to your preferred color
                    },
                    '&:hover fieldset': {
                      borderColor: 'green', // Change this to the hover color
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'blue', // Change this to the focused color
                    },
                    borderRadius: '30px',
                  },
                },
              }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

  
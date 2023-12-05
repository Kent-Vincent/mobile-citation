  import React, { useState, useEffect } from 'react';
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
  import {ref, onValue, getDatabase } from 'firebase/database';

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    ];

    function createData(name, email) {
      return { name, email };
    }

    export default function TransactionList() {
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
      const [items, setItems] = useState([]);
    
      const [openDialog, setOpenDialog] = useState(false);
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
    
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
        setItems([...items, createData(name, email)]);
        setName('');
        setEmail('');
        handleClose();
      };
    
      useEffect(() => {
        const database = getDatabase();
        const usersRef = ref(database, 'users');
    
        onValue(usersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const userData = Object.values(data).map(({ Name, Email }) => createData(Name, Email));
            setItems(userData);
          }
        });
      }, []);
    
      return (
        <>
          <Paper sx={{ width: '80%', overflow: 'hidden', marginLeft: '150px' }}>
            <TableContainer sx={{ maxHeight: 'calc(50vh - 50px)' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <Button variant="contained" color="primary" onClick={handleClickOpen}>
                        Add Item
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align === 'name' ? 'justify' : 'left' }
                        style={{
                          minWidth: column.minWidth,
                          whiteSpace: 'nowrap',
                          fontWeight: 'bold',
                          maxWidth: '150px', // Set maximum width for smaller table
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
                            align={column.align === 'name' ? 'justify' : 'left'} // Align text to justify for 'name' column
                            style={{
                              maxWidth: '150px', // Set maximum width for smaller table
                              whiteSpace: 'pre-wrap',
                            }}
                          >
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
                backgroundColor: '#FFF',
                color: '',
              },
            }}
          >
            <DialogTitle>Add New Account</DialogTitle>
            <DialogContent>
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
                        borderColor: 'red',
                      },
                      '&:hover fieldset': {
                        borderColor: 'green',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'blue',
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
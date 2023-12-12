import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Loading from '../Loading';
import { ref, onValue, getDatabase } from 'firebase/database';

const columns = [
  { id: 'Name', label: 'Name of Violator', minWidth: 150 },
  { id: 'LicenseNumber', label: 'License Number', minWidth: 100 },
  { id: 'PlateNumber', label: 'Plate Number', minWidth: 100, align: 'left' },
  { id: 'Location', label: 'Location', minWidth: 100, align: 'justify' },
  { id: 'OR', label: 'OR Number', minWidth: 130, align: 'justify', format: (value) => value.toFixed(2) },
  { id: 'CER', label: 'CR Number', minWidth: 130, align: 'justify', format: (value) => value.toFixed(2) },
  { id: 'TotalPrice', label: 'Total Price', minWidth: 130, align: 'justify', format: (value) => value.toFixed(2) },
  { id: 'Violation', label: 'Violation', minWidth: 150, align: 'left', format: (value) => value.toFixed(2) },
  { id: 'Status', label: 'Status', minWidth: 100, align: 'justify', format: (value) => value.toFixed(2) },
];

export default function TransactionList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const database = getDatabase();

    const fetchData = async () => {
      const dataRef = ref(database, 'uploads/Information');

      try {
        onValue(dataRef, (snapshot) => {
          const data = snapshot.val();

          if (data) {
            const newData = Object.values(data).flatMap((innerData) =>
              Object.values(innerData)
            );
            console.log('Fetched Data: ', newData);
            setRows(newData);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error setting up data listener:', error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup logic if needed
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && (
        <Loading
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
            zIndex: 1,
          }}
        />
      )}
      {!loading && (
        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TableContainer sx={{ width: '100%', maxHeight: 'calc(100vh - 250px)' }}>
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
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const violationText = row['Violation'].replace(/\\\\n/g, '<br />');


                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          if (column.id === 'Violation') {
                            return (
                              <TableCell key={column.id} align={column.align}>
  <div dangerouslySetInnerHTML={{ __html: violationText }} />
</TableCell>
                            );
                          } else if (column.id === 'Status') {
                            const statusColor = row[column.id] === 'Paid' ? 'green' : 'red';
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <button
                                  style={{
                                    backgroundColor: statusColor,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                  }}
                                >
                                  {row[column.id]}
                                </button>
                              </TableCell>
                            );
                          } else {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          }
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
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  );
}
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'name', label: 'Name of Violator', minWidth: 150 },
  { id: 'licensenum', label: 'License Number', minWidth: 100 },
  {
    id: 'platenum',
    label: 'Plate Number',
    minWidth: 100,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'location',
    label: 'Location',
    minWidth: 100,
    align: 'justify',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'officialreceipt',
    label: 'OR Number',
    minWidth: 130,
    align: 'justify',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'cert',
    label: 'CR Number',
    minWidth: 130,
    align: 'justify',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'totalprice',
    label: 'Total Price',
    minWidth: 130,
    align: 'justify',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'violation',
    label: 'Violation',
    minWidth: 150,
    align: 'left',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    align: 'justify',
    format: (value) => value.toFixed(2),
  },

];

function createData(name, licensenum, platenum, location,officialreceipt,cert,totalprice,violation,status) {
  return { name, licensenum, platenum, location,officialreceipt,cert,totalprice,violation,status};
}

const rows = [
  createData('Kent Sarsalejo','L02-91-072167','LTO-3456','500 Don Julian Rodriguez Sr. Ave, Talomo, Davao City, Davao del Sur, Philippines','736462272','1478912789','1500','Employing Insolent, Discourteous, or Arrogant Driver','Paid'),
  
  
];

export default function TransactionList() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
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
                    style={{ minWidth: column.minWidth, fontWeight:'bolder'}}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        if (column.id === 'status') {
                          // Custom rendering for 'Status' column
                          const statusColor = row[column.id] === 'Paid' ? 'green' : 'red';
  
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <button
                                style={{ backgroundColor: statusColor, color: 'white', border: 'none', borderRadius:'10px' }}
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
    );
  }
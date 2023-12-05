  import * as React from 'react';
  import { TableCell, TableRow, Box, Collapse, IconButton, Typography } from '@mui/material';
  import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
  import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
  import TableContainer from '@mui/material/TableContainer';
  import TableBody from '@mui/material/TableBody';
  import TableHead from '@mui/material/TableHead';
  import Paper from '@mui/material/Paper';
  import Table from '@mui/material/Table';
  import PropTypes from 'prop-types';

  function createData(name, timeanddate, location, licensenumber, platenumber, violation) {
      return {
        name,
        timeanddate,
        licensenumber,
        location,
        platenumber,
        violation,
      };
    }
    
    function CollapsibleRow({ rows }) {
      const [open, setOpen] = React.useState({});
    
      const groupedRows = rows.reduce((acc, row) => {
        const existingRow = acc.find((item) => item.name === row.name);
        if (existingRow) {
          const existingViolation = existingRow.violations.find(
            (violation) => violation.violation === row.violation
          );
          if (existingViolation) {
            existingViolation.count += 1;
            existingViolation.timeanddate.push(row.timeanddate);
            existingViolation.location.push(row.location);
          } else {
            existingRow.violations.push({
              ...row,
              count: 1,
              timeanddate: [row.timeanddate],
              location: [row.location],
            });
          }
        } else {
          acc.push({ name: row.name, licensenumber: row.licensenumber, platenumber: row.platenumber, violations: [{ ...row, count: 1, timeanddate: [row.timeanddate], location: [row.location] }] });
        }
        return acc;
      }, []);
    
      const toggleRow = (name) => {
        setOpen((prevState) => ({
          ...prevState,
          [name]: prevState[name] ? !prevState[name] : true,
        }));
      };
    
      return (
        <>
          {groupedRows.map((groupedRow, index) => (
            <React.Fragment key={index}>
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => toggleRow(groupedRow.name)}
                  >
                    {open[groupedRow.name] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {groupedRow.name}
                </TableCell>
                <TableCell style={{ width: '30%', paddingLeft: '4px' }}>{groupedRow.licensenumber}</TableCell>
                <TableCell style={{ width: '30%', paddingLeft: '4px' }}>{groupedRow.platenumber}</TableCell>
              </TableRow>
              {open[groupedRow.name] && (
                <TableRow>
                  <TableCell style={{ paddingRight: '2px', paddingLeft:'1',paddingBottom: 20, paddingTop: 2 }} colSpan={7}>
                    <Collapse in={open[groupedRow.name]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                      <Typography variant="h6" gutterBottom component="div" fontWeight="bold">
                        Violation History
                      </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                            <TableCell style={{ width: '25%' }}>Time and Date</TableCell>
  <TableCell style={{ width: '30%' }}>Violation</TableCell>
  <TableCell style={{ width: '30%' }}>Location</TableCell>
  <TableCell align="center" style={{ width: '40%' }}>Repetition</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {groupedRow.violations.map((violation, idx) => (
                              <TableRow key={idx}>
                                <TableCell component="th" scope="row">
                                  {violation.timeanddate.join(', ')}
                                </TableCell>
                                <TableCell>{violation.violation}</TableCell>
                                <TableCell>{violation.location.join(', ')}</TableCell>
                                <TableCell align="center">{violation.count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </>
      );
    }
    
    CollapsibleRow.propTypes = {
      rows: PropTypes.array.isRequired,
    };
    
    export default function CollapsibleTable() {
      const rows = [
        createData('Kent Sarsalejo', '2022-12-05', '500 Don Julian Rodriguez Sr. Ave, Talomo, Davao City, Davao del Sur, Philippines', 'L02-91-072167', 'LTO-3456', 'Speeding'),
        createData('Kent Sarsalejo', '2022-12-06', '500 Don Julian Rodriguez Sr. Ave, Talomo, Davao City, Davao del Sur, Philippines', 'L02-91-072167', 'LTO-3456', 'Speeding'),
        createData('Kent Sarsalejo', '2022-12-06', '500 Don Julian Rodriguez Sr. Ave, Talomo, Davao City, Davao del Sur, Philippines', 'L02-91-072167', 'LTO-3456', 'Employing Insolent, Discourteous, or Arrogant Driver'),
        createData('Jas Villanueva', '2022-12-25', '500 Don Julian Rodriguez Sr. Ave, Talomo, Davao City, Davao del Sur, Philippines', 'A12-34-567890', 'ABC-1234', 'Speeding'),
        createData('Jas Villanueva', '2022-12-30', '500 Don Julian Rodriguez Sr. Ave, Talomo, Davao City, Davao del Sur, Philippines', 'A12-34-567890', 'ABC-1234', 'Speeding'),
        createData('Jas Villanueva', '2022-12-25', '500 Don Julian Rodriguez Sr. Ave, Talomo, Davao City, Davao del Sur, Philippines', 'A12-34-567890', 'ABC-1234', 'Careless Driving'),
      ];
    
      return (
        <TableContainer component={Paper} sx={{ width: '100%' , justifyContent: 'center' }}>
          <Table aria-label="collapsible table">
          <TableHead>
  <TableRow>
    <TableCell style={{ width: '5%' }} />
    <TableCell style={{ width: '30%', paddingLeft: '4px' }}>
      <Typography variant="body1" fontWeight="bold">Name of Violator</Typography>
    </TableCell>
    <TableCell align="left" style={{ width: '30%', paddingLeft: '4px' }}>
      <Typography variant="body1" fontWeight="bold">License Number</Typography>
    </TableCell>
    <TableCell align="left" style={{ width: '30%', paddingLeft: '4px' }}>
      <Typography variant="body1" fontWeight="bold">Plate Number</Typography>
    </TableCell>
  </TableRow>
</TableHead>
            <TableBody>
              <CollapsibleRow rows={rows} />
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    
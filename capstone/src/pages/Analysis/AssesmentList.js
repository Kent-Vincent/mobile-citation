import React, { useState, useEffect } from 'react';
import {
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  TableBody,
  Table,
  Typography,
  Paper,
  Collapse,
  IconButton,
} from '@mui/material';
import { ref, onValue, getDatabase } from 'firebase/database';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ViolationsTable = ({ violations, isExpanded }) => {
  return (
    <Collapse in={isExpanded && violations.length > 0}>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell>Violations</TableCell>
            <TableCell>Date and Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {violations.map((violation, index) => (
            <TableRow key={index}>
              <TableCell>
                {violation.Violation.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </TableCell>
              <TableCell>{violation.DateAndTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Collapse>
  );
};

const AssessmentList = () => {
  const [rows, setRows] = useState([]);
  const [repetitionCount, setRepetitionCount] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const database = getDatabase();

    const fetchData = async () => {
      const dataRef = ref(database, 'uploads/Information');
      
      try {
        onValue(dataRef, (snapshot) => {
          const data = snapshot.val();
      
          if (data) {
            const uniqueRows = new Set();
            const countMap = {};
      
            Object.values(data).forEach((innerData) => {
              Object.values(innerData).forEach((row) => {
                const uniqueKey = `${row.Name}-${row.LicenseNumber}-${row.PlateNumber}`;
                uniqueRows.add(uniqueKey);
      
                // Count repetitions
                countMap[uniqueKey] = (countMap[uniqueKey] || 0) + 1;
      
                row.Violation = row.Violation.replace(/\\\\n/g, '\n');
              });
            });
      
            const newData = Array.from(uniqueRows).map((uniqueKey) => {
              const [Name, LicenseNumber, PlateNumber] = uniqueKey.split('-');
              return {
                Name,
                LicenseNumber,
                PlateNumber,
                Violations: Object.values(data).flatMap((innerData) =>
                  Object.values(innerData).filter(
                    (innerRow) =>
                      innerRow.Name === Name &&
                      innerRow.LicenseNumber === LicenseNumber &&
                      innerRow.PlateNumber === PlateNumber
                  )
                ),
              };
            });
      
            console.log('Fetched Data: ', newData);
            setRows(newData);
            setRepetitionCount(countMap);
            setSelectedRow(null);
          }
        });
      } catch (error) {
        console.error('Error setting up data listener:', error);
      }
    };    

    fetchData();

    return () => {
      // Cleanup logic if needed
    };
  }, []);

  const handleRowToggle = (uniqueKey) => {
    setSelectedRow(selectedRow === uniqueKey ? null : uniqueKey);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>License Number</TableCell>
            <TableCell>Plate Number</TableCell>
            <TableCell>Repetition Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleRowToggle(`${row.Name}-${row.LicenseNumber}-${row.PlateNumber}`)}
                  >
                    {selectedRow === `${row.Name}-${row.LicenseNumber}-${row.PlateNumber}` ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{row.Name}</TableCell>
                <TableCell>{row.LicenseNumber}</TableCell>
                <TableCell>{row.PlateNumber}</TableCell>
                <TableCell>{repetitionCount[`${row.Name}-${row.LicenseNumber}-${row.PlateNumber}`]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5}>
                  <ViolationsTable
                    violations={row.Violations}
                    isExpanded={selectedRow === `${row.Name}-${row.LicenseNumber}-${row.PlateNumber}`}
                  />
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssessmentList;

import React from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../Dashboard';
import Toolbar from '@mui/material/Toolbar';
import ViolationList from './ViolationList';
import Navbar from '../Navbar';

export default function Violation() {
  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', marginLeft: '-50px' }}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
          <Toolbar />
          <h1 style={{ margin: '15px 0', color: '#00425A', fontWeight: 'bold' }}>Violations</h1>
          <ViolationList />
        </Box>
      </Box>
    </>
  );
}

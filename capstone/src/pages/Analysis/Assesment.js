import React from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../Dashboard';
import Toolbar from '@mui/material/Toolbar';
import AssesmentList from './AssesmentList';
import Navbar from '../Navbar';

export default function Assesment() {
  return (
    <>
    <Navbar />
      <Box sx={{ display: 'flex', marginLeft: '-50px' }}>
        <Dashboard />  
        <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
          <Toolbar />
          <AssesmentList />
        </Box>
      </Box>
    </>
  );
}

import React from 'react'
import Box from '@mui/material/Box';
import Dashboard from '../../Components/Dashboard/Dashboard';
import Toolbar from '@mui/material/Toolbar';
import Navbar from '../../Components/Navbar';
import TransactionList from './TransactionList';

export default function Transaction() {
  return (
    <>
    <Navbar/>
    <Box sx={{ display: 'flex', marginLeft: '-50px' }}>
        <Dashboard/>  
        <Box component="main"
        sx={{ flexGrow: 1,  p: 1 }}
      >
        <Toolbar />
        <h1 style={{ margin: '15px 0', color:'#00425A' }}>Transaction History</h1>
        <TransactionList/>
      </Box>
    </Box>
    </>
    
  )
}

import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../Dashboard';
import { getAuth, onAuthStateChanged ,signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import app from '../../../firebase';
import Toolbar from '@mui/material/Toolbar';
import Navbar from '../Navbar';
import TransactionList from './TransactionList';

const Transaction = () => {
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', marginLeft: '-50px' }}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
          <Toolbar />
          <h1 style={{ margin: '15px 0', color: '#00425A' }}>Transaction History</h1>
          <TransactionList />
        </Box>
      </Box>
    </>
  );
}

export default Transaction

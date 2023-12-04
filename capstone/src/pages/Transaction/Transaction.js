import Box from '@mui/material/Box';
import Dashboard from '../components/Dashboard';
import Toolbar from '@mui/material/Toolbar';
import Navbar from '../components/Navbar';
import TransactionList from '../components/TransactionList';

export default function Transaction() {
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

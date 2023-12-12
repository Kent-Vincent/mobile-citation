import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import toast, { Toaster } from 'react-hot-toast';


const AddItemForm = ({ addItem }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem({ name, email,accountType });
    setName('');
    setEmail('');
    setAccountType('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Account Type</InputLabel>
            <Select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              label="Account Type"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                },
              }}
            >
              <MenuItem value="Officer">Officer</MenuItem>
              <MenuItem value="Treasurer">Treasurer</MenuItem>
            </Select>
          </FormControl>
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Add
      </Button>
    </form>
  );
};

export default AddItemForm;
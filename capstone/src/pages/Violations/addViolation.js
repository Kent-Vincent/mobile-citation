import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import toast, { Toaster } from 'react-hot-toast';

export default function AddViolation({ open, onClose }) {
  const [newViolation, setNewViolation] = useState({
    icon: null,
    violation: '',
    price: '',
  });

  const handleViolationChange = (event) => {
    const { name, value } = event.target;
    setNewViolation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewViolation((prev) => ({
          ...prev,
          icon: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddViolation = () => {
    // Check if any of the fields are empty
    if (!newViolation.violation || !newViolation.price || !newViolation.icon) {
      toast.error('Please fill in all fields.');
      return;
    }
  
    // Handle adding violation to the database (you can implement this later)
    // For now, just log the new violation details
    console.log('New Violation:', newViolation);
  
    // Clear the form
    setNewViolation({
      icon: null,
      violation: '',
      price: '',
    });
  
    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Violation</DialogTitle>
      <DialogContent>
        <label htmlFor="icon-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CloudUploadIcon style={{ fontSize: 48, marginBottom: 8 }} />
          <span>Browse files to upload</span>
        </label>
        <input
          type="file"
          id="icon-upload"
          style={{ display: 'none' }}
          onChange={handleIconUpload}
          accept="image/*"
        />
        {newViolation.icon && (
          <img
            src={newViolation.icon}
            alt="Uploaded Icon"
            style={{ maxWidth: '50px', margin: '16px auto', display: 'block' }}
          />
        )}

        <TextField
          label="Violation Name"
          name="violation"
          value={newViolation.violation}
          onChange={handleViolationChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Total Price"
          name="price"
          value={newViolation.price}
          onChange={handleViolationChange}
          fullWidth
          margin="normal"
        />
        <Button
          onClick={handleAddViolation}
          style={{ float: 'right' }}
        >
          Add Violation
        </Button>
        <Button
          onClick={onClose}
          style={{ float: 'right' }}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}

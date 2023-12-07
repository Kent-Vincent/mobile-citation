import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import toast from 'react-hot-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, set, push} from 'firebase/database';

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
      try {
        setNewViolation((prev) => ({
          ...prev,
          icon: file,
        }));
      } catch (error) {
        console.error('Error reading the file:', error);
      }
    }
  };

  const handleBoxClick = (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('icon-upload');
    fileInput.focus();
    fileInput.click();
  };

  const uploadImageToStorage = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/icon for violations/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleAddViolation = async () => {
    const db = getDatabase();
  
    if (!newViolation.violation || !newViolation.price || !newViolation.icon) {
      if (!newViolation.violation) {
        toast.error('Please Input A Violation.');
      } else if (!newViolation.price) {
        toast.error('Please Input A Price.');
      } else if (!newViolation.icon) {
        toast.error('Please Input An Icon.');
      } else {
        toast.error('Please fill in all fields.');
      }
      return;
    }
  
    try {
      const imageUrl = await uploadImageToStorage(newViolation.icon);
  
      const newViolationData = {
        IconForViolationUrl: imageUrl,
        Name: newViolation.violation,
        Price: newViolation.price,
        SortOrder: 1,
      };
  
      const newViolationRef = push(dbRef(db, 'violations'));
      await set(newViolationRef, newViolationData);
  
      toast.success('Violation added successfully.');
      console.log('New Violation:', newViolation);
  
      setNewViolation({
        icon: null,
        violation: '',
        price: '',
      });
  
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Violation</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px',
              cursor: 'pointer',
            }}
            onClick={handleBoxClick}
          >
            {newViolation.icon ? (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={newViolation.icon instanceof File ? URL.createObjectURL(newViolation.icon) : newViolation.icon}
                  alt="Uploaded Icon"
                  style={{ maxWidth: '50px', display: 'block', margin: '0 auto' }}
                />
                {newViolation.icon && <span>Change Photo</span>}
              </div>
            ) : (
              <label htmlFor="icon-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CloudUploadIcon style={{ fontSize: 48, marginBottom: 8 }} />
                {!newViolation.icon && <span>Browse files to upload</span>}
              </label>
            )}
          </div>
          <input
            type="file"
            id="icon-upload"
            style={{ display: 'none' }}
            onChange={handleIconUpload}
            accept="image/*"
          />
        </div>

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
        <Button onClick={handleAddViolation} style={{ float: 'right' }}>
          Add Violation
        </Button>
        <Button
          onClick={() => {
            setNewViolation({
              icon: null,
              violation: '',
              price: '',
            });
            onClose();
          }}
          style={{ float: 'right' }}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}

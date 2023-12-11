import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ChangeCircleRoundedIcon from '@mui/icons-material/ChangeCircleRounded';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, update } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';

const EditViolation = ({
  open,
  onClose,
  selectedRow,
  handleViolationChange,
  dataRows,
  setDataRows,
  locationId,
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadedIcon, setUploadedIcon] = useState(null);
  const [editedViolation, setEditedViolation] = useState({
    violation: selectedRow.violation || '',
    totalprice: selectedRow.totalprice || '',
  });

  const handleBoxClick = (event) => {
    const fileInput = document.getElementById('icon-upload-edit');
    fileInput.click();
  };

  const handleUpload = async (event) => {
    setLoading(true);
    try {
      const file = event.target.files[0];
  
      if (file) {
        
        const storage = getStorage();
        const uniqueIdentifier = Date.now();
        const storageReference = storageRef(
          storage,
          `uploads/icon for violations/${file.name}_${uniqueIdentifier}`
        );
  
        await uploadBytes(storageReference, file);
  
        const downloadURL = await getDownloadURL(storageReference);
  
        setUploadedIcon(downloadURL);
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const db = getDatabase();

      if (selectedRow && locationId) {
        const updatedRow = {
          Name: editedViolation.violation,
          Price: editedViolation.totalprice,
        };

        if (
          (uploadedIcon && selectedRow.IconForViolationUrl !== uploadedIcon) ||
          selectedRow.Name !== updatedRow.Name ||
          selectedRow.Price !== updatedRow.Price
        ) {
          // Add the IconForViolationUrl property with the download URL to updatedRow
          if (uploadedIcon) {
            updatedRow.IconForViolationUrl = uploadedIcon;
          }

          // Update the database with the updatedRow
          const violationReference = dbRef(db, `violations/${locationId}`);
          await update(violationReference, updatedRow);

          toast.success('Successfully Edited!', {
            style: {
              border: '1px solid #00425A',
              background: '#E6D81C',
              padding: '16px',
              color: '#00425A',
            },
            iconTheme: {
              primary: '#00425A',
              secondary: '#FFFAEE',
            },
          }); 
        }

        if (Array.isArray(dataRows)) {
          // Assuming each row has a unique identifier (e.g., ID)
          const updatedRows = dataRows.map((row) =>
            row.locationId === locationId ? { ...row, ...updatedRow } : row
          );

          setDataRows(updatedRows);
        } else {
          console.error('dataRows is not an array:', dataRows);
        }
      } else {
        console.error('No row selected to update or locationId is missing.');
      } 

      onClose();
    } catch (error) {
      toast.error('Error saving changes:', error);
    } 
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Violation</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
          style={{
            border: '1px solid #ccc',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={handleBoxClick}
        >
          {uploadedIcon ? (
            <img
              src={
                uploadedIcon instanceof File
                  ? URL.createObjectURL(uploadedIcon)
                  : uploadedIcon
              }
              alt="Uploaded Icon"
              style={{ maxWidth: '50px' }}
            />
          ) : (
            <>
              {!loading && (
                <div>
                  <ChangeCircleRoundedIcon
                    color="primary"
                    style={{ fontSize: 50, marginBottom: '8px', marginLeft: '13px' }}
                  />
                </div>
              )}
              <div style={{ fontSize: '14px', textAlign: 'center' }}>
                {loading ? <CircularProgress size={20} /> : 'Change Icon'}
              </div>
            </>
          )}
        </div>
          <input
            type="file"
            id="icon-upload-edit"
            style={{ display: 'none' }}
            onChange={handleUpload}
            accept="image/*"
          />
        </div>
        <TextField
          label="Violation Name"
          name="violation"
          value={editedViolation.violation}
          onChange={(e) =>
            setEditedViolation((prev) => ({ ...prev, violation: e.target.value }))
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="totalprice"
          value={editedViolation.totalprice}
          onChange={(e) =>
            setEditedViolation((prev) => ({ ...prev, totalprice: e.target.value }))
          }
          fullWidth
          margin="normal"
        />
        <Button onClick={handleSaveChanges} style={{ float: 'right' }}>
          Save Changes
        </Button>
        <Button
          onClick={() => {
            onClose();
          }}
          style={{ float: 'right' }}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditViolation;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { jwtDecode } from "jwt-decode";
import { Edit } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


interface EditTaskProps {
  task_id: number;
  title: string;
  description: string;
}

interface FormValues {
  title: string;
  description: string;
  taskDate: Date;
}

interface JwtPayload {
  userId: number; 
}

const EditTask: React.FC<EditTaskProps> = ({ task_id, title: initialTitle, description: initialDescription }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({ title: ''});
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem('Token');
  if (!token) throw new Error('No token found');
  const [opena, setOpena] = React.useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleClick = () => {
    setOpena(true);
  };
  const handleClosea = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpena(false);
    setSuccessMessage('');
  };
  const formik = useFormik({
    initialValues: {
      title: initialTitle,
      description: initialDescription,
      userId: 0 // Assuming userId is not editable
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setFormErrors({ title: ''});       
        const decodedToken = jwtDecode(token)as JwtPayload & { userId: number };
        values.userId = decodedToken.userId;

        const response = await axios.put(`http://localhost:3001/tasks/${task_id}`, values, {
          headers: {
            Authorization: token
          }
        });
        setSuccessMessage('Task updated successfully');
        handleClick();
        setTimeout(function () {
          setOpen(false); 
          window.location.reload();
         }, 1200);
      } catch (error: any) {
        console.error("Error:", error);
        setSubmitting(false);
      }
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.title) {
        errors.title = 'Title is required';
      }
      return errors;
    }
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (    
    <div style={{ position: 'fixed', right:'10px'}}>
      <Button  onClick={handleOpen}>
      <Edit sx={{color:'black','&:hover':{color: 'gray'}}}/>      </Button>
      <Dialog open={open} onClose={handleClose}>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={opena}
        autoHideDuration={5000}
        onClose={handleClosea}
      >
        <Alert
          onClose={handleClosea}
          severity="success"
          variant="filled"
          sx={{ width: '100%', backgroundColor:'#FBFBF9', color:'black' ,border: '1px solid darkorange'}}
        >
          {successMessage}
        </Alert>
      </Snackbar>
        <DialogTitle>Edit Task</DialogTitle>
        <form onSubmit={handleSubmit}>
        <DialogContent>
            <TextField
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.title && formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              variant="outlined"
              fullWidth
              required
              margin="normal"
            />
            <TextField
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{backgroundColor: 'gray',color:"white",'&:hover':{
        backgroundColor: 'black',}}}>
            Cancel
          </Button>
          <Button type="submit" sx={{backgroundColor: 'darkorange',color:"white",'&:hover':{
        backgroundColor: 'black'}}}>
            Update Task
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default EditTask;

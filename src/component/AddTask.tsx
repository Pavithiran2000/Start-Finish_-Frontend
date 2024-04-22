import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { jwtDecode } from "jwt-decode";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface FormValues {
  title: string;
  description: string;
  taskDate: string;
}
interface JwtPayload {
  userId: number; 
}

const AddTask: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({ title: '', taskDate: '', description:''});
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
      title: '',
      description: '',
      taskDate: '',
      userId: 0
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        try {
          const decodedToken = jwtDecode(token)as JwtPayload & { userId: number };
          values.userId=decodedToken.userId;
          console.log(values.taskDate);
        } catch (error: any) {
          console.error('Failed to decode token:', error.message);
        }
        console.log(values);
        setFormErrors({ title: '', taskDate: '',description:''});       
        const response = await axios.post('http://localhost:3001/add-task',values);
        setSuccessMessage('Task Add Successfully');
        handleClick();
        setTimeout(function () {
          setOpen(false); 
          window.location.reload();
         }, 1200);
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'Error adding task!';
        console.error("Error:", errorMessage);
        setSubmitting(false);
      }
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.title) {
        errors.title = 'Title is required';
      }
      if (!values.taskDate) {
        errors.taskDate = 'Task date is required';
      }
      else {
        const selectedDate = new Date(values.taskDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          errors.taskDate = 'Can\'t select previous date';
        }
      }
      if (values.description.length > 300) {
        errors.description = 'Description must be maximum 300 characters';
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
<div>
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
<div style={{ position: 'fixed', bottom: '150px', left: '50%', transform: 'translate(-50%, 50%)' }}>
      <Button variant="contained" sx={{backgroundColor: 'darkorange',color:"white",'&:hover':{
        backgroundColor: 'black'}, mt: 10}} onClick={handleOpen}>
        Add Task
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Task</DialogTitle>
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
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.description && formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <label><b>Task Date</b></label>
            <TextField
              id="taskDate"
              name="taskDate"
              type="date"
              placeholder=''
              value={formik.values.taskDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.taskDate && formik.errors.taskDate)}
              helperText={formik.touched.taskDate && formik.errors.taskDate}
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
            Add Task
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
    </div>
  );
};

export default AddTask;

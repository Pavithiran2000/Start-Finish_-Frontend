import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import logo from '../img/logo.png';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import ErrorIcon from '@mui/icons-material/Error';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({ email: ''});
  const [open, setOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setSuccessMessage('');
  };
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setFormErrors({email: '' });
        const response = await axios.post('http://localhost:3001/signup', values);
        setSuccessMessage('Registered Successfully');
        handleClick();
        setTimeout(function() {
          navigate('/signin');
        }, 3000); 

      } catch (error : any) {
        if (error.response) {
          const errorMessage = error.response.data.message || 'Error with SignUp';
          if (errorMessage === 'User already exists!') {
            setFormErrors(prev => ({ ...prev, email: errorMessage}));
          }
        }
        setSubmitting(false);
      } 
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.firstName) {
        errors.firstName = 'First Name is required';
      }
      if (!values.lastName) {
        errors.lastName = 'Last Name is required';
      }
      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      if (!values.phoneNumber) {
        errors.phoneNumber = 'Phone Number is required';
      } else if (!values.phoneNumber.match(/^[0-9]{10}$/)) {
        errors.phoneNumber = 'Invalid phone number';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(values.password)) {
        errors.password = 'Password must be at least 8 characters, include at least one lowercase, uppercase, & number';
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = 'ComfirmPasswords is required';
      }
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      return errors;
    }
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Sign Up</h1>
      <img src={logo} alt="Logo" style={{ height: '200px' }} />
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& .MuiTextField-root': { m: 1.25, width: '30ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <TextField
          id="firstName"
          name="firstName"
          label="First Name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName? <div className='error'><ErrorIcon className='errorIcon' />{formik.touched.firstName && formik.errors.firstName}</div> : null}
          variant="outlined"
          required
        />
        <TextField
          id="lastName"
          name="lastName"
          label="Last Name"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName? <div className='error'><ErrorIcon className='errorIcon' />{formik.touched.lastName && formik.errors.lastName}</div> : null}
          variant="outlined"
          required
        />
        <TextField
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email || formErrors.email)}
          helperText={((formik.touched.email && formik.errors.email) || formErrors.email)? <div className='error'><ErrorIcon className='errorIcon' />{formik.touched.email && formik.errors.email || formErrors.email}</div> : null}
          variant="outlined"
          required
        />
        <TextField
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber? <div className='error'><ErrorIcon className='errorIcon' />{formik.touched.phoneNumber && formik.errors.phoneNumber}</div> : null}
          variant="outlined"
          required
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password? <div className='error'><ErrorIcon className='errorIcon' />{formik.touched.password && formik.errors.password}</div> : null}
          variant="outlined"
          required
          InputProps={{
            endAdornment: (
              <span style={{ cursor: 'pointer' }} onClick={toggleShowPassword}>
                {showPassword ? <EyeOutlined style={{ color: '#007bff' }} /> : <EyeInvisibleOutlined />}
              </span>
            )
          }}
        />
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword? <div className='error'><ErrorIcon className='errorIcon' />{formik.touched.confirmPassword && formik.errors.confirmPassword}</div> : null}
          variant="outlined"
          required
          InputProps={{
            endAdornment: (
              <span style={{ cursor: 'pointer' }} onClick={toggleShowConfirmPassword}>
                {showConfirmPassword ? <EyeOutlined style={{ color: '#007bff' }} /> : <EyeInvisibleOutlined />}
              </span>
            )
          }}
        />
        <Button type="submit" variant="contained" sx={{
      backgroundColor: 'darkorange',
      '&:hover':{
        backgroundColor: 'black',
      },       }}>
          Register
        </Button>
        <div className="link"> <pre>Already have an account? <Link to="/signin" style={{ textDecoration: 'none', marginTop: '10px', color: 'blue' }}><b>SignIn</b></Link></pre></div>
      </Box>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%', backgroundColor:'#FBFBF9', color:'black' ,border: '1px solid darkorange'}}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;

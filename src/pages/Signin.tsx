import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import logo from '../img/logo.png';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { setToken } from '../utils/tokenUtils';
import { useFormik,FormikErrors } from 'formik';
import ErrorIcon from '@mui/icons-material/Error';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';



interface FormValues {
  email: string;
  password: string;
}
const Signin = function () {
  
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
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
      email: '',
      password: ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setFormErrors({password: '', email: '' });
        const response = await fetch('http://localhost:3001/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
    
        const data = await response.json();
        if(!(data.error === "")){
          throw new Error(data.error);
        }
        localStorage.setItem('state', 'Today');
        setToken(data.token);
        console.log(data.token);
        setSuccessMessage('Login Successfully');
        handleClick();
        setTimeout(function() {
          navigate('/dash');
        }, 3000);
      } catch (error: any) {
        if (error.message === "Email not found!") {
          setFormErrors(prev => ({ ...prev, email: error.message, password:'' }));
        } else if (error.message === "Wrong password!") {
          setFormErrors(prev => ({ ...prev, password: error.message, email: '' }));
        } else {
          setFormErrors(prev => ({ ...prev, email: 'Error with SignIn!', password: '' }));
        }
        setSubmitting(false);
      }
    },
    validate: (values) => {
      const errors: FormikErrors<FormValues> = {};
      if (!values.email) {
        errors.email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email format';
      }

      if (!values.password) {
        errors.password = 'Required';
      }
      return errors;
    }
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>Sign In</h1>
      <img src={logo} alt="Logo" style={{ height: '250px' }} />
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& .MuiTextField-root': { m: 1.15, width: '30ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <TextField
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean((formik.touched.email && formik.errors.email) || formErrors.email)}
          helperText={((formik.touched.email && formik.errors.email) || formErrors.email)? <div className='error'><ErrorIcon className='errorIcon' />{formik.errors.email || formErrors.email}</div> : null}
          variant="outlined"
        />
        
        <TextField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean((formik.touched.password && formik.errors.password) || formErrors.password)}
          helperText={((formik.touched.password && (formik.errors.password) || formErrors.password))? <div className='error'><ErrorIcon className='errorIcon' />{formik.errors.password || formErrors.password}</div> : null}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <span style={{ cursor: 'pointer' }} onClick={toggleShowPassword}>
                {showPassword ? <EyeOutlined style={{ color: '#007bff' }} /> : <EyeInvisibleOutlined />}
              </span>
            ),
          }}
        />
        <Button type="submit" variant="contained"  sx={{ mt: 2, backgroundColor:"darkorange",'&:hover':{
        backgroundColor: 'black',
      }, }}>
          Sign In
        </Button>
        <div className="link"> <pre>Already have account? <Link to="/signup" style={{ textDecoration: 'none', marginTop: '10px', color: 'blue' }}><b>Resgister</b></Link></pre></div>
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

export default Signin;

import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { jwtDecode } from "jwt-decode";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useFormik } from 'formik';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}
interface JwtPayload {
  userId: string;
}


const Profile: React.FC<UserProfile> = ({ firstName: initialFirst, lastName: initialLast, phoneNumber: initialNo, email }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [formErrors, setFormErrors] = useState({ firstName: '', lastName: '',phoneNumber:'' });
  const navigate = useNavigate();
  const token = localStorage.getItem('Token');
  if (!token) throw new Error('No token found');
  const decodedToken = jwtDecode(token) as JwtPayload & { userId: number };
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
      firstName: initialFirst,
      lastName: initialLast,
      phoneNumber: initialNo,
      userId: 0 
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setFormErrors({ firstName: '', lastName: '',phoneNumber:''});       
        values.userId = decodedToken.userId;
        const response = await axios.post(`http://localhost:3001/update-profile/${decodedToken.userId}`, values, {
          headers: {
            Authorization: token
          }
        });
        setSuccessMessage('profile updated successfully');
        handleClick();
        navigate('/profile');
      } catch (error: any) {
        console.error("Error:", error);
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
      if (!values.phoneNumber) {
        errors.phoneNumber = 'Phone Number is required';    
      } else if (!values.phoneNumber.match(/^[0-9]{10}$/)) {
        errors.phoneNumber = 'Invalid phone number';
      }
      // if (!values.password) {
      //   errors.password = 'Password is required';
      // } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(values.password)) {
      //   errors.password = 'Password must be at least 8 characters, include at least one lowercase, uppercase, & number';
      // }
      return errors;
    }
  });


  // const handleSave = async () => {
  //   try {
  //     // if (profilePicture) {
  //     //   const formData = new FormData();
  //     //   formData.append('profileImage', profilePicture);
  //     //   await axios.post(`http://localhost:3001/upload-profile-image/${decodedToken.userId}`, formData, {
  //     //     headers: {
  //     //       'Content-Type': 'multipart/form-data',
  //     //     },
  //     //   });
  //     // }
  //           // Update profile details
  //       // await axios.post(`http://localhost:3001/update-profile/${decodedToken.userId}`, updatedProfile);
  //       //     alert('Profile updated successfully!');

  //   } catch (error) {
  //     console.error('Error saving profile:', error);
  //   }
  // };

  const aspectRatioMaxHeight = isSmallScreen ? 220 : 200; // Adjust maxHeight based on screen size
  const aspectRatioMinWidth = isSmallScreen ? 200 : 180; 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        open={opena}
        autoHideDuration={2200}
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
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box>
        <Box marginTop='80px' sx={{ px: { xs: 2, md: 5, textAlign: 'center'} }}>
          <Typography level="h2" component="h2" sx={{ mt: 1, mb: 2 }}>
            My profile
          </Typography>
        </Box>
      </Box>
      <Stack
        spacing={5}
        sx={{
          display: 'flex',
          maxWidth: '850px',
          mx: 'auto',
          px: { xs: 3, md: 6 },
          py: { xs: 3, md: 6 },
        }}
      >
        <Card>
          <Box sx={{ mb: 2}}>
            <Typography>
              Customize your profile information
            </Typography>
          </Box>
          <Divider />
          <Stack
          spacing={1}
            sx={{ display: { md: 'blocks' }, my: 2 }}
          >
            <Stack spacing={3} sx={{ flexGrow: 0.7}}>
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
                onSubmit={handleSubmit}
              >
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
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
                  helperText={formik.touched.lastName && formik.errors.lastName}
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
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  variant="outlined"
                  required
                />
                 <TextField
                  id="email"
                  name="lastName"
                  label="Email"
                  value={email}
                  variant="outlined"
                  disabled
                />
                {/* <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: (
                      <span style={{ cursor: 'pointer' }} onClick={toggleShowPassword}>
                        {showPassword ? <EyeOutlined style={{ color: '#007bff' }} /> : <EyeInvisibleOutlined />}
                      </span>
                    )
                  }}
                /> */}
                <CardOverflow sx={{ justifyContent: 'center', alignContent:"center", margin:'auto'}}>
                <Button type="submit"  style={{width:'100px', marginTop: '20px', borderRadius:"8px"}}
                sx={{ backgroundColor: 'darkorange',
              '&:hover':{
                backgroundColor: 'black'
              },  }}>Save      </Button>

              </CardOverflow>

              </Box>
            </Stack>
          </Stack>

        </Card>
      </Stack>
    </Box>

    </div>
  );
};
export default Profile;


import React, { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/joy/Button';
import { removeToken } from '../utils/tokenUtils';
import logo from '../img/logo2.png';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

interface Props {
  window?: () => Window;
}

const drawerWidth = 300;
const navItems = ['Today', 'All tasks', 'Profile'];

 function DrawerAppBar(props: Props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeItem, setActiveItem] = useState(localStorage.getItem('state') ?? '');


    const onDashboard = useCallback(() => {
      localStorage.setItem('state', 'Today');
      navigate("/dash");
    }, [navigate]);
  
    const onAllTask = useCallback(() => {
      localStorage.setItem('state', 'All tasks');
      navigate("/tasks");
    }, [navigate]);
  
    const onProfile = useCallback(() => {
      localStorage.setItem('state', 'Profile');
      navigate("/profile");
    }, [navigate]);

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
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleSignOut = () => {
    setSuccessMessage('Signout Successfully');
    handleClick();
    setTimeout(() => {
      removeToken();
      navigate('/signin');
    }, 1500); 
};

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography sx={{mt:3}}><img src={logo} alt="" height={40} /></Typography>
      <Typography variant="h6" sx={{ my: 1,}}>
       <b>Start Finish</b>
      </Typography>
      <Divider />
      <List>
  {navItems.map((item) => (
    <ListItem key={item} disablePadding>
      <ListItemButton onClick={item === 'Today' ? onDashboard : (item === 'All tasks' ? onAllTask : onProfile)} 
      sx={{ textAlign: 'center', backgroundColor: item === activeItem ? 'lightgray' : 'white',       '&:hover': {
        backgroundColor: 'gray',
      },}}>
          <ListItemText primary={item} />
      </ListItemButton>
    </ListItem>
  ))}
  <ListItem sx={{ my: 10, justifyContent: 'center' }}>
    <Button size='lg' sx={{
      backgroundColor: 'darkorange',
      '&:hover': {
        backgroundColor: 'black',
      },
    }}
      onClick={handleSignOut}
    >Sign out</Button>
  </ListItem>
</List>

    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar component="nav" sx={{backgroundColor: '#FBFBF9'}}>
            <Toolbar>
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 3, display: { sm: 'none' }, color: 'black'}}
              >
                <MenuIcon />
              </IconButton>
              <Typography
              component="div"
              sx={{ display: { xs: 'none', sm: 'block'} }}>
                <img src={logo} alt="" height={40} /></Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ ml:2,flexGrow: 1, display: { xs: 'none', sm: 'block'},color: 'black' }}
              >
                <b>Start Finish</b>
                      </Typography>
                      <Box sx={{ display: { xs: 'none', sm: 'block' }, mr:3}}>
            {navItems.map((item) => (
                <Button sx={{
                    color: 'black',
                    mr: 2,
                    backgroundColor: "#FBFBF9",
                    padding: 0.6,
                    borderRadius: 0,
                    borderBottom: activeItem === item ? '2px solid orange' : 'none',
                    '&:hover': {
                      backgroundColor: '#FBFBF9',
                      borderBottom: '2px solid gray',
                    },
                  }}
                  onClick={item === 'Today' ? onDashboard : (item === 'All tasks' ? onAllTask : onProfile)}>
                  {item}
                </Button>
            ))}
            <Button size='md' sx={{ ml: 5.4, backgroundColor: 'darkorange','&:hover':{
              backgroundColor: 'black'}}}
              onClick={handleSignOut}
            >Sign out</Button>
          </Box>
            </Toolbar>
          </AppBar>
          <nav>
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
          </nav>
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
    </Box>
  );
}

export default DrawerAppBar;
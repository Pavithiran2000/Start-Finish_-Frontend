import React, { useState } from 'react';
import {Typography, Box, Button} from '@mui/material';
import RequireToken from './RequireToken';
import DrawerAppBar from '../component/bar';
import Footer from '../component/Footer';
import waiting from '../img/waiting.gif';
import ready from '../img/ready.gif';
import axios from 'axios';


function AskHelp() {
    const [meetingLink, setMeetingLink] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateMeeting = async () => {
        
        try {
          const res = await axios.get('http://localhost:3001/create-meeting');
          setMeetingLink(res.data.meetingLink);
          console.log(res.data.meetingLink);
          setMessage('Meeting successfully created');
        } catch (error) {
          setMessage('Failed to create meeting');
          console.error(error);
        }
      };

  return (
    <div>
    <RequireToken>
    <DrawerAppBar/>
    <main>
    <Box sx={{width: '100%', alignItems: 'center', display:'flex', marginTop:'100px'}} justifyContent={'center'} >
        <Typography variant="h6" sx={{
                fontSize:'30px',
                fontWeight:'bold',
            }}>Ask For Help</Typography> 
        </Box>
        {/* <Box sx={{flex: 1, flexDirection: 'column', width: '100%',alignItems: 'center',  display: 'flex',marginTop:'60px'}} justifyContent={'center'} >
            <img src={waiting} alt="Waiting" style={{ height: '250px' }} />
            <Typography sx={{margin:'15px'}}>You will reach a teacher in time minutes.</Typography>
            <Typography sx={{fontSize:'18px', fontWeight:'600',marginBottom:'10px'}}>Are you sure want to continue?</Typography>

            <Box>
            <Button  sx={{ color: 'white', backgroundColor: 'gray', '&:hover': { backgroundColor: 'black' }, width:'100px' }}>Cancel</Button>
            <Button  sx={{ color: 'white', backgroundColor: 'darkorange', margin:'20px', '&:hover': { backgroundColor: 'black' }, width:'100px' }}>Continue</Button>

            </Box>
        </Box> */}
        <Box sx={{flex: 1, flexDirection: 'column', width: '100%',alignItems: 'center',  display: 'flex',marginTop:'10px'}} justifyContent={'center'} >
            <img src={ready} alt="Waiting" style={{ height: '250px' }} />
            {/* <Typography sx={{margin:'10px', color: 'darkorange'}}>Time remaining</Typography>
            <Typography sx={{fontSize:'25px', fontWeight:'700'}}>Time</Typography>
            <Typography sx={{margin:'15px', width:'400px', textAlign:'center'}}>Your teacher will be with you shortly. Please wait while we connect you.</Typography>

            <Box>
                <Button  sx={{ color: 'white', backgroundColor: 'darkorange', margin:'20px', '&:hover': { backgroundColor: 'black' }, width:'170px' }}>Cancel Request</Button>
            </Box> */}
            <Typography sx={{margin:'15px', width:'400px', textAlign:'center'}}>Connected with Teacher<br/>Here we are ready to assist you.</Typography>

            {meetingLink && <Box><Button  onClick={() => window.open(meetingLink, '_blank')} sx={{ color: 'white', backgroundColor: 'darkorange', margin:'20px', '&:hover': { backgroundColor: 'black' }, width:'170px' }}>Join Meeting</Button></Box>}
            <div>
      <button onClick={handleCreateMeeting}>Schedule Meeting</button>
      {message && <p>{message}</p>}
    </div>
        </Box>
    </main>
        <Footer/>
        </RequireToken>   
    </div>
  )
}

export default AskHelp

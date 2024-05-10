import { Button } from '@mui/material';
import React, {useState, useEffect } from 'react';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { io, Socket } from "socket.io-client";


interface JwtPayload {
    userId: string;
  }

  const socket: Socket = io("http://localhost:3001");

const MeetingPage: React.FC = () => {
  const navigate = useNavigate();
  const [meetingStatusMap, setMeetingStatusMap] = useState<{
    [key: number]: boolean;
  }>({});
  const [meetingLink, setMeetingLink] = useState<string>();
  const teacherId = localStorage.getItem("teacherId");
  const token = localStorage.getItem("Token");
  if (!token) throw new Error("No token found");
  const decodedToken = jwtDecode(token) as JwtPayload & { userId: number };
  const handleEndMeeting = async () => {
    if (window.confirm('Are you sure you want to end the meeting?')) {
    try {
          await axios.put(`http://localhost:3001/api/endMeeting/${localStorage.getItem("meetingId")}/${localStorage.getItem("teacherId")}`); // Send a request to the backend to end the meeting
          localStorage.removeItem("meetingId");
          localStorage.removeItem("teacherId");
          navigate('/ask');
      } catch (error) {
        console.error('Error ending meeting:', error);
      }
     // Redirect to a blank page
    }
  };

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    if (teacherId) {
        fetchMeetings(parseInt(teacherId));
    }

    socket.on(
      "meetingStatusUpdated",
      (data: { teacherId: number; meetingStatus: boolean }) => {
        setMeetingStatusMap((prevState) => ({
          ...prevState,
          [data.teacherId]: data.meetingStatus,
        }));
      }
    );

    return () => {
      socket.off("meetingStatusUpdated");
    };
  }, []);

  const fetchMeetings = async (teacherId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/getMeetings/${teacherId}`
      ); // Update the endpoint according to your backend
      // setMeeting(response.data);
      console.log("meeting");
      console.log(response.data.meeting);
      console.log("meeting2");
      if(response.data.meeting){
      const meetingStatus = response.data.meeting.meeting_status;
      setMeetingLink(response.data.meeting.meeting_link);
      setMeetingStatusMap((prevState) => ({
        ...prevState,
        [teacherId]: meetingStatus,
      }));
    }
    } catch (error) {
      console.error("Error fetching meeting:", error);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '40vh', fontSize: 40 }}>
        <p>Meeting User {decodedToken.userId} with teacher{localStorage.getItem("teacherId")}</p>
        <p>Meeting Id:{localStorage.getItem("meetingId")}</p>

        <Button sx={{backgroundColor:'red', color:'white','&:hover':{
          backgroundColor: 'black'}}} onClick={handleEndMeeting}>End Meeting</Button>
          
      </div>
    </div>
  );
};

export default MeetingPage;

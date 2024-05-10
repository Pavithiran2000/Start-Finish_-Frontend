import React, { useEffect, useState } from 'react';
import { CircularProgress, Button } from '@mui/material/';
import axios from 'axios';

interface Meeting {
  meetingId: number;
  teacherId: number;
}

const WaitingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes timer
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMeetingStatus = async () => {
      try {
        const response = await axios.get('/api/getMeetingStatus');
        const meetingData = response.data;
        if (meetingData) {
          setMeeting(meetingData);
        }
      } catch (error) {
        console.error('Error fetching meeting status:', error);
      }
    };

    const interval = setInterval(() => {
      fetchMeetingStatus();
    }, 5000); // Check meeting status every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCancelMeeting = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/cancelMeeting/${meeting?.meetingId}`);
      // Redirect to request button page or homepage
      window.location.href = '/'; // Redirect to homepage
    } catch (error) {
      console.error('Error canceling meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Waiting Page</h1>
      <p>Please wait for the meeting to start.</p>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <p>Time remaining: {timer} seconds</p>
          <Button variant="contained" color="secondary" onClick={handleCancelMeeting}>
            Cancel Meeting
          </Button>
        </div>
      )}
    </div>
  );
};

export default WaitingPage;

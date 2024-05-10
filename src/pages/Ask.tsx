import React, { useState, useEffect } from "react";
import { Button } from "@mui/material/";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { io, Socket } from "socket.io-client";

interface Meeting {
  meetingId: number;
  teacherId: number;
}
interface ResponseItem {
  user: string;
}
interface JwtPayload {
  userId: string;
}
const socket: Socket = io("http://localhost:3001");

const Ask: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [teacher_status, set_teacher_status] = useState(false);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [requestStatus, setRequestStatus] = useState(false);
  const [position, setPosition] = useState<number>(-1);
  const [timer, setTimer] = useState(20); // 2 minutes timer
  const [userQueue, setUserQueue] = useState<any[]>([]);
  const [teacherQueue, setTeacherQueue] = useState<any[]>([]);
  const [meetingStatusMap, setMeetingStatusMap] = useState<{
    [key: number]: boolean;
  }>({});
  const [meetingLink, setMeetingLink] = useState<string>();


  const token = localStorage.getItem("Token");
  if (!token) throw new Error("No token found");
  const decodedToken = jwtDecode(token) as JwtPayload & { userId: number };

  const fetchUserQueue = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/getUserQueue"
      );
        setUserQueue(response.data.map((obj: any)=> obj.user).reverse());

    } catch (error) {
      console.error("Error fetching userQueue:", error);
    }
  };
  useEffect(() => {
    // Listen for QueueUpdated from backend
    fetchUserQueue();

    socket.on("userQueueUpdated", () => {
      fetchUserQueue();
    });
    return () => {
      socket.off("userQueueUpdated");
    };
  }, []);


  const fetchUserStatus = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/userStatus/${decodedToken.userId}`
      );
        // setUserQueue(response.data.userQueues);
        setPosition(response.data.position);
        setRequestStatus(response.data.status);      
    } catch (error) {
      console.error("Error fetching userQueue:", error);
    }
  };


  useEffect(() => {
    fetchUserStatus();

    // Listen for userQueueUpdated from backend
    socket.on("userQueueUpdated", () => {
      // fetchUserQueue();
      fetchUserStatus();
    });
    // Fetch initial userQueue
    // fetchUserQueue();
    return () => {
      socket.off("userQueueUpdated");
    };
  }, []);

  const fetchTeacherQueue = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/getTeacherQueue"
      );
        setTeacherQueue(response.data.map((obj: any)=> obj.teacher).reverse());
    } catch (error) {
      console.error("Error fetching userQueue:", error);
    }
  };

  useEffect(() => {
    fetchTeacherQueue();
    // Listen for QueueUpdated from backend
    socket.on("teacherQueueUpdated", () => {
      fetchTeacherQueue();
    });
    // Fetch initial Queue
    return () => {
      socket.off("teacherQueueUpdated");
    };
  }, []);

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
  // useEffect(() => {
  //   let timerInterval: NodeJS.Timeout;

  //   const startTimer = () => {
  //     let timeLeft = timer;

  //     const updateTimer = () => {
  //       if (timeLeft === 0) {
  //         clearInterval(timerInterval);
  //         handleCancelMeeting();
  //         return;
  //       }

  //       if (timeLeft === 10) {
  //         window.alert(
  //           "Can't take more than 5 minutes to connect, unless Auto cancel the request"
  //         );
  //       }

  //       setTimer(timeLeft);
  //       timeLeft--;
  //     };

  //     updateTimer();

  //     timerInterval = setInterval(updateTimer, 1000);
  //   };

  //   if (teacherQueue[position - 1]){
  //     startTimer();
  //   }

  //   return () => clearInterval(timerInterval);
  // }, [teacherQueue, position, timer]);

  // useEffect(() => {
  //   // Listen for meeting status updates from backend
  //   socket.on("meetingStatusUpdated", (status: boolean) => {
  //     setMeetingStatus(status);
  //   });

  //   return () => {
  //     socket.off("meetingStatusUpdated");
  //   };
  // }, []);

  // useEffect(() => {
  //   // Fetch initial meeting details
  //   // Assuming you have a function to fetch meeting details
  //   fetchMeetingStatus();
  // }, []);

  // const fetchMeetingStatus = async () => {
  //   // Fetch meeting details from backend
  //   try {
  //     const response = await axios.get(`http://localhost:3001/api/getMeetingStatus/${localStorage.getItem('meeting_id')}`);
  //     // setMeetingStatus(response.data.meetingStatus);
  //     console.log(response.data.meetingStatus);
  //   } catch (error) {
  //     console.error("Error fetching meeting details:", error);
  //   }
  // };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const handleRequestMeeting = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/requestMeeting/${decodedToken.userId}`
      );
      setLoading(true);
    } catch (error) {
      console.error("Error requesting meeting:", error);
    }
  };

  const handleCancelMeeting = async () => {
    try {
      await axios.post(
        `http://localhost:3001/api/cancelRequest/${decodedToken.userId}`
      );
      setLoading(true);    

    } catch (error) {
      console.error("Error canceling meeting:", error);
    }
  };

  const handleJoinMeeting = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/joinMeeting/${decodedToken.userId}/${position}`
      );
      const meetingLink = response.data.meetingLink;
      const meetingStatus = response.data.meetingStatus;
      const teacherId = response.data.teacherId;
      const meetingId = response.data.meetingId;
      localStorage.setItem("teacherId",teacherId);
      localStorage.setItem("meetingId",meetingId);
      console.log(`meetingId: ${localStorage.getItem("meetingId")}`);
      console.log(`teacherid: ${localStorage.getItem("teacherId")}`);

      if (meetingStatus) {
        window.open(meetingLink, "_blank");
      } else console.log("status false rerequest...");
    } catch (error) {
      console.error("Error joining meeting:", error);
    } 
  };
  const teacherId= localStorage.getItem("teacherId");
  console.log('teacherId');
  console.log(typeof teacherId);
  // const handleMeetingTeacher = async () => {
  //   try {
  //     setLoading(true);
  //     // Assuming you have the meetingId available
  //     const response = await axios.get(
  //       `http://localhost:3001/api/meetingTeacher/${localStorage.getItem(
  //         "meeting_id"
  //       )}`
  //     );
  //     console.log("Teacher meeting status updated successfully");
  //   } catch (error) {
  //     console.error("Error updating teacher meeting status:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const fetchActiveTeacher = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:3001/api/getActiveTeacher"
  //       );
  //       const activeTeacherId = response.data[0].teacher_id;
  //       console.log(response.data[0].is_on_meeting);
  //       set_teacher_status(response.data[0].is_on_meeting);
  //       // const isUserInQueue = queue.includes(activeTeacherId);
  //       // if (!meeting && !isUserInQueue) {
  //       //   setQueue((prevQueue) => [...prevQueue, activeTeacherId]);
  //       // }
  //     } catch (error) {
  //       console.error("Error getting active teacher:", error);
  //     }
  //   };

  //   // const timerInterval = setInterval(() => {
  //   //   fetchActiveTeacher();
  //   // }, 5000); // Check every 5 seconds

  //   // return () => clearInterval(timerInterval);
  // }, []);
  // console.log(typeof teacherQueue[position-1]);
  return (
    <div>
      <h1>USER {decodedToken.userId}</h1>
      {requestStatus || (teacherId && meetingStatusMap[parseInt(teacherId)])? (
        <div>
          {/* <p>Meeting ID: {meeting?.meetingId}</p>
          <p>Teacher ID: {meeting?.teacherId}</p> */}
          {/* {decodedToken.userId === parseInt(userQueue[1]) ? ( */}
          {teacherQueue[position-1] || (teacherId && meetingStatusMap[parseInt(teacherId)])? (
            <div>
              <p>Teacher {teacherQueue[position-1]} is online</p>
              <p>Click connect button to join the meeting withTeacher {teacherQueue[position-1]}.</p>
              {/* <p>
                Time remaining: {Math.floor(timer / 60)}:
                {timer % 60 < 10 ? "0" : ""}
                {timer % 60}
              </p> */}
              {/* <Button variant="contained" color="primary" onClick={() => {handleJoinMeeting(); handleMeetingTeacher();}}> */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleJoinMeeting();
                }}
                sx={{
                  margin:'5px'
                }}
              >
                Connect
              </Button>
              {/* <p>Time remaining: {timer} seconds</p> */}
              {!(teacherId && meetingStatusMap[parseInt(teacherId)]) && (<Button
                variant="contained"
                color="primary"
                onClick={handleCancelMeeting}
              >
                Cancel Request
              </Button>)}
            </div>
          ) : (
            <div>
              {/* <p>Time remaining: {timer} seconds</p> */}
              <p>Waiting...</p>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCancelMeeting}
              >
                Cancel Request
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleRequestMeeting}
        >
          Request Meeting
        </Button>
      )}

      <h2>User Queue:</h2>
      <ol type ='1'>
        {userQueue.map((user, index) => (
          <li key={index}>user {user}</li>
        ))}
      </ol>
      <h2>Teacher Queue:</h2>
      <ol type ='1'>
        {teacherQueue.map((teacher, index) => (
          <li key={index}>teacher {teacher}</li>
        ))}
      </ol>
      <p>user {decodedToken.userId} position : {position}</p>
      <p>so user can connect with {position} position teacherId:{teacherQueue[position-1]} </p>

    </div>
  );
};

export default Ask;

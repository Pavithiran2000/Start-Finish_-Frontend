import React, { useEffect, useState } from "react";
import {
  Switch,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { red } from "@mui/material/colors";

interface Teacher {
  teacher_id: number;
  name: string;
  teacher_email: string;
  is_active: boolean;
  is_on_meeting: boolean;
}
interface Meeting {
  meeting_id: number;
  user_id: number;
}

const socket: Socket = io("http://localhost:3001");

const Teacher: React.FC = () => {
  const [meetingLink, setMeetingLink] = useState<string>();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherQueue, setTeacherQueue] = useState<any[]>([]);
  const [userQueue, setUserQueue] = useState<any[]>([]);
  const [meetingStatusMap, setMeetingStatusMap] = useState<{
    [key: number]: boolean;
  }>({});
  const [meetingMap, setMeetingMap] = useState<{ [key: number]: Meeting }>({});
  const [teacherMap, setTeacherMap] = useState<{ [key: number]: Teacher }>({});
  const [teacherStatusMap, setTeacherStatusMap] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    fetchTeachers();
    // socket.on(
    //   "meetingStatusUpdated",
    //   (data: { teacherId: number; meetingStatus: boolean }) => {
    //     setMeetingStatusMap((prevState) => ({
    //       ...prevState,
    //       [data.teacherId]: data.meetingStatus,
    //     }));
    //   }
    // );

    // return () => {
    //   // socket.off("meetingStatusUpdated");
    // };
  }, []);
  // }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get<Teacher[]>(
        "http://localhost:3001/api/getTeachers"
      ); // Update the endpoint according to your backend
      setTeachers(response.data);
      response.data.forEach((teacher) => {
        // console.log(teacher.teacher_email);
        setTeacherMap((prevState) => ({
          ...prevState,
          [teacher.teacher_id]: teacher,
        }));
        setTeacherStatusMap((prevState) => ({
          ...prevState,
          [teacher.teacher_id]: teacher.is_on_meeting,
        }));
      });

      console.log(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };
  useEffect(() => {
    teachers.forEach(async (teacher) => {
      await fetchMeetings(teacher.teacher_id);
    });

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
  }, [teachers]);

  const fetchMeetings = async (teacherId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/getMeetings/${teacherId}`
      ); // Update the endpoint according to your backend
      // setMeeting(response.data);
      console.log("meeting");
      console.log(response.data.meeting);
      console.log("meeting2");
      if (response.data.meeting) {
        const meetingStatus = response.data.meeting.meeting_status;
        setMeetingLink(response.data.meeting.meeting_link);
        setMeetingStatusMap((prevState) => ({
          ...prevState,
          [teacherId]: meetingStatus,
        }));
      }
      // setMeetingLinkMap(prevState => ({
      //   ...prevState,
      //   [teacherId]: meetingLink,
      // }));
      setMeetingMap((prevState) => ({
        ...prevState,
        [teacherId]: response.data.meeting,
      }));
    } catch (error) {
      console.error("Error fetching meeting:", error);
    }
  };

  useEffect(() => {
    teachers.forEach(async (teacher) => {
      await fetchMeetings(teacher.teacher_id);
    });

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
  }, [teachers]);

  useEffect(() => {
    // teachers.forEach(async (teacher) => { // Iterate through each teacher
    //   teacherQueue.forEach(async (queuedTeacher) => { // Iterate through each teacher in the queue
    //     if (teacher.teacher_id === queuedTeacher) { // Check if the current teacher matches any teacher in the queue
    //       await fetchMeetings(teacher.teacher_id); // If there's a match, fetch meetings for that teacher
    //     }
    //   });
    // });
    teachers.forEach(async (teacher) => {
      await fetchMeetings(teacher.teacher_id);
    });

    socket.on(
      "meetingUpdated",
      (data: { teacherId: number; meetingId: number; userId: number }) => {
        setMeetingMap((prevState) => ({
          ...prevState,
          [data.teacherId]: {
            user_id: data.userId,
            meeting_id: data.meetingId,
          },
        }));
      }
    );

    return () => {
      socket.off("meetingUpdated");
    };
  }, [teachers]);

  const fetchUserQueue = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/getUserQueue"
      );
      setUserQueue(response.data.map((obj: any) => obj.user).reverse());
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

  const fetchTeacherQueue = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/getTeacherQueue"
      );
      setTeacherQueue(response.data.map((obj: any) => obj.teacher).reverse());
    } catch (error) {
      console.error("Error fetching TeacherQueue:", error);
    }
  };

  useEffect(() => {
    // Listen for QueueUpdated from backend
    fetchTeacherQueue();

    socket.on("teacherQueueUpdated", () => {
      fetchTeacherQueue();
    });
    return () => {
      socket.off("teacherQueueUpdated");
    };
  }, []);

  const handleSwitchChange = async (teacherId: number, isActive: boolean) => {
    try {
      await axios.put(`http://localhost:3001/api/updateTeacher/${teacherId}`, {
        isActive,
      }); // Update the endpoint according to your backend
      fetchTeachers(); // Fetch updated data after making changes
    } catch (error) {
      console.error("Error updating teacher status:", error);
    }
  };
  console.log(meetingMap);

  const handleJoinMeeting = async (teacherId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/joinMeetingTeacher/${teacherId}`
      );
      console.log(response);
      fetchTeachers();
      if (meetingStatusMap[teacherId]) {
        // window.open(meetingLink, "_blank");
      } else console.log("status false rerequest...");
    } catch (error) {
      console.error("Error joining meeting:", error);
    }
  };

  const handleEndMeeting = async (
    teacherId: number,
    meetingId: number,
  ) => {
    if (window.confirm("Are you sure you want to end the meeting?")) {
      try {
        const response = await axios.put(
          `http://localhost:3001/api/endMeetingTeacher/${teacherId}/${meetingId}`
        ); // Send a request to the backend to end the meeting
        console.log(response);
        fetchTeachers();
      } catch (error) {
        console.error("Error ending meeting:", error);
      }
      // Redirect to a blank page
    }
  };

  const handleDisconnectMeeting = async (
    teacherId: number,
    meetingId: number,
    userId: number
  ) => {
    if (window.confirm("Are you sure you want to disconnect the meeting?")) {
      try {
        const response = await axios.put(
          `http://localhost:3001/api/disconnectMeetingTeacher/${teacherId}/${meetingId}/${userId}`
        ); // Send a request to the backend to end the meeting
        console.log(response);
        fetchTeachers();
      } catch (error) {
        console.error("Error ending meeting:", error);
      }
      // Redirect to a blank page
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Teacher ID</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Online Status</b>
              </TableCell>
              <TableCell>
                <b>Meeting Statu</b>s
              </TableCell>
              <TableCell>
                <b>Meeting</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.teacher_id}>
                <TableCell>{teacher.teacher_id}</TableCell>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.teacher_email}</TableCell>
                <TableCell>
                  <Typography>
                    {teacher.is_active ? "Active" : "Away"}
                  </Typography>
                  <Switch
                    checked={teacher.is_active}
                    onChange={(e) =>
                      handleSwitchChange(teacher.teacher_id, e.target.checked)
                    }
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </TableCell>
                <TableCell>
                  {teacher.is_on_meeting ? "on the meeting" : "No"}
                </TableCell>
                <TableCell>
                  {teacher.is_active && (
                    <div>
                      {meetingMap[teacher.teacher_id] &&
                        meetingStatusMap[teacher.teacher_id] &&
                        !teacher.is_on_meeting && (
                          <span style={{ color: "red" }}>
                            user {meetingMap[teacher.teacher_id].user_id}{" "}
                            in meeting<br/>
                          </span>
                        )}
                        {!meetingMap[teacher.teacher_id] && teacherQueue.map((teach, index) => {
                          if (parseInt(teach) === teacher.teacher_id) {
                            const position = index;
                            let users:string='';
                            return userQueue.map((user, idx) => {
                              if (position === idx) {
                                users=user
                                return (
                                  <span key={idx} style={{ color: "red" }}>
                                    user {users} waiting to connect<br/>
                                  </span>
                                );
                              }
                              return null;
                            });
                          }
                          return null; // Ensure to return null if the condition isn't met
                        })
                      }
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleJoinMeeting(teacher.teacher_id);
                        }}
                        sx={{
                          backgroundColor: teacher.is_on_meeting ? "green" : "",
                          "&:hover": {
                            backgroundColor: "gray",
                          },
                        }}
                        disabled={!meetingStatusMap[teacher.teacher_id]}
                      >
                        {teacher.is_on_meeting ? "Connected" : "connect"}
                      </Button>
                      {!teacher.is_on_meeting && meetingStatusMap[teacher.teacher_id]&& (
                        <Button
                          variant="contained"
                          onClick={() => {
                            handleDisconnectMeeting(teacher.teacher_id,
                              meetingMap[teacher.teacher_id].meeting_id,
                              meetingMap[teacher.teacher_id].user_id);
                          }}
                          sx={{
                            margin: '10px',
                            backgroundColor: "red",
                            "&:hover": {
                              backgroundColor: "gray",
                            },
                          }}
                        >
                          Disconnect
                        </Button>
                      )}

                      {teacher.is_on_meeting && (
                        <Button
                          sx={{
                            backgroundColor: "red",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "black",
                            },
                          }}
                          onClick={() => {
                            handleEndMeeting(
                              teacher.teacher_id,
                              meetingMap[teacher.teacher_id].meeting_id                            );
                          }}
                        >
                          End Meeting
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <h2>Teacher Queue:</h2>
      <ol type="1">
        {teacherQueue.map((teacher, index) => (
          <li key={index}>teacher {teacher}</li>
        ))}
      </ol>
      <h2>User Queue:</h2>
      <ol type="1">
        {userQueue.map((user, index) => (
          <li key={index}>user {user}</li>
        ))}
      </ol>
    </div>
  );
};

export default Teacher;

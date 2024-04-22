import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete, Today } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import AddTask from './AddTask';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditTask from './EditTask';
import Pagination from '@mui/material/Pagination';
import task from '../img/task.png';

interface Task {
  task_id: number;
  title: string;
  description: string;
  task_date: string;
}
interface JwtPayload {
  userId: string;
}

const ViewTodayTask: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task>({ task_id: 0, title: '', description: '',task_date:'' });
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [opena, setOpena] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tasksPerPage = 4; 
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

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
  const today = new Date().toISOString().split('T')[0];
  useEffect(() => {
    const fetchTodayTasks = async () => {
      try {
        const token = localStorage.getItem('Token');
        if (!token) throw new Error('No token found');
        console.log(token);

        const decodedToken = jwtDecode(token) as JwtPayload & { userId: number };
        const response = await axios.get<Task[]>(`http://localhost:3001/today-tasks?userId=${decodedToken.userId}&date=${today}`, {
          headers: {
            Authorization: token
          }
        });
        setTasks(response.data);

      } catch (error) {
        console.error('Error fetching today tasks:', error);
      }
    };

    fetchTodayTasks();
  }, []);

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  const handleDeleteTask = async (taskToDelete: Task) => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) throw new Error('No token found');
      console.log("taskToDelete" + taskToDelete);
      const response = await axios.delete(`http://localhost:3001/tasks/${taskToDelete.task_id}`, {
        headers: {
          Authorization: token
        }
      });
      console.log(response.data);
      setSuccessMessage('Task delete Successfully');
      handleClick();
      setIsDeleteOpen(false);
      setTimeout(function () {
        window.location.reload();
      }, 800);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className='container' style={{ maxWidth: '900px', margin: 'auto', textAlign: 'center', marginTop: 100 }}>
      <h2>Today's Tasks({today})</h2>
      {currentTasks.length > 0 ? (
        currentTasks.map((task) => (
          <Accordion key={task.task_id} style={{ position: 'relative', margin:'10px', marginTop:'0px',backgroundColor:'#f4f4f4' }} expanded={expandedAccordion === `panel${task.task_id}`} onChange={handleAccordionChange(`panel${task.task_id}`)}>
            <AccordionSummary>
            <Typography 
                sx={{
                  fontSize: '22px',
                  padding:'15px',
                  fontWeight: 'bold', 
                  textAlign: 'left',
                  '@media (max-width: 500px)': {
                    fontSize: '16px', // Smaller font size on small screens
                  }
                }}
                > {task.title}</Typography>

              <div style={{ position: 'absolute', right: '90px', top: '30%', transform: 'translateY(-50%)' }} onClick={(event) => {
              event.stopPropagation();}}>
                  <EditTask task_id={task.task_id} title={task.title} description={task.description}/>
                </div>
              <Button onClick={(event) => {
              event.stopPropagation();
              handleDeleteClick(task);
            }}
          style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)' }}
              ><Delete sx={{ color: 'red', '&:hover': { color: 'black' } }} /></Button>
            </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ textAlign: 'left' }}><span style={{fontSize:'16px', fontWeight:'bold'}}>Description:</span> <span style={{fontSize: '14px', justifyContent:'center'}}>{task.description}</span></Typography>
              </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <div className='empty' style={{position:'fixed', bottom:'50%', left:'50%',transform: 'translate(-50%, 50%)' }}>
          <h3 style={{color:'gray'}}>No tasks for Today</h3>
          <img src={task} alt="Task" style={{ height: '200px' }} />
        </div>
      )}
      <Pagination
        count={Math.ceil(tasks.length / tasksPerPage)}
        page={currentPage}
        onChange={handleChangePage}
        style={{
          position: 'fixed',
          bottom: '165px',
          left: '50%', transform: 'translate(-50%, 50%)',
          padding: '10px', 
          zIndex:1000,
          display: tasks.length < 5 ? 'none' : ''

        }}
      />
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {selectedTask.title}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteTask(selectedTask)} sx={{ color: 'white', backgroundColor: 'red', '&:hover': { backgroundColor: 'black' } }}>Delete</Button>
          <Button onClick={() => setIsDeleteOpen(false)} sx={{ color: 'white', backgroundColor: 'gray', '&:hover': { backgroundColor: 'black' } }}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <AddTask />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={opena}
        autoHideDuration={5000}
        onClose={handleClosea}
      >
        <Alert
          onClose={handleClosea}
          severity="success"
          variant="filled"
          sx={{ width: '100%', backgroundColor: '#FBFBF9', color: 'black', border: '1px solid darkorange' }}
        >
          {successMessage}
        </Alert>

      </Snackbar>
    </div>
  );
};

export default ViewTodayTask;

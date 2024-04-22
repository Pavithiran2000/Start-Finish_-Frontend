import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Pagination} from '@mui/material';
import { Delete } from '@mui/icons-material';
import AddTask from './AddTask';
import {jwtDecode} from "jwt-decode";
import Alert from '@mui/material/Alert';
import task from '../img/task.png';
import SearchBar from './SearchBar';
import EditTask from './EditTask';

interface Task {
  task_id: number;
  title: string;
  description: string;
  task_date: string;
}

interface JwtPayload {
  userId: string;
}

const AllTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task>({ task_id: 0, title: '', description: '', task_date: '' });
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tasksPerPage = 4;
  const [opena, setOpena] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  // useEffect(() => {
  //   const fetchAllTasks = async () => {
  //     try {
  //       const token = localStorage.getItem('Token');
  //       if (!token) throw new Error('No token found');
  //       const decodedToken = jwtDecode(token) as JwtPayload & { userId: number };

  //       const startIndex = (currentPage - 1) * tasksPerPage;
  //       const endIndex = startIndex + tasksPerPage;

  //       const response = await axios.get<Task[]>(`http://localhost:3001/all-tasks?userId=${decodedToken.userId}&start=${startIndex}&end=${endIndex}`, {
  //         headers: { Authorization: token }
  //       });
  //       setTasks(response.data);
  //     } catch (error) {
  //       console.error('Error fetching all tasks:', error);
  //     }
  //   };

  //   fetchAllTasks();
  // }, [currentPage, searchQuery]);
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const token = localStorage.getItem('Token');
        if (!token) throw new Error('No token found');
        const decodedToken = jwtDecode(token) as JwtPayload & { userId: number };
  
        const startIndex = (currentPage - 1) * tasksPerPage;
        const endIndex = startIndex + tasksPerPage;
  
        let url = `http://localhost:3001/all-tasks?userId=${decodedToken.userId}&start=${startIndex}&end=${endIndex}`;
        
        // Include search query if present
        if (searchQuery) {
          url += `&query=${searchQuery}`;
        }
  
        const response = await axios.get<Task[]>(url, {
          headers: { Authorization: token }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching all tasks:', error);
      }
    };
  
    fetchAllTasks();
  }, [currentPage, searchQuery, tasksPerPage]);
  

  const incrementallyFilterTasks = (tasks: Task[], query: string): Task[] => {
      return tasks.filter(task => {
        for (let i = 0; i < query.length; i++) {
          if (task.title.toLowerCase()[i] !== query.toLowerCase()[i]) {
            return false;
          }
        }
        return true;
      });
    };
  const filteredTasks = searchQuery ? incrementallyFilterTasks(tasks, searchQuery) : tasks;

  const handleDeleteTask = async (taskToDelete: Task) => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) throw new Error('No token found');
      const response = await axios.delete(`http://localhost:3001/tasks/${taskToDelete.task_id}`, {
        headers: { Authorization: token }
      });
      setSuccessMessage('Task delete Successfully');
      handleClick();
      setIsDeleteOpen(false);
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

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
  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };
  return (
    <div className='container' style={{ maxWidth: '900px', margin: 'auto', textAlign: 'center', marginTop: 100, marginBottom: 50 }}>
      <h2>All Tasks</h2>
      <div style={{marginBottom:'15px'}}>
      <SearchBar setSearchQuery={setSearchQuery} />
      </div>
      {tasks.length === 0 ? (
        <div className='empty' style={{position:'fixed', bottom:'50%', left:'50%',transform: 'translate(-50%, 50%)' }}>
          <h3 style={{color:'gray'}}>Empty tasks</h3>
          <img src={task} alt="Task" style={{ height: '200px' }} />
        </div>
      ) : (
      filteredTasks.length === 0 ? (
        <div className='empty' style={{ position: 'fixed', bottom: '50%', left: '50%', transform: 'translate(-50%, 50%)' }}>
          <h3 style={{ color: 'gray' }}>No tasks found</h3>
          <img src={task} alt="Task" style={{ height: '200px' }} />
        </div>
      ) : (
        filteredTasks.map((task, index) => (
          index >= (currentPage - 1) * tasksPerPage && index < currentPage * tasksPerPage && (
            <Accordion key={task.task_id} style={{ position: 'relative', margin:'10px', marginTop:'0px', backgroundColor:'#f4f4f4', fontFamily:'Candara'}} expanded={expandedAccordion === `panel${index}`} onChange={handleAccordionChange(`panel${index}`)}>
              <AccordionSummary sx={{padding:0, paddingLeft:'10px' }}>
              <Typography 
                sx={{
                  fontSize: '22px',
                  fontWeight: 'bold', 
                  textAlign: 'left',
                  '@media (max-width: 500px)': {
                    fontSize: '16px', // Smaller font size on small screens
                  }
                }}
                > {task.title} <br/><span style={{fontSize: '16px', fontWeight:'lighter'}}>{task.task_date.split('T')[0]}</span></Typography>
                <div style={{ position: 'absolute', right: '90px', top: '30%', transform: 'translateY(-50%)' }}  onClick={(event) => {
                   event.stopPropagation();}}>
                  <EditTask task_id={task.task_id} title={task.title} description={task.description} />
                </div>
                <Button onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteClick(task);
                }} style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)' }}>
                  <Delete sx={{ color: 'red', '&:hover': { color: 'black' } }} />
                </Button>
              </AccordionSummary>
              <AccordionDetails sx={{paddingLeft:'10px', Padding:0}}>
                <Typography sx={{ textAlign: 'left' }}><span style={{fontSize:'16px', fontWeight:'bold'}}>Description:</span> <span style={{fontSize: '14px'}}>{task.description}</span></Typography>
              </AccordionDetails>
            </Accordion>
          )
        ))
      )
      )}
      <Pagination
  count={Math.ceil(filteredTasks.length / tasksPerPage) || 1}
  page={currentPage}
  onChange={handleChangePage}
  style={{
    position: 'fixed',
    bottom: '165px',
    left: '50%', transform: 'translate(-50%, 50%)',
    padding: '10px',
    zIndex:1000,
    display: (filteredTasks.length <=4 || tasks.length < 5) ? 'none' : ''
  }}
/>

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
    </div>
  );
};

export default AllTasks;

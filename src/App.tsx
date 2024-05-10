import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import RequireToken from './pages/RequireToken';
import './App.css'
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AllTaaskPage from './pages/AllTaaskPage';
import AskHelp from './pages/AskHelp';
import LoginButton from './component/LoginButton';
import Ask from './pages/Ask';
import WaitingPage from './pages/WaitingPage';
import Meeting from './pages/meeting';
import Teacher from './pages/Teacher';

function App() {

  return (
    <Router>
      <div>
      <Routes>
      <Route path="/" element={<Navigate to="/dash" />} />
      <Route path="/help" element={<AskHelp />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dash" element={<Dashboard/>} />
      <Route path="/tasks" element={<AllTaaskPage/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/log" element={<LoginButton/>}></Route>
      <Route path="/ask" element={<Ask/>}></Route>
      <Route path="/waiting" element={<WaitingPage/>}></Route>
      <Route path="/meeting" element={<Meeting/>} />
      <Route path="/teacher" element={<Teacher/>} />




      </Routes>
      </div>
    </Router>
  );
}

export default App;

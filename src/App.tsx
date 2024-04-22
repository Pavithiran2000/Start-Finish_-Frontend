import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import RequireToken from './pages/RequireToken';
import './App.css'
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AllTaaskPage from './pages/AllTaaskPage';

function App() {

  return (
    <Router>
      <div>
      <Routes>
      <Route path="/" element={<Navigate to="/dash" />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dash" element={<Dashboard/>} />
      <Route path="/tasks" element={<AllTaaskPage/>} />
      <Route path="/profile" element={<Profile/>} />

      </Routes>
      </div>
    </Router>
  );
}

export default App;

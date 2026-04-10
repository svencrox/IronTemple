import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SyncProvider } from './context/SyncContext';
import HomePage from './components/HomePage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import GetStarted from './components/GetStarted';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import WorkoutHistory from './components/WorkoutHistory';
import WorkoutDetail from './components/WorkoutDetail';

function App() {
  return (
    <SyncProvider>
      <Router basename={process.env.REACT_APP_BASENAME || '/'}>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workout/new" element={<WorkoutLogger />} />
            <Route path="/workout/edit/:id" element={<WorkoutLogger />} />
            <Route path="/workout/detail/:id" element={<WorkoutDetail />} />
            <Route path="/history" element={<WorkoutHistory />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </SyncProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AddStudent from './components/AddStudent';
import StudentList from './components/StudentList';

function App() {
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    window.location.href = "/";
  };

  const isLoggedIn = localStorage.getItem("user_id");

  return (
    <Router>
      <div className="container mt-4">
        <h2 className="text-center">🎓 Student Management System</h2>

        {isLoggedIn && (
          <div className="d-flex justify-content-end">
            <button onClick={handleLogout} className="btn btn-outline-secondary">
              Logout
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<><AddStudent /><StudentList /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

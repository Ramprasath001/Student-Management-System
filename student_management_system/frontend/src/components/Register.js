import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/register', form)
      .then(res => {
        alert(res.data.message);
        navigate('/');
      })
      .catch(err => {
        alert(err.response?.data?.error || "Registration failed");
      });
  };

  return (
    <div className="card p-4">
      <h4>Register</h4>
      <form onSubmit={handleSubmit}>
        <input type="text" className="form-control my-2" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input type="email" className="form-control my-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" className="form-control my-2" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default Register;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/login', form)
      .then(res => {
        localStorage.setItem("user_id", res.data.user_id);
        alert(res.data.message);
        navigate("/dashboard");
      })
      .catch(err => {
        alert(err.response?.data?.error || "Login failed");
      });
  };

  return (
    <div className="card p-4">
      <h4>Login</h4>
      <form onSubmit={handleSubmit}>
        <input type="email" className="form-control my-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" className="form-control my-2" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit" className="btn btn-success">Login</button>
      </form>
      <p className="mt-2">Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;

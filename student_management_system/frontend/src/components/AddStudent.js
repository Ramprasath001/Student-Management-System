import React, { useState } from 'react';
import axios from 'axios';

function AddStudent() {
  const [form, setForm] = useState({ name: '', email: '', course: '', year: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");

    axios.post('http://localhost:5000/students', { ...form, user_id })
      .then(res => {
        alert(res.data.message);
        setForm({ name: '', email: '', course: '', year: '' });
      })
      .catch(err => {
        alert(err.response?.data?.error || "Failed to add student");
      });
  };

  return (
    <div className="card p-3 my-3">
      <h5>Add New Student</h5>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="form-control my-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="form-control my-2" name="course" placeholder="Course" value={form.course} onChange={handleChange} required />
        <input className="form-control my-2" name="year" placeholder="Year" value={form.year} onChange={handleChange} required />
        <button className="btn btn-primary">Add Student</button>
      </form>
    </div>
  );
}

export default AddStudent;

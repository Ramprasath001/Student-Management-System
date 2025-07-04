import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = () => {
    const user_id = localStorage.getItem("user_id");
    axios.get(`http://localhost:5000/students/${user_id}`)
      .then(res => setStudents(res.data))
      .catch(err => console.error("Failed to load students", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    axios.delete(`http://localhost:5000/students/${id}`)
      .then(res => {
        alert(res.data.message);
        fetchStudents();
      })
      .catch(err => alert("Delete failed"));
  };

  const handleEditChange = (e) => {
    setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/students/${editingStudent.id}`, editingStudent)
      .then(res => {
        alert(res.data.message);
        setEditingStudent(null);
        fetchStudents();
      })
      .catch(err => alert("Update failed"));
  };

  return (
    <div className="card p-3">
      <h5>Student List</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Course</th><th>Year</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              {editingStudent?.id === student.id ? (
                <>
                  <td><input name="name" value={editingStudent.name} onChange={handleEditChange} /></td>
                  <td><input name="email" value={editingStudent.email} onChange={handleEditChange} /></td>
                  <td><input name="course" value={editingStudent.course} onChange={handleEditChange} /></td>
                  <td><input name="year" value={editingStudent.year} onChange={handleEditChange} /></td>
                  <td>
                    <button className="btn btn-sm btn-success me-2" onClick={handleEditSubmit}>Save</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingStudent(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.year}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => setEditingStudent(student)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;

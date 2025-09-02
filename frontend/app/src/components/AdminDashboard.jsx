import { useState, useEffect } from 'react'
import axiosInstance from '../utils/axios'

function AdminDashboard() {
  const [requests, setStudentRequests] = useState([]);
  const [newrequest, setNewRequest] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/requests/');
      setStudentRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const updateRequest = async (id, name) => {
    const requestData = { 
      name, 
      request: newrequest
    };
    try {
      const response = await axiosInstance.put(`/requests/${id}/`, requestData);
      setStudentRequests(prev =>
        prev.map((request) => request.id === id ? response.data : request)
      );
    } catch (error) {
      console.error('Error updating request:', error);
    }
  }

  const deleteRequest = async (id) => {
    try {
      await axiosInstance.delete(`/requests/${id}/`);
      setStudentRequests(prev => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  }

  return (
    <div>
      <h1>All Student Requests</h1>
      {requests.map((request) => (
        <div key={request.id}> 
          <h2>Student: {request.name} Requested: {request.request}</h2>
          <input 
            type="text" 
            placeholder="Update request" 
            onChange={(e) => setNewRequest(e.target.value)}
          />
          <button onClick={() => updateRequest(request.id, request.name)}>
            Update
          </button>
          <button onClick={() => deleteRequest(request.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard
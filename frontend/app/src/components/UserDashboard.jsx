import { useState } from 'react'
import axiosInstance from '../utils/axios'

function UserDashboard() {
  const [name, setName] = useState('');
  const [request, setRequest] = useState('');

  const addRequest = async () => {
    const requestData = { name, request };
    try {
      await axiosInstance.post('/requests/create/', requestData);
      alert('Request submitted successfully!');
      setName('');
      setRequest('');
    } catch (error) {
      console.error('Error adding request:', error);
    }
  }

  return (
    <div>
      <h1>Submit a Request</h1>
      <form onSubmit={e => { e.preventDefault(); addRequest(); }}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Form to get" 
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  )
}

export default UserDashboard
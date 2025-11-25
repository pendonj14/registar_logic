import { useState, useEffect, useContext } from 'react' // 1. Import useContext
import axiosInstance from '../utils/axios'
import { jwtDecode } from "jwt-decode"; 
import { AuthContext } from '../contexts/AuthContent'; // 2. Import AuthContext

function UserDashboard() {
  // 3. Extract handleLogout from the context
  const { handleLogout } = useContext(AuthContext);

  const [username, setUsername] = useState('');

  const [formData, setFormData] = useState({
    request: '',            
    year_level: '1st Year', 
    is_graduate: false,     
    last_attended: '',      
    clearance_status: false,
    affiliation: 'Student', 
    request_purpose: ''
  });

  const [clearanceImage, setClearanceImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            setUsername(decoded.username || decoded.user_id); 
        } catch (error) {
            console.error("Invalid token", error);
        }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      if (name === 'is_graduate') {
        newData.affiliation = checked ? 'Alumni' : 'Student';
        if (!checked) newData.last_attended = ''; 
      }
      return newData;
    });
  };

  const handleFileChange = (e) => {
    setClearanceImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append('request', formData.request);
    dataToSend.append('year_level', formData.year_level);
    dataToSend.append('is_graduate', formData.is_graduate); 
    dataToSend.append('clearance_status', formData.clearance_status);
    dataToSend.append('affiliation', formData.affiliation);
    dataToSend.append('request_purpose', formData.request_purpose);

    if (formData.is_graduate) {
        dataToSend.append('last_attended', formData.last_attended);
    }

    if (clearanceImage) {
        dataToSend.append('eclearance_proof', clearanceImage);
    }

    try {
      await axiosInstance.post('/requests/create/', dataToSend);
      alert('Request submitted successfully!');
      
      setFormData({
        request: '', year_level: '1st Year', is_graduate: false, 
        last_attended: '', clearance_status: false, affiliation: 'Student', request_purpose: ''
      });
      setClearanceImage(null);

    } catch (error) {
      console.error('Error adding request:', error.response?.data || error.message);
      alert('Error submitting request. Check console for details.');
    }
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      
      {/* HEADER SECTION WITH LOGOUT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
            <h1>Submit a Request</h1>
            {username && <p>Logged in as: <strong>{username}</strong></p>}
        </div>
        
        {/* 4. The Temporary Logout Button */}
        <button 
            onClick={handleLogout} 
            style={{
                backgroundColor: '#dc2626', // Red color
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
            }}
        >
            Logout
        </button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        
        <label>
            Document to Request:
            <input 
                type="text" 
                name="request"
                value={formData.request}
                onChange={handleChange}
                placeholder="e.g. Transcript of Records"
                required
                style={{ padding: '8px', marginTop: '5px' }}
            />
        </label>

        <label>
            Year Level:
            <select name="year_level" value={formData.year_level} onChange={handleChange} style={{ padding: '8px', marginTop: '5px' }}>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
                <option value="Graduate Studies">Graduate Studies</option>
            </select>
        </label>

        <label style={{display: 'flex', alignItems: 'center'}}>
            <input 
                type="checkbox" 
                name="is_graduate"
                checked={formData.is_graduate}
                onChange={handleChange}
            />
            &nbsp; Are you an Alumni?
        </label>

        {formData.is_graduate && (
             <label>
                Last S.Y. Attended:
                <input 
                    type="text" 
                    name="last_attended"
                    value={formData.last_attended}
                    onChange={handleChange}
                    placeholder="e.g. 2022-2023"
                    required
                    style={{ padding: '8px', marginTop: '5px' }}
                />
            </label>
        )}

        <label style={{display: 'flex', alignItems: 'center'}}>
            <input 
                type="checkbox" 
                name="clearance_status"
                checked={formData.clearance_status}
                onChange={handleChange}
            />
            &nbsp; I am Cleared
        </label>

        <label>
            Upload Clearance Proof (Image):
            <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: '5px' }}
            />
        </label>

        <label>
             Purpose:
             <textarea 
                name="request_purpose"
                value={formData.request_purpose}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
             />
        </label>

        <button 
            type="submit" 
            style={{
                marginTop: '10px', 
                padding: '12px', 
                backgroundColor: '#1a1f63', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer'
            }}
        >
            Submit Request
        </button>
      </form>
    </div>
  )
}

export default UserDashboard
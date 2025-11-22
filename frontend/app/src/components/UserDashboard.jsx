import { useState, useEffect } from 'react'
import axiosInstance from '../utils/axios'
import { jwtDecode } from "jwt-decode"; // Optional: if you want to display the user's name from token

function UserDashboard() {
  // 1. User "Memory": We get user info from the token automatically
  const [username, setUsername] = useState('');

  // 2. Form State
  const [formData, setFormData] = useState({
    request: '',            // The document to be requested
    year_level: '1st Year', // Default value
    is_graduate: false,     // Alumni status
    last_attended: '',      // Only if is_graduate is true
    clearance_status: false,
    affiliation: 'Student', // Will change based on is_graduate
    request_purpose: ''
  });

  const [clearanceImage, setClearanceImage] = useState(null);

  useEffect(() => {
    // Optional: Decode token to show "Welcome, [Name]"
    const token = localStorage.getItem('access_token'); // Or wherever you store it
    if (token) {
        try {
            const decoded = jwtDecode(token);
            setUsername(decoded.username); 
        } catch{
            console.error("Invalid token");
        }
    }
  }, []);

  // Handle Text/Select/Checkbox changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      // Auto-update affiliation logic
      if (name === 'is_graduate') {
        newData.affiliation = checked ? 'Alumni' : 'Student';
        if (!checked) newData.last_attended = ''; // Clear SY if unchecked
      }
      return newData;
    });
  };

  // Handle File Change specifically
  const handleFileChange = (e) => {
    setClearanceImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. Prepare FormData (Required for Image Uploads)
    const dataToSend = new FormData();
    dataToSend.append('request', formData.request);
    dataToSend.append('year_level', formData.year_level);
    dataToSend.append('is_graduate', formData.is_graduate); // Converts to string "true"/"false"
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
      // The Backend will automatically grab the 'user' from the Authorization header
      await axiosInstance.post('/requests/create/', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Request submitted successfully!');
      // Reset form
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
    <div className="dashboard-container">
      <h1>Submit a Request</h1>
      {username && <p>Logged in as: <strong>{username}</strong></p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        
        {/* Document Name */}
        <label>
            Document to Request:
            <input 
                type="text" 
                name="request"
                value={formData.request}
                onChange={handleChange}
                placeholder="e.g. Transcript of Records"
                required
            />
        </label>

        {/* Year Level */}
        <label>
            Year Level:
            <select name="year_level" value={formData.year_level} onChange={handleChange}>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
                <option value="Graduate Studies">Graduate Studies</option>
            </select>
        </label>

        {/* Alumni Status */}
        <label style={{display: 'flex', alignItems: 'center'}}>
            <input 
                type="checkbox" 
                name="is_graduate"
                checked={formData.is_graduate}
                onChange={handleChange}
            />
            &nbsp; Are you an Alumni?
        </label>

        {/* Conditional Input: Last SY Attended */}
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
                />
            </label>
        )}

        {/* Clearance Status */}
        <label style={{display: 'flex', alignItems: 'center'}}>
            <input 
                type="checkbox" 
                name="clearance_status"
                checked={formData.clearance_status}
                onChange={handleChange}
            />
            &nbsp; I am Cleared
        </label>

        {/* Image Upload */}
        <label>
            Upload Clearance Proof (Image):
            <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
            />
        </label>

        <label>
             Purpose:
             <textarea 
                name="request_purpose"
                value={formData.request_purpose}
                onChange={handleChange}
             />
        </label>

        <button type="submit" style={{marginTop: '10px', padding: '10px'}}>Submit Request</button>
      </form>
    </div>
  )
}

export default UserDashboard
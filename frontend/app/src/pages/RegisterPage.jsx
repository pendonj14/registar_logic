import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension_name: '',
        birth_date: '',
        college_program: '',
        contact_number: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Minimal required fields
        if (!formData.username || !formData.email || !formData.password || !formData.first_name || !formData.last_name) {
            setError('Please fill out username, email, password, first name and last name.');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData };
            // if birth_date is empty string, remove it so backend gets None or omits it
            if (!payload.birth_date) delete payload.birth_date;

            const res = await axios.post('/register/', payload);
            if (res.status === 201 || res.status === 200) {
                navigate('/login');
            } else {
                setError('Unexpected response from server.');
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (typeof data === 'string') setError(data);
                else if (data.error) setError(Array.isArray(data.error) ? data.error.join(', ') : data.error);
                else if (data.username) setError(Array.isArray(data.username) ? data.username.join(', ') : data.username);
                else if (data.email) setError(Array.isArray(data.email) ? data.email.join(', ') : data.email);
                else {
                    // Show first validation error if present
                    const firstKey = Object.keys(data)[0];
                    if (firstKey) {
                        const val = data[firstKey];
                        setError(typeof val === 'string' ? val : (Array.isArray(val) ? val.join(', ') : JSON.stringify(val)));
                    } else {
                        setError('Registration failed.');
                    }
                }
            } else {
                setError('Network error or server not reachable.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-amber-400' style={{ maxWidth: 700, margin: '24px auto', padding: 20 }}>
            <h2>Register</h2>
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: 8 }}>
                    <div>
                        <label>Student ID</label>
                        <input name="username" value={formData.username} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>

                    <hr />
                    <h4>Profile</h4>

                    <div>
                        <label>First name</label>
                        <input name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Middle name</label>
                        <input name="middle_name" value={formData.middle_name} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Last name</label>
                        <input name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Extension name</label>
                        <input name="extension_name" value={formData.extension_name} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Birth date</label>
                        <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                    </div>

                    <div>
                        <label>College / Program</label>
                        <input name="college_program" value={formData.college_program} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Contact number</label>
                        <input name="contact_number" value={formData.contact_number} onChange={handleChange} />
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Registering…' : 'Register'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;
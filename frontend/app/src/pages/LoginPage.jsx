import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axios';
import { AuthContext } from '../contexts/AuthContent';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axiosInstance.post('/token/', {
                username,
                password
            });
            
            const accessToken = response.data.access;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            // Update axios headers
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            // Update app state through context
            handleLogin(accessToken);
            
            // Get user role and navigate
            const decoded = jwtDecode(accessToken);
            if (decoded.is_staff) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
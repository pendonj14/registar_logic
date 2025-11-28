import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // 1. Import standard axios to bypass interceptors
import axiosInstance from '../utils/axios';
import { AuthContext } from '../contexts/AuthContent';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);

    // Hardcoded base URL for the login call to ensure it doesn't use the interceptor instance
    // This matches your settings in utils/axios.js
    const API_URL = 'http://127.0.0.1:8000/api/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError('');
        setIsLoading(true);
        
        try {
            // 2. Use standard 'axios' instead of 'axiosInstance'
            // This prevents the 401 error from triggering the auto-refresh/redirect logic in your interceptor
            const response = await axios.post(`${API_URL}token/`, {
                username,
                password
            });
            
            const accessToken = response.data.access;
            const refreshToken = response.data.refresh;
            
            const storage = rememberMe ? localStorage : sessionStorage;

            storage.setItem('access_token', accessToken);
            storage.setItem('refresh_token', refreshToken);
            
            // 3. Now set the header for future requests using the instance
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            handleLogin(accessToken);
            
            const decoded = jwtDecode(accessToken);
            if (decoded.is_staff) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (error) {
            console.error('Login failed:', error);
            
            // 4. Handle errors without refreshing
            if (error.response) {
                // The request was made and the server responded with a status code
                if (error.response.status === 401) {
                    setError('Invalid Student ID or Password.');
                } else {
                    setError(error.response.data?.detail || 'Login failed. Please check your credentials.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                setError('Server is not responding. Please check if the backend is running.');
            } else {
                // Something happened in setting up the request
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen fixed inset-0 flex overflow-hidden">
            {/* Left Half - Background Image */}
            <div className="hidden md:block w-1/2 relative bg-[url('/ustp11.png')] bg-cover bg-center bg-no-repeat shadow-[15px_0_25px_-15px_rgba(234,179,8,0.6)] z-10">
                <div className="relative z-10 h-screen flex flex-col items-center px-12 text-center">
                    <div className="flex flex-col items-center mt-40">
                        <h2 className="text-4xl font-bold text-indigo-950 mt-3">Welcome Back!</h2>
                        <img src ="/logo.png" alt="logo" className="mx-auto h-64 w-auto my-8" />
                        <p className="text-indigo-950 font-bold italic mt-4">Your Documents. Your Time.</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded mt-auto mb-12 w-full max-w-md">
                        <div className="bg-indigo-950 text-white p-2 rounded mb-4 w-fit mx-auto">
                            <p className="text-sm text-center">Simplifying Service, One Request at a Time</p>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed font-normal text-justify">
                            Powering a seamless process for the Office of the University Registrar at USTP-CDO—where academic transactions meet digital ease.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Half - Login Form */}
            <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-8 md:p-12 relative overflow-y-auto">
                {/* Background Blobs */}
                <div className="absolute -bottom-10 -left-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] rounded-full pointer-events-none"></div>
                <div className="absolute -top-50 -right-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-50 w-[25rem] h-[25rem] bg-[radial-gradient(circle,rgba(255,237,195,0.6),transparent_70%)] rounded-full pointer-events-none"></div>

                <div className="absolute top-8 right-8 z-20">
                    <p className="text-gray-600">
                        Don't have an account? 
                        <Link to="/register" className="text-indigo-950 font-semibold ml-2 hover:text-indigo-950">
                            Sign Up!
                        </Link>
                    </p>
                </div>

                <div className="w-full max-w-md z-10">
                    <h1 className="text-3xl font-bold text-indigo-950 mb-8 text-center">Login</h1>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="space-y-2">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
                                placeholder="Student ID"
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
                                placeholder="Password"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            
                            <Link to="/forgot-password" className="text-sm text-indigo-950 hover:text-blue-950 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center font-medium animate-pulse">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-950 text-white py-3 px-4 rounded-lg hover:bg-indigo-900 transition duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-opacity-50 disabled:opacity-70"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
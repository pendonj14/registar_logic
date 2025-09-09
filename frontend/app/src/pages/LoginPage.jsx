import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axios';
import { AuthContext } from '../contexts/AuthContent';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
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
            if (rememberMe) {
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', response.data.refresh);
            }
            
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
        <div className="h-screen w-screen fixed inset-0 flex overflow-hidden">
            {/* Left Half - Background Image */}
            <div className="w-1/2 relative bg-[url('/ustp11.png')] bg-cover bg-center bg-no-repeat shadow-[15px_0_25px_-15px_rgba(234,179,8,0.6)] z-10">
                <div className="relative z-10 h-screen flex flex-col items-center px-12 text-center">
                    <div className="flex flex-col items-center mt-50">
                        <h2 className="text-4xl font-bold text-indigo-950 mt-3">Welcome Back!</h2>
                        <img src ="/logo.png" alt="logo" className="mx-auto h-90 w-auto fixed inset-y-30" />
                        <p className="text-indigo-950 font-bold italic mt-20">Your Documents. Your Time.</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded mt-auto mb-12 w-full max-w-md">
                        <div className="bg-indigo-950 text-white p-2 rounded mb-4 w-fit flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm sm:text-base text-center sm:text-left break-words">Simplifying Service, One Request at a Time</p>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed font-normal text-justify">
                            Powering a seamless process for the Office of the University Registrar at USTP-CDO—where academic transactions meet digital ease.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Half - Login Form */}
            <div className="w-1/2 bg-white flex flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] rounded-full"></div>
                <div className="absolute -top-50 -right-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] rounded-full"></div>
                <div className="absolute -bottom-10 -right-50 w-[25rem] h-[25rem] bg-[radial-gradient(circle,rgba(255,237,195,0.6),transparent_70%)] rounded-full"></div>
                <div className="absolute top-8 right-8">
                    <p className="text-gray-600">
                        Don't have an account? 
                        <Link to="/register" className="text-indigo-950 font-semibold ml-2 hover:text-indigo-950">
                            Sign Up!
                        </Link>
                    </p>
                </div>

                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-indigo-950 mb-8 text-center">Login</h1>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="space-y-2">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500
                                autofill:bg-white autofill:text-gray-900
                                [-webkit-text-fill-color:theme(colors.gray.900)]
                                [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                transition-all duration-500"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500
                                autofill:bg-white autofill:text-gray-900
                                [-webkit-text-fill-color:theme(colors.gray.900)]
                                [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                transition-all duration-500"
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
                            
                            <a href="#" className="text-sm text-indigo-950 hover:text-blue-950">
                                Forgot password?
                            </a>
                        </div>

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        
                        <button 
                            type="submit"
                            className="w-full bg-indigo-950 text-white py-3 px-4 rounded-lg hover:bg-indigo-900 transition duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-opacity-50"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
  );
};

export default Login;

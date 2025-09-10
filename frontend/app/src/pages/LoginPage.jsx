import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axios';
import { AuthContext } from '../contexts/AuthContent';

const Login = () => {
    // State hooks for form inputs and error handling
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // React Router navigation hook
    const navigate = useNavigate();

    // Access login handler from context (global auth state)
    const { handleLogin } = useContext(AuthContext);

    // 🔑 Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Send login request to Django backend
            const response = await axiosInstance.post('/token/', {
                username,
                password
            });
            
            // Extract access token
            const accessToken = response.data.access;

            // If "Remember Me" is checked, store tokens in localStorage
            if (rememberMe) {
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', response.data.refresh);
            }
            
            // Update axios default headers for authenticated requests
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            // Update global auth state via context
            handleLogin(accessToken);
            
            // Decode JWT to check user role
            const decoded = jwtDecode(accessToken);

            // Redirect user depending on their role
            if (decoded.is_staff) {
                navigate('/admin', { replace: true }); // Admin dashboard
            } else {
                navigate('/dashboard', { replace: true }); // Regular user homepage
            }
        } catch (error) {
            // Handle failed login attempts
            console.error('Login failed:', error);
            setError(error.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <div className="h-screen w-screen fixed inset-0 flex flex-col md:flex-row overflow-hidden">
            {/* LEFT HALF - Background + Mobile Login Form */}
            <div className="w-full md:w-1/2 relative bg-[url('/ustp11.png')] bg-cover bg-center bg-no-repeat shadow-[15px_0_25px_-15px_rgba(234,179,8,0.6)] z-10">
                <div className="relative z-10 h-screen flex flex-col items-center px-12 text-center">

                    {/* Welcome text + logo */}
                    <div className="flex flex-col items-center mt-30 md:mt-40">
                        <h2 className="text-4xl font-bold text-indigo-950 mt-3">Welcome Back!</h2>
                        <img src="/logo.png" alt="logo" className="mx-auto h-90 w-auto fixed inset-y-15 -translate-y-6 md:translate-y-6" />
                        <p className="text-indigo-950 font-bold italic mt-20">Your Documents. Your Time.</p>
                    </div>

                    {/* Mobile-only Login form */}
                    <div className="w-full max-w-md mt-4 md:hidden">
                        <h1 className="text-3xl font-bold text-indigo-950 mb-8 text-center">Login</h1>

                        <form onSubmit={handleSubmit} className="w-full space-y-6">
                            {/* Username input */}
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

                            {/* Password input */}
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

                            {/* Remember me + Forgot password */}
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

                            {/* Error message if login fails */}
                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                            
                            {/* Submit button */}
                            <button 
                                type="submit"
                                className="w-full bg-indigo-950 text-white py-3 px-4 rounded-lg hover:bg-indigo-900 transition duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-opacity-50"
                            >
                                Login
                            </button>
                        </form>
                    </div>

                    {/* Sign-up link (mobile only) */}
                    <div className="absolute top-8 right-8 md:hidden">
                        <p className="text-gray-600">
                            Don't have an account? 
                            <Link to="/register" className="text-indigo-950 font-semibold ml-2 hover:text-indigo-950">
                                Sign Up!
                            </Link>
                        </p>
                    </div>
                    
                    {/* Tagline box at bottom */}
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded mt-auto mb-20 w-full max-w-md">
                        <div className="bg-indigo-950 text-white p-2 rounded mb-4 w-fit flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm sm:text-base text-center sm:text-left break-words">Simplifying Service, One Request at a Time</p>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed font-normal text-justify">
                            Powering a seamless process for the Office of the University Registrar at USTP-CDO—where academic transactions meet digital ease.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT HALF - Desktop Login Form */}
            <div className="hidden md:flex w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
                {/* Decorative background glows */}
                <div className="absolute -bottom-10 -left-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] rounded-full"></div>
                <div className="absolute -top-50 -right-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] rounded-full"></div>
                <div className="absolute -bottom-10 -right-50 w-[25rem] h-[25rem] bg-[radial-gradient(circle,rgba(255,237,195,0.6),transparent_70%)] rounded-full"></div>

                {/* Sign-up link (desktop only) */}
                <div className="absolute top-8 right-8">
                    <p className="text-gray-600">
                        Don't have an account? 
                        <Link to="/register" className="text-indigo-950 font-semibold ml-2 hover:text-indigo-950">
                            Sign Up!
                        </Link>
                    </p>
                </div>

                {/* Desktop Login Form */}
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-indigo-950 mb-8 text-center">Login</h1>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        {/* Username */}
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

                        {/* Password */}
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

                        {/* Remember me + Forgot password */}
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

                        {/* Error message */}
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        
                        {/* Submit */}
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

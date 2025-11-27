import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { ArrowLeft, Mail, CheckCircle, User, Calendar, Lock } from 'lucide-react';

const ForgotPassword = () => {
    // Steps: 1 = Verify Identity, 2 = Set New Password, 3 = Success
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        birth_date: '',
        new_password: '',
        confirm_password: ''
    });

    // Ref for the date input
    const dateInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Helper to open date picker
    const handleCalendarClick = () => {
        if (dateInputRef.current) {
            if (dateInputRef.current.showPicker) {
                dateInputRef.current.showPicker();
            } else {
                dateInputRef.current.focus();
            }
        }
    };

    // Step 1: Verify User Credentials
    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await axiosInstance.post('/verify-reset-credentials/', {
                username: formData.username,
                email: formData.email,
                birth_date: formData.birth_date
            });
            setStep(2);
        } catch (err) {
            console.error('Verification failed:', err);
            setError(
                err.response?.data?.error || 
                'Details do not match our records. Please check your inputs.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.new_password !== formData.confirm_password) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            await axiosInstance.post('/reset-password-confirm/', {
                username: formData.username,
                email: formData.email,
                birth_date: formData.birth_date,
                new_password: formData.new_password
            });
            setStep(3); 
        } catch (err) {
            console.error('Reset failed:', err);
            setError(
                err.response?.data?.error || 
                'Failed to reset password. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Changed layout to min-h-screen for scrolling on small devices
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
            
            {/* LEFT HALF - Background (Hidden on Mobile) */}
            <div className="hidden md:block w-1/2 relative bg-[url('/ustp11.png')] bg-cover bg-center bg-no-repeat shadow-[15px_0_25px_-15px_rgba(234,179,8,0.6)] z-10">
                <div className="relative z-10 h-full flex flex-col items-center px-12 text-center justify-center bg-black/10 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center">
                        <img src="/logo.png" alt="logo" className="h-80 w-auto mb-8" />
                        <h2 className="text-4xl font-bold text-indigo-950">Account Recovery</h2>
                        <p className="text-indigo-950 font-bold italic mt-4 text-xl">Verify & Reset.</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl mt-20 w-full max-w-md border border-white/20">
                        <p className="text-neutral-800 text-sm leading-relaxed font-medium text-justify">
                            To ensure account security, please verify your identity by providing your registered Student ID, Email, and Birth Date.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT HALF - Form Area (Scrollable on Mobile) */}
            <div className="w-full md:w-1/2 flex flex-col relative">
                
                {/* Mobile Background Overlay */}
                <div className="absolute inset-0 bg-[url('/ustp11.png')] bg-cover bg-center opacity-10 md:hidden pointer-events-none"></div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
                    <div className="w-full max-w-md py-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-[#1a1f63] mb-6">
                                {step === 3 ? <CheckCircle size={32} /> : <Lock size={32} />}
                            </div>
                            <h1 className="text-3xl font-bold text-[#1a1f63] mb-2">
                                {step === 1 && 'Verify Identity'}
                                {step === 2 && 'Set New Password'}
                                {step === 3 && 'Password Reset!'}
                            </h1>
                            <p className="text-gray-500">
                                {step === 1 && 'Enter your details to find your account.'}
                                {step === 2 && 'Please create a strong new password.'}
                                {step === 3 && 'Your password has been successfully updated.'}
                            </p>
                        </div>

                        {step === 3 ? (
                            /* SUCCESS VIEW */
                            <div className="space-y-6">
                                <Link to="/login">
                                    <button 
                                        className="w-full py-3 px-4 rounded-lg bg-[#1a1f63] text-white font-semibold hover:bg-indigo-900 transition duration-300 shadow-lg"
                                    >
                                        Back to Login
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            /* FORMS */
                            <form onSubmit={step === 1 ? handleVerify : handleResetPassword} className="space-y-5">
                                
                                {/* STEP 1: VERIFICATION FIELDS */}
                                {step === 1 && (
                                    <>
                                        <div className="space-y-1">
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Student ID</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    id="username"
                                                    type="text"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all bg-white"
                                                    placeholder="Student ID"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all bg-white"
                                                    placeholder="Registered Email"
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Birth Date</label>
                                            <div className="relative">
                                                {/* Calendar Icon - Now Clickable */}
                                                <button 
                                                    type="button"
                                                    onClick={handleCalendarClick}
                                                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-[#1a1f63] transition-colors focus:outline-none"
                                                >
                                                    <Calendar size={18} />
                                                </button>
                                                <input
                                                    ref={dateInputRef}
                                                    id="birth_date"
                                                    type="date"
                                                    value={formData.birth_date}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all bg-white cursor-pointer"
                                                    disabled={isLoading}
                                                    onClick={handleCalendarClick} // Also open picker on input click
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* STEP 2: NEW PASSWORD FIELDS */}
                                {step === 2 && (
                                    <>
                                        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-sm text-indigo-800 mb-4">
                                            <span className="font-bold">Verified:</span> {formData.username}
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <label htmlFor="new_password" class="block text-sm font-medium text-gray-700">New Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    id="new_password"
                                                    type="password"
                                                    value={formData.new_password}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all bg-white"
                                                    placeholder="New Password"
                                                    disabled={isLoading}
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="confirm_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    id="confirm_password"
                                                    type="password"
                                                    value={formData.confirm_password}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all bg-white"
                                                    placeholder="Confirm New Password"
                                                    disabled={isLoading}
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
                                        {error}
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-3 px-4 rounded-lg transition duration-300 font-semibold text-white shadow-lg ${
                                        isLoading 
                                            ? 'bg-indigo-700 cursor-not-allowed' 
                                            : 'bg-[#1a1f63] hover:bg-indigo-900 hover:shadow-xl'
                                    }`}
                                >
                                    {isLoading 
                                        ? 'Processing...' 
                                        : step === 1 ? 'Verify Identity' : 'Update Password'
                                    }
                                </button>

                                <div className="text-center mt-8">
                                    <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-[#1a1f63] transition-colors text-sm font-medium">
                                        <ArrowLeft size={16} className="mr-2" /> Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                    
                    {/* Footer Copy */}
                    <div className="w-full text-center text-xs text-gray-400 mt-auto">
                        &copy; 2024 iRequest System. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension_name: '',
        birth_date: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);
            console.log('Registration successful:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            setError(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        {/* Account Information */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Student ID
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Personal Information */}
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">
                                Middle Name (Optional)
                            </label>
                            <input
                                id="middle_name"
                                name="middle_name"
                                type="text"
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.middle_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="extension_name" className="block text-sm font-medium text-gray-700">
                                Name Extension (Optional)
                            </label>
                            <input
                                id="extension_name"
                                name="extension_name"
                                type="text"
                                placeholder="e.g., Jr., Sr., III"
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.extension_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                                Birth Date
                            </label>
                            <input
                                id="birth_date"
                                name="birth_date"
                                type="date"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.birth_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
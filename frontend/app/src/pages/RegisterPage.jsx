import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

    const [step, setStep] = useState(1); // <-- step state added
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill out Student ID, Email, and Password.');
            return;
        }

        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.first_name || !formData.last_name) {
            setError('Please fill out first name and last name.');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData };
            if (payload.birth_date) {
            payload.birth_date = new Date(payload.birth_date)
                .toISOString()
                .split('T')[0]; // "1987-05-19"
            } else {
                delete payload.birth_date;
            } 

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
                    const firstKey = Object.keys(data)[0];
                    if (firstKey) {
                        const val = data[firstKey];
                        setError(typeof val === 'string' ? val : (Array.isArray(val) ? val.join(', ') : JSON.stringify(val)));
                    } else setError('Registration failed.');
                }
            } else setError('Network error or server not reachable.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen fixed inset-0 flex flex-col md:flex-row overflow-hidden">
            {/* LEFT SIDE */}
            <div className="w-full md:w-1/2 bg-white flex flex-col justify-center relative overflow-hidden p-6 md:p-12 h-screen">
                <div className="absolute -bottom-10 -left-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] pointer-events-none rounded-full"></div>
                <div className="absolute -bottom-10 -right-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] pointer-events-none rounded-full"></div>
                <div className="absolute -top-50 -left-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] pointer-events-none rounded-full"></div>

                <div className="absolute top-8 left-8">
                    <p className="text-gray-600">
                        Have an account already?{' '}
                        <Link to="/login" className="text-indigo-950 font-semibold hover:text-indigo-800">
                            Login!
                        </Link>
                    </p>
                </div>

                <div className="w-full max-w-md mx-auto relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-indigo-950 mb-6 sm:mb-6 text-center">Registration</h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3">
                            {error}
                        </div>
                    )}

                    <form 
                        onSubmit={handleSubmit} 
                        className="flex flex-col h-full space-y-3 max-h-[60vh] overflow-y-auto scroll-hidden pr-2"
                    >
                        {/* Step 1 */}
                        {step === 1 && (
                            <>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Student ID Number"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
                                     autofill:bg-white autofill:text-gray-900
                                      [-webkit-text-fill-color:theme(colors.gray.900)]
                                      [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                      transition-all duration-500"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
                                     autofill:bg-white autofill:text-gray-900
                                      [-webkit-text-fill-color:theme(colors.gray.900)]
                                      [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                      transition-all duration-500"
                                />
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 pr-10
                                         autofill:bg-white autofill:text-gray-900
                                          [-webkit-text-fill-color:theme(colors.gray.900)]
                                          [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                          transition-all duration-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-700"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="w-full bg-indigo-950 text-white py-2 sm:py-3 px-3 sm:px-4 rounded hover:bg-indigo-900 transition duration-300 font-semibold text-sm sm:text-base"
                                >
                                    Next
                                </button>
                            </>
                        )}

                        {/* Step 2 */}
                        {step === 2 && (
                            <>
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="First Name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
                                     autofill:bg-white autofill:text-gray-900
                                      [-webkit-text-fill-color:theme(colors.gray.900)]
                                      [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                      transition-all duration-500"
                                    
                                />
                                <input
                                    type="text"
                                    name="middle_name"
                                    placeholder="Middle Name"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
                                     autofill:bg-white autofill:text-gray-900
                                      [-webkit-text-fill-color:theme(colors.gray.900)]
                                      [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                      transition-all duration-500"
                                />
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Last Name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
                                     autofill:bg-white autofill:text-gray-900
                                      [-webkit-text-fill-color:theme(colors.gray.900)]
                                      [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                      transition-all duration-500"
                                />
                                <input
                                    type="text"
                                    name="extension_name"
                                    placeholder="Extension Name"
                                    value={formData.extension_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
                                     autofill:bg-white autofill:text-gray-900
                                      [-webkit-text-fill-color:theme(colors.gray.900)]
                                      [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                      transition-all duration-500"
                                />
                                <DatePicker
                                    selected={formData.birth_date ? new Date(formData.birth_date) : null}
                                    onChange={(date) =>
                                      setFormData((prev) => ({ ...prev, birth_date: date }))
                                    }
                                    placeholderText="Birthdate"
                                    showMonthDropdown
                                    showYearDropdown
                                    yearDropdownItemNumber={100}
                                    maxDate={new Date()}
                                    scrollableYearDropdown
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base
                                     autofill:bg-white autofill:text-gray-900
                                      [-webkit-text-fill-color:theme(colors.gray.900)]
                                      [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                      transition-all duration-500"
                                />
                                <input
                                    type="text"
                                    name="college_program"
                                    placeholder="College / Program"
                                    value={formData.college_program}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
                                     autofill:bg-white autofill:text-gray-900
                                      [-webkit-text-fill-color:theme(colors.gray.900)]
                                      [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                      transition-all duration-500"
                                />
                                <input
                                    type="text"
                                    name="contact_number"
                                    placeholder="Contact Number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
                                     autofill:bg-white autofill:text-gray-900
                                      [-webkit-text-fill-color:theme(colors.gray.900)]
                                      [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                                      transition-all duration-500"
                                />

                                <div className="flex justify-between mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-300"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-indigo-950 text-white py-2 px-4 rounded hover:bg-indigo-900 transition duration-300 font-semibold"
                                    >
                                        {loading ? 'Registering…' : 'Register'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden md:flex w-full md:w-1/2 relative bg-[url('/ustp11.png')] bg-cover bg-center bg-no-repeat shadow-[-15px_0_25px_-15px_rgba(234,179,8,0.6)] flex flex-col items-center text-center p-12">
                <h2 className="text-xl font-bold text-indigo-950 mt-35">Get Started With iREQUEST</h2>
                <img src="/logo.png" alt="logo" className="mx-auto h-[22rem] w-auto fixed inset-y-[3.75rem] -translate-y-6 md:translate-y-6" />
                <p className="text-indigo-950 font-bold italic mt-20">Your Documents. Your Time.</p>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded mt-auto mb-12 w-full max-w-md">
                    <div className="bg-indigo-950 text-white p-2 rounded mb-4 w-fit">
                        <p className="text-sm sm:text-base text-center sm:text-left break-words">
                            Create Your Account to Get Started
                        </p>
                    </div>
                    <p className="text-neutral-500 text-sm leading-relaxed font-normal text-justify">
                        Please provide accurate details, including your Student ID Number, to ensure your
                        identity is verified and your requests are processed efficiently.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

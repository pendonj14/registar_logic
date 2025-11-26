import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';

const Register = () => {
    // State for form data
    const [formData, setFormData] = useState({
        username: '', // Student ID
        email: '',
        password: '',
        confirm_password: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        extension_name: '',
        birth_date: '',
        college_program: '',
        contact_number: ''
    });

    // State for UI control
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Dropdown specific state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null); // Ref to handle clicking outside
    
    // Visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const navigate = useNavigate();

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // Program Data
    const programOptions = [
        {
            college: "College of Engineering & Architecture",
            programs: [
                "B.S. in Architecture",
                "B.S. in Civil Engineering",
                "B.S. in Computer Engineering - CEA",
                "B.S. in Electrical Engineering",
                "B.S. in Electronics Engineering",
                "B.S. in Geodetic Engineering",
                "B.S. in Mechanical Engineering"
            ]
        },
        {
            college: "College of Information Technology and Computing",
            programs: [
                "B.S. in Computer Science",
                "B.S. in Data Science",
                "B.S. in Information Technology",
                "B.S. in Technology Communication Management"
            ]
        },
        {
            college: "College of Science and Technology Education",
            programs: [
                "Bachelor of Science in Food Technology",
                "Bachelor in Technical-Vocational Teacher Education",
                "Bachelor of Secondary Education",
                "Bachelor of Secondary Education Major in Science",
                "Bachelor of Technology and Livelihood Education-HE"
            ]
        },
        {
            college: "College of Technology",
            programs: [
                "B.S. in Electro-Mechanical Technology",
                "Bachelor of Science in Autotronics Technology (BSAT)",
                "Bachelor of Science in Electronics Technology (ES)",
                "Bachelor of Science in Electronics Technology (MST)",
                "Bachelor of Science in Electronics Technology (TN)",
                "Bachelor of Science in Energy Systems and Management",
                "Bachelor of Science in Energy Systems and Management (EMCM)",
                "Bachelor of Science in Energy Systems and Management (PSDE)",
                "Bachelor of Science in Manufacturing Engineering Technology"
            ]
        }
    ];

    // Filter logic for the search engine
    const filteredOptions = useMemo(() => {
        if (!searchTerm) return programOptions;
        
        return programOptions.map(group => {
            const filteredPrograms = group.programs.filter(p => 
                p.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return { ...group, programs: filteredPrograms };
        }).filter(group => group.programs.length > 0);
    }, [searchTerm]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'contact_number') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 11) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
        } 
        else if (name === 'username') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleProgramSelect = (program) => {
        setFormData(prev => ({ ...prev, college_program: program }));
        setIsDropdownOpen(false);
        setSearchTerm(""); // Reset search after selection
    };

    // Validate Step 1 before moving to Step 2
    const handleNext = () => {
        setError('');
        
        if (!formData.username || !formData.email || !formData.password || !formData.confirm_password) {
            setError('Please fill out all fields in this section.');
            return;
        }

        if (formData.username.length !== 10) {
            setError('Student ID must be exactly 10 digits.');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match.');
            return;
        }

        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.first_name || !formData.last_name || !formData.college_program) {
            setError('Please fill out First Name, Last Name, and Program.');
            return;
        }

        if (formData.contact_number && formData.contact_number.length !== 11) {
            setError('Contact number must be exactly 11 digits.');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData };
            delete payload.confirm_password; 
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

    // Shared styling
    const inputClassName = "w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 autofill:bg-white autofill:text-gray-900 [-webkit-text-fill-color:theme(colors.gray.900)] [-webkit-box-shadow:0_0_0px_1000px_white_inset] transition-all duration-500 bg-white";

    // Eye Icon
    const EyeIcon = ({ isVisible }) => (
        isVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    );

    return (
        <div className="flex h-screen w-screen fixed inset-0 flex flex-col md:flex-row overflow-hidden">
            {/* LEFT SIDE */}
            <div className="w-full md:w-1/2 bg-white flex flex-col justify-center relative overflow-hidden p-6 md:p-12 h-screen">
                {/* Background Blobs */}
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
                    <h1 className="text-3xl font-bold text-indigo-950 text-center mb-2">Register</h1>

                    {/* Progress Pills */}
                    <div className="flex justify-center gap-2 mb-6">
                        <div className={`h-2 w-8 rounded-full transition-colors duration-300 ${step === 1 ? 'bg-indigo-950' : 'bg-gray-200'}`}></div>
                        <div className={`h-2 w-8 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-indigo-950' : 'bg-gray-200'}`}></div>
                    </div>

                    <h2 className="text-xl font-semibold text-indigo-950 text-center mb-6">
                        {step === 1 ? 'Account Details' : 'Profile Information'}
                    </h2>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3 text-sm">
                            {error}
                        </div>
                    )}

                    <form 
                        onSubmit={handleSubmit} 
                        className="flex flex-col h-full max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar"
                    >
                        {/* PART 1: Account Information */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Student ID Number (10 digits)"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                />
                                
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClassName} pr-10`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-700"
                                    >
                                        <EyeIcon isVisible={showPassword} />
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm_password"
                                        placeholder="Confirm Password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClassName} pr-10`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-700"
                                    >
                                        <EyeIcon isVisible={showConfirmPassword} />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full bg-indigo-950 text-white py-3 px-4 rounded hover:bg-indigo-900 transition duration-300 font-semibold mt-4"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* PART 2: Profile Information */}
                        {step === 2 && (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="First Name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                />
                                <input
                                    type="text"
                                    name="middle_name"
                                    placeholder="Middle Name"
                                    value={formData.middle_name}
                                    onChange={handleChange}
                                    className={inputClassName}
                                />
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Last Name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                />
                                <input
                                    type="text"
                                    name="extension_name"
                                    placeholder="Extension Name (e.g., Jr.)"
                                    value={formData.extension_name}
                                    onChange={handleChange}
                                    className={inputClassName}
                                />
                                <div className='flex flex-col'>
                                    <label className="text-xs text-gray-500 ml-1 mb-1">Birth Date</label>
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={formData.birth_date}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>

                                {/* Custom SEARCHABLE Dropdown */}
                                <div className="relative w-full" ref={dropdownRef}>
                                    {/* Trigger (Looks exactly like other inputs) */}
                                    <div 
                                        className={`${inputClassName} cursor-pointer flex items-center justify-between text-left`}
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span className={`block truncate ${formData.college_program ? "text-gray-900" : "text-gray-400"}`}>
                                            {formData.college_program || "Select Program"}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>

                                    {/* Dropdown List - Floating Overlay */}
                                    {isDropdownOpen && (
                                        <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-300 rounded shadow-2xl z-50 max-h-60 flex flex-col overflow-hidden">
                                            {/* Search Engine (Top) */}
                                            <div className="p-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                                                <div className="relative">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <input
                                                        type="text"
                                                        placeholder="Search program..."
                                                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-500"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            {/* Scrollable Options */}
                                            <div className="overflow-y-auto custom-scrollbar flex-1">
                                                {filteredOptions.length === 0 ? (
                                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No programs found</div>
                                                ) : (
                                                    filteredOptions.map((college, idx) => (
                                                        <div key={idx}>
                                                            <div className="px-3 py-2 bg-gray-100 text-xs font-bold text-indigo-900 uppercase tracking-wide sticky top-0">
                                                                {college.college}
                                                            </div>
                                                            {college.programs.map((prog, pIdx) => (
                                                                <div 
                                                                    key={pIdx}
                                                                    onClick={() => handleProgramSelect(prog)}
                                                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 hover:text-indigo-900 transition-colors border-b border-gray-50 last:border-b-0 ${formData.college_program === prog ? 'bg-indigo-50 text-indigo-900 font-medium' : 'text-gray-700'}`}
                                                                >
                                                                    {prog}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    name="contact_number"
                                    placeholder="Contact Number (11 digits)"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    className={inputClassName}
                                />

                                <div className="flex justify-between gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-1/3 bg-gray-200 text-gray-700 py-3 px-3 rounded hover:bg-gray-300 transition duration-300 font-semibold"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-2/3 bg-indigo-950 text-white py-3 px-3 rounded hover:bg-indigo-900 transition duration-300 font-semibold"
                                    >
                                        {loading ? 'Registering...' : 'Register'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* RIGHT SIDE (Unchanged) */}
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
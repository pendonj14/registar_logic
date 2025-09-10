import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Register = () => {
  
  // State for all input fields
  
  const [formData, setFormData] = useState({
    username: '',       // Student ID
    email: '',
    password: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    extension_name: '',
    birth_date: null,
    yearLevel: '',
    college: '',
    program: '',
    phone: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  // DATA - Colleges and Programs
const colleges = {
  "College of Engineering and Architecture": [
    "Bachelor of Science in Architecture",
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electronics Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Mechanical Engineering",
    "Bachelor of Science in Computer Engineering",
    "Bachelor of Science in Geodetic Engineering",
  ],
  "College of Information Technology and Computing": [
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Data Science",
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Technology Communication Management",
    "Bachelor of Science in Electronics Technology",
  ],
  "College of Science and Mathematics": [
    "Bachelor of Science in Applied Physics",
    "Bachelor of Science in Applied Mathematics",
    "Bachelor of Science in Chemistry",
    "Bachelor of Science in Environmental Science",
  ],
  "College of Science and Technology Education": [
    "Bachelor in Technology and Livelihood Education",
    "Bachelor in Technical-Vocational Teacher Education",
    "Bachelor of Secondary Education",
  ],
  "College of Technology": [
    "Bachelor of Science in Autotronics",
    "Bachelor of Science in Electro-Mechanical Technology",
    "Bachelor of Science in Manufacturing Engineering Technology",
    "Bachelor of Science in Energy Systems and Management",
  ],
};



  // Change handlers
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  // Submit handler (connects to backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
    // Format birth_date to YYYY-MM-DD
    const payload = {
      ...formData,
      birth_date: formData.birth_date
        ? formData.birth_date.toISOString().split("T")[0]
        : null,
    };

    // API request to register endpoint
    const response = await axios.post(
      'http://127.0.0.1:8000/api/register/',
      payload
    );

    console.log('Registration successful:', response.data);
    navigate('/login'); // Redirect after successful registration
  } catch (err) {
    console.error('Registration failed:', err);
    setError(err.response?.data?.error || 'Registration failed');
  }
};

  return (
    <div className="flex h-screen w-screen fixed inset-0 flex flex-col md:flex-row overflow-hidden">

      {/* LEFT SIDE - White Background with Gradient Circles Contains the Registration For */}

      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center relative overflow-hidden p-6 md:p-12 h-screen">
        {/* Gradient Circle Decorations */}
        <div className="absolute -bottom-10 -left-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] pointer-events-none rounded-full"></div>
        <div className="absolute -bottom-10 -right-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] pointer-events-none rounded-full"></div>
        <div className="absolute -top-50 -left-50 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(255,237,195,0.7),transparent_70%)] pointer-events-none rounded-full"></div>

        {/* Top Left - "Have an account?" */}
        <div className="absolute top-8 left-8">
          <p className="text-gray-600">
            Have an account already?{' '}
            <Link to="/login" className="text-indigo-950 font-semibold hover:text-indigo-800">
              Login!
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <div className="w-full max-w-md mx-auto relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-950 mb-6 sm:mb-6 text-center">Registration</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-3 max-h-[60vh] overflow-y-auto scroll-hidden pr-2">
            {/* Full Name Input */}
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
               autofill:bg-white autofill:text-gray-900
                [-webkit-text-fill-color:theme(colors.gray.900)]
                [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                transition-all duration-500"
            />
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name (Optional)"
              value={formData.middle_name}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
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
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
              autofill:bg-white autofill:text-gray-900
                [-webkit-text-fill-color:theme(colors.gray.900)]
                [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                transition-all duration-500"
            />
            <input
              type="text"
              name="extension_name"
              placeholder="Extension Name (e.g., Jr., Sr.)"
              value={formData.extension_name}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
              autofill:bg-white autofill:text-gray-900
                [-webkit-text-fill-color:theme(colors.gray.900)]
                [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                transition-all duration-500"
            />

            {/* Student ID Input*/}
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

            {/* Year Level Dropdown */}
            <div className="w-full">
              <select
                name="yearLevel"
                value={formData.yearLevel}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border bg-white border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Year Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* College Dropdown*/}
            <div className="w-full">
              <select
                name="college"
                value={formData.college}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    college: e.target.value,
                    program: "", // reset program whenever college changes
                  })
                }
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border bg-white border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select College</option>
                {Object.keys(colleges).map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Program Dropdown */}
            <div className="w-full">
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
                disabled={!formData.college} // disable until college selected
                 className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500  bg-white disabled:bg-white
                          ${!formData.program ? 'text-gray-500' : 'text-gray-900'} disabled:opacity-100 disabled:text-gray-500`} // keep box visible even when disabled
              >
                <option value="">Select Program</option>
                {formData.college &&
                  colleges[formData.college].map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
              </select>
            </div>

            {/* Phone Number Input */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
              autofill:bg-white autofill:text-gray-900
                [-webkit-text-fill-color:theme(colors.gray.900)]
                [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                transition-all duration-500"
            />

            {/* Email Input */}
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

            {/* Birthdate Picker */}
            <div className="w-full">
              <DatePicker
                selected={formData.birth_date}
                onChange={(date) => setFormData({ ...formData, birth_date: date })}
                dateFormat="yyyy-MM-dd"  // matches Django DateField format
                placeholderText="Birthdate"
                wrapperClassName='w-full'
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500
                autofill:bg-white autofill:text-gray-900
                [-webkit-text-fill-color:theme(colors.gray.900)]
                [-webkit-box-shadow:0_0_0px_1000px_white_inset]
                transition-all duration-50"
                maxDate={new Date()} // optional: prevent future dates
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                required
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="relative mt-5">
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
                {showPassword ? (
                  // Eye Off (SVG inline, no extra library)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.02.153-2.003.437-2.925m2.1-3.462A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10 0 1.02-.153 2.003-.437 2.925m-2.1 3.462L4.937 4.613" />
                  </svg>
                ) : (
                  // Eye (SVG inline)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Confirm Password Input with Toggle */}
            <div className="relative mt-0">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-700"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.02.153-2.003.437-2.925m2.1-3.462A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10 0 1.02-.153 2.003-.437 2.925m-2.1 3.462L4.937 4.613" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-950 text-white py-2 sm:py-3 px-3 sm:px-4 rounded hover:bg-indigo-900 transition duration-300 font-semibold text-sm sm:text-base"
            >
              Register
            </button>

            {/* Terms & Policy */}
            <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2 leading-snug">
              By continuing, you agree to iREQUEST's{' '}
              <span className="text-indigo-700 underline cursor-pointer">Terms of Services</span> and{' '}
              <span className="text-indigo-700 underline cursor-pointer">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Background Image with Tagline */}

      <div className="hidden md:flex w-full md:w-1/2 relative bg-[url('/ustp11.png')] bg-cover bg-center bg-no-repeat shadow-[-15px_0_25px_-15px_rgba(234,179,8,0.6)] flex flex-col items-center text-center p-12">
        {/* Upper Center - Title */}
        <h2 className="text-xl font-bold text-indigo-950 mt-35">Get Started With iREQUEST</h2>

        {/* Logo */}
        <img src="/logo.png" alt="logo" className="mx-auto h-90 w-auto fixed inset-y-15 -translate-y-6 md:translate-y-6" />

        {/* Tagline */}
        <p className="text-indigo-950 font-bold italic mt-20">Your Documents. Your Time.</p>

        {/* Tagline Box */}
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

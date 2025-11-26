import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContent';

const HomePage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  // Keep this as navOpen for consistency
  const [navOpen, setNavOpen] = useState(false); 
  
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.is_staff) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/USTP-CDO.jpg')" }}
      ></div>

      {/* White-to-transparent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/100 to-transparent"></div>

      <div className="absolute inset-0 pointer-events-none">
        {/* top left */}
        <div className="absolute -top-60 left-50 w-[30rem] h-[30rem] 
          bg-[radial-gradient(circle,rgba(255,237,195,1)_0%,rgba(255,237,195,0.8)_10%,rgba(255,237,195,0.5)_25%,rgba(255,237,195,0.25)_45%,rgba(255,237,195,0.1)_65%,transparent_100%)] rounded-full"></div>

        {/* bottom left */}
        <div className="absolute -bottom-50 -left-60 w-[30rem] h-[30rem] 
          bg-[radial-gradient(circle,rgba(255,237,195,1)_0%,rgba(255,237,195,0.8)_10%,rgba(255,237,195,0.5)_25%,rgba(255,237,195,0.25)_45%,rgba(255,237,195,0.1)_65%,transparent_100%)] rounded-full"></div>

        {/* bottom center */}
        <div className="absolute -bottom-80 left-80 w-[30rem] h-[30rem] 
          bg-[radial-gradient(circle,rgba(255,237,195,1)_0%,rgba(255,237,195,0.8)_10%,rgba(255,237,195,0.5)_25%,rgba(255,237,195,0.25)_45%,rgba(255,237,195,0.1)_65%,transparent_100%)] rounded-full"></div>
      </div>

      {/* HEADER (Same as PrivacyPolicy.jsx) */}
      <header className="relative z-10 w-full bg-white shadow">
        <div className="w-full px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="h-9 flex items-center">
            <img
              src="/logo.png"
              alt="iRequest Logo"
              className="h-28 -ml-2 mt-2 md:h-36 w-auto transform md:scale-[1.5] origin-left md:mt-4"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-base font-medium text-indigo-950">
            {/* Highlighted as active page */}
            <Link to="/" className="text-indigo-950 border-b-2 border-indigo-950 pb-1">
              Home
            </Link>
            <Link to="/terms" className="hover:text-indigo-700 transition duration-150">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-indigo-700 transition duration-150">
              Privacy Policy
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-indigo-950"
            onClick={() => setNavOpen(!navOpen)} 
            aria-label="Toggle navigation menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={navOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Dropdown - LOGIC COPIED FROM PRIVACYPOLICY.JSX */}
        {navOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-200 px-4 py-3 space-y-2 absolute w-full z-10">
            {/* All links use the immediate closing handler */}
            <Link to="/" className="block text-indigo-950 hover:bg-gray-100 p-2 rounded bg-indigo-50 font-semibold" onClick={() => setNavOpen(false)}>
              Home
            </Link>
            <Link to="/terms" className="block text-indigo-950 hover:bg-gray-100 p-2 rounded" onClick={() => setNavOpen(false)}>
              Terms of Service
            </Link>
            <Link to="/privacy" className="block text-indigo-950 hover:bg-gray-100 p-2 rounded" onClick={() => setNavOpen(false)}>
              Privacy Policy
            </Link>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 px-4 md:px-16 py-8 mt-9 md:mt-0">
        <div className="w-full flex flex-col items-center text-center md:items-start md:text-left md:max-w-2xl">
          
          {/* Logo */}
          <img
            src="/logo.png"
            alt="iRequest Logo"
            className="h-94 w-auto mb-0 object-contain md:ml-76"
          />

          {/* Text */}
          <h2 className="inter-font -mt-41 text-2xl md:text-[39px] font-bold text-blue-950 leading-snug mb-3 w-full md:w-[80rem] md:ml-78">
            <span className="italic">Your Documents.</span><br />
            <span className="italic">Your Time.</span>
          </h2>

          <p className="-mt-4 mb-4 text-base md:text-[12px] text-gray-800 leading-relaxed w-full md:w-[17rem] font-semibold md:ml-79.5">
            Digital. Fast. Yours. Request academic documents with ease, track your progress in real time, and receive updates directly to your device.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-3 justify-center md:justify-start w-full md:w-auto md:ml-79.5 -mt-1">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-950 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold md:mt-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-950 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold md:mt-2"
            >
              Create an Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
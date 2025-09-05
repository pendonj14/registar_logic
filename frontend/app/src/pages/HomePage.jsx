import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContent';

const HomePage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full bg-white shadow">
        <div className="w-full px-4 md:px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="h-9 flex items-center">
            <img
              src="/logo.png"
              alt="iRequest Logo"
              className="h-28 -ml-2 mt-2 md:h-36 w-auto transform md:scale-[1.5] origin-left md:mt-4"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-lg text-gray-800 mr-20">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-800 text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow px-4 py-3 flex flex-col gap-3">
            <Link to="/" className="hover:underline" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/terms" className="hover:underline" onClick={() => setMenuOpen(false)}>Terms of Service</Link>
            <Link to="/privacy" className="hover:underline" onClick={() => setMenuOpen(false)}>Privacy Policy</Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center px-4 md:px-8">
        <div className="max-w-2xl w-full">
          {/* Hero Logo */}
          <img
            src="/logo.png"
            alt="iRequest Logo"
            className="
              mx-auto md:absolute md:z-20 md:h-86 md:w-auto
              md:top-[108px] md:left-[265px] md:-mb-4 md:-mt-0
              h-72 -mb-32 -mt-20
            "
          />
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 leading-9 mb-4 md:mb-6 text-center md:text-left md:ml-60 md:-mt-9">
            Your Documents.<br />
            Your Time.
          </h2>
          <p className="mb-6 md:mb-8 text-base md:text-xl text-gray-800 leading-relaxed text-center md:text-left md:ml-60 md:-mt-4">
            Digital. Fast. Yours. iRequest enables documents with ease, saves paper and time, and secures updates directly to your device.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start md:ml-60 md:-mt-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-900 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-900 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
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

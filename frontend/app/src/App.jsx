import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ForgotPassword from './pages/ForgotPassword';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { AuthContext } from './contexts/AuthContent'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
           handleLogout();
        } else {
           setIsAuthenticated(true);
           setIsAdmin(decoded.is_staff || false);
           setUser(decoded);
        }
      } catch (error) {
        console.error('Token decode error:', error);
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  // Updated to handle token decoding internally for safety
  const handleLogin = (token) => {
    try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setIsAdmin(decoded.is_staff || false);
        setUser(decoded);
    } catch (error) {
        console.error("Login Error:", error);
    }
  };

  // --- ROUTE GUARD: PUBLIC ONLY ---
  // If a user is logged in, this forces them to their dashboard.
  const PublicRoute = ({ children }) => {
    if (loading) return null; // Wait for initial auth check
    
    if (isAuthenticated) {
      return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
    }
    return children;
  };

  // --- ROUTE GUARD: PROTECTED ---
  // Standard protection for dashboards
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    if (adminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!adminOnly && isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return children;
  };

  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center text-[#1a1f63] font-bold">Loading iRequest...</div>; 
  }

  return (
    <AuthContext.Provider value={{ handleLogin, handleLogout, isAuthenticated, isAdmin, user }}>
      <ErrorBoundary>
        <Toaster position="top-center" />
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* --- PUBLIC ROUTES (Redirect to Dashboard if Logged In) --- */}
            <Route path="/home" element={
                <PublicRoute><HomePage /></PublicRoute>
            } />
            <Route path="/login" element={
                <PublicRoute><Login /></PublicRoute>
            } />
            <Route path="/register" element={
                <PublicRoute><RegisterPage /></PublicRoute>
            } />
            <Route path="/forgot-password" element={
                <PublicRoute><ForgotPassword /></PublicRoute>
            } />

            {/* --- STATIC PAGES (Always Accessible) --- */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} /> 

            {/* --- PROTECTED ROUTES --- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute adminOnly={false}>
                    <UserDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
}

export default App;
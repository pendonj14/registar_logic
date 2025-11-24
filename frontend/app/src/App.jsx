import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Login from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import TermsOfService from './pages/TermsOfService';
import './App.css';
// CHECK THIS IMPORT NAME: Usually it is AuthContext.js, not AuthContent
import { AuthContext } from './contexts/AuthContent'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  // NEW: Add a loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check both local and session storage (see Login fix below)
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
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
    // Set loading to false after check is done
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token'); // Clear session too
    sessionStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  const handleLogin = (token, decoded) => {
    setIsAuthenticated(true);
    setIsAdmin(decoded.is_staff || false);
    setUser(decoded);
  };

  // Prevent rendering routes until we know auth status
  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center">Loading...</div>; 
  }

  return (
    <AuthContext.Provider value={{ handleLogin, handleLogout, isAuthenticated, isAdmin, user }}>
      <ErrorBoundary>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/terms" element={<TermsOfService />} />

            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />}
            />
            <Route
              path="/register"
              element={!isAuthenticated ? <RegisterPage /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />}
            />

            <Route
              path="/admin"
              element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated && !isAdmin ? <UserDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
}

export default App;
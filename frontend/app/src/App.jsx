import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'
import { AuthContext } from './contexts/AuthContent'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setIsAuthenticated(true)
        setIsAdmin(decoded.is_staff || false)
      } catch (error) {
        console.error('Token decode error:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setIsAuthenticated(false)
    setIsAdmin(false)
  }

  const handleLogin = (token) => {
    const decoded = jwtDecode(token);
    setIsAuthenticated(true);
    setIsAdmin(decoded.is_staff || false);
  };

  return (
    <AuthContext.Provider value={{ handleLogin }}>
      <ErrorBoundary>
        <div>
          {isAuthenticated && (
            <nav>
              <button onClick={handleLogout}>Logout</button>
            </nav>
          )}
          
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/"} />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to={isAdmin ? "/admin" : "/"} />} 
            />
            <Route 
              path="/admin" 
              element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated && !isAdmin ? <UserDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </ErrorBoundary>
    </AuthContext.Provider>
  )
}

export default App
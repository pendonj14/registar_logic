import { createContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  handleLogin: () => {},
  handleLogout: () => {}
});

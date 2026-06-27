import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('fs_token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fs_user')); } catch { return null; }
  });

  const login = (tok, userData) => {
    localStorage.setItem('fs_token', tok);
    localStorage.setItem('fs_user', JSON.stringify(userData));
    setToken(tok); setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
  };

  const logout = () => {
    localStorage.removeItem('fs_token'); localStorage.removeItem('fs_user');
    setToken(null); setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token, isOwner: user?.role === 'owner' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

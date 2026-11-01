import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin as loginAdminApi, fetchAdminMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('lovebyte_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await fetchAdminMe();
          if (res.data.success) {
            setAdmin(res.data.data);
          }
        } catch (err) {
          console.error('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginAdminApi({ email, password });
    if (res.data.success) {
      const { token: receivedToken, ...userData } = res.data.data;
      localStorage.setItem('lovebyte_admin_token', receivedToken);
      setToken(receivedToken);
      setAdmin(userData);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('lovebyte_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

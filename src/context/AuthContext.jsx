import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await getMe();
      if (response?.success) {
        console.log('Fetched User Data:', response.user);
        setUser(response.user);
      }
    } catch (error) {
      // Handle timeout/network errors gracefully
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || !error.response) {
        // Network/timeout error - don't remove token, might be temporary
        // Silently continue without user session - app will work fine
        // No need to log - this is expected when backend is sleeping/unavailable
      } else if (error.response?.status === 401) {
        // Unauthorized - token is invalid, remove it
        console.warn('User session expired or invalid token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        // Other errors - only log in development
        if (import.meta.env.DEV) {
          console.error('Failed to fetch user:', error);
        }
      }
    } finally {
      // Always set loading to false, even on error
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      // Set loading to false immediately if no token
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

